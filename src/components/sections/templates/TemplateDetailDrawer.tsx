"use client";

import { Box, Typography } from "@mui/material";
import {
  Close as CloseIcon,
  ShoppingCart as CartIcon,
  Star as StarIcon,
  Download as DownloadIcon,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { useTemplate } from "@/lib/hooks/useTemplates";
import { useCart } from "@/lib/hooks/useCart";
import { useCurrency } from "@/lib/hooks/useCurrency";

interface Props { slug: string; open: boolean; onClose: () => void; }

const T = {
  bg:       '#FFFFFF',
  bgSection:'#F5F7FB',
  ink:      '#0A0A0F',
  inkMid:   '#1E1E2A',
  inkMuted: '#5A5A72',
  inkFaint: '#9898AE',
  border:   'rgba(10,10,20,0.09)',
  blue:     '#3B7BF6',
  blueLight:'#7AABFF',
  bluePale: '#EDF3FF',
  blueGrad: 'linear-gradient(135deg,#3B7BF6 0%,#7AABFF 100%)',
  green:    '#16A34A',
  greenPale:'#DCFCE7',
};

const SANS = '"DM Sans","Mona Sans",system-ui,sans-serif';
const MONO = '"DM Mono","JetBrains Mono",ui-monospace,monospace';
const EASE = [0.16, 1, 0.3, 1] as const;

const ICONS = ['◈','△','◆','◎','◇','✦','⬡','⬢','○'];

export function TemplateDetailDrawer({ slug, open, onClose }: Props) {
  const { data, isLoading } = useTemplate(slug);
  const { addItem, isInCart } = useCart();
  const { format }            = useCurrency();

  const template = data?.data;
  const inCart   = template ? isInCart(template.id) : false;
  const icon     = template ? ICONS[template.id % ICONS.length] ?? '◈' : '◈';

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(10,10,20,0.36)',
              backdropFilter: 'blur(3px)',
              zIndex: 1200,
            }}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 380, damping: 38 }}
            style={{
              position: 'fixed', right: 0, top: 0, bottom: 0,
              width: 'min(580px, 100vw)',
              background: T.bg,
              zIndex: 1300,
              display: 'flex', flexDirection: 'column',
              borderLeft: `1px solid ${T.border}`,
              boxShadow: '-12px 0 48px rgba(10,10,20,0.10)',
            }}
          >
            {/* Header */}
            <Box sx={{
              px: 3.5, py: 2.5,
              borderBottom: `1px solid ${T.border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              flexShrink: 0,
            }}>
              <Typography sx={{
                fontFamily: MONO, fontWeight: 600, fontSize: '0.6rem',
                letterSpacing: '0.18em', textTransform: 'uppercase',
                color: T.blue,
              }}>
                Template Preview
              </Typography>
              <motion.div whileHover={{ rotate: 90 }} transition={{ duration: 0.2 }}>
                <CloseIcon
                  onClick={onClose}
                  sx={{
                    cursor: 'pointer', fontSize: '1.1rem',
                    color: T.inkFaint,
                    '&:hover': { color: T.ink },
                    transition: 'color 0.15s',
                  }}
                />
              </motion.div>
            </Box>

            {isLoading || !template ? (
              <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Box sx={{
                  width: 32, height: 32, borderRadius: '50%',
                  border: `2.5px solid ${T.bluePale}`,
                  borderTopColor: T.blue,
                  animation: 'spin 0.7s linear infinite',
                  '@keyframes spin': { to: { transform: 'rotate(360deg)' } },
                }} />
              </Box>
            ) : (
              <Box sx={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' } }}>

                {/* Image */}
                <Box sx={{
                  height: 240, mx: 3.5, mt: 3.5, borderRadius: '12px',
                  overflow: 'hidden',
                  background: 'linear-gradient(140deg,#EEF3FF 0%,#E5EEFF 100%)',
                  border: `1px solid ${T.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  position: 'relative',
                }}>
                  <Box sx={{
                    position: 'absolute', inset: 0, opacity: 0.3,
                    backgroundImage: `linear-gradient(rgba(59,123,246,0.12) 1px,transparent 1px),
                                      linear-gradient(90deg,rgba(59,123,246,0.12) 1px,transparent 1px)`,
                    backgroundSize: '28px 28px',
                  }} />
                  <Typography sx={{ fontFamily: MONO, fontSize: '4rem', color: 'rgba(59,123,246,0.16)', lineHeight: 1, position: 'relative', zIndex: 1 }}>
                    {icon}
                  </Typography>
                </Box>

                <Box sx={{ px: 3.5, pt: 3, pb: 4 }}>

                  {/* Title */}
                  <Typography sx={{
                    fontFamily: SANS, fontWeight: 800,
                    fontSize: '1.375rem', color: T.ink,
                    letterSpacing: '-0.03em', lineHeight: 1.2, mb: 1.25,
                  }}>
                    {template.title}
                  </Typography>

                  {/* Description */}
                  <Typography sx={{
                    fontFamily: SANS, fontSize: '0.9rem',
                    color: T.inkMuted, lineHeight: 1.75, mb: 3,
                  }}>
                    {template.description}
                  </Typography>

                  {/* Stats row */}
                  <Box sx={{
                    display: 'flex', gap: 0,
                    mb: 3, borderTop: `1px solid ${T.border}`,
                    borderBottom: `1px solid ${T.border}`,
                    py: 2,
                  }}>
                    {/* Rating */}
                    <Box sx={{ flex: 1, textAlign: 'center', borderRight: `1px solid ${T.border}` }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.4, mb: 0.4 }}>
                        {Array.from({ length: 5 }).map((_, i) => (
                          <StarIcon key={i} sx={{ fontSize: 11, color: i < Math.round(template.rating) ? T.blue : T.border }} />
                        ))}
                      </Box>
                      <Typography sx={{ fontFamily: MONO, fontSize: '0.52rem', letterSpacing: '0.1em', color: T.inkFaint, textTransform: 'uppercase' }}>
                        {template.rating.toFixed(1)} ({template.rating_count} reviews)
                      </Typography>
                    </Box>
                    {/* Downloads */}
                    <Box sx={{ flex: 1, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 0.4 }}>
                      <Typography sx={{ fontFamily: SANS, fontWeight: 700, fontSize: '1rem', color: T.ink, letterSpacing: '-0.02em' }}>
                        {template.downloads_count}
                      </Typography>
                      <Typography sx={{ fontFamily: MONO, fontSize: '0.52rem', letterSpacing: '0.1em', color: T.inkFaint, textTransform: 'uppercase' }}>
                        Downloads
                      </Typography>
                    </Box>
                  </Box>

                  {/* Price + CTA */}
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
                    <Typography sx={{
                      fontFamily: SANS, fontWeight: 800,
                      fontSize: '1.75rem', color: T.ink,
                      letterSpacing: '-0.04em',
                    }}>
                      {format(template.price_inr / 100, 'INR')}
                    </Typography>
                  </Box>

                  <motion.button
                    onClick={() => { if (!inCart) { addItem(template); onClose(); } }}
                    whileHover={inCart ? {} : { y: -2, boxShadow: '0 10px 32px rgba(59,123,246,0.36)' }}
                    whileTap={inCart ? {} : { scale: 0.98 }}
                    style={{
                      width: '100%',
                      padding: '15px',
                      borderRadius: '11px',
                      border: inCart ? `1px solid ${T.green}` : 'none',
                      background: inCart ? T.greenPale : T.blueGrad,
                      color: inCart ? T.green : '#FFFFFF',
                      fontFamily: SANS,
                      fontWeight: 700,
                      fontSize: '0.9375rem',
                      cursor: inCart ? 'default' : 'pointer',
                      letterSpacing: '-0.01em',
                      boxShadow: inCart ? 'none' : '0 4px 18px rgba(59,123,246,0.28)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                      transition: 'box-shadow 0.2s ease',
                    }}
                  >
                    <CartIcon sx={{ fontSize: 18 }} />
                    {inCart ? '✓ Added to Cart' : 'Add to Cart'}
                  </motion.button>
                </Box>
              </Box>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}