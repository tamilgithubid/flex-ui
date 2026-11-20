import os

from .base import AIProvider

try:
    from google import genai
    from google.genai import types
    HAS_GEMINI = True
except ImportError:
    HAS_GEMINI = False


class GeminiProvider(AIProvider):
    def __init__(self):
        self.model = os.getenv("GEMINI_MODEL", "gemini-flash-latest")
        key = os.getenv("GEMINI_API_KEY", "")
        self.client = genai.Client(api_key=key, http_options=types.HttpOptions(timeout=60000)) if key and HAS_GEMINI else None

    def is_available(self) -> bool:
        return self.client is not None

    async def generate(self, system_prompt: str, user_prompt: str) -> str:
        if not self.client:
            raise RuntimeError("Gemini is not configured")
        response = await self.client.aio.models.generate_content(
            model=self.model, contents=user_prompt,
            config=types.GenerateContentConfig(
                system_instruction=system_prompt, temperature=0.35,
                max_output_tokens=8192, response_mime_type="application/json",
            ),
        )
        return response.text or ""
