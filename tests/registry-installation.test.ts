import path from "node:path";
import os from "node:os";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import ts from "typescript";
import { isBuiltin } from "node:module";
import { describe, expect, it } from "vitest";
import { buildComponent, COMPONENTS, SHARED } from "../scripts/build-registry";

const registry = [...SHARED, ...COMPONENTS];

describe("Registry installation", () => {
  it("uses unique registry names", () => {
    expect(new Set(registry.map((item) => item.name)).size).toBe(registry.length);
  });

  for (const component of registry) {
    it(`${component.name} bundles its imported files and npm dependencies`, () => {
      const item = buildComponent(component);
      const published = JSON.parse(readFileSync(path.resolve(__dirname, `../public/r/${component.name}.json`), "utf8"));
      expect(published).toEqual(item);
      const targets = new Set(item.files.map((file) => file.target ?? file.path));
      expect(targets.size).toBe(item.files.length);
      for (const file of item.files) {
        if (!/\.[cm]?[jt]sx?$/.test(file.path)) continue;
        const { importedFiles } = ts.preProcessFile(file.content, true, true);
        for (const { fileName: reference } of importedFiles) {
          // shadcn init supplies the consumer's utility and React is a peer.
          if (reference === "@/lib/utils" || /^(react|react-dom)(\/|$)/.test(reference) || isBuiltin(reference)) continue;
          if (reference.startsWith("@/") || reference.startsWith(".")) {
            const base = reference.startsWith("@/") ? reference.slice(2) : path.posix.join(path.posix.dirname(file.path), reference);
            const candidates = [base, ...[".ts", ".tsx", ".js", ".jsx", ".json", "/index.ts", "/index.tsx"].map((extension) => base + extension)];
            expect(candidates.some((candidate) => targets.has(candidate)), `${item.name}: ${file.path} imports missing ${reference}`).toBe(true);
          } else {
            const name = reference.startsWith("@") ? reference.split("/").slice(0, 2).join("/") : reference.split("/")[0];
            expect(item.dependencies.some(dependency => dependency === name || dependency.startsWith(name + "@")), `${item.name}: missing npm dependency ${name}`).toBe(true);
          }
        }
      }
    });
  }

  it.each(["theme-provider", "kpi-card", "skydome", "gltf-ktx2-basis"])("%s type-checks in a fresh consumer", (name) => {
    const component = registry.find((item) => item.name === name)!;
    const item = buildComponent(component);
    const directory = mkdtempSync(path.join(os.tmpdir(), "flexui-consumer-"));
    try {
      const sources = [];
      for (const file of item.files) {
        const destination = path.join(directory, file.target ?? file.path);
        mkdirSync(path.dirname(destination), { recursive: true });
        writeFileSync(destination, file.content);
        if (/\.tsx?$/.test(destination)) sources.push(destination);
      }
      // React and the shadcn utility are supplied by the consumer project.
      mkdirSync(path.join(directory, "lib"), { recursive: true });
      writeFileSync(path.join(directory, "lib/utils.ts"), readFileSync(path.resolve(__dirname, "../lib/utils.ts")));
      symlinkSync(path.resolve(__dirname, "../node_modules"), path.join(directory, "node_modules"), "junction");
      const program = ts.createProgram(sources, {
        noEmit: true, strict: true, skipLibCheck: true,
        target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.ESNext,
        moduleResolution: ts.ModuleResolutionKind.Bundler, jsx: ts.JsxEmit.ReactJSX,
        esModuleInterop: true, baseUrl: directory, paths: { "@/*": ["./*"] },
      });
      const diagnostics = ts.getPreEmitDiagnostics(program).map((diagnostic) => ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"));
      expect(diagnostics).toEqual([]);
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  }, 15000);

  it("merges dependencies and shared files from inlined registry items", () => {
    const item = buildComponent({
      name: "test-parent", type: "registry:ui", title: "Test", description: "Test dependency closure",
      files: [], dependencies: [], registryDependencies: ["shimmer-button", "avatar-group"],
    });
    expect(item.dependencies).toContain("framer-motion");
    expect(item.files.map((file) => file.path)).toEqual(expect.arrayContaining([
      "components/flexui/shimmer-button.tsx", "styles/flexui-animations.css", "hooks/use-reduced-motion.ts",
      "components/flexui/avatar-group.tsx", "components/flexui/avatar.tsx",
    ]));
  });

  it("fails for missing or circular registry dependencies", () => {
    const parent = { name: "test-parent", type: "registry:ui" as const, title: "Test", description: "Test", files: [], dependencies: [], registryDependencies: ["unknown-item"] };
    expect(() => buildComponent(parent)).toThrow("Unknown registry dependency");
    expect(() => buildComponent(parent, ["test-parent"])).toThrow("Circular registry dependency");
  });
});
