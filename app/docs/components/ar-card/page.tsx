import type { Metadata } from "next";
import { CodeBlock } from "@/components/ui/code-block";
import { DocSection, DocSubSection } from "@/components/docs/doc-section";
import { ApiTable } from "@/components/docs/api-table";
import { CreditCard, Move3D, Sparkles, MousePointerClick } from "lucide-react";
import { ARCardPlayground } from "./playground";
import { ARCardExamples } from "./examples";

export const metadata: Metadata = {
  title: "AR Card — FlexUI",
  description:
    "3D glass-morphic card for spatial interfaces with floating animation and configurable depth.",
};

export default function ARCardDoc() {
  return (
    <div className="min-w-0 flex-1 space-y-14">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <span className="rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-green-400">
            Spatial
          </span>
          <span className="rounded-full border border-white/[0.06] bg-white/[0.03] px-3 py-1 text-[11px] font-medium text-zinc-500">
            Three.js / R3F
          </span>
        </div>
        <h1 className="mt-5 text-4xl font-bold tracking-tight text-white">
          AR Card
        </h1>
        <p className="mt-3 max-w-2xl text-lg leading-relaxed text-zinc-400">
          3D glass-morphic card for spatial interfaces. Rendered as a Three.js
          mesh with frosted glass material, configurable depth, accent glow,
          and an optional floating animation — perfect for AR overlays and
          spatial dashboards.
        </p>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      {/* Preview */}
      <DocSection id="preview" title="Preview">
        <ARCardPlayground />
      </DocSection>

      {/* Examples */}
      <DocSection id="examples" title="Examples">
        <ARCardExamples />
      </DocSection>

      {/* Installation */}
      <DocSection id="installation" title="Installation">
        <div className="space-y-3">
          <CodeBlock
            code="npx flexui add ar-card"
            filename="Terminal"
          />
          <p className="text-sm text-zinc-500">
            Installs the component to{" "}
            <code className="rounded bg-zinc-800 px-1.5 py-0.5 text-zinc-300">
              components/flexui/ar-card.tsx
            </code>
            . Requires{" "}
            <code className="rounded bg-zinc-800 px-1.5 py-0.5 text-zinc-300">
              @react-three/fiber
            </code>{" "}
            and{" "}
            <code className="rounded bg-zinc-800 px-1.5 py-0.5 text-zinc-300">
              @react-three/drei
            </code>
            . Must be used inside an{" "}
            <code className="rounded bg-zinc-800 px-1.5 py-0.5 text-zinc-300">
              XRScene
            </code>
            .
          </p>
        </div>
      </DocSection>

      {/* Usage */}
      <DocSection id="usage" title="Usage">
        <CodeBlock
          code={`import { XRScene } from "@/components/flexui/xr-scene";
import { ARCard } from "@/components/flexui/ar-card";

export default function SpatialDashboard() {
  return (
    <XRScene enableOrbitControls height={600}>
      <ARCard
        title="Revenue"
        description="$12.4M this quarter"
        position={[-1.5, 0, 0]}
        rotation={[0, 0.2, 0]}
        width={2}
        height={1.2}
        depth={0.05}
        accentColor="#8b5cf6"
        floating
        onClick={() => console.log("Card clicked")}
      />
      <ARCard
        title="Users"
        description="24K active"
        position={[1.5, 0, 0]}
        accentColor="#22d3ee"
        floating
      />
    </XRScene>
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
              icon: <CreditCard className="h-4 w-4 text-green-400" />,
              label: "Glass Morphism",
              desc: "Frosted glass material with transmission, roughness, and refraction for realistic depth.",
            },
            {
              icon: <Move3D className="h-4 w-4 text-green-400" />,
              label: "3D Positioning",
              desc: "Place cards anywhere in 3D space with position and rotation tuples.",
            },
            {
              icon: <Sparkles className="h-4 w-4 text-green-400" />,
              label: "Floating Animation",
              desc: "Optional gentle hover animation using sine-wave Y displacement.",
            },
            {
              icon: <MousePointerClick className="h-4 w-4 text-green-400" />,
              label: "Interactive",
              desc: "Click handler with pointer cursor and hover glow feedback.",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="group/card rounded-xl border border-white/[0.06] bg-zinc-950/50 p-5 transition-all duration-300 hover:border-white/[0.1] hover:bg-zinc-900/40"
            >
              <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-green-500/10 to-emerald-500/10">
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
            code={`import { ARCard } from "@/components/flexui/ar-card";`}
            filename="Named export"
          />
        </DocSubSection>

        <DocSubSection id="props" title="Props">
          <ApiTable
            rows={[
              {
                name: "title",
                type: "string",
                default: "\u2014",
                description: "Card title text rendered on the front face.",
                required: true,
              },
              {
                name: "description",
                type: "string",
                default: "\u2014",
                description: "Card description text below the title.",
              },
              {
                name: "position",
                type: "[number, number, number]",
                default: "[0, 0, 0]",
                description: "3D position in the scene as [x, y, z].",
              },
              {
                name: "rotation",
                type: "[number, number, number]",
                default: "[0, 0, 0]",
                description: "Euler rotation in radians as [x, y, z].",
              },
              {
                name: "width",
                type: "number",
                default: "2",
                description: "Card width in 3D units.",
              },
              {
                name: "height",
                type: "number",
                default: "1.2",
                description: "Card height in 3D units.",
              },
              {
                name: "depth",
                type: "number",
                default: "0.05",
                description: "Card thickness in 3D units.",
              },
              {
                name: "accentColor",
                type: "string",
                default: '"#8b5cf6"',
                description:
                  "Accent glow color for the card edge and hover state.",
              },
              {
                name: "floating",
                type: "boolean",
                default: "false",
                description:
                  "Enable gentle floating animation on the Y axis.",
              },
              {
                name: "onClick",
                type: "() => void",
                default: "\u2014",
                description: "Click handler triggered on pointer down.",
              },
            ]}
          />
        </DocSubSection>
      </DocSection>

      {/* Accessibility */}
      <DocSection id="accessibility" title="Accessibility Notes">
        <div className="rounded-xl border border-white/[0.06] bg-zinc-950/50 p-5">
          <ul className="space-y-3 text-sm text-zinc-400">
            {[
              "Must be used inside an XRScene which provides the R3F Canvas context.",
              "Click interactions use R3F pointer events — keyboard navigation requires a custom focus system.",
              "Title and description are rendered as 3D text — provide a 2D fallback for screen readers.",
              "Floating animation uses requestAnimationFrame — pauses when the tab is not visible.",
            ].map((note, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-green-400" />
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>
      </DocSection>
    </div>
  );
}
