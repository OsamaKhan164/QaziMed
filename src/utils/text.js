// Capitalizes the first letter of every word ("qazi medicine company" -> "Qazi Medicine Company").
// Only the first letter of each whitespace-separated word is touched: the rest of the word, spaces,
// digits and symbols stay exactly as typed, so text can still be edited normally.
export function capitalizeWords(text) {
  return String(text ?? "").replace(/(^|\s)(\S)/gu, (_, space, letter) => space + letter.toLocaleUpperCase("en-US"));
}

// Applies capitalizeWords to a text <input>/<textarea> while the customer types or pastes.
// The DOM value is fixed in place and the caret restored, so typing in the middle of the text
// does not make the caret jump to the end. Returns the final text.
export function capitalizeFromInput(el) {
  const raw = el.value;
  const next = capitalizeWords(raw);
  if (next !== raw) {
    const { selectionStart: start, selectionEnd: end } = el;
    el.value = next; // same length, only letter case changed
    try { el.setSelectionRange(start, end); } catch { /* some input types do not support selection */ }
  }
  return next;
}
