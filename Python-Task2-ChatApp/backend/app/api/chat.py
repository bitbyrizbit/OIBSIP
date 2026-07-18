from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session

from app.core.connection_manager import manager
from app.core.ws_deps import get_current_user_ws
from app.database import get_db
from app.models.user import User
from app.services.message_service import save_message
from app.services.room_service import get_room_by_id

router = APIRouter()


@router.websocket("/ws/rooms/{room_id}")
async def room_websocket(
    websocket: WebSocket,
    room_id: int,
    current_user: User = Depends(get_current_user_ws),
    db: Session = Depends(get_db),
):
    get_room_by_id(db, room_id)  # raises and closes connection naturally if room doesn't exist

    await manager.connect(room_id, websocket, current_user.id, current_user.username)

    await manager.broadcast(
        room_id,
        {
            "type": "presence",
            "payload": {
                "event": "joined",
                "username": current_user.username,
                "active_users": manager.active_usernames(room_id),
            },
        },
    )

    try:
        while True:
            data = await websocket.receive_json()

            if data.get("type") != "message":
                continue

            content = data.get("payload", {}).get("content", "").strip()
            if not content:
                continue

            saved = save_message(db, room_id=room_id, sender_id=current_user.id, content=content)

            await manager.broadcast(
                room_id,
                {
                    "type": "message",
                    "payload": {
                        "id": saved.id,
                        "room_id": room_id,
                        "sender_id": current_user.id,
                        "sender_username": current_user.username,
                        "content": saved.content,
                        "sent_at": saved.sent_at.isoformat(),
                    },
                },
            )

    except WebSocketDisconnect:
        manager.disconnect(room_id, websocket)
        await manager.broadcast(
            room_id,
            {
                "type": "presence",
                "payload": {
                    "event": "left",
                    "username": current_user.username,
                    "active_users": manager.active_usernames(room_id),
                },
            },
        )