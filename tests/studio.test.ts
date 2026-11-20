import { compilePreview } from "@/lib/preview-compiler";
import { isPreviewBundle, isPreviewMessage, sandboxDocument } from "@/lib/preview-sandbox";
import { createHash } from "node:crypto";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

function renderFixture(code: string) {
  const compiledModule = { exports: {} as { default?: React.ElementType } };
  const requireModule = (name: string) => {
    if (name !== "react") throw new Error("Unsupported fixture import: " + name);
    return React;
  };
  // These are fixed test fixtures. Production evaluates only inside the sandbox.
  new Function("React", "require", "module", "exports", compilePreview(code))(React, requireModule, compiledModule, compiledModule.exports);
  return renderToStaticMarkup(React.createElement(compiledModule.exports.default!));
}

describe("Preview compiler", () => {
  it("preserves local variables and helper functions", () => {
    const html = renderFixture('const label = "Hello"; function format(s: string) { return s + "!"; } export default function Demo() { const value = format(label); return <div>{value}</div>; }');
    expect(html).toBe("<div>Hello!</div>");
  });

  it("supports multiline imports, TypeScript, useMemo, and useCallback", () => {
    const html = renderFixture(
      'import React, {\n useMemo,\n useCallback,\n} from "react";\n' +
      'type Label = string;\nexport default function Demo() { const label: Label = "Memo"; const read = useCallback(() => label, [label]); const value = useMemo(read, [read]); return <span>{value}</span>; }'
    );
    expect(html).toBe("<span>Memo</span>");
  });

  it.each([
    'export default () => <div>Arrow</div>;',
    'const Demo: React.FC = () => <div>Arrow</div>; export default Demo;',
    'export default function () { return <div>Arrow</div>; }',
  ])("supports standard default export forms", (code) => {
    expect(renderFixture(code)).toBe("<div>Arrow</div>");
  });

  it("compiles without executing the generated compiledModule", () => {
    compilePreview("globalThis.__preview_compile_marker = true; export default () => <div>Preview</div>;");
    expect(Object.hasOwn(globalThis, "__preview_compile_marker")).toBe(false);
  });

  it("reports invalid syntax and bounds the input size", () => {
    expect(() => compilePreview("export default function {")).toThrow();
    expect(() => compilePreview(" ")).toThrow();
    expect(() => compilePreview("x".repeat(50001))).toThrow();
  });
});

describe("Sandbox document and message boundaries", () => {
  const runtime = 'console.log("trusted boot");';
  const bundle = { runtime, integrity: "sha256-" + createHash("sha256").update(runtime).digest("base64") };

  it("restricts network access and permits only the hashed runtime", () => {
    const html = sandboxDocument(bundle, "body{color:white}", "example-channel");
    expect(html).toContain("connect-src 'none'");
    expect(html).toContain("frame-src 'none'");
    expect(html).toContain("script-src '" + bundle.integrity + "' 'unsafe-eval'");
    expect(html).not.toContain("script-src 'unsafe-inline'");
  });

  it("cannot break out of the style element", () => {
    const html = sandboxDocument(bundle, "</style><script>bad()</script>", "example-channel");
    const parsed = new DOMParser().parseFromString(html, "text/html");
    expect(parsed.querySelectorAll("script")).toHaveLength(1);
    expect(parsed.querySelector("script")?.textContent).toBe(runtime);
  });

  it("rejects invalid runtime hashes, closing script tags, and channel injection", () => {
    expect(isPreviewBundle({ runtime, integrity: "anything" })).toBe(false);
    expect(isPreviewBundle({ ...bundle, runtime: "</script>" })).toBe(false);
    expect(() => sandboxDocument(bundle, "", '"><script>bad()</script>')).toThrow();
  });

  it("rejects stale channels and malformed messages", () => {
    expect(isPreviewMessage({ kind: "flexui-preview", channel: "old", type: "ready" }, "new")).toBe(false);
    expect(isPreviewMessage({ kind: "flexui-preview", channel: "new", type: "resize", height: Infinity }, "new")).toBe(false);
    expect(isPreviewMessage({ kind: "flexui-preview", channel: "new", type: "error", message: {} }, "new")).toBe(false);
    expect(isPreviewMessage({ kind: "flexui-preview", channel: "new", type: "ready" }, "new")).toBe(true);
  });
});
