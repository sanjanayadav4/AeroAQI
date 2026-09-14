from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from src.ai.gemini_service import GeminiService
from src.demo.demo_stations import DEMO_STATIONS
from src.wrf_chem.simulator import generate_wrf_chem_forecast


router = APIRouter(prefix="/gemini", tags=["Gemini"])


class GeminiChatRequest(BaseModel):
    question: str
    station_id: str


def _station_data(station_id: str) -> dict:
    station = next((s for s in DEMO_STATIONS if s.get("station_id") == station_id), None)
    if station is None:
        raise HTTPException(status_code=404, detail=f"Unknown station_id: {station_id}")
    forecast = generate_wrf_chem_forecast(
        station_id=station_id,
        latitude=station.get("latitude"),
        longitude=station.get("longitude"),
        hours=1,
    )
    current = forecast["forecast"][0] if forecast.get("forecast") else {}
    return {"station_id": station_id, **current}


@router.post("/chat")
def chat_with_gemini(request: GeminiChatRequest):
    data = _station_data(request.station_id)
    try:
        answer = GeminiService().explain_aqi(data, request.question)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Gemini chat failed: {exc}") from exc
    return {"station_id": request.station_id, "model": "Gemini", "answer": answer}


@router.get("/explain/{station_id}")
def explain_station_aqi(station_id: str):
    data = _station_data(station_id)

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