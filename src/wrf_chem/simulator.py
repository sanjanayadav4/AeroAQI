from __future__ import annotations

from datetime import datetime, timedelta, timezone
import math
import random


def generate_wrf_chem_forecast(
    station_id: str,
    latitude: float | None = None,
    longitude: float | None = None,
    hours: int = 72,
) -> dict:
    """
    Prototype WRF-Chem atmospheric chemistry output.

    This is simulated/preprocessed demo data for AeroAQI.
    It does NOT execute the actual WRF-Chem model.
    """

    seed = sum(ord(c) for c in station_id)
    rng = random.Random(seed)

    start = datetime.now(timezone.utc).replace(
        minute=0,
        second=0,
        microsecond=0,
    )

    forecast = []

    base_pm25 = rng.uniform(35.0, 85.0)
    base_pm10 = base_pm25 * rng.uniform(1.35, 1.75)
    base_o3 = rng.uniform(25.0, 65.0)
    base_no2 = rng.uniform(15.0, 45.0)

    for hour in range(hours):
        timestamp = start + timedelta(hours=hour)

        daily_cycle = math.sin((hour % 24) / 24 * 2 * math.pi)

        temperature = (
            24.0
            + 7.0 * daily_cycle
            + rng.uniform(-1.5, 1.5)
        )

        wind_speed = max(
            0.5,
            3.0
            + 1.5 * math.sin(hour / 8)
            + rng.uniform(-0.5, 0.5),
        )

        boundary_layer_height = max(
            120.0,
            700.0
            + 450.0 * max(0.0, daily_cycle)
            + rng.uniform(-80.0, 80.0),
        )

        stagnation_factor = max(
            0.65,
            min(1.65, 900.0 / boundary_layer_height),
        )

        pm25 = max(
            5.0,
            base_pm25
            * stagnation_factor
            * (1.0 + 0.18 * math.sin(hour / 10))
            + rng.uniform(-4.0, 4.0),
        )

        pm10 = max(
            pm25,
            base_pm10
            * stagnation_factor
            * (1.0 + 0.12 * math.sin(hour / 9))
            + rng.uniform(-6.0, 6.0),
        )

        o3 = max(
            5.0,
            base_o3
            * (1.0 + 0.35 * max(0.0, daily_cycle))
            + rng.uniform(-5.0, 5.0),
        )

        no2 = max(
            3.0,
            base_no2
            * stagnation_factor
            + rng.uniform(-3.0, 3.0),
        )

        aqi = max(
            pm25 * 1.6,
            pm10 * 0.65,
            o3 * 0.9,
            no2 * 1.1,
        )

        if aqi <= 50:
            category = "Good"
        elif aqi <= 100:
            category = "Satisfactory"
        elif aqi <= 200:
            category = "Moderate"
        elif aqi <= 300:
            category = "Poor"
        elif aqi <= 400:
            category = "Very Poor"
        else:
            category = "Severe"

        inversion_flag = boundary_layer_height < 350.0

        forecast.append(
            {
                "timestamp_utc": timestamp.isoformat(),
                "pm25": round(pm25, 2),
                "pm10": round(pm10, 2),
                "o3": round(o3, 2),
                "no2": round(no2, 2),
                "temperature_c": round(temperature, 2),
                "wind_speed_ms": round(wind_speed, 2),
                "boundary_layer_height_m": round(
                    boundary_layer_height,
                    2,
                ),
                "inversion_flag": inversion_flag,
                "aqi": round(aqi, 2),
                "aqi_category": category,
            }
        )

    return {
        "station_id": station_id,
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "model": "WRF-Chem",
        "mode": "preprocessed_simulation",
        "model_status": "simulated",
        "latitude": latitude,
        "longitude": longitude,
        "forecast_hours": hours,
        "forecast": forecast,
    }