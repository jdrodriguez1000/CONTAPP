import { readFileSync } from "node:fs";
import { test, expect, type Page } from "@playwright/test";
import {
  expectImageBesideNumber,
  expectNothingStored,
  expectRejected,
  expectState,
  openApp,
  paste,
  type,
} from "./field-helpers";
import {
  card,
  cardLooks,
  COLORS,
  computed,
  expectGroupImages,
  IMAGE_GAP,
  IMAGE_SIZE,
  imageStyle,
  KEYS,
  number,
  type Colors,
} from "./group-helpers";

// F-002: one color and one image per group (plan VS-002 P-2, P-3 and §5.1; F-002
// CA-12 to CA-16, §5.1 to §5.4). Every expected value is the one of the plan §5.1,
// as the browser returns it.

type Scheme = "light" | "dark";

const SIDES = ["top", "right", "bottom", "left"];

const MODES: Array<{
  scheme: Scheme;
  mode: string;
  colors: Colors;
  cardBackground: string;
  nameColor: string;
  fieldBackground: string;
}> = [
  {
    scheme: "light",
    mode: "modo claro",
    colors: COLORS.light,
    cardBackground: "rgb(238, 245, 238)",
    nameColor: "rgb(17, 34, 17)",
    fieldBackground: "rgb(255, 255, 255)",
  },
  {
    scheme: "dark",
    mode: "modo oscuro",
    colors: COLORS.dark,
    cardBackground: "rgb(28, 46, 32)",
    nameColor: "rgb(245, 245, 238)",
    fieldBackground: "rgb(28, 46, 32)",
  },
];

async function open(page: Page, scheme: Scheme) {
  await page.emulateMedia({ colorScheme: scheme });
  await page.goto("/");
  await expect(page.getByTestId("count-grid")).toBeVisible();
}

// WCAG 2.x contrast of two opaque "rgb(r, g, b)" colors.
function luminance(color: string) {
  const match = /^rgb\((\d+), (\d+), (\d+)\)$/.exec(color);
  if (!match) throw new Error(`not an opaque rgb color: ${color}`);
  const [r, g, b] = match.slice(1).map((channel) => {
    const value = Number(channel) / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(first: string, second: string) {
  const [light, dark] = [luminance(first), luminance(second)].sort((a, b) => b - a);
  return (light + 0.05) / (dark + 0.05);
}

for (const { scheme, mode, colors, cardBackground, nameColor, fieldBackground } of MODES) {
  test(`TC-052 — ${mode}: el número de cada ficha lleva el color de su grupo`, async ({ page }) => {
    await open(page, scheme);

    for (const key of KEYS) {
      await expect(number(page, key), `number of ${key}`).toHaveCSS("color", colors[key]);
    }
  });

  test(`TC-052 — ${mode}: los 4 lados del borde de cada ficha llevan el color de su grupo`, async ({
    page,
  }) => {
    await open(page, scheme);

    for (const key of KEYS) {
      for (const side of SIDES) {
        await expect(card(page, key), `${side} border of ${key}`).toHaveCSS(
          `border-${side}-color`,
          colors[key],
        );
      }
    }
  });

  test(`TC-052 — ${mode}: los 4 colores de los números son distintos entre sí`, async ({ page }) => {
    await open(page, scheme);

    const used: string[] = [];
    for (const key of KEYS) {
      used.push(await computed(page, `count-${key}`, "color"));
    }
    expect(new Set(used).size, `different colors in ${used.join(" · ")}`).toBe(4);
  });

  test(`TC-052 — ${mode}: cada ficha toma el color de su token y no de un color suelto`, async ({
    page,
  }) => {
    await open(page, scheme);

    for (const key of KEYS) {
      // The token holds the approved color. A probe lets the browser resolve it.
      const tokenColor = await page.evaluate((token) => {
        const probe = document.createElement("span");
        probe.style.color = `var(${token}, rgb(0, 0, 1))`;
        document.body.append(probe);
        const color = getComputedStyle(probe).color;
        probe.remove();
        return color;
      }, `--color-${key}`);
      expect(tokenColor, `value of --color-${key}`).toBe(colors[key]);

      // Changing only that token changes only its card: number and border.
      const marker = "rgb(1, 2, 3)";
      await page.evaluate(
        ([token, value]) => document.documentElement.style.setProperty(token, value),
        [`--color-${key}`, marker],
      );
      for (const other of KEYS) {
        const expected = other === key ? marker : colors[other];
        await expect(number(page, other), `number of ${other}, ${key} token changed`).toHaveCSS(
          "color",
          expected,
        );
        await expect(card(page, other), `border of ${other}, ${key} token changed`).toHaveCSS(
          "border-top-color",
          expected,
        );
      }
      await page.evaluate(
        (token) => document.documentElement.style.removeProperty(token),
        `--color-${key}`,
      );
    }
  });

  test(`TC-052 — ${mode}: cada ficha tiene la clase de su grupo y no la de otro`, async ({
    page,
  }) => {
    await open(page, scheme);

    for (const key of KEYS) {
      const classes = ((await card(page, key).getAttribute("class")) ?? "").split(/\s+/);
      expect(classes, `classes of ${key}`).toContain("count");
      expect(
        classes.filter((name) => name.startsWith("count--")),
        `group classes of ${key}`,
      ).toEqual([`count--${key}`]);
    }
  });

  test(`TC-052 — control, ${mode}: borde punteado de 2 px, fondo de la ficha, nombre y fondo del campo sin cambio`, async ({
    page,
  }) => {
    await open(page, scheme);

    for (const key of KEYS) {
      for (const side of SIDES) {
        await expect(card(page, key), `${side} border of ${key}`).toHaveCSS(
          `border-${side}-style`,
          "dashed",
        );
        await expect(card(page, key), `${side} border of ${key}`).toHaveCSS(
          `border-${side}-width`,
          "2px",
        );
      }
      await expect(card(page, key), `background of ${key}`).toHaveCSS(
        "background-color",
        cardBackground,
      );
      await expect(card(page, key).locator("dt"), `name of ${key}`).toHaveCSS("color", nameColor);
    }
    await expect(page.getByTestId("text-field")).toHaveCSS("background-color", fieldBackground);
  });

  // Control: it also holds for the single color of VS-001. It measures the colors
  // really on screen, so a new color without enough contrast turns it red.
  test(`TC-052 — control, ${mode}: contraste de 4,5:1 o más sobre la ficha y como letra sobre el campo`, async ({
    page,
  }) => {
    // The formula itself, with its two known limits.
    expect(contrast("rgb(0, 0, 0)", "rgb(255, 255, 255)")).toBeCloseTo(21, 5);
    expect(contrast("rgb(28, 46, 32)", "rgb(28, 46, 32)")).toBeCloseTo(1, 5);

    await open(page, scheme);
    const fieldColor = await computed(page, "text-field", "background-color");

    for (const key of KEYS) {
      const color = await computed(page, `count-${key}`, "color");
      const background = await computed(page, `count-card-${key}`, "background-color");
      expect(contrast(color, background), `${key} on its card`).toBeGreaterThanOrEqual(4.5);
      expect(contrast(color, fieldColor), `${key} on the field`).toBeGreaterThanOrEqual(4.5);
    }
  });
}

// ---------------------------------------------------------------------------
// P-3: one image per group (plan §3 P-3 and §5.1; F-002 CA-12, CA-14 to CA-16).
// The image is the ::before of the number.

const NAMES = ["Vocales", "Consonantes", "Números", "Otros"];

// The approved drawings, read from the design mockup (F-002 §5.3: copied as they are).
function approvedImages() {
  const mockup = readFileSync("_project/design/F-002/mockup-b.html", "utf8");
  return KEYS.map((key) => {
    const match = new RegExp(`--img-${key}:url\\("(data:image/svg\\+xml,[^"]+)"\\)`).exec(mockup);
    if (!match) throw new Error(`the mockup has no --img-${key}`);
    return match[1];
  });
}

// The mask really painted at 44 x 44: one 0/1 per pixel (is it part of the drawing?).
// A drawing that the browser cannot decode fails here (plan §7 R-2).
async function shapeOf(page: Page, url: string) {
  return page.evaluate(
    async ([source, size]) => {
      const image = new Image();
      image.src = source as string;
      await image.decode();
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = size as number;
      const context = canvas.getContext("2d") as CanvasRenderingContext2D;
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      const { data } = context.getImageData(0, 0, canvas.width, canvas.height);
      return Array.from({ length: data.length / 4 }, (_, i) => (data[i * 4 + 3] > 127 ? 1 : 0));
    },
    [url, IMAGE_SIZE] as const,
  );
}

function differentPixels(first: number[], second: number[]) {
  return first.filter((pixel, index) => pixel !== second[index]).length;
}

const MIXED_PHRASE = "¡Hola, 2026! \u{1F600}";

for (const { scheme, mode, colors } of MODES) {
  const testCase = scheme === "light" ? "TC-050" : "TC-051";

  test(`${testCase} — ${mode}: al abrir, las 4 fichas en orden, cada una con su imagen, "0" y su nombre; las 4 imágenes son distintas`, async ({
    page,
  }) => {
    await open(page, scheme);

    const order = await page
      .getByTestId("count-grid")
      .locator('[data-testid^="count-card-"]')
      .evaluateAll((elements) => elements.map((el) => el.getAttribute("data-testid")));
    expect(order).toEqual(KEYS.map((key) => `count-card-${key}`));

    for (const [index, key] of KEYS.entries()) {
      await expect(card(page, key)).toBeVisible();
      await expect(card(page, key).locator("dt")).toHaveText(NAMES[index]);
      await expect(number(page, key)).toHaveText(/^0$/);
    }
    await expectGroupImages(page, colors);
  });

  test(`${testCase} — ${mode}: cada imagen va a la izquierda de su número, en la misma fila (44 px y 8 px de separación)`, async ({
    page,
  }) => {
    await open(page, scheme);

    for (const key of KEYS) {
      await expect(number(page, key), `gap of ${key}`).toHaveCSS("column-gap", `${IMAGE_GAP}px`);
      await expectImageBesideNumber(page, key, IMAGE_SIZE, IMAGE_GAP);
    }
  });
}

test("TC-050 — cada ficha pinta el dibujo aprobado de su grupo (boca, rompecabezas, mano y carita) y no el de otro", async ({
  page,
}) => {
  await open(page, "light");

  const approved: number[][] = [];
  for (const url of approvedImages()) {
    approved.push(await shapeOf(page, url));
  }
  // The comparison itself: the 4 approved drawings are painted and are far apart.
  for (const [index, shape] of approved.entries()) {
    const painted = shape.filter(Boolean).length;
    expect(painted, `painted pixels of ${KEYS[index]}`).toBeGreaterThan(100);
    expect(painted, `painted pixels of ${KEYS[index]}`).toBeLessThan(shape.length - 100);
    for (const other of approved.slice(index + 1)) {
      expect(differentPixels(shape, other)).toBeGreaterThan(100);
    }
  }

  for (const [index, key] of KEYS.entries()) {
    const { mask } = await imageStyle(page, key);
    expect(mask, `image of ${key}: mask`).toContain("data:image/svg+xml");
    // The computed value is url("..."), with the inner quotes and backslashes escaped.
    const url = mask.replace(/^url\("/, "").replace(/"\)$/, "").replace(/\\(.)/g, "$1");
    // At most 1 % of the pixels apart: room for another way of writing the same SVG.
    expect(
      differentPixels(await shapeOf(page, url), approved[index]),
      `pixels of ${key} that differ from the approved drawing`,
    ).toBeLessThanOrEqual(19);
  }
});

test('TC-053 — escribir "¡Hola, 2026! 😀" da 2/2/4/4 con la imagen y el color iguales que vacía, y al borrar todo siguen iguales con los 4 en 0', async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "light" });
  const app = await openApp(page);
  // First the image must be there: "the same as before" proves nothing without it.
  await expectGroupImages(page, MODES[0].colors);
  const empty = await cardLooks(page);

  await paste(app, MIXED_PHRASE);
  await expectState(app, MIXED_PHRASE, "2/2/4/4");
  expect(await cardLooks(page), "looks with text").toEqual(empty);

  await app.field.selectText();
  await app.field.press("Backspace");
  await expectState(app, "", "0/0/0/0");
  expect(await cardLooks(page), "looks after deleting everything").toEqual(empty);
});

test('TC-054 — con "casa", escribir "ç" no entra y la imagen y el color de las fichas no cambian, sin aviso (C-011, D-005)', async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "light" });
  const app = await openApp(page);
  await type(app, "casa");
  await expectState(app, "casa", "2/2/0/0");
  await expectGroupImages(page, MODES[0].colors);
  const before = await cardLooks(page);

  await expectRejected(app, () => type(app, "ç"), "typing a foreign letter");

  expect(await cardLooks(page), "looks after the rejection").toEqual(before);
});

test('TC-054 — borde: con 100 caracteres, escribir "b" no entra y la imagen y el color de las fichas no cambian, sin aviso (A-001, D-007)', async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "light" });
  const app = await openApp(page);
  await paste(app, "a".repeat(100));
  await expectState(app, "a".repeat(100), "100/0/0/0");
  await expectGroupImages(page, MODES[0].colors);
  const before = await cardLooks(page);

  await expectRejected(app, () => type(app, "b"), "typing character 101");

  expect(await cardLooks(page), "looks after the rejection").toEqual(before);
});

test('TC-055 — control: al abrir y escribir "casa", todo se pide a la misma dirección de la app, nada lleva el texto y nada queda guardado (C-010)', async ({
  page,
  context,
  baseURL,
}) => {
  const requests: Array<{ url: string; sent: string }> = [];
  const note = (url: string, sent: string) => requests.push({ url, sent });
  context.on("request", (request) => {
    note(
      request.url(),
      `${request.url()} ${request.postData() ?? ""} ${JSON.stringify(request.headers())}`,
    );
  });
  page.on("websocket", (socket) => {
    note(socket.url(), socket.url());
    socket.on("framesent", (frame) => note(socket.url(), String(frame.payload)));
  });

  const app = await openApp(page);
  await page.waitForLoadState("networkidle");
  await type(app, "casa");
  await expectState(app, "casa", "2/2/0/0");
  await app.field.blur();
  await page.waitForLoadState("networkidle");
  await expectNothingStored(page, context);

  // Leaving and loading again must not send the text or ask another site either.
  await page.reload();
  await page.waitForLoadState("networkidle");

  const appHost = new URL(baseURL ?? "").host;
  // Proves the listener works: loading the page itself was seen.
  expect(requests.length).toBeGreaterThan(0);
  // A data: address carries its own content, so it counts as part of the app.
  expect(
    requests
      .map((request) => request.url)
      .filter((url) => !url.startsWith("data:") && new URL(url).host !== appHost),
    "requests to another site",
  ).toEqual([]);
  expect(
    requests.filter((request) => request.sent.toLowerCase().includes("casa")),
    "requests that carry the typed text",
  ).toEqual([]);
  await expectNothingStored(page, context);
});

test("TC-056 — control: cada ficha se lee como su nombre y su número, sin nada más por la imagen, y el nombre se ve escrito (C-013)", async ({
  page,
}) => {
  await open(page, "light");

  await expect(page.getByTestId("count-grid")).toMatchAriaSnapshot(`
    - /children: equal
    - term: Vocales
    - definition: "0"
    - term: Consonantes
    - definition: "0"
    - term: Números
    - definition: "0"
    - term: Otros
    - definition: "0"
  `);
  for (const [index, key] of KEYS.entries()) {
    await expect(card(page, key).locator("dt")).toBeVisible();
    await expect(card(page, key).locator("dt")).toHaveText(NAMES[index]);
  }
});
