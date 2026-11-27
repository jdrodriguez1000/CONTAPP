import { test, expect, type Page, type TestInfo } from "@playwright/test";
import {
  expectImageBesideNumber,
  expectNoNotice,
  expectNothingStored,
  expectState,
  paste,
  readCounts,
  type App,
} from "./field-helpers";
import {
  card,
  cardLooks,
  COLORS,
  expectGroupImages,
  IMAGE_GAP,
  IMAGE_SIZE,
  KEYS,
  number,
  type Colors,
} from "./group-helpers";

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

// P-10 (plan VS-001 §3 and §5.1): the whole journey on the published version.
// Counts are written as "vowel/consonant/digit/other".

const ZERO = "0/0/0/0";
const EVIDENCE = "_project/slices/VS-002/evidence/published";
const CARDS = [
  { key: "vowel", name: "Vocales" },
  { key: "consonant", name: "Consonantes" },
  { key: "digit", name: "Números" },
  { key: "other", name: "Otros" },
];

async function openPublished(page: Page): Promise<App> {
  const publishedUrl = process.env.E2E_BASE_URL;
  expect(publishedUrl, "E2E_BASE_URL must hold the published address").toBeTruthy();

  const dialogs: string[] = [];
  page.on("dialog", (dialog) => {
    dialogs.push(dialog.message());
    void dialog.dismiss();
  });

  const response = await page.goto("/");

  // The address itself serves the app: no error page and no platform login.
  expect(response?.status(), "HTTP status of the published address").toBe(200);
  expect(new URL(page.url()).origin, "no redirect to another site").toBe(
    new URL(publishedUrl ?? "").origin,
  );
  await expect(page).toHaveTitle("Contapp");
  return { page, field: page.getByTestId("text-field"), dialogs };
}

// Empty field, the four names in order, each one with its "0".
async function expectEmptyScreen({ page, field }: App) {
  await expect(field).toBeVisible();
  await expect(field).toHaveValue("");
  await expect(page.getByTestId("count-grid").locator("dt")).toHaveText(
    CARDS.map((card) => card.name),
  );
  for (const card of CARDS) {
    const locator = page.getByTestId(`count-card-${card.key}`);
    await expect(locator).toBeVisible();
    await expect(locator.locator("dt")).toHaveText(card.name);
    await expect(page.getByTestId(`count-${card.key}`)).toHaveText(/^0$/);
  }
}

// A fixed folder: `npm run test:published` runs without --output.
async function saveEvidence(page: Page, testInfo: TestInfo, fileName: string) {
  const path = `${EVIDENCE}/${fileName}`;
  await page.screenshot({ path, scale: "css" });
  await testInfo.attach(fileName, { path, contentType: "image/png" });
}

test("TC-001 — publicada: campo vacío, los 4 grupos en 0 y sin pantalla de cuenta (C-010, C-012)", async ({
  page,
}, testInfo) => {
  const app = await openPublished(page);

  await expectEmptyScreen(app);
  await expect(app.field).not.toBeFocused();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Contapp");
  await expect(page.getByLabel("Escribe una palabra o frase")).toHaveAttribute(
    "data-testid",
    "text-field",
  );
  await expect(page.locator("html")).toHaveAttribute("lang", "es-CO");

  // No account screen: same path, no password, and the text field is the only control.
  expect(new URL(page.url()).pathname).toBe("/");
  await expect(page.locator('input[type="password"]')).toHaveCount(0);
  expect((await page.locator("body").innerText()).replace(/\s+/g, " ").trim()).toBe(
    "Contapp Escribe una palabra o frase Vocales 0 Consonantes 0 Números 0 Otros 0",
  );
  await expectNoNotice(app);

  await saveEvidence(page, testInfo, "tc-001-al-abrir.png");
});

test('TC-002 — publicada: escribir "casa" letra por letra cambia los conteos con cada letra (C-001)', async ({
  page,
}, testInfo) => {
  const app = await openPublished(page);
  await expectEmptyScreen(app);

  // readCounts reads once, with no retries: §5.1 says the counts are already up to date.
  await app.field.pressSequentially("c");
  await expect(app.field).toHaveValue("c");
  expect(await readCounts(page), 'counts after "c"').toBe("0/1/0/0");

  await app.field.pressSequentially("a");
  await expect(app.field).toHaveValue("ca");
  expect(await readCounts(page), 'counts after "ca"').toBe("1/1/0/0");

  await app.field.pressSequentially("s");
  await expect(app.field).toHaveValue("cas");
  expect(await readCounts(page), 'counts after "cas"').toBe("1/2/0/0");

  await app.field.pressSequentially("a");
  await expect(app.field).toHaveValue("casa");
  expect(await readCounts(page), 'counts after "casa"').toBe("2/2/0/0");
  await expectNoNotice(app);

  await saveEvidence(page, testInfo, "tc-002-casa.png");
});

// CA-7 only. That the counts change while typing is proved by TC-002.
test('TC-024 — publicada: escribir "casa" y recargar deja el campo vacío y los 4 en 0, sin guardar nada (C-010)', async ({
  page,
  context,
}, testInfo) => {
  const app = await openPublished(page);
  await expectEmptyScreen(app);
  await app.field.pressSequentially("casa");
  await expect(app.field).toHaveValue("casa");

  await expectNothingStored(page, context);

  await page.reload();
  await expectEmptyScreen(app);
  expect(await readCounts(page), "counts after reload").toBe(ZERO);
  await expectNoNotice(app);

  await saveEvidence(page, testInfo, "tc-024-despues-de-recargar.png");

  // Opening the address again, in a new tab of the same browser.
  await expectEmptyScreen(await openPublished(await context.newPage()));
});

// ---------------------------------------------------------------------------
// P-6 (plan VS-002 §3 and §5.1): the images and colors on the published version.
// In every test the colors are checked before the images, so that against a version
// with colors and no images the failure is the missing image (L-021).

const MIXED_PHRASE = "¡Hola, 2026! \u{1F600}";

// Number and the 4 sides of the border of each card, in the color of its group.
async function expectGroupColors(page: Page, colors: Colors) {
  for (const key of KEYS) {
    await expect(number(page, key), `number of ${key}`).toHaveCSS("color", colors[key]);
    for (const side of ["top", "right", "bottom", "left"]) {
      await expect(card(page, key), `${side} border of ${key}`).toHaveCSS(
        `border-${side}-color`,
        colors[key],
      );
    }
  }
}

// The computed style says which mask was asked for, not that it was painted: only the
// published address sends the headers of the platform, which could block the drawing.
// So the pixels of each image on screen are read: part of the 44 x 44 square is drawn
// and part is not. Returns one 0/1 per pixel (is it different from the card?).
async function paintedImage(page: Page, key: string) {
  const clip = await number(page, key).evaluate((el, size) => {
    const box = el.getBoundingClientRect();
    return {
      x: box.left + parseFloat(getComputedStyle(el).paddingLeft),
      y: box.top + (box.height - size) / 2,
      width: size,
      height: size,
    };
  }, IMAGE_SIZE);
  const shot = await page.screenshot({ clip, scale: "css" });
  const background = await card(page, key).evaluate((el) => getComputedStyle(el).backgroundColor);

  // Decoded in an empty page, which has no restrictions of the app address.
  const decoder = await page.context().newPage();
  const pixels = await decoder.evaluate(
    async ([source, color]) => {
      const image = new Image();
      image.src = source;
      await image.decode();
      const canvas = document.createElement("canvas");
      canvas.width = image.width;
      canvas.height = image.height;
      const context = canvas.getContext("2d") as CanvasRenderingContext2D;
      context.drawImage(image, 0, 0);
      const { data } = context.getImageData(0, 0, canvas.width, canvas.height);
      const card = (color.match(/\d+/g) ?? []).map(Number);
      return Array.from({ length: data.length / 4 }, (_, i) =>
        card.some((channel, c) => Math.abs(data[i * 4 + c] - channel) > 40) ? 1 : 0,
      );
    },
    [`data:image/png;base64,${shot.toString("base64")}`, background] as const,
  );
  await decoder.close();
  return pixels;
}

async function expectImagesPainted(page: Page) {
  const shapes: number[][] = [];
  for (const key of KEYS) {
    const shape = await paintedImage(page, key);
    const painted = shape.filter(Boolean).length;
    expect(painted, `painted pixels of the image of ${key}`).toBeGreaterThan(100);
    expect(painted, `empty pixels left in the image of ${key}`).toBeLessThan(shape.length - 100);
    for (const [index, other] of shapes.entries()) {
      expect(
        shape.filter((pixel, i) => pixel !== other[i]).length,
        `pixels that differ between the images of ${KEYS[index]} and ${key}`,
      ).toBeGreaterThan(100);
    }
    shapes.push(shape);
  }
}

const IMAGE_MODES = [
  { id: "TC-050", scheme: "light", mode: "modo claro", file: "tc-050-imagenes-claro.png" },
  { id: "TC-051", scheme: "dark", mode: "modo oscuro", file: "tc-051-imagenes-oscuro.png" },
] as const;

for (const { id, scheme, mode, file } of IMAGE_MODES) {
  test(`${id} — publicada, ${mode}: las 4 fichas en 0 con su color y su imagen de 44 px pintada junto al número; las 4 imágenes son distintas`, async ({
    page,
  }, testInfo) => {
    await page.emulateMedia({ colorScheme: scheme });
    const app = await openPublished(page);
    await expectEmptyScreen(app);
    await expectGroupColors(page, COLORS[scheme]);

    await expectGroupImages(page, COLORS[scheme]);
    for (const key of KEYS) {
      await expectImageBesideNumber(page, key, IMAGE_SIZE, IMAGE_GAP);
    }
    await expectImagesPainted(page);
    await expectNoNotice(app);

    await saveEvidence(page, testInfo, file);
  });
}

test('TC-053 — publicada: pegar "¡Hola, 2026! 😀" da 2/2/4/4 con la imagen y el color iguales que vacía, y al borrar todo siguen iguales con los 4 en 0 (C-001, C-006, C-007, C-008, C-012)', async ({
  page,
}, testInfo) => {
  await page.emulateMedia({ colorScheme: "light" });
  const app = await openPublished(page);
  await expectEmptyScreen(app);
  await expectGroupColors(page, COLORS.light);
  // First the image must be there: "the same as before" proves nothing without it.
  await expectGroupImages(page, COLORS.light);
  const empty = await cardLooks(page);

  await app.field.focus();
  await paste(app, MIXED_PHRASE);
  await expectState(app, MIXED_PHRASE, "2/2/4/4");
  expect(await cardLooks(page), "looks with text").toEqual(empty);
  await expectImagesPainted(page);

  // The picture shows the text with the keyboard closed.
  await app.field.blur();
  await saveEvidence(page, testInfo, "tc-053-con-texto.png");

  await app.field.selectText();
  await app.field.press("Backspace");
  await expectState(app, "", "0/0/0/0");
  expect(await cardLooks(page), "looks after deleting everything").toEqual(empty);
});

// Control: it also passes on a version without images. It watches what the platform
// may add to a published page (plan §7 R-4): it is not weakened if it shows up.
test('TC-055 — publicada: al abrir, escribir "casa" y recargar, todo se pide a la dirección publicada, nada lleva el texto y nada queda guardado (C-010)', async ({
  page,
  context,
}) => {
  const requests: Array<{ url: string; sent: string }> = [];
  context.on("request", (request) => {
    requests.push({
      url: request.url(),
      sent: `${request.url()} ${request.postData() ?? ""} ${JSON.stringify(request.headers())}`,
    });
  });
  page.on("websocket", (socket) => {
    // A secure socket to the same address has the same origin as the page.
    const url = socket.url().replace(/^wss:/, "https:");
    requests.push({ url, sent: url });
    socket.on("framesent", (frame) => requests.push({ url, sent: String(frame.payload) }));
  });

  const app = await openPublished(page);
  await page.waitForLoadState("networkidle");
  await expectEmptyScreen(app);
  await app.field.pressSequentially("casa");
  await expectState(app, "casa", "2/2/0/0");
  await app.field.blur();
  await page.waitForLoadState("networkidle");
  await expectNothingStored(page, context);

  // Leaving and loading again must not send the text or ask another site either.
  await page.reload();
  await page.waitForLoadState("networkidle");
  await expectEmptyScreen(app);
  await expectNothingStored(page, context);

  const origin = new URL(process.env.E2E_BASE_URL ?? "").origin;
  // Proves the listener works: loading the page itself was seen.
  expect(requests.map((request) => request.url)).toContain(`${origin}/`);
  // A data: address carries its own content, so it counts as part of the app.
  expect(
    requests
      .map((request) => request.url)
      .filter((url) => !url.startsWith("data:") && new URL(url).origin !== origin),
    "requests to another site",
  ).toEqual([]);
  expect(
    requests.filter((request) => request.sent.toLowerCase().includes("casa")),
    "requests that carry the typed text",
  ).toEqual([]);
});
