// ── Types matching Go backend exactly ────────────────────────────────────────

export interface BlogAuthor {
  id: number;
  admin_id?: number;
  name: string;
  slug: string;
  email?: string;
  bio?: string;
  avatar_url?: string;
  social_links?: {
    twitter?: string;
    linkedin?: string;
    website?: string;
    instagram?: string;
    github?: string;
    [key: string]: string | undefined;
  };
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface BlogCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  parent_id?: number;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featured_image_url?: string;
  author_id?: number;
  category_id?: number;
  tags: string[];
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string[];
  status: "draft" | "published" | "archived";
  is_featured: boolean;
  views_count: number;
  reading_time_minutes?: number;
  published_at?: string;
  created_at: string;
  updated_at: string;

  author?: BlogAuthor;
  category?: BlogCategory;
}

// ── Frontend display types ───────────────────────────────────────────────────

export interface BlogPostDisplay {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  coverImage?: string;
  author: {
    name: string;
    role?: string;
    bio?: string;
    avatar?: string;
  };
  category?: {
    name: string;
    slug: string;
  };
  tags: string[];
  publishedAt: string;
  readingTime: number;
  viewsCount: number;
}

// ── API Response types ──────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

export interface SearchResponse {
  success: boolean;
  data: {
    results: BlogPost[];
    query: string;
    total: number;
  };
}

// ── Request params types ────────────────────────────────────────────────────

export interface BlogPostsParams {
  page?: number;
  limit?: number;
  category?: string;
  tag?: string;
  featured?: boolean;
}

export interface BlogSearchParams {
  q: string;
  limit?: number;
}