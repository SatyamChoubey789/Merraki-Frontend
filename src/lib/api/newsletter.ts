import apiClient from "./client";
import type { ApiResponse } from "@/types/api.types";

export interface NewsletterSubscribePayload {
  email: string;
  name?: string;
}

export interface NewsletterUnsubscribePayload {
  email?: string;
  token?: string;
}

export const newsletterApi = {
  subscribe: async (
    payload: NewsletterSubscribePayload,
  ): Promise<ApiResponse<{ message: string }>> => {
    const { data } = await apiClient.post<ApiResponse<{ message: string }>>(
      "/newsletter/subscribe",
      payload,
    );
    return data;
  },

  unsubscribePost: async (
    payload: NewsletterUnsubscribePayload,
  ): Promise<ApiResponse<{ message: string }>> => {
    const { data } = await apiClient.post<ApiResponse<{ message: string }>>(
      "/newsletter/unsubscribe",
      payload,
    );
    return data;
  },

  unsubscribeGet: async (
    token: string,
  ): Promise<ApiResponse<{ email: string; message: string }>> => {
    const { data } = await apiClient.get<
      ApiResponse<{ email: string; message: string }>
    >("/newsletter/unsubscribe", { params: { token } });
    return data;
  },
};
