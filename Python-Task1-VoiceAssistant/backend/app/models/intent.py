from enum import Enum

from pydantic import BaseModel


class IntentType(str, Enum):
    GREETING = "greeting"
    TIME = "time"
    DATE = "date"
    WEATHER = "weather"
    WEB_SEARCH = "web_search"
    REMINDER = "reminder"
    EMAIL = "email"
    GENERAL_QUESTION = "general_question"
    UNKNOWN = "unknown"


class ParsedIntent(BaseModel):
    intent_type: IntentType
    confidence: float
    parameters: dict
    original_text: str


class AssistantRequest(BaseModel):
    text: str


class AssistantResponse(BaseModel):
    intent: ParsedIntent
    spoken_response: str
    data: dict = {}