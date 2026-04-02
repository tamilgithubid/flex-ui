import type { Metadata } from "next";
import { CodeBlock } from "@/components/ui/code-block";
import { DocSection, DocSubSection } from "@/components/docs/doc-section";
import { ApiTable } from "@/components/docs/api-table";
import { Sun, Type, Settings2, Sparkles } from "lucide-react";
import { VolumetricTextPlayground } from "./playground";
import { VolumetricTextExamples } from "./examples";

export const metadata: Metadata = {
  title: "Volumetric Text — FlexUI",
  description:
    "3D text with volumetric god-ray lighting powered by WebGPU compute shaders.",
};

export default function VolumetricTextDoc() {
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
          Volumetric Text
        </h1>
        <p className="mt-3 max-w-2xl text-lg leading-relaxed text-zinc-400">
          3D text with volumetric god-ray lighting. WebGPU ray-marching
          creates dramatic light shafts that emanate from behind the text,
          producing cinematic depth and atmosphere.
        </p>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      {/* Preview */}
      <DocSection id="preview" title="Preview">
        <VolumetricTextPlayground />
      </DocSection>

      {/* Examples */}
      <DocSection id="examples" title="Examples">
        <VolumetricTextExamples />
      </DocSection>

      {/* Installation */}
      <DocSection id="installation" title="Installation">
        <div className="space-y-3">
          <CodeBlock
            code="npx flexui add volumetric-text"
            filename="Terminal"
          />
          <p className="text-sm text-zinc-500">
            Installs the component to{" "}
            <code className="rounded bg-zinc-800 px-1.5 py-0.5 text-zinc-300">
              components/flexui/volumetric-text.tsx
            </code>
            . Requires a WebGPU-capable browser.
          </p>
        </div>
      </DocSection>

      {/* Usage */}
      <DocSection id="usage" title="Usage">
        <CodeBlock
          code={`import { VolumetricText } from "@/components/flexui/volumetric-text";

export default function Hero() {
  return (
    <VolumetricText
      text="FLEXUI"
      fontSize={120}
      fontWeight={900}
      lightColor="#fbbf24"
      lightAngle={45}
      rayDensity={0.8}
      className="h-[400px]"
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
              icon: <Sun className="h-4 w-4 text-orange-400" />,
              label: "Volumetric God Rays",
              desc: "GPU ray-marching produces realistic light shafts that stream through and around text geometry.",
            },
            {
              icon: <Type className="h-4 w-4 text-orange-400" />,
              label: "Dynamic Typography",
              desc: "Configurable font size and weight rendered as 3D geometry with proper depth.",
            },
            {
              icon: <Settings2 className="h-4 w-4 text-orange-400" />,
              label: "Light Control",
              desc: "Adjust light color, angle, and ray density to match your scene mood.",
            },
            {
              icon: <Sparkles className="h-4 w-4 text-orange-400" />,
              label: "Cinematic Quality",
              desc: "Film-grade volumetric scattering at 60fps — no post-processing hacks.",
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
            code={`import { VolumetricText } from "@/components/flexui/volumetric-text";`}
            filename="Named export"
          />
        </DocSubSection>

        <DocSubSection id="props" title="Props">
          <ApiTable
            rows={[
              {
                name: "text",
                type: "string",
                default: "\u2014",
                description: "The text string to render with volumetric lighting.",
                required: true,
              },
              {
                name: "fontSize",
                type: "number",
                default: "80",
                description: "Font size in pixels for the 3D text geometry.",
              },
              {
                name: "fontWeight",
                type: "number",
                default: "800",
                description: "Font weight (100-900) for the text geometry.",
              },
              {
                name: "lightColor",
                type: "string",
                default: '"#ffffff"',
                description: "Color of the volumetric god rays (hex string).",
              },
              {
                name: "lightAngle",
                type: "number",
                default: "45",
                description:
                  "Angle of the light source in degrees (0-360).",
              },
              {
                name: "rayDensity",
                type: "number",
                default: "0.6",
                description:
                  "Density of volumetric rays (0-1). Higher values produce thicker, more visible god rays.",
              },
              {
                name: "className",
                type: "string",
                default: "\u2014",
                description: "Additional CSS classes for the canvas container.",
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
              "Ray-marching runs in a WebGPU fragment shader — no CPU-side ray computation.",
              "Text geometry is rasterized once and cached as a depth texture for light occlusion.",
              "Ray density controls the number of marching steps — lower values improve performance on weaker GPUs.",
              "Uses screen-space radial blur for efficient god-ray approximation.",
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
