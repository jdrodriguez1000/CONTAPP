import { test } from "@playwright/test";
import { expectRejected, expectState, openApp, paste, select, type } from "./field-helpers";

// P-7 (plan VS-001 §3, §5.1 and §5.2; F-001 CA-5, CA-9, CA-10): foreign letters do not enter.
// Combining marks, invisible characters and composed emojis are built from their codes
// (L-002, L-009): in the editor they cannot be told apart.

const GRAVE = String.fromCharCode(0x0300);
const ACUTE = String.fromCharCode(0x0301);
const TILDE = String.fromCharCode(0x0303);
const DIAERESIS = String.fromCharCode(0x0308);
const CEDILLA = String.fromCharCode(0x0327);

const ZERO_WIDTH_SPACE = String.fromCharCode(0x200b);
const ZERO_WIDTH_JOINER = String.fromCharCode(0x200d);
const INVISIBLES = [
  { name: "U+200B", char: ZERO_WIDTH_SPACE },
  { name: "U+200D", char: ZERO_WIDTH_JOINER },
  { name: "U+2060", char: String.fromCharCode(0x2060) },
  { name: "U+FEFF", char: String.fromCharCode(0xfeff) },
  { name: "U+00AD", char: String.fromCharCode(0x00ad) },
  { name: "U+FE0F", char: String.fromCharCode(0xfe0f) },
];

const FAMILY = [0x1f468, 0x1f469, 0x1f467]
  .map((code) => String.fromCodePoint(code))
  .join(ZERO_WIDTH_JOINER);
const FLAG = String.fromCodePoint(0x1f1e8, 0x1f1f4);
const THUMB_WITH_SKIN_TONE = String.fromCodePoint(0x1f44d, 0x1f3fd);
const RED_HEART = String.fromCodePoint(0x2764, 0xfe0f);
const KEYCAP_ONE = String.fromCodePoint(0x31, 0xfe0f, 0x20e3);

const nfc = (text: string) => text.normalize("NFC");

test('TC-016 — en el campo vacío, escribir "ç" y "Ç" no cambia nada ni muestra aviso (C-011, D-005)', async ({
  page,
}) => {
  const app = await openApp(page);

  for (const letter of ["ç", "Ç"]) {
    await expectRejected(app, () => type(app, letter), `typing ${letter}`);
  }
  await expectState(app, "", "0/0/0/0", 0);

  // The field is not stuck: an allowed letter still enters.
  await type(app, "a");
  await expectState(app, "a", "1/0/0/0", 1);
});

test('TC-017 — con "casa", escribir à â ö ß α ж uno a uno no cambia nada (C-011, D-005)', async ({
  page,
}) => {
  const app = await openApp(page);
  await type(app, "casa");

  for (const letter of ["à", "â", "ö", "ß", "α", "ж"]) {
    await expectRejected(app, () => type(app, letter), `typing ${letter}`);
  }
  await expectState(app, "casa", "2/2/0/0", 4);
});

test("TC-017 — borde: tampoco entran en mayúscula, de otros alfabetos o de ancho completo (C-011)", async ({
  page,
}) => {
  const app = await openApp(page);
  await type(app, "casa");

  // The last one is the full width capital A.
  for (const letter of ["À", "È", "ï", "Ö", "ã", "Ω", "Ж", "中", String.fromCharCode(0xff21)]) {
    await expectRejected(app, () => type(app, letter), `typing ${letter}`);
  }
});

test('TC-017 — borde: con el cursor en medio de "casa", la letra rechazada deja el cursor en su sitio (D-005)', async ({
  page,
}) => {
  const app = await openApp(page);
  await type(app, "casa");

  for (const position of [0, 2]) {
    await select(app, position);
    await expectRejected(app, () => type(app, "ç"), `typing ç at ${position}`);
  }

  // The next allowed letter goes where the cursor was.
  await type(app, "n");
  await expectState(app, "cansa", "2/3/0/0", 3);
});

test('TC-018 — con "casa", pegar "ç" o solo letras de otros idiomas no cambia nada (C-011, D-005)', async ({
  page,
}) => {
  const app = await openApp(page);
  await type(app, "casa");

  await expectRejected(app, () => paste(app, "ç"), "pasting ç");
  await expectRejected(app, () => paste(app, "çàâöß"), "pasting only foreign letters");
  await expectState(app, "casa", "2/2/0/0", 4);
});

test('TC-018 — borde: pegar "ç" sobre una parte seleccionada no borra lo seleccionado (C-011, D-005)', async ({
  page,
}) => {
  const app = await openApp(page);
  await type(app, "casa");
  await select(app, 1, 3);

  await paste(app, "ç");

  // The selection after this is not checked: the plan does not define it (see report).
  await expectState(app, "casa", "2/2/0/0");
});

test("TC-019 — control: ñ Ñ á É í Ó ú ü Ü sí entran: 7 vocales y 2 consonantes (C-001, C-002, C-011)", async ({
  page,
}) => {
  const app = await openApp(page);
  const letters = nfc("ñÑáÉíÓúüÜ");

  await type(app, letters);

  await expectState(app, letters, "7/2/0/0", letters.length);
});

test("TC-019 — control: entra todo el alfabeto español, con tildes y ü, en minúscula y mayúscula (C-011)", async ({
  page,
}) => {
  const app = await openApp(page);
  const lower = nfc("abcdefghijklmnñopqrstuvwxyzáéíóúü");
  const letters = lower + lower.toUpperCase();

  await paste(app, letters);

  await expectState(app, letters, "22/44/0/0", letters.length);
});

test('TC-029 — pegar "façade" en el campo vacío deja "faade": 3 vocales y 2 consonantes (C-011, C-016)', async ({
  page,
}) => {
  const app = await openApp(page);

  await paste(app, "façade");

  await expectState(app, "faade", "3/2/0/0", 5);
});

test('TC-029 — borde: pegar "façade" en medio de "casa" entra en el cursor y el cursor queda tras lo que entró (C-016)', async ({
  page,
}) => {
  const app = await openApp(page);
  await type(app, "casa");
  await select(app, 2);

  await paste(app, "façade");

  await expectState(app, "cafaadesa", "5/4/0/0", 7);
});

test("TC-029 — borde: de un texto mezclado entra lo demás en el mismo orden, con espacios, signos, dígitos y emoji (C-016)", async ({
  page,
}) => {
  const app = await openApp(page);
  const kept = `¡Hola, 2026! ${FAMILY}\n\tniño`;

  await paste(app, `¡Hoàla, 2026! ç${FAMILY}\n\tniñoß`);

  await expectState(app, kept, "4/4/4/4", kept.length);
});

test('TC-033 — pegar "canción" con la "ó" en dos piezas entra completa y en una sola pieza (C-014)', async ({
  page,
}) => {
  const app = await openApp(page);
  const twoPieces = `cancio${ACUTE}n`;

  await paste(app, twoPieces);

  await expectState(app, nfc(twoPieces), "3/4/0/0", 7);
});

test("TC-033 — borde: á é í ó ú ü ñ en dos piezas, minúscula y mayúscula, entran en una sola pieza (C-014)", async ({
  page,
}) => {
  const app = await openApp(page);
  const lower =
    ["a", "e", "i", "o", "u"].map((vowel) => vowel + ACUTE).join("") +
    `u${DIAERESIS}n${TILDE}`;
  const upper =
    ["A", "E", "I", "O", "U"].map((vowel) => vowel + ACUTE).join("") +
    `U${DIAERESIS}N${TILDE}`;

  await paste(app, lower + upper);

  await expectState(app, nfc(lower + upper), "12/2/0/0", 14);
});

test('TC-035 — control: escribir "^" en el campo vacío entra y cuenta como otro (C-007, C-015)', async ({
  page,
}) => {
  const app = await openApp(page);

  await type(app, "^");

  await expectState(app, "^", "0/0/0/1", 1);
});

test("TC-035 — control: las tildes sueltas, 1️⃣, ² ½ ª º sí entran y cuentan como otros (C-007, C-015)", async ({
  page,
}) => {
  const app = await openApp(page);
  const rare = `´¨\`^²½ªº${KEYCAP_ONE}`;

  await paste(app, rare);

  await expectState(app, rare, "0/0/0/9", rare.length);
});

test('TC-036 — pegar "٣" en el campo vacío no cambia nada (C-006, C-011, C-015)', async ({ page }) => {
  const app = await openApp(page);

  await expectRejected(app, () => paste(app, "٣"), "pasting an Arabic digit");
  await expectState(app, "", "0/0/0/0", 0);
});

test('TC-036 — pegar "a٣b" deja "ab": 1 vocal, 1 consonante y 0 números (C-015, C-016)', async ({
  page,
}) => {
  const app = await openApp(page);

  await paste(app, "a٣b");

  await expectState(app, "ab", "1/1/0/0", 2);
});

test("TC-036 — borde: tampoco entran dígitos de otros sistemas (devanagari y de ancho completo) (C-015)", async ({
  page,
}) => {
  const app = await openApp(page);
  await type(app, "09");

  for (const code of [0x0969, 0xff13]) {
    await expectRejected(app, () => paste(app, String.fromCharCode(code)), `pasting digit ${code}`);
  }
  await expectState(app, "09", "0/0/2/0", 2);
});

test('TC-038 — pegar "ca" + invisible suelto + "sa" deja "casa", de 4 caracteres (C-015)', async ({
  page,
}) => {
  const app = await openApp(page);

  await paste(app, `ca${ZERO_WIDTH_SPACE}sa`);

  await expectState(app, "casa", "2/2/0/0", 4);
});

for (const invisible of INVISIBLES) {
  test(`TC-038 — borde: el invisible ${invisible.name} no entra, ni solo ni en medio de un texto (C-015)`, async ({
    page,
  }) => {
    const app = await openApp(page);

    await expectRejected(app, () => paste(app, invisible.char), `pasting ${invisible.name} alone`);
    await paste(app, `ca${invisible.char}sa`);
    await expectState(app, "casa", "2/2/0/0", 4);
    await select(app, 2);
    await expectRejected(app, () => paste(app, invisible.char), `pasting ${invisible.name} inside`);
  });
}

test("TC-038 — control: la familia, la bandera, el tono de piel y el corazón entran completos, con sus piezas (C-007)", async ({
  page,
}) => {
  const app = await openApp(page);

  await paste(app, FAMILY);
  await expectState(app, FAMILY, "0/0/0/1", FAMILY.length);

  await paste(app, FLAG + THUMB_WITH_SKIN_TONE + RED_HEART);
  const all = FAMILY + FLAG + THUMB_WITH_SKIN_TONE + RED_HEART;
  await expectState(app, all, "0/0/0/4", all.length);
});

test("TC-038 — control: el filtro no quita tabulaciones, saltos de línea ni el espacio que no se parte (C-008, C-015)", async ({
  page,
}) => {
  const app = await openApp(page);
  const text = `la${String.fromCharCode(0x00a0)}casa\tazul\ny`;

  await paste(app, text);

  await expectState(app, text, "5/6/0/0", text.length);
});

test('TC-040 — pegar "niño" con la "ñ" en dos piezas entra completa y en una sola pieza (C-002, C-014)', async ({
  page,
}) => {
  const app = await openApp(page);
  const twoPieces = `nin${TILDE}o`;

  await paste(app, twoPieces);

  await expectState(app, nfc(twoPieces), "2/2/0/0", 4);
});

test('TC-041 — con "casa", pegar "à" en dos piezas no cambia nada: tampoco entra la "a" sola (C-014, D-005)', async ({
  page,
}) => {
  const app = await openApp(page);
  await type(app, "casa");

  await expectRejected(app, () => paste(app, `a${GRAVE}`), "pasting a + grave");
  await expectState(app, "casa", "2/2/0/0", 4);
});

test('TC-041 — en el campo vacío, pegar "càsa" con la "à" en dos piezas deja "csa" (C-011, C-014, C-016)', async ({
  page,
}) => {
  const app = await openApp(page);

  await paste(app, `ca${GRAVE}sa`);

  await expectState(app, "csa", "1/2/0/0", 3);
});

test('TC-041 — borde: "ç" y "ê" en dos piezas, y una "á" con un segundo signo ajeno, no entran (C-011, C-014)', async ({
  page,
}) => {
  const app = await openApp(page);
  await type(app, "casa");

  const attempts = [
    { what: "c + cedilla", text: `c${CEDILLA}` },
    { what: "e + circumflex", text: `e${String.fromCharCode(0x0302)}` },
    { what: "a + acute + grave", text: `a${ACUTE}${GRAVE}` },
  ];
  for (const { what, text } of attempts) {
    await expectRejected(app, () => paste(app, text), `pasting ${what}`);
  }
});

test("TC-041 — borde: un signo suelto no entra, ni en el campo vacío ni detrás de una letra ya escrita (C-015, plan R-7)", async ({
  page,
}) => {
  const app = await openApp(page);

  await expectRejected(app, () => paste(app, ACUTE), "pasting a lone acute in the empty field");
  await type(app, "casa");
  await expectRejected(app, () => paste(app, ACUTE), 'pasting a lone acute after "casa"');
  await expectRejected(app, () => paste(app, GRAVE), 'pasting a lone grave after "casa"');
});
