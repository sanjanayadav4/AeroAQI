from fastapi.testclient import TestClient

from src.api.main import app


client = TestClient(app)


def test_wrf_chem_known_station():
    response = client.get("/wrf-chem/HR_FARIDABAD_16A")

    assert response.status_code == 200

    body = response.json()

    assert body["station_id"] == "HR_FARIDABAD_16A"
    assert body["model"] == "WRF-Chem"
    assert body["mode"] == "preprocessed_simulation"
    assert body["forecast_hours"] == 72
    assert len(body["forecast"]) == 72


def test_wrf_chem_forecast_fields():
    response = client.get("/wrf-chem/HR_FARIDABAD_16A")

    assert response.status_code == 200

    row = response.json()["forecast"][0]

    required_fields = {
        "timestamp_utc",
        "pm25",
        "pm10",
        "o3",
        "no2",
        "temperature_c",
        "wind_speed_ms",
        "boundary_layer_height_m",
        "inversion_flag",
        "aqi",
        "aqi_category",
    }

    assert required_fields.issubset(row.keys())


def test_wrf_chem_unknown_station():
    response = client.get("/wrf-chem/INVALID_STATION")

    assert response.status_code == 404