import type { Metadata } from "next";
import { CodeBlock } from "@/components/ui/code-block";
import { DocSection } from "@/components/docs/doc-section";
import { ApiTable } from "@/components/docs/api-table";
import { InstallTabs } from "@/components/docs/install-tabs";
import { Perspective3DCarousel } from "@/components/flexui/perspective-3d-carousel";

export const metadata: Metadata = {
  title: "3D Perspective Carousel — FlexUI",
  description: "Coverflow-style 3D perspective card carousel with smooth depth scale and neon border glow.",
};

export default function Perspective3DCarouselDoc() {
  return (
    <div className="min-w-0 flex-1 space-y-14">
      <div>
        <div className="flex items-center gap-2.5">
          <span className="rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-purple-400">
            3D Motion
          </span>
        </div>
        <h1 className="mt-5 text-4xl font-bold tracking-tight text-white">
          3D Perspective Carousel
        </h1>
        <p className="mt-3 max-w-2xl text-lg leading-relaxed text-zinc-400">
          Angled 3D coverflow carousel with depth perspective scaling, center card highlight glow, and smooth spring transitions.
        </p>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      <DocSection id="preview" title="Preview">
        <div className="rounded-2xl border border-white/[0.08] bg-zinc-950/60 p-6 backdrop-blur-md">
          <Perspective3DCarousel />
        </div>
      </DocSection>

      <DocSection id="installation" title="Installation">
        <InstallTabs
          cli={
            <CodeBlock code="npx flexui add perspective-3d-carousel" filename="Terminal" />
          }
          manual={
            <div className="space-y-4">
              <CodeBlock code="npm install framer-motion lucide-react" filename="Terminal" />
              <CodeBlock
                code={`import { Perspective3DCarousel } from "@/components/flexui/perspective-3d-carousel";`}
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
              name: "items",
              type: "PerspectiveCardItem[]",
              default: "defaultItems",
              description: "Array of cards containing id, title, category, image, and description.",
            },
          ]}
        />
      </DocSection>
    </div>
  );
}
