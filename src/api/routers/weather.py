"""
src/api/routers/weather.py
===========================
Weather and atmospheric profile endpoints.

Returns meteorological variables and derived atmospheric features
(PBL height, inversion flag, temperature profile) from the observations
table — all sourced from Open-Meteo or ERA5.

When the database is empty (no ingestion run yet), a deterministic
prototype simulation is returned so the frontend always gets valid JSON.

Endpoints
---------
GET /weather                   — weather readings for all stations
GET /weather/latest            — most recent weather reading per station
GET /weather/{station_id}      — weather history for one station
"""

from __future__ import annotations

import math
import random
from datetime import datetime, timedelta, timezone
from typing import Optional

import pandas as pd
from fastapi import APIRouter, HTTPException, Query

from src.api.dependencies import DbDep
from src.api.schemas import WeatherObservation, WeatherResponse
from src.api.routers.observations import _resolve_time_range
from src.utils.logger import get_logger

log = get_logger(__name__)
router = APIRouter(prefix="/weather", tags=["Weather"])

_WX_COLS = [
    "timestamp_utc", "station_id", "station_name",
    "latitude", "longitude", "data_source",
    "temperature", "relative_humidity",
    "wind_speed", "wind_direction",
    "surface_pressure", "precipitation",
    "solar_radiation", "pbl_height",
    "temp_925hpa", "temp_850hpa", "temp_700hpa",
    "inversion_flag", "inversion_strength",
    "temperature_profile", "mixing_volume_idx",
]
_MAX_LIMIT = 1000
_DEFAULT_HOURS = 24


# ---------------------------------------------------------------------------
# Demo weather simulation
# ---------------------------------------------------------------------------
# Generates realistic, fully-valid (no NaN, no Infinity) hourly weather rows
# for Delhi NCR when the database has no real observations yet.
# Uses a deterministic RNG seeded on the timestamp so values are repeatable.

_DEMO_STATION_ID   = "DEL_LODHI_ROAD"
_DEMO_STATION_NAME = "Lodhi Road (Demo)"
_DEMO_LAT          = 28.5918
_DEMO_LON          = 77.2273


def _demo_weather_row(dt_utc: datetime) -> dict:
    """Return one realistic weather dict for a given UTC hour."""
    # Seed on hour-truncated epoch so values are stable across requests
    epoch_h = int(dt_utc.replace(minute=0, second=0, microsecond=0).timestamp()) // 3600
    rng = random.Random(f"aeroaqi-weather:{epoch_h}")

    # Diurnal temperature: peaks ~15:30 IST (10:00 UTC), trough ~04:00 IST (22:30 UTC-1)
    hour_ist = (dt_utc.hour + 5) % 24  # approximate IST hour (ignoring 30-min offset)
    temp_base = 28.0 + 7.0 * math.sin(math.pi * (hour_ist - 6) / 12)
    temperature = round(temp_base + rng.uniform(-1.5, 1.5), 1)

    # Humidity inversely correlated with temperature
    humidity = round(max(20.0, min(95.0, 78.0 - (temperature - 20.0) * 1.1 + rng.uniform(-4, 4))), 1)

    # Wind stronger during day
    wind_speed = round(max(0.3, 1.8 + 1.4 * math.sin(math.pi * hour_ist / 12) + rng.uniform(-0.5, 0.5)), 1)
    wind_dir   = round(rng.uniform(220, 340), 0)   # mostly WNW/NW — typical Delhi winter

    pressure   = round(rng.uniform(1008.0, 1016.0), 1)
    precip     = 0.0
    solar      = round(max(0.0, 650.0 * math.sin(math.pi * (hour_ist - 6) / 12) + rng.uniform(-30, 30)), 1)

    # PBL: deep during afternoon, shallow at night (inversion-prone)
    pbl_height = round(max(120.0, 800.0 + 700.0 * math.sin(math.pi * (hour_ist - 6) / 12) + rng.uniform(-80, 80)), 0)

    # Upper-level temps (lapse rate ~6.5 °C/km)
    temp_925 = round(temperature - 3.2 + rng.uniform(-0.5, 0.5), 1)
    temp_850 = round(temperature - 7.1 + rng.uniform(-0.5, 0.5), 1)
    temp_700 = round(temperature - 14.8 + rng.uniform(-0.8, 0.8), 1)

    inv_strength = round(max(0.0, (temp_925 - temperature) + rng.uniform(-0.2, 0.2)), 2)
    inv_flag     = bool(inv_strength > 0.5 and pbl_height < 400)

    mixing_idx   = round(pbl_height * wind_speed, 0)

    return {
        "timestamp_utc":      dt_utc.replace(microsecond=0).isoformat(),
        "station_id":         _DEMO_STATION_ID,
        "station_name":       _DEMO_STATION_NAME,
        "latitude":           _DEMO_LAT,
        "longitude":          _DEMO_LON,
        "data_source":        "AeroAQI demo simulation",
        "temperature":        temperature,
        "relative_humidity":  humidity,
        "wind_speed":         wind_speed,
        "wind_direction":     wind_dir,
        "surface_pressure":   pressure,
        "precipitation":      precip,
        "solar_radiation":    solar,
        "pbl_height":         pbl_height,
        "temp_925hpa":        temp_925,
        "temp_850hpa":        temp_850,
        "temp_700hpa":        temp_700,
        "inversion_flag":     inv_flag,
        "inversion_strength": inv_strength,
        "temperature_profile": None,
        "mixing_volume_idx":  mixing_idx,
    }


def _demo_weather_observations(hours: int, limit: int) -> list[WeatherObservation]:
    """Generate `hours` hourly demo weather rows, newest last, capped at limit."""
    now   = datetime.now(timezone.utc).replace(minute=0, second=0, microsecond=0)
    count = min(hours, limit, _MAX_LIMIT)
    obs   = []
    for h in range(count - 1, -1, -1):
        dt = now - timedelta(hours=h)
        row = _demo_weather_row(dt)
        obs.append(WeatherObservation(**row))
    return obs


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------

@router.get(
    "",
    response_model=WeatherResponse,
    summary="Weather observations for all stations",
    description=(
        "Returns hourly meteorological readings including temperature, "
        "humidity, wind, PBL height, and atmospheric profile data. "
        "Defaults to the last 24 hours. "
        "Falls back to demo simulation when the database is empty."
    ),
)
def list_weather(
    db: DbDep,
    station_id: Optional[str] = Query(None, description="Filter to a specific station"),
    start_time: Optional[str] = Query(None, description="UTC start (ISO 8601)"),
    end_time: Optional[str] = Query(None, description="UTC end (ISO 8601)"),
    hours: Optional[int] = Query(None, ge=1, le=720, description="Look-back hours (default 24)"),
    limit: int = Query(500, ge=1, le=_MAX_LIMIT),
) -> WeatherResponse:
    effective_hours = hours or _DEFAULT_HOURS
    start_dt, end_dt = _resolve_time_range(start_time, end_time, effective_hours)

    try:
        df = db.read_observations(
            station_id=station_id,
            start_time=start_dt,
            end_time=end_dt,
        )
    except Exception as exc:
        log.warning(f"/weather DB read failed, using demo: {exc}")
        df = pd.DataFrame()

    if df.empty:
        # DB is empty or query failed — return deterministic demo weather
        demo_obs = _demo_weather_observations(effective_hours, limit)
        return WeatherResponse(count=len(demo_obs), station_id=station_id, observations=demo_obs)

    if len(df) > limit:
        df = df.tail(limit)

    # Filter to rows that actually have weather data (temperature not null).
    # The observations table is shared with AQ data; rows without weather columns
    # have NaN for all weather fields and should not be returned as weather records.
    WX_KEY = "temperature"
    import math as _math
    def _has_weather(row: dict) -> bool:
        v = row.get(WX_KEY)
        return v is not None and not (isinstance(v, float) and _math.isnan(v))

    records = []
    for row in df.to_dict(orient="records"):
        if not _has_weather(row):
            continue
        try:
            records.append(WeatherObservation.from_db_row(row))
        except Exception as exc:
            log.debug(f"Skipping malformed weather row: {exc}")

    if not records:
        # DB rows exist but none have valid weather columns — use demo simulation
        log.info("/weather: DB rows present but all weather columns null, using demo simulation")
        demo_obs = _demo_weather_observations(effective_hours, limit)
        return WeatherResponse(count=len(demo_obs), station_id=station_id, observations=demo_obs)

    return WeatherResponse(count=len(records), station_id=station_id, observations=records)


@router.get(
    "/latest",
    response_model=WeatherResponse,
    summary="Most recent weather reading per station",
    description=(
        "Returns the single most recent weather observation for each station. "
        "Falls back to demo simulation when the database is empty."
    ),
)
def latest_weather(db: DbDep) -> WeatherResponse:
    try:
        end_dt   = datetime.now(timezone.utc)
        start_dt = end_dt - timedelta(hours=48)
        df = db.read_observations(start_time=start_dt, end_time=end_dt)
    except Exception as exc:
        log.warning(f"/weather/latest DB read failed, using demo: {exc}")
        df = pd.DataFrame()

    if df.empty:
        demo_obs = _demo_weather_observations(1, 1)
        return WeatherResponse(count=len(demo_obs), observations=demo_obs)

    df["timestamp_utc"] = pd.to_datetime(df["timestamp_utc"], utc=True, errors="coerce")
    df = df.dropna(subset=["timestamp_utc"])
    latest = df.sort_values("timestamp_utc").groupby("station_id").tail(1)

    import math as _math
    records = []
    for row in latest.to_dict(orient="records"):
        v = row.get("temperature")
        if v is None or (isinstance(v, float) and _math.isnan(v)):
            continue
        try:
            records.append(WeatherObservation.from_db_row(row))
        except Exception as exc:
            log.debug(f"Skipping malformed weather/latest row: {exc}")

    if not records:
        demo_obs = _demo_weather_observations(1, 1)
        return WeatherResponse(count=len(demo_obs), observations=demo_obs)
    return WeatherResponse(count=len(records), observations=records)


@router.get(
    "/{station_id}",
    response_model=WeatherResponse,
    summary="Weather history for one station",
    description=(
        "Returns hourly weather data for a specific station. "
        "Defaults to the last 24 hours. Returns 404 for unknown station IDs."
    ),
)
def station_weather(
    station_id: str,
    db: DbDep,
    start_time: Optional[str] = Query(None),
    end_time: Optional[str] = Query(None),
    hours: Optional[int] = Query(None, ge=1, le=720),
    limit: int = Query(200, ge=1, le=_MAX_LIMIT),
) -> WeatherResponse:
    effective_hours = hours or _DEFAULT_HOURS
    start_dt, end_dt = _resolve_time_range(start_time, end_time, effective_hours)

    try:
        df = db.read_observations(
            station_id=station_id,
            start_time=start_dt,
            end_time=end_dt,
        )
    except Exception as exc:
        log.warning(f"/weather/{station_id} DB read failed, using demo: {exc}")
        df = pd.DataFrame()

    if df.empty:
        from src.utils.config_loader import load_stations
        known = {s["station_id"] for s in load_stations()}
        if station_id not in known:
            raise HTTPException(
                status_code=404,
                detail=f"Station '{station_id}' not found.",
            )
        demo_obs = _demo_weather_observations(effective_hours, limit)
        return WeatherResponse(count=len(demo_obs), station_id=station_id, observations=demo_obs)

    if len(df) > limit:
        df = df.tail(limit)

    import math as _math
    def _has_wx(row: dict) -> bool:
        v = row.get("temperature")
        return v is not None and not (isinstance(v, float) and _math.isnan(v))

    records = []
    for row in df.to_dict(orient="records"):
        if not _has_wx(row):
            continue
        try:
            records.append(WeatherObservation.from_db_row(row))
        except Exception as exc:
            log.debug(f"Skipping malformed weather row for {station_id}: {exc}")

    if not records:
        demo_obs = _demo_weather_observations(effective_hours, limit)
        return WeatherResponse(count=len(demo_obs), station_id=station_id, observations=demo_obs)

    return WeatherResponse(count=len(records), station_id=station_id, observations=records)
