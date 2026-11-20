export interface PreviewBundle {
  runtime: string;
  integrity: string;
}

export function isPreviewBundle(value: unknown): value is PreviewBundle {
  return !!value && typeof value === "object" &&
    "runtime" in value && typeof value.runtime === "string" && value.runtime.length < 3000000 &&
    "integrity" in value && typeof value.integrity === "string" &&
    /^sha256-[A-Za-z0-9+/]{43}=$/.test(value.integrity) &&
    !/<\/script/i.test(value.runtime);
}

export function sandboxDocument(bundle: PreviewBundle, css: string, channel: string): string {
  if (!isPreviewBundle(bundle) || !/^[a-zA-Z0-9-]{1,80}$/.test(channel)) {
    throw new Error("Invalid preview runtime.");
  }
  const policy = [
    "default-src 'none'",
    "script-src '" + bundle.integrity + "' 'unsafe-eval'",
    "style-src 'unsafe-inline'",
    "img-src data: blob:",
    "connect-src 'none'",
    "font-src data:",
    "base-uri 'none'",
    "form-action 'none'",
    "frame-src 'none'",
    "object-src 'none'",
  ].join("; ");
  return [
    '<!DOCTYPE html><html class="dark"><head><meta charset="utf-8">',
    '<meta http-equiv="Content-Security-Policy" content="' + policy + '">',
    "<style>" + css.replace(/<\/style/gi, "<\\/style") +
      "\nbody{margin:0;padding:24px;background:#09090b;color:#fafafa;font-family:system-ui,sans-serif}#preview-root{min-height:200px}</style>",
    '</head><body data-preview-channel="' + channel + '"><div id="preview-root"></div>',
    "<script>" + bundle.runtime + "</script></body></html>",
  ].join("");
}

export function isPreviewMessage(value: unknown, channel: string): value is {
  kind: "flexui-preview"; channel: string; type: "ready" | "rendered" | "error" | "resize";
  message?: string; height?: number;
} {
  if (!value || typeof value !== "object" || !("kind" in value) || value.kind !== "flexui-preview" ||
      !("channel" in value) || value.channel !== channel || !("type" in value)) return false;
  if (value.type === "error") return "message" in value && typeof value.message === "string" && value.message.length <= 1000;
  if (value.type === "resize") return "height" in value && typeof value.height === "number" && Number.isFinite(value.height);
  return value.type === "ready" || value.type === "rendered";
}
