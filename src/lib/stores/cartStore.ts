import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { TemplateWithRelations } from "@/types/template.types";

export interface CartItem {
  templateId: number;
  template: TemplateWithRelations;
  quantity: number;
  addedAt: string;
}

interface CartState {
  items: CartItem[];
  isDrawerOpen: boolean;
}

interface CartActions {
  addItem: (template: TemplateWithRelations) => void;
  removeItem: (templateId: number) => void;
  updateQuantity: (templateId: number, quantity: number) => void;
  clearCart: () => void;

  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;

  getItemCount: () => number;
  getSubtotalUSDCents: () => number;
  getSubtotalUSD: () => number;
}

// =======================
// PRICE HELPER
// =======================
function getTemplatePriceCents(template: TemplateWithRelations): number {
  return template.sale_price_usd_cents ?? template.price_usd_cents;
}

export const useCartStore = create<CartState & CartActions>()(
  persist(
    (set, get) => ({
      items: [],
      isDrawerOpen: false,

      // =======================
      // ADD ITEM
      // =======================
      addItem: (template) => {
        const items = get().items;
        const idx = items.findIndex((i) => i.templateId === template.id);

        if (idx >= 0) {
          const updated = [...items];
          updated[idx].quantity += 1;

          set({ items: updated, isDrawerOpen: true });
          return;
        }

        set({
          items: [
            ...items,
            {
              templateId: template.id,
              template,
              quantity: 1,
              addedAt: new Date().toISOString(),
            },
          ],
          isDrawerOpen: true,
        });
      },

      // =======================
      // REMOVE ITEM
      // =======================
      removeItem: (templateId) =>
        set({
          items: get().items.filter((i) => i.templateId !== templateId),
        }),

      // =======================
      // UPDATE QUANTITY
      // =======================
      updateQuantity: (templateId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(templateId);
          return;
        }

        set({
          items: get().items.map((i) =>
            i.templateId === templateId
              ? { ...i, quantity }
              : i
          ),
        });
      },

      // =======================
      // CLEAR
      // =======================
      clearCart: () => set({ items: [] }),

      // =======================
      // DRAWER
      // =======================
      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),
      toggleDrawer: () =>
        set({ isDrawerOpen: !get().isDrawerOpen }),

      // =======================
      // COUNT
      // =======================
      getItemCount: () =>
        get().items.reduce((acc, i) => acc + i.quantity, 0),

      // =======================
      // TOTAL (CENTS)
      // =======================
      getSubtotalUSDCents: () =>
        get().items.reduce((acc, i) => {
          const price = getTemplatePriceCents(i.template);
          return acc + price * i.quantity;
        }, 0),

      // =======================
      // TOTAL (USD DISPLAY ONLY)
      // =======================
      getSubtotalUSD: () =>
        get()
          .items.reduce((acc, i) => {
            const price = getTemplatePriceCents(i.template);
            return acc + price * i.quantity;
          }, 0) / 100,
    }),
    {
      name: "merraki-cart",
      storage: createJSONStorage(() => localStorage),

      // only persist minimal data (better performance)
      partialize: (state) => ({
        items: state.items,
      }),
    }
  )
);