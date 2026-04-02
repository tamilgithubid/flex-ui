"use client";

import React from "react";
import { XRScene } from "@/components/flexui/xr-scene";
import { ARCard } from "@/components/flexui/ar-card";
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
    id: "arc-product",
    title: "Product Card",
    tag: "Showcase",
    tagColor: "bg-violet-500/10 text-violet-400",
    description: "Glass-morphic product card with violet accent glow. Floating animation and hover-responsive emissive lighting.",
    preview: (
      <Wrapper label="hover for glow">
        <XRScene height={320} enableOrbitControls cameraPosition={[0, 0.5, 3]}>
          <ARCard
            title="FlexUI Pro"
            description="Premium component library"
            accentColor="#A78BFA"
            floating
          />
        </XRScene>
      </Wrapper>
    ),
    code: `<XRScene height={320} cameraPosition={[0, 0.5, 3]}>
  <ARCard
    title="FlexUI Pro"
    description="Premium component library"
    accentColor="#A78BFA"
    floating
  />
</XRScene>`,
    filename: "product-card.tsx",
  },
  {
    id: "arc-status",
    title: "Status Card",
    tag: "Dashboard",
    tagColor: "bg-emerald-500/10 text-emerald-400",
    description: "Operational status indicator with emerald green accent. Ideal for spatial monitoring dashboards and control rooms.",
    preview: (
      <Wrapper label="system status">
        <XRScene height={320} enableOrbitControls cameraPosition={[0, 0.5, 3]}>
          <ARCard
            title="System Online"
            description="All services operational"
            accentColor="#34D399"
            floating
          />
        </XRScene>
      </Wrapper>
    ),
    code: `<XRScene height={320} cameraPosition={[0, 0.5, 3]}>
  <ARCard
    title="System Online"
    description="All services operational"
    accentColor="#34D399"
    floating
  />
</XRScene>`,
    filename: "status-card.tsx",
  },
  {
    id: "arc-alert",
    title: "Alert Card",
    tag: "Notification",
    tagColor: "bg-rose-500/10 text-rose-400",
    description: "Attention-grabbing alert card with rose pink accent. The warm glow immediately draws the eye in a spatial interface.",
    preview: (
      <Wrapper label="notification style">
        <XRScene height={320} enableOrbitControls cameraPosition={[0, 0.5, 3]}>
          <ARCard
            title="Breaking News"
            description="New release available"
            accentColor="#F472B6"
            floating
          />
        </XRScene>
      </Wrapper>
    ),
    code: `<XRScene height={320} cameraPosition={[0, 0.5, 3]}>
  <ARCard
    title="Breaking News"
    description="New release available"
    accentColor="#F472B6"
    floating
  />
</XRScene>`,
    filename: "alert-card.tsx",
  },
  {
    id: "arc-multi",
    title: "Multi-Card Layout",
    tag: "Compose",
    tagColor: "bg-sky-500/10 text-sky-400",
    description: "Two cards positioned side-by-side in 3D space. Demonstrates spatial dashboard composition with different accent colors.",
    preview: (
      <Wrapper label="spatial dashboard">
        <XRScene height={320} enableOrbitControls cameraPosition={[0, 0.5, 4]}>
          <ARCard
            title="Revenue"
            description="$12.4M this quarter"
            position={[-1.2, 0, 0]}
            accentColor="#A78BFA"
            floating
          />
          <ARCard
            title="Active Users"
            description="24K online now"
            position={[1.2, 0, 0]}
            accentColor="#60A5FA"
            floating
          />
        </XRScene>
      </Wrapper>
    ),
    code: `<XRScene height={320} cameraPosition={[0, 0.5, 4]}>
  <ARCard
    title="Revenue"
    description="$12.4M this quarter"
    position={[-1.2, 0, 0]}
    accentColor="#A78BFA"
    floating
  />
  <ARCard
    title="Active Users"
    description="24K online now"
    position={[1.2, 0, 0]}
    accentColor="#60A5FA"
    floating
  />
</XRScene>`,
    filename: "multi-card.tsx",
  },
];

export function ARCardExamples() {
  return <ShowcaseGrid items={examples} />;
}
