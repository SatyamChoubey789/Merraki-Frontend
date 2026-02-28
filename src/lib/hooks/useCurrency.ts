"use client";

import { useQuery } from "@tanstack/react-query";
import type { CurrencyCode } from "@/types/currency.types";
import { currencyApi } from "../api/currency";
import { useCurrencyStore } from "../stores/currencyStore";
import { formatCurrency } from "../utils/currency";

export function useCurrency() {
  const {
    selectedCurrency,
    setRates,
    setLoading,
    convertPrice,
    getSymbol,
    setSelectedCurrency,
  } = useCurrencyStore();

  useQuery({
    queryKey: ["currency", "INR"],
    queryFn: async () => {
      setLoading(true);
      const response = await currencyApi.getRates("INR");
      setRates(response.data);
      return response.data;
    },
    staleTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
  });

  const format = (
    amount: number,
    fromCurrency: CurrencyCode = "INR",
  ): string => {
    const converted = convertPrice(amount, fromCurrency);
    return formatCurrency(converted, selectedCurrency);
  };

  return {
    selectedCurrency,
    setSelectedCurrency,
    convertPrice,
    format,
    symbol: getSymbol(),
  };
}
