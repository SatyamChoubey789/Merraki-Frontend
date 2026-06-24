export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ApiError {
  message: string;
  error?: string;
  statusCode?: number;
  details?: Record<string, string[]>;
}
export type SortOrder = "asc" | "desc";

export interface BaseQueryParams {
  page?: number;
  limit?: number;

  // ⚠️ match backend naming
  sort?: "popular" | "newest" | "price_asc" | "price_desc";
  search?: string;
}
