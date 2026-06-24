import type { InitiatePaymentResponse } from "@/types/order.types";

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

export interface RazorpayOptions {
  key: string;
  amount: number;       // smallest currency unit (cents) — integer, no conversion
  name: string;
  description?: string;
  order_id: string;
  handler: (response: RazorpayPaymentResponse) => void;
  prefill?: { name?: string; email?: string; contact?: string };
  theme?: { color?: string };
  modal?: { ondismiss?: () => void };
}

export interface RazorpayPaymentResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface RazorpayInstance {
  open: () => void;
  close: () => void;
}

export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window !== "undefined" && window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload  = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function initRazorpay(
  paymentData: InitiatePaymentResponse,
  customer: { name: string; email: string; phone?: string },
  onSuccess: (response: RazorpayPaymentResponse) => void,
  onDismiss: () => void,
): RazorpayInstance {
  const options: RazorpayOptions = {
    key:         paymentData.key_id,
    // FIX: backend now sends amount_cents (integer, already in smallest unit).
    // No × 100 needed — that was converting dollars back to cents, which
    // introduced float rounding risk on prices like $10.99 → 1098.9999...
    amount:      paymentData.amount_cents,
    name:        "Merraki",
    description: "Financial Templates",
    order_id:    paymentData.razorpay_order_id,
    handler:     onSuccess,
    prefill: {
      name:    customer.name,
      email:   customer.email,
      contact: customer.phone,
    },
    theme: { color: "#3B7BF6" },
    modal: { ondismiss: onDismiss },
  };
  return new window.Razorpay(options);
}