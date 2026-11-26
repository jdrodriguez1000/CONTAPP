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

// Phrase of state 3 in the mockup.
const MIXED_PHRASE = "¡Hola, 2026! \u{1F600}";

// So a screenshot is never taken of a screen that shows other numbers.
async function expectCounts(page: Page, counts: number[]) {
  for (const [index, key] of ["vowel", "consonant", "digit", "other"].entries()) {
    await expect(page.getByTestId(`count-${key}`)).toHaveText(String(counts[index]));
  }
}

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

  // State 2: "pingüino" typed, field focused (the phone keyboard is not simulated).
  const typingFile = `estado-2-escribiendo-${IPHONE.width}x${IPHONE.height}-${name}.png`;

  test(`TC-002 — captura ${typingFile}`, async ({ page }, testInfo) => {
    await open(page, IPHONE, scheme);
    const field = page.getByTestId("text-field");
    await field.pressSequentially("pingüino");
    await expect(field).toHaveValue("pingüino");
    await expect(field).toBeFocused();
    await expectCounts(page, [4, 4, 0, 0]);
    await capture(page, testInfo, typingFile);
  });

  // State 3: phrase with numbers, signs and an emoji, without focus.
  const withTextFile = `estado-3-con-texto-${IPHONE.width}x${IPHONE.height}-${name}.png`;

  test(`TC-002 — captura ${withTextFile}`, async ({ page }, testInfo) => {
    await open(page, IPHONE, scheme);
    const field = page.getByTestId("text-field");
    await field.fill(MIXED_PHRASE);
    await field.blur();
    await expect(field).toHaveValue(MIXED_PHRASE);
    await expect(field).not.toBeFocused();
    await expectCounts(page, [2, 2, 4, 4]);
    await capture(page, testInfo, withTextFile);
  });

  // Only to see the field grown to 5 lines; the full state 4 arrives in batch 4.
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
