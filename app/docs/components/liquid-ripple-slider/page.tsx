import type { Metadata } from "next";
import { CodeBlock } from "@/components/ui/code-block";
import { DocSection } from "@/components/docs/doc-section";
import { ApiTable } from "@/components/docs/api-table";
import { InstallTabs } from "@/components/docs/install-tabs";
import { LiquidRippleSlider } from "@/components/flexui/liquid-ripple-slider";

export const metadata: Metadata = {
  title: "Liquid Ripple Displacement Slider — FlexUI",
  description: "Interactive slider with liquid ripple displacement wave animation on drag or click.",
};

export default function LiquidRippleSliderDoc() {
  return (
    <div className="min-w-0 flex-1 space-y-14">
      <div>
        <div className="flex items-center gap-2.5">
          <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-blue-400">
            Shaders & Motion
          </span>
        </div>
        <h1 className="mt-5 text-4xl font-bold tracking-tight text-white">
          Liquid Ripple Displacement Slider
        </h1>
        <p className="mt-3 max-w-2xl text-lg leading-relaxed text-zinc-400">
          Fluid liquid ripple transition between high-res image slides on drag or click with glowing ring feedback.
        </p>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      <DocSection id="preview" title="Preview">
        <div className="rounded-2xl border border-white/[0.08] bg-zinc-950/60 p-6 backdrop-blur-md">
          <LiquidRippleSlider />
        </div>
      </DocSection>

      <DocSection id="installation" title="Installation">
        <InstallTabs
          cli={
            <CodeBlock code="npx flexui add liquid-ripple-slider" filename="Terminal" />
          }
          manual={
            <div className="space-y-4">
              <CodeBlock code="npm install framer-motion lucide-react" filename="Terminal" />
              <CodeBlock
                code={`import { LiquidRippleSlider } from "@/components/flexui/liquid-ripple-slider";`}
                filename="Import usage"
                language="tsx"
              />
            </div>
          }
        />
      </DocSection>

      <DocSection id="api-reference" title="API Reference">
        <ApiTable
          rows={[
            {
              name: "slides",
              type: "LiquidSlide[]",
              default: "defaultSlides",
              description: "Array of slides containing id, title, subtitle, image, and tag.",
            },
          ]}
        />
      </DocSection>
    </div>
  );
}
