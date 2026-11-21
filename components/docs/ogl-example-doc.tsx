import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import Link from "next/link";
import { CodeBlock } from "@/components/ui/code-block";
import { ApiTable } from "./api-table";
import { DocSection } from "./doc-section";
import { OGLPlayground } from "./ogl-playground";
import { getOGLExample, oglSourceUrl, type OGLExampleId } from "@/lib/ogl-examples";

export function oglMetadata(id: OGLExampleId): Metadata {
  const example = getOGLExample(id)!;
  return { title: example.title + " · OGL", description: example.description };
}
export function OGLExampleDoc({ example: id }: { example: OGLExampleId }) {
  const example = getOGLExample(id)!;
  const scene = fs.readFileSync(path.join(process.cwd(), "public/ogl/examples", id + ".html"), "utf8");
  const reactSource = fs.readFileSync(path.join(process.cwd(), "components/flexui", "ogl-" + id + ".tsx"), "utf8");
  return <div className="min-w-0 flex-1 space-y-12">
    <header>
      <Link href="/docs/components/ogl" className="text-sm text-cyan-400 hover:text-cyan-300">← All OGL examples</Link>
      <div className="mt-6 flex flex-wrap gap-2">
        <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-300">OGL 1.0.11</span>
        <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-400">{example.category}</span>
      </div>
      <h1 className="mt-5 text-4xl font-bold tracking-tight text-white">{example.title}</h1>
      <p className="mt-3 max-w-2xl text-lg leading-relaxed text-zinc-400">{example.description}</p>
      <div className="mt-5 flex flex-wrap gap-5 text-sm">
        <a href={"https://oframe.github.io/ogl/examples/?src=" + id + ".html"} target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:text-cyan-200">Original live example ↗</a>
        <a href={oglSourceUrl(id)} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white">Pinned upstream source ↗</a>
      </div>
    </header>
    <DocSection id="preview" title="Live preview"><OGLPlayground example={id} /></DocSection>
    <DocSection id="installation" title="Installation">
      <CodeBlock code={"npx flexui add ogl-" + id + "\nnode scripts/flexui-ogl-assets.mjs " + id} filename="Terminal" />
      <p className="mt-4 text-sm leading-relaxed text-zinc-400">The first command installs the React component, local OGL modules and scene source. The second downloads the pinned models, textures and fonts, verifies their checksums and skips matching files. Restart your development server after installing. FlexUI itself prepares these assets automatically when development or a build starts.</p>
    </DocSection>
    <DocSection id="react-source" title="React component"><CodeBlock code={reactSource} filename={"ogl-" + id + ".tsx"} /></DocSection>
    <DocSection id="api-reference" title="Props">
      <ApiTable rows={[
        { name: "height", type: "number | string", default: "480", description: "Preview height in pixels or a CSS length. Width follows the container." },
        { name: "autoPlay", type: "boolean", default: "true", description: "Animate while visible. Reduced-motion preferences show a still frame until Play is pressed." },
        { name: "dpr", type: "number", default: "1.5", description: "Drawing pixel ratio, clamped to 0.5–2. Use 2 for the original example resolution." },
        { name: "showControls", type: "boolean", default: "true", description: "Show play/pause, restart and full-screen buttons." },
        { name: "basePath", type: "string", default: '"/ogl"', description: "Public folder containing the installed OGL runtime and examples." },
        { name: "className", type: "string", default: "—", description: "Additional classes for the preview container." },
      ]} />
    </DocSection>
    <DocSection id="scene-source" title="Scene source">
      <p className="mb-4 text-sm leading-relaxed text-zinc-400">This is the locally hosted upstream scene. FlexUI adds a lifecycle bridge and configurable pixel ratio; the original shaders, geometry, materials, camera setup, interactions and on-screen credits are preserved.</p>
      <details className="overflow-hidden rounded-xl border border-white/10">
        <summary className="cursor-pointer px-5 py-4 text-sm font-medium text-zinc-300">Read the complete {id}.html source</summary>
        <div className="max-h-[640px] overflow-auto"><CodeBlock code={scene} filename={id + ".html"} language="html" /></div>
      </details>
    </DocSection>
    <DocSection id="attribution" title="Credits and behavior">
      <p className="text-sm leading-relaxed text-zinc-400">OGL by Nathan Gordon and contributors. Original asset credits are retained inside the scene and in <a className="text-cyan-300" href="/ogl/ATTRIBUTION.md" target="_blank" rel="noopener noreferrer">the attribution file</a>. Previews resize with their container, unload when off-screen, pause when the tab is hidden and release their own rendering context on disposal.</p>
    </DocSection>
  </div>;
}
