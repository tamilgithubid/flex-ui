import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/browser",
  testMatch: "**/*.spec.ts",
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  use: {
    browserName: "chromium",
    baseURL: "http://127.0.0.1:4175",
    viewport: { width: 1000, height: 900 },
    colorScheme: "dark",
    reducedMotion: "reduce",
    trace: "retain-on-failure",
    launchOptions: {
      executablePath: process.env.FLEXUI_CHROMIUM_PATH,
      args: process.env.FLEXUI_CHROMIUM_ARGS
        ? JSON.parse(process.env.FLEXUI_CHROMIUM_ARGS)
        : ["--no-sandbox", "--disable-dev-shm-usage"],
    },
  },
  webServer: {
    command: "npm run preview:build && node tests/browser/server.mjs",
    url: "http://127.0.0.1:4175/health",
    timeout: 120000,
    reuseExistingServer: !process.env.CI,
  },
});
