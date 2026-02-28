import type { CurrencyCode } from "@/types/currency.types";

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

const CURRENCY_LOCALES: Record<CurrencyCode, string> = {
  INR: "en-IN",
  USD: "en-US",
  EUR: "de-DE",
  GBP: "en-GB",
  AED: "ar-AE",
  SGD: "en-SG",
  CAD: "en-CA",
  AUD: "en-AU",
};

export function formatCurrency(
  amount: number,
  currency: CurrencyCode = "INR",
  options?: Intl.NumberFormatOptions,
): string {
  const locale = CURRENCY_LOCALES[currency] ?? "en-IN";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: currency === "INR" ? 0 : 2,
    maximumFractionDigits: 2,
    ...options,
  }).format(amount);
}

export function getCurrencySymbol(currency: CurrencyCode): string {
  return CURRENCY_SYMBOLS[currency] ?? "₹";
}
