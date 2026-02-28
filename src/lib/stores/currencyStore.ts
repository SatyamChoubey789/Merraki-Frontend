import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CurrencyCode, CurrencyRates } from "@/types/currency.types";

interface CurrencyState {
  selectedCurrency: CurrencyCode;
  rates: CurrencyRates | null;
  isLoading: boolean;
  lastUpdated: string | null;
}

interface CurrencyActions {
  setSelectedCurrency: (currency: CurrencyCode) => void;
  setRates: (rates: CurrencyRates) => void;
  setLoading: (loading: boolean) => void;
  convertPrice: (amount: number, fromCurrency?: CurrencyCode) => number;
  getSymbol: () => string;
}

type CurrencyStore = CurrencyState & CurrencyActions;

const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
  INR: "₹",
  USD: "$",
  EUR: "€",
  GBP: "£",
  AED: "د.إ",
  SGD: "S$",
  CAD: "C$",
  AUD: "A$",
};

export const useCurrencyStore = create<CurrencyStore>()(
  persist(
    (set, get) => ({
      selectedCurrency:
        (process.env.NEXT_PUBLIC_DEFAULT_CURRENCY as CurrencyCode) ?? "INR",
      rates: null,
      isLoading: false,
      lastUpdated: null,

      setSelectedCurrency: (currency: CurrencyCode) =>
        set({ selectedCurrency: currency }),

      setRates: (rates: CurrencyRates) =>
        set({ rates, lastUpdated: new Date().toISOString(), isLoading: false }),

      setLoading: (isLoading: boolean) => set({ isLoading }),

      convertPrice: (
        amount: number,
        fromCurrency: CurrencyCode = "INR",
      ): number => {
        const { rates, selectedCurrency } = get();
        if (!rates || fromCurrency === selectedCurrency) return amount;

        const fromRate = rates.rates[fromCurrency];
        const toRate = rates.rates[selectedCurrency];
        if (!fromRate || !toRate) return amount;

        const inBase = amount / fromRate;
        return Math.round(inBase * toRate * 100) / 100;
      },

      getSymbol: (): string => {
        return CURRENCY_SYMBOLS[get().selectedCurrency] ?? "₹";
      },
    }),
    {
      name: "merraki-currency",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ selectedCurrency: state.selectedCurrency }),
    },
  ),
);
