import { createContext, useContext, useMemo, useState, useCallback } from "react";
import { products } from "../data/products.js";
import { addToCart, setQuantity, removeFromCart, summarizeCart, isInStock } from "../utils/cart.js";

// The cart lives only in React state (memory). It is NOT saved to localStorage,
// sessionStorage, cookies or any database, so refreshing the page empties it.
const productMap = new Map(products.map((p) => [p.productCode, p]));
const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // Out-of-stock products can never be added, whichever button or control asks for it.
  const add = useCallback((code, qty = 1) => {
    if (!isInStock(productMap.get(code))) return;
    setCart((c) => addToCart(c, code, qty));
  }, []);
  const update = useCallback((code, qty) => setCart((c) => setQuantity(c, code, qty)), []);
  const remove = useCallback((code) => setCart((c) => removeFromCart(c, code)), []);
  const removeOutOfStock = useCallback(
    () => setCart((c) => c.filter((i) => isInStock(productMap.get(i.productCode)))),
    []
  );
  const clear = useCallback(() => setCart([]), []);

  const summary = useMemo(() => summarizeCart(cart, productMap), [cart]);
  const value = useMemo(() => ({ summary, add, update, remove, removeOutOfStock, clear }), [summary, add, update, remove, removeOutOfStock, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
