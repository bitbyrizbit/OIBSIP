class AssistantError(Exception):
    """Base exception for assistant related failures."""


class IntentParsingError(AssistantError):
    def __init__(self, reason: str):
        self.reason = reason
        super().__init__(f"Could not understand the request: {reason}")


class ActionExecutionError(AssistantError):
    def __init__(self, action: str, reason: str):
        self.action = action
        self.reason = reason
        super().__init__(f"Failed to execute '{action}': {reason}")