"use client";

import { Box, Container, Typography, InputBase } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useState, useTransition } from "react";
import { BlogCard } from "./BlogCard";
import {
  Search as SearchIcon,
  ArrowBack,
  ArrowForward,
} from "@mui/icons-material";

const T = {
  bg: "#FFFFFF",
  page: "#F9FAFB",
  text: "#111118",
  muted: "#6B6B80",
  faint: "#A0A0B0",
  border: "rgba(10,10,20,0.07)",
  blue: "#2563EB",
  bluePale: "#EFF6FF",
  blueDim: "rgba(37,99,235,0.06)",
};

const SANS = '"DM Sans", system-ui, sans-serif';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface Props {
  posts: any[];
  pagination?: Pagination;
  categories?: Category[];
  activeCategory?: string;
  searchQuery?: string;
}

// ── Category filter tabs ───────────────────────────────────────────────────────

function CategoryTabs({
  categories,
  activeCategory,
  onSelect,
}: {
  categories: Category[];
  activeCategory?: string;
  onSelect: (slug: string | undefined) => void;
}) {
  if (!categories.length) return null;

  const all = [{ id: "all", name: "All", slug: "" }, ...categories];

  return (
    <Box
      sx={{
        display: "flex",
        gap: 1,
        flexWrap: "wrap",
        mt: 3,
      }}
    >
      {all.map((cat) => {
        const isActive =
          cat.slug === "" ? !activeCategory : cat.slug === activeCategory;
        return (
          <Box
            key={cat.id}
            component="button"
            onClick={() => onSelect(cat.slug || undefined)}
            sx={{
              fontFamily: SANS,
              fontSize: "0.8125rem",
              fontWeight: isActive ? 600 : 500,
              color: isActive ? T.blue : T.muted,
              background: isActive ? T.bluePale : "transparent",
              border: `1px solid ${isActive ? "rgba(37,99,235,0.25)" : T.border}`,
              borderRadius: "100px",
              px: 2,
              py: 0.75,
              cursor: "pointer",
              transition: "all 0.15s ease",
              "&:hover": {
                borderColor: "rgba(37,99,235,0.25)",
                color: T.blue,
                background: T.bluePale,
              },
            }}
          >
            {cat.name}
          </Box>
        );
      })}
    </Box>
  );
}

// ── Search input ───────────────────────────────────────────────────────────────

function SearchInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        background: T.bg,
        border: `1px solid ${T.border}`,
        borderRadius: "10px",
        px: 1.5,
        py: 1,
        mt: 2,
        maxWidth: 380,
        transition: "border-color 0.2s",
        "&:focus-within": {
          borderColor: "rgba(37,99,235,0.35)",
        },
      }}
    >
      <SearchIcon sx={{ fontSize: "1rem", color: T.faint, flexShrink: 0 }} />
      <InputBase
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search articles..."
        sx={{
          fontFamily: SANS,
          fontSize: "0.875rem",
          color: T.text,
          flex: 1,
          "& input::placeholder": { color: T.faint },
        }}
      />
      {value && (
        <Box
          component="button"
          onClick={() => onChange("")}
          sx={{
            border: "none",
            background: "none",
            cursor: "pointer",
            color: T.faint,
            display: "flex",
            p: 0,
            "&:hover": { color: T.text },
          }}
        >
          ✕
        </Box>
      )}
    </Box>
  );
}

// ── Pagination ─────────────────────────────────────────────────────────────────

function PaginationBar({
  pagination,
  onPageChange,
}: {
  pagination: Pagination;
  onPageChange: (page: number) => void;
}) {
  if (pagination.totalPages <= 1) return null;

  const { page, totalPages, hasNext, hasPrev, total } = pagination;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 2,
        mt: 6,
        pt: 4,
        borderTop: `1px solid ${T.border}`,
      }}
    >
      <Typography
        sx={{
          fontFamily: SANS,
          fontSize: "0.8125rem",
          color: T.faint,
        }}
      >
        {total} article{total !== 1 ? "s" : ""}
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Box
          component="button"
          onClick={() => onPageChange(page - 1)}
          disabled={!hasPrev}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            fontFamily: SANS,
            fontSize: "0.8125rem",
            fontWeight: 500,
            color: hasPrev ? T.text : T.faint,
            background: "none",
            border: `1px solid ${T.border}`,
            borderRadius: "8px",
            px: 1.5,
            py: 0.75,
            cursor: hasPrev ? "pointer" : "default",
            transition: "all 0.15s",
            "&:hover": hasPrev
              ? { borderColor: "rgba(37,99,235,0.3)", color: T.blue }
              : {},
          }}
        >
          <ArrowBack sx={{ fontSize: "0.875rem" }} />
          Prev
        </Box>

        {/* Page numbers */}
        <Box sx={{ display: "flex", gap: 0.5 }}>
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum: number;
            if (totalPages <= 5) pageNum = i + 1;
            else if (page <= 3) pageNum = i + 1;
            else if (page >= totalPages - 2) pageNum = totalPages - 4 + i;
            else pageNum = page - 2 + i;

            return (
              <Box
                key={pageNum}
                component="button"
                onClick={() => onPageChange(pageNum)}
                sx={{
                  fontFamily: SANS,
                  fontSize: "0.8125rem",
                  fontWeight: page === pageNum ? 700 : 400,
                  color: page === pageNum ? T.blue : T.muted,
                  background: page === pageNum ? T.bluePale : "none",
                  border: `1px solid ${page === pageNum ? "rgba(37,99,235,0.25)" : T.border}`,
                  borderRadius: "8px",
                  width: 36,
                  height: 36,
                  cursor: "pointer",
                  transition: "all 0.15s",
                  "&:hover":
                    page !== pageNum
                      ? { borderColor: "rgba(37,99,235,0.3)", color: T.blue }
                      : {},
                }}
              >
                {pageNum}
              </Box>
            );
          })}
        </Box>

        <Box
          component="button"
          onClick={() => onPageChange(page + 1)}
          disabled={!hasNext}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            fontFamily: SANS,
            fontSize: "0.8125rem",
            fontWeight: 500,
            color: hasNext ? T.text : T.faint,
            background: "none",
            border: `1px solid ${T.border}`,
            borderRadius: "8px",
            px: 1.5,
            py: 0.75,
            cursor: hasNext ? "pointer" : "default",
            transition: "all 0.15s",
            "&:hover": hasNext
              ? { borderColor: "rgba(37,99,235,0.3)", color: T.blue }
              : {},
          }}
        >
          Next
          <ArrowForward sx={{ fontSize: "0.875rem" }} />
        </Box>
      </Box>
    </Box>
  );
}

// ── Empty state ────────────────────────────────────────────────────────────────

function EmptyState({ search }: { search?: string }) {
  return (
    <Box
      sx={{
        textAlign: "center",
        py: 12,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 1.5,
      }}
    >
      <Typography
        sx={{
          fontSize: "2.5rem",
          lineHeight: 1,
        }}
      >
        📝
      </Typography>
      <Typography
        sx={{
          fontFamily: SANS,
          fontWeight: 600,
          fontSize: "1rem",
          color: T.text,
        }}
      >
        {search ? `No results for "${search}"` : "No articles yet"}
      </Typography>
      <Typography
        sx={{
          fontFamily: SANS,
          fontSize: "0.875rem",
          color: T.muted,
        }}
      >
        {search
          ? "Try a different search term or browse all articles."
          : "Check back soon — new content is on the way."}
      </Typography>
    </Box>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export function BlogPageClient({
  posts,
  pagination,
  categories = [],
  activeCategory,
  searchQuery = "",
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [localSearch, setLocalSearch] = useState(searchQuery);

  // Update URL params — triggers server re-fetch via RSC
  const updateParams = useCallback(
    (updates: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });

      // Always reset to page 1 when filters change
      if (!updates.page) params.delete("page");

      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
      });
    },
    [pathname, router, searchParams],
  );

  const handleCategorySelect = (slug: string | undefined) => {
    updateParams({ category: slug });
  };

  const handleSearch = (value: string) => {
    setLocalSearch(value);
    // Debounce — only update URL after user stops typing
    const timer = setTimeout(() => {
      updateParams({ search: value || undefined });
    }, 450);
    return () => clearTimeout(timer);
  };

  const handlePageChange = (page: number) => {
    updateParams({ page: String(page) });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const featured = posts[0];
  const rest = posts.slice(1);

  return (
    <Box sx={{ minHeight: "100vh", background: T.page, fontFamily: SANS }}>
      {/* ── Header ──────────────────────────────────────────────── */}
      <Box
        sx={{
          background: T.bg,
          borderBottom: `1px solid ${T.border}`,
          pt: { xs: 10, md: 14 },
          pb: 4,
        }}
      >
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <Typography
              component="h1"
              sx={{
                fontFamily: SANS,
                fontSize: { xs: "2rem", md: "2.5rem" },
                fontWeight: 800,
                color: T.text,
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
              }}
            >
              Blog
            </Typography>
            <Typography
              sx={{
                fontFamily: SANS,
                fontSize: "0.9375rem",
                color: T.muted,
                mt: 0.75,
              }}
            >
              Insights, guides, and ideas for founders.
            </Typography>

            {/* Search */}
            <SearchInput value={localSearch} onChange={handleSearch} />

            {/* Category tabs */}
            <CategoryTabs
              categories={categories}
              activeCategory={activeCategory}
              onSelect={handleCategorySelect}
            />
          </motion.div>
        </Container>
      </Box>

      {/* ── Content ─────────────────────────────────────────────── */}
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <AnimatePresence mode="wait">
          {isPending ? (
            // Loading skeleton
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "1fr 1fr",
                    md: "repeat(3, 1fr)",
                  },
                  gap: 3,
                }}
              >
                {Array.from({ length: 6 }).map((_, i) => (
                  <Box
                    key={i}
                    sx={{
                      height: 280,
                      borderRadius: "12px",
                      background: T.bg,
                      border: `1px solid ${T.border}`,
                      overflow: "hidden",
                      position: "relative",
                    }}
                  >
                    <Box
                      sx={{
                        position: "absolute",
                        inset: 0,
                        background: `linear-gradient(90deg, transparent 0%, rgba(37,99,235,0.04) 50%, transparent 100%)`,
                        backgroundSize: "200% 100%",
                        animation: "shimmer 1.5s linear infinite",
                        "@keyframes shimmer": {
                          "0%": { backgroundPosition: "-200% 0" },
                          "100%": { backgroundPosition: "200% 0" },
                        },
                      }}
                    />
                  </Box>
                ))}
              </Box>
            </motion.div>
          ) : posts.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <EmptyState search={searchQuery} />
            </motion.div>
          ) : (
            <motion.div
              key="posts"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Box sx={{ display: "flex", flexDirection: "column", gap: 5 }}>
                {/* Featured post */}
                {featured && !activeCategory && !searchQuery && (
                  <BlogCard post={featured} index={0} variant="featured" />
                )}

                {/* Grid */}
                {(activeCategory || searchQuery ? posts : rest).length > 0 && (
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: {
                        xs: "1fr",
                        sm: "1fr 1fr",
                        md: "repeat(3, 1fr)",
                      },
                      gap: { xs: 2.5, md: 3 },
                    }}
                  >
                    {(activeCategory || searchQuery ? posts : rest).map(
                      (post, i) => (
                        <BlogCard
                          key={post.id}
                          post={post}
                          index={i}
                          variant="default"
                        />
                      ),
                    )}
                  </Box>
                )}
              </Box>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pagination */}
        {pagination && (
          <PaginationBar
            pagination={pagination}
            onPageChange={handlePageChange}
          />
        )}
      </Container>
    </Box>
  );
}
