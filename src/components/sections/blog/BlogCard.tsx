"use client";

import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";
import Link from "next/link";
import { formatDate } from "@/lib/utils/formatters";
import type { BlogPost } from "@/types/blog.types";

const T = {
  white: "#FFFFFF",
  bg: "#FFFFFF",
  ink: "#0A0A0F",
  inkMuted: "#6B6B7A",
  inkFaint: "#A0A0AE",
  rule: "rgba(10,10,15,0.10)",
  blue: "#3B7BF6",
};

const FONT_SANS = '"DM Sans", system-ui, sans-serif';
const FONT_MONO = '"DM Mono", "JetBrains Mono", ui-monospace, monospace';
const EASE = [0.16, 1, 0.3, 1] as const;

interface BlogCardProps {
  post: BlogPost;
  index?: number;
  variant?: "default" | "horizontal" | "compact";
}

export function BlogCard({
  post,
  index = 0,
  variant = "default",
}: BlogCardProps) {
  const isCompact = variant === "compact";
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4, ease: EASE }}
      style={{ height: "100%" }}
    >
      <Link
        href={`/blog/${post.slug}`}
        style={{ textDecoration: "none", display: "block", height: "100%" }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            background: T.white,
            borderRadius: "4px",
            overflow: "hidden",
            transition: "box-shadow 0.22s ease",
            "&:hover": {
              boxShadow: "0 8px 32px rgba(10,10,15,0.09)",
              "& .card-img": { transform: "scale(1.03)" },
              "& .card-title": { color: T.blue },
            },
          }}
        >
          {/* Cover image */}
          {!isCompact && (
            <Box
              sx={{
                position: "relative",
                width: "100%",
                aspectRatio: "4 / 3",
                overflow: "hidden",
                background: "#F0F1F3",
                flexShrink: 0,
              }}
            >
              {post.coverImage ? (
                <Box
                  className="card-img"
                  component="img"
                  src={post.coverImage}
                  alt={post.title}
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "transform 0.5s ease",
                    display: "block",
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
                    background: "#F0F1F3",
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: FONT_SANS,
                      fontSize: "2.5rem",
                      color: T.rule,
                    }}
                  >
                    M
                  </Typography>
                </Box>
              )}
            </Box>
          )}

          {/* Text body */}
          <Box
            sx={{
              p: isCompact ? "14px 16px" : "20px 20px 22px",
              display: "flex",
              flexDirection: "column",
              gap: isCompact ? 0.5 : 1,
              flex: 1,
            }}
          >
            {/* Category — compact only */}
            {isCompact && post.category?.name && (
              <Typography
                sx={{
                  fontFamily: FONT_MONO,
                  fontSize: "0.5rem",
                  letterSpacing: "0.16em",
                  color: T.blue,
                  textTransform: "uppercase",
                  mb: 0.25,
                }}
              >
                {post.category.name}
              </Typography>
            )}

            {/* Title */}
            <Typography
              className="card-title"
              sx={{
                fontFamily: FONT_SANS,
                fontWeight: 600,
                fontSize: isCompact ? "0.875rem" : "1rem",
                color: T.ink,
                lineHeight: 1.35,
                letterSpacing: "-0.01em",
                overflow: "hidden",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                transition: "color 0.18s",
              }}
            >
              {post.title}
            </Typography>

            {/* Excerpt */}
            {!isCompact && post.excerpt && (
              <Typography
                sx={{
                  fontFamily: FONT_SANS,
                  fontSize: "0.8125rem",
                  color: T.inkMuted,
                  lineHeight: 1.7,
                  overflow: "hidden",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  mt: 0.25,
                }}
              >
                {post.excerpt}
              </Typography>
            )}

            {/* Meta */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mt: "auto",
                pt: isCompact ? 1 : 1.5,
              }}
            >
              <Typography
                sx={{
                  fontFamily: FONT_MONO,
                  fontSize: "0.5rem",
                  letterSpacing: "0.1em",
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
                }}
              />
              <Typography
                sx={{
                  fontFamily: FONT_MONO,
                  fontSize: "0.5rem",
                  letterSpacing: "0.1em",
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
