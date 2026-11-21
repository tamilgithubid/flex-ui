"use client";

import { useState } from "react";
import { getWebGLComponent, type WebGLComponentId } from "@/lib/webgl-components";
import { PreviewCodeTabs } from "./preview-code-tabs";
import { webglPreviews } from "./webgl-previews";

export function WebGLPlayground({ component }: { component: WebGLComponentId }) {
  const [dpr, setDpr] = useState(1.5);
  const definition = getWebGLComponent(component)!;
  const Preview = webglPreviews[component];
  const code = 'import { ' + definition.component + ' } from "@/components/flexui/' + component + '";\n\nexport function Demo() {\n  return <' +
    definition.component + ' height={520} dpr={' + dpr + '} />;\n}';
  return <div className="space-y-4">
    <PreviewCodeTabs preview={<Preview height="clamp(320px, 60vh, 520px)" dpr={dpr} />} code={code} filename={component + "-demo.tsx"} />
    <div className="flex flex-wrap items-center justify-between gap-4">
      <p className="max-w-xl text-sm leading-relaxed text-zinc-400">{definition.interaction}</p>
      <label className="flex items-center gap-2 text-xs text-zinc-400">
        Pixel ratio
        <select aria-label="Preview pixel ratio" value={dpr} onChange={event => setDpr(Number(event.target.value))} className="rounded-md border border-white/10 bg-zinc-900 px-3 py-2 text-zinc-200">
          <option value={1}>1× · Faster</option><option value={1.5}>1.5× · Balanced</option><option value={2}>2× · Sharper</option>
        </select>
      </label>
    </div>
  </div>;
}
