import { test, expect } from "@playwright/test";

test("contact form renders all fields", async ({ page }) => {
  await page.goto("/contact");
  await expect(page.locator("input[type='text']")).toBeVisible();
  await expect(page.locator("input[type='email']")).toBeVisible();
  await expect(page.locator("textarea")).toBeVisible();
});

test("contact form requires all fields before submit", async ({ page }) => {
  await page.goto("/contact");
  await page.getByRole("button", { name: /send/i }).click();
  // Browser required-field validation keeps us on same page
  await expect(page).toHaveURL(/\/contact/);
});

test("contact form shows success on valid submit", async ({ page }) => {
  await page.route("**/rest/v1/contact_messages*", (route) =>
    route.fulfill({ status: 201, body: "[]" })
  );
  await page.goto("/contact");
  await page.fill("input[type='text']", "Updesh");
  await page.fill("input[type='email']", "test@example.com");
  await page.fill("textarea", "Hello!");
  await page.getByRole("button", { name: /send/i }).click();
  await expect(page.getByText(/message sent/i)).toBeVisible({ timeout: 5000 });
});

test("contact form shows error on Supabase failure", async ({ page }) => {
  await page.route("**/rest/v1/contact_messages*", (route) =>
    route.fulfill({ status: 500, body: JSON.stringify({ message: "DB error" }) })
  );
  await page.goto("/contact");
  await page.fill("input[type='text']", "Updesh");
  await page.fill("input[type='email']", "test@example.com");
  await page.fill("textarea", "Hello!");
  await page.getByRole("button", { name: /send/i }).click();
  await expect(page.getByText(/wrong|error|fail/i)).toBeVisible({ timeout: 5000 });
});

test("subscribe form rejects duplicate email", async ({ page }) => {
  await page.route("**/rest/v1/subscribers*", (route) =>
    route.fulfill({ status: 409, body: JSON.stringify({ code: "23505" }) })
  );
  await page.goto("/");
  await page.fill("input[type='email']", "dup@example.com");
  await page.getByRole("button", { name: /subscribe/i }).click();
  await expect(page.getByText(/already subscribed/i)).toBeVisible({ timeout: 5000 });
});
