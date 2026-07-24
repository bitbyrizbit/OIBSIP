from pydantic import BaseModel


class WeatherSnapshot(BaseModel):
    location_name: str
    country: str
    temperature_celsius: float
    condition: str
    condition_description: str
    humidity: int