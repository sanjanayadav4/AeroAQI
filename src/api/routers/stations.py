"""
src/api/routers/stations.py

Station/location endpoints.

Data source:
    Local Delhi-NCR prototype dataset from src/demo/demo_stations.py

The prototype uses a fixed local station dataset so the application
does not depend on external AQI APIs during the SIH demonstration.
"""

from __future__ import annotations

from fastapi import APIRouter, HTTPException

from src.api.schemas import StationResponse, StationsListResponse
from src.demo.demo_stations import get_demo_stations
from src.utils.logger import get_logger

log = get_logger(__name__)

router = APIRouter(prefix="/stations", tags=["Stations"])


@router.get(
    "",
    response_model=StationsListResponse,
    summary="List all Delhi-NCR monitoring stations",
    description=(
        "Returns the local Delhi-NCR prototype monitoring station dataset "
        "with coordinates, operating agency, zone and station metadata."
    ),
)
def list_stations() -> StationsListResponse:
    """Return all active Delhi-NCR prototype monitoring stations."""

    stations = get_demo_stations()

    active = [
        station
        for station in stations
        if station.get("active", True)
    ]

    response_items = [
        StationResponse(
            station_id=station["station_id"],
            name=station["name"],
            city=station["city"],
            state=station["state"],
            latitude=station["latitude"],
            longitude=station["longitude"],
            agency=station["agency"],
            zone=station["zone"],
            active=station.get("active", True),
            openaq_id=station.get("openaq_id"),
        )
        for station in active
    ]

    return StationsListResponse(
        count=len(response_items),
        stations=response_items,
    )


@router.get(
    "/{station_id}",
    response_model=StationResponse,
    summary="Get a single station by ID",
    description=(
        "Returns metadata for one Delhi-NCR prototype monitoring station."
    ),
)
def get_station(station_id: str) -> StationResponse:
    """Return one station by its station_id."""

    stations = get_demo_stations()

    match = next(
        (
            station
            for station in stations
            if station["station_id"] == station_id
        ),
        None,
    )

    if match is None:
        raise HTTPException(
            status_code=404,
            detail=(
                f"Station '{station_id}' not found. "
                "Use GET /stations to see all valid station IDs."
            ),
        )

    return StationResponse(
        station_id=match["station_id"],
        name=match["name"],
        city=match["city"],
        state=match["state"],
        latitude=match["latitude"],
        longitude=match["longitude"],
        agency=match["agency"],
        zone=match["zone"],
        active=match.get("active", True),
        openaq_id=match.get("openaq_id"),
    )