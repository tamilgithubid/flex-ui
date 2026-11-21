"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";
import { createWebGLRuntime } from "./webgl/runtime.js";
import type { WebGLRuntime, WebGLSceneSetup } from "./webgl/types";

export interface WebGLComponentProps {
  height?: CSSProperties["height"];
  className?: string;
  autoPlay?: boolean;
  dpr?: number;
  showControls?: boolean;
  /** Public folder containing assets/, defaults to /webgl. */
  assetPath?: string;
}
interface WebGLCanvasProps extends WebGLComponentProps {
  component: string;
  title: string;
  scene: WebGLSceneSetup;
}
export function WebGLCanvas(props: WebGLCanvasProps) {
  const base = (props.assetPath ?? "/webgl").replace(/\/+$/, "");
  const valid = /^\/(?!\/)/.test(base) || (() => {
    try { const url = new URL(base); return /^https?:$/.test(url.protocol) && !url.username && !url.password && !url.search && !url.hash; }
    catch { return false; }
  })();
  if (!valid) return <p role="alert">Choose a local or HTTP asset folder.</p>;
  return <CanvasSession key={props.component + base + (props.dpr ?? 1.5)} {...props} assetPath={base} />;
}
function CanvasSession({ component, title, scene, height = 480, className, autoPlay = true, dpr = 1.5, showControls = true, assetPath = "/webgl" }: WebGLCanvasProps) {
  const root = useRef<HTMLDivElement>(null);
  const host = useRef<HTMLDivElement>(null);
  const controls = useRef<HTMLDivElement>(null);
  const runtime = useRef<WebGLRuntime | null>(null);
  const reducedMotion = useReducedMotion();
  const [inView, setInView] = useState(false);
  const [playing, setPlaying] = useState(autoPlay);
  const [motionRequested, setMotionRequested] = useState(false);
  const [revision, setRevision] = useState(0);
  const [fullScreen, setFullScreen] = useState(false);
  const [state, setState] = useState<{ status: "loading" | "ready" | "error"; message?: string }>({ status: "loading" });
  const animate = playing && (!reducedMotion || motionRequested);
  const animateRef = useRef(animate);
  const resolution = Number.isFinite(dpr) ? Math.max(0.5, Math.min(2, dpr)) : 1.5;

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    if (typeof IntersectionObserver === "undefined") {
      const id = requestAnimationFrame(() => setInView(true));
      return () => cancelAnimationFrame(id);
    }
    let visible = false;
    const observer = new IntersectionObserver(([entry]) => {
      if (visible === entry.isIntersecting) return;
      visible = entry.isIntersecting;
      setInView(visible);
      if (visible) setState({ status: "loading" });
    }, { rootMargin: "120px 0px" });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    animateRef.current = animate;
    runtime.current?.setPlaying(animate);
  }, [animate]);
  useEffect(() => {
    const update = () => setFullScreen(document.fullscreenElement === root.current);
    document.addEventListener("fullscreenchange", update);
    return () => document.removeEventListener("fullscreenchange", update);
  }, []);
  useEffect(() => {
    if (!inView || !host.current) return;
    let active = true;
    const session = createWebGLRuntime({
      host: host.current, controls: controls.current, dpr: resolution, assetPath, playing: animateRef.current,
      onReady: () => { if (active) setState({ status: "ready" }); },
      onError: message => { if (active) setState({ status: "error", message }); },
    });
    runtime.current = session;
    const timeout = setTimeout(() => {
      if (active) setState(previous => previous.status === "ready" ? previous : { status: "error", message: "Assets took too long to load. Install the component assets, then restart the preview." });
    }, 60000);
    session.start(scene);
    return () => {
      active = false;
      clearTimeout(timeout);
      session.dispose();
      runtime.current = null;
    };
  }, [inView, revision, resolution, assetPath, scene]);
  function restart() { setState({ status: "loading" }); setRevision(value => value + 1); }
  const button = "rounded-md border border-white/10 px-3 py-1.5 text-xs text-zinc-300 transition hover:border-white/25 hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-cyan-400";
  const zoomControl = component === "cube-map" || component === "orbit-controls";
  return <div ref={root} data-webgl-component={component} data-preview-status={inView ? state.status : "offscreen"}
    style={fullScreen ? { display: "flex", flexDirection: "column", height: "100%" } : undefined}
    className={cn("min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-zinc-950", className)}>
    <div className="relative w-full bg-zinc-900" style={fullScreen ? { flex: 1, minHeight: 0 } : { height }}>
      <div ref={host} data-webgl-host className="absolute inset-0 h-full w-full overflow-hidden" />
      {!inView && <div className="absolute inset-0 flex items-center justify-center text-sm text-zinc-500">Interactive preview</div>}
      <div key={revision} ref={controls} className="pointer-events-none absolute right-3 top-3">
        {zoomControl && <label data-zoom-control className="pointer-events-auto flex items-center gap-2 rounded-lg border border-white/15 bg-zinc-950/85 px-3 py-2 text-xs text-zinc-200">
          Zoom
          <select aria-label={title + " zoom style"} defaultValue="dolly" className="rounded bg-zinc-900 px-2 py-1 text-xs">
            <option value="dolly">Dolly</option><option value="fov">Field of view</option>
          </select>
        </label>}
      </div>
      {inView && state.status === "loading" && <div role="status" className="pointer-events-none absolute inset-x-0 bottom-0 bg-zinc-950/80 px-4 py-2 text-xs text-zinc-300">Loading scene and textures…</div>}
      {state.status === "error" && <div role="alert" className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-zinc-950/95 p-6 text-center">
        <p className="max-w-md text-sm text-zinc-300">{state.message}</p>
        <button type="button" className={button} onClick={restart}>Reload preview</button>
      </div>}
    </div>
    {showControls && <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 px-4 py-3">
      <span className="text-xs text-zinc-400">{state.status === "error" ? "Preview unavailable" : animate ? "Live WebGL" : "Animation paused"}</span>
      <div className="flex flex-wrap gap-2">
        <button type="button" className={button} aria-label={(animate ? "Pause " : "Play ") + title} onClick={() => { setMotionRequested(true); setPlaying(!animate); }}>{animate ? "Pause" : "Play"}</button>
        <button type="button" className={button} onClick={restart}>Restart</button>
        <button type="button" className={button} disabled={!inView} onClick={() => { root.current?.requestFullscreen?.().catch(() => {}); }}>Full screen</button>
      </div>
    </div>}
  </div>;
}
