from fastapi import APIRouter, Depends, HTTPException, status

from app.core.exceptions import IntentParsingError
from app.models.intent import AssistantRequest, ParsedIntent
from app.services.intent_service import IntentService

router = APIRouter(prefix="/api/assistant", tags=["assistant"])

intent_service = IntentService()


@router.post("/classify", response_model=ParsedIntent)
async def classify_intent(request: AssistantRequest):
    if not request.text.strip():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Text cannot be empty")

    try:
        return await intent_service.classify(request.text)
    except IntentParsingError as e:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail=str(e))