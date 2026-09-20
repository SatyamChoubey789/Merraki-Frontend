"use client";

import { Box, Typography } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { TemplateCard } from "./TemplateCard";
import { useTemplates } from "@/lib/hooks/useTemplates";
import type { SearchFilterState } from "@/lib/hooks/useSearchFilter";

// ─── Brand tokens ─────────────────────────────────────────────────────────────

const T = {
  bg: "#F5F7FB",
  surface: "#FFFFFF",
  ink: "#253957",
  inkMid:" rgba(37,57,87,0.75)",
  inkMuted: "rgba(37,57,87,0.55)",
  inkFaint: "rgba(37,57,87,0.35)",
  border: "rgba(37,57,87,0.10)",
  primary: "#253957",
  primaryLight: "rgba(37,57,87,0.06)",
  primaryBorder: "rgba(37,57,87,0.20)",
} as const;

const SANS = `"DM Sans", system-ui, sans-serif`;
const MONO = `"DM Mono", ui-monospace, monospace`;

// ─── Skeleton card ────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <Box
      sx={{
        background: T.surface,
        borderRadius: "16px",
        border: `1px solid ${T.border}`,
        overflow: "hidden",
        "@keyframes pulse": {
          "0%,100%": { opacity: 1 },
          "50%": { opacity: 0.45 },
        },
      }}
    >
      <Box
        sx={{
          height: 200,
          background: T.bg,
          animation: "pulse 1.8s ease-in-out infinite",
        }}
      />
      <Box sx={{ p: 2.5 }}>
        <Box
          sx={{
            height: 11,
            width: "40%",
            borderRadius: "4px",
            background: T.bg,
            mb: 1,
            animation: "pulse 1.8s ease-in-out infinite",
          }}
        />
        <Box
          sx={{
            height: 14,
            width: "75%",
            borderRadius: "4px",
            background: T.bg,
            mb: 0.75,
            animation: "pulse 1.8s ease-in-out infinite",
          }}
        />
        <Box
          sx={{
            height: 11,
            width: "90%",
            borderRadius: "4px",
            background: T.bg,
            mb: 0.5,
            animation: "pulse 1.8s ease-in-out infinite",
          }}
        />
        <Box
          sx={{
            height: 11,
            width: "65%",
            borderRadius: "4px",
            background: T.bg,
            animation: "pulse 1.8s ease-in-out infinite",
          }}
        />
      </Box>
    </Box>
  );
}

// ─── Grid ─────────────────────────────────────────────────────────────────────

interface TemplateGridProps {
  filter: SearchFilterState;
}

const GRID_SX = {
  display: "grid",
  gridTemplateColumns: {
    xs: "1fr",
    sm: "repeat(2, 1fr)",
    lg: "repeat(3, 1fr)",
  },
  gap: 3,
} as const;

export function TemplateGrid({ filter }: TemplateGridProps) {
  const { page, limit, goToPage, debouncedQuery, apiParams } = filter;

  // useTemplates receives the fully-composed apiParams from the filter hook
  // params shape matches TemplateListParams exactly — no transformation needed
  const { templates, pagination, isLoading, error } = useTemplates(apiParams);

  // ── Loading ──────────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <Box sx={GRID_SX}>
        {Array.from({ length: limit }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </Box>
    );
  }

  // ── Error ────────────────────────────────────────────────────────────────

  if (error) {
    return (
      <Box sx={{ textAlign: "center", py: 16 }}>
        <Typography
          sx={{
            fontFamily: SANS,
            fontWeight: 700,
            fontSize: "1rem",
            color: T.inkMuted,
            mb: 2,
          }}
        >
          Something went wrong loading templates.
        </Typography>
        <Box
          component="button"
          onClick={() => window.location.reload()}
          sx={{
            fontFamily: SANS,
            fontWeight: 600,
            fontSize: "0.875rem",
            color: T.primary,
            border: `1.5px solid ${T.primaryBorder}`,
            borderRadius: "9px",
            px: 3,
            py: 1.25,
            cursor: "pointer",
            background: "transparent",
            "&:hover": { background: T.primaryLight },
          }}
        >
          Retry
        </Box>
      </Box>
    );
  }

  // ── Empty ────────────────────────────────────────────────────────────────

  if (templates.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 16 }}>
        <Typography
          sx={{
            fontFamily: SANS,
            fontWeight: 700,
            fontSize: "1rem",
            color: T.inkFaint,
            mb: 0.75,
          }}
        >
          {debouncedQuery
            ? `No results for "${debouncedQuery}"`
            : "No templates found."}
        </Typography>
        <Typography
          sx={{
            fontFamily: SANS,
            fontSize: "0.875rem",
            color: T.inkFaint,
            mb: 3,
          }}
        >
          Try adjusting your filters.
        </Typography>
        <Box
          component="button"
          onClick={filter.clearFilters}
          sx={{
            fontFamily: SANS,
            fontWeight: 600,
            fontSize: "0.875rem",
            color: T.primary,
            border: `1.5px solid ${T.primaryBorder}`,
            borderRadius: "9px",
            px: 3,
            py: 1.25,
            cursor: "pointer",
            background: "transparent",
            "&:hover": { background: T.primaryLight },
          }}
        >
          Clear filters
        </Box>
      </Box>
    );
  }

  // ── Results ──────────────────────────────────────────────────────────────

  const total = pagination?.total ?? templates.length;
  const totalPages = pagination?.totalPages ?? 1;

  return (
    <Box>
      {/* Count */}
      <Typography
        sx={{
          fontFamily: MONO,
          fontSize: "0.6rem",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: T.inkFaint,
          mb: 3,
        }}
      >
        {debouncedQuery
          ? `${total.toLocaleString()} result${total !== 1 ? "s" : ""} for "${debouncedQuery}"`
          : `${total.toLocaleString()} template${total !== 1 ? "s" : ""}`}
      </Typography>

      {/* Grid */}
      <Box sx={GRID_SX}>
        <AnimatePresence mode="popLayout">
          {templates.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </AnimatePresence>
      </Box>

      {/* Pagination */}
      {totalPages > 1 && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 1,
            mt: 10,
            pt: 5,
            borderTop: `1px solid ${T.border}`,
          }}
        >
          {/* Prev */}
          {pagination?.hasPrev && (
            <Box
              component="button"
              onClick={() => goToPage(page - 1)}
              sx={{
                px: 2,
                py: "8px",
                borderRadius: "9px",
                border: `1px solid ${T.border}`,
                background: T.surface,
                color: T.inkMid,
                fontFamily: SANS,
                fontSize: "0.8rem",
                cursor: "pointer",
                "&:hover": { borderColor: T.primary, color: T.primary },
                transition: "all 0.15s",
              }}
            >
              ← Prev
            </Box>
          )}

          {/* Page numbers */}
          {Array.from({ length: totalPages }).map((_, i) => {
            const p = i + 1;
            const active = p === page;
            return (
              <motion.button
                key={p}
                onClick={() => goToPage(p)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "9px",
                  border: `1.5px solid ${active ? T.primary : T.border}`,
                  background: active ? T.primary : "transparent",
                  color: active ? "#fff" : T.inkFaint,
                  fontFamily: MONO,
                  fontSize: "0.8rem",
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                {p}
              </motion.button>
            );
          })}

          {/* Next */}
          {pagination?.hasNext && (
            <Box
              component="button"
              onClick={() => goToPage(page + 1)}
              sx={{
                px: 2,
                py: "8px",
                borderRadius: "9px",
                border: `1px solid ${T.border}`,
                background: T.surface,
                color: T.inkMid,
                fontFamily: SANS,
                fontSize: "0.8rem",
                cursor: "pointer",
                "&:hover": { borderColor: T.primary, color: T.primary },
                transition: "all 0.15s",
              }}
            >
              Next →
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}