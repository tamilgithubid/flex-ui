import type { Metadata } from "next";
import { CodeBlock } from "@/components/ui/code-block";
import { DocSection } from "@/components/docs/doc-section";
import { ApiTable } from "@/components/docs/api-table";
import { InstallTabs } from "@/components/docs/install-tabs";
import { BookshelfShowcase } from "@/components/flexui/3d-bookshelf-showcase";

export const metadata: Metadata = {
  title: "3D Virtual Bookshelf — FlexUI",
  description: "3D virtual library shelf with hover book pull-out animation and detail modal overlay.",
};

export default function BookshelfShowcaseDoc() {
  return (
    <div className="min-w-0 flex-1 space-y-14">
      <div>
        <div className="flex items-center gap-2.5">
          <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-amber-400">
            Interactive Showcase
          </span>
        </div>
        <h1 className="mt-5 text-4xl font-bold tracking-tight text-white">
          3D Virtual Bookshelf
        </h1>
        <p className="mt-3 max-w-2xl text-lg leading-relaxed text-zinc-400">
          Virtual library shelf displaying book spines with 3D depth, hover pull-out motion, and cover modal preview overlays.
        </p>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      <DocSection id="preview" title="Preview">
        <div className="rounded-2xl border border-white/[0.08] bg-zinc-950/60 p-6 backdrop-blur-md">
          <BookshelfShowcase />
        </div>
      </DocSection>

      <DocSection id="installation" title="Installation">
        <InstallTabs
          cli={
            <CodeBlock code="npx flexui add 3d-bookshelf-showcase" filename="Terminal" />
          }
          manual={
            <div className="space-y-4">
              <CodeBlock code="npm install framer-motion lucide-react" filename="Terminal" />
              <CodeBlock
                code={`import { BookshelfShowcase } from "@/components/flexui/3d-bookshelf-showcase";`}
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
              name: "books",
              type: "BookItem[]",
              default: "defaultBooks",
              description: "Array of book items with spine color, title, author, rating, synopsis, and cover image.",
            },
          ]}
        />
      </DocSection>
    </div>
  );
}
