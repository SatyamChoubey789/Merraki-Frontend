// lib/hooks/useBlogPosts.ts

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import {
  getBlogPosts,
  getFeaturedBlogPosts,
  getPopularBlogPosts,
  searchBlogPosts,
  getBlogPost,
  getBlogCategories,
  type BlogPostsParams,
} from "@/lib/api/blog";

// ─── Query keys ───────────────────────────────────────────────────────────────

export const blogKeys = {
  all: ["blog"] as const,
  lists: () => [...blogKeys.all, "list"] as const,
  list: (params: BlogPostsParams) => [...blogKeys.lists(), params] as const,
  featured: () => [...blogKeys.all, "featured"] as const,
  popular: () => [...blogKeys.all, "popular"] as const,
  search: (q: string) => [...blogKeys.all, "search", q] as const,
  post: (slug: string) => [...blogKeys.all, "post", slug] as const,
  categories: () => [...blogKeys.all, "categories"] as const,
};

// ─── Hooks ────────────────────────────────────────────────────────────────────

export function useBlogPosts(params: BlogPostsParams = {}) {
  return useQuery({
    queryKey: blogKeys.list(params),
    queryFn: () => getBlogPosts(params),
    placeholderData: keepPreviousData,  // smooth pagination — no flash between pages
    staleTime: 1000 * 60 * 3,
  });
}

export function useFeaturedBlogPosts() {
  return useQuery({
    queryKey: blogKeys.featured(),
    queryFn: getFeaturedBlogPosts,
    staleTime: 1000 * 60 * 10,
  });
}

export function usePopularBlogPosts() {
  return useQuery({
    queryKey: blogKeys.popular(),
    queryFn: getPopularBlogPosts,
    staleTime: 1000 * 60 * 10,
  });
}

export function useBlogSearch(q: string, enabled = true) {
  return useQuery({
    queryKey: blogKeys.search(q),
    queryFn: () => searchBlogPosts({ q }),
    enabled: enabled && q.trim().length > 1,
    staleTime: 1000 * 60 * 2,
  });
}

export function useBlogPost(slug: string) {
  return useQuery({
    queryKey: blogKeys.post(slug),
    queryFn: () => getBlogPost(slug),
    enabled: !!slug,
    staleTime: 1000 * 60 * 5,
  });
}

export function useBlogCategories() {
  return useQuery({
    queryKey: blogKeys.categories(),
    queryFn: getBlogCategories,
    staleTime: 1000 * 60 * 30,
  });
}