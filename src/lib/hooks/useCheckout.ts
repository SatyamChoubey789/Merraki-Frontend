"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { orderApi } from "@/lib/api/orders";
import { useCartStore } from "@/lib/stores/cartStore";
import { useUiStore } from "@/lib/stores/uiStore";
import { loadRazorpayScript, initRazorpay } from "@/lib/utils/razorpay";
import type { CheckoutFormValues } from "@/lib/schemas/checkout.schema";
import type { RazorpayPaymentResponse } from "@/lib/utils/razorpay";

type CheckoutStep = "form" | "processing" | "success" | "failure";

export function useCheckout() {
  const router = useRouter();
  const [step, setStep] = useState<CheckoutStep>("form");
  const [isRazorpayLoading, setIsRazorpayLoading] = useState(false);
  const { items, clearCart, selectedCurrency } = useCartStore();
  const { addToast } = useUiStore();

  // Step 1: Create order
  const createOrderMutation = useMutation({
    mutationFn: (formValues: CheckoutFormValues) =>
      orderApi.create({
        items: items.map((item) => ({
          templateId: item.templateId,
          quantity: item.quantity,
        })),
        customerDetails: {
          name: formValues.name,
          email: formValues.email,
          phone: formValues.phone || undefined,
          company: formValues.company || undefined,
        },
        currency: selectedCurrency,
        couponCode: formValues.couponCode || undefined,
      }),
    onError: () => {
      addToast({
        type: "error",
        message: "Failed to create order. Please try again.",
      });
    },
  });

  // Step 2: Verify payment
  const verifyOrderMutation = useMutation({
    mutationFn: (payload: {
      razorpayOrderId: string;
      razorpayPaymentId: string;
      razorpaySignature: string;
      orderNumber: string;
    }) => orderApi.verify(payload),
    onSuccess: () => {
      clearCart();
      setStep("success");
    },
    onError: () => {
      setStep("failure");
    },
  });

  const initiateCheckout = async (formValues: CheckoutFormValues) => {
    setIsRazorpayLoading(true);
    setStep("processing");

    try {
      // Load Razorpay script
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        throw new Error("Razorpay failed to load");
      }

      // Create order on backend
      const orderResponse = await createOrderMutation.mutateAsync(formValues);
      const order = orderResponse.data;

      // Init Razorpay
      const rzp = initRazorpay(
        order,
        {
          name: formValues.name,
          email: formValues.email,
          phone: formValues.phone,
        },
        // On payment success
        async (paymentResponse: RazorpayPaymentResponse) => {
          await verifyOrderMutation.mutateAsync({
            razorpayOrderId: paymentResponse.razorpay_order_id,
            razorpayPaymentId: paymentResponse.razorpay_payment_id,
            razorpaySignature: paymentResponse.razorpay_signature,
            orderNumber: order.orderNumber,
          });
        },
        // On dismiss
        () => {
          setStep("failure");
        },
      );

      rzp.open();
    } catch {
      setStep("failure");
    } finally {
      setIsRazorpayLoading(false);
    }
  };

  return {
    step,
    setStep,
    isRazorpayLoading,
    initiateCheckout,
    isCreatingOrder: createOrderMutation.isPending,
    isVerifyingOrder: verifyOrderMutation.isPending,
    isProcessing:
      createOrderMutation.isPending ||
      verifyOrderMutation.isPending ||
      isRazorpayLoading,
  };
}
