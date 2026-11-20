"""
Tests for utility functions: parse_json_response, _badge_color, etc.
"""

import pytest
import json
from fastapi import HTTPException
from main import parse_json_response, _badge_color


class TestParseJsonResponse:
    """Tests for parse_json_response utility function."""

    def test_parse_direct_json(self):
        """Test parsing direct JSON without code block."""
        text = '{"name": "Button", "code": "export default function Button() {}"}'
        result = parse_json_response(text)
        assert result["name"] == "Button"
        assert "export default" in result["code"]

    def test_parse_json_with_markdown_block(self):
        """Test parsing JSON from markdown code block."""
        text = '''```json
{"name": "Card", "code": "export default function Card() {}"}
```'''
        result = parse_json_response(text)
        assert result["name"] == "Card"

    def test_parse_json_with_generic_code_block(self):
        """Test parsing JSON from generic code block (no language spec)."""
        text = '''```
{"name": "Modal", "code": "export default function Modal() {}"}
```'''
        result = parse_json_response(text)
        assert result["name"] == "Modal"

    def test_parse_json_with_surrounding_text(self):
        """Test parsing JSON with surrounding text."""
        text = '''
        Here is the generated component:
        
        ```json
        {"name": "Component", "value": 42}
        ```
        
        This is a great component!
        '''
        result = parse_json_response(text)
        assert result["name"] == "Component"
        assert result["value"] == 42

    def test_parse_json_extract_from_braces(self):
        """Test extracting JSON from first { to last }."""
        text = 'Some text before {"name": "Test"} some text after'
        result = parse_json_response(text)
        assert result["name"] == "Test"

    def test_parse_complex_json(self):
        """Test parsing complex nested JSON."""
        complex_json = {
            "name": "ComplexComponent",
            "code": "export default function C() { return <div/>; }",
            "metadata": {
                "version": "1.0",
                "author": "AI",
                "tags": ["component", "complex"]
            },
            "imports": ["react", "react-dom"]
        }
        text = json.dumps(complex_json)
        result = parse_json_response(text)
        assert result["name"] == "ComplexComponent"
        assert result["metadata"]["author"] == "AI"
        assert len(result["imports"]) == 2

    def test_parse_json_with_whitespace(self):
        """Test parsing JSON with extra whitespace."""
        text = '''
        ```json
        
        {
            "name": "Spaced",
            "value": "with whitespace"
        }
        
        ```
        '''
        result = parse_json_response(text)
        assert result["name"] == "Spaced"

    def test_parse_json_invalid_raises_exception(self):
        """Test parsing invalid JSON raises HTTPException."""
        text = "This is not JSON at all!"
        with pytest.raises(HTTPException) as exc_info:
            parse_json_response(text)
        assert exc_info.value.status_code == 500
        assert "Failed to parse" in exc_info.value.detail

    def test_parse_json_invalid_in_block_raises_exception(self):
        """Test parsing invalid JSON in code block raises exception."""
        text = '''```json
        {invalid json here}
        ```'''
        with pytest.raises(HTTPException):
            parse_json_response(text)

    def test_parse_json_empty_string_raises_exception(self):
        """Test parsing empty string raises exception."""
        with pytest.raises(HTTPException):
            parse_json_response("")

    def test_parse_json_only_braces_raises_exception(self):
        """Test parsing invalid brace-only content raises exception."""
        with pytest.raises(HTTPException):
            parse_json_response("{invalid: json}")

    @pytest.mark.parametrize("json_str", [
        '{"simple": true}',
        '{"nested": {"value": 123}}',
        '{"array": [1, 2, 3]}',
        '{"string": "value with \\"quotes\\""}',
        '{"number": 42.5}',
        '{"null_value": null}',
    ])
    def test_parse_various_json_types(self, json_str):
        """Test parsing various valid JSON types."""
        result = parse_json_response(json_str)
        assert isinstance(result, dict)

    def test_parse_json_with_escaped_characters(self):
        """Test parsing JSON with escaped characters."""
        text = '{"name": "Component\\nWith\\nNewlines", "path": "C:\\\\Users\\\\test"}'
        result = parse_json_response(text)
        assert "\n" in result["name"]

    def test_parse_json_markdown_multiple_blocks(self):
        """Test parsing JSON from first code block only."""
        text = '''
        ```json
        {"first": true}
        ```
        
        Some text
        
        ```json
        {"second": true}
        ```
        '''
        result = parse_json_response(text)
        assert result["first"] is True
        # Should only parse first block

    def test_parse_json_unicode(self):
        """Test parsing JSON with unicode characters."""
        text = '{"name": "Componènt 🎨", "emoji": "🚀"}'
        result = parse_json_response(text)
        assert "🎨" in result["name"]
        assert result["emoji"] == "🚀"

    def test_parse_json_numeric_keys(self):
        """Test parsing JSON with numeric values."""
        text = '{"version": "1.0", "count": 42, "rating": 4.5}'
        result = parse_json_response(text)
        assert result["count"] == 42
        assert result["rating"] == 4.5


class TestBadgeColor:
    """Tests for _badge_color utility function."""

    @pytest.mark.parametrize("badge,expected_color", [
        ("Button", "bg-violet-500/15 text-violet-400"),
        ("Card", "bg-cyan-500/15 text-cyan-400"),
        ("Text", "bg-amber-500/15 text-amber-400"),
        ("Background", "bg-emerald-500/15 text-emerald-400"),
        ("Effect", "bg-rose-500/15 text-rose-400"),
        ("Layout", "bg-blue-500/15 text-blue-400"),
        ("Scroll", "bg-orange-500/15 text-orange-400"),
        ("WebGL", "bg-purple-500/15 text-purple-400"),
    ])
    def test_badge_color_mapping(self, badge, expected_color):
        """Test badge color mapping for all known badges."""
        assert _badge_color(badge) == expected_color

    def test_badge_color_unknown_returns_default(self):
        """Test unknown badge returns default gray color."""
        result = _badge_color("UnknownBadge")
        assert result == "bg-zinc-500/15 text-zinc-400"

    def test_badge_color_case_sensitive(self):
        """Test badge color matching is case-sensitive."""
        assert _badge_color("button") == "bg-zinc-500/15 text-zinc-400"
        assert _badge_color("BUTTON") == "bg-zinc-500/15 text-zinc-400"
        assert _badge_color("Button") == "bg-violet-500/15 text-violet-400"

    def test_badge_color_empty_string(self):
        """Test empty string badge returns default color."""
        assert _badge_color("") == "bg-zinc-500/15 text-zinc-400"

    def test_badge_color_whitespace(self):
        """Test whitespace badge returns default color."""
        assert _badge_color("   ") == "bg-zinc-500/15 text-zinc-400"
        assert _badge_color("\t") == "bg-zinc-500/15 text-zinc-400"

    def test_badge_color_partial_match(self):
        """Test partial matches don't work (exact match required)."""
        assert _badge_color("ButtonLarge") == "bg-zinc-500/15 text-zinc-400"
        assert _badge_color("MyButton") == "bg-zinc-500/15 text-zinc-400"

    @pytest.mark.parametrize("invalid_badge", [
        "InvalidType",
        "123",
        "button with spaces",
        "Card-Custom",
        "NEW_BADGE",
        "component",
    ])
    def test_badge_color_invalid_returns_default(self, invalid_badge):
        """Test various invalid badges return default color."""
        result = _badge_color(invalid_badge)
        assert result == "bg-zinc-500/15 text-zinc-400"

    def test_badge_color_all_badges_have_color(self):
        """Test that calling _badge_color doesn't raise exceptions."""
        badges = ["Button", "Card", "Text", "Background", "Effect", "Layout", "Scroll", "WebGL"]
        for badge in badges:
            result = _badge_color(badge)
            assert isinstance(result, str)
            assert len(result) > 0
            assert "bg-" in result
            assert "text-" in result

    def test_badge_color_format_structure(self):
        """Test badge color returns proper Tailwind format."""
        color = _badge_color("Button")
        parts = color.split()
        assert len(parts) == 2
        assert parts[0].startswith("bg-")
        assert parts[1].startswith("text-")

    def test_badge_color_special_characters(self):
        """Test special characters in badge name."""
        result = _badge_color("@Component")
        assert result == "bg-zinc-500/15 text-zinc-400"
        
        result = _badge_color("Component#")
        assert result == "bg-zinc-500/15 text-zinc-400"


class TestBadgeColorIntegration:
    """Integration tests for badge color with model data."""

    def test_badge_color_with_response_data(self):
        """Test badge color function with actual response data."""
        from models import GenerateResponse
        
        badges_to_test = [
            ("Button", "bg-violet-500/15 text-violet-400"),
            ("Card", "bg-cyan-500/15 text-cyan-400"),
            ("Layout", "bg-blue-500/15 text-blue-400"),
        ]
        
        for badge, expected_color in badges_to_test:
            color = _badge_color(badge)
            resp = GenerateResponse(
                name="Test",
                code="export default function Test() {}",
                badge=badge,
                badge_color=color,
                doc_slug="test",
                imports=[]
            )
            assert resp.badge_color == expected_color


class TestJsonResponseEdgeCases:
    """Edge case tests for parse_json_response."""

    def test_parse_json_nested_code_blocks(self):
        """Test parsing JSON with code blocks inside."""
        text = '''```json
{
    "name": "Component",
    "code": "```inline code```"
}
```'''
        # This might fail due to nested backticks, which is expected
        with pytest.raises(HTTPException):
            parse_json_response(text)

    def test_parse_json_only_closing_brace(self):
        """Test parsing text with only closing brace."""
        with pytest.raises(HTTPException):
            parse_json_response("text } more text")

    def test_parse_json_only_opening_brace(self):
        """Test parsing text with only opening brace."""
        with pytest.raises(HTTPException):
            parse_json_response("text { more text")

    def test_parse_json_adjacent_braces(self):
        """Test parsing JSON with adjacent braces in text."""
        text = 'before {} {"valid": true} after'
        # Should extract the valid JSON part
        result = parse_json_response(text)
        assert result["valid"] is True

    def test_parse_json_very_large_response(self):
        """Test parsing very large JSON response."""
        large_data = {
            "data": {f"key_{i}": f"value_{i}" for i in range(1000)}
        }
        text = json.dumps(large_data)
        result = parse_json_response(text)
        assert len(result["data"]) == 1000

    def test_parse_json_html_in_content(self):
        """Test parsing JSON with HTML content."""
        text = '''{
    "html": "<div class=\\"container\\"><p>Content</p></div>",
    "type": "html"
}'''
        result = parse_json_response(text)
        assert "<div" in result["html"]
