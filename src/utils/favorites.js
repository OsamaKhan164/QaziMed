// Favorite products: only unique product CODES are stored (never product objects or prices).
// The product catalogue (products.js) stays the single source of truth for everything else.

export const FAVORITES_KEY = "qazi-favorites";

// Turns whatever was saved (possibly missing, damaged or outdated) into a clean list:
// an array of unique, existing product codes, in the order they were saved.
export function sanitizeFavorites(raw, validCodes) {
  if (!Array.isArray(raw)) return [];
  const seen = new Set();
  const clean = [];
  for (const code of raw) {
    if (typeof code !== "string" || !validCodes.has(code) || seen.has(code)) continue;
    seen.add(code);
    clean.push(code);
  }
  return clean;
}

// Adds the code if it is not a favorite yet, removes it if it is. Unknown codes are ignored.
export function toggleFavorite(list, code, validCodes) {
  if (list.includes(code)) return list.filter((c) => c !== code);
  if (!validCodes.has(code)) return list;
  return [...list, code];
}
