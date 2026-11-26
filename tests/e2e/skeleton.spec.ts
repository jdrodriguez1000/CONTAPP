import { test, expect } from "@playwright/test";

// P-1 (plan VS-001 §3 and §5.1): minimal page that only shows the app name.
test("P-1: la página abre con el título Contapp", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle("Contapp");
  await expect(page.getByTestId("app-title")).toHaveText("Contapp");
  await expect(page.locator("html")).toHaveAttribute("lang", "es-CO");
});
