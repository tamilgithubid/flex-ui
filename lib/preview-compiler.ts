import { transform } from "sucrase";

/** Compile complete modules without executing generated code in the editor. */
export function compilePreview(code: string): string {
  if (!code.trim() || code.length > 50000) {
    throw new Error("Preview code must contain between 1 and 50,000 characters.");
  }
  return transform(code, {
    transforms: ["typescript", "jsx", "imports"],
    production: true,
    jsxRuntime: "classic",
    filePath: "generated-component.tsx",
  }).code;
}
