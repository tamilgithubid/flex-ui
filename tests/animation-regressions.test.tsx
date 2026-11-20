import { RotatingText } from "@/components/flexui/rotating-text";
import { Skull3D } from "@/components/flexui/skull-3d";
import { ThreeHoverCard } from "@/components/flexui/three-hover-card";
import { editorialAssets } from "@/lib/editorial-assets";
import { act, cleanup, fireEvent, render } from "@testing-library/react";
import { readFileSync } from "node:fs";
import path from "node:path";
import { Profiler } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const originalMedia = Object.getOwnPropertyDescriptor(window, "matchMedia")!;
beforeEach(() => {
  Object.defineProperty(window, "matchMedia", { configurable: true, writable: true, value: vi.fn(query => ({
    matches: false, media: query, onchange: null, addEventListener() {}, removeEventListener() {},
    addListener() {}, removeListener() {}, dispatchEvent: () => true,
  })) });
});
afterEach(() => { Object.defineProperty(window, "matchMedia", originalMedia); cleanup(); vi.useRealTimers(); vi.restoreAllMocks(); vi.unstubAllGlobals(); });

describe("animation and artwork regressions", () => {
  it("paints the rotating gradient only on the active word, never on the sizing slot", () => {
    const gradient = "bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent text-4xl";
    const view = render(<RotatingText words={["Cinematic", "Beautiful", "Magnetic"]} className={gradient} />);
    const slot = view.container.querySelector("[data-rotating-slot]")!;
    expect(slot.className).not.toContain("bg-clip-text");
    expect(slot.className).not.toContain("bg-gradient");
    expect(slot.querySelectorAll("[data-rotating-word]")).toHaveLength(1);
    expect(slot.querySelector("[data-rotating-word]")).toHaveClass("bg-clip-text", "text-4xl");
    slot.querySelectorAll("[data-rotating-measure]").forEach(measure => {
      expect(measure).toHaveStyle({ visibility: "hidden", opacity: "0" });
      expect(measure).toHaveAttribute("aria-hidden", "true");
      expect(measure).toHaveClass("text-4xl");
    });
  });

  it("does not rerender the hover card on every pointer movement", () => {
    vi.stubGlobal("PointerEvent", class extends MouseEvent { pointerType = "mouse"; });
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({
      x: 0, y: 0, left: 0, top: 0, right: 400, bottom: 500, width: 400, height: 500, toJSON() {},
    });
    const commit = vi.fn();
    const view = render(<Profiler id="hover" onRender={commit}><ThreeHoverCard /></Profiler>);
    const card = view.container.querySelector("[data-three-hover-card]")!;
    fireEvent.pointerEnter(card);
    const afterEnter = commit.mock.calls.length;
    expect(afterEnter).toBeGreaterThan(0);
    for (let x = 0; x < 400; x += 20) fireEvent.pointerMove(card, { clientX: x, clientY: 250 });
    expect(commit).toHaveBeenCalledTimes(afterEnter);
    expect(view.container.querySelector("img")).toHaveStyle({ objectFit: "cover" });
  });

  it("keeps rotating text still when reduced motion is requested and handles empty words", async () => {
    vi.useFakeTimers();
    vi.spyOn(window, "matchMedia").mockImplementation(query => ({
      matches: true, media: query, onchange: null, addEventListener() {}, removeEventListener() {},
      addListener() {}, removeListener() {}, dispatchEvent: () => true,
    }));
    const view = render(<RotatingText words={["Cinematic", "Beautiful"]} duration={600} />);
    await act(async () => { await vi.advanceTimersByTimeAsync(5000); });
    expect(view.container.querySelector("[data-rotating-word]")).toHaveTextContent("Cinematic");
    view.rerender(<RotatingText words={[]} />);
    expect(view.container).toBeEmptyDOMElement();
  });

  it("ships an optimized local image for every editorial cover", () => {
    for (const asset of Object.values(editorialAssets)) {
      const image = readFileSync(path.resolve(__dirname, "../public" + asset.src));
      expect(image.subarray(0, 4).toString()).toBe("RIFF");
      expect(image.subarray(8, 12).toString()).toBe("WEBP");
      expect(image.length).toBeLessThan(350000);
      expect(asset.alt.length).toBeGreaterThan(20);
    }
  });
});

function mockRenderer(initiallyVisible = true) {
  let sequence = 0;
  const frames = new Map<number, FrameRequestCallback>();
  vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => { frames.set(++sequence, callback); return sequence; });
  vi.stubGlobal("cancelAnimationFrame", (id: number) => frames.delete(id));
  let visibility: IntersectionObserverCallback;
  vi.stubGlobal("IntersectionObserver", class {
    constructor(callback: IntersectionObserverCallback) { visibility = callback; }
    observe() { visibility([{ isIntersecting: initiallyVisible } as IntersectionObserverEntry], this as unknown as IntersectionObserver); }
    disconnect() {}
  });
  vi.spyOn(HTMLCanvasElement.prototype, "getBoundingClientRect").mockReturnValue({
    x: 0, y: 0, left: 0, top: 0, right: 1600, bottom: 900, width: 1600, height: 900, toJSON() {},
  });
  const gpu = {
    createShader: vi.fn(() => ({})), shaderSource: vi.fn(), compileShader: vi.fn(), getShaderParameter: vi.fn(() => true),
    createProgram: vi.fn(() => ({})), attachShader: vi.fn(), linkProgram: vi.fn(), getProgramParameter: vi.fn(() => true), useProgram: vi.fn(),
    createBuffer: vi.fn(() => ({})), bindBuffer: vi.fn(), bufferData: vi.fn(), getAttribLocation: vi.fn(() => 0),
    enableVertexAttribArray: vi.fn(), vertexAttribPointer: vi.fn(), getUniformLocation: vi.fn((_, name: string) => name),
    viewport: vi.fn(), uniform1f: vi.fn(), uniform1i: vi.fn(), uniform2f: vi.fn(), uniform3fv: vi.fn(), drawArrays: vi.fn(),
    deleteBuffer: vi.fn(), deleteProgram: vi.fn(), deleteShader: vi.fn(),
  };
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(gpu as unknown as WebGLRenderingContext);
  const step = (time: number) => act(() => { const pending = [...frames.values()]; frames.clear(); pending.forEach(callback => callback(time)); });
  return { gpu, step, show: () => act(() => visibility([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver)), hide: () => act(() => visibility([{ isIntersecting: false } as IntersectionObserverEntry], {} as IntersectionObserver)) };
}

describe("skull renderer lifecycle", () => {
  it("keeps a zero-speed solid skull still without a continuous render loop", () => {
    const { gpu, step } = mockRenderer();
    render(<Skull3D rotateSpeed={0} />);
    step(0); step(16);
    expect(gpu.drawArrays).toHaveBeenCalledOnce();
    step(32); step(48);
    expect(gpu.drawArrays).toHaveBeenCalledOnce();
    expect(gpu.uniform2f).toHaveBeenCalledWith("uRotation", 0, 0);
  });

  it("does not allocate a GPU program for a preview below the viewport", () => {
    const { gpu, step, show } = mockRenderer(false);
    render(<Skull3D />);
    step(0);
    expect(gpu.createProgram).not.toHaveBeenCalled();
    show();
    step(16);
    expect(gpu.createProgram).toHaveBeenCalledOnce();
  });

  it("bounds its drawing buffer, updates props without recompiling, and releases GPU resources", () => {
    const { gpu, step } = mockRenderer();
    const view = render(<Skull3D />);
    step(0); step(16);
    const canvas = view.container.querySelector("canvas")!;
    expect(canvas.width * canvas.height).toBeLessThanOrEqual(240000);
    expect(gpu.createProgram).toHaveBeenCalledOnce();
    view.rerender(<Skull3D mode="hologram" glowColor="#34D399" />);
    step(32);
    expect(gpu.createProgram).toHaveBeenCalledOnce();
    expect(gpu.compileShader).toHaveBeenCalledTimes(2);
    expect(gpu.uniform1i).toHaveBeenLastCalledWith("uMode", 3);
    view.unmount();
    expect(gpu.deleteBuffer).toHaveBeenCalledOnce();
    expect(gpu.deleteProgram).toHaveBeenCalledOnce();
    expect(gpu.deleteShader).toHaveBeenCalledTimes(2);
  });

  it("eases pointer targets over frames and pauses rendering outside the viewport", () => {
    const { gpu, step, hide } = mockRenderer();
    const view = render(<Skull3D rotateSpeed={0} />);
    step(0); step(16);
    const canvas = view.container.querySelector("canvas")!;
    canvas.dispatchEvent(new MouseEvent("pointermove", { clientX: 1600, clientY: 450 }));
    step(32);
    const rotation = gpu.uniform2f.mock.calls.findLast(call => call[0] === "uRotation")!;
    expect(rotation[1]).toBeGreaterThan(0);
    expect(rotation[1]).toBeLessThan(0.45);
    hide();
    const draws = gpu.drawArrays.mock.calls.length;
    step(48); step(64);
    expect(gpu.drawArrays).toHaveBeenCalledTimes(draws);
  });
});
