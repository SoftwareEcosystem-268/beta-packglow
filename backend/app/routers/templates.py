"""
Templates Router - API endpoints สำหรับ Checklist Templates
===========================================================

Endpoints:
- POST /templates/           -> บันทึกเทมเพลตใหม่
- GET /templates/            -> ดูเทมเพลตทั้งหมดของผู้ใช้
- DELETE /templates/{id}     -> ลบเทมเพลต
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional
import uuid

from app.database import get_db
from app.auth import get_current_user
from app.models.checklist_template import ChecklistTemplate
from app.models.user import User
from app.schemas.checklist_template import ChecklistTemplateCreate, ChecklistTemplateResponse

router = APIRouter(prefix="/templates", tags=["Checklist Templates"])


# =============================================================================
# POST /templates/ - บันทึกเทมเพลตใหม่
# =============================================================================
@router.post("/", response_model=ChecklistTemplateResponse, status_code=201)
async def create_template(
    template_data: ChecklistTemplateCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(select(User).where(User.id == template_data.user_id))
    if not result.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="User not found")

    template = ChecklistTemplate(
        user_id=template_data.user_id,
        name=template_data.name,
        items=[item.model_dump() for item in template_data.items],
    )
    db.add(template)
    await db.commit()
    await db.refresh(template)
    return template


# =============================================================================
# GET /templates/ - ดูเทมเพลตทั้งหมดของผู้ใช้
# =============================================================================
@router.get("/", response_model=List[ChecklistTemplateResponse])
async def get_templates(
    user_id: Optional[uuid.UUID] = Query(None, description="Filter เทมเพลตโดย user ID"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = select(ChecklistTemplate).order_by(ChecklistTemplate.created_at.desc())
    if user_id:
        query = query.where(ChecklistTemplate.user_id == user_id)
    result = await db.execute(query)
    return result.scalars().all()


# =============================================================================
# DELETE /templates/{template_id} - ลบเทมเพลต
# =============================================================================
@router.delete("/{template_id}", status_code=204)
async def delete_template(
    template_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(
        select(ChecklistTemplate).where(ChecklistTemplate.id == template_id)
    )
    template = result.scalar_one_or_none()
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")

    await db.delete(template)
    await db.commit()
