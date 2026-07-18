from sqlalchemy.orm import Session

from app.models.message import Message
from app.models.user import User


def save_message(db: Session, room_id: int, sender_id: int, content: str) -> Message:
    message = Message(room_id=room_id, sender_id=sender_id, content=content)
    db.add(message)
    db.commit()
    db.refresh(message)
    return message


def get_room_history(db: Session, room_id: int, limit: int = 50) -> list[dict]:
    """Returns messages joined with sender username, newest first from the query, 
    then reversed so the frontend receives them in chronological order, oldest to newest, ready to render top to bottom."""
    rows = (
        db.query(Message, User.username)
        .join(User, Message.sender_id == User.id)
        .filter(Message.room_id == room_id)
        .order_by(Message.sent_at.desc())
        .limit(limit)
        .all()
    )

    history = [
        {
            "id": message.id,
            "room_id": message.room_id,
            "sender_id": message.sender_id,
            "sender_username": username,
            "content": message.content,
            "sent_at": message.sent_at,
        }
        for message, username in rows
    ]
    return list(reversed(history))