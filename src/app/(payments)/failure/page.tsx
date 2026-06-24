'use client';

import { useRef, useCallback } from 'react';
import { Box, Typography, Container } from '@mui/material';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Link from 'next/link';

/* ══ TOKENS — exact FinalCTA theme ══════════════════════ */
const T = {
  bg:        '#FFFFFF',
  bgSection: '#F5F7FB',
  ink:       '#0A0A0F',
  inkMid:    '#3A3A52',
  inkMuted:  '#5A5A72',
  inkFaint:  '#9898AE',
  border:    'rgba(10,10,20,0.08)',
  borderMid: 'rgba(10,10,20,0.14)',
  blue:      '#3B7BF6',
  blueLight: '#7AABFF',
  bluePale:  '#EDF3FF',
  blueGlow:  'rgba(59,123,246,0.18)',
  blueDim:   'rgba(59,123,246,0.06)',
  blueGrad:  'linear-gradient(135deg, #3B7BF6 0%, #7AABFF 100%)',
  blueBdr:   'rgba(59,123,246,0.22)',
  red:       '#DC2626',
  redMid:    '#EF4444',
  redLight:  'rgba(220,38,38,0.08)',
  redBdr:    'rgba(220,38,38,0.2)',
  amber:     '#B45309',
  purple:    '#6D28D9',
  teal:      '#0D7A5F',
};

const SANS = '"DM Sans","Mona Sans",system-ui,sans-serif';
const EASE = [0.16, 1, 0.3, 1] as const;

const REASONS = [
  { icon: '◈', label: 'Insufficient funds',    detail: 'Your account balance may be too low for this transaction.',          accent: T.red    },
  { icon: '△', label: 'Network interruption',  detail: 'A connection dropout occurred mid-payment. No charge was made.',     accent: T.amber  },
  { icon: '◆', label: 'Session timed out',     detail: 'The payment window expired. This is a Razorpay safety feature.',    accent: T.purple },
  { icon: '○', label: 'Card declined by bank', detail: 'Your issuing bank rejected the transaction. Try a different card.', accent: T.teal   },
];

/* Reason card */
function ReasonCard({ reason, index }: { reason: typeof REASONS[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0); const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 280, damping: 26 });
  const sy = useSpring(my, { stiffness: 280, damping: 26 });
  const rotateX = useTransform(sy, [-0.5, 0.5], ['4deg', '-4deg']);
  const rotateY = useTransform(sx, [-0.5, 0.5], ['-4deg', '4deg']);
  const glX = useTransform(sx, [-0.5, 0.5], ['10%', '90%']);
  const glY = useTransform(sy, [-0.5, 0.5], ['10%', '90%']);
  const onMove  = useCallback((e: React.MouseEvent) => {
    const r = ref.current?.getBoundingClientRect(); if (!r) return;
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top)  / r.height - 0.5);
  }, [mx, my]);
  const onLeave = useCallback(() => { mx.set(0); my.set(0); }, [mx, my]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 + index * 0.09, duration: 0.55, ease: EASE }}
      style={{ perspective: 900 }}
    >
      <motion.div ref={ref} style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }} onMouseMove={onMove} onMouseLeave={onLeave}>
        <Box sx={{
          background: T.bg, borderRadius: '14px', border: `1px solid ${T.border}`,
          p: '14px 18px', display: 'flex', alignItems: 'flex-start', gap: 1.75,
          position: 'relative', overflow: 'hidden',
          transition: 'border-color 0.18s, box-shadow 0.18s',
          '&:hover': { borderColor: T.blueBdr, boxShadow: `0 4px 20px ${T.blueDim}` },
        }}>
          <motion.div style={{
            position: 'absolute', inset: 0, borderRadius: '14px', pointerEvents: 'none',
            background: `radial-gradient(circle at ${glX} ${glY}, ${T.blueDim} 0%, transparent 58%)`,
          }} />
          <Box sx={{ position: 'absolute', top: 0, left: 16, right: 16, height: '1.5px', background: `linear-gradient(90deg, transparent, ${reason.accent}55, transparent)` }} />

          <Box sx={{
            width: 34, height: 34, borderRadius: '9px', flexShrink: 0,
            background: `${reason.accent}0e`, border: `1px solid ${reason.accent}25`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1,
          }}>
            <Typography sx={{ fontFamily: SANS, fontSize: '0.75rem', color: reason.accent, lineHeight: 1 }}>{reason.icon}</Typography>
          </Box>

          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Typography sx={{ fontFamily: SANS, fontWeight: 600, fontSize: '0.875rem', color: T.ink, lineHeight: 1.3, mb: 0.4 }}>{reason.label}</Typography>
            <Typography sx={{ fontFamily: SANS, fontSize: '0.8125rem', color: T.inkMuted, lineHeight: 1.55 }}>{reason.detail}</Typography>
          </Box>
        </Box>
      </motion.div>
    </motion.div>
  );
}

/* Action button */
function ActionBtn({ href, variant, icon, label }: { href: string; variant: 'primary' | 'ghost'; icon: string; label: string }) {
  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={{ flex: 1 }}>
      <Box component={Link} href={href} sx={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.25,
        px: 3, py: '13px', borderRadius: '14px', textDecoration: 'none',
        border: variant === 'ghost' ? `1px solid rgba(59,123,246,0.28)` : 'none',
        background: variant === 'primary' ? T.blueGrad : 'transparent',
        boxShadow: variant === 'primary' ? `0 8px 28px ${T.blueGlow}` : 'none',
        minHeight: 50,
        transition: 'all 0.18s',
        '&:hover': {
          boxShadow: variant === 'primary' ? `0 12px 36px ${T.blueGlow}` : 'none',
          background: variant === 'ghost' ? T.bluePale : undefined,
        },
      }}>
        <Typography sx={{ fontFamily: SANS, fontSize: '0.85rem', color: variant === 'primary' ? '#FFFFFF' : T.inkFaint, lineHeight: 1 }}>{icon}</Typography>
        <Typography sx={{ fontFamily: SANS, fontWeight: variant === 'primary' ? 600 : 500, fontSize: '0.9rem', color: variant === 'primary' ? '#FFFFFF' : T.inkMid }}>{label}</Typography>
      </Box>
    </motion.div>
  );
}

export default function FailurePage() {
  return (
    <Box sx={{
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${T.bluePale} 0%, ${T.bgSection} 50%, ${T.bluePale} 100%)`,
      py: { xs: 12, md: 16 },
      position: 'relative', overflow: 'hidden',
    }}>

      {/* Ambient blobs — exact FinalCTA */}
      <Box sx={{ position: 'fixed', width: '60vw', height: '60vw', top: '-20vw', left: '-10vw', borderRadius: '50%', background: `radial-gradient(ellipse, ${T.blueGlow} 0%, transparent 60%)`, pointerEvents: 'none', zIndex: 0 }} />
      <Box sx={{ position: 'fixed', width: '50vw', height: '40vw', top: '-8vw', right: '-10vw', borderRadius: '50%', background: `radial-gradient(ellipse, rgba(220,38,38,0.06) 0%, transparent 65%)`, pointerEvents: 'none', zIndex: 0 }} />

      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>

        {/* X badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 220, damping: 18, delay: 0.05 }}
          style={{ display: 'flex', justifyContent: 'center', marginBottom: 36 }}
        >
          <Box sx={{ position: 'relative' }}>
            <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.18, 0, 0.18] }} transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
              style={{ position: 'absolute', inset: -14, borderRadius: '50%', border: `1.5px solid ${T.red}`, pointerEvents: 'none' }} />
            <Box sx={{
              width: 88, height: 88, borderRadius: '50%', background: T.bg,
              border: `1.5px solid ${T.redBdr}`,
              boxShadow: `0 8px 36px ${T.redLight}, 0 0 0 5px ${T.redLight}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <motion.path d="M8 8L24 24" stroke={T.red} strokeWidth="2.5" strokeLinecap="round"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3, duration: 0.35, ease: EASE }} />
                <motion.path d="M24 8L8 24" stroke={T.red} strokeWidth="2.5" strokeLinecap="round"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.5, duration: 0.35, ease: EASE }} />
              </svg>
            </Box>
          </Box>
        </motion.div>

        {/* Headline */}
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18, duration: 0.55, ease: EASE }}>
          <Box sx={{ textAlign: 'center', mb: 5 }}>
            <Typography sx={{
              fontFamily: SANS, fontWeight: 800,
              fontSize: { xs: '2.25rem', md: '3rem' },
              color: T.ink, letterSpacing: '-0.03em', lineHeight: 1.05, mb: 0.5,
            }}>Something went</Typography>
            <Typography sx={{
              fontFamily: SANS, fontWeight: 300,
              fontSize: { xs: '2.25rem', md: '3rem' },
              letterSpacing: '-0.03em', lineHeight: 1.05, mb: 3,
              background: `linear-gradient(115deg, ${T.redMid}, ${T.red})`,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>wrong.</Typography>

            <Box sx={{
              display: 'inline-flex', alignItems: 'center', gap: 1,
              px: 2, py: '7px', borderRadius: '100px',
              background: T.bg, border: `1px solid ${T.border}`,
              boxShadow: '0 2px 8px rgba(10,10,20,0.05)',
            }}>
              <Box sx={{ width: 6, height: 6, borderRadius: '50%', background: T.teal }} />
              <Typography sx={{ fontFamily: SANS, fontSize: '0.8125rem', color: T.inkMuted }}>
                Cart saved · Zero charge made
              </Typography>
            </Box>
          </Box>
        </motion.div>

        {/* Reasons card */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28, duration: 0.5, ease: EASE }}>
          <Box sx={{
            background: T.bg, borderRadius: '20px',
            border: `1px solid ${T.borderMid}`,
            overflow: 'hidden',
            boxShadow: `0 8px 32px ${T.blueGlow}`,
            mb: 3,
          }}>
            <Box sx={{ px: 3, py: 2.25, background: T.bgSection, borderBottom: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ width: 2, height: 13, borderRadius: '2px', background: `linear-gradient(180deg, ${T.redMid}, ${T.red})` }} />
              <Typography sx={{ fontFamily: SANS, fontWeight: 700, fontSize: '0.875rem', color: T.ink, letterSpacing: '-0.01em' }}>
                Possible Reasons
              </Typography>
            </Box>
            <Box sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {REASONS.map((r, i) => <ReasonCard key={r.label} reason={r} index={i} />)}
            </Box>
          </Box>
        </motion.div>

        {/* CTAs */}
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.72, duration: 0.5, ease: EASE }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <ActionBtn href="/checkout"          variant="primary" icon="↺" label="Try Payment Again" />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <ActionBtn href="/templates"         variant="ghost" icon="◈" label="Back to Cart" />
              <ActionBtn href="/book-consultation" variant="ghost" icon="△" label="Get Support" />
            </Box>
          </Box>
        </motion.div>

        {/* Trust strip */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9, duration: 0.5 }}>
          <Box sx={{ mt: 5, pt: 4, borderTop: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: { xs: 2, sm: 3 }, flexWrap: 'wrap' }}>
            {[
              { icon: '◈', label: 'Razorpay Secured' },
              { icon: '△', label: 'Zero Data Stored'  },
              { icon: '◆', label: 'Instant Refund'    },
            ].map(b => (
              <Box key={b.label} sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <Typography sx={{ fontFamily: SANS, fontSize: '0.65rem', color: T.blue, lineHeight: 1 }}>{b.icon}</Typography>
                <Typography sx={{ fontFamily: SANS, fontSize: '0.7rem', fontWeight: 500, color: T.inkFaint }}>{b.label}</Typography>
              </Box>
            ))}
          </Box>
        </motion.div>

      </Container>
    </Box>
  );
}