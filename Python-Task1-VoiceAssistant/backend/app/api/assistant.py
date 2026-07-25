from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel

from app.core.exceptions import IntentParsingError
from app.models.custom_command import CustomCommand
from app.models.intent import AssistantRequest, AssistantResponse
from app.models.reminder import Reminder
from app.services.custom_command_service import custom_command_service
from app.services.intent_service import IntentService
from app.services.orchestrator import Orchestrator
from app.services.reminder_service import reminder_service

router = APIRouter(prefix="/api/assistant", tags=["assistant"])

intent_service = IntentService()
orchestrator = Orchestrator()


# ── Main command endpoint ──────────────────────────────────────────────────────

@router.post("/command", response_model=AssistantResponse)
async def handle_command(request: AssistantRequest):
    if not request.text.strip():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Text cannot be empty")

    try:
        intent = await intent_service.classify(request.text)
    except IntentParsingError as e:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail=str(e))

    return await orchestrator.execute(intent)


# ── Reminders ──────────────────────────────────────────────────────────────────

@router.get("/reminders/fired", response_model=list[Reminder])
async def get_fired_reminders():
    """Poll this endpoint to receive reminders that have fired since the last call."""
    return reminder_service.pop_fired()


@router.get("/reminders/pending", response_model=list[Reminder])
async def get_pending_reminders():
    """Returns all scheduled reminders that haven't fired yet."""
    return reminder_service.list_pending()


# ── Custom commands ────────────────────────────────────────────────────────────

class AddCustomCommandRequest(BaseModel):
    trigger: str
    response: str


@router.get("/custom-commands", response_model=list[CustomCommand])
async def list_custom_commands():
    return custom_command_service.list_all()


@router.post("/custom-commands", response_model=CustomCommand, status_code=status.HTTP_201_CREATED)
async def add_custom_command(body: AddCustomCommandRequest):
    if not body.trigger.strip() or not body.response.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Both trigger and response must be non-empty.",
        )
    return custom_command_service.add(body.trigger, body.response)


@router.delete("/custom-commands/{command_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_custom_command(command_id: str):
    deleted = custom_command_service.delete(command_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No custom command with id '{command_id}'.",
        )