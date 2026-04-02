"use client";

import React from "react";
import { VolumetricText } from "@/components/flexui/volumetric-text";
import { ShowcaseGrid } from "@/components/docs/expandable-showcase";

function Wrapper({ children, label }: { children: React.ReactNode; label?: string }) {
  return (
    <div className="relative overflow-hidden rounded-xl" style={{ background: "#09090b" }}>
      <div className="flex min-h-[300px] items-center justify-center py-8">
        {children}
      </div>
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
    id: "vt-hero",
    title: "Hero Title",
    tag: "Cinematic",
    tagColor: "bg-purple-500/10 text-purple-400",
    description: "Oversized 96px text with dense ray volume. Dramatic, attention-commanding hero treatment that bleeds light.",
    preview: (
      <Wrapper label="cinematic hero text">
        <VolumetricText text="CINEMATIC" fontSize={96} rayDensity={0.5} className="rounded-xl" />
      </Wrapper>
    ),
    code: `<VolumetricText
  text="CINEMATIC"
  fontSize={96}
  rayDensity={0.5}
  className="rounded-xl"
/>`,
    filename: "hero-title.tsx",
  },
  {
    id: "vt-sunrise",
    title: "Sunrise Rays",
    tag: "Lighting",
    tagColor: "bg-amber-500/10 text-amber-400",
    description: "Light angle at 0 degrees casts rays upward from below, like the first light of dawn breaking over a horizon.",
    preview: (
      <Wrapper label="rays from below">
        <VolumetricText text="DAWN" fontSize={96} lightAngle={0} rayDensity={0.3} className="rounded-xl" />
      </Wrapper>
    ),
    code: `<VolumetricText
  text="DAWN"
  fontSize={96}
  lightAngle={0}
  rayDensity={0.3}
  className="rounded-xl"
/>`,
    filename: "sunrise-rays.tsx",
  },
  {
    id: "vt-sidelit",
    title: "Side Lit",
    tag: "Dramatic",
    tagColor: "bg-rose-500/10 text-rose-400",
    description: "90-degree side illumination creates sharp, directional rays that sweep horizontally through the letterforms.",
    preview: (
      <Wrapper label="side illumination">
        <VolumetricText text="NEON" fontSize={96} lightAngle={90} rayDensity={0.4} className="rounded-xl" />
      </Wrapper>
    ),
    code: `<VolumetricText
  text="NEON"
  fontSize={96}
  lightAngle={90}
  rayDensity={0.4}
  className="rounded-xl"
/>`,
    filename: "side-lit.tsx",
  },
  {
    id: "vt-subtle",
    title: "Subtle Glow",
    tag: "Minimal",
    tagColor: "bg-emerald-500/10 text-emerald-400",
    description: "Low ray density at 0.1 for an understated, elegant treatment. The glow is there if you look for it, but never shouts.",
    preview: (
      <Wrapper label="understated elegance">
        <VolumetricText text="MINIMAL" fontSize={64} rayDensity={0.1} className="rounded-xl" />
      </Wrapper>
    ),
    code: `<VolumetricText
  text="MINIMAL"
  fontSize={64}
  rayDensity={0.1}
  className="rounded-xl"
/>`,
    filename: "subtle-glow.tsx",
  },
];

export function VolumetricTextExamples() {
  return <ShowcaseGrid items={examples} />;
}
