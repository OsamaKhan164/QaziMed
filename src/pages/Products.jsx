import { useEffect, useMemo, useState } from "react";
import { products, CATEGORIES } from "../data/products.js";
import { countByCategory, filterProducts } from "../utils/search.js";
import ProductSearch from "../components/ProductSearch.jsx";
import ProductCard from "../components/ProductCard.jsx";
import { CATEGORY_ICONS, ChevronRightIcon } from "../components/Icons.jsx";

const PAGE_SIZE = 24;
const counts = countByCategory(products);
const ALL = ["All", ...CATEGORIES];

// Products page ("#/products"): sticky category sidebar, sticky heading + search row, and the product grid.
export default function Products({ filters, setFilters, focusCode, clearFocus, onSelectProduct }) {
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [highlight, setHighlight] = useState(null);
  const results = useMemo(() => filterProducts(products, filters), [filters]);

  // Start from the first page again whenever the filters change.
  useEffect(() => setVisible(PAGE_SIZE), [filters.category, filters.query]);

  // A suggestion was chosen: make sure its card is on screen, scroll to it and highlight it briefly.
  useEffect(() => {
    if (!focusCode) return;
    const index = results.findIndex((p) => p.productCode === focusCode);
    if (index < 0) { clearFocus(); return; }
    if (index >= visible) { setVisible(Math.ceil((index + 1) / PAGE_SIZE) * PAGE_SIZE); return; }
    const card = document.getElementById(`product-${focusCode}`);
    if (!card) return;
    card.scrollIntoView({ behavior: "smooth", block: "center" });
    setHighlight(focusCode);
    clearFocus();
  }, [focusCode, results, visible, clearFocus]);

  useEffect(() => {
    if (!highlight) return undefined;
    const id = setTimeout(() => setHighlight(null), 2800);
    return () => clearTimeout(id);
  }, [highlight]);

  const shown = results.slice(0, visible);
  const setCategory = (category) => setFilters((f) => ({ ...f, category }));

  return (
    <section className="catalogue-band" aria-label="All Products">
    <div className="container all-products">
    <div className="products-layout">
      <aside className="sidebar" aria-label="Categories">
        <h2 className="sidebar__title"><CATEGORY_ICONS.All size={20} /> Categories</h2>
        <ul>
          {ALL.map((cat) => {
            const Icon = CATEGORY_ICONS[cat];
            const count = cat === "All" ? products.length : counts[cat] || 0;
            return (
              <li key={cat}>
                <button
                  type="button"
                  className={`sidebar__item ${filters.category === cat ? "is-active" : ""}`}
                  onClick={() => setCategory(cat)}
                  aria-pressed={filters.category === cat}
                >
                  <Icon size={18} />
                  <span>{cat === "All" ? "All Products" : cat}</span>
                  <em>{count.toLocaleString("en-US")}</em>
                  <ChevronRightIcon size={14} className="sidebar__chevron" />
                </button>
              </li>
            );
          })}
        </ul>
      </aside>

      <div className="products-main">
        <div className="chips" role="group" aria-label="Categories">
          {ALL.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`chip ${filters.category === cat ? "is-active" : ""}`}
              onClick={() => setCategory(cat)}
              aria-pressed={filters.category === cat}
            >
              {cat === "All" ? "All" : cat}
            </button>
          ))}
        </div>

        <div className="products-head">
          <h1 className="products-head__title">
            {filters.category === "All" ? "All Products" : filters.category}
            <span className="products-head__count" aria-label={`${results.length} products`}>({results.length.toLocaleString("en-US")})</span>
          </h1>
          <ProductSearch
            id="products-search"
            value={filters.query}
            onChange={(query) => setFilters((f) => ({ ...f, query }))}
            onSelect={onSelectProduct}
            placeholder="Search medicines..."
          />
        </div>

        {results.length === 0 ? (
          <div className="empty">
            <p>No products match your search.</p>
            <button type="button" className="btn btn--primary" onClick={() => setFilters({ category: "All", query: "" })}>
              Clear search and filters
            </button>
          </div>
        ) : (
          <>
            <div className="product-grid">
              {shown.map((p) => <ProductCard key={p.productCode} product={p} highlighted={highlight === p.productCode} showFavorite />)}
            </div>
            <div className="load-more">
              <p>Showing {shown.length} of {results.length}</p>
              {shown.length < results.length && (
                <button type="button" className="btn btn--outline" onClick={() => setVisible((v) => v + PAGE_SIZE)}>
                  Load more products
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
    </div>
    </section>
  );
}
