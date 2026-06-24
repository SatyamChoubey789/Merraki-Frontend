// =======================
// ORDER STATUS
// =======================
export type OrderStatus =
  | "pending"
  | "payment_initiated"
  | "payment_processing"
  | "paid"
  | "admin_review"
  | "approved"
  | "rejected"
  | "failed"
  | "cancelled"
  | "refunded";

// =======================
// ORDER ITEM
// =======================
export interface OrderItem {
  id: number;
  order_id: number;
  template_id: number;

  template_name: string;
  template_slug: string;
  template_version: string;

  // 🔥 backend uses cents
  price_usd_cents: number;

  file_url?: string | null;
  file_format?: string | null;
  file_size_mb?: number | null;

  download_count: number;
  last_downloaded_at?: string | null;

  created_at: string;
}

// =======================
// ORDER
// =======================
export interface Order {
  id: number;
  order_number: string;

  customer_email: string;
  customer_name: string;
  customer_phone?: string | null;
  customer_country?: string | null;

  customer_ip?: string | null;
  customer_user_agent?: string | null;

  // Billing
  billing_name?: string | null;
  billing_email?: string | null;
  billing_phone?: string | null;
  billing_address_line1?: string | null;
  billing_address_line2?: string | null;
  billing_city?: string | null;
  billing_state?: string | null;
  billing_country: string;
  billing_postal_code?: string | null;

  // 🔥 ALL IN CENTS (NOT FLOAT)
  subtotal_usd_cents: number;
  tax_amount_usd_cents: number;
  discount_amount_usd_cents: number;
  total_amount_usd_cents: number;

  payment_gateway: string;
  gateway_order_id?: string | null;
  gateway_payment_id?: string | null;

  status: OrderStatus;

  admin_reviewed_by?: number | null;
  admin_reviewed_at?: string | null;
  admin_notes?: string | null;
  rejection_reason?: string | null;

  downloads_enabled: boolean;
  downloads_expires_at?: string | null;

  idempotency_key?: string | null;
  metadata?: Record<string, any>;

  created_at: string;
  updated_at: string;
}

// =======================
// ORDER WITH ITEMS
// =======================
export interface OrderWithItems extends Order {
  items: OrderItem[];
}

// =======================
// RESPONSES
// =======================
export interface CreateOrderResponse {
  order: Order;
}

export interface InitiatePaymentResponse {
  razorpay_order_id: string;
  amount_cents: number;
  key_id: string;
  order_number: string;
}

export interface VerifyPaymentResponse {
  success: boolean;
  order: Order;
  status: OrderStatus;
  message: string;
}

// =======================
// REQUESTS
// =======================
export interface CreateOrderRequest {
  customer_email: string;
  customer_name: string;
  customer_phone?: string;
  billing_address?: BillingAddress;
  items: CreateOrderItem[];
  idempotency_key: string;
}

export interface CreateOrderItem {
  template_id: number;
  quantity: number; // backend does NOT store quantity → used only at creation
}

export interface BillingAddress {
  name: string;
  email: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
}

export interface InitiatePaymentRequest {
  order_id: number;
}

export interface VerifyPaymentRequest {
  order_id: number;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  idempotency_key: string;
}