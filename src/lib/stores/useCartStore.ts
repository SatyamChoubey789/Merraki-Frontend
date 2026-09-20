import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useShallow } from "zustand/react/shallow";

// ─── CartItem ─────────────────────────────────────────────────────────────────
// Derived from TemplateListItem / TemplateFull — only what the cart needs.
// priceUsd from the backend ("9.99") is converted to cents on addItem
// so all cart math stays in integers.

export interface CartItem {
    id: string;             // UUID — matches templates.id
    slug: string;           // used as templateId in checkout payload
    title: string;          // matches templates.title (NOT "name")
    priceCents: number;     // Math.round(parseFloat(priceUsd) * 100)
    previewImage: string | null;  // previewImages[0].url or null
    categoryId: string | null;
}

// ─── State ────────────────────────────────────────────────────────────────────

interface CartState {
    items: CartItem[];
    isOpen: boolean;

    addItem: (item: CartItem) => void;
    removeItem: (id: string) => void;      // id is UUID string
    clearCart: () => void;
    isInCart: (id: string) => boolean;

    openCart: () => void;
    closeCart: () => void;
    toggleCart: () => void;
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            isOpen: false,

            addItem: (item) => {
                if (get().isInCart(item.id)) return;
                set((s) => ({ items: [...s.items, item] }));
            },

            removeItem: (id) =>
                set((s) => ({ items: s.items.filter((i) => i.id !== id) })),

            clearCart: () => set({ items: [] }),

            isInCart: (id) => get().items.some((i) => i.id === id),

            openCart: () => set({ isOpen: true }),
            closeCart: () => set({ isOpen: false }),
            toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),
        }),
        {
            name: "merraki-cart",
            partialize: (s) => ({ items: s.items }), // don't persist isOpen
        },
    ),
);

// ─── Selector hooks ───────────────────────────────────────────────────────────

export const useCartItems = () => useCartStore((s) => s.items);
export const useCartIsOpen = () => useCartStore((s) => s.isOpen);

export const useCartActions = () =>
    useCartStore(
        useShallow((s) => ({
            addItem: s.addItem,
            removeItem: s.removeItem,
            clearCart: s.clearCart,
            isInCart: s.isInCart,
            openCart: s.openCart,
            closeCart: s.closeCart,
            toggleCart: s.toggleCart,
        })),
    );

// ─── Derived value hooks ──────────────────────────────────────────────────────

export const useCartTotalItems = () => useCartStore((s) => s.items.length);

export const useCartSubtotalCents = () =>
    useCartStore((s) => s.items.reduce((sum, i) => sum + i.priceCents, 0));