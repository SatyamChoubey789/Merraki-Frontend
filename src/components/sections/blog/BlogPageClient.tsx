'use client';

import { Box, Container, Typography } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useBlogPosts, useBlogSearch, useFeaturedBlogPosts, useBlogCategories } from '@/lib/hooks/useBlogPosts';
import { useSearchFilter } from '@/lib/hooks/useSearchFilter';
import { formatDate } from '@/lib/utils/formatters';
import type { BlogPost } from '@/types/blog.types';

/* ══════════════════════════════════════════════════════
   TOKENS — newsprint warm palette, no dark blues
══════════════════════════════════════════════════════ */
const T = {
  white:     '#FFFFFF',
  offwhite:  '#F8F6F1',
  cream:     '#F0EDE4',
  parchment: '#E8E3D8',
  ink:       '#0A0C0F',
  inkMid:    '#1C2333',
  inkMuted:  '#4A5568',
  inkFaint:  '#8896A8',
  inkGhost:  '#B8C4D0',
  rule:      '#D8D3C8',
  ruleMd:    '#C4BDB0',
  gold:      '#B8922A',
  goldMid:   '#C9A84C',
  goldLight: '#DDB96A',
  goldGlow:  'rgba(184,146,42,0.07)',
};

const FONT_DISPLAY = '"Instrument Serif", "Playfair Display", Georgia, serif';
const FONT_SANS    = '"DM Sans", "Mona Sans", system-ui, sans-serif';
const FONT_MONO    = '"DM Mono", "JetBrains Mono", ui-monospace, monospace';
const EASE         = [0.16, 1, 0.3, 1] as const;

/* ── Helpers ─────────────────────────────────────── */
function categoryLabel(post: BlogPost) {
  return post.category?.name ?? 'Finance';
}

/* ── Column rule divider ─────────────────────────── */
function Rule({ vertical, sx }: { vertical?: boolean; sx?: object }) {
  return (
    <Box sx={{
      [vertical ? 'width' : 'height']: '1px',
      [vertical ? 'height' : 'width']: '100%',
      background: T.rule,
      flexShrink: 0,
      ...sx,
    }} />
  );
}

/* ── Masthead dateline ticker ────────────────────── */
function Dateline() {
  const TODAY = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  return (
    <Box sx={{
      borderBottom: `1px solid ${T.rule}`,
      py: '6px',
      background: T.offwhite,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      px: { xs: 2, md: 4 },
      flexWrap: 'wrap',
      gap: 1,
    }}>
      <Typography sx={{ fontFamily: FONT_MONO, fontSize: '0.52rem', letterSpacing: '0.14em', color: T.inkFaint, textTransform: 'uppercase' }}>
        {TODAY}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {['Financial Intelligence', 'Founder Insights', 'Model Breakdowns', 'Growth Strategies'].map((item, i) => (
          <Box key={item} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {i > 0 && <Box sx={{ width: 1, height: 10, background: T.rule }} />}
            <Typography sx={{ fontFamily: FONT_MONO, fontSize: '0.5rem', letterSpacing: '0.14em', color: T.inkGhost, textTransform: 'uppercase' }}>
              {item}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

/* ── Issue badge ─────────────────────────────────── */
function IssueBadge({ cat }: { cat: string }) {
  return (
    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75, mb: 0.5 }}>
      <Box sx={{ width: 10, height: 10, borderRadius: '50%', background: T.gold, opacity: 0.7 }} />
      <Typography sx={{ fontFamily: FONT_MONO, fontSize: '0.54rem', letterSpacing: '0.18em', color: T.gold, textTransform: 'uppercase' }}>
        {cat}
      </Typography>
    </Box>
  );
}

/* ── LEAD story card (hero, full-width 2-col feel) ─ */
function LeadCard({ post }: { post: BlogPost }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: EASE }}
    >
      <Link href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: 0,
          border: `1px solid ${T.rule}`,
          borderRadius: '4px',
          overflow: 'hidden',
          background: T.white,
          transition: 'box-shadow 0.25s ease',
          '&:hover': { boxShadow: `0 8px 40px rgba(10,12,15,0.08)` },
          '&:hover .lead-title': { color: T.gold },
        }}>
          {/* Left: cover */}
          <Box sx={{
            position: 'relative',
            height: { xs: 220, md: 400 },
            background: T.parchment,
            overflow: 'hidden',
          }}>
            {post.coverImage ? (
              <Box component="img" src={post.coverImage} alt={post.title}
                sx={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease', '&:hover': { transform: 'scale(1.03)' } }} />
            ) : (
              <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography sx={{ fontFamily: FONT_DISPLAY, fontStyle: 'italic', fontSize: '5rem', color: T.rule, lineHeight: 1 }}>M</Typography>
              </Box>
            )}
            {/* Lead badge */}
            <Box sx={{ position: 'absolute', top: 16, left: 16, px: 1.5, py: 0.6, background: T.ink, borderRadius: '2px' }}>
              <Typography sx={{ fontFamily: FONT_MONO, fontSize: '0.5rem', letterSpacing: '0.2em', color: T.white, textTransform: 'uppercase' }}>
                Lead Story
              </Typography>
            </Box>
          </Box>

          {/* Right: content */}
          <Box sx={{ p: { xs: 3, md: 4.5 }, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderLeft: { md: `1px solid ${T.rule}` } }}>
            <Box>
              <IssueBadge cat={categoryLabel(post)} />
              <Typography className="lead-title" sx={{
                fontFamily: FONT_DISPLAY, fontStyle: 'italic', fontWeight: 400,
                fontSize: { xs: '1.875rem', md: '2.5rem', lg: '3rem' },
                color: T.ink, letterSpacing: '-0.025em', lineHeight: 1.1,
                mb: 2, mt: 0.5,
                transition: 'color 0.2s',
              }}>
                {post.title}
              </Typography>
              <Typography sx={{ fontFamily: FONT_SANS, fontSize: '1rem', color: T.inkMuted, lineHeight: 1.75, mb: 3 }}>
                {post.excerpt}
              </Typography>
            </Box>

            {/* Footer meta */}
            <Box sx={{ pt: 2.5, borderTop: `1px solid ${T.rule}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ width: 32, height: 32, borderRadius: '2px', background: `linear-gradient(135deg, ${T.gold}22, ${T.gold}08)`, border: `1px solid ${T.gold}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography sx={{ fontFamily: FONT_DISPLAY, fontStyle: 'italic', fontSize: '1rem', color: T.gold }}>
                    {post.author.name.charAt(0)}
                  </Typography>
                </Box>
                <Box>
                  <Typography sx={{ fontFamily: FONT_SANS, fontWeight: 600, fontSize: '0.8125rem', color: T.ink, lineHeight: 1.1 }}>{post.author.name}</Typography>
                  <Typography sx={{ fontFamily: FONT_MONO, fontSize: '0.52rem', letterSpacing: '0.1em', color: T.inkFaint, textTransform: 'uppercase' }}>{post.author.role}</Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Typography sx={{ fontFamily: FONT_MONO, fontSize: '0.56rem', letterSpacing: '0.1em', color: T.inkFaint, textTransform: 'uppercase' }}>{formatDate(post.publishedAt)}</Typography>
                <Box sx={{ width: 1, height: 12, background: T.rule, alignSelf: 'center' }} />
                <Typography sx={{ fontFamily: FONT_MONO, fontSize: '0.56rem', letterSpacing: '0.1em', color: T.inkFaint, textTransform: 'uppercase' }}>{post.readingTime} min read</Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Link>
    </motion.div>
  );
}

/* ── Secondary article card — newspaper column style ── */
function ArticleCard({ post, index = 0, size = 'md' }: { post: BlogPost; index?: number; size?: 'sm' | 'md' | 'lg' }) {
  const isSm = size === 'sm';
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.45, ease: EASE }}
      whileHover={{ y: -3 }}
      style={{ height: '100%' }}
    >
      <Link href={`/blog/${post.slug}`} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
        <Box sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          borderBottom: `1px solid ${T.rule}`,
          pb: isSm ? 2.5 : 3,
          transition: 'all 0.2s ease',
          '&:hover .art-title': { color: T.gold },
        }}>
          {/* Cover — only for md+ */}
          {!isSm && (
            <Box sx={{ position: 'relative', height: isSm ? 120 : 180, background: T.parchment, overflow: 'hidden', mb: 2, borderRadius: '2px', flexShrink: 0 }}>
              {post.coverImage ? (
                <Box component="img" src={post.coverImage} alt={post.title}
                  sx={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease', '&:hover': { transform: 'scale(1.04)' } }} />
              ) : (
                <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: T.cream }}>
                  <Typography sx={{ fontFamily: FONT_DISPLAY, fontStyle: 'italic', fontSize: '3rem', color: T.rule }}>M</Typography>
                </Box>
              )}
            </Box>
          )}

          <IssueBadge cat={categoryLabel(post)} />

          <Typography className="art-title" sx={{
            fontFamily: FONT_DISPLAY, fontStyle: 'italic', fontWeight: 400,
            fontSize: isSm ? '1rem' : '1.25rem',
            color: T.ink, letterSpacing: '-0.015em', lineHeight: 1.2,
            mb: 1, mt: 0.25,
            overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
            transition: 'color 0.2s',
          }}>
            {post.title}
          </Typography>

          {!isSm && (
            <Typography sx={{ fontFamily: FONT_SANS, fontSize: '0.875rem', color: T.inkMuted, lineHeight: 1.7, mb: 1.5, flex: 1, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
              {post.excerpt}
            </Typography>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 'auto' }}>
            <Typography sx={{ fontFamily: FONT_MONO, fontSize: '0.52rem', letterSpacing: '0.1em', color: T.inkFaint, textTransform: 'uppercase' }}>{post.author.name}</Typography>
            <Box sx={{ width: 1, height: 8, background: T.rule }} />
            <Typography sx={{ fontFamily: FONT_MONO, fontSize: '0.52rem', letterSpacing: '0.1em', color: T.inkFaint, textTransform: 'uppercase' }}>{formatDate(post.publishedAt)}</Typography>
            <Box sx={{ width: 1, height: 8, background: T.rule }} />
            <Typography sx={{ fontFamily: FONT_MONO, fontSize: '0.52rem', letterSpacing: '0.1em', color: T.inkFaint, textTransform: 'uppercase' }}>{post.readingTime} min</Typography>
          </Box>
        </Box>
      </Link>
    </motion.div>
  );
}

/* ── Category pill ───────────────────────────────── */
function CatPill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <Box
      component="button"
      onClick={onClick}
      sx={{
        px: 2, py: 0.75,
        border: `1px solid ${active ? T.gold : T.rule}`,
        borderRadius: '2px',
        background: active ? `linear-gradient(115deg, ${T.goldLight}14, ${T.gold}08)` : 'transparent',
        cursor: 'pointer',
        outline: 'none',
        transition: 'all 0.15s ease',
        '&:hover': { borderColor: T.gold },
      }}
    >
      <Typography sx={{ fontFamily: FONT_MONO, fontSize: '0.56rem', letterSpacing: '0.14em', color: active ? T.gold : T.inkMuted, textTransform: 'uppercase', transition: 'color 0.15s' }}>
        {label}
      </Typography>
    </Box>
  );
}

/* ── Skeleton ────────────────────────────────────── */
function CardSkeleton() {
  return (
    <Box sx={{ pb: 3, borderBottom: `1px solid ${T.rule}` }}>
      <Box sx={{ height: 180, background: T.cream, borderRadius: '2px', mb: 2, animation: 'pulse 1.6s ease-in-out infinite', '@keyframes pulse': { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.5 } } }} />
      <Box sx={{ height: 8, background: T.cream, borderRadius: '2px', width: '40%', mb: 1.5, animation: 'pulse 1.6s ease-in-out infinite' }} />
      <Box sx={{ height: 20, background: T.cream, borderRadius: '2px', mb: 1, animation: 'pulse 1.6s ease-in-out infinite' }} />
      <Box sx={{ height: 20, background: T.cream, borderRadius: '2px', width: '75%', mb: 1.5, animation: 'pulse 1.6s ease-in-out infinite' }} />
      <Box sx={{ height: 14, background: T.cream, borderRadius: '2px', width: '55%', animation: 'pulse 1.6s ease-in-out infinite' }} />
    </Box>
  );
}

/* ══════════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════════ */
export function BlogPageClient() {
  const filter = useSearchFilter({ initialSort: 'newest' });
  const { searchQuery, debouncedQuery, selectedCategory, page, isSearching, handleSearchChange, handleCategoryChange, goToPage } = filter;

  const { data: featuredData, isLoading: featuredLoading } = useFeaturedBlogPosts();
  const { data: categoriesData } = useBlogCategories();
  const { data: listData, isLoading: listLoading } = useBlogPosts({ page, limit: 9, category: selectedCategory || undefined });
  const { data: searchData, isLoading: searchLoading } = useBlogSearch(debouncedQuery, isSearching);

  const featured = featuredData?.data?.[0];
  const categories = categoriesData?.data ?? [];
  const activeData = isSearching ? searchData : listData;
  const posts = activeData?.data ?? [];
  const pagination = !isSearching && listData && 'pagination' in listData ? listData.pagination : null;
  const isLoading = isSearching ? searchLoading : listLoading;

  // Separate lead from rest
  const leadPost = featured ?? posts[0];
  const bodyPosts = leadPost ? posts.filter(p => p.id !== leadPost.id) : posts;
  // Split into columns: col1 = first 3, col2 = next 3, col3 = remaining (shown as compact list)
  const col1 = bodyPosts.slice(0, 3);
  const col2 = bodyPosts.slice(3, 6);
  const col3 = bodyPosts.slice(6, 12);

  return (
    <Box sx={{ minHeight: '100vh', background: T.offwhite, fontFamily: FONT_SANS }}>

      {/* Dateline bar */}
      <Dateline />

      {/* ══ MASTHEAD ══════════════════════════════════ */}
      <Box sx={{ background: T.white, borderBottom: `3px double ${T.rule}`, pt: { xs: 10, md: 14 }, pb: 0, position: 'relative', overflow: 'hidden' }}>
        {/* Warm grid */}
        <Box sx={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: `linear-gradient(${T.rule} 1px, transparent 1px), linear-gradient(90deg, ${T.rule} 1px, transparent 1px)`, backgroundSize: '72px 72px', opacity: 0.3 }} />
        {/* Gold glow */}
        <Box sx={{ position: 'absolute', width: '50vw', height: '30vw', top: '-12vw', left: '25vw', borderRadius: '50%', background: `radial-gradient(ellipse, ${T.goldGlow} 0%, transparent 70%)`, pointerEvents: 'none' }} />

        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>

          {/* Publication name + edition */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE }}>
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 1 }}>
                <Box sx={{ flex: 1, height: '1px', background: T.rule }} />
                <Typography sx={{ fontFamily: FONT_MONO, fontSize: '0.52rem', letterSpacing: '0.24em', color: T.inkFaint, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                  Finance Insights · Est. 2020
                </Typography>
                <Box sx={{ flex: 1, height: '1px', background: T.rule }} />
              </Box>

              {/* Masthead title */}
              <Typography sx={{
                fontFamily: FONT_DISPLAY, fontStyle: 'italic', fontWeight: 400,
                fontSize: { xs: '3rem', sm: '5rem', md: '7rem', lg: '9rem' },
                color: T.ink, lineHeight: 0.9, letterSpacing: '-0.04em',
                mb: 1,
              }}>
                The Merraki
              </Typography>
              <Typography sx={{
                fontFamily: FONT_DISPLAY, fontStyle: 'normal', fontWeight: 400,
                fontSize: { xs: '1.25rem', sm: '1.75rem', md: '2.5rem' },
                color: T.inkMuted, letterSpacing: '0.3em',
                textTransform: 'uppercase', mb: 2,
              }}>
                Financial Review
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 0 }}>
                <Box sx={{ flex: 1, height: '1px', background: T.rule }} />
                <Typography sx={{ fontFamily: FONT_MONO, fontSize: '0.5rem', letterSpacing: '0.18em', color: T.inkGhost, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                  Practical finance strategies · Model breakdowns · Growth insights
                </Typography>
                <Box sx={{ flex: 1, height: '1px', background: T.rule }} />
              </Box>
            </Box>
          </motion.div>

          {/* Search + categories bar */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.2 }}>
            <Box sx={{ borderTop: `1px solid ${T.rule}`, borderBottom: `1px solid ${T.rule}`, py: 1.75, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', justifyContent: 'space-between' }}>
              {/* Category pills */}
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                <CatPill label="All" active={!selectedCategory} onClick={() => handleCategoryChange('')} />
                {categories.map(cat => (
                  <CatPill key={cat.id} label={cat.name} active={selectedCategory === cat.slug} onClick={() => handleCategoryChange(cat.slug)} />
                ))}
              </Box>

              {/* Search */}
              <Box sx={{
                display: 'flex', alignItems: 'center', gap: 1,
                border: `1px solid ${T.rule}`, borderRadius: '2px',
                px: 1.5, py: 0.75, background: T.offwhite,
                transition: 'border-color 0.15s',
                '&:focus-within': { borderColor: T.ruleMd },
              }}>
                <SearchIcon sx={{ fontSize: '0.875rem', color: T.inkFaint }} />
                <Box
                  component="input"
                  value={searchQuery}
                  onChange={e => handleSearchChange(e.target.value)}
                  placeholder="Search articles…"
                  sx={{
                    border: 'none', outline: 'none', background: 'transparent',
                    fontFamily: FONT_SANS, fontSize: '0.8125rem', color: T.ink,
                    width: 180, '&::placeholder': { color: T.inkGhost },
                  }}
                />
              </Box>
            </Box>
          </motion.div>

        </Container>
      </Box>

      {/* ══ BROADSHEET GRID ═══════════════════════════ */}
      <Container maxWidth="xl" sx={{ pt: { xs: 4, md: 6 }, pb: 12 }}>

        {/* Lead story */}
        {leadPost && !isLoading && (
          <Box sx={{ mb: { xs: 4, md: 6 } }}>
            <LeadCard post={leadPost} />
          </Box>
        )}

        {/* Column divider headline */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
          <Box sx={{ height: '2px', flex: 1, background: T.ink }} />
          <Typography sx={{ fontFamily: FONT_MONO, fontSize: '0.54rem', letterSpacing: '0.22em', color: T.inkMid, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
            Latest Dispatches
          </Typography>
          <Box sx={{ height: '2px', flex: 1, background: T.ink }} />
        </Box>

        {/* Three-column newspaper grid */}
        {isLoading ? (
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: '1fr 1fr 1fr' }, gap: 0 }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <Box key={i} sx={{ px: { xs: 0, md: 3 }, borderRight: { md: i < 5 && (i + 1) % 3 !== 0 ? `1px solid ${T.rule}` : 'none' } }}>
                <CardSkeleton />
              </Box>
            ))}
          </Box>
        ) : bodyPosts.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 10 }}>
            <Typography sx={{ fontFamily: FONT_DISPLAY, fontStyle: 'italic', fontSize: '2rem', color: T.inkMuted, mb: 1 }}>No articles found.</Typography>
            <Box component="button" onClick={() => handleSearchChange('')} sx={{ fontFamily: FONT_SANS, fontSize: '0.875rem', color: T.gold, border: `1px solid ${T.gold}`, borderRadius: '2px', px: 2, py: 0.75, cursor: 'pointer', background: 'transparent', mt: 2 }}>
              Clear search
            </Box>
          </Box>
        ) : (
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: '1fr 1fr 1fr' }, gap: 0 }}>
            {bodyPosts.slice(0, 9).map((post, i) => {
              const col = i % 3;
              const isLastInRow = col === 2;
              return (
                <Box
                  key={post.id}
                  sx={{
                    px: { xs: 0, md: 3.5 },
                    py: { xs: 0, md: 0 },
                    borderRight: { md: !isLastInRow ? `1px solid ${T.rule}` : 'none' },
                    mb: 4,
                  }}
                >
                  <ArticleCard post={post} index={i} size="md" />
                </Box>
              );
            })}
          </Box>
        )}

        {/* ── Compact "More Reading" strip ── */}
        {col3.length > 0 && !isLoading && (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, my: 4 }}>
              <Box sx={{ height: '1px', flex: 1, background: T.rule }} />
              <Typography sx={{ fontFamily: FONT_MONO, fontSize: '0.52rem', letterSpacing: '0.22em', color: T.inkFaint, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                More Reading
              </Typography>
              <Box sx={{ height: '1px', flex: 1, background: T.rule }} />
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(3, 1fr)', lg: 'repeat(6, 1fr)' }, gap: 0 }}>
              {col3.map((post, i) => (
                <Box key={post.id} sx={{ px: { xs: 0, md: 2 }, borderRight: i < col3.length - 1 ? `1px solid ${T.rule}` : 'none' }}>
                  <ArticleCard post={post} index={i} size="sm" />
                </Box>
              ))}
            </Box>
          </>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mt: 8, pt: 5, borderTop: `1px solid ${T.rule}` }}>
            {Array.from({ length: pagination.totalPages }).map((_, i) => (
              <Box
                key={i}
                component="button"
                onClick={() => goToPage(i + 1)}
                sx={{
                  width: 36, height: 36,
                  border: `1px solid ${page === i + 1 ? T.gold : T.rule}`,
                  borderRadius: '2px',
                  background: page === i + 1 ? `linear-gradient(115deg, ${T.goldLight}18, ${T.gold}08)` : 'transparent',
                  cursor: 'pointer',
                  fontFamily: FONT_MONO, fontSize: '0.75rem',
                  color: page === i + 1 ? T.gold : T.inkMuted,
                  transition: 'all 0.15s', outline: 'none',
                  '&:hover': { borderColor: T.gold, color: T.gold },
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