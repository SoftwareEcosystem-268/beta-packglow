"""
PackingItems Router - API endpoints สำหรับ Packing Items
=========================================================

Router นี้จัดการ CRUD operations ของ Packing Items

Endpoints:
- POST /packing-items/      -> สร้าง packing item ใหม่
- GET /packing-items/       -> ดู packing items ทั้งหมด
- GET /packing-items/{id}   -> ดู packing item ตาม ID
- DELETE /packing-items/{id} -> ลบ packing item

Dependencies:
- database session (get_db)
- PackingItem model
- PackingItem schemas (PackingItemCreate, PackingItemResponse)
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_
from typing import List, Optional
import uuid

from app.database import get_db
from app.auth import get_current_user
from app.models.user import User
from app.models.packing import PackingItem
from app.schemas.packing import PackingItemCreate, PackingItemResponse

router = APIRouter(prefix="/packing-items", tags=["Packing Items"])


# =============================================================================
# POST /packing-items/ - สร้าง packing item ใหม่
# =============================================================================
@router.post("/", response_model=PackingItemResponse, status_code=201)
async def create_packing_item(
    item_data: PackingItemCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    สร้าง packing item ใหม่

    Request body:
        {
            "name": "Sunscreen SPF50",
            "category": "toiletries",
            "destination_types": ["beach", "abroad"],
            "is_weather_dependent": true
        }

    Response:
        {
            "id": "uuid",
            "name": "Sunscreen SPF50",
            "category": "toiletries",
            "destination_types": ["beach", "abroad"],
            "is_weather_dependent": true
        }
    """
    item = PackingItem(
        name=item_data.name,
        category=item_data.category,
        destination_types=item_data.destination_types or [],
        is_weather_dependent=item_data.is_weather_dependent,
        user_id=item_data.user_id,
    )
    db.add(item)
    await db.commit()
    await db.refresh(item)
    return item


# =============================================================================
# GET /packing-items/ - ดู packing items ทั้งหมด
# =============================================================================
@router.get("/", response_model=List[PackingItemResponse])
async def get_packing_items(
    user_id: Optional[uuid.UUID] = Query(None, description="Filter: system items + user's custom items"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = select(PackingItem)
    if user_id:
        query = query.where(or_(PackingItem.user_id.is_(None), PackingItem.user_id == user_id))
    result = await db.execute(query)
    items = result.scalars().all()
    return items


# =============================================================================
# GET /packing-items/{item_id} - ดู packing item ตาม ID
# =============================================================================
@router.get("/{item_id}", response_model=PackingItemResponse)
async def get_packing_item(
    item_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    ดึง packing item ตาม ID

    Path params:
        item_id: UUID ของ packing item

    Errors:
        404: Packing item not found
    """
    result = await db.execute(select(PackingItem).where(PackingItem.id == item_id))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Packing item not found")
    return item


# =============================================================================
# DELETE /packing-items/{item_id} - ลบ packing item
# =============================================================================
@router.delete("/{item_id}", status_code=204)
async def delete_packing_item(
    item_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    ลบ packing item ตาม ID

    Path params:
        item_id: UUID ของ packing item ที่ต้องการลบ

    Response:
        204 No Content

    Errors:
        404: Packing item not found
    """
    result = await db.execute(select(PackingItem).where(PackingItem.id == item_id))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Packing item not found")

    await db.delete(item)
    await db.commit()
