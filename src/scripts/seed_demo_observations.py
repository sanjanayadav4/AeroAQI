"""
Seed local Delhi-NCR prototype observations into the AeroAQI SQLite database.

This is demo/prototype data only.
No external AQI API is used.
"""

from __future__ import annotations

from datetime import datetime, timedelta, timezone

import pandas as pd

from src.demo.demo_stations import get_demo_stations
from src.storage.db_client import DBClient


def build_demo_observations() -> pd.DataFrame:
    """Create 24 hourly observations for every demo station."""

    stations = get_demo_stations()

    now = datetime.now(timezone.utc).replace(
        minute=0,
        second=0,
        microsecond=0,
    )

    rows = []

    for station in stations:

        for hour in range(24):

            timestamp = now - timedelta(hours=23 - hour)

            rows.append(
                {
                    "timestamp_utc": timestamp,
                    "station_id": station["station_id"],
                    "station_name": station["name"],
                    "latitude": station["latitude"],
                    "longitude": station["longitude"],
                    "data_source": "Prototype Simulation",

                    # Air quality
                    "pm25": station["pm25"],
                    "pm10": station["pm10"],
                    "o3": station["o3"],
                    "no2": station["no2"],
                    "so2": 8.0,
                    "co": 0.8,
                    "aqi_raw": station["aqi"],
                    "aqi_computed": station["aqi"],

                    # Weather
                    "temperature": station["temperature"],
                    "relative_humidity": station["humidity"],
                    "wind_speed": station["wind_speed"],
                    "wind_direction": station["wind_direction"],
                    "surface_pressure": 1012.0,
                    "precipitation": 0.0,
                    "solar_radiation": 120.0,
                    "pbl_height": station["pbl_height"],

                    # Atmospheric profile
                    "temp_925hpa": station["temperature"] - 1.0,
                    "temp_850hpa": station["temperature"] - 3.0,
                    "temp_700hpa": station["temperature"] - 7.0,

                    # Fire / transport
                    "fire_count_300km": 8.0 if station["fire_risk"] > 0.3 else 3.0,
                    "fire_count_500km": 15.0 if station["fire_risk"] > 0.3 else 7.0,
                    "total_frp_300km": station["fire_risk"] * 100.0,
                    "fire_distance_km": 80.0,
                    "fire_nearest_frp": station["fire_risk"] * 50.0,
                    "fire_transport_risk": station["fire_risk"],

                    # Inversion / derived features
                    "inversion_flag": station["inversion_flag"],
                    "inversion_strength": station["inversion_strength"],
                    "temperature_profile": (
                        '{"925hPa": %.1f, "850hPa": %.1f, "700hPa": %.1f}'
                        % (
                            station["temperature"] - 1.0,
                            station["temperature"] - 3.0,
                            station["temperature"] - 7.0,
                        )
                    ),
                    "wind_transport_idx": station["wind_speed"],
                    "mixing_volume_idx": station["pbl_height"],
                }
            )

    return pd.DataFrame(rows)


def main() -> None:
    print("Creating AeroAQI prototype observations...")

    df = build_demo_observations()

    print(f"Stations: {df['station_id'].nunique()}")
    print(f"Rows prepared: {len(df)}")

    db = DBClient()

    inserted = db.write_observations(df)

    print(f"Rows inserted: {inserted}")

    check = db.read_observations()

    print(f"Rows currently in database: {len(check)}")

    if not check.empty:
        print("\nSample observation:")
        print(
            check[
                [
                    "station_id",
                    "timestamp_utc",
                    "pm25",
                    "o3",
                    "pm10",
                    "no2",
                    "aqi_computed",
                ]
            ].tail(1).to_string(index=False)
        )

    print("\nDemo observation seeding complete.")


if __name__ == "__main__":
    main()