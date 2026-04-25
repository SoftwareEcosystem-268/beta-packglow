"""
SavedOutfits Router - API endpoints สำหรับ Saved Outfits
==========================================================

Router นี้จัดการ CRUD operations ของ Saved Outfits

Endpoints:
- POST /saved-outfits/           -> บันทึก outfit
- GET /saved-outfits/            -> ดู saved outfits (filter ด้วย user_id)
- GET /saved-outfits/{id}        -> ดู saved outfit ตาม ID
- DELETE /saved-outfits/{id}     -> ลบ saved outfit

Query Parameters:
- user_id: Filter saved outfits โดย user (required for GET list)

Dependencies:
- database session (get_db)
- SavedOutfit, User, OutfitSuggestion models
- SavedOutfit schemas
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from sqlalchemy.exc import IntegrityError
from typing import List
import uuid

from app.database import get_db
from app.auth import get_current_user
from app.models.outfit import SavedOutfit, OutfitSuggestion
from app.models.user import User
from app.schemas.outfit import SavedOutfitCreate, SavedOutfitResponse

router = APIRouter(prefix="/saved-outfits", tags=["Saved Outfits"])


# =============================================================================
# POST /saved-outfits/ - บันทึก outfit
# =============================================================================
@router.post("/", response_model=SavedOutfitResponse, status_code=201)
async def save_outfit(
    saved_data: SavedOutfitCreate,
    user_id: uuid.UUID = Query(..., description="UUID ของ user ที่บันทึก"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    บันทึก outfit

    Query params:
        user_id: UUID ของ user

    Request body:
        {
            "outfit_id": "uuid"
        }

    Errors:
        404: User not found / Outfit suggestion not found
    """
    # ตรวจสอบว่า user มีอยู่จริง
    result = await db.execute(select(User).where(User.id == user_id))
    if not result.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="User not found")

    # ตรวจสอบว่า outfit มีอยู่จริง
    result = await db.execute(
        select(OutfitSuggestion).where(OutfitSuggestion.id == saved_data.outfit_id)
    )
    if not result.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Outfit suggestion not found")

    saved = SavedOutfit(
        user_id=user_id,
        outfit_id=saved_data.outfit_id,
    )
    db.add(saved)
    try:
        await db.commit()
    except IntegrityError:
        await db.rollback()
        raise HTTPException(status_code=409, detail="Outfit already saved")
    await db.refresh(saved)

    # Eager load outfit relationship
    result = await db.execute(
        select(SavedOutfit)
        .options(selectinload(SavedOutfit.outfit))
        .where(SavedOutfit.id == saved.id)
    )
    return result.scalar_one()


# =============================================================================
# GET /saved-outfits/ - ดู saved outfits
# =============================================================================
@router.get("/", response_model=List[SavedOutfitResponse])
async def get_saved_outfits(
    user_id: uuid.UUID = Query(..., description="UUID ของ user"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    ดึง saved outfits ของ user

    Query params:
        user_id: UUID ของ user (required)

    Examples:
        GET /saved-outfits/?user_id=xxx  -> ดู saved outfits ของ user
    """
    query = (
        select(SavedOutfit)
        .options(selectinload(SavedOutfit.outfit))
        .where(SavedOutfit.user_id == user_id)
    )
    result = await db.execute(query)
    saved_outfits = result.scalars().all()
    return saved_outfits


# =============================================================================
# GET /saved-outfits/{saved_id} - ดู saved outfit ตาม ID
# =============================================================================
@router.get("/{saved_id}", response_model=SavedOutfitResponse)
async def get_saved_outfit(
    saved_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    ดึง saved outfit ตาม ID

    Errors:
        404: Saved outfit not found
    """
    result = await db.execute(
        select(SavedOutfit)
        .options(selectinload(SavedOutfit.outfit))
        .where(SavedOutfit.id == saved_id)
    )
    saved = result.scalar_one_or_none()
    if not saved:
        raise HTTPException(status_code=404, detail="Saved outfit not found")
    return saved


# =============================================================================
# DELETE /saved-outfits/{saved_id} - ลบ saved outfit
# =============================================================================
@router.delete("/{saved_id}", status_code=204)
async def delete_saved_outfit(
    saved_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    ลบ saved outfit ตาม ID

    Response:
        204 No Content

    Errors:
        404: Saved outfit not found
    """
    result = await db.execute(
        select(SavedOutfit).where(SavedOutfit.id == saved_id)
    )
    saved = result.scalar_one_or_none()
    if not saved:
        raise HTTPException(status_code=404, detail="Saved outfit not found")

    await db.delete(saved)
    await db.commit()
