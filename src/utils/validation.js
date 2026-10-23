// Checkout form validation. Each function returns an error message, or "" when valid.

export function normalizeMobile(input) {
  let digits = String(input || "").replace(/[\s\-().]/g, "");
  if (digits.startsWith("+")) digits = digits.slice(1);
  if (digits.startsWith("92") && digits.length === 12) digits = "0" + digits.slice(2);
  return digits;
}

export function validateStoreName(value) {
  const v = String(value || "").trim();
  if (!v) return "Please enter your pharmacy / medical store name.";
  if (v.length < 3) return "Store name looks too short.";
  if (v.length > 100) return "Store name is too long (maximum 100 characters).";
  return "";
}

// Keeps only digits and at most 11 of them. A pasted "+92 347 2541767" becomes 03472541767.
export function sanitizeMobileInput(input) {
  let digits = String(input || "").replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("923")) digits = "0" + digits.slice(2);
  return digits.slice(0, 11);
}

// Pakistani mobile number: exactly 11 digits, starting with 03 (e.g. 03472541767).
export function validateMobile(value) {
  const v = String(value || "").trim();
  if (!v) return "Please enter your mobile number.";
  if (!/^\d+$/.test(v)) return "Mobile number can contain digits only, e.g. 03472541767.";
  if (!v.startsWith("03")) return "Mobile number must start with 03, e.g. 03472541767.";
  if (v.length !== 11) return `Mobile number must be exactly 11 digits, e.g. 03472541767 (you entered ${v.length}).`;
  return "";
}

export function validateAddress(value) {
  const v = String(value || "").trim();
  if (!v) return "Please enter the delivery address.";
  if (v.length < 10) return "Please enter the complete delivery address (area, street/shop, city).";
  if (v.length > 300) return "Address is too long (maximum 300 characters).";
  return "";
}

export function validateCheckout(form) {
  const errors = {
    storeName: validateStoreName(form.storeName),
    mobile: validateMobile(form.mobile),
    address: validateAddress(form.address),
  };
  const isValid = Object.values(errors).every((e) => e === "");
  return { errors, isValid };
}
