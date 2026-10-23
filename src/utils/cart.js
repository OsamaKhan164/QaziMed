import { roundMoney } from "./format.js";

export const MAX_QUANTITY = 999;

export function clampQuantity(value) {
  const n = Math.floor(Number(value));
  if (!Number.isFinite(n) || n < 1) return 1;
  return Math.min(n, MAX_QUANTITY);
}

// A product is available unless products.js says inStock: false.
export function isInStock(product) {
  return !product || product.inStock !== false;
}

// Pure cart helpers. A cart is an array of { productCode, quantity }.
export function addToCart(cart, productCode, quantity = 1) {
  const qty = clampQuantity(quantity);
  const existing = cart.find((i) => i.productCode === productCode);
  if (existing) {
    return cart.map((i) =>
      i.productCode === productCode ? { ...i, quantity: clampQuantity(i.quantity + qty) } : i
    );
  }
  return [...cart, { productCode, quantity: qty }];
}

export function setQuantity(cart, productCode, quantity) {
  return cart.map((i) =>
    i.productCode === productCode ? { ...i, quantity: clampQuantity(quantity) } : i
  );
}

export function removeFromCart(cart, productCode) {
  return cart.filter((i) => i.productCode !== productCode);
}

// Joins cart items with product data and calculates all totals.
export function summarizeCart(cart, productMap) {
  const lines = [];
  for (const item of cart) {
    const product = productMap.get(item.productCode);
    if (!product) continue; // product no longer exists in products.js
    const price = Number(product.price) || 0;
    const inStock = isInStock(product);
    lines.push({
      productCode: product.productCode,
      name: product.name,
      category: product.category,
      image: product.image,
      price,
      quantity: item.quantity,
      inStock,
      lineTotal: roundMoney(price * item.quantity),
    });
  }
  // Out-of-stock lines stay visible in the cart but are never counted or ordered.
  const orderable = lines.filter((l) => l.inStock);
  const outOfStockLines = lines.filter((l) => !l.inStock);
  const totalQuantity = orderable.reduce((sum, l) => sum + l.quantity, 0);
  const grandTotal = roundMoney(orderable.reduce((sum, l) => sum + l.lineTotal, 0));
  // Total Items = number of different products in the cart (not the sum of their quantities).
  const totalItems = orderable.length;
  return { lines, orderable, outOfStockLines, hasOutOfStock: outOfStockLines.length > 0, totalItems, totalQuantity, grandTotal };
}
