from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class RoomCreate(BaseModel):
    name: str = Field(min_length=2, max_length=100)


class RoomOut(BaseModel):
    id: int
    name: str
    created_by_id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)