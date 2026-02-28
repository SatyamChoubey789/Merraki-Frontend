"use client";

import { useState, useCallback } from "react";
import { useDebounce } from "./useDebounce";
import { usePagination } from "./usePagination";

interface UseSearchFilterOptions {
  initialCategory?: string;
  initialSort?: string;
}

export function useSearchFilter({
  initialCategory = "",
  initialSort = "newest",
}: UseSearchFilterOptions = {}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState(initialSort);
  const debouncedQuery = useDebounce(searchQuery, 400);
  const { page, limit, goToPage, resetPage } = usePagination();

  const isSearching = debouncedQuery.trim().length >= 2;

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchQuery(value);
      resetPage();
    },
    [resetPage],
  );

  const handleCategoryChange = useCallback(
    (category: string) => {
      setSelectedCategory(category);
      resetPage();
    },
    [resetPage],
  );

  const handleSortChange = useCallback(
    (sort: string) => {
      setSortBy(sort);
      resetPage();
    },
    [resetPage],
  );

  const clearFilters = useCallback(() => {
    setSearchQuery("");
    setSelectedCategory("");
    setSortBy("newest");
    resetPage();
  }, [resetPage]);

  return {
    searchQuery,
    debouncedQuery,
    selectedCategory,
    sortBy,
    page,
    limit,
    isSearching,
    handleSearchChange,
    handleCategoryChange,
    handleSortChange,
    goToPage,
    clearFilters,
  };
}
