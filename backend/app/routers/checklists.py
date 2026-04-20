"""
TripChecklists Router - API endpoints สำหรับ Trip Checklists
=============================================================

Router นี้จัดการ CRUD operations ของ Trip Checklists

Endpoints:
- POST /checklists/           -> สร้าง checklist item ใหม่
- GET /checklists/            -> ดู checklist items (filter ด้วย trip_id ได้)
- GET /checklists/{id}        -> ดู checklist item ตาม ID
- PATCH /checklists/{id}      -> อัพเดท checklist item
- DELETE /checklists/{id}     -> ลบ checklist item

Query Parameters:
- trip_id: Filter checklist โดย trip (optional)

Dependencies:
- database session (get_db)
- TripChecklist, Trip, PackingItem models
- TripChecklist schemas
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional
import uuid

from app.database import get_db
from app.models.packing import TripChecklist
from app.models.trip import Trip
from app.models.packing import PackingItem
from app.schemas.packing import TripChecklistCreate, TripChecklistUpdate, TripChecklistResponse, BulkChecklistRequest

router = APIRouter(prefix="/checklists", tags=["Trip Checklists"])


# =============================================================================
# POST /checklists/ - สร้าง checklist item ใหม่
# =============================================================================
@router.post("/", response_model=TripChecklistResponse, status_code=201)
async def create_checklist_item(
    checklist_data: TripChecklistCreate,
    db: AsyncSession = Depends(get_db)
):
    """
    สร้าง checklist item ใหม่

    Request body:
        {
            "trip_id": "uuid",
            "item_id": "uuid",  // optional
            "is_packed": false,
            "custom_note": "Buy before trip"
        }

    Errors:
        404: Trip not found (ถ้า trip_id ไม่ถูกต้อง)
    """
    # ตรวจสอบว่า trip มีอยู่จริง
    result = await db.execute(select(Trip).where(Trip.id == checklist_data.trip_id))
    if not result.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Trip not found")

    # ตรวจสอบว่า packing item มีอยู่จริง (ถ้ามีการระบุ)
    if checklist_data.item_id:
        result = await db.execute(
            select(PackingItem).where(PackingItem.id == checklist_data.item_id)
        )
        if not result.scalar_one_or_none():
            raise HTTPException(status_code=404, detail="Packing item not found")

    checklist = TripChecklist(
        trip_id=checklist_data.trip_id,
        item_id=checklist_data.item_id,
        is_packed=checklist_data.is_packed or False,
        custom_note=checklist_data.custom_note,
        quantity=checklist_data.quantity or 1,
        custom_item_name=checklist_data.custom_item_name,
        sort_order=checklist_data.sort_order or 0,
    )
    db.add(checklist)
    await db.commit()
    await db.refresh(checklist)
    return checklist


# =============================================================================
# GET /checklists/ - ดู checklist items ทั้งหมด
# =============================================================================
@router.get("/", response_model=List[TripChecklistResponse])
async def get_checklists(
    trip_id: Optional[uuid.UUID] = Query(None, description="Filter checklists โดย trip ID"),
    db: AsyncSession = Depends(get_db)
):
    """
    ดึง checklist items ทั้งหมด

    Query params:
        trip_id (optional): Filter เฉพาะ checklists ของ trip นี้

    Examples:
        GET /checklists/              -> ดูทุก checklists
        GET /checklists/?trip_id=xxx  -> ดู checklists ของ trip นั้น
    """
    query = select(TripChecklist)
    if trip_id:
        query = query.where(TripChecklist.trip_id == trip_id)
    result = await db.execute(query)
    checklists = result.scalars().all()
    return checklists


# =============================================================================
# GET /checklists/{checklist_id} - ดู checklist item ตาม ID
# =============================================================================
@router.get("/{checklist_id}", response_model=TripChecklistResponse)
async def get_checklist_item(
    checklist_id: uuid.UUID,
    db: AsyncSession = Depends(get_db)
):
    """
    ดึง checklist item ตาม ID

    Errors:
        404: Checklist item not found
    """
    result = await db.execute(
        select(TripChecklist).where(TripChecklist.id == checklist_id)
    )
    checklist = result.scalar_one_or_none()
    if not checklist:
        raise HTTPException(status_code=404, detail="Checklist item not found")
    return checklist


# =============================================================================
# PATCH /checklists/{checklist_id} - อัพเดท checklist item
# =============================================================================
@router.patch("/{checklist_id}", response_model=TripChecklistResponse)
async def update_checklist_item(
    checklist_id: uuid.UUID,
    checklist_data: TripChecklistUpdate,
    db: AsyncSession = Depends(get_db)
):
    """
    อัพเดท checklist item (partial update)

    Request body (ทุก fields optional):
        {
            "is_packed": true,
            "custom_note": "Packed in red bag"
        }

    Errors:
        404: Checklist item not found
    """
    result = await db.execute(
        select(TripChecklist).where(TripChecklist.id == checklist_id)
    )
    checklist = result.scalar_one_or_none()
    if not checklist:
        raise HTTPException(status_code=404, detail="Checklist item not found")

    update_data = checklist_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(checklist, key, value)

    await db.commit()
    await db.refresh(checklist)
    return checklist


# =============================================================================
# DELETE /checklists/{checklist_id} - ลบ checklist item
# =============================================================================
@router.delete("/{checklist_id}", status_code=204)
async def delete_checklist_item(
    checklist_id: uuid.UUID,
    db: AsyncSession = Depends(get_db)
):
    """
    ลบ checklist item ตาม ID

    Response:
        204 No Content

    Errors:
        404: Checklist item not found
    """
    result = await db.execute(
        select(TripChecklist).where(TripChecklist.id == checklist_id)
    )
    checklist = result.scalar_one_or_none()
    if not checklist:
        raise HTTPException(status_code=404, detail="Checklist item not found")

    await db.delete(checklist)
    await db.commit()


# =============================================================================
# PUT /checklists/bulk - Bulk save checklist items for a trip
# =============================================================================
@router.put("/bulk", response_model=List[TripChecklistResponse])
async def bulk_save_checklist(
    trip_id: uuid.UUID = Query(..., description="Trip ID to save checklist for"),
    data: BulkChecklistRequest = ...,
    db: AsyncSession = Depends(get_db)
):
    """
    Bulk save checklist items for a trip.
    - Items with an existing ID are updated.
    - Items without an ID are created.
    - Existing items not in the request are deleted.
    """
    result = await db.execute(select(Trip).where(Trip.id == trip_id))
    if not result.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Trip not found")

    # Fetch existing items
    result = await db.execute(
        select(TripChecklist).where(TripChecklist.trip_id == trip_id)
    )
    existing = {str(ci.id): ci for ci in result.scalars().all()}

    incoming_ids = set()
    for item_data in data.items:
        if item_data.id and str(item_data.id) in existing:
            # Update existing
            ci = existing[str(item_data.id)]
            ci.is_packed = item_data.is_packed or False
            ci.custom_note = item_data.custom_note
            ci.quantity = item_data.quantity or 1
            ci.custom_item_name = item_data.custom_item_name
            ci.sort_order = item_data.sort_order or 0
            incoming_ids.add(str(ci.id))
        else:
            # Create new
            ci = TripChecklist(
                trip_id=trip_id,
                item_id=item_data.item_id,
                is_packed=item_data.is_packed or False,
                custom_note=item_data.custom_note,
                quantity=item_data.quantity or 1,
                custom_item_name=item_data.custom_item_name,
                sort_order=item_data.sort_order or 0,
            )
            db.add(ci)
            incoming_ids.add("new")

    # Delete items not in request (only if they had IDs)
    for existing_id, ci in existing.items():
        if existing_id not in incoming_ids:
            await db.delete(ci)

    await db.commit()

    # Refresh and return all items
    result = await db.execute(
        select(TripChecklist).where(TripChecklist.trip_id == trip_id)
    )
    return result.scalars().all()
