import { test, expect } from "@playwright/test";

// Runs only in the "published" project, whose baseURL is E2E_BASE_URL (plan VS-001 §5.3).
test("P-2: la dirección publicada abre con el título Contapp", async ({ page }) => {
  // Without this guard, a missing variable would fail with an unclear navigation error.
  expect(
    process.env.E2E_BASE_URL,
    "E2E_BASE_URL must hold the published address",
  ).toBeTruthy();

  await page.goto("/");

  await expect(page).toHaveTitle("Contapp");
  await expect(page.getByTestId("app-title")).toHaveText("Contapp");
  await expect(page.locator("html")).toHaveAttribute("lang", "es-CO");
});
