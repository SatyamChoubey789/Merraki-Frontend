import type {
  CreateOrderRequest, CreateOrderResponse,
  InitiatePaymentRequest, InitiatePaymentResponse,
  VerifyPaymentRequest, VerifyPaymentResponse,
} from "@/types/order.types";

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(err?.error ?? `HTTP ${res.status}`);
  }
  return res.json();
}

export const checkoutApi = {
  // POST /api/v1/checkout/create-order
  createOrder(req: CreateOrderRequest): Promise<CreateOrderResponse> {
    return post<CreateOrderResponse>("/checkout/create-order", req);
  },

  // POST /api/v1/checkout/initiate-payment
  initiatePayment(req: InitiatePaymentRequest): Promise<InitiatePaymentResponse> {
    return post<InitiatePaymentResponse>("/checkout/initiate-payment", req);
  },

  // POST /api/v1/checkout/verify-payment
  verifyPayment(req: VerifyPaymentRequest): Promise<VerifyPaymentResponse> {
    return post<VerifyPaymentResponse>("/checkout/verify-payment", req);
  },
};