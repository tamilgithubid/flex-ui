"use client";

import { useState } from "react";
import { FluidBackground } from "@/components/flexui/fluid-background";
import { PreviewCodeTabs } from "@/components/docs/preview-code-tabs";
import { PropsConfigurator } from "@/components/docs/props-configurator";
import { FullscreenPreview } from "@/components/docs/fullscreen-preview";

const propDefs = [
  {
    name: "viscosity",
    label: "Viscosity",
    control: { type: "select" as const, options: ["0.1", "0.2", "0.3", "0.5", "0.8"] },
    defaultValue: "0.3",
  },
  {
    name: "speed",
    label: "Speed",
    control: { type: "select" as const, options: ["0.1", "0.2", "0.4", "0.8", "1.2"] },
    defaultValue: "0.4",
  },
  {
    name: "colorIntensity",
    label: "Color Intensity",
    control: { type: "select" as const, options: ["0.3", "0.5", "0.8", "1.0", "1.5"] },
    defaultValue: "1.0",
  },
];

function generateCode(values: Record<string, string | number | boolean>) {
  const props: string[] = [];
  if (values.viscosity !== "0.3") props.push(`viscosity={${values.viscosity}}`);
  if (values.speed !== "0.4") props.push(`speed={${values.speed}}`);
  if (values.colorIntensity !== "1.0") props.push(`colorIntensity={${values.colorIntensity}}`);
  const propsStr = props.length > 0 ? `\n  ${props.join("\n  ")}\n  ` : " ";
  return `import { FluidBackground } from "@/components/flexui/fluid-background";

export function Demo() {
  return (
    <FluidBackground${propsStr}className="h-[400px] rounded-2xl">
      <div className="flex h-full flex-col items-center justify-center gap-3">
        <h2 className="text-3xl font-black tracking-tight text-white/90">
          Fluid Simulation
        </h2>
        <p className="text-sm text-white/40">
          Powered by WebGPU Navier-Stokes
        </p>
      </div>
    </FluidBackground>
  );
}`;
}

export function FluidBackgroundPlayground() {
  const [values, setValues] = useState<Record<string, string | number | boolean>>({
    viscosity: "0.3",
    speed: "0.4",
    colorIntensity: "1.0",
  });

  return (
    <div className="space-y-4">
      <PreviewCodeTabs
        preview={
          <div className="relative overflow-hidden rounded-2xl" style={{ background: "#09090b" }}>
            <FluidBackground
              viscosity={Number(values.viscosity)}
              speed={Number(values.speed)}
              colorIntensity={Number(values.colorIntensity)}
              className="h-[400px] rounded-2xl"
            >
              <div className="flex h-full flex-col items-center justify-center gap-3">
                <h2 className="text-3xl font-black tracking-tight text-white/90">
                  Fluid Simulation
                </h2>
                <p className="text-sm text-white/40">
                  Powered by WebGPU Navier-Stokes
                </p>
              </div>
            </FluidBackground>
            {/* Overlay label */}
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-end pb-8">
              <p className="text-[10px] font-medium uppercase tracking-widest text-white/30">
                Move your mouse to disturb the fluid
              </p>
            </div>
          </div>
        }
        code={generateCode(values)}
        filename="fluid-background-demo.tsx"
      />
      <div className="flex flex-wrap items-center gap-3">
        <PropsConfigurator propDefs={propDefs} values={values} onChange={(n, v) => setValues((p) => ({ ...p, [n]: v }))} />
        <FullscreenPreview title="Fluid Background" badge="WebGPU" badgeColor="bg-orange-500/10 text-orange-400 border-orange-500/20">
          {() => (
            <FluidBackground viscosity={0.3} speed={0.4} colorIntensity={1.0} className="h-full w-full">
              <div className="flex h-full flex-col items-center justify-center gap-4">
                <h1 className="text-5xl font-black tracking-tight text-white/90">Fluid Simulation</h1>
                <p className="text-lg text-white/40">Move your mouse to interact</p>
              </div>
            </FluidBackground>
          )}
        </FullscreenPreview>
      </div>
    </div>
  );
}
