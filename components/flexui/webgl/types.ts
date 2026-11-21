export interface WebGLSceneContext {
  // Scene modules use OGL's JavaScript API; this boundary keeps the public React API fully typed.
  ogl: typeof import("ogl");
  window: Window;
  document: Document;
  Image: typeof Image;
  fetch: typeof fetch;
  requestAnimationFrame: typeof requestAnimationFrame;
  performance: Pick<Performance, "now">;
  asset: (path: string) => string;
  beginTask: () => () => void;
  fail: (error: unknown) => void;
}
export type WebGLSceneSetup = (context: WebGLSceneContext) => void;
export interface WebGLRuntimeOptions {
  host: HTMLDivElement;
  controls: HTMLDivElement | null;
  dpr: number;
  assetPath: string;
  playing: boolean;
  onReady: () => void;
  onError: (message: string) => void;
}
export interface WebGLRuntime {
  context: WebGLSceneContext;
  start: (setup: WebGLSceneSetup) => void;
  setPlaying: (playing: boolean) => void;
  dispose: () => void;
}
