from datetime import datetime, timezone

from app.core.exceptions import ActionExecutionError
from app.models.intent import AssistantResponse, IntentType, ParsedIntent
from app.services.reminder_service import reminder_service
from app.services.search_action import SearchAction
from app.services.weather_action import WeatherAction


class Orchestrator:
    def __init__(self):
        self._weather_action = WeatherAction()
        self._search_action = SearchAction()

    async def execute(self, intent: ParsedIntent) -> AssistantResponse:
        handler = self._handlers.get(intent.intent_type, self._handle_unknown)
        return await handler(self, intent)

    async def _handle_greeting(self, intent: ParsedIntent) -> AssistantResponse:
        return AssistantResponse(
            intent=intent,
            spoken_response="Hey there. What can I help with?",
        )

    async def _handle_time(self, intent: ParsedIntent) -> AssistantResponse:
        now = datetime.now().strftime("%I:%M %p").lstrip("0")
        return AssistantResponse(
            intent=intent,
            spoken_response=f"It's {now} right now.",
            data={"time": now},
        )

    async def _handle_date(self, intent: ParsedIntent) -> AssistantResponse:
        today = datetime.now().strftime("%A, %B %d")
        return AssistantResponse(
            intent=intent,
            spoken_response=f"Today is {today}.",
            data={"date": today},
        )

    async def _handle_weather(self, intent: ParsedIntent) -> AssistantResponse:
        location = intent.parameters.get("location")
        if not location:
            return AssistantResponse(
                intent=intent,
                spoken_response="Which city did you want the weather for?",
            )
        try:
            snapshot = await self._weather_action.get_weather(location)
        except ActionExecutionError as e:
            return AssistantResponse(intent=intent, spoken_response=str(e))

        spoken = (
            f"It's {snapshot.temperature_celsius} degrees and {snapshot.condition_description} "
            f"in {snapshot.location_name}."
        )
        return AssistantResponse(intent=intent, spoken_response=spoken, data=snapshot.model_dump())

    async def _handle_web_search(self, intent: ParsedIntent) -> AssistantResponse:
        query = intent.parameters.get("query", intent.original_text)
        url = self._search_action.build_search_url(query)
        return AssistantResponse(
            intent=intent,
            spoken_response=f"Here's what I found for {query}.",
            data={"search_url": url, "query": query},
        )

    async def _handle_reminder(self, intent: ParsedIntent) -> AssistantResponse:
        content = intent.parameters.get("content")
        delay = intent.parameters.get("delay_seconds")
        if not content or not delay:
            return AssistantResponse(
                intent=intent,
                spoken_response="I didn't catch what to remind you about, or when. Try again?",
            )
        reminder = reminder_service.schedule(content, int(delay))
        minutes = round(delay / 60, 1)
        return AssistantResponse(
            intent=intent,
            spoken_response=f"Got it. I'll remind you to {content} in about {minutes} minutes.",
            data={"reminder_id": reminder.id, "trigger_at": reminder.trigger_at.isoformat()},
        )

    async def _handle_general_question(self, intent: ParsedIntent) -> AssistantResponse:
        # TODO: Integrate LLM completion for general knowledge Q&A
        return AssistantResponse(
            intent=intent,
            spoken_response="Let me think about that one.",
        )

    async def _handle_email(self, intent: ParsedIntent) -> AssistantResponse:
        # TODO: Implement email integration via smtplib
        return AssistantResponse(
            intent=intent,
            spoken_response="Email sending isn't wired up quite yet.",
        )

    async def _handle_unknown(self, intent: ParsedIntent) -> AssistantResponse:
        return AssistantResponse(
            intent=intent,
            spoken_response="I didn't quite catch that. Could you rephrase it?",
        )

    _handlers = {
        IntentType.GREETING: _handle_greeting,
        IntentType.TIME: _handle_time,
        IntentType.DATE: _handle_date,
        IntentType.WEATHER: _handle_weather,
        IntentType.WEB_SEARCH: _handle_web_search,
        IntentType.REMINDER: _handle_reminder,
        IntentType.GENERAL_QUESTION: _handle_general_question,
        IntentType.EMAIL: _handle_email,
        IntentType.UNKNOWN: _handle_unknown,
    }