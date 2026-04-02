import type { Metadata } from "next";
import { CodeBlock } from "@/components/ui/code-block";
import { DocSection, DocSubSection } from "@/components/docs/doc-section";
import { ApiTable } from "@/components/docs/api-table";
import { LayoutGrid, Move3D, Sparkles, Settings2 } from "lucide-react";
import { SpatialMenuPlayground } from "./playground";
import { SpatialMenuExamples } from "./examples";

export const metadata: Metadata = {
  title: "Spatial Menu — FlexUI",
  description:
    "3D menu system for spatial and AR interfaces with configurable layout, spacing, and floating animation.",
};

export default function SpatialMenuDoc() {
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
          Spatial Menu
        </h1>
        <p className="mt-3 max-w-2xl text-lg leading-relaxed text-zinc-400">
          3D menu system for spatial and AR interfaces. Arranges interactive
          menu items in horizontal, vertical, or radial layouts with glass
          morphic styling, configurable spacing, and optional floating
          animation.
        </p>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      {/* Preview */}
      <DocSection id="preview" title="Preview">
        <SpatialMenuPlayground />
      </DocSection>

      {/* Examples */}
      <DocSection id="examples" title="Examples">
        <SpatialMenuExamples />
      </DocSection>

      {/* Installation */}
      <DocSection id="installation" title="Installation">
        <div className="space-y-3">
          <CodeBlock
            code="npx flexui add spatial-menu"
            filename="Terminal"
          />
          <p className="text-sm text-zinc-500">
            Installs the component to{" "}
            <code className="rounded bg-zinc-800 px-1.5 py-0.5 text-zinc-300">
              components/flexui/spatial-menu.tsx
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
import { SpatialMenu } from "@/components/flexui/spatial-menu";

const menuItems = [
  { id: "home", label: "Home", icon: "home", onClick: () => {} },
  { id: "explore", label: "Explore", icon: "compass", onClick: () => {} },
  { id: "profile", label: "Profile", icon: "user", onClick: () => {} },
  { id: "settings", label: "Settings", icon: "settings", onClick: () => {} },
];

export default function SpatialNav() {
  return (
    <XRScene enableOrbitControls height={500}>
      <SpatialMenu
        items={menuItems}
        position={[0, 0, 0]}
        layout="horizontal"
        spacing={0.4}
        itemSize={0.8}
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
              icon: <LayoutGrid className="h-4 w-4 text-green-400" />,
              label: "Multiple Layouts",
              desc: "Horizontal, vertical, and radial arrangements for different spatial contexts.",
            },
            {
              icon: <Move3D className="h-4 w-4 text-green-400" />,
              label: "3D Positioning",
              desc: "Place the entire menu group anywhere in 3D space with a position tuple.",
            },
            {
              icon: <Sparkles className="h-4 w-4 text-green-400" />,
              label: "Floating Animation",
              desc: "Optional staggered floating animation with per-item phase offsets.",
            },
            {
              icon: <Settings2 className="h-4 w-4 text-green-400" />,
              label: "Configurable",
              desc: "Control item size, spacing, accent color, and layout mode via simple props.",
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
            code={`import { SpatialMenu } from "@/components/flexui/spatial-menu";`}
            filename="Named export"
          />
        </DocSubSection>

        <DocSubSection id="props" title="Props">
          <ApiTable
            rows={[
              {
                name: "items",
                type: "MenuItem[]",
                default: "\u2014",
                description:
                  "Array of menu items with id, label, icon, and onClick properties.",
                required: true,
              },
              {
                name: "position",
                type: "[number, number, number]",
                default: "[0, 0, 0]",
                description: "3D position of the menu group as [x, y, z].",
              },
              {
                name: "layout",
                type: '"horizontal" | "vertical" | "radial"',
                default: '"horizontal"',
                description: "Arrangement pattern for the menu items.",
              },
              {
                name: "spacing",
                type: "number",
                default: "0.3",
                description:
                  "Gap between menu items in 3D units.",
              },
              {
                name: "itemSize",
                type: "number",
                default: "0.8",
                description: "Size of each menu item in 3D units.",
              },
              {
                name: "accentColor",
                type: "string",
                default: '"#8b5cf6"',
                description:
                  "Accent color for hover glow and active state.",
              },
              {
                name: "floating",
                type: "boolean",
                default: "false",
                description:
                  "Enable staggered floating animation across menu items.",
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
              "Menu items support pointer events — add keyboard navigation for non-spatial contexts.",
              "Provide a 2D fallback menu for screen readers and keyboard-only users.",
              "Radial layout works best with 3-8 items — more may cause overlap.",
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
