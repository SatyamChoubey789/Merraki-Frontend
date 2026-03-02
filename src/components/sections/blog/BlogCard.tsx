"use client";

import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";
import Link from "next/link";
import { formatDate } from "@/lib/utils/formatters";
import type { BlogPost } from "@/types/blog.types";

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

interface BlogCardProps {
  post: BlogPost;
  index?: number;
  variant?: 'default' | 'horizontal' | 'compact';
}

export function BlogCard({ post, index = 0, variant = 'default' }: BlogCardProps) {
  const isHorizontal = variant === 'horizontal';
  const isCompact    = variant === 'compact';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.45, ease: EASE }}
      whileHover={{ y: -4 }}
      style={{ height: '100%' }}
    >
      <Link href={`/blog/${post.slug}`} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
        <Box sx={{
          display: 'flex',
          flexDirection: isHorizontal ? 'row' : 'column',
          height: '100%',
          background: T.white,
          border: `1px solid ${T.rule}`,
          borderRadius: '3px',
          overflow: 'hidden',
          transition: 'box-shadow 0.25s ease, border-color 0.2s ease',
          '&:hover': {
            boxShadow: `0 6px 28px rgba(10,12,15,0.07)`,
            borderColor: T.ruleMd,
            '& .card-title': { color: T.blue },
            '& .card-cover img': { transform: 'scale(1.04)' },
          },
        }}>

          {/* Cover */}
          {!isCompact && (
            <Box className="card-cover" sx={{
              position: 'relative',
              flexShrink: 0,
              height: isHorizontal ? '100%' : 200,
              width: isHorizontal ? 180 : '100%',
              background: T.parchment,
              overflow: 'hidden',
            }}>
              {post.coverImage ? (
                <Box component="img" src={post.coverImage} alt={post.title}
                  sx={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.45s ease' }} />
              ) : (
                <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: T.cream }}>
                  <Typography sx={{ fontFamily: FONT_DISPLAY, fontStyle: 'italic', fontSize: '3.5rem', color: T.rule }}>M</Typography>
                </Box>
              )}

              {/* Category chip */}
              <Box sx={{ position: 'absolute', top: 10, left: 10, px: 1.25, py: 0.5, background: 'rgba(10,12,15,0.72)', backdropFilter: 'blur(6px)' }}>
                <Typography sx={{ fontFamily: FONT_MONO, fontSize: '0.48rem', letterSpacing: '0.18em', color: T.white, textTransform: 'uppercase' }}>
                  {post.category?.name}
                </Typography>
              </Box>

              {post.isFeatured && (
                <Box sx={{ position: 'absolute', top: 10, right: 10, px: 1.25, py: 0.5, background: T.blue }}>
                  <Typography sx={{ fontFamily: FONT_MONO, fontSize: '0.46rem', letterSpacing: '0.18em', color: T.white, textTransform: 'uppercase' }}>Featured</Typography>
                </Box>
              )}
            </Box>
          )}

          {/* Body */}
          <Box sx={{ p: isCompact ? 1.75 : 2.5, flex: 1, display: 'flex', flexDirection: 'column', borderLeft: isHorizontal ? `1px solid ${T.rule}` : 'none' }}>

            {/* Compact: category inline */}
            {isCompact && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.75 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', background: T.blue, opacity: 0.65 }} />
                <Typography sx={{ fontFamily: FONT_MONO, fontSize: '0.5rem', letterSpacing: '0.16em', color: T.blue, textTransform: 'uppercase' }}>
                  {post.category?.name}
                </Typography>
              </Box>
            )}

            {/* Title */}
            <Typography className="card-title" sx={{
              fontFamily: FONT_DISPLAY, fontStyle: 'italic', fontWeight: 400,
              fontSize: isCompact ? '0.9375rem' : isHorizontal ? '1.0625rem' : '1.1875rem',
              color: T.ink, letterSpacing: '-0.01em', lineHeight: 1.2,
              mb: isCompact ? 0.75 : 1.25,
              overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: isCompact ? 2 : 2, WebkitBoxOrient: 'vertical',
              transition: 'color 0.2s',
            }}>
              {post.title}
            </Typography>

            {/* Excerpt — only for default/horizontal */}
            {!isCompact && (
              <Typography sx={{
                fontFamily: FONT_SANS, fontSize: '0.84375rem', color: T.inkMuted, lineHeight: 1.72,
                flex: 1, mb: 2,
                overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: isHorizontal ? 2 : 3, WebkitBoxOrient: 'vertical',
              }}>
                {post.excerpt}
              </Typography>
            )}

            {/* Meta footer */}
            <Box sx={{
              pt: isCompact ? 0.75 : 2,
              borderTop: `1px solid ${T.rule}`,
              display: 'flex', alignItems: 'center', gap: 1.5, mt: 'auto',
              flexWrap: 'wrap',
            }}>
              {!isCompact && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
                  <Box sx={{ width: 24, height: 24, borderRadius: '2px', background: `${T.blue}18`, border: `1px solid ${T.blue}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Typography sx={{ fontFamily: FONT_DISPLAY, fontStyle: 'italic', fontSize: '0.75rem', color: T.blue }}>
                      {post.author.name.charAt(0)}
                    </Typography>
                  </Box>
                  <Typography sx={{ fontFamily: FONT_MONO, fontSize: '0.52rem', letterSpacing: '0.08em', color: T.inkFaint, textTransform: 'uppercase', lineHeight: 1.2 }}>
                    {post.author.name}
                  </Typography>
                </Box>
              )}
              <Typography sx={{ fontFamily: FONT_MONO, fontSize: '0.5rem', letterSpacing: '0.1em', color: T.inkGhost, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                {formatDate(post.publishedAt)} · {post.readingTime} min
              </Typography>
            </Box>
          </Box>
        </Box>
      </Link>
    </motion.div>
  );
}