"use client";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { templateApi } from "@/lib/api/templates";
import type { TemplateListParams } from "@/types/template.types";

export const TEMPLATE_KEYS = {
  all:      ["templates"] as const,
  lists:    () => [...TEMPLATE_KEYS.all, "list"] as const,
  list:     (p: TemplateListParams) => [...TEMPLATE_KEYS.lists(), p] as const,
  featured: () => [...TEMPLATE_KEYS.all, "featured"] as const,
  popular:  () => [...TEMPLATE_KEYS.all, "popular"] as const,
  search:   (q: string) => [...TEMPLATE_KEYS.all, "search", q] as const,
  detail:   (slug: string) => [...TEMPLATE_KEYS.all, "detail", slug] as const,
};

export const CATEGORY_KEYS = {
  all: ["categories"] as const,
};

export function useTemplates(params: TemplateListParams = {}) {
  return useQuery({
    queryKey: TEMPLATE_KEYS.list(params),
    queryFn:  () => templateApi.getAll(params),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  });
}

export function useFeaturedTemplates() {
  return useQuery({
    queryKey: TEMPLATE_KEYS.featured(),
    queryFn:  () => templateApi.getFeatured(),
    staleTime: 1000 * 60 * 10,
  });
}

export function usePopularTemplates() {
  return useQuery({
    queryKey: TEMPLATE_KEYS.popular(),
    queryFn:  () => templateApi.getPopular(),
    staleTime: 1000 * 60 * 10,
  });
}

export function useTemplateSearch(query: string, enabled = true) {
  return useQuery({
    queryKey: TEMPLATE_KEYS.search(query),
    queryFn:  () => templateApi.search({ q: query }),
    enabled:  enabled && query.trim().length >= 2,
    staleTime: 1000 * 60 * 2,
  });
}

export function useTemplate(slug: string) {
  return useQuery({
    queryKey: TEMPLATE_KEYS.detail(slug),
    queryFn:  () => templateApi.getBySlug(slug),
    enabled:  !!slug,
    staleTime: 1000 * 60 * 10,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: CATEGORY_KEYS.all,
    queryFn:  () => templateApi.getCategories(),
    staleTime: 1000 * 60 * 30,
    gcTime:    1000 * 60 * 60,
  });
}