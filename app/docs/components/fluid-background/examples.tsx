"use client";

import React from "react";
import { FluidBackground } from "@/components/flexui/fluid-background";
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
    id: "fb-ocean",
    title: "Ocean Current",
    tag: "Ambient",
    tagColor: "bg-blue-500/10 text-blue-400",
    description: "Slow, deep viscosity with moderate color creates an undulating oceanic drift. Let it wash over you.",
    preview: (
      <Wrapper label="hover to interact">
        <FluidBackground viscosity={0.5} speed={0.2} colorIntensity={0.8} className="h-[320px] rounded-xl">
          <div className="flex h-full flex-col items-center justify-center gap-2">
            <p className="text-lg font-semibold tracking-wide text-white/60">Deep Blue</p>
          </div>
        </FluidBackground>
      </Wrapper>
    ),
    code: `<FluidBackground
  viscosity={0.5}
  speed={0.2}
  colorIntensity={0.8}
  className="h-[320px] rounded-xl"
>
  <div className="flex h-full flex-col items-center justify-center gap-2">
    <p className="text-lg font-semibold tracking-wide text-white/60">Deep Blue</p>
  </div>
</FluidBackground>`,
    filename: "ocean-current.tsx",
  },
  {
    id: "fb-plasma",
    title: "Plasma Storm",
    tag: "Cinematic",
    tagColor: "bg-rose-500/10 text-rose-400",
    description: "Low viscosity, maximum speed and color intensity. Violent, fast-moving plasma tendrils that erupt on interaction.",
    preview: (
      <Wrapper label="move mouse for plasma burst">
        <FluidBackground viscosity={0.1} speed={1.2} colorIntensity={1.5} className="h-[320px] rounded-xl">
          <div className="flex h-full flex-col items-center justify-center gap-2">
            <p className="text-lg font-black tracking-wider text-white/70">PLASMA</p>
          </div>
        </FluidBackground>
      </Wrapper>
    ),
    code: `<FluidBackground
  viscosity={0.1}
  speed={1.2}
  colorIntensity={1.5}
  className="h-[320px] rounded-xl"
>
  <div className="flex h-full flex-col items-center justify-center gap-2">
    <p className="text-lg font-black tracking-wider text-white/70">PLASMA</p>
  </div>
</FluidBackground>`,
    filename: "plasma-storm.tsx",
  },
  {
    id: "fb-ink",
    title: "Ink in Water",
    tag: "Zen",
    tagColor: "bg-purple-500/10 text-purple-400",
    description: "Thick viscosity, near-still speed. Ink-like diffusion that spreads slowly and deliberately, like calligraphy ink dropped in still water.",
    preview: (
      <Wrapper label="slow diffusion mode">
        <FluidBackground viscosity={0.8} speed={0.1} colorIntensity={0.5} className="h-[320px] rounded-xl">
          <div className="flex h-full flex-col items-center justify-center gap-2">
            <p className="text-sm font-medium tracking-[0.3em] text-white/40">DIFFUSION</p>
          </div>
        </FluidBackground>
      </Wrapper>
    ),
    code: `<FluidBackground
  viscosity={0.8}
  speed={0.1}
  colorIntensity={0.5}
  className="h-[320px] rounded-xl"
>
  <div className="flex h-full flex-col items-center justify-center gap-2">
    <p className="text-sm font-medium tracking-[0.3em] text-white/40">DIFFUSION</p>
  </div>
</FluidBackground>`,
    filename: "ink-in-water.tsx",
  },
  {
    id: "fb-hero",
    title: "Hero Background",
    tag: "Compose",
    tagColor: "bg-amber-500/10 text-amber-400",
    description: "Full hero section with headline, subheadline, and CTA button overlaid on a living fluid background.",
    preview: (
      <Wrapper label="hero section example">
        <FluidBackground viscosity={0.3} speed={0.4} colorIntensity={1.0} className="h-[360px] rounded-xl">
          <div className="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
            <h2 className="text-4xl font-black tracking-tight text-white drop-shadow-lg">
              Build the Impossible
            </h2>
            <p className="max-w-md text-base text-white/50">
              GPU-accelerated components that bring cinematic quality to every pixel of your interface.
            </p>
            <div className="mt-2 rounded-full bg-white/10 px-6 py-2.5 text-sm font-semibold text-white backdrop-blur-sm">
              Get Started
            </div>
          </div>
        </FluidBackground>
      </Wrapper>
    ),
    code: `<FluidBackground
  viscosity={0.3}
  speed={0.4}
  colorIntensity={1.0}
  className="h-[360px] rounded-xl"
>
  <div className="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
    <h2 className="text-4xl font-black tracking-tight text-white drop-shadow-lg">
      Build the Impossible
    </h2>
    <p className="max-w-md text-base text-white/50">
      GPU-accelerated components that bring cinematic quality
      to every pixel of your interface.
    </p>
    <div className="mt-2 rounded-full bg-white/10 px-6 py-2.5 text-sm font-semibold text-white backdrop-blur-sm">
      Get Started
    </div>
  </div>
</FluidBackground>`,
    filename: "hero-background.tsx",
  },
];

export function FluidBackgroundExamples() {
  return <ShowcaseGrid items={examples} />;
}
