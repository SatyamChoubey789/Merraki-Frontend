import { ApiRequestError } from "@/lib/api/checkout";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// ─── Matched to backend: orders.service.ts → toPublicOrder() ─────────────────
// Never includes r2 keys, payment ids, IPs or billing addresses.
// `downloadToken` is only present when status is "paid".

export type OrderStatus = "pending" | "paid" | "failed" | "refunded" | (string & {});

export interface TrackedOrder {
  id: string; // UUID — also the buyer's proof of ownership
  guestName: string;
  guestEmail: string;
  items: { templateId: string; title: string; priceUsd: string }[];
  totalUsd: string; // "9.99"
  currencyCharged: "USD" | "INR";
  amountCharged: string; // decimal string in currencyCharged
  exchangeRate: string | null;
  status: OrderStatus;
  downloadToken: string | null;
  createdAt: string;
  paidAt: string | null;
}

// GET /api/orders/download/:token — fresh presigned links, valid ~15 minutes
export interface DownloadLinks {
  orderId: string;
  guestName: string;
  items: { title: string; downloadUrl: string }[];
  expiresIn: string | number; // backend sends "15 minutes"
}

// ─── Plain fetch so the status code and error message survive ────────────────

async function request(path: string, init?: RequestInit): Promise<any> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, init);
  } catch {
    throw new ApiRequestError(
      "Network error — please check your connection and try again.",
      0,
      "NETWORK",
    );
  }

  const body = await res.json().catch(() => null);
  if (!res.ok) {
    const message =
      res.status === 429
        ? "Too many requests. Please wait a moment and try again."
        : (body?.error?.message ?? body?.message ?? `Request failed (${res.status})`);
    throw new ApiRequestError(message, res.status, body?.error?.code);
  }
  return body;
}

// ─── Endpoints ────────────────────────────────────────────────────────────────

// GET /api/orders/track?order_id=<uuid> → { data: [order] } ([] when not found)
export async function trackOrderById(orderId: string): Promise<TrackedOrder[]> {
  const body = await request(`/orders/track?order_id=${encodeURIComponent(orderId)}`);
  return body.data ?? [];
}

// POST /api/orders/track/request → always 202, same message whether or not
// orders exist (no email enumeration). The links arrive by email.
export async function requestOrderLinks(email: string): Promise<string> {
  const body = await request("/orders/track/request", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  return body.message ?? "If orders exist for that email, we've sent you a secure link.";
}

export async function getDownloadLinks(token: string): Promise<DownloadLinks> {
  const body = await request(`/orders/download/${encodeURIComponent(token)}`);
  return body.data;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

export const isUuid = (v: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v.trim());

export function formatMoney(value: string, currency: "USD" | "INR"): string {
  return new Intl.NumberFormat(currency === "INR" ? "en-IN" : "en-US", {
    style: "currency",
    currency,
  }).format(Number(value));
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}