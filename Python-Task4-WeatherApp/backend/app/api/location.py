from fastapi import APIRouter, HTTPException, Request

from app.core.exceptions import UpstreamAPIError, UpstreamTimeoutError
from app.services.location_service import LocationService

router = APIRouter(prefix="/api/location", tags=["location"])

location_service = LocationService()


@router.get("/detect")
async def detect_location(request: Request):
    """Best-effort location detection from the caller's IP. On localhost
    this has nothing meaningful to resolve — it only becomes accurate
    once deployed to a real public server."""
    client_ip = request.client.host if request.client else None

    if client_ip in ("127.0.0.1", "localhost", "::1", None):
        client_ip = None

    try:
        result = await location_service.detect_from_ip(client_ip)
    except UpstreamTimeoutError as e:
        raise HTTPException(status_code=504, detail=str(e))
    except UpstreamAPIError as e:
        raise HTTPException(status_code=502, detail=str(e))

    return result