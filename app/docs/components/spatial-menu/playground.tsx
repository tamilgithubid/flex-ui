"use client";

import React, { useState, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { XRScene } from "@/components/flexui/xr-scene";
import { SpatialMenu } from "@/components/flexui/spatial-menu";
import { PreviewCodeTabs } from "@/components/docs/preview-code-tabs";
import { PropsConfigurator } from "@/components/docs/props-configurator";
import * as THREE from "three";

/* ── Background 3D scene for spatial context ─────────────────────────────── */

function DustParticles({ color = "#A78BFA", count = 60 }: { color?: string; count?: number }) {
  const ref = useRef<THREE.Points>(null);
  React.useEffect(() => {
    if (!ref.current) return;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 5;
      pos[i * 3 + 1] = Math.random() * 3 - 0.5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 5;
    }
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    ref.current.geometry = geo;
  }, [count]);
  useFrame((s) => { if (ref.current) ref.current.rotation.y = s.clock.elapsedTime * 0.01; });
  return (
    <points ref={ref}>
      <bufferGeometry />
      <pointsMaterial color={color} size={0.012} transparent opacity={0.3} sizeAttenuation />
    </points>
  );
}

function BackgroundScene() {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((s) => {
    const t = s.clock.elapsedTime;
    if (ringRef.current) { ringRef.current.rotation.x = Math.PI / 2 + Math.sin(t * 0.3) * 0.1; ringRef.current.rotation.z = t * 0.05; }
  });

  return (
    <group>
      <mesh ref={ringRef} position={[0, 0.3, 0]}>
        <torusGeometry args={[2.2, 0.004, 16, 100]} />
        <meshBasicMaterial color="#A78BFA" transparent opacity={0.08} />
      </mesh>
      <group position={[0, -1, 0]}>
        <gridHelper args={[8, 24, "#A78BFA", "#A78BFA"]} />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
          <planeGeometry args={[8, 8]} />
          <meshStandardMaterial color="#09090b" transparent opacity={0.95} />
        </mesh>
      </group>
      <DustParticles />
    </group>
  );
}

const menuItems = [
  { label: "Components", icon: "📦" },
  { label: "Themes", icon: "🎨" },
  { label: "Docs", icon: "📖" },
  { label: "Studio", icon: "✨" },
  { label: "Settings", icon: "⚙️" },
];

const propDefs = [
  { name: "layout", label: "Layout", control: { type: "select" as const, options: ["horizontal", "vertical", "radial"] }, defaultValue: "radial" },
  { name: "spacing", label: "Spacing", control: { type: "select" as const, options: ["0.4", "0.6", "0.8", "1.0", "1.2"] }, defaultValue: "0.8" },
  { name: "itemSize", label: "Item Size", control: { type: "select" as const, options: ["0.4", "0.5", "0.6", "0.7"] }, defaultValue: "0.5" },
  { name: "floating", label: "Floating", control: { type: "boolean" as const }, defaultValue: true },
];

function generateCode(values: Record<string, string | number | boolean>) {
  const props: string[] = ["items={menuItems}"];
  if (values.layout !== "horizontal") props.push(`layout="${values.layout}"`);
  if (values.spacing !== "0.6") props.push(`spacing={${values.spacing}}`);
  if (values.itemSize !== "0.5") props.push(`itemSize={${values.itemSize}}`);
  if (!values.floating) props.push("floating={false}");
  const propsStr = `\n      ${props.join("\n      ")}\n    `;
  return `import { XRScene } from "@/components/flexui/xr-scene";
import { SpatialMenu } from "@/components/flexui/spatial-menu";

const menuItems = [
  { label: "Components", icon: "📦" },
  { label: "Themes", icon: "🎨" },
  { label: "Docs", icon: "📖" },
  { label: "Studio", icon: "✨" },
  { label: "Settings", icon: "⚙️" },
];

export function Demo() {
  return (
    <XRScene height={480} cameraPosition={[0, 0.5, 3]}>
      <SpatialMenu${propsStr}/>
    </XRScene>
  );
}`;
}

export function SpatialMenuPlayground() {
  const [values, setValues] = useState<Record<string, string | number | boolean>>({
    layout: "radial", spacing: "0.8", itemSize: "0.5", floating: true,
  });

  return (
    <div className="space-y-4">
      <PreviewCodeTabs
        preview={
          <div className="relative overflow-hidden rounded-2xl" style={{ background: "#09090b" }}>
            <XRScene height={480} enableOrbitControls cameraPosition={[0, 0.5, 3.5]}>
              <BackgroundScene />
              <SpatialMenu
                items={menuItems}
                layout={values.layout as "horizontal" | "vertical" | "radial"}
                spacing={Number(values.spacing)}
                itemSize={Number(values.itemSize)}
                floating={values.floating as boolean}
              />
            </XRScene>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-end pb-6">
              <p className="rounded-full bg-black/40 px-4 py-1.5 text-[10px] font-medium uppercase tracking-widest text-white/30 backdrop-blur">
                Drag to orbit &middot; Hover items for glow
              </p>
            </div>
          </div>
        }
        code={generateCode(values)}
        filename="spatial-menu-demo.tsx"
      />
      <PropsConfigurator propDefs={propDefs} values={values} onChange={(n, v) => setValues((p) => ({ ...p, [n]: v }))} />
    </div>
  );
}
