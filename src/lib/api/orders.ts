import apiClient from "./client";
import type { ApiResponse } from "@/types/api.types";
import type {
  CreateOrderPayload,
  CreateOrderResponse,
  VerifyOrderPayload,
  VerifyOrderResponse,
  Order,
  OrderLookupParams,
} from "@/types/order.types";

export const orderApi = {
  create: async (
    payload: CreateOrderPayload,
  ): Promise<ApiResponse<CreateOrderResponse>> => {
    const { data } = await apiClient.post<ApiResponse<CreateOrderResponse>>(
      "/orders",
      payload,
    );
    return data;
  },

  verify: async (
    payload: VerifyOrderPayload,
  ): Promise<ApiResponse<VerifyOrderResponse>> => {
    const { data } = await apiClient.post<ApiResponse<VerifyOrderResponse>>(
      "/orders/verify",
      payload,
    );
    return data;
  },

  lookup: async (params: OrderLookupParams): Promise<ApiResponse<Order[]>> => {
    const { data } = await apiClient.get<ApiResponse<Order[]>>(
      "/orders/lookup",
      { params },
    );
    return data;
  },

  getDownloadUrl: (orderNumber: string): string => {
    return `${process.env.NEXT_PUBLIC_API_BASE_URL}/orders/download/${orderNumber}`;
  },

  downloadFile: async (orderNumber: string): Promise<Blob> => {
    const { data } = await apiClient.get<Blob>(
      `/orders/download/${orderNumber}`,
      {
        responseType: "blob",
      },
    );
    return data;
  },
};
