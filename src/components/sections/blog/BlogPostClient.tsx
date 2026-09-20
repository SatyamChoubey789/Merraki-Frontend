"use client";

import { Box, Container, Typography } from "@mui/material";
import {
  AccessTime as TimeIcon,
  ArrowBack as BackIcon,
} from "@mui/icons-material";
import { motion, useScroll, useSpring } from "framer-motion";
import Link from "next/link";

const T = {
  bg: "#FFFFFF",
  bgPage: "#F9FAFB",
  ink: "#111118",
  inkMid: "#2E2E40",
  inkMuted: "#6B6B80",
  inkFaint: "#A0A0B0",
  border: "rgba(10,10,20,0.07)",
  blue: "#2563EB",
  bluePale: "#EFF6FF",
  blueDim: "rgba(37,99,235,0.07)",
};

const SANS = '"DM Sans", system-ui, sans-serif';
const MONO = '"DM Mono", "JetBrains Mono", monospace';
const EASE = [0.16, 1, 0.3, 1] as const;

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
        height: "3px",
        zIndex: 9999,
        background: "transparent",
      }}
    >
      <motion.div
        style={{
          scaleX,
          transformOrigin: "0%",
          height: "100%",
          background: `linear-gradient(90deg, ${T.blue}, #7C3AED)`,
        }}
      />
    </Box>
  );
}

interface BlogPostForPage {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  coverImage: string | null;
  category: { id: string; name: string; slug: string } | null;
  tags: string[];
  readingTime: number;
  publishedAt: string | null;
  content: string;
  seoTitle: string | null;
  seoDescription: string | null;
  author: {
    id: string;
    name: string;
    bio: string | null;
    avatarUrl: string | null;
  } | null;
}

interface Props {
  post: BlogPostForPage;
}

export function BlogPostClient({ post }: Props) {
  if (!post) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          background: T.bgPage,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <Typography
            sx={{
              fontFamily: SANS,
              fontWeight: 600,
              fontSize: "1.25rem",
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
              gap: 0.75,
              fontFamily: SANS,
              fontSize: "0.875rem",
              color: T.blue,
              textDecoration: "none",
              border: `1px solid rgba(37,99,235,0.2)`,
              borderRadius: "8px",
              px: 2,
              py: 1,
              background: T.bluePale,
            }}
          >
            <BackIcon sx={{ fontSize: "0.85rem" }} />
            Back to Blog
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", background: T.bgPage, fontFamily: SANS }}>
      <ReadingProgress />

      {/* ── Nav bar ────────────────────────────────────────────── */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          px: { xs: 3, md: 6 },
          py: 1.75,
          background: "rgba(249,250,251,0.88)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          borderBottom: `1px solid ${T.border}`,
        }}
      >
        <Box
          component={Link}
          href="/blog"
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 0.75,
            fontFamily: SANS,
            fontSize: "0.8125rem",
            fontWeight: 500,
            color: T.inkFaint,
            textDecoration: "none",
            transition: "color 0.15s",
            "&:hover": { color: T.blue },
          }}
        >
          <BackIcon sx={{ fontSize: "0.875rem" }} />
          Blog
        </Box>

        {post.category?.name && (
          <>
            <Box
              sx={{
                mx: 1.25,
                width: 3,
                height: 3,
                borderRadius: "50%",
                background: T.inkFaint,
                flexShrink: 0,
              }}
            />
            <Typography
              sx={{
                fontFamily: SANS,
                fontSize: "0.8125rem",
                color: T.inkFaint,
                textOverflow: "ellipsis",
                overflow: "hidden",
                whiteSpace: "nowrap",
              }}
            >
              {post.category.name}
            </Typography>
          </>
        )}
      </Box>

      {/* ── Article ────────────────────────────────────────────── */}
      <Box sx={{ pt: { xs: "56px", md: "60px" } }}>
        {/* Cover image */}
        {post.coverImage && (
          <Box
            sx={{
              width: "100%",
              maxHeight: { xs: 260, md: 500 },
              overflow: "hidden",
            }}
          >
            <motion.div
              initial={{ scale: 1.05, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.7, ease: EASE }}
            >
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
            </motion.div>
          </Box>
        )}

        {/* Article header */}
        <Container maxWidth="sm" sx={{ pt: { xs: 5, md: 7 } }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            {post.category?.name && (
              <Typography
                sx={{
                  fontFamily: SANS,
                  fontSize: "0.6875rem",
                  fontWeight: 700,
                  color: T.blue,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  mb: 2,
                }}
              >
                {post.category.name}
              </Typography>
            )}

            <Typography
              component="h1"
              sx={{
                fontFamily: SANS,
                fontWeight: 800,
                fontSize: { xs: "1.875rem", sm: "2.5rem", md: "3rem" },
                color: T.ink,
                letterSpacing: "-0.03em",
                lineHeight: 1.08,
                mb: 2.5,
              }}
            >
              {post.title}
            </Typography>

            {post.excerpt && (
              <Typography
                sx={{
                  fontFamily: SANS,
                  fontSize: { xs: "1rem", md: "1.125rem" },
                  color: T.inkMuted,
                  lineHeight: 1.75,
                  mb: 3,
                }}
              >
                {post.excerpt}
              </Typography>
            )}

            {/* Meta row */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 2,
                pb: 4,
                borderBottom: `1px solid ${T.border}`,
              }}
            >
              {/* Author */}
              {post.author && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  {post.author.avatarUrl ? (
                    <Box
                      component="img"
                      src={post.author.avatarUrl}
                      alt={post.author.name}
                      sx={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        objectFit: "cover",
                        border: `1px solid ${T.border}`,
                      }}
                    />
                  ) : (
                    <Box
                      sx={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        background: T.bluePale,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: `1px solid rgba(37,99,235,0.15)`,
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: SANS,
                          fontSize: "0.6875rem",
                          fontWeight: 700,
                          color: T.blue,
                        }}
                      >
                        {post.author.name.charAt(0).toUpperCase()}
                      </Typography>
                    </Box>
                  )}
                  <Typography
                    sx={{
                      fontFamily: SANS,
                      fontSize: "0.8125rem",
                      fontWeight: 600,
                      color: T.ink,
                    }}
                  >
                    {post.author.name}
                  </Typography>
                </Box>
              )}

              {/* Divider dot */}
              {post.author && post.readingTime > 0 && (
                <Box
                  sx={{
                    width: 3,
                    height: 3,
                    borderRadius: "50%",
                    background: T.inkFaint,
                  }}
                />
              )}

              {/* Reading time */}
              {post.readingTime > 0 && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <TimeIcon sx={{ fontSize: "0.75rem", color: T.inkFaint }} />
                  <Typography
                    sx={{
                      fontFamily: SANS,
                      fontSize: "0.8125rem",
                      color: T.inkFaint,
                    }}
                  >
                    {post.readingTime} min read
                  </Typography>
                </Box>
              )}

              {/* Tags */}
              {post.tags.length > 0 && (
                <Box sx={{ display: "flex", gap: 0.75, flexWrap: "wrap" }}>
                  {post.tags.slice(0, 3).map((tag) => (
                    <Box
                      key={tag}
                      sx={{
                        px: 1.25,
                        py: 0.25,
                        borderRadius: "100px",
                        background: T.blueDim,
                        border: "1px solid rgba(37,99,235,0.12)",
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: SANS,
                          fontSize: "0.625rem",
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
            </Box>
          </motion.div>
        </Container>

        {/* Article body */}
        <Container maxWidth="sm" sx={{ py: { xs: 5, md: 7 } }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: EASE }}
          >
            <Box
              sx={{
                "& p": {
                  fontFamily: SANS,
                  fontSize: { xs: "1rem", md: "1.125rem" },
                  lineHeight: 1.85,
                  color: T.inkMid,
                  mb: "1.5em",
                },
                "& h1, & h2, & h3, & h4": {
                  fontFamily: SANS,
                  fontWeight: 700,
                  color: T.ink,
                  lineHeight: 1.2,
                },
                "& h1": { fontSize: "2rem", mt: "2.5em", mb: "0.75em" },
                "& h2": { fontSize: "1.6rem", mt: "2.25em", mb: "0.65em" },
                "& h3": { fontSize: "1.25rem", mt: "2em", mb: "0.5em" },
                "& h4": { fontSize: "1rem", mt: "1.75em", mb: "0.4em" },
                "& ul, & ol": { pl: "1.5em", mb: "1.5em" },
                "& li": {
                  fontFamily: SANS,
                  fontSize: { xs: "1rem", md: "1.125rem" },
                  lineHeight: 1.8,
                  color: T.inkMid,
                  mb: "0.5em",
                },
                "& li::marker": { color: T.blue },
                "& blockquote": {
                  borderLeft: `3px solid ${T.blue}`,
                  pl: "1.5rem",
                  py: "0.5rem",
                  my: "2em",
                  background: T.blueDim,
                  borderRadius: "0 10px 10px 0",
                },
                "& code": {
                  fontFamily: MONO,
                  background: "#F3F4F6",
                  border: `1px solid ${T.border}`,
                  borderRadius: "4px",
                  px: "0.4em",
                  py: "0.15em",
                  color: "#1D4ED8",
                  fontSize: "0.875em",
                },
                "& pre": {
                  fontFamily: MONO,
                  background: "#F8F9FA",
                  border: `1px solid ${T.border}`,
                  borderRadius: "12px",
                  p: "1.25rem",
                  overflowX: "auto",
                  mb: "1.75em",
                  fontSize: "0.875rem",
                },
                "& pre code": {
                  background: "none",
                  border: "none",
                  p: 0,
                  borderRadius: 0,
                },
                "& img": {
                  width: "100%",
                  borderRadius: "12px",
                  border: `1px solid ${T.border}`,
                  my: "2em",
                  display: "block",
                },
                "& a": {
                  color: T.blue,
                  textDecoration: "underline",
                  textUnderlineOffset: "3px",
                },
                "& hr": {
                  border: "none",
                  borderTop: `1px solid ${T.border}`,
                  my: "3em",
                },
                "& strong": { color: T.ink, fontWeight: 700 },
                "& table": {
                  width: "100%",
                  borderCollapse: "collapse",
                  mb: "1.75em",
                  fontSize: "0.9375rem",
                },
                "& th": {
                  fontFamily: SANS,
                  fontWeight: 700,
                  color: T.ink,
                  textAlign: "left",
                  borderBottom: `2px solid ${T.border}`,
                  py: "10px",
                  px: "12px",
                  background: T.bgPage,
                },
                "& td": {
                  fontFamily: SANS,
                  textAlign: "left",
                  borderBottom: `1px solid ${T.border}`,
                  py: "10px",
                  px: "12px",
                  color: T.inkMid,
                },
              }}
              dangerouslySetInnerHTML={{ __html: post.content || "" }}
            />
          </motion.div>

          {/* ── Article footer ─────────────────────────────────── */}
          <Box
            sx={{
              mt: 8,
              pt: 4,
              borderTop: `1px solid ${T.border}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            {post.category?.name && (
              <Box
                sx={{
                  px: "14px",
                  py: "6px",
                  borderRadius: "100px",
                  background: T.blueDim,
                  border: `1px solid rgba(37,99,235,0.18)`,
                }}
              >
                <Typography
                  sx={{
                    fontFamily: SANS,
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: T.blue,
                  }}
                >
                  {post.category.name}
                </Typography>
              </Box>
            )}

            <Box
              component={Link}
              href="/blog"
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.625,
                fontFamily: SANS,
                fontSize: "0.8125rem",
                fontWeight: 500,
                color: T.inkFaint,
                textDecoration: "none",
                transition: "color 0.15s",
                "&:hover": { color: T.blue },
              }}
            >
              <BackIcon sx={{ fontSize: "0.8rem" }} />
              Back to Blog
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
