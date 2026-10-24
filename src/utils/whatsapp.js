import { formatPrice } from "./format.js";
// import { normalizeMobile } from "./validation.js";

// Joins a multi-line value into one line ("Shop 4,\nMain Bazar" -> "Shop 4, Main Bazar", no doubled commas).
const oneLine = (text) => String(text || "").replace(/,?\s*[\r\n]+\s*/g, ", ").replace(/\s+/g, " ").trim();

// Emojis, the dash and the separator are written as code points so the exact characters are kept.
const CART = "\u{1F6D2}";   // 🛒
const STORE = "\u{1F3EA}";  // 🏪
const PHONE = "\u{1F4F1}";  // 📱
const PIN = "\u{1F4CD}";    // 📍
const BOX = "\u{1F4E6}";    // 📦
const MONEY = "\u{1F4B0}";  // 💰
const SEPARATOR = "\u2501".repeat(18); // ━━━━━━━━━━━━━━━━━━
const DASH = "\u2014";      // —
const TIMES = "\u00D7";     // ×

// Builds the plain-text order message that the customer reviews and sends in WhatsApp.
// Only products that can be ordered (in stock) are listed.
export function buildOrderMessage({ storeName,  address }, summary) {
  const items = summary.orderable || summary.lines;
  const lines = [
    `${CART} NEW ORDER REQUEST`,
    // "",
    SEPARATOR,
    // "",
    `${STORE} Medical Store:`,
    oneLine(storeName),
    "",
    // `${PHONE} Mobile:`,
    // normalizeMobile(mobile),
    // "",
    `${PIN} Delivery Address:`,
    oneLine(address),
    "",
    SEPARATOR,
    "",
    `${BOX} ORDER DETAILS`,
    "",
    ...items.map((l, i) => `${i + 1}. ${l.name} ${DASH} ${l.quantity} ${TIMES} ${formatPrice(l.price)} = ${formatPrice(l.lineTotal)}`),
    "",
    SEPARATOR,
    // "",
    `${MONEY} Grand Total: ${formatPrice(summary.grandTotal)}`,
    // "",
    SEPARATOR,
    "",
    "Kindly confirm my order. Thank you!",
  ];
  return lines.join("\n");
}

// number must be in international format without "+", e.g. 923472541767.
// Without a message: the plain wa.me chat link. With a message the text is always encodeURIComponent (UTF-8).
//  - phones / default: https://api.whatsapp.com/send (the wa.me short link redirects through an extra hop that
//    has been reported to turn emojis into "\uFFFD" in WhatsApp Web)
//  - desktop browsers (options.desktop): https://web.whatsapp.com/send opens the chat directly, which skips
//    the WhatsApp landing page where the emojis were still showing as "\uFFFD".
export function buildWhatsAppUrl(number, message, { desktop = false } = {}) {
  if (!message) return `https://wa.me/${number}`;
  const text = encodeURIComponent(message);
  return desktop
    ? `https://web.whatsapp.com/send?phone=${number}&text=${text}`
    : `https://api.whatsapp.com/send?phone=${number}&text=${text}`;
}

// True on a desktop / laptop browser (not an Android, iPhone or iPad browser).
export function isDesktopBrowser() {
  if (typeof navigator === "undefined") return false;
  if (navigator.userAgentData && typeof navigator.userAgentData.mobile === "boolean") return !navigator.userAgentData.mobile;
  return !/Android|iPhone|iPad|iPod|Mobile|Tablet/i.test(navigator.userAgent || "");
}
