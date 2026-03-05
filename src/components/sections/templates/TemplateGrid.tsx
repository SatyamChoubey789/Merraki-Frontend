"use client";

import { Box, Typography } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { useTemplates, useTemplateSearch } from "@/lib/hooks/useTemplates";
import { TemplateCard } from "./TemplateCard";
import type { useSearchFilter } from "@/lib/hooks/useSearchFilter";

const T = {
  bg: "#FFFFFF",
  bgSection: "#F5F7FB",
  ink: "#0A0A0F",
  inkMuted: "#5A5A72",
  inkFaint: "#9898AE",
  border: "rgba(10,10,20,0.09)",
  blue: "#3B7BF6",
  bluePale: "#EDF3FF",
};

const SANS = '"DM Sans","Mona Sans",system-ui,sans-serif';
const MONO = '"DM Mono","JetBrains Mono",ui-monospace,monospace';

type FilterState = ReturnType<typeof useSearchFilter>;
interface Props {
  filter: FilterState;
}

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
          background: T.bluePale,
          animation: "pulse 1.8s ease-in-out infinite",
        }}
      />
      <Box
        sx={{
          height: 13,
          background: T.bgSection,
          borderRadius: "4px",
          width: "72%",
          mb: 1,
          animation: "pulse 1.8s ease-in-out infinite",
        }}
      />
      <Box
        sx={{
          height: 11,
          background: T.bgSection,
          borderRadius: "4px",
          width: "52%",
          mb: 1.5,
          animation: "pulse 1.8s ease-in-out infinite",
        }}
      />
      <Box
        sx={{
          height: 11,
          background: T.bgSection,
          borderRadius: "4px",
          width: "88%",
          animation: "pulse 1.8s ease-in-out infinite",
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
    category: selectedCategory || undefined,
    sortBy: sortBy as any,
  });
  const searchQ = useTemplateSearch(debouncedQuery, isSearching);
  const active = isSearching ? searchQ : listQ;
  const { data, isLoading, isError } = active;
  const templates = data?.data ?? [];
  const pagination =
    !isSearching && "pagination" in (data ?? {})
      ? (data as any).pagination
      : null;

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
          sx={{
            fontFamily: SANS,
            fontWeight: 700,
            fontSize: "1.125rem",
            color: T.inkMuted,
            mb: 2,
          }}
        >
          Something went wrong.
        </Typography>
        <Box
          component="button"
          onClick={() => active.refetch()}
          sx={{
            fontFamily: SANS,
            fontWeight: 600,
            fontSize: "0.875rem",
            color: T.blue,
            border: `1px solid ${T.blue}`,
            borderRadius: "8px",
            px: 3,
            py: 1.25,
            cursor: "pointer",
            background: "transparent",
            outline: "none",
            "&:hover": { background: T.bluePale },
            transition: "background 0.15s",
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
          sx={{
            fontFamily: SANS,
            fontWeight: 700,
            fontSize: "1.5rem",
            color: T.inkFaint,
            mb: 1,
          }}
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
            fontSize: "0.875rem",
            color: T.blue,
            border: `1px solid ${T.blue}`,
            borderRadius: "8px",
            px: 3,
            py: 1.25,
            cursor: "pointer",
            background: "transparent",
            outline: "none",
            "&:hover": { background: T.bluePale },
            transition: "background 0.15s",
            mt: 2,
          }}
        >
          Clear filters
        </Box>
      </Box>
    );

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography
          sx={{
            fontFamily: MONO,
            fontSize: "0.56rem",
            letterSpacing: "0.12em",
            color: T.inkFaint,
            textTransform: "uppercase",
          }}
        >
          {isSearching
            ? `${templates.length} result${templates.length !== 1 ? "s" : ""} for "${debouncedQuery}"`
            : pagination
              ? `${pagination.total} templates`
              : `${templates.length} templates`}
        </Typography>
      </Box>

      <motion.div
        key={`${selectedCategory}-${sortBy}-${page}-${debouncedQuery}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25 }}
      >
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
            {templates.map((t, i) => (
              <TemplateCard key={t.id} template={t} index={i} />
            ))}
          </AnimatePresence>
        </Box>
      </motion.div>

      {pagination && pagination.totalPages > 1 && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 0.75,
            mt: 10,
            pt: 5,
            borderTop: `1px solid ${T.border}`,
          }}
        >
          {Array.from({ length: pagination.totalPages }).map((_, i) => (
            <motion.button
              key={i}
              onClick={() => goToPage(i + 1)}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              style={{
                width: 38,
                height: 38,
                borderRadius: "9px",
                border: `1px solid ${page === i + 1 ? T.blue : T.border}`,
                background: page === i + 1 ? T.bluePale : "transparent",
                cursor: "pointer",
                fontFamily: MONO,
                fontSize: "0.72rem",
                color: page === i + 1 ? T.blue : T.inkFaint,
                outline: "none",
                transition: "border-color 0.15s, color 0.15s",
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
