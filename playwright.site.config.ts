import { defineConfig } from "@playwright/test";
import base from "./playwright.config";

export default defineConfig({
  ...base,
  testMatch: "**/site.spec.ts",
  testIgnore: [],
  timeout: 90000,
  outputDir: process.env.FLEXUI_TEST_OUTPUT ?? "test-results/site",
  use: { ...base.use, baseURL: "http://127.0.0.1:3100" },
  webServer: {
    command: "npm run start -- --hostname 127.0.0.1 --port 3100",
    url: "http://127.0.0.1:3100/blog",
    timeout: 60000,
    reuseExistingServer: false,
  },
});
