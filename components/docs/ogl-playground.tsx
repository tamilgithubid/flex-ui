"use client";

import { useState } from "react";
import { OGLExample } from "@/components/flexui/ogl-example";
import { getOGLExample, type OGLExampleId } from "@/lib/ogl-examples";
import { PreviewCodeTabs } from "./preview-code-tabs";

export function OGLPlayground({ example }: { example: OGLExampleId }) {
  const [dpr, setDpr] = useState(1.5);
  const definition = getOGLExample(example)!;
  const code = 'import { ' + definition.component + ' } from "@/components/flexui/ogl-' + example + '";\n\nexport function Demo() {\n  return <' +
    definition.component + ' height={520} dpr={' + dpr + '} />;\n}';
  return <div className="space-y-4">
    <PreviewCodeTabs preview={<OGLExample example={example} height="clamp(320px, 60vh, 520px)" dpr={dpr} />} code={code} filename={"ogl-" + example + "-demo.tsx"} />
    <div className="flex flex-wrap items-center justify-between gap-4">
      <p className="max-w-xl text-sm leading-relaxed text-zinc-400">{definition.interaction}</p>
      <label className="flex items-center gap-2 text-xs text-zinc-400">
        Pixel ratio
        <select aria-label="Preview pixel ratio" value={dpr} onChange={event => setDpr(Number(event.target.value))} className="rounded-md border border-white/10 bg-zinc-900 px-3 py-2 text-zinc-200">
          <option value={1}>1× · Faster</option><option value={1.5}>1.5× · Balanced</option><option value={2}>2× · Original</option>
        </select>
      </label>
    </div>
  </div>;
}
