import { describe, expect, test } from "vitest";
import { applyInput, MAX_TEXT_LENGTH, textLength } from "./inputFilter";

// Combining marks, invisible characters and composed emojis are built from their codes
// (L-002, L-009): in an editor they cannot be told apart.
const GRAVE = String.fromCharCode(0x0300);
const ACUTE = String.fromCharCode(0x0301);
const CIRCUMFLEX = String.fromCharCode(0x0302);
const TILDE = String.fromCharCode(0x0303);
const DIAERESIS = String.fromCharCode(0x0308);
const CEDILLA = String.fromCharCode(0x0327);
const ZERO_WIDTH_SPACE = String.fromCharCode(0x200b);
const ZERO_WIDTH_JOINER = String.fromCharCode(0x200d);
const VARIATION_SELECTOR = String.fromCharCode(0xfe0f);

const FAMILY = [0x1f468, 0x1f469, 0x1f467]
  .map((code) => String.fromCodePoint(code))
  .join(ZERO_WIDTH_JOINER);
const FLAG = String.fromCodePoint(0x1f1e8, 0x1f1f4);
const KEYCAP_ONE = String.fromCodePoint(0x31, 0xfe0f, 0x20e3);
const THUMB_UP = String.fromCodePoint(0x1f44d);
const THUMB_DOWN = String.fromCodePoint(0x1f44e);

// A change where `added` goes into `previousText`, replacing from `start` to `end`.
// By default it goes at the end, with nothing selected.
function insert(previousText: string, added: string, start = previousText.length, end = start) {
  const nextText = previousText.slice(0, start) + added + previousText.slice(end);
  return applyInput(previousText, nextText, start + added.length);
}

const accepted = (text: string, cursor = text.length) => ({ text, cursor });

describe("applyInput: only Spanish letters and digits 0-9 get in (P-7)", () => {
  test("TC-029: pasting façade keeps faade", () => {
    expect(insert("", "façade")).toEqual(accepted("faade"));
  });

  test("TC-029: pasting façade in the middle leaves the cursor after what got in", () => {
    expect(insert("casa", "façade", 2)).toEqual(accepted("cafaadesa", 7));
  });

  test("TC-041: a + combining grave is rejected entirely", () => {
    expect(insert("casa", `a${GRAVE}`)).toEqual(accepted("casa"));
  });

  test("TC-041: pasting ca + grave + sa keeps csa", () => {
    expect(insert("", `ca${GRAVE}sa`)).toEqual(accepted("csa"));
  });

  test.each([
    { name: "c + cedilla", added: `c${CEDILLA}` },
    { name: "e + circumflex", added: `e${CIRCUMFLEX}` },
    { name: "a + acute + grave", added: `a${ACUTE}${GRAVE}` },
    { name: "q + acute, which has no single piece", added: `q${ACUTE}` },
    { name: "a Greek letter", added: "α" },
    { name: "a full width capital A", added: String.fromCharCode(0xff21) },
    { name: "an Arabic digit", added: "٣" },
    { name: "a full width digit", added: String.fromCharCode(0xff13) },
    { name: "a lone acute after a written letter", added: ACUTE },
    { name: "a zero width space", added: ZERO_WIDTH_SPACE },
    { name: "a lone zero width joiner", added: ZERO_WIDTH_JOINER },
    { name: "a lone variation selector", added: VARIATION_SELECTOR },
    { name: "a lone control character", added: String.fromCharCode(0x0007) },
  ])("P-7: rejects $name", ({ added }) => {
    expect(insert("casa", added)).toEqual(accepted("casa"));
  });

  test.each([
    { name: "two-piece ñ", added: `n${TILDE}`, kept: "ñ" },
    { name: "two-piece Á", added: `A${ACUTE}`, kept: "Á" },
    { name: "a zero width joiner between n and tilde", added: `n${ZERO_WIDTH_JOINER}${TILDE}`, kept: "ñ" },
    { name: "an invisible between letters", added: `ca${ZERO_WIDTH_SPACE}sa`, kept: "casa" },
  ])("P-7: $name is stored clean and in one piece", ({ added, kept }) => {
    expect(insert("", added)).toEqual(accepted(kept));
  });

  test.each([
    { name: "the Spanish letters", added: "abcxyzñÑáéíóúüÁÉÍÓÚÜ" },
    { name: "ordinals, superscripts, fractions and loose accents", added: "ªº²½´¨`^" },
    { name: "digits and signs", added: "0123456789¡!¿?,.@#" },
    { name: "tab, line break and non breaking space", added: `\t\n${String.fromCharCode(0x00a0)}` },
    { name: "whole emojis with all their pieces", added: FAMILY + FLAG + KEYCAP_ONE },
    { name: "a heart with its variation selector", added: `\u{2764}${VARIATION_SELECTOR}` },
  ])("P-7: lets in $name", ({ added }) => {
    expect(insert("", added)).toEqual(accepted(added));
  });
});

describe("applyInput: letters are compared exactly (P-7, round 1)", () => {
  // Ignoring case, the long s folds to "s", but it is not a Spanish letter.
  test("TC-046: pasting casa written with a long s keeps caa", () => {
    const longS = String.fromCharCode(0x017f);

    expect(insert("", `ca${longS}a`)).toEqual(accepted("caa"));
  });
});

describe("applyInput: marks on something that is not a letter are dropped (P-7, D-018)", () => {
  test.each([
    { name: "TC-048: a space + grave", added: ` ${GRAVE}`, kept: " " },
    {
      name: "TC-048: a non breaking space + cedilla",
      added: String.fromCharCode(0x00a0) + CEDILLA,
      kept: String.fromCharCode(0x00a0),
    },
    { name: "TC-049: a digit + acute", added: `1${ACUTE}`, kept: "1" },
    { name: "TC-049: a sign + 2000 acutes", added: `?${ACUTE.repeat(2_000)}`, kept: "?" },
  ])("$name keeps only the base", ({ added, kept }) => {
    expect(insert("casa", added)).toEqual(accepted(`casa${kept}`));
  });

  test("TC-049: a foreign digit with a mark still does not get in", () => {
    const arabicThree = String.fromCharCode(0x0663);

    expect(insert("casa", arabicThree + ACUTE)).toEqual(accepted("casa"));
  });
});

describe("applyInput: only an exact number key or an emoji passes whole (P-7, round 1)", () => {
  const KEYCAP_SIGN = String.fromCharCode(0x20e3);
  const DOT_REPH = String.fromCharCode(0x0d4e); // a prepend letter of another script
  const ARABIC_NUMBER_SIGN = String.fromCharCode(0x0600); // a prepend invisible
  const HALFWIDTH_VOICED_MARK = String.fromCharCode(0xff9e); // a letter that sticks behind
  const THAI_SARA_AM = String.fromCharCode(0x0e33); // another one
  const SMILE = String.fromCodePoint(0x1f600);
  const SKIN_TONE_THUMB = THUMB_UP + String.fromCodePoint(0x1f3fd);

  test.each(["ç", "α", "ж", "٣", "a"])("TC-045: %s + keycap sign does not get in", (base) => {
    expect(insert("casa", base + KEYCAP_SIGN)).toEqual(accepted("casa"));
    expect(insert("casa", base + VARIATION_SELECTOR + KEYCAP_SIGN)).toEqual(accepted("casa"));
  });

  test.each([
    { written: "c", pasted: CEDILLA + KEYCAP_SIGN },
    { written: "1", pasted: KEYCAP_SIGN },
    { written: "1", pasted: VARIATION_SELECTOR + KEYCAP_SIGN },
  ])("TC-045: what is pasted never changes a written $written", ({ written, pasted }) => {
    expect(insert(written, pasted)).toEqual(accepted(written));
  });

  test.each([
    { name: "TC-045: a prepend letter before an emoji", added: DOT_REPH + SMILE, kept: SMILE },
    { name: "TC-045: a prepend invisible before a flag", added: ARABIC_NUMBER_SIGN + FLAG, kept: FLAG },
    { name: "TC-045: a key with 2000 accents", added: KEYCAP_ONE + ACUTE.repeat(2_000), kept: KEYCAP_ONE },
    { name: "TC-045: a key with a second keycap sign", added: KEYCAP_ONE + KEYCAP_SIGN, kept: KEYCAP_ONE },
    { name: "TC-049: a family with an accent", added: FAMILY + ACUTE, kept: FAMILY },
    { name: "TC-049: a thumb with skin tone and the keycap sign", added: SKIN_TONE_THUMB + KEYCAP_SIGN, kept: SKIN_TONE_THUMB },
    { name: "P-7: a face with a Japanese letter stuck behind", added: SMILE + HALFWIDTH_VOICED_MARK, kept: SMILE },
    { name: "P-7: a face with a Thai letter stuck behind", added: SMILE + THAI_SARA_AM, kept: SMILE },
  ])("$name keeps only what is allowed", ({ added, kept }) => {
    expect(insert("", added)).toEqual(accepted(kept));
  });
});

describe("applyInput: the cursor and what was already written (P-7)", () => {
  test("P-7: rejected input keeps the cursor where it was", () => {
    expect(insert("casa", "ç", 2)).toEqual(accepted("casa", 2));
    expect(insert("casa", "ç", 0)).toEqual(accepted("casa", 0));
  });

  test("P-7: rejected input over a selection keeps the text, with the cursor at its start", () => {
    expect(insert("casa", "ç", 1, 3)).toEqual(accepted("casa", 1));
  });

  test("P-7: deleting is accepted as it is", () => {
    expect(applyInput("casa", "cas", 3)).toEqual(accepted("cas"));
    expect(applyInput("aaa", "aa", 1)).toEqual(accepted("aa", 1));
  });

  test("P-7: typing a letter next to the same letter keeps both", () => {
    expect(insert("aa", "a", 1)).toEqual(accepted("aaa", 2));
  });

  test("P-7: replacing an emoji by one that starts with the same code never splits it", () => {
    expect(insert(THUMB_UP, THUMB_DOWN, 0, THUMB_UP.length)).toEqual(accepted(THUMB_DOWN));
  });
});

describe("textLength: characters as a person sees them (P-8)", () => {
  test.each([
    { name: "the empty text", text: "", length: 0 },
    { name: "TC-032: a + combining acute", text: `a${ACUTE}`, length: 1 },
    { name: "TC-032: canción in two pieces", text: `cancio${ACUTE}n`, length: 7 },
    { name: "TC-039: u + combining diaeresis", text: `u${DIAERESIS}`, length: 1 },
    { name: "TC-039: n + combining tilde", text: `n${TILDE}`, length: 1 },
    { name: "TC-039: pingüino in two pieces", text: `pingu${DIAERESIS}ino`, length: 8 },
    { name: "TC-039: Ñandú in two pieces", text: `N${TILDE}andu${ACUTE}`, length: 5 },
    { name: "spaces, a tab and a line break", text: "a b\tc\n", length: 6 },
    { name: "a family, a flag and a keycap", text: FAMILY + FLAG + KEYCAP_ONE, length: 3 },
  ])("$name has length $length", ({ text, length }) => {
    expect(textLength(text)).toBe(length);
  });
});

describe("applyInput: 100 characters at most (P-8)", () => {
  const a = (times: number) => "a".repeat(times);

  test("P-8: the limit is 100", () => {
    expect(MAX_TEXT_LENGTH).toBe(100);
  });

  test("P-8: the character number 100 gets in and the 101 does not", () => {
    expect(insert(a(99), "b")).toEqual(accepted(`${a(99)}b`));
    expect(insert(a(100), "b")).toEqual(accepted(a(100)));
  });

  test("P-8: pasting too much keeps the beginning of what was pasted", () => {
    expect(insert("", `${a(97)}b7?z`)).toEqual(accepted(`${a(97)}b7?`));
  });

  test("TC-030: pasting xyz in the middle of 98 a keeps xy", () => {
    expect(insert(a(98), "xyz", 49)).toEqual(accepted(`${a(49)}xy${a(49)}`, 51));
  });

  test("TC-030: pasting xyz over 2 selected of 100 keeps xy", () => {
    expect(insert(a(100), "xyz", 10, 12)).toEqual(accepted(`${a(10)}xy${a(88)}`, 12));
  });

  test("P-8: with 100, typing in the middle changes nothing", () => {
    expect(insert(a(100), "c", 50)).toEqual(accepted(a(100), 50));
  });

  test("P-8: an emoji takes one place and is never cut in half", () => {
    expect(insert(a(99), FAMILY + FLAG)).toEqual(accepted(a(99) + FAMILY));
  });

  test("P-8: what the filter rejects takes no place", () => {
    expect(insert("", `${"ç".repeat(10)}${a(99)}${"ß".repeat(10)}bc`)).toEqual(
      accepted(`${a(99)}b`),
    );
  });

  test("P-8: 101 two-piece letters keep 100 whole ones", () => {
    expect(insert("", `a${ACUTE}`.repeat(101))).toEqual(accepted("á".repeat(100)));
  });
});
