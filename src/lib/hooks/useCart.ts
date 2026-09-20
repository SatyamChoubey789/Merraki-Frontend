"use client";

import {
    useCartItems,
    useCartIsOpen,
    useCartActions,
    useCartTotalItems,
    useCartSubtotalCents,
    type CartItem,
} from "@/lib/stores/useCartStore";
import type { TemplateListItem, TemplateFull } from "@/types/templatesTypes";
import { priceToCents, getPrimaryImage } from "@/types/templatesTypes";

// ─── Adapter ──────────────────────────────────────────────────────────────────
// Converts a backend template shape → CartItem.
// Called inside addToCart so no component ever has to do this manually.

export function templateToCartItem(
    template: TemplateListItem | TemplateFull,
): CartItem {
    return {
        id: template.id,
        slug: template.slug,
        title: template.title,
        priceCents: priceToCents(template.priceUsd),
        previewImage: getPrimaryImage(template.previewImages)?.url ?? null,
        categoryId: template.categoryId,
    };
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

interface UseCartReturn {
    items: CartItem[];
    totalItems: number;
    subtotalCents: number;
    isOpen: boolean;

    // Takes a full template object — converts and adds to cart
    addToCart: (template: TemplateListItem | TemplateFull) => void;
    removeFromCart: (id: string) => void;
    clearCart: () => void;
    isInCart: (id: string) => boolean;

    openCart: () => void;
    closeCart: () => void;
    toggleCart: () => void;
}

export function useCart(): UseCartReturn {
    const items = useCartItems();
    const totalItems = useCartTotalItems();
    const subtotalCents = useCartSubtotalCents();
    const isOpen = useCartIsOpen();
    const {
        addItem,
        removeItem,
        clearCart,
        isInCart,
        openCart,
        closeCart,
        toggleCart,
    } = useCartActions();

    const addToCart = (template: TemplateListItem | TemplateFull) => {
        addItem(templateToCartItem(template));
        openCart(); // open drawer immediately after adding
    };

    return {
        items,
        totalItems,
        subtotalCents,
        isOpen,
        addToCart,
        removeFromCart: removeItem,
        clearCart,
        isInCart,
        openCart,
        closeCart,
        toggleCart,
    };
}