"""Fetch public HTML using a validated, pinned address for each redirect hop."""

import asyncio
import ipaddress
import socket

import httpx
from fastapi import HTTPException

MAX_HTML_BYTES = 2 * 1024 * 1024
MAX_REDIRECTS = 5
FETCH_DEADLINE_SECONDS = 15
# Keep special-use ranges blocked on Python versions with older IANA classifications.
SPECIAL_USE = tuple(map(ipaddress.ip_network, ["192.0.0.0/24", "192.88.99.0/24", "2001::/23", "3fff::/20"]))


def public_address(value: str) -> bool:
    address = ipaddress.ip_address(value)
    if (not address.is_global or address.is_multicast or address.is_reserved
            or any(address.version == network.version and address in network for network in SPECIAL_USE)):
        return False
    if isinstance(address, ipaddress.IPv6Address):
        # Reject translation/tunnelling ranges that can embed non-public IPv4.
        return (
            address in ipaddress.IPv6Network("2000::/3")
            and address.sixtofour is None
            and address.teredo is None
            and address.ipv4_mapped is None
        )
    return True


def validate_url(value: str) -> httpx.URL:
    try:
        url = httpx.URL(value)
    except httpx.InvalidURL as error:
        raise HTTPException(400, "Enter a valid public HTTP or HTTPS URL.") from error
    if (
        any(ord(character) <= 32 for character in value)
        or url.scheme not in {"http", "https"}
        or not url.host
        or url.username
        or url.password
        or url.port not in {None, 80 if url.scheme == "http" else 443}
    ):
        raise HTTPException(400, "Only public HTTP/HTTPS websites on standard ports are supported.")
    return url.copy_with(fragment=None)


async def resolve_public_host(host: str, port: int) -> str:
    try:
        addresses = {host}
        ipaddress.ip_address(host)
    except ValueError:
        try:
            records = await asyncio.get_running_loop().getaddrinfo(host, port, type=socket.SOCK_STREAM)
            addresses = {record[4][0] for record in records}
        except socket.gaierror as error:
            raise HTTPException(400, "The website hostname could not be resolved.") from error
    if not addresses or not all(public_address(address) for address in addresses):
        raise HTTPException(400, "Internal, local, and reserved network addresses are not allowed.")
    return sorted(addresses)[0]


async def fetch_public_html(value: str) -> str:
    url = validate_url(value)
    try:
        async with asyncio.timeout(FETCH_DEADLINE_SECONDS):
            async with httpx.AsyncClient(
                timeout=httpx.Timeout(5), follow_redirects=False, trust_env=False,
                limits=httpx.Limits(max_connections=1, max_keepalive_connections=0),
            ) as client:
                for hop in range(MAX_REDIRECTS + 1):
                    address = await resolve_public_host(url.host, url.port or (443 if url.scheme == "https" else 80))
                    # Pin the physical connection while preserving Host and TLS SNI.
                    # A second DNS lookup cannot rebind this request to a private IP.
                    destination = url.copy_with(host=address)
                    async with client.stream(
                        "GET", destination,
                        headers={"Host": url.netloc.decode("ascii"), "User-Agent": "FlexUI-Analyzer/1.0", "Accept-Encoding": "identity"},
                        extensions={"sni_hostname": url.host},
                    ) as response:
                        if response.status_code in {301, 302, 303, 307, 308}:
                            location = response.headers.get("location")
                            if not location or hop == MAX_REDIRECTS:
                                raise HTTPException(400, "The website redirected too many times or returned an invalid redirect.")
                            url = validate_url(str(url.join(location)))
                            continue
                        response.raise_for_status()
                        media_type = response.headers.get("content-type", "").split(";", 1)[0].strip().lower()
                        if media_type not in {"text/html", "application/xhtml+xml"}:
                            raise HTTPException(400, "The URL must return an HTML page.")
                        if response.headers.get("content-encoding", "identity").lower() != "identity":
                            raise HTTPException(400, "The website returned an unsupported compressed response.")
                        length = response.headers.get("content-length")
                        if length and (not length.isdigit() or int(length) > MAX_HTML_BYTES):
                            raise HTTPException(400, "The website response is too large.")
                        body = bytearray()
                        async for chunk in response.aiter_bytes(chunk_size=65536):
                            body.extend(chunk)
                            if len(body) > MAX_HTML_BYTES:
                                raise HTTPException(400, "The website response is too large.")
                        return body.decode(response.encoding or "utf-8", errors="replace")
    except (httpx.HTTPError, TimeoutError, UnicodeError, LookupError) as error:
        raise HTTPException(400, "The website could not be fetched. Check the address and try again.") from error
    raise HTTPException(400, "The website could not be fetched.")
