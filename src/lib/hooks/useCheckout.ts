"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/stores/useCartStore";
import type { CheckoutFormValues } from "@/components/sections/checkout/checkout.schema";
import {
  ApiRequestError,
  createOrder,
  verifyPayment,
  storeDownloads,
  type CreateOrderData,
  type VerifyBody,
  type VerifyResult,
} from "@/lib/api/checkout";

// ─── Razorpay SDK types (minimal) ─────────────────────────────────────────────

declare global {
  interface Window {
    Razorpay: new (opts: RazorpayOptions) => { open(): void };
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
  theme: { color: string };
  handler: (response: VerifyBody) => void;
  modal: { ondismiss: () => void };
}

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

// ─── Verify + wait for capture ────────────────────────────────────────────────
// A 202 means Razorpay hasn't captured yet; the webhook will. /verify is
// idempotent, so we just ask again. 12 × 4s ≈ 48s, ≈15 calls/min — under the
// backend's 20/min limit on /verify.

const POLL_INTERVAL_MS = 4000;
const POLL_ATTEMPTS = 12;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function confirmPayment(body: VerifyBody, onWaiting: () => void): Promise<VerifyResult> {
  let result = await verifyPayment(body);
  if (result.status === "paid") return result;

  onWaiting();
  for (let i = 0; i < POLL_ATTEMPTS; i++) {
    await sleep(POLL_INTERVAL_MS);
    try {
      result = await verifyPayment(body);
      if (result.status === "paid") return result;
    } catch (err) {
      if (err instanceof ApiRequestError && err.code === "PAYMENT_FAILED") throw err;
      // anything else is transient — keep polling
    }
  }
  return result; // still processing; the webhook will finish it
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export type CheckoutPhase =
  | "idle"
  | "creating" // POST /checkout/create-order in flight
  | "paying" // Razorpay window open
  | "verifying" // POST /payments/verify in flight
  | "confirming" // 202 — waiting for the bank to capture
  | "done"; // redirecting

export function useCheckout() {
  const router = useRouter();
  const clearCart = useCartStore((s) => s.clearCart);

  const [phase, setPhase] = useState<CheckoutPhase>("idle");
  const [error, setError] = useState<string | null>(null);

  const busy = useRef(false); // blocks double-clicks (state updates are async)
  const settled = useRef(false); // set once Razorpay reports success

  const goToSuccess = useCallback(
    (orderId: string, pending: boolean) => {
      clearCart();
      setPhase("done");
      router.push(`/checkout/success?order=${orderId}${pending ? "&state=pending" : ""}`);
    },
    [clearCart, router],
  );

  // Runs after Razorpay's window reports a successful payment.
  const finalize = useCallback(
    async (order: CreateOrderData, response: VerifyBody) => {
      settled.current = true;
      setPhase("verifying");

      try {
        const result = await confirmPayment(response, () => setPhase("confirming"));

        if (result.status === "paid") {
          storeDownloads(result);
          goToSuccess(result.orderId, false);
        } else {
          goToSuccess(order.orderId, true);
        }
      } catch (err) {
        if (err instanceof ApiRequestError && err.code === "PAYMENT_FAILED") {
          // Razorpay says it failed — safe to tell the buyer they weren't charged.
          router.push(`/checkout/failure?reason=${encodeURIComponent(err.message)}`);
          return;
        }
        // Anything else happened AFTER the buyer paid (network drop, 5xx…).
        // Never say "failed" here: the webhook still fulfils the order.
        console.error("[checkout] verify error after payment", order.orderId, err);
        goToSuccess(order.orderId, true);
      } finally {
        busy.current = false;
      }
    },
    [goToSuccess, router],
  );

  const initiateCheckout = useCallback(
    async (values: CheckoutFormValues, templateIds: string[]) => {
      if (busy.current) return;
      busy.current = true;
      settled.current = false;
      setError(null);
      setPhase("creating");

      // 1. Create our order + Razorpay's. Failures here are fixable by the
      //    buyer (bad name, item gone, rate limit) — stay on the form.
      let order: CreateOrderData;
      try {
        const a = values.billingAddress;
        order = await createOrder({
          items: templateIds.map((templateId) => ({ templateId })),
          guestName: values.guestName,
          guestEmail: values.guestEmail,
          billingAddress: {
            line1: a.line1,
            line2: a.line2 || undefined,
            city: a.city,
            state: a.state,
            country: a.country,
            zip: a.zip,
            company: a.company || undefined,
          },
          paymentMethod: values.paymentMethod,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not start checkout. Please try again.");
        setPhase("idle");
        busy.current = false;
        return;
      }

      // 2. Load Razorpay's checkout script
      try {
        await loadRazorpay();
      } catch {
        setError("Couldn't load the payment window. Check your connection and try again.");
        setPhase("idle");
        busy.current = false;
        return;
      }

      // 3. Open it. Amount, currency and prefill all come from the backend.
      setPhase("paying");
      new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        order_id: order.razorpayOrderId,
        name: order.name,
        description: order.description,
        prefill: order.prefill,
        theme: { color: "#253957" },
        handler: (response) => {
          void finalize(order, response);
        },
        modal: {
          ondismiss: () => {
            if (settled.current) return; // closed after paying — finalize owns the flow
            setPhase("idle");
            busy.current = false;
          },
        },
      }).open();
    },
    [finalize],
  );

  return {
    phase,
    isProcessing: phase !== "idle",
    error,
    initiateCheckout,
  };
}