import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosResponse,
} from "axios";
import type { ApiError } from "@/types/api.types";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;
const TIMEOUT = Number(process.env.NEXT_PUBLIC_API_TIMEOUT) || 15000;

const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    if (process.env.NODE_ENV === "development") {
      console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError<ApiError>) => {
    const normalizedError: ApiError = {
      success: false,
      statusCode: error.response?.status ?? 500,
      error: error.response?.data?.error ?? "UNKNOWN_ERROR",
      message:
        error.response?.data?.message ??
        error.message ??
        "An unexpected error occurred",
      details: error.response?.data?.details,
    };

    if (process.env.NODE_ENV === "development") {
      console.error("[API Error]", normalizedError);
    }

    return Promise.reject(normalizedError);
  },
);

export default apiClient;
