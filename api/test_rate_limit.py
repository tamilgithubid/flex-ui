"""
Tests for rate limiting functionality.
"""

import pytest
import time
from unittest.mock import MagicMock, AsyncMock, patch
from fastapi import HTTPException
from main import check_rate_limit, rate_limits, RATE_LIMIT, RATE_WINDOW


class TestRateLimitBasic:
    """Basic rate limit tests."""

    def test_rate_limit_single_request(self):
        """Test single request passes rate limit check."""
        request = MagicMock()
        request.client.host = "192.168.1.1"
        
        # Clear previous state
        rate_limits.clear()
        
        # Should not raise
        try:
            check_rate_limit(request)
            assert True
        except HTTPException:
            pytest.fail("Single request should not trigger rate limit")

    def test_rate_limit_few_requests(self):
        """Test few requests stay within limit."""
        request = MagicMock()
        request.client.host = "192.168.1.2"
        
        rate_limits.clear()
        
        for i in range(5):
            try:
                check_rate_limit(request)
            except HTTPException:
                pytest.fail(f"Request {i+1} should not trigger rate limit")

    def test_rate_limit_exceeds_limit(self):
        """Test rate limit triggers at threshold."""
        request = MagicMock()
        request.client.host = "192.168.1.3"
        
        rate_limits.clear()
        
        # Make RATE_LIMIT requests (should succeed)
        for i in range(RATE_LIMIT):
            check_rate_limit(request)
        
        # Next request should fail
        with pytest.raises(HTTPException) as exc_info:
            check_rate_limit(request)
        
        assert exc_info.value.status_code == 429
        assert "Rate limit exceeded" in exc_info.value.detail

    def test_rate_limit_error_detail(self):
        """Test rate limit error has helpful message."""
        request = MagicMock()
        request.client.host = "192.168.1.4"
        
        rate_limits.clear()
        
        for i in range(RATE_LIMIT):
            check_rate_limit(request)
        
        with pytest.raises(HTTPException) as exc_info:
            check_rate_limit(request)
        
        assert "Try again in a minute" in exc_info.value.detail


class TestRateLimitPerIP:
    """Test rate limiting per IP address."""

    def test_rate_limit_isolated_per_ip(self):
        """Test rate limits are isolated per IP address."""
        request1 = MagicMock()
        request1.client.host = "192.168.1.10"
        
        request2 = MagicMock()
        request2.client.host = "192.168.1.11"
        
        rate_limits.clear()
        
        # Use up limit for IP1
        for i in range(RATE_LIMIT):
            check_rate_limit(request1)
        
        # IP1 should be rate limited
        with pytest.raises(HTTPException):
            check_rate_limit(request1)
        
        # IP2 should still work
        try:
            check_rate_limit(request2)
            assert True
        except HTTPException:
            pytest.fail("Different IP should not be rate limited")

    def test_rate_limit_different_ips_independent(self):
        """Test different IPs don't affect each other."""
        ips = [f"192.168.1.{i}" for i in range(20, 30)]
        requests = []
        for ip in ips:
            req = MagicMock()
            req.client.host = ip
            requests.append(req)
        
        rate_limits.clear()
        
        # Each IP makes one request
        for req in requests:
            try:
                check_rate_limit(req)
            except HTTPException:
                pytest.fail(f"IP {req.client.host} should not be rate limited")
        
        assert len(rate_limits) == len(ips)


class TestRateLimitTime:
    """Test rate limit window and time-based cleanup."""

    def test_rate_limit_window_cleanup(self):
        """Test rate limit entries older than window are removed."""
        request = MagicMock()
        request.client.host = "192.168.1.5"
        
        rate_limits.clear()
        
        # Add some old timestamps manually
        now = time.time()
        rate_limits[request.client.host] = [
            now - 100,  # Very old
            now - 80,   # Old
        ]
        
        # Check rate limit should clean old entries
        check_rate_limit(request)
        
        # Should have only 1 entry (the new one)
        assert len(rate_limits[request.client.host]) == 1

    def test_rate_limit_respects_window(self):
        """Test that entries outside window are removed."""
        request = MagicMock()
        request.client.host = "192.168.1.6"
        
        rate_limits.clear()
        
        # Fill up the rate limit
        for i in range(RATE_LIMIT):
            check_rate_limit(request)
        
        # Should be at limit
        with pytest.raises(HTTPException):
            check_rate_limit(request)
        
        # Manually age all entries beyond window
        ip = request.client.host
        now = time.time()
        rate_limits[ip] = [now - RATE_WINDOW - 1] * RATE_LIMIT
        
        # Now should be allowed again (old entries cleaned)
        try:
            check_rate_limit(request)
            assert True
        except HTTPException:
            pytest.fail("Rate limit should reset after window expires")

    @pytest.mark.slow
    def test_rate_limit_window_expiration_slow(self):
        """Test rate limit window expiration (slow test, uses actual time)."""
        request = MagicMock()
        request.client.host = "192.168.1.7"
        
        rate_limits.clear()
        
        # Fill to limit with recent timestamps
        for i in range(RATE_LIMIT):
            check_rate_limit(request)
        
        # Should be limited
        with pytest.raises(HTTPException):
            check_rate_limit(request)
        
        # Wait for window to pass (or mock time)
        # For testing without actual time.sleep, we manipulate the list
        ip = request.client.host
        # Make oldest entries expire
        now = time.time()
        rate_limits[ip] = [
            now - RATE_WINDOW - 10,  # Expired
        ] + rate_limits[ip][1:]
        
        # Should allow new request (old one removed)
        try:
            check_rate_limit(request)
            assert True
        except HTTPException:
            pytest.fail("Should allow request after old entries expire")


class TestRateLimitNoClient:
    """Test rate limiting with missing client info."""

    def test_rate_limit_no_client(self):
        """Test rate limiting when client is None."""
        request = MagicMock()
        request.client = None
        
        rate_limits.clear()
        
        # Should use "unknown" as IP
        check_rate_limit(request)
        assert "unknown" in rate_limits

    def test_rate_limit_no_client_consistent(self):
        """Test multiple requests with no client use same rate limit bucket."""
        request1 = MagicMock()
        request1.client = None
        
        request2 = MagicMock()
        request2.client = None
        
        rate_limits.clear()
        
        # Both should use same "unknown" bucket
        for i in range(5):
            check_rate_limit(request1)
            check_rate_limit(request2)
        
        # Should have only one bucket for "unknown"
        assert len(rate_limits) == 1
        assert "unknown" in rate_limits
        assert len(rate_limits["unknown"]) == 10  # 5 + 5 requests


class TestRateLimitDataStructure:
    """Test rate limit data structure."""

    def test_rate_limit_structure_is_dict_of_lists(self):
        """Test rate_limits maintains proper structure."""
        request = MagicMock()
        request.client.host = "192.168.1.8"
        
        rate_limits.clear()
        
        check_rate_limit(request)
        
        assert isinstance(rate_limits, dict)
        assert request.client.host in rate_limits
        assert isinstance(rate_limits[request.client.host], list)
        assert all(isinstance(t, float) for t in rate_limits[request.client.host])

    def test_rate_limit_timestamps_ascending(self):
        """Test timestamps in rate limit are in chronological order."""
        request = MagicMock()
        request.client.host = "192.168.1.9"
        
        rate_limits.clear()
        
        for i in range(5):
            check_rate_limit(request)
        
        timestamps = rate_limits[request.client.host]
        # Should be roughly ascending (within same second)
        for i in range(len(timestamps) - 1):
            assert timestamps[i] <= timestamps[i + 1]


class TestRateLimitIntegration:
    """Integration tests with actual endpoints."""

    @pytest.mark.asyncio
    async def test_rate_limit_on_generate_endpoint(self, test_client):
        """Test rate limiting on /api/generate endpoint."""
        rate_limits.clear()
        
        # Get the IP that the test client would use
        # Try a few requests
        for i in range(5):
            with patch("main.ai_generate", new_callable=AsyncMock) as mock_gen:
                mock_gen.return_value = '''{
                    "name": "Test",
                    "code": "export default function Test() {}",
                    "badge": "Component",
                    "doc_slug": "test",
                    "imports": []
                }'''
                response = test_client.post("/api/generate", json={"prompt": "test"})
                assert response.status_code == 200

    @pytest.mark.asyncio
    async def test_rate_limit_on_analyze_endpoint(self, test_client):
        """Test rate limiting on /api/analyze endpoint."""
        rate_limits.clear()
        
        with patch("main.httpx.AsyncClient") as mock_client_class, \
             patch("main.ai_generate", new_callable=AsyncMock) as mock_gen:
            
            mock_response = MagicMock()
            mock_response.text = "<html></html>"
            mock_client_instance = AsyncMock()
            mock_client_instance.get = AsyncMock(return_value=mock_response)
            mock_client_instance.__aenter__ = AsyncMock(return_value=mock_client_instance)
            mock_client_instance.__aexit__ = AsyncMock(return_value=None)
            mock_client_class.return_value = mock_client_instance
            
            mock_gen.return_value = '''{
                "colors": [],
                "fonts": [],
                "components": [],
                "suggestions": []
            }'''
            
            response = test_client.post("/api/analyze", json={"url": "https://example.com"})
            assert response.status_code == 200

    @pytest.mark.asyncio
    async def test_rate_limit_on_theme_endpoint(self, test_client):
        """Test rate limiting on /api/theme endpoint."""
        rate_limits.clear()
        
        with patch("main.ai_generate", new_callable=AsyncMock) as mock_gen:
            mock_gen.return_value = '''{
                "name": "Test",
                "primary": "#000",
                "accent": "#fff",
                "bg": "#f0f"
            }'''
            response = test_client.post("/api/theme", json={"description": "test"})
            assert response.status_code == 200


class TestRateLimitBoundary:
    """Test rate limit boundary conditions."""

    def test_rate_limit_at_exact_threshold(self):
        """Test behavior exactly at rate limit threshold."""
        request = MagicMock()
        request.client.host = "192.168.1.12"
        
        rate_limits.clear()
        
        # Make exactly RATE_LIMIT requests
        for i in range(RATE_LIMIT):
            check_rate_limit(request)
            assert len(rate_limits[request.client.host]) == i + 1
        
        # Next one should fail
        with pytest.raises(HTTPException):
            check_rate_limit(request)

    def test_rate_limit_one_below_threshold(self):
        """Test making one request below threshold."""
        request = MagicMock()
        request.client.host = "192.168.1.13"
        
        rate_limits.clear()
        
        for i in range(RATE_LIMIT - 1):
            check_rate_limit(request)
        
        # Should still allow one more
        try:
            check_rate_limit(request)
            assert True
        except HTTPException:
            pytest.fail("Should allow request below threshold")

    def test_rate_limit_much_above_threshold(self):
        """Test behavior when way over rate limit."""
        request = MagicMock()
        request.client.host = "192.168.1.14"
        
        rate_limits.clear()
        
        # Go way over limit
        for i in range(RATE_LIMIT):
            check_rate_limit(request)
        
        # Many subsequent requests should all fail
        for i in range(10):
            with pytest.raises(HTTPException):
                check_rate_limit(request)
