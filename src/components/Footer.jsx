import { BUSINESS, SOCIAL_LINKS } from "../data/site.js";
import { buildWhatsAppUrl } from "../utils/whatsapp.js";
import Logo from "./Logo.jsx";
import { PhoneIcon, MailIcon, PinIcon, WhatsAppIcon, FacebookIcon, YouTubeIcon, TikTokIcon } from "./Icons.jsx";
import { scrollToId } from "../utils/scroll.js";

// Social icons: WhatsApp always opens the business chat. The others become links only
// when a real URL is filled in SOCIAL_LINKS (src/data/site.js); until then they are plain icons.
function Social({ label, url, children, external = true }) {
  const props = url ? { href: url, "aria-label": label, ...(external ? { target: "_blank", rel: "noopener noreferrer" } : {}) } : { "aria-hidden": true };
  const Tag = url ? "a" : "span";
  return <Tag className={`social ${url ? "" : "is-plain"}`} {...props}>{children}</Tag>;
}

export default function Footer() {
  const goTo = (id) => (e) => {
    e.preventDefault();
    scrollToId(id);
  };
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div id="about">
          <Logo />
          <p className="footer__tagline">Your trusted partner in healthcare. Quality medicines, reliable service.</p>
        </div>
        <div>
          <h3>Quick Links</h3>
          <ul className="footer__list">
            <li><a href="#/">Home</a></li>
            <li><a href="#/products">All Products</a></li>
            <li><a href="#about" onClick={goTo("about")}>About Us</a></li>
            <li><a href="#contact" onClick={goTo("contact")}>Contact</a></li>
          </ul>
        </div>
        <div id="contact">
          <h3>Contact Us</h3>
          <ul className="footer__list footer__list--icons">
            <li><PhoneIcon size={16} /><a href={`tel:${BUSINESS.phoneDisplay}`}>{BUSINESS.phoneDisplay}</a></li>
            <li><MailIcon size={16} /><a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a></li>
            <li><PinIcon size={16} /><span>{BUSINESS.address}</span></li>
          </ul>
        </div>
        <div>
          <h3>Follow Us</h3>
          <div className="socials">
            <Social label="Facebook" url={SOCIAL_LINKS.facebook}><FacebookIcon size={18} /></Social>
            <Social label="WhatsApp" url={buildWhatsAppUrl(BUSINESS.whatsappNumber)}><WhatsAppIcon size={18} /></Social>
            <Social label="YouTube" url={SOCIAL_LINKS.youtube}><YouTubeIcon size={18} /></Social>
            <Social label="TikTok" url={SOCIAL_LINKS.tiktok}><TikTokIcon size={18} /></Social>
          </div>
        </div>
      </div>
      <div className="footer__bottom">
        <div className="container footer__bottom-inner">
          <span>© {new Date().getFullYear()} {BUSINESS.name}. All rights reserved.</span>
          <span>Wholesale Medicines | Trusted Distribution | Better Health Together</span>
        </div>
      </div>
    </footer>
  );
}
