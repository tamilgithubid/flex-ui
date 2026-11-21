import { expect, test } from "@playwright/test";
import sharp from "sharp";
import { OGL_EXAMPLES } from "../../lib/ogl-examples";

for (const example of OGL_EXAMPLES) {
  test("OGL " + example.id + " loads the real scene and local assets", async ({ page }, testInfo) => {
    const failed: string[] = [];
    page.on("response", response => {
      if (response.url().includes("/ogl/") && response.status() >= 400) failed.push(response.status() + " " + response.url());
    });
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/docs/components/ogl-" + example.id);
    await expect(page.getByRole("heading", { name: example.title, exact: true })).toBeVisible();
    await page.getByLabel("Preview pixel ratio").selectOption("1");
    const preview = page.locator('[data-ogl-example="' + example.id + '"]');
    await preview.scrollIntoViewIfNeeded();
    await expect(preview).toHaveAttribute("data-preview-status", "ready", { timeout: 60000 });
    const html = preview.frameLocator("iframe").locator("html");
    await expect.poll(() => html.getAttribute("data-ogl-frame-count").then(Number)).toBeGreaterThan(2);
    await expect.poll(() => html.getAttribute("data-ogl-draw-count").then(Number)).toBeGreaterThan(0);
    const canvas = preview.frameLocator("iframe").locator("canvas").first();
    await expect(canvas).toBeVisible();
    const pixels = await canvas.screenshot({ path: testInfo.outputPath(example.id + "-canvas.png") });
    const statistics = await sharp(pixels).stats();
    expect(Math.max(...statistics.channels.slice(0, 3).map(channel => channel.max - channel.min))).toBeGreaterThan(20);
    expect(failed).toEqual([]);
    await expect(preview.getByRole("alert")).toHaveCount(0);
  });
}

test("OGL controls pause without reload, restart, orbit, and fit mobile", async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/docs/components/ogl-orbit-controls");
  await page.getByLabel("Preview pixel ratio").selectOption("1");
  const preview = page.locator('[data-ogl-example="orbit-controls"]');
  await preview.scrollIntoViewIfNeeded();
  await expect(preview).toHaveAttribute("data-preview-status", "ready", { timeout: 60000 });
  const html = preview.frameLocator("iframe").locator("html");
  await preview.getByRole("button", { name: "Pause Orbit Controls" }).click();
  await page.waitForTimeout(100);
  const before = Number(await html.getAttribute("data-ogl-frame-count"));
  await page.waitForTimeout(200);
  expect(Number(await html.getAttribute("data-ogl-frame-count"))).toBe(before);
  const canvas = preview.frameLocator("iframe").locator("canvas").first();
  const first = await canvas.screenshot();
  const bounds = (await canvas.boundingBox())!;
  await page.mouse.move(bounds.x + bounds.width * 0.4, bounds.y + bounds.height * 0.6);
  await page.mouse.down();
  await page.mouse.move(bounds.x + bounds.width * 0.7, bounds.y + bounds.height * 0.4, { steps: 8 });
  await page.mouse.up();
  await expect.poll(() => html.getAttribute("data-ogl-frame-count").then(Number)).toBeGreaterThan(before);
  expect((await canvas.screenshot()).equals(first)).toBe(false);
  await preview.getByRole("button", { name: "Play Orbit Controls" }).click();
  await preview.getByRole("button", { name: "Restart", exact: true }).click();
  await expect(preview).toHaveAttribute("data-preview-status", "ready", { timeout: 60000 });
  await preview.getByRole("button", { name: "Full screen", exact: true }).click();
  await expect.poll(() => page.evaluate(() => !!document.fullscreenElement)).toBe(true);
  await page.evaluate(() => document.exitFullscreen());
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  await preview.screenshot({ path: testInfo.outputPath("ogl-mobile.png") });
});

test("OGL gallery filters scenes and releases offscreen documents", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/docs/components/ogl");
  const gallery = page.getByRole("region", { name: "OGL live examples" });
  await expect(gallery.locator("article")).toHaveCount(18);
  await expect(gallery.locator('[data-ogl-example="skydome"]')).toHaveAttribute("data-preview-status", "ready", { timeout: 60000 });
  await page.screenshot({ path: testInfo.outputPath("ogl-gallery.png") });
  await gallery.getByRole("button", { name: "Particles", exact: true }).click();
  await expect(gallery.locator("article")).toHaveCount(2);
  await gallery.getByRole("searchbox", { name: "Find an OGL example" }).fill("GPGPU");
  await expect(gallery.locator("article")).toHaveCount(1);
  await gallery.getByRole("button", { name: "All", exact: true }).click();
  await gallery.getByRole("searchbox", { name: "Find an OGL example" }).fill("");
  const first = gallery.locator('[data-ogl-example="skydome"]');
  await first.scrollIntoViewIfNeeded();
  await expect(first.locator("iframe")).toHaveCount(1);
  await gallery.locator('[data-ogl-example="mouse-flowmap"]').scrollIntoViewIfNeeded();
  await expect(first.locator("iframe")).toHaveCount(0);
  expect(await gallery.locator("iframe").count()).toBeLessThanOrEqual(6);
});
