import type { Template } from "./template.types";

// =======================
// CART ITEM
// =======================
export interface CartItem {
  template_id: number;
  template: Template;
  added_at: string;
}

// =======================
// CART STATE
// =======================
export interface CartState {
  items: CartItem[];
  is_drawer_open: boolean;
}

// =======================
// CART SUMMARY
// =======================
export interface CartSummary {
  item_count: number;
  subtotal_usd_cents: number;
}