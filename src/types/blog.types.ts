// types/blog.types.ts
// Matches actual API response from /api/v1/public/blog/posts

// ─── Raw API shapes (snake_case, as returned by server) ──────────────────────

export interface BlogAuthorRaw {
  id: number;
  name: string;
  role?: string;
  bio?: string;
  avatar_url?: string;
}

export interface BlogPostRaw {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  featured_image_url: string | null;
  tags: string[];
  meta_title: string | null;
  meta_description: string | null;
  views_count: number;
  reading_time_minutes: number;
  author_id: number;
  author?: BlogAuthorRaw;           // may be populated or absent depending on endpoint
  category_id?: number;
  category?: BlogCategoryRaw;
  status: "published" | "draft";
  published_at: string;             // ISO string
  created_at: string;
  updated_at: string;
  is_featured?: boolean;
}

export interface BlogCategoryRaw {
  id: number;
  name: string;
  slug: string;
}

export interface PaginationRaw {
  total: number;
  page: number;
  pages: number;
  limit: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface BlogListResponseRaw {
  success: boolean;
  data: BlogPostRaw[];
  pagination: PaginationRaw;
}

export interface BlogPostResponseRaw {
  success: boolean;
  data: BlogPostRaw;
}

// ─── Normalised/camelCase shapes (used in components) ────────────────────────

export interface BlogAuthor {
  id: number;
  name: string;
  role?: string;
  bio?: string;
  avatarUrl?: string;
}

export interface BlogCategory {
  id: number;
  name: string;
  slug: string;
}

export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string | null;
  tags: string[];
  metaTitle: string | null;
  metaDescription: string | null;
  viewsCount: number;
  readingTime: number;               // minutes
  author: BlogAuthor;
  category: BlogCategory;
  isFeatured: boolean;
  status: "published" | "draft";
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  total: number;
  page: number;
  totalPages: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface BlogListResponse {
  success: boolean;
  data: BlogPost[];
  pagination: Pagination;
}

export interface BlogPostResponse {
  success: boolean;
  data: BlogPost;
}

// ─── Normaliser functions ─────────────────────────────────────────────────────

// Known authors by id — avoids a round-trip to /authors/:id on every post
// Add rows here whenever a new author is created in the backend.
const AUTHOR_MAP: Record<number, BlogAuthor> = {
  1: { id: 1, name: "Parag Bhutani",  role: "Co-Founder" },
  2: { id: 2, name: "Khyati Gupta",   role: "Co-Founder" },
};

const FALLBACK_AUTHOR: BlogAuthor = {
  id: 0,
  name: "Merraki Solutions",
  role: "Finance Expert",
};

const FALLBACK_CATEGORY: BlogCategory = {
  id: 0,
  name: "Finance",
  slug: "finance",
};

export function normaliseBlogPost(raw: BlogPostRaw): BlogPost {
  return {
    id: raw.id,
    slug: raw.slug,
    title: raw.title,
    excerpt: raw.excerpt,
    content: raw.content,
    coverImage: raw.featured_image_url ?? null,
    tags: raw.tags ?? [],
    metaTitle: raw.meta_title ?? null,
    metaDescription: raw.meta_description ?? null,
    viewsCount: raw.views_count ?? 0,
    readingTime: raw.reading_time_minutes ?? 1,
    // Prefer the populated author object; fall back to the id→name map;
    // final fallback is the generic "Merraki Solutions" identity.
    author: raw.author
      ? {
          id: raw.author.id,
          name: raw.author.name,
          role: raw.author.role,
          bio: raw.author.bio,
          avatarUrl: raw.author.avatar_url,
        }
      : AUTHOR_MAP[raw.author_id] ?? FALLBACK_AUTHOR,
    category: raw.category
      ? {
          id: raw.category.id,
          name: raw.category.name,
          slug: raw.category.slug,
        }
      : FALLBACK_CATEGORY,
    isFeatured: raw.is_featured ?? false,
    status: raw.status,
    publishedAt: raw.published_at,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  };
}

export function normalisePagination(raw: PaginationRaw): Pagination {
  return {
    total: raw.total,
    page: raw.page,
    totalPages: raw.pages,         // API sends "pages", we call it "totalPages"
    limit: raw.limit,
    hasNext: raw.has_next,
    hasPrev: raw.has_prev,
  };
}

export function normaliseBlogListResponse(raw: BlogListResponseRaw): BlogListResponse {
  return {
    success: raw.success,
    data: raw.data.map(normaliseBlogPost),
    pagination: normalisePagination(raw.pagination),
  };
}