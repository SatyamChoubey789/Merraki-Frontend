"use client";

import { Box, Typography, Chip } from "@mui/material";
import { AccessTime as TimeIcon } from "@mui/icons-material";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { colorTokens, shadowTokens } from "@/theme";
import { formatDate, formatReadingTime } from "@/lib/utils/formatters";
import type { BlogPost } from "@/types/blog.types";

interface BlogCardProps {
  post: BlogPost;
  index?: number;
  featured?: boolean;
}

export function BlogCard({ post, index = 0, featured = false }: BlogCardProps) {
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
            },
          }}
        >
          {/* Cover */}
          <Box
            sx={{
              position: "relative",
              height: featured ? 280 : 220,
              overflow: "hidden",
              backgroundColor: colorTokens.financeBlue[50],
              flexShrink: 0,
            }}
          >
            {post.coverImage ? (
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                style={{
                  objectFit: "cover",
                  transition: "transform 0.4s ease",
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
                  fontSize: "3rem",
                  background: `linear-gradient(135deg, ${colorTokens.financeBlue[100]}, ${colorTokens.financeBlue[50]})`,
                }}
              >
                📝
              </Box>
            )}

            {/* Category badge */}
            <Box sx={{ position: "absolute", top: 14, left: 14 }}>
              <Box
                sx={{
                  px: 1.5,
                  py: 0.625,
                  borderRadius: "8px",
                  background: "rgba(10,20,48,0.75)",
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

          {/* Content */}
          <Box sx={{ p: 3, flex: 1, display: "flex", flexDirection: "column" }}>
            {/* Meta */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                mb: 1.5,
              }}
            >
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
                <TimeIcon
                  sx={{ fontSize: "0.75rem", color: colorTokens.slate[400] }}
                />
                <Typography
                  variant="caption"
                  sx={{ color: colorTokens.slate[400], fontWeight: 500 }}
                >
                  {formatReadingTime(post.readingTime)}
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
