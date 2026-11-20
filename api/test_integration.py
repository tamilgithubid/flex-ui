"""
Integration tests for FlexUI AI Studio API.
Tests full end-to-end workflows and cross-endpoint interactions.
"""

import pytest
import json
from unittest.mock import AsyncMock, patch, MagicMock
from fastapi import HTTPException


class TestGenerateComponentIntegration:
    """Integration tests for component generation workflow."""

    @pytest.mark.asyncio
    async def test_generate_button_full_workflow(self, test_client):
        """Test complete workflow: request → AI → response → validation."""
        with patch("main.ai_generate", new_callable=AsyncMock) as mock_ai:
            mock_ai.return_value = json.dumps({
                "name": "MagneticButton",
                "code": """
import { useState } from 'react';
export default function MagneticButton({ className, children }) {
    const [isHovered, setIsHovered] = useState(false);
    return (
        <button
            className={`px-4 py-2 rounded transition-all ${className}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {children}
        </button>
    );
}
""",
                "badge": "Button",
                "doc_slug": "magnetic-button",
                "imports": ["react"]
            })
            
            response = test_client.post("/api/generate", json={
                "prompt": "Create a magnetic button with hover effects",
                "category": "Button"
            })
            
            assert response.status_code == 200
            data = response.json()
            
            # Validate all response fields
            assert data["name"] == "MagneticButton"
            assert "export default" in data["code"]
            assert "MagneticButton" in data["code"]
            assert data["badge"] == "Button"
            assert data["badge_color"] == "bg-violet-500/15 text-violet-400"
            assert data["doc_slug"] == "magnetic-button"
            assert "react" in data["imports"]

    @pytest.mark.asyncio
    async def test_generate_with_retry_workflow(self, test_client):
        """Test generate workflow with auto-retry on bad code."""
        with patch("main.ai_generate", new_callable=AsyncMock) as mock_ai:
            # First response is bad (no export), second is good
            mock_ai.side_effect = [
                json.dumps({
                    "name": "BadComponent",
                    "code": "const x = 1;",  # Too short, no export
                    "badge": "Component",
                    "doc_slug": "bad",
                    "imports": []
                }),
                json.dumps({
                    "name": "GoodComponent",
                    "code": "export default function GoodComponent() { return <div>Good</div>; }",
                    "badge": "Component",
                    "doc_slug": "good",
                    "imports": []
                })
            ]
            
            response = test_client.post("/api/generate", json={
                "prompt": "Create a component"
            })
            
            assert response.status_code == 200
            data = response.json()
            assert "export default" in data["code"]
            # Verify retry occurred
            assert mock_ai.call_count == 2

    @pytest.mark.asyncio
    async def test_generate_multiple_categories(self, test_client):
        """Test generating components across different categories."""
        categories_to_test = [
            ("Button", "Create an animated button"),
            ("Card", "Create a spotlight card"),
            ("Background", "Create an aurora background"),
            ("Effect", "Create a blur fade effect"),
        ]
        
        for category, prompt in categories_to_test:
            with patch("main.ai_generate", new_callable=AsyncMock) as mock_ai:
                mock_ai.return_value = json.dumps({
                    "name": f"{category}Component",
                    "code": f"export default function {category}() {{}}",
                    "badge": category,
                    "doc_slug": category.lower(),
                    "imports": []
                })
                
                response = test_client.post("/api/generate", json={
                    "prompt": prompt,
                    "category": category
                })
                
                assert response.status_code == 200
                data = response.json()
                assert data["badge"] == category
                # Verify category hint was included
                call_args = mock_ai.call_args[0][1]
                assert f"Category focus: {category}" in call_args

    @pytest.mark.asyncio
    async def test_generate_code_quality_validation(self, test_client):
        """Test code quality checks and validation."""
        test_cases = [
            ("Good export", "export default function C() { return <div/>; }", True),
            ("Named export only", "export function C() { return <div/>; }", False),
            ("No export", "function C() { return <div/>; }", False),
            ("Too short", "x=1", False),
        ]
        
        for description, code, should_pass in test_cases:
            with patch("main.ai_generate", new_callable=AsyncMock) as mock_ai:
                if should_pass:
                    mock_ai.return_value = json.dumps({
                        "name": "Test",
                        "code": code,
                        "badge": "Component",
                        "doc_slug": "test",
                        "imports": []
                    })
                else:
                    # First call returns bad code, second returns good
                    mock_ai.side_effect = [
                        json.dumps({
                            "name": "Test",
                            "code": code,
                            "badge": "Component",
                            "doc_slug": "test",
                            "imports": []
                        }),
                        json.dumps({
                            "name": "Test",
                            "code": "export default function Test() { return <div/>; }",
                            "badge": "Component",
                            "doc_slug": "test",
                            "imports": []
                        })
                    ]
                
                response = test_client.post("/api/generate", json={
                    "prompt": description
                })
                
                assert response.status_code == 200
                data = response.json()
                assert "export default" in data["code"]


class TestAnalyzeWebsiteIntegration:
    """Integration tests for website analysis workflow."""

    @pytest.mark.asyncio
    async def test_analyze_full_website_workflow(self, test_client):
        """Test complete analysis workflow: fetch → parse → analyze → respond."""
        html_content = '''<!DOCTYPE html>
<html>
<head>
    <style>
        :root {
            --primary: #8B5CF6;
            --accent: #389CFD;
            --bg: #0B0B18;
        }
    </style>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Poppins" rel="stylesheet">
</head>
<body>
    <header style="background: #8B5CF6; color: #FFFFFF;">Header</header>
    <main>
        <button style="background: #389CFD;">CTA</button>
        <card style="background: #0B0B18; border: 1px solid rgba(255,255,255,0.1)">
            Content here
        </card>
    </main>
    <footer>Footer</footer>
</body>
</html>'''
        
        with patch("main.httpx.AsyncClient") as mock_client_class, \
             patch("main.ai_generate", new_callable=AsyncMock) as mock_ai:
            
            # Setup HTTP mock
            mock_response = MagicMock()
            mock_response.text = html_content
            mock_client_instance = AsyncMock()
            mock_client_instance.get = AsyncMock(return_value=mock_response)
            mock_client_instance.__aenter__ = AsyncMock(return_value=mock_client_instance)
            mock_client_instance.__aexit__ = AsyncMock(return_value=None)
            mock_client_class.return_value = mock_client_instance
            
            # Setup AI mock
            mock_ai.return_value = json.dumps({
                "colors": [
                    {"name": "Primary", "hex": "#8B5CF6"},
                    {"name": "Accent", "hex": "#389CFD"},
                    {"name": "Background", "hex": "#0B0B18"}
                ],
                "fonts": ["Inter", "Poppins"],
                "components": ["Header", "Button", "Card", "Footer"],
                "suggestions": [
                    "Increase color contrast",
                    "Add more whitespace",
                    "Improve typography hierarchy"
                ]
            })
            
            response = test_client.post("/api/analyze", json={
                "url": "https://example.com"
            })
            
            assert response.status_code == 200
            data = response.json()
            
            # Validate colors extraction
            assert len(data["colors"]) == 3
            assert data["colors"][0]["name"] == "Primary"
            assert data["colors"][0]["hex"] == "#8B5CF6"
            
            # Validate fonts extraction
            assert "Inter" in data["fonts"]
            assert "Poppins" in data["fonts"]
            
            # Validate component detection
            assert len(data["components"]) > 0
            
            # Validate suggestions
            assert len(data["suggestions"]) > 0

    @pytest.mark.asyncio
    async def test_analyze_complex_website(self, test_client):
        """Test analyzing complex website with multiple styles."""
        html_content = '''<!DOCTYPE html>
<html>
<head>
    <style>
        :root {
            --color-primary: #FF6B6B;
            --color-secondary: #4ECDC4;
            --color-tertiary: #45B7D1;
            --color-dark: #1A1A2E;
            --color-light: #EEEEEE;
            --font-main: "Segoe UI", sans-serif;
            --font-accent: "Georgia", serif;
        }
        .btn-primary { background: var(--color-primary); }
        .btn-secondary { background: var(--color-secondary); }
    </style>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@700&family=Lato:wght@400" rel="stylesheet">
</head>
<body style="background: #1A1A2E; color: #EEEEEE;">
    <nav style="background: linear-gradient(90deg, #FF6B6B, #4ECDC4);">
        <a style="color: #45B7D1;">Link 1</a>
        <a style="color: #45B7D1;">Link 2</a>
    </nav>
    <section style="background: #45B7D1; padding: 40px;">
        <h1>Hero</h1>
        <button style="background: #FF6B6B; color: white;">CTA</button>
    </section>
</body>
</html>'''
        
        with patch("main.httpx.AsyncClient") as mock_client_class, \
             patch("main.ai_generate", new_callable=AsyncMock) as mock_ai:
            
            mock_response = MagicMock()
            mock_response.text = html_content
            mock_client_instance = AsyncMock()
            mock_client_instance.get = AsyncMock(return_value=mock_response)
            mock_client_instance.__aenter__ = AsyncMock(return_value=mock_client_instance)
            mock_client_instance.__aexit__ = AsyncMock(return_value=None)
            mock_client_class.return_value = mock_client_instance
            
            mock_ai.return_value = json.dumps({
                "colors": [
                    {"name": "Primary Red", "hex": "#FF6B6B"},
                    {"name": "Teal", "hex": "#4ECDC4"},
                    {"name": "Sky Blue", "hex": "#45B7D1"},
                    {"name": "Dark", "hex": "#1A1A2E"},
                    {"name": "Light", "hex": "#EEEEEE"}
                ],
                "fonts": ["Montserrat", "Lato", "Segoe UI", "Georgia"],
                "components": ["Nav", "Hero", "Button", "Section"],
                "suggestions": [
                    "Use consistent spacing",
                    "Ensure readable contrast ratios",
                    "Consider mobile responsiveness"
                ]
            })
            
            response = test_client.post("/api/analyze", json={
                "url": "https://complex-site.com"
            })
            
            assert response.status_code == 200
            data = response.json()
            assert len(data["colors"]) == 5
            assert len(data["fonts"]) <= 5  # Respects limit
            assert len(data["components"]) <= 8  # Respects limit

    @pytest.mark.asyncio
    async def test_analyze_with_network_error(self, test_client):
        """Test analyze gracefully handles network errors."""
        with patch("main.httpx.AsyncClient") as mock_client_class:
            mock_client_instance = AsyncMock()
            mock_client_instance.get = AsyncMock(side_effect=Exception("Network timeout"))
            mock_client_instance.__aenter__ = AsyncMock(return_value=mock_client_instance)
            mock_client_instance.__aexit__ = AsyncMock(return_value=None)
            mock_client_class.return_value = mock_client_instance
            
            response = test_client.post("/api/analyze", json={
                "url": "https://unreachable.test"
            })
            
            assert response.status_code == 400
            assert "Could not fetch URL" in response.json()["detail"]

    @pytest.mark.asyncio
    async def test_analyze_empty_website(self, test_client):
        """Test analyzing empty/minimal HTML."""
        with patch("main.httpx.AsyncClient") as mock_client_class, \
             patch("main.ai_generate", new_callable=AsyncMock) as mock_ai:
            
            mock_response = MagicMock()
            mock_response.text = "<html><body></body></html>"
            mock_client_instance = AsyncMock()
            mock_client_instance.get = AsyncMock(return_value=mock_response)
            mock_client_instance.__aenter__ = AsyncMock(return_value=mock_client_instance)
            mock_client_instance.__aexit__ = AsyncMock(return_value=None)
            mock_client_class.return_value = mock_client_instance
            
            mock_ai.return_value = json.dumps({
                "colors": [],
                "fonts": [],
                "components": [],
                "suggestions": ["Add content and styling"]
            })
            
            response = test_client.post("/api/analyze", json={
                "url": "https://empty.test"
            })
            
            assert response.status_code == 200
            data = response.json()
            assert data["colors"] == []
            assert data["fonts"] == []


class TestThemeGenerationIntegration:
    """Integration tests for theme generation workflow."""

    @pytest.mark.asyncio
    async def test_generate_theme_full_workflow(self, test_client):
        """Test complete theme generation: description → AI → CSS + Tailwind."""
        with patch("main.ai_generate", new_callable=AsyncMock) as mock_ai:
            mock_ai.return_value = json.dumps({
                "name": "Midnight Ocean",
                "primary": "#0EA5E9",
                "accent": "#06B6D4",
                "bg": "#0F172A"
            })
            
            response = test_client.post("/api/theme", json={
                "description": "A dark ocean-inspired theme with cool blues and cyans"
            })
            
            assert response.status_code == 200
            data = response.json()
            
            # Validate theme data
            assert data["name"] == "Midnight Ocean"
            assert data["primary"] == "#0EA5E9"
            assert data["accent"] == "#06B6D4"
            assert data["bg"] == "#0F172A"
            
            # Validate CSS code generation
            assert "/* FlexUI Theme: Midnight Ocean */" in data["css_code"]
            assert ":root {" in data["css_code"]
            assert "--flexui-primary: #0EA5E9" in data["css_code"]
            assert "--flexui-accent: #06B6D4" in data["css_code"]
            assert "--flexui-bg: #0F172A" in data["css_code"]
            
            # Validate Tailwind code generation
            assert "tailwind.config.ts" in data["tailwind_code"]
            assert '"#0EA5E9"' in data["tailwind_code"]
            assert '"#06B6D4"' in data["tailwind_code"]
            assert '"#0F172A"' in data["tailwind_code"]

    @pytest.mark.asyncio
    async def test_generate_multiple_themes(self, test_client):
        """Test generating multiple different themes."""
        theme_configs = [
            {
                "description": "A vibrant neon cyberpunk theme",
                "name": "Cyberpunk",
                "primary": "#FF006E",
                "accent": "#00F5FF",
                "bg": "#0A0E27"
            },
            {
                "description": "A warm sunset theme",
                "name": "Sunset",
                "primary": "#FF6B35",
                "accent": "#F7931E",
                "bg": "#1A1414"
            },
            {
                "description": "A nature-inspired green theme",
                "name": "Forest",
                "primary": "#10B981",
                "accent": "#34D399",
                "bg": "#064E3B"
            },
        ]
        
        for config in theme_configs:
            with patch("main.ai_generate", new_callable=AsyncMock) as mock_ai:
                mock_ai.return_value = json.dumps({
                    "name": config["name"],
                    "primary": config["primary"],
                    "accent": config["accent"],
                    "bg": config["bg"]
                })
                
                response = test_client.post("/api/theme", json={
                    "description": config["description"]
                })
                
                assert response.status_code == 200
                data = response.json()
                assert data["name"] == config["name"]
                assert data["primary"] == config["primary"]
                assert data["accent"] == config["accent"]
                assert data["bg"] == config["bg"]

    @pytest.mark.asyncio
    async def test_theme_with_missing_ai_response_fields(self, test_client):
        """Test theme generation handles partial AI responses."""
        with patch("main.ai_generate", new_callable=AsyncMock) as mock_ai:
            # AI returns partial data
            mock_ai.return_value = json.dumps({
                "name": "Custom"
                # Missing primary, accent, bg
            })
            
            response = test_client.post("/api/theme", json={
                "description": "test theme"
            })
            
            assert response.status_code == 200
            data = response.json()
            assert data["name"] == "Custom"
            # Should use defaults for missing fields
            assert data["primary"] == "#8B5CF6"
            assert data["accent"] == "#389CFD"
            assert data["bg"] == "#0B0B18"

    @pytest.mark.asyncio
    async def test_theme_css_structure(self, test_client):
        """Test generated CSS has proper structure."""
        with patch("main.ai_generate", new_callable=AsyncMock) as mock_ai:
            mock_ai.return_value = json.dumps({
                "name": "Test",
                "primary": "#FF0000",
                "accent": "#00FF00",
                "bg": "#0000FF"
            })
            
            response = test_client.post("/api/theme", json={
                "description": "test"
            })
            
            assert response.status_code == 200
            data = response.json()
            css = data["css_code"]
            
            # Validate CSS structure
            assert css.startswith("/* FlexUI Theme:")
            assert ":root {" in css
            assert "}" in css
            assert "--flexui-text: #E4E4E7;" in css
            assert "--flexui-border: rgba(255, 255, 255, 0.06);" in css
            assert "--flexui-glass: rgba(255, 255, 255, 0.03);" in css


class TestCrossEndpointIntegration:
    """Integration tests across multiple endpoints."""

    @pytest.mark.asyncio
    async def test_analyze_then_generate_workflow(self, test_client):
        """Test workflow: analyze website → generate themed component."""
        # Step 1: Analyze website
        with patch("main.httpx.AsyncClient") as mock_client_class, \
             patch("main.ai_generate", new_callable=AsyncMock) as mock_ai_analyze:
            
            mock_response = MagicMock()
            mock_response.text = '''<html>
<head>
    <style>:root { --primary: #8B5CF6; }</style>
    <link href="https://fonts.googleapis.com/css2?family=Inter" rel="stylesheet">
</head>
<body style="background: #0B0B18; color: #FFFFFF;"><button style="background: #8B5CF6;">Click</button></body>
</html>'''
            mock_client_instance = AsyncMock()
            mock_client_instance.get = AsyncMock(return_value=mock_response)
            mock_client_instance.__aenter__ = AsyncMock(return_value=mock_client_instance)
            mock_client_instance.__aexit__ = AsyncMock(return_value=None)
            mock_client_class.return_value = mock_client_instance
            
            mock_ai_analyze.return_value = json.dumps({
                "colors": [{"name": "Primary", "hex": "#8B5CF6"}],
                "fonts": ["Inter"],
                "components": ["Button"],
                "suggestions": ["Match component colors to site palette"]
            })
            
            response1 = test_client.post("/api/analyze", json={
                "url": "https://example.com"
            })
            assert response1.status_code == 200
            analysis = response1.json()
            
            # Step 2: Generate component using analysis insights
            with patch("main.ai_generate", new_callable=AsyncMock) as mock_ai_gen:
                mock_ai_gen.return_value = json.dumps({
                    "name": "ThemedButton",
                    "code": "export default function ThemedButton() { return <button style={{background: '#8B5CF6'}}>Click</button>; }",
                    "badge": "Button",
                    "doc_slug": "themed-button",
                    "imports": ["react"]
                })
                
                response2 = test_client.post("/api/generate", json={
                    "prompt": f"Create a button matching colors {analysis['colors'][0]['hex']} using font {analysis['fonts'][0]}"
                })
                assert response2.status_code == 200
                component = response2.json()
                
                # Validate integration
                assert "#8B5CF6" in component["code"]
                assert component["badge"] == "Button"

    @pytest.mark.asyncio
    async def test_generate_and_create_theme_workflow(self, test_client):
        """Test workflow: generate component → create matching theme."""
        # Step 1: Generate component
        with patch("main.ai_generate", new_callable=AsyncMock) as mock_ai_gen:
            mock_ai_gen.return_value = json.dumps({
                "name": "VibrantCard",
                "code": "export default function VibrantCard() { return <div style={{background: 'linear-gradient(135deg, #FF6B6B, #4ECDC4)'}}>Content</div>; }",
                "badge": "Card",
                "doc_slug": "vibrant-card",
                "imports": ["react"]
            })
            
            response1 = test_client.post("/api/generate", json={
                "prompt": "Create a vibrant gradient card"
            })
            assert response1.status_code == 200
            component = response1.json()
            
            # Step 2: Generate matching theme
            with patch("main.ai_generate", new_callable=AsyncMock) as mock_ai_theme:
                mock_ai_theme.return_value = json.dumps({
                    "name": "VibrantPalette",
                    "primary": "#FF6B6B",
                    "accent": "#4ECDC4",
                    "bg": "#FFFFFF"
                })
                
                response2 = test_client.post("/api/theme", json={
                    "description": "A vibrant theme with coral and teal accents to match VibrantCard component"
                })
                assert response2.status_code == 200
                theme = response2.json()
                
                # Validate integration
                assert theme["primary"] == "#FF6B6B"
                assert theme["accent"] == "#4ECDC4"
                assert "#FF6B6B" in component["code"] or "#4ECDC4" in component["code"]

    @pytest.mark.asyncio
    async def test_full_studio_workflow(self, test_client):
        """Test complete studio workflow: analyze → generate → theme."""
        # Step 1: Analyze existing site
        with patch("main.httpx.AsyncClient") as mock_client_class, \
             patch("main.ai_generate", new_callable=AsyncMock) as mock_ai_analyze:
            
            mock_response = MagicMock()
            mock_response.text = '''<html>
<head>
    <style>
        :root {
            --primary-color: #FF6B6B;
            --accent-color: #4ECDC4;
            --bg: #FFFFFF;
        }
    </style>
</head>
<body style="font-family: Inter;">Content</body>
</html>'''
            mock_client_instance = AsyncMock()
            mock_client_instance.get = AsyncMock(return_value=mock_response)
            mock_client_instance.__aenter__ = AsyncMock(return_value=mock_client_instance)
            mock_client_instance.__aexit__ = AsyncMock(return_value=None)
            mock_client_class.return_value = mock_client_instance
            
            mock_ai_analyze.return_value = json.dumps({
                "colors": [
                    {"name": "Primary", "hex": "#FF6B6B"},
                    {"name": "Accent", "hex": "#4ECDC4"}
                ],
                "fonts": ["Inter"],
                "components": ["Card", "Button"],
                "suggestions": ["Use consistent spacing", "Improve contrast"]
            })
            
            analyze_response = test_client.post("/api/analyze", json={
                "url": "https://mysite.com"
            })
            analysis = analyze_response.json()
            
            # Step 2: Generate component based on analysis
            with patch("main.ai_generate", new_callable=AsyncMock) as mock_ai_gen:
                mock_ai_gen.return_value = json.dumps({
                    "name": "SiteButton",
                    "code": f"export default function SiteButton() {{ return <button style={{background: '{analysis['colors'][0]['hex']}'}}>Click</button>; }}",
                    "badge": "Button",
                    "doc_slug": "site-button",
                    "imports": ["react"]
                })
                
                gen_response = test_client.post("/api/generate", json={
                    "prompt": f"Create button in {analysis['colors'][0]['hex']} and {analysis['colors'][1]['hex']}"
                })
                component = gen_response.json()
                
                # Step 3: Generate theme for both
                with patch("main.ai_generate", new_callable=AsyncMock) as mock_ai_theme:
                    mock_ai_theme.return_value = json.dumps({
                        "name": "CoralTeal",
                        "primary": analysis['colors'][0]['hex'],
                        "accent": analysis['colors'][1]['hex'],
                        "bg": "#FFFFFF"
                    })
                    
                    theme_response = test_client.post("/api/theme", json={
                        "description": f"Theme matching {analysis['colors'][0]['name']} and {analysis['colors'][1]['name']}"
                    })
                    theme = theme_response.json()
                    
                    # Validate full workflow
                    assert analyze_response.status_code == 200
                    assert gen_response.status_code == 200
                    assert theme_response.status_code == 200
                    
                    assert theme["primary"] == "#FF6B6B"
                    assert theme["accent"] == "#4ECDC4"
                    assert "#FF6B6B" in component["code"]


class TestErrorHandlingIntegration:
    """Integration tests for error handling across endpoints."""

    @pytest.mark.asyncio
    async def test_ai_provider_failure_handling(self, test_client):
        """Test handling when both AI providers fail."""
        with patch("main.ai_generate", new_callable=AsyncMock) as mock_ai:
            mock_ai.side_effect = HTTPException(
                status_code=503,
                detail="No AI provider available"
            )
            
            response = test_client.post("/api/generate", json={
                "prompt": "test"
            })
            
            # Should propagate the error
            assert response.status_code == 503

    @pytest.mark.asyncio
    async def test_invalid_json_response_handling(self, test_client):
        """Test handling invalid JSON from AI."""
        with patch("main.ai_generate", new_callable=AsyncMock) as mock_ai:
            mock_ai.return_value = "This is not valid JSON at all!"
            
            response = test_client.post("/api/generate", json={
                "prompt": "test"
            })
            
            # Should handle gracefully
            assert response.status_code == 500

    @pytest.mark.asyncio
    async def test_malformed_request_handling(self, test_client):
        """Test handling of malformed requests."""
        # Missing required field
        response = test_client.post("/api/generate", json={
            "category": "Button"
            # Missing prompt
        })
        assert response.status_code == 422
        
        # Invalid request body
        response = test_client.post("/api/theme", json={
            "invalid_field": "value"
        })
        assert response.status_code == 422

    @pytest.mark.asyncio
    async def test_rate_limit_integration_across_endpoints(self, test_client):
        """Test rate limiting works across all endpoints."""
        from main import rate_limits, RATE_LIMIT
        
        rate_limits.clear()
        
        with patch("main.ai_generate", new_callable=AsyncMock) as mock_ai:
            mock_ai.return_value = json.dumps({
                "name": "Test",
                "code": "export default function Test() {}",
                "badge": "Component",
                "doc_slug": "test",
                "imports": []
            })
            
            # Fill rate limit across different endpoints
            for i in range(RATE_LIMIT):
                # Alternate between endpoints
                if i % 3 == 0:
                    test_client.post("/api/generate", json={"prompt": f"test{i}"})
                elif i % 3 == 1:
                    test_client.post("/api/theme", json={"description": f"test{i}"})
                else:
                    # Analyze would need mocking
                    pass
            
            # Next request should be rate limited
            response = test_client.post("/api/generate", json={"prompt": "test"})
            assert response.status_code == 429


class TestResponseValidation:
    """Integration tests for response validation."""

    @pytest.mark.asyncio
    async def test_generate_response_validation(self, test_client):
        """Test generate response is properly validated."""
        with patch("main.ai_generate", new_callable=AsyncMock) as mock_ai:
            mock_ai.return_value = json.dumps({
                "name": "TestComponent",
                "code": "export default function TestComponent() { return <div/>; }",
                "badge": "Component",
                "doc_slug": "test-component",
                "imports": ["react", "react-dom"]
            })
            
            response = test_client.post("/api/generate", json={
                "prompt": "test"
            })
            
            assert response.status_code == 200
            data = response.json()
            
            # Validate response schema
            assert "name" in data
            assert "code" in data
            assert "badge" in data
            assert "badge_color" in data
            assert "doc_slug" in data
            assert "imports" in data
            assert isinstance(data["imports"], list)

    @pytest.mark.asyncio
    async def test_analyze_response_validation(self, test_client):
        """Test analyze response is properly validated."""
        with patch("main.httpx.AsyncClient") as mock_client_class, \
             patch("main.ai_generate", new_callable=AsyncMock) as mock_ai:
            
            mock_response = MagicMock()
            mock_response.text = "<html></html>"
            mock_client_instance = AsyncMock()
            mock_client_instance.get = AsyncMock(return_value=mock_response)
            mock_client_instance.__aenter__ = AsyncMock(return_value=mock_client_instance)
            mock_client_instance.__aexit__ = AsyncMock(return_value=None)
            mock_client_class.return_value = mock_client_instance
            
            mock_ai.return_value = json.dumps({
                "colors": [
                    {"name": "Primary", "hex": "#000000"}
                ],
                "fonts": ["Inter"],
                "components": ["Button"],
                "suggestions": ["Improve contrast"]
            })
            
            response = test_client.post("/api/analyze", json={
                "url": "https://example.com"
            })
            
            assert response.status_code == 200
            data = response.json()
            
            # Validate response schema
            assert "colors" in data
            assert "fonts" in data
            assert "components" in data
            assert "suggestions" in data
            assert isinstance(data["colors"], list)
            assert isinstance(data["fonts"], list)

    @pytest.mark.asyncio
    async def test_theme_response_validation(self, test_client):
        """Test theme response is properly validated."""
        with patch("main.ai_generate", new_callable=AsyncMock) as mock_ai:
            mock_ai.return_value = json.dumps({
                "name": "CustomTheme",
                "primary": "#FF0000",
                "accent": "#00FF00",
                "bg": "#0000FF"
            })
            
            response = test_client.post("/api/theme", json={
                "description": "test"
            })
            
            assert response.status_code == 200
            data = response.json()
            
            # Validate response schema
            assert "name" in data
            assert "primary" in data
            assert "accent" in data
            assert "bg" in data
            assert "css_code" in data
            assert "tailwind_code" in data
            assert isinstance(data["css_code"], str)
            assert isinstance(data["tailwind_code"], str)
