"use client";

import { Box, Container, Typography, Skeleton } from "@mui/material";
import {
  AccessTime as TimeIcon,
  ArrowBack as BackIcon,
  Share as ShareIcon,
} from "@mui/icons-material";
import { motion, useScroll, useSpring } from "framer-motion";
import Link from "next/link";
import { useMemo } from "react";
import { useBlogPost, useBlogPosts } from "@/lib/hooks/useBlogPosts";
import { formatDate } from "@/lib/utils/formatters";
import { sanitizeBlogContent } from "@/lib/utils/sanitizeBlogContent";
import { BlogCard } from "./BlogCard";

const T = {
  bg: "#FFFFFF",
  white: "#FFFFFF",
  ink: "#0A0A0F",
  inkMid: "#1E1E2A",
  inkMuted: "#6B6B7A",
  inkFaint: "#A0A0AE",
  rule: "rgba(10,10,15,0.10)",
  blue: "#3B7BF6",
  blueLight: "#7AABFF",
  blueGlow: "rgba(59,123,246,0.10)",
};

const FONT_SANS = '"DM Sans", system-ui, sans-serif';
const FONT_MONO = '"DM Mono", ui-monospace, monospace';
const EASE = [0.16, 1, 0.3, 1] as const;

/* ── Reading progress ── */
function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });
  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "2px",
        zIndex: 9999,
        background: T.rule,
      }}
    >
      <motion.div
        style={{
          scaleX,
          transformOrigin: "0%",
          height: "100%",
          background: `linear-gradient(90deg, ${T.blue}, ${T.blueLight})`,
        }}
      />
    </Box>
  );
}

interface BlogPostClientProps {
  slug: string;
}

export function BlogPostClient({ slug }: BlogPostClientProps) {
  const { data, isLoading, isError } = useBlogPost(slug);
  const { data: relatedData } = useBlogPosts({ limit: 4 });
  const post = data?.data;
  const cleanContent = useMemo(
    () => (post?.content ? sanitizeBlogContent(post.content) : ""),
    [post?.content],
  );
  const relatedPosts =
    relatedData?.data?.filter((p) => p.slug !== slug).slice(0, 3) ?? [];

  if (isLoading) {
    return (
      <Box sx={{ pt: { xs: 10, md: 14 }, pb: 12, background: T.bg }}>
        <Container maxWidth="lg">
          <Skeleton
            variant="rectangular"
            height={400}
            sx={{ borderRadius: "4px", mb: 5, background: "#F0F1F3" }}
          />
          <Skeleton
            variant="text"
            height={52}
            width="80%"
            sx={{ mb: 1, background: "#F0F1F3" }}
          />
          <Skeleton
            variant="text"
            height={24}
            width="40%"
            sx={{ mb: 5, background: "#F0F1F3" }}
          />
          {[94, 86, 84, 94, 90, 84, 83, 93].map((w, i) => (
            <Skeleton
              key={i}
              variant="text"
              height={22}
              sx={{ mb: 1, width: `${w}%`, background: "#F0F1F3" }}
            />
          ))}
        </Container>
      </Box>
    );
  }

  if (isError || !post) {
    return (
      <Container maxWidth="md" sx={{ pt: 14, pb: 14, textAlign: "center" }}>
        <Typography
          sx={{
            fontFamily: FONT_SANS,
            fontWeight: 700,
            fontSize: "2rem",
            color: T.inkMuted,
            mb: 2,
          }}
        >
          Article not found.
        </Typography>
        <Box
          component={Link}
          href="/blog"
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 1,
            fontFamily: FONT_SANS,
            fontSize: "0.875rem",
            color: T.blue,
            border: `1px solid ${T.blue}`,
            borderRadius: "3px",
            px: 2,
            py: 0.875,
            textDecoration: "none",
            transition: "all 0.15s",
            "&:hover": { background: `${T.blue}08` },
          }}
        >
          ← Back to the Review
        </Box>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", background: T.bg, fontFamily: FONT_SANS }}>
      <ReadingProgress />

      {/* ── Header ── */}
      <Box
        sx={{
          background: T.white,
          borderBottom: `1px solid ${T.rule}`,
          pt: { xs: 12, md: 16 },
          pb: 0,
        }}
      >
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            {/* Back */}
            <Box
              component={Link}
              href="/blog"
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.75,
                fontFamily: FONT_MONO,
                fontSize: "0.54rem",
                letterSpacing: "0.14em",
                color: T.inkFaint,
                textTransform: "uppercase",
                textDecoration: "none",
                mb: 3.5,
                transition: "color 0.15s",
                "&:hover": { color: T.blue },
              }}
            >
              <BackIcon sx={{ fontSize: "0.75rem" }} /> The Merraki Review
            </Box>

            {/* Category + date */}
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1.5 }}
            >
              {post.category?.name && (
                <Typography
                  sx={{
                    fontFamily: FONT_MONO,
                    fontSize: "0.54rem",
                    letterSpacing: "0.16em",
                    color: T.blue,
                    textTransform: "uppercase",
                  }}
                >
                  {post.category.name}
                </Typography>
              )}
              <Box sx={{ width: 1, height: 10, background: T.rule }} />
              <Typography
                sx={{
                  fontFamily: FONT_MONO,
                  fontSize: "0.54rem",
                  letterSpacing: "0.1em",
                  color: T.inkFaint,
                  textTransform: "uppercase",
                }}
              >
                {formatDate(post.publishedAt)}
              </Typography>
            </Box>

            {/* Title */}
            <Typography
              sx={{
                fontFamily: FONT_SANS,
                fontWeight: 700,
                fontSize: { xs: "1.875rem", sm: "2.5rem", md: "3.25rem" },
                color: T.ink,
                letterSpacing: "-0.03em",
                lineHeight: 1.05,
                mb: 2,
                maxWidth: 820,
              }}
            >
              {post.title}
            </Typography>

            {/* Excerpt */}
            {post.excerpt && (
              <Typography
                sx={{
                  fontFamily: FONT_SANS,
                  fontSize: { xs: "1rem", md: "1.125rem" },
                  color: T.inkMuted,
                  lineHeight: 1.7,
                  mb: 3,
                  maxWidth: 640,
                }}
              >
                {post.excerpt}
              </Typography>
            )}

            {/* Byline */}
            <Box
              sx={{
                borderTop: `1px solid ${T.rule}`,
                py: 1.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Box
                  sx={{
                    width: 34,
                    height: 34,
                    borderRadius: "50%",
                    background: `${T.blue}14`,
                    border: `1px solid ${T.blue}20`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: FONT_SANS,
                      fontWeight: 700,
                      fontSize: "0.875rem",
                      color: T.blue,
                    }}
                  >
                    {post.author.name.charAt(0)}
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    sx={{
                      fontFamily: FONT_SANS,
                      fontWeight: 600,
                      fontSize: "0.8125rem",
                      color: T.ink,
                      lineHeight: 1.1,
                    }}
                  >
                    {post.author.name}
                  </Typography>
                  {post.author.role && (
                    <Typography
                      sx={{
                        fontFamily: FONT_MONO,
                        fontSize: "0.5rem",
                        letterSpacing: "0.1em",
                        color: T.inkFaint,
                        textTransform: "uppercase",
                      }}
                    >
                      {post.author.role}
                    </Typography>
                  )}
                </Box>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                  <TimeIcon sx={{ fontSize: "0.75rem", color: T.inkFaint }} />
                  <Typography
                    sx={{
                      fontFamily: FONT_MONO,
                      fontSize: "0.52rem",
                      letterSpacing: "0.1em",
                      color: T.inkFaint,
                      textTransform: "uppercase",
                    }}
                  >
                    {post.readingTime} min read
                  </Typography>
                </Box>
                {post.viewsCount > 0 && (
                  <>
                    <Box sx={{ width: 1, height: 10, background: T.rule }} />
                    <Typography
                      sx={{
                        fontFamily: FONT_MONO,
                        fontSize: "0.52rem",
                        letterSpacing: "0.1em",
                        color: T.inkFaint,
                        textTransform: "uppercase",
                      }}
                    >
                      {post.viewsCount.toLocaleString("en-IN")} views
                    </Typography>
                  </>
                )}
                <Box sx={{ width: 1, height: 10, background: T.rule }} />
                <Box
                  component="button"
                  onClick={() =>
                    navigator.clipboard?.writeText(window.location.href)
                  }
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.75,
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: FONT_MONO,
                    fontSize: "0.52rem",
                    letterSpacing: "0.1em",
                    color: T.inkFaint,
                    textTransform: "uppercase",
                    transition: "color 0.15s",
                    "&:hover": { color: T.blue },
                    outline: "none",
                  }}
                >
                  <ShareIcon sx={{ fontSize: "0.75rem" }} /> Share
                </Box>
              </Box>
            </Box>
          </motion.div>
        </Container>

        {/* Cover image */}
        {post.coverImage && (
          <Box sx={{ mt: 0, height: { xs: 220, md: 400 }, overflow: "hidden" }}>
            <Box
              component="img"
              src={post.coverImage}
              alt={post.title}
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          </Box>
        )}
      </Box>

      {/* ── Content + Sidebar ── */}
      <Container maxWidth="lg" sx={{ pt: { xs: 5, md: 7 }, pb: 12 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "1fr 300px" },
            gap: { xs: 6, lg: 8 },
            alignItems: "start",
          }}
        >
          {/* Article body */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            {/* Tags */}
            {post.tags.length > 0 && (
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 3 }}>
                {post.tags.map((tag) => (
                  <Box
                    key={tag}
                    sx={{
                      px: 1.5,
                      py: 0.5,
                      border: `1px solid ${T.rule}`,
                      borderRadius: "3px",
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: FONT_MONO,
                        fontSize: "0.5rem",
                        letterSpacing: "0.14em",
                        color: T.inkFaint,
                        textTransform: "uppercase",
                      }}
                    >
                      #{tag}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}

            {/* HTML content */}
            <Box
              sx={{
                background: T.white,
                borderRadius: "4px",
                border: `1px solid ${T.rule}`,
                p: { xs: 3, md: 5 },
                mb: 4,
                "& p": {
                  fontFamily: FONT_SANS,
                  fontSize: "1.0625rem",
                  lineHeight: 1.88,
                  color: T.inkMid,
                  mb: "1.25em",
                },
                "& h2": {
                  fontFamily: FONT_SANS,
                  fontWeight: 700,
                  fontSize: "clamp(1.375rem, 3vw, 1.875rem)",
                  color: T.ink,
                  mt: "2em",
                  mb: "0.6em",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.15,
                  borderTop: `1px solid ${T.rule}`,
                  pt: "1.25em",
                },
                "& h3": {
                  fontFamily: FONT_SANS,
                  fontWeight: 600,
                  fontSize: "clamp(1.125rem, 2.5vw, 1.375rem)",
                  color: T.inkMid,
                  mt: "1.75em",
                  mb: "0.5em",
                  letterSpacing: "-0.01em",
                },
                "& ul, & ol": { pl: "1.5em", mb: "1.25em" },
                "& li": {
                  fontFamily: FONT_SANS,
                  fontSize: "1.0625rem",
                  lineHeight: 1.8,
                  color: T.inkMid,
                  mb: "0.35em",
                },
                "& li::marker": { color: T.blue },
                "& blockquote": {
                  borderLeft: `3px solid ${T.blue}`,
                  pl: 3,
                  py: 0.5,
                  my: "2em",
                  background: `${T.blue}05`,
                  borderRadius: "0 3px 3px 0",
                  "& p": { fontSize: "1.125rem", lineHeight: 1.6, mb: 0 },
                },
                "& code": {
                  fontFamily: FONT_MONO,
                  fontSize: "0.875em",
                  background: "#F4F5F7",
                  px: "5px",
                  py: "2px",
                  borderRadius: "2px",
                  color: T.inkMid,
                },
                "& pre": {
                  background: T.ink,
                  p: 3,
                  borderRadius: "4px",
                  overflowX: "auto",
                  mb: "1.5em",
                  "& code": {
                    background: "transparent",
                    color: "#E2E8F0",
                    p: 0,
                  },
                },
                "& strong": { fontWeight: 700, color: T.ink },
                "& a": {
                  color: T.blue,
                  fontWeight: 500,
                  textDecoration: "none",
                  borderBottom: `1px solid ${T.blueLight}55`,
                  transition: "all 0.15s",
                  "&:hover": { borderBottomColor: T.blue },
                },
                "& img": {
                  maxWidth: "100%",
                  borderRadius: "4px",
                  my: "2em",
                  display: "block",
                  border: `1px solid ${T.rule}`,
                },
                "& table": {
                  width: "100%",
                  borderCollapse: "collapse",
                  mb: "1.5em",
                  border: `1px solid ${T.rule}`,
                },
                "& th": {
                  background: "#F4F5F7",
                  fontFamily: FONT_MONO,
                  fontSize: "0.7rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  fontWeight: 600,
                  p: "10px 14px",
                  borderBottom: `2px solid ${T.rule}`,
                  color: T.inkMid,
                  textAlign: "left",
                },
                "& td": {
                  p: "10px 14px",
                  borderBottom: `1px solid ${T.rule}`,
                  color: T.inkMuted,
                  fontFamily: FONT_SANS,
                  fontSize: "0.9375rem",
                },
                "& hr": {
                  border: "none",
                  borderTop: `1px solid ${T.rule}`,
                  my: "2.5em",
                },
              }}
              dangerouslySetInnerHTML={{ __html: cleanContent }}
            />

            {/* Author card */}
            <Box
              sx={{
                background: T.white,
                border: `1px solid ${T.rule}`,
                borderRadius: "4px",
                p: { xs: 3, md: 4 },
                display: "flex",
                gap: 2.5,
                alignItems: "flex-start",
                flexDirection: { xs: "column", sm: "row" },
              }}
            >
              <Box
                sx={{
                  width: 52,
                  height: 52,
                  borderRadius: "50%",
                  background: `${T.blue}14`,
                  border: `1px solid ${T.blue}20`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Typography
                  sx={{
                    fontFamily: FONT_SANS,
                    fontWeight: 700,
                    fontSize: "1.125rem",
                    color: T.blue,
                  }}
                >
                  {post.author.name.charAt(0)}
                </Typography>
              </Box>
              <Box>
                <Typography
                  sx={{
                    fontFamily: FONT_MONO,
                    fontSize: "0.5rem",
                    letterSpacing: "0.14em",
                    color: T.inkFaint,
                    textTransform: "uppercase",
                    mb: 0.5,
                  }}
                >
                  Written by
                </Typography>
                <Typography
                  sx={{
                    fontFamily: FONT_SANS,
                    fontWeight: 700,
                    fontSize: "1rem",
                    color: T.ink,
                    mb: 0.25,
                  }}
                >
                  {post.author.name}
                </Typography>
                {post.author.role && (
                  <Typography
                    sx={{
                      fontFamily: FONT_MONO,
                      fontSize: "0.56rem",
                      letterSpacing: "0.1em",
                      color: T.blue,
                      textTransform: "uppercase",
                      mb: 1,
                    }}
                  >
                    {post.author.role} · Merraki Solutions
                  </Typography>
                )}
                {post.author.bio && (
                  <Typography
                    sx={{
                      fontFamily: FONT_SANS,
                      fontSize: "0.875rem",
                      color: T.inkMuted,
                      lineHeight: 1.72,
                    }}
                  >
                    {post.author.bio}
                  </Typography>
                )}
              </Box>
            </Box>
          </motion.div>

          {/* Sidebar */}
          <Box sx={{ position: { lg: "sticky" }, top: { lg: 96 } }}>
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15, duration: 0.45, ease: EASE }}
            >
              {/* CTA */}
              <Box
                sx={{
                  background: T.white,
                  border: `1px solid ${T.rule}`,
                  borderTop: `3px solid ${T.blue}`,
                  borderRadius: "4px",
                  p: 3,
                  mb: 2.5,
                }}
              >
                <Typography
                  sx={{
                    fontFamily: FONT_MONO,
                    fontSize: "0.52rem",
                    letterSpacing: "0.18em",
                    color: T.blue,
                    textTransform: "uppercase",
                    mb: 1.25,
                  }}
                >
                  Free Session
                </Typography>
                <Typography
                  sx={{
                    fontFamily: FONT_SANS,
                    fontWeight: 600,
                    fontSize: "1.0625rem",
                    color: T.ink,
                    letterSpacing: "-0.01em",
                    lineHeight: 1.25,
                    mb: 1,
                  }}
                >
                  Apply what you just learned.
                </Typography>
                <Typography
                  sx={{
                    fontFamily: FONT_SANS,
                    fontSize: "0.8125rem",
                    color: T.inkMuted,
                    lineHeight: 1.7,
                    mb: 2.5,
                  }}
                >
                  Book a free 30-min session with Parag or Khyati and walk away
                  with a personalised action plan.
                </Typography>
                <Box
                  component="a"
                  href={process.env.NEXT_PUBLIC_CALENDLY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    py: 1.5,
                    borderRadius: "3px",
                    background: `linear-gradient(115deg, ${T.blueLight}, ${T.blue})`,
                    textDecoration: "none",
                    transition: "opacity 0.15s",
                    "&:hover": { opacity: 0.9 },
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: FONT_SANS,
                      fontWeight: 600,
                      fontSize: "0.875rem",
                      color: T.white,
                    }}
                  >
                    Book Free Call
                  </Typography>
                </Box>
              </Box>

              {/* Templates */}
              <Box
                sx={{
                  background: T.white,
                  border: `1px solid ${T.rule}`,
                  borderRadius: "4px",
                  p: 3,
                  mb: 2.5,
                }}
              >
                <Typography
                  sx={{
                    fontFamily: FONT_MONO,
                    fontSize: "0.52rem",
                    letterSpacing: "0.18em",
                    color: T.inkFaint,
                    textTransform: "uppercase",
                    mb: 1,
                  }}
                >
                  Templates
                </Typography>
                <Typography
                  sx={{
                    fontFamily: FONT_SANS,
                    fontWeight: 600,
                    fontSize: "1rem",
                    color: T.ink,
                    letterSpacing: "-0.01em",
                    lineHeight: 1.2,
                    mb: 0.75,
                  }}
                >
                  Professional Excel models
                </Typography>
                <Typography
                  sx={{
                    fontFamily: FONT_SANS,
                    fontSize: "0.8125rem",
                    color: T.inkMuted,
                    lineHeight: 1.7,
                    mb: 2,
                  }}
                >
                  Investor-ready financial models and dashboards built for
                  founders.
                </Typography>
                <Box
                  component={Link}
                  href="/templates"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    py: 1.25,
                    borderRadius: "3px",
                    border: `1px solid ${T.rule}`,
                    textDecoration: "none",
                    transition: "all 0.15s",
                    "&:hover": { borderColor: T.blue },
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: FONT_SANS,
                      fontWeight: 500,
                      fontSize: "0.8125rem",
                      color: T.inkMuted,
                    }}
                  >
                    Browse Templates →
                  </Typography>
                </Box>
              </Box>

              {/* Founder test */}
              <Box
                sx={{
                  background: "#F0F4FF",
                  border: `1px solid ${T.rule}`,
                  borderRadius: "4px",
                  p: 3,
                }}
              >
                <Typography
                  sx={{
                    fontFamily: FONT_MONO,
                    fontSize: "0.52rem",
                    letterSpacing: "0.18em",
                    color: T.inkFaint,
                    textTransform: "uppercase",
                    mb: 1,
                  }}
                >
                  Free Assessment
                </Typography>
                <Typography
                  sx={{
                    fontFamily: FONT_SANS,
                    fontWeight: 600,
                    fontSize: "1rem",
                    color: T.ink,
                    letterSpacing: "-0.01em",
                    lineHeight: 1.2,
                    mb: 0.75,
                  }}
                >
                  Know your financial type
                </Typography>
                <Typography
                  sx={{
                    fontFamily: FONT_SANS,
                    fontSize: "0.8125rem",
                    color: T.inkMuted,
                    lineHeight: 1.7,
                    mb: 2,
                  }}
                >
                  Take our founder test and get a personalised financial
                  personality report.
                </Typography>
                <Box
                  component={Link}
                  href="/founder-test"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    py: 1.25,
                    borderRadius: "3px",
                    background: T.ink,
                    textDecoration: "none",
                    transition: "opacity 0.15s",
                    "&:hover": { opacity: 0.85 },
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: FONT_SANS,
                      fontWeight: 600,
                      fontSize: "0.8125rem",
                      color: T.white,
                    }}
                  >
                    Take Free Test →
                  </Typography>
                </Box>
              </Box>
            </motion.div>
          </Box>
        </Box>

        {/* Related posts */}
        {relatedPosts.length > 0 && (
          <Box sx={{ mt: 8 }}>
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 4 }}
            >
              <Typography
                sx={{
                  fontFamily: FONT_MONO,
                  fontSize: "0.56rem",
                  letterSpacing: "0.2em",
                  color: T.inkFaint,
                  textTransform: "uppercase",
                  whiteSpace: "nowrap",
                }}
              >
                More Stories
              </Typography>
              <Box sx={{ flex: 1, height: "1px", background: T.rule }} />
            </Box>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(3,1fr)" },
                gap: 2,
              }}
            >
              {relatedPosts.map((related, i) => (
                <BlogCard
                  key={related.id}
                  post={related}
                  index={i}
                  variant="default"
                />
              ))}
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  );
}
