"""
Unit tests for AI packing service (ai_packing.py) — mocked OpenRouter calls
"""

import json
from unittest.mock import patch, MagicMock

from app.schemas.packing_assistant import PackingAssistantRequest
from app.services.ai_packing import (
    _build_user_prompt,
    generate_with_ai,
    generate_packing_list,
)


def _req(destination="beach", days=3, activities=None, tier="free"):
    return PackingAssistantRequest(
        destination_type=destination,
        duration_days=days,
        activities=activities or [],
        user_tier=tier,
    )


def _mock_settings(api_key="sk-test-key", web_search=True, model="openai/gpt-4.1-nano"):
    mock = MagicMock()
    mock.openrouter_api_key = api_key
    mock.openrouter_base_url = "https://openrouter.ai/api/v1"
    mock.openrouter_model = model
    mock.openrouter_web_search = web_search
    return mock


# --- _build_user_prompt ---

def test_prompt_includes_destination():
    prompt = _build_user_prompt(_req(destination="beach"))
    assert "ทะเล" in prompt


def test_prompt_includes_duration():
    prompt = _build_user_prompt(_req(days=5))
    assert "5 วัน" in prompt


def test_prompt_includes_tier():
    prompt = _build_user_prompt(_req(tier="pro"))
    assert "pro" in prompt


def test_prompt_includes_activities():
    prompt = _build_user_prompt(_req(activities=["swimming", "hiking"]))
    assert "ว่ายน้ำ" in prompt
    assert "เดินป่า" in prompt


def test_prompt_includes_weather():
    prompt = _build_user_prompt(_req(), weather_info={
        "temp_c": 32, "humidity": 80, "rain_chance": 40, "condition_th": "แดดออก"
    })
    assert "32" in prompt
    assert "80" in prompt
    assert "40" in prompt
    assert "แดดออก" in prompt


def test_prompt_without_weather():
    prompt = _build_user_prompt(_req())
    assert "°C" not in prompt


def test_prompt_known_destination_mapped():
    prompt = _build_user_prompt(_req(destination="mountain"))
    assert "ภูเขา" in prompt


# --- generate_with_ai (no API key) ---

@patch("app.services.ai_packing.get_settings", return_value=_mock_settings(api_key=""))
def test_no_api_key_returns_none(mock_settings):
    result = generate_with_ai(_req())
    assert result is None


@patch("app.services.ai_packing.get_settings", return_value=_mock_settings(api_key="ใส่ API key"))
def test_placeholder_api_key_returns_none(mock_settings):
    result = generate_with_ai(_req())
    assert result is None


# --- generate_with_ai (mocked API success) ---

def _mock_response(content: str):
    mock_resp = MagicMock()
    mock_resp.choices = [MagicMock()]
    mock_resp.choices[0].message.content = content
    return mock_resp


MOCK_PRO_RESPONSE = json.dumps({
    "packing_list": {
        "essentials": ["พาสปอร์ต", "กระเป๋าเงิน"],
        "clothes": ["เสื้อยืด x3", "กางเกงขาสั้น x2"],
        "toiletries": ["แชมพู", "ยาสีฟัน"],
        "electronics": ["เชื่อมโทรศัพท์"],
    },
    "custom_suggestions": ["ครีมกันแดด", "แว่นกันแดด"],
    "outfits": [
        {
            "name": "ชุดไปทะเล",
            "items": ["เสื้อยืด", "กางเกงขาสั้น"],
            "style": "casual",
            "match_reason": "เหมาะกับทะเล",
        }
    ],
})


@patch("app.services.ai_packing.get_settings", return_value=_mock_settings())
def test_ai_success_pro_tier(mock_settings):
    mock_client = MagicMock()
    mock_client.chat.completions.create.return_value = _mock_response(MOCK_PRO_RESPONSE)

    with patch("app.services.ai_packing.OpenAI", return_value=mock_client):
        result = generate_with_ai(_req(tier="pro"))
        assert result is not None
        assert len(result.packing_list.clothes) > 0
        assert len(result.custom_suggestions) > 0
        assert len(result.outfits) > 0


@patch("app.services.ai_packing.get_settings", return_value=_mock_settings())
def test_ai_success_free_tier(mock_settings):
    mock_client = MagicMock()
    mock_client.chat.completions.create.return_value = _mock_response(MOCK_PRO_RESPONSE)

    with patch("app.services.ai_packing.OpenAI", return_value=mock_client):
        result = generate_with_ai(_req(tier="free"))
        assert result is not None


@patch("app.services.ai_packing.get_settings", return_value=_mock_settings(web_search=True))
def test_ai_web_search_suffix(mock_settings):
    mock_client = MagicMock()
    mock_client.chat.completions.create.return_value = _mock_response(MOCK_PRO_RESPONSE)

    with patch("app.services.ai_packing.OpenAI", return_value=mock_client):
        generate_with_ai(_req())
        call_args = mock_client.chat.completions.create.call_args
        model = call_args[1]["model"] if "model" in call_args[1] else call_args[0][0] if call_args[0] else None
        assert model is not None
        assert ":online" in model


@patch("app.services.ai_packing.get_settings", return_value=_mock_settings(web_search=False))
def test_ai_no_web_search_no_suffix(mock_settings):
    mock_client = MagicMock()
    mock_client.chat.completions.create.return_value = _mock_response(MOCK_PRO_RESPONSE)

    with patch("app.services.ai_packing.OpenAI", return_value=mock_client):
        generate_with_ai(_req())
        call_args = mock_client.chat.completions.create.call_args
        model = call_args[1]["model"] if "model" in call_args[1] else call_args[0][0] if call_args[0] else None
        assert model is not None
        assert ":online" not in model


@patch("app.services.ai_packing.get_settings", return_value=_mock_settings())
def test_ai_handles_markdown_code_fences(mock_settings):
    content = '```json\n' + MOCK_PRO_RESPONSE + '\n```'
    mock_client = MagicMock()
    mock_client.chat.completions.create.return_value = _mock_response(content)

    with patch("app.services.ai_packing.OpenAI", return_value=mock_client):
        result = generate_with_ai(_req())
        assert result is not None


@patch("app.services.ai_packing.get_settings", return_value=_mock_settings())
def test_ai_api_error_returns_none(mock_settings):
    mock_client = MagicMock()
    mock_client.chat.completions.create.side_effect = Exception("API error")

    with patch("app.services.ai_packing.OpenAI", return_value=mock_client):
        result = generate_with_ai(_req())
        assert result is None


@patch("app.services.ai_packing.get_settings", return_value=_mock_settings())
def test_ai_invalid_json_returns_none(mock_settings):
    mock_client = MagicMock()
    mock_client.chat.completions.create.return_value = _mock_response("not valid json")

    with patch("app.services.ai_packing.OpenAI", return_value=mock_client):
        result = generate_with_ai(_req())
        assert result is None


# --- fallback to rules-based ---

@patch("app.services.ai_packing.get_settings", return_value=_mock_settings(api_key=""))
def test_fallback_to_rules_when_no_key(mock_settings):
    result = generate_packing_list(_req())
    assert result is not None
    assert result.packing_list is not None


@patch("app.services.ai_packing.get_settings", return_value=_mock_settings())
def test_fallback_to_rules_on_api_failure(mock_settings):
    mock_client = MagicMock()
    mock_client.chat.completions.create.side_effect = Exception("fail")

    with patch("app.services.ai_packing.OpenAI", return_value=mock_client):
        result = generate_packing_list(_req())
        assert result is not None
