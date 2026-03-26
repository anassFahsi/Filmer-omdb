import { test, expect } from "@playwright/test";

// =========================================================
// G – One basic E2E test
//
// Verify that the application loads correctly in the browser.
// =========================================================

test("search form is visible on page load", async ({page}) => {await page.goto('/');
  await expect(page.locator('#search-form')).toBeVisible()
});

// =========================================================
// VG – Additional E2E tests (write at least 2)
//
// Identify and write E2E tests that verify real user flows
// in the browser. The tests should cover meaningful behaviour.
//
// You decide what to test — but your choices should be
// justified by what a real user would do with this application.
// =========================================================
test("searching for a movie shows results", async ({ page }) => {

  await page.goto("/");
  await page.fill("#search-input", "Batman");
  await page.click("#search-form button[type='submit']");
  const movieList = page.locator("#movie-list");

  await expect(movieList.locator(".movie-card").first()).toBeVisible();
  await expect(movieList).toContainText("Batman");
});

// =========================================================

// Verify that submitting an empty search does not show results
// and keeps the movie list empty.
// =========================================================

test("submitting empty search does not show results", async ({ page }) => {
  
  await page.goto("/");
  await page.click("#search-form button[type='submit']");

  const movieList = page.locator("#movie-list");
  await expect(movieList).toBeEmpty();
  const resultInfo = page.locator("#result-info");
  await expect(resultInfo).toHaveText("");
});
