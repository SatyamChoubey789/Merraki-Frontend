import apiClient from "./client";
import type { ApiResponse } from "@/types/api.types";
import type {
  TestQuestion,
  TestSubmitPayload,
  TestSubmitResponse,
  TestResult,
} from "@/types/test.types";

export const testApi = {
  getQuestions: async (): Promise<ApiResponse<TestQuestion[]>> => {
    const { data } =
      await apiClient.get<ApiResponse<TestQuestion[]>>("/test/questions");
    return data;
  },

  submit: async (
    payload: TestSubmitPayload,
  ): Promise<ApiResponse<TestSubmitResponse>> => {
    const { data } = await apiClient.post<ApiResponse<TestSubmitResponse>>(
      "/test/submit",
      payload,
    );
    return data;
  },

  getResults: async (testNumber: string): Promise<ApiResponse<TestResult>> => {
    const { data } = await apiClient.get<ApiResponse<TestResult>>(
      `/test/results/${testNumber}`,
    );
    return data;
  },
};
