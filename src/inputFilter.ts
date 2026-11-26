export type InputResult = { text: string; cursor: number };

// An emoji comes in whole, with its invisible pieces: pictographs, flags and keycaps.
const EMOJI = /\p{Extended_Pictographic}|\p{Regional_Indicator}|\u{20E3}/u;
// Format characters, controls (but tab and line breaks) and variation selectors.
const INVISIBLE = /(?![\t\n\r])(?:\p{Cc}|\p{Cf}|[\u{FE00}-\u{FE0F}])/gu;
const LETTER = /\p{L}/u;
// One letter and nothing else: a Spanish letter with an extra mark is a foreign one (C-011).
const SPANISH_LETTER = /^[a-zñáéíóúüªº]$/iu;
const STARTS_WITH_MARK = /^\p{M}/u;
const FOREIGN_DIGIT = /(?![0-9])\p{Nd}/u; // C-015

// A grapheme is one character as a person sees it: a whole family emoji is one.
const segmenter = new Intl.Segmenter("es-CO", { granularity: "grapheme" });

function splitGraphemes(text: string): string[] {
  return Array.from(segmenter.segment(text), ({ segment }) => segment);
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

// Only what was just typed or pasted is filtered; the rest was already accepted.
export function applyInput(previousText: string, nextText: string, cursor: number): InputResult {
  const start = findNewStart(previousText, nextText, cursor);
  const added = nextText.slice(start, cursor);
  if (added === "") return { text: nextText, cursor }; // Something was deleted.

  // NFC first: a two-piece letter is judged as the one letter it is (C-014).
  const accepted = splitGraphemes(added.normalize("NFC")).map(filterGrapheme).join("");
  if (accepted === "") return { text: previousText, cursor: start }; // Silent rejection.

  const upToCursor = nextText.slice(0, start) + accepted;
  return { text: upToCursor + nextText.slice(cursor), cursor: upToCursor.length };
}
