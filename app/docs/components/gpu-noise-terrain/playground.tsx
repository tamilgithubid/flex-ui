"use client";

import { useState } from "react";
import { GPUNoiseTerrain } from "@/components/flexui/gpu-noise-terrain";
import { PreviewCodeTabs } from "@/components/docs/preview-code-tabs";
import { PropsConfigurator } from "@/components/docs/props-configurator";
import { FullscreenPreview } from "@/components/docs/fullscreen-preview";

const colorMap: Record<string, [number, number, number]> = {
  "#A78BFA": [0.65, 0.55, 0.98],
  "#34D399": [0.2, 0.83, 0.6],
  "#60A5FA": [0.38, 0.65, 0.98],
  "#F472B6": [0.96, 0.45, 0.71],
};

const colorLabels: Record<string, string> = {
  "#A78BFA": "Violet",
  "#34D399": "Emerald",
  "#60A5FA": "Blue",
  "#F472B6": "Pink",
};

const propDefs = [
  {
    name: "scale",
    label: "Scale",
    control: { type: "select" as const, options: ["1.0", "2.0", "3.0", "4.0"] },
    defaultValue: "2.0",
  },
  {
    name: "heightScale",
    label: "Height Scale",
    control: { type: "select" as const, options: ["0.1", "0.2", "0.3", "0.5"] },
    defaultValue: "0.3",
  },
  {
    name: "speed",
    label: "Speed",
    control: { type: "select" as const, options: ["0.1", "0.2", "0.3", "0.5"] },
    defaultValue: "0.3",
  },
  {
    name: "wireframe",
    label: "Wireframe",
    control: { type: "boolean" as const },
    defaultValue: true,
  },
  {
    name: "colorHex",
    label: "Color",
    control: { type: "select" as const, options: ["#A78BFA", "#34D399", "#60A5FA", "#F472B6"] },
    defaultValue: "#A78BFA",
  },
];

function generateCode(values: Record<string, string | number | boolean>) {
  const props: string[] = [];
  if (values.scale !== "2.0") props.push(`scale={${values.scale}}`);
  if (values.heightScale !== "0.3") props.push(`heightScale={${values.heightScale}}`);
  if (values.speed !== "0.3") props.push(`speed={${values.speed}}`);
  if (values.wireframe) props.push(`wireframe`);
  else props.push(`wireframe={false}`);
  const c = colorMap[values.colorHex as string] || colorMap["#A78BFA"];
  props.push(`color={[${c[0]}, ${c[1]}, ${c[2]}]}`);
  const propsStr = props.length > 0 ? `\n  ${props.join("\n  ")}\n  ` : " ";
  return `import { GPUNoiseTerrain } from "@/components/flexui/gpu-noise-terrain";

export function Demo() {
  return (
    <GPUNoiseTerrain${propsStr}className="rounded-2xl"
      height={420}
    />
  );
}`;
}

export function GPUNoiseTerrainPlayground() {
  const [values, setValues] = useState<Record<string, string | number | boolean>>({
    scale: "2.0",
    heightScale: "0.3",
    speed: "0.3",
    wireframe: true,
    colorHex: "#A78BFA",
  });

  const currentColor = colorMap[values.colorHex as string] || colorMap["#A78BFA"];

  return (
    <div className="space-y-4">
      <PreviewCodeTabs
        preview={
          <div className="relative overflow-hidden rounded-2xl" style={{ background: "#09090b" }}>
            <GPUNoiseTerrain
              scale={Number(values.scale)}
              heightScale={Number(values.heightScale)}
              speed={Number(values.speed)}
              wireframe={values.wireframe as boolean}
              color={currentColor}
              className="rounded-2xl"
              height={420}
            />
            {/* Overlay label */}
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-end pb-8">
              <p className="text-[10px] font-medium uppercase tracking-widest text-white/30">
                {colorLabels[values.colorHex as string] || "Violet"} terrain &middot; GPU compute noise
              </p>
            </div>
          </div>
        }
        code={generateCode(values)}
        filename="gpu-noise-terrain-demo.tsx"
      />
      <div className="flex flex-wrap items-center gap-3">
        <PropsConfigurator propDefs={propDefs} values={values} onChange={(n, v) => setValues((p) => ({ ...p, [n]: v }))} />
        <FullscreenPreview title="GPU Noise Terrain" badge="WebGPU" badgeColor="bg-orange-500/10 text-orange-400 border-orange-500/20">
          {() => <GPUNoiseTerrain scale={2.0} heightScale={0.3} speed={0.3} wireframe color={[0.65, 0.55, 0.98]} className="w-full rounded-none" height={typeof window !== "undefined" ? window.innerHeight - 120 : 800} />}
        </FullscreenPreview>
      </div>
    </div>
  );
}
