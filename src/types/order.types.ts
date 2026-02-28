export type OrderStatus = 'pending' | 'processing' | 'approved' | 'rejected' | 'refunded';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface OrderItem {
  templateId: string;
  templateName: string;
  templateSlug: string;
  price: number;
  currency: string;
  quantity: number;
}

export interface CreateOrderPayload {
  items: {
    templateId: string;
    quantity: number;
  }[];
  customerDetails: {
    name: string;
    email: string;
    phone?: string;
    company?: string;
  };
  currency: string;
  couponCode?: string;
}

export interface CreateOrderResponse {
  orderId: string;
  orderNumber: string;
  razorpayOrderId: string;
  amount: number;
  currency: string;
  customerEmail: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  total: number;
}

export interface VerifyOrderPayload {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
  orderNumber: string;
}

export interface VerifyOrderResponse {
  success: boolean;
  orderNumber: string;
  message: string;
}

export interface OrderLookupParams {
  email?: string;
  orderNumber?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  customerDetails: {
    name: string;
    email: string;
    phone?: string;
    company?: string;
  };
  items: OrderItem[];
  subtotal: number;
  discount: number;
  total: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
  approvedAt?: string;
  downloadAvailable: boolean;
}