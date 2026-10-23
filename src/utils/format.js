// Formats a number as Pakistani Rupees (display only - the stored number is never changed):
//   whole amounts have no decimals ......... 4 -> "Rs. 4", 1690 -> "Rs. 1,690"
//   fractional amounts keep 2 decimals ..... 125.5 -> "Rs. 125.50"
//   zero is shown with 2 decimals .......... 0 -> "Rs. 0.00"
// Working in whole paisa (cents) avoids floating-point surprises such as 0.1 * 3 = 0.30000000000000004.
export function formatPrice(value) {
  const cents = Math.round((Number(value) || 0) * 100);
  if (cents === 0) return "Rs. 0.00";
  const rupees = cents / 100;
  if (cents % 100 === 0) return `Rs. ${rupees.toLocaleString("en-US")}`;
  return `Rs. ${rupees.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// Avoids floating point surprises such as 0.1 * 3 = 0.30000000000000004.
export function roundMoney(value) {
  return Math.round((Number(value) || 0) * 100) / 100;
}
