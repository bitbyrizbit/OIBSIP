import asyncio
import uuid
from datetime import datetime, timedelta, timezone

from app.models.reminder import Reminder


class ReminderService:
    """Schedules in-memory reminders using asyncio callbacks. Fired
    reminders are pushed into a queue the frontend polls, since a voice
    assistant needs to surface the reminder even if the user isn't
    actively looking at the page when it fires."""

    def __init__(self):
        self._reminders: dict[str, Reminder] = {}
        self._fired_queue: list[Reminder] = []

    def schedule(self, content: str, delay_seconds: int) -> Reminder:
        reminder_id = str(uuid.uuid4())
        trigger_at = datetime.now(timezone.utc) + timedelta(seconds=delay_seconds)
        reminder = Reminder(id=reminder_id, content=content, trigger_at=trigger_at)
        self._reminders[reminder_id] = reminder

        asyncio.get_event_loop().call_later(
            delay_seconds, self._fire, reminder_id
        )
        return reminder

    def _fire(self, reminder_id: str) -> None:
        reminder = self._reminders.get(reminder_id)
        if reminder:
            reminder.fired = True
            self._fired_queue.append(reminder)

    def pop_fired(self) -> list[Reminder]:
        """Returns and clears any reminders that have fired since the
        last time this was called, letting the frontend poll for them."""
        fired = list(self._fired_queue)
        self._fired_queue.clear()
        return fired


reminder_service = ReminderService()