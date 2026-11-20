import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { DropdownMenu } from "@/components/flexui/dropdown-menu";
import { Popover } from "@/components/flexui/popover";
import { ParallaxDepthCard } from "@/components/flexui/parallax-depth-card";
import { LiveCodePreview } from "@/components/studio/live-preview";

const initialCode = 'export default function Demo() { const label = "Isolated preview"; return <div>{label}</div>; }';

function Fixture() {
  const [draft, setDraft] = useState(initialCode);
  const [code, setCode] = useState(initialCode);
  const [layers, setLayers] = useState(1);
  return (
    <main className="mx-auto max-w-4xl p-8 text-white">
      <div className="flex gap-8">
        <div data-testid="menu-example" className="flex h-48 w-80 justify-end rounded-xl bg-zinc-900 p-8">
          <div>
            <DropdownMenu trigger={<button className="rounded-lg bg-violet-500 px-4 py-2">Actions</button>}
              items={[{ label: "First" }, { label: "Second" }]} />
          </div>
        </div>
        <div className="p-8">
          <Popover trigger={<button className="rounded-lg bg-violet-500 px-4 py-2">Open popover</button>}>
            <label className="block">Name<input aria-label="Popover name" className="mt-2 block rounded border border-zinc-700 bg-zinc-900 p-2" /></label>
          </Popover>
        </div>
      </div>
      <section className="mt-4">
        <button className="mb-2 rounded bg-zinc-800 px-3 py-2" onClick={() => setLayers((count) => count === 1 ? 3 : 1)}>Change layers</button>
        <ParallaxDepthCard className="p-4">
          {Array.from({ length: layers }, (_, index) => <ParallaxDepthCard.Layer key={index}>Layer {index + 1}</ParallaxDepthCard.Layer>)}
        </ParallaxDepthCard>
      </section>
      <section className="mt-4">
        <label className="block">Preview code<textarea aria-label="Preview code" className="block h-24 w-full rounded bg-zinc-900 p-2 font-mono text-xs" value={draft} onChange={(event) => setDraft(event.target.value)} /></label>
        <button className="my-2 rounded bg-violet-500 px-4 py-2" onClick={() => setCode(draft)}>Apply preview</button>
        <LiveCodePreview code={code} />
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(<Fixture />);
