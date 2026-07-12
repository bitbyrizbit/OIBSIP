from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    openweather_api_key: str
    openweather_base_url: str = "https://api.openweathermap.org/data/2.5"
    environment: str = "development"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()