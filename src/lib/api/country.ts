// The billing country decides the charge currency. A Razorpay order is fixed to
// one currency when it is created, so this has to be known BEFORE the payment
// window opens — which is why it comes from the address, not from a picker.
//
// India → INR (the window then offers every INR method on your Razorpay
// account: cards, UPI, etc.). Everywhere else → USD.

const INDIA = new Set(["in", "ind", "india", "bharat", "republic of india"]);

export function isIndia(country: string | undefined | null): boolean {
  if (!country) return false;
  return INDIA.has(country.replace(/\./g, "").trim().toLowerCase());
}