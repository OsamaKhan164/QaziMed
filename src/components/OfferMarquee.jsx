import { OFFER_TEXT } from "../data/site.js";

// Slow, smooth scrolling offer bar. The text is repeated so the loop has no gap.
export default function OfferMarquee() {
  const items = Array.from({ length: 6 });
  const track = (hidden) => (
    <div className="marquee__group" aria-hidden={hidden || undefined}>
      {items.map((_, i) => (
        <span className="marquee__item" key={i}>{OFFER_TEXT}</span>
      ))}
    </div>
  );
  return (
    <div className="marquee" role="region" aria-label="Special offer">
      <div className="marquee__track">
        {track(false)}
        {track(true)}
      </div>
    </div>
  );
}
