"use client";

import Link from "next/link";
import { useState } from "react";
import { WEBGL_COMPONENTS } from "@/lib/webgl-components";
import { cn } from "@/lib/utils";
import { webglPreviews } from "./webgl-previews";

const categories = ["All", ...new Set(WEBGL_COMPONENTS.map(component => component.category))];
export function WebGLGallery() {
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const components = WEBGL_COMPONENTS.filter(component => (category === "All" || component.category === category) &&
    (component.title + " " + component.description + " " + component.id).toLowerCase().includes(query.toLowerCase().trim()));
  return <section className="space-y-6" aria-label="WebGL components" id="webgl-components">
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">FlexUI WebGL</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">A new dimension for your interface.</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-400">18 interactive components. Live previews, editable shaders and copyable React code.</p>
      </div>
      <label className="flex flex-col gap-2 text-xs text-zinc-400">Find a WebGL component
        <input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search components…" className="w-64 max-w-full rounded-lg border border-white/10 bg-zinc-950 px-3 py-2.5 text-sm text-white outline-none focus:border-cyan-400/60" />
      </label>
    </div>
    <div className="flex flex-wrap gap-2" aria-label="WebGL categories">
      {categories.map(value => <button key={value} type="button" aria-pressed={category === value} onClick={() => setCategory(value)}
        className={cn("rounded-full border px-3 py-1.5 text-xs transition-colors", category === value ? "border-cyan-400/30 bg-cyan-400/10 text-cyan-300" : "border-white/10 text-zinc-400 hover:text-white")}>{value}</button>)}
    </div>
    <p className="text-xs text-zinc-500" role="status">{components.length} components</p>
    <div className="grid gap-6 xl:grid-cols-2">
      {components.map(component => {
        const Preview = webglPreviews[component.id];
        return <article key={component.id} className="min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/70">
          <Preview height={260} dpr={1} className="rounded-none border-0" />
          <div className="space-y-3 border-t border-white/10 p-5">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-lg font-semibold text-white">{component.title}</h3>
              <span className="rounded-full border border-white/10 px-2 py-1 text-[10px] text-zinc-400">{component.category}</span>
            </div>
            <p className="text-sm leading-relaxed text-zinc-400">{component.description}</p>
            <Link href={"/docs/components/" + component.id} className="inline-flex items-center gap-2 text-sm font-medium text-cyan-300 hover:text-cyan-200">View component <span aria-hidden="true">→</span></Link>
          </div>
        </article>;
      })}
    </div>
    {!components.length && <p className="rounded-xl border border-white/10 p-8 text-center text-zinc-400">No components match this search.</p>}
  </section>;
}
