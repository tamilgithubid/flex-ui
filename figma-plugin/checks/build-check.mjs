import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { Script } from "node:vm";

const manifest = JSON.parse(readFileSync(new URL("../manifest.json", import.meta.url), "utf8"));
const backend = readFileSync(new URL(`../${manifest.main}`, import.meta.url), "utf8");
const html = readFileSync(new URL(`../${manifest.ui}`, import.meta.url), "utf8");
assert.match(html, /id="root"/);
assert.doesNotMatch(html, /APP_SCRIPT/);
assert.doesNotMatch(html, /<script[^>]+src=/i);
const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/gi)];
assert.equal(scripts.length, 1, "Plugin UI must contain its bundled JavaScript");
new Script(backend, { filename: manifest.main });
new Script(scripts[0][1], { filename: manifest.ui });
console.log("Figma manifest entry points exist; UI JavaScript is bundled and parses successfully.");
