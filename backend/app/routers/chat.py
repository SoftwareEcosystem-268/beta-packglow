from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import List, Optional

from app.auth import get_current_user
from app.models.user import User
from app.services.ai_chat import chat_with_ai

router = APIRouter(prefix="/chat", tags=["Chat"])


class ChatMessage(BaseModel):
    role: str  # "user" or "assistant"
    content: str


class ChatRequest(BaseModel):
    message: str
    history: List[ChatMessage] = []
    trip_context: Optional[str] = None  # e.g. "ทริปไปกรุงเทพ 3 วัน"


class ChatResponse(BaseModel):
    reply: str
    source: str  # "ai" or "fallback"


@router.post("", response_model=ChatResponse)
async def chat(request: ChatRequest, current_user: User = Depends(get_current_user)):
    reply = chat_with_ai(
        message=request.message,
        history=[(m.role, m.content) for m in request.history],
        trip_context=request.trip_context,
    )
    return ChatResponse(reply=reply, source="ai")
