"use client"

import { Box, Typography } from "@mui/material"
import { motion } from "framer-motion"
import Link from "next/link"
import { AccessTime as TimeIcon } from "@mui/icons-material"

const T = {
  bg: "#FFFFFF",
  bgPage: "#F9FAFB",
  ink: "#111118",
  inkMuted: "#6B6B80",
  inkFaint: "#A0A0B0",
  border: "rgba(10,10,20,0.07)",
  blue: "#2563EB",
  bluePale: "#EFF6FF",
  blueDim: "rgba(37,99,235,0.06)",
}

const SANS = '"DM Sans", system-ui, sans-serif'

interface BlogPostForCard {
  id: string
  slug: string
  title: string
  excerpt: string | null
  coverImage: string | null
  category: { id: string; name: string; slug: string } | null
  tags: string[]
  readingTime: number
  publishedAt: string | null
  createdAt: string
}

interface Props {
  post: BlogPostForCard
  index?: number
  variant?: "default" | "compact" | "featured"
}

export function BlogCard({ post, index = 0, variant = "default" }: Props) {
  const compact = variant === "compact"
  const featured = variant === "featured"

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.06,
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1],
      }}
      style={{ height: "100%" }}
    >
      <Link
        href={`/blog/${post.slug}`}
        style={{ textDecoration: "none", display: "block", height: "100%" }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: featured ? { xs: "column", md: "row" } : "column",
            height: "100%",
            background: T.bg,
            borderRadius: featured ? "16px" : compact ? "10px" : "12px",
            overflow: "hidden",
            border: `1px solid ${T.border}`,
            transition: "border-color 0.25s ease, box-shadow 0.25s ease",
            "&:hover": {
              borderColor: "rgba(37,99,235,0.22)",
              boxShadow: "0 6px 32px rgba(37,99,235,0.09)",
              "& .card-img": { transform: "scale(1.04)" },
              "& .card-title": { color: T.blue },
            },
          }}
        >
          {/* Cover image */}
          {!compact && (
            <Box
              sx={{
                aspectRatio: featured ? { md: "16/10" } : "16/9",
                width: featured ? { xs: "100%", md: "55%" } : "100%",
                flexShrink: 0,
                overflow: "hidden",
                background: T.bgPage,
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
                    display: "block",
                    transition: "transform 0.5s ease",
                  }}
                />
              ) : (
                // Placeholder gradient when no cover image
                <Box
                  sx={{
                    width: "100%",
                    height: "100%",
                    background: `linear-gradient(135deg, ${T.bluePale} 0%, #DBEAFE 50%, #EDE9FE 100%)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: SANS,
                      fontSize: "2rem",
                      opacity: 0.3,
                    }}
                  >
                    M
                  </Typography>
                </Box>
              )}
            </Box>
          )}

          {/* Content */}
          <Box
            sx={{
              p: featured ? { xs: 3, md: 4 } : compact ? "14px 16px" : "18px 20px 22px",
              display: "flex",
              flexDirection: "column",
              flex: 1,
              gap: 0.75,
              justifyContent: featured ? "center" : "flex-start",
            }}
          >
            {/* Category */}
            {post.category?.name && (
              <Typography
                sx={{
                  fontFamily: SANS,
                  fontSize: "0.625rem",
                  fontWeight: 700,
                  color: T.blue,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                {post.category.name}
              </Typography>
            )}

            {/* Title */}
            <Typography
              className="card-title"
              component={featured ? "h2" : "h3"}
              sx={{
                fontFamily: SANS,
                fontWeight: 700,
                fontSize: featured
                  ? { xs: "1.25rem", md: "1.625rem" }
                  : compact
                  ? "0.875rem"
                  : "0.9375rem",
                color: T.ink,
                lineHeight: 1.35,
                letterSpacing: featured ? "-0.02em" : "-0.01em",
                display: "-webkit-box",
                WebkitLineClamp: featured ? 3 : 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                transition: "color 0.2s ease",
              }}
            >
              {post.title}
            </Typography>

            {/* Excerpt */}
            {!compact && post.excerpt && (
              <Typography
                sx={{
                  fontFamily: SANS,
                  fontSize: featured ? "0.9375rem" : "0.8125rem",
                  color: T.inkMuted,
                  lineHeight: 1.65,
                  display: "-webkit-box",
                  WebkitLineClamp: featured ? 3 : 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  mt: 0.25,
                }}
              >
                {post.excerpt}
              </Typography>
            )}

            {/* Tags */}
            {!compact && post.tags.length > 0 && (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 0.5 }}>
                {post.tags.slice(0, 3).map((tag) => (
                  <Box
                    key={tag}
                    sx={{
                      px: 1,
                      py: 0.25,
                      borderRadius: "100px",
                      background: T.blueDim,
                      border: "1px solid rgba(37,99,235,0.12)",
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: SANS,
                        fontSize: "0.6rem",
                        fontWeight: 600,
                        color: T.blue,
                        textTransform: "lowercase",
                      }}
                    >
                      {tag}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}

            {/* Footer — reading time */}
            {post.readingTime > 0 && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  mt: "auto",
                  pt: 1,
                }}
              >
                <TimeIcon sx={{ fontSize: "0.7rem", color: T.inkFaint }} />
                <Typography
                  sx={{
                    fontFamily: SANS,
                    fontSize: "0.6875rem",
                    color: T.inkFaint,
                    fontWeight: 500,
                  }}
                >
                  {post.readingTime} min read
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Link>
    </motion.div>
  )
}