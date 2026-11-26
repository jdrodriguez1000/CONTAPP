import { test, expect, type Locator, type Page, type TestInfo } from "@playwright/test";

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

// 7 line breaks: 16 vowels and 18 consonants.
const EIGHT_LINES = ["uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho"];

async function hiddenPixels(field: Locator) {
  return field.evaluate((el) => el.scrollHeight - el.clientHeight);
}

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

  // State 4: the 100 character phrase, whole, without focus, notice or limit mark.
  const limitFile = `estado-4-limite-100-${IPHONE.width}x${IPHONE.height}-${name}.png`;

  test(`TC-021 — captura ${limitFile}`, async ({ page }, testInfo) => {
    expect([...LONG_PHRASE]).toHaveLength(100);
    await open(page, IPHONE, scheme);
    const field = page.getByTestId("text-field");
    await field.fill(LONG_PHRASE);
    await field.blur();
    await expect(field).toHaveValue(LONG_PHRASE);
    await expect(field).not.toBeFocused();
    await expectCounts(page, [35, 40, 3, 3]);
    // The whole phrase is visible: nothing hidden inside the field.
    expect(await hiddenPixels(field)).toBeLessThanOrEqual(1);
    await capture(page, testInfo, limitFile);
  });

  // The cap of the field (design §5.3): 8 lines of text, 5 visible, inner scroll.
  const capFile = `estado-4-tope-5-lineas-${IPHONE.width}x${IPHONE.height}-${name}.png`;

  test(`P-3 — captura ${capFile}`, async ({ page }, testInfo) => {
    await open(page, IPHONE, scheme);
    const field = page.getByTestId("text-field");

    // Height of 5 lines, measured with exactly 5 lines of text.
    await field.fill(EIGHT_LINES.slice(0, 5).join("\n"));
    const fiveLinesHeight = (await field.boundingBox())?.height ?? 0;
    expect(await hiddenPixels(field)).toBeLessThanOrEqual(1);

    const text = EIGHT_LINES.join("\n");
    await field.fill(text);
    await field.blur();
    await expect(field).toHaveValue(text);
    await expectCounts(page, [16, 18, 0, 0]);
    expect((await field.boundingBox())?.height).toBeCloseTo(fiveLinesHeight, 0);
    expect(await hiddenPixels(field)).toBeGreaterThan(0);
    await capture(page, testInfo, capFile);
  });
}
