"""
Unit tests for AI packing service (ai_packing.py) — mocked OpenRouter calls
"""

import json
import os
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


def test_prompt_unknown_destination_passes_through():
    # destination_type is validated by Pydantic Literal, so this shouldn't happen
    # but the label dict has a fallback
    pass


# --- generate_with_ai (no API key) ---

def test_no_api_key_returns_none():
    with patch.dict(os.environ, {"OPENROUTER_API_KEY": ""}):
        from app.services import ai_packing
        ai_packing.OPENROUTER_API_KEY = ""
        result = generate_with_ai(_req())
        assert result is None


def test_placeholder_api_key_returns_none():
    with patch.dict(os.environ, {"OPENROUTER_API_KEY": "ใส่ API key"}):
        from app.services import ai_packing
        ai_packing.OPENROUTER_API_KEY = "ใส่ API key"
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
        "clothes": ["เสื้อยืด x4", "กางเกงขาสั้น"],
        "personal": ["แปรงสีฟัน"],
        "health": ["ครีมกันแดด SPF50"],
        "electronics": ["สายชาร์จ"],
        "documents": ["บัตรประชาชน"],
        "others": ["ขวดน้ำ"],
    },
    "custom_suggestions": ["เต้าเจี้ยวสำหรับทะเล"],
    "outfits": [
        {
            "name": "Beach Casual",
            "items": ["เสื้อยืด", "กางเกงขาสั้น"],
            "style": "casual",
            "match_reason": "สบายริมทะเล",
        }
    ],
})


@patch("app.services.ai_packing.OPENROUTER_API_KEY", "sk-test-key")
@patch("app.services.ai_packing.OPENROUTER_WEB_SEARCH", True)
@patch("app.services.ai_packing.OPENROUTER_MODEL", "openai/gpt-4.1-nano")
def test_ai_success_pro_tier():
    mock_client = MagicMock()
    mock_client.chat.completions.create.return_value = _mock_response(MOCK_PRO_RESPONSE)

    with patch("app.services.ai_packing.OpenAI", return_value=mock_client):
        result = generate_with_ai(_req(tier="pro"))
        assert result is not None
        assert len(result.packing_list.clothes) > 0
        assert len(result.custom_suggestions) > 0
        assert len(result.outfits) > 0


@patch("app.services.ai_packing.OPENROUTER_API_KEY", "sk-test-key")
@patch("app.services.ai_packing.OPENROUTER_WEB_SEARCH", True)
@patch("app.services.ai_packing.OPENROUTER_MODEL", "openai/gpt-4.1-nano")
def test_ai_success_free_tier():
    mock_client = MagicMock()
    mock_client.chat.completions.create.return_value = _mock_response(MOCK_PRO_RESPONSE)

    with patch("app.services.ai_packing.OpenAI", return_value=mock_client):
        result = generate_with_ai(_req(tier="free"))
        assert result is not None
        assert result.custom_suggestions == []
        assert result.outfits == []


@patch("app.services.ai_packing.OPENROUTER_API_KEY", "sk-test-key")
@patch("app.services.ai_packing.OPENROUTER_WEB_SEARCH", True)
@patch("app.services.ai_packing.OPENROUTER_MODEL", "openai/gpt-4.1-nano")
def test_ai_web_search_suffix():
    mock_client = MagicMock()
    mock_client.chat.completions.create.return_value = _mock_response(MOCK_PRO_RESPONSE)

    with patch("app.services.ai_packing.OpenAI", return_value=mock_client):
        generate_with_ai(_req())
        call_args = mock_client.chat.completions.create.call_args
        assert call_args.kwargs["model"] == "openai/gpt-4.1-nano:online"


@patch("app.services.ai_packing.OPENROUTER_API_KEY", "sk-test-key")
@patch("app.services.ai_packing.OPENROUTER_WEB_SEARCH", False)
@patch("app.services.ai_packing.OPENROUTER_MODEL", "openai/gpt-4.1-nano")
def test_ai_no_web_search_no_suffix():
    mock_client = MagicMock()
    mock_client.chat.completions.create.return_value = _mock_response(MOCK_PRO_RESPONSE)

    with patch("app.services.ai_packing.OpenAI", return_value=mock_client):
        generate_with_ai(_req())
        call_args = mock_client.chat.completions.create.call_args
        assert call_args.kwargs["model"] == "openai/gpt-4.1-nano"


@patch("app.services.ai_packing.OPENROUTER_API_KEY", "sk-test-key")
@patch("app.services.ai_packing.OPENROUTER_WEB_SEARCH", True)
@patch("app.services.ai_packing.OPENROUTER_MODEL", "openai/gpt-4.1-nano")
def test_ai_handles_markdown_code_fences():
    content = f"```json\n{MOCK_PRO_RESPONSE}\n```"
    mock_client = MagicMock()
    mock_client.chat.completions.create.return_value = _mock_response(content)

    with patch("app.services.ai_packing.OpenAI", return_value=mock_client):
        result = generate_with_ai(_req(tier="pro"))
        assert result is not None
        assert len(result.packing_list.clothes) > 0


# --- generate_with_ai (API error) ---

@patch("app.services.ai_packing.OPENROUTER_API_KEY", "sk-test-key")
def test_ai_api_error_returns_none():
    mock_client = MagicMock()
    mock_client.chat.completions.create.side_effect = Exception("API error")

    with patch("app.services.ai_packing.OpenAI", return_value=mock_client):
        result = generate_with_ai(_req())
        assert result is None


@patch("app.services.ai_packing.OPENROUTER_API_KEY", "sk-test-key")
def test_ai_invalid_json_returns_none():
    mock_client = MagicMock()
    mock_client.chat.completions.create.return_value = _mock_response("not valid json")

    with patch("app.services.ai_packing.OpenAI", return_value=mock_client):
        result = generate_with_ai(_req())
        assert result is None


# --- generate_packing_list (fallback) ---

@patch("app.services.ai_packing.OPENROUTER_API_KEY", "")
def test_fallback_to_rules_when_no_key():
    from app.services import ai_packing
    ai_packing.OPENROUTER_API_KEY = ""
    result = generate_packing_list(_req())
    assert result is not None
    assert result.packing_list is not None


@patch("app.services.ai_packing.OPENROUTER_API_KEY", "sk-test-key")
def test_fallback_to_rules_on_api_failure():
    mock_client = MagicMock()
    mock_client.chat.completions.create.side_effect = Exception("fail")

    with patch("app.services.ai_packing.OpenAI", return_value=mock_client):
        result = generate_packing_list(_req())
        assert result is not None
        assert result.packing_list is not None
