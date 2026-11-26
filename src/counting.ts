export type CharacterGroup = "vowel" | "consonant" | "digit" | "other";
export type CharacterCounts = Record<CharacterGroup, number>;

// Spanish letters in lower case (C-001 to C-003).
const VOWELS = "aeiouáéíóúü";
const CONSONANTS = "bcdfghjklmnñpqrstvwxyz";

export function countCharacters(text: string): CharacterCounts {
  const counts: CharacterCounts = { vowel: 0, consonant: 0, digit: 0, other: 0 };
  // NFC joins a two-piece letter (letter + mark) into one piece (C-014).
  for (const character of text.normalize("NFC").toLowerCase()) {
    if (VOWELS.includes(character)) counts.vowel += 1;
    else if (CONSONANTS.includes(character)) counts.consonant += 1;
  }
  return counts;
}
