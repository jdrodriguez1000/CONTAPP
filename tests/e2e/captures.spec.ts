import { test, expect, type Page, type TestInfo } from "@playwright/test";

// Screenshots for the designer's visual review (design: _project/design/F-001/mockup.html).
// Run only with the `captures` project (plan VS-001 §8.2). Files go to the test
// output folder, so the command's --output decides where they end up.

const IPHONE = { width: 390, height: 844 };
const NARROW = { width: 320, height: 568 };
const SCHEMES = [
  { scheme: "light", name: "claro" },
  { scheme: "dark", name: "oscuro" },
] as const;

// Phrase of state 4 in the mockup (100 characters).
const LONG_PHRASE =
  "El niño Mateo tiene 7 años y lee cuentos largos con su abuela. ¡Hoy contó 25 ovejas antes de dormir!";

async function open(page: Page, size: typeof IPHONE, scheme: "light" | "dark") {
  await page.setViewportSize(size);
  await page.emulateMedia({ colorScheme: scheme });
  await page.goto("/");
  await expect(page.getByTestId("text-field")).toBeVisible();
  await expect(page.getByTestId("count-grid")).toBeVisible();
}

async function capture(page: Page, testInfo: TestInfo, fileName: string) {
  await page.screenshot({ path: testInfo.outputPath(fileName), scale: "css" });
}

for (const { scheme, name } of SCHEMES) {
  for (const size of [IPHONE, NARROW]) {
    const fileName = `estado-1-vacio-${size.width}x${size.height}-${name}.png`;

    test(`TC-001 — captura ${fileName}`, async ({ page }, testInfo) => {
      await open(page, size, scheme);
      await capture(page, testInfo, fileName);
    });
  }

  // Batch 2: only to see the field grown to 5 lines; counting is not connected yet.
  const growthFile = `estado-4-crecimiento-${IPHONE.width}x${IPHONE.height}-${name}.png`;

  test(`P-3 — captura ${growthFile}`, async ({ page }, testInfo) => {
    await open(page, IPHONE, scheme);
    const field = page.getByTestId("text-field");
    await field.fill(LONG_PHRASE);
    await field.blur();
    await expect(field).toHaveValue(LONG_PHRASE);
    await capture(page, testInfo, growthFile);
  });
}
