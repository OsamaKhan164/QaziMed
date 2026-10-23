import { useCart } from "../context/CartContext.jsx";
import { CartIcon } from "./Icons.jsx";

// Cart icon for the top-right of the home page hero. The badge shows the total item
// quantity and updates as soon as the cart changes. Clicking it opens the cart page.
export default function HeaderCart() {
  const { summary } = useCart();
  const count = summary.totalQuantity;
  return (
    <a
      href="#/cart"
      className="header-cart"
      aria-label={count === 1 ? "Open cart, 1 item" : `Open cart, ${count} items`}
      title="Cart"
    >
      <CartIcon size={26} />
      <span className={`header-cart__badge ${count === 0 ? "is-empty" : ""}`} aria-hidden="true">
        {count > 99 ? "99+" : count}
      </span>
    </a>
  );
}
