from fastapi import APIRouter, HTTPException, Query

from app.core.cache import cache
from app.core.exceptions import LocationNotFoundError, UpstreamAPIError, UpstreamTimeoutError
from app.models.forecast import ForecastResponse
from app.models.weather import CurrentWeather
from app.services.forecast_service import ForecastService
from app.services.weather_service import WeatherService

router = APIRouter(prefix="/api/weather", tags=["weather"])

weather_service = WeatherService()
forecast_service = ForecastService()


@router.get("/current", response_model=CurrentWeather)
async def get_current_weather(
    city: str | None = Query(default=None),
    lat: float | None = Query(default=None),
    lon: float | None = Query(default=None),
):
    if not city and (lat is None or lon is None):
        raise HTTPException(status_code=400, detail="Provide either 'city' or both 'lat' and 'lon'")

    cache_key = f"current:{city or f'{lat},{lon}'}"
    cached = cache.get(cache_key)
    if cached:
        return cached

    try:
        if city:
            result = await weather_service.get_current_weather(city)
        else:
            result = await weather_service.get_current_weather_by_coords(lat, lon)
    except LocationNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except UpstreamTimeoutError as e:
        raise HTTPException(status_code=504, detail=str(e))
    except UpstreamAPIError as e:
        raise HTTPException(status_code=502, detail=str(e))

    cache.set(cache_key, result, ttl_seconds=600)
    return result


@router.get("/forecast", response_model=ForecastResponse)
async def get_forecast(
    city: str | None = Query(default=None),
    lat: float | None = Query(default=None),
    lon: float | None = Query(default=None),
):
    if not city and (lat is None or lon is None):
        raise HTTPException(status_code=400, detail="Provide either 'city' or both 'lat' and 'lon'")

    cache_key = f"forecast:{city or f'{lat},{lon}'}"
    cached = cache.get(cache_key)
    if cached:
        return cached

    try:
        if city:
            result = await forecast_service.get_forecast(city)
        else:
            result = await forecast_service.get_forecast_by_coords(lat, lon)
    except LocationNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except UpstreamTimeoutError as e:
        raise HTTPException(status_code=504, detail=str(e))
    except UpstreamAPIError as e:
        raise HTTPException(status_code=502, detail=str(e))

    cache.set(cache_key, result, ttl_seconds=1800)
    return result