"use client";

import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";
import Link from "next/link";
import { formatDate } from "@/lib/utils/formatters";

const T = {
  bg:       "#FFFFFF",
  bgPage:   "#F9FAFB",
  ink:      "#111118",
  inkMuted: "#6B6B80",
  inkFaint: "#A0A0B0",
  border:   "rgba(10,10,20,0.07)",
  blue:     "#2563EB",
  bluePale: "#EFF6FF",
  blueDim:  "rgba(37,99,235,0.07)",
};

const SANS = '"DM Sans", system-ui, sans-serif';
const EASE = [0.16, 1, 0.3, 1] as const;

interface Props {
  post: any;
  index?: number;
  variant?: "default" | "compact";
}

export function BlogCard({ post, index = 0, variant = "default" }: Props) {
  const compact = variant === "compact";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.35, ease: EASE }}
      style={{ height: "100%" }}
    >
      <Link href={`/blog/${post.slug}`} style={{ textDecoration: "none", display: "block", height: "100%" }}>
        <Box sx={{
          display: "flex", flexDirection: "column", height: "100%",
          background: T.bg, borderRadius: "12px", overflow: "hidden",
          border: `1px solid ${T.border}`,
          transition: "border-color 0.2s, box-shadow 0.2s",
          "&:hover": {
            borderColor: "rgba(37,99,235,0.2)",
            boxShadow: "0 4px 24px rgba(37,99,235,0.09)",
            "& .card-img": { transform: "scale(1.04)" },
            "& .card-title": { color: T.blue },
          },
        }}>
          {!compact && (
            <Box sx={{ aspectRatio: "16/9", overflow: "hidden", background: T.bgPage, flexShrink: 0 }}>
              {post.coverImage ? (
                <Box className="card-img" component="img" src={post.coverImage} alt={post.title}
                  sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.5s ease" }} />
              ) : (
                <Box sx={{ width: "100%", height: "100%", background: `linear-gradient(135deg, ${T.bluePale}, #DBEAFE)` }} />
              )}
            </Box>
          )}

          <Box sx={{ p: compact ? "14px 16px" : "16px 18px 20px", display: "flex", flexDirection: "column", flex: 1, gap: 0.875 }}>
            {post.category?.name && (
              <Typography sx={{ fontFamily: SANS, fontSize: "0.64rem", fontWeight: 600, color: T.blue, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                {post.category.name}
              </Typography>
            )}
            <Typography className="card-title" sx={{
              fontFamily: SANS, fontWeight: 600,
              fontSize: compact ? "0.875rem" : "0.9375rem",
              color: T.ink, lineHeight: 1.4, letterSpacing: "-0.01em",
              display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
              transition: "color 0.18s",
            }}>
              {post.title}
            </Typography>
            {!compact && post.excerpt && (
              <Typography sx={{
                fontFamily: SANS, fontSize: "0.8125rem", color: T.inkMuted, lineHeight: 1.65,
                display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
              }}>
                {post.excerpt}
              </Typography>
            )}
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mt: "auto", pt: compact ? 0.875 : 1.25 }}>
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