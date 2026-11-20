# FlexUI AI Studio API — Test Suite

Comprehensive test coverage for the FastAPI backend with 100+ test cases covering endpoints, models, utilities, and rate limiting.

## 📋 Test Files Overview

### 1. **conftest.py** (Shared Fixtures & Setup)
Central pytest configuration with fixtures used across all test files.

**Fixtures provided:**
- `test_client` — FastAPI TestClient with mocked providers
- `mock_ai_generate` — Mock AI generation function
- `generate_request_data` — Sample generate endpoint request
- `analyze_request_data` — Sample analyze endpoint request
- `theme_request_data` — Sample theme endpoint request
- `valid_generate_response` — Valid component generation response
- `valid_analyze_response` — Valid URL analysis response
- `valid_theme_response` — Valid theme generation response
- `mock_html_response` — Mock HTML for URL analysis

### 2. **test_main.py** (Endpoint Tests — 27 test cases)

#### Health Check Tests (TestHealthEndpoint)
- ✅ `test_health_check_success` — Verify 200 response and structure
- ✅ `test_health_check_response_structure` — Validate provider status fields
- ✅ `test_health_check_no_auth_required` — Confirm no auth needed

#### Generate Endpoint Tests (TestGenerateEndpoint)
- ✅ `test_generate_valid_request` — Valid component generation
- ✅ `test_generate_missing_prompt` — Reject missing prompt
- ✅ `test_generate_with_category` — Category hint in prompt
- ✅ `test_generate_retry_on_bad_code` — Auto-retry on bad code
- ✅ `test_generate_badge_color_mapping` — All 8 badge colors (parametrized)
- ✅ `test_generate_default_badge_color` — Unknown badge → default
- ✅ `test_generate_response_structure` — All fields present

#### Analyze Endpoint Tests (TestAnalyzeEndpoint)
- ✅ `test_analyze_valid_url` — Fetch and parse URL
- ✅ `test_analyze_invalid_url` — Handle unreachable URLs
- ✅ `test_analyze_css_extraction` — Extract CSS custom properties
- ✅ `test_analyze_fonts_extraction` — Extract Google Fonts
- ✅ `test_analyze_color_extraction` — Extract inline colors
- ✅ `test_analyze_response_limits` — Respect response limits

#### Theme Endpoint Tests (TestThemeEndpoint)
- ✅ `test_theme_valid_request` — Generate theme successfully
- ✅ `test_theme_missing_description` — Reject missing description
- ✅ `test_theme_css_code_generation` — Generate valid CSS code
- ✅ `test_theme_tailwind_code_generation` — Generate Tailwind config
- ✅ `test_theme_default_values` — Use defaults if missing
- ✅ `test_theme_response_structure` — All fields present

### 3. **test_models.py** (Pydantic Model Validation — 37 test cases)

#### GenerateRequest Tests (7 cases)
- ✅ Valid minimal request
- ✅ With category
- ✅ Missing prompt rejection
- ✅ Empty prompt acceptance
- ✅ Long prompt handling
- ✅ Special characters support
- ✅ 'All' category handling

#### GenerateResponse Tests (6 cases)
- ✅ Valid response creation
- ✅ Missing required field rejection
- ✅ Empty imports list
- ✅ Multiple imports
- ✅ Invalid imports type rejection
- ✅ Complex code handling

#### AnalyzeRequest Tests (5 cases)
- ✅ Valid URL
- ✅ Missing URL rejection
- ✅ Various URL formats
- ✅ Relative URLs
- ✅ URL format validation

#### ColorInfo Tests (5 cases)
- ✅ Valid color creation
- ✅ Missing name rejection
- ✅ Missing hex rejection
- ✅ Various hex formats (3-digit, 6-digit, lowercase)
- ✅ Hex format validation

#### AnalyzeResponse Tests (5 cases)
- ✅ Valid response with all fields
- ✅ Empty lists handling
- ✅ Multiple colors
- ✅ Complex nested data
- ✅ Response structure validation

#### ThemeRequest Tests (4 cases)
- ✅ Valid request
- ✅ Missing description rejection
- ✅ Empty description acceptance
- ✅ Long description handling

#### ThemeResponse Tests (5 cases)
- ✅ Valid response creation
- ✅ Missing required field rejection
- ✅ Various hex color formats
- ✅ Code content handling
- ✅ Multiline code support

#### Model Serialization Tests (5 cases)
- ✅ GenerateRequest → dict
- ✅ GenerateResponse → dict
- ✅ ColorInfo → dict
- ✅ ThemeResponse → JSON
- ✅ Model serialization round-trip

### 4. **test_utils.py** (Utility Function Tests — 37 test cases)

#### parse_json_response Tests (21 cases)
- ✅ Direct JSON parsing
- ✅ Markdown code block extraction
- ✅ Generic code block extraction
- ✅ Surrounded text handling
- ✅ Brace extraction from text
- ✅ Complex nested JSON
- ✅ Extra whitespace handling
- ✅ Invalid JSON rejection (HTTPException 500)
- ✅ Invalid JSON in block rejection
- ✅ Empty string rejection
- ✅ Invalid brace-only rejection
- ✅ Various JSON types (parametrized: 6 variations)
- ✅ Escaped characters
- ✅ Multiple code blocks (first only)
- ✅ Unicode support
- ✅ Numeric values

#### _badge_color Tests (16 cases)
- ✅ All 8 known badges (parametrized)
- ✅ Unknown badge → default
- ✅ Case sensitivity enforcement
- ✅ Empty string → default
- ✅ Whitespace → default
- ✅ Partial matches (no match)
- ✅ Various invalid badges (parametrized)
- ✅ All badges have colors
- ✅ Format structure validation
- ✅ Special characters → default
- ✅ Integration with response data
- ✅ Tailwind class structure

### 5. **test_rate_limit.py** (Rate Limiting Tests — 28 test cases)

#### Basic Rate Limit Tests (TestRateLimitBasic)
- ✅ `test_rate_limit_single_request` — One request passes
- ✅ `test_rate_limit_few_requests` — Few requests pass
- ✅ `test_rate_limit_exceeds_limit` — Trigger at threshold
- ✅ `test_rate_limit_error_detail` — Error message quality

#### Per-IP Isolation Tests (TestRateLimitPerIP)
- ✅ `test_rate_limit_isolated_per_ip` — Different IPs independent
- ✅ `test_rate_limit_different_ips_independent` — 10 IPs test

#### Time Window Tests (TestRateLimitTime)
- ✅ `test_rate_limit_window_cleanup` — Old entries removed
- ✅ `test_rate_limit_respects_window` — Window expiration
- ✅ `test_rate_limit_window_expiration_slow` — Slow time-based test

#### No Client Tests (TestRateLimitNoClient)
- ✅ `test_rate_limit_no_client` — Handles None client
- ✅ `test_rate_limit_no_client_consistent` — Consistent "unknown" bucket

#### Data Structure Tests (TestRateLimitDataStructure)
- ✅ `test_rate_limit_structure_is_dict_of_lists` — Proper structure
- ✅ `test_rate_limit_timestamps_ascending` — Chronological order

#### Integration Tests (TestRateLimitIntegration)
- ✅ Rate limiting on /api/generate
- ✅ Rate limiting on /api/analyze
- ✅ Rate limiting on /api/theme

#### Boundary Tests (TestRateLimitBoundary)
- ✅ Exactly at threshold
- ✅ One below threshold
- ✅ Way above threshold

## 🚀 Running Tests

### Install Test Dependencies

```bash
cd api
pip install pytest pytest-asyncio httpx beautifulsoup4
```

### Run All Tests

```bash
pytest
```

### Run with Verbose Output

```bash
pytest -v
```

### Run Specific Test File

```bash
pytest test_main.py          # Endpoints only
pytest test_models.py        # Model validation only
pytest test_utils.py         # Utility functions only
pytest test_rate_limit.py    # Rate limiting only
```

### Run Specific Test Class

```bash
pytest test_main.py::TestGenerateEndpoint
pytest test_models.py::TestGenerateRequest
pytest test_utils.py::TestParseJsonResponse
pytest test_rate_limit.py::TestRateLimitBasic
```

### Run Specific Test

```bash
pytest test_main.py::TestGenerateEndpoint::test_generate_valid_request
```

### Run with Coverage

```bash
pip install pytest-cov
pytest --cov=. --cov-report=html
```

### Run Only Fast Tests (exclude slow marker)

```bash
pytest -m "not slow"
```

### Run Tests in Parallel

```bash
pip install pytest-xdist
pytest -n auto
```

### Watch Mode (auto-rerun on file change)

```bash
pip install pytest-watch
ptw
```

## 📊 Test Statistics

| File | Test Classes | Test Methods | Coverage |
|------|-------------|-------------|----------|
| test_main.py | 4 | 27 | Endpoints |
| test_models.py | 9 | 37 | Pydantic models |
| test_utils.py | 4 | 37 | Utilities |
| test_rate_limit.py | 7 | 28 | Rate limiting |
| **Total** | **24** | **129** | **Comprehensive** |

## 🎯 Key Testing Features

### 1. **Mocked AI Providers**
- All AI provider calls are mocked (Gemini, Groq)
- No real API keys needed
- Tests run fast (~1-2 seconds)
- Repeatable, deterministic results

### 2. **Comprehensive Fixtures**
- Shared setup in `conftest.py`
- Reusable mock data
- Easy test maintenance

### 3. **Parametrized Tests**
- Badge color mapping (8 variants)
- JSON parsing edge cases (6 variants)
- Invalid badge types (multiple variants)

### 4. **Async Support**
- Full async/await testing with pytest-asyncio
- AsyncMock for async functions
- Proper async context manager mocking

### 5. **Edge Case Coverage**
- Unicode and special characters
- Very long inputs
- Empty inputs
- Nested data structures
- Error conditions

### 6. **Rate Limit Testing**
- Per-IP isolation
- Time window expiration
- Boundary conditions
- Integration with endpoints

## 📝 Test Examples

### Basic Endpoint Test
```python
@pytest.mark.asyncio
async def test_generate_valid_request(self, test_client, generate_request_data):
    with patch("main.ai_generate", new_callable=AsyncMock) as mock_generate:
        mock_generate.return_value = '{"name": "Button", ...}'
        
        response = test_client.post("/api/generate", json=generate_request_data)
        assert response.status_code == 200
        assert response.json()["name"] == "Button"
```

### Parametrized Test
```python
@pytest.mark.parametrize("badge,expected_color", [
    ("Button", "bg-violet-500/15 text-violet-400"),
    ("Card", "bg-cyan-500/15 text-cyan-400"),
])
def test_badge_color_mapping(self, badge, expected_color):
    assert _badge_color(badge) == expected_color
```

### Model Validation Test
```python
def test_generate_request_valid_minimal(self):
    req = GenerateRequest(prompt="Create a button")
    assert req.prompt == "Create a button"
    assert req.category is None
```

## 🔍 Debugging Tests

### Run a single test with full output
```bash
pytest test_main.py::TestGenerateEndpoint::test_generate_valid_request -vv -s
```

### Drop into debugger on failure
```bash
pytest --pdb
```

### Show local variables on error
```bash
pytest -l
```

### Run tests and show print statements
```bash
pytest -s
```

## ✅ CI/CD Integration

### GitHub Actions Example
```yaml
name: API Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      - run: cd api && pip install -r requirements.txt pytest pytest-asyncio
      - run: cd api && pytest -v --cov
```

## 🎓 Notes

- All tests use **mocks** for external services (no real API calls)
- Tests are **fast** — full suite runs in 1-2 seconds
- Tests are **isolated** — no side effects between tests
- Tests are **deterministic** — same result every run
- **No authentication** needed — uses test fixtures
- **No network calls** — fully mocked HTTP clients

## 📚 Additional Resources

- [Pytest Documentation](https://docs.pytest.org/)
- [FastAPI Testing](https://fastapi.tiangolo.com/advanced/testing-dependencies/)
- [Pydantic Validation](https://docs.pydantic.dev/)
- [unittest.mock Documentation](https://docs.python.org/3/library/unittest.mock.html)
