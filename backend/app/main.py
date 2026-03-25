"""
ไฟล์หลักของ FastAPI Application
====================

ไฟล์นี้เป็น entry point ของ API ทำหน้าที่:
- สร้าง FastAPI app instance
- ตั้งค่า CORS middleware (อนุญาตให้ frontend เรียก API ได้)
- ลงทะเบียน routers ทั้งหมด (health, users, trips)
- จัดการ lifespan (startup/shutdown) ของ application
"""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.database import init_db
from app.routers import health, users, trips

# โหลดการตั้งค่าจาก config.py
settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    จัดการวงจรชีวิตของ application

    - Startup: เชื่อมต่อ database และสร้าง tables
    - Shutdown: ปิดการเชื่อมต่อ (ถ้าต้องการ)
    """
    # Startup - เริ่มต้นระบบ
    await init_db()
    yield
    # Shutdown - ปิดระบบ (ถ้าต้องการ cleanup)


# สร้าง FastAPI application instance
app = FastAPI(
    title=settings.app_name,        # ชื่อ API ที่แสดงใน docs
    version=settings.app_version,   # เวอร์ชันของ API
    docs_url=f"{settings.api_prefix}/docs",      # URL ของ Swagger UI
    redoc_url=f"{settings.api_prefix}/redoc",    # URL ของ ReDoc
    openapi_url=f"{settings.api_prefix}/openapi.json",  # URL ของ OpenAPI schema
    lifespan=lifespan,  # ฟังก์ชันจัดการ startup/shutdown
)

# =============================================================================
# CORS Middleware
# =============================================================================
# ตั้งค่า CORS เพื่อให้ frontend สามารถเรียก API ได้ (Cross-Origin Resource Sharing)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url],  # อนุญาตเฉพาะ URL ของ frontend
    allow_credentials=True,                   # อนุญาตส่ง cookies/credentials
    allow_methods=["*"],                     # อนุญาตทุก HTTP methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],                     # อนุญาตทุก headers
)

# =============================================================================
# Routers - ลงทะเบียน API endpoints ทั้งหมด
# =============================================================================
app.include_router(health.router, prefix=settings.api_prefix)  # /api/v1/health
app.include_router(users.router, prefix=settings.api_prefix)   # /api/v1/users
app.include_router(trips.router, prefix=settings.api_prefix)   # /api/v1/trips


# =============================================================================
# Root Endpoint
# =============================================================================
@app.get("/")
def root() -> dict[str, str]:
    """
    Root endpoint - แสดงข้อความต้อนรับ และลิงก์ไปยัง API documentation

    Returns:
        dict: ข้อความต้อนรับและ URL ของ docs
    """
    return {"message": "Welcome to Pack&Glow API", "docs": f"{settings.api_prefix}/docs"}
