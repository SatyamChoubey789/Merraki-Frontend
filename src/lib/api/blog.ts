import {
  type BlogListResponseRaw,
  type BlogPostResponseRaw,
  type BlogListResponse,
  type BlogPostResponse,
  normaliseBlogListResponse,
  normaliseBlogPost,
} from "@/types/blog.types";
import apiClient from "./client";

export interface BlogPostsParams {
  page?: number;
  limit?: number;
  category?: string;
  tag?: string;
  sort?: "newest" | "oldest" | "popular";
}

export interface BlogSearchParams {
  q: string;
  page?: number;
  limit?: number;
}

// ─── List ─────────────────────────────────────────────────────────────────────

export async function getBlogPosts(
  params: BlogPostsParams = {}
): Promise<BlogListResponse> {
  const { data } = await apiClient.get<BlogListResponseRaw>("/blog/posts", {
    params,
  });
  return normaliseBlogListResponse(data);
}

// ─── Featured ─────────────────────────────────────────────────────────────────

export async function getFeaturedBlogPosts(): Promise<BlogListResponse> {
  const { data } = await apiClient.get<BlogListResponseRaw>(
    "/blog/posts/featured"
  );
  return normaliseBlogListResponse(data);
}

// ─── Popular ──────────────────────────────────────────────────────────────────

export async function getPopularBlogPosts(): Promise<BlogListResponse> {
  const { data } = await apiClient.get<BlogListResponseRaw>(
    "/blog/posts/popular"
  );
  return normaliseBlogListResponse(data);
}

// ─── Search ───────────────────────────────────────────────────────────────────

export async function searchBlogPosts(
  params: BlogSearchParams
): Promise<BlogListResponse> {
  const { data } = await apiClient.get<BlogListResponseRaw>(
    "/blog/posts/search",
    { params }
  );
  return normaliseBlogListResponse(data);
}

// ─── Single post ──────────────────────────────────────────────────────────────

export async function getBlogPost(slug: string): Promise<BlogPostResponse> {
  const { data } = await apiClient.get<BlogPostResponseRaw>(
    `/blog/posts/${slug}`
  );
  return {
    success: data.success,
    data: normaliseBlogPost(data.data),
  };
}

// ─── Categories ───────────────────────────────────────────────────────────────

export interface BlogCategoriesResponse {
  success: boolean;
  data: { id: number; name: string; slug: string }[];
}

export async function getBlogCategories(): Promise<BlogCategoriesResponse> {
  const { data } = await apiClient.get<BlogCategoriesResponse>(
    "/blog/categories"
  );
  return data;
}