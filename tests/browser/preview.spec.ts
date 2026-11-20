import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => { await page.goto("/"); });

test("renders complete TSX including local values and hooks", async ({ page }) => {
  await page.getByRole("textbox", { name: "Preview code" }).fill(
    'import React, { useMemo } from "react"; import { ToastProvider } from "@/components/flexui/toast"; const text: string = "Complete module"; export default function Demo() { const label = useMemo(() => text, []); return <ToastProvider><div>{label}</div></ToastProvider>; }'
  );
  await page.getByRole("button", { name: "Apply preview" }).click();
  await expect(page.frameLocator('iframe[title="Generated component preview"]').getByText("Complete module")).toBeVisible();
  await expect(page.getByRole("alert")).toHaveCount(0);
});

test("blocks parent storage access and outbound fetches", async ({ page }) => {
  await page.evaluate(() => localStorage.setItem("parent-secret", "private"));
  await page.getByRole("textbox", { name: "Preview code" }).fill(
    'import React, { useEffect, useState } from "react"; export default function Demo() { const [status, setStatus] = useState("waiting"); useEffect(() => { let storage = "escaped"; try { parent.localStorage.setItem("escaped", "yes"); } catch { storage = "storage blocked"; } fetch("https://example.com/preview-exfiltration").then(() => setStatus("network escaped")).catch(() => setStatus(storage + "; network blocked")); }, []); return <div>{status}</div>; }'
  );
  await page.getByRole("button", { name: "Apply preview" }).click();
  await expect(page.frameLocator('iframe[title="Generated component preview"]').getByText("storage blocked; network blocked")).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem("escaped"))).toBeNull();
  expect(await page.evaluate(() => localStorage.getItem("parent-secret"))).toBe("private");
  await expect(page.locator("iframe")).toHaveAttribute("sandbox", "allow-scripts");
});

test("treats script delimiters in generated strings as component data", async ({ page }) => {
  const code = 'export default function Demo() { const text = "</script><script>parent.window.__escaped = true</script>"; return <div>{text}</div>; }';
  await page.getByRole("textbox", { name: "Preview code" }).fill(code);
  await page.getByRole("button", { name: "Apply preview" }).click();
  await expect(page.frameLocator("iframe").getByText("</script><script>parent.window.__escaped = true</script>")).toBeVisible();
  expect(await page.evaluate(() => Object.hasOwn(window, "__escaped"))).toBe(false);
});

test("shows syntax errors and recovers on the next generation", async ({ page }) => {
  await page.getByRole("textbox", { name: "Preview code" }).fill("export default function {");
  await page.getByRole("button", { name: "Apply preview" }).click();
  await expect(page.getByRole("alert")).toBeVisible();
  await page.getByRole("textbox", { name: "Preview code" }).fill('export default () => <div>Recovered preview</div>;');
  await page.getByRole("button", { name: "Apply preview" }).click();
  await expect(page.frameLocator("iframe").getByText("Recovered preview")).toBeVisible();
  await expect(page.getByRole("alert")).toHaveCount(0);
});

test("rejects messages from the editor window", async ({ page }) => {
  await expect(page.frameLocator("iframe").getByText("Isolated preview")).toBeVisible();
  await page.evaluate(() => {
    const frame = document.querySelector("iframe")!;
    const channel = frame.srcdoc.match(/data-preview-channel="([^"]+)"/)![1];
    window.postMessage({ kind: "flexui-preview", channel, type: "error", message: "forged editor message" }, "*");
  });
  await expect(page.getByRole("alert")).toHaveCount(0);
});

test("supports actual keyboard focus and a visual menu baseline", async ({ page }) => {
  const trigger = page.getByRole("button", { name: "Actions", exact: true });
  await trigger.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("menuitem", { name: "First" })).toBeFocused();
  await page.keyboard.press("ArrowUp");
  await expect(page.getByRole("menuitem", { name: "Second" })).toBeFocused();
  await expect(page.getByTestId("menu-example")).toHaveScreenshot("dropdown-open.png", { animations: "disabled", maxDiffPixelRatio: 0.02 });
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
});

test("keeps the real popover open while typing and compares its appearance", async ({ page }) => {
  await page.getByRole("button", { name: "Open popover" }).click();
  await page.getByRole("textbox", { name: "Popover name" }).fill("Taylor");
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByRole("dialog")).toHaveScreenshot("popover-open.png", { animations: "disabled", maxDiffPixelRatio: 0.02 });
});

test("can change real parallax layers without a React crash", async ({ page }) => {
  await page.getByRole("button", { name: "Change layers" }).click();
  await expect(page.getByText("Layer 3", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Change layers" }).click();
  await expect(page.getByText("Layer 3", { exact: true })).toHaveCount(0);
});
