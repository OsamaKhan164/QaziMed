import Logo from "./Logo.jsx";
import HeaderCart from "./HeaderCart.jsx";
import MobileMenu from "./MobileMenu.jsx";
import { StarIcon } from "./Icons.jsx";

// Top navigation: brand on the left, links, and the cart icon with its item count on the right.
// On phones the links are replaced by a hamburger menu (MobileMenu) next to the cart icon.
// No login / sign-in - this site has no accounts.
export default function Navbar({ route, onOpenProducts }) {
  return (
    <header className="navbar">
      <div className="container navbar__inner">
        <a href="#/" className="navbar__brand" aria-label="Qazi Medicine Company - home">
          <Logo />
        </a>
        <nav className="navbar__nav" aria-label="Main">
          <a href="#/" className={`navbar__link ${route === "/" ? "is-active" : ""}`}>Home</a>
          <a href="#/products" className={`navbar__link ${route === "/products" ? "is-active" : ""}`} onClick={onOpenProducts}>All Products</a>
          <a href="#/favorites" className={`navbar__link navbar__link--fav ${route === "/favorites" ? "is-active" : ""}`}>
            <StarIcon size={16} /> Favorite Products
          </a>
        </nav>
        <div className="navbar__tools">
          <HeaderCart />
          <MobileMenu route={route} onOpenProducts={onOpenProducts} />
        </div>
      </div>
    </header>
  );
}
