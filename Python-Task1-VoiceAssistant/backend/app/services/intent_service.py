import json

from groq import Groq

from app.config import settings
from app.core.exceptions import IntentParsingError
from app.models.intent import IntentType, ParsedIntent

SYSTEM_PROMPT = """You are an intent classification engine for a voice assistant called Relay.
Given a user's spoken request, respond with ONLY a JSON object matching this exact shape:

{
  "intent_type": one of ["greeting", "time", "date", "weather", "web_search", "reminder", "email", "general_question", "custom_command", "stop", "unknown"],
  "confidence": a float between 0 and 1,
  "parameters": an object with any relevant extracted values, for example:
    - weather: {"location": "city name"}
    - web_search: {"query": "search terms"}
    - reminder: {"content": "what to remind", "delay_seconds": number of seconds from now as an integer}
    - email: {"recipient": "email or name", "subject": "subject", "body": "message content"}
    - for other intents, parameters can be an empty object {}
}

Classification rules:
- "What's it like outside in Mumbai" → weather, not general_question
- "Goodbye", "stop", "quit", "exit", "shut up", "that's all" → stop
- "What time is it", "current time" → time
- "What day is it", "today's date" → date
- "Search for X", "look up X", "Google X" → web_search
- If unsure, prefer general_question over unknown.
- For reminders with phrases like "in 5 minutes", delay_seconds = 300.
- Respond with valid JSON only, no markdown fences."""


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
                temperature=0.1,
                response_format={"type": "json_object"},
            )
            raw = completion.choices[0].message.content
            parsed = json.loads(raw)
        except (json.JSONDecodeError, KeyError, IndexError) as e:
            raise IntentParsingError(f"Failed to parse model response: {e}")
        except Exception as e:
            raise IntentParsingError(f"Groq API request failed: {e}")

        # Normalise intent_type — guard against unknown values from the model
        intent_type_str = parsed.get("intent_type", "unknown")
        try:
            intent_type = IntentType(intent_type_str)
        except ValueError:
            intent_type = IntentType.UNKNOWN

        return ParsedIntent(
            intent_type=intent_type,
            confidence=float(parsed.get("confidence", 0.0)),
            parameters=parsed.get("parameters", {}),
            original_text=text,
        )