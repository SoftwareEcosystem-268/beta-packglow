"""
Unit tests for rules-based packing service (packing_rules.py)
"""

from app.schemas.packing_assistant import PackingAssistantRequest
from app.services.packing_rules import (
    generate_base_list,
    apply_destination,
    generate_pro_suggestions,
    generate_outfits,
    generate_packing_list,
)


def _req(destination="beach", days=3, activities=None, tier="free"):
    return PackingAssistantRequest(
        destination_type=destination,
        duration_days=days,
        activities=activities or [],
        user_tier=tier,
    )


# --- generate_base_list ---

def test_generate_base_list_has_all_categories():
    result = generate_base_list(3)
    for cat in ("clothes", "personal", "health", "electronics", "documents", "others"):
        assert cat in result
        assert isinstance(result[cat], list)
        assert len(result[cat]) > 0


def test_generate_base_list_scales_quantities():
    result = generate_base_list(5)
    # Underwear should be x6 (5+1)
    underwear = [i for i in result["clothes"] if "กางเกงชั้นใน" in i]
    assert len(underwear) == 1
    assert "x6" in underwear[0]


def test_generate_base_list_caps_quantity_at_14():
    result = generate_base_list(30)
    underwear = [i for i in result["clothes"] if "กางเกงชั้นใน" in i]
    assert "x14" in underwear[0]


def test_generate_base_list_non_consumable_no_suffix():
    result = generate_base_list(3)
    # "แปรงสีฟัน" is not consumable, should not have x suffix
    assert "แปรงสีฟัน" in result["personal"]


# --- apply_destination ---

def test_apply_destination_beach():
    base = generate_base_list(3)
    result = apply_destination(base, "beach")
    all_items = [item for cat in result.values() for item in cat]
    assert "ชุดว่ายน้ำ" in all_items
    assert "ครีมกันแดด SPF50" in all_items


def test_apply_destination_mountain():
    base = generate_base_list(3)
    result = apply_destination(base, "mountain")
    all_items = [item for cat in result.values() for item in cat]
    assert "เสื้อกันหนาว" in all_items
    assert "ไม้เดินป่า" in all_items


def test_apply_destination_abroad():
    base = generate_base_list(3)
    result = apply_destination(base, "abroad")
    all_items = [item for cat in result.values() for item in cat]
    assert "หนังสือเดินทาง" in all_items


def test_apply_destination_no_duplicates():
    base = generate_base_list(3)
    result = apply_destination(base, "beach")
    all_items = [item for cat in result.values() for item in cat]
    assert len(all_items) == len(set(all_items))


def test_apply_destination_does_not_mutate_base():
    base = generate_base_list(3)
    original_len = sum(len(v) for v in base.values())
    apply_destination(base, "beach")
    assert sum(len(v) for v in base.values()) == original_len


# --- generate_pro_suggestions ---

def test_pro_suggestions_with_activities():
    suggestions = generate_pro_suggestions(["swimming", "hiking"])
    assert len(suggestions) > 0
    assert any("ว่ายน้ำ" in s for s in suggestions)
    assert any("เดินป่า" in s for s in suggestions)


def test_pro_suggestions_empty_activities():
    assert generate_pro_suggestions([]) == []


def test_pro_suggestions_deduplicates():
    suggestions = generate_pro_suggestions(["swimming", "snorkeling"])
    # ชุดว่ายน้ำ appears in both, should only show once
    swimming_items = [s for s in suggestions if "ชุดว่ายน้ำ" in s]
    assert len(swimming_items) <= 1


def test_pro_suggestions_unknown_activity():
    suggestions = generate_pro_suggestions(["unknown_activity"])
    assert suggestions == []


# --- generate_outfits ---

def test_outfits_beach():
    outfits = generate_outfits("beach", [])
    assert len(outfits) >= 2
    assert any(o.name == "Beach Casual" for o in outfits)


def test_outfits_mountain():
    outfits = generate_outfits("mountain", [])
    assert len(outfits) >= 2
    assert any(o.name == "Trail Explorer" for o in outfits)


def test_outfits_with_activity():
    outfits = generate_outfits("beach", ["hiking"])
    names = [o.name for o in outfits]
    assert "Hiking Ready" in names


def test_outfits_empty_activities():
    outfits = generate_outfits("city", [])
    assert len(outfits) >= 2  # City Walker + Night Out


# --- full generate_packing_list (rules-based) ---

def test_free_tier_only_packing_list():
    result = generate_packing_list(_req(tier="free"))
    assert result.packing_list is not None
    assert result.custom_suggestions == []
    assert result.outfits == []


def test_pro_tier_has_suggestions_and_outfits():
    result = generate_packing_list(_req(tier="pro", activities=["swimming"]))
    assert result.packing_list is not None
    assert len(result.custom_suggestions) > 0
    assert len(result.outfits) > 0


def test_pro_tier_no_activities_has_outfits():
    result = generate_packing_list(_req(tier="pro", activities=[]))
    assert result.packing_list is not None
    assert len(result.outfits) >= 2  # destination outfits still present
    assert result.custom_suggestions == []


def test_all_destinations_produce_valid_list():
    for dest in ("beach", "mountain", "city", "abroad", "ceremony"):
        result = generate_packing_list(_req(destination=dest, tier="pro"))
        for cat in ("clothes", "personal", "health", "electronics", "documents", "others"):
            assert len(result.packing_list.model_dump()[cat]) > 0, f"Empty {cat} for {dest}"


def test_duration_affects_quantity():
    short = generate_packing_list(_req(days=2, tier="free"))
    long = generate_packing_list(_req(days=10, tier="free"))
    short_clothes = short.packing_list.clothes
    long_clothes = long.packing_list.clothes
    # Longer trip should have higher quantity for consumables
    short_underwear = [i for i in short_clothes if "กางเกงชั้นใน" in i]
    long_underwear = [i for i in long_clothes if "กางเกงชั้นใน" in i]
    assert "x3" in short_underwear[0]
    assert "x11" in long_underwear[0]
