from fastapi import APIRouter, Depends

from app.auth import get_current_user
from app.models.user import User
from app.schemas.packing_assistant import (
    PackingAssistantRequest,
    PackingAssistantResponse,
)
from app.services.ai_packing import generate_packing_list

router = APIRouter(prefix="/packing-assistant", tags=["Packing Assistant"])


@router.post("/generate", response_model=PackingAssistantResponse, status_code=200)
async def generate_packing_suggestions(request: PackingAssistantRequest, current_user: User = Depends(get_current_user)):
    # Override client-sent tier with server-side truth
    request.user_tier = current_user.tier

    # Try to get weather info for better AI suggestions
    weather_info = None
    try:
        from app.routers.weather import get_weather
        weather_data = await get_weather(request.destination_type)
        weather_info = {
            "temp_c": weather_data.get("temp_c"),
            "humidity": weather_data.get("humidity"),
            "rain_chance": weather_data.get("rain_chance"),
            "condition_th": weather_data.get("condition_th"),
        }
    except Exception:
        pass

    return generate_packing_list(request, weather_info)
