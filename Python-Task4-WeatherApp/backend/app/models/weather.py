from pydantic import BaseModel, Field


class Coordinates(BaseModel):
    lat: float
    lon: float


class Temperature(BaseModel):
    celsius: float
    fahrenheit: float
    feels_like_celsius: float
    feels_like_fahrenheit: float


class Wind(BaseModel):
    speed_kmh: float
    speed_mph: float
    direction_deg: int


class CurrentWeather(BaseModel):
    location_name: str
    country: str
    coordinates: Coordinates
    temperature: Temperature
    humidity: int = Field(ge=0, le=100)
    pressure_hpa: int
    condition: str
    condition_description: str
    condition_icon: str
    wind: Wind
    visibility_km: float
    observed_at: int  # unix timestamp