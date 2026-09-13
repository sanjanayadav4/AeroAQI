"""
Seed 72-hour Delhi-NCR prototype forecasts.

Prototype only:
- No external API
- No real-time WRF-Chem execution
- Forecast values are generated from the local demo station data.
"""

from __future__ import annotations

import json
from datetime import datetime, timedelta, timezone

import pandas as pd

from src.demo.demo_stations import get_demo_stations
from src.storage.db_client import DBClient


def aqi_category(aqi: float) -> str:
    if aqi <= 50:
        return "Good"
    if aqi <= 100:
        return "Satisfactory"
    if aqi <= 200:
        return "Moderate"
    if aqi <= 300:
        return "Poor"
    if aqi <= 400:
        return "Very Poor"
    return "Severe"


def build_demo_forecasts() -> pd.DataFrame:
    stations = get_demo_stations()

    generated_at = datetime.now(timezone.utc).replace(
        minute=0,
        second=0,
        microsecond=0,
    )

    rows = []

    for station in stations:

        base_pm25 = float(station["pm25"])
        base_pm10 = float(station["pm10"])
        base_o3 = float(station["o3"])
        base_no2 = float(station["no2"])
        base_aqi = float(station["aqi"])

        for hour in range(1, 73):

            # Smooth deterministic variation across the 72-hour horizon.
            cycle = ((hour - 1) % 24) / 23.0
            wave = 0.92 + 0.16 * cycle

            pm25 = round(base_pm25 * wave, 1)
            pm10 = round(base_pm10 * wave, 1)
            o3 = round(base_o3 * (1.08 - 0.16 * cycle), 1)
            no2 = round(base_no2 * wave, 1)

            # PM2.5 is the dominant AQI driver in this prototype.
            aqi = round(
                max(
                    pm25 * 1.35,
                    o3 * 1.15,
                    no2 * 1.10,
                )
            )

            # Keep forecast AQI in a realistic display range.
            aqi = float(max(20, min(500, aqi)))

            target_utc = generated_at + timedelta(hours=hour)

            top_features = [
                {
                    "rank": 1,
                    "name": "pm25",
                    "label": "PM2.5 concentration",
                    "shap_value": round(pm25 / 100, 3),
                    "contribution_pct": 42.0,
                },
                {
                    "rank": 2,
                    "name": "pbl_height",
                    "label": "Planetary Boundary Layer",
                    "shap_value": round(
                        max(0.1, 500 - station["pbl_height"]) / 500,
                        3,
                    ),
                    "contribution_pct": 24.0,
                },
                {
                    "rank": 3,
                    "name": "inversion_strength",
                    "label": "Atmospheric inversion",
                    "shap_value": round(
                        float(station["inversion_strength"]),
                        3,
                    ),
                    "contribution_pct": 19.0,
                },
                {
                    "rank": 4,
                    "name": "wind_speed",
                    "label": "Wind speed",
                    "shap_value": round(
                        1 / max(float(station["wind_speed"]), 0.5),
                        3,
                    ),
                    "contribution_pct": 15.0,
                },
            ]

            rows.append(
                {
                    "generated_at": generated_at,
                    "station_id": station["station_id"],
                    "forecast_hour": hour,
                    "target_utc": target_utc,
                    "pm25": pm25,
                    "pm10": pm10,
                    "o3": o3,
                    "no2": no2,
                    "aqi_computed": aqi,
                    "aqi_category": aqi_category(aqi),
                    "top_features": json.dumps(top_features),
                    "explanation_text": (
                        "PM2.5 is the primary contributor to the predicted AQI. "
                        "Low boundary-layer height and atmospheric inversion "
                        "reduce pollutant dispersion, while wind conditions "
                        "influence accumulation over Delhi-NCR."
                    ),
                    "model_version": "AeroAQI-Prototype-v1",
                }
            )

    return pd.DataFrame(rows)


def main() -> None:
    print("Creating 72-hour AeroAQI prototype forecasts...")

    df = build_demo_forecasts()

    print(f"Stations: {df['station_id'].nunique()}")
    print(f"Forecast rows prepared: {len(df)}")

    db = DBClient()

    inserted = db.write_forecasts(df)

    print(f"Forecast rows inserted: {inserted}")

    print("\nForecast seeding complete.")


if __name__ == "__main__":
    main()