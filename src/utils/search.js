// Product search and filtering.

const normalize = (text) => String(text || "").toLowerCase().replace(/\s+/g, " ").trim();

// searchBy: "all" (name or code), "name", or "code".
export function filterProducts(products, { category = "All", query = "", searchBy = "all" } = {}) {
  const words = normalize(query).split(" ").filter(Boolean);
  return products.filter((p) => {
    if (category !== "All" && p.category !== category) return false;
    if (words.length === 0) return true;
    const name = normalize(p.name);
    const code = normalize(p.productCode);
    const haystack = searchBy === "name" ? name : searchBy === "code" ? code : `${name} ${code}`;
    return words.every((w) => haystack.includes(w));
  });
}

export function countByCategory(products) {
  const counts = {};
  for (const p of products) counts[p.category] = (counts[p.category] || 0) + 1;
  return counts;
}

// Autocomplete: products whose name or code contains every typed word.
// Names that START with the typed text come first, then the rest in list order.
export function suggestProducts(products, query, limit = 8) {
  const q = normalize(query);
  if (!q) return [];
  const matches = filterProducts(products, { query });
  const starts = [];
  const others = [];
  for (const p of matches) {
    (normalize(p.name).startsWith(q) || normalize(p.productCode).startsWith(q) ? starts : others).push(p);
  }
  return [...starts, ...others].slice(0, limit);
}
