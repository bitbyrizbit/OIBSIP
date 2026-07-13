from collections import defaultdict
from datetime import datetime, timezone

from app.models.forecast import (
    DailyForecastEntry,
    ForecastResponse,
    HourlyForecastEntry,
)
from app.services.openweather_client import OpenWeatherClient
from app.utils.conversions import kelvin_to_celsius, kelvin_to_fahrenheit


class ForecastService:
    """Aggregates OpenWeatherMap's raw 3-hour-step forecast into the hourly (next 6h) and daily (next 5 days) views the frontend renders."""

    def __init__(self, client: OpenWeatherClient | None = None):
        self._client = client or OpenWeatherClient()

    async def get_forecast(self, city: str) -> ForecastResponse:
        raw = await self._client.get_forecast(city)
        return self._build_response(raw)

    async def get_forecast_by_coords(self, lat: float, lon: float) -> ForecastResponse:
        raw = await self._client.get_forecast_by_coords(lat, lon)
        return self._build_response(raw)

    def _build_response(self, raw: dict) -> ForecastResponse:
        entries = raw["list"]
        return ForecastResponse(
            location_name=raw.get("city", {}).get("name", "Unknown"),
            country=raw.get("city", {}).get("country", ""),
            hourly=self._build_hourly(entries),
            daily=self._build_daily(entries),
        )

    @staticmethod
    def _format_hour_label(dt: datetime) -> str:
        hour = dt.hour % 12
        hour = 12 if hour == 0 else hour
        period = "AM" if dt.hour < 12 else "PM"
        return f"{hour} {period}"

    @classmethod
    def _build_hourly(cls, entries: list[dict]) -> list[HourlyForecastEntry]:
        hourly = []
        for entry in entries[:2]:
            dt = datetime.fromtimestamp(entry["dt"], tz=timezone.utc)
            weather = entry["weather"][0]
            hourly.append(
                HourlyForecastEntry(
                    timestamp=entry["dt"],
                    time_label=cls._format_hour_label(dt),
                    temperature_celsius=kelvin_to_celsius(entry["main"]["temp"]),
                    temperature_fahrenheit=kelvin_to_fahrenheit(entry["main"]["temp"]),
                    condition=weather["main"],
                    condition_icon=weather["icon"],
                    precipitation_probability=round(entry.get("pop", 0) * 100),
                )
            )
        return hourly

    @staticmethod
    def _build_daily(entries: list[dict]) -> list[DailyForecastEntry]:
        by_day: dict[str, list[dict]] = defaultdict(list)
        for entry in entries:
            date_str = datetime.fromtimestamp(entry["dt"], tz=timezone.utc).strftime("%Y-%m-%d")
            by_day[date_str].append(entry)

        daily = []
        for date_str, day_entries in list(by_day.items())[:5]:
            temps = [e["main"]["temp"] for e in day_entries]
            humidities = [e["main"]["humidity"] for e in day_entries]
            midday_entry = min(
                day_entries,
                key=lambda e: abs(datetime.fromtimestamp(e["dt"], tz=timezone.utc).hour - 12),
            )
            weather = midday_entry["weather"][0]
            date_obj = datetime.strptime(date_str, "%Y-%m-%d")

            daily.append(
                DailyForecastEntry(
                    date=date_str,
                    day_label=date_obj.strftime("%A"),
                    temp_min_celsius=kelvin_to_celsius(min(temps)),
                    temp_max_celsius=kelvin_to_celsius(max(temps)),
                    temp_min_fahrenheit=kelvin_to_fahrenheit(min(temps)),
                    temp_max_fahrenheit=kelvin_to_fahrenheit(max(temps)),
                    condition=weather["main"],
                    condition_icon=weather["icon"],
                    humidity_avg=round(sum(humidities) / len(humidities)),
                )
            )
        return daily