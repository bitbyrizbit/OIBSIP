import httpx

from app.core.exceptions import UpstreamAPIError, UpstreamTimeoutError


class LocationService:
    """Resolves a rough, city-level location from an IP address using
    ipinfo.io's free tier — no API key required for basic usage."""

    BASE_URL = "https://ipinfo.io"

    async def detect_from_ip(self, ip_address: str | None = None) -> dict:
        path = f"/{ip_address}/json" if ip_address else "/json"
        url = f"{self.BASE_URL}{path}"

        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                response = await client.get(url)
        except httpx.TimeoutException:
            raise UpstreamTimeoutError()

        if response.status_code != 200:
            raise UpstreamAPIError(response.status_code, response.text)

        data = response.json()
        loc = data.get("loc", "")
        lat, lon = (loc.split(",") if loc else (None, None))

        return {
            "city": data.get("city"),
            "region": data.get("region"),
            "country": data.get("country"),
            "lat": float(lat) if lat else None,
            "lon": float(lon) if lon else None,
        }