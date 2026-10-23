import { ShieldCheckIcon, TruckIcon, HeadsetIcon, TagIcon } from "./Icons.jsx";

const FEATURES = [
  { Icon: ShieldCheckIcon, title: "100% Genuine Products", text: "Original and trusted brands" },
  { Icon: TruckIcon, title: "Fast & Reliable Delivery", text: "On time, every time" },
  { Icon: HeadsetIcon, title: "Dedicated Support", text: "Always here to help" },
  { Icon: TagIcon, title: "Best Wholesale Rates", text: "More value for your business" },
];

// Four short selling points shown under the hero.
export default function TrustBar() {
  return (
    <section className="trust-band" aria-label="Why choose us">
     <div className="container trust-wrap">
      <ul className="trust">
        {FEATURES.map(({ Icon, title, text }) => (
          <li className="trust__item" key={title}>
            <span className="trust__icon"><Icon size={26} /></span>
            <span className="trust__text">
              <strong>{title}</strong>
              <small>{text}</small>
            </span>
          </li>
        ))}
      </ul>
     </div>
    </section>
  );
}
