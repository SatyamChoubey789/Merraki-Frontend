// =======================
// CATEGORY
// =======================
export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  parent_id?: number | null;
  display_order: number;
  is_active: boolean;
  meta_title?: string | null;
  meta_description?: string | null;
  created_at: string;
  updated_at: string;
}

// =======================
// TEMPLATE IMAGE
// =======================
export interface TemplateImage {
  id: number;
  template_id: number;
  url: string;
  alt_text?: string | null;
  display_order: number;
  is_primary: boolean;
  created_at: string;
}

// =======================
// TEMPLATE FEATURE
// =======================
export interface TemplateFeature {
  id: number;
  template_id: number;
  title: string;
  description?: string | null;
  display_order: number;
  created_at: string;
}

// =======================
// TEMPLATE
// =======================
export type TemplateStatus = "draft" | "active" | "archived";

export interface Template {
  id: number;
  name: string;
  slug: string;
  tagline?: string | null;
  description: string;

  category_id?: number | null;

  // 🔥 IMPORTANT: backend uses cents, not float
  price_usd_cents: number;
  sale_price_usd_cents?: number | null;

  file_url?: string | null;
  file_size_mb?: number | null;
  file_format?: string | null;
  preview_url?: string | null;

  status: TemplateStatus;

  downloads_count: number;
  views_count: number;

  is_featured: boolean;
  is_bestseller: boolean;
  is_new: boolean;

  meta_title?: string | null;
  meta_description?: string | null;
  meta_keywords?: string[];

  current_version: string;
  published_at?: string | null;

  created_at: string;
  updated_at: string;
}

// =======================
// TEMPLATE WITH RELATIONS
// =======================
export interface TemplateWithRelations extends Template {
  category?: Category;
  images?: TemplateImage[];
  features?: TemplateFeature[];
  tags?: string[];
}

// =======================
// RESPONSES
// =======================
export interface TemplatesListResponse {
  templates: TemplateWithRelations[] | null;
  total: number;
  page: number;
  limit: number;
}

export interface TemplateSingleResponse {
  template: TemplateWithRelations;
}

export interface CategoriesResponse {
  categories: Category[] | null;
}

export interface SearchResponse {
  templates: Template[] | null;
  query: string;
}

// =======================
// QUERY PARAMS
// =======================
export interface TemplateListParams {
  page?: number;
  limit?: number;
  category_id?: number;
  sort?: "popular" | "newest" | "price_asc" | "price_desc";
  search?: string;
  featured?: boolean;
}