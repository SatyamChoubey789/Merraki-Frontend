"use client";

import { Box, Container, Typography, Skeleton } from "@mui/material";
import { AccessTime as TimeIcon, ArrowBack as BackIcon, Share as ShareIcon, CalendarToday as CalIcon } from "@mui/icons-material";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import Link from "next/link";
import { useMemo, useRef } from "react";
import { useBlogPost, useBlogPosts } from "@/lib/hooks/useBlogPosts";
import { formatDate } from "@/lib/utils/formatters";
import { sanitizeBlogContent } from "@/lib/utils/sanitizeBlogContent";
import { BlogCard } from "./BlogCard";

/* ── Tokens ────────────────────────────────────────────── */
const T = {
  white:     '#FFFFFF',
  offwhite:  '#F5F7FB',              // cool section background
  cream:     '#EDF3FF',              // soft blue pale surface
  parchment: 'rgba(59,123,246,0.06)',// subtle blue tint layer

  ink:       '#0A0A0F',
  inkMid:    '#1E1E2A',
  inkMuted:  '#5A5A72',
  inkFaint:  '#9898AE',
  inkGhost:  '#C2CAD6',

  rule:      'rgba(10,10,20,0.08)',
  ruleMd:    'rgba(10,10,20,0.14)',

  blue:      '#3B7BF6',
  blueMid:   '#5A92F8',
  blueLight: '#7AABFF',
  blueGlow:  'rgba(59,123,246,0.10)',
};

const FONT_DISPLAY = '"Instrument Serif", "Playfair Display", Georgia, serif';
const FONT_SANS    = '"DM Sans", "Mona Sans", system-ui, sans-serif';
const FONT_MONO    = '"DM Mono", "JetBrains Mono", ui-monospace, monospace';
const EASE         = [0.16, 1, 0.3, 1] as const;

/* ── Reading progress bar ──────────────────────────────── */
function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });
  return (
    <Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, height: '2px', zIndex: 9999, background: T.rule }}>
      <motion.div style={{ scaleX, transformOrigin: '0%', height: '100%', background: `linear-gradient(90deg, ${T.blue}, ${T.blueLight})` }} />
    </Box>
  );
}

interface BlogPostClientProps { slug: string; }

export function BlogPostClient({ slug }: BlogPostClientProps) {
  const { data, isLoading, isError } = useBlogPost(slug);
  const { data: relatedData } = useBlogPosts({ limit: 4 });
  const post = data?.data;
  const cleanContent = useMemo(() => (post?.content ? sanitizeBlogContent(post.content) : ''), [post?.content]);
  const relatedPosts = relatedData?.data?.filter(p => p.slug !== slug).slice(0, 3) ?? [];

  /* Parallax hero */
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY  = useTransform(heroProgress, [0, 1], [0, 60]);
  const heroO  = useTransform(heroProgress, [0, 0.7], [1, 0]);
  const sY = useSpring(heroY, { stiffness: 80, damping: 22 });
  const sO = useSpring(heroO, { stiffness: 80, damping: 22 });

  /* ── Loading ── */
  if (isLoading) {
    return (
      <Box sx={{ pt: { xs: 10, md: 14 }, pb: 12, background: T.offwhite }}>
        <Container maxWidth="lg">
          <Skeleton variant="rectangular" height={400} sx={{ borderRadius: '3px', mb: 5, background: T.parchment }} />
          <Skeleton variant="text" height={64} width="80%" sx={{ mb: 1.5, background: T.parchment }} />
          <Skeleton variant="text" height={24} width="40%" sx={{ mb: 5, background: T.parchment }} />
          {[94,86,84,94,90,84,83,93].map((w, i) => (
            <Skeleton key={i} variant="text" height={22} sx={{ mb: 1, width: `${w}%`, background: T.parchment }} />
          ))}
        </Container>
      </Box>
    );
  }

  /* ── Error ── */
  if (isError || !post) {
    return (
      <Container maxWidth="md" sx={{ pt: 12, pb: 14, background: T.offwhite, textAlign: 'center' }}>
        <Typography sx={{ fontFamily: FONT_DISPLAY, fontStyle: 'italic', fontSize: '2.5rem', color: T.inkMuted, mb: 2 }}>Article not found.</Typography>
        <Box component={Link} href="/blog" sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, fontFamily: FONT_SANS, fontSize: '0.875rem', color: T.blue, border: `1px solid ${T.blue}`, borderRadius: '2px', px: 2, py: 0.875, textDecoration: 'none', transition: 'all 0.15s', '&:hover': { background: `${T.blue}08` } }}>
          ← Back to The Review
        </Box>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', background: T.offwhite, fontFamily: FONT_SANS }}>
      <ReadingProgress />

      {/* ══ HERO ═══════════════════════════════════════════ */}
      <Box ref={heroRef} sx={{ background: T.white, borderBottom: `3px double ${T.rule}`, position: 'relative', overflow: 'hidden', pt: { xs: 12, md: 16 }, pb: 0 }}>
        {/* Grid */}
        <Box sx={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: `linear-gradient(${T.rule} 1px, transparent 1px), linear-gradient(90deg, ${T.rule} 1px, transparent 1px)`, backgroundSize: '72px 72px', opacity: 0.28 }} />
        {/* Blue glow */}
        <Box sx={{ position: 'absolute', width: '55vw', height: '35vw', top: '-15vw', left: '22vw', borderRadius: '50%', background: `radial-gradient(ellipse, ${T.blueGlow} 0%, transparent 70%)`, pointerEvents: 'none' }} />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <motion.div style={{ y: sY, opacity: sO }}>

            {/* Back link */}
            <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, ease: EASE }}>
              <Box component={Link} href="/blog" sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, fontFamily: FONT_MONO, fontSize: '0.56rem', letterSpacing: '0.14em', color: T.inkFaint, textTransform: 'uppercase', textDecoration: 'none', mb: 4, transition: 'color 0.15s', '&:hover': { color: T.blue } }}>
                <BackIcon sx={{ fontSize: '0.75rem' }} />
                The Merraki Financial Review
              </Box>
            </motion.div>

            {/* Category + date */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.05, ease: EASE }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75 }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', background: T.blue }} />
                  <Typography sx={{ fontFamily: FONT_MONO, fontSize: '0.54rem', letterSpacing: '0.18em', color: T.blue, textTransform: 'uppercase' }}>{post.category.name}</Typography>
                </Box>
                <Box sx={{ width: 1, height: 10, background: T.rule }} />
                <Typography sx={{ fontFamily: FONT_MONO, fontSize: '0.54rem', letterSpacing: '0.1em', color: T.inkFaint, textTransform: 'uppercase' }}>{formatDate(post.publishedAt)}</Typography>
              </Box>
            </motion.div>

            {/* Headline — broadsheet scale */}
            <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75, delay: 0.08, ease: EASE }}>
              <Typography sx={{
                fontFamily: FONT_DISPLAY, fontStyle: 'italic', fontWeight: 400,
                fontSize: { xs: '2.25rem', sm: '3rem', md: '4.25rem', lg: '5.5rem' },
                color: T.ink, letterSpacing: '-0.03em', lineHeight: 0.97,
                mb: 3.5, maxWidth: 900,
              }}>
                {post.title}
              </Typography>
            </motion.div>

            {/* Deck — newspaper sub-headline */}
            {post.excerpt && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.18, ease: EASE }}>
                <Typography sx={{
                  fontFamily: FONT_DISPLAY, fontStyle: 'normal', fontWeight: 400,
                  fontSize: { xs: '1.0625rem', md: '1.25rem' },
                  color: T.inkMuted, lineHeight: 1.6, mb: 4, maxWidth: 680,
                  borderLeft: `3px solid ${T.blue}`, pl: 2.5,
                }}>
                  {post.excerpt}
                </Typography>
              </motion.div>
            )}

            {/* Byline strip */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.3 }}>
              <Box sx={{ borderTop: `1px solid ${T.rule}`, borderBottom: `1px solid ${T.rule}`, py: 1.75, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, mb: 0 }}>
                {/* Author */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.75 }}>
                  <Box sx={{ width: 40, height: 40, borderRadius: '2px', background: `${T.blue}18`, border: `1px solid ${T.blue}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Typography sx={{ fontFamily: FONT_DISPLAY, fontStyle: 'italic', fontSize: '1.25rem', color: T.blue }}>
                      {post.author.name.charAt(0)}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography sx={{ fontFamily: FONT_SANS, fontWeight: 600, fontSize: '0.875rem', color: T.ink, lineHeight: 1.1 }}>{post.author.name}</Typography>
                    {post.author.role && (
                      <Typography sx={{ fontFamily: FONT_MONO, fontSize: '0.52rem', letterSpacing: '0.1em', color: T.inkFaint, textTransform: 'uppercase' }}>{post.author.role} · Merraki Solutions</Typography>
                    )}
                  </Box>
                </Box>

                {/* Meta */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                    <TimeIcon sx={{ fontSize: '0.75rem', color: T.inkFaint }} />
                    <Typography sx={{ fontFamily: FONT_MONO, fontSize: '0.54rem', letterSpacing: '0.1em', color: T.inkFaint, textTransform: 'uppercase' }}>{post.readingTime} min read</Typography>
                  </Box>
                  {post.viewsCount > 0 && (
                    <>
                      <Box sx={{ width: 1, height: 10, background: T.rule }} />
                      <Typography sx={{ fontFamily: FONT_MONO, fontSize: '0.54rem', letterSpacing: '0.1em', color: T.inkFaint, textTransform: 'uppercase' }}>{post.viewsCount.toLocaleString('en-IN')} views</Typography>
                    </>
                  )}
                  <Box sx={{ width: 1, height: 10, background: T.rule }} />
                  <Box
                    component="button"
                    onClick={() => navigator.clipboard?.writeText(window.location.href)}
                    sx={{ display: 'flex', alignItems: 'center', gap: 0.75, background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: FONT_MONO, fontSize: '0.54rem', letterSpacing: '0.1em', color: T.inkFaint, textTransform: 'uppercase', transition: 'color 0.15s', '&:hover': { color: T.blue }, outline: 'none' }}
                  >
                    <ShareIcon sx={{ fontSize: '0.75rem' }} />
                    Share
                  </Box>
                </Box>
              </Box>
            </motion.div>
          </motion.div>
        </Container>

        {/* Hero cover image — below byline, bleeds to edges */}
        {post.coverImage && (
          <Box sx={{ mt: 0, height: { xs: 240, md: 420 }, overflow: 'hidden', position: 'relative' }}>
            <Box component="img" src={post.coverImage} alt={post.title}
              sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(248,246,241,0.4), transparent)' }} />
          </Box>
        )}
      </Box>

      {/* ══ CONTENT + SIDEBAR ══════════════════════════════ */}
      <Container maxWidth="lg" sx={{ pt: { xs: 5, md: 7 }, pb: 12 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 320px' }, gap: { xs: 6, lg: 8 }, alignItems: 'start' }}>

          {/* ── Article body ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            {/* Tags */}
            {post.tags.length > 0 && (
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3.5 }}>
                {post.tags.map(tag => (
                  <Box key={tag} sx={{ px: 1.5, py: 0.5, border: `1px solid ${T.rule}`, borderRadius: '2px' }}>
                    <Typography sx={{ fontFamily: FONT_MONO, fontSize: '0.5rem', letterSpacing: '0.14em', color: T.inkFaint, textTransform: 'uppercase' }}>#{tag}</Typography>
                  </Box>
                ))}
              </Box>
            )}

            {/* Article HTML — newspaper typography */}
            <Box
              sx={{
                background: T.white,
                borderRadius: '3px',
                border: `1px solid ${T.rule}`,
                p: { xs: 3, md: 5 },
                mb: 4,
                // ── Newspaper typography ──────────────────────
                '& p': {
                  fontFamily: FONT_SANS,
                  fontSize: '1.0625rem',
                  lineHeight: 1.88,
                  color: T.inkMid,
                  mb: '1.2em',
                  textAlign: 'justify',
                  hyphens: 'auto',
                },
                /* Drop cap on first paragraph */
                '& > p:first-of-type::first-letter': {
                  fontFamily: FONT_DISPLAY,
                  fontStyle: 'italic',
                  float: 'left',
                  fontSize: '4.5em',
                  lineHeight: 0.82,
                  paddingRight: '0.08em',
                  paddingTop: '0.05em',
                  color: T.ink,
                  fontWeight: 400,
                },
                '& h2': {
                  fontFamily: FONT_DISPLAY,
                  fontStyle: 'italic',
                  fontWeight: 400,
                  fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                  color: T.ink,
                  mt: '2em', mb: '0.6em',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.1,
                  borderTop: `1px solid ${T.rule}`,
                  pt: '1.25em',
                },
                '& h3': {
                  fontFamily: FONT_DISPLAY,
                  fontStyle: 'normal',
                  fontWeight: 400,
                  fontSize: 'clamp(1.125rem, 2.5vw, 1.375rem)',
                  color: T.inkMid,
                  mt: '1.75em', mb: '0.5em',
                  letterSpacing: '-0.01em',
                },
                '& ul, & ol': { pl: '1.5em', mb: '1.2em' },
                '& li': { fontFamily: FONT_SANS, fontSize: '1.0625rem', lineHeight: 1.8, color: T.inkMid, mb: '0.35em' },
                '& li::marker': { color: T.blue },
                '& blockquote': {
                  borderLeft: `3px solid ${T.blue}`,
                  pl: 3, py: 0.5, my: '2em',
                  background: `${T.blue}05`,
                  borderRadius: '0 3px 3px 0',
                  '& p': {
                    fontFamily: FONT_DISPLAY,
                    fontStyle: 'italic',
                    fontSize: '1.25rem',
                    lineHeight: 1.55,
                    color: T.inkMid,
                    textAlign: 'left',
                    hyphens: 'none',
                    mb: 0,
                    '&::first-letter': { all: 'unset' },  // no drop cap in blockquote
                  },
                },
                '& code': { fontFamily: FONT_MONO, fontSize: '0.875em', background: T.cream, px: '5px', py: '2px', borderRadius: '2px', color: T.inkMid },
                '& pre': { background: T.ink, p: 3, borderRadius: '3px', overflowX: 'auto', mb: '1.5em', '& code': { background: 'transparent', color: '#E2E8F0', p: 0 } },
                '& strong': { fontWeight: 700, color: T.ink },
                '& a': { color: T.blue, fontWeight: 500, textDecoration: 'none', borderBottom: `1px solid ${T.blueLight}55`, transition: 'all 0.15s', '&:hover': { borderBottomColor: T.blue } },
                '& img': { maxWidth: '100%', borderRadius: '3px', my: '2em', display: 'block', border: `1px solid ${T.rule}` },
                '& table': { width: '100%', borderCollapse: 'collapse', mb: '1.5em', border: `1px solid ${T.rule}` },
                '& th': { background: T.cream, fontFamily: FONT_MONO, fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600, p: '10px 14px', borderBottom: `2px solid ${T.ruleMd}`, color: T.inkMid, textAlign: 'left' },
                '& td': { p: '10px 14px', borderBottom: `1px solid ${T.rule}`, color: T.inkMuted, fontFamily: FONT_SANS, fontSize: '0.9375rem' },
                '& hr': { border: 'none', borderTop: `1px solid ${T.rule}`, my: '2.5em' },
              }}
              dangerouslySetInnerHTML={{ __html: cleanContent }}
            />

            {/* Author card — newspaper colophon style */}
            <Box sx={{
              background: T.white,
              border: `1px solid ${T.rule}`,
              borderRadius: '3px',
              p: { xs: 3, md: 4 },
              mb: 5,
              display: 'flex', gap: 3, alignItems: 'flex-start',
              flexDirection: { xs: 'column', sm: 'row' },
            }}>
              <Box sx={{ width: 60, height: 60, borderRadius: '3px', background: `${T.blue}18`, border: `1px solid ${T.blue}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Typography sx={{ fontFamily: FONT_DISPLAY, fontStyle: 'italic', fontSize: '1.75rem', color: T.blue, fontWeight: 400 }}>
                  {post.author.name.charAt(0)}
                </Typography>
              </Box>
              <Box>
                <Typography sx={{ fontFamily: FONT_MONO, fontSize: '0.52rem', letterSpacing: '0.14em', color: T.inkFaint, textTransform: 'uppercase', mb: 0.5 }}>Written by</Typography>
                <Typography sx={{ fontFamily: FONT_DISPLAY, fontStyle: 'italic', fontSize: '1.25rem', color: T.ink, letterSpacing: '-0.01em', mb: 0.25 }}>{post.author.name}</Typography>
                {post.author.role && (
                  <Typography sx={{ fontFamily: FONT_MONO, fontSize: '0.58rem', letterSpacing: '0.1em', color: T.blue, textTransform: 'uppercase', mb: 1 }}>{post.author.role} · Merraki Solutions</Typography>
                )}
                {post.author.bio && (
                  <Typography sx={{ fontFamily: FONT_SANS, fontSize: '0.9rem', color: T.inkMuted, lineHeight: 1.72 }}>{post.author.bio}</Typography>
                )}
              </Box>
            </Box>
          </motion.div>

          {/* ── Sidebar ── */}
          <Box sx={{ position: { lg: 'sticky' }, top: { lg: 96 } }}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5, ease: EASE }}
            >

              {/* Consultation CTA */}
              <Box sx={{
                background: T.white,
                border: `1px solid ${T.rule}`,
                borderTop: `3px solid ${T.blue}`,
                borderRadius: '3px',
                p: 3, mb: 3,
              }}>
                <Typography sx={{ fontFamily: FONT_MONO, fontSize: '0.52rem', letterSpacing: '0.18em', color: T.blue, textTransform: 'uppercase', mb: 1.5 }}>
                  Free Session
                </Typography>
                <Typography sx={{ fontFamily: FONT_DISPLAY, fontStyle: 'italic', fontSize: '1.375rem', color: T.ink, letterSpacing: '-0.015em', lineHeight: 1.15, mb: 1.25 }}>
                  Apply what you just learned.
                </Typography>
                <Typography sx={{ fontFamily: FONT_SANS, fontSize: '0.875rem', color: T.inkMuted, lineHeight: 1.7, mb: 2.5 }}>
                  Book a free 30-min session with Parag or Khyati and walk away with a personalised action plan.
                </Typography>
                <motion.div whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.985 }}>
                  <Box
                    component="a"
                    href={process.env.NEXT_PUBLIC_CALENDLY_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      py: 1.5, borderRadius: '2px',
                      background: `linear-gradient(115deg, ${T.blueLight}, ${T.blue})`,
                      textDecoration: 'none',
                      transition: 'box-shadow 0.2s',
                      '&:hover': { boxShadow: `0 6px 20px ${T.blueGlow}` },
                    }}
                  >
                    <Typography sx={{ fontFamily: FONT_SANS, fontWeight: 600, fontSize: '0.875rem', color: T.ink, letterSpacing: '-0.01em' }}>
                      Book Free Call
                    </Typography>
                  </Box>
                </motion.div>
              </Box>

              {/* Templates */}
              <Box sx={{ background: T.white, border: `1px solid ${T.rule}`, borderRadius: '3px', p: 3, mb: 3 }}>
                <Typography sx={{ fontFamily: FONT_MONO, fontSize: '0.52rem', letterSpacing: '0.18em', color: T.inkFaint, textTransform: 'uppercase', mb: 1.25 }}>Templates</Typography>
                <Typography sx={{ fontFamily: FONT_DISPLAY, fontStyle: 'italic', fontSize: '1.125rem', color: T.ink, letterSpacing: '-0.01em', lineHeight: 1.2, mb: 1 }}>
                  Professional Excel models
                </Typography>
                <Typography sx={{ fontFamily: FONT_SANS, fontSize: '0.8125rem', color: T.inkMuted, lineHeight: 1.7, mb: 2 }}>
                  Put these insights to work with investor-ready financial models and dashboards.
                </Typography>
                <Box component={Link} href="/templates" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 1.25, borderRadius: '2px', border: `1px solid ${T.rule}`, textDecoration: 'none', transition: 'all 0.15s', '&:hover': { borderColor: T.blue } }}>
                  <Typography sx={{ fontFamily: FONT_SANS, fontWeight: 500, fontSize: '0.8125rem', color: T.inkMuted }}>Browse Templates →</Typography>
                </Box>
              </Box>

              {/* Founder test */}
              <Box sx={{ background: T.cream, border: `1px solid ${T.rule}`, borderRadius: '3px', p: 3 }}>
                <Typography sx={{ fontFamily: FONT_MONO, fontSize: '0.52rem', letterSpacing: '0.18em', color: T.inkFaint, textTransform: 'uppercase', mb: 1.25 }}>Free Assessment</Typography>
                <Typography sx={{ fontFamily: FONT_DISPLAY, fontStyle: 'italic', fontSize: '1.125rem', color: T.ink, letterSpacing: '-0.01em', lineHeight: 1.2, mb: 1 }}>
                  Know your financial type
                </Typography>
                <Typography sx={{ fontFamily: FONT_SANS, fontSize: '0.8125rem', color: T.inkMuted, lineHeight: 1.7, mb: 2 }}>
                  Take our founder test and get a personalised financial personality report.
                </Typography>
                <Box component={Link} href="/founder-test" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 1.25, borderRadius: '2px', background: T.ink, textDecoration: 'none', transition: 'opacity 0.15s', '&:hover': { opacity: 0.85 } }}>
                  <Typography sx={{ fontFamily: FONT_SANS, fontWeight: 600, fontSize: '0.8125rem', color: T.white }}>Take Free Test →</Typography>
                </Box>
              </Box>

            </motion.div>
          </Box>
        </Box>

        {/* ── Related posts ── */}
        {relatedPosts.length > 0 && (
          <Box sx={{ mt: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 5 }}>
              <Box sx={{ height: '2px', flex: 1, background: T.ink }} />
              <Typography sx={{ fontFamily: FONT_MONO, fontSize: '0.56rem', letterSpacing: '0.22em', color: T.inkMid, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                More from the Review
              </Typography>
              <Box sx={{ height: '2px', flex: 1, background: T.ink }} />
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 0 }}>
              {relatedPosts.map((related, i) => (
                <Box key={related.id} sx={{ px: { xs: 0, md: 3.5 }, borderRight: { md: i < relatedPosts.length - 1 ? `1px solid ${T.rule}` : 'none' } }}>
                  <BlogCard post={related} index={i} variant="default" />
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  );
}