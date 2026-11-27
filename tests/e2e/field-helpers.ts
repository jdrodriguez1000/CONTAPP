import { expect, type BrowserContext, type Locator, type Page } from "@playwright/test";

// Shared by the E2E specs (plan VS-001 §5.1, plan VS-002 §5.3).
// Counts are written as "vowel/consonant/digit/other".

const GROUP_KEYS = ["vowel", "consonant", "digit", "other"];
const NOTICES =
  '[role="alert"], [role="status"], [role="dialog"], [role="alertdialog"], [aria-live], dialog';

export type App = { page: Page; field: Locator; dialogs: string[] };

// One single read, with no retries: §5.1 says the counts are already up to date.
export async function readCounts(page: Page) {
  const values: string[] = [];
  for (const key of GROUP_KEYS) {
    values.push((await page.getByTestId(`count-${key}`).textContent()) ?? "");
  }
  return values.join("/");
}

export async function openApp(page: Page): Promise<App> {
  const dialogs: string[] = [];
  page.on("dialog", (dialog) => {
    dialogs.push(dialog.message());
    void dialog.dismiss();
  });
  await page.goto("/");
  const field = page.getByTestId("text-field");
  await expect(field).toBeVisible();
  await expect.poll(() => readCounts(page)).toBe("0/0/0/0");
  await field.focus();
  return { page, field, dialogs };
}

// Nothing typed is kept in the browser (C-010).
export async function expectNothingStored(page: Page, context: BrowserContext): Promise<void> {
  const stored = await page.evaluate(async () => ({
    local: JSON.stringify({ ...localStorage }),
    session: JSON.stringify({ ...sessionStorage }),
    cookies: document.cookie,
    databases: (await indexedDB.databases()).length,
    caches: "caches" in window ? (await caches.keys()).length : 0,
  }));
  expect(stored, "stored in the page").toEqual({
    local: "{}",
    session: "{}",
    cookies: "",
    databases: 0,
    caches: 0,
  });
  expect(await context.cookies(), "cookies of the browser").toEqual([]);
}

// Where the number really sits inside its <dd>. The image is a ::before, with no box of
// its own, so what it takes on screen is read from where the number starts (plan VS-002
// §5.1: the image is on the left of the number, in the same row). A squeezed image would
// keep its computed width, but the number would start earlier.
export async function numberRow(page: Page, key: string) {
  return page.getByTestId(`count-${key}`).evaluate((el) => {
    const text = [...el.childNodes].find((node) => node.nodeType === Node.TEXT_NODE);
    if (!text) throw new Error("the number has no text");
    const range = document.createRange();
    range.selectNodeContents(text);
    const number = range.getBoundingClientRect();
    const box = el.getBoundingClientRect();
    const style = getComputedStyle(el);
    return {
      display: style.display,
      // From the left edge of the content of the <dd> to the number: image + gap.
      beforeNumber: number.left - box.left - parseFloat(style.paddingLeft),
      rowHeight: box.height,
      offCenter: Math.abs(number.top + number.height / 2 - (box.top + box.height / 2)),
      pastRightEdge: number.right - box.right,
      lineHeight: parseFloat(style.lineHeight),
    };
  });
}

// Image of `size` px, then `gap` px, then the number: one single row, nothing cut.
export async function expectImageBesideNumber(page: Page, key: string, size: number, gap: number) {
  const row = await numberRow(page, key);
  expect(row.display, `display of the <dd> of ${key}`).toBe("flex");
  expect(
    Math.abs(row.beforeNumber - (size + gap)),
    `image + gap before the number of ${key}: ${row.beforeNumber}px, expected ${size + gap}px`,
  ).toBeLessThanOrEqual(1);
  // Same row: the <dd> is no taller than the taller of the two.
  expect(row.rowHeight, `height of the row of ${key}`).toBeLessThanOrEqual(
    Math.max(size, row.lineHeight) + 1,
  );
  expect(row.offCenter, `number of ${key} off the middle of the row`).toBeLessThanOrEqual(2);
  expect(row.pastRightEdge, `number of ${key} past the row`).toBeLessThanOrEqual(0.5);
}

// "Paste": the text enters all at once at the cursor (plan VS-001 §3).
export async function paste(app: App, text: string) {
  await app.page.keyboard.insertText(text);
}

// "Type": one key at a time.
export async function type(app: App, text: string) {
  await app.field.pressSequentially(text);
}

export async function select(app: App, start: number, end = start) {
  await app.field.evaluate(
    (el, range) => (el as HTMLTextAreaElement).setSelectionRange(range[0], range[1]),
    [start, end],
  );
}

export async function selectionOf(field: Locator) {
  return field.evaluate((el) => {
    const area = el as HTMLTextAreaElement;
    return [area.selectionStart, area.selectionEnd];
  });
}

// The only visible text is title, label, names and numbers: no notice of any kind.
export async function expectNoNotice({ page, dialogs }: App) {
  const visibleText = (await page.locator("body").innerText()).replace(/\s+/g, " ").trim();
  expect(visibleText.replace(/\d+/g, "#"), "visible text (no notice)").toBe(
    "Contapp Escribe una palabra o frase Vocales # Consonantes # Números # Otros #",
  );
  await expect(page.locator(NOTICES)).toHaveCount(0);
  await expect(page.locator("input, textarea, select, button")).toHaveCount(1);
  expect(dialogs, "browser dialogs").toEqual([]);
}

// Value, counts and no notice after something entered (fully or in part).
export async function expectState(app: App, value: string, counts: string, cursor?: number) {
  expect(await app.field.inputValue(), "field text").toBe(value);
  expect(await readCounts(app.page), "counts").toBe(counts);
  if (cursor !== undefined) {
    expect(await selectionOf(app.field), "cursor").toEqual([cursor, cursor]);
  }
  await expectNoNotice(app);
}

// How the field and the cards look, to catch a color or a mark (D-007).
async function looks(page: Page) {
  return page
    .locator('[data-testid="text-field"], [data-testid^="count-"]')
    .evaluateAll((elements) =>
      elements.map((el) => {
        const style = getComputedStyle(el);
        return [
          style.color,
          style.backgroundColor,
          style.borderColor,
          style.borderStyle,
          style.borderWidth,
          style.outlineColor,
          style.outlineStyle,
          style.boxShadow,
          style.opacity,
          style.animationName,
          style.transform,
        ].join("|");
      }),
    );
}

// Silent rejection (§5.1): text, cursor, counts and looks stay as before; no notice.
export async function expectRejected(app: App, attempt: () => Promise<void>, what: string) {
  const value = await app.field.inputValue();
  const cursor = await selectionOf(app.field);
  const counts = await readCounts(app.page);
  const looksBefore = await looks(app.page);

  await attempt();

  expect(await app.field.inputValue(), `field text after ${what}`).toBe(value);
  expect(await selectionOf(app.field), `cursor after ${what}`).toEqual(cursor);
  expect(await readCounts(app.page), `counts after ${what}`).toBe(counts);
  expect(await looks(app.page), `looks after ${what}`).toEqual(looksBefore);
  await expectNoNotice(app);
}
