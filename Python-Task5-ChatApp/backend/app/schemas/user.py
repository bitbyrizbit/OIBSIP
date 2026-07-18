from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class UserCreate(BaseModel):
    username: str = Field(min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(min_length=8)


class UserOut(BaseModel):
    id: int
    username: str
    email: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)