import { test, expect, type Locator, type Page } from "@playwright/test";
import {
  expectImageBesideNumber,
  expectNoNotice,
  expectState,
  openApp,
  paste,
  readCounts,
  type,
} from "./field-helpers";

// F-003: the screen for children (plan VS-002 P-4, P-5 and §5.1; F-003 CA-18 to CA-21).
// Widths and sizes are the ones of F-003 §5.4 and F-002 §5.2. How wide "100" or
// "Consonantes" come out depends on the font (L-010): what CA-21 asks is checked with the
// font of the machine, the widths of the design with a font set by the test, and the
// iPhone has the last word.
// The vertical measures of P-5 (F-003 §5.3) come from sizes, spaces and line heights
// written as numbers, so they are checked with the font of the machine. The only text that
// wraps by itself is built to fill 2 lines with whatever font there is.

const KEYS = ["vowel", "consonant", "digit", "other"];
const NAMES = ["Vocales", "Consonantes", "Números", "Otros"];

// Less than 360 px wide is a narrow screen.
const SIZES = [
  { width: 390, height: 844, count: 48, name: 20, image: 44, gap: 8, side: 8 },
  { width: 320, height: 568, count: 44, name: 18, image: 32, gap: 4, side: 4 },
];
// Right below and right at the limit between the two (plan §5.1).
const LIMIT = [
  { width: 359, height: 700, count: 44, name: 18, image: 32, gap: 4, side: 4 },
  { width: 360, height: 700, count: 48, name: 20, image: 44, gap: 8, side: 8 },
];

async function openAt(page: Page, size: { width: number; height: number }) {
  await page.setViewportSize({ width: size.width, height: size.height });
  return openApp(page);
}

async function box(locator: Locator) {
  const result = await locator.boundingBox();
  if (!result) throw new Error("element has no bounding box");
  return result;
}

// The space of a card that its content may use: without border and padding.
async function contentSides(card: Locator) {
  return card.evaluate((el) => {
    const rect = el.getBoundingClientRect();
    const style = getComputedStyle(el);
    return {
      left: rect.left + parseFloat(style.borderLeftWidth) + parseFloat(style.paddingLeft),
      right: rect.right - parseFloat(style.borderRightWidth) - parseFloat(style.paddingRight),
    };
  });
}

async function expectNoHorizontalScroll(page: Page) {
  const sizes = await page.evaluate(() => {
    const field = document.querySelector('[data-testid="text-field"]') as Element;
    return {
      page: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      field: field.scrollWidth - field.clientWidth,
    };
  });
  expect(sizes.page, "horizontal scroll of the page").toBeLessThanOrEqual(0);
  expect(sizes.field, "horizontal scroll of the field").toBeLessThanOrEqual(0);
}

// What CA-21 asks, with the font of the machine that runs the test: the 4 cards fit across
// the screen, with the whole name and number inside their card. How wide each column comes
// out depends on that font, so it is not checked here (see expectDesignWidths).
async function expectCardsFit(page: Page, width: number) {
  for (const [index, key] of KEYS.entries()) {
    const card = page.getByTestId(`count-card-${key}`);
    const cardBox = await box(card);
    expect(cardBox.x, `left side of ${key}`).toBeGreaterThanOrEqual(0);
    expect(cardBox.x + cardBox.width, `right side of ${key}`).toBeLessThanOrEqual(width);

    await expect(card.locator("dt")).toHaveText(NAMES[index]);
    const inside = await contentSides(card);
    for (const part of ["dt", "dd"]) {
      const partBox = await box(card.locator(part));
      expect(partBox.x, `${part} of ${key}, left`).toBeGreaterThanOrEqual(inside.left - 0.5);
      expect(partBox.x + partBox.width, `${part} of ${key}, right`).toBeLessThanOrEqual(
        inside.right + 0.5,
      );
      expect(
        await card.locator(part).evaluate((el) => el.scrollWidth - el.clientWidth),
        `${part} of ${key}, cut`,
      ).toBeLessThanOrEqual(0);
    }
  }
}

// Arial and Liberation Sans have the same widths: one is on Windows and the other one comes
// with `playwright install --with-deps` on the Linux of the CI. Neither is the SF Pro of
// the iPhone. The numbers are measured in bold (700), which both have: with the 800 of the
// app, Windows takes the wider Arial Black, that Liberation Sans does not have. The 800
// itself is checked by TC-059.
const DESIGN_FONT =
  'body, body * { font-family: Arial, "Liberation Sans" !important; } dd { font-weight: 700 !important; }';
// Widths in that font for each pixel of font size: "Consonantes" in bold (about 114 px at
// 18 px) and one digit in bold (about 24.5 px at 44 px).
const CONSONANTES_PER_PX = 114 / 18;
const DIGIT_PER_PX = 0.556;

async function textMetrics(locator: Locator) {
  return locator.evaluate((el) => {
    const range = document.createRange();
    range.selectNodeContents(el);
    return {
      width: range.getBoundingClientRect().width,
      size: parseFloat(getComputedStyle(el).fontSize),
      length: (el.textContent ?? "").length,
    };
  });
}

// Guard: without it, a machine with neither font would look like a broken design. It reads
// one name and one number, the two things whose width decides if a column grows.
async function expectDesignFont(page: Page) {
  const name = await textMetrics(page.getByTestId("count-card-consonant").locator("dt"));
  const number = await textMetrics(page.getByTestId("count-vowel"));

  for (const { what, got, expected } of [
    { what: '"Consonantes"', got: name, expected: CONSONANTES_PER_PX * name.size },
    { what: "the number of Vowels", got: number, expected: DIGIT_PER_PX * number.size * number.length },
  ]) {
    expect(
      Math.abs(got.width - expected),
      `the font of the test (Arial or Liberation Sans, bold) is not applied: ${what} at ${got.size}px is ${got.width}px wide, expected ${expected}px`,
    ).toBeLessThanOrEqual(1);
  }
}

// The widths of the design (F-002 §5.2, F-003 §5.8), with a font set by the test: margins
// of 16 px and two columns of the same width (173 px at 390 and 138 px at 320; a column
// grows when its content does not fit). The font of the app comes back at the end.
async function expectDesignWidths(page: Page, width: number) {
  const font = await page.addStyleTag({ content: DESIGN_FONT });
  await expectDesignFont(page);

  // The column of the app is 480 px at most; every width here is below that.
  const column = (width - 2 * 16 - 12) / 2;
  for (const key of KEYS) {
    const cardBox = await box(page.getByTestId(`count-card-${key}`));
    expect(
      Math.abs(cardBox.width - column),
      `width of the card of ${key}: ${cardBox.width}px, expected ${column}px`,
    ).toBeLessThanOrEqual(1);
    expect(cardBox.x, `left margin of ${key}`).toBeGreaterThanOrEqual(15.5);
    expect(cardBox.x + cardBox.width, `right margin of ${key}`).toBeLessThanOrEqual(width - 15.5);
  }

  await font.evaluate((el) => (el as Element).remove());
}

for (const size of SIZES) {
  test(`TC-059 — control, a ${size.width} px: número, nombre y campo con la letra de VS-001, y el campo no baja de 16 px (CA-18)`, async ({
    page,
  }) => {
    await openAt(page, size);

    for (const key of KEYS) {
      const value = page.getByTestId(`count-${key}`);
      await expect(value, `number of ${key}`).toHaveCSS("font-size", `${size.count}px`);
      await expect(value, `number of ${key}`).toHaveCSS("font-weight", "800");
      const name = page.getByTestId(`count-card-${key}`).locator("dt");
      await expect(name, `name of ${key}`).toHaveCSS("font-size", `${size.name}px`);
      await expect(name, `name of ${key}`).toHaveCSS("font-weight", "700");
    }
    // 24px at both widths, so it also stays above the 16px that make Safari zoom in.
    await expect(page.getByTestId("text-field")).toHaveCSS("font-size", "24px");
    await expect(page.getByTestId("text-field")).toHaveCSS("font-weight", "600");
  });
}

for (const size of [...SIZES, ...LIMIT]) {
  test(`TC-059 — a ${size.width} px, la imagen de cada grupo mide ${size.image} × ${size.image} px (CA-18)`, async ({
    page,
  }) => {
    await openAt(page, size);

    for (const key of KEYS) {
      const value = page.getByTestId(`count-${key}`);
      const before = { pseudo: "before" } as const;
      await expect(value, `image of ${key}`).toHaveCSS("content", '""', before);
      await expect(value, `image of ${key}`).toHaveCSS("width", `${size.image}px`, before);
      await expect(value, `image of ${key}`).toHaveCSS("height", `${size.image}px`, before);
      await expect(value, `number of ${key}`).toHaveCSS("font-size", `${size.count}px`);
    }
  });

  test(`TC-064 — a ${size.width} px, la ficha deja ${size.side} px a los lados y ${size.gap} px entre la imagen y el número`, async ({
    page,
  }) => {
    await openAt(page, size);

    for (const key of KEYS) {
      const card = page.getByTestId(`count-card-${key}`);
      await expect(card, `padding of ${key}`).toHaveCSS("padding-left", `${size.side}px`);
      await expect(card, `padding of ${key}`).toHaveCSS("padding-right", `${size.side}px`);
      await expect(page.getByTestId(`count-${key}`), `gap of ${key}`).toHaveCSS(
        "column-gap",
        `${size.gap}px`,
      );
    }
  });
}

test('TC-060 — control: al abrir y con "casa", solo se ven el título, la etiqueta, los 4 nombres y los números, y el campo es el único control (C-009, C-013)', async ({
  page,
}) => {
  const app = await openApp(page);
  const visibleText = async () =>
    (await page.locator("body").innerText()).replace(/\s+/g, " ").trim();

  expect(await visibleText()).toBe(
    "Contapp Escribe una palabra o frase Vocales 0 Consonantes 0 Números 0 Otros 0",
  );
  await expectNoNotice(app);

  await type(app, "casa");

  await expectState(app, "casa", "2/2/0/0");
  expect(await visibleText()).toBe(
    "Contapp Escribe una palabra o frase Vocales 2 Consonantes 2 Números 0 Otros 0",
  );
  await expect(page.locator("a[href], [role='button'], [contenteditable='true']")).toHaveCount(0);
});

for (const size of SIZES) {
  for (const { scheme, mode } of [
    { scheme: "light", mode: "modo claro" },
    { scheme: "dark", mode: "modo oscuro" },
  ] as const) {
    test(`TC-063 — a ${size.width} × ${size.height} en ${mode}: las 4 fichas caben, con los nombres completos y sin desplazamiento horizontal, también con 100 "m" (CA-21)`, async ({
      page,
    }) => {
      await page.emulateMedia({ colorScheme: scheme });
      const app = await openAt(page, size);

      await expectCardsFit(page, size.width);
      await expectNoHorizontalScroll(page);
      await expectDesignWidths(page, size.width);

      await paste(app, "m".repeat(100));

      expect(await readCounts(page)).toBe("0/100/0/0");
      await expectNoHorizontalScroll(page);
      await expectCardsFit(page, size.width);
      await expectDesignWidths(page, size.width);
    });
  }
}

// TC-064 asks for 0, 9, 10 and 100 in Vowels. CA-21 says "any group", so "100" is also
// checked in the other three (the right column holds "Consonantes").
const FILLS = [
  { text: "", counts: "0/0/0/0", what: '"0"' },
  { text: "a".repeat(9), counts: "9/0/0/0", what: '"9" en Vocales' },
  { text: "a".repeat(10), counts: "10/0/0/0", what: '"10" en Vocales' },
  { text: "a".repeat(100), counts: "100/0/0/0", what: '"100" en Vocales' },
  { text: "m".repeat(100), counts: "0/100/0/0", what: '"100" en Consonantes' },
  { text: "8".repeat(100), counts: "0/0/100/0", what: '"100" en Números' },
  { text: "!".repeat(100), counts: "0/0/0/100", what: '"100" en Otros' },
];

for (const size of SIZES) {
  for (const fill of FILLS) {
    test(`TC-064 — a ${size.width} px con ${fill.what}: la imagen entera y el número completo caben en su ficha (A-001, CA-21)`, async ({
      page,
    }) => {
      const app = await openAt(page, size);
      if (fill.text) await paste(app, fill.text);
      expect(await readCounts(page)).toBe(fill.counts);

      for (const key of KEYS) {
        await expectImageBesideNumber(page, key, size.image, size.gap);
      }
      await expectCardsFit(page, size.width);
      await expectNoHorizontalScroll(page);
      await expectDesignWidths(page, size.width);
    });
  }
}

// P-5: the spaces that get shorter so the 4 groups stay in sight with the keyboard open
// (plan VS-002 §5.1, "Medidas de la pantalla desde P-5"). No letter gets smaller: TC-059.

// Height of the field with 2 lines (2 × 31.2 + 2 × 8 + 2 × 2 = 82.4) and with its cap of
// 5 lines (82.4 + 3 × 31.2 = 176).
const FIELD_2_LINES = { min: 80, max: 85 };
const FIELD_CAP = 176;

for (const size of SIZES) {
  test(`TC-061 — a ${size.width} px, los espacios de arriba abajo: 8 sobre el título, 8 hasta la etiqueta, 8 hasta el campo, 12 hasta las fichas y 12 entre fichas (CA-20)`, async ({
    page,
  }) => {
    await openAt(page, size);

    const title = await box(page.getByTestId("app-title"));
    const label = await box(page.locator('label[for="text-field"]'));
    const field = await box(page.getByTestId("text-field"));
    const grid = await box(page.getByTestId("count-grid"));
    const vowel = await box(page.getByTestId("count-card-vowel"));
    const consonant = await box(page.getByTestId("count-card-consonant"));
    const digit = await box(page.getByTestId("count-card-digit"));
    expect(await page.evaluate(() => window.scrollY), "scroll").toBe(0);

    // Soft: one run shows every space that is wrong.
    for (const { what, got, expected } of [
      { what: "above the title", got: title.y, expected: 8 },
      { what: "title to label", got: label.y - (title.y + title.height), expected: 8 },
      { what: "label to field", got: field.y - (label.y + label.height), expected: 8 },
      { what: "field to cards", got: grid.y - (field.y + field.height), expected: 12 },
      { what: "between rows of cards", got: digit.y - (vowel.y + vowel.height), expected: 12 },
      { what: "between columns of cards", got: consonant.x - (vowel.x + vowel.width), expected: 12 },
    ]) {
      expect
        .soft(Math.abs(got - expected), `space ${what}: ${got}px, expected ${expected}px`)
        .toBeLessThanOrEqual(0.5);
    }
  });

  test(`TC-061 — a ${size.width} px, el campo deja 8 px arriba y abajo (12 a los lados) y vacío mide entre 80 y 85 px (CA-20)`, async ({
    page,
  }) => {
    await openAt(page, size);
    const field = page.getByTestId("text-field");

    await expect.soft(field).toHaveCSS("padding-top", "8px");
    await expect.soft(field).toHaveCSS("padding-bottom", "8px");
    await expect.soft(field).toHaveCSS("padding-left", "12px");
    await expect.soft(field).toHaveCSS("padding-right", "12px");
    const { height } = await box(field);
    expect(height, "height of the empty field").toBeGreaterThanOrEqual(FIELD_2_LINES.min);
    expect(height, "height of the empty field").toBeLessThanOrEqual(FIELD_2_LINES.max);
  });

  // L-020: measured at the cap and past it, with text hidden only past it.
  test(`TC-061 — a ${size.width} px, el tope del campo sigue en 5 líneas y mide ${FIELD_CAP} px; con 6 y con 8 no crece más`, async ({
    page,
  }) => {
    await openAt(page, size);
    const field = page.getByTestId("text-field");

    for (const lines of [5, 6, 8]) {
      await field.fill(Array.from({ length: lines }, () => "a").join("\n"));
      await expect
        .poll(async () => Math.abs((await box(field)).height - FIELD_CAP), {
          message: `distance to ${FIELD_CAP}px of height with ${lines} lines`,
        })
        .toBeLessThanOrEqual(1);
      const hidden = await field.evaluate((el) => el.scrollHeight - el.clientHeight);
      if (lines === 5) expect(hidden, "hidden pixels with 5 lines").toBeLessThanOrEqual(1);
      else expect(hidden, `hidden pixels with ${lines} lines`).toBeGreaterThan(0);
    }
  });
}

// At the 4 widths, because below 360 px another rule sets the sides of the card (L-041).
for (const size of [...SIZES, ...LIMIT]) {
  test(`TC-061 — a ${size.width} px, la ficha deja 8 px arriba y abajo, conserva ${size.side} px a los lados y mide 104 px de alto (CA-20)`, async ({
    page,
  }) => {
    await openAt(page, size);

    // Read all at once, so a failure shows the 4 cards without waiting for each value.
    const cards = [];
    for (const key of KEYS) {
      const card = page.getByTestId(`count-card-${key}`);
      cards.push({
        key,
        padding: await card.evaluate((el) => {
          const style = getComputedStyle(el);
          return [style.paddingTop, style.paddingRight, style.paddingBottom, style.paddingLeft].join(
            " ",
          );
        }),
        // Rounded: the height of the design is the minimum of the card.
        height: Math.round((await box(card)).height),
      });
    }

    expect(cards, "padding (top right bottom left) and height of the cards").toEqual(
      KEYS.map((key) => ({ key, padding: `8px ${size.side}px 8px ${size.side}px`, height: 104 })),
    );
  });
}

// What the keyboard leaves in sight on the iPhone of the photo is 427 px (F-003 §5.2); the
// test keeps 10 px for the SF Pro font. It is only an approximation: CA-20 is met by the
// photos of the iPhone (P-7, L-010, L-015). The phrase of 50 characters is not used here,
// because where it breaks into lines depends on the font.
const KEYBOARD_LIMIT = 417;

// 2 lines because the text wraps, with any font: words are added until a third line shows
// up, and the last one is taken out. One more word adds one line at most, so what is left
// fills exactly 2 lines.
async function fillSecondLine(field: Locator, emptyHeight: number) {
  const words: string[] = [];
  for (;;) {
    words.push("sol");
    const text = words.join(" ");
    expect(text.length, "no third line within the 100 characters").toBeLessThanOrEqual(100);
    await field.fill(text);
    if ((await box(field)).height > emptyHeight + 15) break;
  }
  words.pop();
  await field.fill(words.join(" "));
  await expect(field).toHaveValue(words.join(" "));
}

const KEYBOARD_CASES: { what: string; enter: (field: Locator, empty: number) => Promise<void> }[] =
  [
    { what: "campo vacío", enter: async () => {} },
    {
      what: '"pingüino" (1 línea)',
      enter: async (field) => {
        await field.pressSequentially("pingüino");
        await expect(field).toHaveValue("pingüino");
      },
    },
    {
      what: '"la casa", salto de línea y "el sol" (2 líneas)',
      enter: async (field) => {
        await field.pressSequentially("la casa");
        await field.press("Enter");
        await field.pressSequentially("el sol");
        await expect(field).toHaveValue("la casa\nel sol");
      },
    },
    { what: "el campo en 2 líneas porque el texto pasa de renglón", enter: fillSecondLine },
  ];

for (const { what, enter } of KEYBOARD_CASES) {
  test(`TC-061 (aproximación): con el campo activo, las 4 fichas terminan dentro de lo que deja el teclado — ${what}`, async ({
    page,
  }) => {
    await openApp(page);
    expect(page.viewportSize()?.width, "width of the iphone project").toBe(390);
    const field = page.getByTestId("text-field");
    const emptyHeight = (await box(field)).height;

    await enter(field, emptyHeight);

    await expect(field).toBeFocused();
    // Still the 2 lines of the empty field, with nothing hidden: the line being typed shows.
    await expect
      .poll(async () => Math.abs((await box(field)).height - emptyHeight), {
        message: "the field keeps the height of 2 lines",
      })
      .toBeLessThanOrEqual(1);
    expect(
      await field.evaluate((el) => el.scrollHeight - el.clientHeight),
      "hidden pixels of the field",
    ).toBeLessThanOrEqual(1);
    // The screen was not moved, so these positions count from the start of the page.
    expect(await page.evaluate(() => window.scrollY), "scroll").toBe(0);

    for (const id of ["text-field", ...KEYS.map((key) => `count-card-${key}`)]) {
      const part = await box(page.getByTestId(id));
      expect(part.y, `top of ${id}`).toBeGreaterThanOrEqual(0);
      expect
        .soft(part.y + part.height, `bottom of ${id}, from the start of the page`)
        .toBeLessThanOrEqual(KEYBOARD_LIMIT);
    }
  });
}
