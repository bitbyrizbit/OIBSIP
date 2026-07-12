class WeatherServiceError(Exception):
    """Base exception for anything that goes wrong talking to the weather provider."""


class LocationNotFoundError(WeatherServiceError):
    def __init__(self, query: str):
        self.query = query
        super().__init__(f"No location found matching '{query}'")


class UpstreamAPIError(WeatherServiceError):
    def __init__(self, status_code: int, detail: str):
        self.status_code = status_code
        self.detail = detail
        super().__init__(f"Upstream API returned {status_code}: {detail}")


class UpstreamTimeoutError(WeatherServiceError):
    def __init__(self):
        super().__init__("Weather provider took too long to respond")