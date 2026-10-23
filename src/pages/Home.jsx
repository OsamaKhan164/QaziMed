import { products, CATEGORIES } from "../data/products.js";
import { BUSINESS, FEATURED_CODES } from "../data/site.js";
import { buildWhatsAppUrl } from "../utils/whatsapp.js";
import Carousel from "../components/Carousel.jsx";
import TrustBar from "../components/TrustBar.jsx";
import ProductCard from "../components/ProductCard.jsx";
import { ArrowRightIcon, WhatsAppIcon } from "../components/Icons.jsx";

function getFeatured() {
  if (FEATURED_CODES.length > 0) {
    return FEATURED_CODES.map((c) => products.find((p) => p.productCode === c)).filter(Boolean);
  }
  // Auto-pick: the first product of each of the first four categories.
  return CATEGORIES.slice(0, 4)
    .map((cat) => products.find((p) => p.category === cat))
    .filter(Boolean);
}
const featured = getFeatured();

// Home page: hero, trust row and featured products. The full catalogue lives on the Products page.
export default function Home({ onOpenProducts }) {
  return (
    <>
      <section className="hero-band">
       <div className="container hero-wrap">
        <div className="hero">
          <div className="hero__content">
            <p className="hero__eyebrow">Your trusted pharma partner</p>
            <h1>Quality Medicines.<br /><span>Reliable Service.</span></h1>
            <p className="hero__text">Order wholesale medicines for your pharmacy with ease and at the best rates.</p>
            <div className="hero__actions">
              <a href="#/products" className="btn btn--primary hero__btn" onClick={onOpenProducts}>
                View Products <ArrowRightIcon size={18} />
              </a>
              <a
                href={buildWhatsAppUrl(BUSINESS.whatsappNumber)}
                className="btn btn--outline hero__btn"
                target="_blank"
                rel="noopener noreferrer"
              >
                <WhatsAppIcon size={18} /> Contact Us
              </a>
            </div>
          </div>
          <Carousel />
        </div>
       </div>
      </section>

      <TrustBar />

      <section className="featured-band" id="featured">
       <div className="container featured-wrap">
        <div className="featured">
          <div className="section__head">
            <h2>Featured Products</h2>
            <a href="#/products" className="link-arrow" onClick={onOpenProducts}>
              View All <ArrowRightIcon size={16} />
            </a>
          </div>
          <div className="product-grid product-grid--featured">
            {featured.map((p) => <ProductCard key={p.productCode} product={p} />)}
          </div>
        </div>
       </div>
      </section>

    </>
  );
}
