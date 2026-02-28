import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CartItem, CartState } from "@/types/cart.types";
import type { Template } from "@/types/template.types";

interface CartActions {
  addItem: (template: Template) => void;
  removeItem: (templateId: string) => void;
  updateQuantity: (templateId: string, quantity: number) => void;
  clearCart: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  setSelectedCurrency: (currency: string) => void;
  getItemCount: () => number;
  getSubtotal: () => number;
}

type CartStore = CartState & CartActions;

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isDrawerOpen: false,
      selectedCurrency: process.env.NEXT_PUBLIC_DEFAULT_CURRENCY ?? "INR",

      addItem: (template: Template) => {
        const items = get().items;
        const existingIndex = items.findIndex(
          (item) => item.templateId === template.id,
        );

        if (existingIndex >= 0) {
          const updatedItems = [...items];
          updatedItems[existingIndex] = {
            ...updatedItems[existingIndex],
            quantity: updatedItems[existingIndex].quantity + 1,
          };
          set({ items: updatedItems, isDrawerOpen: true });
        } else {
          const newItem: CartItem = {
            templateId: template.id,
            template,
            quantity: 1,
            addedAt: new Date().toISOString(),
          };
          set({ items: [...items, newItem], isDrawerOpen: true });
        }
      },

      removeItem: (templateId: string) => {
        set({
          items: get().items.filter((item) => item.templateId !== templateId),
        });
      },

      updateQuantity: (templateId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(templateId);
          return;
        }
        const updatedItems = get().items.map((item) =>
          item.templateId === templateId ? { ...item, quantity } : item,
        );
        set({ items: updatedItems });
      },

      clearCart: () => set({ items: [] }),

      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),
      toggleDrawer: () => set({ isDrawerOpen: !get().isDrawerOpen }),

      setSelectedCurrency: (currency: string) =>
        set({ selectedCurrency: currency }),

      getItemCount: () =>
        get().items.reduce((acc, item) => acc + item.quantity, 0),

      getSubtotal: () =>
        get().items.reduce(
          (acc, item) => acc + item.template.price * item.quantity,
          0,
        ),
    }),
    {
      name: "merraki-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        selectedCurrency: state.selectedCurrency,
      }),
    },
  ),
);
