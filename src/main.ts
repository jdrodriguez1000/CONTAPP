import "./styles.css";
import { countCharacters } from "./counting";
import { applyInput } from "./inputFilter";

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

function filterChange() {
  const { text, cursor } = applyInput(acceptedText, textField.value, textField.selectionEnd);
  // The field is only rewritten when something did not get in, so the cursor is not moved.
  if (text !== textField.value) {
    textField.value = text;
    textField.setSelectionRange(cursor, cursor);
  }
  acceptedText = text;
  refreshScreen();
}

// "input" fires on every change: typing, pasting and deleting.
textField.addEventListener("input", (event) => {
  // While the keyboard is still composing a letter, filtering would cut it in half.
  if ((event as InputEvent).isComposing) refreshScreen();
  else filterChange();
});
textField.addEventListener("compositionend", filterChange);
