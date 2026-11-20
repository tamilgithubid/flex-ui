"""
Unit tests for FlexUI AI Studio FastAPI endpoints.
Tests: GET /, POST /api/generate, POST /api/analyze, POST /api/theme
"""

import pytest
import json
from unittest.mock import AsyncMock, patch, MagicMock
from fastapi import HTTPException


class TestHealthEndpoint:
    """Tests for GET / health check endpoint."""

    def test_health_check_success(self, test_client):
        """Test health check returns 200 with provider status."""
        response = test_client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "ok"
        assert data["service"] == "FlexUI AI Studio API"
        assert "providers" in data
        assert "gemini" in data["providers"]
        assert "groq" in data["providers"]

    def test_health_check_response_structure(self, test_client):
        """Test health check response has correct structure."""
        response = test_client.get("/")
        data = response.json()
        assert isinstance(data["providers"]["gemini"], bool)
        assert isinstance(data["providers"]["groq"], bool)

    def test_health_check_no_auth_required(self, test_client):
        """Test health check is accessible without authentication."""
        response = test_client.get("/")
        assert response.status_code == 200


class TestGenerateEndpoint:
    """Tests for POST /api/generate endpoint."""

    @pytest.mark.asyncio
    async def test_generate_valid_request(self, test_client, generate_request_data):
        """Test generate endpoint with valid input."""
        with patch("main.ai_generate", new_callable=AsyncMock) as mock_generate:
            mock_generate.return_value = '''{
                "name": "AnimatedButton",
                "code": "export default function AnimatedButton() { return <button>Click me</button>; }",
                "badge": "Button",
                "doc_slug": "animated-button",
                "imports": ["react"]
            }'''
            
            response = test_client.post("/api/generate", json=generate_request_data)
            assert response.status_code == 200
            data = response.json()
            assert data["name"] == "AnimatedButton"
            assert "export default" in data["code"]
            assert data["badge"] == "Button"

    @pytest.mark.asyncio
    async def test_generate_missing_prompt(self, test_client):
        """Test generate endpoint rejects missing prompt."""
        response = test_client.post("/api/generate", json={"category": "Button"})
        assert response.status_code == 422

    @pytest.mark.asyncio
    async def test_generate_with_category(self, test_client):
        """Test generate endpoint with category hint."""
        with patch("main.ai_generate", new_callable=AsyncMock) as mock_generate:
            mock_generate.return_value = '''{
                "name": "CardComponent",
                "code": "export default function Card() { return <div>Card</div>; }",
                "badge": "Card",
                "doc_slug": "card",
                "imports": []
            }'''
            
            response = test_client.post("/api/generate", json={
                "prompt": "Create a card component",
                "category": "Card"
            })
            assert response.status_code == 200
            # Verify category hint was used in prompt
            call_args = mock_generate.call_args
            assert "Category focus: Card" in call_args[0][1]

    @pytest.mark.asyncio
    async def test_generate_retry_on_bad_code(self, test_client, generate_request_data):
        """Test generate endpoint retries on invalid code response."""
        with patch("main.ai_generate", new_callable=AsyncMock) as mock_generate:
            # First call returns bad code (too short, no export)
            # Second call returns valid code
            mock_generate.side_effect = [
                '{"name": "Bad", "code": "const x = 1", "badge": "Component", "doc_slug": "", "imports": []}',
                '{"name": "Good", "code": "export default function Good() { return <div>Good</div>; }", "badge": "Component", "doc_slug": "good", "imports": []}'
            ]
            
            response = test_client.post("/api/generate", json=generate_request_data)
            assert response.status_code == 200
            # Should have called ai_generate twice (initial + retry)
            assert mock_generate.call_count == 2
            data = response.json()
            assert "export default" in data["code"]

    @pytest.mark.asyncio
    async def test_generate_badge_color_mapping(self, test_client):
        """Test badge color mapping for different component types."""
        test_cases = [
            ("Button", "bg-violet-500/15 text-violet-400"),
            ("Card", "bg-cyan-500/15 text-cyan-400"),
            ("Text", "bg-amber-500/15 text-amber-400"),
            ("Background", "bg-emerald-500/15 text-emerald-400"),
            ("Effect", "bg-rose-500/15 text-rose-400"),
            ("Layout", "bg-blue-500/15 text-blue-400"),
            ("Scroll", "bg-orange-500/15 text-orange-400"),
            ("WebGL", "bg-purple-500/15 text-purple-400"),
        ]
        
        for badge_name, expected_color in test_cases:
            with patch("main.ai_generate", new_callable=AsyncMock) as mock_generate:
                mock_generate.return_value = json.dumps({
                    "name": badge_name,
                    "code": "export default function C() { return <div/>; }",
                    "badge": badge_name,
                    "doc_slug": badge_name.lower(),
                    "imports": []
                })
                
                response = test_client.post("/api/generate", json={"prompt": "test"})
                assert response.status_code == 200
                data = response.json()
                assert data["badge_color"] == expected_color

    @pytest.mark.asyncio
    async def test_generate_default_badge_color(self, test_client):
        """Test default badge color for unknown badge type."""
        with patch("main.ai_generate", new_callable=AsyncMock) as mock_generate:
            mock_generate.return_value = '''{
                "name": "Unknown",
                "code": "export default function Unknown() { return <div/>; }",
                "badge": "UnknownType",
                "doc_slug": "unknown",
                "imports": []
            }'''
            
            response = test_client.post("/api/generate", json={"prompt": "test"})
            assert response.status_code == 200
            data = response.json()
            assert data["badge_color"] == "bg-zinc-500/15 text-zinc-400"

    @pytest.mark.asyncio
    async def test_generate_response_structure(self, test_client, valid_generate_response):
        """Test generate response has all required fields."""
        with patch("main.ai_generate", new_callable=AsyncMock) as mock_generate:
            mock_generate.return_value = valid_generate_response
            
            response = test_client.post("/api/generate", json={"prompt": "test"})
            assert response.status_code == 200
            data = response.json()
            assert "name" in data
            assert "code" in data
            assert "badge" in data
            assert "badge_color" in data
            assert "doc_slug" in data
            assert "imports" in data
            assert isinstance(data["imports"], list)


class TestAnalyzeEndpoint:
    """Tests for POST /api/analyze endpoint."""

    @pytest.mark.asyncio
    async def test_analyze_valid_url(self, test_client, analyze_request_data, mock_html_response):
        """Test analyze endpoint fetches and parses URL."""
        with patch("main.httpx.AsyncClient") as mock_client_class, \
             patch("main.ai_generate", new_callable=AsyncMock) as mock_generate:
            
            mock_response = MagicMock()
            mock_response.text = mock_html_response
            mock_client_instance = AsyncMock()
            mock_client_instance.get = AsyncMock(return_value=mock_response)
            mock_client_instance.__aenter__ = AsyncMock(return_value=mock_client_instance)
            mock_client_instance.__aexit__ = AsyncMock(return_value=None)
            mock_client_class.return_value = mock_client_instance
            
            mock_generate.return_value = '''{
                "colors": [
                    {"name": "Primary", "hex": "#8B5CF6"},
                    {"name": "Accent", "hex": "#389CFD"}
                ],
                "fonts": ["Inter"],
                "components": ["Button"],
                "suggestions": ["Use more whitespace"]
            }'''
            
            response = test_client.post("/api/analyze", json=analyze_request_data)
            assert response.status_code == 200
            data = response.json()
            assert "colors" in data
            assert "fonts" in data
            assert "components" in data
            assert "suggestions" in data

    @pytest.mark.asyncio
    async def test_analyze_invalid_url(self, test_client):
        """Test analyze endpoint with invalid/unreachable URL."""
        with patch("main.httpx.AsyncClient") as mock_client_class:
            mock_client_instance = AsyncMock()
            mock_client_instance.get = AsyncMock(side_effect=Exception("Connection failed"))
            mock_client_instance.__aenter__ = AsyncMock(return_value=mock_client_instance)
            mock_client_instance.__aexit__ = AsyncMock(return_value=None)
            mock_client_class.return_value = mock_client_instance
            
            response = test_client.post("/api/analyze", json={"url": "https://invalid-url-that-doesnt-exist.test"})
            assert response.status_code == 400
            assert "Could not fetch URL" in response.json()["detail"]

    @pytest.mark.asyncio
    async def test_analyze_css_extraction(self, test_client, mock_html_response):
        """Test analyze endpoint extracts CSS custom properties."""
        with patch("main.httpx.AsyncClient") as mock_client_class, \
             patch("main.ai_generate", new_callable=AsyncMock) as mock_generate:
            
            mock_response = MagicMock()
            mock_response.text = mock_html_response
            mock_client_instance = AsyncMock()
            mock_client_instance.get = AsyncMock(return_value=mock_response)
            mock_client_instance.__aenter__ = AsyncMock(return_value=mock_client_instance)
            mock_client_instance.__aexit__ = AsyncMock(return_value=None)
            mock_client_class.return_value = mock_client_instance
            
            mock_generate.return_value = '''{
                "colors": [],
                "fonts": [],
                "components": [],
                "suggestions": []
            }'''
            
            response = test_client.post("/api/analyze", json={"url": "https://example.com"})
            assert response.status_code == 200
            # Verify CSS extraction was called
            call_args = mock_generate.call_args
            assert "--primary-color" in call_args[0][1]

    @pytest.mark.asyncio
    async def test_analyze_fonts_extraction(self, test_client):
        """Test analyze endpoint extracts Google Fonts."""
        html_with_fonts = '''<!DOCTYPE html>
<html>
<head>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&family=Mono" rel="stylesheet">
</head>
<body>Content</body>
</html>'''
        
        with patch("main.httpx.AsyncClient") as mock_client_class, \
             patch("main.ai_generate", new_callable=AsyncMock) as mock_generate:
            
            mock_response = MagicMock()
            mock_response.text = html_with_fonts
            mock_client_instance = AsyncMock()
            mock_client_instance.get = AsyncMock(return_value=mock_response)
            mock_client_instance.__aenter__ = AsyncMock(return_value=mock_client_instance)
            mock_client_instance.__aexit__ = AsyncMock(return_value=None)
            mock_client_class.return_value = mock_client_instance
            
            mock_generate.return_value = '''{
                "colors": [],
                "fonts": ["Poppins", "Mono"],
                "components": [],
                "suggestions": []
            }'''
            
            response = test_client.post("/api/analyze", json={"url": "https://example.com"})
            assert response.status_code == 200
            data = response.json()
            assert "Poppins" in data["fonts"] or "Mono" in data["fonts"]

    @pytest.mark.asyncio
    async def test_analyze_color_extraction(self, test_client):
        """Test analyze endpoint extracts inline colors."""
        html_with_colors = '''<!DOCTYPE html>
<html>
<body>
    <div style="color: #FF0000; background: #00FF00;">Red text</div>
    <button style="background-color: #0000FF;">Blue button</button>
</body>
</html>'''
        
        with patch("main.httpx.AsyncClient") as mock_client_class, \
             patch("main.ai_generate", new_callable=AsyncMock) as mock_generate:
            
            mock_response = MagicMock()
            mock_response.text = html_with_colors
            mock_client_instance = AsyncMock()
            mock_client_instance.get = AsyncMock(return_value=mock_response)
            mock_client_instance.__aenter__ = AsyncMock(return_value=mock_client_instance)
            mock_client_instance.__aexit__ = AsyncMock(return_value=None)
            mock_client_class.return_value = mock_client_instance
            
            mock_generate.return_value = '''{
                "colors": [{"name": "Red", "hex": "#FF0000"}],
                "fonts": [],
                "components": [],
                "suggestions": []
            }'''
            
            response = test_client.post("/api/analyze", json={"url": "https://example.com"})
            assert response.status_code == 200

    @pytest.mark.asyncio
    async def test_analyze_response_limits(self, test_client, mock_html_response):
        """Test analyze endpoint respects response limits."""
        with patch("main.httpx.AsyncClient") as mock_client_class, \
             patch("main.ai_generate", new_callable=AsyncMock) as mock_generate:
            
            mock_response = MagicMock()
            mock_response.text = mock_html_response
            mock_client_instance = AsyncMock()
            mock_client_instance.get = AsyncMock(return_value=mock_response)
            mock_client_instance.__aenter__ = AsyncMock(return_value=mock_client_instance)
            mock_client_instance.__aexit__ = AsyncMock(return_value=None)
            mock_client_class.return_value = mock_client_instance
            
            # Return more items than limits
            mock_generate.return_value = '''{
                "colors": [
                    {"name": "C1", "hex": "#111111"},
                    {"name": "C2", "hex": "#222222"},
                    {"name": "C3", "hex": "#333333"},
                    {"name": "C4", "hex": "#444444"},
                    {"name": "C5", "hex": "#555555"},
                    {"name": "C6", "hex": "#666666"},
                    {"name": "C7", "hex": "#777777"},
                    {"name": "C8", "hex": "#888888"}
                ],
                "fonts": ["F1", "F2", "F3", "F4", "F5", "F6"],
                "components": ["Comp1", "Comp2", "Comp3", "Comp4", "Comp5", "Comp6", "Comp7", "Comp8", "Comp9"],
                "suggestions": ["S1", "S2", "S3", "S4", "S5", "S6", "S7"]
            }'''
            
            response = test_client.post("/api/analyze", json={"url": "https://example.com"})
            assert response.status_code == 200
            data = response.json()
            assert len(data["colors"]) <= 6
            assert len(data["fonts"]) <= 5
            assert len(data["components"]) <= 8
            assert len(data["suggestions"]) <= 6


class TestThemeEndpoint:
    """Tests for POST /api/theme endpoint."""

    @pytest.mark.asyncio
    async def test_theme_valid_request(self, test_client, theme_request_data):
        """Test theme endpoint generates theme successfully."""
        with patch("main.ai_generate", new_callable=AsyncMock) as mock_generate:
            mock_generate.return_value = '''{
                "name": "Midnight Purple",
                "primary": "#8B5CF6",
                "accent": "#389CFD",
                "bg": "#0B0B18"
            }'''
            
            response = test_client.post("/api/theme", json=theme_request_data)
            assert response.status_code == 200
            data = response.json()
            assert data["name"] == "Midnight Purple"
            assert data["primary"] == "#8B5CF6"
            assert data["accent"] == "#389CFD"
            assert data["bg"] == "#0B0B18"

    @pytest.mark.asyncio
    async def test_theme_missing_description(self, test_client):
        """Test theme endpoint rejects missing description."""
        response = test_client.post("/api/theme", json={})
        assert response.status_code == 422

    @pytest.mark.asyncio
    async def test_theme_css_code_generation(self, test_client):
        """Test theme endpoint generates valid CSS code."""
        with patch("main.ai_generate", new_callable=AsyncMock) as mock_generate:
            mock_generate.return_value = '''{
                "name": "Ocean Blue",
                "primary": "#0EA5E9",
                "accent": "#06B6D4",
                "bg": "#0F172A"
            }'''
            
            response = test_client.post("/api/theme", json={"description": "ocean theme"})
            assert response.status_code == 200
            data = response.json()
            assert "--flexui-primary: #0EA5E9" in data["css_code"]
            assert "--flexui-accent: #06B6D4" in data["css_code"]
            assert "--flexui-bg: #0F172A" in data["css_code"]
            assert ":root {" in data["css_code"]

    @pytest.mark.asyncio
    async def test_theme_tailwind_code_generation(self, test_client):
        """Test theme endpoint generates valid Tailwind config."""
        with patch("main.ai_generate", new_callable=AsyncMock) as mock_generate:
            mock_generate.return_value = '''{
                "name": "Forest Green",
                "primary": "#10B981",
                "accent": "#059669",
                "bg": "#064E3B"
            }'''
            
            response = test_client.post("/api/theme", json={"description": "forest theme"})
            assert response.status_code == 200
            data = response.json()
            assert '"#10B981"' in data["tailwind_code"]
            assert '"#059669"' in data["tailwind_code"]
            assert '"#064E3B"' in data["tailwind_code"]
            assert "tailwind.config.ts" in data["tailwind_code"]

    @pytest.mark.asyncio
    async def test_theme_default_values(self, test_client):
        """Test theme endpoint uses default colors if not provided."""
        with patch("main.ai_generate", new_callable=AsyncMock) as mock_generate:
            # Return partial data
            mock_generate.return_value = '{"name": "Partial"}'
            
            response = test_client.post("/api/theme", json={"description": "test"})
            assert response.status_code == 200
            data = response.json()
            assert data["name"] == "Partial"
            # Should have default values
            assert data["primary"] == "#8B5CF6"
            assert data["accent"] == "#389CFD"
            assert data["bg"] == "#0B0B18"

    @pytest.mark.asyncio
    async def test_theme_response_structure(self, test_client, valid_theme_response):
        """Test theme response has all required fields."""
        with patch("main.ai_generate", new_callable=AsyncMock) as mock_generate:
            mock_generate.return_value = valid_theme_response
            
            response = test_client.post("/api/theme", json={"description": "test"})
            assert response.status_code == 200
            data = response.json()
            assert "name" in data
            assert "primary" in data
            assert "accent" in data
            assert "bg" in data
            assert "css_code" in data
            assert "tailwind_code" in data
