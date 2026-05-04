from typing import List, Literal
from pydantic import BaseModel, Field


class PackingAssistantRequest(BaseModel):
    destination_type: Literal["beach", "mountain", "city", "abroad", "ceremony"]
    duration_days: int = Field(ge=1, le=90)
    activities: List[str] = []
    user_tier: Literal["free", "pro"] = "free"


class PackingListSection(BaseModel):
    clothes: List[str] = []
    personal: List[str] = []
    health: List[str] = []
    electronics: List[str] = []
    documents: List[str] = []
    others: List[str] = []


class OutfitSuggestion(BaseModel):
    name: str
    items: List[str]
    style: str
    match_reason: str


class PackingAssistantResponse(BaseModel):
    packing_list: PackingListSection
    custom_suggestions: List[str] = []
    outfits: List[OutfitSuggestion] = []
