import "./styles.css";
import { countCharacters } from "./counting";
import { applyInput, type InputResult } from "./inputFilter";

const textField = document.querySelector<HTMLTextAreaElement>("#text-field")!;

// "auto" goes back to 2 lines (rows="2"); max-height in the CSS stops it at 5 lines.
function fitHeightToText(field: HTMLTextAreaElement) {
  field.style.height = "auto";
  const borders = field.offsetHeight - field.clientHeight;
  field.style.height = `${field.scrollHeight + borders}px`;
}

// Each card shows its number in the element named after its group.
function showCounts(text: string) {
  for (const [group, count] of Object.entries(countCharacters(text))) {
    document.querySelector(`[data-testid="count-${group}"]`)!.textContent = String(count);
  }
}

function refreshScreen() {
  fitHeightToText(textField);
  showCounts(textField.value);
}

// The last text that went through the filter: what is new is compared against it.
let acceptedText = textField.value;

// Once the app has rewritten the field, the browser's undo history no longer matches it:
// replaying it repeats text.
let isHistoryStale = false;

// What was selected in the accepted text just before a change: that is what gets replaced.
let selected = { start: 0, end: 0 };

textField.addEventListener("beforeinput", () => {
  // While a letter is being composed the field is ahead of the accepted text: keep what we had.
  if (textField.value !== acceptedText) return;
  selected = { start: textField.selectionStart, end: textField.selectionEnd };
});

// Pasting "aç" over "as" looks the same as typing "ç" over "s". Knowing what was selected,
// the new text is compared with the accepted text without that part.
function applyChange(nextText: string, cursor: number): InputResult {
  const { start, end } = selected;
  const head = acceptedText.slice(0, start);
  const tail = acceptedText.slice(end);
  const replacesSelection =
    start < end && cursor > start && nextText.startsWith(head) && nextText.slice(cursor) === tail;
  if (!replacesSelection) return applyInput(acceptedText, nextText, cursor);

  const rest = head + tail;
  const result = applyInput(rest, nextText, cursor);
  // Nothing got in: the selected part stays (silent rejection).
  return result.text === rest ? { text: acceptedText, cursor: start } : result;
}

function filterChange() {
  const { text, cursor } = applyChange(textField.value, textField.selectionEnd);
  selected = { start: 0, end: 0 };
  // The field is rewritten only when the accepted text differs from it: something did not get in,
  // or a letter that came in two pieces was joined into one (NFC). That is what makes undo stale (DT-003).
  if (text !== textField.value) {
    textField.value = text;
    textField.setSelectionRange(cursor, cursor);
    isHistoryStale = true;
  }
  acceptedText = text;
  refreshScreen();
}

// Undo and redo ("historyUndo", "historyRedo") of a stale history change nothing.
function undoStaleHistory() {
  textField.value = acceptedText;
  refreshScreen();
}

// "input" fires on every change: typing, pasting and deleting.
textField.addEventListener("input", (event) => {
  const { isComposing, inputType } = event as InputEvent;
  if (isHistoryStale && inputType.startsWith("history")) undoStaleHistory();
  // While the keyboard is still composing a letter, filtering would cut it in half.
  else if (isComposing) refreshScreen();
  else filterChange();
});
textField.addEventListener("compositionend", filterChange);

// Coming back with "back", the browser can put the old text back: start empty (D-017).
window.addEventListener("pageshow", () => {
  textField.value = "";
  acceptedText = "";
  refreshScreen();
});
