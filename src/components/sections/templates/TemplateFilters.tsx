"use client";

import { Box, Typography, Skeleton } from "@mui/material";
import {
  Search as SearchIcon,
  Close as CloseIcon,
  TuneRounded as TuneIcon,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { useCategories } from "@/lib/hooks/useCategories";
import type { useSearchFilter } from "@/lib/hooks/useSearchFilter";
import { border } from "@mui/system";

const T = {
  white: "#FFFFFF",
  offwhite: "#F5F7FB", // cool section background
  cream: "#EDF3FF", // soft blue pale surface
  parchment: "rgba(59,123,246,0.06)", // subtle blue tint layer

  ink: "#0A0A0F",
  inkMid: "#1E1E2A",
  inkMuted: "#5A5A72",
  inkFaint: "#9898AE",
  inkGhost: "#C2CAD6",

  rule: "rgba(10,10,20,0.08)",
  ruleMd: "rgba(10,10,20,0.14)",

  blue: "#3B7BF6",
  blueMid: "#5A92F8",
  blueLight: "#7AABFF",
  blueGlow: "rgba(59,123,246,0.10)",
  border: "rgba(10,10,20,0.08)",
};


const SANS = '"DM Sans","Mona Sans",system-ui,sans-serif';
const MONO = '"DM Mono","JetBrains Mono",ui-monospace,monospace';

const SORT_OPTIONS = [
  { value: "popular", label: "Popular" },
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price ↑" },
  { value: "price_desc", label: "Price ↓" },
  { value: "rating", label: "Top Rated" },
];

type FilterState = ReturnType<typeof useSearchFilter>;
interface Props {
  filter: FilterState;
  inline?: boolean;
}

function CatPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.96 }}
      style={{
        position: "relative",
        flexShrink: 0,
        padding: "6px 14px",
        border: `1px solid ${active ? T.blue : T.border}`,
        borderRadius: "8px",
        background: active
          ? `linear-gradient(115deg,rgba(59,123,246,0.14),rgba(90,146,248,0.08))`
          : T.white,
        cursor: "pointer",
        outline: "none",
        transition: "border-color 0.15s, background 0.15s",
      }}
    >
      <Typography
        sx={{
          fontFamily: MONO,
          fontSize: "0.56rem",
          letterSpacing: "0.12em",
          color: active ? T.blue : T.inkMuted,
          textTransform: "uppercase",
          transition: "color 0.15s",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </Typography>
      {active && (
        <motion.div
          layoutId="cat-indicator"
          style={{
            position: "absolute",
            bottom: 0,
            left: 4,
            right: 4,
            height: "1.5px",
            background: `linear-gradient(90deg,${T.blue},${T.blueLight})`,
            borderRadius: "2px",
          }}
          transition={{ type: "spring", stiffness: 480, damping: 38 }}
        />
      )}
    </motion.button>
  );
}

export function TemplateFilters({ filter, inline }: Props) {
  const {
    searchQuery,
    selectedCategory,
    sortBy,
    handleSearchChange,
    handleCategoryChange,
    handleSortChange,
    clearFilters,
  } = filter;
  const { data: categoriesData, isLoading } = useCategories();
  const categories = categoriesData?.data ?? [];
  const hasActive = searchQuery || selectedCategory || sortBy !== "popular";

  return (
    <Box sx={{ mb: inline ? 0 : 5 }}>
      {/* ── Top row: search + sort + clear ── */}
      <Box
        sx={{
          borderTop: `1px solid ${T.border}`,
          borderBottom: `1px solid ${T.border}`,
          py: 1.75,
          display: "flex",
          alignItems: "center",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        {/* Search */}
        <Box
          sx={{
            flex: 1,
            minWidth: 200,
            display: "flex",
            alignItems: "center",
            gap: 1,
            borderRight: `1px solid ${T.border}`,
            pr: 2,
            transition: "border-color 0.15s",
          }}
        >
          <SearchIcon
            sx={{ fontSize: "0.9rem", color: T.inkFaint, flexShrink: 0 }}
          />
          <Box
            component="input"
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleSearchChange(e.target.value)
            }
            placeholder="Search templates…"
            sx={{
              flex: 1,
              border: "none",
              outline: "none",
              background: "transparent",
              fontFamily: SANS,
              fontSize: "0.875rem",
              color: T.ink,
              "&::placeholder": { color: T.inkGhost },
            }}
          />
          <AnimatePresence>
            {searchQuery && (
              <motion.button
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                onClick={() => handleSearchChange("")}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  padding: 2,
                }}
              >
                <CloseIcon sx={{ fontSize: "0.8rem", color: T.inkFaint }} />
              </motion.button>
            )}
          </AnimatePresence>
        </Box>

        {/* Sort */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            pr: hasActive ? 2 : 0,
            borderRight: hasActive ? `1px solid ${T.border}` : "none",
          }}
        >
          <TuneIcon sx={{ fontSize: "0.8rem", color: T.inkFaint }} />
          <Box
            component="select"
            value={sortBy}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              handleSortChange(e.target.value)
            }
            sx={{
              appearance: "none",
              border: "none",
              outline: "none",
              background: "transparent",
              fontFamily: MONO,
              fontSize: "0.6rem",
              letterSpacing: "0.1em",
              color: T.inkMuted,
              cursor: "pointer",
              "&:focus": { color: T.ink },
            }}
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </Box>
        </Box>

        {/* Clear */}
        <AnimatePresence>
          {hasActive && (
            <motion.div
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ duration: 0.18 }}
            >
              <Box
                component="button"
                onClick={clearFilters}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.6,
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: MONO,
                  fontSize: "0.56rem",
                  letterSpacing: "0.1em",
                  color: T.inkFaint,
                  textTransform: "uppercase",
                  outline: "none",
                  transition: "color 0.15s",
                  "&:hover": { color: T.ink },
                }}
              >
                <CloseIcon sx={{ fontSize: "0.65rem" }} />
                Clear
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>

      {/* ── Category pills row ── */}
      <Box
        sx={{
          display: "flex",
          gap: 1,
          flexWrap: "nowrap",
          overflowX: "auto",
          py: 1.75,
          mt: 0,
          msOverflowStyle: "none",
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        {isLoading ? (
          Array.from({ length: 7 }).map((_, i) => (
            <Skeleton
              key={i}
              variant="rectangular"
              width={90}
              height={28}
              sx={{ borderRadius: "8px", background: T.cream, flexShrink: 0 }}
            />
          ))
        ) : (
          <>
            <CatPill
              label="All"
              active={!selectedCategory}
              onClick={() => handleCategoryChange("")}
            />
            {categories.map((cat) => (
              <CatPill
                key={cat.id}
                label={`${cat.name} (${cat.templates_count})`}
                active={selectedCategory === cat.slug}
                onClick={() => handleCategoryChange(cat.slug)}
              />
            ))}
          </>
        )}
      </Box>
    </Box>
  );
}
