import type { Metadata } from "next";
import { CodeBlock } from "@/components/ui/code-block";
import { DocSection, DocSubSection } from "@/components/docs/doc-section";
import { ApiTable } from "@/components/docs/api-table";
import { Zap, Cpu, Settings2, Layers } from "lucide-react";
import { GPUParticleFieldPlayground } from "./playground";
import { GPUParticleFieldExamples } from "./examples";

export const metadata: Metadata = {
  title: "GPU Particle Field — FlexUI",
  description:
    "100K+ particle system powered by WebGPU compute shaders with real-time attractor physics and turbulence.",
};

export default function GPUParticleFieldDoc() {
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
          GPU Particle Field
        </h1>
        <p className="mt-3 max-w-2xl text-lg leading-relaxed text-zinc-400">
          100K+ particle system powered by WebGPU compute shaders. Real-time
          attractor physics, turbulence fields, and smooth damping — all
          running entirely on the GPU with zero main-thread overhead.
        </p>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      {/* Preview */}
      <DocSection id="preview" title="Preview">
        <GPUParticleFieldPlayground />
      </DocSection>

      {/* Examples */}
      <DocSection id="examples" title="Examples">
        <GPUParticleFieldExamples />
      </DocSection>

      {/* Installation */}
      <DocSection id="installation" title="Installation">
        <div className="space-y-3">
          <CodeBlock
            code="npx flexui add gpu-particle-field"
            filename="Terminal"
          />
          <p className="text-sm text-zinc-500">
            Installs the component to{" "}
            <code className="rounded bg-zinc-800 px-1.5 py-0.5 text-zinc-300">
              components/flexui/gpu-particle-field.tsx
            </code>
            . Requires a WebGPU-capable browser.
          </p>
        </div>
      </DocSection>

      {/* Usage */}
      <DocSection id="usage" title="Usage">
        <CodeBlock
          code={`import { GPUParticleField } from "@/components/flexui/gpu-particle-field";

export default function Hero() {
  return (
    <GPUParticleField
      count={100000}
      attractorStrength={0.5}
      turbulence={0.3}
      damping={0.95}
      color="#8b5cf6"
      width={800}
      height={600}
      fallback={<div className="bg-zinc-900 w-full h-full" />}
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
              icon: <Zap className="h-4 w-4 text-orange-400" />,
              label: "WebGPU Compute",
              desc: "All particle physics run in compute shaders — zero main-thread overhead even at 100K+ particles.",
            },
            {
              icon: <Cpu className="h-4 w-4 text-orange-400" />,
              label: "Attractor Physics",
              desc: "Configurable attractor strength pulls particles toward focal points with smooth damping.",
            },
            {
              icon: <Settings2 className="h-4 w-4 text-orange-400" />,
              label: "Turbulence Fields",
              desc: "GPU-driven noise turbulence creates organic, fluid-like particle motion.",
            },
            {
              icon: <Layers className="h-4 w-4 text-orange-400" />,
              label: "Graceful Fallback",
              desc: "Renders a fallback element on browsers without WebGPU support.",
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
            code={`import { GPUParticleField } from "@/components/flexui/gpu-particle-field";`}
            filename="Named export"
          />
        </DocSubSection>

        <DocSubSection id="props" title="Props">
          <ApiTable
            rows={[
              {
                name: "count",
                type: "number",
                default: "50000",
                description: "Number of particles to simulate.",
              },
              {
                name: "attractorStrength",
                type: "number",
                default: "0.5",
                description:
                  "Force multiplier pulling particles toward the attractor point.",
              },
              {
                name: "turbulence",
                type: "number",
                default: "0.3",
                description:
                  "Intensity of GPU noise-based turbulence applied to particle motion.",
              },
              {
                name: "damping",
                type: "number",
                default: "0.95",
                description:
                  "Velocity damping factor per frame (0-1). Higher values preserve momentum.",
              },
              {
                name: "color",
                type: "string",
                default: '"#ffffff"',
                description: "Base color of the particles (hex string).",
              },
              {
                name: "className",
                type: "string",
                default: "\u2014",
                description: "Additional CSS classes for the canvas wrapper.",
              },
              {
                name: "width",
                type: "number",
                default: "800",
                description: "Canvas width in pixels.",
              },
              {
                name: "height",
                type: "number",
                default: "600",
                description: "Canvas height in pixels.",
              },
              {
                name: "fallback",
                type: "React.ReactNode",
                default: "\u2014",
                description:
                  "Element rendered when WebGPU is not available in the browser.",
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
              "All particle physics run in WebGPU compute shaders — the JS main thread only dispatches GPU commands.",
              "Particle state is stored in GPU buffers — no CPU readback needed per frame.",
              "Rendering uses instanced draw calls for maximum throughput.",
              "Automatically detects WebGPU support and renders the fallback prop if unavailable.",
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
