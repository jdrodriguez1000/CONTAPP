import { test, expect, type Locator, type Page } from "@playwright/test";

// P-3 (plan VS-001 §3 and §5.1; F-001 §5): the screen, before it counts.
// This file keeps running in later batches, so nothing here expects a count of 0
// after text has been typed.

const LABEL = "Escribe una palabra o frase";
const GROUPS = [
  { key: "vowel", name: "Vocales" },
  { key: "consonant", name: "Consonantes" },
  { key: "digit", name: "Números" },
  { key: "other", name: "Otros" },
];

async function box(locator: Locator) {
  const result = await locator.boundingBox();
  if (!result) throw new Error("element has no bounding box");
  return result;
}

async function fieldHeight(field: Locator) {
  return (await box(field)).height;
}

function linesOfText(count: number) {
  return Array.from({ length: count }, () => "a").join("\n");
}

async function expectNoHorizontalScroll(page: Page, field: Locator) {
  const sizes = await page.evaluate(() => ({
    scroll: document.documentElement.scrollWidth,
    client: document.documentElement.clientWidth,
  }));
  expect(sizes.scroll).toBeLessThanOrEqual(sizes.client);
  const fieldOverflow = await field.evaluate((el) => el.scrollWidth - el.clientWidth);
  expect(fieldOverflow).toBeLessThanOrEqual(0);
}

test("TC-001 — al abrir: campo vacío, los 4 grupos en 0 y sin pantalla de cuenta (C-010, C-012)", async ({
  page,
}) => {
  const dialogs: string[] = [];
  page.on("dialog", (dialog) => {
    dialogs.push(dialog.message());
    void dialog.dismiss();
  });

  await page.goto("/");

  const field = page.getByTestId("text-field");
  await expect(field).toBeVisible();
  await expect(field).toHaveValue("");
  await expect(field).not.toBeFocused();

  for (const group of GROUPS) {
    const card = page.getByTestId(`count-card-${group.key}`);
    await expect(card).toBeVisible();
    await expect(card.locator("dt")).toHaveText(group.name);
    await expect(page.getByTestId(`count-${group.key}`)).toHaveText(/^0$/);
  }

  await expect(page).toHaveTitle("Contapp");
  await expect(page.locator("html")).toHaveAttribute("lang", "es-CO");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Contapp");

  // No account screen: same address, and the text field is the only control.
  expect(new URL(page.url()).pathname).toBe("/");
  await expect(page.locator("input, textarea, select, button")).toHaveCount(1);
  await expect(page.locator('input[type="password"]')).toHaveCount(0);

  // The visible text is only title, label, names and numbers: no notices.
  const visibleText = await page.locator("body").innerText();
  expect(visibleText.replace(/\s+/g, " ").trim()).toBe(
    `Contapp ${LABEL} Vocales 0 Consonantes 0 Números 0 Otros 0`,
  );
  await expect(
    page.locator('[role="alert"], [role="status"], [role="dialog"], [aria-live], dialog'),
  ).toHaveCount(0);
  expect(dialogs).toEqual([]);
});

test("TC-026 — los grupos se llaman exactamente Vocales, Consonantes, Números y Otros, en ese orden (C-013)", async ({
  page,
}) => {
  await page.goto("/");

  const grid = page.getByTestId("count-grid");
  await expect(grid.locator("dt")).toHaveText(GROUPS.map((group) => group.name));
  expect(await grid.evaluate((el) => el.tagName)).toBe("DL");

  const cards = grid.locator('[data-testid^="count-card-"]');
  await expect(cards).toHaveCount(4);
  expect(await cards.evaluateAll((els) => els.map((el) => el.getAttribute("data-testid")))).toEqual(
    GROUPS.map((group) => `count-card-${group.key}`),
  );

  for (const group of GROUPS) {
    const card = page.getByTestId(`count-card-${group.key}`);
    // Name before value in the HTML, so it reads "Vocales, 0".
    expect(
      await card.locator("dt, dd").evaluateAll((els) => els.map((el) => el.tagName)),
    ).toEqual(["DT", "DD"]);
    await expect(card.locator("dd")).toHaveAttribute("data-testid", `count-${group.key}`);
    // On screen the number is above the name.
    expect((await box(card.locator("dd"))).y).toBeLessThan((await box(card.locator("dt"))).y);
  }

  // 2 x 2 grid: Vocales, Consonantes / Números, Otros.
  const [vowel, consonant, digit, other] = await Promise.all(
    GROUPS.map((group) => box(page.getByTestId(`count-card-${group.key}`))),
  );
  expect(Math.abs(vowel.y - consonant.y)).toBeLessThan(1);
  expect(Math.abs(digit.y - other.y)).toBeLessThan(1);
  expect(Math.abs(vowel.x - digit.x)).toBeLessThan(1);
  expect(Math.abs(consonant.x - other.x)).toBeLessThan(1);
  expect(vowel.x).toBeLessThan(consonant.x);
  expect(vowel.y).toBeLessThan(digit.y);

  // Fixed order from top to bottom: title, label, field, grid.
  const tops = [
    (await box(page.getByTestId("app-title"))).y,
    (await box(page.locator('label[for="text-field"]'))).y,
    (await box(page.getByTestId("text-field"))).y,
    (await box(grid)).y,
  ];
  expect(tops).toEqual([...tops].sort((a, b) => a - b));
});

test("TC-031 — el campo apaga corrector y sugerencias del teclado (C-009, D-009)", async ({
  page,
}) => {
  await page.goto("/");

  const field = page.getByTestId("text-field");
  await expect(field).toHaveAttribute("autocomplete", "off");
  await expect(field).toHaveAttribute("autocorrect", "off");
  await expect(field).toHaveAttribute("autocapitalize", "off");
  await expect(field).toHaveAttribute("spellcheck", "false");
  await expect(field).toHaveAttribute("id", "text-field");
  await expect(field).toHaveAttribute("rows", "2");
  expect(await field.evaluate((el) => el.tagName)).toBe("TEXTAREA");

  for (const attribute of ["placeholder", "maxlength", "readonly", "disabled"]) {
    expect(await field.getAttribute(attribute), `attribute ${attribute}`).toBeNull();
  }

  // Visible label tied to the field: tapping it activates the field.
  await expect(page.locator('label[for="text-field"]')).toHaveText(LABEL);
  await expect(page.getByLabel(LABEL)).toHaveAttribute("data-testid", "text-field");
  await page.locator('label[for="text-field"]').tap();
  await expect(field).toBeFocused();
});

test('TC-031 — escribir "cas" y un espacio deja el texto igual, "cas " (C-009, D-009)', async ({
  page,
}) => {
  await page.goto("/");

  const field = page.getByTestId("text-field");
  await expect(field).toBeVisible();
  await field.pressSequentially("cas ");

  await expect(field).toHaveValue("cas ");
});

test("TC-031 — el texto del campo es solo lo escrito, con mayúsculas tal cual y salto de línea (C-009, A-001)", async ({
  page,
}) => {
  await page.goto("/");

  const field = page.getByTestId("text-field");
  await expect(field).toBeVisible();
  await field.pressSequentially("hola MAMÁ");
  await field.press("Enter");
  await field.pressSequentially("niño ");

  await expect(field).toHaveValue("hola MAMÁ\nniño ");
});

test("P-3 — el campo empieza en 2 líneas, crece hasta 5, luego se desplaza por dentro y vuelve a encoger", async ({
  page,
}) => {
  await page.goto("/");

  const field = page.getByTestId("text-field");
  await expect(field).toBeVisible();
  const emptyHeight = await fieldHeight(field);
  // 2 lines of 24px x 1.3, plus 12px padding and 2px border on each side (about 90px).
  expect(emptyHeight).toBeGreaterThanOrEqual(86);
  expect(emptyHeight).toBeLessThanOrEqual(95);
  const lineHeight = 24 * 1.3;

  for (const lines of [1, 2, 3, 4, 5]) {
    await field.fill(linesOfText(lines));
    const expected = emptyHeight + Math.max(0, lines - 2) * lineHeight;
    await expect
      .poll(async () => Math.abs((await fieldHeight(field)) - expected), {
        message: `height with ${lines} lines`,
      })
      .toBeLessThanOrEqual(3);
    // Everything is visible: nothing hidden inside the field.
    expect(
      await field.evaluate((el) => el.scrollHeight - el.clientHeight),
      `hidden pixels with ${lines} lines`,
    ).toBeLessThanOrEqual(1);
  }
  const fiveLinesHeight = await fieldHeight(field);

  for (const lines of [6, 20]) {
    await field.fill(linesOfText(lines));
    await expect
      .poll(async () => Math.abs((await fieldHeight(field)) - fiveLinesHeight), {
        message: `height with ${lines} lines`,
      })
      .toBeLessThanOrEqual(1);
    const inner = await field.evaluate((el) => ({
      hidden: el.scrollHeight - el.clientHeight,
      overflowY: getComputedStyle(el).overflowY,
    }));
    expect(inner.hidden).toBeGreaterThan(0);
    expect(["auto", "scroll"]).toContain(inner.overflowY);
  }

  await field.fill("");
  await expect
    .poll(async () => Math.abs((await fieldHeight(field)) - emptyHeight))
    .toBeLessThanOrEqual(1);
});

test("P-3 — el campo también crece letra por letra cuando el texto pasa de renglón, sin desplazamiento horizontal", async ({
  page,
}) => {
  await page.goto("/");

  const field = page.getByTestId("text-field");
  await expect(field).toBeVisible();
  const emptyHeight = await fieldHeight(field);

  // A single word with no spaces, typed key by key.
  await field.pressSequentially("m".repeat(60));

  await expect.poll(() => fieldHeight(field)).toBeGreaterThan(emptyHeight + 20);
  await expectNoHorizontalScroll(page, field);
});

for (const width of [390, 320]) {
  test(`P-3 — a ${width} px las 4 fichas caben, sin desplazamiento horizontal y con la letra del diseño`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: width === 320 ? 568 : 844 });
    await page.goto("/");

    const field = page.getByTestId("text-field");
    await expect(field).toBeVisible();
    await expect(field).toHaveCSS("font-size", "24px");

    const narrow = width < 360;
    for (const group of GROUPS) {
      const card = page.getByTestId(`count-card-${group.key}`);
      const cardBox = await box(card);
      expect(cardBox.x).toBeGreaterThanOrEqual(0);
      expect(cardBox.x + cardBox.width).toBeLessThanOrEqual(width);
      expect(cardBox.height).toBeGreaterThanOrEqual(104);

      const nameBox = await box(card.locator("dt"));
      expect(nameBox.x, group.name).toBeGreaterThanOrEqual(cardBox.x);
      expect(nameBox.x + nameBox.width, group.name).toBeLessThanOrEqual(cardBox.x + cardBox.width);
      expect(
        await card.locator("dt").evaluate((el) => el.scrollWidth - el.clientWidth),
        group.name,
      ).toBeLessThanOrEqual(0);

      await expect(card.locator("dt")).toHaveCSS("font-size", narrow ? "18px" : "20px");
      await expect(card.locator("dd")).toHaveCSS("font-size", narrow ? "44px" : "48px");
    }

    await expectNoHorizontalScroll(page, field);
    await field.fill("m".repeat(100));
    await expectNoHorizontalScroll(page, field);
  });
}

test("P-3 — los colores siguen el modo claro u oscuro del celular, sin botón (D-010)", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");

  const number = page.getByTestId("count-vowel");
  const card = page.getByTestId("count-card-vowel");
  // --color-primary and --color-surface from design-system.md §2.
  await expect(number).toHaveCSS("color", "rgb(31, 107, 51)");
  await expect(card).toHaveCSS("background-color", "rgb(238, 245, 238)");

  await page.emulateMedia({ colorScheme: "dark" });

  await expect(number).toHaveCSS("color", "rgb(255, 221, 85)");
  await expect(card).toHaveCSS("background-color", "rgb(28, 46, 32)");
});
