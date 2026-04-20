"""
ChecklistTemplate Schemas - Pydantic schemas สำหรับเทมเพลตรายการแพ็ค
"""

from pydantic import BaseModel
from datetime import datetime
from uuid import UUID
from typing import Optional, List


class ChecklistTemplateItem(BaseModel):
    name: str
    category: str
    quantity: Optional[int] = 1


class ChecklistTemplateCreate(BaseModel):
    user_id: UUID
    name: str
    items: List[ChecklistTemplateItem]


class ChecklistTemplateResponse(BaseModel):
    id: UUID
    user_id: UUID
    name: str
    items: List[ChecklistTemplateItem]
    created_at: datetime

    class Config:
        from_attributes = True
