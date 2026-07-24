from fastapi import APIRouter, HTTPException, status

from app.core.exceptions import IntentParsingError
from app.models.intent import AssistantRequest, AssistantResponse
from app.models.reminder import Reminder
from app.services.intent_service import IntentService
from app.services.orchestrator import Orchestrator
from app.services.reminder_service import reminder_service

router = APIRouter(prefix="/api/assistant", tags=["assistant"])

intent_service = IntentService()
orchestrator = Orchestrator()


@router.post("/command", response_model=AssistantResponse)
async def handle_command(request: AssistantRequest):
    if not request.text.strip():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Text cannot be empty")

    try:
        intent = await intent_service.classify(request.text)
    except IntentParsingError as e:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail=str(e))

    return await orchestrator.execute(intent)


@router.get("/reminders/fired", response_model=list[Reminder])
async def get_fired_reminders():
    return reminder_service.pop_fired()