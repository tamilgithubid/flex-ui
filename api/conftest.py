"""
Pytest configuration and shared fixtures for AI Studio tests.
"""

import pytest
from unittest.mock import AsyncMock, MagicMock, patch
from fastapi.testclient import TestClient
import os


# Set test environment variables before importing the app
os.environ["GEMINI_API_KEY"] = "test-gemini-key"
os.environ["GROQ_API_KEY"] = "test-groq-key"


@pytest.fixture
def mock_gemini():
    """Mock Gemini provider."""
    with patch("providers.gemini.HAS_GEMINI", True):
        mock_client = MagicMock()
        with patch("providers.gemini.genai.Client", return_value=mock_client):
            from providers.gemini import GeminiProvider
            provider = GeminiProvider()
            yield provider


@pytest.fixture
def mock_groq():
    """Mock Groq provider."""
    with patch("providers.groq_provider.HAS_GROQ", True):
        mock_client = MagicMock()
        with patch("providers.groq_provider.Groq", return_value=mock_client):
            from providers.groq_provider import GroqProvider
            provider = GroqProvider()
            yield provider


@pytest.fixture
def test_client():
    """FastAPI test client with mocked providers."""
    # Import after environment is set
    from main import app
    return TestClient(app)


@pytest.fixture
def mock_ai_generate():
    """Mock the ai_generate function to return test data."""
    async def _mock_generate(system_prompt: str, user_prompt: str) -> str:
        return '{"name": "TestComponent", "code": "export default function TestComponent() { return <div>Test</div>; }", "badge": "Component", "doc_slug": "test-component", "imports": []}'
    
    return _mock_generate


@pytest.fixture
def generate_request_data():
    """Sample generate request."""
    return {
        "prompt": "Create a cool animated button component",
        "category": "Button"
    }


@pytest.fixture
def analyze_request_data():
    """Sample analyze request."""
    return {
        "url": "https://example.com"
    }


@pytest.fixture
def theme_request_data():
    """Sample theme request."""
    return {
        "description": "A dark modern theme with purple accents"
    }


@pytest.fixture
def valid_generate_response():
    """Valid AI response for component generation."""
    return '''{
    "name": "AnimatedButton",
    "code": "export default function AnimatedButton() { return <button>Click me</button>; }",
    "badge": "Button",
    "doc_slug": "animated-button",
    "imports": ["react"]
}'''


@pytest.fixture
def valid_analyze_response():
    """Valid AI response for URL analysis."""
    return '''{
    "colors": [
        {"name": "Primary", "hex": "#8B5CF6"},
        {"name": "Accent", "hex": "#389CFD"}
    ],
    "fonts": ["Inter", "Roboto"],
    "components": ["Button", "Card", "Modal"],
    "suggestions": ["Use consistent padding", "Add more whitespace"]
}'''


@pytest.fixture
def valid_theme_response():
    """Valid AI response for theme generation."""
    return '''{
    "name": "Midnight Purple",
    "primary": "#8B5CF6",
    "accent": "#389CFD",
    "bg": "#0B0B18"
}'''


@pytest.fixture
def mock_html_response():
    """Mock HTML response for URL analysis."""
    return '''<!DOCTYPE html>
<html>
<head>
    <style>
        :root {
            --primary-color: #8B5CF6;
            --accent-color: #389CFD;
        }
    </style>
    <link href="https://fonts.googleapis.com/css2?family=Inter" rel="stylesheet">
</head>
<body>
    <button style="color: #FFFFFF">Click me</button>
    <div style="background: #0B0B18">Content</div>
</body>
</html>'''
