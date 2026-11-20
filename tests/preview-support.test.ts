import { readFileSync } from "node:fs";
import path from "node:path";
import { expect, it } from "vitest";

it("supports every component module advertised by the generation prompt", () => {
  const prompt = readFileSync(path.resolve(__dirname, "../api/prompts/generate.py"), "utf8");
  const availableComponents = prompt.split("## Available Components")[1].split("## Code Quality Rules")[0];
  const preview = readFileSync(path.resolve(__dirname, "../components/studio/preview-components.tsx"), "utf8");
  const requiredModules = new Set(Array.from(availableComponents.matchAll(/@\/components\/flexui\/[a-z-]+/g), match => match[0]));
  expect(requiredModules.size).toBeGreaterThan(30);
  for (const modulePath of requiredModules) expect(preview).toContain('"' + modulePath + '":');
});
