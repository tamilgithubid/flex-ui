"use client";

import { cn } from "@/lib/utils";
import { Environment, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import React, { Suspense, useState } from "react";

interface XRSceneProps {
  /** Children (3D objects) */
  children: React.ReactNode;
  /** Enable AR mode button (default: false) */
  enableAR?: boolean;
  /** Enable orbit controls (default: true) */
  enableOrbitControls?: boolean;
  /** Background color (default: transparent) */
  backgroundColor?: string;
  /** Camera position [x, y, z] */
  cameraPosition?: [number, number, number];
  /** Environment preset */
  environment?: "sunset" | "dawn" | "night" | "warehouse" | "forest" | "apartment" | "studio" | "city" | "park" | "lobby";
  /** Additional CSS classes */
  className?: string;
  /** Canvas height */
  height?: string | number;
  /** Fallback when WebXR unavailable */
  fallback?: React.ReactNode;
}

/**
 * XR Scene
 *
 * Base scene wrapper for 3D/AR components using React Three Fiber.
 * Provides camera controls, environment lighting, and optional
 * WebXR AR session support.
 *
 * @example
 * ```tsx
 * <XRScene enableAR cameraPosition={[0, 1, 3]}>
 *   <ARCard position={[0, 1, 0]} />
 * </XRScene>
 * ```
 */
export function XRScene({
  children,
  enableAR = false,
  enableOrbitControls = true,
  backgroundColor = "transparent",
  cameraPosition = [0, 1.5, 3],
  environment = "studio",
  className,
  height = 500,
  fallback,
}: XRSceneProps) {
  const [arSupported, setArSupported] = useState<boolean | null>(null);
  const [arActive, setArActive] = useState(false);

  React.useEffect(() => {
    let active = true;
    if (enableAR && "xr" in navigator) {
      (navigator as Navigator & { xr: { isSessionSupported: (mode: string) => Promise<boolean> } }).xr
        .isSessionSupported("immersive-ar").then(value => { if (active) setArSupported(value); })
        .catch(() => { if (active) setArSupported(false); });
    }
    return () => { active = false; };
  }, [enableAR]);

  return (
    <div
      className={cn("relative overflow-hidden rounded-xl", className)}
      style={{
        height: typeof height === "number" ? `${height}px` : height,
        background: backgroundColor === "transparent" ? "#09090b" : backgroundColor,
      }}
    >
      <Canvas
        camera={{ position: cameraPosition, fov: 50 }}
        style={{ background: backgroundColor }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={fallback ?? null}>
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 5, 5]} intensity={0.8} />
          <Environment preset={environment} />
          {enableOrbitControls && !arActive && (
            <OrbitControls
              enablePan={false}
              enableZoom={true}
              minDistance={1}
              maxDistance={10}
              autoRotate
              autoRotateSpeed={0.5}
            />
          )}
          {children}
        </Suspense>
      </Canvas>

      {/* AR button overlay */}
      {enableAR && arSupported && (
        <button
          onClick={() => setArActive(!arActive)}
          className="absolute bottom-4 right-4 rounded-lg px-4 py-2 text-xs font-bold transition-all duration-200 hover:brightness-110"
          style={{
            background: arActive ? "#34D399" : "#A78BFA",
            color: "#09090b",
            boxShadow: arActive
              ? "0 0 20px rgba(52,211,153,0.3)"
              : "0 0 20px rgba(167,139,250,0.3)",
          }}
        >
          {arActive ? "Exit AR" : "Enter AR"}
        </button>
      )}

      {enableAR && arSupported === false && (
        <div className="absolute bottom-4 right-4 rounded-lg px-3 py-1.5 text-[10px] font-medium"
          style={{ background: "rgba(255,255,255,0.06)", color: "#52525b" }}>
          AR not supported on this device
        </div>
      )}
    </div>
  );
}
