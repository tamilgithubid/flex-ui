import re

from pydantic import BaseModel, ConfigDict, Field, field_validator


class RequestModel(BaseModel):
    model_config = ConfigDict(extra="forbid", strict=True, str_strip_whitespace=True)


class GenerateRequest(RequestModel):
    prompt: str = Field(min_length=1, max_length=4000)
    category: str | None = Field(default=None, max_length=64)


class GeneratedComponent(BaseModel):
    model_config = ConfigDict(strict=True)
    name: str = Field(default="Component", min_length=1, max_length=80)
    code: str = Field(min_length=30, max_length=50000)
    badge: str = Field(default="Component", max_length=32)
    doc_slug: str = Field(default="", pattern=r"^(?:[a-z0-9]+(?:-[a-z0-9]+)*)?$")
    imports: list[str] = Field(default_factory=list, max_length=30)

    @field_validator("code")
    @classmethod
    def require_default_export(cls, code: str) -> str:
        if not re.search(r"\bexport\s+default\b", code):
            raise ValueError("The component must have a default export")
        return code


class GenerateResponse(GeneratedComponent):
    badge_color: str


class AnalyzeRequest(RequestModel):
    url: str = Field(min_length=1, max_length=2048)


class ColorInfo(BaseModel):
    model_config = ConfigDict(strict=True)
    name: str = Field(min_length=1, max_length=80)
    hex: str = Field(pattern=r"^#[0-9a-fA-F]{6}$")


class AnalyzeResponse(BaseModel):
    model_config = ConfigDict(strict=True)
    colors: list[ColorInfo] = Field(default_factory=list, max_length=6)
    fonts: list[str] = Field(default_factory=list, max_length=5)
    components: list[str] = Field(default_factory=list, max_length=8)
    suggestions: list[str] = Field(default_factory=list, max_length=6)


class ThemeRequest(RequestModel):
    description: str = Field(min_length=1, max_length=2000)


class GeneratedTheme(BaseModel):
    model_config = ConfigDict(strict=True)
    name: str = Field(min_length=1, max_length=64, pattern=r"^[\w .-]+$")
    primary: str = Field(pattern=r"^#[0-9a-fA-F]{6}$")
    accent: str = Field(pattern=r"^#[0-9a-fA-F]{6}$")
    bg: str = Field(pattern=r"^#[0-9a-fA-F]{6}$")


class ThemeResponse(GeneratedTheme):
    css_code: str
    tailwind_code: str
