"use client";

import { useEffect, useRef, useState } from "react";
import { useCartItems, useCartStore } from "@/lib/stores/useCartStore";
import { priceToCents } from "@/types/templatesTypes";
import { formatUSD } from "@/components/sections/checkout/checkout.types";

// The cart is persisted in localStorage with each item's price at the moment it
// was added. The backend always charges the CURRENT database price, and refuses
// an order containing an unpublished template ("One or more items are no longer
// available") without saying which one — and addItem() won't re-add an item that
// is already in the cart, so a stale item could never be refreshed by the buyer.
// This hook reconciles the cart once when checkout opens.
//
// Matching is by template id via the public list endpoint, not by slug:
// updateTemplate() regenerates the slug whenever the title changes, so a renamed
// template would look "deleted" if we looked it up by its saved slug.

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const MAX_PAGES = 5; // 5 × 100 templates; beyond that we skip the check

async function fetchPublishedPrices(): Promise<Map<string, string> | null> {
    const prices = new Map<string, string>();
    try {
        for (let page = 1; page <= MAX_PAGES; page++) {
            const res = await fetch(`${API_URL}/templates?limit=100&page=${page}`);
            if (!res.ok) return null;
            const body = await res.json();
            for (const t of body.data as { id: string; priceUsd: string }[]) {
                prices.set(t.id, t.priceUsd);
            }
            if (!body.pagination?.hasNext) return prices;
        }
    } catch {
        // network error — leave the cart alone rather than risk removing good items
    }
    return null;
}

// Returns human-readable notices about anything that changed (empty = all good).
export function useCartSync(enabled: boolean): string[] {
    const items = useCartItems();
    const syncItems = useCartStore((s) => s.syncItems);
    const [notices, setNotices] = useState<string[]>([]);
    const ran = useRef(false);

    useEffect(() => {
        if (!enabled || ran.current || items.length === 0) return;
        ran.current = true;

        void (async () => {
            const prices = await fetchPublishedPrices();
            if (!prices) return;

            // Re-read the cart now: the buyer may have edited it while we fetched.
            const latest = useCartStore.getState().items;
            const removed: string[] = [];
            const repriced: string[] = [];
            const next = [];

            for (const item of latest) {
                const priceUsd = prices.get(item.id);
                if (priceUsd === undefined) {
                    removed.push(item.title);
                    continue;
                }
                const cents = priceToCents(priceUsd);
                if (cents !== item.priceCents) {
                    repriced.push(`${item.title} is now ${formatUSD(cents)}`);
                    next.push({ ...item, priceCents: cents });
                } else {
                    next.push(item);
                }
            }

            if (removed.length === 0 && repriced.length === 0) return;
            syncItems(next);

            const out: string[] = [];
            if (repriced.length) out.push(`Price updated: ${repriced.join("; ")}.`);
            if (removed.length) {
                out.push(
                    `${removed.join(", ")} ${removed.length > 1 ? "are" : "is"} no longer available and ${removed.length > 1 ? "were" : "was"
                    } removed from your cart.`,
                );
            }
            setNotices(out);
        })();
    }, [enabled, items, syncItems]);

    return notices;
}