from fastapi import APIRouter, HTTPException

from src.api.schemas import WRFchemForecastResponse
from src.demo.demo_stations import DEMO_STATIONS
from src.wrf_chem.simulator import generate_wrf_chem_forecast


router = APIRouter(
    prefix="/wrf-chem",
    tags=["WRF-Chem"],
)


@router.get(
    "/{station_id}",
    response_model=WRFchemForecastResponse,
)
def get_wrf_chem_forecast(station_id: str):
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

    return generate_wrf_chem_forecast(
        station_id=station_id,
        latitude=station.get("latitude"),
        longitude=station.get("longitude"),
        hours=72,
    )