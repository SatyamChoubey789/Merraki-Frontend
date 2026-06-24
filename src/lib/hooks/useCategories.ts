"use client";

import { useQuery } from "@tanstack/react-query";
import { templateApi } from "@/lib/api/templates";

export const CATEGORY_KEYS = {
  all: ["categories"] as const,
};

export function useCategories() {
  return useQuery({
    queryKey: CATEGORY_KEYS.all,
    queryFn: () => templateApi.getCategories(),
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60,
  });
}
