#!/usr/bin/env tsx
/**
 * Figma Token Sync
 *
 * Pulls design tokens from Figma Variables API and generates
 * updated FlexUI theme preset files.
 *
 * Usage:
 *   FIGMA_ACCESS_TOKEN=xxx tsx figma/tokens/sync.ts [file-id]
 *
 * Prerequisites:
 *   - Figma access token with file read permissions
 *   - Figma file with Variables configured
 */

import * as fs from "fs";
import * as path from "path";
import { FIGMA_CONFIG } from "../figma.config";

interface FigmaVariable {
  id: string;
  name: string;
  resolvedType: "COLOR" | "FLOAT" | "STRING" | "BOOLEAN";
  valuesByMode: Record<string, unknown>;
}

interface FigmaVariablesResponse {
  status: number;
  error: boolean;
  meta: {
    variables: Record<string, FigmaVariable>;
    variableCollections: Record<string, { name: string; modes: { modeId: string; name: string }[] }>;
  };
}

function rgbaToHex(r: number, g: number, b: number, a: number): string {
  const toHex = (n: number) =>
    Math.round(n * 255)
      .toString(16)
      .padStart(2, "0");
  if (a < 1) {
    return `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, ${a.toFixed(2)})`;
  }
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function mapFigmaTokenToFlexUI(
  figmaName: string
): string | null {
  const allMappings = {
    ...FIGMA_CONFIG.tokenMapping.colors,
    ...FIGMA_CONFIG.tokenMapping.typography,
    ...FIGMA_CONFIG.tokenMapping.radii,
  };
  return (allMappings as Record<string, string>)[figmaName] ?? null;
}

async function fetchVariables(fileId: string, token: string): Promise<FigmaVariablesResponse> {
  const res = await fetch(`https://api.figma.com/v1/files/${fileId}/variables/local`, {
    headers: { "X-Figma-Token": token },
  });
  if (!res.ok) {
    throw new Error(`Figma API error: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<FigmaVariablesResponse>;
}

function generateThemePreset(
  name: string,
  tokens: Record<string, string>
): string {
  const tokenEntries = Object.entries(tokens)
    .map(([key, value]) => `    "${key}": "${value}",`)
    .join("\n");

  return `import type { FlexUITheme } from "../index";

export const ${name}: FlexUITheme = {
  name: "${name}",
  label: "${name.charAt(0).toUpperCase() + name.slice(1)} (Figma)",
  description: "Theme synced from Figma Variables.",
  tokens: {
${tokenEntries}
  },
};
`;
}

async function main() {
  const token = process.env.FIGMA_ACCESS_TOKEN;
  if (!token) {
    console.error("Error: FIGMA_ACCESS_TOKEN environment variable is required.");
    console.error("Get one at: https://www.figma.com/developers/api#access-tokens");
    process.exit(1);
  }

  const fileUrl = FIGMA_CONFIG.fileUrl;
  const fileIdMatch = fileUrl.match(/\/design\/([a-zA-Z0-9]+)/);
  const fileId = process.argv[2] ?? fileIdMatch?.[1];

  if (!fileId || fileId === "YOUR_FILE_ID") {
    console.error("Error: Please provide a valid Figma file ID.");
    console.error("Usage: tsx figma/tokens/sync.ts <file-id>");
    console.error("Or update FIGMA_CONFIG.fileUrl in figma/figma.config.ts");
    process.exit(1);
  }

  console.log(`Fetching variables from Figma file: ${fileId}...`);

  const data = await fetchVariables(fileId, token);
  const variables = data.meta.variables;
  const collections = data.meta.variableCollections;

  // Process each mode as a separate theme
  for (const collection of Object.values(collections)) {
    for (const mode of collection.modes) {
      const tokens: Record<string, string> = {};
      let mappedCount = 0;

      for (const variable of Object.values(variables)) {
        const flexuiToken = mapFigmaTokenToFlexUI(variable.name);
        if (!flexuiToken) continue;

        const value = variable.valuesByMode[mode.modeId];
        if (!value) continue;

        if (variable.resolvedType === "COLOR" && typeof value === "object" && value !== null) {
          const { r, g, b, a } = value as { r: number; g: number; b: number; a: number };
          tokens[flexuiToken] = rgbaToHex(r, g, b, a);
          mappedCount++;
        } else if (variable.resolvedType === "FLOAT" && typeof value === "number") {
          tokens[flexuiToken] = `${value}rem`;
          mappedCount++;
        } else if (variable.resolvedType === "STRING" && typeof value === "string") {
          tokens[flexuiToken] = value;
          mappedCount++;
        }
      }

      if (mappedCount === 0) {
        console.log(`  Skipping mode "${mode.name}" — no matching tokens found.`);
        continue;
      }

      const themeName = mode.name.toLowerCase().replace(/\s+/g, "-");
      const output = generateThemePreset(themeName, tokens);
      const outPath = path.resolve(__dirname, `../../lib/themes/presets/figma-${themeName}.ts`);

      fs.writeFileSync(outPath, output, "utf-8");
      console.log(`  Generated: lib/themes/presets/figma-${themeName}.ts (${mappedCount} tokens)`);
    }
  }

  console.log("\nDone! Remember to import the new presets in lib/themes/index.ts");
}

main().catch((err) => {
  console.error("Failed to sync tokens:", err);
  process.exit(1);
});
