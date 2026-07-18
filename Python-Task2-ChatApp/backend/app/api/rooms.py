from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.deps import get_current_user
from app.core.exceptions import RoomAlreadyExistsError, RoomNotFoundError
from app.database import get_db
from app.models.user import User
from app.schemas.message import MessageOut
from app.schemas.room import RoomCreate, RoomOut
from app.services.message_service import get_room_history
from app.services.room_service import create_room, get_room_by_id, list_rooms

router = APIRouter(prefix="/api/rooms", tags=["rooms"])


@router.get("", response_model=list[RoomOut])
def get_rooms(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return list_rooms(db)


@router.post("", response_model=RoomOut, status_code=status.HTTP_201_CREATED)
def post_room(
    room_in: RoomCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        return create_room(db, room_in, creator_id=current_user.id)
    except RoomAlreadyExistsError as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))


@router.get("/{room_id}", response_model=RoomOut)
def get_room(
    room_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        return get_room_by_id(db, room_id)
    except RoomNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


@router.get("/{room_id}/messages", response_model=list[MessageOut])
def get_messages(
    room_id: int,
    limit: int = Query(default=50, ge=1, le=200),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        get_room_by_id(db, room_id)
    except RoomNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))

    return get_room_history(db, room_id, limit=limit)