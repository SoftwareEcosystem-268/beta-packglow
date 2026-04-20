from typing import Dict, List, Set
from copy import deepcopy

from app.schemas.packing_assistant import (
    PackingAssistantRequest,
    PackingAssistantResponse,
    PackingListSection,
    OutfitSuggestion,
)

# ---------------------------------------------------------------------------
# Data: base items every trip gets
# ---------------------------------------------------------------------------
BASE_ITEMS: Dict[str, List[str]] = {
    "clothes": ["เสื้อยืด", "กางเกงชั้นใน", "ถุงเท้า", "กางเกงขายาว", "ชุดนอน"],
    "personal": ["แปรงสีฟัน", "ยาสีฟัน", "แชมพู", "โรลออน", "ผ้าเช็ดตัว"],
    "health": ["เซ็ตปฐมพยาบาล", "ยาส่วนตัว", "ยาแก้ปวด"],
    "electronics": ["สายชาร์จโทรศัพท์", "แบตเตอรี่สำรอง"],
    "documents": ["บัตรประชาชน", "ประกันเดินทาง"],
    "others": ["ขวดน้ำ", "ขนม"],
}

# ---------------------------------------------------------------------------
# Data: destination-specific items
# ---------------------------------------------------------------------------
DESTINATION_ITEMS: Dict[str, Dict[str, List[str]]] = {
    "beach": {
        "clothes": ["ชุดว่ายน้ำ", "แว่นกันแดด", "หมวกปีกกว้าง", "รองเท้าแตะ", "เสื้อคลุมบางๆ"],
        "health": ["ครีมกันแดด SPF50", "โลชั่นหลังออกแดด", "ยากันยุง"],
        "others": ["ผ้าเช็ดตัวชายหาด", "ถุงกันน้ำ"],
    },
    "mountain": {
        "clothes": ["เสื้อกันหนาว", "รองเท้าเดินป่า", "เสื้อผ้าป้อนกันหนาว", "เสื้อกันฝน", "หมวกไหมพรม"],
        "health": ["ยากันเมารถ/เมาเรือ", "แผ่นปิดแผล"],
        "others": ["ไม้เดินป่า", "ไฟฉายหัว"],
    },
    "city": {
        "clothes": ["รองเท้าเดินสบาย", "ชุดสมาร์ทแคชชวล", "เสื้อแจ็คเก็ตเบา"],
        "electronics": ["กล้องถ่ายรูป", "อะแดปเตอร์ปลั๊กสากล"],
    },
    "abroad": {
        "documents": ["หนังสือเดินทาง", "วีซ่า", "ใบนัดเดินทาง", "เงินสดต่างประเทศ"],
        "electronics": ["อะแดปเตอร์ปลั๊กสากล", "แอปแปลภาษา (offline)"],
        "clothes": ["เสื้อผ้าแต่งตัวเป็นชั้น", "รองเท้าเดินสบาย"],
        "personal": ["ถุงซิปล็อค", "ถุงใส่ของเปื้อน"],
    },
    "ceremony": {
        "clothes": ["ชุดทางการ", "รองเท้าหนัง/ส้นสูง", "เครื่องประดับ"],
        "personal": ["เซ็ตแต่งหน้า/ทำผม", "อุปกรณ์เก็บรูป"],
        "others": ["ของขวัญ/ของที่ระลึก"],
    },
}

# ---------------------------------------------------------------------------
# Data: activity-specific items (PRO only)
# ---------------------------------------------------------------------------
ACTIVITY_ITEMS: Dict[str, Dict[str, List[str]]] = {
    "hiking": {
        "clothes": ["รองเท้าเดินป่า", "เสื้อระบายเหงื่อ", "กางเกงขายาวสำหรับเดินป่า"],
        "others": ["เป้สะพายหลัง", "แผนที่เส้นทาง"],
    },
    "swimming": {
        "clothes": ["ชุดว่ายน้ำ", "แว่นว่ายน้ำ"],
        "others": ["ผ้าเช็ดตัว"],
    },
    "diving": {
        "clothes": ["ชุดดำน้ำ", "เสื้อแรชการ์ด"],
        "others": ["ใบรับรองดำน้ำ"],
    },
    "dinner": {
        "clothes": ["ชุดทางการ", "รองเท้าหนัง/ส้นสูง"],
    },
    "photography": {
        "electronics": ["กล้องถ่ายรูป", "แบตเตอรี่สำรอง", "การ์ดหน่วยความจำ"],
    },
    "cycling": {
        "clothes": ["กางเกงขี่จักรยาน", "เสื้อขี่จักรยาน"],
        "others": ["หมวกกันน็อค", "กุญแจล็อคจักรยาน"],
    },
    "skiing": {
        "clothes": ["เสื้อสกี", "กางเกงสกี", "ชุดชั้นในป้อนกันหนาว", "ถุงมือ", "แว่นตากันลม"],
    },
    "camping": {
        "others": ["เต้นท์", "ถุงนอน", "ไฟฉาย", "อุปกรณ์จุดไฟ"],
    },
    "business": {
        "clothes": ["ชุดสูท", "เสื้อเชิ้ต", "เน็กไท"],
        "documents": ["นามบัตร"],
    },
    "yoga": {
        "clothes": ["กางเกงโยคะ", "เสื้อยืดโยคะ"],
        "others": ["เสื่อโยคะ"],
    },
    "snorkeling": {
        "clothes": ["ชุดว่ายน้ำ", "เสื้อแรชการ์ด"],
        "others": ["หน้ากากดำน้ำตื้น", "ท่อหายใจ"],
    },
    "temple": {
        "clothes": ["ผ้าถุง/ผ้านุ่ง", "เสื้อมีแขน", "ถุงเท้า"],
        "others": ["เทียน/ธูป"],
    },
    "shopping": {
        "others": ["ถุงผ้าพับได้", "รายการของที่ต้องซื้อ"],
    },
}

# ---------------------------------------------------------------------------
# Data: outfit suggestions per destination (PRO only)
# ---------------------------------------------------------------------------
DESTINATION_OUTFITS: Dict[str, List[Dict]] = {
    "beach": [
        {
            "name": "Beach Casual",
            "items": ["เสื้อยืดสีอ่อน", "กางเกงขาสั้น", "รองเท้าแตะ", "แว่นกันแดด"],
            "style": "casual",
            "match_reason": "เหมาะกับอากาศร้อนริมทะเล ใส่สบาย ระบายอากาศดี",
        },
        {
            "name": "Sunset Dinner",
            "items": ["เดรสลำลอง/เสื้อเชิ้ต", "รองเท้าส้นต่ำ", "กำไลข้อมือ"],
            "style": "elegant",
            "match_reason": "ดูดีสำหรับดินเนอร์ริมทะเล ยังคงความสบาย",
        },
    ],
    "mountain": [
        {
            "name": "Trail Explorer",
            "items": ["เสื้อระบายเหงื่อ", "กางเกงเดินป่า", "รองเท้าเดินป่า", "เสื้อกันฝน"],
            "style": "sporty",
            "match_reason": "เตรียมพร้อมสำหรับเดินป่า กันฝนและระบายเหงื่อ",
        },
        {
            "name": "Campfire Evening",
            "items": ["เสื้อกันหนาว", "กางเกงขายาว", "รองเท้าผ้าใบ", "หมวกไหมพรม"],
            "style": "casual",
            "match_reason": "อบอุ่นสำหรับอากาศหนาวตอนเย็นบนภูเขา",
        },
    ],
    "city": [
        {
            "name": "City Walker",
            "items": ["เสื้อยืดคอกลม", "กางเกงยีนส์", "รองเท้าผ้าใบ", "กระเป๋าครอสบอดี้"],
            "style": "casual",
            "match_reason": "ใส่เดินเที่ยวเมืองสบายตลอดวัน",
        },
        {
            "name": "Night Out",
            "items": ["เสื้อเชิ้ต/เดรส", "กางเกงสแล็ค", "รองเท้าหนัง", "นาฬิกา"],
            "style": "elegant",
            "match_reason": "ดูดีสำหรับออกไปดินเนอร์หรือบาร์ในเมือง",
        },
    ],
    "abroad": [
        {
            "name": "Travel Ready",
            "items": ["เสื้อแจ็คเก็ต", "เสื้อยืด", "กางเกงยีนส์", "รองเท้าผ้าใบ", "กระเป๋าเป้"],
            "style": "casual",
            "match_reason": "พร้อมสำหรับเดินทางต่างประเทศ แต่งง่าย ไม่โดดเด่น",
        },
        {
            "name": "Formal Meeting",
            "items": ["ชุดสูท/เดรสทางการ", "รองเท้าหนัง", "กระเป๋าถือ"],
            "style": "formal",
            "match_reason": "เหมาะสำหรับประชุมหรืองานทางการในต่างประเทศ",
        },
    ],
    "ceremony": [
        {
            "name": "Ceremony Guest",
            "items": ["ชุดทางการ", "รองเท้าหนัง/ส้นสูง", "เครื่องประดับ", "กระเป๋าถือ"],
            "style": "formal",
            "match_reason": "แต่งตัวเหมาะสมกับงานพิธีการ",
        },
    ],
}


def _scale_quantity(item_name: str, duration: int) -> str:
    consumables = {
        "กางเกงชั้นใน": min(duration + 1, 14),
        "ถุงเท้า": min(duration + 1, 14),
        "เสื้อยืด": min(duration + 1, 10),
    }
    if item_name in consumables:
        return f"{item_name} x{consumables[item_name]}"
    return item_name


def generate_base_list(duration_days: int) -> Dict[str, List[str]]:
    items: Dict[str, List[str]] = {}
    for category, item_list in BASE_ITEMS.items():
        items[category] = [_scale_quantity(name, duration_days) for name in item_list]
    return items


def apply_destination(items: Dict[str, List[str]], destination_type: str) -> Dict[str, List[str]]:
    dest_items = DESTINATION_ITEMS.get(destination_type, {})
    result = deepcopy(items)
    for category, item_list in dest_items.items():
        existing: Set[str] = set(result.get(category, []))
        merged = list(result.get(category, []))
        for item in item_list:
            if item not in existing:
                merged.append(item)
                existing.add(item)
        result[category] = merged
    return result


def generate_pro_suggestions(activities: List[str]) -> List[str]:
    suggestions: List[str] = []
    seen: Set[str] = set()
    for activity in activities:
        key = activity.lower().strip()
        act_items = ACTIVITY_ITEMS.get(key, {})
        for category, item_list in act_items.items():
            for item in item_list:
                if item not in seen:
                    seen.add(item)
                    suggestions.append(f"{item} (สำหรับ{activity})")
    return suggestions


def generate_outfits(destination_type: str, activities: List[str]) -> List[OutfitSuggestion]:
    outfits = DESTINATION_OUTFITS.get(destination_type, [])
    result = []
    for o in outfits:
        result.append(OutfitSuggestion(
            name=o["name"],
            items=o["items"],
            style=o["style"],
            match_reason=o["match_reason"],
        ))

    # Add activity-specific outfits
    activity_outfit_map: Dict[str, Dict] = {
        "hiking": {
            "name": "Hiking Ready",
            "items": ["เสื้อระบายเหงื่อ", "กางเกงเดินป่า", "รองเท้าเดินป่า", "ถุงเท้ายาว"],
            "style": "sporty",
            "match_reason": "ออกแบบมาสำหรับเดินป่า ระบายเหงื่อ กันพับพื้นผิวขรุขระ",
        },
        "swimming": {
            "name": "Pool/Beach Day",
            "items": ["ชุดว่ายน้ำ", "เสื้อคลุม", "รองเท้าแตะ", "แว่นกันแดด"],
            "style": "casual",
            "match_reason": "พร้อมลงน้ำ สบาย แห้งเร็ว",
        },
        "dinner": {
            "name": "Elegant Dinner",
            "items": ["เสื้อเชิ้ต/เดรส", "กางเกงสแล็ค", "รองเท้าหนัง", "เครื่องประดับเรียบ"],
            "style": "elegant",
            "match_reason": "ดูดีแต่ไม่เวอร์ เหมาะกับร้านอาหาร",
        },
        "skiing": {
            "name": "Slope Ready",
            "items": ["เสื้อสกี", "กางเกงสกี", "ถุงมือ", "แว่นตากันลม", "หมวกไหมพรม"],
            "style": "sporty",
            "match_reason": "กันหนาวเต็มที่สำหรับสกี",
        },
    }
    for activity in activities:
        key = activity.lower().strip()
        if key in activity_outfit_map:
            o = activity_outfit_map[key]
            result.append(OutfitSuggestion(
                name=o["name"],
                items=o["items"],
                style=o["style"],
                match_reason=o["match_reason"],
            ))
    return result


def generate_packing_list(request: PackingAssistantRequest) -> PackingAssistantResponse:
    # Step 1: base list with quantity scaling
    items = generate_base_list(request.duration_days)

    # Step 2: merge destination-specific items
    items = apply_destination(items, request.destination_type)

    packing_list = PackingListSection(**items)

    # FREE tier: return only the packing list
    if request.user_tier == "free":
        return PackingAssistantResponse(packing_list=packing_list)

    # PRO tier: add custom suggestions and outfits
    custom_suggestions = generate_pro_suggestions(request.activities)
    outfits = generate_outfits(request.destination_type, request.activities)

    return PackingAssistantResponse(
        packing_list=packing_list,
        custom_suggestions=custom_suggestions,
        outfits=outfits,
    )
