import { describe, expect, it } from "vitest";
import { diagnosticKey, findNewDiagnostics } from "../scripts/check-lint.mjs";

describe("CI lint gate", () => {
  const message = { line: 2, column: 5, severity: 2, ruleId: "example-rule", message: "Example error" };
  const results = [{ filePath: "/project/example.ts", messages: [message] }];

  it("allows only an explicitly recorded existing diagnostic", () => {
    expect(findNewDiagnostics(results, [diagnosticKey("example.ts", message)], "/project")).toEqual([]);
  });

  it("rejects a new error and a new warning", () => {
    expect(findNewDiagnostics(results, [], "/project")).toHaveLength(1);
    expect(findNewDiagnostics([{ ...results[0], messages: [{ ...message, severity: 1 }] }], [], "/project")).toHaveLength(1);
  });

  it("does not let an old issue hide a new violation on another line", () => {
    const changed = [{ ...results[0], messages: [{ ...message, line: 3 }] }];
    expect(findNewDiagnostics(changed, [diagnosticKey("example.ts", message)], "/project")).toHaveLength(1);
  });

  it("permits existing debt to be removed without adding replacements", () => {
    expect(findNewDiagnostics([], [diagnosticKey("example.ts", message)], "/project")).toEqual([]);
  });
});
