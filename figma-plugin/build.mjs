import { build, context } from "esbuild";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("./", import.meta.url));
const watch = process.argv.includes("--watch");
await mkdir(new URL("./dist/", import.meta.url), { recursive: true });

const shared = { absWorkingDir: root, bundle: true, minify: !watch, target: "es2020", format: "iife" };
const backend = { ...shared, entryPoints: ["src/code.ts"], outfile: "dist/code.js" };
const frontend = {
  ...shared,
  entryPoints: ["src/ui.tsx"], outfile: "dist/ui.js", write: false, jsx: "automatic",
  define: { "process.env.NODE_ENV": JSON.stringify(watch ? "development" : "production") },
  plugins: [{
    name: "inline-plugin-ui",
    setup(builder) {
      builder.onEnd(async (result) => {
        if (result.errors.length > 0) return;
        const source = result.outputFiles[0].text;
        const template = await readFile(new URL("./src/ui.html", import.meta.url), "utf8");
        const script = source.replace(/<\/script/gi, "<\\/script");
        await writeFile(new URL("./dist/ui.js", import.meta.url), source);
        await writeFile(new URL("./dist/ui.html", import.meta.url), template.replace("<!-- APP_SCRIPT -->", () => `<script>${script}</script>`));
      });
    },
  }],
};

if (watch) {
  const backendContext = await context(backend);
  const frontendContext = await context(frontend);
  await backendContext.watch();
  await frontendContext.watch();
} else {
  await build(backend);
  await build(frontend);
}
