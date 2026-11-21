import { act, cleanup, fireEvent, render } from "@testing-library/react";
import { createHash } from "node:crypto";
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { OGLExample } from "@/components/flexui/ogl-example";
import { OGL_EXAMPLES } from "@/lib/ogl-examples";
import { assetDestination, installOGLAssets, selectAssets, verifyAsset } from "../scripts/flexui-ogl-assets.mjs";

const root = path.resolve(__dirname, "..");
const manifest = JSON.parse(readFileSync(path.join(root, "public/ogl/assets-manifest.json"), "utf8"));
const provenance = JSON.parse(readFileSync(path.join(root, "public/ogl/provenance.json"), "utf8"));
const hash = (bytes: string | Buffer) => createHash("sha256").update(bytes).digest("hex");
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

describe("OGL collection fidelity and installation", () => {
  it("contains all 18 requested scenes with React components, documentation and registry entries", () => {
    expect(OGL_EXAMPLES).toHaveLength(18);
    expect(new Set(OGL_EXAMPLES.map(example => example.id)).size).toBe(18);
    for (const example of OGL_EXAMPLES) {
      expect(readFileSync(path.join(root, "components/flexui/ogl-" + example.id + ".tsx"), "utf8")).toContain(example.component);
      expect(readFileSync(path.join(root, "app/docs/components/ogl-" + example.id + "/page.tsx"), "utf8")).toContain(example.id);
      expect(JSON.parse(readFileSync(path.join(root, "public/r/ogl-" + example.id + ".json"), "utf8")).name).toBe("ogl-" + example.id);
    }
  });
  it("preserves every upstream GLSL shader and the complete pinned engine", () => {
    const shaders = (source: string) => [...source.matchAll(/\/\*\s*glsl\s*\*\/\s*\x60([\s\S]*?)\x60/g)].map(match => match[1]);
    for (const example of OGL_EXAMPLES) {
      const original = readFileSync(path.join(root, "vendor/ogl/examples/" + example.id + ".html"), "utf8");
      const local = readFileSync(path.join(root, "public/ogl/examples/" + example.id + ".html"), "utf8");
      expect(hash(original)).toBe(provenance.examples[example.id].originalSha256);
      expect(hash(local)).toBe(provenance.examples[example.id].adaptedSha256);
      expect(shaders(local)).toEqual(shaders(original));
    }
    for (const [name, expected] of Object.entries(provenance.source)) {
      expect(hash(readFileSync(path.join(root, "public/ogl", name)))).toBe(expected);
    }
  });
  it("ships every required texture, model, font and decoder byte with a pinned checksum", () => {
    for (const asset of Object.values(manifest.assets) as { path: string; bytes: number; sha256: string }[]) {
      const bytes = readFileSync(path.join(root, asset.path));
      expect(bytes.length).toBe(asset.bytes);
      expect(hash(bytes)).toBe(asset.sha256);
    }
    for (const example of OGL_EXAMPLES) {
      const source = readFileSync(path.join(root, "public/ogl/examples/" + example.id + ".html"), "utf8");
      for (const [name] of source.matchAll(/assets\/[\w./-]+\.(?:jpg|png|json|glb|js)/g)) {
        expect(manifest.examples[example.id]).toContain("public/ogl/examples/" + name);
      }
    }
    expect(selectAssets(manifest, ["gltf-ktx2-basis"]).map((asset: { path: string }) => asset.path)).toContain("public/ogl/examples/assets/libs/basis/basis_transcoder.wasm");
  });
  it("installs a complete scene in a fresh consumer and verifies cached files", async () => {
    const consumer = mkdtempSync(path.join(os.tmpdir(), "flexui-ogl-consumer-"));
    try {
      mkdirSync(path.join(consumer, "public/ogl"), { recursive: true });
      copyFileSync(path.join(root, "public/ogl/assets-manifest.json"), path.join(consumer, "public/ogl/assets-manifest.json"));
      const first = await installOGLAssets({ root: consumer, ids: ["skydome"], source: root, log: () => {} });
      expect(first.installed).toBeGreaterThan(0);
      expect(hash(readFileSync(path.join(consumer, "public/ogl/examples/assets/sky.jpg")))).toBe(manifest.assets["public/ogl/examples/assets/sky.jpg"].sha256);
      const second = await installOGLAssets({ root: consumer, ids: ["skydome"], source: root, log: () => {} });
      expect(second.installed).toBe(0);
      expect(second.cached).toBe(first.installed);
    } finally { rmSync(consumer, { recursive: true, force: true }); }
  });
  it("rejects path traversal, symlinks, changed upstream URLs and corrupt assets", () => {
    const consumer = mkdtempSync(path.join(os.tmpdir(), "flexui-ogl-path-"));
    const outside = mkdtempSync(path.join(os.tmpdir(), "flexui-ogl-outside-"));
    try {
      expect(() => assetDestination(consumer, "public/ogl/examples/assets/../../escape")).toThrow();
      mkdirSync(path.join(consumer, "public/ogl/examples"), { recursive: true });
      symlinkSync(outside, path.join(consumer, "public/ogl/examples/assets"), "dir");
      expect(() => assetDestination(consumer, "public/ogl/examples/assets/sky.jpg")).toThrow(/symlink/);
      const modified = structuredClone(manifest);
      modified.assets["public/ogl/examples/assets/sky.jpg"].url = "https://untrusted.example/sky.jpg";
      expect(() => selectAssets(modified, ["skydome"])).toThrow(/descriptor/);
      expect(() => selectAssets(manifest, ["constructor"])).toThrow(/Unknown/);
      expect(() => verifyAsset(manifest.assets["public/ogl/examples/assets/sky.jpg"], Buffer.from("corrupt"))).toThrow(/integrity/);
    } finally {
      rmSync(consumer, { recursive: true, force: true });
      rmSync(outside, { recursive: true, force: true });
    }
  });
});

describe("OGL preview lifecycle", () => {
  function observePreview() {
    let callback: IntersectionObserverCallback;
    vi.stubGlobal("IntersectionObserver", class {
      constructor(value: IntersectionObserverCallback) { callback = value; }
      observe() {}
      disconnect() {}
    });
    return (visible: boolean) => act(() => callback([{ isIntersecting: visible } as IntersectionObserverEntry], {} as IntersectionObserver));
  }
  it("loads only near the viewport and unloads the rendering document off-screen", () => {
    const observe = observePreview();
    const view = render(<OGLExample example="skydome" />);
    expect(view.container.querySelector("iframe")).toBeNull();
    observe(true);
    expect(view.container.querySelector("iframe")).toHaveAttribute("src", "/ogl/examples/skydome.html?dpr=1.5&autoplay=0");
    observe(false);
    expect(view.container.querySelector("iframe")).toBeNull();
  });
  it("accepts rendering status only from its own frame and keeps playback in the same document", () => {
    const observe = observePreview();
    const view = render(<OGLExample example="skydome" />);
    observe(true);
    const iframe = view.container.querySelector("iframe")!;
    const send = (origin: string) => fireEvent(window, new MessageEvent("message", {
      source: iframe.contentWindow, origin, data: { type: "flexui-ogl", kind: "ready" },
    }));
    send("https://untrusted.example");
    expect(view.container.querySelector("[data-ogl-example]")).toHaveAttribute("data-preview-status", "loading");
    send(window.location.origin);
    expect(view.container.querySelector("[data-ogl-example]")).toHaveAttribute("data-preview-status", "ready");
    fireEvent.click(view.getByRole("button", { name: /Pause Skydome|Play Skydome/ }));
    expect(view.container.querySelector("iframe")).toBe(iframe);
    fireEvent.click(view.getByRole("button", { name: "Restart" }));
    expect(view.container.querySelector("iframe")).not.toBe(iframe);
  });
});
