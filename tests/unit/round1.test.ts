// Acceptance unit tests, round 1 (F-001 TC-045 to TC-049; plan VS-001 §5.2; D-018).
import { describe, expect, test } from "vitest";
import { countCharacters } from "../../src/counting";
import { applyInput, textLength } from "../../src/inputFilter";

// Marks, invisible characters and foreign letters are built from their codes (L-002, L-009).
const cp = (...codes: number[]) => String.fromCodePoint(...codes);

const GRAVE = cp(0x0300);
const ACUTE = cp(0x0301);
const CEDILLA_MARK = cp(0x0327);
const KEYCAP = cp(0x20e3);
const VS16 = cp(0xfe0f);
const ZERO_WIDTH_JOINER = cp(0x200d);
const NO_BREAK_SPACE = cp(0x00a0);
const LONG_S = cp(0x017f);
const C_CEDILLA = cp(0x00e7);
const A_ACUTE = cp(0x00e1);
const ARABIC_THREE = cp(0x0663);
const DOT_REPH = cp(0x0d4e); // prepend, a letter of another script
const ARABIC_NUMBER_SIGN = cp(0x0600); // prepend, invisible format character
const SMILE = cp(0x1f600);
const FAMILY = [0x1f468, 0x1f469, 0x1f467].map((code) => cp(code)).join(ZERO_WIDTH_JOINER);
const FLAG = cp(0x1f1e8, 0x1f1f4);

// Pastes `clip` over [from, to) of an accepted text, as the field would report it.
function pasteInto(previous: string, clip: string, from = previous.length, to = from) {
  const next = previous.slice(0, from) + clip + previous.slice(to);
  return applyInput(previous, next, from + clip.length);
}

// Counts are written as "vowel/consonant/digit/other".
function countsOf(text: string) {
  const counts = countCharacters(text);
  return `${counts.vowel}/${counts.consonant}/${counts.digit}/${counts.other}`;
}

// Exact accepted text, cursor and counts. For a rejection, "text" is the previous text.
function expectAccepted(
  result: { text: string; cursor: number },
  text: string,
  counts: string,
  cursor = text.length,
) {
  expect(result).toEqual({ text, cursor });
  expect(countsOf(result.text)).toBe(counts);
}

describe("TC-045 — keycap sign U+20E3: only the exact number key passes whole (C-011, C-015)", () => {
  test.each([
    ["c with cedilla", C_CEDILLA],
    ["greek alpha", cp(0x03b1)],
    ["cyrillic zhe", cp(0x0436)],
    ["arabic-indic three", ARABIC_THREE],
    ["two-piece a grave", "a" + GRAVE],
    // D-018: a letter with a mark left over does not get in.
    ["the Spanish letter a", "a"],
  ])("TC-045 — %s + U+20E3 does not get in, with or without U+FE0F", (_name, base) => {
    for (const clip of [base + KEYCAP, base + VS16 + KEYCAP]) {
      expectAccepted(pasteInto("", clip), "", "0/0/0/0");
      expectAccepted(pasteInto("casa", clip), "casa", "2/2/0/0");
    }
  });

  test("TC-045 — in a mixed paste only the foreign letter with U+20E3 is dropped (C-016)", () => {
    expectAccepted(pasteInto("", "a" + C_CEDILLA + KEYCAP + "b"), "ab", "1/1/0/0");
  });

  test('TC-045 — with "c" written, pasting U+0327 + U+20E3 leaves "c"', () => {
    expectAccepted(pasteInto("c", CEDILLA_MARK + KEYCAP), "c", "0/1/0/0");
  });

  test('TC-045 — with "1" written, pasting U+20E3 alone leaves "1", still a number', () => {
    expectAccepted(pasteInto("1", KEYCAP), "1", "0/0/1/0");
  });

  test.each([
    ["a question mark", "?" + KEYCAP, "?", "0/0/0/1"],
    ["a space", " " + KEYCAP, " ", "0/0/0/0"],
  ])("TC-045 — anywhere else U+20E3 is a combining mark: on %s only the base gets in", (_n, clip, text, counts) => {
    expectAccepted(pasteInto("", clip), text, counts);
  });

  // Marks stuck behind a number key are dropped and the key gets in intact (plan §5.2, D-018).
  const KEY_ONE = "1" + VS16 + KEYCAP;
  test.each([
    ["an accent", KEY_ONE + ACUTE, KEY_ONE],
    ["2000 accents", KEY_ONE + ACUTE.repeat(2_000), KEY_ONE],
    ["a second U+20E3", KEY_ONE + KEYCAP, KEY_ONE],
    ["a second U+20E3 (key without U+FE0F)", "1" + KEYCAP + KEYCAP, "1" + KEYCAP],
    ["a cedilla and a grave", KEY_ONE + CEDILLA_MARK + GRAVE, KEY_ONE],
  ])("TC-045 — a number key followed by %s gets in intact, without the extra", (_n, clip, key) => {
    const result = pasteInto("", clip);
    expectAccepted(result, key, "0/0/0/1");
    expect(textLength(result.text)).toBe(1);
    expectAccepted(pasteInto("casa", clip), "casa" + key, "2/2/0/1");
  });

  test("TC-045 — control: an accent pasted after a written number key does not stick to it", () => {
    expectAccepted(pasteInto(KEY_ONE, ACUTE), KEY_ONE, "0/0/0/1");
  });

  // What is pasted never turns what was already written into a key (plan §5.2, C-015).
  test.each(["1", "#", "*"])(
    "TC-045 — with %s written, pasting U+FE0F + U+20E3 does not turn it into a key",
    (written) => {
      const counts = written === "1" ? "0/0/1/0" : "0/0/0/1";
      expectAccepted(pasteInto(written, VS16 + KEYCAP), written, counts);
    },
  );

  test.each([
    ["1 with U+FE0F", "1" + VS16 + KEYCAP],
    ["1 without U+FE0F", "1" + KEYCAP],
    ["0", "0" + VS16 + KEYCAP],
    ["9", "9" + VS16 + KEYCAP],
    ["#", "#" + VS16 + KEYCAP],
    ["*", "*" + VS16 + KEYCAP],
  ])("TC-045 — control: the number key %s still gets in as 1 other (CA-10)", (_name, key) => {
    expectAccepted(pasteInto("", key), key, "0/0/0/1");
  });
});

describe("TC-045 — a prepend character before an emoji does not ride in with it", () => {
  for (const [prefixName, prefix] of [
    ["U+0D4E", DOT_REPH],
    ["U+0600", ARABIC_NUMBER_SIGN],
  ]) {
    test.each([
      ["a face", SMILE],
      ["a family", FAMILY],
      ["a flag", FLAG],
    ])(`TC-045 — ${prefixName} before %s: only the emoji gets in`, (_name, emoji) => {
      expectAccepted(pasteInto("", prefix + emoji), emoji, "0/0/0/1");
      expectAccepted(pasteInto("casa", prefix + emoji), "casa" + emoji, "2/2/0/1");
    });
  }

  test("TC-045 — control: a face, a family and a flag still get in whole", () => {
    for (const emoji of [SMILE, FAMILY, FLAG]) {
      expectAccepted(pasteInto("", emoji), emoji, "0/0/0/1");
    }
  });
});

describe("TC-046 — the long s, U+017F, is not a Spanish letter (C-011, C-016)", () => {
  test('TC-046 — typing it into "casa" is rejected', () => {
    expectAccepted(pasteInto("casa", LONG_S), "casa", "2/2/0/0");
  });

  test('TC-046 — pasting "casa" written with a long s keeps "caa"', () => {
    expectAccepted(pasteInto("", "ca" + LONG_S + "a"), "caa", "2/1/0/0");
  });

  test.each([
    ["long s with a dot above", LONG_S + cp(0x0307)],
    ["capital I with a dot", cp(0x0130)],
    ["dotless i", cp(0x0131)],
  ])("TC-046 — control, edge: %s does not get in either", (_name, letter) => {
    expectAccepted(pasteInto("casa", letter), "casa", "2/2/0/0");
  });
});

describe("TC-047 — pasting over a selection something that starts like it (C-016)", () => {
  test.each([
    ['"as" in "casa" ← a + c cedilla', "casa", 1, 3, "a" + C_CEDILLA, "caa", 2, "2/1/0/0"],
    ['all of "casa" ← ca + c cedilla', "casa", 0, 4, "ca" + C_CEDILLA, "ca", 2, "1/1/0/0"],
    ['all of "banana" ← ban + foreign digit', "banana", 0, 6, "ban" + ARABIC_THREE, "ban", 3, "1/2/0/0"],
    [
      "100 letters ← 10 of them + c cedilla",
      "a".repeat(100),
      0,
      100,
      "a".repeat(10) + C_CEDILLA,
      "a".repeat(10),
      10,
      "10/0/0/0",
    ],
  ])("TC-047 — %s", (_name, previous, from, to, clip, text, cursor, counts) => {
    expectAccepted(pasteInto(previous, clip, from, to), text, counts, cursor);
  });
});

describe("TC-048 — a combining mark pasted with a blank: the blank gets in (CA-11, D-018)", () => {
  test.each([
    ["a space + U+0300", " ", GRAVE],
    ["a space + U+0327", " ", CEDILLA_MARK],
    ["a no-break space + U+0300", NO_BREAK_SPACE, GRAVE],
    // After a tab or a line break the mark is a piece of its own, already rejected: controls.
    ["control: a tab + U+0300", "\t", GRAVE],
    ["control: a line break + U+0300", "\n", GRAVE],
    ["a space + three marks", " ", GRAVE + GRAVE + CEDILLA_MARK],
  ])("TC-048 — %s", (_name, blank, marks) => {
    expectAccepted(pasteInto("casa", blank + marks), "casa" + blank, "2/2/0/0");
  });
});

describe("TC-049 — marks on something that is not a letter do not get in (CA-11, D-018, A-001)", () => {
  test('TC-049 — "1" + U+0301 pastes as "1", 1 number', () => {
    expectAccepted(pasteInto("", "1" + ACUTE), "1", "0/0/1/0");
  });

  test('TC-049 — "?" + 2000 marks pastes as "?", 1 other of length 1', () => {
    const result = pasteInto("", "?" + ACUTE.repeat(2_000));
    expectAccepted(result, "?", "0/0/0/1");
    expect(textLength(result.text)).toBe(1);
  });

  test('TC-049 — edge: 100 times "?" + 2000 marks leaves 100 bare signs and nothing else', () => {
    const result = pasteInto("", ("?" + ACUTE.repeat(2_000)).repeat(100));
    expectAccepted(result, "?".repeat(100), "0/0/0/100");
    expect(textLength(result.text)).toBe(100);
  });

  // Marks stuck behind an emoji are dropped; the emoji keeps its own pieces (plan §5.2, D-018).
  const THUMB_WITH_SKIN_TONE = cp(0x1f44d, 0x1f3fd);
  const RED_HEART = cp(0x2764) + VS16;
  test.each([
    ["a face + 1 accent", SMILE, ACUTE],
    ["a face + 2000 accents", SMILE, ACUTE.repeat(2_000)],
    ["a face + U+20E3", SMILE, KEYCAP],
    ["a family + 1 accent", FAMILY, ACUTE],
    ["a flag + 1 accent", FLAG, ACUTE],
    ["a thumb with skin tone + 1 accent", THUMB_WITH_SKIN_TONE, ACUTE],
    ["a heart with U+FE0F + 1 accent", RED_HEART, ACUTE],
  ])("TC-049 — %s: the emoji gets in intact, without the mark", (_name, emoji, marks) => {
    const result = pasteInto("", emoji + marks);
    expectAccepted(result, emoji, "0/0/0/1");
    expect(textLength(result.text)).toBe(1);
    expectAccepted(pasteInto("casa", emoji + marks), "casa" + emoji, "2/2/0/1");
  });

  test("TC-049 — in a mixed paste, only the mark behind the emoji is dropped (C-016)", () => {
    expectAccepted(pasteInto("", "a" + SMILE + ACUTE + "b"), "a" + SMILE + "b", "1/1/0/1");
  });

  test("TC-049 — control: marks pasted after a written emoji do not stick to it", () => {
    for (const marks of [ACUTE, ACUTE.repeat(2_000)]) {
      expectAccepted(pasteInto(SMILE, marks), SMILE, "0/0/0/1");
    }
  });

  test.each([
    ["1", "0/0/1/0"],
    ["?", "0/0/0/1"],
    [" ", "0/0/0/0"],
  ])("TC-049 — control, edge: marks pasted after a written %j do not stick to it", (written, counts) => {
    for (const marks of [ACUTE, ACUTE.repeat(2_000)]) {
      expectAccepted(pasteInto(written, marks), written, counts);
    }
  });

  test.each([
    ["two acute accents", "a" + ACUTE + ACUTE],
    ["a Spanish accent and a grave", "a" + ACUTE + GRAVE],
  ])("TC-049 — control, edge: a letter with %s is not a Spanish letter, nothing gets in (C-014)", (_n, clip) => {
    expectAccepted(pasteInto("casa", clip), "casa", "2/2/0/0");
  });

  test('TC-049 — control: "a" + U+0301 still gets in as the one-piece letter', () => {
    const result = pasteInto("", "a" + ACUTE);
    expectAccepted(result, A_ACUTE, "1/0/0/0");
    expect(textLength(result.text)).toBe(1);
  });
});
