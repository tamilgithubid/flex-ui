import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ESLint } from "eslint";

export function diagnosticKey(file, message) {
  return `${file}:${message.line ?? 0}:${message.column ?? 0}:${message.severity}:${message.ruleId ?? "parser"}`;
}

export function findNewDiagnostics(results, baseline, root) {
  const known = new Set(baseline);
  return results.flatMap((result) => {
    const file = path.relative(root, result.filePath).split(path.sep).join("/");
    return result.messages
      .filter((message) => !known.has(diagnosticKey(file, message)))
      .map((message) => ({ file, ...message }));
  });
}

async function main() {
  const root = fileURLToPath(new URL("../", import.meta.url));
  const baseline = JSON.parse(readFileSync(new URL("./lint-baseline.json", import.meta.url), "utf8"));
  const results = await new ESLint({ cwd: root }).lintFiles(["."]);
  const introduced = findNewDiagnostics(results, baseline, root);
  const existing = results.reduce((count, result) => count + result.messages.length, 0) - introduced.length;
  console.log(`Existing lint diagnostics: ${existing}. New lint diagnostics: ${introduced.length}.`);
  if (existing > 0) console.log("Existing issues remain tracked in scripts/lint-baseline.json; npm run lint shows them in full.");
  for (const message of introduced) {
    console.error(`${message.file}:${message.line}:${message.column} ${message.message} (${message.ruleId ?? "parser"})`);
  }
  if (introduced.length > 0) process.exitCode = 1;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => { console.error(error); process.exitCode = 1; });
}
