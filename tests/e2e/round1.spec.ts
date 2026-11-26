import { expect, test } from "@playwright/test";
import {
  type App,
  expectNoNotice,
  expectRejected,
  expectState,
  openApp,
  paste,
  readCounts,
  select,
  selectionOf,
  type,
} from "./field-helpers";

// Round 1 (F-001 TC-043 to TC-048; plan VS-001 §5.1 and §5.2; D-017, D-018).
// Combining marks, invisible characters, foreign letters and composed emojis are built
// from their codes (L-002, L-009): in the editor they cannot be told apart.

const cp = (...codes: number[]) => String.fromCodePoint(...codes);

const GRAVE = cp(0x0300);
const ACUTE = cp(0x0301);
const CEDILLA_MARK = cp(0x0327);
const KEYCAP = cp(0x20e3);
const VS16 = cp(0xfe0f);
const NO_BREAK_SPACE = cp(0x00a0);
const LONG_S = cp(0x017f);
const C_CEDILLA = cp(0x00e7);
const ARABIC_THREE = cp(0x0663);
const SMILE = cp(0x1f600);
const KEYCAP_ONE = "1" + VS16 + KEYCAP;

// ---------------------------------------------------------------------------
// TC-043: back navigation (CA-7, D-017)
// ---------------------------------------------------------------------------

async function leaveAndComeBack(app: App, leave: () => Promise<unknown>) {
  const home = app.page.url();
  await leave();
  await expect.poll(() => app.page.url()).not.toBe(home);
  await app.page.goBack();
  await expect(app.page).toHaveURL(home);
  await app.page.waitForLoadState("load");
  await expect(app.field).toBeVisible();
  // The browser restores form values some time after the page shows up. Without this
  // fixed wait, an early read would see the empty field and pass by mistake.
  await app.page.waitForTimeout(1000);
}

for (const [way, leave] of [
  ["abrir otra dirección", (app: App) => app.page.goto("about:blank")],
  [
    "navegar desde la propia página",
    (app: App) =>
      app.page.evaluate(() => {
        window.location.assign("about:blank");
      }),
  ],
] as const) {
  test(`TC-043 — volver con "atrás" (tras ${way}) deja el campo vacío y los 4 en 0 (CA-7, D-017, C-010)`, async ({
    page,
  }) => {
    const app = await openApp(page);
    await type(app, "casa 12");
    await expectState(app, "casa 12", "2/2/2/0");

    await leaveAndComeBack(app, () => leave(app));

    await expectState(app, "", "0/0/0/0");

    // The app still counts after coming back, with nothing left from before.
    await app.field.focus();
    await type(app, "sol");
    await expectState(app, "sol", "1/2/0/0", 3);
  });
}

// ---------------------------------------------------------------------------
// TC-044: undo and redo after a rejection (CA-5, CA-8, C-009, C-011)
// ---------------------------------------------------------------------------

type History = "undo" | "redo";

// Two ways to ask for undo and redo: the keyboard shortcut and the editing command
// (the second does not depend on the key bindings of the machine).
const HISTORY_WAYS = [
  {
    way: "con el teclado",
    run: async (app: App, action: History) => {
      await app.page.keyboard.press(action === "undo" ? "ControlOrMeta+z" : "ControlOrMeta+Shift+z");
    },
  },
  {
    way: "con la orden de edición",
    run: async (app: App, action: History) => {
      await app.page.evaluate((command) => {
        document.execCommand(command);
      }, action);
    },
  },
];

const CASA_PREFIXES = ["|0/0/0/0", "c|0/1/0/0", "ca|1/1/0/0", "cas|1/2/0/0", "casa|2/2/0/0"];

// Saves "text|counts" after every change, once the app has handled it.
async function recordStates(app: App) {
  await app.page.evaluate(() => {
    const seen: string[] = [];
    (window as unknown as { seenStates: string[] }).seenStates = seen;
    window.addEventListener("input", () => {
      const field = document.querySelector<HTMLTextAreaElement>('[data-testid="text-field"]');
      const counts = ["vowel", "consonant", "digit", "other"]
        .map((key) => document.querySelector(`[data-testid="count-${key}"]`)?.textContent ?? "")
        .join("/");
      seen.push(`${field?.value ?? ""}|${counts}`);
    });
  });
}

async function expectOnlyStates(app: App, allowed: string[], what: string) {
  const current = `${await app.field.inputValue()}|${await readCounts(app.page)}`;
  const seen = await app.page.evaluate(
    () => (window as unknown as { seenStates: string[] }).seenStates,
  );
  const unexpected = [...seen, current].filter((state) => !allowed.includes(state));
  expect(unexpected, `states nobody wrote, after ${what}`).toEqual([]);
}

test("TC-044 — control: en este navegador de pruebas, deshacer y rehacer sí funcionan en un campo sin la app", async ({
  page,
}) => {
  for (const { way, run } of HISTORY_WAYS) {
    await page.setContent('<textarea data-testid="text-field"></textarea>');
    const app: App = { page, field: page.getByTestId("text-field"), dialogs: [] };
    await type(app, "ab");

    await run(app, "undo");
    expect(await app.field.inputValue(), `after undo ${way}`).not.toBe("ab");
    await run(app, "redo");
    await expect(app.field, `after redo ${way}`).toHaveValue("ab");
  }
});

for (const { way, run } of HISTORY_WAYS) {
  test(`TC-044 — "casa", escribir una letra ajena, deshacer y rehacer ${way}: queda "casa" (CA-5, CA-8)`, async ({
    page,
  }) => {
    const app = await openApp(page);
    await type(app, "casa");
    await expectRejected(app, () => type(app, C_CEDILLA), "typing c with cedilla");
    await recordStates(app);

    await run(app, "undo");
    await expectOnlyStates(app, CASA_PREFIXES, "undo");
    await run(app, "redo");
    await expectOnlyStates(app, CASA_PREFIXES, "redo");

    await expectState(app, "casa", "2/2/0/0");
  });

  test(`TC-044 — borde: deshacer y rehacer varias veces seguidas ${way} nunca inventa ni repite texto`, async ({
    page,
  }) => {
    const app = await openApp(page);
    await type(app, "casa");
    await type(app, C_CEDILLA);
    await recordStates(app);

    for (const action of ["undo", "undo", "undo", "redo", "redo", "redo", "redo", "redo"] as const) {
      await run(app, action);
      await expectOnlyStates(app, CASA_PREFIXES, action);
    }
    await expectNoNotice(app);
  });

  test(`TC-044 — control: pegar "façade" y rehacer sin haber deshecho ${way}: queda "faade" (CA-5, C-016)`, async ({
    page,
  }) => {
    const app = await openApp(page);
    await paste(app, "fa" + C_CEDILLA + "ade");
    await expectState(app, "faade", "3/2/0/0", 5);
    await recordStates(app);

    await run(app, "redo");
    await expectOnlyStates(app, ["faade|3/2/0/0"], "redo");

    await expectState(app, "faade", "3/2/0/0");
  });

  test(`TC-044 — pegar "façade", deshacer y rehacer ${way}: queda "faade" (CA-5, CA-8)`, async ({
    page,
  }) => {
    const app = await openApp(page);
    await paste(app, "fa" + C_CEDILLA + "ade");
    await recordStates(app);

    for (const action of ["undo", "redo"] as const) {
      await run(app, action);
      await expectOnlyStates(app, ["|0/0/0/0", "faade|3/2/0/0"], action);
    }

    await expectState(app, "faade", "3/2/0/0");
  });
}

// ---------------------------------------------------------------------------
// TC-045: keycap sign U+20E3 and "prepend" characters (CA-5, CA-10, C-011, C-015)
// ---------------------------------------------------------------------------

for (const [name, foreign] of [
  ["c con cedilla", C_CEDILLA],
  ["alfa griega", cp(0x03b1)],
  ["zhe cirílica", cp(0x0436)],
  ["tres de otro alfabeto", ARABIC_THREE],
  ["a grave en dos piezas", "a" + GRAVE],
]) {
  for (const [form, sign] of [
    ["U+20E3", KEYCAP],
    ["U+FE0F + U+20E3", VS16 + KEYCAP],
  ]) {
    test(`TC-045 — pegar ${name} + ${form} no entra, en el campo vacío ni tras "casa" (C-011, C-015)`, async ({
      page,
    }) => {
      const app = await openApp(page);
      await expectRejected(app, () => paste(app, foreign + sign), "pasting in the empty field");
      await expectState(app, "", "0/0/0/0", 0);

      await paste(app, "casa");
      await expectRejected(app, () => paste(app, foreign + sign), 'pasting after "casa"');
      await expectState(app, "casa", "2/2/0/0", 4);
    });
  }
}

test('TC-045 — borde: en "ab" pegado con una c con cedilla + U+20E3 en medio entra solo "ab" (C-016)', async ({
  page,
}) => {
  const app = await openApp(page);
  await paste(app, "a" + C_CEDILLA + KEYCAP + "b");
  await expectState(app, "ab", "1/1/0/0", 2);
});

test('TC-045 — con "c" escrita, pegar U+0327 + U+20E3 no la cambia (C-011, C-015)', async ({ page }) => {
  const app = await openApp(page);
  await type(app, "c");
  await expectRejected(app, () => paste(app, CEDILLA_MARK + KEYCAP), "pasting cedilla + keycap");
  await expectState(app, "c", "0/1/0/0", 1);
});

test('TC-045 — con "1" escrito, pegar U+20E3 solo no lo cambia: sigue 1 número (C-015)', async ({
  page,
}) => {
  const app = await openApp(page);
  await type(app, "1");
  await expectRejected(app, () => paste(app, KEYCAP), "pasting the keycap sign alone");
  await expectState(app, "1", "0/0/1/0", 1);
});

test("TC-045 — control: la tecla 1️⃣ sigue entrando como 1 otro (CA-10, C-015)", async ({ page }) => {
  const app = await openApp(page);
  await paste(app, KEYCAP_ONE);
  await expectState(app, KEYCAP_ONE, "0/0/0/1", KEYCAP_ONE.length);
});

for (const [name, prefix] of [
  ["U+0D4E", cp(0x0d4e)],
  ["U+0600", cp(0x0600)],
]) {
  test(`TC-045 — pegar ${name} delante de un emoji: entra solo el emoji (C-011, C-015)`, async ({
    page,
  }) => {
    const app = await openApp(page);
    await paste(app, prefix + SMILE);
    await expectState(app, SMILE, "0/0/0/1", SMILE.length);
  });
}

test('TC-045 — con "1" escrito, pegar U+FE0F + U+20E3 no lo convierte en tecla: sigue 1 número (C-015)', async ({
  page,
}) => {
  const app = await openApp(page);
  await type(app, "1");
  await expectRejected(app, () => paste(app, VS16 + KEYCAP), "pasting U+FE0F + keycap sign");
  await expectState(app, "1", "0/0/1/0", 1);
});

test("TC-045 — pegar la tecla 1️⃣ con una tilde detrás: entra la tecla intacta, sin la tilde (D-018)", async ({
  page,
}) => {
  const app = await openApp(page);
  await paste(app, KEYCAP_ONE + ACUTE);
  await expectState(app, KEYCAP_ONE, "0/0/0/1", KEYCAP_ONE.length);
});

test("TC-049 — pegar un emoji con 2000 tildes detrás: entra solo el emoji (CA-11, D-018, A-001)", async ({
  page,
}) => {
  const app = await openApp(page);
  await paste(app, "casa");
  await paste(app, SMILE + ACUTE.repeat(2_000));
  await expectState(app, "casa" + SMILE, "2/2/0/1", 4 + SMILE.length);
});

// ---------------------------------------------------------------------------
// TC-046: long s, U+017F (CA-5, C-011, C-016)
// ---------------------------------------------------------------------------

test('TC-046 — con "casa", escribir la s larga (U+017F) no cambia nada (C-011, D-005)', async ({
  page,
}) => {
  const app = await openApp(page);
  await type(app, "casa");
  await expectRejected(app, () => type(app, LONG_S), "typing the long s");
  await expectState(app, "casa", "2/2/0/0", 4);
});

test('TC-046 — pegar "casa" escrita con s larga en el campo vacío deja "caa" (C-016)', async ({
  page,
}) => {
  const app = await openApp(page);
  await paste(app, "ca" + LONG_S + "a");
  await expectState(app, "caa", "2/1/0/0", 3);
});

// ---------------------------------------------------------------------------
// TC-047: paste over a selection (CA-5, C-016; plan §5.1 and §5.2)
// ---------------------------------------------------------------------------

for (const { name, base, from, to, clip, value, counts, cursor } of [
  {
    name: '"casa", "as" ← "aç" → "caa"',
    base: "casa",
    from: 1,
    to: 3,
    clip: "a" + C_CEDILLA,
    value: "caa",
    counts: "2/1/0/0",
    cursor: 2,
  },
  {
    name: '"casa" entera ← "caç" → "ca"',
    base: "casa",
    from: 0,
    to: 4,
    clip: "ca" + C_CEDILLA,
    value: "ca",
    counts: "1/1/0/0",
    cursor: 2,
  },
  {
    name: '"banana" entera ← "ban" + dígito ajeno → "ban"',
    base: "banana",
    from: 0,
    to: 6,
    clip: "ban" + ARABIC_THREE,
    value: "ban",
    counts: "1/2/0/0",
    cursor: 3,
  },
  {
    name: "100 letras seleccionadas ← 10 iguales + letra ajena → quedan las 10",
    base: "a".repeat(100),
    from: 0,
    to: 100,
    clip: "a".repeat(10) + C_CEDILLA,
    value: "a".repeat(10),
    counts: "10/0/0/0",
    cursor: 10,
  },
  {
    name: 'control: "casa" entera ← "casa" + letra ajena → "casa", ya sin selección',
    base: "casa",
    from: 0,
    to: 4,
    clip: "casa" + C_CEDILLA,
    value: "casa",
    counts: "2/2/0/0",
    cursor: 4,
  },
]) {
  test(`TC-047 — pegar sobre una selección: ${name} (C-016, D-005)`, async ({ page }) => {
    const app = await openApp(page);
    await paste(app, base);
    await select(app, from, to);
    expect(await selectionOf(app.field), "selection before pasting").toEqual([from, to]);

    await paste(app, clip);

    await expectState(app, value, counts, cursor);
  });
}

// ---------------------------------------------------------------------------
// TC-048: combining mark pasted on a blank (CA-11, C-015, D-018)
// ---------------------------------------------------------------------------

for (const [name, blank, mark] of [
  ["espacio + U+0300", " ", GRAVE],
  ["espacio + U+0327", " ", CEDILLA_MARK],
  ["espacio que no se parte + U+0300", NO_BREAK_SPACE, GRAVE],
  ["tabulación + U+0300", "\t", GRAVE],
  ["salto de línea + U+0300", "\n", GRAVE],
  ["espacio + 3 tildes", " ", GRAVE + GRAVE + CEDILLA_MARK],
]) {
  // After a tab or a line break the mark is a piece of its own, already rejected: controls.
  const label = blank === " " || blank === NO_BREAK_SPACE ? "" : "control: ";
  test(`TC-048 — ${label}con "casa", pegar ${name}: entra el blanco y la tilde no (CA-11, D-018)`, async ({
    page,
  }) => {
    const app = await openApp(page);
    await paste(app, "casa");

    await paste(app, blank + mark);

    await expectState(app, "casa" + blank, "2/2/0/0", 5);
  });
}
