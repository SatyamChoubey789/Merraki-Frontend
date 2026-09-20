"use client";

import { useState, useCallback, useDeferredValue } from "react";
import type { TemplateListParams } from "@/types/templatesTypes";

// Backend sort enum — "popular" does NOT exist
type SortOption = "newest" | "oldest" | "price_asc" | "price_desc";

interface UseSearchFilterOptions {
  defaultLimit?: number;
  initialSort?: SortOption;
}

export interface SearchFilterState {
  // Raw values
  searchQuery: string;
  selectedCategory: string | null; // category SLUG (what backend filters on)
  sortBy: SortOption;
  page: number;
  limit: number;

  // Deferred search query — only triggers API call after user stops typing
  debouncedQuery: string;
  isSearching: boolean;

  // Handlers
  handleSearchChange: (val: string) => void;
  handleCategoryChange: (slug: string | null) => void;
  handleSortChange: (sort: SortOption) => void;
  goToPage: (p: number) => void;
  clearFilters: () => void;

  // Ready-to-use params object for useTemplates()
  apiParams: TemplateListParams;
}

export function useSearchFilter({
  defaultLimit = 12,
  initialSort = "newest",
}: UseSearchFilterOptions = {}): SearchFilterState {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>(initialSort);
  const [page, setPage] = useState(1);

  // useDeferredValue defers the search query so the grid doesn't
  // re-fetch on every keystroke — React 18 built-in debounce alternative
  const debouncedQuery = useDeferredValue(searchQuery);
  const isSearching = debouncedQuery.trim().length > 0;

  const handleSearchChange = useCallback((val: string) => {
    setSearchQuery(val);
    setPage(1); // reset to page 1 on new search
  }, []);

  const handleCategoryChange = useCallback((slug: string | null) => {
    setSelectedCategory(slug);
    setPage(1);
  }, []);

  const handleSortChange = useCallback((sort: SortOption) => {
    setSortBy(sort);
    setPage(1);
  }, []);

  const goToPage = useCallback((p: number) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const clearFilters = useCallback(() => {
    setSearchQuery("");
    setSelectedCategory(null);
    setSortBy(initialSort);
    setPage(1);
  }, [initialSort]);

  // Compose backend-ready params
  const apiParams: TemplateListParams = {
    page,
    limit: defaultLimit,
    sort: sortBy,
    ...(debouncedQuery.trim() ? { search: debouncedQuery.trim() } : {}),
    ...(selectedCategory ? { category: selectedCategory } : {}),
  };

  return {
    searchQuery,
    selectedCategory,
    sortBy,
    page,
    limit: defaultLimit,
    debouncedQuery,
    isSearching,
    handleSearchChange,
    handleCategoryChange,
    handleSortChange,
    goToPage,
    clearFilters,
    apiParams,
  };
}