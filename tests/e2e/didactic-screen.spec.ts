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

// F-003: the screen for children (plan VS-002 P-4 and §5.1; F-003 CA-18, CA-19, CA-21).
// Widths and sizes are the ones of F-003 §5.4 and F-002 §5.2. How wide "100" or
// "Consonantes" come out depends on the font (L-010): the iPhone has the last word.

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

// The 4 cards fit across (CA-21): inside the margins of the screen (16 px), in two
// columns of the same width (design: about 173 px at 390 and 138 px at 320; a column
// grows when its content does not fit), with the whole name and number inside.
async function expectCardsFit(page: Page, width: number) {
  // The column of the app is 480 px at most; every width here is below that.
  const column = (width - 2 * 16 - 12) / 2;
  for (const [index, key] of KEYS.entries()) {
    const card = page.getByTestId(`count-card-${key}`);
    const cardBox = await box(card);
    expect(cardBox.x, `left side of ${key}`).toBeGreaterThanOrEqual(15.5);
    expect(cardBox.x + cardBox.width, `right side of ${key}`).toBeLessThanOrEqual(width - 15.5);
    expect(
      Math.abs(cardBox.width - column),
      `width of the card of ${key}: ${cardBox.width}px, expected ${column}px`,
    ).toBeLessThanOrEqual(1);

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

      await paste(app, "m".repeat(100));

      expect(await readCounts(page)).toBe("0/100/0/0");
      await expectNoHorizontalScroll(page);
      await expectCardsFit(page, size.width);
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
    });
  }
}
