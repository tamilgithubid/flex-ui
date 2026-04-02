import type { Metadata } from "next";
import { CodeBlock } from "@/components/ui/code-block";
import { DocSection, DocSubSection } from "@/components/docs/doc-section";
import { ApiTable } from "@/components/docs/api-table";
import { Droplets, Palette, Layers, Zap } from "lucide-react";
import { FluidBackgroundPlayground } from "./playground";
import { FluidBackgroundExamples } from "./examples";

export const metadata: Metadata = {
  title: "Fluid Background — FlexUI",
  description:
    "Real-time fluid simulation via WebGPU for immersive, interactive backgrounds.",
};

export default function FluidBackgroundDoc() {
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
          Fluid Background
        </h1>
        <p className="mt-3 max-w-2xl text-lg leading-relaxed text-zinc-400">
          Real-time fluid simulation via WebGPU. Navier-Stokes driven color
          advection creates organic, flowing backgrounds that respond to mouse
          movement and evolve continuously.
        </p>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      {/* Preview */}
      <DocSection id="preview" title="Preview">
        <FluidBackgroundPlayground />
      </DocSection>

      {/* Examples */}
      <DocSection id="examples" title="Examples">
        <FluidBackgroundExamples />
      </DocSection>

      {/* Installation */}
      <DocSection id="installation" title="Installation">
        <div className="space-y-3">
          <CodeBlock
            code="npx flexui add fluid-background"
            filename="Terminal"
          />
          <p className="text-sm text-zinc-500">
            Installs the component to{" "}
            <code className="rounded bg-zinc-800 px-1.5 py-0.5 text-zinc-300">
              components/flexui/fluid-background.tsx
            </code>
            . Requires a WebGPU-capable browser.
          </p>
        </div>
      </DocSection>

      {/* Usage */}
      <DocSection id="usage" title="Usage">
        <CodeBlock
          code={`import { FluidBackground } from "@/components/flexui/fluid-background";

export default function Hero() {
  return (
    <FluidBackground
      viscosity={0.5}
      speed={1.0}
      colorIntensity={0.8}
      primaryColor="#6366f1"
      secondaryColor="#ec4899"
    >
      <h1 className="text-6xl font-bold text-white">Welcome</h1>
    </FluidBackground>
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
              icon: <Droplets className="h-4 w-4 text-orange-400" />,
              label: "Navier-Stokes Simulation",
              desc: "Full fluid dynamics computed on the GPU — viscosity, pressure, and advection in real time.",
            },
            {
              icon: <Palette className="h-4 w-4 text-orange-400" />,
              label: "Dual Color System",
              desc: "Primary and secondary colors blend through the fluid for rich, organic gradients.",
            },
            {
              icon: <Layers className="h-4 w-4 text-orange-400" />,
              label: "Content Overlay",
              desc: "Pass children to render content on top of the simulation — perfect for hero sections.",
            },
            {
              icon: <Zap className="h-4 w-4 text-orange-400" />,
              label: "GPU Accelerated",
              desc: "WebGPU compute shaders handle all simulation steps with zero main-thread cost.",
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
            code={`import { FluidBackground } from "@/components/flexui/fluid-background";`}
            filename="Named export"
          />
        </DocSubSection>

        <DocSubSection id="props" title="Props">
          <ApiTable
            rows={[
              {
                name: "viscosity",
                type: "number",
                default: "0.5",
                description:
                  "Fluid viscosity (0-1). Lower values create more turbulent flow.",
              },
              {
                name: "speed",
                type: "number",
                default: "1.0",
                description: "Simulation speed multiplier.",
              },
              {
                name: "colorIntensity",
                type: "number",
                default: "0.8",
                description:
                  "Intensity of color advection (0-1). Higher values produce more vivid colors.",
              },
              {
                name: "primaryColor",
                type: "string",
                default: '"#6366f1"',
                description: "Primary fluid color (hex string).",
              },
              {
                name: "secondaryColor",
                type: "string",
                default: '"#ec4899"',
                description: "Secondary fluid color (hex string).",
              },
              {
                name: "className",
                type: "string",
                default: "\u2014",
                description: "Additional CSS classes for the container.",
              },
              {
                name: "children",
                type: "React.ReactNode",
                default: "\u2014",
                description:
                  "Content rendered on top of the fluid simulation.",
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
              "Navier-Stokes solver runs entirely in WebGPU compute shaders — no CPU physics.",
              "Color advection uses ping-pong buffer strategy for efficient GPU memory usage.",
              "Mouse interaction injects velocity splats without CPU readback.",
              "Automatically pauses simulation when the component is not visible (Intersection Observer).",
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
