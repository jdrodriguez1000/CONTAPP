export type InputResult = { text: string; cursor: number };

export function applyInput(_previousText: string, nextText: string, cursor: number): InputResult {
  return { text: nextText, cursor };
}
