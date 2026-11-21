/* FlexUI lifecycle adapter. OGL scene and shader code remain in examples/. */
(() => {
  const params = new URLSearchParams(location.search);
  const requestedDpr = Number(params.get("dpr") || 1.5);
  window.__FLEXUI_OGL_DPR__ = Number.isFinite(requestedDpr) ? Math.max(0.5, Math.min(2, requestedDpr)) : 1.5;
  const nativeFrame = window.requestAnimationFrame.bind(window);
  const cancelNativeFrame = window.cancelAnimationFrame.bind(window);
  const pending = new Map();
  const contexts = new Set();
  const workers = new Set();
  const images = new Set();
  let sequence = 0;
  let scheduled = null;
  let playing = params.get("autoplay") !== "0";
  let failed = false;
  let rendered = false;
  let clock = 0;
  let lastTime = performance.now();
  let frameCount = 0;
  let drawCount = 0;
  let fetches = 0;
  let ready = false;

  function publish(kind, message) {
    document.documentElement.dataset.oglStatus = kind;
    if (window.parent !== window) window.parent.postMessage({ type: "flexui-ogl", kind, message }, "*");
  }
  function failure(message) {
    if (failed) return;
    failed = true;
    playing = false;
    if (scheduled !== null) cancelNativeFrame(scheduled);
    scheduled = null;
    publish("error", String(message).slice(0, 300));
  }
  function schedule(force = false) {
    if (!failed && scheduled === null && pending.size && !document.hidden && (force || playing)) {
      scheduled = nativeFrame(tick);
    }
  }
  function invalidate() { schedule(true); }
  function tick(now) {
    scheduled = null;
    if (playing) clock += Math.min(100, Math.max(0, now - lastTime));
    lastTime = now;
    rendered = true;
    const callbacks = [...pending.values()];
    pending.clear();
    for (const callback of callbacks) {
      try { callback(clock); } catch (error) { failure(error instanceof Error ? error.message : error); }
    }
    frameCount++;
    document.documentElement.dataset.oglFrameCount = String(frameCount);
    document.documentElement.dataset.oglDrawCount = String(drawCount);
    document.documentElement.dataset.oglPendingAssets = String(fetches + images.size);
    if (!ready && !failed && drawCount > 0 && fetches === 0 && images.size === 0 && document.readyState === "complete") {
      ready = true;
      publish("ready");
    }
    schedule();
  }
  window.requestAnimationFrame = (callback) => {
    const id = ++sequence;
    pending.set(id, callback);
    schedule(!rendered);
    return id;
  };
  window.cancelAnimationFrame = (id) => pending.delete(id);

  const getContext = HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext = function (...args) {
    const context = getContext.apply(this, args);
    if (/^webgl2?$/.test(String(args[0])) && context && !contexts.has(context)) {
      contexts.add(context);
      for (const name of ["drawArrays", "drawElements"]) {
        const original = context[name].bind(context);
        context[name] = (...values) => { drawCount++; return original(...values); };
      }
      this.addEventListener("webglcontextlost", () => failure("The WebGL context was lost. Reload the preview to try again."));
    }
    if (!context && /^webgl2?$/.test(String(args[0]))) {
      queueMicrotask(() => { if (!contexts.size) failure("WebGL is unavailable in this browser. Enable hardware acceleration and reload."); });
    }
    return context;
  };
  const imageSrc = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, "src");
  Object.defineProperty(HTMLImageElement.prototype, "src", {
    ...imageSrc,
    set(value) {
      images.add(this);
      const complete = () => {
        images.delete(this);
        this.removeEventListener("load", complete);
        this.removeEventListener("error", error);
        invalidate();
      };
      const error = () => {
        complete();
        failure("A scene texture could not be loaded. Check that the OGL assets are installed.");
      };
      // OGL's texture images are detached from the DOM and do not bubble events.
      this.addEventListener("load", complete, { once: true });
      this.addEventListener("error", error, { once: true });
      imageSrc.set.call(this, value);
    },
  });
  document.addEventListener("load", (event) => {
    if (event.target instanceof HTMLImageElement) { images.delete(event.target); invalidate(); }
  }, true);
  window.addEventListener("error", (event) => {
    if (event.target instanceof HTMLImageElement) {
      images.delete(event.target);
      failure("A scene texture could not be loaded. Check that the OGL assets are installed.");
    } else if (event.target instanceof HTMLScriptElement || event.target instanceof HTMLLinkElement) {
      failure("An OGL engine or stylesheet file is missing. Reinstall the component and its assets.");
    } else if (event.message) failure(event.message);
  }, true);
  window.addEventListener("unhandledrejection", (event) => failure(event.reason?.message || event.reason || "The scene failed to load."));

  const originalFetch = window.fetch.bind(window);
  window.fetch = (...args) => {
    fetches++;
    let completed = false;
    const finish = () => {
      if (completed) return;
      completed = true;
      fetches--;
      invalidate();
    };
    return originalFetch(...args).then((response) => {
      if (!response.ok) {
        finish();
        failure("A scene asset returned HTTP " + response.status + ". Check that the OGL assets are installed.");
      }
      for (const method of ["json", "arrayBuffer", "blob", "text"]) {
        const original = response[method].bind(response);
        response[method] = (...values) => original(...values).finally(finish);
      }
      return response;
    }, (error) => { finish(); failure(error.message); throw error; });
  };
  if (window.Worker) {
    const NativeWorker = window.Worker;
    window.Worker = class extends NativeWorker {
      constructor(...args) {
        super(...args);
        workers.add(this);
        this.addEventListener("message", () => queueMicrotask(invalidate));
        this.addEventListener("error", () => failure("The texture decoder could not start. Check the local decoder files and WebAssembly support."));
      }
    };
  }
  const originalConsoleError = console.error.bind(console);
  console.error = (...args) => {
    originalConsoleError(...args);
    if (args.some((value) => typeof value === "string" && /shader|program|webgl|compile/i.test(value))) {
      failure("The WebGL shader could not compile on this device.");
    }
  };
  window.addEventListener("message", (event) => {
    if (event.source !== parent || !event.data || event.data.type !== "flexui-ogl-control") return;
    if (typeof event.data.playing === "boolean") {
      playing = event.data.playing;
      lastTime = performance.now();
      if (!playing && scheduled !== null) { cancelNativeFrame(scheduled); scheduled = null; }
      if (playing) schedule();
    }
  });
  document.addEventListener("visibilitychange", () => {
    lastTime = performance.now();
    if (document.hidden && scheduled !== null) { cancelNativeFrame(scheduled); scheduled = null; }
    else schedule();
  });
  window.addEventListener("load", invalidate);
  for (const event of ["pointermove", "wheel", "touchmove", "change", "resize"]) window.addEventListener(event, invalidate, { passive: true });
  window.addEventListener("pagehide", () => {
    if (scheduled !== null) cancelNativeFrame(scheduled);
    pending.clear();
    workers.forEach((worker) => worker.terminate());
    contexts.forEach((context) => context.getExtension("WEBGL_lose_context")?.loseContext());
  }, { once: true });
})();
