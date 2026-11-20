import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { searchRegistry } from "../figma-plugin/src/registry";

describe("Figma registry integration", () => {
  const index = JSON.parse(readFileSync(path.resolve(__dirname, "../public/r/index.json"), "utf8"));

  it("searches the real generated registry index", () => {
    expect(searchRegistry(index, "magnetic-button")).toEqual(expect.arrayContaining([
      expect.objectContaining({ name: "magnetic-button", title: "Magnetic Button" }),
    ]));
  });

  it("searches descriptions without requiring tags or tiers", () => {
    const registry = { items: [{ name: "example-card", type: "registry:ui", description: "An animated sunset" }] };
    expect(searchRegistry(registry, "SUNSET")[0].name).toBe("example-card");
  });

  it("does not list shared hooks or malformed items", () => {
    const registry = { items: [null, { name: "hook", type: "registry:hook", description: "Hook" }, { type: "registry:ui", name: 42 }] };
    expect(searchRegistry(registry, "")).toEqual([]);
  });

  it("rejects incompatible registry responses", () => {
    expect(() => searchRegistry({ components: [] }, "button")).toThrow("Invalid component registry index");
  });
});
