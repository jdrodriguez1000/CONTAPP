export const MAX_TEXT_LENGTH = 100; // A-001

export type InputResult = { text: string; cursor: number };

// An emoji comes in whole, with its invisible pieces: pictographs, flags and keycaps.
const EMOJI = /\p{Extended_Pictographic}|\p{Regional_Indicator}|\u{20E3}/u;
// Format characters, controls (but tab and line breaks) and variation selectors.
const INVISIBLE = /(?![\t\n\r])(?:\p{Cc}|\p{Cf}|[\u{FE00}-\u{FE0F}])/gu;
const LETTER = /\p{L}/u;
// One letter and nothing else: a Spanish letter with an extra mark is a foreign one (C-011).
// Capitals are listed one by one: ignoring case would also let in the long s (it folds to "s").
const SPANISH_LETTER = /^[a-zA-ZñÑáéíóúüÁÉÍÓÚÜªº]$/u;
const STARTS_WITH_MARK = /^\p{M}/u;
const FOREIGN_DIGIT = /(?![0-9])\p{Nd}/u; // C-015

// A grapheme is one character as a person sees it: a whole family emoji is one.
const segmenter = new Intl.Segmenter("es-CO", { granularity: "grapheme" });

function splitGraphemes(text: string): string[] {
  return Array.from(segmenter.segment(text), ({ segment }) => segment);
}

// Spaces, tabs and line breaks do take a place; an emoji takes 1.
export function textLength(text: string): number {
  return splitGraphemes(text.normalize("NFC")).length;
}

function isAllowed(character: string): boolean {
  if (LETTER.test(character)) return SPANISH_LETTER.test(character);
  return !STARTS_WITH_MARK.test(character) && !FOREIGN_DIGIT.test(character);
}

// What gets in from one character: all of it, a clean version or nothing ("").
function filterGrapheme(grapheme: string): string {
  if (EMOJI.test(grapheme)) return grapheme;
  // NFC again: without the invisible, a letter and its mark can join (C-014).
  const visible = grapheme.replace(INVISIBLE, "").normalize("NFC");
  return isAllowed(visible) ? visible : "";
}

// Where the new part starts: what did not change before the cursor, moved back to the
// edge of a whole character of the previous text (never half an emoji).
function findNewStart(previousText: string, nextText: string, cursor: number): number {
  const lengthAfter = nextText.length - cursor;
  const limit = Math.min(cursor, previousText.length - lengthAfter);
  let start = 0;
  for (const { segment } of segmenter.segment(previousText)) {
    const end = start + segment.length;
    if (end > limit || nextText.slice(start, end) !== segment) break;
    start = end;
  }
  return start;
}

// The beginning of the new characters that fits between `before` and `after` (D-007).
function takeWhileItFits(characters: string[], before: string, after: string): string {
  let taken = "";
  for (const character of characters) {
    if (textLength(before + taken + character + after) > MAX_TEXT_LENGTH) break;
    taken += character;
  }
  return taken;
}

// Only what was just typed or pasted is filtered; the rest was already accepted.
export function applyInput(previousText: string, nextText: string, cursor: number): InputResult {
  const start = findNewStart(previousText, nextText, cursor);
  const added = nextText.slice(start, cursor);
  if (added === "") return { text: nextText, cursor }; // Something was deleted.

  const before = nextText.slice(0, start);
  const after = nextText.slice(cursor);
  // NFC first: a two-piece letter is judged as the one letter it is (C-014).
  const allowed = splitGraphemes(added.normalize("NFC")).map(filterGrapheme).filter(Boolean);
  const accepted = takeWhileItFits(allowed, before, after);
  if (accepted === "") return { text: previousText, cursor: start }; // Silent rejection.

  return { text: before + accepted + after, cursor: before.length + accepted.length };
}
