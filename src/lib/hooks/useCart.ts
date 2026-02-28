"use client";

import { useCartStore } from "@/lib/stores/cartStore";
import { useCurrencyStore } from "@/lib/stores/currencyStore";
import { useCurrency } from "./useCurrency";
import type { Template } from "@/types/template.types";

export function useCart() {
  const {
    items,
    isDrawerOpen,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    openDrawer,
    closeDrawer,
    getItemCount,
    getSubtotal,
  } = useCartStore();

  const { format, convertPrice } = useCurrency();

  const itemCount = getItemCount();
  const subtotalRaw = getSubtotal();
  const subtotalFormatted = format(subtotalRaw);

  const isInCart = (templateId: string) =>
    items.some((item) => item.templateId === templateId);

  const getItemQuantity = (templateId: string) =>
    items.find((item) => item.templateId === templateId)?.quantity ?? 0;

  const handleAddItem = (template: Template) => {
    addItem(template);
  };

  return {
    items,
    isDrawerOpen,
    itemCount,
    subtotalRaw,
    subtotalFormatted,
    isInCart,
    getItemQuantity,
    addItem: handleAddItem,
    removeItem,
    updateQuantity,
    clearCart,
    openDrawer,
    closeDrawer,
  };
}
