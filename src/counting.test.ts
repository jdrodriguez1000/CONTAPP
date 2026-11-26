import { expect, test } from "vitest";
import { countCharacters } from "./counting";

// Two-piece letters (letter + separate mark) look like one-piece letters in an
// editor, so they are built from the code of the mark (L-002).
const ACUTE = String.fromCharCode(0x0301);
const DIAERESIS = String.fromCharCode(0x0308);
const TILDE = String.fromCharCode(0x0303);

test.each([
  { name: "TC-004: canción", text: "canción", vowel: 3, consonant: 4 },
  { name: "TC-005: ÁRBOL", text: "ÁRBOL", vowel: 2, consonant: 3 },
  { name: "TC-005: pingüino", text: "pingüino", vowel: 4, consonant: 4 },
  { name: "TC-005: PINGÜINO", text: "PINGÜINO", vowel: 4, consonant: 4 },
  { name: "TC-006: Ñandú", text: "Ñandú", vowel: 2, consonant: 3 },
  { name: "TC-006: niño", text: "niño", vowel: 2, consonant: 2 },
  { name: "TC-007: y is a consonant", text: "y", vowel: 0, consonant: 1 },
  { name: "TC-007: rey", text: "rey", vowel: 1, consonant: 2 },
  { name: "TC-007: Yo", text: "Yo", vowel: 1, consonant: 1 },
  { name: "TC-008: chorro", text: "chorro", vowel: 2, consonant: 4 },
  { name: "TC-008: llave", text: "llave", vowel: 2, consonant: 3 },
  { name: "TC-009: ana", text: "ana", vowel: 2, consonant: 1 },
  { name: "TC-009: ANA", text: "ANA", vowel: 2, consonant: 1 },
  { name: "TC-009: Ana", text: "Ana", vowel: 2, consonant: 1 },
  { name: "TC-032: a + combining acute", text: `a${ACUTE}`, vowel: 1, consonant: 0 },
  { name: "TC-032: canción in two pieces", text: `cancio${ACUTE}n`, vowel: 3, consonant: 4 },
  { name: "TC-039: u + combining diaeresis", text: `u${DIAERESIS}`, vowel: 1, consonant: 0 },
  { name: "TC-039: n + combining tilde", text: `n${TILDE}`, vowel: 0, consonant: 1 },
  { name: "TC-039: pingüino in two pieces", text: `pingu${DIAERESIS}ino`, vowel: 4, consonant: 4 },
  { name: "TC-039: Ñandú in two pieces", text: `N${TILDE}andú`, vowel: 2, consonant: 3 },
])("$name has $vowel vowels and $consonant consonants", ({ text, vowel, consonant }) => {
  const counts = countCharacters(text);

  expect(counts).toEqual({ vowel, consonant, digit: 0, other: 0 });
});

// Emojis made of several pieces and spaces that look like a normal one are also
// built from their codes.
const GRINNING_FACE = String.fromCodePoint(0x1f600);
const FAMILY = String.fromCodePoint(0x1f468, 0x200d, 0x1f469, 0x200d, 0x1f467);
const FLAG_COLOMBIA = String.fromCodePoint(0x1f1e8, 0x1f1f4);
const KEYCAP_ONE = String.fromCharCode(0x0031, 0xfe0f, 0x20e3);
const NO_BREAK_SPACE = String.fromCharCode(0x00a0);
// Loose accents: acute (U+00B4), diaeresis (U+00A8), grave and circumflex.
const LOOSE_ACCENTS = `${String.fromCharCode(0x00b4, 0x00a8)}\`^`;

test.each([
  { name: "TC-010: 0", text: "0", counts: [0, 0, 1, 0] },
  { name: "TC-010: 2026", text: "2026", counts: [0, 0, 4, 0] },
  { name: "TC-010: a1b2", text: "a1b2", counts: [1, 1, 2, 0] },
  { name: "TC-011: ¡Hola!", text: "¡Hola!", counts: [2, 2, 0, 2] },
  { name: "TC-011: signs", text: "¿?,.@#", counts: [0, 0, 0, 6] },
  { name: "TC-012: emoji", text: GRINNING_FACE, counts: [0, 0, 0, 1] },
  { name: "TC-012: family emoji", text: FAMILY, counts: [0, 0, 0, 1] },
  { name: "TC-012: flag emoji", text: FLAG_COLOMBIA, counts: [0, 0, 0, 1] },
  { name: "TC-013: extra spaces", text: "  la  casa  ", counts: [3, 3, 0, 0] },
  { name: "TC-013: tab and line break", text: "la\tcasa\nazul", counts: [5, 5, 0, 0] },
  { name: "TC-014: empty text", text: "", counts: [0, 0, 0, 0] },
  { name: "TC-014: only spaces", text: "   ", counts: [0, 0, 0, 0] },
  { name: "TC-015: ¡Hola, 2026! and an emoji", text: `¡Hola, 2026! ${GRINNING_FACE}`, counts: [2, 2, 4, 4] },
  { name: "TC-034: keycap 1", text: KEYCAP_ONE, counts: [0, 0, 0, 1] },
  { name: "TC-034: superscript, half and ordinals", text: "²½ªº", counts: [0, 0, 0, 4] },
  { name: "TC-034: 1º", text: "1º", counts: [0, 0, 1, 1] },
  { name: "TC-035: loose accents", text: LOOSE_ACCENTS, counts: [0, 0, 0, 4] },
  { name: "TC-037: no-break space", text: `la${NO_BREAK_SPACE}casa`, counts: [3, 3, 0, 0] },
])("$name gives vowel/consonant/digit/other $counts", ({ text, counts }) => {
  const [vowel, consonant, digit, other] = counts;

  const result = countCharacters(text);

  expect(result).toEqual({ vowel, consonant, digit, other });
});

test.each([
  { name: "TC-012: three emojis", text: `${GRINNING_FACE}${FAMILY}${FLAG_COLOMBIA}`, total: 3 },
  { name: "TC-015: ¡Hola, 2026! and an emoji", text: `¡Hola, 2026! ${GRINNING_FACE}`, total: 12 },
])("$name: the 4 groups add up to $total characters", ({ text, total }) => {
  const { vowel, consonant, digit, other } = countCharacters(text);

  expect(vowel + consonant + digit + other).toBe(total);
});
