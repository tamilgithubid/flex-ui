"""
FlexUI AI Studio — FastAPI Backend
===================================
Provides AI-powered component generation, URL analysis, and theme creation.

Run locally:
    cd api && pip install -r requirements.txt && uvicorn main:app --reload --port 8000
"""

import asyncio
import json
import logging
import os
import re
import time
from collections import defaultdict
from typing import TypeVar

from bs4 import BeautifulSoup
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, ValidationError

from models import (
    AnalyzeRequest,
    AnalyzeResponse,
    GeneratedComponent,
    GeneratedTheme,
    GenerateRequest,
    GenerateResponse,
    ThemeRequest,
    ThemeResponse,
)
from prompts.generate import SYSTEM_PROMPT as GENERATE_SYSTEM, USER_PROMPT_TEMPLATE as GENERATE_USER
from prompts.analyze import SYSTEM_PROMPT as ANALYZE_SYSTEM, USER_PROMPT_TEMPLATE as ANALYZE_USER
from prompts.theme import SYSTEM_PROMPT as THEME_SYSTEM, USER_PROMPT_TEMPLATE as THEME_USER
from providers.gemini import GeminiProvider
from providers.groq_provider import GroqProvider
from safe_fetch import fetch_public_html

logger = logging.getLogger(__name__)
Payload = TypeVar("Payload", bound=BaseModel)
PROVIDER_TIMEOUT_SECONDS = 30
GENERATION_DEADLINE_SECONDS = 90

# ── Load environment ─────────────────────────────────────────────────────────
load_dotenv()

# ── App ──────────────────────────────────────────────────────────────────────
app = FastAPI(
    title="FlexUI AI Studio API",
    version="1.0.0",
    description="AI-powered component generation for FlexUI",
)

# ── CORS ─────────────────────────────────────────────────────────────────────
frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_url, "http://localhost:3000", "https://flexui.dev", "https://flex-ui-wine.vercel.app"],
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)

# ── AI Providers (try Gemini first, fall back to Groq) ───────────────────────
gemini = GeminiProvider()
groq = GroqProvider()


async def ai_generate(system_prompt: str, user_prompt: str) -> str:
    """Try primary provider, fall back to secondary."""
    for name, provider in [("Gemini", gemini), ("Groq", groq)]:
        if provider.is_available():
            try:
                return await asyncio.wait_for(provider.generate(system_prompt, user_prompt), timeout=PROVIDER_TIMEOUT_SECONDS)
            except Exception as error:
                # Provider exceptions can contain credentials or request bodies.
                logger.warning("%s request failed (%s)", name, type(error).__name__)
    raise HTTPException(
        status_code=503,
        detail="AI service is unavailable. Check provider configuration or try again later.",
    )


def parse_json_response(text: str) -> dict:
    """Extract JSON from AI response, handling markdown code blocks."""
    if not isinstance(text, str) or len(text) > 100000:
        raise ValueError("Invalid AI response size")
    # Try direct parse first
    try:
        data = json.loads(text)
    except json.JSONDecodeError:
        pass
    else:
        if isinstance(data, dict):
            return data
        raise ValueError("The AI response must be an object")

    # Try extracting from markdown code block
    match = re.search(r"```(?:json)?\s*\n?(.*?)\n?```", text, re.DOTALL)
    if match:
        try:
            data = json.loads(match.group(1))
        except json.JSONDecodeError:
            pass
        else:
            if isinstance(data, dict):
                return data
            raise ValueError("The AI response must be an object")

    # Try finding first { to last }
    start = text.find("{")
    end = text.rfind("}")
    if start != -1 and end != -1:
        try:
            data = json.loads(text[start : end + 1])
            if isinstance(data, dict):
                return data
        except json.JSONDecodeError:
            pass

    raise ValueError("Failed to parse AI response as an object")


async def validated_generation(schema: type[Payload], system_prompt: str, user_prompt: str) -> Payload:
    try:
        async with asyncio.timeout(GENERATION_DEADLINE_SECONDS):
            for attempt in range(2):
                prompt = user_prompt if attempt == 0 else user_prompt + "\nReturn a complete JSON object matching the requested schema, including valid exported TSX when code is requested."
                raw = await ai_generate(system_prompt, prompt)
                try:
                    return schema.model_validate(parse_json_response(raw))
                except (ValueError, ValidationError):
                    continue
    except TimeoutError as error:
        raise HTTPException(504, "AI generation timed out. Try again.") from error
    raise HTTPException(502, "AI returned an invalid response after retrying. Try again.")


# ── Rate limiter (simple in-memory) ──────────────────────────────────────────
rate_limits: dict[str, list[float]] = defaultdict(list)
RATE_LIMIT = 20  # requests per minute per IP
RATE_WINDOW = 60  # seconds


def check_rate_limit(request: Request):
    ip = request.client.host if request.client else "unknown"
    now = time.monotonic()
    if len(rate_limits) > 10000:
        for address in list(rate_limits):
            if not rate_limits[address] or now - rate_limits[address][-1] >= RATE_WINDOW:
                del rate_limits[address]
        if ip not in rate_limits and len(rate_limits) > 10000:
            raise HTTPException(status_code=429, detail="The service is busy. Try again in a minute.")
    # Clean old entries
    rate_limits[ip] = [t for t in rate_limits[ip] if now - t < RATE_WINDOW]
    if len(rate_limits[ip]) >= RATE_LIMIT:
        raise HTTPException(status_code=429, detail="Rate limit exceeded. Try again in a minute.")
    rate_limits[ip].append(now)


# ── Health check ─────────────────────────────────────────────────────────────
@app.get("/")
async def health():
    return {
        "status": "ok",
        "service": "FlexUI AI Studio API",
        "providers": {
            "gemini": gemini.is_available(),
            "groq": groq.is_available(),
        },
    }


# ── POST /api/generate ───────────────────────────────────────────────────────
@app.post("/api/generate", response_model=GenerateResponse)
async def generate_component(req: GenerateRequest, request: Request):
    check_rate_limit(request)

    category_hint = f"Category focus: {req.category}" if req.category and req.category != "All" else ""
    user_prompt = GENERATE_USER.format(prompt=req.prompt, category_hint=category_hint)

    data = await validated_generation(GeneratedComponent, GENERATE_SYSTEM, user_prompt)
    return GenerateResponse(
        **data.model_dump(), badge_color=_badge_color(data.badge),
    )


def _badge_color(badge: str) -> str:
    colors = {
        "Button": "bg-violet-500/15 text-violet-400",
        "Card": "bg-cyan-500/15 text-cyan-400",
        "Text": "bg-amber-500/15 text-amber-400",
        "Background": "bg-emerald-500/15 text-emerald-400",
        "Effect": "bg-rose-500/15 text-rose-400",
        "Layout": "bg-blue-500/15 text-blue-400",
        "Scroll": "bg-orange-500/15 text-orange-400",
        "WebGL": "bg-purple-500/15 text-purple-400",
    }
    return colors.get(badge, "bg-zinc-500/15 text-zinc-400")


# ── POST /api/analyze ────────────────────────────────────────────────────────
@app.post("/api/analyze", response_model=AnalyzeResponse)
async def analyze_url(req: AnalyzeRequest, request: Request):
    check_rate_limit(request)

    html = await fetch_public_html(req.url)

    # Parse HTML
    soup = BeautifulSoup(html, "html.parser")

    # Extract CSS info
    css_info = []
    for style_tag in soup.find_all("style"):
        text = style_tag.get_text()
        # Find CSS custom properties
        props = re.findall(r"(--[\w-]+)\s*:\s*([^;]+)", text)
        for name, value in props[:20]:
            css_info.append(f"{name[:100]}: {value.strip()[:200]}")

    # Extract fonts from link tags
    fonts = set()
    for link in soup.find_all("link", href=True):
        href = link["href"]
        if "fonts.googleapis.com" in href:
            font_match = re.findall(r"family=([^&:]+)", href)
            for f in font_match:
                fonts.add(f.replace("+", " "))

    for element in soup(["script", "noscript", "iframe"]):
        element.decompose()
    html_snippet = soup.get_text()[:3000]
    css_info_str = "\n".join(css_info[:15]) if css_info else "No CSS variables found"

    user_prompt = ANALYZE_USER.format(
        url=req.url,
        html_snippet=html_snippet,
        css_info=css_info_str,
    )

    result = await validated_generation(AnalyzeResponse, ANALYZE_SYSTEM, user_prompt)
    if not result.fonts:
        result.fonts = sorted(fonts)[:5]
    return result


# ── POST /api/theme ──────────────────────────────────────────────────────────
@app.post("/api/theme", response_model=ThemeResponse)
async def generate_theme(req: ThemeRequest, request: Request):
    check_rate_limit(request)

    user_prompt = THEME_USER.format(description=req.description)
    data = await validated_generation(GeneratedTheme, THEME_SYSTEM, user_prompt)
    name, primary, accent, bg = data.name, data.primary, data.accent, data.bg

    css_code = f"""/* FlexUI Theme: {name} */
:root {{
  --flexui-primary: {primary};
  --flexui-accent: {accent};
  --flexui-bg: {bg};
  --flexui-text: #E4E4E7;
  --flexui-border: rgba(255, 255, 255, 0.06);
  --flexui-glass: rgba(255, 255, 255, 0.03);
}}"""

    tailwind_code = f"""// tailwind.config.ts
theme: {{
  extend: {{
    colors: {{
      flexui: {{
        primary: "{primary}",
        accent: "{accent}",
        bg: "{bg}",
      }}
    }}
  }}
}}"""

    return ThemeResponse(
        name=name,
        primary=primary,
        accent=accent,
        bg=bg,
        css_code=css_code,
        tailwind_code=tailwind_code,
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

