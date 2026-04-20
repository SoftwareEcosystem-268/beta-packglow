"""
ChecklistTemplate Schemas - Pydantic schemas สำหรับเทมเพลตรายการแพ็ค
"""

from pydantic import BaseModel, ConfigDict
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

    model_config = ConfigDict(from_attributes=True)
