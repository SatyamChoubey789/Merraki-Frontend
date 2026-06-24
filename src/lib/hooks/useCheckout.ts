"use client";
import { useState, useCallback } from "react";
import { useCartStore } from "@/lib/stores/cartStore";
import { checkoutApi } from "@/lib/api/orders";
import { loadRazorpayScript, initRazorpay } from "@/lib/utils/razorpay";
import type { CheckoutFormValues } from "@/lib/schemas/checkout.schema";
import type { RazorpayPaymentResponse } from "@/lib/utils/razorpay";
import type { Order } from "@/types/order.types";

export type CheckoutStep = "form" | "processing" | "success" | "failure";

interface CheckoutState {
  step: CheckoutStep;
  order: Order | null;
  error: string | null;
}

export function useCheckout() {
  // ✅ Separate selectors — returning a new object `{ items, clearCart }`
  // from a single selector creates a new reference every render, which
  // breaks useSyncExternalStore's snapshot cache and causes an infinite loop.
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);

  const [state, setState] = useState<CheckoutState>({
    step: "form",
    order: null,
    error: null,
  });

  const setStep = useCallback((step: CheckoutStep) => {
    setState((s) => ({ ...s, step }));
  }, []);

  const initiateCheckout = useCallback(
    async (formValues: CheckoutFormValues) => {
      if (items.length === 0) {
        setState({ step: "failure", order: null, error: "Your cart is empty" });
        return;
      }

      setState({ step: "processing", order: null, error: null });

      try {
        // ── 1. Load Razorpay ─────────────────────────
        const loaded = await loadRazorpayScript();
        if (!loaded) {
          throw new Error("Payment gateway failed to load. Please try again.");
        }

        // ── 2. Billing address ───────────────────────
        const billingAddress = {
          name: formValues.name,
          email: formValues.email,
          phone: formValues.phone ?? "",
          address_line1: formValues.address_line1,
          address_line2: formValues.address_line2 ?? "",
          city: formValues.city,
          state: formValues.state,
          country: formValues.country ?? "IN",
          postal_code: formValues.postal_code,
        };

        // ── 3. Create order ──────────────────────────
        const createRes = await checkoutApi.createOrder({
          customer_email: formValues.email,
          customer_name: formValues.name,
          customer_phone: formValues.phone,
          billing_address: billingAddress,
          idempotency_key: crypto.randomUUID(),
          items: items.map((i) => ({
            template_id: i.templateId,
            quantity: i.quantity,
          })),
        });

        const order = createRes.order;

        // ── 4. Initiate payment ──────────────────────
        const paymentData = await checkoutApi.initiatePayment({
          order_id: order.id,
        });

        // ── 5. Open Razorpay ─────────────────────────
        const rzp = initRazorpay(
          paymentData,
          {
            name: formValues.name,
            email: formValues.email,
            phone: formValues.phone,
          },

          // ✅ Success handler
          async (paymentResponse: RazorpayPaymentResponse) => {
            try {
              setState((s) => ({ ...s, step: "processing" }));

              const verifyRes = await checkoutApi.verifyPayment({
                order_id: order.id,
                razorpay_order_id: paymentResponse.razorpay_order_id,
                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                razorpay_signature: paymentResponse.razorpay_signature,
                idempotency_key: crypto.randomUUID(),
              });

              if (verifyRes.success) {
                clearCart();
                setState({ step: "success", order: verifyRes.order, error: null });
              } else {
                setState({ step: "failure", order: null, error: "Payment verification failed" });
              }
            } catch (err: unknown) {
              setState({
                step: "failure",
                order: null,
                error: err instanceof Error ? err.message : "Verification failed",
              });
            }
          },

          // ❌ Dismiss handler
          () => {
            setState({ step: "failure", order: null, error: "Payment was cancelled" });
          }
        );

        rzp.open();
      } catch (err: unknown) {
        setState({
          step: "failure",
          order: null,
          error: err instanceof Error ? err.message : "Checkout failed",
        });
      }
    },
    [items, clearCart]
  );

  return {
    step: state.step,
    order: state.order,
    error: state.error,
    isProcessing: state.step === "processing",
    setStep,
    initiateCheckout,
  };
}