"""
การตั้งค่าของ Application
=====================

ไฟล์นี้เก็บการตั้งค่าทั้งหมดของ application โดยใช้ Pydantic Settings
การตั้งค่าถูกโหลดจาก:
1. Environment variables (.env หรือ system)
2. Default values (ถ้าไม่มีใน .env)
3. Validated โดย Pydantic

ตัวอย่างการใช้งาน:
    from app.config import get_settings
    settings = get_settings()
    print(settings.database_url)
"""

from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """
    คลาสเก็บการตั้งค่าทั้งหมดของ application

    Attributes:
        app_name: ชื่อของ API (แสดงใน docs)
        app_version: เวอร์ชันของ API
        debug: เปิดโหมด debug (แสดง SQL queries)
        api_prefix: Prefix ของ API endpoints (เช่น /api/v1)

        frontend_url: URL ของ frontend (ใช้สำหรับ CORS)
        database_url: URL สำหรับเชื่อมต่อ database
    """

    # =========================================================================
    # Application Settings
    # =========================================================================
    app_name: str = "Pack&Glow API"
    app_version: str = "1.0.0"
    debug: bool = True                    # เปิดโหมด debug (แสดง SQL queries ใน console)
    api_prefix: str = "/api/v1"         # Prefix ของ endpoints

    # =========================================================================
    # CORS Settings
    # =========================================================================
    secret_key: str  # REQUIRED — must be set in .env or environment
    access_token_expire_minutes: int = 60  # 1 hour, not 24h

    # =========================================================================
    # CORS Settings
    # =========================================================================
    frontend_url: str = "http://localhost:3000"  # URL ของ frontend

    # =========================================================================
    # Database Settings
    # =========================================================================
    # รองรับทั้ง PostgreSQL (Supabase) และ SQLite (สำหรับ testing)
    # ตัวอย่าง PostgreSQL: postgresql://user:pass@host:5432/db
    # ตัวอย่าง SQLite: sqlite+aiosqlite:///./packglow.db
    database_url: str = "sqlite+aiosqlite:///./packglow.db"

    # =========================================================================
    # OpenRouter AI Settings
    # =========================================================================
    openrouter_api_key: str = ""
    openrouter_base_url: str = "https://openrouter.ai/api/v1"
    openrouter_model: str = "openai/gpt-4.1-nano"
    openrouter_web_search: bool = True

    # =========================================================================
    # Pydantic Settings Configuration
    # =========================================================================
    model_config = {
        "env_file": ".env",      # อ่านค่าจากไฟล์ .env
        "extra": "ignore",      # ไม่สนใจ env vars ที่ไม่ได้ใช้
        "case_sensitive": False  # ไม่สนใจ case ของ key names
    }


@lru_cache
def get_settings() -> Settings:
    """
    ดึงการตั้งค่า (cached)

    ใช้ @lru_cache เพื่อ cache ผลลัพธ์์
    การเรียกครั้งแรกจะสร้าง instance ใหม่
    การเรียกครั้งต่อไปจะ return instance เดิม

    Returns:
        Settings: instance ของ Settings class
    """
    return Settings()
