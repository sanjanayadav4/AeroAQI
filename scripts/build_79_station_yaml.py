import sys
import yaml
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from src.demo.demo_stations import get_demo_stations


OUTPUT = ROOT / "config" / "stations.yaml"


def main():
    stations = get_demo_stations()

    print("=" * 70)
    print("AeroAQI — Building 79 NCR Station Master List")
    print("=" * 70)

    print(f"Stations received: {len(stations)}")

    if len(stations) != 79:
        raise RuntimeError(
            f"Expected 79 stations, but demo_stations.py returned "
            f"{len(stations)} stations."
        )

    output_stations = []

    for station in stations:
        station_id = (
            station.get("station_id")
            or station.get("id")
            or station.get("code")
        )

        name = station.get("name", station_id)
        city = station.get("city", "")
        state = station.get("state", "")
        latitude = station.get("latitude", station.get("lat"))
        longitude = station.get("longitude", station.get("lon"))

        if not station_id:
            raise RuntimeError(f"Station without station_id: {station}")

        if latitude is None or longitude is None:
            raise RuntimeError(
                f"Station {station_id} has missing coordinates."
            )

        output_stations.append(
            {
                "station_id": str(station_id),
                "name": str(name),
                "city": str(city),
                "state": str(state),
                "latitude": float(latitude),
                "longitude": float(longitude),

                # IMPORTANT:
                # Real OpenAQ mapping will be filled in the NEXT step.
                "openaq_id": None,

                "agency": station.get("agency", ""),
                "zone": station.get("zone", ""),
                "active": bool(station.get("active", True)),
            }
        )

    # Sort by state, then city, then station name
    output_stations.sort(
        key=lambda x: (
            x["state"],
            x["city"],
            x["name"],
        )
    )

    config = {
        "stations": output_stations,

        "ncr_bounds": {
            "lat_min": 27.5,
            "lat_max": 29.5,
            "lon_min": 75.0,
            "lon_max": 78.5,
        },

        "fire_source_region": {
            "lat_min": 27.5,
            "lat_max": 33.0,
            "lon_min": 73.0,
            "lon_max": 80.0,
            "radius_km": [300, 500],
        },
    }

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)

    with OUTPUT.open("w", encoding="utf-8") as f:
        yaml.safe_dump(
            config,
            f,
            sort_keys=False,
            allow_unicode=True,
            default_flow_style=False,
        )

    print()
    print("✅ stations.yaml generated successfully")
    print(f"📍 Total stations: {len(output_stations)}")
    print(f"📄 Output: {OUTPUT}")

    print()
    print("State-wise coverage:")

    counts = {}
    for station in output_stations:
        state = station["state"]
        counts[state] = counts.get(state, 0) + 1

    for state, count in sorted(counts.items()):
        print(f"  {state}: {count}")

    print()
    print("OpenAQ IDs:")
    print("  Currently: 0 assigned")
    print("  Next step: verified OpenAQ mapping")
    print()
    print("🎯 Master station network is ready.")


if __name__ == "__main__":
    main()