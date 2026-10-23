import { useEffect, useRef, useState } from "react";
import { useCart } from "../context/CartContext.jsx";
import { useFavorites } from "../context/FavoritesContext.jsx";
import { GridIcon, HomeIcon, LucideStarIcon, ShoppingCartIcon } from "./Icons.jsx";

// Phone-only navigation (hidden by CSS above 640px): a hamburger button that turns into an X and opens a
// floating panel with Home, View Products, Favorite Products and Cart. It reads the existing route, cart and favorites state.
export default function MobileMenu({ route, onOpenProducts }) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef(null);
  const { summary } = useCart();
  const { count: favCount } = useFavorites();
  const cartCount = summary.totalQuantity;

  // Escape closes the menu and returns focus to the button; leaving phone width closes it too.
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") { setOpen(false); buttonRef.current?.focus(); }
    };
    const onResize = () => { if (window.innerWidth > 640) setOpen(false); };
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  // A route change from anywhere (e.g. browser back) also closes it.
  useEffect(() => setOpen(false), [route]);

  const items = [
    { href: "#/", label: "Home", Icon: HomeIcon, active: route === "/", badge: 0 },
    { href: "#/products", label: "View Products", Icon: GridIcon, active: route === "/products", badge: 0, onSelect: onOpenProducts },
    { href: "#/favorites", label: "Favorite Products", Icon: LucideStarIcon, active: route === "/favorites", badge: favCount },
    { href: "#/cart", label: "Cart", Icon: ShoppingCartIcon, active: route === "/cart", badge: cartCount },
  ];

  return (
    <div className={`mmenu ${open ? "is-open" : ""}`}>
      <button
        ref={buttonRef}
        type="button"
        className="mmenu__burger"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="mobile-menu-panel"
        onClick={() => setOpen((o) => !o)}
      >
        <span /><span /><span />
      </button>
      <div className="mmenu__backdrop" onClick={() => setOpen(false)} aria-hidden="true" />
      <nav id="mobile-menu-panel" className="mmenu__panel" aria-label="Mobile">
        {items.map(({ href, label, Icon, active, badge, onSelect }, i) => (
          <a
            key={label}
            href={href}
            className={`mmenu__item ${active ? "is-active" : ""}`}
            style={{ "--i": i }}
            aria-current={active ? "page" : undefined}
            onClick={(e) => { setOpen(false); onSelect?.(e); }}
          >
            <span className="mmenu__icon"><Icon size={20} /></span>
            <span className="mmenu__label">{label}</span>
            {badge > 0 && <span className="mmenu__badge" aria-label={`${badge} ${label === "Cart" ? "items" : "favorites"}`}>{badge > 99 ? "99+" : badge}</span>}
          </a>
        ))}
      </nav>
    </div>
  );
}
