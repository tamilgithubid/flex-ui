"use client";

import React from "react";
import { GPUParticleField } from "@/components/flexui/gpu-particle-field";
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
    id: "gpf-default",
    title: "Default — 100K Particles",
    tag: "Base",
    tagColor: "bg-orange-500/10 text-orange-400",
    description: "Full particle system with balanced attractor, turbulence, and damping. Move your cursor to interact.",
    preview: (
      <Wrapper label="hover to interact">
        <GPUParticleField className="rounded-xl" height={280} />
      </Wrapper>
    ),
    code: `<GPUParticleField className="rounded-xl" height={280} />`,
    filename: "default.tsx",
  },
  {
    id: "gpf-nebula",
    title: "Cosmic Nebula",
    tag: "Cinematic",
    tagColor: "bg-purple-500/10 text-purple-400",
    description: "200K particles, high turbulence, low damping — creates a swirling nebula cloud effect.",
    preview: (
      <Wrapper label="cosmic nebula mode">
        <GPUParticleField count={200000} turbulence={1.5} damping={0.92} attractorStrength={0.5} className="rounded-xl" height={280} />
      </Wrapper>
    ),
    code: `<GPUParticleField\n  count={200000}\n  turbulence={1.5}\n  damping={0.92}\n  attractorStrength={0.5}\n  className="rounded-xl"\n  height={280}\n/>`,
    filename: "nebula.tsx",
  },
  {
    id: "gpf-calm",
    title: "Zen Drift",
    tag: "Ambient",
    tagColor: "bg-emerald-500/10 text-emerald-400",
    description: "Minimal turbulence, very high damping — particles drift slowly like dust in still air.",
    preview: (
      <Wrapper label="zen mode">
        <GPUParticleField turbulence={0.05} damping={0.998} attractorStrength={0.3} className="rounded-xl" height={280} />
      </Wrapper>
    ),
    code: `<GPUParticleField\n  turbulence={0.05}\n  damping={0.998}\n  attractorStrength={0.3}\n  className="rounded-xl"\n  height={280}\n/>`,
    filename: "zen.tsx",
  },
  {
    id: "gpf-vortex",
    title: "Magnetic Vortex",
    tag: "Interactive",
    tagColor: "bg-rose-500/10 text-rose-400",
    description: "Maximum attractor strength pulls every particle toward your cursor — like a magnetic black hole.",
    preview: (
      <Wrapper label="move mouse to create vortex">
        <GPUParticleField attractorStrength={10.0} turbulence={0.8} damping={0.95} className="rounded-xl" height={280} />
      </Wrapper>
    ),
    code: `<GPUParticleField\n  attractorStrength={10.0}\n  turbulence={0.8}\n  damping={0.95}\n  className="rounded-xl"\n  height={280}\n/>`,
    filename: "vortex.tsx",
  },
];

export function GPUParticleFieldExamples() {
  return <ShowcaseGrid items={examples} />;
}
