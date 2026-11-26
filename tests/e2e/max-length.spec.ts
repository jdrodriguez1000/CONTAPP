import { test, expect, type Page } from "@playwright/test";
import {
  expectRejected,
  expectState,
  openApp,
  paste,
  select,
  type,
  type App,
} from "./field-helpers";

// P-8 (plan VS-001 §3, §5.1 and §5.2; F-001 CA-6, CA-9; A-001, D-007): 100 characters at most.
// Spaces, tabs and line breaks take a place; an emoji takes 1. What is left over does
// not enter, with no notice. Special characters are built from their codes (L-002, L-009).

const TILDE = String.fromCharCode(0x0303);
const ACUTE = String.fromCharCode(0x0301);
const FAMILY = [0x1f468, 0x1f469, 0x1f467]
  .map((code) => String.fromCodePoint(code))
  .join(String.fromCharCode(0x200d));
const FLAG = String.fromCodePoint(0x1f1e8, 0x1f1f4);

const a = (times: number) => "a".repeat(times);

// Starts from a text that is already in the field, with the cursor at its end.
async function openWith(page: Page, text: string, counts: string): Promise<App> {
  const app = await openApp(page);
  await paste(app, text);
  await expectState(app, text, counts, text.length);
  return app;
}

test('TC-020 — control: con 99 "a", escribir "b" entra y quedan 100, sin aviso (A-001)', async ({
  page,
}) => {
  const app = await openWith(page, a(99), "99/0/0/0");

  await type(app, "b");

  await expectState(app, `${a(99)}b`, "99/1/0/0", 100);
});

test('TC-021 — con 100 caracteres, escribir "c" no entra y no hay aviso ni marca de límite (A-001, D-007)', async ({
  page,
}) => {
  const app = await openWith(page, `${a(99)}b`, "99/1/0/0");

  await expectRejected(app, () => type(app, "c"), "typing character 101");

  await expectState(app, `${a(99)}b`, "99/1/0/0", 100);
});

test("TC-021 — borde: con 100, tampoco entran un espacio, un salto de línea, un dígito, un emoji ni un pegado (A-001, D-007)", async ({
  page,
}) => {
  const app = await openWith(page, `${a(99)}b`, "99/1/0/0");

  await expectRejected(app, () => type(app, " "), "typing a space");
  await expectRejected(app, () => app.field.press("Enter"), "pressing Enter");
  await expectRejected(app, () => type(app, "7"), "typing a digit");
  await expectRejected(app, () => paste(app, FAMILY), "pasting an emoji");
  await expectRejected(app, () => paste(app, "\t"), "pasting a tab");
  await expectRejected(app, () => paste(app, "casa"), "pasting a word");
});

test("TC-021 — borde: con 100, escribir en medio no entra, no se pierde el último carácter y el cursor no se mueve (D-007)", async ({
  page,
}) => {
  const app = await openWith(page, `${a(99)}b`, "99/1/0/0");

  for (const position of [0, 50, 99]) {
    await select(app, position);
    await expectRejected(app, () => type(app, "c"), `typing at ${position}`);
    await expectRejected(app, () => paste(app, "casa"), `pasting at ${position}`);
  }
});

test("TC-021 — borde: con 100, al borrar uno vuelve a entrar exactamente uno (A-001)", async ({
  page,
}) => {
  const app = await openWith(page, `${a(99)}b`, "99/1/0/0");

  await app.field.press("Backspace");
  await expectState(app, a(99), "99/0/0/0", 99);

  await type(app, "c");
  await expectState(app, `${a(99)}c`, "99/1/0/0", 100);

  await expectRejected(app, () => type(app, "d"), "typing after filling it again");
});

test("TC-021 — control: con 100, escribir sobre un carácter seleccionado lo reemplaza (A-001)", async ({
  page,
}) => {
  const app = await openWith(page, `${a(99)}b`, "99/1/0/0");
  await select(app, 10, 11);

  await type(app, "c");

  await expectState(app, `${a(10)}c${a(88)}b`, "98/2/0/0", 11);
});

test('TC-022 — pegar 150 "a" en el campo vacío deja entrar 100, sin aviso (A-001, D-007)', async ({
  page,
}) => {
  const app = await openApp(page);

  await paste(app, a(150));

  await expectState(app, a(100), "100/0/0/0", 100);
});

test("TC-022 — borde: al pegar 101 entra el comienzo de lo pegado y se queda por fuera solo el final (A-001, D-007)", async ({
  page,
}) => {
  const app = await openApp(page);

  // 97 "a", then "b7?" fill up to 100; the final "z" is left over.
  await paste(app, `${a(97)}b7?z`);

  await expectState(app, `${a(97)}b7?`, "97/1/1/1", 100);
});

test("TC-022 — control: pegar exactamente 100 entra completo (A-001)", async ({ page }) => {
  const app = await openApp(page);

  await paste(app, `${a(99)}b`);

  await expectState(app, `${a(99)}b`, "99/1/0/0", 100);
});

test("TC-022 — borde: lo que el filtro rechaza no ocupa lugar en los 100 (A-001, C-016)", async ({
  page,
}) => {
  const app = await openApp(page);

  await paste(app, `${"ç".repeat(10)}${a(99)}${"ß".repeat(10)}bc`);

  await expectState(app, `${a(99)}b`, "99/1/0/0", 100);
});

test('TC-023 — con 99 "a", pegar la familia entra porque ocupa 1; luego "b" no entra (A-001, C-007)', async ({
  page,
}) => {
  const app = await openWith(page, a(99), "99/0/0/0");

  await paste(app, FAMILY);
  await expectState(app, a(99) + FAMILY, "99/0/0/1", (a(99) + FAMILY).length);

  await expectRejected(app, () => type(app, "b"), 'typing "b" after the family');
});

test("TC-023 — borde: caben 100 familias completas y la 101 no entra (A-001)", async ({ page }) => {
  const app = await openApp(page);
  const hundred = FAMILY.repeat(100);

  await paste(app, FAMILY.repeat(101));
  await expectState(app, hundred, "0/0/0/100", hundred.length);

  await expectRejected(app, () => paste(app, FAMILY), "pasting family 101");
});

test("TC-023 — borde: con 99, de dos banderas entra una completa, nunca media (A-001, D-007)", async ({
  page,
}) => {
  const app = await openWith(page, a(99), "99/0/0/0");

  await paste(app, FLAG + FLAG);

  await expectState(app, a(99) + FLAG, "99/0/0/1", (a(99) + FLAG).length);
});

test('TC-028 — los espacios ocupan lugar: con "a " repetido hasta 99 entra un espacio y "b" ya no (A-001, D-007)', async ({
  page,
}) => {
  const text = `${"a ".repeat(49)}a`;
  expect(text.length).toBe(99);
  const app = await openWith(page, text, "50/0/0/0");

  await type(app, " ");
  await expectState(app, `${text} `, "50/0/0/0", 100);

  await expectRejected(app, () => type(app, "b"), 'typing "b" after 100 with spaces');
});

for (const blank of [
  { name: "un salto de línea", char: "\n" },
  { name: "una tabulación", char: "\t" },
]) {
  test(`TC-028 — borde: ${blank.name} también ocupa lugar en los 100 (A-001)`, async ({ page }) => {
    const app = await openWith(page, a(99), "99/0/0/0");

    await paste(app, blank.char);
    await expectState(app, a(99) + blank.char, "99/0/0/0", 100);

    await expectRejected(app, () => type(app, "b"), 'typing "b" after 100');
  });
}

test('TC-030 — con 98 "a", pegar "xyz" en medio deja entrar "xy" ahí y el cursor queda después (A-001, D-007)', async ({
  page,
}) => {
  const app = await openWith(page, a(98), "98/0/0/0");
  await select(app, 49);

  await paste(app, "xyz");

  await expectState(app, `${a(49)}xy${a(49)}`, "98/2/0/0", 51);
});

test('TC-030 — borde: con 100, pegar "xyz" sobre 2 seleccionados deja entrar solo "xy" (A-001, D-007)', async ({
  page,
}) => {
  const app = await openWith(page, a(100), "100/0/0/0");
  await select(app, 10, 12);

  await paste(app, "xyz");

  await expectState(app, `${a(10)}xy${a(88)}`, "98/2/0/0", 12);
});

test('TC-042 — con 99 "a", pegar "ñ" en dos piezas entra completa porque ocupa 1; luego "b" no entra (A-001, C-014, D-007)', async ({
  page,
}) => {
  const app = await openWith(page, a(99), "99/0/0/0");
  const expected = a(99) + `n${TILDE}`.normalize("NFC");

  await paste(app, `n${TILDE}`);
  await expectState(app, expected, "99/1/0/0", 100);

  await expectRejected(app, () => type(app, "b"), 'typing "b" after the two-piece letter');
});

test("TC-042 — borde: 101 letras en dos piezas pegadas dejan entrar 100 completas, sin partir ninguna (A-001, C-014)", async ({
  page,
}) => {
  const app = await openApp(page);
  const twoPieces = `a${ACUTE}`;

  await paste(app, twoPieces.repeat(101));

  await expectState(app, twoPieces.repeat(100).normalize("NFC"), "100/0/0/0", 100);
});
