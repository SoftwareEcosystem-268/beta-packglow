from fastapi import APIRouter

from app.schemas.packing_assistant import (
    PackingAssistantRequest,
    PackingAssistantResponse,
)
from app.services.packing_rules import generate_packing_list

router = APIRouter(prefix="/packing-assistant", tags=["Packing Assistant"])


@router.post("/generate", response_model=PackingAssistantResponse, status_code=200)
async def generate_packing_suggestions(request: PackingAssistantRequest):
    return generate_packing_list(request)
