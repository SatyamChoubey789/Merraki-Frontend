"use client";

import { Box, Typography, Skeleton, Drawer } from "@mui/material";
import { Search as SearchIcon, Close as CloseIcon, TuneRounded } from "@mui/icons-material";
import type { SearchFilterState } from "@/lib/hooks/useSearchFilter";
import { useTemplateCategories } from "@/lib/hooks/useTemplates";

// ─── Brand tokens ─────────────────────────────────────────────────────────────

const T = {
  bg: "#F5F7FB",
  surface: "#FFFFFF",
  ink: "#253957",
  inkMid: "rgba(37,57,87,0.75)",
  inkMuted: "rgba(37,57,87,0.55)",
  inkFaint: "rgba(37,57,87,0.35)",
  border: "rgba(37,57,87,0.10)",
  primary: "#253957",
  primaryLight: "rgba(37,57,87,0.06)",
  primaryBorder: "rgba(37,57,87,0.20)",
} as const;

const SANS = `"DM Sans", system-ui, sans-serif`;
const MONO = `"DM Mono", ui-monospace, monospace`;

// ─── Sort options — matched exactly to backend enum ───────────────────────────
// Backend accepts: newest | oldest | price_asc | price_desc
// "popular" does NOT exist in backend

const SORT_OPTIONS = [
  { value: "newest",     label: "Newest first" },
  { value: "oldest",     label: "Oldest first" },
  { value: "price_asc",  label: "Price: low → high" },
  { value: "price_desc", label: "Price: high → low" },
] as const;

// ─── Shared filter content ────────────────────────────────────────────────────

function FilterContent({
  filter,
  onClose,
}: {
  filter: SearchFilterState;
  onClose?: () => void;
}) {
  const {
    searchQuery,
    selectedCategory,
    sortBy,
    handleSearchChange,
    handleCategoryChange,
    handleSortChange,
    clearFilters,
  } = filter;

  // useTemplateCategories — correct hook name, returns categories[]
  const { categories, isLoading } = useTemplateCategories();

  const hasActive =
    !!searchQuery || selectedCategory !== null || sortBy !== "newest";

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 0 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 3,
        }}
      >
        <Typography
          sx={{
            fontFamily: MONO,
            fontSize: "0.6rem",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: T.inkMuted,
          }}
        >
          Filters
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {hasActive && (
            <Box
              component="button"
              onClick={clearFilters}
              sx={{
                fontFamily: SANS,
                fontSize: "0.72rem",
                fontWeight: 600,
                color: T.primary,
                border: "none",
                background: "transparent",
                cursor: "pointer",
                padding: 0,
                "&:hover": { opacity: 0.7 },
              }}
            >
              Clear all
            </Box>
          )}
          {onClose && (
            <Box
              component="button"
              onClick={onClose}
              sx={{
                width: 28,
                height: 28,
                borderRadius: "7px",
                border: `1px solid ${T.border}`,
                background: "transparent",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                "&:hover": { background: T.bg },
              }}
            >
              <CloseIcon sx={{ fontSize: "0.85rem", color: T.inkFaint }} />
            </Box>
          )}
        </Box>
      </Box>

      {/* Search */}
      <Box sx={{ mb: 3.5 }}>
        <Typography
          sx={{
            fontFamily: MONO,
            fontSize: "0.58rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: T.inkFaint,
            mb: 1,
          }}
        >
          Search
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            px: 1.5,
            height: 38,
            borderRadius: "9px",
            background: T.surface,
            border: `1.5px solid ${T.border}`,
            transition: "border-color 0.18s",
            "&:focus-within": { borderColor: T.primary },
          }}
        >
          <SearchIcon sx={{ fontSize: "0.9rem", color: T.inkFaint, flexShrink: 0 }} />
          <Box
            component="input"
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleSearchChange(e.target.value)
            }
            placeholder="Search…"
            sx={{
              flex: 1,
              border: "none",
              outline: "none",
              background: "transparent",
              fontFamily: SANS,
              fontSize: "0.8125rem",
              color: T.ink,
              "&::placeholder": { color: T.inkFaint },
            }}
          />
          {searchQuery && (
            <Box
              component="button"
              onClick={() => handleSearchChange("")}
              sx={{
                border: "none",
                background: "transparent",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                padding: 0,
              }}
            >
              <CloseIcon sx={{ fontSize: "0.75rem", color: T.inkFaint }} />
            </Box>
          )}
        </Box>
      </Box>

      {/* Divider */}
      <Box sx={{ height: "1px", background: T.border, mb: 3.5 }} />

      {/* Sort */}
      <Box sx={{ mb: 3.5 }}>
        <Typography
          sx={{
            fontFamily: MONO,
            fontSize: "0.58rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: T.inkFaint,
            mb: 1.25,
          }}
        >
          Sort by
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
          {SORT_OPTIONS.map((opt) => {
            const active = sortBy === opt.value;
            return (
              <Box
                key={opt.value}
                component="button"
                onClick={() => handleSortChange(opt.value as any)}
                sx={{
                  width: "100%",
                  textAlign: "left",
                  px: 1.5,
                  py: "9px",
                  borderRadius: "8px",
                  border: `1px solid ${active ? T.primaryBorder : "transparent"}`,
                  background: active ? T.primaryLight : "transparent",
                  color: active ? T.ink : T.inkMuted,
                  fontFamily: SANS,
                  fontSize: "0.8125rem",
                  fontWeight: active ? 600 : 400,
                  cursor: "pointer",
                  transition: "all 0.15s",
                  "&:hover": { background: T.bg, color: T.ink },
                }}
              >
                {opt.label}
              </Box>
            );
          })}
        </Box>
      </Box>

      {/* Divider */}
      <Box sx={{ height: "1px", background: T.border, mb: 3.5 }} />

      {/* Category — filters by slug, not id */}
      <Box>
        <Typography
          sx={{
            fontFamily: MONO,
            fontSize: "0.58rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: T.inkFaint,
            mb: 1.25,
          }}
        >
          Category
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
          {/* All */}
          <Box
            component="button"
            onClick={() => handleCategoryChange(null)}
            sx={{
              width: "100%",
              textAlign: "left",
              px: 1.5,
              py: "9px",
              borderRadius: "8px",
              border: `1px solid ${selectedCategory === null ? T.primaryBorder : "transparent"}`,
              background: selectedCategory === null ? T.primaryLight : "transparent",
              color: selectedCategory === null ? T.ink : T.inkMuted,
              fontFamily: SANS,
              fontSize: "0.8125rem",
              fontWeight: selectedCategory === null ? 600 : 400,
              cursor: "pointer",
              transition: "all 0.15s",
              "&:hover": { background: T.bg, color: T.ink },
            }}
          >
            All templates
          </Box>

          {isLoading ? (
            [1, 2, 3].map((i) => (
              <Skeleton key={i} height={36} sx={{ borderRadius: "8px" }} />
            ))
          ) : (
            categories.map((cat) => {
              // Filter by slug — that's what backend templateQuerySchema.category expects
              const active = selectedCategory === cat.slug;
              return (
                <Box
                  key={cat.id}
                  component="button"
                  onClick={() => handleCategoryChange(cat.slug)}
                  sx={{
                    width: "100%",
                    textAlign: "left",
                    px: 1.5,
                    py: "9px",
                    borderRadius: "8px",
                    border: `1px solid ${active ? T.primaryBorder : "transparent"}`,
                    background: active ? T.primaryLight : "transparent",
                    color: active ? T.ink : T.inkMuted,
                    fontFamily: SANS,
                    fontSize: "0.8125rem",
                    fontWeight: active ? 600 : 400,
                    cursor: "pointer",
                    transition: "all 0.15s",
                    "&:hover": { background: T.bg, color: T.ink },
                  }}
                >
                  {cat.name}
                </Box>
              );
            })
          )}
        </Box>
      </Box>
    </Box>
  );
}

// ─── Sidebar (desktop) ────────────────────────────────────────────────────────

export function FilterSidebar({ filter }: { filter: SearchFilterState }) {
  return (
    <Box
      sx={{
        width: 220,
        flexShrink: 0,
        position: "sticky",
        top: 100,
        alignSelf: "flex-start",
      }}
    >
      <FilterContent filter={filter} />
    </Box>
  );
}

// ─── Drawer (mobile) ─────────────────────────────────────────────────────────

export function FilterDrawer({
  filter,
  open,
  onClose,
}: {
  filter: SearchFilterState;
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Drawer anchor="left" open={open} onClose={onClose}>
      <Box sx={{ width: 300, p: 3, background: T.bg, minHeight: "100%" }}>
        <FilterContent filter={filter} onClose={onClose} />
      </Box>
    </Drawer>
  );
}

// ─── Trigger button (mobile) ──────────────────────────────────────────────────

export function FilterTriggerButton({
  filter,
  onClick,
}: {
  filter: SearchFilterState;
  onClick: () => void;
}) {
  const hasActive =
    !!filter.searchQuery ||
    filter.selectedCategory !== null ||
    filter.sortBy !== "newest";

  return (
    <Box
      component="button"
      onClick={onClick}
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 1,
        px: 2,
        py: "10px",
        borderRadius: "10px",
        border: `1.5px solid ${hasActive ? T.primary : T.border}`,
        background: hasActive ? T.primaryLight : T.surface,
        color: hasActive ? T.primary : T.inkMid,
        fontFamily: SANS,
        fontWeight: 600,
        fontSize: "0.875rem",
        cursor: "pointer",
        transition: "all 0.18s",
      }}
    >
      <TuneRounded sx={{ fontSize: "1rem" }} />
      Filters
      {hasActive && (
        <Box
          sx={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: T.primary,
          }}
        />
      )}
    </Box>
  );
}