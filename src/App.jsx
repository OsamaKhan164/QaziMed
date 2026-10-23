import { useCallback, useEffect, useState } from "react";
import { CartProvider } from "./context/CartContext.jsx";
import { FavoritesProvider } from "./context/FavoritesContext.jsx";
import { useHashRoute } from "./hooks/useHashRoute.js";
import OfferMarquee from "./components/OfferMarquee.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import Products from "./pages/Products.jsx";
import Favorites from "./pages/Favorites.jsx";
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx";

const DEFAULT_FILTERS = { category: "All", query: "" };

export default function App() {
  const route = useHashRoute();
  // Category and search text of the Products page (kept here so they survive page changes).
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  // Code of the product picked from the search suggestions; the Products page scrolls to it.
  const [focusCode, setFocusCode] = useState(null);
  const clearFocus = useCallback(() => setFocusCode(null), []);

  // Called when a customer chooses a suggestion: show that product in the list.
  const openProduct = useCallback((product) => {
    setFilters({ category: "All", query: product.name });
    setFocusCode(product.productCode);
  }, []);

  // "View Products" / "View All" / "All Products" link: open the Products page with the full catalogue.
  const openProducts = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    if (window.location.hash === "#/products") window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Every new page starts at the top.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [route]);

  let page;
  if (route === "/cart") page = <Cart />;
  else if (route === "/checkout") page = <Checkout />;
  else if (route === "/favorites") page = <Favorites />;
  else if (route === "/products") {
    page = (
      <Products
        filters={filters}
        setFilters={setFilters}
        onSelectProduct={openProduct}
        focusCode={focusCode}
        clearFocus={clearFocus}
      />
    );
  } else page = <Home onOpenProducts={openProducts} />;

  return (
    <CartProvider>
      <FavoritesProvider>
        <OfferMarquee />
        <Navbar route={route} onOpenProducts={openProducts} />
        <main>{page}</main>
        <Footer />
      </FavoritesProvider>
    </CartProvider>
  );
}
