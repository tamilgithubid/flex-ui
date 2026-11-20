import os

from .base import AIProvider

try:
    from groq import AsyncGroq
    HAS_GROQ = True
except ImportError:
    HAS_GROQ = False


class GroqProvider(AIProvider):
    def __init__(self):
        self.model = os.getenv("GROQ_MODEL", "openai/gpt-oss-120b")
        key = os.getenv("GROQ_API_KEY", "")
        self.client = AsyncGroq(api_key=key, timeout=60, max_retries=0) if key and HAS_GROQ else None

    def is_available(self) -> bool:
        return self.client is not None

    async def generate(self, system_prompt: str, user_prompt: str) -> str:
        if not self.client:
            raise RuntimeError("Groq is not configured")
        response = await self.client.chat.completions.create(
            model=self.model,
            messages=[{"role": "system", "content": system_prompt}, {"role": "user", "content": user_prompt}],
            temperature=0.35, max_completion_tokens=8192,
            response_format={"type": "json_object"},
        )
        return response.choices[0].message.content or ""
