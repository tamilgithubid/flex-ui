import { afterEach, describe, expect, it, vi } from "vitest";
import { analyzeURL, checkAPI, generateComponent } from "@/lib/studio-api";

afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); });

describe("Studio API client", () => {
  it("does not use a visitor's localhost in production", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_API_URL", "");
    const request = vi.fn();
    vi.stubGlobal("fetch", request);
    await expect(analyzeURL("https://example.com")).rejects.toThrow("not configured");
    expect(request).not.toHaveBeenCalled();
  });

  it("uses the configured backend and returns real validated data", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.example.com/");
    const payload = { colors: [{ name: "Primary", hex: "#112233" }], fonts: ["Inter"], components: [], suggestions: [] };
    const request = vi.fn().mockResolvedValue(new Response(JSON.stringify(payload)));
    vi.stubGlobal("fetch", request);
    expect(await analyzeURL("https://example.com")).toEqual(payload);
    expect(request.mock.calls[0][0]).toBe("https://api.example.com/api/analyze");
  });

  it("surfaces API failures instead of returning fabricated analysis", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.example.com");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response('{"detail":"Rate limit exceeded"}', { status: 429 })));
    await expect(analyzeURL("https://example.com")).rejects.toThrow("Rate limit exceeded");
  });

  it("rejects malformed successful responses", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.example.com");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("[]")));
    await expect(generateComponent("A card")).rejects.toThrow("invalid response");
  });

  it("does not display raw structured validation errors", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.example.com");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response('{"detail":[{"input":"private prompt"}]}', { status: 422 })));
    await expect(generateComponent("A card")).rejects.toThrow("Check your input");
  });

  it("reports providers without keys as unavailable", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.example.com");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response('{"providers":{"gemini":false,"groq":false}}')));
    expect(await checkAPI()).toBe(false);
  });
});
