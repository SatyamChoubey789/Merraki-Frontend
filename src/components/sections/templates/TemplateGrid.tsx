"use client";

import { Box, Typography } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { useTemplates, useTemplateSearch } from "@/lib/hooks/useTemplates";
import { TemplateCard } from "./TemplateCard";
import type { useSearchFilter } from "@/lib/hooks/useSearchFilter";

/* THEME (UPDATED) */
const T = {
  bg: "#f5f7fb",
  bgSection: "#F5F7FB",
  ink: "#0A0A0F",
  inkMuted: "#5A5A72",
  inkFaint: "#9898AE",
  border: "rgba(10,10,20,0.09)",

  // PRIMARY BRAND COLOR (your requested)
  primary: "#253957",
  primaryPale: "#E9EEF5",
  primaryGrad: "linear-gradient(135deg,#253957 0%,#3A4F6A 100%)",
};

const SANS = '"DM Sans","Mona Sans",system-ui,sans-serif';
const MONO = '"DM Mono","JetBrains Mono",ui-monospace,monospace';

type FilterState = ReturnType<typeof useSearchFilter>;

interface Props {
  filter: FilterState;
}

/* Skeleton */
function Skel() {
  return (
    <Box
      sx={{
        "@keyframes pulse": {
          "0%,100%": { opacity: 1 },
          "50%": { opacity: 0.5 },
        },
      }}
    >
      <Box
        sx={{
          height: 220,
          borderRadius: "14px",
          mb: 1.75,
          background: T.primaryPale,
          animation: "pulse 1.8s ease-in-out infinite",
        }}
      />
      <Box
        sx={{
          height: 13,
          width: "72%",
          mb: 1,
          animation: "pulse 1.8s ease-in-out infinite",
          background: T.bgSection,
          borderRadius: "4px",
        }}
      />
      <Box
        sx={{
          height: 11,
          width: "52%",
          mb: 1.5,
          animation: "pulse 1.8s ease-in-out infinite",
          background: T.bgSection,
          borderRadius: "4px",
        }}
      />
      <Box
        sx={{
          height: 11,
          width: "88%",
          animation: "pulse 1.8s ease-in-out infinite",
          background: T.bgSection,
          borderRadius: "4px",
        }}
      />
    </Box>
  );
}

export function TemplateGrid({ filter }: Props) {
  const {
    debouncedQuery,
    selectedCategory,
    sortBy,
    page,
    limit,
    isSearching,
    goToPage,
  } = filter;

  const listQ = useTemplates({
    page,
    limit,
    category_id: selectedCategory ?? undefined,
    sort: sortBy as any,
  });

  const searchQ = useTemplateSearch(debouncedQuery, isSearching);

  const active = isSearching ? searchQ : listQ;
  const { data, isLoading, isError, refetch } = active;

  const templates = (data as any)?.templates ?? [];
  const total = (data as any)?.total ?? templates.length;
  const pages = !isSearching && limit ? Math.ceil(total / limit) : 1;

  if (isLoading)
    return (
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr",
            lg: "repeat(3,1fr)",
          },
          gap: 3.5,
        }}
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <Skel key={i} />
        ))}
      </Box>
    );

  if (isError)
    return (
      <Box sx={{ textAlign: "center", py: 16 }}>
        <Typography
          sx={{ fontFamily: SANS, fontWeight: 700, color: T.inkMuted, mb: 2 }}
        >
          Something went wrong.
        </Typography>

        <Box
          component="button"
          onClick={() => refetch()}
          sx={{
            fontFamily: SANS,
            fontWeight: 600,
            fontSize: "0.875rem",
            color: T.primary,
            border: `1px solid ${T.primary}`,
            borderRadius: "8px",
            px: 3,
            py: 1.25,
            cursor: "pointer",
            background: "transparent",
            "&:hover": { background: T.primaryPale },
          }}
        >
          Try again
        </Box>
      </Box>
    );

  if (templates.length === 0)
    return (
      <Box sx={{ textAlign: "center", py: 16 }}>
        <Typography
          sx={{ fontFamily: SANS, fontWeight: 700, color: T.inkFaint, mb: 1 }}
        >
          {isSearching
            ? `No results for "${debouncedQuery}"`
            : "No templates found."}
        </Typography>

        <Box
          component="button"
          onClick={() => filter.clearFilters()}
          sx={{
            fontFamily: SANS,
            fontWeight: 600,
            color: T.primary,
            border: `1px solid ${T.primary}`,
            borderRadius: "8px",
            px: 3,
            py: 1.25,
            cursor: "pointer",
            background: "transparent",
            mt: 2,
            "&:hover": { background: T.primaryPale },
          }}
        >
          Clear filters
        </Box>
      </Box>
    );

  return (
    <Box>
      {/* Count */}
      <Typography
        sx={{
          fontFamily: MONO,
          fontSize: "0.6rem",
          letterSpacing: "0.12em",
          color: T.inkFaint,
          mb: 3,
          textTransform: "uppercase",
        }}
      >
        {isSearching
          ? `${templates.length} result(s) for "${debouncedQuery}"`
          : `${total.toLocaleString()} template(s)`}
      </Typography>

      {/* GRID */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
              lg: "repeat(3,1fr)",
            },
            gap: 3.5,
          }}
        >
          <AnimatePresence mode="popLayout">
            {templates.map((t: any, i: number) => (
              <TemplateCard key={t.id} template={t} index={i} />
            ))}
          </AnimatePresence>
        </Box>
      </motion.div>

      {/* Pagination */}
      {pages > 1 && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 1,
            mt: 10,
            pt: 5,
            borderTop: `1px solid ${T.border}`,
          }}
        >
          {Array.from({ length: pages }).map((_, i) => (
            <motion.button
              key={i}
              onClick={() => goToPage(i + 1)}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              style={{
                width: 38,
                height: 38,
                borderRadius: 9,
                border: `1px solid ${page === i + 1 ? T.primary : T.border}`,
                background: page === i + 1 ? T.primaryPale : "transparent",
                color: page === i + 1 ? T.primary : T.inkFaint,
                fontFamily: MONO,
                cursor: "pointer",
              }}
            >
              {i + 1}
            </motion.button>
          ))}
        </Box>
      )}
    </Box>
  );
}
