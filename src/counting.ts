export type CharacterGroup = "vowel" | "consonant" | "digit" | "other";
export type CharacterCounts = Record<CharacterGroup, number>;

export function countCharacters(text: string): CharacterCounts {
  void text;
  return { vowel: 0, consonant: 0, digit: 0, other: 0 };
}
