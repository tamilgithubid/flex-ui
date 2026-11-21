import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import Link from "next/link";
import { CodeBlock } from "@/components/ui/code-block";
import { ApiTable } from "./api-table";
import { DocSection } from "./doc-section";
import { WebGLPlayground } from "./webgl-playground";
import { getWebGLComponent, type WebGLComponentId } from "@/lib/webgl-components";

export function webglMetadata(id: WebGLComponentId): Metadata {
  const component = getWebGLComponent(id)!;
  return { title: component.title, description: component.description };
}
export function WebGLComponentDoc({ component: id }: { component: WebGLComponentId }) {
  const component = getWebGLComponent(id)!;
  const scene = fs.readFileSync(path.join(process.cwd(), "components/flexui/webgl/scenes", id + ".js"), "utf8");
  const reactSource = fs.readFileSync(path.join(process.cwd(), "components/flexui", id + ".tsx"), "utf8");
  return <div className="min-w-0 flex-1 space-y-12">
    <header>
      <Link href="/docs/components/webgl" className="text-sm text-cyan-400 hover:text-cyan-300">← WebGL components</Link>
      <div className="mt-6 flex flex-wrap gap-2">
        <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-300">WebGL</span>
        <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-400">{component.category}</span>
      </div>
      <h1 className="mt-5 text-4xl font-bold tracking-tight text-white">{component.title}</h1>
      <p className="mt-3 max-w-2xl text-lg leading-relaxed text-zinc-400">{component.description}</p>
    </header>
    <DocSection id="preview" title="Preview"><WebGLPlayground component={id} /></DocSection>
    <DocSection id="installation" title="Installation">
      <CodeBlock code={"npx flexui add " + id + "\nnode scripts/flexui-webgl-assets.mjs " + id} filename="Terminal" />
      <p className="mt-4 text-sm leading-relaxed text-zinc-400">Install the component and shared canvas runtime, then prepare its models and textures. Assets are verified and served from your own public folder. FlexUI prepares them automatically when development or a build starts.</p>
    </DocSection>
    <DocSection id="react-source" title="Component source"><CodeBlock code={reactSource} filename={id + ".tsx"} /></DocSection>
    <DocSection id="api-reference" title="Props">
      <ApiTable rows={[
        { name: "height", type: "number | string", default: "480", description: "Canvas height in pixels or a CSS length. Width follows the container." },
        { name: "autoPlay", type: "boolean", default: "true", description: "Animate while visible. Reduced-motion preferences show a still frame until Play is pressed." },
        { name: "dpr", type: "number", default: "1.5", description: "Drawing pixel ratio, clamped to 0.5–2. Lower values reduce GPU work." },
        { name: "showControls", type: "boolean", default: "true", description: "Show play/pause, restart and full-screen buttons." },
        { name: "assetPath", type: "string", default: '"/webgl"', description: "Public folder containing the installed assets/ directory." },
        { name: "className", type: "string", default: "—", description: "Additional classes for the component container." },
      ]} />
    </DocSection>
    <DocSection id="scene-source" title="Rendering and shaders">
      <p className="mb-4 text-sm leading-relaxed text-zinc-400">Customize the geometry, materials, camera, animation and GLSL below. The canvas renders directly inside the component and responds to its container size.</p>
      <details className="overflow-hidden rounded-xl border border-white/10">
        <summary className="cursor-pointer px-5 py-4 text-sm font-medium text-zinc-300">Read complete rendering source</summary>
        <div className="max-h-[640px] overflow-auto"><CodeBlock code={scene} filename={id + ".js"} language="javascript" /></div>
      </details>
    </DocSection>
  </div>;
}
