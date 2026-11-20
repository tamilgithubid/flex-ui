"use client";

import { isPreviewBundle, isPreviewMessage, sandboxDocument, type PreviewBundle } from "@/lib/preview-sandbox";
import { useEffect, useRef, useState } from "react";

let runtimeBundle: Promise<PreviewBundle> | undefined;

function loadRuntime(): Promise<PreviewBundle> {
  runtimeBundle ??= fetch("/studio-preview.json", { cache: "no-store" })
    .then(async (response) => {
      if (!response.ok) throw new Error("Preview runtime is unavailable. Reload the page and try again.");
      const bundle: unknown = await response.json();
      if (!isPreviewBundle(bundle)) throw new Error("The preview runtime is invalid.");
      return bundle;
    })
    .catch((error: unknown) => { runtimeBundle = undefined; throw error; });
  return runtimeBundle;
}

function editorStyles(): string {
  const rules: string[] = [];
  for (const sheet of Array.from(document.styleSheets)) {
    try { rules.push(Array.from(sheet.cssRules, (rule) => rule.cssText).join("\n")); }
    catch { /* Cross-origin stylesheets are intentionally not copied. */ }
  }
  const root = getComputedStyle(document.documentElement);
  const tokens = Array.from(root)
    .filter((name) => name.startsWith("--flexui-"))
    .map((name) => name + ":" + root.getPropertyValue(name) + ";")
    .join("");
  return rules.join("\n") + "\n:root{" + tokens + "}";
}

function SandboxPreview({ code, className }: { code: string; className?: string }) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [documentSource, setDocumentSource] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [height, setHeight] = useState(250);

  useEffect(() => {
    let disposed = false;
    let settled = false;
    const channel = Array.from(crypto.getRandomValues(new Uint32Array(4))).join("-");
    const timeout = window.setTimeout(() => {
      if (!disposed && !settled) {
        setLoading(false);
        setError("The preview did not finish loading. Reload the page and try again.");
      }
    }, 15000);
    const send = (message: Record<string, unknown>) => frameRef.current?.contentWindow?.postMessage({
      kind: "flexui-preview", channel, ...message,
    }, "*");
    const listener = (event: MessageEvent) => {
      if (event.source !== frameRef.current?.contentWindow || !isPreviewMessage(event.data, channel)) return;
      if (event.data.type === "ready") send({ type: "render", code });
      if (event.data.type === "rendered" || event.data.type === "error") {
        settled = true;
        clearTimeout(timeout);
        setLoading(false);
        setError(event.data.type === "error" ? event.data.message ?? "Preview failed." : null);
      }
      if (event.data.type === "resize") setHeight(Math.max(250, Math.min(900, event.data.height ?? 250)));
    };
    window.addEventListener("message", listener);
    const observer = new MutationObserver(() => send({ type: "styles", css: editorStyles() }));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["style", "class", "data-flexui-theme"] });
    loadRuntime()
      .then((bundle) => { if (!disposed) setDocumentSource(sandboxDocument(bundle, editorStyles(), channel)); })
      .catch((failure: unknown) => {
        if (!disposed) {
          clearTimeout(timeout);
          setLoading(false);
          setError(failure instanceof Error ? failure.message : "Preview could not be loaded.");
        }
      });
    return () => { disposed = true; clearTimeout(timeout); observer.disconnect(); window.removeEventListener("message", listener); };
  }, [code]);

  return (
    <div className={className}>
      {loading && <p role="status" className="p-4 text-sm text-zinc-400">Loading preview…</p>}
      <iframe
        ref={frameRef}
        title="Generated component preview"
        sandbox="allow-scripts"
        referrerPolicy="no-referrer"
        srcDoc={documentSource}
        className="w-full rounded-xl border border-white/[0.04]"
        style={{ height, display: documentSource ? "block" : "none" }}
      />
      {error && <p role="alert" className="mt-2 rounded-lg bg-red-500/10 p-3 font-mono text-xs text-red-400">{error}</p>}
    </div>
  );
}

export function LiveCodePreview({ code, className }: { code: string; className?: string }) {
  return <SandboxPreview key={code} code={code} className={className} />;
}
