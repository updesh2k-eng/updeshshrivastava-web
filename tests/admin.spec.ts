import { test, expect } from "@playwright/test";

// All admin tests mock Supabase auth so no real credentials are needed in CI.

test("admin redirects to login when unauthenticated", async ({ page }) => {
  await page.route("**/auth/v1/session*", (route) =>
    route.fulfill({ status: 200, body: JSON.stringify({ data: { session: null } }) })
  );
  await page.goto("/admin");
  await expect(page.getByRole("button", { name: /sign in|log in/i })).toBeVisible({ timeout: 8000 });
});

test("admin dashboard shows all nav cards when authenticated", async ({ page }) => {
  // Mock a valid session
  await page.route("**/auth/v1/**", (route) =>
    route.fulfill({
      status: 200,
      body: JSON.stringify({ data: { session: { access_token: "mock", user: { id: "1" } } } }),
    })
  );
  await page.route("**/rest/v1/posts*", (route) =>
    route.fulfill({ status: 200, body: "[]" })
  );
  await page.goto("/admin");
  await expect(page.getByText(/blog posts/i)).toBeVisible({ timeout: 8000 });
  await expect(page.getByText(/navigation/i)).toBeVisible();
  await expect(page.getByText(/comments/i)).toBeVisible();
  await expect(page.getByText(/ai memory/i)).toBeVisible();
});

test("admin comment moderation shows pending badge", async ({ page }) => {
  await page.route("**/auth/v1/**", (route) =>
    route.fulfill({
      status: 200,
      body: JSON.stringify({ data: { session: { access_token: "mock", user: { id: "1" } } } }),
    })
  );
  await page.route("**/rest/v1/post_comments*", (route) =>
    route.fulfill({
      status: 200,
      body: JSON.stringify([
        { id: "1", post_slug: "test-post", name: "Alice", email: "a@a.com", content: "Great post!", approved: false, created_at: new Date().toISOString() },
      ]),
    })
  );
  await page.goto("/admin");
  // Navigate to comments
  await page.getByText(/comments/i).click();
  await expect(page.getByText(/awaiting approval/i)).toBeVisible({ timeout: 5000 });
  await expect(page.getByText("Alice")).toBeVisible();
});
