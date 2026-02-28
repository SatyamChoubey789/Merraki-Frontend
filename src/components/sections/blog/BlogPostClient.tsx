'use client';

import {
  Box,
  Container,
  Typography,
  Grid,
  Chip,
  Button,
  Divider,
  Skeleton,
  Alert,
} from '@mui/material';
import {
  AccessTime as TimeIcon,
  ArrowBack as BackIcon,
  Share as ShareIcon,
  CalendarToday as CalIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { colorTokens, shadowTokens } from '@/theme';
import { useBlogPost, useBlogPosts } from '@/lib/hooks/useBlogPosts';
import { formatDate, formatReadingTime } from '@/lib/utils/formatters';
import { BlogCard } from './BlogCard';
import { GlassCard } from '@/components/ui';

interface BlogPostClientProps {
  slug: string;
}

export function BlogPostClient({ slug }: BlogPostClientProps) {
  const { data, isLoading, isError } = useBlogPost(slug);
  const { data: relatedData } = useBlogPosts({ limit: 3 });
  const post = data?.data;
  const relatedPosts = relatedData?.data?.filter((p) => p.slug !== slug).slice(0, 3) ?? [];

  if (isLoading) {
    return (
      <Box sx={{ pt: { xs: 8, md: 12 }, pb: 12 }}>
        <Container maxWidth="lg">
          <Skeleton variant="rectangular" height={480} sx={{ borderRadius: '20px', mb: 5 }} />
          <Skeleton variant="text" height={60} width="80%" sx={{ mb: 2 }} />
          <Skeleton variant="text" height={24} width="40%" sx={{ mb: 5 }} />
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} variant="text" height={22} sx={{ mb: 1, width: `${85 + Math.random() * 15}%` }} />
          ))}
        </Container>
      </Box>
    );
  }

  if (isError || !post) {
    return (
      <Container maxWidth="md" sx={{ pt: 10, pb: 12 }}>
        <Alert severity="error" sx={{ borderRadius: '14px', mb: 3 }}>
          Article not found. It may have been moved or deleted.
        </Alert>
        <Button
          component={Link}
          href="/blog"
          variant="contained"
          startIcon={<BackIcon />}
          sx={{
            background: `linear-gradient(135deg, ${colorTokens.financeBlue[500]}, ${colorTokens.financeBlue[700]})`,
            borderRadius: '12px',
          }}
        >
          Back to Blog
        </Button>
      </Container>
    );
  }

  return (
    <Box>
      {/* Hero image */}
      <Box
        sx={{
          position: 'relative',
          height: { xs: 280, md: 480 },
          backgroundColor: colorTokens.financeBlue[50],
          overflow: 'hidden',
        }}
      >
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            priority
            style={{ objectFit: 'cover' }}
          />
        ) : (
          <Box
            sx={{
              width: '100%',
              height: '100%',
              background: `linear-gradient(135deg, ${colorTokens.darkNavy[900]} 0%, #0C1F5C 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '5rem',
            }}
          >
            📝
          </Box>
        )}

        {/* Dark gradient overlay */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, rgba(10,15,30,0.15) 0%, rgba(10,15,30,0.6) 100%)',
          }}
        />

        {/* Back button */}
        <Box sx={{ position: 'absolute', top: 20, left: 20, zIndex: 10 }}>
          <Button
            component={Link}
            href="/blog"
            startIcon={<BackIcon />}
            sx={{
              backgroundColor: 'rgba(255,255,255,0.12)',
              backdropFilter: 'blur(12px)',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.18)',
              borderRadius: '10px',
              fontWeight: 600,
              fontSize: '0.8125rem',
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' },
            }}
          >
            Back to Blog
          </Button>
        </Box>
      </Box>

      <Container maxWidth="lg" sx={{ mt: { xs: -4, md: -8 }, position: 'relative', zIndex: 1 }}>
        <Grid container spacing={5}>
          {/* Main content */}
          <Grid size={{ xs: 12, lg: 8 }}>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Article card */}
              <Box
                sx={{
                  backgroundColor: colorTokens.white,
                  borderRadius: '24px',
                  p: { xs: 3, md: 5 },
                  boxShadow: shadowTokens.xl,
                  border: `1px solid ${colorTokens.slate[100]}`,
                  mb: 4,
                }}
              >
                {/* Category + tags */}
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
                  <Chip
                    label={post.category.name}
                    size="small"
                    sx={{
                      backgroundColor: colorTokens.financeBlue[50],
                      color: colorTokens.financeBlue[700],
                      fontWeight: 700,
                      borderRadius: '8px',
                      fontSize: '0.75rem',
                    }}
                  />
                  {post.tags?.slice(0, 3).map((tag) => (
                    <Chip
                      key={tag}
                      label={`#${tag}`}
                      size="small"
                      variant="outlined"
                      sx={{
                        borderRadius: '8px',
                        fontSize: '0.75rem',
                        color: colorTokens.slate[500],
                      }}
                    />
                  ))}
                </Box>

                {/* Title */}
                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 800,
                    color: colorTokens.darkNavy[900],
                    mb: 2.5,
                    letterSpacing: '-0.025em',
                    lineHeight: 1.2,
                  }}
                >
                  {post.title}
                </Typography>

                {/* Meta row */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    flexWrap: 'wrap',
                    mb: 3,
                  }}
                >
                  {/* Author */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: '10px',
                        background: `linear-gradient(135deg, ${colorTokens.financeBlue[500]}, ${colorTokens.financeBlue[700]})`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Typography
                        sx={{
                          color: '#fff',
                          fontWeight: 800,
                          fontSize: '0.875rem',
                          fontFamily: 'var(--font-display)',
                        }}
                      >
                        {post.author.name.charAt(0)}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 700, color: colorTokens.darkNavy[800], lineHeight: 1.1 }}
                      >
                        {post.author.name}
                      </Typography>
                      {post.author.role && (
                        <Typography
                          variant="caption"
                          sx={{ color: colorTokens.slate[500], lineHeight: 1 }}
                        >
                          {post.author.role}
                        </Typography>
                      )}
                    </Box>
                  </Box>

                  <Box sx={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: colorTokens.slate[200] }} />

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <CalIcon sx={{ fontSize: '0.875rem', color: colorTokens.slate[400] }} />
                    <Typography variant="caption" sx={{ color: colorTokens.slate[500], fontWeight: 500 }}>
                      {formatDate(post.publishedAt)}
                    </Typography>
                  </Box>

                  <Box sx={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: colorTokens.slate[200] }} />

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <TimeIcon sx={{ fontSize: '0.875rem', color: colorTokens.slate[400] }} />
                    <Typography variant="caption" sx={{ color: colorTokens.slate[500], fontWeight: 500 }}>
                      {formatReadingTime(post.readingTime)}
                    </Typography>
                  </Box>

                  <Box sx={{ ml: 'auto' }}>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<ShareIcon sx={{ fontSize: '0.875rem !important' }} />}
                      onClick={() => navigator.clipboard?.writeText(window.location.href)}
                      sx={{
                        borderRadius: '8px',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        py: 0.625,
                        borderWidth: '1.5px',
                      }}
                    >
                      Share
                    </Button>
                  </Box>
                </Box>

                <Divider sx={{ mb: 4 }} />

                {/* Article body */}
                <Box
                  sx={{
                    '& p': {
                      fontSize: '1.0625rem',
                      lineHeight: 1.85,
                      color: colorTokens.slate[700],
                      mb: 2.5,
                    },
                    '& h2': {
                      fontFamily: 'var(--font-display)',
                      fontWeight: 800,
                      fontSize: 'clamp(1.375rem, 3vw, 1.75rem)',
                      color: colorTokens.darkNavy[900],
                      mt: 4,
                      mb: 1.5,
                      letterSpacing: '-0.02em',
                    },
                    '& h3': {
                      fontFamily: 'var(--font-display)',
                      fontWeight: 700,
                      fontSize: 'clamp(1.125rem, 2.5vw, 1.375rem)',
                      color: colorTokens.darkNavy[800],
                      mt: 3.5,
                      mb: 1.25,
                    },
                    '& ul, & ol': {
                      pl: 3,
                      mb: 2.5,
                    },
                    '& li': {
                      fontSize: '1.0625rem',
                      lineHeight: 1.8,
                      color: colorTokens.slate[700],
                      mb: 0.75,
                    },
                    '& blockquote': {
                      borderLeft: `4px solid ${colorTokens.financeBlue[400]}`,
                      pl: 3,
                      py: 1,
                      my: 3,
                      backgroundColor: colorTokens.financeBlue[50],
                      borderRadius: '0 12px 12px 0',
                      '& p': {
                        color: colorTokens.financeBlue[800],
                        fontWeight: 500,
                        fontStyle: 'italic',
                        mb: 0,
                      },
                    },
                    '& code': {
                      fontFamily: 'monospace',
                      fontSize: '0.9em',
                      backgroundColor: colorTokens.slate[100],
                      px: '6px',
                      py: '2px',
                      borderRadius: '4px',
                      color: colorTokens.financeBlue[700],
                    },
                    '& pre': {
                      backgroundColor: colorTokens.darkNavy[900],
                      p: 3,
                      borderRadius: '12px',
                      overflowX: 'auto',
                      mb: 2.5,
                      '& code': {
                        backgroundColor: 'transparent',
                        color: '#E2E8F0',
                        fontSize: '0.9rem',
                        p: 0,
                      },
                    },
                    '& strong': {
                      fontWeight: 700,
                      color: colorTokens.darkNavy[800],
                    },
                    '& a': {
                      color: colorTokens.financeBlue[600],
                      fontWeight: 600,
                      textDecoration: 'none',
                      borderBottom: `1px solid ${colorTokens.financeBlue[200]}`,
                      transition: 'all 0.2s',
                      '&:hover': {
                        borderBottomColor: colorTokens.financeBlue[500],
                        color: colorTokens.financeBlue[700],
                      },
                    },
                    '& img': {
                      maxWidth: '100%',
                      borderRadius: '12px',
                      my: 3,
                    },
                    '& table': {
                      width: '100%',
                      borderCollapse: 'collapse',
                      mb: 3,
                      fontSize: '0.9375rem',
                    },
                    '& th': {
                      backgroundColor: colorTokens.slate[50],
                      fontWeight: 700,
                      p: '10px 14px',
                      borderBottom: `2px solid ${colorTokens.slate[200]}`,
                      textAlign: 'left',
                      color: colorTokens.slate[700],
                    },
                    '& td': {
                      p: '10px 14px',
                      borderBottom: `1px solid ${colorTokens.slate[100]}`,
                      color: colorTokens.slate[600],
                    },
                    '& tr:hover td': {
                      backgroundColor: colorTokens.slate[50],
                    },
                  }}
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              </Box>

              {/* Author bio card */}
              <Box
                sx={{
                  backgroundColor: colorTokens.white,
                  borderRadius: '20px',
                  p: { xs: 3, md: 4 },
                  border: `1px solid ${colorTokens.slate[100]}`,
                  boxShadow: shadowTokens.md,
                  mb: 5,
                  display: 'flex',
                  gap: 3,
                  alignItems: 'flex-start',
                  flexDirection: { xs: 'column', sm: 'row' },
                }}
              >
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: '16px',
                    background: `linear-gradient(135deg, ${colorTokens.financeBlue[500]}, ${colorTokens.financeBlue[700]})`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    boxShadow: '0 6px 20px rgba(26,86,219,0.3)',
                  }}
                >
                  <Typography
                    sx={{
                      color: '#fff',
                      fontFamily: 'var(--font-display)',
                      fontWeight: 800,
                      fontSize: '1.5rem',
                    }}
                  >
                    {post.author.name.charAt(0)}
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    variant="overline"
                    sx={{
                      color: colorTokens.slate[400],
                      letterSpacing: '0.1em',
                      display: 'block',
                      mb: 0.5,
                    }}
                  >
                    Written by
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 800,
                      color: colorTokens.darkNavy[900],
                      mb: 0.5,
                    }}
                  >
                    {post.author.name}
                  </Typography>
                  {post.author.role && (
                    <Typography
                      variant="body2"
                      sx={{
                        color: colorTokens.financeBlue[600],
                        fontWeight: 600,
                        mb: 1,
                      }}
                    >
                      {post.author.role} at Merraki Solutions
                    </Typography>
                  )}
                  {post.author.bio && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ lineHeight: 1.7 }}
                    >
                      {post.author.bio}
                    </Typography>
                  )}
                </Box>
              </Box>
            </motion.div>
          </Grid>

          {/* Sidebar */}
          <Grid size={{ xs: 12, lg: 4 }}>
            <Box sx={{ position: { lg: 'sticky' }, top: { lg: 100 } }}>
              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <Box
                  sx={{
                    background: `linear-gradient(135deg, ${colorTokens.darkNavy[900]}, #0C1F5C)`,
                    borderRadius: '20px',
                    p: 3.5,
                    mb: 3,
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      background: `radial-gradient(ellipse at 80% 20%, rgba(26,86,219,0.2) 0%, transparent 60%)`,
                      pointerEvents: 'none',
                    }}
                  />
                  <Box sx={{ position: 'relative', zIndex: 1 }}>
                    <Typography sx={{ fontSize: '2rem', mb: 1.5 }}>🎯</Typography>
                    <Typography
                      variant="h6"
                      sx={{ color: '#fff', fontWeight: 800, mb: 1, letterSpacing: '-0.015em' }}
                    >
                      Free Consultation
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, mb: 3 }}
                    >
                      Apply what you learned with expert guidance. Book a free 30-min
                      strategy session with Parag or Khyati.
                    </Typography>
                    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                      <Button
                        component="a"
                        href={process.env.NEXT_PUBLIC_CALENDLY_URL}
                        target="_blank"
                        variant="contained"
                        fullWidth
                        sx={{
                          background: `linear-gradient(135deg, ${colorTokens.financeBlue[400]}, ${colorTokens.financeBlue[600]})`,
                          borderRadius: '12px',
                          py: 1.5,
                          fontWeight: 700,
                          boxShadow: '0 4px 16px rgba(26,86,219,0.4)',
                        }}
                      >
                        Book Free Call
                      </Button>
                    </motion.div>
                  </Box>
                </Box>

                {/* Templates CTA */}
                <Box
                  sx={{
                    backgroundColor: colorTokens.white,
                    borderRadius: '20px',
                    p: 3,
                    border: `1px solid ${colorTokens.slate[100]}`,
                    boxShadow: shadowTokens.md,
                    mb: 3,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, color: colorTokens.darkNavy[900], mb: 1, fontSize: '1rem' }}
                  >
                    📊 Explore Templates
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ lineHeight: 1.7, mb: 2.5, fontSize: '0.875rem' }}
                  >
                    Put these insights to work with professional Excel models and dashboards.
                  </Typography>
                  <Button
                    component={Link}
                    href="/templates"
                    variant="outlined"
                    fullWidth
                    size="small"
                    sx={{
                      borderRadius: '10px',
                      fontWeight: 600,
                      borderWidth: '1.5px',
                    }}
                  >
                    Browse Templates
                  </Button>
                </Box>

                {/* Founder Test */}
                <Box
                  sx={{
                    backgroundColor: colorTokens.financeBlue[50],
                    borderRadius: '20px',
                    p: 3,
                    border: `1px solid ${colorTokens.financeBlue[100]}`,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      color: colorTokens.financeBlue[800],
                      mb: 1,
                      fontSize: '1rem',
                    }}
                  >
                    🧠 Know Your Financial Type
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: colorTokens.financeBlue[700],
                      lineHeight: 1.7,
                      mb: 2.5,
                      fontSize: '0.875rem',
                    }}
                  >
                    Take our free founder test and get a personalised financial personality report.
                  </Typography>
                  <Button
                    component={Link}
                    href="/founder-test"
                    variant="contained"
                    fullWidth
                    size="small"
                    sx={{
                      borderRadius: '10px',
                      fontWeight: 600,
                      background: `linear-gradient(135deg, ${colorTokens.financeBlue[500]}, ${colorTokens.financeBlue[700]})`,
                    }}
                  >
                    Take Free Test
                  </Button>
                </Box>
              </motion.div>
            </Box>
          </Grid>
        </Grid>

        {/* Related posts */}
        {relatedPosts.length > 0 && (
          <Box sx={{ mt: 6, mb: 8 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                color: colorTokens.darkNavy[900],
                mb: 4,
                letterSpacing: '-0.02em',
              }}
            >
              More from the Blog
            </Typography>
            <Grid container spacing={3}>
              {relatedPosts.map((related, i) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={related.id}>
                  <BlogCard post={related} index={i} />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Container>
    </Box>
  );
}