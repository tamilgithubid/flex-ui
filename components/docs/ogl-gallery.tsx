"use client";

import Link from "next/link";
import { useState } from "react";
import { OGLExample } from "@/components/flexui/ogl-example";
import { OGL_EXAMPLES } from "@/lib/ogl-examples";
import { cn } from "@/lib/utils";

const categories = ["All", ...new Set(OGL_EXAMPLES.map(example => example.category))];
export function OGLGallery() {
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const examples = OGL_EXAMPLES.filter(example => (category === "All" || example.category === category) &&
    (example.title + " " + example.description + " " + example.id).toLowerCase().includes(query.toLowerCase().trim()));
  return <section className="space-y-6" aria-label="OGL live examples" id="ogl-examples">
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">OGL collection</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">18 scenes. Real WebGL.</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-400">Original OGL shaders, geometry and assets, with interactive live previews. Drag inside a scene to explore its controls.</p>
      </div>
      <label className="flex flex-col gap-2 text-xs text-zinc-400">Find an OGL example
        <input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search scenes…" className="w-64 max-w-full rounded-lg border border-white/10 bg-zinc-950 px-3 py-2.5 text-sm text-white outline-none focus:border-cyan-400/60" />
      </label>
    </div>
    <div className="flex flex-wrap gap-2" aria-label="OGL categories">
      {categories.map(value => <button key={value} type="button" aria-pressed={category === value} onClick={() => setCategory(value)}
        className={cn("rounded-full border px-3 py-1.5 text-xs transition-colors", category === value ? "border-cyan-400/30 bg-cyan-400/10 text-cyan-300" : "border-white/10 text-zinc-400 hover:text-white")}>{value}</button>)}
    </div>
    <p className="text-xs text-zinc-500" role="status">{examples.length} live examples</p>
    <div className="grid gap-6 xl:grid-cols-2">
      {examples.map(example => <article key={example.id} className="min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/70">
        <OGLExample example={example.id} height={260} dpr={1} className="rounded-none border-0" />
        <div className="space-y-3 border-t border-white/10 p-5">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-lg font-semibold text-white">{example.title}</h3>
            <span className="rounded-full border border-white/10 px-2 py-1 text-[10px] text-zinc-400">{example.category}</span>
          </div>
          <p className="text-sm leading-relaxed text-zinc-400">{example.description}</p>
          <Link href={"/docs/components/ogl-" + example.id} className="inline-flex items-center gap-2 text-sm font-medium text-cyan-300 hover:text-cyan-200">Preview, code and installation <span aria-hidden="true">↗</span></Link>
        </div>
      </article>)}
    </div>
    {!examples.length && <p className="rounded-xl border border-white/10 p-8 text-center text-zinc-400">No OGL examples match this search.</p>}
  </section>;
}
