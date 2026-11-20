import type { Metadata } from "next";
import { CodeBlock } from "@/components/ui/code-block";
import { DocSection, DocSubSection } from "@/components/docs/doc-section";
import { ApiTable } from "@/components/docs/api-table";
import { InstallTabs } from "@/components/docs/install-tabs";
import { InteractiveBook3D } from "@/components/flexui/interactive-book-3d";

export const metadata: Metadata = {
  title: "3D Interactive Book — FlexUI",
  description: "Realistic 3D hardcover book page-flip animation component built with Framer Motion and 3D transforms.",
};

export default function InteractiveBook3DDoc() {
  return (
    <div className="min-w-0 flex-1 space-y-14">
      <div>
        <div className="flex items-center gap-2.5">
          <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-cyan-400">
            Interactive
          </span>
          <span className="rounded-full border border-white/[0.06] bg-white/[0.03] px-3 py-1 text-[11px] font-medium text-zinc-500">
            Framer Motion 3D
          </span>
        </div>
        <h1 className="mt-5 text-4xl font-bold tracking-tight text-white">
          3D Interactive Book
        </h1>
        <p className="mt-3 max-w-2xl text-lg leading-relaxed text-zinc-400">
          A 3D hardcover book interface with page-flipping physics, cover open/close transitions, bookmarking, and multi-page content support.
        </p>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      <DocSection id="preview" title="Preview">
        <div className="rounded-2xl border border-white/[0.08] bg-zinc-950/60 p-6 backdrop-blur-md">
          <InteractiveBook3D />
        </div>
      </DocSection>

      <DocSection id="installation" title="Installation">
        <InstallTabs
          cli={
            <CodeBlock code="npx flexui add interactive-book-3d" filename="Terminal" />
          }
          manual={
            <div className="space-y-4">
              <CodeBlock code="npm install framer-motion lucide-react" filename="Terminal" />
              <CodeBlock
                code={`import { InteractiveBook3D } from "@/components/flexui/interactive-book-3d";`}
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
              name: "coverTitle",
              type: "string",
              default: '"FLUID UI SYSTEMS"',
              description: "Book cover title text.",
            },
            {
              name: "coverAuthor",
              type: "string",
              default: '"By FlexUI Studio"',
              description: "Author name displayed on cover.",
            },
            {
              name: "pages",
              type: "BookPage[]",
              default: "defaultPages",
              description: "Array of page objects containing title, subtitle, image, and content.",
            },
          ]}
        />
      </DocSection>
    </div>
  );
}
