from pathlib import Path
import json


ROOT = Path(__file__).resolve().parents[1]

MAPPING_FILE = ROOT / "data" / "openaq_station_mapping.json"


# These are confirmed OpenAQ locations from the
# expanded OpenAQ NCR discovery result.
FIXES = {
    "DEL_SIRI_FORT": {
        "openaq_id": 5586,
        "openaq_name": "Sirifort, Delhi - CPCB",
        "provider": "CPCB",
        "is_monitor": True,
        "match_status": "VERIFIED",
        "match_method": "manual_verified_open_aq_location",
    },

    "UP_GREATER_NOIDA_KP5": {
        "openaq_id": 6986,
        "openaq_name": "Knowledge Park - V, Greater Noida - UPPCB",
        "provider": "CPCB",
        "is_monitor": True,
        "match_status": "VERIFIED",
        "match_method": "manual_verified_open_aq_location",
    },

    "UP_NOIDA_SEC125": {
        "openaq_id": 5598,
        "openaq_name": "Sector - 125, Noida, UP - UPPCB",
        "provider": "CPCB",
        "is_monitor": True,
        "match_status": "VERIFIED",
        "match_method": "manual_verified_open_aq_location",
    },

    "UP_NOIDA_SEC62": {
        "openaq_id": 5616,
        "openaq_name": "Sector - 62, Noida, UP - IMD",
        "provider": "CPCB",
        "is_monitor": True,
        "match_status": "VERIFIED",
        "match_method": "manual_verified_open_aq_location",
    },
}


def main():

    print("=" * 70)
    print("AeroAQI — Fixing 5 Verified OpenAQ Matches")
    print("=" * 70)

    if not MAPPING_FILE.exists():
        raise FileNotFoundError(MAPPING_FILE)

    with MAPPING_FILE.open(
        "r",
        encoding="utf-8",
    ) as f:
        mappings = json.load(f)

    if len(mappings) != 79:
        raise RuntimeError(
            f"Expected 79 mappings, found {len(mappings)}"
        )

    changed = 0

    for item in mappings:

        station_id = item["station_id"]

        if station_id not in FIXES:
            continue

        fix = FIXES[station_id]

        print()
        print(f"🔧 Fixing: {station_id}")
        print(f"   Old ID : {item.get('openaq_id')}")
        print(f"   New ID : {fix['openaq_id']}")
        print(f"   Source : {fix['openaq_name']}")

        item["openaq_id"] = fix["openaq_id"]
        item["openaq_name"] = fix["openaq_name"]
        item["provider"] = fix["provider"]
        item["is_monitor"] = fix["is_monitor"]
        item["match_status"] = fix["match_status"]
        item["match_method"] = fix["match_method"]

        changed += 1

    with MAPPING_FILE.open(
        "w",
        encoding="utf-8",
    ) as f:
        json.dump(
            mappings,
            f,
            indent=2,
            ensure_ascii=False,
        )

    print()
    print("=" * 70)
    print(f"✅ Fixed stations: {changed}/5")
    print(f"📄 Saved: {MAPPING_FILE}")
    print("=" * 70)


if __name__ == "__main__":
    main()