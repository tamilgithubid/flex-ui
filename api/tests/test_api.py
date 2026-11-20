import asyncio
import json
from types import SimpleNamespace
from unittest.mock import AsyncMock

import pytest
from fastapi import HTTPException
from fastapi.testclient import TestClient

import main

VALID_CODE = "export default function Demo() { return <div>Hello</div>; }"


@pytest.fixture
def client():
    with TestClient(main.app) as instance:
        yield instance


@pytest.mark.parametrize("response", ["[]", "null", "{}", '{"code":"x"}', '{"code":42}', "not JSON"])
def test_bad_generation_is_retried_and_rejected(client, monkeypatch, response):
    generate = AsyncMock(return_value=response)
    monkeypatch.setattr(main, "ai_generate", generate)
    result = client.post("/api/generate", json={"prompt": "A card"})
    assert result.status_code == 502
    assert generate.await_count == 2
    assert "code" not in result.json()


def test_retry_can_recover_with_valid_code(client, monkeypatch):
    generate = AsyncMock(side_effect=["[]", json.dumps({"code": VALID_CODE})])
    monkeypatch.setattr(main, "ai_generate", generate)
    result = client.post("/api/generate", json={"prompt": "A card"})
    assert result.status_code == 200
    assert result.json()["code"] == VALID_CODE
    assert generate.await_count == 2


@pytest.mark.parametrize("prompt", ["", "   ", "x" * 4001, 42])
def test_invalid_prompts_do_not_call_ai(client, monkeypatch, prompt):
    generate = AsyncMock()
    monkeypatch.setattr(main, "ai_generate", generate)
    assert client.post("/api/generate", json={"prompt": prompt}).status_code == 422
    generate.assert_not_awaited()


def test_private_url_never_reaches_ai(client, monkeypatch):
    generate = AsyncMock()
    monkeypatch.setattr(main, "ai_generate", generate)
    result = client.post("/api/analyze", json={"url": "http://127.0.0.1/private"})
    assert result.status_code == 400
    generate.assert_not_awaited()


def test_analysis_uses_real_fetched_data(client, monkeypatch):
    fetch = AsyncMock(return_value='<link href="https://fonts.googleapis.com/css?family=Inter"><p>Example page</p>')
    generate = AsyncMock(return_value='{"colors":[],"fonts":[],"components":[],"suggestions":[]}')
    monkeypatch.setattr(main, "fetch_public_html", fetch)
    monkeypatch.setattr(main, "ai_generate", generate)
    result = client.post("/api/analyze", json={"url": "https://example.com"})
    assert result.status_code == 200
    assert result.json()["fonts"] == ["Inter"]
    assert "Example page" in generate.await_args.args[1]


@pytest.mark.parametrize("changes", [{"primary": "red; background:url(https://example.com)"}, {"name": "*/ bad /*"}])
def test_theme_rejects_css_injection(client, monkeypatch, changes):
    palette = {"name": "Ocean", "primary": "#112233", "accent": "#445566", "bg": "#001122", **changes}
    monkeypatch.setattr(main, "ai_generate", AsyncMock(return_value=json.dumps(palette)))
    assert client.post("/api/theme", json={"description": "Ocean"}).status_code == 502


def test_valid_theme_builds_css_from_validated_colors(client, monkeypatch):
    palette = {"name": "Ocean", "primary": "#112233", "accent": "#445566", "bg": "#001122"}
    monkeypatch.setattr(main, "ai_generate", AsyncMock(return_value=json.dumps(palette)))
    response = client.post("/api/theme", json={"description": "Ocean"})
    assert response.status_code == 200
    assert "--flexui-primary: #112233;" in response.json()["css_code"]


@pytest.mark.asyncio
async def test_failed_primary_provider_falls_back(monkeypatch):
    first = SimpleNamespace(is_available=lambda: True, generate=AsyncMock(side_effect=RuntimeError("secret token")))
    second = SimpleNamespace(is_available=lambda: True, generate=AsyncMock(return_value="{}"))
    monkeypatch.setattr(main, "gemini", first)
    monkeypatch.setattr(main, "groq", second)
    assert await main.ai_generate("rules", "prompt") == "{}"
    second.generate.assert_awaited_once()


@pytest.mark.asyncio
async def test_provider_errors_do_not_expose_credentials(monkeypatch, caplog):
    broken = SimpleNamespace(is_available=lambda: True, generate=AsyncMock(side_effect=RuntimeError("secret token")))
    monkeypatch.setattr(main, "gemini", broken)
    monkeypatch.setattr(main, "groq", broken)
    with pytest.raises(HTTPException) as error:
        await main.ai_generate("rules", "prompt")
    assert error.value.status_code == 503
    assert "secret token" not in str(error.value.detail) + caplog.text


@pytest.mark.asyncio
async def test_generation_has_a_total_deadline(monkeypatch):
    async def stalled(*args):
        await asyncio.sleep(60)
    monkeypatch.setattr(main, "ai_generate", stalled)
    monkeypatch.setattr(main, "GENERATION_DEADLINE_SECONDS", 0.001)
    with pytest.raises(HTTPException) as error:
        await main.validated_generation(main.GeneratedComponent, "rules", "prompt")
    assert error.value.status_code == 504


def test_rate_limit_stops_additional_generation(client, monkeypatch):
    generate = AsyncMock(return_value=json.dumps({"code": VALID_CODE}))
    monkeypatch.setattr(main, "ai_generate", generate)
    monkeypatch.setattr(main, "RATE_LIMIT", 1)
    assert client.post("/api/generate", json={"prompt": "A card"}).status_code == 200
    assert client.post("/api/generate", json={"prompt": "A card"}).status_code == 429
    assert generate.await_count == 1
