import type { Metadata } from "next";
import { CodeBlock } from "@/components/ui/code-block";
import { DocSection, DocSubSection } from "@/components/docs/doc-section";
import { ApiTable } from "@/components/docs/api-table";
import { Skull3DPlayground } from "./playground";
import { Skull3DExamples } from "./examples";
import { Sparkles, Eye, Settings2, Layers } from "lucide-react";

export const metadata: Metadata = {
  title: "3D Skull — FlexUI",
  description: "Ultra-detailed procedural 3D human skull with anatomical geometry, multiple render modes, and cinematic lighting.",
};

export default function Skull3DDoc() {
  return (
    <div className="min-w-0 flex-1 space-y-14">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <span className="rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-orange-400">
            Cinematic
          </span>
          <span className="rounded-full border border-white/[0.06] bg-white/[0.03] px-3 py-1 text-[11px] font-medium text-zinc-500">
            Three.js
          </span>
        </div>
        <h1 className="mt-5 text-4xl font-bold tracking-tight text-white">
          3D Skull
        </h1>
        <p className="mt-3 max-w-2xl text-lg leading-relaxed text-zinc-400">
          Ultra-detailed procedural human skull built from 30+ composed Three.js geometries.
          Anatomically-inspired cranium, orbital cavities, nasal aperture, zygomatic arches,
          mandible with individual teeth, and temporal bones. Four render modes: solid bone,
          wireframe, x-ray, and hologram.
        </p>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      {/* Preview */}
      <DocSection id="preview" title="Preview">
        <Skull3DPlayground />
      </DocSection>

      {/* Examples */}
      <DocSection id="examples" title="Examples">
        <Skull3DExamples />
      </DocSection>

      {/* Installation */}
      <DocSection id="installation" title="Installation">
        <div className="space-y-3">
          <CodeBlock code="npx flexui add skull-3d" filename="Terminal" />
          <p className="text-sm text-zinc-500">
            Zero dependencies — renders via native WebGL raymarched SDF.
            No Three.js, no external 3D models, pure mathematical rendering.
          </p>
        </div>
      </DocSection>

      {/* Usage */}
      <DocSection id="usage" title="Usage">
        <CodeBlock
          code={`import { Skull3D } from "@/components/flexui/skull-3d";

export function Demo() {
  return (
    <Skull3D
      mode="hologram"
      glowColor="#A78BFA"
      glowIntensity={0.5}
      rotateSpeed={0.3}
      height={500}
      className="rounded-2xl"
    />
  );
}`}
          filename="example.tsx"
          language="tsx"
        />
      </DocSection>

      {/* What You Get */}
      <DocSection id="what-you-get" title="What You Get">
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { icon: <Sparkles className="h-4 w-4 text-orange-400" />, label: "Raymarched SDF", desc: "20+ smooth-blended signed distance functions: cranium vault, brow ridge, orbital cavities, nasal aperture, zygomatic arches, mandible with teeth, foramen magnum." },
            { icon: <Eye className="h-4 w-4 text-orange-400" />, label: "4 Cinematic Modes", desc: "Solid bone with PBR + ambient occlusion + soft shadows + subsurface scattering. Wireframe, X-ray edge-detection, and hologram with scanlines." },
            { icon: <Settings2 className="h-4 w-4 text-orange-400" />, label: "Zero Dependencies", desc: "Pure WebGL — no Three.js, no external 3D models. The entire skull is computed from mathematical distance functions in a GLSL fragment shader." },
            { icon: <Layers className="h-4 w-4 text-orange-400" />, label: "Mouse Interactive", desc: "Move cursor to rotate the skull in real-time. Ground grid reflection, vignette, and HDR tone mapping built into the shader." },
          ].map((item) => (
            <div key={item.label} className="group/card rounded-xl border border-white/[0.06] bg-zinc-950/50 p-5 transition-all duration-300 hover:border-white/[0.1] hover:bg-zinc-900/40">
              <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500/10 to-red-500/10">{item.icon}</div>
              <p className="text-sm font-semibold text-white">{item.label}</p>
              <p className="mt-1 text-xs leading-relaxed text-zinc-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </DocSection>

      {/* API Reference */}
      <DocSection id="api-reference" title="API Reference">
        <DocSubSection id="exports" title="Exports">
          <CodeBlock code={`import { Skull3D } from "@/components/flexui/skull-3d";`} filename="Named export" />
        </DocSubSection>
        <DocSubSection id="props" title="Props">
          <ApiTable
            rows={[
              { name: "mode", type: '"solid" | "wireframe" | "xray" | "hologram"', default: '"solid"', description: "Render mode. Solid: PBR bone. Wireframe: neon grid. X-ray: edge silhouette. Hologram: scanlines + grid + glowing eyes." },
              { name: "color", type: "string", default: '"#e8dcc8"', description: "Bone surface color (hex). Used in solid mode for the PBR material." },
              { name: "glowColor", type: "string", default: '"#A78BFA"', description: "Accent / glow color (hex). Controls wireframe, x-ray, hologram tint, eye glow, and ground grid." },
              { name: "glowIntensity", type: "number", default: "0.5", description: "Overall glow brightness multiplier (0-2). Higher values produce more vibrant colors." },
              { name: "rotateSpeed", type: "number", default: "0.3", description: "Auto-rotation speed. Set to 0 to disable rotation (mouse still works)." },
              { name: "height", type: "number", default: "500", description: "Canvas height in pixels." },
              { name: "className", type: "string", default: "—", description: "Additional CSS classes for the canvas element." },
            ]}
          />
        </DocSubSection>
      </DocSection>
    </div>
  );
}
