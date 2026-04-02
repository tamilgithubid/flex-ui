import type { Metadata } from "next";
import { CodeBlock } from "@/components/ui/code-block";
import { DocSection, DocSubSection } from "@/components/docs/doc-section";
import { ApiTable } from "@/components/docs/api-table";
import { Mountain, Zap, Settings2, Grid3X3 } from "lucide-react";
import { GPUNoiseTerrainPlayground } from "./playground";
import { GPUNoiseTerrainExamples } from "./examples";

export const metadata: Metadata = {
  title: "GPU Noise Terrain — FlexUI",
  description:
    "Real-time procedural terrain generated on the GPU with configurable noise and wireframe rendering.",
};

export default function GPUNoiseTerrainDoc() {
  return (
    <div className="min-w-0 flex-1 space-y-14">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <span className="rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-orange-400">
            Cinematic
          </span>
          <span className="rounded-full border border-white/[0.06] bg-white/[0.03] px-3 py-1 text-[11px] font-medium text-zinc-500">
            WebGPU
          </span>
        </div>
        <h1 className="mt-5 text-4xl font-bold tracking-tight text-white">
          GPU Noise Terrain
        </h1>
        <p className="mt-3 max-w-2xl text-lg leading-relaxed text-zinc-400">
          Real-time procedural terrain generated entirely on the GPU. Simplex
          noise compute shaders produce infinite, animated landscapes with
          configurable scale, height, and wireframe rendering.
        </p>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      {/* Preview */}
      <DocSection id="preview" title="Preview">
        <GPUNoiseTerrainPlayground />
      </DocSection>

      {/* Examples */}
      <DocSection id="examples" title="Examples">
        <GPUNoiseTerrainExamples />
      </DocSection>

      {/* Installation */}
      <DocSection id="installation" title="Installation">
        <div className="space-y-3">
          <CodeBlock
            code="npx flexui add gpu-noise-terrain"
            filename="Terminal"
          />
          <p className="text-sm text-zinc-500">
            Installs the component to{" "}
            <code className="rounded bg-zinc-800 px-1.5 py-0.5 text-zinc-300">
              components/flexui/gpu-noise-terrain.tsx
            </code>
            . Requires a WebGPU-capable browser.
          </p>
        </div>
      </DocSection>

      {/* Usage */}
      <DocSection id="usage" title="Usage">
        <CodeBlock
          code={`import { GPUNoiseTerrain } from "@/components/flexui/gpu-noise-terrain";

export default function Background() {
  return (
    <GPUNoiseTerrain
      scale={2.0}
      heightScale={0.5}
      speed={0.3}
      wireframe
      color="#22d3ee"
      resolution={256}
      className="w-full"
      height={500}
    />
  );
}`}
          filename="app/page.tsx"
          language="tsx"
        />
      </DocSection>

      {/* What You Get */}
      <DocSection id="what-you-get" title="What You Get">
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            {
              icon: <Mountain className="h-4 w-4 text-orange-400" />,
              label: "Procedural Generation",
              desc: "Simplex noise computed in GPU shaders generates infinite, non-repeating terrain.",
            },
            {
              icon: <Grid3X3 className="h-4 w-4 text-orange-400" />,
              label: "Wireframe Mode",
              desc: "Toggle wireframe rendering for a retro-futuristic aesthetic.",
            },
            {
              icon: <Zap className="h-4 w-4 text-orange-400" />,
              label: "GPU Accelerated",
              desc: "Vertex displacement and normal computation run entirely in vertex/compute shaders.",
            },
            {
              icon: <Settings2 className="h-4 w-4 text-orange-400" />,
              label: "Configurable",
              desc: "Control noise scale, height, animation speed, and mesh resolution via simple props.",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="group/card rounded-xl border border-white/[0.06] bg-zinc-950/50 p-5 transition-all duration-300 hover:border-white/[0.1] hover:bg-zinc-900/40"
            >
              <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500/10 to-red-500/10">
                {item.icon}
              </div>
              <p className="text-sm font-semibold text-white">{item.label}</p>
              <p className="mt-1 text-xs leading-relaxed text-zinc-500">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </DocSection>

      {/* API Reference */}
      <DocSection id="api-reference" title="API Reference">
        <DocSubSection id="exports" title="Exports">
          <CodeBlock
            code={`import { GPUNoiseTerrain } from "@/components/flexui/gpu-noise-terrain";`}
            filename="Named export"
          />
        </DocSubSection>

        <DocSubSection id="props" title="Props">
          <ApiTable
            rows={[
              {
                name: "scale",
                type: "number",
                default: "1.0",
                description:
                  "Noise scale factor. Higher values zoom out the noise pattern.",
              },
              {
                name: "heightScale",
                type: "number",
                default: "0.5",
                description:
                  "Vertical displacement multiplier for the terrain peaks.",
              },
              {
                name: "speed",
                type: "number",
                default: "0.2",
                description: "Animation speed of the terrain noise evolution.",
              },
              {
                name: "wireframe",
                type: "boolean",
                default: "false",
                description:
                  "Render in wireframe mode instead of solid shaded surface.",
              },
              {
                name: "color",
                type: "string",
                default: '"#8b5cf6"',
                description: "Base color of the terrain surface (hex string).",
              },
              {
                name: "resolution",
                type: "number",
                default: "128",
                description:
                  "Grid resolution (vertices per side). Higher values increase detail and GPU cost.",
              },
              {
                name: "className",
                type: "string",
                default: "\u2014",
                description: "Additional CSS classes for the canvas wrapper.",
              },
              {
                name: "height",
                type: "number",
                default: "400",
                description: "Canvas height in pixels.",
              },
            ]}
          />
        </DocSubSection>
      </DocSection>

      {/* Performance */}
      <DocSection id="performance" title="Performance Notes">
        <div className="rounded-xl border border-white/[0.06] bg-zinc-950/50 p-5">
          <ul className="space-y-3 text-sm text-zinc-400">
            {[
              "Noise computation runs in vertex shaders — no CPU-side terrain generation.",
              "Resolution prop directly controls GPU workload — use 64-128 for backgrounds, 256+ for hero elements.",
              "Wireframe mode uses barycentric coordinates in the fragment shader for anti-aliased lines.",
              "Animation uses a single uniform time value — no buffer uploads per frame.",
            ].map((note, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-green-500/10 text-[10px] font-bold text-green-400">
                  {i + 1}
                </span>
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>
      </DocSection>
    </div>
  );
}
