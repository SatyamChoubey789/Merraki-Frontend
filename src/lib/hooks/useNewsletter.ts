"use client";

import { useMutation } from "@tanstack/react-query";
import { newsletterApi } from "@/lib/api/newsletter";
import { useUiStore } from "@/lib/stores/uiStore";
import type { NewsletterFormValues } from "@/lib/schemas/newsletter.schema";

export function useNewsletterSubscribe() {
  const { addToast } = useUiStore();

  return useMutation({
    mutationFn: (data: NewsletterFormValues) =>
      newsletterApi.subscribe({ email: data.email, name: data.name }),
    onSuccess: () => {
      addToast({
        type: "success",
        message: "Successfully subscribed! Check your inbox.",
        duration: 5000,
      });
    },
    onError: () => {
      addToast({
        type: "error",
        message: "Subscription failed. Please try again.",
      });
    },
  });
}

export function useNewsletterUnsubscribe() {
  const { addToast } = useUiStore();

  return useMutation({
    mutationFn: (token: string) => newsletterApi.unsubscribePost({ token }),
    onSuccess: () => {
      addToast({
        type: "info",
        message: "You have been unsubscribed successfully.",
      });
    },
    onError: () => {
      addToast({
        type: "error",
        message: "Unsubscribe failed. Please try again.",
      });
    },
  });
}
