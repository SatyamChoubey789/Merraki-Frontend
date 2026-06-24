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

const T = {
  bg:       "#FFFFFF",
  bgPage:   "#F9FAFB",
  ink:      "#111118",
  inkMid:   "#3A3A52",
  inkMuted: "#6B6B80",
  inkFaint: "#A0A0B0",
  border:   "rgba(10,10,20,0.07)",
  blue:     "#2563EB",
  bluePale: "#EFF6FF",
  blueDim:  "rgba(37,99,235,0.07)",
};

const SANS = '"DM Sans", system-ui, sans-serif';
const EASE = [0.16, 1, 0.3, 1] as const;

/* ── Skeleton pulse ─────────────────────────────── */
const pulse = {
  "@keyframes pulse": {
    "0%,100%": { opacity: 1 },
    "50%": { opacity: 0.4 },
  },
};

function Bone({ w = "100%", h = 14, r = 6 }: { w?: string | number; h?: number; r?: number }) {
  return (
    <Box sx={{
      width: w, height: h, borderRadius: r,
      background: "#E5E7EB",
      animation: "pulse 1.5s ease-in-out infinite",
      ...pulse,
    }} />
  );
}

/* ── Featured card ──────────────────────────────── */
function FeaturedCard({ post }: { post: any }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: EASE }}
    >
      <Link href={`/blog/${post.slug}`} style={{ textDecoration: "none", display: "block" }}>
        <Box sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "5fr 4fr" },
          borderRadius: "16px",
          overflow: "hidden",
          border: `1px solid ${T.border}`,
          background: T.bg,
          transition: "border-color 0.2s, box-shadow 0.2s",
          "&:hover": {
            borderColor: "rgba(37,99,235,0.2)",
            boxShadow: "0 8px 40px rgba(37,99,235,0.1)",
            "& .feat-img": { transform: "scale(1.03)" },
            "& .feat-title": { color: T.blue },
          },
        }}>
          {/* Image */}
          <Box sx={{ aspectRatio: "16/9", overflow: "hidden", background: T.bgPage, flexShrink: 0 }}>
            {post.coverImage ? (
              <Box className="feat-img" component="img" src={post.coverImage} alt={post.title}
                sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.6s ease" }} />
            ) : (
              <Box sx={{ width: "100%", height: "100%", background: `linear-gradient(135deg, ${T.bluePale}, #DBEAFE)` }} />
            )}
          </Box>
          {/* Text */}
          <Box sx={{
            p: { xs: "24px", md: "36px 40px" },
            display: "flex", flexDirection: "column", justifyContent: "center", gap: 2,
          }}>
            {post.category?.name && (
              <Typography sx={{ fontFamily: SANS, fontSize: "0.68rem", fontWeight: 600, color: T.blue, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                {post.category.name}
              </Typography>
            )}
            <Typography className="feat-title" sx={{
              fontFamily: SANS, fontWeight: 700,
              fontSize: { xs: "1.25rem", md: "1.625rem" },
              color: T.ink, letterSpacing: "-0.02em", lineHeight: 1.25,
              transition: "color 0.18s",
            }}>
              {post.title}
            </Typography>
            {post.excerpt && (
              <Typography sx={{
                fontFamily: SANS, fontSize: "0.9rem", color: T.inkMuted, lineHeight: 1.7,
                display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden",
              }}>
                {post.excerpt}
              </Typography>
            )}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
              <Typography sx={{ fontFamily: SANS, fontSize: "0.78rem", color: T.inkFaint, fontWeight: 500 }}>
                {formatDate(post.publishedAt)}
              </Typography>
              <Box sx={{ width: 2, height: 2, borderRadius: "50%", background: T.inkFaint }} />
              <Typography sx={{ fontFamily: SANS, fontSize: "0.78rem", color: T.inkFaint, fontWeight: 500 }}>
                {post.readingTime} min read
              </Typography>
            </Box>
          </Box>
        </Box>
      </Link>
    </motion.div>
  );
}

/* ── Regular card ───────────────────────────────── */
function PostCard({ post, index = 0 }: { post: any; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.35, ease: EASE }}
      style={{ height: "100%" }}
    >
      <Link href={`/blog/${post.slug}`} style={{ textDecoration: "none", display: "block", height: "100%" }}>
        <Box sx={{
          display: "flex", flexDirection: "column", height: "100%",
          borderRadius: "12px", overflow: "hidden",
          border: `1px solid ${T.border}`,
          background: T.bg,
          transition: "border-color 0.2s, box-shadow 0.2s",
          "&:hover": {
            borderColor: "rgba(37,99,235,0.2)",
            boxShadow: "0 4px 24px rgba(37,99,235,0.09)",
            "& .card-img": { transform: "scale(1.04)" },
            "& .card-title": { color: T.blue },
          },
        }}>
          {/* Image */}
          <Box sx={{ aspectRatio: "16/9", overflow: "hidden", background: T.bgPage, flexShrink: 0 }}>
            {post.coverImage ? (
              <Box className="card-img" component="img" src={post.coverImage} alt={post.title}
                sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.5s ease" }} />
            ) : (
              <Box sx={{ width: "100%", height: "100%", background: `linear-gradient(135deg, ${T.bluePale}, #DBEAFE)` }} />
            )}
          </Box>
          {/* Text */}
          <Box sx={{ p: "16px 18px 20px", display: "flex", flexDirection: "column", flex: 1, gap: 1 }}>
            {post.category?.name && (
              <Typography sx={{ fontFamily: SANS, fontSize: "0.64rem", fontWeight: 600, color: T.blue, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                {post.category.name}
              </Typography>
            )}
            <Typography className="card-title" sx={{
              fontFamily: SANS, fontWeight: 600, fontSize: "0.9375rem",
              color: T.ink, lineHeight: 1.4, letterSpacing: "-0.01em",
              display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
              transition: "color 0.18s",
            }}>
              {post.title}
            </Typography>
            {post.excerpt && (
              <Typography sx={{
                fontFamily: SANS, fontSize: "0.8125rem", color: T.inkMuted, lineHeight: 1.65,
                display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
              }}>
                {post.excerpt}
              </Typography>
            )}
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mt: "auto", pt: 1.5 }}>
              <Typography sx={{ fontFamily: SANS, fontSize: "0.7rem", color: T.inkFaint, fontWeight: 500 }}>
                {formatDate(post.publishedAt)}
              </Typography>
              <Box sx={{ width: 2, height: 2, borderRadius: "50%", background: T.inkFaint }} />
              <Typography sx={{ fontFamily: SANS, fontSize: "0.7rem", color: T.inkFaint, fontWeight: 500 }}>
                {post.readingTime} min read
              </Typography>
            </Box>
          </Box>
        </Box>
      </Link>
    </motion.div>
  );
}

/* ── Skeletons ──────────────────────────────────── */
function FeaturedSkeleton() {
  return (
    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "5fr 4fr" }, borderRadius: "16px", overflow: "hidden", border: `1px solid ${T.border}`, background: T.bg }}>
      <Box sx={{ aspectRatio: "16/9", background: "#E5E7EB", animation: "pulse 1.5s ease-in-out infinite", ...pulse }} />
      <Box sx={{ p: { xs: "24px", md: "36px 40px" }, display: "flex", flexDirection: "column", gap: 2, justifyContent: "center" }}>
        <Bone w="40%" h={11} />
        <Bone w="85%" h={24} />
        <Bone w="65%" h={24} />
        <Bone w="90%" h={14} />
        <Bone w="70%" h={14} />
        <Bone w="30%" h={11} />
      </Box>
    </Box>
  );
}

function CardSkeleton() {
  return (
    <Box sx={{ borderRadius: "12px", overflow: "hidden", border: `1px solid ${T.border}`, background: T.bg }}>
      <Box sx={{ aspectRatio: "16/9", background: "#E5E7EB", animation: "pulse 1.5s ease-in-out infinite", ...pulse }} />
      <Box sx={{ p: "16px 18px 20px", display: "flex", flexDirection: "column", gap: 1.25 }}>
        <Bone w="35%" h={10} />
        <Bone w="90%" h={14} />
        <Bone w="65%" h={14} />
        <Bone w="30%" h={10} />
      </Box>
    </Box>
  );
}

/* ── Main ───────────────────────────────────────── */
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
    selectedCategorySlug,
    goToPage,
  } = filter;

  const { data: categoriesData } = useBlogCategories();
  const { data: listData, isLoading: listLoading } = useBlogPosts({
    page,
    limit: 12,
    category: selectedCategorySlug || undefined,
  });
  const { data: searchData, isLoading: searchLoading } = useBlogSearch(
    debouncedQuery,
    isSearching,
  );

  const posts = isSearching
    ? (searchData?.data?.results ?? [])
    : (listData?.data ?? []);
  const pagination =
    !isSearching && listData && "pagination" in listData
      ? (listData as any).pagination
      : null;
  const isLoading = isSearching ? searchLoading : listLoading;
  const categories = categoriesData?.data ?? [];
  const featured = !isSearching && page === 1 && posts.length > 0 ? posts[0] : null;
  const rest = !isSearching && page === 1 ? posts.slice(1) : posts;

  return (
    <Box sx={{ minHeight: "100vh", background: T.bgPage, fontFamily: SANS }}>

      {/* ── Header ── */}
      <Box sx={{
        background: T.bg,
        borderBottom: `1px solid ${T.border}`,
        pt: { xs: 12, md: 16 },
        pb: 0,
      }}>
        <Container maxWidth="lg">
          {/* Title + search */}
          <Box sx={{
            display: "flex", alignItems: "flex-end",
            justifyContent: "space-between",
            flexWrap: "wrap", gap: 2.5, pb: 3,
          }}>
            <Box>
              <Typography sx={{
                fontFamily: SANS, fontWeight: 700,
                fontSize: { xs: "1.75rem", md: "2.25rem" },
                color: T.ink, letterSpacing: "-0.03em", lineHeight: 1, mb: 0.5,
              }}>
                Blog
              </Typography>
              <Typography sx={{ fontFamily: SANS, fontSize: "0.9rem", color: T.inkMuted }}>
                Insights and guides for founders.
              </Typography>
            </Box>

            {/* Search */}
            <Box sx={{
              display: "flex", alignItems: "center", gap: 1,
              border: `1px solid ${T.border}`, borderRadius: "9px",
              px: 1.5, py: 1, background: T.bg,
              transition: "border-color 0.15s, box-shadow 0.15s",
              "&:focus-within": {
                borderColor: T.blue,
                boxShadow: `0 0 0 3px ${T.blueDim}`,
              },
            }}>
              <SearchIcon sx={{ fontSize: "0.875rem", color: T.inkFaint }} />
              <Box
                component="input"
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleSearchChange(e.target.value)
                }
                placeholder="Search…"
                sx={{
                  border: "none", outline: "none", background: "transparent",
                  fontFamily: SANS, fontSize: "0.875rem", color: T.ink,
                  width: { xs: 130, sm: 200 },
                  "&::placeholder": { color: T.inkFaint },
                }}
              />
              {searchQuery && (
                <Box
                  component="button"
                  onClick={() => handleSearchChange("")}
                  sx={{
                    background: "none", border: "none", cursor: "pointer",
                    color: T.inkFaint, fontSize: "1.1rem", lineHeight: 1, p: 0,
                    "&:hover": { color: T.ink },
                  }}
                >
                  ×
                </Box>
              )}
            </Box>
          </Box>

          {/* Category tabs */}
          <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap", pb: "1px" }}>
            {[{ name: "All", slug: "" }, ...categories].map((cat: any) => {
              const active = selectedCategory === (cat.slug ?? "");
              return (
                <Box
                  key={cat.slug ?? "all"}
                  component="button"
                  onClick={() => handleCategoryChange(cat.id ?? null, cat.slug ?? "")}
                  sx={{
                    px: 1.875, py: "8px",
                    borderRadius: "8px 8px 0 0",
                    cursor: "pointer",
                    fontFamily: SANS,
                    fontSize: "0.8125rem",
                    fontWeight: active ? 600 : 400,
                    color: active ? T.blue : T.inkMuted,
                    background: "transparent",
                    border: "none",
                    borderBottom: active ? `2px solid ${T.blue}` : "2px solid transparent",
                    transition: "color 0.15s, border-color 0.15s",
                    "&:hover": { color: active ? T.blue : T.ink },
                  }}
                >
                  {cat.name}
                  {cat.postCount > 0 && (
                    <Typography component="span" sx={{
                      fontFamily: SANS, fontSize: "0.62rem",
                      color: active ? T.blue : T.inkFaint,
                      ml: 0.75, fontWeight: 500,
                    }}>
                      {cat.postCount}
                    </Typography>
                  )}
                </Box>
              );
            })}
          </Box>
        </Container>
      </Box>

      {/* ── Content ── */}
      <Container maxWidth="lg" sx={{ pt: 5, pb: 16 }}>
        {isLoading ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <FeaturedSkeleton />
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr 1fr", sm: "repeat(3,1fr)" }, gap: 2.5 }}>
              {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
            </Box>
          </Box>
        ) : posts.length === 0 ? (
          <Box sx={{ py: 20, textAlign: "center" }}>
            <Typography sx={{ fontFamily: SANS, fontWeight: 600, fontSize: "1.125rem", color: T.inkMuted, mb: 0.75 }}>
              No articles found.
            </Typography>
            <Typography sx={{ fontFamily: SANS, fontSize: "0.875rem", color: T.inkFaint, mb: 3 }}>
              Try a different search or browse all posts.
            </Typography>
            <Box
              component="button"
              onClick={() => handleSearchChange("")}
              sx={{
                fontFamily: SANS, fontSize: "0.875rem", fontWeight: 500,
                color: T.blue, border: `1px solid rgba(37,99,235,0.25)`,
                borderRadius: "8px", px: 2.5, py: 1, cursor: "pointer",
                background: T.bluePale, transition: "all 0.15s",
                "&:hover": { background: T.blueDim },
              }}
            >
              Clear search
            </Box>
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {featured && <FeaturedCard post={featured} />}

            {featured && rest.length > 0 && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Typography sx={{
                  fontFamily: SANS, fontWeight: 600, fontSize: "0.875rem",
                  color: T.inkMid, flexShrink: 0,
                }}>
                  {selectedCategory ? "More in this category" : "Latest articles"}
                </Typography>
                <Box sx={{ flex: 1, height: "1px", background: T.border }} />
              </Box>
            )}

            {rest.length > 0 && (
              <Box sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr 1fr", sm: "repeat(3,1fr)" },
                gap: 2.5,
              }}>
                {rest.map((post: any, i: number) => (
                  <PostCard key={post.id} post={post} index={i} />
                ))}
              </Box>
            )}
          </Box>
        )}

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <Box sx={{
            display: "flex", justifyContent: "center", gap: 0.75,
            mt: 10, pt: 5, borderTop: `1px solid ${T.border}`,
          }}>
            {Array.from({ length: pagination.pages }).map((_: any, i: number) => (
              <Box
                key={i}
                component="button"
                onClick={() => goToPage(i + 1)}
                sx={{
                  width: 34, height: 34,
                  border: `1px solid ${page === i + 1 ? T.blue : T.border}`,
                  borderRadius: "7px",
                  background: page === i + 1 ? T.blueDim : T.bg,
                  cursor: "pointer", fontFamily: SANS, fontSize: "0.8rem",
                  fontWeight: page === i + 1 ? 600 : 400,
                  color: page === i + 1 ? T.blue : T.inkMuted,
                  transition: "all 0.15s", outline: "none",
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