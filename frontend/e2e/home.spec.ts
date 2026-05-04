import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test("loads and shows hero section", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Pack your bags")).toBeVisible();
  });

  test("navigates to destinations section", async ({ page }) => {
    await page.goto("/");
    await page.locator("nav").getByRole("button", { name: "Destinations" }).click();
    await expect(page.getByText("เลือกแล้วเราจะช่วยวางแผนทุกอย่างให้คุณ")).toBeVisible();
  });

  test("shows pricing section", async ({ page }) => {
    await page.goto("/");
    await page.locator("nav").getByRole("button", { name: "Pricing" }).click();
    await expect(page.getByText("฿0")).toBeVisible();
  });
});
