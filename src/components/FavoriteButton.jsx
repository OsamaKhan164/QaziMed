import { useFavorites } from "../context/FavoritesContext.jsx";
import { StarIcon, StarFilledIcon } from "./Icons.jsx";

// Small star in the corner of a product card: outline = not saved, filled = saved as a favorite.
export default function FavoriteButton({ product }) {
  const { isFavorite, toggle } = useFavorites();
  const saved = isFavorite(product.productCode);
  return (
    <button
      type="button"
      className={`fav-btn ${saved ? "is-saved" : ""}`}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${product.name} from favorites` : `Add ${product.name} to favorites`}
      title={saved ? "Remove from favorites" : "Add to favorites"}
      onClick={(e) => {
        e.stopPropagation(); // never reaches the card or the Add to Cart button
        toggle(product.productCode);
      }}
    >
      {saved ? <StarFilledIcon size={18} /> : <StarIcon size={18} />}
    </button>
  );
}
