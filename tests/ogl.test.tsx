import { act, cleanup, fireEvent, render } from "@testing-library/react";
import { createHash } from "node:crypto";
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { WebGLCanvas } from "@/components/flexui/webgl-canvas";
import { WEBGL_COMPONENTS } from "@/lib/webgl-components";
import { assetDestination, installWebGLAssets, selectAssets, verifyAsset } from "../scripts/flexui-webgl-assets.mjs";

const root = path.resolve(__dirname, "..");
const manifest = JSON.parse(readFileSync(path.join(root, "public/webgl/assets-manifest.json"), "utf8"));
const provenance = JSON.parse(readFileSync(path.join(root, "public/webgl/provenance.json"), "utf8"));
const hash = (bytes: string | Buffer) => createHash("sha256").update(bytes).digest("hex");
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

describe("WebGL component fidelity and installation", () => {
  it("contains all 18 requested scenes with React components, documentation and registry entries", () => {
    expect(WEBGL_COMPONENTS).toHaveLength(18);
    expect(new Set(WEBGL_COMPONENTS.map(example => example.id)).size).toBe(18);
    for (const example of WEBGL_COMPONENTS) {
      expect(readFileSync(path.join(root, "components/flexui/" + example.id + ".tsx"), "utf8")).toContain(example.component);
      expect(readFileSync(path.join(root, "app/docs/components/" + example.id + "/page.tsx"), "utf8")).toContain(example.id);
      expect(JSON.parse(readFileSync(path.join(root, "public/r/" + example.id + ".json"), "utf8")).name).toBe(example.id);
    }
  });
  it("preserves every upstream GLSL shader in native scene modules with the pinned engine", () => {
    const shaders = (source: string) => [...source.matchAll(/\/\*\s*glsl\s*\*\/\s*\x60([\s\S]*?)\x60/g)].map(match => match[1]);
    for (const example of WEBGL_COMPONENTS) {
      const original = readFileSync(path.join(root, "vendor/ogl/examples/" + example.id + ".html"), "utf8");
      const local = readFileSync(path.join(root, "components/flexui/webgl/scenes/" + example.id + ".js"), "utf8");
      expect(hash(original)).toBe(provenance.components[example.id].originalSha256);
      expect(hash(local)).toBe(provenance.components[example.id].nativeSha256);
      expect(shaders(local)).toEqual(shaders(original));
    }
    const installed = JSON.parse(readFileSync(path.join(root, "node_modules/ogl/package.json"), "utf8"));
    expect(installed.version).toBe(manifest.upstream.version);
  });
  it("prepares every required texture, model and decoder byte with a pinned checksum", () => {
    for (const asset of Object.values(manifest.assets) as { path: string; bytes: number; sha256: string }[]) {
      const bytes = readFileSync(path.join(root, asset.path));
      expect(bytes.length).toBe(asset.bytes);
      expect(hash(bytes)).toBe(asset.sha256);
    }
    for (const example of WEBGL_COMPONENTS) {
      const source = readFileSync(path.join(root, "components/flexui/webgl/scenes/" + example.id + ".js"), "utf8");
      for (const [name] of source.matchAll(/assets\/[\w./-]+\.(?:jpg|png|json|glb|js)/g)) {
        expect(manifest.components[example.id]).toContain("public/webgl/" + name);
      }
    }
    expect(selectAssets(manifest, ["gltf-ktx2-basis"]).map((asset: { path: string }) => asset.path)).toContain("public/webgl/assets/libs/basis/basis_transcoder.wasm");
  });
  it("installs a complete scene in a fresh consumer and verifies cached files", async () => {
    const consumer = mkdtempSync(path.join(os.tmpdir(), "flexui-ogl-consumer-"));
    try {
      mkdirSync(path.join(consumer, "public/webgl"), { recursive: true });
      copyFileSync(path.join(root, "public/webgl/assets-manifest.json"), path.join(consumer, "public/webgl/assets-manifest.json"));
      const first = await installWebGLAssets({ root: consumer, ids: ["skydome"], source: root, log: () => {} });
      expect(first.installed).toBeGreaterThan(0);
      expect(hash(readFileSync(path.join(consumer, "public/webgl/assets/sky.jpg")))).toBe(manifest.assets["public/webgl/assets/sky.jpg"].sha256);
      const second = await installWebGLAssets({ root: consumer, ids: ["skydome"], source: root, log: () => {} });
      expect(second.installed).toBe(0);
      expect(second.cached).toBe(first.installed);
    } finally { rmSync(consumer, { recursive: true, force: true }); }
  });
  it("rejects path traversal, symlinks, changed upstream URLs and corrupt assets", () => {
    const consumer = mkdtempSync(path.join(os.tmpdir(), "flexui-ogl-path-"));
    const outside = mkdtempSync(path.join(os.tmpdir(), "flexui-ogl-outside-"));
    try {
      expect(() => assetDestination(consumer, "public/webgl/assets/../../escape")).toThrow();
      mkdirSync(path.join(consumer, "public/webgl/examples"), { recursive: true });
      symlinkSync(outside, path.join(consumer, "public/webgl/assets"), "dir");
      expect(() => assetDestination(consumer, "public/webgl/assets/sky.jpg")).toThrow(/symlink/);
      const modified = structuredClone(manifest);
      modified.assets["public/webgl/assets/sky.jpg"].url = "https://untrusted.example/sky.jpg";
      expect(() => selectAssets(modified, ["skydome"])).toThrow(/descriptor/);
      expect(() => selectAssets(manifest, ["constructor"])).toThrow(/Unknown/);
      expect(() => verifyAsset(manifest.assets["public/webgl/assets/sky.jpg"], Buffer.from("corrupt"))).toThrow(/integrity/);
    } finally {
      rmSync(consumer, { recursive: true, force: true });
      rmSync(outside, { recursive: true, force: true });
    }
  });
});

const sessions = vi.hoisted(() => [] as { options: { host: HTMLDivElement; onReady: () => void; onError: (message: string) => void }; dispose: ReturnType<typeof vi.fn>; setPlaying: ReturnType<typeof vi.fn> }[]);
vi.mock("@/components/flexui/webgl/runtime.js", () => ({
  createWebGLRuntime: vi.fn((options) => {
    const session = {
      options,
      setPlaying: vi.fn(),
      start: vi.fn(() => { options.host.appendChild(document.createElement("canvas")); options.onReady(); }),
      dispose: vi.fn(() => options.host.replaceChildren()),
    };
    sessions.push(session);
    return session;
  }),
}));

describe("native WebGL lifecycle", () => {
  function observePreview() {
    let callback: IntersectionObserverCallback;
    vi.stubGlobal("IntersectionObserver", class {
      constructor(value: IntersectionObserverCallback) { callback = value; }
      observe() {}
      disconnect() {}
    });
    return (visible: boolean) => act(() => callback([{ isIntersecting: visible } as IntersectionObserverEntry], {} as IntersectionObserver));
  }
  const scene = () => {};
  it("creates a local canvas only near the viewport and disposes it off-screen", () => {
    const observe = observePreview();
    const view = render(<WebGLCanvas component="skydome" title="Skydome" scene={scene} />);
    expect(view.container.querySelector("canvas")).toBeNull();
    observe(true);
    expect(view.container.querySelector("canvas")).not.toBeNull();
    expect(view.container.querySelector("iframe")).toBeNull();
    const session = sessions.at(-1)!;
    observe(false);
    expect(session.dispose).toHaveBeenCalledOnce();
    expect(view.container.querySelector("canvas")).toBeNull();
    act(() => session.options.onError("stale callback"));
    expect(view.queryByRole("alert")).toBeNull();
  });
  it("pauses in the same canvas, restarts cleanly, and keeps errors actionable", () => {
    const observe = observePreview();
    const view = render(<WebGLCanvas component="skydome" title="Skydome" scene={scene} />);
    observe(true);
    const canvas = view.container.querySelector("canvas");
    const session = sessions.at(-1)!;
    fireEvent.click(view.getByRole("button", { name: /Pause Skydome|Play Skydome/ }));
    expect(session.setPlaying).toHaveBeenCalled();
    expect(view.container.querySelector("canvas")).toBe(canvas);
    fireEvent.click(view.getByRole("button", { name: "Restart" }));
    expect(session.dispose).toHaveBeenCalledOnce();
    expect(view.container.querySelector("canvas")).not.toBe(canvas);
    act(() => sessions.at(-1)!.options.onError("Texture missing"));
    expect(view.getByRole("alert")).toHaveTextContent("Texture missing");
    expect(view.getByRole("button", { name: "Reload preview" })).toBeVisible();
  });
  it("keeps rendering and navigation local to FlexUI", () => {
    for (const example of WEBGL_COMPONENTS) {
      const source = readFileSync(path.join(root, "components/flexui/" + example.id + ".tsx"), "utf8");
      expect(source).toContain("WebGLCanvas");
      expect(source).not.toMatch(/iframe|oframe.github.io/);
    }
    const docs = readFileSync(path.join(root, "components/docs/webgl-component-doc.tsx"), "utf8");
    expect(docs).not.toMatch(/oframe.github.io|Original live example|upstream source/);
    expect(readFileSync(path.join(root, "public/webgl/ATTRIBUTION.md"), "utf8")).toContain("Nathan Gordon");
  });
});
