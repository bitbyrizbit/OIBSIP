"""
Orchestrator — routes a ParsedIntent to the correct action handler
and returns an AssistantResponse with a spoken_response and optional data payload.
"""

from datetime import datetime

from app.core.exceptions import ActionExecutionError
from app.models.intent import AssistantResponse, IntentType, ParsedIntent
from app.services.reminder_service import reminder_service
from app.services.search_action import SearchAction
from app.services.weather_action import WeatherAction
from app.services.email_action import EmailAction
from app.services.qa_service import QAService
from app.services.custom_command_service import custom_command_service


class Orchestrator:
    def __init__(self):
        self._weather_action = WeatherAction()
        self._search_action = SearchAction()
        self._email_action = EmailAction()
        self._qa_service = QAService()

    async def execute(self, intent: ParsedIntent) -> AssistantResponse:
        # Before routing by intent type, check if a custom command matches.
        # Custom commands take priority over general_question fallback.
        if intent.intent_type in (IntentType.GENERAL_QUESTION, IntentType.UNKNOWN):
            matched = custom_command_service.match(intent.original_text)
            if matched:
                return AssistantResponse(
                    intent=intent,
                    spoken_response=matched.response,
                    data={"custom_command_id": matched.id, "trigger": matched.trigger},
                )

        handler = self._handlers.get(intent.intent_type, self._handle_unknown)
        return await handler(self, intent)

    # ── Intent handlers ────────────────────────────────────────────────────────

    async def _handle_greeting(self, intent: ParsedIntent) -> AssistantResponse:
        return AssistantResponse(
            intent=intent,
            spoken_response="Hey there. What can I help with?",
        )

    async def _handle_stop(self, intent: ParsedIntent) -> AssistantResponse:
        return AssistantResponse(
            intent=intent,
            spoken_response="Signing off. Talk later.",
            data={"stop": True},
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
            f"It's {snapshot.temperature_celsius} degrees in {snapshot.location_name}, "
            f"feels like {snapshot.feels_like_celsius}. "
            f"Conditions are {snapshot.condition_description}, "
            f"with {snapshot.humidity}% humidity."
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

        # Guard: both must be present and delay must be a positive number
        if content is None or delay is None:
            return AssistantResponse(
                intent=intent,
                spoken_response="I didn't catch what to remind you about, or when. Try again?",
            )

        try:
            delay = int(delay)
        except (ValueError, TypeError):
            return AssistantResponse(
                intent=intent,
                spoken_response="I couldn't figure out the timing. Can you rephrase?",
            )

        if delay <= 0:
            return AssistantResponse(
                intent=intent,
                spoken_response="The reminder delay needs to be a positive number of seconds.",
            )

        reminder = reminder_service.schedule(content, delay)
        minutes = round(delay / 60, 1)
        label = f"{minutes} minutes" if delay >= 60 else f"{delay} seconds"
        return AssistantResponse(
            intent=intent,
            spoken_response=f"Got it. I'll remind you to {content} in about {label}.",
            data={"reminder_id": reminder.id, "trigger_at": reminder.trigger_at.isoformat()},
        )

    async def _handle_general_question(self, intent: ParsedIntent) -> AssistantResponse:
        try:
            answer = await self._qa_service.answer(intent.original_text)
        except ActionExecutionError as e:
            return AssistantResponse(intent=intent, spoken_response=str(e))
        return AssistantResponse(intent=intent, spoken_response=answer)

    async def _handle_email(self, intent: ParsedIntent) -> AssistantResponse:
        recipient = intent.parameters.get("recipient")
        subject = intent.parameters.get("subject", "Message from Relay")
        body = intent.parameters.get("body")

        if not recipient or not body:
            return AssistantResponse(
                intent=intent,
                spoken_response="I need to know who to email and what to say.",
            )

        try:
            self._email_action.send(recipient, subject, body)
        except ActionExecutionError as e:
            return AssistantResponse(intent=intent, spoken_response=str(e))

        return AssistantResponse(intent=intent, spoken_response=f"Email sent to {recipient}.")

    async def _handle_unknown(self, intent: ParsedIntent) -> AssistantResponse:
        return AssistantResponse(
            intent=intent,
            spoken_response="I didn't quite catch that. Could you rephrase it?",
        )

    _handlers = {
        IntentType.GREETING: _handle_greeting,
        IntentType.STOP: _handle_stop,
        IntentType.TIME: _handle_time,
        IntentType.DATE: _handle_date,
        IntentType.WEATHER: _handle_weather,
        IntentType.WEB_SEARCH: _handle_web_search,
        IntentType.REMINDER: _handle_reminder,
        IntentType.GENERAL_QUESTION: _handle_general_question,
        IntentType.EMAIL: _handle_email,
        IntentType.UNKNOWN: _handle_unknown,
    }