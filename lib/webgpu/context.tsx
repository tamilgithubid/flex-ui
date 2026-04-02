"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface WebGPUContextValue {
  /** Whether WebGPU is supported in this browser */
  supported: boolean;
  /** Whether WebGPU has been initialized */
  initialized: boolean;
  /** The GPU adapter (null if not supported) */
  adapter: GPUAdapter | null;
  /** The GPU device (null if not initialized) */
  device: GPUDevice | null;
  /** Error message if initialization failed */
  error: string | null;
}

const WebGPUContext = createContext<WebGPUContextValue>({
  supported: false,
  initialized: false,
  adapter: null,
  device: null,
  error: null,
});

export function useWebGPU() {
  return useContext(WebGPUContext);
}

/**
 * WebGPU Context Provider
 *
 * Initializes WebGPU adapter and device. Falls back gracefully
 * if WebGPU is not supported (older browsers, Firefox, etc.).
 *
 * Usage:
 * ```tsx
 * <WebGPUProvider>
 *   <GPUParticleField />
 * </WebGPUProvider>
 * ```
 */
export function WebGPUProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<WebGPUContextValue>({
    supported: false,
    initialized: false,
    adapter: null,
    device: null,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    async function init() {
      // Check if WebGPU is available
      if (!navigator.gpu) {
        setState((prev) => ({
          ...prev,
          supported: false,
          error: "WebGPU is not supported in this browser. Try Chrome 113+, Edge 113+, or Safari 18+.",
        }));
        return;
      }

      try {
        const adapter = await navigator.gpu.requestAdapter({
          powerPreference: "high-performance",
        });

        if (!adapter || cancelled) {
          setState((prev) => ({
            ...prev,
            supported: true,
            error: "No suitable GPU adapter found.",
          }));
          return;
        }

        const device = await adapter.requestDevice({
          requiredFeatures: [],
          requiredLimits: {
            maxStorageBufferBindingSize: adapter.limits.maxStorageBufferBindingSize,
            maxComputeWorkgroupSizeX: 256,
          },
        });

        if (cancelled) {
          device.destroy();
          return;
        }

        // Handle device loss
        device.lost.then((info) => {
          console.warn("WebGPU device lost:", info.message);
          if (info.reason !== "destroyed") {
            // Re-initialize
            init();
          }
        });

        setState({
          supported: true,
          initialized: true,
          adapter,
          device,
          error: null,
        });
      } catch (err) {
        if (!cancelled) {
          setState((prev) => ({
            ...prev,
            supported: true,
            error: `WebGPU initialization failed: ${err instanceof Error ? err.message : "Unknown error"}`,
          }));
        }
      }
    }

    init();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <WebGPUContext.Provider value={state}>{children}</WebGPUContext.Provider>
  );
}

/**
 * Check if WebGPU is available without initializing.
 * Useful for progressive enhancement decisions.
 */
export function isWebGPUSupported(): boolean {
  return typeof navigator !== "undefined" && "gpu" in navigator;
}
