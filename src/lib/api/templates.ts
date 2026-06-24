// Aligned to public handler routes:
// GET /api/v1/templates?category_id=&featured=&search=&sort=&page=&limit=
// GET /api/v1/templates/:slug
// GET /api/v1/templates/search?q=&limit=
// GET /api/v1/templates/featured?limit=
// GET /api/v1/templates/bestsellers?limit=
// GET /api/v1/templates/new?limit=
// GET /api/v1/categories
// GET /api/v1/categories/:slug

import type {
  TemplatesListResponse,
  TemplateSingleResponse,
  CategoriesResponse,
  SearchResponse,
  TemplateListParams,
} from "@/types/template.types";

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error(`API error ${res.status}: ${path}`);
  return res.json();
}

export const templateApi = {
  // GET /api/v1/templates
  getAll(params: TemplateListParams = {}): Promise<TemplatesListResponse> {
    const q = new URLSearchParams();
    if (params.page)        q.set("page",        String(params.page));
    if (params.limit)       q.set("limit",       String(params.limit));
    if (params.category_id) q.set("category_id", String(params.category_id));
    if (params.sort)        q.set("sort",        params.sort);
    if (params.search)      q.set("search",      params.search);
    if (params.featured)    q.set("featured",    "true");
    const qs = q.toString();
    return get<TemplatesListResponse>(`/templates${qs ? `?${qs}` : ""}`);
  },

  // GET /api/v1/templates/:slug
  getBySlug(slug: string): Promise<TemplateSingleResponse> {
    return get<TemplateSingleResponse>(`/templates/${slug}`);
  },

  // GET /api/v1/templates/search?q=&limit=
  search(params: { q: string; limit?: number }): Promise<SearchResponse> {
    const q = new URLSearchParams({ q: params.q });
    if (params.limit) q.set("limit", String(params.limit));
    return get<SearchResponse>(`/templates/search?${q}`);
  },

  // GET /api/v1/templates/featured?limit=
  getFeatured(limit = 6): Promise<{ templates: TemplateSingleResponse["template"][] }> {
    return get(`/templates/featured?limit=${limit}`);
  },

  // GET /api/v1/templates/bestsellers?limit=
  getPopular(limit = 6): Promise<{ templates: TemplateSingleResponse["template"][] }> {
    return get(`/templates/bestsellers?limit=${limit}`);
  },

  // GET /api/v1/categories
  getCategories(): Promise<CategoriesResponse> {
    return get<CategoriesResponse>("/categories");
  },

  // GET /api/v1/categories/:slug
  getCategoryBySlug(slug: string): Promise<{ category: import("@/types/template.types").Category }> {
    return get(`/categories/${slug}`);
  },
};