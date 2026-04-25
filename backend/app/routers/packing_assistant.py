from fastapi import APIRouter, Depends

from app.auth import get_current_user
from app.models.user import User
from app.schemas.packing_assistant import (
    PackingAssistantRequest,
    PackingAssistantResponse,
)
from app.services.packing_rules import generate_packing_list

router = APIRouter(prefix="/packing-assistant", tags=["Packing Assistant"])


@router.post("/generate", response_model=PackingAssistantResponse, status_code=200)
async def generate_packing_suggestions(request: PackingAssistantRequest, current_user: User = Depends(get_current_user)):
    return generate_packing_list(request)
