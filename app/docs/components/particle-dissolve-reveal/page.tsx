import type { Metadata } from "next";
import { CodeBlock } from "@/components/ui/code-block";
import { DocSection } from "@/components/docs/doc-section";
import { ApiTable } from "@/components/docs/api-table";
import { InstallTabs } from "@/components/docs/install-tabs";
import { ParticleDissolveReveal } from "@/components/flexui/particle-dissolve-reveal";

export const metadata: Metadata = {
  title: "Particle Pixel Dissolve Reveal — FlexUI",
  description: "Disintegrates cards into glowing floating dust particles with reverse reassembly animation.",
};

export default function ParticleDissolveRevealDoc() {
  return (
    <div className="min-w-0 flex-1 space-y-14">
      <div>
        <div className="flex items-center gap-2.5">
          <span className="rounded-full border border-pink-500/20 bg-pink-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-pink-400">
            Effects & Physics
          </span>
        </div>
        <h1 className="mt-5 text-4xl font-bold tracking-tight text-white">
          Particle Pixel Dissolve Reveal
        </h1>
        <p className="mt-3 max-w-2xl text-lg leading-relaxed text-zinc-400">
          Disintegrates card layout pixels into a high-velocity particle field with smooth spring momentum and instant reassembly.
        </p>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      <DocSection id="preview" title="Preview">
        <div className="rounded-2xl border border-white/[0.08] bg-zinc-950/60 p-6 backdrop-blur-md">
          <ParticleDissolveReveal />
        </div>
      </DocSection>

      <DocSection id="installation" title="Installation">
        <InstallTabs
          cli={
            <CodeBlock code="npx flexui add particle-dissolve-reveal" filename="Terminal" />
          }
          manual={
            <div className="space-y-4">
              <CodeBlock code="npm install framer-motion lucide-react" filename="Terminal" />
              <CodeBlock
                code={`import { ParticleDissolveReveal } from "@/components/flexui/particle-dissolve-reveal";`}
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
              name: "title",
              type: "string",
              default: '"Particle Pixel Dissolve"',
              description: "Card title text.",
            },
            {
              name: "particleCount",
              type: "number",
              default: "48",
              description: "Number of particles emitted on dissolve.",
            },
          ]}
        />
      </DocSection>
    </div>
  );
}
