import "./styles.css";

const textField = document.querySelector<HTMLTextAreaElement>("#text-field")!;

// "auto" goes back to 2 lines (rows="2"); max-height in the CSS stops it at 5 lines.
function fitHeightToText(field: HTMLTextAreaElement) {
  field.style.height = "auto";
  const borders = field.offsetHeight - field.clientHeight;
  field.style.height = `${field.scrollHeight + borders}px`;
}

textField.addEventListener("input", () => fitHeightToText(textField));
