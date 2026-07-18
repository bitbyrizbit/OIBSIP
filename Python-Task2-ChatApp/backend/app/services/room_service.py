from sqlalchemy.orm import Session

from app.core.exceptions import RoomAlreadyExistsError, RoomNotFoundError
from app.models.room import Room
from app.schemas.room import RoomCreate


def create_room(db: Session, room_in: RoomCreate, creator_id: int) -> Room:
    existing = db.query(Room).filter(Room.name == room_in.name).first()
    if existing:
        raise RoomAlreadyExistsError(room_in.name)

    room = Room(name=room_in.name, created_by_id=creator_id)
    db.add(room)
    db.commit()
    db.refresh(room)
    return room


def list_rooms(db: Session) -> list[Room]:
    return db.query(Room).order_by(Room.created_at.desc()).all()


def get_room_by_id(db: Session, room_id: int) -> Room:
    room = db.query(Room).filter(Room.id == room_id).first()
    if not room:
        raise RoomNotFoundError(str(room_id))
    return room