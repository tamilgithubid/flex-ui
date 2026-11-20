import type { Metadata } from "next";
import { CodeBlock } from "@/components/ui/code-block";
import { DocSection } from "@/components/docs/doc-section";
import { ApiTable } from "@/components/docs/api-table";
import { InstallTabs } from "@/components/docs/install-tabs";
import { MorphingFolderPreview } from "@/components/flexui/morphing-folder-preview";

export const metadata: Metadata = {
  title: "Morphing Folder Stack — FlexUI",
  description: "Interactive file folder component that morphs into an expanded file card grid on click.",
};

export default function MorphingFolderPreviewDoc() {
  return (
    <div className="min-w-0 flex-1 space-y-14">
      <div>
        <div className="flex items-center gap-2.5">
          <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-400">
            UI Components
          </span>
        </div>
        <h1 className="mt-5 text-4xl font-bold tracking-tight text-white">
          Morphing Folder Stack
        </h1>
        <p className="mt-3 max-w-2xl text-lg leading-relaxed text-zinc-400">
          Interactive file folder component that smooth-morphs from a compact stacked folder into a multi-card file grid.
        </p>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      <DocSection id="preview" title="Preview">
        <div className="rounded-2xl border border-white/[0.08] bg-zinc-950/60 p-6 backdrop-blur-md">
          <MorphingFolderPreview />
        </div>
      </DocSection>

      <DocSection id="installation" title="Installation">
        <InstallTabs
          cli={
            <CodeBlock code="npx flexui add morphing-folder-preview" filename="Terminal" />
          }
          manual={
            <div className="space-y-4">
              <CodeBlock code="npm install framer-motion lucide-react" filename="Terminal" />
              <CodeBlock
                code={`import { MorphingFolderPreview } from "@/components/flexui/morphing-folder-preview";`}
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
              name: "folderName",
              type: "string",
              default: '"Project Assets & Specs"',
              description: "Title of the folder.",
            },
            {
              name: "files",
              type: "FolderFileItem[]",
              default: "defaultFiles",
              description: "Array of files contained within the folder.",
            },
          ]}
        />
      </DocSection>
    </div>
  );
}
