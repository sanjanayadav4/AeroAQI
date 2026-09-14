import os

from google import genai


class GeminiService:
    def __init__(self) -> None:
        api_key = os.getenv("GEMINI_API_KEY")

        if not api_key:
            raise RuntimeError("GEMINI_API_KEY is not configured")

        self.client = genai.Client(api_key=api_key)
        self.model = "gemini-3.8-flash"

    def explain_aqi(self, data: dict, question: str | None = None) -> str:
        prompt = f"""
You are an air-quality assistant for the AeroAQI project.

Explain the current air-quality situation using the provided data.
Keep the explanation short, clear, useful, and easy to understand.

IMPORTANT LANGUAGE RULE:
Respond in the same language as the user's question.

Support:
- English
- Hindi
- Hinglish (Hindi written using English letters)

If the user asks in Hindi, answer in Hindi.
If the user asks in English, answer in English.
If the user asks in Hinglish, answer naturally in Hinglish.

Do not translate or change:
- station IDs
- pollutant names
- AQI values
- units
- numerical measurements

Station: {data.get("station_id")}
AQI: {data.get("aqi")}
PM2.5: {data.get("pm25")}
PM10: {data.get("pm10")}
O3: {data.get("o3")}
NO2: {data.get("no2")}
Temperature: {data.get("temperature_c")} °C
Wind speed: {data.get("wind_speed_ms")} m/s
Boundary layer height: {data.get("boundary_layer_height_m")} m
Inversion: {data.get("inversion_flag")}

Explain:
1. What is driving the AQI.
2. How weather and mixing conditions are affecting pollution.
3. One practical takeaway.

User question: {question or "Explain the current AQI and the main factors affecting it."}

Do not invent measurements that are not provided.
"""

        response = self.client.models.generate_content(
            model=self.model,
            contents=prompt,
        )

        return response.text or "Unable to generate AQI explanation."