"use client";

import { useState } from "react";
import { Skull3D } from "@/components/flexui/skull-3d";
import { PreviewCodeTabs } from "@/components/docs/preview-code-tabs";
import { PropsConfigurator } from "@/components/docs/props-configurator";
import { FullscreenPreview, FullscreenControl } from "@/components/docs/fullscreen-preview";

const propDefs = [
  { name: "mode", label: "Render Mode", control: { type: "select" as const, options: ["solid", "wireframe", "xray", "hologram"] }, defaultValue: "hologram" },
  { name: "glowColor", label: "Glow Color", control: { type: "select" as const, options: ["#A78BFA", "#34D399", "#F472B6", "#60A5FA", "#FBBF24", "#F87171"] }, defaultValue: "#A78BFA" },
  { name: "glowIntensity", label: "Glow Intensity", control: { type: "select" as const, options: ["0.3", "0.5", "0.8", "1.2", "2.0"] }, defaultValue: "0.8" },
  { name: "rotateSpeed", label: "Rotate Speed", control: { type: "select" as const, options: ["0", "0.1", "0.3", "0.5", "0.8"] }, defaultValue: "0.3" },
];

const colorLabels: Record<string, string> = {
  "#A78BFA": "Violet", "#34D399": "Emerald", "#F472B6": "Rose", "#60A5FA": "Sky", "#FBBF24": "Gold", "#F87171": "Red",
};

function generateCode(values: Record<string, string | number | boolean>) {
  const props: string[] = [];
  if (values.mode !== "solid") props.push(`mode="${values.mode}"`);
  if (values.glowColor !== "#A78BFA") props.push(`glowColor="${values.glowColor}"`);
  if (values.glowIntensity !== "0.5") props.push(`glowIntensity={${values.glowIntensity}}`);
  if (values.rotateSpeed !== "0.3") props.push(`rotateSpeed={${values.rotateSpeed}}`);
  props.push(`height={520}`);
  props.push(`className="rounded-2xl"`);
  const propsStr = props.length > 0 ? `\n  ${props.join("\n  ")}\n` : " ";
  return `import { Skull3D } from "@/components/flexui/skull-3d";

export function Demo() {
  return (
    <Skull3D${propsStr}/>
  );
}`;
}

export function Skull3DPlayground() {
  const [values, setValues] = useState<Record<string, string | number | boolean>>({
    mode: "hologram", glowColor: "#A78BFA", glowIntensity: "0.8", rotateSpeed: "0.3",
  });

  // Fullscreen mode/color state (independent from playground)
  const [fsMode, setFsMode] = useState<string>("hologram");
  const [fsColor, setFsColor] = useState<string>("#A78BFA");

  return (
    <div className="space-y-4">
      <PreviewCodeTabs
        preview={
          <div className="relative w-full overflow-hidden rounded-2xl border border-white/5">
            <Skull3D
              mode={values.mode as "solid" | "wireframe" | "xray" | "hologram"}
              glowColor={values.glowColor as string}
              glowIntensity={Number(values.glowIntensity)}
              rotateSpeed={Number(values.rotateSpeed)}
              height={520}
              className="rounded-2xl"
            />
            <div className="flex justify-center border-t border-white/5 px-4 py-4">
              <p className="rounded-full bg-black/50 px-4 py-1.5 text-[10px] font-medium uppercase tracking-widest text-zinc-400 backdrop-blur">
                {colorLabels[values.glowColor as string] ?? "Violet"} {values.mode as string} &middot; Move mouse to rotate &middot; Raymarched SDF
              </p>
            </div>
          </div>
        }
        code={generateCode(values)}
        filename="skull-3d-demo.tsx"
      />

      <div className="flex flex-wrap items-center gap-3">
        <PropsConfigurator propDefs={propDefs} values={values} onChange={(n, v) => setValues((p) => ({ ...p, [n]: v }))} />

        {/* Fullscreen button */}
        <FullscreenPreview
          title="3D Skull"
          badge="Cinematic"
          badgeColor="bg-orange-500/10 text-orange-400 border-orange-500/20"
          accentColor={fsColor}
          controls={
            <div className="flex flex-wrap items-center gap-2">
              {(["solid", "wireframe", "xray", "hologram"] as const).map((m) => (
                <FullscreenControl key={m} label={m.charAt(0).toUpperCase() + m.slice(1)} active={fsMode === m} onClick={() => setFsMode(m)} color={fsColor} />
              ))}
              <div className="mx-2 h-4 w-px bg-white/10" />
              {Object.entries(colorLabels).map(([hex, label]) => (
                <FullscreenControl key={hex} label={label} active={fsColor === hex} onClick={() => setFsColor(hex)} color={hex} />
              ))}
            </div>
          }
        >
          {() => (
            <Skull3D
              mode={fsMode as "solid" | "wireframe" | "xray" | "hologram"}
              glowColor={fsColor}
              glowIntensity={0.6}
              rotateSpeed={0.3}
              height={typeof window !== "undefined" ? window.innerHeight - 120 : 800}
              className="w-full"
            />
          )}
        </FullscreenPreview>
      </div>
    </div>
  );
}

