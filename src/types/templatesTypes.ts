// ─── Matched exactly to backend GET /api/template-categories ─────────────────

export interface TemplateCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

// ─── Matched exactly to backend GET /api/templates (list) ────────────────────

export interface TemplateListItem {
  id: string;           // UUID
  title: string;        // NOT "name"
  slug: string;
  description: string | null;
  priceUsd: string;     // "9.99" — string, not number, no cents
  previewImages: { url: string; alt: string }[];  // array, no is_primary
  categoryId: string | null;
  tags: string[];
  featured: boolean;
  createdAt: string;
}

// ─── Matched exactly to backend GET /api/templates/:slug (detail) ────────────

export interface TemplateFull extends TemplateListItem {
  longDescription: any; // TipTap JSON
  // r2Key excluded by backend intentionally
}

// ─── Pagination shape from backend ───────────────────────────────────────────

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// ─── API response wrappers ────────────────────────────────────────────────────

export interface TemplateListResponse {
  success: true;
  data: TemplateListItem[];
  pagination: Pagination;
}

export interface TemplateSingleResponse {
  success: true;
  data: TemplateFull;
}

export interface CategoryListResponse {
  success: true;
  data: TemplateCategory[];
}

// ─── Query params for GET /api/templates ─────────────────────────────────────

export interface TemplateListParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;    // category slug
  tag?: string;
  featured?: "true" | "false";
  minPrice?: number;
  maxPrice?: number;
  sort?: "newest" | "oldest" | "price_asc" | "price_desc";
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Convert backend priceUsd string → cents integer for display math */
export function priceToCents(priceUsd: string): number {
  return Math.round(parseFloat(priceUsd) * 100);
}

/** Get the primary preview image — backend has no is_primary, first = primary */
export function getPrimaryImage(
  images: { url: string; alt: string }[],
): { url: string; alt: string } | null {
  return images[0] ?? null;
}

/** Stable numeric hash of a UUID string for icon picking etc */
export function uuidToIndex(uuid: string, mod: number): number {
  let hash = 0;
  for (let i = 0; i < uuid.length; i++) {
    hash = (hash * 31 + uuid.charCodeAt(i)) >>> 0;
  }
  return hash % mod;
}