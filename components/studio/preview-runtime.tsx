import React, { Component, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { compilePreview } from "../../lib/preview-compiler";
import { previewModules } from "./preview-components";

const channel = document.body.dataset.previewChannel ?? "";
const container = document.getElementById("preview-root")!;
const root = createRoot(container);
let revision = 0;

function report(type: string, extra: Record<string, unknown> = {}) {
  parent.postMessage({ kind: "flexui-preview", channel, type, ...extra }, "*");
}

function reportError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  report("error", { message: message.slice(0, 1000) });
}

class PreviewBoundary extends Component<{ children: React.ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(error: Error) { reportError(error); }
  render() { return this.state.failed ? null : this.props.children; }
}

function Completion() {
  useEffect(() => { report("rendered"); }, []);
  return null;
}

function requirePreviewModule(name: string) {
  if (!Object.hasOwn(previewModules, name)) throw new Error("Unsupported preview import: " + name);
  return previewModules[name];
}

window.addEventListener("message", (event: MessageEvent) => {
  if (event.source !== parent || !event.data || event.data.kind !== "flexui-preview" ||
      event.data.channel !== channel) return;
  if (event.data.type === "styles" && typeof event.data.css === "string" && event.data.css.length < 2000000) {
    let style = document.getElementById("editor-theme") as HTMLStyleElement | null;
    if (!style) { style = document.createElement("style"); style.id = "editor-theme"; document.head.appendChild(style); }
    style.textContent = event.data.css;
    return;
  }
  if (event.data.type !== "render" || typeof event.data.code !== "string") return;
  try {
    const code = compilePreview(event.data.code);
    const compiledModule = { exports: {} as { default?: React.ElementType | React.ReactElement } };
    // Generated code executes only in this opaque-origin sandbox, never in the editor.
    new Function("React", "require", "module", "exports", code)(React, requirePreviewModule, compiledModule, compiledModule.exports);
    const output = compiledModule.exports.default;
    if (!output) throw new Error("Export a React component as default to preview it.");
    const element = React.isValidElement(output) ? output : React.createElement(output as React.ElementType);
    root.render(<PreviewBoundary key={++revision}>{element}<Completion /></PreviewBoundary>);
  } catch (error) {
    root.render(null);
    reportError(error);
  }
});

window.addEventListener("error", (event) => { event.preventDefault(); reportError(event.error ?? event.message); });
window.addEventListener("unhandledrejection", (event) => { event.preventDefault(); reportError(event.reason); });
new ResizeObserver(() => report("resize", { height: document.documentElement.scrollHeight })).observe(container);
report("ready");
