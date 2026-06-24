"use client";

import { useCartStore } from "@/lib/stores/cartStore";
import type { TemplateWithRelations } from "@/types/template.types";

export function useCart() {
  const store = useCartStore();

  const itemCount = store.getItemCount();

  const subtotalUSD = store.getSubtotalUSD();
  const subtotalUSDCents = store.getSubtotalUSDCents();

  const subtotalFormatted = subtotalUSD.toFixed(2);

  const isInCart = (templateId: number) =>
    store.items.some((i) => i.templateId === templateId);

  const getItemQuantity = (templateId: number) =>
    store.items.find((i) => i.templateId === templateId)?.quantity ?? 0;

  return {
    items: store.items,
    isDrawerOpen: store.isDrawerOpen,

    itemCount,

    subtotalUSD,
    subtotalUSDCents,
    subtotalFormatted,

    isInCart,
    getItemQuantity,

    addItem: (t: TemplateWithRelations) => store.addItem(t),
    removeItem: store.removeItem,
    updateQuantity: store.updateQuantity,
    clearCart: store.clearCart,
    openDrawer: store.openDrawer,
    closeDrawer: store.closeDrawer,
  };
}