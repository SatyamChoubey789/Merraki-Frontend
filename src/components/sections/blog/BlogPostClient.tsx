"use client";

import { Box, Container, Typography, Skeleton } from "@mui/material";
import { AccessTime as TimeIcon, ArrowBack as BackIcon } from "@mui/icons-material";
import { motion, useScroll, useSpring } from "framer-motion";
import Link from "next/link";
import { useMemo } from "react";
import { useBlogPost } from "@/lib/hooks/useBlogPosts";
import { formatDate } from "@/lib/utils/formatters";
import { sanitizeBlogContent } from "@/lib/utils/sanitizeBlogContent";

const T = {
  bg:       "#FFFFFF",
  bgPage:   "#F9FAFB",
  ink:      "#111118",
  inkMid:   "#2E2E40",
  inkMuted: "#6B6B80",
  inkFaint: "#A0A0B0",
  border:   "rgba(10,10,20,0.07)",
  blue:     "#2563EB",
  bluePale: "#EFF6FF",
  blueDim:  "rgba(37,99,235,0.07)",
};

const SANS = '"DM Sans", system-ui, sans-serif';
const SERIF = '"Georgia", "Times New Roman", serif';
const MONO = '"DM Mono", "JetBrains Mono", monospace';
const EASE = [0.16, 1, 0.3, 1] as const;

/* ── Reading progress bar ───────────────────────── */
function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });
  return (
    <Box sx={{ position: "fixed", top: 0, left: 0, right: 0, height: "2px", zIndex: 9999, pointerEvents: "none", background: T.border }}>
      <motion.div style={{
        scaleX, transformOrigin: "0%", height: "100%",
        background: T.blue,
      }} />
    </Box>
  );
}

interface Props { slug: string; }

export function BlogPostClient({ slug }: Props) {
  const { data, isLoading, isError } = useBlogPost(slug);
  const post = data?.data;

  const cleanContent = useMemo(() => {
    if (!post?.content) return "";
    const sanitized = sanitizeBlogContent(post.content);
    if (!post.title) return sanitized;
    const escaped = post.title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return sanitized.replace(
      new RegExp(`^\\s*<h[12][^>]*>\\s*${escaped}\\s*</h[12]>`, "i"),
      ""
    );
  }, [post?.content, post?.title]);

  /* ── Loading ── */
  if (isLoading) {
    return (
      <Box sx={{ minHeight: "100vh", background: T.bgPage, pt: { xs: 10, md: 14 }, pb: 12 }}>
        <Container maxWidth="sm">
          <Skeleton variant="text" width="10%" height={16} sx={{ mb: 6, bgcolor: "#E5E7EB" }} />
          <Skeleton variant="text" width="55%" height={16} sx={{ mb: 1, bgcolor: "#E5E7EB" }} />
          <Skeleton variant="text" width="90%" height={44} sx={{ mb: 1, bgcolor: "#E5E7EB" }} />
          <Skeleton variant="text" width="70%" height={44} sx={{ mb: 4, bgcolor: "#E5E7EB" }} />
          <Skeleton variant="text" width="35%" height={16} sx={{ mb: 6, bgcolor: "#E5E7EB" }} />
          <Skeleton variant="rectangular" height={360} sx={{ borderRadius: "12px", mb: 8, bgcolor: "#E5E7EB" }} />
          {[100, 93, 87, 96, 82, 90, 75, 88, 94].map((w, i) => (
            <Skeleton key={i} variant="text" sx={{ mb: 1, width: `${w}%`, bgcolor: "#E5E7EB" }} />
          ))}
        </Container>
      </Box>
    );
  }

  /* ── Error ── */
  if (isError || !post) {
    return (
      <Box sx={{ minHeight: "100vh", background: T.bgPage, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Box sx={{ textAlign: "center" }}>
          <Typography sx={{ fontFamily: SANS, fontWeight: 600, fontSize: "1.25rem", color: T.inkMuted, mb: 2 }}>
            Article not found.
          </Typography>
          <Box component={Link} href="/blog" sx={{
            display: "inline-flex", alignItems: "center", gap: 0.75,
            fontFamily: SANS, fontSize: "0.875rem", fontWeight: 500,
            color: T.blue, textDecoration: "none",
            border: `1px solid rgba(37,99,235,0.2)`,
            borderRadius: "8px", px: 2, py: 1,
            background: T.bluePale,
            "&:hover": { background: T.blueDim },
          }}>
            <BackIcon sx={{ fontSize: "0.85rem" }} />
            Back to Blog
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", fontFamily: SANS, background: T.bgPage }}>
      <ReadingProgress />

      {/* ── Top nav bar (minimal) ── */}
      <Box sx={{
        position: "fixed", top: 2, left: 0, right: 0, zIndex: 100,
        display: "flex", alignItems: "center",
        px: { xs: 3, md: 6 }, py: 2,
        background: "rgba(249,250,251,0.85)",
        backdropFilter: "blur(12px)",
        borderBottom: `1px solid ${T.border}`,
      }}>
        <Box component={Link} href="/blog" sx={{
          display: "inline-flex", alignItems: "center", gap: 0.75,
          fontFamily: SANS, fontSize: "0.8125rem", fontWeight: 500,
          color: T.inkFaint, textDecoration: "none",
          transition: "color 0.15s",
          "&:hover": { color: T.blue },
        }}>
          <BackIcon sx={{ fontSize: "0.85rem" }} />
          Blog
        </Box>
        {post.category?.name && (
          <>
            <Box sx={{ mx: 1.25, width: 3, height: 3, borderRadius: "50%", background: T.inkFaint }} />
            <Typography sx={{ fontFamily: SANS, fontSize: "0.8125rem", color: T.inkFaint }}>
              {post.category.name}
            </Typography>
          </>
        )}
      </Box>

      {/* ── Article ── */}
      <Box sx={{ pt: { xs: "72px", md: "80px" } }}>

        {/* Cover image — full bleed */}
        {post.coverImage && (
          <Box sx={{
            width: "100%", maxHeight: { xs: 240, md: 480 },
            overflow: "hidden",
          }}>
            <Box
              component="img"
              src={post.coverImage}
              alt={post.title}
              sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          </Box>
        )}

        {/* Header */}
        <Container maxWidth="sm" sx={{ pt: { xs: 5, md: 7 }, pb: 0 }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            {post.category?.name && (
              <Typography sx={{
                fontFamily: SANS, fontSize: "0.68rem", fontWeight: 600,
                color: T.blue, letterSpacing: "0.06em", textTransform: "uppercase", mb: 2,
              }}>
                {post.category.name}
              </Typography>
            )}

            <Typography component="h1" sx={{
              fontFamily: SANS, fontWeight: 700,
              fontSize: { xs: "1.875rem", sm: "2.5rem", md: "3rem" },
              color: T.ink, letterSpacing: "-0.03em", lineHeight: 1.1, mb: 2.5,
            }}>
              {post.title}
            </Typography>

            {post.excerpt && (
              <Typography sx={{
                fontFamily: SANS, fontSize: { xs: "1rem", md: "1.125rem" },
                color: T.inkMuted, lineHeight: 1.75, mb: 3,
              }}>
                {post.excerpt}
              </Typography>
            )}

            {/* Meta */}
            <Box sx={{
              display: "flex", alignItems: "center", gap: 1.5,
              pb: 4, borderBottom: `1px solid ${T.border}`, flexWrap: "wrap",
            }}>
              <Typography sx={{ fontFamily: SANS, fontSize: "0.8125rem", fontWeight: 500, color: T.inkMid }}>
                {formatDate(post.publishedAt)}
              </Typography>
              <Box sx={{ width: 2, height: 2, borderRadius: "50%", background: T.inkFaint }} />
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.625 }}>
                <TimeIcon sx={{ fontSize: "0.8rem", color: T.inkFaint }} />
                <Typography sx={{ fontFamily: SANS, fontSize: "0.8125rem", color: T.inkFaint }}>
                  {post.readingTime} min read
                </Typography>
              </Box>
              {post.viewsCount > 0 && (
                <>
                  <Box sx={{ width: 2, height: 2, borderRadius: "50%", background: T.inkFaint }} />
                  <Typography sx={{ fontFamily: SANS, fontSize: "0.8125rem", color: T.inkFaint }}>
                    {post.viewsCount.toLocaleString("en-IN")} views
                  </Typography>
                </>
              )}
            </Box>
          </motion.div>
        </Container>

        {/* ── Body ── */}
        <Container maxWidth="sm" sx={{ py: { xs: 5, md: 7 } }}>
          <Box
            sx={{
              /* Typography */
              "& p": {
                fontFamily: SANS,
                fontSize: { xs: "1rem", md: "1.125rem" },
                lineHeight: 1.85,
                color: T.inkMid,
                mb: "1.5em",
              },
              "& h1": {
                fontFamily: SANS, fontWeight: 700,
                fontSize: "clamp(1.625rem,3.5vw,2.25rem)",
                color: T.ink, mt: "2.5em", mb: "0.75em",
                letterSpacing: "-0.025em", lineHeight: 1.15,
              },
              "& h2": {
                fontFamily: SANS, fontWeight: 700,
                fontSize: "clamp(1.25rem,2.8vw,1.75rem)",
                color: T.ink, mt: "2.25em", mb: "0.65em",
                letterSpacing: "-0.02em", lineHeight: 1.2,
              },
              "& h3": {
                fontFamily: SANS, fontWeight: 600,
                fontSize: "clamp(1.0625rem,2vw,1.25rem)",
                color: T.inkMid, mt: "2em", mb: "0.5em",
              },
              "& h4": {
                fontFamily: SANS, fontWeight: 600,
                fontSize: "0.9375rem", color: T.inkMid,
                mt: "1.75em", mb: "0.4em",
              },
              "& ul, & ol": { pl: "1.5em", mb: "1.5em" },
              "& li": {
                fontFamily: SANS,
                fontSize: { xs: "1rem", md: "1.125rem" },
                lineHeight: 1.8, color: T.inkMid, mb: "0.5em",
              },
              "& li::marker": { color: T.blue },
              "& blockquote": {
                borderLeft: `3px solid ${T.blue}`,
                pl: "1.5rem", py: "0.25rem", my: "2em",
                background: T.blueDim,
                borderRadius: "0 8px 8px 0",
                "& p": { color: T.inkMid, mb: 0, fontStyle: "italic" },
              },
              "& code": {
                fontFamily: MONO, fontSize: "0.875em",
                background: "#F3F4F6",
                border: `1px solid ${T.border}`,
                borderRadius: "4px", px: "0.35em", py: "0.1em", color: "#1D4ED8",
              },
              "& pre": {
                fontFamily: MONO,
                background: "#F8F9FA",
                border: `1px solid ${T.border}`,
                borderRadius: "10px",
                p: "1.125rem 1.375rem",
                overflowX: "auto", mb: "1.75em",
                fontSize: "0.875rem", lineHeight: 1.75,
                "& code": { background: "none", border: "none", p: 0, color: T.inkMid },
              },
              "& img": {
                width: "100%", borderRadius: "10px",
                border: `1px solid ${T.border}`,
                my: "2em", display: "block",
              },
              "& a": {
                color: T.blue,
                textDecoration: "underline",
                textDecorationColor: "rgba(37,99,235,0.3)",
                "&:hover": { textDecorationColor: T.blue },
              },
              "& hr": {
                border: "none",
                borderTop: `1px solid ${T.border}`,
                my: "3em",
              },
              "& strong": { color: T.ink, fontWeight: 600 },
              "& em": { fontStyle: "italic" },
              "& table": {
                width: "100%", borderCollapse: "collapse",
                mb: "1.75em", fontSize: "0.9rem",
              },
              "& th": {
                fontFamily: SANS, fontWeight: 600, fontSize: "0.8125rem",
                color: T.inkMid, borderBottom: `2px solid ${T.border}`,
                textAlign: "left", py: "10px", px: "12px",
              },
              "& td": {
                fontFamily: SANS, fontSize: "0.875rem", color: T.inkMid,
                borderBottom: `1px solid ${T.border}`,
                py: "10px", px: "12px", lineHeight: 1.6,
              },
              "& tr:last-child td": { borderBottom: "none" },
            }}
            dangerouslySetInnerHTML={{ __html: cleanContent }}
          />

          {/* Footer */}
          <Box sx={{
            mt: 8, pt: 4, borderTop: `1px solid ${T.border}`,
            display: "flex", alignItems: "center",
            justifyContent: "space-between", flexWrap: "wrap", gap: 2,
          }}>
            {post.category?.name && (
              <Box sx={{
                display: "inline-flex", px: "12px", py: "5px",
                borderRadius: "100px", background: T.blueDim,
                border: `1px solid rgba(37,99,235,0.18)`,
              }}>
                <Typography sx={{ fontFamily: SANS, fontSize: "0.72rem", fontWeight: 600, color: T.blue }}>
                  {post.category.name}
                </Typography>
              </Box>
            )}
            <Box component={Link} href="/blog" sx={{
              display: "inline-flex", alignItems: "center", gap: 0.625,
              fontFamily: SANS, fontSize: "0.8125rem", fontWeight: 500,
              color: T.inkFaint, textDecoration: "none",
              transition: "color 0.15s", "&:hover": { color: T.blue },
            }}>
              <BackIcon sx={{ fontSize: "0.8rem" }} />
              Back to Blog
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}