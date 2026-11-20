/** Browser client for the separately deployed AI API. */

function apiBase(): string {
  const configured = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "");
  if (configured) return configured;
  if (process.env.NODE_ENV === "development") return "http://localhost:8000";
  throw new Error("AI service is not configured for this deployment.");
}

export interface GenerateResult {
  name: string; code: string; badge: string; badge_color: string; doc_slug: string; imports: string[];
}
export interface AnalyzeResult {
  colors: { name: string; hex: string }[]; fonts: string[]; components: string[]; suggestions: string[];
}
export interface ThemeResult {
  name: string; primary: string; accent: string; bg: string; css_code: string; tailwind_code: string;
}

function object(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}
function strings(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((entry) => typeof entry === "string");
}
const hex = (value: unknown) => typeof value === "string" && /^#[0-9a-fA-F]{6}$/.test(value);

async function post<T>(route: string, body: unknown, valid: (value: unknown) => boolean): Promise<T> {
  let response: Response;
  try {
    response = await fetch(apiBase() + route, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body), signal: AbortSignal.timeout(120000),
    });
  } catch (error) {
    if (error instanceof Error && /timeout|abort/i.test(error.name)) throw new Error("The AI request timed out. Try again.");
    if (error instanceof Error && error.message.includes("not configured")) throw error;
    throw new Error("AI service could not be reached. Try again later.");
  }
  const data: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const detail = object(data) && typeof data.detail === "string" ? data.detail.slice(0, 500) : "The request failed. Check your input and try again.";
    throw new Error(detail);
  }
  if (!valid(data)) throw new Error("AI service returned an invalid response. Try again.");
  return data as T;
}

export async function checkAPI(): Promise<boolean> {
  try {
    const response = await fetch(apiBase() + "/", { signal: AbortSignal.timeout(3000) });
    if (!response.ok) return false;
    const data: unknown = await response.json();
    return object(data) && object(data.providers) && (data.providers.gemini === true || data.providers.groq === true);
  } catch { return false; }
}

export function generateComponent(prompt: string, category?: string): Promise<GenerateResult> {
  return post("/api/generate", { prompt, category }, (data) => object(data) &&
    ["name", "code", "badge", "badge_color", "doc_slug"].every((key) => typeof data[key] === "string") && strings(data.imports));
}

export function analyzeURL(url: string): Promise<AnalyzeResult> {
  return post("/api/analyze", { url }, (data) => object(data) && Array.isArray(data.colors) &&
    data.colors.every((color: unknown) => object(color) && typeof color.name === "string" && hex(color.hex)) &&
    strings(data.fonts) && strings(data.components) && strings(data.suggestions));
}

export function generateTheme(description: string): Promise<ThemeResult> {
  return post("/api/theme", { description }, (data) => object(data) &&
    ["name", "css_code", "tailwind_code"].every((key) => typeof data[key] === "string") &&
    ["primary", "accent", "bg"].every((key) => hex(data[key])));
}
