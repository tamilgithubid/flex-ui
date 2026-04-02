"use client";

import { useState } from "react";
import { GPUParticleField } from "@/components/flexui/gpu-particle-field";
import { PreviewCodeTabs } from "@/components/docs/preview-code-tabs";
import { PropsConfigurator } from "@/components/docs/props-configurator";
import { FullscreenPreview } from "@/components/docs/fullscreen-preview";

const propDefs = [
  {
    name: "count",
    label: "Particle Count",
    control: { type: "select" as const, options: ["10000", "50000", "100000", "200000"] },
    defaultValue: "100000",
  },
  {
    name: "attractorStrength",
    label: "Attractor Strength",
    control: { type: "select" as const, options: ["0.5", "1.0", "2.0", "5.0", "10.0"] },
    defaultValue: "2.0",
  },
  {
    name: "turbulence",
    label: "Turbulence",
    control: { type: "select" as const, options: ["0.1", "0.3", "0.5", "1.0", "2.0"] },
    defaultValue: "0.5",
  },
  {
    name: "damping",
    label: "Damping",
    control: { type: "select" as const, options: ["0.92", "0.95", "0.98", "0.995"] },
    defaultValue: "0.98",
  },
];

function generateCode(values: Record<string, string | number | boolean>) {
  const props: string[] = [];
  if (values.count !== "100000") props.push(`count={${values.count}}`);
  if (values.attractorStrength !== "2.0") props.push(`attractorStrength={${values.attractorStrength}}`);
  if (values.turbulence !== "0.5") props.push(`turbulence={${values.turbulence}}`);
  if (values.damping !== "0.98") props.push(`damping={${values.damping}}`);
  const propsStr = props.length > 0 ? `\n  ${props.join("\n  ")}\n  ` : " ";
  return `import { GPUParticleField } from "@/components/flexui/gpu-particle-field";\n\nexport function Demo() {\n  return (\n    <GPUParticleField${propsStr}className="rounded-2xl"\n      height={420}\n    />\n  );\n}`;
}

export function GPUParticleFieldPlayground() {
  const [values, setValues] = useState<Record<string, string | number | boolean>>({
    count: "100000", attractorStrength: "2.0", turbulence: "0.5", damping: "0.98",
  });

  return (
    <div className="space-y-4">
      <PreviewCodeTabs
        preview={
          <div className="relative overflow-hidden rounded-2xl" style={{ background: "#09090b" }}>
            <GPUParticleField
              count={Number(values.count)}
              attractorStrength={Number(values.attractorStrength)}
              turbulence={Number(values.turbulence)}
              damping={Number(values.damping)}
              className="rounded-2xl"
              height={420}
            />
            {/* Overlay label */}
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-end pb-8">
              <p className="text-[10px] font-medium uppercase tracking-widest text-white/30">
                Move your mouse to attract particles
              </p>
            </div>
          </div>
        }
        code={generateCode(values)}
        filename="gpu-particle-field-demo.tsx"
      />
      <div className="flex flex-wrap items-center gap-3">
        <PropsConfigurator propDefs={propDefs} values={values} onChange={(n, v) => setValues((p) => ({ ...p, [n]: v }))} />
        <FullscreenPreview title="GPU Particle Field" badge="WebGPU" badgeColor="bg-orange-500/10 text-orange-400 border-orange-500/20">
          {() => (
            <GPUParticleField count={100000} attractorStrength={2.0} turbulence={0.5} damping={0.98} className="w-full" height={typeof window !== "undefined" ? window.innerHeight - 120 : 800} />
          )}
        </FullscreenPreview>
      </div>
    </div>
  );
}
