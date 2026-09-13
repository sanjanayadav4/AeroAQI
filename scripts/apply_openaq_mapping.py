from pathlib import Path
import json
import shutil
import yaml


ROOT = Path(__file__).resolve().parents[1]

STATIONS_FILE = ROOT / "config" / "stations.yaml"
MAPPING_FILE = ROOT / "data" / "openaq_station_mapping.json"

BACKUP_FILE = ROOT / "config" / "stations.yaml.before_openaq"


def main():

    print("=" * 75)
    print("AeroAQI — Applying Verified OpenAQ Mapping")
    print("=" * 75)

    if not STATIONS_FILE.exists():
        raise FileNotFoundError(STATIONS_FILE)

    if not MAPPING_FILE.exists():
        raise FileNotFoundError(MAPPING_FILE)

    # --------------------------------------------------------
    # Backup
    # --------------------------------------------------------

    shutil.copy2(
        STATIONS_FILE,
        BACKUP_FILE,
    )

    print(f"✅ Backup created:")
    print(f"   {BACKUP_FILE}")

    # --------------------------------------------------------
    # Load files
    # --------------------------------------------------------

    with STATIONS_FILE.open(
        "r",
        encoding="utf-8",
    ) as f:
        config = yaml.safe_load(f)

    with MAPPING_FILE.open(
        "r",
        encoding="utf-8",
    ) as f:
        mappings = json.load(f)

    stations = config.get("stations", [])

    if len(stations) != 79:
        raise RuntimeError(
            f"Expected 79 stations, found {len(stations)}"
        )

    if len(mappings) != 79:
        raise RuntimeError(
            f"Expected 79 mappings, found {len(mappings)}"
        )

    mapping_by_id = {
        item["station_id"]: item
        for item in mappings
    }

    verified = 0
    review = 0
    unmatched = 0

    # --------------------------------------------------------
    # Apply
    # --------------------------------------------------------

    for station in stations:

        station_id = station["station_id"]

        mapping = mapping_by_id.get(station_id)

        if mapping is None:
            raise RuntimeError(
                f"No mapping found for {station_id}"
            )

        status = mapping["match_status"]

        if status == "VERIFIED":

            station["openaq_id"] = mapping["openaq_id"]

            verified += 1

        elif status == "REVIEW":

            station["openaq_id"] = None

            review += 1

        else:

            station["openaq_id"] = None

            unmatched += 1

    # --------------------------------------------------------
    # Write YAML
    # --------------------------------------------------------

    with STATIONS_FILE.open(
        "w",
        encoding="utf-8",
    ) as f:

        yaml.safe_dump(
            config,
            f,
            sort_keys=False,
            allow_unicode=True,
            default_flow_style=False,
        )

    print()
    print("=" * 75)
    print("FINAL STATION CONFIG")
    print("=" * 75)

    print(f"Total stations : {len(stations)}")
    print(f"Verified       : {verified}")
    print(f"Review         : {review}")
    print(f"No OpenAQ     : {unmatched}")

    print()
    print("Examples:")

    for station_id in [
        "DEL_ANAND_VIHAR",
        "DEL_ITO",
        "DEL_SIRI_FORT",
        "UP_NOIDA_SEC125",
        "UP_NOIDA_SEC62",
        "DEL_PITAMPURA",
    ]:

        station = next(
            (
                s
                for s in stations
                if s["station_id"] == station_id
            ),
            None,
        )

        if station:
            print(
                f"  {station_id:<25} "
                f"OpenAQ ID = {station.get('openaq_id')}"
            )

    print()
    print(f"✅ Updated:")
    print(f"   {STATIONS_FILE}")

    print()
    print("🎯 OpenAQ mapping applied successfully.")


if __name__ == "__main__":
    main()