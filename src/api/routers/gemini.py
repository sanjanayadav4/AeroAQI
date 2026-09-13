from fastapi import APIRouter, HTTPException

from src.ai.gemini_service import GeminiService
from src.demo.demo_stations import DEMO_STATIONS
from src.wrf_chem.simulator import generate_wrf_chem_forecast


router = APIRouter(prefix="/gemini", tags=["Gemini"])


@router.get("/explain/{station_id}")
def explain_station_aqi(station_id: str):
    station = next(
        (
            s
            for s in DEMO_STATIONS
            if s.get("station_id") == station_id
        ),
        None,
    )

    if station is None:
        raise HTTPException(
            status_code=404,
            detail=f"Unknown station_id: {station_id}",
        )

    forecast = generate_wrf_chem_forecast(
        station_id=station_id,
        latitude=station.get("latitude"),
        longitude=station.get("longitude"),
        hours=1,
    )

    current = forecast["forecast"][0] if forecast.get("forecast") else {}

    data = {
        "station_id": station_id,
        "aqi": current.get("aqi"),
        "pm25": current.get("pm25"),
        "pm10": current.get("pm10"),
        "o3": current.get("o3"),
        "no2": current.get("no2"),
        "temperature_c": current.get("temperature_c"),
        "wind_speed_ms": current.get("wind_speed_ms"),
        "boundary_layer_height_m": current.get(
            "boundary_layer_height_m"
        ),
        "inversion_flag": current.get("inversion_flag"),
    }

    try:
        service = GeminiService()
        explanation = service.explain_aqi(data)
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Gemini explanation failed: {exc}",
        ) from exc

    return {
        "station_id": station_id,
        "model": "Gemini",
        "explanation": explanation,
    }