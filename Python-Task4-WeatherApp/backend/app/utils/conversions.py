def kelvin_to_celsius(kelvin: float) -> float:
    return round(kelvin - 273.15, 1)


def kelvin_to_fahrenheit(kelvin: float) -> float:
    return round((kelvin - 273.15) * 9 / 5 + 32, 1)


def celsius_to_fahrenheit(celsius: float) -> float:
    return round(celsius * 9 / 5 + 32, 1)


def mps_to_kmh(mps: float) -> float:
    """Wind speed: meters/second to km/h."""
    return round(mps * 3.6, 1)


def mps_to_mph(mps: float) -> float:
    return round(mps * 2.23694, 1)