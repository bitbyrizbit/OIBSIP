from fastapi import WebSocket


class ConnectionManager:
    """Tracks active WebSocket connections grouped by room.
    A single user could theoretically have multiple tabs open, each gets its own entry, 
    broadcasts go to every connection in a room regardless of how many belong to the same person."""

    def __init__(self):
        # room_id -> list of (websocket, user_id, username)
        self._rooms: dict[int, list[dict]] = {}

    async def connect(self, room_id: int, websocket: WebSocket, user_id: int, username: str) -> None:
        await websocket.accept()
        self._rooms.setdefault(room_id, []).append(
            {"socket": websocket, "user_id": user_id, "username": username}
        )

    def disconnect(self, room_id: int, websocket: WebSocket) -> None:
        connections = self._rooms.get(room_id, [])
        self._rooms[room_id] = [c for c in connections if c["socket"] != websocket]
        if not self._rooms[room_id]:
            del self._rooms[room_id]

    async def broadcast(self, room_id: int, payload: dict, exclude: WebSocket | None = None) -> None:
        connections = self._rooms.get(room_id, [])
        stale: list[WebSocket] = []

        for connection in connections:
            socket = connection["socket"]
            if socket is exclude:
                continue
            try:
                await socket.send_json(payload)
            except Exception:
                stale.append(socket)

        for socket in stale:
            self.disconnect(room_id, socket)

    def active_usernames(self, room_id: int) -> list[str]:
        return [c["username"] for c in self._rooms.get(room_id, [])]


manager = ConnectionManager()