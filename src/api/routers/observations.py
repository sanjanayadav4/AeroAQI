"""
Air quality observation endpoints.

Prototype mode:
- Air-quality data comes from the local Delhi-NCR demo dataset.
- 79 stations are served from src/demo/demo_stations.py.
- Real DB/Open-Meteo ingestion remains available for future production use.

Endpoints
---------
GET /observations
GET /observations/latest
GET /observations/{station_id}
"""

from __future__ import annotations

from datetime import datetime, timedelta, timezone
from typing import Optional

from fastapi import APIRouter, HTTPException, Query

from src.api.schemas import AQIObservation, ObservationsResponse
from src.demo.demo_stations import get_demo_stations, get_demo_station
from src.utils.logger import get_logger

log = get_logger(__name__)

router = APIRouter(prefix="/observations", tags=["Air Quality"])

_MAX_LIMIT = 1000
_DEFAULT_HOURS = 24


def _demo_to_observation(station: dict, timestamp: Optional[datetime] = None) -> dict:
    """
    Convert one demo station reading into the API observation format.
    """

    ts = timestamp or datetime.now(timezone.utc)

    return {
        "timestamp_utc": ts,
        "station_id": station["station_id"],
        "station_name": station["name"],
        "latitude": station["latitude"],
        "longitude": station["longitude"],
        "data_source": "Prototype Simulation",

        "pm25": station.get("pm25"),
        "pm10": station.get("pm10"),
        "o3": station.get("o3"),
        "no2": station.get("no2"),
        "so2": station.get("so2"),
        "co": station.get("co"),

        "aqi_raw": station.get("aqi"),
        "aqi_computed": station.get("aqi"),

    }


def _make_demo_records(
    stations: list[dict],
    start_dt: datetime,
    end_dt: datetime,
) -> list[AQIObservation]:
    """
    Create prototype observation records.

    Each station currently has one representative reading.
    """

    now = datetime.now(timezone.utc)

    # Keep timestamp inside requested window.
    timestamp = min(max(now, start_dt), end_dt)

    records = []

    for station in stations:
        row = _demo_to_observation(
            station,
            timestamp=timestamp,
        )

        records.append(
            AQIObservation.from_db_row(row)
        )

    return records


@router.get(
    "",
    response_model=ObservationsResponse,
    summary="List air quality observations",
    description=(
        "Returns prototype air-quality observations for the "
        "79 Delhi-NCR stations from the local simulation dataset."
    ),
)
def list_observations(
    station_id: Optional[str] = Query(
        None,
        description="Filter to a specific station ID, e.g. 'DEL_ITO'",
    ),
    start_time: Optional[str] = Query(
        None,
        description="UTC start datetime (ISO 8601)",
    ),
    end_time: Optional[str] = Query(
        None,
        description="UTC end datetime (ISO 8601)",
    ),
    hours: Optional[int] = Query(
        None,
        ge=1,
        le=720,
        description="Look-back window in hours. Default 24.",
    ),
    limit: int = Query(
        200,
        ge=1,
        le=_MAX_LIMIT,
        description=f"Maximum rows to return (max {_MAX_LIMIT}).",
    ),
) -> ObservationsResponse:

    start_dt, end_dt = _resolve_time_range(
        start_time,
        end_time,
        hours or _DEFAULT_HOURS,
    )

    stations = get_demo_stations()

    if station_id:
      stations = [
        s
        for s in stations
        if s["station_id"].upper() == station_id.upper()
    ]

    if len(stations) == 0:
        return ObservationsResponse(
            count=0,
            station_id=station_id,
            start_time=start_dt.isoformat(),
            end_time=end_dt.isoformat(),
            observations=[],
        )

    records = _make_demo_records(
        stations,
        start_dt,
        end_dt,
    )

    records = records[:limit]

    return ObservationsResponse(
        count=len(records),
        station_id=station_id,
        start_time=start_dt.isoformat(),
        end_time=end_dt.isoformat(),
        observations=records,
    )


@router.get(
    "/latest",
    response_model=ObservationsResponse,
    summary="Latest AQI reading per station",
    description=(
        "Returns the latest simulated air-quality reading "
        "for all 79 Delhi-NCR stations."
    ),
)
def latest_observations() -> ObservationsResponse:

    stations = get_demo_stations()

    end_dt = datetime.now(timezone.utc)
    start_dt = end_dt - timedelta(hours=1)

    records = _make_demo_records(
        stations,
        start_dt,
        end_dt,
    )

    return ObservationsResponse(
        count=len(records),
        observations=records,
    )


@router.get(
    "/{station_id}",
    response_model=ObservationsResponse,
    summary="Air quality history for one station",
    description=(
        "Returns the prototype air-quality reading "
        "for a specific Delhi-NCR station."
    ),
)
def station_observations(
    station_id: str,
    start_time: Optional[str] = Query(
        None,
        description="UTC start (ISO 8601)",
    ),
    end_time: Optional[str] = Query(
        None,
        description="UTC end (ISO 8601)",
    ),
    hours: Optional[int] = Query(
        None,
        ge=1,
        le=720,
        description="Look-back window in hours. Default 24.",
    ),
    limit: int = Query(
        200,
        ge=1,
        le=_MAX_LIMIT,
    ),
) -> ObservationsResponse:

    start_dt, end_dt = _resolve_time_range(
        start_time,
        end_time,
        hours or _DEFAULT_HOURS,
    )

    station = get_demo_station(station_id)

    if station is None:
        raise HTTPException(
            status_code=404,
            detail=(
                f"Station '{station_id}' not found. "
                "Use GET /stations for valid IDs."
            ),
        )

    records = _make_demo_records(
        [station],
        start_dt,
        end_dt,
    )

    records = records[:limit]

    return ObservationsResponse(
        count=len(records),
        station_id=station["station_id"],
        start_time=start_dt.isoformat(),
        end_time=end_dt.isoformat(),
        observations=records,
    )


def _resolve_time_range(
    start_str: Optional[str],
    end_str: Optional[str],
    default_lookback_hours: int,
) -> tuple[datetime, datetime]:
    """Parse optional ISO strings; fall back to now - N hours."""

    now = datetime.now(timezone.utc)

    try:
        if end_str:
            end_dt = datetime.fromisoformat(end_str)

            if end_dt.tzinfo is None:
                end_dt = end_dt.replace(tzinfo=timezone.utc)
            else:
                end_dt = end_dt.astimezone(timezone.utc)
        else:
            end_dt = now

        if start_str:
            start_dt = datetime.fromisoformat(start_str)

            if start_dt.tzinfo is None:
                start_dt = start_dt.replace(tzinfo=timezone.utc)
            else:
                start_dt = start_dt.astimezone(timezone.utc)
        else:
            start_dt = end_dt - timedelta(
                hours=default_lookback_hours
            )

    except ValueError as exc:
        raise HTTPException(
            status_code=422,
            detail=(
                f"Invalid datetime format: {exc}. "
                "Use ISO 8601, e.g. "
                "'2026-09-12T00:00:00'."
            ),
        )

    if start_dt >= end_dt:
        raise HTTPException(
            status_code=422,
            detail="start_time must be earlier than end_time.",
        )

    return start_dt, end_dt