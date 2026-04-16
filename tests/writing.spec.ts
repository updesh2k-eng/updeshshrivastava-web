import { test, expect } from "@playwright/test";

test("writing page lists posts", async ({ page }) => {
  await page.goto("/writing");
  await expect(page.locator("h1, h2").first()).toBeVisible();
});

test("MDX post has no comment section", async ({ page }) => {
  // MDX posts (non-Supabase) should never show the comment form
  await page.goto("/writing/eight-weeks-building-ai");
  await expect(page.getByRole("heading", { name: /comments/i })).not.toBeVisible();
});

test("comment form shows on native post and validates required fields", async ({ page }) => {
  // Uses a slug known to be a Supabase post; skip if it doesn't exist yet
  await page.goto("/writing/test-post");
  const commentSection = page.getByRole("heading", { name: /comments/i });
  if (!(await commentSection.isVisible())) return; // post not published yet

  // Submit empty → browser validation blocks it
  await page.getByRole("button", { name: /post comment/i }).click();
  await expect(page.locator("input[name], input[required]").first()).toBeFocused();
});

test("comment form shows error on Supabase failure", async ({ page }) => {
  await page.route("**/rest/v1/post_comments*", (route) =>
    route.fulfill({ status: 500, body: JSON.stringify({ message: "DB error" }) })
  );
  await page.goto("/writing/test-post");
  const heading = page.getByRole("heading", { name: /comments/i });
  if (!(await heading.isVisible())) return;

  await page.fill("input[placeholder*='name' i]", "Test");
  await page.fill("input[type='email']", "test@example.com");
  await page.fill("textarea", "Hello world");
  await page.getByRole("button", { name: /post comment/i }).click();
  await expect(page.getByText(/failed|error/i)).toBeVisible({ timeout: 5000 });
});
