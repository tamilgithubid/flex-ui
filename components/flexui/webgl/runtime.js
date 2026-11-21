import * as OGL from "ogl";

/** An isolated rendering session. No global listeners, loader state or animation loops are replaced. */
export function createWebGLRuntime({ host, controls, dpr, assetPath, playing, onReady, onError }) {
  let disposed = false;
  let failed = false;
  let ready = false;
  let pending = 0;
  let idleFrames = 0;
  let budget = 3;
  let frame = 0;
  let frameCount = 0;
  let drawCount = 0;
  let elapsed = 0;
  let previousTime = 0;
  let renderer;
  function registerRenderer(value) { renderer = value; }
  const callbacks = new Map();
  const resizeCallbacks = new Set();
  const cleanups = [];
  const images = new Set();
  const workers = new Set();
  const objectURLs = new Set();
  const abort = new AbortController();
  let callbackId = 0;

  function fail(error) {
    if (disposed || failed || error?.name === "AbortError") return;
    failed = true;
    playing = false;
    cancelAnimationFrame(frame);
    frame = 0;
    onError(error instanceof Error ? error.message : "The WebGL component could not render.");
  }
  function schedule() {
    if (!disposed && !failed && !frame && !document.hidden && callbacks.size && (playing || budget > 0)) {
      frame = requestAnimationFrame(tick);
    }
  }
  function invalidate(frames = 3) {
    idleFrames = 0;
    budget = Math.max(budget, frames);
    schedule();
  }
  function tick(time) {
    frame = 0;
    if (disposed || failed || document.hidden) return;
    const delta = previousTime ? Math.min(50, time - previousTime) : 16.667;
    previousTime = time;
    elapsed += delta;
    budget = Math.max(0, budget - 1);
    const current = [...callbacks.values()];
    callbacks.clear();
    try {
      current.forEach(callback => callback(elapsed));
      host.dataset.webglFrameCount = String(++frameCount);
      host.dataset.webglDrawCount = String(drawCount);
      if (!pending && drawCount > 0 && ++idleFrames >= 2 && !ready) {
        ready = true;
        if (!playing) budget = 0;
        onReady();
      }
    } catch (error) { fail(error); }
    schedule();
  }
  function beginTask() {
    pending++;
    idleFrames = 0;
    let finished = false;
    return () => {
      if (finished) return;
      finished = true;
      pending--;
      invalidate();
    };
  }
  function track(promise) {
    const finish = beginTask();
    return Promise.resolve(promise).finally(finish);
  }
  function listen(target, type, callback, options) {
    target.addEventListener(type, callback, options);
    cleanups.push(() => target.removeEventListener(type, callback, options));
  }
  function localPointer(event) {
    const rect = host.getBoundingClientRect();
    const touch = event.changedTouches?.[0];
    const x = (touch?.clientX ?? event.clientX ?? 0) - rect.left;
    const y = (touch?.clientY ?? event.clientY ?? 0) - rect.top;
    return {
      x, y, clientX: x, clientY: y, pageX: x, pageY: y,
      buttons: event.buttons, target: event.target,
      preventDefault: () => event.preventDefault(),
      stopPropagation: () => event.stopPropagation(),
    };
  }
  function addSceneListener(type, callback, options) {
    if (type === "resize") { resizeCallbacks.add(callback); return; }
    const pointer = type === "mousemove" || type === "touchmove" || type === "touchstart";
    listen(host, type === "mousemove" ? "pointermove" : type, event => {
      if (disposed) return;
      try { callback(pointer ? localPointer(event) : event); invalidate(12); }
      catch (error) { fail(error); }
    }, options);
  }
  const sceneWindow = new Proxy({}, {
    get(_, property) {
      if (property === "innerWidth") return Math.max(1, host.clientWidth);
      if (property === "innerHeight") return Math.max(1, host.clientHeight);
      if (property === "devicePixelRatio") return dpr;
      if (property === "addEventListener") return addSceneListener;
      return undefined;
    },
    // Pointer events handle mouse, pen and touch within this component.
    has: () => false,
  });
  const sceneDocument = {
    body: host,
    addEventListener: addSceneListener,
    querySelector: selector => selector === "#dropdown" ? controls?.querySelector("[data-zoom-control]") : host.querySelector(selector),
  };

  class SceneImage extends Image {
    constructor(...args) {
      super(...args);
      images.add(this);
      this.finishTask = null;
      this.addEventListener("load", () => { this.finishTask?.(); });
      this.addEventListener("error", () => {
        this.finishTask?.();
        fail(new Error("A component texture could not load. Run the WebGL asset installer and restart the preview."));
      });
    }
    set src(value) {
      this.finishTask?.();
      if (disposed) return;
      this.finishTask = beginTask();
      super.src = value;
    }
    get src() { return super.src; }
  }
  async function sceneFetch(input, options = {}) {
    const response = await fetch(input, { ...options, signal: abort.signal });
    if (!response.ok) throw new Error("Could not load a component asset (HTTP " + response.status + ").");
    return new Proxy(response, {
      get(target, property) {
        const value = Reflect.get(target, property, target);
        if (typeof value !== "function") return value;
        if (!["json", "text", "arrayBuffer", "blob"].includes(property)) return value.bind(target);
        return async (...args) => {
          const result = await value.apply(target, args);
          if (disposed) throw new DOMException("Component disposed", "AbortError");
          return result;
        };
      },
    });
  }
  class SceneRenderer extends OGL.Renderer {
    constructor(options) {
      super({ ...options, dpr, preserveDrawingBuffer: true, powerPreference: "low-power" });
      registerRenderer(this);
      if (!this.gl) throw new Error("WebGL is unavailable in this browser.");
      this.gl.canvas.style.cssText += ";display:block;width:100%;height:100%;touch-action:none";
      this.gl.canvas.setAttribute("aria-label", "Interactive WebGL canvas");
      listen(this.gl.canvas, "webglcontextlost", event => {
        event.preventDefault();
        fail(new Error("The graphics context was lost. Restart this preview to reconnect."));
      });
    }
    render(options) {
      if (disposed) return;
      super.render(options);
      drawCount++;
    }
  }
  class SceneOrbit extends OGL.Orbit {
    constructor(camera, options) {
      super(camera, { ...options, element: renderer.gl.canvas });
      cleanups.push(() => this.remove());
    }
  }
  class SceneTextureLoader {
    static load(gl, options) {
      const texture = new OGL.Texture(gl, options);
      const image = new SceneImage();
      texture.loaded = new Promise((resolve, reject) => {
        image.onload = () => {
          if (!gl.renderer.isWebgl2 && (!Number.isInteger(Math.log2(image.width)) || !Number.isInteger(Math.log2(image.height)))) {
            texture.generateMipmaps = false;
            texture.minFilter = gl.LINEAR;
            texture.wrapS = texture.wrapT = gl.CLAMP_TO_EDGE;
          }
          texture.image = image;
          resolve(image);
        };
        image.onerror = () => reject(new Error("Could not load a material texture."));
      });
      texture.loaded.catch(fail);
      image.src = options.src;
      return texture;
    }
  }
  class SceneBasisManager extends OGL.BasisManager {
    constructor(src) { super(src, renderer.gl); }
    initWorker(src) {
      super.initWorker(src);
      workers.add(this.worker);
      listen(this.worker, "error", () => fail(new Error("The texture decoder could not start.")));
      cleanups.push(() => { this.queue.clear(); });
    }
    onMessage(event) {
      if (event.data.error) { fail(new Error("Texture decoding failed: " + event.data.error)); return; }
      super.onMessage(event);
    }
  }
  // A subclass per component keeps decoder state separate when several models are on screen.
  class SceneGLTFLoader extends OGL.GLTFLoader {
    static async parseDesc(src) {
      const data = await (await sceneFetch(src)).arrayBuffer();
      const decoder = new TextDecoder();
      return decoder.decode(new Uint8Array(data, 0, 4)) === "glTF" ? this.unpackGLB(data) : JSON.parse(decoder.decode(data));
    }
    static loadBuffers(desc, dir) {
      if (!desc.buffers) return null;
      return Promise.all(desc.buffers.map(buffer => buffer.binary ||
        sceneFetch(this.resolveURI(buffer.uri, dir)).then(response => response.arrayBuffer())));
    }
    static parseImages(gl, desc, dir, bufferViews) {
      if (!desc.images) return null;
      return Promise.all(desc.images.map(async ({ uri, bufferView, mimeType, name }) => {
        if (mimeType === "image/ktx2") return track(this.basisManager.parseTexture(bufferViews[bufferView].data));
        const image = new SceneImage();
        image.name = name;
        image.ready = new Promise((resolve, reject) => {
          image.onload = resolve;
          image.onerror = () => reject(new Error("Could not load a model texture."));
        });
        image.ready.catch(fail);
        if (uri) image.src = this.resolveURI(uri, dir);
        else {
          const blob = new Blob([bufferViews[bufferView].data], { type: mimeType });
          const url = URL.createObjectURL(blob);
          objectURLs.add(url);
          image.src = url;
        }
        return image;
      }));
    }
  }
  const context = {
    ogl: { ...OGL, Renderer: SceneRenderer, Orbit: SceneOrbit, TextureLoader: SceneTextureLoader, GLTFLoader: SceneGLTFLoader, BasisManager: SceneBasisManager },
    window: sceneWindow, document: sceneDocument, Image: SceneImage, fetch: sceneFetch,
    requestAnimationFrame(callback) { callbacks.set(++callbackId, callback); schedule(); return callbackId; },
    performance: { now: () => elapsed },
    asset(name) {
      if (!/^assets\/[\w./-]+$/.test(name) || name.split("/").includes("..")) throw new Error("Invalid component asset path");
      return assetPath + "/" + name;
    },
    beginTask, fail,
  };
  const resize = new ResizeObserver(() => {
    if (disposed) return;
    try { resizeCallbacks.forEach(callback => callback()); invalidate(); }
    catch (error) { fail(error); }
  });
  resize.observe(host);
  cleanups.push(() => resize.disconnect());
  listen(document, "visibilitychange", () => {
    cancelAnimationFrame(frame);
    frame = 0;
    previousTime = 0;
    if (!document.hidden) invalidate();
  });
  for (const event of ["pointerdown", "pointermove", "pointerup", "wheel", "change"]) {
    listen(host, event, () => invalidate(12), { passive: true });
  }
  if (controls) listen(controls, "change", () => invalidate(12));
  host.dataset.webglFrameCount = "0";
  host.dataset.webglDrawCount = "0";

  return {
    context,
    start(setup) {
      try { setup(context); invalidate(); }
      catch (error) { fail(error); }
    },
    setPlaying(value) {
      playing = value;
      previousTime = 0;
      if (!value && ready) { budget = 0; cancelAnimationFrame(frame); frame = 0; }
      schedule();
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      abort.abort();
      cancelAnimationFrame(frame);
      callbacks.clear();
      resizeCallbacks.clear();
      cleanups.forEach(cleanup => cleanup());
      workers.forEach(worker => worker.terminate());
      images.forEach(image => { image.onload = image.onerror = null; image.removeAttribute("src"); });
      objectURLs.forEach(url => URL.revokeObjectURL(url));
      renderer?.gl.getExtension("WEBGL_lose_context")?.loseContext();
      host.replaceChildren();
    },
  };
}
