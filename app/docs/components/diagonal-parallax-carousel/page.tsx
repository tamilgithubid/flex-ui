import type { Metadata } from "next";
import { CodeBlock } from "@/components/ui/code-block";
import { DocSection } from "@/components/docs/doc-section";
import { ApiTable } from "@/components/docs/api-table";
import { InstallTabs } from "@/components/docs/install-tabs";
import { DiagonalParallaxCarousel } from "@/components/flexui/diagonal-parallax-carousel";

export const metadata: Metadata = {
  title: "Slanted Diagonal Carousel — FlexUI",
  description: "Slanted angled multi-row infinite marquee carousel with glassmorphic cards and hover zoom.",
};

export default function DiagonalParallaxCarouselDoc() {
  return (
    <div className="min-w-0 flex-1 space-y-14">
      <div>
        <div className="flex items-center gap-2.5">
          <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-cyan-400">
            Layout & Marquee
          </span>
        </div>
        <h1 className="mt-5 text-4xl font-bold tracking-tight text-white">
          Slanted Diagonal Carousel
        </h1>
        <p className="mt-3 max-w-2xl text-lg leading-relaxed text-zinc-400">
          Cinematic slanted multi-track infinite marquee carousel with interactive hover card zooming and dark glassmorphic styling.
        </p>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      <DocSection id="preview" title="Preview">
        <div className="rounded-2xl border border-white/[0.08] bg-zinc-950/60 p-6 backdrop-blur-md">
          <DiagonalParallaxCarousel />
        </div>
      </DocSection>

      <DocSection id="installation" title="Installation">
        <InstallTabs
          cli={
            <CodeBlock code="npx flexui add diagonal-parallax-carousel" filename="Terminal" />
          }
          manual={
            <div className="space-y-4">
              <CodeBlock code="npm install framer-motion lucide-react" filename="Terminal" />
              <CodeBlock
                code={`import { DiagonalParallaxCarousel } from "@/components/flexui/diagonal-parallax-carousel";`}
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
              name: "cards",
              type: "DiagonalCard[]",
              default: "defaultCards",
              description: "Array of card objects to render in marquee rows.",
            },
            {
              name: "angle",
              type: "number",
              default: "-12",
              description: "Degrees of diagonal rotation angle.",
            },
          ]}
        />
      </DocSection>
    </div>
  );
}
