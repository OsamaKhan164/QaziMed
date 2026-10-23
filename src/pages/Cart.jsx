import { useCart } from "../context/CartContext.jsx";
import { formatPrice } from "../utils/format.js";
import ProductImage from "../components/ProductImage.jsx";
import QuantityStepper from "../components/QuantityStepper.jsx";
import BackLink from "../components/BackLink.jsx";
import { TrashIcon, ArrowRightIcon } from "../components/Icons.jsx";

export default function Cart() {
  const { summary, update, remove, removeOutOfStock, clear } = useCart();

  if (summary.lines.length === 0) {
    return (
      <div className="container page">
        <BackLink />
        <h1 className="page__title">Your Cart</h1>
        <div className="empty">
          <p>Your cart is empty.</p>
          <a href="#/products" className="btn btn--primary">Browse Products</a>
        </div>
      </div>
    );
  }

  return (
    <div className="container page">
      <BackLink />
      <div className="page__head">
        <h1 className="page__title">Your Cart</h1>
        <button type="button" className="link-button" onClick={clear}>Clear cart</button>
      </div>

      <div className="cart card">
        <div className="cart__row cart__row--head" aria-hidden="true">
          <span>Product</span><span>Price</span><span>Quantity</span><span>Subtotal</span><span />
        </div>
        <div className="cart__rows">
          {summary.lines.map((l) => (
            <div className={`cart__row ${l.inStock ? "" : "cart__row--oos"}`} key={l.productCode}>
              <div className="cart__product">
                <div className="cart__thumb"><ProductImage image={l.image} name={l.name} /></div>
                <div>
                  <p className="cart__name">{l.name}</p>
                  <p className="cart__code">Code: {l.productCode}</p>
                  {!l.inStock && <p className="cart__oos">Out of Stock - please remove</p>}
                </div>
              </div>
              <div className="cart__cell" data-label="Price">{formatPrice(l.price)}</div>
              <div className="cart__cell" data-label="Quantity">
                <QuantityStepper value={l.quantity} onChange={(q) => update(l.productCode, q)} label={`Quantity for ${l.name}`} disabled={!l.inStock} />
              </div>
              <div className="cart__cell cart__subtotal" data-label="Subtotal">{l.inStock ? formatPrice(l.lineTotal) : "-"}</div>
              <button type="button" className="icon-btn" onClick={() => remove(l.productCode)} aria-label={`Remove ${l.name}`}>
                <TrashIcon size={18} />
              </button>
            </div>
          ))}
        </div>

        <div className="cart__total">
          <div>
            <p>Total Items: <strong>{summary.totalItems}</strong></p>
            <p className="cart__grand">Total Amount <strong>{formatPrice(summary.grandTotal)}</strong></p>
          </div>
        </div>
      </div>

      {summary.hasOutOfStock && (
        <div className="notice notice--warn" role="alert">
          <p>
            <strong>Some items in your cart are out of stock</strong> and cannot be ordered:{" "}
            {summary.outOfStockLines.map((l) => l.name).join(", ")}. Please remove them to continue to checkout.
          </p>
          <div><button type="button" className="btn btn--outline" onClick={removeOutOfStock}>Remove out-of-stock items</button></div>
        </div>
      )}

      <div className="page__actions">
        <a href="#/products" className="btn btn--outline">Continue Shopping</a>
        {summary.hasOutOfStock ? (
          <button type="button" className="btn btn--primary" disabled>Proceed to Checkout <ArrowRightIcon size={18} /></button>
        ) : (
          <a href="#/checkout" className="btn btn--primary">Proceed to Checkout <ArrowRightIcon size={18} /></a>
        )}
      </div>
    </div>
  );
}
