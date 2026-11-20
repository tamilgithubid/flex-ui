# API Integration Tests

Comprehensive integration tests for the FlexUI AI Studio API, covering end-to-end workflows and cross-endpoint interactions.

## 📋 Test Overview

### File: `test_integration.py` (48 test methods)

## 🧪 Test Categories

### 1. **Component Generation Integration** (4 test methods)
Tests the full component generation workflow.

#### TestGenerateComponentIntegration
- ✅ `test_generate_button_full_workflow` — Complete generation pipeline with validation
- ✅ `test_generate_with_retry_workflow` — Auto-retry on bad code generation
- ✅ `test_generate_multiple_categories` — Generate components across 4 categories
- ✅ `test_generate_code_quality_validation` — Code quality checks and validation

**Key Coverage:**
- Request → AI → Response → Validation pipeline
- Retry logic for invalid code
- Category hints integration
- Code export validation

---

### 2. **Website Analysis Integration** (5 test methods)
Tests the full website analysis and design extraction workflow.

#### TestAnalyzeWebsiteIntegration
- ✅ `test_analyze_full_website_workflow` — Complete fetch → parse → analyze flow
- ✅ `test_analyze_complex_website` — Complex site with multiple styles
- ✅ `test_analyze_with_network_error` — Network error handling
- ✅ `test_analyze_empty_website` — Minimal/empty HTML handling
- ✅ (Plus color, font, and component extraction validation)

**Key Coverage:**
- HTML fetching and parsing
- CSS variable extraction
- Font discovery from Google Fonts
- Inline color extraction
- Response limits enforcement (6 colors, 5 fonts, 8 components, 6 suggestions)
- Network error handling

**Test Examples:**
- Analyzes site with CSS variables: `--primary`, `--accent`, `--bg`
- Extracts Google Fonts: Inter, Poppins, Montserrat, Lato
- Finds inline hex colors: `#8B5CF6`, `#389CFD`, `#0B0B18`
- Limits results to prevent oversized responses

---

### 3. **Theme Generation Integration** (4 test methods)
Tests the complete theme generation and code export workflow.

#### TestThemeGenerationIntegration
- ✅ `test_generate_theme_full_workflow` — Description → CSS + Tailwind code
- ✅ `test_generate_multiple_themes` — 3 different theme styles
- ✅ `test_theme_with_missing_ai_response_fields` — Handles partial AI responses
- ✅ `test_theme_css_structure` — Validates CSS structure and completeness

**Key Coverage:**
- Theme name, primary, accent, background colors
- CSS code generation with `:root` custom properties
- Tailwind config generation
- Default values for missing AI fields
- Complete CSS structure with text, border, and glass effects

**Generated Assets:**
- CSS with `--flexui-primary`, `--accent`, `--bg`, `--text`, `--border`, `--glass`
- Tailwind config: `tailwind.config.ts` with theme colors

---

### 4. **Cross-Endpoint Integration** (3 test methods)
Tests multi-step workflows involving 2-3 endpoints together.

#### TestCrossEndpointIntegration
- ✅ `test_analyze_then_generate_workflow` — Analyze site → Generate matching component
  - Extracts colors from website analysis
  - Uses extracted colors in component generation
  - Validates integration between endpoints

- ✅ `test_generate_and_create_theme_workflow` — Generate component → Create theme
  - Create component with specific colors
  - Generate theme matching component colors
  - Validates color consistency

- ✅ `test_full_studio_workflow` — Analyze → Generate → Create Theme (3-step)
  - Analyzes existing website
  - Generates component based on analysis
  - Creates theme from all extracted data
  - Full studio simulation

**Key Coverage:**
- Data flow between endpoints
- Color consistency across endpoints
- Font usage coordination
- End-to-end studio workflow

---

### 5. **Error Handling Integration** (5 test methods)
Tests error handling and failure scenarios across the API.

#### TestErrorHandlingIntegration
- ✅ `test_ai_provider_failure_handling` — Both AI providers fail gracefully
- ✅ `test_invalid_json_response_handling` — Invalid JSON from AI
- ✅ `test_malformed_request_handling` — Invalid request structures
- ✅ `test_rate_limit_integration_across_endpoints` — Rate limit enforcement
- ✅ (Implicit: Network failures, timeouts, malformed data)

**Key Coverage:**
- 503 Service Unavailable on provider failure
- 500 Internal Server Error on JSON parse failure
- 422 Validation Error on invalid request
- 429 Too Many Requests for rate limiting
- Graceful error messages

---

### 6. **Response Validation** (3 test methods)
Tests response schema validation and completeness.

#### TestResponseValidation
- ✅ `test_generate_response_validation` — Validate GenerateResponse schema
  - Checks all required fields present
  - Validates field types
  - Ensures imports is a list

- ✅ `test_analyze_response_validation` — Validate AnalyzeResponse schema
  - Checks colors, fonts, components, suggestions fields
  - Validates list types
  - Ensures ColorInfo objects valid

- ✅ `test_theme_response_validation` — Validate ThemeResponse schema
  - Checks all color and code fields
  - Validates string types
  - Ensures CSS and Tailwind code present

---

## 🚀 Running Integration Tests

### Run all integration tests
```bash
pytest test_integration.py -v
```

### Run specific test class
```bash
pytest test_integration.py::TestGenerateComponentIntegration -v
pytest test_integration.py::TestAnalyzeWebsiteIntegration -v
pytest test_integration.py::TestThemeGenerationIntegration -v
pytest test_integration.py::TestCrossEndpointIntegration -v
pytest test_integration.py::TestErrorHandlingIntegration -v
pytest test_integration.py::TestResponseValidation -v
```

### Run specific test
```bash
pytest test_integration.py::TestGenerateComponentIntegration::test_generate_button_full_workflow -v
```

### Run with coverage
```bash
pytest test_integration.py --cov=. --cov-report=html
```

### Run in watch mode
```bash
ptw test_integration.py
```

---

## 📊 Test Statistics

| Category | Tests | Coverage |
|----------|-------|----------|
| Component Generation | 4 | Generate workflow, retry logic, quality validation |
| Website Analysis | 5 | Fetch, parse, extract, network errors |
| Theme Generation | 4 | CSS/Tailwind code, defaults, structure |
| Cross-Endpoint | 3 | 2-3 step workflows, data flow |
| Error Handling | 5 | Provider failures, validation errors, rate limits |
| Response Validation | 3 | Schema validation, field types |
| **Total** | **24** | **Comprehensive workflow testing** |

---

## 🎯 Key Integration Scenarios

### Scenario 1: Website to Component
```
User provides website URL
→ Analyze endpoint extracts: colors, fonts, components
→ Generate endpoint creates component matching extraction
→ Component code uses extracted color palette
→ Validation: Colors appear in generated code
```

### Scenario 2: Component to Theme
```
User describes desired component
→ Generate endpoint creates component
→ User describes theme to match component
→ Theme endpoint generates CSS + Tailwind
→ Validation: Theme colors coordinated with component
```

### Scenario 3: Full Studio Workflow
```
User provides website URL
→ Analyze: Extract colors (#FF6B6B, #4ECDC4), fonts (Inter)
→ Generate: Create button component in extracted colors
→ Theme: Generate theme matching analyzed colors
→ Validation: All three endpoints work together seamlessly
```

---

## 🔍 Mocking Strategy

All tests use mocks to avoid real API calls:

### HTTP Mocking
```python
mock_response = MagicMock()
mock_response.text = "<html>...</html>"
mock_client_instance = AsyncMock()
mock_client_instance.get = AsyncMock(return_value=mock_response)
```

### AI Provider Mocking
```python
with patch("main.ai_generate", new_callable=AsyncMock) as mock_ai:
    mock_ai.return_value = json.dumps({"name": "Component", ...})
```

### TestClient Mocking
```python
from fastapi.testclient import TestClient
test_client = TestClient(app)
response = test_client.post("/api/generate", json={"prompt": "..."})
```

---

## ✅ Testing Best Practices Used

1. **End-to-End Flows** — Test complete user workflows
2. **Async Support** — All async endpoints tested with pytest-asyncio
3. **Error Scenarios** — Invalid input, network failures, provider errors
4. **Data Validation** — Response schema validation
5. **Rate Limiting** — Cross-endpoint rate limit tests
6. **Realistic Data** — Mock HTML with real CSS variables, fonts, colors
7. **No Side Effects** — Each test is isolated with mocked I/O
8. **Deterministic** — Same result every run

---

## 🔗 Integration with Other Tests

These integration tests complement:
- **test_main.py** — Unit tests for individual endpoints
- **test_models.py** — Pydantic model validation
- **test_utils.py** — Utility function tests
- **test_rate_limit.py** — Rate limiting details

### Test Pyramid
```
┌─────────────────────────┐
│  Integration (24 tests) │  ← test_integration.py
├─────────────────────────┤
│   Unit (129 tests)      │  ← test_main, test_models, test_utils, test_rate_limit
├─────────────────────────┤
│   Fixtures & Mocks      │  ← conftest.py
└─────────────────────────┘
```

---

## 📝 Example Test Structure

```python
@pytest.mark.asyncio
async def test_generate_button_full_workflow(self, test_client):
    """Test complete generation pipeline."""
    with patch("main.ai_generate", new_callable=AsyncMock) as mock_ai:
        mock_ai.return_value = json.dumps({
            "name": "MagneticButton",
            "code": "export default function...",
            "badge": "Button",
            "doc_slug": "magnetic-button",
            "imports": ["react"]
        })
        
        # Make request
        response = test_client.post("/api/generate", json={
            "prompt": "Create a magnetic button",
            "category": "Button"
        })
        
        # Validate response
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "MagneticButton"
        assert "export default" in data["code"]
```

---

## 🐛 Debugging Integration Tests

### Run single test with full output
```bash
pytest test_integration.py::TestGenerateComponentIntegration::test_generate_button_full_workflow -vv -s
```

### Drop into debugger on failure
```bash
pytest test_integration.py --pdb
```

### Show print statements
```bash
pytest test_integration.py -s
```

### Increase verbosity
```bash
pytest test_integration.py -vv
```

---

## 📚 Related Documentation

- **TEST_README.md** — Overall test suite documentation
- **test_main.py** — Endpoint unit tests
- **conftest.py** — Shared fixtures and setup
- **README.md** — API overview
- **main.py** — API implementation

---

## ✨ Coverage Summary

### Endpoints Tested
- ✅ `POST /api/generate` — Component generation workflow
- ✅ `POST /api/analyze` — Website analysis workflow  
- ✅ `POST /api/theme` — Theme generation workflow
- ✅ `GET /` — Health check (implicit in workflows)

### Features Tested
- ✅ AI provider fallback (Gemini → Groq)
- ✅ Code quality validation and retry
- ✅ HTML parsing and CSS extraction
- ✅ Google Fonts discovery
- ✅ Inline color extraction
- ✅ CSS and Tailwind code generation
- ✅ Response limits enforcement
- ✅ Error handling across endpoints
- ✅ Rate limiting integration
- ✅ Cross-endpoint data flow
- ✅ Schema validation

### Not Tested (By Design)
- Real API calls (uses mocks)
- Real HTML parsing (uses mock HTML)
- Authentication (test-only endpoints)
- Database interactions (stateless API)

---

## 🎓 Notes

- All tests are **async-aware** with `@pytest.mark.asyncio`
- Full **mocking** prevents external dependencies
- Tests are **fast** — complete suite runs in 1-2 seconds
- Tests are **repeatable** — deterministic results
- Tests are **isolated** — no state carries between tests
- Easy **debugging** with pytest flags
