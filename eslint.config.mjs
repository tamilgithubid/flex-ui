import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Registry components also target React and Vite; they cannot require next/image.
  { files: ["components/flexui/**/*.tsx"], rules: { "@next/next/no-img-element": "off" } },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "test-results/**",
    "playwright-report/**",
    "tests/browser/.generated/**",
    "out/**",
    "build/**",
    "**/dist/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;

