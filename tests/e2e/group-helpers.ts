import { expect, type Page } from "@playwright/test";

// What a card of a group looks like: shared by group-look.spec.ts and
// published.spec.ts (plan VS-002 §5.1). Every expected value is the one of the plan,
// as the browser returns it.

export const KEYS = ["vowel", "consonant", "digit", "other"] as const;
export type Key = (typeof KEYS)[number];
export type Colors = Record<Key, string>;

export const COLORS: Record<"light" | "dark", Colors> = {
  light: {
    vowel: "rgb(198, 40, 40)",
    consonant: "rgb(21, 101, 192)",
    digit: "rgb(168, 75, 0)",
    other: "rgb(123, 31, 162)",
  },
  dark: {
    vowel: "rgb(255, 123, 114)",
    consonant: "rgb(130, 177, 255)",
    digit: "rgb(255, 183, 77)",
    other: "rgb(206, 147, 216)",
  },
};

export const IMAGE_SIZE = 44;
export const IMAGE_GAP = 8;

export function card(page: Page, key: string) {
  return page.getByTestId(`count-card-${key}`);
}

export function number(page: Page, key: string) {
  return page.getByTestId(`count-${key}`);
}

export async function computed(page: Page, testId: string, property: string) {
  return page
    .getByTestId(testId)
    .evaluate((el, name) => getComputedStyle(el).getPropertyValue(name), property);
}

// What the ::before of a number looks like. WebKit may report the mask under either
// name (plan §7 R-3): the one that is not "none" counts.
export async function imageStyle(page: Page, key: string) {
  return number(page, key).evaluate((el) => {
    const style = getComputedStyle(el, "::before");
    const masks = ["mask-image", "-webkit-mask-image"].map((name) => style.getPropertyValue(name));
    return {
      content: style.content,
      width: style.width,
      height: style.height,
      backgroundColor: style.backgroundColor,
      mask: masks.find((value) => value !== "" && value !== "none") ?? "none",
    };
  });
}

export async function expectGroupImages(page: Page, colors: Colors) {
  const masks: string[] = [];
  for (const key of KEYS) {
    const target = number(page, key);
    const before = { pseudo: "before" } as const;
    await expect(target, `image of ${key}: exists`).toHaveCSS("content", '""', before);
    await expect(target, `image of ${key}: width`).toHaveCSS("width", `${IMAGE_SIZE}px`, before);
    await expect(target, `image of ${key}: height`).toHaveCSS("height", `${IMAGE_SIZE}px`, before);
    await expect(target, `image of ${key}: color`).toHaveCSS(
      "background-color",
      colors[key],
      before,
    );
    const { mask } = await imageStyle(page, key);
    expect(mask, `image of ${key}: mask`).toContain("data:image/svg+xml");
    masks.push(mask);
  }
  expect(new Set(masks).size, "different images").toBe(4);
}

// Everything of a card that must depend only on its group (plan §5.1): never on the
// count, on the text or on a rejection (CA-14).
export async function cardLooks(page: Page) {
  const looks: Record<string, unknown> = {};
  for (const key of KEYS) {
    looks[key] = {
      card: await card(page, key).evaluate((el) => {
        const style = getComputedStyle(el);
        const name = getComputedStyle(el.querySelector("dt") as Element);
        const value = getComputedStyle(el.querySelector("dd") as Element);
        return [
          ...["top", "right", "bottom", "left"].flatMap((side) => [
            style.getPropertyValue(`border-${side}-color`),
            style.getPropertyValue(`border-${side}-style`),
            style.getPropertyValue(`border-${side}-width`),
            style.getPropertyValue(`padding-${side}`),
          ]),
          style.backgroundColor,
          name.color,
          value.color,
          value.display,
          value.columnGap,
        ].join("|");
      }),
      image: await imageStyle(page, key),
    };
  }
  looks.fieldBackground = await computed(page, "text-field", "background-color");
  return looks;
}
