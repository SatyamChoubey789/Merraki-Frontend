// components/sections/blog/BlogCard.tsx
"use client";

import { Box, Typography } from "@mui/material";
import { AccessTime as TimeIcon } from "@mui/icons-material";
import { motion } from "framer-motion";
import Link from "next/link";
import { colorTokens, shadowTokens } from "@/theme";
import { formatDate } from "@/lib/utils/formatters";
import type { BlogPost } from "@/types/blog.types";

interface BlogCardProps {
  post: BlogPost;
  index?: number;
}

// Unsplash page URLs are not direct image URLs — detect and skip them.
// A direct image URL contains "images.unsplash.com" or ends in an image ext.
function isDirectImageUrl(url: string | null): boolean {
  if (!url) return false;
  return (
    url.includes("images.unsplash.com") ||
    url.includes("cdn.") ||
    /\.(jpg|jpeg|png|webp|avif|gif)(\?.*)?$/i.test(url)
  );
}

// Pick an emoji cover based on tags / title keywords
function getCoverEmoji(post: BlogPost): string {
  const text = (post.title + " " + post.tags.join(" ")).toLowerCase();
  if (text.includes("valuation") || text.includes("dcf")) return "📈";
  if (text.includes("cash") || text.includes("runway")) return "💰";
  if (text.includes("excel") || text.includes("dashboard")) return "📊";
  if (text.includes("tax") || text.includes("gst")) return "🧾";
  if (text.includes("startup") || text.includes("founder")) return "🚀";
  if (text.includes("invest")) return "💎";
  if (text.includes("profit") || text.includes("margin")) return "📉";
  return "📝";
}

export function BlogCard({ post, index = 0 }: BlogCardProps) {
  const hasDirectImage = isDirectImageUrl(post.coverImage);
  const emoji = getCoverEmoji(post);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4, ease: "easeOut" }}
      whileHover={{ y: -6 }}
    >
      <Link
        href={`/blog/${post.slug}`}
        style={{ textDecoration: "none", display: "block", height: "100%" }}
      >
        <Box
          sx={{
            borderRadius: "18px",
            border: `1px solid ${colorTokens.slate[100]}`,
            overflow: "hidden",
            backgroundColor: colorTokens.white,
            boxShadow: shadowTokens.md,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            transition: "all 0.3s ease",
            "&:hover": {
              boxShadow: shadowTokens.xl,
              borderColor: colorTokens.financeBlue[100],
              "& .blog-card-image": { transform: "scale(1.04)" },
            },
          }}
        >
          {/* ── Cover ────────────────────────────────────────────────── */}
          <Box
            sx={{
              position: "relative",
              height: 220,
              overflow: "hidden",
              backgroundColor: colorTokens.financeBlue[50],
              flexShrink: 0,
            }}
          >
            {hasDirectImage ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <Box
                component="img"
                className="blog-card-image"
                src={post.coverImage!}
                alt={post.title}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transition: "transform 0.4s ease",
                }}
                onError={(e) => {
                  // If image fails to load, hide it — emoji fallback shows
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
            ) : (
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "3.5rem",
                  background: `linear-gradient(135deg, ${colorTokens.financeBlue[100]} 0%, ${colorTokens.financeBlue[50]} 100%)`,
                }}
              >
                {emoji}
              </Box>
            )}

            {/* Category badge */}
            <Box sx={{ position: "absolute", top: 14, left: 14 }}>
              <Box
                sx={{
                  px: 1.5,
                  py: 0.625,
                  borderRadius: "8px",
                  background: "rgba(10,20,48,0.72)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid rgba(255,255,255,0.12)",
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: "#fff",
                    fontWeight: 700,
                    letterSpacing: "0.04em",
                    fontSize: "0.7rem",
                  }}
                >
                  {post.category.name}
                </Typography>
              </Box>
            </Box>

            {post.isFeatured && (
              <Box sx={{ position: "absolute", top: 14, right: 14 }}>
                <Box
                  sx={{
                    px: 1.5,
                    py: 0.625,
                    borderRadius: "8px",
                    background: `linear-gradient(135deg, ${colorTokens.financeBlue[500]}, ${colorTokens.financeBlue[700]})`,
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{ color: "#fff", fontWeight: 700, fontSize: "0.65rem" }}
                  >
                    FEATURED
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>

          {/* ── Content ──────────────────────────────────────────────── */}
          <Box sx={{ p: 3, flex: 1, display: "flex", flexDirection: "column" }}>
            {/* Meta row */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
              <Typography
                variant="caption"
                sx={{ color: colorTokens.slate[400], fontWeight: 500 }}
              >
                {formatDate(post.publishedAt)}
              </Typography>
              <Box
                sx={{
                  width: 3,
                  height: 3,
                  borderRadius: "50%",
                  backgroundColor: colorTokens.slate[300],
                }}
              />
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <TimeIcon sx={{ fontSize: "0.75rem", color: colorTokens.slate[400] }} />
                <Typography
                  variant="caption"
                  sx={{ color: colorTokens.slate[400], fontWeight: 500 }}
                >
                  {post.readingTime} min read
                </Typography>
              </Box>
            </Box>

            {/* Title */}
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color: colorTokens.darkNavy[900],
                lineHeight: 1.35,
                mb: 1.5,
                letterSpacing: "-0.015em",
                overflow: "hidden",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                fontSize: { xs: "1.0625rem", md: "1.125rem" },
                transition: "color 0.2s ease",
                "&:hover": { color: colorTokens.financeBlue[600] },
              }}
            >
              {post.title}
            </Typography>

            {/* Excerpt */}
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                lineHeight: 1.7,
                flex: 1,
                overflow: "hidden",
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                mb: 2.5,
              }}
            >
              {post.excerpt}
            </Typography>

            {/* Author */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, ${colorTokens.financeBlue[500]}, ${colorTokens.financeBlue[700]})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Typography
                  sx={{
                    color: "#fff",
                    fontWeight: 800,
                    fontSize: "0.8125rem",
                    fontFamily: "var(--font-display)",
                  }}
                >
                  {post.author.name.charAt(0)}
                </Typography>
              </Box>
              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 700,
                    color: colorTokens.darkNavy[700],
                    display: "block",
                    lineHeight: 1.2,
                  }}
                >
                  {post.author.name}
                </Typography>
                {post.author.role && (
                  <Typography
                    variant="caption"
                    sx={{ color: colorTokens.slate[400], lineHeight: 1 }}
                  >
                    {post.author.role}
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      </Link>
    </motion.div>
  );
}