import { apiFetch, apiClient } from "@/lib/api/client";

// ─── Types ────────────────────────────────────────────────────────────────────

export type OrderStatus =
  | "pending"
  | "paid"
  | "approved"
  | "failed"
  | "refunded"
  | "cancelled"
  | "rejected";

export interface OrderItem {
  id: number;
  template_name: string;
  template_version: string;
  file_format?: string;
  file_size_mb?: number;
  price_usd_cents: number;
  quantity: number;
}

export interface Order {
  id: string;
  order_number: string;
  status: OrderStatus;
  customer_name: string;
  customer_email: string;
  total_amount_usd_cents: number;
  discount_amount_usd_cents: number;
  downloads_enabled: boolean;
  download_token?: string;
  created_at: string;
  updated_at: string;
  admin_reviewed_at?: string;
  items: OrderItem[];
}

export interface DownloadFile {
  name: string;
  url: string;
  expires_at: string;
}

interface TrackResponse {
  success: true;
  data: Order | Order[];
}

interface DownloadResponse {
  success: true;
  data: { files: DownloadFile[] };
}

// ─── Validators ───────────────────────────────────────────────────────────────

export function isEmail(val: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
}

export function isOrderNumber(val: string): boolean {
  return /^MRK-/i.test(val.trim());
}

// ─── Formatters ───────────────────────────────────────────────────────────────

export function centsToUSD(cents: number): string {
  return `$${(cents / 100).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ─── API calls ────────────────────────────────────────────────────────────────

/**
 * GET /orders/track?email= OR ?order_id=
 *
 * Client-side only (user-entered input, never cached).
 * Uses apiClient (axios) so the response interceptor normalizes errors.
 */
export async function trackOrder(identifier: string): Promise<Order[]> {
  const trimmed = identifier.trim();
  const param = isEmail(trimmed) ? { email: trimmed } : { order_id: trimmed };

  const res = await apiClient.get<TrackResponse>("/orders/track", {
    params: param,
  });

  const data = res.data?.data;
  return Array.isArray(data) ? data : data ? [data] : [];
}

/**
 * GET /orders/download/:token
 *
 * Client-side only — fresh signed R2 URLs on every click.
 * Uses apiClient (axios) so errors surface cleanly.
 */
export async function getDownloadLinks(token: string): Promise<DownloadFile[]> {
  const res = await apiClient.get<DownloadResponse>(`/orders/download/${token}`);
  return res.data?.data?.files ?? [];
}

/**
 * Triggers browser download for each signed file URL.
 * 300 ms delay between files to avoid browser popup blocking.
 */
export async function downloadOrderFiles(token: string): Promise<void> {
  const files = await getDownloadLinks(token);

  if (!files.length) throw new Error("No files found for this order.");

  for (const file of files) {
    await new Promise<void>((resolve) => {
      const a = document.createElement("a");
      a.href = file.url;
      a.download = file.name;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(resolve, 300);
    });
  }
}

/**
 * Server Component helper — prefetch order by email for SSR/ISR.
 * Uses apiFetch with no cache (user-specific data).
 *
 * Usage in a Server Component:
 *   const orders = await prefetchOrdersByEmail(email);
 */
export async function prefetchOrdersByEmail(email: string): Promise<Order[]> {
  const data = await apiFetch<TrackResponse>("/orders/track", {
    revalidate: false,
    params: { email },
  });
  const result = data?.data;
  return Array.isArray(result) ? result : result ? [result] : [];
}