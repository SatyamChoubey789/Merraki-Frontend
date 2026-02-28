import apiClient from "./client";
import type { ApiResponse } from "@/types/api.types";

export interface ContactPayload {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject: string;
  message: string;
  serviceType?: "consultation" | "templates" | "modelling" | "other";
}

export const contactApi = {
  submit: async (
    payload: ContactPayload,
  ): Promise<ApiResponse<{ ticketId: string; message: string }>> => {
    const { data } = await apiClient.post<
      ApiResponse<{ ticketId: string; message: string }>
    >("/contact", payload);
    return data;
  },
};
