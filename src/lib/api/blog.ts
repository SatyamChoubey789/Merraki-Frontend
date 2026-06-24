import type {
  BlogPost,
  BlogCategory,
  ApiResponse,
  PaginatedResponse,
  SearchResponse,
} from "@/types/blog.types";
import apiClient from "./client";

// ── Request params types ──────────────────────────────────────────────────────

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

// ── Get all published blog posts (paginated) ──────────────────────────────────

export async function getBlogPosts(
  params: BlogPostsParams = {}
): Promise<PaginatedResponse<BlogPost>> {
  const { data } = await apiClient.get<PaginatedResponse<BlogPost>>(
    "/blog/posts",
    { params }
  );
  return data;
}

// ── Get featured blog posts ───────────────────────────────────────────────────

export async function getFeaturedBlogPosts(): Promise<PaginatedResponse<BlogPost>> {
  const { data } = await apiClient.get<PaginatedResponse<BlogPost>>(
    "/blog/posts",
    { params: { featured: true, limit: 6 } }
  );
  return data;
}

// ── Get popular blog posts (most views) ───────────────────────────────────────

export async function getPopularBlogPosts(): Promise<PaginatedResponse<BlogPost>> {
  const { data } = await apiClient.get<PaginatedResponse<BlogPost>>(
    "/blog/posts",
    { params: { sort: "popular", limit: 6 } }
  );
  return data;
}

// ── Search blog posts ─────────────────────────────────────────────────────────

export async function searchBlogPosts(
  params: BlogSearchParams
): Promise<SearchResponse> {
  const { data } = await apiClient.get<SearchResponse>(
    "/blog/posts/search",
    { params }
  );
  return data;
}

// ── Get single blog post by slug ──────────────────────────────────────────────

export async function getBlogPost(slug: string): Promise<ApiResponse<BlogPost>> {
  const { data } = await apiClient.get<ApiResponse<BlogPost>>(
    `/blog/posts/${slug}`
  );
  return data;
}

// ── Get all categories ────────────────────────────────────────────────────────

export async function getBlogCategories(): Promise<ApiResponse<BlogCategory[]>> {
  const { data } = await apiClient.get<ApiResponse<BlogCategory[]>>(
    "/blog/categories"
  );
  return data;
}

// ── Get posts by category ─────────────────────────────────────────────────────

export async function getBlogPostsByCategory(
  categorySlug: string,
  page = 1,
  limit = 12
): Promise<PaginatedResponse<BlogPost>> {
  const { data } = await apiClient.get<PaginatedResponse<BlogPost>>(
    `/blog/categories/${categorySlug}/posts`,
    { params: { page, limit } }
  );
  return data;
}

// ── Get posts by tag ──────────────────────────────────────────────────────────

export async function getBlogPostsByTag(
  tag: string,
  page = 1,
  limit = 12
): Promise<PaginatedResponse<BlogPost>> {
  const { data } = await apiClient.get<PaginatedResponse<BlogPost>>(
    `/blog/tags/${tag}/posts`,
    { params: { page, limit } }
  );
  return data;
}

// ── Get all authors ───────────────────────────────────────────────────────────

export async function getBlogAuthors(): Promise<ApiResponse<{ id: number; name: string; slug: string; avatar_url?: string }[]>> {
  const { data } = await apiClient.get<ApiResponse<{ id: number; name: string; slug: string; avatar_url?: string }[]>>(
    "/blog/authors"
  );
  return data;
}

// ── Get posts by author ───────────────────────────────────────────────────────

export async function getBlogPostsByAuthor(
  authorSlug: string,
  page = 1,
  limit = 12
): Promise<PaginatedResponse<BlogPost>> {
  const { data } = await apiClient.get<PaginatedResponse<BlogPost>>(
    `/blog/authors/${authorSlug}/posts`,
    { params: { page, limit } }
  );
  return data;
}