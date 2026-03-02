'use client';

import { useState, useRef, useCallback } from 'react';
import { Box, Typography } from '@mui/material';
import {
  Download as DownloadIcon,
  ShoppingCart as CartIcon,
  Visibility as ViewIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion';
import { useCart } from '@/lib/hooks/useCart';
import { useCurrency } from '@/lib/hooks/useCurrency';
import { TemplateDetailDrawer } from './TemplateDetailDrawer';
import type { Template } from '@/types/template.types';

/* ══ TOKENS ══════════════════════════════════════════════ */
const T = {
  white: '#FFFFFF',
  cream: '#F0EDE6',
  parchment: '#E8E4DA',
  ink: '#0C0E12',
  inkMuted: '#64748B',
  inkFaint: '#94A3B8',
  inkGhost: '#CBD5E1',
  border: '#E2DED5',
  gold: '#B8922A',
  goldMid: '#C9A84C',
  goldLight: '#DDB96A',
  goldGlow: 'rgba(184,146,42,0.13)',
};

const SERIF = '"Instrument Serif","Playfair Display",Georgia,serif';
const SANS = '"DM Sans","Mona Sans",system-ui,sans-serif';
const MONO = '"DM Mono","JetBrains Mono",ui-monospace,monospace';
const EASE = [0.16, 1, 0.3, 1] as const;

interface Props {
  template: Template;
  index?: number;
}

export function TemplateCard({ template, index = 0 }: Props) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { addItem, isInCart } = useCart();
  const { format } = useCurrency();
  const inCart = isInCart(template.id);
  const cardRef = useRef<HTMLDivElement>(null);

  /* ── 3D tilt ── */
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 320, damping: 28 });
  const sy = useSpring(my, { stiffness: 320, damping: 28 });
  const rotateX = useTransform(sy, [-0.5, 0.5], ['7deg', '-7deg']);
  const rotateY = useTransform(sx, [-0.5, 0.5], ['-7deg', '7deg']);
  const glowX = useTransform(sx, [-0.5, 0.5], ['0%', '100%']);
  const glowY = useTransform(sy, [-0.5, 0.5], ['0%', '100%']);

  const onMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const r = cardRef.current?.getBoundingClientRect();
      if (!r) return;
      mx.set((e.clientX - r.left) / r.width - 0.5);
      my.set((e.clientY - r.top) / r.height - 0.5);
    },
    [mx, my]
  );

  const onLeave = useCallback(() => {
    mx.set(0);
    my.set(0);
  }, [mx, my]);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05, duration: 0.5, ease: EASE }}
        style={{ perspective: 1100, height: '100%' }}
      >
        <motion.div
          ref={cardRef}
          style={{
            rotateX,
            rotateY,
            transformStyle: 'preserve-3d',
            height: '100%',
          }}
          onMouseMove={onMove}
          onMouseLeave={onLeave}
        >
          <Box
            sx={{
              position: 'relative',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              background: T.white,
              borderRadius: '18px',
              border: `1px solid ${T.border}`,
              overflow: 'hidden',
              boxShadow: '0 2px 12px rgba(12,14,18,0.05)',
            }}
          >
            {/* Glow */}
            <motion.div
              style={{
                position: 'absolute',
                inset: 0,
                zIndex: 1,
                pointerEvents: 'none',
                borderRadius: '18px',
                background: `radial-gradient(circle at ${glowX} ${glowY}, ${T.goldGlow} 0%, transparent 60%)`,
              }}
            />

            {/* Image Placeholder */}
            <Box
              sx={{
                height: 200,
                background: T.parchment,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
              onClick={() => setDrawerOpen(true)}
            >
              <Typography
                sx={{
                  fontFamily: SERIF,
                  fontSize: '3rem',
                  color: 'rgba(12,14,18,0.1)',
                }}
              >
                ₹
              </Typography>
            </Box>

            {/* Body */}
            <Box sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
              
              {/* Category ID */}
              <Typography
                sx={{
                  fontFamily: MONO,
                  fontSize: '0.6rem',
                  color: T.inkFaint,
                  textTransform: 'uppercase',
                  mb: 1,
                }}
              >
                Category #{template.category_id}
              </Typography>

              {/* Title */}
              <Typography
                onClick={() => setDrawerOpen(true)}
                sx={{
                  fontFamily: SERIF,
                  fontSize: '1.2rem',
                  mb: 1,
                  cursor: 'pointer',
                }}
              >
                {template.title}
              </Typography>

              {/* Description */}
              <Typography
                sx={{
                  fontFamily: SANS,
                  fontSize: '0.9rem',
                  color: T.inkMuted,
                  mb: 2,
                  flex: 1,
                }}
              >
                {template.description}
              </Typography>

              {/* Rating + Downloads */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  mb: 2,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <StarIcon sx={{ fontSize: 16, color: T.goldMid }} />
                  <Typography sx={{ fontSize: '0.8rem' }}>
                    {template.rating.toFixed(1)} ({template.rating_count})
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <DownloadIcon sx={{ fontSize: 16, color: T.inkGhost }} />
                  <Typography sx={{ fontSize: '0.8rem' }}>
                    {template.downloads_count}
                  </Typography>
                </Box>
              </Box>

              {/* Price + CTA */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Typography
                  sx={{
                    fontFamily: SERIF,
                    fontSize: '1.4rem',
                  }}
                >
                  {format(template.price_inr / 100, 'INR')}
                </Typography>

                <Box
                  component="button"
                  onClick={() => {
                    if (!inCart) addItem(template);
                  }}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    px: 2,
                    py: 1,
                    borderRadius: '8px',
                    border: 'none',
                    background: T.gold,
                    cursor: inCart ? 'default' : 'pointer',
                  }}
                >
                  <CartIcon sx={{ fontSize: 18 }} />
                  <Typography sx={{ fontSize: '0.8rem' }}>
                    {inCart ? 'In Cart ✓' : 'Add to Cart'}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </motion.div>
      </motion.div>

      <TemplateDetailDrawer
        slug={template.slug}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </>
  );
}