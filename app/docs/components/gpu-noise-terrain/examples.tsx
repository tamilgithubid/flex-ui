"use client";

import React from "react";
import { GPUNoiseTerrain } from "@/components/flexui/gpu-noise-terrain";
import { ShowcaseGrid } from "@/components/docs/expandable-showcase";

function Wrapper({ children, label }: { children: React.ReactNode; label?: string }) {
  return (
    <div className="relative overflow-hidden rounded-xl" style={{ background: "#09090b" }}>
      {children}
      {label && (
        <div className="pointer-events-none absolute bottom-0 inset-x-0 flex justify-center pb-3">
          <span className="rounded-full bg-white/5 px-3 py-1 text-[9px] font-medium uppercase tracking-widest text-white/25 backdrop-blur">
            {label}
          </span>
        </div>
      )}
    </div>
  );
}

const examples = [
  {
    id: "gnt-neon",
    title: "Neon Wireframe",
    tag: "Base",
    tagColor: "bg-purple-500/10 text-purple-400",
    description: "Default violet wireframe at scale 2.0. Glowing neon grid lines undulate over GPU-computed simplex noise.",
    preview: (
      <Wrapper label="wireframe mode">
        <GPUNoiseTerrain wireframe scale={2.0} color={[0.65, 0.55, 0.98]} className="rounded-xl" height={300} />
      </Wrapper>
    ),
    code: `<GPUNoiseTerrain
  wireframe
  scale={2.0}
  color={[0.65, 0.55, 0.98]}
  className="rounded-xl"
  height={300}
/>`,
    filename: "neon-wireframe.tsx",
  },
  {
    id: "gnt-solid",
    title: "Solid Mountains",
    tag: "Cinematic",
    tagColor: "bg-blue-500/10 text-blue-400",
    description: "Solid shading with high peaks at scale 3.0. Dramatic mountain ranges rendered without wireframe overlay for a filmic look.",
    preview: (
      <Wrapper label="solid surface rendering">
        <GPUNoiseTerrain wireframe={false} heightScale={0.5} scale={3.0} color={[0.38, 0.65, 0.98]} className="rounded-xl" height={300} />
      </Wrapper>
    ),
    code: `<GPUNoiseTerrain
  wireframe={false}
  heightScale={0.5}
  scale={3.0}
  color={[0.38, 0.65, 0.98]}
  className="rounded-xl"
  height={300}
/>`,
    filename: "solid-mountains.tsx",
  },
  {
    id: "gnt-emerald",
    title: "Emerald Valleys",
    tag: "Nature",
    tagColor: "bg-emerald-500/10 text-emerald-400",
    description: "Lush green wireframe terrain evoking rolling hills and valleys. The emerald palette brings an organic, living feel.",
    preview: (
      <Wrapper label="emerald palette">
        <GPUNoiseTerrain wireframe scale={2.0} color={[0.2, 0.9, 0.5]} className="rounded-xl" height={300} />
      </Wrapper>
    ),
    code: `<GPUNoiseTerrain
  wireframe
  scale={2.0}
  color={[0.2, 0.9, 0.5]}
  className="rounded-xl"
  height={300}
/>`,
    filename: "emerald-valleys.tsx",
  },
  {
    id: "gnt-tectonic",
    title: "Slow Tectonic",
    tag: "Ambient",
    tagColor: "bg-rose-500/10 text-rose-400",
    description: "Extremely slow speed at 0.05 with medium height. The terrain shifts at geological pace, like tectonic plates in slow motion.",
    preview: (
      <Wrapper label="ultra-slow drift">
        <GPUNoiseTerrain wireframe speed={0.05} heightScale={0.3} scale={1.5} color={[0.96, 0.45, 0.71]} className="rounded-xl" height={300} />
      </Wrapper>
    ),
    code: `<GPUNoiseTerrain
  wireframe
  speed={0.05}
  heightScale={0.3}
  scale={1.5}
  color={[0.96, 0.45, 0.71]}
  className="rounded-xl"
  height={300}
/>`,
    filename: "slow-tectonic.tsx",
  },
];

export function GPUNoiseTerrainExamples() {
  return <ShowcaseGrid items={examples} />;
}
