"use client";

import React, { useState, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { XRScene } from "@/components/flexui/xr-scene";
import { PreviewCodeTabs } from "@/components/docs/preview-code-tabs";
import { PropsConfigurator } from "@/components/docs/props-configurator";
import { FullscreenPreview } from "@/components/docs/fullscreen-preview";
import * as THREE from "three";

/* ── Ultra 3D Demo Scene ─────────────────────────────────────────────────── */

function FloatingIcosahedron({ color = "#A78BFA" }: { color?: string }) {
  const ref = useRef<THREE.Mesh>(null);
  const wireRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ref.current) {
      ref.current.rotation.y = t * 0.3;
      ref.current.rotation.x = Math.sin(t * 0.4) * 0.2;
      ref.current.position.y = 0.6 + Math.sin(t * 0.8) * 0.15;
    }
    if (wireRef.current) {
      wireRef.current.rotation.y = -t * 0.15;
      wireRef.current.rotation.z = t * 0.1;
      wireRef.current.position.y = 0.6 + Math.sin(t * 0.8) * 0.15;
    }
  });
  return (
    <group>
      {/* Solid core */}
      <mesh ref={ref}>
        <icosahedronGeometry args={[0.55, 1]} />
        <meshPhysicalMaterial
          color={color}
          metalness={0.6}
          roughness={0.1}
          emissive={new THREE.Color(color)}
          emissiveIntensity={0.15}
          transparent
          opacity={0.8}
        />
      </mesh>
      {/* Wireframe shell */}
      <mesh ref={wireRef}>
        <icosahedronGeometry args={[0.85, 2]} />
        <meshBasicMaterial color={color} wireframe transparent opacity={0.12} />
      </mesh>
    </group>
  );
}

function OrbitingRing({ color = "#A78BFA", radius = 1.3, speed = 0.5 }: { color?: string; radius?: number; speed?: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = Math.PI / 2 + Math.sin(state.clock.elapsedTime * speed) * 0.3;
      ref.current.rotation.z = state.clock.elapsedTime * speed * 0.5;
    }
  });
  return (
    <mesh ref={ref} position={[0, 0.6, 0]}>
      <torusGeometry args={[radius, 0.006, 16, 100]} />
      <meshBasicMaterial color={color} transparent opacity={0.25} />
    </mesh>
  );
}

function ParticleDust({ count = 80, color = "#A78BFA" }: { count?: number; color?: string }) {
  const ref = useRef<THREE.Points>(null);

  React.useEffect(() => {
    if (!ref.current) return;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 4;
      pos[i * 3 + 1] = Math.random() * 2.5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    ref.current.geometry = geo;
  }, [count]);

  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = state.clock.elapsedTime * 0.02;
  });

  return (
    <points ref={ref}>
      <bufferGeometry />
      <pointsMaterial color={color} size={0.015} transparent opacity={0.4} sizeAttenuation />
    </points>
  );
}

function GroundGrid() {
  return (
    <group position={[0, -0.3, 0]}>
      <gridHelper args={[8, 24, "#A78BFA", "#A78BFA"]} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial color="#09090b" transparent opacity={0.95} />
      </mesh>
    </group>
  );
}

function AdvancedDemoScene() {
  return (
    <group>
      <FloatingIcosahedron />
      <OrbitingRing radius={1.2} speed={0.4} />
      <OrbitingRing radius={1.6} speed={-0.25} color="#818CF8" />
      <ParticleDust count={120} />
      <GroundGrid />
    </group>
  );
}

/* ── Props ─────────────────────────────────────────────────────────────── */

const propDefs = [
  {
    name: "environment",
    label: "Environment",
    control: { type: "select" as const, options: ["studio", "sunset", "dawn", "night", "forest", "city"] },
    defaultValue: "studio",
  },
  {
    name: "enableOrbitControls",
    label: "Orbit Controls",
    control: { type: "boolean" as const },
    defaultValue: true,
  },
  {
    name: "enableAR",
    label: "Enable AR",
    control: { type: "boolean" as const },
    defaultValue: false,
  },
];

function generateCode(values: Record<string, string | number | boolean>) {
  const props: string[] = [];
  if (values.enableAR) props.push("enableAR");
  if (values.enableOrbitControls === false) props.push("enableOrbitControls={false}");
  props.push(`environment="${values.environment}"`);
  props.push("height={480}");
  const propsStr = `\n  ${props.join("\n  ")}\n`;
  return `import { XRScene } from "@/components/flexui/xr-scene";

function FloatingIcosahedron() {
  // Animated icosahedron with wireframe shell + orbiting rings
  return (
    <group>
      <mesh>
        <icosahedronGeometry args={[0.55, 1]} />
        <meshPhysicalMaterial color="#A78BFA" metalness={0.6} roughness={0.1} />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[0.85, 2]} />
        <meshBasicMaterial color="#A78BFA" wireframe transparent opacity={0.12} />
      </mesh>
    </group>
  );
}

export function Demo() {
  return (
    <XRScene${propsStr}>
      <FloatingIcosahedron />
      {/* Add orbiting rings, particle dust, ground grid */}
    </XRScene>
  );
}`;
}

export function XRScenePlayground() {
  const [values, setValues] = useState<Record<string, string | number | boolean>>({
    environment: "studio",
    enableOrbitControls: true,
    enableAR: false,
  });

  return (
    <div className="space-y-4">
      <PreviewCodeTabs
        preview={
          <div className="relative overflow-hidden rounded-2xl" style={{ background: "#09090b" }}>
            <XRScene
              environment={values.environment as "studio" | "sunset" | "dawn" | "night" | "forest" | "city"}
              enableOrbitControls={values.enableOrbitControls as boolean}
              enableAR={values.enableAR as boolean}
              height={480}
              cameraPosition={[0, 1.2, 3.5]}
            >
              <AdvancedDemoScene />
            </XRScene>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-end pb-6">
              <p className="rounded-full bg-black/40 px-4 py-1.5 text-[10px] font-medium uppercase tracking-widest text-white/30 backdrop-blur">
                Drag to orbit &middot; Scroll to zoom
              </p>
            </div>
          </div>
        }
        code={generateCode(values)}
        filename="xr-scene-demo.tsx"
      />
      <div className="flex flex-wrap items-center gap-3">
        <PropsConfigurator propDefs={propDefs} values={values} onChange={(n, v) => setValues((p) => ({ ...p, [n]: v }))} />
        <FullscreenPreview title="XR Scene" badge="Spatial" badgeColor="bg-emerald-500/10 text-emerald-400 border-emerald-500/20" accentColor="#34D399">
          {() => (
            <XRScene environment="sunset" enableOrbitControls height={typeof window !== "undefined" ? window.innerHeight - 120 : 800} cameraPosition={[0, 1.2, 3.5]}>
              <AdvancedDemoScene />
            </XRScene>
          )}
        </FullscreenPreview>
      </div>
    </div>
  );
}
