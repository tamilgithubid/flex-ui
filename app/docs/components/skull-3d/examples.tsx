"use client";

import React from "react";
import { Skull3D } from "@/components/flexui/skull-3d";
import { ShowcaseGrid } from "@/components/docs/expandable-showcase";

const examples = [
  {
    id: "skull-hologram",
    title: "Hologram Protocol",
    tag: "Hologram",
    tagColor: "bg-purple-500/10 text-purple-400",
    description: "Translucent holographic skull with scanlines, wireframe grid overlay, and glowing eye cavities. Pure cyberpunk rendered from math.",
    preview: (
      <Skull3D mode="hologram" glowColor="#A78BFA" glowIntensity={0.6} rotateSpeed={0.4} height={340} className="rounded-xl" />
    ),
    code: `<Skull3D mode="hologram" glowColor="#A78BFA" glowIntensity={0.6} height={340} />`,
    filename: "hologram.tsx",
  },
  {
    id: "skull-bone",
    title: "Anatomical Bone",
    tag: "Solid",
    tagColor: "bg-amber-500/10 text-amber-400",
    description: "Realistic bone-white PBR skull with ambient occlusion, soft shadows, subsurface scattering, and specular highlights.",
    preview: (
      <Skull3D mode="solid" color="#e8dcc8" glowColor="#FBBF24" glowIntensity={0.3} rotateSpeed={0.2} height={340} className="rounded-xl" />
    ),
    code: `<Skull3D mode="solid" color="#e8dcc8" glowColor="#FBBF24" height={340} />`,
    filename: "bone.tsx",
  },
  {
    id: "skull-xray",
    title: "X-Ray Radiograph",
    tag: "X-Ray",
    tagColor: "bg-blue-500/10 text-blue-400",
    description: "Edge-lit translucent skull showing silhouette contours with blue emissive glow — like an actual medical X-ray scan.",
    preview: (
      <Skull3D mode="xray" glowColor="#60A5FA" glowIntensity={0.7} rotateSpeed={0.25} height={340} className="rounded-xl" />
    ),
    code: `<Skull3D mode="xray" glowColor="#60A5FA" glowIntensity={0.7} height={340} />`,
    filename: "xray.tsx",
  },
  {
    id: "skull-neon",
    title: "Neon Wireframe",
    tag: "Wireframe",
    tagColor: "bg-rose-500/10 text-rose-400",
    description: "Every polygon edge rendered in hot pink neon with fresnel rim glow. Perfect for futuristic UI backgrounds.",
    preview: (
      <Skull3D mode="wireframe" glowColor="#F472B6" glowIntensity={0.8} rotateSpeed={0.5} height={340} className="rounded-xl" />
    ),
    code: `<Skull3D mode="wireframe" glowColor="#F472B6" glowIntensity={0.8} height={340} />`,
    filename: "neon-wireframe.tsx",
  },
];

export function Skull3DExamples() {
  return <ShowcaseGrid items={examples} />;
}
