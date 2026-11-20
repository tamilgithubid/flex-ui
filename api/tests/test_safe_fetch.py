import asyncio
import socket

import httpx
import pytest
from fastapi import HTTPException

import safe_fetch


@pytest.fixture
def http_mock(monkeypatch):
    real_client = httpx.AsyncClient
    def install(handler):
        monkeypatch.setattr(safe_fetch.httpx, "AsyncClient", lambda **options: real_client(transport=httpx.MockTransport(handler), **options))
    return install


@pytest.mark.parametrize("address", ["127.0.0.1", "10.1.2.3", "169.254.169.254", "0.0.0.0", "224.0.0.1", "::1", "fc00::1", "::ffff:127.0.0.1", "2002:7f00:1::", "64:ff9b::a9fe:a9fe", "192.0.0.8", "192.88.99.1", "2001:20::1", "3fff::1"])
def test_non_public_addresses_are_rejected(address):
    assert not safe_fetch.public_address(address)


@pytest.mark.parametrize("url", ["file:///etc/passwd", "ftp://example.com", "https://user:pass@example.com", "https://example.com:8443", "https://example.com\n"])
def test_unsupported_url_forms_are_rejected(url):
    with pytest.raises(HTTPException):
        safe_fetch.validate_url(url)


@pytest.mark.asyncio
async def test_mixed_dns_answers_are_rejected(monkeypatch):
    async def lookup(*args, **kwargs):
        return [(socket.AF_INET, socket.SOCK_STREAM, 6, "", (ip, 443)) for ip in ["8.8.8.8", "127.0.0.1"]]
    monkeypatch.setattr(asyncio.get_running_loop(), "getaddrinfo", lookup)
    with pytest.raises(HTTPException):
        await safe_fetch.resolve_public_host("example.com", 443)


@pytest.mark.asyncio
async def test_connection_is_pinned_with_original_host_and_tls_name(http_mock, monkeypatch):
    calls = []
    async def lookup(*args, **kwargs):
        calls.append(args)
        return [(socket.AF_INET, socket.SOCK_STREAM, 6, "", ("8.8.8.8", 443))]
    monkeypatch.setattr(asyncio.get_running_loop(), "getaddrinfo", lookup)
    def handler(request):
        assert request.url.host == "8.8.8.8"
        assert request.headers["host"] == "example.com"
        assert request.extensions["sni_hostname"] == "example.com"
        return httpx.Response(200, headers={"content-type": "text/html"}, content=b"<p>public</p>")
    http_mock(handler)
    assert await safe_fetch.fetch_public_html("https://example.com") == "<p>public</p>"
    assert len(calls) == 1


@pytest.mark.asyncio
async def test_redirect_to_private_address_is_blocked(http_mock):
    calls = []
    def handler(request):
        calls.append(request)
        return httpx.Response(302, headers={"location": "http://127.0.0.1/private"})
    http_mock(handler)
    with pytest.raises(HTTPException) as error:
        await safe_fetch.fetch_public_html("https://8.8.8.8")
    assert error.value.status_code == 400
    assert len(calls) == 1


@pytest.mark.asyncio
async def test_redirect_loop_is_bounded(http_mock):
    calls = []
    def handler(request):
        calls.append(request)
        return httpx.Response(302, headers={"location": "/again"})
    http_mock(handler)
    with pytest.raises(HTTPException):
        await safe_fetch.fetch_public_html("https://8.8.8.8")
    assert len(calls) == safe_fetch.MAX_REDIRECTS + 1


@pytest.mark.asyncio
@pytest.mark.parametrize("headers", [{"content-type": "application/json"}, {"content-type": "text/html", "content-length": "999999999"}, {"content-type": "text/html", "content-encoding": "gzip"}])
async def test_invalid_or_large_responses_are_rejected(http_mock, headers):
    http_mock(lambda request: httpx.Response(200, headers=headers))
    with pytest.raises(HTTPException):
        await safe_fetch.fetch_public_html("https://8.8.8.8")


@pytest.mark.asyncio
async def test_streaming_body_limit_is_enforced(http_mock, monkeypatch):
    monkeypatch.setattr(safe_fetch, "MAX_HTML_BYTES", 20)
    class Body(httpx.AsyncByteStream):
        async def __aiter__(self):
            yield b"x" * 40
    http_mock(lambda request: httpx.Response(200, headers={"content-type": "text/html"}, stream=Body()))
    with pytest.raises(HTTPException) as error:
        await safe_fetch.fetch_public_html("https://8.8.8.8")
    assert "too large" in error.value.detail
