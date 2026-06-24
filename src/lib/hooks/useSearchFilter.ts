"use client";
import { useState, useCallback, useDeferredValue } from "react";

interface SearchFilterOptions {
  initialSort?: string;
  defaultLimit?: number;
}

export function useSearchFilter({
  initialSort = "popular",
  defaultLimit = 12,
}: SearchFilterOptions = {}) {
  const [searchQuery, setSearchQuery]         = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null); // category_id (number)
  const [selectedCategorySlug, setSelectedCategorySlug] = useState(""); // for display
  const [sortBy, setSortBy]                   = useState(initialSort);
  const [page, setPage]                       = useState(1);
  const [limit]                               = useState(defaultLimit);

  // Debounced query for search API calls
  const debouncedQuery = useDeferredValue(searchQuery);
  const isSearching    = debouncedQuery.trim().length >= 2;

  const handleSearchChange = useCallback((v: string) => {
    setSearchQuery(v);
    setPage(1);
  }, []);

  // Accept category id + slug together
  const handleCategoryChange = useCallback((id: number | null, slug: string) => {
    setSelectedCategory(id);
    setSelectedCategorySlug(slug);
    setPage(1);
  }, []);

  const handleSortChange = useCallback((v: string) => {
    setSortBy(v);
    setPage(1);
  }, []);

  const clearFilters = useCallback(() => {
    setSearchQuery("");
    setSelectedCategory(null);
    setSelectedCategorySlug("");
    setSortBy(initialSort);
    setPage(1);
  }, [initialSort]);

  const goToPage = useCallback((p: number) => setPage(p), []);

  return {
    searchQuery,
    debouncedQuery,
    selectedCategory,       // number | null — used as category_id in API
    selectedCategorySlug,   // string — used for display/pill active state
    sortBy,
    page,
    limit,
    isSearching,
    handleSearchChange,
    handleCategoryChange,
    handleSortChange,
    clearFilters,
    goToPage,
  };
}