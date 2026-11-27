import { test, expect, type Locator, type Page, type TestInfo } from "@playwright/test";

// Screenshots for the designer's visual review: every state of the current design
// (_project/design/F-002/mockup-b.html, plan VS-002 §4).
// Run only with the `captures` project. Files go to the test output folder, so the
// command's --output decides where they end up.

const IPHONE = { width: 390, height: 844 };
const NARROW = { width: 320, height: 568 };
// What the page keeps in sight with the keyboard open on that iPhone (F-003 §5.2). The
// keyboard and the bars of Safari are not drawn: it is an approximation (plan VS-002 §4).
const ABOVE_KEYBOARD = { width: 390, height: 427 };
const SCHEMES = [
  { scheme: "light", name: "claro" },
  { scheme: "dark", name: "oscuro" },
] as const;

// Phrase of state 4 in the mockup (100 characters).
const LONG_PHRASE =
  "El niño Mateo tiene 7 años y lee cuentos largos con su abuela. ¡Hoy contó 25 ovejas antes de dormir!";

// Phrase of state 2b in the mockup (50 characters, F-003 §5.5).
const FIFTY_PHRASE = "el sol sale y la luna se va a dormir en su camita.";

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

  // State 2b: the 50 character phrase, field focused. How many lines it takes depends
  // on the font (L-010), so it is not asserted here.
  const fiftyFile = `estado-2b-frase-50-${IPHONE.width}x${IPHONE.height}-${name}.png`;

  test(`TC-061 — captura ${fiftyFile}`, async ({ page }, testInfo) => {
    expect([...FIFTY_PHRASE]).toHaveLength(50);
    await open(page, IPHONE, scheme);
    const field = page.getByTestId("text-field");
    await field.pressSequentially(FIFTY_PHRASE);
    await expect(field).toHaveValue(FIFTY_PHRASE);
    await expect(field).toBeFocused();
    await expectCounts(page, [17, 20, 0, 1]);
    await capture(page, testInfo, fiftyFile);
  });

  // States 2 and 2b again, cut at what the keyboard leaves in sight, with the screen not
  // moved. Whether the cards fit is not asserted here: that is TC-061 in
  // didactic-screen.spec.ts, so the designer also gets the screenshot when they do not.
  for (const { state, text, counts } of [
    { state: "2", text: "pingüino", counts: [4, 4, 0, 0] },
    { state: "2b", text: FIFTY_PHRASE, counts: [17, 20, 0, 1] },
  ]) {
    const { width, height } = ABOVE_KEYBOARD;
    const keyboardFile = `estado-${state}-teclado-${width}x${height}-${name}.png`;

    test(`TC-061 — captura ${keyboardFile}`, async ({ page }, testInfo) => {
      await open(page, ABOVE_KEYBOARD, scheme);
      const field = page.getByTestId("text-field");
      await field.pressSequentially(text);
      await expect(field).toHaveValue(text);
      await expect(field).toBeFocused();
      await expectCounts(page, counts);
      expect(await page.evaluate(() => window.scrollY), "scroll").toBe(0);
      await capture(page, testInfo, keyboardFile);
    });
  }

  // State 5: the narrowest width with "100" in Vowels, without focus.
  const narrowFile = `estado-5-100-a-${NARROW.width}x${NARROW.height}-${name}.png`;

  test(`TC-064 — captura ${narrowFile}`, async ({ page }, testInfo) => {
    await open(page, NARROW, scheme);
    const field = page.getByTestId("text-field");
    const text = "a".repeat(100);
    await field.fill(text);
    await field.blur();
    await expect(field).toHaveValue(text);
    await expect(field).not.toBeFocused();
    await expectCounts(page, [100, 0, 0, 0]);
    await capture(page, testInfo, narrowFile);
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

  test(`estado 4b — tope de 5 líneas: captura ${capFile}`, async ({ page }, testInfo) => {
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
