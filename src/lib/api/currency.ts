import apiClient from "./client";
import type { ApiResponse } from "@/types/api.types";
import type { CurrencyCode, CurrencyRates } from "@/types/currency.types";

export const currencyApi = {
  getRates: async (
    base: CurrencyCode = "INR",
  ): Promise<ApiResponse<CurrencyRates>> => {
    const { data } = await apiClient.get<ApiResponse<CurrencyRates>>(
      "/currency/convert",
      {
        params: { base },
      },
    );
    return data;
  },
};