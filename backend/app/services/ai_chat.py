"""
AI Chat service — uses OpenRouter for travel-related conversations.
"""

import logging
from typing import List, Optional, Tuple

from openai import OpenAI

from app.config import get_settings

logger = logging.getLogger("packglow")

SYSTEM_PROMPT = """You are Pack&Glow AI — a friendly Thai travel assistant. You help users with:
- คำแนะนำการเดินทาง (travel tips)
- สถานที่ท่องเที่ยวยอดนิยม (popular destinations)
- การจัดกระเป๋า (packing advice)
- สภาพอากาศและฤดูกาล (weather & seasons)
- อาหารและวัฒนธรรม (food & culture)
- ความปลอดภัยในการเดินทาง (travel safety)

Rules:
- ตอบเป็นภาษาไทยเป็นหลัก (answer primarily in Thai)
- ตอบกระชับ ไม่เกิน 3 ย่อหน้า (keep answers concise, max 3 paragraphs)
- ถ้าผู้ใช้ถามภาษาอังกฤษ ตอบภาษาอังกฤษได้
- แนะนำเฉพาะสิ่งที่เป็นประโยชน์จริง (recommend only genuinely useful things)"""

FALLBACK_RESPONSES = {
    "weather": "สภาพอากาศขึ้นอยู่กับฤดูกาลและภูมิภาค — แนะนำเช็คพยากรณ์อากาศก่อนเดินทางครับ",
    "packing": (
        "คำแนะนำทั่วไป: แบ่งของเป็นหมวดหมู่ "
        "(เสื้อผ้า, ของใช้ส่วนตัว, เอกสาร, ยา) "
        "แล้วเช็ครายการก่อนออกเดินทางครับ"
    ),
    "default": (
        "สวัสดีครับ! ผมคือ Pack&Glow AI "
        "พร้อมช่วยคุณวางแผนท่องเที่ยว — "
        "ถามเรื่องสถานที่, การจัดกระเป๋า, "
        "อาหาร หรือสภาพอากาศได้เลยครับ"
    ),
}


def chat_with_ai(
    message: str,
    history: Optional[List[Tuple[str, str]]] = None,
    trip_context: Optional[str] = None,
) -> str:
    """Send a chat message to OpenRouter and return the response."""
    settings = get_settings()

    if not settings.openrouter_api_key or settings.openrouter_api_key.startswith("ใส่"):
        return _fallback(message)

    try:
        client = OpenAI(
            api_key=settings.openrouter_api_key,
            base_url=settings.openrouter_base_url,
        )

        system_msg = SYSTEM_PROMPT
        if trip_context:
            system_msg += f"\n\nข้อมูลทริปปัจจุบัน: {trip_context}"

        messages = [{"role": "system", "content": system_msg}]

        if history:
            for role, content in history[-6:]:
                messages.append({"role": role, "content": content})

        messages.append({"role": "user", "content": message})

        response = client.chat.completions.create(
            model=settings.openrouter_model,
            messages=messages,
            temperature=0.7,
            max_tokens=500,
        )

        return response.choices[0].message.content.strip()

    except Exception as e:
        logger.warning(f"Chat API failed: {e}")
        return _fallback(message)


def _fallback(message: str) -> str:
    msg_lower = message.lower()
    if any(w in msg_lower for w in ["อากาศ", "weather", "ฝน", "ร้อน", "หนาว"]):
        return FALLBACK_RESPONSES["weather"]
    if any(w in msg_lower for w in ["กระเป๋า", "packing", "เตรียม", "ของ"]):
        return FALLBACK_RESPONSES["packing"]
    return FALLBACK_RESPONSES["default"]
