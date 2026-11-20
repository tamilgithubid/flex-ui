import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { formatComponent } from "../mcp-server/src/component-details";

describe("MCP install instructions", () => {
  const registry = JSON.parse(readFileSync(path.resolve(__dirname, "../mcp-server/registry.json"), "utf8"));
  it("selects the FlexUI registry for every advertised component", () => {
    for (const component of registry.components) {
      const details = formatComponent(component, registry);
      expect(details.installCommand).toContain("https://flex-ui-wine.vercel.app/r/" + encodeURIComponent(component.name) + ".json");
      expect(details.installCommand).not.toBe('npx shadcn@latest add "' + component.name + '"');
    }
  });
});
