import type { Metadata } from "next";
import { CodeBlock } from "@/components/ui/code-block";
import { DocSection } from "@/components/docs/doc-section";
import { ApiTable } from "@/components/docs/api-table";
import { ThreeHoverCardPlayground } from "./playground";
import { ThreeHoverCardExamples } from "./examples";

export const metadata: Metadata = {
  title: "3D Hover Card — FlexUI",
  description: "A landscape photo card with smooth spring-based perspective, edge-to-edge image cover and a cinematic glass highlight.",
};

export default function ThreeHoverCardDoc() {
  return (
    <div className="min-w-0 flex-1 space-y-14">
      <header>
        <span className="rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-300">Framer Motion</span>
        <h1 className="mt-5 text-4xl font-bold tracking-tight text-white">3D Hover Card</h1>
        <p className="mt-3 max-w-2xl text-lg leading-relaxed text-zinc-400">
          A cinematic photo card with gentle perspective, spring-smoothed pointer tracking,
          and a glass highlight. Landscape imagery covers the card edge to edge,
          while its surface fills the container. Reduced-motion preferences are respected.
        </p>
      </header>
      <DocSection id="preview" title="Preview"><ThreeHoverCardPlayground /></DocSection>
      <DocSection id="examples" title="Examples"><ThreeHoverCardExamples /></DocSection>
      <DocSection id="installation" title="Installation">
        <CodeBlock code="npx flexui add three-hover-card" filename="Terminal" />
        <p className="mt-3 text-sm text-zinc-400">The registry includes Framer Motion, utilities and the reduced-motion hook.</p>
      </DocSection>
      <DocSection id="usage" title="Usage">
        <CodeBlock code={'import { ThreeHoverCard } from "@/components/flexui/three-hover-card";\n\nexport function Demo() {\n  return <ThreeHoverCard imageSrc="/landscape.jpg" imageAlt="Editorial photograph" imageFit="cover" className="aspect-video h-auto" title="Creative direction" />;\n}'} filename="example.tsx" />
        <p className="mt-3 text-sm text-zinc-400">Use a landscape photograph with <code>className=&quot;aspect-video h-auto&quot;</code>, or <code>className=&quot;h-full&quot;</code> inside a sized layout slot. Adjust <code>imagePosition</code> to keep the subject in frame. Choose <code>imageFit=&quot;contain&quot;</code> when the entire source image must be visible.</p>
      </DocSection>
      <DocSection id="api-reference" title="API Reference">
        <ApiTable rows={[
          { name: "imageSrc", type: "string", default: "Portrait URL", description: "Image URL or a local public asset." },
          { name: "imageAlt", type: "string", default: '"Portrait"', description: "Accessible description of the image." },
          { name: "imageFit", type: '"contain" | "cover"', default: '"cover"', description: "Cover the card edge to edge, or choose contain to keep the entire source visible." },
          { name: "imagePosition", type: "string", default: '"center"', description: "CSS object-position for the photograph." },
          { name: "height", type: "number | string", default: "400px", description: "Optional explicit height. The h-full class can also fill a sized parent." },
          { name: "title", type: "string", default: '"Interactive 3D"', description: "Card heading." },
          { name: "description", type: "string", default: "—", description: "Supporting copy shown over the bottom image scrim." },
          { name: "className", type: "string", default: "—", description: "Container sizing and additional classes." },
          { name: "children", type: "ReactNode", default: "—", description: "Optional content following the description." },
        ]} />
      </DocSection>
    </div>
  );
}
