import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";
import postcss from "postcss";
import tailwind from "@tailwindcss/postcss";

const root = fileURLToPath(new URL("../../", import.meta.url));
const output = await build({
  absWorkingDir: root, entryPoints: ["tests/browser/fixture.tsx"],
  bundle: true, write: false, jsx: "automatic", platform: "browser", format: "iife",
  define: { "process.env.NODE_ENV": JSON.stringify("production") }, logLevel: "error",
});
const stylesheet = new URL("./fixture.css", import.meta.url);
const css = await postcss([tailwind()]).process(await readFile(stylesheet, "utf8"), { from: fileURLToPath(stylesheet) });
const runtime = await readFile(new URL("../../public/studio-preview.json", import.meta.url));
const html = '<!doctype html><html class="dark"><head><meta charset="utf-8"><link rel="stylesheet" href="/fixture.css"></head><body><div id="root"></div><script src="/fixture.js"></script></body></html>';
const routes = {
  "/": ["text/html", html],
  "/health": ["text/plain", "ok"],
  "/fixture.js": ["text/javascript", output.outputFiles[0].text],
  "/fixture.css": ["text/css", css.css],
  "/studio-preview.json": ["application/json", runtime],
};
createServer((request, response) => {
  const route = routes[request.url];
  if (!route) { response.writeHead(404); response.end(); return; }
  response.writeHead(200, { "Content-Type": route[0], "Cache-Control": "no-store" });
  response.end(route[1]);
}).listen(4175, "127.0.0.1", () => console.log("Browser regression fixture listening on 4175"));
