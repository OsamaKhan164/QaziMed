// Smoothly scrolls to the element with the given id (used by nav links and buttons).
export function scrollToId(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}
