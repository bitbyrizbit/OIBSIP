from app.models.weather import CurrentWeather, Coordinates, Temperature, Wind
from app.services.openweather_client import OpenWeatherClient
from app.utils.conversions import (
    kelvin_to_celsius,
    kelvin_to_fahrenheit,
    mps_to_kmh,
    mps_to_mph,
)


class WeatherService:
    """Translates raw OpenWeatherMap payloads into our own domain model."""

    def __init__(self, client: OpenWeatherClient | None = None):
        self._client = client or OpenWeatherClient()

    async def get_current_weather(self, city: str) -> CurrentWeather:
        raw = await self._client.get_current_weather(city)
        return self._to_current_weather(raw)

    async def get_current_weather_by_coords(self, lat: float, lon: float) -> CurrentWeather:
        raw = await self._client.get_current_weather_by_coords(lat, lon)
        return self._to_current_weather(raw)

    @staticmethod
    def _to_current_weather(raw: dict) -> CurrentWeather:
        main = raw["main"]
        wind = raw.get("wind", {})
        weather = raw["weather"][0]
        coords = raw["coord"]

        temp_k = main["temp"]
        feels_like_k = main["feels_like"]
        wind_speed_mps = wind.get("speed", 0.0)

        return CurrentWeather(
            location_name=raw.get("name", "Unknown"),
            country=raw.get("sys", {}).get("country", ""),
            coordinates=Coordinates(lat=coords["lat"], lon=coords["lon"]),
            temperature=Temperature(
                celsius=kelvin_to_celsius(temp_k),
                fahrenheit=kelvin_to_fahrenheit(temp_k),
                feels_like_celsius=kelvin_to_celsius(feels_like_k),
                feels_like_fahrenheit=kelvin_to_fahrenheit(feels_like_k),
            ),
            humidity=main["humidity"],
            pressure_hpa=main["pressure"],
            condition=weather["main"],
            condition_description=weather["description"],
            condition_icon=weather["icon"],
            wind=Wind(
                speed_kmh=mps_to_kmh(wind_speed_mps),
                speed_mph=mps_to_mph(wind_speed_mps),
                direction_deg=wind.get("deg", 0),
            ),
            visibility_km=round(raw.get("visibility", 0) / 1000, 1),
            observed_at=raw["dt"],
        )