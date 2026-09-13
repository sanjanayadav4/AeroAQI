from pathlib import Path
import json
import math
import re
import sys

import yaml


ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

STATIONS_FILE = ROOT / "config" / "stations.yaml"
OPENAQ_FILE = ROOT / "data" / "openaq_ncr_locations.json"
OUTPUT_FILE = ROOT / "data" / "openaq_station_mapping.json"


# ============================================================
# NAME NORMALIZATION
# ============================================================

def normalize_name(value):
    if not value:
        return ""

    text = str(value).lower().strip()

    replacements = {
        "r.k.": "rk",
        "r.k": "rk",
        "r k": "rk",
        "gurugram": "gurgaon",
        "sector-": "sector ",
        "sec-": "sector ",
        "sec ": "sector ",
        "phase-": "phase ",
        "ph-": "phase ",
        "new delhi": "delhi",
        "newdelhi": "delhi",
        "dwarka-sector": "dwarka sector",
        "dwarka sector": "dwarka sector",
        "greater noida": "greater noida",
        "md university": "md university",
        "nise gwal pahari": "nise gwal pahari",
    }

    for old, new in replacements.items():
        text = text.replace(old, new)

    text = re.sub(
        r"\b(cpcb|dpcc|hspcb|uppcb|rspcb|imd|iitm|caaqm|"
        r"pollution control board|new delhi)\b",
        " ",
        text,
    )

    text = re.sub(r"[^a-z0-9\s]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()

    return text


# ============================================================
# STATION-SPECIFIC ALIASES
#
# These are semantic aliases, not guessed coordinates.
# ============================================================

ALIASES = {
    "DEL_MUNDKA": [
        "mundka",
    ],
    "DEL_PITAMPURA": [
        "pitampura",
    ],
    "DEL_PUSA_IMD": [
        "pusa",
    ],
    "HR_BHIWANI": [
        "h b colony",
        "hb colony",
        "bhiwani",
    ],
    "HR_CHARKHI_DADRI": [
        "mini secretariat",
        "charkhi dadri",
    ],
    "HR_JIND": [
        "police lines",
        "jind",
    ],
    "HR_KARNAL": [
        "sector 12",
        "karnal",
    ],
    "HR_MANDIKHERA": [
        "general hospital",
        "mandikhera",
    ],
    "HR_NARNAUL": [
        "shastri nagar",
        "narnaul",
    ],
    "HR_PANIPAT": [
        "sector 18",
        "panipat",
    ],
    "HR_ROHTAK": [
        "md university",
        "rohtak",
    ],
    "RJ_ALWAR": [
        "moti doongri",
        "alwar",
    ],
    "RJ_BHIWADI": [
        "riico",
        "bhiwadi",
    ],
    "UP_BULANDSHAHR": [
        "yamunapuram",
        "bulandshahr",
    ],
    "UP_GREATER_NOIDA_KP5": [
        "knowledge park v",
        "knowledge park 5",
    ],
    "UP_MUZAFFARNAGAR": [
        "new mandi",
        "muzaffarnagar",
    ],
}


# ============================================================
# CITY / REGION HINTS
# ============================================================

CITY_HINTS = {
    "Delhi": ["delhi", "new delhi"],
    "Gurugram": ["gurugram", "gurgaon"],
    "Faridabad": ["faridabad"],
    "Ghaziabad": ["ghaziabad"],
    "Noida": ["noida"],
    "Greater Noida": ["greater noida"],
    "Bhiwani": ["bhiwani"],
    "Charkhi Dadri": ["charkhi dadri"],
    "Jind": ["jind"],
    "Karnal": ["karnal"],
    "Mandikhera": ["mandikhera"],
    "Narnaul": ["narnaul"],
    "Panipat": ["panipat"],
    "Rohtak": ["rohtak"],
    "Sonipat": ["sonipat"],
    "Palwal": ["palwal"],
    "Alwar": ["alwar"],
    "Bhiwadi": ["bhiwadi"],
    "Baghpat": ["baghpat"],
    "Bulandshahr": ["bulandshahr"],
    "Meerut": ["meerut"],
    "Muzaffarnagar": ["muzaffarnagar"],
    "Hapur": ["hapur"],
}


# ============================================================
# HAVERSINE
# ============================================================

def haversine_km(lat1, lon1, lat2, lon2):
    r = 6371.0

    p1 = math.radians(lat1)
    p2 = math.radians(lat2)

    dp = math.radians(lat2 - lat1)
    dl = math.radians(lon2 - lon1)

    a = (
        math.sin(dp / 2) ** 2
        + math.cos(p1)
        * math.cos(p2)
        * math.sin(dl / 2) ** 2
    )

    return 2 * r * math.asin(math.sqrt(a))


# ============================================================
# OPENAQ HELPERS
# ============================================================

def get_coordinates(location):
    coords = location.get("coordinates") or {}

    lat = coords.get("latitude")
    lon = coords.get("longitude")

    if lat is None or lon is None:
        return None, None

    return float(lat), float(lon)


def get_provider(location):
    provider = location.get("provider")

    if isinstance(provider, dict):
        return provider.get("name", "")

    return str(provider or "")


def get_owner(location):
    owner = location.get("owner")

    if isinstance(owner, dict):
        return owner.get("name", "")

    return str(owner or "")


# ============================================================
# TEXT TOKEN SCORE
# ============================================================

def text_score(a, b):
    a = normalize_name(a)
    b = normalize_name(b)

    if not a or not b:
        return 0

    if a == b:
        return 100

    if a in b or b in a:
        return 85

    a_tokens = set(a.split())
    b_tokens = set(b.split())

    if not a_tokens or not b_tokens:
        return 0

    overlap = len(a_tokens & b_tokens)

    if overlap == 0:
        return 0

    return int(
        100 * overlap / max(len(a_tokens), len(b_tokens))
    )


# ============================================================
# CITY SCORE
# ============================================================

def city_score(station, location):
    city = station.get("city", "")

    if not city:
        return 0

    openaq_text = " ".join(
        [
            str(location.get("name") or ""),
            get_provider(location),
            get_owner(location),
        ]
    ).lower()

    hints = CITY_HINTS.get(city, [city.lower()])

    for hint in hints:
        if hint.lower() in openaq_text:
            return 20

    return 0


# ============================================================
# PROVIDER SCORE
# ============================================================

def provider_score(location):
    text = (
        get_provider(location)
        + " "
        + get_owner(location)
        + " "
        + str(location.get("name") or "")
    ).lower()

    government = [
        "cpcb",
        "dpcc",
        "hspcb",
        "uppcb",
        "rspcb",
        "pollution control",
        "caaqm",
        "imd",
        "iitm",
    ]

    if any(x in text for x in government):
        return 20

    return 0


# ============================================================
# CANDIDATE SCORE
# ============================================================

def score_candidate(station, location):

    lat, lon = get_coordinates(location)

    if lat is None or lon is None:
        return None

    distance = haversine_km(
        station["latitude"],
        station["longitude"],
        lat,
        lon,
    )

    station_name = station["name"]
    openaq_name = location.get("name") or ""

    nscore = text_score(station_name, openaq_name)

    # Explicit alias score
    alias_score = 0

    aliases = ALIASES.get(
        station["station_id"],
        [],
    )

    normalized_open = normalize_name(openaq_name)

    for alias in aliases:
        alias_norm = normalize_name(alias)

        if alias_norm and alias_norm in normalized_open:
            alias_score = max(alias_score, 95)

    score = 0
    reasons = []

    # --------------------------------------------------------
    # NAME
    # --------------------------------------------------------

    best_name = max(nscore, alias_score)

    score += best_name

    if best_name >= 90:
        reasons.append("strong_name_match")
    elif best_name >= 60:
        reasons.append("partial_name_match")

    # --------------------------------------------------------
    # MONITOR
    # --------------------------------------------------------

    if location.get("isMonitor") is True:
        score += 25
        reasons.append("is_monitor")

    # --------------------------------------------------------
    # GOVERNMENT PROVIDER
    # --------------------------------------------------------

    pscore = provider_score(location)

    score += pscore

    if pscore:
        reasons.append("government_source")

    # --------------------------------------------------------
    # CITY
    # --------------------------------------------------------

    cscore = city_score(station, location)

    score += cscore

    if cscore:
        reasons.append("city_match")

    # --------------------------------------------------------
    # DISTANCE
    # --------------------------------------------------------

    if distance <= 0.5:
        score += 30
        reasons.append("distance_under_0_5km")

    elif distance <= 1:
        score += 25
        reasons.append("distance_under_1km")

    elif distance <= 2:
        score += 18
        reasons.append("distance_under_2km")

    elif distance <= 5:
        score += 10
        reasons.append("distance_under_5km")

    elif distance <= 10:
        score += 3
        reasons.append("distance_under_10km")

    else:
        score -= 50

    # --------------------------------------------------------
    # NEVER ACCEPT FAR-AWAY SEMANTIC FALSE MATCH
    # --------------------------------------------------------

    if distance > 20:
        score = -999

    return {
        "score": score,
        "distance_km": round(distance, 3),
        "name_score": nscore,
        "alias_score": alias_score,
        "city_score": cscore,
        "provider_score": pscore,
        "reasons": reasons,
    }


# ============================================================
# LOAD OPENAQ
# ============================================================

def load_locations():

    with OPENAQ_FILE.open(
        "r",
        encoding="utf-8",
    ) as f:
        data = json.load(f)

    if isinstance(data, list):
        return data

    if isinstance(data, dict):

        if isinstance(data.get("results"), list):
            return data["results"]

        if isinstance(data.get("locations"), list):
            return data["locations"]

    raise RuntimeError(
        "Could not find OpenAQ locations in JSON."
    )


# ============================================================
# MAIN
# ============================================================

def main():

    print("=" * 78)
    print("AeroAQI — FINAL 79 NCR → OpenAQ Matcher")
    print("=" * 78)

    with STATIONS_FILE.open(
        "r",
        encoding="utf-8",
    ) as f:
        config = yaml.safe_load(f)

    stations = config.get("stations", [])

    locations = load_locations()

    print(f"Master stations : {len(stations)}")
    print(f"OpenAQ locations: {len(locations)}")
    print()

    if len(stations) != 79:
        raise RuntimeError(
            f"Expected 79 stations, got {len(stations)}"
        )

    mappings = []

    for station in stations:

        candidates = []

        for location in locations:

            result = score_candidate(
                station,
                location,
            )

            if result is None:
                continue

            if result["score"] <= -900:
                continue

            candidates.append(
                {
                    "location": location,
                    **result,
                }
            )

        candidates.sort(
            key=lambda x: (
                x["score"],
                -x["distance_km"],
            ),
            reverse=True,
        )

        best = candidates[0] if candidates else None

        if best is None:

            mappings.append(
                {
                    "station_id": station["station_id"],
                    "station_name": station["name"],
                    "city": station["city"],
                    "state": station["state"],
                    "latitude": station["latitude"],
                    "longitude": station["longitude"],
                    "openaq_id": None,
                    "openaq_name": None,
                    "provider": None,
                    "owner": None,
                    "is_monitor": None,
                    "distance_km": None,
                    "score": None,
                    "match_status": "NO_OPENAQ_MATCH",
                    "match_method": None,
                    "reasons": [],
                }
            )

            continue

        loc = best["location"]

        # ----------------------------------------------------
        # Confidence
        # ----------------------------------------------------

        name_ok = (
            best["name_score"] >= 80
            or best["alias_score"] >= 90
        )

        monitor_ok = (
            loc.get("isMonitor") is True
        )

        provider_ok = (
            best["provider_score"] > 0
        )

        distance = best["distance_km"]

        if (
            name_ok
            and monitor_ok
            and provider_ok
            and distance <= 10
            and best["score"] >= 100
        ):
            status = "VERIFIED"

        elif (
            name_ok
            and distance <= 15
        ):
            status = "REVIEW"

        else:
            status = "NO_OPENAQ_MATCH"

        mappings.append(
            {
                "station_id": station["station_id"],
                "station_name": station["name"],
                "city": station["city"],
                "state": station["state"],
                "latitude": station["latitude"],
                "longitude": station["longitude"],

                "openaq_id": (
                    loc.get("id")
                    if status != "NO_OPENAQ_MATCH"
                    else None
                ),

                "openaq_name": loc.get("name"),
                "provider": get_provider(loc),
                "owner": get_owner(loc),
                "is_monitor": loc.get("isMonitor"),

                "distance_km": distance,
                "score": best["score"],

                "match_status": status,

                "match_method": (
                    "name_alias_coordinates_provider_monitor"
                ),

                "reasons": best["reasons"],
            }
        )

    # ========================================================
    # SAVE
    # ========================================================

    OUTPUT_FILE.parent.mkdir(
        parents=True,
        exist_ok=True,
    )

    with OUTPUT_FILE.open(
        "w",
        encoding="utf-8",
    ) as f:
        json.dump(
            mappings,
            f,
            indent=2,
            ensure_ascii=False,
        )

    verified = sum(
        x["match_status"] == "VERIFIED"
        for x in mappings
    )

    review = sum(
        x["match_status"] == "REVIEW"
        for x in mappings
    )

    unmatched = sum(
        x["match_status"] == "NO_OPENAQ_MATCH"
        for x in mappings
    )

    print("=" * 78)
    print("FINAL MAPPING SUMMARY")
    print("=" * 78)

    print(f"Total    : {len(mappings)}")
    print(f"Verified : {verified}")
    print(f"Review   : {review}")
    print(f"No match: {unmatched}")

    print()
    print("=" * 78)
    print("STATION-BY-STATION RESULT")
    print("=" * 78)

    for item in mappings:

        status = item["match_status"]

        if status == "VERIFIED":
            icon = "✅"
        elif status == "REVIEW":
            icon = "⚠️"
        else:
            icon = "❌"

        print(
            f"{icon} "
            f"{item['station_id']:<30} "
            f"→ {str(item['openaq_id']):<8} "
            f"{str(item['openaq_name'])[:40]:<40} "
            f"{item['distance_km']} km"
        )

    print()
    print(f"Saved: {OUTPUT_FILE}")
    print()
    print("🎯 Mapping complete.")


if __name__ == "__main__":
    main()