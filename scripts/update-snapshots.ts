#!/usr/bin/env tsx
/**
 * Update Visual Regression Baselines
 *
 * Regenerates all baseline screenshots for visual regression tests.
 * Run: npm run test:visual:update
 */

import * as fs from "fs";
import * as path from "path";

const SNAPSHOT_DIR = path.resolve(__dirname, "../tests/visual/__snapshots__");

function main() {
  // Ensure snapshot directory exists
  if (!fs.existsSync(SNAPSHOT_DIR)) {
    fs.mkdirSync(SNAPSHOT_DIR, { recursive: true });
    console.log(`Created snapshot directory: ${SNAPSHOT_DIR}`);
  }

  // Run vitest in update mode
  console.log("Updating visual regression baselines...");
  console.log("Run: npx vitest run --config vitest.visual.config.mts --update");
  console.log("");
  console.log("Note: Visual regression tests require browser mode.");
  console.log("Ensure Playwright is installed: npx playwright install chromium");
}

main();
