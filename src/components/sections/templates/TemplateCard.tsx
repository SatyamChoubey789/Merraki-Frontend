'use client';

import { useState, useRef, useCallback } from 'react';
import { Box, Typography } from '@mui/material';
import { Star as StarIcon, Download as DownloadIcon } from '@mui/icons-material';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useCart } from '@/lib/hooks/useCart';
import { useCurrency } from '@/lib/hooks/useCurrency';
import { TemplateDetailDrawer } from './TemplateDetailDrawer';
import type { Template } from '@/types/template.types';

const T = {
  bg:       '#FFFFFF',
  bgHover:  '#F8FAFF',
  ink:      '#0A0A0F',
  inkMid:   '#1E1E2A',
  inkMuted: '#5A5A72',
  inkFaint: '#9898AE',
  border:   'rgba(10,10,20,0.09)',
  blue:     '#3B7BF6',
  blueLight:'#7AABFF',
  bluePale: '#EDF3FF',
  blueGrad: 'linear-gradient(135deg,#3B7BF6 0%,#7AABFF 100%)',
  imgBg:    '#F0F4FF',
};

const SANS = '"DM Sans","Mona Sans",system-ui,sans-serif';
const MONO = '"DM Mono","JetBrains Mono",ui-monospace,monospace';
const EASE = [0.16, 1, 0.3, 1] as const;

/* Icon set for placeholder visual variety */
const ICONS = ['◈','△','◆','◎','◇','✦','⬡','⬢','○'];

interface Props { template: Template; index?: number; }

export function TemplateCard({ template, index = 0 }: Props) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [hovered,    setHovered]    = useState(false);
  const { addItem, isInCart } = useCart();
  const { format }            = useCurrency();
  const inCart = isInCart(template.id);

  const icon = ICONS[template.id % ICONS.length] ?? '◈';

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.04, duration: 0.45, ease: EASE }}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={()   => setHovered(false)}
        style={{ height: '100%' }}
      >
        <Box sx={{
          display: 'flex', flexDirection: 'column',
          height: '100%', cursor: 'pointer',
        }}>

          {/* ── Image block ── */}
          <Box
            onClick={() => setDrawerOpen(true)}
            sx={{
              position: 'relative',
              height: 220,
              borderRadius: '14px',
              overflow: 'hidden',
              background: T.imgBg,
              border: `1px solid ${T.border}`,
              mb: 1.75,
              flexShrink: 0,
            }}
          >
            {/* Placeholder visual — replace with <img> when real images available */}
            <Box sx={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: `linear-gradient(140deg, #EEF3FF 0%, #E5EEFF 100%)`,
            }}>
              {/* Grid lines decoration */}
              <Box sx={{
                position: 'absolute', inset: 0, opacity: 0.35,
                backgroundImage: `linear-gradient(rgba(59,123,246,0.15) 1px,transparent 1px),
                                  linear-gradient(90deg,rgba(59,123,246,0.15) 1px,transparent 1px)`,
                backgroundSize: '28px 28px',
              }} />
              <Typography sx={{
                fontFamily: MONO, fontSize: '3.5rem',
                color: 'rgba(59,123,246,0.18)', lineHeight: 1,
                position: 'relative', zIndex: 1,
              }}>
                {icon}
              </Typography>
            </Box>

            {/* Hover overlay with quick-view */}
            <motion.div
              animate={{ opacity: hovered ? 1 : 0 }}
              transition={{ duration: 0.2 }}
              style={{
                position: 'absolute', inset: 0,
                background: 'rgba(10,10,20,0.38)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 2,
              }}
            >
              <Box sx={{
                px: '18px', py: '9px', borderRadius: '8px',
                background: 'rgba(255,255,255,0.96)',
                fontFamily: SANS, fontWeight: 700,
                fontSize: '0.78rem', color: T.ink,
                letterSpacing: '-0.01em',
              }}>
                Quick view
              </Box>
            </motion.div>
          </Box>

          {/* ── Text block ── */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>

            {/* Title + price row */}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1, mb: 0.75 }}>
              <Typography
                onClick={() => setDrawerOpen(true)}
                sx={{
                  fontFamily: SANS, fontWeight: 700,
                  fontSize: '0.9375rem', color: T.ink,
                  letterSpacing: '-0.02em', lineHeight: 1.3,
                  flex: 1,
                  '&:hover': { color: T.blue },
                  transition: 'color 0.15s ease',
                }}
              >
                {template.title}
              </Typography>
              <Typography sx={{
                fontFamily: MONO, fontWeight: 700,
                fontSize: '0.9rem', color: T.ink,
                letterSpacing: '-0.02em', flexShrink: 0,
              }}>
                {format(template.price_inr / 100, 'INR')}
              </Typography>
            </Box>

            {/* Description */}
            <Typography sx={{
              fontFamily: SANS, fontSize: '0.8125rem',
              color: T.inkMuted, lineHeight: 1.65, mb: 1.5,
              flex: 1,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}>
              {template.description}
            </Typography>

            {/* Meta row — downloads + add to cart */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <DownloadIcon sx={{ fontSize: 13, color: T.inkFaint }} />
                <Typography sx={{ fontFamily: MONO, fontSize: '0.52rem', letterSpacing: '0.08em', color: T.inkFaint }}>
                  {template.downloads_count} downloads
                </Typography>
              </Box>

              <motion.button
                onClick={() => { if (!inCart) addItem(template); }}
                whileHover={inCart ? {} : { scale: 1.03 }}
                whileTap={inCart ? {} : { scale: 0.97 }}
                style={{
                  padding: '7px 16px',
                  borderRadius: '8px',
                  border: inCart ? `1px solid rgba(59,123,246,0.3)` : 'none',
                  background: inCart ? T.bluePale : T.blueGrad,
                  color: inCart ? T.blue : '#FFFFFF',
                  fontFamily: SANS,
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  cursor: inCart ? 'default' : 'pointer',
                  letterSpacing: '-0.01em',
                  boxShadow: inCart ? 'none' : '0 3px 12px rgba(59,123,246,0.28)',
                  transition: 'box-shadow 0.2s ease',
                }}
              >
                {inCart ? '✓ Added' : 'Add to cart'}
              </motion.button>
            </Box>
          </Box>
        </Box>
      </motion.div>

      <TemplateDetailDrawer
        slug={template.slug}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </>
  );
}