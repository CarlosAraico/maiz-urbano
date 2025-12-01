import { test, expect } from "@playwright/test";

test("MU Mount loads into landing", async ({ page }) => {
  await page.goto("http://localhost:3000");
  await expect(page.locator("#mu-root")).toBeVisible();
});
