from pydantic import BaseModel


class CustomCommand(BaseModel):
    id: str
    trigger: str        # lowercase phrase to match against user input
    response: str       # what Relay speaks back
