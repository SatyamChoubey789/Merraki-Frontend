"use client";

import { useMutation } from "@tanstack/react-query";
import { contactApi } from "@/lib/api/contact";
import { useUiStore } from "@/lib/stores/uiStore";
import type { ContactFormValues } from "@/lib/schemas/contact.schema";

export function useContact() {
  const { addToast } = useUiStore();

  return useMutation({
    mutationFn: (data: ContactFormValues) => contactApi.submit(data),
    onSuccess: (response) => {
      addToast({
        type: "success",
        message: `Message received! Ticket #${response.data.ticketId} created.`,
        duration: 6000,
      });
    },
    onError: () => {
      addToast({
        type: "error",
        message: "Failed to send message. Please try again.",
      });
    },
  });
}
