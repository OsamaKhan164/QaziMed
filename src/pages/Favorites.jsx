import { useMemo, useState } from "react";
import { useFavorites } from "../context/FavoritesContext.jsx";
import { filterProducts } from "../utils/search.js";
import ProductSearch from "../components/ProductSearch.jsx";
import ProductCard from "../components/ProductCard.jsx";
import { StarIcon } from "../components/Icons.jsx";

// Favorite Products page ("#/favorites"): the customer's saved products, with live search by name or code.
// Cards are the same ProductCard used on All Products, so quantity and Add to Cart work exactly the same.
export default function Favorites() {
  const { favoriteProducts, count } = useFavorites();
  const [query, setQuery] = useState("");
  const results = useMemo(() => filterProducts(favoriteProducts, { query }), [favoriteProducts, query]);

  return (
    <section className="catalogue-band" aria-label="Favorite Products">
    <div className="container all-products">
      <div className="products-layout products-layout--single">
        <div className="products-main">
          <div className="products-head products-head--fav">
            <h1 className="products-head__title">
              My Favorite Products
              <span className="products-head__count" aria-label={`${count} favorite products`}>
                {" "}— {count.toLocaleString("en-US")} Favorite {count === 1 ? "Product" : "Products"}
              </span>
            </h1>
            {count > 0 && (
              <ProductSearch
                id="favorites-search"
                value={query}
                onChange={setQuery}
                suggest={false}
                placeholder="Search favorites..."
              />
            )}
          </div>

          {count === 0 ? (
            <div className="empty">
              <StarIcon size={34} />
              <p>You have no favorite products yet. Tap the star on any product in All Products to save it here.</p>
              <a href="#/products" className="btn btn--primary">Browse All Products</a>
            </div>
          ) : results.length === 0 ? (
            <div className="empty">
              <p>No matching favorite products found</p>
              <button type="button" className="btn btn--primary" onClick={() => setQuery("")}>Clear search</button>
            </div>
          ) : (
            <div className="product-grid product-grid--fav">
              {results.map((p) => <ProductCard key={p.productCode} product={p} showFavorite />)}
            </div>
          )}
        </div>
      </div>
    </div>
    </section>
  );
}
