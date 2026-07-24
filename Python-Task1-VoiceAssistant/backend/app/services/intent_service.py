import json

from groq import Groq

from app.config import settings
from app.core.exceptions import IntentParsingError
from app.models.intent import IntentType, ParsedIntent

SYSTEM_PROMPT = """You are an intent classification engine for a voice assistant.
Given a user's spoken request, respond with ONLY a JSON object matching this exact shape:

{
  "intent_type": one of ["greeting", "time", "date", "weather", "web_search", "reminder", "email", "general_question", "unknown"],
  "confidence": a float between 0 and 1,
  "parameters": an object with any relevant extracted values, for example:
    - weather: {"location": "city name"}
    - web_search: {"query": "search terms"}
    - reminder: {"content": "what to remind", "delay_seconds": number of seconds from now}
    - email: {"recipient": "email or name", "subject": "subject", "body": "message content"}
    - for other intents, parameters can be an empty object {}
}

Classify based on genuine intent, not just keyword matching. "What's it like outside in Mumbai" is a weather intent even without the word "weather". Respond with valid JSON only."""


class IntentService:
    def __init__(self):
        self._client = Groq(api_key=settings.groq_api_key)

    async def classify(self, text: str) -> ParsedIntent:
        try:
            completion = self._client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": text},
                ],
                temperature=0.2,
                response_format={"type": "json_object"},
            )
            raw = completion.choices[0].message.content
            parsed = json.loads(raw)
        except (json.JSONDecodeError, KeyError, IndexError) as e:
            raise IntentParsingError(f"Failed to parse model response: {e}")
        except Exception as e:
            raise IntentParsingError(f"Groq API request failed: {e}")

        try:
            return ParsedIntent(
                intent_type=IntentType(parsed.get("intent_type", "unknown")),
                confidence=float(parsed.get("confidence", 0.0)),
                parameters=parsed.get("parameters", {}),
                original_text=text,
            )
        except ValueError as e:
            raise IntentParsingError(f"Invalid intent type received: {e}")
