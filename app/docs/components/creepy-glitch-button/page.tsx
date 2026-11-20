import type { Metadata } from "next";
import { CodeBlock } from "@/components/ui/code-block";
import { DocSection } from "@/components/docs/doc-section";
import { ApiTable } from "@/components/docs/api-table";
import { InstallTabs } from "@/components/docs/install-tabs";
import { CreepyGlitchButton } from "@/components/flexui/creepy-glitch-button";

export const metadata: Metadata = {
  title: "Creepy Cyberpunk Glitch Button — FlexUI",
  description: "Cyberpunk horror glitch button with real-time cursor-tracking pupils and text scramble animation.",
};

export default function CreepyGlitchButtonDoc() {
  return (
    <div className="min-w-0 flex-1 space-y-14">
      <div>
        <div className="flex items-center gap-2.5">
          <span className="rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-red-400">
            Buttons & Effects
          </span>
        </div>
        <h1 className="mt-5 text-4xl font-bold tracking-tight text-white">
          Creepy Cyberpunk Glitch Button
        </h1>
        <p className="mt-3 max-w-2xl text-lg leading-relaxed text-zinc-400">
          Cyberpunk horror aesthetic button featuring real-time eye pupil tracking, eerie text scramble hover state, and screen glitch pulses.
        </p>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      <DocSection id="preview" title="Preview">
        <div className="rounded-2xl border border-white/[0.08] bg-zinc-950/60 p-6 backdrop-blur-md">
          <CreepyGlitchButton />
        </div>
      </DocSection>

      <DocSection id="installation" title="Installation">
        <InstallTabs
          cli={
            <CodeBlock code="npx flexui add creepy-glitch-button" filename="Terminal" />
          }
          manual={
            <div className="space-y-4">
              <CodeBlock code="npm install framer-motion lucide-react" filename="Terminal" />
              <CodeBlock
                code={`import { CreepyGlitchButton } from "@/components/flexui/creepy-glitch-button";`}
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
              name: "children",
              type: "React.ReactNode",
              default: '"SYSTEM OVERRIDE"',
              description: "Default button label.",
            },
            {
              name: "glitchText",
              type: "string",
              default: '"D O N O T C L I C K"',
              description: "Eerie text displayed on hover.",
            },
            {
              name: "onClick",
              type: "() => void",
              default: "undefined",
              description: "Click event handler.",
            },
          ]}
        />
      </DocSection>
    </div>
  );
}
