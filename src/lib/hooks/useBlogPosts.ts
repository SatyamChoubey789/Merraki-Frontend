"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import type {
  BlogPost,
  BlogCategory,
  BlogPostsParams,
  SearchResponse,
} from "@/types/blog.types";
import {
  getBlogPosts,
  getBlogPost,
  getBlogCategories,
  searchBlogPosts,
  getBlogPostsByCategory,
  getBlogPostsByTag,
  getBlogPostsByAuthor,
  getBlogAuthors,
} from "@/lib/api/blog";

// ── Map backend BlogPost to frontend display ────────────────────────────────
function mapBlogPostToDisplay(post: BlogPost) {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    coverImage: post.featured_image_url,
    author: {
      name: post.author?.name || "Merraki Team",
      role: post.author?.email,
      bio: post.author?.bio,
      avatar: post.author?.avatar_url,
    },
    category: post.category
      ? { name: post.category.name, slug: post.category.slug }
      : undefined,
    tags: post.tags || [],
    publishedAt: post.published_at || post.created_at,
    readingTime: post.reading_time_minutes || 5,
    viewsCount: post.views_count || 0,
  };
}

// ── React Query Keys ───────────────────────────────────────────────────────
export const BLOG_KEYS = {
  all: ["blog"] as const,
  lists: () => [...BLOG_KEYS.all, "list"] as const,
  list: (params: BlogPostsParams) => [...BLOG_KEYS.lists(), params] as const,
  categories: () => [...BLOG_KEYS.all, "categories"] as const,
  search: (query: string) => [...BLOG_KEYS.all, "search", query] as const,
  detail: (slug: string) => [...BLOG_KEYS.all, "detail", slug] as const,
  authors: () => [...BLOG_KEYS.all, "authors"] as const,
};

// ── Hooks ────────────────────────────────────────────────────────────────

// Fetch paginated blog posts
export function useBlogPosts(params: BlogPostsParams = {}) {
  return useQuery({
    queryKey: BLOG_KEYS.list(params),
    queryFn: async () => {
      const data = await getBlogPosts(params);
      return { ...data, data: data.data.map(mapBlogPostToDisplay) };
    },
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Fetch single blog post by slug
export function useBlogPost(slug: string) {
  return useQuery({
    queryKey: BLOG_KEYS.detail(slug),
    queryFn: async () => {
      const data = await getBlogPost(slug);
      return { ...data, data: mapBlogPostToDisplay(data.data) };
    },
    enabled: !!slug,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

// Fetch all categories
export function useBlogCategories() {
  return useQuery({
    queryKey: BLOG_KEYS.categories(),
    queryFn: getBlogCategories,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

// Fetch all authors
export function useBlogAuthors() {
  return useQuery({
    queryKey: BLOG_KEYS.authors(),
    queryFn: async () => {
      const data = await getBlogAuthors();
      return data.data;
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

// Search blog posts
export function useBlogSearch(query: string, enabled: boolean = true) {
  return useQuery({
    queryKey: BLOG_KEYS.search(query),
    queryFn: async () => {
      const data: SearchResponse = await searchBlogPosts({ q: query });
      return {
        ...data,
        data: {
          ...data.data,
          results: data.data.results.map(mapBlogPostToDisplay),
        },
      };
    },
    enabled: enabled && query.trim().length > 0,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

// Fetch posts by category
export function useBlogPostsByCategory(categorySlug: string, page = 1) {
  return useQuery({
    queryKey: [...BLOG_KEYS.lists(), "category", categorySlug, page],
    queryFn: async () => {
      const data = await getBlogPostsByCategory(categorySlug, page);
      return { ...data, data: data.data.map(mapBlogPostToDisplay) };
    },
    enabled: !!categorySlug,
    placeholderData: keepPreviousData,
  });
}

// Fetch posts by tag
export function useBlogPostsByTag(tag: string, page = 1) {
  return useQuery({
    queryKey: [...BLOG_KEYS.lists(), "tag", tag, page],
    queryFn: async () => {
      const data = await getBlogPostsByTag(tag, page);
      return { ...data, data: data.data.map(mapBlogPostToDisplay) };
    },
    enabled: !!tag,
    placeholderData: keepPreviousData,
  });
}

// Fetch posts by author
export function useBlogPostsByAuthor(authorSlug: string, page = 1) {
  return useQuery({
    queryKey: [...BLOG_KEYS.lists(), "author", authorSlug, page],
    queryFn: async () => {
      const data = await getBlogPostsByAuthor(authorSlug, page);
      return { ...data, data: data.data.map(mapBlogPostToDisplay) };
    },
    enabled: !!authorSlug,
    placeholderData: keepPreviousData,
  });
}