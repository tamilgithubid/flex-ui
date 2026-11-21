import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceArg = process.argv.indexOf("--source");
const source = path.resolve(sourceArg < 0 ? path.join(root, "../ogl-upstream") : process.argv[sourceArg + 1]);
const revision = "385ce65c352c70734a36dc98c787fdd1d30ddb3b";
const actualRevision = execFileSync("git", ["-C", source, "rev-parse", "HEAD"], { encoding: "utf8" }).trim();
if (actualRevision !== revision) throw new Error("Expected the pinned OGL revision " + revision);
const sourceChanges = execFileSync("git", ["-C", source, "status", "--porcelain", "--untracked-files=all", "--", "src", "examples", "README.md"], { encoding: "utf8" }).trim();
if (sourceChanges) throw new Error("The pinned upstream source must have a clean working tree");
const examples = JSON.parse(fs.readFileSync(path.join(root, "scripts/ogl-examples.json"), "utf8"));
const hash = (data) => createHash("sha256").update(data).digest("hex");
const write = (name, data) => {
  const destination = path.join(root, name);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.writeFileSync(destination, data);
};
const walk = (directory) => fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
  const name = path.join(directory, entry.name);
  return entry.isDirectory() ? walk(name) : [name];
});

fs.cpSync(path.join(source, "src"), path.join(root, "public/ogl/src"), { recursive: true });
write("public/ogl/examples/assets/main.css", fs.readFileSync(path.join(source, "examples/assets/main.css")));
const upstreamReadme = fs.readFileSync(path.join(source, "README.md"), "utf8");
write("public/ogl/UNLICENSE.txt", upstreamReadme.split("## Unlicense\n")[1].trim() + "\n");
write("vendor/ogl/README.md", upstreamReadme);

const manifest = { version: 1, upstream: { repository: "oframe/ogl", revision, version: "1.0.11" }, assets: {}, examples: {} };
const provenance = { upstream: manifest.upstream, examples: {}, source: {} };
const common = ["assets/favicon.png", ...walk(path.join(source, "examples/assets/fonts"))
  .filter((name) => /raleway.*\.woff2?$/.test(name)).map((name) => path.relative(path.join(source, "examples"), name).split(path.sep).join("/"))];
const credits = [];

for (const example of examples) {
  if (!/^[a-z0-9-]+$/.test(example.id)) throw new Error("Invalid example ID");
  const original = fs.readFileSync(path.join(source, "examples", example.id + ".html"), "utf8");
  write("vendor/ogl/examples/" + example.id + ".html", original);
  let adapted = original.replace('<script type="module">', '<script src="../flexui-bridge.js"></script>\n        <script type="module">');
  adapted = adapted.replaceAll("dpr: 2", "dpr: window.__FLEXUI_OGL_DPR__");
  adapted = adapted.replace(/href="\/ogl\/examples\/\?src=([^"]+)" target="_top"/g,
    'href="https://oframe.github.io/ogl/examples/?src=$1" target="_blank" rel="noopener noreferrer"');
  write("public/ogl/examples/" + example.id + ".html", adapted);
  provenance.examples[example.id] = { originalSha256: hash(original), adaptedSha256: hash(adapted) };
  const assets = new Set([...common, ...original.matchAll(/assets\/[\w./-]+\.(?:jpg|png|json|glb|js)/g)].map((item) => typeof item === "string" ? item : item[0]));
  if ([...assets].some((name) => name.startsWith("assets/libs/basis/"))) {
    assets.add("assets/libs/basis/basis_transcoder.js");
    assets.add("assets/libs/basis/basis_transcoder.wasm");
  }
  manifest.examples[example.id] = [];
  for (const name of [...assets].sort()) {
    const data = fs.readFileSync(path.join(source, "examples", name));
    const target = "public/ogl/examples/" + name;
    write(target, data);
    manifest.assets[target] = {
      path: target, bytes: data.length, sha256: hash(data),
      url: "https://raw.githubusercontent.com/oframe/ogl/" + revision + "/examples/" + name,
    };
    manifest.examples[example.id].push(target);
  }
  const info = original.match(/<div class="Info"[^>]*>([\s\S]*?)<\/div>/)?.[1] ?? "";
  const links = [...info.matchAll(/href="([^"]+)"[^>]*>([^<]+)/g)]
    .filter((match) => !match[1].startsWith("/"))
    .map((match) => "- " + match[2] + ": " + match[1]).join("\n");
  credits.push("## " + example.title + "\n\nSource: https://github.com/oframe/ogl/blob/" + revision + "/examples/" + example.id + ".html\n\n" +
    info.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim() + "\n" + links);
}
for (const filename of walk(path.join(source, "src"))) {
  provenance.source[path.relative(source, filename).split(path.sep).join("/")] = hash(fs.readFileSync(filename));
}
write("public/ogl/assets-manifest.json", JSON.stringify(manifest, null, 2) + "\n");
write("public/ogl/provenance.json", JSON.stringify(provenance, null, 2) + "\n");
write("public/ogl/ATTRIBUTION.md",
  "# OGL example attribution\n\nOGL by Nathan Gordon and contributors, version 1.0.11, revision " + revision +
  ". Library and example code are distributed under the upstream Unlicense; see UNLICENSE.txt. Models, photographs, textures and fonts retain their original creators' terms and credits. The original on-screen credits remain in every scene.\n\n" +
  credits.join("\n\n") + "\n");
write("lib/ogl-examples.ts",
  "// Generated from scripts/ogl-examples.json by sync-ogl-examples.mjs.\n" +
  'export const OGL_UPSTREAM_REVISION = "' + revision + '";\n' +
  "export const OGL_EXAMPLES = " + JSON.stringify(examples, null, 2) + " as const;\n\n" +
  'export type OGLExampleId = (typeof OGL_EXAMPLES)[number]["id"];\n' +
  "export function getOGLExample(id: string) { return OGL_EXAMPLES.find(example => example.id === id); }\n" +
  "export function oglSourceUrl(id: OGLExampleId) { return \"https://github.com/oframe/ogl/blob/\" + OGL_UPSTREAM_REVISION + \"/examples/\" + id + \".html\"; }\n");
console.log("Synced " + examples.length + " exact OGL examples, " + Object.keys(manifest.assets).length + " assets and " + Object.keys(provenance.source).length + " library files.");
