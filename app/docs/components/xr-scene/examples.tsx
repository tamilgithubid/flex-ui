"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { XRScene } from "@/components/flexui/xr-scene";
import { ShowcaseGrid } from "@/components/docs/expandable-showcase";
import * as THREE from "three";

/* ── Animated 3D Primitives ──────────────────────────────────────────────── */

function AnimatedWireIcosahedron({ color = "#A78BFA" }: { color?: string }) {
  const ref = useRef<THREE.Mesh>(null);
  const shellRef = useRef<THREE.Mesh>(null);
  useFrame((s) => {
    const t = s.clock.elapsedTime;
    if (ref.current) { ref.current.rotation.y = t * 0.3; ref.current.rotation.x = Math.sin(t * 0.5) * 0.2; ref.current.position.y = 0.5 + Math.sin(t) * 0.1; }
    if (shellRef.current) { shellRef.current.rotation.y = -t * 0.15; shellRef.current.position.y = 0.5 + Math.sin(t) * 0.1; }
  });
  return (
    <group>
      <mesh ref={ref}><icosahedronGeometry args={[0.5, 1]} /><meshPhysicalMaterial color={color} metalness={0.5} roughness={0.15} emissive={new THREE.Color(color)} emissiveIntensity={0.1} /></mesh>
      <mesh ref={shellRef}><icosahedronGeometry args={[0.8, 2]} /><meshBasicMaterial color={color} wireframe transparent opacity={0.1} /></mesh>
    </group>
  );
}

function AnimatedSphere({ color = "#FBBF24" }: { color?: string }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((s) => { if (ref.current) { ref.current.position.y = 0.5 + Math.sin(s.clock.elapsedTime * 0.7) * 0.12; ref.current.rotation.y = s.clock.elapsedTime * 0.2; } });
  return <mesh ref={ref}><sphereGeometry args={[0.6, 64, 64]} /><meshPhysicalMaterial color={color} metalness={0.8} roughness={0.05} clearcoat={1} clearcoatRoughness={0.1} /></mesh>;
}

function AnimatedTorus({ color = "#60A5FA" }: { color?: string }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((s) => { if (ref.current) { ref.current.rotation.x = s.clock.elapsedTime * 0.3; ref.current.rotation.y = s.clock.elapsedTime * 0.2; ref.current.position.y = 0.5 + Math.sin(s.clock.elapsedTime * 0.6) * 0.1; } });
  return <mesh ref={ref}><torusKnotGeometry args={[0.4, 0.12, 128, 32]} /><meshPhysicalMaterial color={color} metalness={0.3} roughness={0.15} emissive={new THREE.Color(color)} emissiveIntensity={0.2} /></mesh>;
}

function AnimatedOctahedron({ color = "#34D399" }: { color?: string }) {
  const ref = useRef<THREE.Mesh>(null);
  const wireRef = useRef<THREE.Mesh>(null);
  useFrame((s) => {
    const t = s.clock.elapsedTime;
    if (ref.current) { ref.current.rotation.y = t * 0.25; ref.current.rotation.z = t * 0.15; ref.current.position.y = 0.5 + Math.sin(t * 0.5) * 0.1; }
    if (wireRef.current) { wireRef.current.rotation.y = -t * 0.1; wireRef.current.position.y = 0.5 + Math.sin(t * 0.5) * 0.1; }
  });
  return (
    <group>
      <mesh ref={ref}><octahedronGeometry args={[0.55, 0]} /><meshPhysicalMaterial color={color} metalness={0.4} roughness={0.1} emissive={new THREE.Color(color)} emissiveIntensity={0.15} flatShading /></mesh>
      <mesh ref={wireRef}><octahedronGeometry args={[0.75, 0]} /><meshBasicMaterial color={color} wireframe transparent opacity={0.08} /></mesh>
    </group>
  );
}

function FloorGrid({ color = "#A78BFA" }: { color?: string }) {
  return (
    <group position={[0, -0.3, 0]}>
      <gridHelper args={[6, 20, color, color]} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[6, 6]} />
        <meshStandardMaterial color="#09090b" transparent opacity={0.95} />
      </mesh>
    </group>
  );
}

const examples = [
  {
    id: "xr-studio",
    title: "Crystal Wireframe",
    tag: "Studio",
    tagColor: "bg-purple-500/10 text-purple-400",
    description: "Animated icosahedron with wireframe outer shell, orbiting in studio lighting.",
    preview: <XRScene environment="studio" height={340} cameraPosition={[0, 1, 3]}><AnimatedWireIcosahedron /><FloorGrid /></XRScene>,
    code: `<XRScene environment="studio" height={340}>\n  <AnimatedIcosahedron />\n  <FloorGrid />\n</XRScene>`,
    filename: "crystal-wireframe.tsx",
  },
  {
    id: "xr-sunset",
    title: "Golden Hour",
    tag: "Sunset",
    tagColor: "bg-amber-500/10 text-amber-400",
    description: "Metallic gold sphere with clearcoat finish in warm sunset environment. Photorealistic reflections.",
    preview: <XRScene environment="sunset" height={340} cameraPosition={[0, 0.8, 2.5]}><AnimatedSphere color="#FBBF24" /><FloorGrid color="#FBBF24" /></XRScene>,
    code: `<XRScene environment="sunset" height={340}>\n  <AnimatedSphere color="#FBBF24" />\n</XRScene>`,
    filename: "golden-hour.tsx",
  },
  {
    id: "xr-night",
    title: "Neon Torus Knot",
    tag: "Night",
    tagColor: "bg-blue-500/10 text-blue-400",
    description: "Glowing torus knot with emissive blue light in dark night environment. Cinematic sci-fi aesthetic.",
    preview: <XRScene environment="night" height={340} cameraPosition={[0, 0.8, 2.8]}><AnimatedTorus color="#60A5FA" /><FloorGrid color="#60A5FA" /></XRScene>,
    code: `<XRScene environment="night" height={340}>\n  <AnimatedTorusKnot color="#60A5FA" />\n</XRScene>`,
    filename: "neon-torus.tsx",
  },
  {
    id: "xr-forest",
    title: "Emerald Crystal",
    tag: "Forest",
    tagColor: "bg-emerald-500/10 text-emerald-400",
    description: "Faceted octahedron crystal with flat shading and wireframe shell in lush forest environment.",
    preview: <XRScene environment="forest" height={340} cameraPosition={[0, 1, 3]}><AnimatedOctahedron color="#34D399" /><FloorGrid color="#34D399" /></XRScene>,
    code: `<XRScene environment="forest" height={340}>\n  <AnimatedOctahedron color="#34D399" />\n</XRScene>`,
    filename: "emerald-crystal.tsx",
  },
];

export function XRSceneExamples() {
  return <ShowcaseGrid items={examples} />;
}
