/**
 * FlexUI Figma Plugin — Backend Code
 *
 * Runs in Figma's sandbox. Handles:
 * - Component insertion from FlexUI registry
 * - Design token extraction from Figma Variables
 * - Code generation (Dev Mode codegen)
 */

import { searchRegistry } from "./registry";

// Show plugin UI
figma.showUI(__html__, { width: 420, height: 600, themeColors: true });

// ─── Registry ──────────────────────────────────────────────────────────────

const REGISTRY_URL = "https://flex-ui-wine.vercel.app/r";

// ─── Message Handlers ──────────────────────────────────────────────────────

figma.ui.onmessage = async (msg: { type: string; payload?: unknown }) => {
  switch (msg.type) {
    case "search-components": {
      const query = (msg.payload as { query: string }).query;
      // Fetch registry and filter
      try {
        const res = await fetch(`${REGISTRY_URL}/index.json`);
        if (!res.ok) throw new Error(`Registry returned HTTP ${res.status}`);
        const registry = await res.json();
        const results = searchRegistry(registry, query);
        figma.ui.postMessage({ type: "search-results", payload: results });
      } catch {
        figma.ui.postMessage({ type: "error", payload: "Failed to fetch registry" });
      }
      break;
    }

    case "get-component": {
      const name = (msg.payload as { name: string }).name;
      try {
        const res = await fetch(`${REGISTRY_URL}/${name}.json`);
        if (!res.ok) throw new Error(`Registry returned HTTP ${res.status}`);
        const data = await res.json();
        figma.ui.postMessage({ type: "component-data", payload: data });
      } catch {
        figma.ui.postMessage({ type: "error", payload: `Component "${name}" not found` });
      }
      break;
    }

    case "extract-tokens": {
      // Extract design tokens from the current page's local styles
      const colors: Record<string, string> = {};
      const paintStyles = await figma.getLocalPaintStylesAsync();

      for (const style of paintStyles) {
        if (style.paints.length > 0 && style.paints[0].type === "SOLID") {
          const paint = style.paints[0];
          const r = Math.round(paint.color.r * 255);
          const g = Math.round(paint.color.g * 255);
          const b = Math.round(paint.color.b * 255);
          const a = paint.opacity ?? 1;
          colors[style.name] = a < 1
            ? `rgba(${r}, ${g}, ${b}, ${a.toFixed(2)})`
            : `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
        }
      }

      const textStyles = await figma.getLocalTextStylesAsync();
      const typography: Record<string, { family: string; size: number; weight: number }> = {};
      for (const style of textStyles) {
        typography[style.name] = {
          family: style.fontName.family,
          size: style.fontSize,
          weight: style.fontName.style === "Bold" ? 700 : style.fontName.style === "Medium" ? 500 : 400,
        };
      }

      figma.ui.postMessage({
        type: "tokens-extracted",
        payload: { colors, typography },
      });
      break;
    }

    case "insert-frame": {
      // Insert a placeholder frame for the component
      const { name, width, height } = msg.payload as { name: string; width: number; height: number };
      const frame = figma.createFrame();
      frame.name = `FlexUI / ${name}`;
      frame.resize(width || 320, height || 200);
      frame.fills = [{ type: "SOLID", color: { r: 0.067, g: 0.067, b: 0.075 } }];
      frame.cornerRadius = 12;

      // Center in viewport
      const center = figma.viewport.center;
      frame.x = center.x - frame.width / 2;
      frame.y = center.y - frame.height / 2;

      // Add component label
      const text = figma.createText();
      await figma.loadFontAsync({ family: "Inter", style: "Bold" });
      text.fontName = { family: "Inter", style: "Bold" };
      text.characters = name;
      text.fontSize = 14;
      text.fills = [{ type: "SOLID", color: { r: 0.655, g: 0.545, b: 0.98 } }];
      text.x = 16;
      text.y = 16;
      frame.appendChild(text);

      figma.currentPage.selection = [frame];
      figma.viewport.scrollAndZoomIntoView([frame]);

      figma.ui.postMessage({ type: "frame-inserted", payload: { name } });
      break;
    }

    case "close": {
      figma.closePlugin();
      break;
    }
  }
};

// ─── Dev Mode Codegen ──────────────────────────────────────────────────────

figma.codegen.on("generate", ({ node }) => {
  const componentName = node.name.replace("FlexUI / ", "");
  const kebab = componentName.toLowerCase().replace(/\s+/g, "-");

  return [
    {
      title: "FlexUI Component",
      language: "TYPESCRIPT",
      code: `import { ${componentName.replace(/-/g, "")} } from "@/components/flexui/${kebab}";

<${componentName.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase()).replace(/^./, (c) => c.toUpperCase())} />`,
    },
    {
      title: "Install Command",
      language: "PLAINTEXT",
      code: `npx flexui add ${kebab}`,
    },
  ];
});

