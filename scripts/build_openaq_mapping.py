from __future__ import annotations

import json
import math
from pathlib import Path

import yaml


STATIONS_FILE = Path("config/stations.yaml")
OPENAQ_FILE = Path("data/openaq_ncr_locations.json")
OUTPUT_FILE = Path("data/openaq_station_mapping.json")


def distance_km(lat1, lon1, lat2, lon2):
    """Approximate great-circle distance in km."""
    r = 6371.0

    p1 = math.radians(lat1)
    p2 = math.radians(lat2)

    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)

    a = (
        math.sin(dlat / 2) ** 2
        + math.cos(p1) * math.cos(p2) * math.sin(dlon / 2) ** 2
    )

    return 2 * r * math.asin(math.sqrt(a))


def load_aeroaqi_stations():
    with open(STATIONS_FILE, "r", encoding="utf-8") as f:
        data = yaml.safe_load(f)

    if isinstance(data, dict):
        for key in ("stations", "data"):
            if isinstance(data.get(key), list):
                return data[key]

    if isinstance(data, list):
        return data

    raise ValueError("Could not find station list in stations.yaml")


def load_openaq_locations():
    with open(OPENAQ_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def score_location(location, station):
    coords = location.get("coordinates") or {}

    lat = coords.get("latitude")
    lon = coords.get("longitude")

    if lat is None or lon is None:
        return None

    distance = distance_km(
        float(station["latitude"]),
        float(station["longitude"]),
        float(lat),
        float(lon),
    )

    provider = str(
        (location.get("provider") or {}).get("name") or ""
    ).lower()

    monitor = bool(location.get("isMonitor"))

    # Prefer actual monitoring stations.
    score = distance

    if monitor:
        score -= 5

    # Prefer Indian government monitoring providers.
    if provider == "cpcb":
        score -= 10
    elif provider in {"caaqm", "dpcc", "hspcb", "uppcb", "rspcb"}:
        score -= 8

    return score, distance


def main():
    stations = load_aeroaqi_stations()
    locations = load_openaq_locations()

    print(f"AeroAQI stations: {len(stations)}")
    print(f"OpenAQ locations: {len(locations)}")
    print()

    mapping = []

    for station in stations:
        candidates = []

        for location in locations:
            result = score_location(location, station)

            if result is None:
                continue

            score, distance = result

            # Don't attach a completely unrelated OpenAQ location.
            if distance <= 25:
                candidates.append(
                    {
                        "score": score,
                        "distance_km": round(distance, 3),
                        "location": location,
                    }
                )

        candidates.sort(key=lambda x: x["score"])

        if not candidates:
            mapping.append(
                {
                    "station_id": station["station_id"],
                    "station_name": station.get("name"),
                    "latitude": station["latitude"],
                    "longitude": station["longitude"],
                    "openaq_id": None,
                    "openaq_name": None,
                    "provider": None,
                    "distance_km": None,
                    "status": "NO_MATCH",
                }
            )

            print(
                f"{station['station_id']} -> NO MATCH"
            )
            continue

        best = candidates[0]
        location = best["location"]

        provider = (
            location.get("provider") or {}
        ).get("name")

        mapping.append(
            {
                "station_id": station["station_id"],
                "station_name": station.get("name"),
                "latitude": station["latitude"],
                "longitude": station["longitude"],
                "openaq_id": location.get("id"),
                "openaq_name": location.get("name"),
                "provider": provider,
                "distance_km": best["distance_km"],
                "monitor": location.get("isMonitor"),
                "status": "MATCHED",
            }
        )

        print(
            f"{station['station_id']}"
            f" -> {location.get('id')}"
            f" | {location.get('name')}"
            f" | {provider}"
            f" | {best['distance_km']} km"
        )

    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(mapping, f, indent=2, ensure_ascii=False)

    matched = sum(
        1 for item in mapping
        if item["status"] == "MATCHED"
    )

    print()
    print("===================================")
    print("OpenAQ mapping complete")
    print(f"Matched: {matched}/{len(stations)}")
    print(f"Saved: {OUTPUT_FILE}")
    print("===================================")


if __name__ == "__main__":
    main()