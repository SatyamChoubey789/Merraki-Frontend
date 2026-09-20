"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/stores/useCartStore";
import type { CheckoutFormValues } from "@/components/sections/checkout/checkout.schema";
import type { CreateOrderResponse } from "@/components/sections/checkout/checkout.types";

// ─── Razorpay SDK types ───────────────────────────────────────────────────────

declare global {
  interface Window {
    Razorpay: new (opts: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  order_id: string;
  name: string;
  description: string;
  prefill: { name: string; email: string };
  handler: (response: RazorpayPaymentResponse) => void;
  modal: { ondismiss: () => void };
  theme: { color: string };
}

interface RazorpayPaymentResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayInstance {
  open(): void;
}

// ─── Hook state ───────────────────────────────────────────────────────────────

type CheckoutPhase =
  | "idle"        // form visible
  | "creating"    // POST /checkout/create-order in flight
  | "paying"      // Razorpay modal open
  | "verifying"   // POST /payments/verify in flight
  | "done";       // redirect imminent

interface UseCheckoutReturn {
  phase: CheckoutPhase;
  isProcessing: boolean;   // true during creating | paying | verifying
  error: string | null;
  initiateCheckout: (data: CheckoutFormValues) => Promise<void>;
}

// ─── Helper: load Razorpay SDK once ──────────────────────────────────────────

let sdkReady = false;

async function loadRazorpay(): Promise<void> {
  if (sdkReady || window.Razorpay) {
    sdkReady = true;
    return;
  }
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => {
      sdkReady = true;
      resolve();
    };
    script.onerror = () => reject(new Error("Razorpay SDK failed to load"));
    document.body.appendChild(script);
  });
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useCheckout(): UseCheckoutReturn {
  const router = useRouter();
  const clearCart = useCartStore((s) => s.clearCart);

  const [phase, setPhase] = useState<CheckoutPhase>("idle");
  const [error, setError] = useState<string | null>(null);

  const isProcessing = phase === "creating" || phase === "paying" || phase === "verifying";

  const initiateCheckout = async (data: CheckoutFormValues) => {
    setError(null);
    setPhase("creating");

    try {
      // ── 1. Create Razorpay order on backend ──────────────────────────────
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/checkout/create-order`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        },
      );

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error?.message ?? `Order failed (${res.status})`);
      }

      const { data: order }: { data: CreateOrderResponse } = await res.json();

      // ── 2. Load SDK ───────────────────────────────────────────────────────
      await loadRazorpay();
      setPhase("paying");

      // ── 3. Open Razorpay modal ────────────────────────────────────────────
      await new Promise<void>((resolve, reject) => {
        const rzp = new window.Razorpay({
          key: order.keyId,
          amount: order.amount,
          currency: order.currency,
          order_id: order.razorpayOrderId,
          name: "Merraki Solutions",
          description: `${data.items.length} template${data.items.length !== 1 ? "s" : ""}`,
          prefill: { name: order.guestName, email: order.guestEmail },
          theme: { color: "#253957" },

          // ── 4. Payment captured — verify signature ──────────────────────
          handler: async (response: RazorpayPaymentResponse) => {
            try {
              setPhase("verifying");
              router.push("/checkout/processing");

              const verifyRes = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/payments/verify`,
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                  }),
                },
              );

              if (!verifyRes.ok) {
                const body = await verifyRes.json().catch(() => ({}));
                throw new Error(body?.error?.message ?? "Verification failed");
              }

              // ── 5. Success — clear cart and redirect ──────────────────
              clearCart();
              setPhase("done");
              router.push(`/checkout/success?order=${order.orderId}`);
              resolve();
            } catch (err: any) {
              reject(err);
            }
          },

          modal: {
            ondismiss: () => {
              // User closed modal without paying — back to form
              setPhase("idle");
              resolve(); // resolve so the outer promise doesn't hang
            },
          },
        });

        rzp.open();
      });
    } catch (err: any) {
      const message = err?.message ?? "Something went wrong";
      setError(message);
      setPhase("idle");
      router.push(`/checkout/failure?reason=${encodeURIComponent(message)}`);
    }
  };

  return { phase, isProcessing, error, initiateCheckout };
}