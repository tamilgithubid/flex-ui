"use client";

import { useState } from "react";
import { VolumetricText } from "@/components/flexui/volumetric-text";
import { PreviewCodeTabs } from "@/components/docs/preview-code-tabs";
import { PropsConfigurator } from "@/components/docs/props-configurator";
import { FullscreenPreview } from "@/components/docs/fullscreen-preview";

const propDefs = [
  {
    name: "text",
    label: "Text",
    control: { type: "text" as const },
    defaultValue: "FLEXUI",
  },
  {
    name: "fontSize",
    label: "Font Size",
    control: { type: "select" as const, options: ["48", "64", "80", "96", "128"] },
    defaultValue: "80",
  },
  {
    name: "lightAngle",
    label: "Light Angle",
    control: { type: "select" as const, options: ["0", "30", "45", "90", "135", "180"] },
    defaultValue: "45",
  },
  {
    name: "rayDensity",
    label: "Ray Density",
    control: { type: "select" as const, options: ["0.1", "0.2", "0.3", "0.5", "0.8"] },
    defaultValue: "0.3",
  },
];

function generateCode(values: Record<string, string | number | boolean>) {
  const props: string[] = [];
  props.push(`text="${values.text}"`);
  if (values.fontSize !== "80") props.push(`fontSize={${values.fontSize}}`);
  if (values.lightAngle !== "45") props.push(`lightAngle={${values.lightAngle}}`);
  if (values.rayDensity !== "0.3") props.push(`rayDensity={${values.rayDensity}}`);
  const propsStr = `\n  ${props.join("\n  ")}\n  `;
  return `import { VolumetricText } from "@/components/flexui/volumetric-text";

export function Demo() {
  return (
    <VolumetricText${propsStr}className="rounded-2xl"
    />
  );
}`;
}

export function VolumetricTextPlayground() {
  const [values, setValues] = useState<Record<string, string | number | boolean>>({
    text: "FLEXUI",
    fontSize: "80",
    lightAngle: "45",
    rayDensity: "0.3",
  });

  return (
    <div className="space-y-4">
      <PreviewCodeTabs
        preview={
          <div className="relative overflow-hidden rounded-2xl" style={{ background: "#09090b" }}>
            <div className="flex min-h-[340px] items-center justify-center py-10">
              <VolumetricText
                text={values.text as string}
                fontSize={Number(values.fontSize)}
                lightAngle={Number(values.lightAngle)}
                rayDensity={Number(values.rayDensity)}
                className="rounded-2xl"
              />
            </div>
            {/* Overlay label */}
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-end pb-8">
              <p className="text-[10px] font-medium uppercase tracking-widest text-white/30">
                Volumetric god-ray rendering
              </p>
            </div>
          </div>
        }
        code={generateCode(values)}
        filename="volumetric-text-demo.tsx"
      />
      <div className="flex flex-wrap items-center gap-3">
        <PropsConfigurator propDefs={propDefs} values={values} onChange={(n, v) => setValues((p) => ({ ...p, [n]: v }))} />
        <FullscreenPreview title="Volumetric Text" badge="WebGPU" badgeColor="bg-orange-500/10 text-orange-400 border-orange-500/20">
          {() => <VolumetricText text="FLEXUI" fontSize={128} lightAngle={45} rayDensity={0.4} className="w-full" />}
        </FullscreenPreview>
      </div>
    </div>
  );
}
