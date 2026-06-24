// ─── api/tracking.ts ─────────────────────────────────────────────────────────
import type { Order } from "@/types/order.types";

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

// ── Shared fetch helper ───────────────────────────────────────────────────────

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, options);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error ?? `HTTP ${res.status}`);
  }
  return res.json();
}

// ── Response shapes (matching Go fiber.Map responses exactly) ─────────────────

// GET /orders/lookup?order_number=xxx&email=xxx → { "order": Order }
export interface OrderLookupResponse {
  order: Order;
}

// GET /orders/by-email?email=xxx → { "orders": Order[], "total": n, "page": n, "limit": n }
export interface OrdersByEmailResponse {
  orders: Order[];
  total: number;
  page: number;
  limit: number;
}

// POST /download/info → { "download_url": "...", "expires_at": "...", ... }
export interface DownloadInfoResponse {
  download_url: string;
  expires_at: string;
  file_name: string;
  file_size: number;
}

// GET /download/by-email?email=xxx → { "downloads": DownloadToken[] }
export interface DownloadsByEmailResponse {
  downloads: DownloadToken[];
}

export interface DownloadToken {
  id: number;
  order_id: number;
  token: string;
  email: string;
  expires_at: string;
  download_count: number;
  max_downloads: number;
  created_at: string;
}

// ── Order APIs ────────────────────────────────────────────────────────────────

/**
 * GET /api/v1/orders/lookup?order_number=xxx&email=xxx
 *
 * Both params required — backend verifies email matches order owner.
 * Returns the single matched Order (with items joined).
 */
export async function lookupOrderByNumber(
  orderNumber: string,
  email: string
): Promise<Order> {
  const params = new URLSearchParams({ order_number: orderNumber, email });
  const data = await apiFetch<OrderLookupResponse>(
    `/orders/lookup?${params.toString()}`
  );
  return data.order;
}

/**
 * GET /api/v1/orders/by-email?email=xxx&page=1&limit=20
 *
 * Returns all orders for an email with pagination metadata.
 */
export async function getOrdersByEmail(
  email: string,
  page = 1,
  limit = 20
): Promise<OrdersByEmailResponse> {
  const params = new URLSearchParams({
    email,
    page: String(page),
    limit: String(limit),
  });
  return apiFetch<OrdersByEmailResponse>(
    `/orders/by-email?${params.toString()}`
  );
}

// ── Download APIs ─────────────────────────────────────────────────────────────

/**
 * GET /api/v1/download?token=xxx&email=xxx
 *
 * Backend responds with a 307 redirect to the signed S3/CDN URL.
 * Opening in a new tab lets the browser follow the redirect directly.
 *
 * The `token` is a DownloadToken.token string — fetch via getDownloadsByEmail()
 * or have your backend include it in the Order response when downloads_enabled = true.
 */
export function initiateDownload(token: string, email: string): void {
  const params = new URLSearchParams({ token, email });
  window.open(`${BASE}/download?${params.toString()}`, "_blank");
}

/**
 * POST /api/v1/download/info
 *
 * Returns signed URL + file metadata without triggering a redirect.
 * Use to show file name/size in UI before the user clicks download.
 */
export async function getDownloadInfo(
  token: string,
  email: string
): Promise<DownloadInfoResponse> {
  return apiFetch<DownloadInfoResponse>("/download/info", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, email }),
  });
}

/**
 * GET /api/v1/download/by-email?email=xxx
 *
 * Returns all DownloadToken records for an email.
 * Use this to get the actual token string for approved orders.
 */
export async function getDownloadsByEmail(
  email: string
): Promise<DownloadsByEmailResponse> {
  const params = new URLSearchParams({ email });
  return apiFetch<DownloadsByEmailResponse>(
    `/download/by-email?${params.toString()}`
  );
}