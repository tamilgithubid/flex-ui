import { build } from "esbuild";
import { createHash } from "node:crypto";
import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const result = await build({
  absWorkingDir: root,
  entryPoints: ["components/studio/preview-runtime.tsx"],
  bundle: true, write: false, minify: true,
  platform: "browser", format: "iife", target: "es2022", jsx: "automatic",
  define: { "process.env.NODE_ENV": JSON.stringify("production") },
  // This is deliberately a browser-only bundle, not a React Server Component.
  logLevel: "error",
});
const runtime = result.outputFiles[0].text.replace(/<\/script/gi, "<\\/script");
const integrity = "sha256-" + createHash("sha256").update(runtime).digest("base64");
await writeFile(new URL("../public/studio-preview.json", import.meta.url), JSON.stringify({ runtime, integrity }));
console.log("Built isolated preview runtime (" + Math.round(runtime.length / 1024) + " KB).");
