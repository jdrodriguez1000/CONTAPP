import { describe, expect, test } from "vitest";
import { applyInput } from "./inputFilter";

// Combining marks, invisible characters and composed emojis are built from their codes
// (L-002, L-009): in an editor they cannot be told apart.
const GRAVE = String.fromCharCode(0x0300);
const ACUTE = String.fromCharCode(0x0301);
const CIRCUMFLEX = String.fromCharCode(0x0302);
const TILDE = String.fromCharCode(0x0303);
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
