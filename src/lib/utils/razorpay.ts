import type { CreateOrderResponse } from "@/types/order.types";

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description?: string;
  image?: string;
  order_id: string;
  handler: (response: RazorpayPaymentResponse) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
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
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function initRazorpay(
  order: CreateOrderResponse,
  customerDetails: { name: string; email: string; phone?: string },
  onSuccess: (response: RazorpayPaymentResponse) => void,
  onDismiss: () => void,
): RazorpayInstance {
  const options: RazorpayOptions = {
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
    amount: order.amount,
    currency: order.currency,
    name: "Merraki Solutions",
    description: "Financial Templates & Resources",
    image: "/images/logo.png",
    order_id: order.razorpayOrderId,
    handler: onSuccess,
    prefill: {
      name: customerDetails.name,
      email: customerDetails.email,
      contact: customerDetails.phone,
    },
    theme: {
      color: "#1A56DB",
    },
    modal: {
      ondismiss: onDismiss,
    },
  };

  return new window.Razorpay(options);
}
