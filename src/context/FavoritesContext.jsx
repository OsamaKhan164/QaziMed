import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { products } from "../data/products.js";
import { FAVORITES_KEY, sanitizeFavorites, toggleFavorite } from "../utils/favorites.js";

// Favorites are saved in the browser's Local Storage (frontend only - no server, no account) as a
// list of product codes. They are completely separate from the cart, which lives in memory only.
const productMap = new Map(products.map((p) => [p.productCode, p]));
const validCodes = new Set(productMap.keys());
const FavoritesContext = createContext(null);

function load() {
  try {
    return sanitizeFavorites(JSON.parse(window.localStorage.getItem(FAVORITES_KEY)), validCodes);
  } catch {
    return []; // storage blocked, missing or holding damaged data
  }
}

export function FavoritesProvider({ children }) {
  const [codes, setCodes] = useState(load);

  // Save whenever the list changes (this also rewrites a cleaned list if invalid codes were found).
  useEffect(() => {
    try {
      // nothing saved yet and nothing to save: leave storage untouched
      if (codes.length === 0 && window.localStorage.getItem(FAVORITES_KEY) === null) return;
      window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(codes));
    } catch {
      /* storage unavailable (e.g. private mode): favorites still work until the page is closed */
    }
  }, [codes]);

  // Keep several open tabs in step.
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === FAVORITES_KEY || e.key === null) setCodes(load());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const toggle = useCallback((code) => setCodes((list) => toggleFavorite(list, code, validCodes)), []);

  const value = useMemo(() => {
    const set = new Set(codes);
    return {
      favoriteProducts: codes.map((c) => productMap.get(c)), // always read from the catalogue
      count: codes.length,
      isFavorite: (code) => set.has(code),
      toggle,
    };
  }, [codes, toggle]);

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used inside <FavoritesProvider>");
  return ctx;
}
