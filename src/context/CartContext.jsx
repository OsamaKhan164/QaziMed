import {
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
  useEffect,
} from "react";

import { products } from "../data/products.js";

import {
  addToCart,
  setQuantity,
  removeFromCart,
  summarizeCart,
  isInStock,
} from "../utils/cart.js";

const productMap = new Map(
  products.map((p) => [p.productCode, p])
);

const CartContext = createContext(null);

const CART_STORAGE_KEY = "qazi-medicine-cart";

function loadCart() {
  try {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);

    if (!savedCart) return [];

    const parsedCart = JSON.parse(savedCart);

    if (!Array.isArray(parsedCart)) return [];

    // Remove invalid or out-of-stock products.
    return parsedCart.filter((item) => {
      return (
        item &&
        typeof item.productCode === "string" &&
        Number.isFinite(item.quantity) &&
        item.quantity > 0 &&
        isInStock(productMap.get(item.productCode))
      );
    });
  } catch (error) {
    console.error("Cart loading failed:", error);
    return [];
  }
}

export function CartProvider({ children }) {
  // Restore cart from Local Storage when website opens.
  const [cart, setCart] = useState(loadCart);

  // Automatically save cart whenever it changes.
  useEffect(() => {
    try {
      localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify(cart)
      );
    } catch (error) {
      console.error("Cart saving failed:", error);
    }
  }, [cart]);

  const add = useCallback((code, qty = 1) => {
    if (!isInStock(productMap.get(code))) return;

    setCart((currentCart) =>
      addToCart(currentCart, code, qty)
    );
  }, []);

  const update = useCallback((code, qty) => {
    setCart((currentCart) =>
      setQuantity(currentCart, code, qty)
    );
  }, []);

  const remove = useCallback((code) => {
    setCart((currentCart) =>
      removeFromCart(currentCart, code)
    );
  }, []);

  const removeOutOfStock = useCallback(() => {
    setCart((currentCart) =>
      currentCart.filter((item) =>
        isInStock(productMap.get(item.productCode))
      )
    );
  }, []);

  const clear = useCallback(() => {
    setCart([]);
  }, []);

  const summary = useMemo(
    () => summarizeCart(cart, productMap),
    [cart]
  );

  const value = useMemo(
    () => ({
      summary,
      add,
      update,
      remove,
      removeOutOfStock,
      clear,
    }),
    [summary, add, update, remove, removeOutOfStock, clear]
  );

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);

  if (!ctx) {
    throw new Error("useCart must be used inside <CartProvider>");
  }

  return ctx;
}