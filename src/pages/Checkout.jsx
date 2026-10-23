import { useState } from "react";
import { useCart } from "../context/CartContext.jsx";
import { BUSINESS } from "../data/site.js";
import { formatPrice } from "../utils/format.js";
import { validateCheckout, validateStoreName, validateAddress } from "../utils/validation.js";
import { buildOrderMessage, buildWhatsAppUrl, isDesktopBrowser } from "../utils/whatsapp.js";
import { capitalizeFromInput } from "../utils/text.js";
import BackLink from "../components/BackLink.jsx";
import { WhatsAppIcon } from "../components/Icons.jsx";

// Fields whose text is shown in Title Case.
const CAPITALIZED = ["storeName", "address"];
const validators = { storeName: validateStoreName, address: validateAddress };

export default function Checkout() {
  const { summary, removeOutOfStock } = useCart();
  const [form, setForm] = useState({ storeName: "", address: "" });
  const [errors, setErrors] = useState({});
  const [opened, setOpened] = useState("");

  if (summary.lines.length === 0) {
    return (
      <div className="container page">
        <BackLink />
        <h1 className="page__title">Checkout</h1>
        <div className="empty">
          <p>Your cart is empty. Add products before checking out.</p>
          <a href="#/products" className="btn btn--primary">Browse Products</a>
        </div>
      </div>
    );
  }

  // Out-of-stock items cannot be ordered.
  if (summary.hasOutOfStock) {
    return (
      <div className="container page">
        <BackLink />
        <h1 className="page__title">Checkout</h1>
        <div className="notice notice--warn" role="alert">
          <p><strong>Some items in your cart are out of stock</strong> and cannot be ordered. Please remove them to continue.</p>
          <ul className="oos-list">
            {summary.outOfStockLines.map((l) => (
              <li key={l.productCode}>{l.name} <small>(Code {l.productCode})</small></li>
            ))}
          </ul>
          <div className="notice__actions">
            <button type="button" className="btn btn--primary" onClick={removeOutOfStock}>
              Remove out-of-stock items
            </button>
            <a href="#/cart" className="btn btn--outline">Back to cart</a>
          </div>
        </div>
      </div>
    );
  }

  const change = (field) => (e) => {
    let value = e.target.value;

    if (CAPITALIZED.includes(field) && !e.nativeEvent?.isComposing) {
      value = capitalizeFromInput(e.target);
    }

    setForm((f) => ({ ...f, [field]: value }));

    if (errors[field]) {
      setErrors((er) => ({
        ...er,
        [field]: validators[field](value),
      }));
    }
  };

  const blur = (field) => () => {
    setErrors((er) => ({
      ...er,
      [field]: validators[field](form[field]),
    }));
  };

  const submit = (e) => {
    e.preventDefault();
    if (summary.hasOutOfStock) return;

    const result = validateCheckout(form);
    setErrors(result.errors);

    if (!result.isValid) {
      const first = Object.keys(result.errors).find((k) => result.errors[k]);
      document.getElementById(`field-${first}`)?.focus();
      return;
    }

    const url = buildWhatsAppUrl(
      BUSINESS.whatsappNumber,
      buildOrderMessage(form, summary),
      { desktop: isDesktopBrowser() }
    );

    setOpened(url);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const field = (id, label, input) => (
    <div className={`field ${errors[id] ? "has-error" : ""}`}>
      <label htmlFor={`field-${id}`}>
        {label} <span aria-hidden="true">*</span>
      </label>
      {input}
      {errors[id] && (
        <p className="field__error" id={`err-${id}`} role="alert">
          {errors[id]}
        </p>
      )}
    </div>
  );

  const common = (id) => ({
    id: `field-${id}`,
    value: form[id],
    onChange: change(id),
    onBlur: blur(id),
    ...(CAPITALIZED.includes(id) && {
      autoCapitalize: "words",
      onCompositionEnd: change(id),
    }),
    "aria-invalid": errors[id] ? "true" : "false",
    "aria-describedby": errors[id] ? `err-${id}` : undefined,
  });

  return (
    <div className="container page">
      <BackLink />
      <h1 className="page__title">Checkout</h1>

      <div className="checkout">
        <form className="card checkout__form" onSubmit={submit} noValidate>
          <h2>Order Information</h2>

          {field(
            "storeName",
            "Pharmacy / Medical Store Name",
            <input
              type="text"
              placeholder="Enter store name"
              autoComplete="organization"
              maxLength={100}
              {...common("storeName")}
            />
          )}

          {field(
            "address",
            "Delivery Address",
            <textarea
              rows={3}
              placeholder="Enter complete delivery address"
              autoComplete="street-address"
              maxLength={300}
              {...common("address")}
            />
          )}

          <button type="submit" className="btn btn--whatsapp btn--block">
            <WhatsAppIcon size={20} /> Open WhatsApp to Send Order
          </button>

          <p className="hint">
            This opens WhatsApp with your order already typed.{" "}
            <strong>Your order is not sent until you press Send in WhatsApp.</strong>
          </p>

          {opened && (
            <div className="notice notice--info" role="status">
              <p>
                WhatsApp should now be open with your order message. Please review it and press <strong>Send</strong> there to place your order.
              </p>
              <p>
                Nothing opened?{" "}
                <a href={opened} target="_blank" rel="noopener noreferrer">
                  Tap here to open WhatsApp
                </a>.
              </p>
            </div>
          )}
        </form>

        <aside className="card checkout__summary" aria-label="Order summary">
          <h2>Order Summary</h2>
          <ul className="summary-list">
            {summary.lines.map((l) => (
              <li key={l.productCode}>
                <span className="summary-list__name">
                  {l.name}<small>Code {l.productCode}</small>
                </span>
                <span className="summary-list__qty">× {l.quantity}</span>
                <span className="summary-list__total">{formatPrice(l.lineTotal)}</span>
              </li>
            ))}
          </ul>

          <div className="summary-total">
            <span>Total Items</span><strong>{summary.totalItems}</strong>
          </div>
          <div className="summary-total summary-total--grand">
            <span>Total Amount</span><strong>{formatPrice(summary.grandTotal)}</strong>
          </div>
          <a href="#/cart" className="link-button">Edit cart</a>
        </aside>
      </div>
    </div>
  );
}