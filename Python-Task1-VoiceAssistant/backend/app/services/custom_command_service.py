"""
Custom command store — allows users to define their own trigger phrases
and the spoken response Relay should give back.

Storage: a single JSON file (`custom_commands.json`) in the backend root.
This satisfies the task requirement: "Allow users to add custom commands via a config file."
"""

import json
import uuid
from pathlib import Path
from typing import Optional

from app.models.custom_command import CustomCommand

STORE_PATH = Path(__file__).parent.parent.parent / "custom_commands.json"


class CustomCommandService:
    def __init__(self):
        self._commands: dict[str, CustomCommand] = {}
        self._load()

    # ── Persistence ────────────────────────────────────────────────────────────

    def _load(self) -> None:
        if STORE_PATH.exists():
            try:
                raw = json.loads(STORE_PATH.read_text(encoding="utf-8"))
                self._commands = {
                    k: CustomCommand(**v) for k, v in raw.items()
                }
            except Exception:
                self._commands = {}

    def _save(self) -> None:
        STORE_PATH.write_text(
            json.dumps(
                {k: v.model_dump() for k, v in self._commands.items()},
                indent=2,
                ensure_ascii=False,
            ),
            encoding="utf-8",
        )

    # ── CRUD ───────────────────────────────────────────────────────────────────

    def add(self, trigger: str, response: str) -> CustomCommand:
        cmd = CustomCommand(
            id=str(uuid.uuid4()),
            trigger=trigger.lower().strip(),
            response=response.strip(),
        )
        self._commands[cmd.id] = cmd
        self._save()
        return cmd

    def list_all(self) -> list[CustomCommand]:
        return list(self._commands.values())

    def delete(self, command_id: str) -> bool:
        if command_id in self._commands:
            del self._commands[command_id]
            self._save()
            return True
        return False

    def match(self, text: str) -> Optional[CustomCommand]:
        """Find the first custom command whose trigger phrase appears in the input text."""
        lowered = text.lower()
        for cmd in self._commands.values():
            if cmd.trigger in lowered:
                return cmd
        return None


custom_command_service = CustomCommandService()
