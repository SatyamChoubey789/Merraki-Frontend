import type { Template } from './template.types';

export interface CartItem {
  templateId: string;
  template: Template;
  quantity: number;
  addedAt: string;
}

export interface CartState {
  items: CartItem[];
  isDrawerOpen: boolean;
  selectedCurrency: string;
}

export interface CartSummary {
  itemCount: number;
  subtotal: number;
  currency: string;
}