import time
from typing import Any, Optional


class TTLCache:
    """A minimal in-memory cache with per-key expiry.

    Not distributed, not persisted — that's intentional at this project's
    scale. A production system fielding real traffic would swap this for
    Redis without touching any calling code, since it exposes the same
    get/set interface either way.
    """

    def __init__(self, default_ttl_seconds: int = 600):
        self._store: dict[str, tuple[Any, float]] = {}
        self._default_ttl = default_ttl_seconds

    def get(self, key: str) -> Optional[Any]:
        entry = self._store.get(key)
        if entry is None:
            return None
        value, expires_at = entry
        if time.monotonic() > expires_at:
            del self._store[key]
            return None
        return value

    def set(self, key: str, value: Any, ttl_seconds: Optional[int] = None) -> None:
        ttl = ttl_seconds if ttl_seconds is not None else self._default_ttl
        self._store[key] = (value, time.monotonic() + ttl)

    def clear(self) -> None:
        self._store.clear()


cache = TTLCache(default_ttl_seconds=600)