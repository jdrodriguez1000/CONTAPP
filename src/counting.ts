export type CharacterGroup = "vowel" | "consonant" | "digit" | "other";
export type CharacterCounts = Record<CharacterGroup, number>;

// Spanish letters in lower case (C-001 to C-003).
const VOWELS = "aeiouáéíóúü";
const CONSONANTS = "bcdfghjklmnñpqrstvwxyz";

const DIGIT = /^[0-9]$/;
const ONLY_WHITE_SPACE = /^\p{White_Space}+$/u;

// A grapheme is one character as a person sees it: a whole family emoji is one.
const graphemes = new Intl.Segmenter("es-CO", { granularity: "grapheme" });

function classify(character: string): CharacterGroup {
  if (VOWELS.includes(character)) return "vowel";
  if (CONSONANTS.includes(character)) return "consonant";
  if (DIGIT.test(character)) return "digit";
  return "other";
}

export function countCharacters(text: string): CharacterCounts {
  const counts: CharacterCounts = { vowel: 0, consonant: 0, digit: 0, other: 0 };
  // NFC joins a two-piece letter (letter + mark) into one piece (C-014).
  for (const { segment } of graphemes.segment(text.normalize("NFC"))) {
    if (ONLY_WHITE_SPACE.test(segment)) continue; // Spaces are not counted (C-008).
    counts[classify(segment.toLowerCase())] += 1;
  }
  return counts;
}
