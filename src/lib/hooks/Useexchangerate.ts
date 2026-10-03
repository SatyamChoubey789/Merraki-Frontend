"use client";

import useSWR from "swr";
import { apiClient } from "@/lib/api/client";

// GET /api/payments/exchange-rate → { success: true, data: { usdToInr, fetchedAt } }
// The backend caches the rate for an hour and rate-limits this to 60/min, so we
// only fetch when the buyer actually picks UPI, and reuse it for 5 minutes.

interface RateResponse {
    success: true;
    data: { usdToInr: number; fetchedAt: string };
}

const fetchRate = async (): Promise<number> => {
    const res = await apiClient.get<RateResponse>("/payments/exchange-rate");
    return res.data.data.usdToInr;
};

export function useExchangeRate(enabled: boolean) {
    const { data, error } = useSWR(enabled ? "usd-inr-rate" : null, fetchRate, {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        dedupingInterval: 5 * 60_000,
    });

    return { rate: data ?? null, error: error ?? null };
}