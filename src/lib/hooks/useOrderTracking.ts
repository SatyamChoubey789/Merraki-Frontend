// ─── hooks/useOrderTracking.ts ────────────────────────────────────────────────
"use client";

import { useState, useCallback, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  orderTrackingSchema,
  type OrderTrackingFormValues,
} from "@/lib/schemas/orderTracking.schema";
import {
  lookupOrderByNumber,
  getOrdersByEmail,
  initiateDownload,
} from "@/lib/api/tracking";
import type { Order } from "@/types/order.types";

// ── Types ─────────────────────────────────────────────────────────────────────

export type SearchMode = "email" | "order_number" | null;

export interface UseOrderTrackingReturn {
  // Form
  form: ReturnType<typeof useForm<OrderTrackingFormValues>>;
  onSubmit: (values: OrderTrackingFormValues) => Promise<void>;

  // State
  orders: Order[];
  loading: boolean;
  error: string | null;
  searched: boolean;
  searchMode: SearchMode;

  // Derived — the email captured during the last search (needed for downloads)
  resolvedEmail: string;

  // Actions
  handleDownload: (order: Order) => void;
  reset: () => void;
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useOrderTracking(): UseOrderTrackingReturn {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  const [searchMode, setSearchMode] = useState<SearchMode>(null);

  // Keep the resolved email in a ref so download callbacks are always fresh
  // without needing to include it in every dep-array.
  const resolvedEmailRef = useRef<string>("");
  const [resolvedEmail, setResolvedEmail] = useState<string>("");

  // ── Form ──────────────────────────────────────────────────────────────────
  const form = useForm<OrderTrackingFormValues>({
    resolver: zodResolver(orderTrackingSchema),
    defaultValues: { identifier: "" },
  });

  // ── Search ────────────────────────────────────────────────────────────────
  const onSubmit = useCallback(async (values: OrderTrackingFormValues) => {
    const { identifier } = values;
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);

    setLoading(true);
    setError(null);
    setSearched(false);
    setOrders([]);

    try {
      if (isEmail) {
        // ── Email lookup ────────────────────────────────────────────────────
        setSearchMode("email");
        resolvedEmailRef.current = identifier;
        setResolvedEmail(identifier);

        const res = await getOrdersByEmail(identifier, 1, 20);
        setOrders(res.orders ?? []);
      } else {
        // ── Order-number lookup ─────────────────────────────────────────────
        // Backend requires *both* order_number AND email.
        // We don't have the email yet, so we surface a friendly error prompting
        // the user to use their email instead — matching the backend's 400.
        setSearchMode("order_number");

        // If we already have an email from a previous search, reuse it.
        const email = resolvedEmailRef.current;
        if (!email) {
          setError(
            "Please search by email first, then you can use your order number."
          );
          return;
        }

        const order = await lookupOrderByNumber(identifier, email);
        setOrders(order ? [order] : []);
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
      setSearched(true);
    }
  }, []);

  // ── Download ──────────────────────────────────────────────────────────────
  const handleDownload = useCallback((order: Order) => {
    // Guard: must be approved + downloads enabled + token present
    if (
      order.status !== "approved" ||
      !order.downloads_enabled ||
      !order.gateway_order_id // adjust if your Order type has a dedicated token field
    ) {
      return;
    }

    // The download endpoint needs a token + the customer email.
    // Use the email that was used to look up the order, falling back to the
    // order's own customer_email field.
    const email = resolvedEmailRef.current || order.customer_email;

    // NOTE: Your backend GET /download?token=xxx&email=xxx redirects (307) to
    // the signed file URL. initiateDownload() opens that in a new tab so the
    // browser follows the redirect transparently.
    initiateDownload(order.gateway_order_id, email);
  }, []);

  // ── Reset ─────────────────────────────────────────────────────────────────
  const reset = useCallback(() => {
    setOrders([]);
    setError(null);
    setSearched(false);
    setSearchMode(null);
    resolvedEmailRef.current = "";
    setResolvedEmail("");
    form.reset();
  }, [form]);

  return {
    form,
    onSubmit,
    orders,
    loading,
    error,
    searched,
    searchMode,
    resolvedEmail,
    handleDownload,
    reset,
  };
}