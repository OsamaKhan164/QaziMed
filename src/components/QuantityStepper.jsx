import { MinusIcon, PlusIcon } from "./Icons.jsx";
import { clampQuantity, MAX_QUANTITY } from "../utils/cart.js";

export default function QuantityStepper({ value, onChange, label = "Quantity", disabled = false }) {
  return (
    <div className="stepper" role="group" aria-label={label}>
      <button type="button" onClick={() => onChange(clampQuantity(value - 1))} disabled={disabled || value <= 1} aria-label="Decrease quantity">
        <MinusIcon size={14} />
      </button>
      <input
        type="number"
        inputMode="numeric"
        min="1"
        max={MAX_QUANTITY}
        value={value}
        onChange={(e) => onChange(e.target.value === "" ? "" : clampQuantity(e.target.value))}
        onBlur={() => onChange(clampQuantity(value))}
        disabled={disabled}
        aria-label={label}
      />
      <button type="button" onClick={() => onChange(clampQuantity(value + 1))} disabled={disabled || value >= MAX_QUANTITY} aria-label="Increase quantity">
        <PlusIcon size={14} />
      </button>
    </div>
  );
}
