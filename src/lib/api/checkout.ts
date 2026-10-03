const API_URL = process.env.NEXT_PUBLIC_API_URL;

// ─── Errors ───────────────────────────────────────────────────────────────────

export class ApiRequestError extends Error {
    status: number;
    code?: string;

    constructor(message: string, status: number, code?: string) {
        super(message);
        this.name = "ApiRequestError";
        this.status = status;
        this.code = code;
    }
}

function errorMessage(body: any, status: number): string {
    if (status === 429) return "Too many attempts. Please wait a minute and try again.";
    const m = body?.error?.message ?? (typeof body?.message === "string" ? body.message : undefined);
    return m ?? `Request failed (${status})`;
}

async function post<T>(path: string, payload: unknown): Promise<T> {
    let res: Response;
    try {
        res = await fetch(`${API_URL}${path}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
    } catch {
        throw new ApiRequestError(
            "Network error — please check your connection and try again.",
            0,
            "NETWORK",
        );
    }

    const body = await res.json().catch(() => null);
    if (!res.ok) throw new ApiRequestError(errorMessage(body, res.status), res.status, body?.error?.code);
    return body?.data as T;
}

// ─── POST /api/checkout/create-order ─────────────────────────────────────────
// Prices are NEVER sent — the backend reads them from the DB by templateId.

export interface CreateOrderPayload {
    items: { templateId: string }[]; // template UUIDs, 1–10
    guestName: string;
    guestEmail: string;
    billingAddress: {
        line1: string;
        line2?: string;
        city: string;
        state: string;
        country: string;
        zip: string;
        company?: string;
    };
    paymentMethod: "card" | "upi";
}

export interface CreateOrderData {
    orderId: string;
    razorpayOrderId: string;
    keyId: string;
    amount: number; // minor units (cents / paise) — pass straight to Razorpay
    currency: "USD" | "INR"; // card → USD, UPI → INR
    totalUsd: string; // "9.99"
    exchangeRate: string | null; // set when currency is INR
    name: string; // "MerrakiSolutions"
    description: string; // "2 items"
    prefill: { name: string; email: string };
}

export const createOrder = (payload: CreateOrderPayload) =>
    post<CreateOrderData>("/checkout/create-order", payload);

// ─── POST /api/payments/verify ───────────────────────────────────────────────
//   200 → paid (with signed download links)
//   202 → processing: not captured yet; the webhook finishes it → we re-verify
//   402 → PAYMENT_FAILED (thrown as ApiRequestError, code "PAYMENT_FAILED")
//   other → thrown; the buyer may already have paid, so callers must not say "failed"

export interface VerifyBody {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
}

export interface DownloadItem {
    title: string;
    downloadUrl: string; // presigned, short-lived
}

export type VerifyResult =
    | {
        status: "paid";
        orderId: string;
        downloadToken: string;
        guestName: string;
        items: DownloadItem[];
        expiresIn: number | string; // assumed seconds when numeric
    }
    | { status: "processing"; orderId: string };

export type PaidResult = Extract<VerifyResult, { status: "paid" }>;

export const verifyPayment = (body: VerifyBody) => post<VerifyResult>("/payments/verify", body);

// ─── Download-link handoff (checkout page → success page) ────────────────────
// The links come back once, in the verify response. sessionStorage carries them
// across the redirect; if it's empty (refresh in a new tab, etc.) the success
// page falls back to "check your receipt email".

export interface StoredDownloads {
    guestName: string;
    items: DownloadItem[];
    expiresIn: number | string;
    issuedAt: number;
}

export const downloadsStorageKey = (orderId: string) => `merraki:downloads:${orderId}`;

export function storeDownloads(result: PaidResult): void {
    try {
        const data: StoredDownloads = {
            guestName: result.guestName,
            items: result.items,
            expiresIn: result.expiresIn,
            issuedAt: Date.now(),
        };
        sessionStorage.setItem(downloadsStorageKey(result.orderId), JSON.stringify(data));
    } catch {
        // storage blocked/full — success page will use the email fallback
    }
}

export function readDownloads(orderId: string): StoredDownloads | null {
    try {
        const raw = sessionStorage.getItem(downloadsStorageKey(orderId));
        return raw ? (JSON.parse(raw) as StoredDownloads) : null;
    } catch {
        return null;
    }
}

export function isDownloadExpired(d: StoredDownloads): boolean {
    return typeof d.expiresIn === "number" && Date.now() > d.issuedAt + d.expiresIn * 1000;
}

export function describeExpiry(expiresIn: number | string): string {
    if (typeof expiresIn === "string") return expiresIn;
    const mins = Math.max(1, Math.round(expiresIn / 60));
    if (mins >= 60) {
        const h = Math.round(mins / 60);
        return `${h} hour${h > 1 ? "s" : ""}`;
    }
    return `${mins} minute${mins > 1 ? "s" : ""}`;
}