import test from "node:test";
import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
import { products, CATEGORIES } from "../src/data/products.js";
import { BUSINESS, OFFER_TEXT, FEATURED_CODES, CAROUSEL_INTERVAL, CAROUSEL_SLIDES } from "../src/data/site.js";
import { addToCart, setQuantity, removeFromCart, summarizeCart, clampQuantity, isInStock } from "../src/utils/cart.js";
import { formatPrice } from "../src/utils/format.js";
import { filterProducts, countByCategory, suggestProducts } from "../src/utils/search.js";
import { validateCheckout, validateMobile, normalizeMobile, sanitizeMobileInput } from "../src/utils/validation.js";
import { buildOrderMessage, buildWhatsAppUrl, isDesktopBrowser } from "../src/utils/whatsapp.js";

// ---------- product data ----------
test("imports all 1,716 Excel product rows", () => assert.equal(products.length, 1716));
test("every product code is a unique 4-digit string", () => {
  const codes = products.map((p) => p.productCode);
  assert.equal(new Set(codes).size, codes.length);
  assert.ok(codes.every((c) => /^\d{4}$/.test(c)));
  assert.equal(codes[0], "0001");
  assert.equal(codes.at(-1), "1716");
});
test("every product is in stock by default (inStock: true)", () => {
  assert.equal(products.every((p) => p.inStock === true), true);
});
test("every product has the required fields, a valid price and an image path based on its code", () => {
  for (const p of products) {
    assert.ok(typeof p.price === "number" && Number.isFinite(p.price) && p.price >= 0, `bad price ${p.productCode}`);
    assert.ok(p.name && p.name.trim() === p.name, `bad name ${p.productCode}`);
    assert.ok(CATEGORIES.includes(p.category), `bad category ${p.productCode}`);
    assert.equal(p.image, `/products/${p.productCode}.jpg`);
    assert.ok(!p.name.includes("="), `unclean name ${p.productCode}`);
  }
});
test("prices match the price import report (docs/price-import-report.csv)", () => {
  const lines = readFileSync(new URL("../docs/price-import-report.csv", import.meta.url), "utf8").trim().split("\n").slice(1);
  const byCode = new Map(products.map((p) => [p.productCode, p]));
  let matched = 0, unpriced = [];
  for (const line of lines) {
    const cells = line.split(",");
    const code = cells[0], price = cells.at(-2), status = cells.at(-1); // read from the end: names may contain commas
    if (!code) continue; // rows for names that exist only in the price file
    if (status.startsWith("matched")) { matched++; assert.equal(byCode.get(code).price, Number(price), `price for ${code}`); }
    else { unpriced.push(code); assert.equal(byCode.get(code).price, 0, `unpriced ${code}`); }
  }
  assert.equal(matched, 1714);
  assert.deepEqual(unpriced.sort(), ["1072", "1586"]);
  assert.equal(products.filter((p) => p.price === 0).length, 2);
  // a few spot checks straight from the Excel price file
  const price = (c) => byCode.get(c).price;
  assert.deepEqual([price("0001"), price("0002"), price("0003"), price("0004"), price("0159")], [348.5, 493, 46, 186.15, 60]);
});
test("both CPM TAB IRZA BLISTER rows are kept with different codes", () => {
  const cpm = products.filter((p) => p.name === "CPM TAB IRZA BLISTER");
  assert.equal(cpm.length, 2);
  assert.notEqual(cpm[0].productCode, cpm[1].productCode);
});
test("non-medicine items stay in Others", () => {
  for (const name of ["BANDAGE 2 INCH", "BD-INSULIN SYRINGE", "FACE MASK ( MASTER PLUS )", "CERELAC RICE 175MG", "ACNE F SOAP"]) {
    assert.equal(products.find((p) => p.name === name)?.category, "Others", name);
  }
});

// ---------- business details ----------
test("business details and exact offer text", () => {
  assert.equal(BUSINESS.whatsappNumber, "923472541767");
  assert.equal(BUSINESS.address, "Gulistan Society near Bangesh Plaza, Laghari Gate, Dera Ismail Khan");
  assert.equal(OFFER_TEXT, "🔥 MULTINATIONAL MEDICINE 15% T.P — WITHOUT ANY TAX 🔥");
});

test("featured products are the four requested records, in order, with unchanged data", () => {
  const featured = FEATURED_CODES.map((c) => products.find((p) => p.productCode === c));
  assert.deepEqual(featured.map((p) => p.name), ["CALVIT-C BAHAWALPUR", "POLYGEL SYP MINT", "PEPTACID SYP", "CELVIT SACHET"]);
  assert.deepEqual(featured.map((p) => p.category), ["Others", "Syrup", "Syrup", "Sachet"]);
  assert.ok(featured.every((p) => p.price > 0 && p.image === `/products/${p.productCode}.jpg`));
});

test("carousel changes slide every 2 seconds with 3 photos", () => {
  assert.equal(CAROUSEL_INTERVAL, 2000);
  assert.equal(CAROUSEL_SLIDES.length, 3);
});

// ---------- cart ----------
const catalog = new Map([
  ["A", { productCode: "A", name: "Alpha Tab", category: "Tablets", price: 150, image: "" }],
  ["B", { productCode: "B", name: "Beta Syp", category: "Syrup", price: 0, image: "" }],
  ["C", { productCode: "C", name: "Gamma Inj", category: "Injection", price: 0.1, image: "" }],
]);
test("add, merge, change and remove cart items", () => {
  let cart = addToCart([], "A", 2);
  cart = addToCart(cart, "A", 3);
  assert.deepEqual(cart, [{ productCode: "A", quantity: 5 }]);
  cart = setQuantity(cart, "A", 0); // never below 1
  assert.equal(cart[0].quantity, 1);
  cart = removeFromCart(cart, "A");
  assert.equal(cart.length, 0);
});
test("clampQuantity handles junk input", () => {
  assert.equal(clampQuantity("abc"), 1);
  assert.equal(clampQuantity(-4), 1);
  assert.equal(clampQuantity(2.9), 2);
  assert.equal(clampQuantity(100000), 999);
});
test("line totals, total quantity and grand total", () => {
  const cart = [{ productCode: "A", quantity: 2 }, { productCode: "B", quantity: 4 }, { productCode: "C", quantity: 3 }];
  const s = summarizeCart(cart, catalog);
  assert.equal(s.lines[0].lineTotal, 300);
  assert.equal(s.lines[1].lineTotal, 0);
  assert.equal(s.lines[2].lineTotal, 0.3); // not 0.30000000000000004
  assert.equal(s.totalQuantity, 9);
  assert.equal(s.totalItems, 3);
  assert.equal(s.grandTotal, 300.3);
});
test("Total Items counts different products, not quantities", () => {
  const three = summarizeCart([{ productCode: "A", quantity: 2 }, { productCode: "B", quantity: 4 }, { productCode: "C", quantity: 1 }], catalog);
  assert.equal(three.totalItems, 3);                       // 3 different products (quantities 2, 4, 1)
  assert.equal(three.totalQuantity, 7);                    // quantities are still summed separately
  assert.equal(summarizeCart([{ productCode: "A", quantity: 5 }], catalog).totalItems, 1); // one product, quantity 5
  assert.equal(summarizeCart([], catalog).totalItems, 0);
  const mixed = summarizeCart([{ productCode: "A", quantity: 1 }, { productCode: "X", quantity: 3 }], new Map([...catalog, ["X", { productCode: "X", name: "Out", category: "Tablets", price: 5, inStock: false, image: "" }]]));
  assert.equal(mixed.totalItems, 1);                       // out-of-stock products are not counted
  assert.equal(three.grandTotal, 300 + 0 + 0.1);           // Grand Total is unchanged: 2x150 + 4x0 + 1x0.1
});
test("an all-zero-price cart totals 0 correctly", () => {
  const s = summarizeCart([{ productCode: "B", quantity: 7 }], catalog);
  assert.equal(s.grandTotal, 0);
  assert.equal(s.totalQuantity, 7);
  assert.equal(s.totalItems, 1);
});
test("formatPrice: whole amounts plain, fractions with 2 decimals, zero as Rs. 0.00", () => {
  assert.equal(formatPrice(4), "Rs. 4");
  assert.equal(formatPrice(4.0), "Rs. 4");
  assert.equal(formatPrice("4"), "Rs. 4");
  assert.equal(formatPrice(125.5), "Rs. 125.50");
  assert.equal(formatPrice(125.25), "Rs. 125.25");
  assert.equal(formatPrice(186.15), "Rs. 186.15");
  assert.equal(formatPrice(348.5), "Rs. 348.50");
  assert.equal(formatPrice(0), "Rs. 0.00");
  assert.equal(formatPrice(0.1), "Rs. 0.10");
  assert.equal(formatPrice(1690), "Rs. 1,690");
  assert.equal(formatPrice(1045.5), "Rs. 1,045.50");
  assert.equal(formatPrice(1234567.8), "Rs. 1,234,567.80");
  // floating-point artefacts never leak into the display
  assert.equal(formatPrice(0.1 * 3), "Rs. 0.30");
  assert.equal(formatPrice(186.15 * 3), "Rs. 558.45");
  assert.equal(formatPrice(4.000000000000001), "Rs. 4");
  assert.equal(formatPrice(undefined), "Rs. 0.00");
  assert.equal(formatPrice(NaN), "Rs. 0.00");
});

// ---------- search ----------
test("category filter, name search and code search", () => {
  assert.equal(filterProducts(products, { category: "Syrup" }).every((p) => p.category === "Syrup"), true);
  assert.ok(filterProducts(products, { query: "zoxicillin" }).length >= 3);
  assert.equal(filterProducts(products, { query: "0001", searchBy: "code" })[0].productCode, "0001");
  assert.equal(filterProducts(products, { query: "ZOXICILLIN syp", category: "Syrup" }).every((p) => /syp/i.test(p.name)), true);
  assert.equal(filterProducts(products, { query: "no-such-medicine-xyz" }).length, 0);
});
test("category counts add up to the total", () => {
  const total = Object.values(countByCategory(products)).reduce((a, b) => a + b, 0);
  assert.equal(total, 1716);
});

test("autocomplete: typing BR suggests matching products, prefix matches first", () => {
  const s = suggestProducts(products, "BR");
  assert.ok(s.length > 0 && s.length <= 8);
  assert.ok(s.every((p) => /br/i.test(p.name) || p.productCode.includes("br")));
  assert.ok(/^br/i.test(s[0].name), "prefix match should be ranked first");
  assert.ok(products.some((p) => p.name.startsWith("BRUFEN")));
  assert.ok(suggestProducts(products, "brufen").every((p) => /brufen/i.test(p.name)));
});
test("autocomplete: empty query, code query and no-match query", () => {
  assert.deepEqual(suggestProducts(products, ""), []);
  assert.deepEqual(suggestProducts(products, "   "), []);
  assert.equal(suggestProducts(products, "0001")[0].productCode, "0001");
  assert.deepEqual(suggestProducts(products, "zzzzqqqq"), []);
  assert.equal(suggestProducts(products, "a", 3).length, 3);
});

// ---------- validation ----------
test("mobile number: exactly 11 digits starting with 03", () => {
  assert.equal(validateMobile("03472541767"), "");
  assert.equal(validateMobile("03001234567"), "");
  assert.notEqual(validateMobile(""), "");
  assert.match(validateMobile("0347254176"), /exactly 11 digits/);      // too short (10)
  assert.match(validateMobile("034725417678"), /exactly 11 digits/);    // too long (12)
  assert.match(validateMobile("12345"), /start with 03/);
  assert.match(validateMobile("04472541767"), /start with 03/);
  assert.match(validateMobile("03472abc767"), /digits only/);
  assert.match(validateMobile("0347-2541767"), /digits only/);          // formatting is removed by the input field, not accepted here
  assert.match(validateMobile("+923472541767"), /digits only/);
});
test("mobile input keeps digits only and never more than 11", () => {
  assert.equal(sanitizeMobileInput("03472541767"), "03472541767");
  assert.equal(sanitizeMobileInput("0347 254-1767"), "03472541767");
  assert.equal(sanitizeMobileInput("abc0347xyz2541767"), "03472541767");
  assert.equal(sanitizeMobileInput("0347254176789"), "03472541767");     // extra digits dropped
  assert.equal(sanitizeMobileInput("+92 347 2541767"), "03472541767");   // pasted international format
  assert.equal(sanitizeMobileInput("+@#$"), "");
  assert.equal(sanitizeMobileInput(null), "");
  assert.equal(normalizeMobile("0347 2541767"), "03472541767");         // used by the WhatsApp message
});
test("checkout requires store name, mobile and address", () => {
  assert.equal(validateCheckout({ storeName: "", mobile: "", address: "" }).isValid, false);
  const ok = validateCheckout({ storeName: "City Pharmacy", mobile: "03001234567", address: "Main Bazar, Shop 5, Dera Ismail Khan" });
  assert.equal(ok.isValid, true);
});

// ---------- WhatsApp ----------
test("WhatsApp message matches the approved layout exactly", () => {
  const byName = (n) => products.find((p) => p.name === n).productCode;
  const cart = [
    { productCode: byName("ABOCAL TAB"), quantity: 3 },
    { productCode: byName("ACTIFER CAP"), quantity: 3 },
    { productCode: byName("ACE LYF SYP ( HICON )"), quantity: 4 },
  ];
  const productMap = new Map(products.map((p) => [p.productCode, p]));
  const summary = summarizeCart(cart, productMap);
  const form = { storeName: "osama medical", mobile: "0347 2541767", address: "shiekh yousef ada," };
  // Written out literally (not built from the code's constants) so the test checks the real characters.
  const expected = `🛒 NEW ORDER REQUEST

━━━━━━━━━━━━━━━━━━

🏪 Medical Store:
osama medical

📍 Delivery Address:
shiekh yousef ada,

━━━━━━━━━━━━━━━━━━

📦 ORDER DETAILS

1. ABOCAL TAB — 3 × Rs. 348.50 = Rs. 1,045.50
2. ACTIFER CAP — 3 × Rs. 80 = Rs. 240
3. ACE LYF SYP ( HICON ) — 4 × Rs. 46 = Rs. 184

━━━━━━━━━━━━━━━━━━

💰 Grand Total: Rs. 1,469.50

━━━━━━━━━━━━━━━━━━

Kindly confirm my order. Thank you!`;
  assert.equal(buildOrderMessage(form, summary), expected);
});
test("WhatsApp message uses live prices, unit price x quantity, multi-line address and builds a safe URL", () => {
  const cart = [{ productCode: "A", quantity: 2 }, { productCode: "B", quantity: 1 }, { productCode: "C", quantity: 3 }];
  const summary = summarizeCart(cart, catalog);
  const form = { storeName: "City Pharmacy", mobile: "0300 1234567", address: "Main Bazar\nShop 5, D.I.Khan" };
  const msg = buildOrderMessage(form, summary);
  const L = msg.split("\n");
  // labels and their values are on separate lines
  assert.equal(L[L.indexOf("🏪 Medical Store:") + 1], "City Pharmacy");
  assert.equal(L[L.indexOf("📱 Mobile:") + 1], "03001234567");
  assert.equal(L[L.indexOf("📍 Delivery Address:") + 1], "Main Bazar, Shop 5, D.I.Khan");
  assert.equal(buildOrderMessage({ ...form, address: "Shop 4,\nMain Bazar,\r\n  Dera Ismail Khan" }, summary).split("\n")[L.indexOf("📍 Delivery Address:") + 1], "Shop 4, Main Bazar, Dera Ismail Khan");
  assert.ok(L.includes("1. Alpha Tab — 2 × Rs. 150 = Rs. 300"));
  assert.ok(L.includes("2. Beta Syp — 1 × Rs. 0.00 = Rs. 0.00"));
  assert.ok(L.includes("3. Gamma Inj — 3 × Rs. 0.10 = Rs. 0.30"), "decimal line total rounded correctly");
  assert.ok(L.includes("💰 Grand Total: Rs. 300.30"));
  assert.ok(!/Total Item Quantity|final bill|\u{1F44B}|\u{1F91D}/u.test(msg), "no quantity total, no 'final bill', no hand emoji");
  assert.equal(msg.split("━━━━━━━━━━━━━━━━━━").length - 1, 4, "four separator lines");
  assert.ok(msg.endsWith("Kindly confirm my order. Thank you!"));
  const url = buildWhatsAppUrl(BUSINESS.whatsappNumber, msg);
  assert.ok(url.startsWith("https://api.whatsapp.com/send?phone=923472541767&text="));
  assert.equal(decodeURIComponent(url.split("&text=")[1]), msg);
  assert.ok(!url.includes("\n") && !url.includes(" ") && !url.includes("—") && !url.includes("🛒"), "fully URL-encoded");
});

// ---------- stock ----------
test("out-of-stock products: flagged, excluded from totals and from the WhatsApp message", () => {
  const stock = new Map([
    ["A", { productCode: "A", name: "Alpha Tab", category: "Tablets", price: 150, inStock: true, image: "" }],
    ["B", { productCode: "B", name: "Beta Syp", category: "Syrup", price: 100, inStock: false, image: "" }],
    ["C", { productCode: "C", name: "Gamma Inj", category: "Injection", price: 10, image: "" }], // flag missing = in stock
  ]);
  assert.equal(isInStock(stock.get("A")), true);
  assert.equal(isInStock(stock.get("B")), false);
  assert.equal(isInStock(stock.get("C")), true);
  const s = summarizeCart([{ productCode: "A", quantity: 2 }, { productCode: "B", quantity: 5 }, { productCode: "C", quantity: 1 }], stock);
  assert.equal(s.lines.length, 3);
  assert.equal(s.hasOutOfStock, true);
  assert.deepEqual(s.outOfStockLines.map((l) => l.productCode), ["B"]);
  assert.equal(s.totalQuantity, 3);
  assert.equal(s.grandTotal, 310);
  const msg = buildOrderMessage({ storeName: "City Pharmacy", mobile: "03001234567", address: "Main Bazar, Shop 5" }, s);
  assert.ok(msg.includes("1. Alpha Tab — 2 × Rs. 150 = Rs. 300") && msg.includes("2. Gamma Inj — 1 × Rs. 10 = Rs. 10"));
  assert.ok(!msg.includes("Beta Syp"));
  assert.ok(msg.includes("💰 Grand Total: Rs. 310"));
});

// ---------- capitalization & favorites ----------
import { capitalizeWords } from "../src/utils/text.js";
import { sanitizeFavorites, toggleFavorite } from "../src/utils/favorites.js";

test("capitalizeWords capitalizes each word and keeps spaces", () => {
  assert.equal(capitalizeWords("qazi medicine company"), "Qazi Medicine Company");
  assert.equal(capitalizeWords("gulistan society  near bangesh plaza "), "Gulistan Society  Near Bangesh Plaza ");
  assert.equal(capitalizeWords("QAZI mEDICAL"), "QAZI MEDICAL");
  assert.equal(capitalizeWords(""), "");
  assert.equal(capitalizeWords(null), "");
});
test("sanitizeFavorites keeps only unique valid codes, tolerates bad input", () => {
  const valid = new Set(["0001", "0002", "0003"]);
  assert.deepEqual(sanitizeFavorites(["0002", "0002", "9999", 5, null, "0001"], valid), ["0002", "0001"]);
  assert.deepEqual(sanitizeFavorites("junk", valid), []);
  assert.deepEqual(sanitizeFavorites(null, valid), []);
});
test("toggleFavorite adds, removes and ignores unknown codes", () => {
  const valid = new Set(["0001", "0002"]);
  assert.deepEqual(toggleFavorite([], "0001", valid), ["0001"]);
  assert.deepEqual(toggleFavorite(["0001"], "0001", valid), []);
  assert.deepEqual(toggleFavorite(["0001"], "7777", valid), ["0001"]);
});

// ---------- WhatsApp emoji integrity ----------
test("order message keeps the exact emoji code points and has no replacement character", () => {
  const msg = buildOrderMessage(
    { storeName: "Qazi Medical Store", mobile: "03472541767", address: "Gulistan Society" },
    { orderable: [{ name: "ABOCAL TAB", quantity: 2, price: 348.5, lineTotal: 697 }], grandTotal: 697 }
  );
  for (const cp of [0x1f6d2, 0x1f3ea, 0x1f4f1, 0x1f4cd, 0x1f4e6, 0x1f4b0]) assert.ok(msg.includes(String.fromCodePoint(cp)), `missing U+${cp.toString(16)}`);
  assert.ok(!msg.includes("�") && !msg.includes("?"), "no replacement or question marks");
  const url = buildWhatsAppUrl("923472541767", msg);
  assert.ok(url.startsWith("https://api.whatsapp.com/send?phone=923472541767&text="));
  assert.ok(url.includes("%F0%9F%9B%92") && url.includes("%F0%9F%8F%AA") && url.includes("%F0%9F%93%B1"), "emoji as UTF-8 percent-bytes");
  assert.equal(decodeURIComponent(url.split("&text=")[1]), msg, "decoded URL equals original message");
  assert.equal(buildWhatsAppUrl("923472541767"), "https://wa.me/923472541767");
});

test("desktop URL goes straight to web.whatsapp.com and keeps every emoji and character intact", () => {
  const msg = buildOrderMessage(
    { storeName: "Qazi Medical Store", mobile: "03472541767", address: "Gulistan Society" },
    { orderable: [{ name: "ABOCAL TAB", quantity: 2, price: 348.5, lineTotal: 697 }], grandTotal: 697 }
  );
  const url = buildWhatsAppUrl("923472541767", msg, { desktop: true });
  assert.ok(url.startsWith("https://web.whatsapp.com/send?phone=923472541767&text="));
  assert.ok(/^[\x21-\x7e]+$/.test(url), "URL is pure ASCII (percent-encoded UTF-8 only)");
  const decoded = decodeURIComponent(url.split("&text=")[1]);
  assert.equal(decoded, msg);
  assert.deepEqual([...decoded].filter((c) => c.codePointAt(0) > 0xffff).map((c) => c.codePointAt(0).toString(16)), ["1f6d2", "1f3ea", "1f4f1", "1f4cd", "1f4e6", "1f4b0"]);
  assert.equal(buildWhatsAppUrl("923472541767", msg), buildWhatsAppUrl("923472541767", msg, { desktop: false }));
  assert.equal(typeof isDesktopBrowser(), "boolean");
});
