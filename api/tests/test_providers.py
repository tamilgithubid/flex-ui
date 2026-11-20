import asyncio
from types import SimpleNamespace
from unittest.mock import AsyncMock

import pytest

from providers.gemini import GeminiProvider, HAS_GEMINI
from providers.groq_provider import GroqProvider, HAS_GROQ


def test_required_sdks_are_installed():
    assert HAS_GEMINI
    assert HAS_GROQ


@pytest.mark.asyncio
async def test_gemini_awaits_async_sdk_and_preserves_system_instructions(monkeypatch):
    monkeypatch.delenv("GEMINI_API_KEY", raising=False)
    provider = GeminiProvider()
    generate = AsyncMock(return_value=SimpleNamespace(text="{}"))
    provider.client = SimpleNamespace(aio=SimpleNamespace(models=SimpleNamespace(generate_content=generate)))
    assert await provider.generate("rules", "question") == "{}"
    generate.assert_awaited_once()
    assert generate.await_args.kwargs["config"].system_instruction == "rules"


@pytest.mark.asyncio
async def test_groq_requests_can_progress_concurrently(monkeypatch):
    monkeypatch.delenv("GROQ_API_KEY", raising=False)
    provider = GroqProvider()
    both_started = asyncio.Event()
    started = 0
    async def generate(**kwargs):
        nonlocal started
        started += 1
        if started == 2:
            both_started.set()
        await asyncio.wait_for(both_started.wait(), 1)
        return SimpleNamespace(choices=[SimpleNamespace(message=SimpleNamespace(content="{}"))])
    provider.client = SimpleNamespace(chat=SimpleNamespace(completions=SimpleNamespace(create=generate)))
    assert await asyncio.gather(provider.generate("rules", "one"), provider.generate("rules", "two")) == ["{}", "{}"]
