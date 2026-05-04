"""
ไฟล์หลักของ FastAPI Application
====================

ไฟล์นี้เป็น entry point ของ API ทำหน้าที่:
- สร้าง FastAPI app instance
- ตั้งค่า CORS middleware (อนุญาตให้ frontend เรียก API ได้)
- ลงทะเบียน routers ทั้งหมด (health, users, trips)
- จัดการ lifespan (startup/shutdown) ของ application
"""

import logging
import time
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi.errors import RateLimitExceeded
from slowapi import _rate_limit_exceeded_handler
from slowapi.middleware import SlowAPIMiddleware

from app.config import get_settings
from app.database import init_db
from app.rate_limit import limiter
from app.routers import (
    health, users, trips, packing_items, checklists,
    outfit_suggestions, saved_outfits, templates,
    packing_assistant, weather, chat,
)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger("packglow")

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
    title=settings.app_name,
    version=settings.app_version,
    docs_url=f"{settings.api_prefix}/docs",
    redoc_url=f"{settings.api_prefix}/redoc",
    openapi_url=f"{settings.api_prefix}/openapi.json",
    lifespan=lifespan,
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception on {request.method} {request.url.path}: {exc}", exc_info=True)
    return JSONResponse(status_code=500, content={"detail": "Internal server error"})


@app.middleware("http")
async def log_requests(request: Request, call_next):
    start = time.time()
    response = await call_next(request)
    duration = time.time() - start
    logger.info(f"{request.method} {request.url.path} - {response.status_code} ({duration:.3f}s)")
    return response

# =============================================================================
# CORS Middleware
# =============================================================================
# ตั้งค่า CORS เพื่อให้ frontend สามารถเรียก API ได้ (Cross-Origin Resource Sharing)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.frontend_url,
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
        "http://labs89.hpc-ignite.org",
        "http://labs89.hpc-ignite.org:3002",
        "http://labs89.hpc-ignite.org/beta-packglow",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =============================================================================
# Routers - ลงทะเบียน API endpoints ทั้งหมด
# =============================================================================
app.include_router(health.router, prefix=settings.api_prefix)              # /api/v1/health
app.include_router(users.router, prefix=settings.api_prefix)               # /api/v1/users
app.include_router(trips.router, prefix=settings.api_prefix)               # /api/v1/trips
app.include_router(packing_items.router, prefix=settings.api_prefix)       # /api/v1/packing-items
app.include_router(checklists.router, prefix=settings.api_prefix)          # /api/v1/checklists
app.include_router(outfit_suggestions.router, prefix=settings.api_prefix)  # /api/v1/outfit-suggestions
app.include_router(saved_outfits.router, prefix=settings.api_prefix)       # /api/v1/saved-outfits
app.include_router(templates.router, prefix=settings.api_prefix)            # /api/v1/templates
app.include_router(packing_assistant.router, prefix=settings.api_prefix)    # /api/v1/packing-assistant
app.include_router(weather.router, prefix=settings.api_prefix)              # /api/v1/weather
app.include_router(chat.router, prefix=settings.api_prefix)                  # /api/v1/chat


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
