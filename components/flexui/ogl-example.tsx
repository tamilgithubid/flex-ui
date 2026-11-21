"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { getOGLExample, type OGLExampleId } from "@/lib/ogl-examples";
import { cn } from "@/lib/utils";

export interface OGLSceneProps {
  height?: CSSProperties["height"];
  className?: string;
  autoPlay?: boolean;
  dpr?: number;
  showControls?: boolean;
  /** Folder containing the installed examples, engine modules and scene assets. */
  basePath?: string;
}
export interface OGLExampleProps extends OGLSceneProps { example: OGLExampleId }

export function OGLExample(props: OGLExampleProps) {
  const definition = getOGLExample(props.example);
  const base = (props.basePath ?? "/ogl").replace(/\/+$/, "");
  const validBase = /^\/(?!\/)/.test(base) || (() => {
    try { const url = new URL(base); return /^https?:$/.test(url.protocol) && !url.username && !url.password && !url.search && !url.hash; }
    catch { return false; }
  })();
  if (!definition || !validBase) return <p role="alert">Choose a valid OGL example and an HTTP or local asset folder.</p>;
  return <OGLFrame key={props.example + base + (props.dpr ?? 1.5)} {...props} basePath={base} />;
}

function OGLFrame({
  example, height = 480, className, autoPlay = true, dpr = 1.5, showControls = true, basePath = "/ogl",
}: OGLExampleProps) {
  const definition = getOGLExample(example)!;
  const root = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const reducedMotion = useReducedMotion();
  const [inView, setInView] = useState(false);
  const [playing, setPlaying] = useState(autoPlay);
  const [motionRequested, setMotionRequested] = useState(false);
  const [revision, setRevision] = useState(0);
  const [state, setState] = useState<{ status: "loading" | "ready" | "error"; message?: string }>({ status: "loading" });
  const animate = playing && (!reducedMotion || motionRequested);
  const resolution = Number.isFinite(dpr) ? Math.max(0.5, Math.min(2, dpr)) : 1.5;
  // A first frame can render while assets load. Playback starts after the bridge is ready.
  const source = basePath + "/examples/" + example + ".html?dpr=" + resolution + "&autoplay=0";

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
      if (visible) setState({ status: "loading" });
      setInView(visible);
    }, { rootMargin: "120px 0px" });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const sendControl = useCallback(() => {
    const origin = new URL(source, window.location.href).origin;
    frame.current?.contentWindow?.postMessage({ type: "flexui-ogl-control", playing: animate }, origin);
  }, [animate, source]);
  useEffect(() => { if (inView) sendControl(); }, [inView, sendControl, revision]);
  useEffect(() => {
    if (!inView) return;
    const timer = setTimeout(() => setState(previous => previous.status === "ready" ? previous : {
      status: "error", message: "The scene is taking too long to load. Check that its OGL assets are installed, then reload the preview.",
    }), 60000);
    return () => clearTimeout(timer);
  }, [inView, revision]);
  useEffect(() => {
    function receive(event: MessageEvent) {
      if (event.source !== frame.current?.contentWindow || event.origin !== new URL(source, window.location.href).origin) return;
      const data: unknown = event.data;
      if (!data || typeof data !== "object" || !("type" in data) || data.type !== "flexui-ogl" || !("kind" in data)) return;
      if (data.kind === "ready") setState({ status: "ready" });
      if (data.kind === "error") setState({ status: "error", message: "message" in data && typeof data.message === "string" ? data.message : "The WebGL preview could not load." });
    }
    window.addEventListener("message", receive);
    return () => window.removeEventListener("message", receive);
  }, [source]);

  function restart() {
    setState({ status: "loading" });
    setRevision(previous => previous + 1);
  }
  const button = "rounded-md border border-white/10 px-3 py-1.5 text-xs text-zinc-300 transition hover:border-white/25 hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-cyan-400";
  return (
    <div ref={root} data-ogl-example={example} data-preview-status={inView ? state.status : "offscreen"} className={cn("min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-zinc-950", className)}>
      <div className="relative w-full bg-zinc-900" style={{ height }}>
        {inView ? <iframe
          key={revision}
          ref={frame}
          title={definition.title + " — live OGL preview"}
          src={source}
          onLoad={sendControl}
          loading="lazy"
          allowFullScreen
          sandbox="allow-scripts allow-same-origin allow-pointer-lock allow-popups"
          referrerPolicy="strict-origin-when-cross-origin"
          className="absolute inset-0 h-full w-full border-0"
        /> : <div className="flex h-full items-center justify-center text-sm text-zinc-500">Live OGL preview</div>}
        {inView && state.status === "loading" && <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-zinc-950/80 px-4 py-2 text-xs text-zinc-300" role="status">Loading scene and textures…</div>}
        {state.status === "error" && <div role="alert" className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-zinc-950/95 p-6 text-center">
          <p className="max-w-md text-sm text-zinc-300">{state.message}</p>
          <button type="button" className={button} onClick={restart}>Reload preview</button>
        </div>}
      </div>
      {showControls && <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 px-4 py-3">
        <span className="text-xs text-zinc-400">{state.status === "error" ? "Preview unavailable" : animate ? "Live WebGL" : "Animation paused"}</span>
        <div className="flex flex-wrap gap-2">
          <button type="button" className={button} aria-label={animate ? "Pause " + definition.title : "Play " + definition.title} onClick={() => { setMotionRequested(true); setPlaying(!animate); }}>{animate ? "Pause" : "Play"}</button>
          <button type="button" className={button} onClick={restart}>Restart</button>
          <button type="button" className={button} disabled={!inView} onClick={() => { frame.current?.requestFullscreen?.().catch(() => {}); }}>Full screen</button>
        </div>
      </div>}
    </div>
  );
}
