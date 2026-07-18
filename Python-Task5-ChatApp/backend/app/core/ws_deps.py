from fastapi import Query, WebSocket, WebSocketException, status
from sqlalchemy.orm import Session

from app.core.exceptions import InvalidTokenError
from app.core.security import decode_access_token
from app.database import SessionLocal
from app.models.user import User


async def get_current_user_ws(websocket: WebSocket, token: str = Query(...)) -> User:
    db: Session = SessionLocal()
    try:
        try:
            user_id = decode_access_token(token)
        except InvalidTokenError:
            raise WebSocketException(code=status.WS_1008_POLICY_VIOLATION, reason="Invalid token")

        user = db.query(User).filter(User.id == int(user_id)).first()
        if user is None:
            raise WebSocketException(code=status.WS_1008_POLICY_VIOLATION, reason="User no longer exists")
        return user
    finally:
        db.close()