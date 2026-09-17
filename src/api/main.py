"""
src/api/main.py

FastAPI application factory for AeroAQI.
"""

from __future__ import annotations

import os
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from src.api.routers import (
    fire,
    health,
    observations,
    pipeline,
    stations,
    weather,
)
from src.api.routers import forecast as forecast_router
from src.api.routers import auth as auth_router
from src.api.routers import gemini, wrf_chem
from src.utils.logger import get_logger

log = get_logger(__name__)


# ---------------------------------------------------------------------------
# App metadata
# ---------------------------------------------------------------------------

_DESCRIPTION = """
## AeroAQI Backend API

Weather–chemistry coupled air pollution forecasting for **Delhi NCR**.

### Data sources

| Source | Description |
|--------|-------------|
| OpenAQ / CPCB | Ground-level PM2.5, PM10, NO₂, O₃, SO₂, CO |
| Open-Meteo | Hourly weather + atmospheric profile |
| ERA5 | Historical reanalysis weather |
| NASA FIRMS | Near-real-time fire/hotspot detections |
| GADM | Administrative boundaries |

### Feature pipeline

Raw observations → unit standardisation → spatial fire aggregation →
feature engineering → master dataset.

### Notes

- All timestamps are **UTC**.
- Missing measurements are returned as `null` — never filled with zero.
- API keys are configured server-side in `.env`.
"""

_TAGS = [
    {"name": "Health", "description": "Liveness / readiness probes"},
    {"name": "Stations", "description": "Delhi NCR monitoring station metadata"},
    {"name": "Air Quality", "description": "PM2.5, PM10, NO₂, O₃, SO₂, CO, AQI"},
    {"name": "Weather", "description": "Temperature, wind, humidity, PBL, inversion"},
    {"name": "Fire / Hotspots", "description": "Fire detections and transport risk"},
    {"name": "Pipeline", "description": "Trigger and monitor the ingestion pipeline"},
    {"name": "Forecast", "description": "72-hour AQI forecasts"},
    {"name": "Auth", "description": "Email / phone OTP authentication"},
]


# ---------------------------------------------------------------------------
# Lifespan
# ---------------------------------------------------------------------------

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Log startup info and verify DB connectivity on startup."""

    from src.api.dependencies import get_db

    log.info("AeroAQI API starting up …")

    try:
        db = get_db()
        n = db._count_rows("observations")
        log.info(f"DB connected. observations table has {n} rows.")
    except Exception as exc:
        log.warning(
            f"DB check on startup failed "
            f"(will retry on first request): {exc}"
        )

    log.info("AeroAQI API ready.")

    yield

    log.info("AeroAQI API shutting down.")


# ---------------------------------------------------------------------------
# App factory
# ---------------------------------------------------------------------------

def create_app() -> FastAPI:

    app = FastAPI(
        title="AeroAQI",
        description=_DESCRIPTION,
        version="0.6.0",
        openapi_tags=_TAGS,
        docs_url="/docs",
        redoc_url="/redoc",
        lifespan=lifespan,
    )

    # -----------------------------------------------------------------------
    # CORS
    # -----------------------------------------------------------------------
    #
    # Frontend is currently running on localhost:5173.
    # We allow all common Vite development ports used by AeroAQI.
    #
    # If ALLOWED_ORIGINS is explicitly defined in .env, those values are
    # merged with the local development origins instead of replacing them.
    # -----------------------------------------------------------------------

    default_origins = [
        # localhost
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://localhost:5176",
        "http://localhost:5177",

        # 127.0.0.1
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "http://127.0.0.1:5175",
        "http://127.0.0.1:5176",
        "http://127.0.0.1:5177",

        #Vercel production frontend
        "https://aero-aqi.vercel.app",
    ]

    raw_origins = os.getenv("ALLOWED_ORIGINS", "").strip()

    env_origins = [
        origin.strip()
        for origin in raw_origins.split(",")
        if origin.strip()
    ]

    # Merge .env origins with safe local development origins.
    origins = list(dict.fromkeys(default_origins + env_origins))

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=False,
        allow_methods=["*"],
        allow_headers=["*"],
        expose_headers=[
            "Content-Type",
            "X-Total-Count",
        ],
        max_age=600,
    )

    # -----------------------------------------------------------------------
    # Global exception handler
    # -----------------------------------------------------------------------

    @app.exception_handler(Exception)
    async def unhandled_exception_handler(
        request: Request,
        exc: Exception,
    ):
        log.error(
            f"Unhandled exception on {request.url}: {exc}",
            exc_info=True,
        )

        return JSONResponse(
            status_code=500,
            content={
                "detail": "An internal server error occurred.",
                "status_code": 500,
            },
        )

    # -----------------------------------------------------------------------
    # Routers
    # -----------------------------------------------------------------------

    app.include_router(health.router)
    app.include_router(stations.router)
    app.include_router(observations.router)
    app.include_router(weather.router)
    app.include_router(fire.router)
    app.include_router(pipeline.router)
    app.include_router(forecast_router.router)
    app.include_router(auth_router.router)
    app.include_router(wrf_chem.router)
    app.include_router(gemini.router)

    # -----------------------------------------------------------------------
    # Root redirect
    # -----------------------------------------------------------------------

    @app.get("/", include_in_schema=False)
    async def root():
        from fastapi.responses import RedirectResponse

        return RedirectResponse(url="/docs")

    return app


# ---------------------------------------------------------------------------
# Module-level app instance
# ---------------------------------------------------------------------------

app = create_app()
