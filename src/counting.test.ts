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
