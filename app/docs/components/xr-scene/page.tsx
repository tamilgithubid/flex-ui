import type { Metadata } from "next";
import { CodeBlock } from "@/components/ui/code-block";
import { DocSection, DocSubSection } from "@/components/docs/doc-section";
import { ApiTable } from "@/components/docs/api-table";
import { Box, Orbit, Camera, Layers } from "lucide-react";
import { XRScenePlayground } from "./playground";
import { XRSceneExamples } from "./examples";

export const metadata: Metadata = {
  title: "XR Scene — FlexUI",
  description:
    "Base scene wrapper for 3D and AR components with orbit controls, environment maps, and AR session support.",
};

export default function XRSceneDoc() {
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
          XR Scene
        </h1>
        <p className="mt-3 max-w-2xl text-lg leading-relaxed text-zinc-400">
          Base scene wrapper for 3D and AR components. Provides a pre-configured
          React Three Fiber canvas with orbit controls, environment lighting,
          configurable camera, and optional WebXR AR session support.
        </p>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      {/* Preview */}
      <DocSection id="preview" title="Preview">
        <XRScenePlayground />
      </DocSection>

      {/* Examples */}
      <DocSection id="examples" title="Examples">
        <XRSceneExamples />
      </DocSection>

      {/* Installation */}
      <DocSection id="installation" title="Installation">
        <div className="space-y-3">
          <CodeBlock
            code="npx flexui add xr-scene"
            filename="Terminal"
          />
          <p className="text-sm text-zinc-500">
            Installs the component to{" "}
            <code className="rounded bg-zinc-800 px-1.5 py-0.5 text-zinc-300">
              components/flexui/xr-scene.tsx
            </code>
            . Installs{" "}
            <code className="rounded bg-zinc-800 px-1.5 py-0.5 text-zinc-300">
              @react-three/fiber
            </code>{" "}
            and{" "}
            <code className="rounded bg-zinc-800 px-1.5 py-0.5 text-zinc-300">
              @react-three/drei
            </code>{" "}
            as dependencies.
          </p>
        </div>
      </DocSection>

      {/* Usage */}
      <DocSection id="usage" title="Usage">
        <CodeBlock
          code={`import { XRScene } from "@/components/flexui/xr-scene";
import { ARCard } from "@/components/flexui/ar-card";

export default function SpatialUI() {
  return (
    <XRScene
      enableAR
      enableOrbitControls
      backgroundColor="#09090b"
      cameraPosition={[0, 2, 5]}
      environment="city"
      className="rounded-xl"
      height={600}
      fallback={<div className="bg-zinc-900 rounded-xl h-[600px]" />}
    >
      <ARCard title="Welcome" description="A spatial interface" />
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
              icon: <Box className="h-4 w-4 text-green-400" />,
              label: "R3F Canvas",
              desc: "Pre-configured React Three Fiber canvas with proper sizing, DPR, and tone mapping.",
            },
            {
              icon: <Orbit className="h-4 w-4 text-green-400" />,
              label: "Orbit Controls",
              desc: "Optional OrbitControls with damping for smooth camera rotation and zoom.",
            },
            {
              icon: <Camera className="h-4 w-4 text-green-400" />,
              label: "AR Session",
              desc: "Enable WebXR AR sessions with a single prop — camera passthrough and hit testing included.",
            },
            {
              icon: <Layers className="h-4 w-4 text-green-400" />,
              label: "Environment Maps",
              desc: "Built-in HDR environment presets for realistic reflections and ambient lighting.",
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
            code={`import { XRScene } from "@/components/flexui/xr-scene";`}
            filename="Named export"
          />
        </DocSubSection>

        <DocSubSection id="props" title="Props">
          <ApiTable
            rows={[
              {
                name: "children",
                type: "React.ReactNode",
                default: "\u2014",
                description: "3D components to render inside the scene.",
                required: true,
              },
              {
                name: "enableAR",
                type: "boolean",
                default: "false",
                description:
                  "Enable WebXR AR session support with camera passthrough.",
              },
              {
                name: "enableOrbitControls",
                type: "boolean",
                default: "true",
                description:
                  "Enable OrbitControls for camera rotation and zoom.",
              },
              {
                name: "backgroundColor",
                type: "string",
                default: '"#000000"',
                description: "Scene background color (hex string).",
              },
              {
                name: "cameraPosition",
                type: "[number, number, number]",
                default: "[0, 0, 5]",
                description: "Initial camera position as [x, y, z] tuple.",
              },
              {
                name: "environment",
                type: "string",
                default: "\u2014",
                description:
                  'HDR environment preset name (e.g. "city", "sunset", "studio").',
              },
              {
                name: "className",
                type: "string",
                default: "\u2014",
                description: "Additional CSS classes for the canvas wrapper.",
              },
              {
                name: "height",
                type: "number",
                default: "500",
                description: "Canvas height in pixels.",
              },
              {
                name: "fallback",
                type: "React.ReactNode",
                default: "\u2014",
                description:
                  "Element rendered when WebGL/WebXR is not available.",
              },
            ]}
          />
        </DocSubSection>
      </DocSection>

      {/* Performance */}
      <DocSection id="performance" title="Performance Notes">
        <div className="rounded-xl border border-white/[0.06] bg-zinc-950/50 p-5">
          <ul className="space-y-3 text-sm text-zinc-400">
            {[
              "Canvas uses automatic DPR clamping (max 2) to prevent over-rendering on high-DPI displays.",
              "OrbitControls uses enableDamping for smooth deceleration without continuous re-renders.",
              "Environment maps are loaded once and cached by @react-three/drei.",
              "Fallback detection runs once on mount — no continuous feature probing.",
            ].map((note, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-green-500/10 text-[10px] font-bold text-green-400">
                  {i + 1}
                </span>
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>
      </DocSection>
    </div>
  );
}
