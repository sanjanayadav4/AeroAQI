from __future__ import annotations

import os
import requests
import yaml
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("OPENAQ_API_KEY")

if not API_KEY:
    raise RuntimeError("OPENAQ_API_KEY is missing from .env")

BASE_URL = "https://api.openaq.org/v3/locations"

# Delhi-NCR approximate bounding box:
# min longitude, min latitude, max longitude, max latitude
BBOX = "75.5,27.0,78.5,30.0"

params = {
    "bbox": BBOX,
    "iso": "IN",
    "limit": 1000,
    "page": 1,
}

headers = {
    "X-API-Key": API_KEY,
    "Accept": "application/json",
}

print("Searching OpenAQ locations in Delhi-NCR...")

response = requests.get(
    BASE_URL,
    params=params,
    headers=headers,
    timeout=30,
)

print("HTTP status:", response.status_code)

if response.status_code != 200:
    print(response.text[:2000])
    raise SystemExit(1)

data = response.json()
locations = data.get("results", [])

print("OpenAQ locations found:", len(locations))
print()

for loc in locations:
    coords = loc.get("coordinates") or {}

    print(
        f"ID={loc.get('id')} | "
        f"name={loc.get('name')} | "
        f"lat={coords.get('latitude')} | "
        f"lon={coords.get('longitude')} | "
        f"provider={(loc.get('provider') or {}).get('name')} | "
        f"monitor={loc.get('isMonitor')}"
    )
    import json

with open("data/openaq_ncr_locations.json", "w", encoding="utf-8") as f:
    json.dump(locations, f, indent=2, ensure_ascii=False)

print()
print("Saved:", "data/openaq_ncr_locations.json")