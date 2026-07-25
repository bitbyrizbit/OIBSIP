import asyncio
import uuid
from datetime import datetime, timedelta, timezone

from app.models.reminder import Reminder


class ReminderService:
    """Schedules in-memory reminders using asyncio callbacks; queues fired reminders for frontend polling."""

    def __init__(self):
        self._reminders: dict[str, Reminder] = {}
        self._fired_queue: list[Reminder] = []

    def schedule(self, content: str, delay_seconds: int) -> Reminder:
        reminder_id = str(uuid.uuid4())
        trigger_at = datetime.now(timezone.utc) + timedelta(seconds=delay_seconds)
        reminder = Reminder(id=reminder_id, content=content, trigger_at=trigger_at)
        self._reminders[reminder_id] = reminder

        # Use get_running_loop() — get_event_loop() is deprecated in Python 3.10+
        # and raises a DeprecationWarning (or RuntimeError) in async contexts.
        try:
            loop = asyncio.get_running_loop()
            loop.call_later(delay_seconds, self._fire, reminder_id)
        except RuntimeError:
            # Fallback: no running loop yet (shouldn't happen in FastAPI but guarded)
            asyncio.get_event_loop().call_later(delay_seconds, self._fire, reminder_id)

        return reminder

    def _fire(self, reminder_id: str) -> None:
        reminder = self._reminders.get(reminder_id)
        if reminder:
            reminder.fired = True
            self._fired_queue.append(reminder)

    def pop_fired(self) -> list[Reminder]:
        """Returns and clears all reminders that have fired since the last check."""
        fired = list(self._fired_queue)
        self._fired_queue.clear()
        return fired

    def list_pending(self) -> list[Reminder]:
        """Returns all reminders that haven't fired yet."""
        return [r for r in self._reminders.values() if not r.fired]


reminder_service = ReminderService()