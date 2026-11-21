import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Registry components also target React and Vite; they cannot require next/image.
  { files: ["components/flexui/**/*.tsx"], rules: { "@next/next/no-img-element": "off" } },
  // Generated scene ports preserve the original callback signatures.
  { files: ["components/flexui/webgl/scenes/*.js"], rules: { "@typescript-eslint/no-unused-vars": ["warn", { args: "none" }] } },
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
    // Pinned, unmodified upstream code and scene HTML. Adapter code remains linted.
    "public/webgl/assets/**",
    "vendor/ogl/**",
  ]),
]);

export default eslintConfig;

