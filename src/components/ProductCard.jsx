// import { useEffect, useRef, useState } from "react";
// import { useCart } from "../context/CartContext.jsx";
// import { formatPrice } from "../utils/format.js";
// import { clampQuantity, isInStock } from "../utils/cart.js";
// import ProductImage from "./ProductImage.jsx";
// import QuantityStepper from "./QuantityStepper.jsx";
// import FavoriteButton from "./FavoriteButton.jsx";
// import { CartIcon } from "./Icons.jsx";

// // How long the green "Added to Cart" confirmation stays on a card's button.
// const ADDED_FEEDBACK_MS = 2000;

// // showFavorite: shows the favorite star (used on the All Products and Favorite Products pages).
// export default function ProductCard({ product, highlighted = false, showFavorite = false }) {
//   const { add } = useCart();
//   const [qty, setQty] = useState(1);
//   const [added, setAdded] = useState(false);
//   const timer = useRef(null);
//   useEffect(() => () => clearTimeout(timer.current), []);

//   const inStock = isInStock(product);

//   const handleAdd = () => {
//     if (!inStock) return;
//     add(product.productCode, clampQuantity(qty));
//     setQty(1);
//     setAdded(true);
//     clearTimeout(timer.current);
//     timer.current = setTimeout(() => setAdded(false), ADDED_FEEDBACK_MS);
//   };

//   return (
//     <article className={`product-card ${highlighted ? "is-highlighted" : ""} ${inStock ? "" : "is-out"}`} id={`product-${product.productCode}`}>
//       <div className="product-card__image">
//         <ProductImage image={product.image} name={product.name} />
//         {showFavorite && <FavoriteButton product={product} />}
//       </div>
//       <h3 className="product-card__name" title={product.name}>{product.name}</h3>
//       <p className="product-card__category">{product.category}</p>
//       <p className="product-card__code">Code: {product.productCode}</p>
//       <p className="product-card__price">{formatPrice(product.price)}</p>
//       <QuantityStepper value={qty} onChange={setQty} label={`Quantity for ${product.name}`} disabled={!inStock} />
//       {inStock ? (
//         <button type="button" className={`btn btn--primary btn--block ${added ? "is-added" : ""}`} onClick={handleAdd}>
//           {added ? "\u2713 Added to Cart" : <><CartIcon size={16} /> Add to Cart</>}
//         </button>
//       ) : (
//         <button type="button" className="btn btn--primary btn--block" disabled>Out of Stock</button>
//       )}
//     </article>
//   );
// }



import { useEffect, useRef, useState } from "react";
import { useCart } from "../context/CartContext.jsx";
import { useFavorites } from "../context/FavoritesContext.jsx";
import { formatPrice } from "../utils/format.js";
import { clampQuantity, isInStock } from "../utils/cart.js";
import ProductImage from "./ProductImage.jsx";
import QuantityStepper from "./QuantityStepper.jsx";
import FavoriteButton from "./FavoriteButton.jsx";
import { CartIcon } from "./Icons.jsx";

const ADDED_FEEDBACK_MS = 2000;

export default function ProductCard({
  product,
  highlighted = false,
  showFavorite = false,
}) {
  const { add } = useCart();
  const { addFavorite } = useFavorites();

  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const inStock = isInStock(product);

  const handleAdd = () => {
    if (!inStock) return;

    add(product.productCode, clampQuantity(qty));

    // Automatically add the product to Favorites.
    addFavorite(product.productCode);

    setQty(1);
    setAdded(true);

    clearTimeout(timer.current);
    timer.current = setTimeout(
      () => setAdded(false),
      ADDED_FEEDBACK_MS
    );
  };

  return (
    <article
      className={`product-card ${highlighted ? "is-highlighted" : ""} ${
        inStock ? "" : "is-out"
      }`}
      id={`product-${product.productCode}`}
    >
      <div className="product-card__image">
        <ProductImage image={product.image} name={product.name} />
        {showFavorite && <FavoriteButton product={product} />}
      </div>

      <h3 className="product-card__name" title={product.name}>
        {product.name}
      </h3>

      <p className="product-card__category">{product.category}</p>

      <p className="product-card__code">
        Code: {product.productCode}
      </p>

      <p className="product-card__price">
        {formatPrice(product.price)}
      </p>

      <QuantityStepper
        value={qty}
        onChange={setQty}
        label={`Quantity for ${product.name}`}
        disabled={!inStock}
      />

      {inStock ? (
        <button
          type="button"
          className={`btn btn--primary btn--block ${
            added ? "is-added" : ""
          }`}
          onClick={handleAdd}
        >
          {added ? (
            "\u2713 Added to Cart"
          ) : (
            <>
              <CartIcon size={16} /> Add to Cart
            </>
          )}
        </button>
      ) : (
        <button
          type="button"
          className="btn btn--primary btn--block"
          disabled
        >
          Out of Stock
        </button>
      )}
    </article>
  );
}
