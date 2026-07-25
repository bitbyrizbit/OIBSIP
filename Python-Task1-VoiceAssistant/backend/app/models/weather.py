from pydantic import BaseModel


class WeatherSnapshot(BaseModel):
    location_name: str
    country: str
    temperature_celsius: float
    feels_like_celsius: float
    condition: str
    condition_description: str
    humidity: int
    wind_speed_mps: float