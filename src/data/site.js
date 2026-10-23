// Business details and site-wide text. Edit here, not inside components.

export const BUSINESS = {
  name: "Qazi Medicine Company",
  phoneDisplay: "03472541767",
  // International format (no "+" or spaces) used by wa.me links.
  whatsappNumber: "923472541767",
  email: "itxosama0@gmail.com",
  address: "Gulistan Society near Bangesh Plaza, Laghari Gate, Dera Ismail Khan",
};

// Must stay exactly as written.
export const OFFER_TEXT = "🔥 MULTINATIONAL MEDICINE 15% T.P — WITHOUT ANY TAX 🔥";

// Product codes shown under "Featured Products" on the home page, in this order:
//   0159 CALVIT-C BAHAWALPUR, 0748 POLYGEL SYP MINT, 1521 PEPTACID SYP, 0192 CELVIT SACHET
// Change the codes to feature other products. An empty list auto-picks one product
// from each of the first four categories.
export const FEATURED_CODES = ["0159", "0748", "1521", "0192"];

// Hero image carousel. Photos live in public/carousel/. Replace a file (same name) or edit this list.
// Paths are relative to the site root, without a leading slash.
export const CAROUSEL_SLIDES = [
  { src: "carousel/pharmacy-0.jpg", alt: "Welcome To Qazi Medicine Company" },
  { src: "carousel/pharmacy-1.jpg", alt: "Shelves fully stocked with medicines at Qazi Medicine Company" },
  { src: "carousel/pharmacy-2.jpg", alt: "Wholesale medicine stock arranged by product at Qazi Medicine Company" },
  { src: "carousel/pharmacy-3.jpg", alt: "Aisle of tablets, creams and syrups ready for pharmacy orders" },
];
// Milliseconds between automatic slide changes.
export const CAROUSEL_INTERVAL = 2000;

// Footer social links. Paste a real page URL between the quotes to turn an icon into a link.
// (WhatsApp always links to the business chat.) Left empty on purpose - no made-up links.
export const SOCIAL_LINKS = {
  facebook: "",
  youtube: "",
  tiktok: "",
};
