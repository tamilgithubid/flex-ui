#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";

const revision = "385ce65c352c70734a36dc98c787fdd1d30ddb3b";
const upstream = "https://raw.githubusercontent.com/oframe/ogl/" + revision + "/examples/assets/";
export function assetDestination(root, name) {
  if (typeof name !== "string" || !name.startsWith("public/webgl/assets/") || name.includes("\\") ||
      name.split("/").some(part => part === ".." || part === "." || !part)) throw new Error("Invalid WebGL asset path");
  const base = fs.realpathSync(root);
  const destination = path.resolve(base, name);
  if (!destination.startsWith(base + path.sep)) throw new Error("Asset path must stay inside the project");
  let current = base;
  for (const part of name.split("/")) {
    current = path.join(current, part);
    if (fs.existsSync(current) && fs.lstatSync(current).isSymbolicLink()) throw new Error("WebGL asset paths cannot contain symlinks");
  }
  return destination;
}
export function verifyAsset(asset, bytes) {
  if (bytes.length !== asset.bytes || createHash("sha256").update(bytes).digest("hex") !== asset.sha256) {
    throw new Error("WebGL asset integrity check failed: " + asset.path);
  }
}
export function selectAssets(manifest, ids) {
  if (!manifest || manifest.version !== 1 || manifest.upstream?.revision !== revision ||
      !manifest.assets || !manifest.components || !ids.length) throw new Error("Invalid WebGL asset manifest or missing example ID");
  const paths = new Set();
  for (const id of ids) {
    if (!Object.hasOwn(manifest.components, id) || !Array.isArray(manifest.components[id])) throw new Error("Unknown WebGL component: " + id);
    for (const name of manifest.components[id]) paths.add(name);
  }
  return [...paths].map((name) => {
    const asset = Object.hasOwn(manifest.assets, name) ? manifest.assets[name] : null;
    if (!asset || asset.path !== name || !/^[a-f0-9]{64}$/.test(asset.sha256) ||
        !Number.isSafeInteger(asset.bytes) || asset.bytes < 1 || asset.bytes > 16 * 1024 * 1024 ||
        typeof asset.url !== "string" || !asset.url.startsWith(upstream) ||
        asset.url !== upstream + name.slice("public/webgl/assets/".length)) throw new Error("Invalid WebGL asset descriptor");
    return asset;
  });
}
async function download(asset) {
  const response = await fetch(asset.url, { signal: AbortSignal.timeout(30000), redirect: "error" });
  if (!response.ok || !response.body) throw new Error("HTTP " + response.status + " downloading " + asset.path);
  const chunks = [];
  let size = 0;
  const reader = response.body.getReader();
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > asset.bytes) { await reader.cancel(); throw new Error("WebGL asset exceeded its declared size"); }
      chunks.push(Buffer.from(value));
    }
  } finally { reader.releaseLock(); }
  return Buffer.concat(chunks);
}
export async function installWebGLAssets({ root = process.cwd(), ids, source, overwrite = false, log = console.log }) {
  const manifest = JSON.parse(fs.readFileSync(path.join(root, "public/webgl/assets-manifest.json"), "utf8"));
  const assets = selectAssets(manifest, ids);
  const tasks = assets.map(asset => ({ asset, destination: assetDestination(root, asset.path) }));
  const total = tasks.reduce((sum, task) => sum + task.asset.bytes, 0);
  if (total > 64 * 1024 * 1024) throw new Error("WebGL asset selection exceeded its size limit");
  let installed = 0;
  let cached = 0;
  async function worker() {
    for (let task = tasks.shift(); task; task = tasks.shift()) {
      const { asset, destination } = task;
      if (fs.existsSync(destination)) {
        try { verifyAsset(asset, fs.readFileSync(destination)); cached++; continue; }
        catch (error) { if (!overwrite) throw error; }
      }
      const bytes = source ? fs.readFileSync(assetDestination(source, asset.path)) : await download(asset);
      verifyAsset(asset, bytes);
      // Recheck after asynchronous downloads, before creating the destination.
      assetDestination(root, asset.path);
      fs.mkdirSync(path.dirname(destination), { recursive: true });
      const handle = fs.openSync(destination, fs.constants.O_WRONLY | fs.constants.O_CREAT |
        (overwrite ? fs.constants.O_TRUNC : fs.constants.O_EXCL) | (fs.constants.O_NOFOLLOW || 0), 0o644);
      try { fs.writeFileSync(handle, bytes); } finally { fs.closeSync(handle); }
      installed++;
      log("Installed " + asset.path);
    }
  }
  await Promise.all(Array.from({ length: Math.min(4, tasks.length) }, worker));
  log("WebGL assets ready: " + installed + " installed, " + cached + " verified.");
  return { installed, cached };
}
async function main() {
  const args = process.argv.slice(2);
  const ids = [];
  let all = false;
  let source;
  let overwrite = false;
  for (let index = 0; index < args.length; index++) {
    if (args[index] === "--source") source = path.resolve(args[++index]);
    else if (args[index] === "--overwrite") overwrite = true;
    else if (args[index] === "--all") all = true;
    else ids.push(args[index].replace(/^webgl-/, ""));
  }
  if (all) {
    const manifest = JSON.parse(fs.readFileSync(path.join(process.cwd(), "public/webgl/assets-manifest.json"), "utf8"));
    ids.push(...Object.keys(manifest.components));
  }
  if (!ids.length || ids.includes("--help")) {
    console.log("Usage: node scripts/flexui-webgl-assets.mjs skydome [cube-map ...] [--all] [--source /local/flexui] [--overwrite]");
    return;
  }
  await installWebGLAssets({ ids, source, overwrite });
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch(error => { console.error(error.message); process.exitCode = 1; });
}
