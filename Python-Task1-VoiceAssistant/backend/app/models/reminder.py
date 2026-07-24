from datetime import datetime, timezone

from pydantic import BaseModel


class Reminder(BaseModel):
    id: str
    content: str
    trigger_at: datetime
    fired: bool = False