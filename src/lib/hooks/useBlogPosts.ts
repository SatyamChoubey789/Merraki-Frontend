'use client';

import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { blogApi } from '@/lib/api/blog';
import type { BlogListParams } from '@/types/blog.types';

export const BLOG_KEYS = {
  all: ['blog'] as const,
  lists: () => [...BLOG_KEYS.all, 'list'] as const,
  list: (params: BlogListParams) => [...BLOG_KEYS.lists(), params] as const,
  featured: () => [...BLOG_KEYS.all, 'featured'] as const,
  popular: () => [...BLOG_KEYS.all, 'popular'] as const,
  search: (query: string) => [...BLOG_KEYS.all, 'search', query] as const,
  detail: (slug: string) => [...BLOG_KEYS.all, 'detail', slug] as const,
  categories: () => [...BLOG_KEYS.all, 'categories'] as const,
};

export function useBlogPosts(params: BlogListParams = {}) {
  return useQuery({
    queryKey: BLOG_KEYS.list(params),
    queryFn: () => blogApi.getAll(params),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  });
}

export function useFeaturedBlogPosts() {
  return useQuery({
    queryKey: BLOG_KEYS.featured(),
    queryFn: () => blogApi.getFeatured(),
    staleTime: 1000 * 60 * 15,
  });
}

export function usePopularBlogPosts() {
  return useQuery({
    queryKey: BLOG_KEYS.popular(),
    queryFn: () => blogApi.getPopular(),
    staleTime: 1000 * 60 * 15,
  });
}

export function useBlogSearch(query: string, enabled: boolean = true) {
  return useQuery({
    queryKey: BLOG_KEYS.search(query),
    queryFn: () => blogApi.search({ q: query }),
    enabled: enabled && query.trim().length >= 2,
    staleTime: 1000 * 60 * 2,
  });
}

export function useBlogPost(slug: string) {
  return useQuery({
    queryKey: BLOG_KEYS.detail(slug),
    queryFn: () => blogApi.getBySlug(slug),
    enabled: !!slug,
    staleTime: 1000 * 60 * 10,
  });
}

export function useBlogCategories() {
  return useQuery({
    queryKey: BLOG_KEYS.categories(),
    queryFn: () => blogApi.getCategories(),
    staleTime: 1000 * 60 * 30,
  });
}