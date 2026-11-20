"""
Tests for Pydantic models and validation.
"""

import pytest
from pydantic import ValidationError
from models import (
    GenerateRequest,
    GenerateResponse,
    AnalyzeRequest,
    AnalyzeResponse,
    ColorInfo,
    ThemeRequest,
    ThemeResponse,
)


class TestGenerateRequest:
    """Tests for GenerateRequest model."""

    def test_generate_request_valid_minimal(self):
        """Test minimal valid GenerateRequest."""
        req = GenerateRequest(prompt="Create a button")
        assert req.prompt == "Create a button"
        assert req.category is None

    def test_generate_request_valid_with_category(self):
        """Test GenerateRequest with category."""
        req = GenerateRequest(prompt="Create a card", category="Card")
        assert req.prompt == "Create a card"
        assert req.category == "Card"

    def test_generate_request_missing_prompt(self):
        """Test GenerateRequest rejects missing prompt."""
        with pytest.raises(ValidationError):
            GenerateRequest(category="Button")

    def test_generate_request_empty_prompt(self):
        """Test GenerateRequest accepts empty prompt (no validation)."""
        req = GenerateRequest(prompt="")
        assert req.prompt == ""

    def test_generate_request_long_prompt(self):
        """Test GenerateRequest with very long prompt."""
        long_prompt = "a" * 10000
        req = GenerateRequest(prompt=long_prompt)
        assert len(req.prompt) == 10000

    def test_generate_request_special_characters(self):
        """Test GenerateRequest with special characters."""
        req = GenerateRequest(prompt="Create 🎨 component with émojis & symbols!")
        assert "🎨" in req.prompt

    def test_generate_request_category_all(self):
        """Test GenerateRequest with 'All' category."""
        req = GenerateRequest(prompt="test", category="All")
        assert req.category == "All"


class TestGenerateResponse:
    """Tests for GenerateResponse model."""

    def test_generate_response_valid(self):
        """Test valid GenerateResponse."""
        resp = GenerateResponse(
            name="Button",
            code="export default function Button() {}",
            badge="Button",
            badge_color="bg-violet-500/15 text-violet-400",
            doc_slug="button",
            imports=["react"]
        )
        assert resp.name == "Button"
        assert resp.badge == "Button"
        assert len(resp.imports) == 1

    def test_generate_response_missing_required_field(self):
        """Test GenerateResponse rejects missing required field."""
        with pytest.raises(ValidationError):
            GenerateResponse(
                name="Button",
                badge="Button",
                badge_color="color",
                doc_slug="button",
                imports=[]
            )

    def test_generate_response_empty_imports(self):
        """Test GenerateResponse with empty imports list."""
        resp = GenerateResponse(
            name="Simple",
            code="export default function Simple() {}",
            badge="Component",
            badge_color="color",
            doc_slug="simple",
            imports=[]
        )
        assert resp.imports == []

    def test_generate_response_multiple_imports(self):
        """Test GenerateResponse with multiple imports."""
        resp = GenerateResponse(
            name="Complex",
            code="export default function Complex() {}",
            badge="Component",
            badge_color="color",
            doc_slug="complex",
            imports=["react", "react-dom", "@/lib/utils"]
        )
        assert len(resp.imports) == 3

    def test_generate_response_invalid_type_imports(self):
        """Test GenerateResponse rejects invalid imports type."""
        with pytest.raises(ValidationError):
            GenerateResponse(
                name="Test",
                code="export default function Test() {}",
                badge="Component",
                badge_color="color",
                doc_slug="test",
                imports="react"  # Should be list
            )

    def test_generate_response_complex_code(self):
        """Test GenerateResponse with complex code."""
        complex_code = '''
        import React, { useState } from 'react';
        
        export default function ComplexComponent({ props }) {
            const [state, setState] = useState(null);
            
            return (
                <div className="complex">
                    {/* Complex component logic */}
                </div>
            );
        }
        '''
        resp = GenerateResponse(
            name="Complex",
            code=complex_code,
            badge="Component",
            badge_color="color",
            doc_slug="complex",
            imports=["react"]
        )
        assert "useState" in resp.code
        assert "export default" in resp.code


class TestAnalyzeRequest:
    """Tests for AnalyzeRequest model."""

    def test_analyze_request_valid_url(self):
        """Test valid AnalyzeRequest with URL."""
        req = AnalyzeRequest(url="https://example.com")
        assert req.url == "https://example.com"

    def test_analyze_request_missing_url(self):
        """Test AnalyzeRequest rejects missing url."""
        with pytest.raises(ValidationError):
            AnalyzeRequest()

    def test_analyze_request_various_urls(self):
        """Test AnalyzeRequest with various URL formats."""
        test_urls = [
            "https://example.com",
            "http://localhost:3000",
            "https://example.com/path/to/page",
            "https://example.com?query=param",
            "https://sub.domain.example.co.uk",
        ]
        for url in test_urls:
            req = AnalyzeRequest(url=url)
            assert req.url == url

    def test_analyze_request_relative_url(self):
        """Test AnalyzeRequest accepts relative URLs."""
        req = AnalyzeRequest(url="/path/to/page")
        assert req.url == "/path/to/page"


class TestColorInfo:
    """Tests for ColorInfo model."""

    def test_color_info_valid(self):
        """Test valid ColorInfo."""
        color = ColorInfo(name="Primary", hex="#8B5CF6")
        assert color.name == "Primary"
        assert color.hex == "#8B5CF6"

    def test_color_info_missing_name(self):
        """Test ColorInfo rejects missing name."""
        with pytest.raises(ValidationError):
            ColorInfo(hex="#8B5CF6")

    def test_color_info_missing_hex(self):
        """Test ColorInfo rejects missing hex."""
        with pytest.raises(ValidationError):
            ColorInfo(name="Primary")

    def test_color_info_various_hex_formats(self):
        """Test ColorInfo with various hex color formats."""
        test_colors = [
            "#000000",  # 6-digit
            "#FFFFFF",
            "#ABC",     # 3-digit
            "#123456",
            "#abcdef",  # lowercase
        ]
        for hex_color in test_colors:
            color = ColorInfo(name="Test", hex=hex_color)
            assert color.hex == hex_color


class TestAnalyzeResponse:
    """Tests for AnalyzeResponse model."""

    def test_analyze_response_valid(self):
        """Test valid AnalyzeResponse."""
        resp = AnalyzeResponse(
            colors=[ColorInfo(name="Primary", hex="#8B5CF6")],
            fonts=["Inter", "Roboto"],
            components=["Button", "Card"],
            suggestions=["Add whitespace"]
        )
        assert len(resp.colors) == 1
        assert len(resp.fonts) == 2
        assert len(resp.components) == 2
        assert len(resp.suggestions) == 1

    def test_analyze_response_empty_lists(self):
        """Test AnalyzeResponse with empty lists."""
        resp = AnalyzeResponse(
            colors=[],
            fonts=[],
            components=[],
            suggestions=[]
        )
        assert resp.colors == []
        assert resp.fonts == []

    def test_analyze_response_multiple_colors(self):
        """Test AnalyzeResponse with multiple colors."""
        colors = [
            ColorInfo(name="Primary", hex="#8B5CF6"),
            ColorInfo(name="Secondary", hex="#389CFD"),
            ColorInfo(name="Accent", hex="#FF6B6B"),
        ]
        resp = AnalyzeResponse(
            colors=colors,
            fonts=[],
            components=[],
            suggestions=[]
        )
        assert len(resp.colors) == 3

    def test_analyze_response_complex_data(self):
        """Test AnalyzeResponse with complex nested data."""
        resp = AnalyzeResponse(
            colors=[
                ColorInfo(name=f"Color{i}", hex=f"#{i:06X}")
                for i in range(5)
            ],
            fonts=["Inter", "Roboto", "Poppins", "Mono"],
            components=["Button", "Card", "Modal", "Dropdown", "Tooltip"],
            suggestions=[
                "Improve contrast",
                "Add more whitespace",
                "Use consistent typography",
                "Simplify color palette",
            ]
        )
        assert len(resp.colors) == 5
        assert len(resp.fonts) == 4
        assert len(resp.components) == 5


class TestThemeRequest:
    """Tests for ThemeRequest model."""

    def test_theme_request_valid(self):
        """Test valid ThemeRequest."""
        req = ThemeRequest(description="A dark modern theme with purple accents")
        assert req.description == "A dark modern theme with purple accents"

    def test_theme_request_missing_description(self):
        """Test ThemeRequest rejects missing description."""
        with pytest.raises(ValidationError):
            ThemeRequest()

    def test_theme_request_empty_description(self):
        """Test ThemeRequest accepts empty description."""
        req = ThemeRequest(description="")
        assert req.description == ""

    def test_theme_request_long_description(self):
        """Test ThemeRequest with very long description."""
        long_desc = "A theme with " * 1000
        req = ThemeRequest(description=long_desc)
        assert len(req.description) > 1000


class TestThemeResponse:
    """Tests for ThemeResponse model."""

    def test_theme_response_valid(self):
        """Test valid ThemeResponse."""
        resp = ThemeResponse(
            name="Midnight Purple",
            primary="#8B5CF6",
            accent="#389CFD",
            bg="#0B0B18",
            css_code="/* CSS */",
            tailwind_code="// Tailwind"
        )
        assert resp.name == "Midnight Purple"
        assert resp.primary == "#8B5CF6"

    def test_theme_response_missing_required_field(self):
        """Test ThemeResponse rejects missing required field."""
        with pytest.raises(ValidationError):
            ThemeResponse(
                name="Test",
                primary="#000000",
                accent="#FFFFFF",
                # Missing bg
                css_code="",
                tailwind_code=""
            )

    def test_theme_response_various_hex_colors(self):
        """Test ThemeResponse with various color formats."""
        colors = [
            ("#000000", "#FFFFFF", "#888888"),
            ("#FF0000", "#00FF00", "#0000FF"),
            ("#abc", "#def", "#123"),  # 3-digit
        ]
        for primary, accent, bg in colors:
            resp = ThemeResponse(
                name="Test",
                primary=primary,
                accent=accent,
                bg=bg,
                css_code="",
                tailwind_code=""
            )
            assert resp.primary == primary
            assert resp.accent == accent
            assert resp.bg == bg

    def test_theme_response_code_content(self):
        """Test ThemeResponse with realistic code content."""
        css = ":root { --color: #fff; }"
        tailwind = "theme: { colors: { test: '#fff' } }"
        resp = ThemeResponse(
            name="Test",
            primary="#fff",
            accent="#000",
            bg="#f5f5f5",
            css_code=css,
            tailwind_code=tailwind
        )
        assert resp.css_code == css
        assert resp.tailwind_code == tailwind

    def test_theme_response_multiline_code(self):
        """Test ThemeResponse with multiline code."""
        css_code = """/* Theme */
:root {
  --primary: #8B5CF6;
  --accent: #389CFD;
}"""
        resp = ThemeResponse(
            name="Multi",
            primary="#8B5CF6",
            accent="#389CFD",
            bg="#0B0B18",
            css_code=css_code,
            tailwind_code="config"
        )
        assert "\n" in resp.css_code
        assert "--primary" in resp.css_code


class TestModelSerialization:
    """Tests for model serialization (dict/JSON)."""

    def test_generate_request_dict(self):
        """Test GenerateRequest serialization to dict."""
        req = GenerateRequest(prompt="test", category="Button")
        data = req.model_dump()
        assert data["prompt"] == "test"
        assert data["category"] == "Button"

    def test_generate_response_dict(self):
        """Test GenerateResponse serialization to dict."""
        resp = GenerateResponse(
            name="Test",
            code="export default function Test() {}",
            badge="Button",
            badge_color="color",
            doc_slug="test",
            imports=["react"]
        )
        data = resp.model_dump()
        assert data["name"] == "Test"
        assert isinstance(data["imports"], list)

    def test_color_info_dict(self):
        """Test ColorInfo serialization to dict."""
        color = ColorInfo(name="Primary", hex="#8B5CF6")
        data = color.model_dump()
        assert data["name"] == "Primary"
        assert data["hex"] == "#8B5CF6"

    def test_theme_response_json(self):
        """Test ThemeResponse serialization to JSON."""
        resp = ThemeResponse(
            name="Test",
            primary="#8B5CF6",
            accent="#389CFD",
            bg="#0B0B18",
            css_code="css",
            tailwind_code="tw"
        )
        import json
        json_str = resp.model_dump_json()
        parsed = json.loads(json_str)
        assert parsed["name"] == "Test"
        assert parsed["primary"] == "#8B5CF6"
