import { create } from "zustand";

interface UiState {
  isMobileMenuOpen: boolean;
  isSearchOpen: boolean;
  activeModal: string | null;
  toasts: Toast[];
}

export interface Toast {
  id: string;
  type: "success" | "error" | "warning" | "info";
  message: string;
  duration?: number;
}

interface UiActions {
  openMobileMenu: () => void;
  closeMobileMenu: () => void;
  toggleMobileMenu: () => void;
  openSearch: () => void;
  closeSearch: () => void;
  openModal: (modalId: string) => void;
  closeModal: () => void;
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
}

type UiStore = UiState & UiActions;

export const useUiStore = create<UiStore>((set, get) => ({
  isMobileMenuOpen: false,
  isSearchOpen: false,
  activeModal: null,
  toasts: [],

  openMobileMenu: () => set({ isMobileMenuOpen: true }),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),
  toggleMobileMenu: () => set({ isMobileMenuOpen: !get().isMobileMenuOpen }),

  openSearch: () => set({ isSearchOpen: true }),
  closeSearch: () => set({ isSearchOpen: false }),

  openModal: (modalId: string) => set({ activeModal: modalId }),
  closeModal: () => set({ activeModal: null }),

  addToast: (toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).slice(2);
    set({ toasts: [...get().toasts, { ...toast, id }] });
    const duration = toast.duration ?? 4000;
    setTimeout(() => get().removeToast(id), duration);
  },

  removeToast: (id: string) =>
    set({ toasts: get().toasts.filter((t) => t.id !== id) }),
}));
