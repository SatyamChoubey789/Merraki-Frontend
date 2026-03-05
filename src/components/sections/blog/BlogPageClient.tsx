"use client";

import { Box, Container, Typography } from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  useBlogPosts,
  useBlogSearch,
  useBlogCategories,
} from "@/lib/hooks/useBlogPosts";
import { useSearchFilter } from "@/lib/hooks/useSearchFilter";
import { formatDate } from "@/lib/utils/formatters";
import type { BlogPost } from "@/types/blog.types";

const T = {
  bg: "#FFFFFF",
  white: "#FFFFFF",
  ink: "#0A0A0F",
  inkMuted: "#6B6B7A",
  inkFaint: "#A0A0AE",
  rule: "rgba(10,10,15,0.08)",
  blue: "#3B7BF6",
};

const FONT_SANS = '"DM Sans", system-ui, sans-serif';
const FONT_MONO = '"DM Mono", ui-monospace, monospace';
const EASE = [0.16, 1, 0.3, 1] as const;

function Card({ post, index = 0 }: { post: BlogPost; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.35, ease: EASE }}
    >
      <Link
        href={`/blog/${post.slug}`}
        style={{ textDecoration: "none", display: "block" }}
      >
        <Box
          sx={{
            borderRadius: "6px",
            overflow: "hidden",
            border: `1px solid ${T.rule}`,
            transition: "border-color 0.2s, box-shadow 0.2s",
            "&:hover": {
              borderColor: "rgba(10,10,15,0.16)",
              boxShadow: "0 4px 24px rgba(10,10,15,0.07)",
              "& .img": { transform: "scale(1.04)" },
              "& .title": { color: T.blue },
            },
          }}
        >
          <Box
            sx={{
              width: "100%",
              aspectRatio: "16/10",
              overflow: "hidden",
              background: "#F2F3F5",
              position: "relative",
            }}
          >
            {post.coverImage ? (
              <Box
                className="img"
                component="img"
                src={post.coverImage}
                alt={post.title}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                  transition: "transform 0.5s ease",
                }}
              />
            ) : (
              <Box
                sx={{ width: "100%", height: "100%", background: "#F2F3F5" }}
              />
            )}
          </Box>
          <Box sx={{ p: "14px 16px 16px", background: T.white }}>
            <Typography
              className="title"
              sx={{
                fontFamily: FONT_SANS,
                fontWeight: 600,
                fontSize: "0.9375rem",
                color: T.ink,
                lineHeight: 1.4,
                letterSpacing: "-0.015em",
                mb: 0.625,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                transition: "color 0.18s",
              }}
            >
              {post.title}
            </Typography>
            {post.excerpt && (
              <Typography
                sx={{
                  fontFamily: FONT_SANS,
                  fontSize: "0.8125rem",
                  color: T.inkMuted,
                  lineHeight: 1.6,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  mb: 1.25,
                }}
              >
                {post.excerpt}
              </Typography>
            )}
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
              <Typography
                sx={{
                  fontFamily: FONT_MONO,
                  fontSize: "0.5rem",
                  letterSpacing: "0.08em",
                  color: T.inkFaint,
                  textTransform: "uppercase",
                }}
              >
                {formatDate(post.publishedAt)}
              </Typography>
              <Box
                sx={{
                  width: 2,
                  height: 2,
                  borderRadius: "50%",
                  background: T.inkFaint,
                  opacity: 0.5,
                }}
              />
              <Typography
                sx={{
                  fontFamily: FONT_MONO,
                  fontSize: "0.5rem",
                  letterSpacing: "0.08em",
                  color: T.inkFaint,
                  textTransform: "uppercase",
                }}
              >
                {post.readingTime} min read
              </Typography>
            </Box>
          </Box>
        </Box>
      </Link>
    </motion.div>
  );
}

function CardSkeleton() {
  return (
    <Box
      sx={{
        borderRadius: "6px",
        overflow: "hidden",
        border: `1px solid ${T.rule}`,
      }}
    >
      <Box
        sx={{
          width: "100%",
          aspectRatio: "16/10",
          background: "#F2F3F5",
          animation: "pulse 1.6s ease-in-out infinite",
          "@keyframes pulse": {
            "0%,100%": { opacity: 1 },
            "50%": { opacity: 0.45 },
          },
        }}
      />
      <Box sx={{ p: "14px 16px 16px", background: T.white }}>
        <Box
          sx={{
            height: 15,
            background: "#F2F3F5",
            borderRadius: 1,
            mb: 0.75,
            animation: "pulse 1.6s ease-in-out infinite",
          }}
        />
        <Box
          sx={{
            height: 15,
            background: "#F2F3F5",
            borderRadius: 1,
            width: "65%",
            mb: 1.25,
            animation: "pulse 1.6s ease-in-out infinite",
          }}
        />
        <Box
          sx={{
            height: 9,
            background: "#F2F3F5",
            borderRadius: 1,
            width: "35%",
            animation: "pulse 1.6s ease-in-out infinite",
          }}
        />
      </Box>
    </Box>
  );
}

export function BlogPageClient() {
  const filter = useSearchFilter({ initialSort: "newest" });
  const {
    searchQuery,
    debouncedQuery,
    selectedCategory,
    page,
    isSearching,
    handleSearchChange,
    handleCategoryChange,
    goToPage,
  } = filter;

  const { data: categoriesData } = useBlogCategories();
  const { data: listData, isLoading: listLoading } = useBlogPosts({
    page,
    limit: 12,
    category: selectedCategory || undefined,
  });
  const { data: searchData, isLoading: searchLoading } = useBlogSearch(
    debouncedQuery,
    isSearching,
  );

  const activeData = isSearching ? searchData : listData;
  const posts = activeData?.data ?? [];
  const pagination =
    !isSearching && listData && "pagination" in listData
      ? listData.pagination
      : null;
  const isLoading = isSearching ? searchLoading : listLoading;

  return (
    <Box sx={{ minHeight: "100vh", background: T.bg, fontFamily: FONT_SANS }}>
      {/* Top bar */}
      <Box
        sx={{
          borderBottom: `1px solid ${T.rule}`,
          pt: { xs: 12, md: 16 },
          pb: 2.5,
          background: T.white,
        }}
      >
        <Container maxWidth="xl">
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Typography
              sx={{
                fontFamily: FONT_MONO,
                fontSize: "0.56rem",
                letterSpacing: "0.2em",
                color: T.inkFaint,
                textTransform: "uppercase",
              }}
            >
              {isSearching
                ? `Results for "${searchQuery}"`
                : selectedCategory
                  ? selectedCategory
                  : "All Stories"}
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                border: `1px solid ${T.rule}`,
                borderRadius: "8px",
                px: 1.5,
                py: 1,
                background: "#F7F8FA",
                transition: "border-color 0.15s, box-shadow 0.15s",
                "&:focus-within": {
                  borderColor: T.blue,
                  boxShadow: `0 0 0 3px ${T.blue}12`,
                  background: T.white,
                },
              }}
            >
              <SearchIcon sx={{ fontSize: "0.9rem", color: T.inkFaint }} />
              <Box
                component="input"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search articles…"
                sx={{
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  fontFamily: FONT_SANS,
                  fontSize: "0.875rem",
                  color: T.ink,
                  width: { xs: 160, sm: 220 },
                  "&::placeholder": { color: T.inkFaint },
                }}
              />
              {searchQuery && (
                <Box
                  component="button"
                  onClick={() => handleSearchChange("")}
                  sx={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: T.inkFaint,
                    lineHeight: 1,
                    p: 0,
                    fontSize: "1rem",
                    "&:hover": { color: T.ink },
                  }}
                >
                  ×
                </Box>
              )}
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Grid */}
      <Container maxWidth="xl" sx={{ pt: 5, pb: 14 }}>
        {isLoading ? (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr 1fr",
                sm: "repeat(3,1fr)",
                lg: "repeat(4,1fr)",
              },
              gap: 2.5,
            }}
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </Box>
        ) : posts.length === 0 ? (
          <Box sx={{ py: 16, textAlign: "center" }}>
            <Typography
              sx={{
                fontFamily: FONT_SANS,
                fontSize: "1.125rem",
                fontWeight: 600,
                color: T.inkMuted,
                mb: 1.5,
              }}
            >
              No articles found.
            </Typography>
            <Box
              component="button"
              onClick={() => handleSearchChange("")}
              sx={{
                fontFamily: FONT_SANS,
                fontSize: "0.875rem",
                color: T.blue,
                border: `1px solid ${T.blue}20`,
                borderRadius: "6px",
                px: 2.5,
                py: 1,
                cursor: "pointer",
                background: `${T.blue}08`,
                transition: "all 0.15s",
                "&:hover": { background: `${T.blue}14` },
              }}
            >
              Clear search
            </Box>
          </Box>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr 1fr",
                sm: "repeat(3,1fr)",
                lg: "repeat(4,1fr)",
              },
              gap: 2.5,
            }}
          >
            {posts.map((post, i) => (
              <Card key={post.id} post={post} index={i} />
            ))}
          </Box>
        )}

        {pagination && pagination.totalPages > 1 && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 0.5,
              mt: 10,
              pt: 5,
              borderTop: `1px solid ${T.rule}`,
            }}
          >
            {Array.from({ length: pagination.totalPages }).map((_, i) => (
              <Box
                key={i}
                component="button"
                onClick={() => goToPage(i + 1)}
                sx={{
                  width: 34,
                  height: 34,
                  border: `1px solid ${page === i + 1 ? T.blue : T.rule}`,
                  borderRadius: "6px",
                  background: page === i + 1 ? `${T.blue}0c` : "transparent",
                  cursor: "pointer",
                  fontFamily: FONT_MONO,
                  fontSize: "0.75rem",
                  color: page === i + 1 ? T.blue : T.inkMuted,
                  transition: "all 0.15s",
                  outline: "none",
                  "&:hover": { borderColor: T.blue, color: T.blue },
                }}
              >
                {i + 1}
              </Box>
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
}
