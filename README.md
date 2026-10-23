# Qazi Medicine Company - WhatsApp Ordering Website

A **frontend-only** static website built with React + Vite. There is no backend, server, database, login/sign-up, payment gateway or API. Pages: Home (hero, carousel, Featured Products), Products (`#/products`: category sidebar, search and all products), Cart and Checkout. Customers browse medicines, fill a cart, enter their pharmacy details and open WhatsApp with a ready-made order message. **The customer must press Send in WhatsApp** - the website never sends anything by itself.

The cart lives in browser memory only (nothing is saved in localStorage, sessionStorage or cookies), so refreshing the page empties the cart.

Favorite products are the one exception: only the list of favorite product codes is saved in the browser's localStorage (key `qazi-favorites`), so favorites survive a refresh. Prices, names and images always come from `src/data/products.js`. Clearing the cart or sending an order never clears favorites. Search boxes and the Medical Store Name / Delivery Address fields capitalize the first letter of each word as you type.

## 1. Setup

Requires Node.js 18 or newer and an internet connection for `npm install`. The page also loads the Inter font from Google Fonts; if that is unavailable the browser falls back to a standard system font.

```bash
npm install
npm run dev        # open the address shown (usually http://localhost:5173)
npm test           # data + logic tests (no extra packages needed)
npm run build      # creates the "dist" folder
npm run preview    # test the built site locally
```

## 2. Deployment (static hosting)

Run `npm run build`, then upload the **contents of the `dist` folder** to any static host: Netlify, Vercel, Cloudflare Pages, GitHub Pages, cPanel `public_html`, Firebase Hosting, etc. The site uses relative paths (`base: "./"`) and hash links (`#/products`), so it works from the domain root or from a sub-folder with no server rewrite rules.

## 3. Project structure

```
public/products/        real product photos go here (see section 4)
public/carousel/        the 3 hero carousel photos
src/data/products.js    ALL product data (code, name, category, price, image)
src/data/site.js        business details, offer text, featured product codes, hero carousel photos
src/components/         Navbar, Logo, OfferMarquee, Carousel, TrustBar, ProductSearch, HeaderCart, ProductCard, Footer, ...
src/pages/              Home, Products, Cart, Checkout
src/utils/              cart maths, search, validation, WhatsApp message
src/context/            in-memory cart
tests/                  automated tests (node --test)
docs/import-report.csv  Excel row -> product code mapping and original names
docs/price-import-report.csv  which price-file row gave each product its price
```

## 4. Replacing product images

Every product already points to an image named after its own product code, for example `image: "/products/0001.jpg"` for code `0001` (leading zeros kept).

1. Save each photo in `public/products/` as `<productCode>.jpg` - for example `public/products/0001.jpg`, `public/products/0159.jpg`.
2. That is all - no change to `products.js` is needed. Rebuild (`npm run build`) and upload.

At the moment no photos have been added yet, so every product shows the "Image coming soon" placeholder (the browser may also log a harmless "404" for each missing photo). A missing or broken file always falls back to the placeholder automatically.

### Hero carousel photos

The home page carousel shows `public/carousel/pharmacy-1.jpg`, `-2.jpg` and `-3.jpg` and changes slide every 2 seconds. To change photos, replace those files (keep the names) or edit `CAROUSEL_SLIDES` and `CAROUSEL_INTERVAL` in `src/data/site.js`.

## 5. Editing prices in products.js

Prices were imported from the Excel price file `stockpositionmulticolumn.xls` by matching exact product names (that file has no product codes). 1,714 products received their price; `BRITA GTN` (1072) and `SEBASTIN TAB` (1586) were not in the price file and stay at `price: 0`. The full match list is in `docs/price-import-report.csv`. To change a price, open `src/data/products.js` and edit the number:

```js
{ productCode: "0001", name: "ABOCAL TAB", category: "Tablets", price: 120, inStock: true, image: "/products/0001.jpg" },
```

Use plain numbers in Rs. (no "Rs." text, no commas). Cart lines, Total Items (number of different products) and the grand total update automatically. Prices are displayed as `Rs. 4` (whole), `Rs. 125.50` (with fractions) and `Rs. 0.00` (zero).
When you receive a price file, send it to Claude: it will match products by product code first, by careful name matching only when needed, and list ambiguous matches for you to confirm instead of guessing.

### Marking a product Out of Stock

Every product has an `inStock` flag. `inStock: true` means available. To mark a product out of stock, change it to `false` (no quotes):

```js
{ productCode: "0001", name: "ABOCAL TAB", category: "Tablets", price: 120, inStock: false, image: "/products/0001.jpg" },
```

The product stays visible in the catalogue, search and Featured Products, but its button shows a disabled "Out of Stock" and it cannot be added to the cart. If it is already in a customer's cart, the cart and checkout ask them to remove it, and it is never included in the WhatsApp order. There is no stock quantity tracking - only this true/false flag.

## 6. Product data notes

- Source: `Qazi_medicine_All_products.xls` - one sheet, 1,716 product rows (QAZI 1 section: 999, QAZI 2 section: 717). All rows are kept exactly as in the Excel file, including two `CPM TAB IRZA BLISTER` rows (codes 0259 and 1168).
- The Excel file had no product codes, prices or categories. Codes `0001`-`1716` were generated in file order. Categories were inferred from words in the product name (TAB, CAP, SYP, INJ, DROP, CREAM, LOTION, SACHET...). Items with no clear form word, and all non-medicine items (bandages, syringes, soap, milk powder...), are in **Others**.
- Names were cleaned of `=` spacer characters. The original Excel text for each product is in `docs/import-report.csv`.
- The Excel stock quantities were not imported.
- To fix a category, edit that product's `category` in `products.js` (use one of the names in `CATEGORIES` at the top of the file).

### Checkout mobile number

The mobile field accepts digits only (maximum 11) and must be a Pakistani mobile number in the form `03XXXXXXXXX`, e.g. `03472541767`.

## 7. Business details

Phone/WhatsApp, email, address and the offer banner text are in `src/data/site.js`. The WhatsApp number is stored as `923472541767` (international format).

## 8. Notes

- The cart icon with the item-count badge is at the top-right of the home page. Other pages link back with "← Back to Home"; the footer also has a Cart link.
- The home page carousel photos are in `public/carousel/` (see section 4).
- Before the first deployment, run `npm run build` once on your computer and open the result with `npm run preview` to confirm everything looks right.

## 9. Design notes (purple theme)
- Pages: Home (hero + carousel, trust bar, 4 Featured Products), Products (`#/products`: "All Products" with category sidebar, count, search and grid), Cart and Checkout. "View Products", "View All" and the navbar "All Products" link all open the Products page.
- On the Products page the heading/count/search row and the category sidebar stay visible while scrolling. Their offsets use `--marquee-h` (height of the sticky offer bar) in `src/index.css`.
- On phones (640px and narrower) the navbar shows only the logo/brand and the cart; there is no menu. Tablet and desktop show the links.
- Colours are CSS variables at the top of `src/index.css` (`--brand` is the purple).
- Footer social icons are not linked until you add real URLs in `SOCIAL_LINKS` in `src/data/site.js`.
