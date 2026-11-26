// Acceptance unit tests for countCharacters (plan VS-001 §5.2), step P-4: letters only.
import { describe, expect, test } from "vitest";
import { countCharacters } from "../../src/counting";

type Case = { name: string; text: string; vowel: number; consonant: number };

// Two-piece letters are built from the code of the separate mark on purpose (L-002):
// in an editor they look the same as the one-piece letters.
const ACUTE = String.fromCharCode(0x0301);
const DIAERESIS = String.fromCharCode(0x0308);
const TILDE = String.fromCharCode(0x0303);

const cases: Case[] = [
  { name: "TC-004 — canción", text: "canción", vowel: 3, consonant: 4 },
  { name: "TC-005 — ÁRBOL", text: "ÁRBOL", vowel: 2, consonant: 3 },
  { name: "TC-005 — pingüino", text: "pingüino", vowel: 4, consonant: 4 },
  { name: "TC-005 — PINGÜINO", text: "PINGÜINO", vowel: 4, consonant: 4 },
  {
    name: "TC-005 — todas las vocales, con tilde y ü, en minúscula y mayúscula (C-001)",
    text: "aeiouáéíóúüAEIOUÁÉÍÓÚÜ",
    vowel: 22,
    consonant: 0,
  },
  { name: "TC-006 — Ñandú", text: "Ñandú", vowel: 2, consonant: 3 },
  { name: "TC-006 — niño", text: "niño", vowel: 2, consonant: 2 },
  { name: "TC-007 — y", text: "y", vowel: 0, consonant: 1 },
  { name: "TC-007 — Y", text: "Y", vowel: 0, consonant: 1 },
  { name: "TC-007 — rey", text: "rey", vowel: 1, consonant: 2 },
  { name: "TC-007 — Yo", text: "Yo", vowel: 1, consonant: 1 },
  { name: "TC-008 — chorro", text: "chorro", vowel: 2, consonant: 4 },
  { name: "TC-008 — llave", text: "llave", vowel: 2, consonant: 3 },
  {
    name: "TC-009 — todas las consonantes, en minúscula y mayúscula (C-002, C-003, C-005)",
    text: "bcdfghjklmnñpqrstvwxyzBCDFGHJKLMNÑPQRSTVWXYZ",
    vowel: 0,
    consonant: 44,
  },
  { name: "TC-009 — ana", text: "ana", vowel: 2, consonant: 1 },
  { name: "TC-009 — ANA", text: "ANA", vowel: 2, consonant: 1 },
  { name: "TC-009 — Ana", text: "Ana", vowel: 2, consonant: 1 },
  { name: "TC-032 — a + tilde aparte", text: `a${ACUTE}`, vowel: 1, consonant: 0 },
  {
    name: "TC-032 — canción con la ó en dos piezas",
    text: `cancio${ACUTE}n`,
    vowel: 3,
    consonant: 4,
  },
  {
    name: "TC-032 — las demás vocales con tilde en dos piezas, minúscula y mayúscula (C-014)",
    text: [..."aeiouAEIOU"].map((letter) => letter + ACUTE).join(""),
    vowel: 10,
    consonant: 0,
  },
  { name: "TC-039 — u + diéresis aparte", text: `u${DIAERESIS}`, vowel: 1, consonant: 0 },
  { name: "TC-039 — U + diéresis aparte", text: `U${DIAERESIS}`, vowel: 1, consonant: 0 },
  { name: "TC-039 — n + virgulilla aparte", text: `n${TILDE}`, vowel: 0, consonant: 1 },
  {
    name: "TC-039 — pingüino con la ü en dos piezas",
    text: `pingu${DIAERESIS}ino`,
    vowel: 4,
    consonant: 4,
  },
  {
    name: "TC-039 — Ñandú con la Ñ en dos piezas",
    text: `N${TILDE}andú`,
    vowel: 2,
    consonant: 3,
  },
];

describe("countCharacters: vowels and consonants", () => {
  for (const { name, text, vowel, consonant } of cases) {
    test(name, () => {
      expect(countCharacters(text)).toEqual({ vowel, consonant, digit: 0, other: 0 });
    });
  }
});
