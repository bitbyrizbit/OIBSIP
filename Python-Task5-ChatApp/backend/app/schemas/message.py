from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class MessageCreate(BaseModel):
    content: str = Field(min_length=1, max_length=2000)


class MessageOut(BaseModel):
    id: int
    room_id: int
    sender_id: int
    sender_username: str
    content: str
    sent_at: datetime

    model_config = ConfigDict(from_attributes=True)


class WebSocketEnvelope(BaseModel):
    """Every message sent over the socket, in either direction, is wrapped in this shape so the frontend can distinguish message types
    without guessing from payload structure alone."""
    type: str
    payload: dict