import httpx

from app.config import settings
from app.core.exceptions import ActionExecutionError
from app.models.weather import WeatherSnapshot


class WeatherAction:
    BASE_URL = "https://api.openweathermap.org/data/2.5/weather"

    async def get_weather(self, location: str) -> WeatherSnapshot:
        params = {"q": location, "appid": settings.openweather_api_key}
        try:
            async with httpx.AsyncClient(timeout=8.0) as client:
                response = await client.get(self.BASE_URL, params=params)
        except httpx.TimeoutException:
            raise ActionExecutionError("weather", "Weather service request timed out")

        if response.status_code == 404:
            raise ActionExecutionError("weather", f"Location '{location}' not found")
        if response.status_code != 200:
            raise ActionExecutionError("weather", "Weather service is currently unavailable")

        raw = response.json()
        return WeatherSnapshot(
            location_name=raw.get("name", location),
            country=raw.get("sys", {}).get("country", ""),
            temperature_celsius=round(raw["main"]["temp"] - 273.15, 1),
            condition=raw["weather"][0]["main"],
            condition_description=raw["weather"][0]["description"],
            humidity=raw["main"]["humidity"],
        )