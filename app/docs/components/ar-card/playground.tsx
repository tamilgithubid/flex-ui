"use client";

import { useState } from "react";
import { XRScene } from "@/components/flexui/xr-scene";
import { ARCard } from "@/components/flexui/ar-card";
import { PreviewCodeTabs } from "@/components/docs/preview-code-tabs";
import { PropsConfigurator } from "@/components/docs/props-configurator";
import { FullscreenPreview } from "@/components/docs/fullscreen-preview";

const propDefs = [
  {
    name: "title",
    label: "Title",
    control: { type: "text" as const },
    defaultValue: "FlexUI Pro",
  },
  {
    name: "description",
    label: "Description",
    control: { type: "text" as const },
    defaultValue: "Premium component library",
  },
  {
    name: "floating",
    label: "Floating",
    control: { type: "boolean" as const },
    defaultValue: true,
  },
  {
    name: "accentColor",
    label: "Accent Color",
    control: {
      type: "select" as const,
      options: ["#A78BFA", "#34D399", "#F472B6", "#60A5FA"],
    },
    defaultValue: "#A78BFA",
  },
];

const colorLabels: Record<string, string> = {
  "#A78BFA": "Violet",
  "#34D399": "Emerald",
  "#F472B6": "Rose",
  "#60A5FA": "Sky",
};

function generateCode(values: Record<string, string | number | boolean>) {
  const props: string[] = [];
  props.push(`title="${values.title}"`);
  if (values.description) props.push(`description="${values.description}"`);
  if (values.floating) props.push("floating");
  if (values.accentColor !== "#A78BFA") props.push(`accentColor="${values.accentColor}"`);

  const propsStr = props.length > 0 ? `\n      ${props.join("\n      ")}\n    ` : "";
  return `import { XRScene } from "@/components/flexui/xr-scene";
import { ARCard } from "@/components/flexui/ar-card";

export function Demo() {
  return (
    <XRScene height={420} cameraPosition={[0, 0.5, 3]}>
      <ARCard${propsStr}/>
    </XRScene>
  );
}`;
}

export function ARCardPlayground() {
  const [values, setValues] = useState<Record<string, string | number | boolean>>({
    title: "FlexUI Pro",
    description: "Premium component library",
    floating: true,
    accentColor: "#A78BFA",
  });

  return (
    <div className="space-y-4">
      <PreviewCodeTabs
        preview={
          <div className="relative overflow-hidden rounded-2xl" style={{ background: "#09090b" }}>
            <XRScene height={420} enableOrbitControls cameraPosition={[0, 0.5, 3]}>
              <ARCard
                title={values.title as string}
                description={values.description as string}
                floating={values.floating as boolean}
                accentColor={values.accentColor as string}
              />
            </XRScene>
            {/* Overlay hint */}
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-end pb-6">
              <p className="text-[10px] font-medium uppercase tracking-widest text-white/25">
                Hover card for glow effect
              </p>
            </div>
          </div>
        }
        code={generateCode(values)}
        filename="ar-card-demo.tsx"
      />
      <div className="flex flex-wrap items-center gap-3">
        <PropsConfigurator propDefs={propDefs} values={values} onChange={(n, v) => setValues((p) => ({ ...p, [n]: v }))} />
        <FullscreenPreview title="AR Card" badge="Spatial" badgeColor="bg-emerald-500/10 text-emerald-400 border-emerald-500/20" accentColor="#34D399">
          {() => (
            <XRScene height={typeof window !== "undefined" ? window.innerHeight - 120 : 800} enableOrbitControls cameraPosition={[0, 0.5, 3]} environment="night">
              <ARCard title="FlexUI Pro" description="Premium component library" floating accentColor="#A78BFA" />
            </XRScene>
          )}
        </FullscreenPreview>
      </div>
    </div>
  );
}
