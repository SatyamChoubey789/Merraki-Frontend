"use client";

import {
  Box,
  Typography,
  Skeleton,
  Drawer,
  IconButton,
  Divider,
} from "@mui/material";
import {
  Search as SearchIcon,
  Close as CloseIcon,
  TuneRounded,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useCategories } from "@/lib/hooks/useTemplates";
import type { useSearchFilter } from "@/lib/hooks/useSearchFilter";

/* ─────────────────────────────
   MINIMAL THEME (NO BLUE)
───────────────────────────── */

const T = {
  bg: "#F5F7FB",
  surface: "#FFFFFF",

  text: "#252525",
  muted: "#6B7280",
  faint: "#9CA3AF",

  border: "rgba(0,0,0,0.08)",
  hover: "rgba(0,0,0,0.04)",
  selected: "rgba(0,0,0,0.06)",
};

const SANS = '"DM Sans","Mona Sans",system-ui,-apple-system,sans-serif';

const MONO = '"DM Mono","JetBrains Mono","SF Mono",ui-monospace,monospace';

type FilterState = ReturnType<typeof useSearchFilter>;

interface Props {
  filter: FilterState;
}

const SORT_OPTIONS = [
  { value: "popular", label: "Most Popular" },
  { value: "newest", label: "Newest First" },
  { value: "price_asc", label: "Price: Low → High" },
  { value: "price_desc", label: "Price: High → Low" },
];

/* ───────────────────────────── */

function FilterContent({
  filter,
  onClose,
}: {
  filter: FilterState;
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

  const { data, isLoading } = useCategories();
  const categories = data?.categories ?? [];

  const hasActive =
    searchQuery || selectedCategory !== null || sortBy !== "popular";

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* HEADER */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          pb: 2,
          mb: 2,
          borderBottom: `1px solid ${T.border}`,
        }}
      >
        <Typography
          sx={{
            fontFamily: MONO,
            fontSize: "0.62rem",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: T.muted,
          }}
        >
          Filters
        </Typography>

        <Box sx={{ display: "flex", gap: 1 }}>
          {hasActive && (
            <Box
              component="button"
              onClick={clearFilters}
              sx={{
                fontFamily: SANS,
                fontSize: "0.72rem",
                color: T.text,
                border: "none",
                background: "transparent",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Clear
            </Box>
          )}

          {onClose && (
            <IconButton onClick={onClose} size="small">
              <CloseIcon sx={{ fontSize: 18, color: T.muted }} />
            </IconButton>
          )}
        </Box>
      </Box>

      {/* SEARCH */}
      <Box sx={{ mb: 3 }}>
        <Typography
          sx={{ fontFamily: MONO, fontSize: "0.6rem", mb: 1, color: T.muted }}
        >
          Search
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            px: 1.5,
            height: 40,
            borderRadius: "10px",
            background: T.surface,
            border: `1px solid ${T.border}`,
          }}
        >
          <SearchIcon sx={{ fontSize: 16, color: T.faint }} />

          <Box
            component="input"
            value={searchQuery}
            onChange={(e: any) => handleSearchChange(e.target.value)}
            placeholder="Search templates..."
            sx={{
              flex: 1,
              ml: 1,
              border: "none",
              outline: "none",
              background: "transparent",
              fontFamily: SANS,
              fontSize: "0.85rem",
              color: T.text,
            }}
          />
        </Box>
      </Box>

      <Divider sx={{ my: 2, borderColor: T.border }} />

      {/* SORT */}
      <Box sx={{ mb: 3 }}>
        <Typography
          sx={{ fontFamily: MONO, fontSize: "0.6rem", mb: 1, color: T.muted }}
        >
          Sort
        </Typography>

        {SORT_OPTIONS.map((opt) => (
          <Box
            key={opt.value}
            component="button"
            onClick={() => handleSortChange(opt.value)}
            sx={{
              width: "100%",
              textAlign: "left",
              px: 1.5,
              py: 1,
              mb: 0.5,
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              background: sortBy === opt.value ? T.selected : "transparent",
              color: T.text,
              fontFamily: SANS,
              fontSize: "0.85rem",

              "&:hover": {
                background: T.hover,
              },
            }}
          >
            {opt.label}
          </Box>
        ))}
      </Box>

      <Divider sx={{ my: 2, borderColor: T.border }} />

      {/* CATEGORY */}
      <Box>
        <Typography
          sx={{ fontFamily: MONO, fontSize: "0.6rem", mb: 1, color: T.muted }}
        >
          Category
        </Typography>

        {isLoading ? (
          <Skeleton height={40} />
        ) : (
          <>
            <Box
              component="button"
              onClick={() => handleCategoryChange(null, "")}
              sx={{
                width: "100%",
                textAlign: "left",
                px: 1.5,
                py: 1,
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                background:
                  selectedCategory === null ? T.selected : "transparent",
                color: T.text,
              }}
            >
              All Templates
            </Box>

            {categories.map((cat: any) => (
              <Box
                key={cat.id}
                component="button"
                onClick={() => handleCategoryChange(cat.id, cat.slug)}
                sx={{
                  width: "100%",
                  textAlign: "left",
                  px: 1.5,
                  py: 1,
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer",
                  background:
                    selectedCategory === cat.id ? T.selected : "transparent",
                  color: T.text,

                  "&:hover": {
                    background: T.hover,
                  },
                }}
              >
                {cat.name}
              </Box>
            ))}
          </>
        )}
      </Box>
    </Box>
  );
}

/* ───────────────────────────── */

export function FilterSidebar({ filter }: Props) {
  return (
    <Box sx={{ width: 240, position: "sticky", top: 100 }}>
      <FilterContent filter={filter} />
    </Box>
  );
}

export function FilterDrawer({
  filter,
  open,
  onClose,
}: Props & { open: boolean; onClose: () => void }) {
  return (
    <Drawer open={open} onClose={onClose} anchor="left">
      <Box sx={{ width: 320, p: 2, background: T.bg }}>
        <FilterContent filter={filter} onClose={onClose} />
      </Box>
    </Drawer>
  );
}

export function FilterTriggerButton({
  filter,
  onClick,
}: {
  filter: FilterState;
  onClick: () => void;
}) {
  const active =
    filter.selectedCategory !== null ||
    filter.sortBy !== "popular" ||
    !!filter.searchQuery;

  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.97 }}
      style={{
        padding: "10px 16px",
        borderRadius: 10,
        border: `1px solid ${T.border}`,
        background: active ? T.selected : T.surface,
        fontFamily: SANS,
        fontWeight: 600,
        cursor: "pointer",
        color: T.text,
      }}
    >
      <TuneRounded style={{ fontSize: 16, marginRight: 6 }} />
      Filters
    </motion.button>
  );
}
