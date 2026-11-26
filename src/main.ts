import "./styles.css";
import { countCharacters } from "./counting";

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

// "input" fires on every change: typing, pasting and deleting.
textField.addEventListener("input", () => {
  fitHeightToText(textField);
  showCounts(textField.value);
});
