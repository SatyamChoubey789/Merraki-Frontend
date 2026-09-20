// ─── Brand tokens ────────────────────────────────────────────────────────────
// Exactly as given: bg #f5f7fb, text #253957

export const T = {
  bg: "#F5F7FB",
  surface: "#FFFFFF",
  ink: "#253957",
  inkMid: "rgba(37,57,87,0.75)",
  inkMuted: "rgba(37,57,87,0.55)",
  inkFaint: "rgba(37,57,87,0.35)",
  border: "rgba(37,57,87,0.10)",
  borderMid: "rgba(37,57,87,0.16)",
  borderFocus: "rgba(37,57,87,0.40)",
  primary: "#253957",
  primaryLight: "rgba(37,57,87,0.08)",
  primaryGlow: "rgba(37,57,87,0.12)",
  green: "#0D7A5F",
  greenPale: "rgba(13,122,95,0.08)",
  greenBorder: "rgba(13,122,95,0.22)",
  red: "#C0392B",
  redPale: "rgba(192,57,43,0.06)",
  redBorder: "rgba(192,57,43,0.22)",
} as const;

export const SANS = `"DM Sans", system-ui, sans-serif`;
export const MONO = `"DM Mono", ui-monospace, monospace`;

// ─── Backend-matched types ────────────────────────────────────────────────────
// Matches checkout.schema.ts → createOrderSchema

export interface BillingAddress {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  country: string;
  zip: string;
  company?: string;
}

export interface CheckoutFormValues {
  guestName: string;
  guestEmail: string;
  billingAddress: BillingAddress;
  items: { templateId: string }[];
  paymentMethod: "card" | "upi";
}

// POST /api/checkout/create-order → { success: true, data: CreateOrderResponse }
export interface CreateOrderResponse {
  orderId: string;
  razorpayOrderId: string;
  amount: number;       // smallest unit (paise for INR, cents for USD)
  currency: "INR" | "USD";
  keyId: string;
  guestName: string;
  guestEmail: string;
}

// Cart item shape used in the checkout summary
export interface CartItemForCheckout {
  id: number;
  templateId: string;
  name: string;
  slug: string;
  price_usd_cents: number;
  original_price_usd_cents: number;
  image?: string;
  category?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function formatUSD(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}