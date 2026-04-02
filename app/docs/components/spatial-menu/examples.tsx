"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { XRScene } from "@/components/flexui/xr-scene";
import { SpatialMenu } from "@/components/flexui/spatial-menu";
import { ShowcaseGrid } from "@/components/docs/expandable-showcase";
import * as THREE from "three";

/* ── Background scene for spatial context ────────────────────────────────── */

function DustParticles({ color = "#A78BFA", count = 40 }: { color?: string; count?: number }) {
  const ref = useRef<THREE.Points>(null);
  React.useEffect(() => {
    if (!ref.current) return;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 4;
      pos[i * 3 + 1] = Math.random() * 2 - 0.5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    ref.current.geometry = geo;
  }, [count]);
  useFrame((s) => { if (ref.current) ref.current.rotation.y = s.clock.elapsedTime * 0.015; });
  return (
    <points ref={ref}>
      <bufferGeometry />
      <pointsMaterial color={color} size={0.01} transparent opacity={0.25} sizeAttenuation />
    </points>
  );
}

function SceneBackground({ color = "#A78BFA" }: { color?: string }) {
  return (
    <group>
      <group position={[0, -0.8, 0]}>
        <gridHelper args={[6, 20, color, color]} />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}><planeGeometry args={[6, 6]} /><meshStandardMaterial color="#09090b" transparent opacity={0.95} /></mesh>
      </group>
      <DustParticles color={color} />
    </group>
  );
}

const navItems = [
  { label: "Components", icon: "📦" },
  { label: "Themes", icon: "🎨" },
  { label: "Docs", icon: "📖" },
  { label: "Studio", icon: "✨" },
];

const brandedItems = [
  { label: "Design", icon: "🎯", color: "#A78BFA" },
  { label: "Develop", icon: "⚡", color: "#34D399" },
  { label: "Deploy", icon: "🚀", color: "#F472B6" },
  { label: "Monitor", icon: "📊", color: "#60A5FA" },
];

const largeNavItems = [
  { label: "Home", icon: "🏠" },
  { label: "Products", icon: "📦" },
  { label: "Pricing", icon: "💎" },
  { label: "Blog", icon: "📝" },
  { label: "Docs", icon: "📖" },
  { label: "Contact", icon: "✉️" },
];

const examples = [
  {
    id: "sm-radial",
    title: "Radial Command Wheel",
    tag: "Radial",
    tagColor: "bg-purple-500/10 text-purple-400",
    description: "Items arranged in a radial pattern — perfect for command palettes and quick-access menus in spatial interfaces.",
    preview: (
      <XRScene height={340} cameraPosition={[0, 0.3, 3]}>
        <SceneBackground />
        <SpatialMenu items={navItems} layout="radial" spacing={1.0} floating />
      </XRScene>
    ),
    code: `<XRScene height={340}>\n  <SpatialMenu items={items} layout="radial" spacing={1.0} floating />\n</XRScene>`,
    filename: "radial-wheel.tsx",
  },
  {
    id: "sm-horizontal",
    title: "Horizontal Navigation Bar",
    tag: "Horizontal",
    tagColor: "bg-blue-500/10 text-blue-400",
    description: "Classic horizontal layout with wider spacing — acts as a floating navigation bar in 3D space.",
    preview: (
      <XRScene height={340} cameraPosition={[0, 0.3, 3.5]}>
        <SceneBackground color="#60A5FA" />
        <SpatialMenu items={largeNavItems} layout="horizontal" spacing={0.55} itemSize={0.45} floating />
      </XRScene>
    ),
    code: `<XRScene height={340}>\n  <SpatialMenu items={items} layout="horizontal" spacing={0.55} floating />\n</XRScene>`,
    filename: "horizontal-nav.tsx",
  },
  {
    id: "sm-vertical",
    title: "Vertical Sidebar",
    tag: "Vertical",
    tagColor: "bg-emerald-500/10 text-emerald-400",
    description: "Vertical stack layout with tight spacing — works as a floating sidebar or toolbar in spatial environments.",
    preview: (
      <XRScene height={340} cameraPosition={[0, 0.3, 3]}>
        <SceneBackground color="#34D399" />
        <SpatialMenu items={navItems} layout="vertical" spacing={0.45} floating />
      </XRScene>
    ),
    code: `<XRScene height={340}>\n  <SpatialMenu items={items} layout="vertical" spacing={0.45} floating />\n</XRScene>`,
    filename: "vertical-sidebar.tsx",
  },
  {
    id: "sm-branded",
    title: "Branded Color Palette",
    tag: "Branded",
    tagColor: "bg-rose-500/10 text-rose-400",
    description: "Each item has a custom accent color for brand-aligned spatial navigation with unique glow per item.",
    preview: (
      <XRScene height={340} cameraPosition={[0, 0.3, 3]}>
        <SceneBackground color="#F472B6" />
        <SpatialMenu items={brandedItems} layout="radial" spacing={1.0} floating />
      </XRScene>
    ),
    code: `const items = [\n  { label: "Design", icon: "🎯", color: "#A78BFA" },\n  { label: "Develop", icon: "⚡", color: "#34D399" },\n  { label: "Deploy", icon: "🚀", color: "#F472B6" },\n  { label: "Monitor", icon: "📊", color: "#60A5FA" },\n];\n\n<SpatialMenu items={items} layout="radial" spacing={1.0} />`,
    filename: "branded-colors.tsx",
  },
];

export function SpatialMenuExamples() {
  return <ShowcaseGrid items={examples} />;
}
