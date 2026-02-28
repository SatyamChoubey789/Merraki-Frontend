import apiClient from "./client";
import type { ApiResponse, PaginatedResponse } from "@/types/api.types";
import type {
  Template,
  TemplateCategory,
  TemplateListParams,
  TemplateSearchParams,
} from "@/types/template.types";

export const templateApi = {
  getAll: async (
    params?: TemplateListParams,
  ): Promise<PaginatedResponse<Template>> => {
    const { data } = await apiClient.get<PaginatedResponse<Template>>(
      "/templates",
      { params },
    );
    return data;
  },

  getFeatured: async (): Promise<ApiResponse<Template[]>> => {
    const { data } = await apiClient.get<ApiResponse<Template[]>>(
      "/templates/featured",
    );
    return data;
  },

  getPopular: async (): Promise<ApiResponse<Template[]>> => {
    const { data } =
      await apiClient.get<ApiResponse<Template[]>>("/templates/popular");
    return data;
  },

  search: async (
    params: TemplateSearchParams,
  ): Promise<PaginatedResponse<Template>> => {
    const { data } = await apiClient.get<PaginatedResponse<Template>>(
      "/templates/search",
      { params },
    );
    return data;
  },

  getBySlug: async (slug: string): Promise<ApiResponse<Template>> => {
    const { data } = await apiClient.get<ApiResponse<Template>>(
      `/templates/${slug}`,
    );
    return data;
  },

  getCategories: async (): Promise<ApiResponse<TemplateCategory[]>> => {
    const { data } =
      await apiClient.get<ApiResponse<TemplateCategory[]>>("/categories");
    return data;
  },
};
