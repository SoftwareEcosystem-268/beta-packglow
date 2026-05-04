"""
Weather API — Real OpenWeatherMap + Fallback
=============================================
ดึงข้อมูลอากาศจริงจาก OpenWeatherMap API (ฟรี 1,000 calls/วัน)
ถ้าไม่มี API key หรือเรียกไม่ได้ จะใช้ข้อมูล fallback แทน
"""

import os
from fastapi import APIRouter
import httpx

router = APIRouter(prefix="/weather", tags=["Weather"])

OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY", "")

DESTINATION_COORDS = {
    "beach": {"lat": 7.88, "lon": 98.37, "name": "Phuket"},
    "mountain": {"lat": 18.79, "lon": 98.96, "name": "Chiang Mai"},
    "city": {"lat": 13.76, "lon": 100.50, "name": "Bangkok"},
    "abroad": {"lat": 48.86, "lon": 2.35, "name": "Paris"},
    "ceremony": {"lat": 13.76, "lon": 100.50, "name": "Bangkok"},
}

FALLBACK = {
    "beach": {"temp_c": 32, "feels_like_c": 35, "humidity": 75, "rain_chance": 20, "wind_kph": 15, "condition": "Sunny", "condition_th": "แดดออก", "icon": "sun", "clothing_tips": ["ใส่เสื้อผ้าบางเบา สีอ่อน", "เตรียมหมวกและครีมกันแดด", "รองเท้าแตะหรือรองเท้าเปิด"]},
    "mountain": {"temp_c": 18, "feels_like_c": 15, "humidity": 60, "rain_chance": 40, "wind_kph": 25, "condition": "Partly Cloudy", "condition_th": "เมฆบางส่วน", "icon": "cloud-sun", "clothing_tips": ["เตรียมเสื้อกันหนาว", "รองเท้าเดินป่ากันลื่น", "เสื้อกันฝนติดตัวไปด้วย"]},
    "city": {"temp_c": 28, "feels_like_c": 30, "humidity": 65, "rain_chance": 30, "wind_kph": 10, "condition": "Clear", "condition_th": "ท้องฟ้าโล่ง", "icon": "sun", "clothing_tips": ["ใส่เสื้อผ้าสบาย ไม่หนาเกินไป", "เตรียมร่มติดตัว", "รองเท้าผ้าให้เดินสบาย"]},
    "abroad": {"temp_c": 15, "feels_like_c": 12, "humidity": 70, "rain_chance": 45, "wind_kph": 20, "condition": "Cloudy", "condition_th": "เมฆมาก", "icon": "cloud", "clothing_tips": ["เตรียมเสื้อโค้ทหรือแจ็คเก็ต", "เสื้อผ้าเป็นชั้น ๆ ใส่ง่าย", "รองเท้าหนังหรือรองเท้าปิด"]},
    "ceremony": {"temp_c": 30, "feels_like_c": 33, "humidity": 70, "rain_chance": 25, "wind_kph": 8, "condition": "Sunny", "condition_th": "แดดออก", "icon": "sun", "clothing_tips": ["ใส่ชุดสุภาพสีอ่อนหรือสีพื้น", "เตรียมเสื้อผ้าสำรอง", "รองเท้าสุภาพ"]},
}

CONDITION_TH = {
    "Clear": "ท้องฟ้าโล่ง", "Sunny": "แดดออก", "Clouds": "เมฆมาก",
    "Partly Cloudy": "เมฆบางส่วน", "Rain": "ฝนตก", "Drizzle": "ฝนปรอยๆ",
    "Thunderstorm": "พายุฝนฟ้าคะนอง", "Snow": "หิมะตก", "Mist": "หมอก",
    "Fog": "หมอกหนา", "Haze": "หมอกควัน", "Overcast": "เมฆมาก",
}

def _tips(temp_c: float, rain_chance: float) -> list[str]:
    tips = []
    if temp_c >= 30:
        tips += ["ใส่เสื้อผ้าบางเบา สีอ่อน", "เตรียมหมวกและครีมกันแดด"]
    elif temp_c >= 20:
        tips += ["ใส่เสื้อผ้าสบาย ไม่หนาเกินไป"]
    else:
        tips += ["เตรียมเสื้อโค้ทหรือแจ็คเก็ต", "เสื้อผ้าเป็นชั้น ๆ ใส่ง่าย"]
    if rain_chance > 50:
        tips.append("เตรียมร่มหรือเสื้อกันฝน")
    if temp_c < 15:
        tips.append("รองเท้าปิดกันหนาว")
    else:
        tips.append("รองเท้าสบายสำหรับเดิน")
    return tips


@router.get("/{destination_type}")
async def get_weather(destination_type: str, city: str = ""):
    """
    ดึงข้อมูลอากาศจริงจาก OpenWeatherMap
    - ถ้ามี ?city= จะค้นหาตามชื่อเมืองนั้นโดยตรง
    - ถ้าไม่มี จะใช้พิกัด default ตาม destination_type
    - ถ้าไม่มี API key จะใช้ fallback
    """
    if not OPENWEATHER_API_KEY:
        data = FALLBACK.get(destination_type, FALLBACK["city"])
        return {"destination_type": destination_type, "source": "fallback", **data}

    try:
        async with httpx.AsyncClient(timeout=10) as client:
            params = {"appid": OPENWEATHER_API_KEY, "units": "metric"}

            if city:
                params["q"] = city
            else:
                coords = DESTINATION_COORDS.get(destination_type, DESTINATION_COORDS["city"])
                params["lat"] = coords["lat"]
                params["lon"] = coords["lon"]

            resp = await client.get(
                "https://api.openweathermap.org/data/2.5/weather",
                params=params,
            )
            resp.raise_for_status()
            data = resp.json()

        temp_c = round(data["main"]["temp"])
        feels_like = round(data["main"]["feels_like"])
        humidity = data["main"]["humidity"]
        wind_kph = round(data["wind"]["speed"] * 3.6)
        condition = data["weather"][0]["main"]
        rain_chance = 0
        if "rain" in data:
            rain_chance = 60
        elif humidity > 80:
            rain_chance = 40

        location_name = data.get("name", city or DESTINATION_COORDS.get(destination_type, DESTINATION_COORDS["city"])["name"])

        return {
            "destination_type": destination_type,
            "source": "openweathermap",
            "location": location_name,
            "temp_c": temp_c,
            "feels_like_c": feels_like,
            "humidity": humidity,
            "rain_chance": rain_chance,
            "wind_kph": wind_kph,
            "condition": condition,
            "condition_th": CONDITION_TH.get(condition, condition),
            "icon": "sun" if "Clear" in condition or "Sunny" in condition else "cloud",
            "clothing_tips": _tips(temp_c, rain_chance),
        }
    except Exception:
        data = FALLBACK.get(destination_type, FALLBACK["city"])
        return {"destination_type": destination_type, "source": "fallback", **data}
