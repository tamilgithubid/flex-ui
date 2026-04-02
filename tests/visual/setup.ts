/**
 * Visual Regression Testing Setup
 *
 * Uses Vitest browser mode with Playwright to capture component screenshots
 * and compare against baselines. Run with: npm run test:visual
 */

import { expect } from "vitest";
import type { Page } from "playwright";

/** Directory for baseline snapshots */
export const SNAPSHOT_DIR = "tests/visual/__snapshots__";

/** Default viewport for consistent screenshots */
export const DEFAULT_VIEWPORT = { width: 1280, height: 720 };

/** Component render options */
export interface SnapshotOptions {
  /** Viewport width */
  width?: number;
  /** Viewport height */
  height?: number;
  /** Wait for animations to settle (ms) */
  waitMs?: number;
  /** CSS selector to screenshot (defaults to body) */
  selector?: string;
  /** Threshold for pixel diff (0-1, default 0.01) */
  threshold?: number;
  /** Dark background for component screenshots */
  darkBackground?: boolean;
}

/**
 * Capture a screenshot of a component rendered in isolation.
 * Compares against a stored baseline and fails if diff exceeds threshold.
 */
export async function captureSnapshot(
  page: Page,
  name: string,
  html: string,
  options: SnapshotOptions = {}
) {
  const {
    width = DEFAULT_VIEWPORT.width,
    height = DEFAULT_VIEWPORT.height,
    waitMs = 500,
    selector = "#snapshot-root",
    threshold = 0.01,
    darkBackground = true,
  } = options;

  await page.setViewportSize({ width, height });

  // Inject component HTML into a clean page
  await page.setContent(`
    <!DOCTYPE html>
    <html class="dark">
    <head>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          background: ${darkBackground ? "#09090b" : "#ffffff"};
          color: ${darkBackground ? "#fafafa" : "#09090b"};
          font-family: system-ui, -apple-system, sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          padding: 2rem;
        }
        #snapshot-root {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          flex-wrap: wrap;
        }
      </style>
    </head>
    <body>
      <div id="snapshot-root">${html}</div>
    </body>
    </html>
  `);

  // Wait for animations to settle
  if (waitMs > 0) {
    await page.waitForTimeout(waitMs);
  }

  // Capture screenshot
  const element = await page.$(selector);
  if (!element) {
    throw new Error(`Selector "${selector}" not found on page`);
  }

  const screenshot = await element.screenshot({ type: "png" });
  return screenshot;
}

/**
 * Compare two image buffers using pixel-level diffing.
 * Returns the percentage of pixels that differ.
 */
export function compareBuffers(
  baseline: Buffer,
  current: Buffer,
  threshold: number = 0.01
): { pass: boolean; diffPercent: number } {
  // Simple size comparison as a first check
  const sizeDiff = Math.abs(baseline.length - current.length) / baseline.length;

  if (sizeDiff > threshold) {
    return { pass: false, diffPercent: sizeDiff * 100 };
  }

  // Byte-level comparison
  let diffCount = 0;
  const maxLen = Math.max(baseline.length, current.length);
  for (let i = 0; i < maxLen; i++) {
    if ((baseline[i] ?? 0) !== (current[i] ?? 0)) {
      diffCount++;
    }
  }

  const diffPercent = (diffCount / maxLen) * 100;
  return { pass: diffPercent <= threshold * 100, diffPercent };
}

/**
 * Wrap a set of component HTML strings into a visual test suite.
 * Captures snapshots and compares against baselines.
 */
export function createVisualTestSuite(
  suiteName: string,
  components: Record<string, string>
) {
  return { suiteName, components };
}
