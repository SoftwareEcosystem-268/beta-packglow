"""
AI Packing Assistant — OpenRouter Integration
=============================================
Uses OpenRouter.ai to generate personalized packing lists.
Falls back to rules-based if API is unavailable.
"""

import json
import logging
from typing import Optional

from openai import OpenAI

from app.config import get_settings
from app.schemas.packing_assistant import (
    PackingAssistantRequest,
    PackingAssistantResponse,
    PackingListSection,
    OutfitSuggestion,
)
from app.services.packing_rules import generate_packing_list as rules_based_generate

logger = logging.getLogger("packglow")

SYSTEM_PROMPT = """You are a travel packing assistant. Generate a personalized packing list based on the trip details provided.

IMPORTANT RULES:
- All item names MUST be in Thai language
- Scale quantities based on trip duration (e.g., "เสื้อยืด x6" for 5-day trip)
- Consider the weather conditions when suggesting items
- Be practical and specific

You MUST respond with ONLY a valid JSON object matching this exact structure (no markdown, no explanation):
{
  "packing_list": {
    "clothes": ["item1", "item2"],
    "personal": ["item1"],
    "health": ["item1"],
    "electronics": ["item1"],
    "documents": ["item1"],
    "others": ["item1"]
  },
  "custom_suggestions": ["suggestion1", "suggestion2"],
  "outfits": [
    {
      "name": "Outfit name in Thai",
      "items": ["item1", "item2"],
      "style": "casual",
      "match_reason": "Reason in Thai why this outfit fits the trip"
    }
  ]
}

For FREE tier (user_tier = "free"): omit custom_suggestions and outfits, return only packing_list.
For PRO tier (user_tier = "pro"): include all fields."""


def _build_user_prompt(request: PackingAssistantRequest, weather_info: Optional[dict] = None) -> str:
    dest_labels = {
        "beach": "ทะเล", "mountain": "ภูเขา", "city": "เมือง", "abroad": "ต่างประเทศ", "ceremony": "พิธีการ",
    }
    activity_labels = {
        "photography": "ถ่ายรูป", "swimming": "ว่ายน้ำ", "snorkeling": "ดำน้ำตื้น",
        "diving": "ดำน้ำลึก", "hiking": "เดินป่า", "dinner": "ดินเนอร์",
        "shopping": "ช้อปปิ้ง", "cycling": "ปั่นจักรยาน", "temple": "วัด/ศาสนสถาน",
        "yoga": "โยคะ", "camping": "แคมป์ปิ้ง", "skiing": "สกี", "business": "ธุรกิจ",
    }

    parts = [
        f"ประเภทสถานที่: {dest_labels.get(request.destination_type, request.destination_type)}",
        f"จำนวนวัน: {request.duration_days} วัน",
        f"ระดับผู้ใช้: {request.user_tier}",
    ]

    if request.activities:
        acts = ", ".join(activity_labels.get(a, a) for a in request.activities)
        parts.append(f"กิจกรรม: {acts}")

    if weather_info:
        parts.append(
            f"สภาพอากาศ: {weather_info.get('temp_c', '?')}°C, "
            f"ความชื้น {weather_info.get('humidity', '?')}%, "
            f"โอกาสฝน {weather_info.get('rain_chance', '?')}%, "
            f"{weather_info.get('condition_th', '')}"
        )

    return "\n".join(parts)


def generate_with_ai(
    request: PackingAssistantRequest,
    weather_info: Optional[dict] = None,
) -> Optional[PackingAssistantResponse]:
    """Try to generate packing list using OpenRouter. Returns None on failure."""
    settings = get_settings()

    if not settings.openrouter_api_key or settings.openrouter_api_key.startswith("ใส่"):
        return None

    try:
        client = OpenAI(
            api_key=settings.openrouter_api_key,
            base_url=settings.openrouter_base_url,
        )

        user_msg = _build_user_prompt(request, weather_info)

        model = settings.openrouter_model
        # Append :online to enable web search via OpenRouter
        if settings.openrouter_web_search and not model.endswith(":online"):
            model = f"{model}:online"

        response = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_msg},
            ],
            temperature=0.7,
            max_tokens=2000,
        )

        content = response.choices[0].message.content.strip()

        # Strip markdown code fences if present
        if content.startswith("```"):
            content = content.split("\n", 1)[1] if "\n" in content else content[3:]
        if content.endswith("```"):
            content = content[:-3]
        content = content.strip()
        if content.startswith("json"):
            content = content[4:].strip()

        data = json.loads(content)

        packing_list = PackingListSection(**data.get("packing_list", {}))

        if request.user_tier == "free":
            return PackingAssistantResponse(packing_list=packing_list)

        outfits = [OutfitSuggestion(**o) for o in data.get("outfits", [])]
        custom_suggestions = data.get("custom_suggestions", [])

        return PackingAssistantResponse(
            packing_list=packing_list,
            custom_suggestions=custom_suggestions,
            outfits=outfits,
        )

    except Exception as e:
        logger.warning(f"OpenRouter API failed, falling back to rules: {e}")
        return None


def generate_packing_list(
    request: PackingAssistantRequest,
    weather_info: Optional[dict] = None,
) -> PackingAssistantResponse:
    """Generate packing list: try AI first, fall back to rules-based."""
    ai_result = generate_with_ai(request, weather_info)
    if ai_result is not None:
        logger.info("Packing list generated with OpenRouter AI")
        return ai_result

    logger.info("Packing list generated with rules-based fallback")
    return rules_based_generate(request)
