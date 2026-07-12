import httpx

from app.config import settings
from app.core.exceptions import (
    LocationNotFoundError,
    UpstreamAPIError,
    UpstreamTimeoutError,
)


class OpenWeatherClient:
    """Thin wrapper around the OpenWeatherMap API. Knows nothing about
    our internal response shapes — just fetches raw JSON and raises
    typed errors."""

    def __init__(self):
        self._base_url = settings.openweather_base_url
        self._api_key = settings.openweather_api_key

    async def get_current_weather(self, city: str) -> dict:
        params = {"q": city, "appid": self._api_key}
        return await self._get("/weather", params)

    async def get_current_weather_by_coords(self, lat: float, lon: float) -> dict:
        params = {"lat": lat, "lon": lon, "appid": self._api_key}
        return await self._get("/weather", params)

    async def _get(self, path: str, params: dict) -> dict:
        url = f"{self._base_url}{path}"
        try:
            async with httpx.AsyncClient(timeout=8.0) as client:
                response = await client.get(url, params=params)
        except httpx.TimeoutException:
            raise UpstreamTimeoutError()

        if response.status_code == 404:
            raise LocationNotFoundError(params.get("q", f"{params.get('lat')},{params.get('lon')}"))

        if response.status_code != 200:
            raise UpstreamAPIError(response.status_code, response.text)

        return response.json()