"""
OutfitSuggestions Router - API endpoints สำหรับ Outfit Suggestions
====================================================================

Router นี้จัดการ CRUD operations ของ Outfit Suggestions

Endpoints:
- POST /outfit-suggestions/      -> สร้าง outfit suggestion ใหม่
- GET /outfit-suggestions/       -> ดู outfit suggestions ทั้งหมด
- GET /outfit-suggestions/{id}   -> ดู outfit suggestion ตาม ID
- DELETE /outfit-suggestions/{id} -> ลบ outfit suggestion

Dependencies:
- database session (get_db)
- OutfitSuggestion model
- OutfitSuggestion schemas
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
import uuid

from app.database import get_db
from app.auth import get_current_user
from app.models.user import User
from app.models.outfit import OutfitSuggestion
from app.schemas.outfit import OutfitSuggestionCreate, OutfitSuggestionResponse

router = APIRouter(prefix="/outfit-suggestions", tags=["Outfit Suggestions"])


# =============================================================================
# POST /outfit-suggestions/ - สร้าง outfit suggestion ใหม่
# =============================================================================
@router.post("/", response_model=OutfitSuggestionResponse, status_code=201)
async def create_outfit_suggestion(
    outfit_data: OutfitSuggestionCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    สร้าง outfit suggestion ใหม่

    Request body:
        {
            "destination_type": "beach",
            "occasion": "day",
            "weather_condition": "hot",
            "description": "Light summer dress with hat",
            "image_url": "https://example.com/outfit.jpg",
            "style_tags": ["casual", "minimal", "beach"]
        }
    """
    outfit = OutfitSuggestion(
        destination_type=outfit_data.destination_type,
        occasion=outfit_data.occasion,
        weather_condition=outfit_data.weather_condition,
        description=outfit_data.description,
        image_url=outfit_data.image_url,
        style_tags=outfit_data.style_tags or [],
        gender=outfit_data.gender,
        season=outfit_data.season,
    )
    db.add(outfit)
    await db.commit()
    await db.refresh(outfit)
    return outfit


# =============================================================================
# GET /outfit-suggestions/ - ดู outfit suggestions ทั้งหมด
# =============================================================================
@router.get("/", response_model=List[OutfitSuggestionResponse])
async def get_outfit_suggestions(db: AsyncSession = Depends(get_db)):
    """
    ดึง outfit suggestions ทั้งหมด

    Response:
        [
            {
                "id": "uuid",
                "destination_type": "beach",
                "occasion": "day",
                "weather_condition": "hot",
                "description": "...",
                "image_url": "...",
                "style_tags": [...]
            },
            ...
        ]
    """
    result = await db.execute(select(OutfitSuggestion))
    outfits = result.scalars().all()
    return outfits


# =============================================================================
# GET /outfit-suggestions/{outfit_id} - ดู outfit suggestion ตาม ID
# =============================================================================
@router.get("/{outfit_id}", response_model=OutfitSuggestionResponse)
async def get_outfit_suggestion(
    outfit_id: uuid.UUID,
    db: AsyncSession = Depends(get_db)
):
    """
    ดึง outfit suggestion ตาม ID

    Errors:
        404: Outfit suggestion not found
    """
    result = await db.execute(
        select(OutfitSuggestion).where(OutfitSuggestion.id == outfit_id)
    )
    outfit = result.scalar_one_or_none()
    if not outfit:
        raise HTTPException(status_code=404, detail="Outfit suggestion not found")
    return outfit


# =============================================================================
# DELETE /outfit-suggestions/{outfit_id} - ลบ outfit suggestion
# =============================================================================
@router.delete("/{outfit_id}", status_code=204)
async def delete_outfit_suggestion(
    outfit_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    ลบ outfit suggestion ตาม ID

    Response:
        204 No Content

    Errors:
        404: Outfit suggestion not found
    """
    result = await db.execute(
        select(OutfitSuggestion).where(OutfitSuggestion.id == outfit_id)
    )
    outfit = result.scalar_one_or_none()
    if not outfit:
        raise HTTPException(status_code=404, detail="Outfit suggestion not found")

    await db.delete(outfit)
    await db.commit()
