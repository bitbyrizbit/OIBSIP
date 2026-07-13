from pydantic import BaseModel


class HourlyForecastEntry(BaseModel):
    timestamp: int
    time_label: str
    temperature_celsius: float
    temperature_fahrenheit: float
    condition: str
    condition_icon: str
    precipitation_probability: int


class DailyForecastEntry(BaseModel):
    date: str
    day_label: str
    temp_min_celsius: float
    temp_max_celsius: float
    temp_min_fahrenheit: float
    temp_max_fahrenheit: float
    condition: str
    condition_icon: str
    humidity_avg: int


class ForecastResponse(BaseModel):
    location_name: str
    country: str
    hourly: list[HourlyForecastEntry]
    daily: list[DailyForecastEntry]