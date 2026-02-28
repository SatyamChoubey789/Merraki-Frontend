import apiClient from "./client";
import type { ApiResponse, PaginatedResponse } from "@/types/api.types";
import type {
  BlogPost,
  BlogCategory,
  BlogListParams,
  BlogSearchParams,
} from "@/types/blog.types";

export const blogApi = {
  getAll: async (
    params?: BlogListParams,
  ): Promise<PaginatedResponse<BlogPost>> => {
    const { data } = await apiClient.get<PaginatedResponse<BlogPost>>(
      "/blog/posts",
      { params },
    );
    return data;
  },

  getFeatured: async (): Promise<ApiResponse<BlogPost[]>> => {
    const { data } = await apiClient.get<ApiResponse<BlogPost[]>>(
      "/blog/posts/featured",
    );
    return data;
  },

  getPopular: async (): Promise<ApiResponse<BlogPost[]>> => {
    const { data } = await apiClient.get<ApiResponse<BlogPost[]>>(
      "/blog/posts/popular",
    );
    return data;
  },

  search: async (
    params: BlogSearchParams,
  ): Promise<PaginatedResponse<BlogPost>> => {
    const { data } = await apiClient.get<PaginatedResponse<BlogPost>>(
      "/blog/posts/search",
      { params },
    );
    return data;
  },

  getBySlug: async (slug: string): Promise<ApiResponse<BlogPost>> => {
    const { data } = await apiClient.get<ApiResponse<BlogPost>>(
      `/blog/posts/${slug}`,
    );
    return data;
  },

  getCategories: async (): Promise<ApiResponse<BlogCategory[]>> => {
    const { data } =
      await apiClient.get<ApiResponse<BlogCategory[]>>("/blog/categories");
    return data;
  },
};
