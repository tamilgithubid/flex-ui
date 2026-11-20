import { expect, test } from "@playwright/test";

test("hero transitions keep a single word, a fixed width, and a complete card surface", async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await expect(page.locator("[data-three-hover-card]").first()).toBeAttached();
  const rotating = page.locator("h1 [data-rotating-word]");
  await expect(rotating).toHaveCount(1);
  const holder = page.locator("h1 [data-rotating-slot]");
  await expect(holder).toHaveCSS("background-image", "none");
  await expect(holder).toHaveCSS("background-clip", "border-box");
  await expect(rotating).not.toHaveCSS("background-image", "none");
  for (const measure of await holder.locator("[data-rotating-measure]").all()) {
    await expect(measure).toHaveCSS("visibility", "hidden");
    await expect(measure).toHaveCSS("opacity", "0");
  }
  const initialWidth = (await holder.boundingBox())!.width;
  const first = await rotating.textContent();
  await expect(rotating).not.toHaveText(first!, { timeout: 6000 });
  for (let index = 0; index < 8; index++) {
    expect(await rotating.count()).toBeLessThanOrEqual(1);
    expect(Math.abs((await holder.boundingBox())!.width - initialWidth)).toBeLessThan(1);
    await page.waitForTimeout(100);
  }
  await expect(rotating).toHaveCSS("opacity", "1");
  await expect.poll(() => rotating.evaluate(element =>
    Math.abs(element.getBoundingClientRect().top - element.parentElement!.getBoundingClientRect().top)
  )).toBeLessThan(0.5);
  // Capture a settled, accessible frame after exercising the animated transitions.
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(rotating).toHaveText("Cinematic");
  await expect(rotating).toHaveCSS("opacity", "1");
  await page.locator("h1").screenshot({ path: testInfo.outputPath("headline-no-overlap.png"), animations: "disabled" });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  const card = page.locator("[data-three-hover-card]").first();
  await card.scrollIntoViewIfNeeded();
  const surface = card.locator("[data-card-surface]");
  const bounds = (await card.boundingBox())!;
  expect(Math.abs((await surface.boundingBox())!.height - bounds.height)).toBeLessThan(2);
  const image = card.getByRole("img");
  await expect(image).toHaveCSS("object-fit", "cover");
  await expect(image).toHaveJSProperty("complete", true);
  expect(await image.evaluate((element: HTMLImageElement) => element.naturalWidth)).toBeGreaterThan(0);
  expect(await image.evaluate((element: HTMLImageElement) => element.naturalWidth / element.naturalHeight)).toBeGreaterThan(1.6);
  expect(bounds.width / bounds.height).toBeGreaterThan(1.1);
  await page.mouse.move(bounds.x + bounds.width * 0.2, bounds.y + bounds.height * 0.35, { steps: 8 });
  await page.mouse.move(bounds.x + bounds.width * 0.8, bounds.y + bounds.height * 0.55, { steps: 16 });
  await expect(surface).not.toHaveCSS("transform", "none");
  await card.screenshot({ path: testInfo.outputPath("hover-card-full-view.png"), animations: "disabled" });
  await page.mouse.move(0, 0);
  await page.setViewportSize({ width: 390, height: 844 });
  await card.scrollIntoViewIfNeeded();
  const mobileBounds = (await card.boundingBox())!;
  expect(mobileBounds.width / mobileBounds.height).toBeGreaterThan(1.6);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  await expect(image).toHaveCSS("object-fit", "cover");
  await card.screenshot({ path: testInfo.outputPath("hover-card-mobile-landscape.png"), animations: "disabled" });
});

test("blog cards and article covers load their generated images", async ({ page }, testInfo) => {
  await page.goto("/blog");
  const images = page.locator('img[src*="editorial"]');
  await expect(images).toHaveCount(4);
  for (const image of await images.all()) {
    await image.scrollIntoViewIfNeeded();
    await expect.poll(() => image.evaluate((element: HTMLImageElement) => element.naturalWidth)).toBeGreaterThan(0);
    expect(await image.getAttribute("alt")).toBeTruthy();
  }
  await page.screenshot({ path: testInfo.outputPath("blog-covers.png"), fullPage: true });
  for (const slug of ["flexui-registry-launch", "introducing-flexui", "why-spring-physics", "webgl-components"]) {
    await page.goto("/blog/" + slug);
    const cover = page.locator('article img[src*="editorial"]');
    await expect(cover).toHaveCount(1);
    await expect.poll(() => cover.evaluate((element: HTMLImageElement) => element.naturalWidth)).toBeGreaterThan(0);
  }
});

test("showcase has six complete generated project previews at desktop and mobile widths", async ({ page }, testInfo) => {
  await page.goto("/showcase");
  const images = page.locator('img[src*="editorial"]');
  await expect(images).toHaveCount(6);
  for (const image of await images.all()) {
    await image.scrollIntoViewIfNeeded();
    await expect.poll(() => image.evaluate((element: HTMLImageElement) => element.naturalWidth)).toBeGreaterThan(0);
  }
  await page.screenshot({ path: testInfo.outputPath("showcase-desktop.png"), fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(391);
  await page.screenshot({ path: testInfo.outputPath("showcase-mobile.png"), fullPage: true });
});

test("skull fits its canvas and caps its render resolution", async ({ page }, testInfo) => {
  await page.goto("/docs/components/skull-3d");
  const canvas = page.locator('canvas[aria-label="Interactive 3D skull"]').first();
  await canvas.scrollIntoViewIfNeeded();
  await expect(canvas).toBeVisible();
  await expect.poll(() => canvas.evaluate((element: HTMLCanvasElement) => element.width * element.height)).toBeGreaterThan(100000);
  const size = await canvas.evaluate((element: HTMLCanvasElement) => ({
    width: element.width, height: element.height, cssWidth: element.clientWidth, cssHeight: element.clientHeight,
  }));
  expect(size.width * size.height).toBeLessThanOrEqual(240000);
  expect(Math.abs(size.width / size.height - size.cssWidth / size.cssHeight)).toBeLessThan(0.02);
  await expect(page.getByText("The 3D preview needs WebGL.", { exact: false })).toHaveCount(0);
  await page.waitForTimeout(1000);
  await canvas.screenshot({ path: testInfo.outputPath("skull-full-view.png") });
});
