import { test, expect } from "@playwright/test";

test("homepage renders hero and nav", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("nav")).toBeVisible();
  await expect(page.locator("h1")).toBeVisible();
});

test("theme toggle switches dark/light", async ({ page }) => {
  await page.goto("/");
  const html = page.locator("html");
  const toggle = page.getByRole("button", { name: /theme|dark|light/i });
  const before = await html.getAttribute("class");
  await toggle.click();
  const after = await html.getAttribute("class");
  expect(before).not.toEqual(after);
});

test("nav links navigate correctly", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: /writing/i }).first().click();
  await expect(page).toHaveURL(/\/writing/);
  await page.getByRole("link", { name: /contact/i }).first().click();
  await expect(page).toHaveURL(/\/contact/);
});

test("404 page shows for unknown route", async ({ page }) => {
  const res = await page.goto("/this-does-not-exist");
  expect(res?.status()).toBe(404);
});
