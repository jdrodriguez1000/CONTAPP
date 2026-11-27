import { test, expect, type Page } from "@playwright/test";

// F-002: one color per group (plan VS-002 P-2 and §5.1; F-002 CA-13, §5.2 and §5.4).
// Every expected value is the one of the plan §5.1, as the browser returns it.

type Scheme = "light" | "dark";

const KEYS = ["vowel", "consonant", "digit", "other"] as const;
const SIDES = ["top", "right", "bottom", "left"];

const MODES: Array<{
  scheme: Scheme;
  mode: string;
  colors: Record<(typeof KEYS)[number], string>;
  cardBackground: string;
  nameColor: string;
  fieldBackground: string;
}> = [
  {
    scheme: "light",
    mode: "modo claro",
    colors: {
      vowel: "rgb(198, 40, 40)",
      consonant: "rgb(21, 101, 192)",
      digit: "rgb(168, 75, 0)",
      other: "rgb(123, 31, 162)",
    },
    cardBackground: "rgb(238, 245, 238)",
    nameColor: "rgb(17, 34, 17)",
    fieldBackground: "rgb(255, 255, 255)",
  },
  {
    scheme: "dark",
    mode: "modo oscuro",
    colors: {
      vowel: "rgb(255, 123, 114)",
      consonant: "rgb(130, 177, 255)",
      digit: "rgb(255, 183, 77)",
      other: "rgb(206, 147, 216)",
    },
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

function card(page: Page, key: string) {
  return page.getByTestId(`count-card-${key}`);
}

function number(page: Page, key: string) {
  return page.getByTestId(`count-${key}`);
}

async function computed(page: Page, testId: string, property: string) {
  return page
    .getByTestId(testId)
    .evaluate((el, name) => getComputedStyle(el).getPropertyValue(name), property);
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
