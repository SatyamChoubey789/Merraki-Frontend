'use client';

import { useRef, useCallback } from 'react';
import { Box, Typography, Container } from '@mui/material';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Link from 'next/link';

/* ══ TOKENS ══════════════════════════════════════════════ */
const T = {
  white:    '#FFFFFF',
  offwhite: '#F9F8F5',
  bg:       '#F5F4F1',
  ink:      '#0C0E12',
  inkMid:   '#2E3440',
  inkMuted: '#64748B',
  inkFaint: '#94A3B8',
  inkGhost: '#CBD5E1',
  border:   '#E8E5DF',
  borderMd: '#C8C3B8',
  gold:     '#B8922A',
  goldMid:  '#C9A84C',
  goldLight:'#DDB96A',
  goldGlow: 'rgba(184,146,42,0.09)',
  red:      '#DC2626',
  redMid:   '#EF4444',
  redLight: 'rgba(220,38,38,0.07)',
  redBdr:   'rgba(220,38,38,0.18)',
  redGlow:  'rgba(220,38,38,0.08)',
};
const SERIF = '"Instrument Serif","Playfair Display",Georgia,serif';
const SANS  = '"DM Sans","Mona Sans",system-ui,sans-serif';
const MONO  = '"DM Mono","JetBrains Mono",ui-monospace,monospace';
const EASE  = [0.16, 1, 0.3, 1] as const;

/* ══ DATA ════════════════════════════════════════════════ */
const REASONS = [
  { icon: '◈', label: 'Insufficient funds',      detail: 'Your account balance may be too low for this transaction.',          accent: '#DC2626' },
  { icon: '△', label: 'Network interruption',    detail: 'A connection dropout occurred mid-payment. No charge was made.',     accent: '#A35400' },
  { icon: '◆', label: 'Session timed out',       detail: 'The payment window expired. This is a Razorpay safety feature.',    accent: '#6D28D9' },
  { icon: '○', label: 'Card declined by bank',   detail: 'Your issuing bank rejected the transaction. Try a different card.', accent: '#0D7A5F' },
];

/* ══ REASON CARD ═════════════════════════════════════════ */
function ReasonCard({ reason, index }: { reason: typeof REASONS[0]; index: number }) {
  const ref  = useRef<HTMLDivElement>(null);
  const mx   = useMotionValue(0);
  const my   = useMotionValue(0);
  const sx   = useSpring(mx, { stiffness: 280, damping: 26 });
  const sy   = useSpring(my, { stiffness: 280, damping: 26 });
  const rotateX = useTransform(sy, [-0.5, 0.5], ['4deg', '-4deg']);
  const rotateY = useTransform(sx, [-0.5, 0.5], ['-4deg', '4deg']);
  const glX  = useTransform(sx, [-0.5, 0.5], ['10%', '90%']);
  const glY  = useTransform(sy, [-0.5, 0.5], ['10%', '90%']);

  const onMove  = useCallback((e: React.MouseEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    mx.set((e.clientX - r.left) / r.width  - 0.5);
    my.set((e.clientY - r.top)  / r.height - 0.5);
  }, [mx, my]);
  const onLeave = useCallback(() => { mx.set(0); my.set(0); }, [mx, my]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18, filter: 'blur(4px)' }}
      animate={{ opacity: 1, y: 0,  filter: 'blur(0px)' }}
      transition={{ delay: 0.35 + index * 0.09, duration: 0.55, ease: EASE }}
      style={{ perspective: 900 }}
    >
      <motion.div
        ref={ref}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
      >
        <Box sx={{
          background: T.white, borderRadius: '14px',
          border: `1px solid ${T.border}`,
          p: '14px 18px',
          display: 'flex', alignItems: 'flex-start', gap: 1.75,
          position: 'relative', overflow: 'hidden',
          transition: 'border-color 0.18s',
          '&:hover': { borderColor: `${reason.accent}30` },
        }}>
          <motion.div style={{
            position: 'absolute', inset: 0, borderRadius: '14px', pointerEvents: 'none',
            background: `radial-gradient(circle at ${glX} ${glY}, rgba(255,255,255,0.65) 0%, transparent 55%)`,
          }} />
          <Box sx={{
            position: 'absolute', top: 0, left: 16, right: 16, height: '1px',
            background: `linear-gradient(90deg,transparent,${reason.accent}44,transparent)`,
          }} />

          <Box sx={{
            width: 34, height: 34, borderRadius: '9px', flexShrink: 0,
            background: `${reason.accent}0e`, border: `1px solid ${reason.accent}20`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative', zIndex: 1,
          }}>
            <Typography sx={{ fontFamily: MONO, fontSize: '0.7rem', color: reason.accent, lineHeight: 1 }}>
              {reason.icon}
            </Typography>
          </Box>

          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Typography sx={{ fontFamily: SANS, fontWeight: 600, fontSize: '0.875rem', color: T.ink, lineHeight: 1.3, mb: 0.4 }}>
              {reason.label}
            </Typography>
            <Typography sx={{ fontFamily: SANS, fontSize: '0.8125rem', color: T.inkMuted, lineHeight: 1.55 }}>
              {reason.detail}
            </Typography>
          </Box>
        </Box>
      </motion.div>
    </motion.div>
  );
}

/* ══ ACTION BUTTON ═══════════════════════════════════════ */
function ActionBtn({ href, variant, icon, label }: { href: string; variant: 'primary' | 'ghost'; icon: string; label: string }) {
  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={{ flex: 1 }}>
      <Box
        component={Link}
        href={href}
        sx={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.25,
          px: 3, py: '13px', borderRadius: '11px', textDecoration: 'none',
          border: variant === 'ghost' ? `1px solid ${T.border}` : 'none',
          background: variant === 'primary'
            ? `linear-gradient(115deg,${T.goldLight},${T.gold})`
            : T.white,
          boxShadow: variant === 'primary'
            ? `0 5px 18px rgba(184,146,42,0.26)`
            : `0 2px 8px rgba(12,14,18,0.05)`,
          transition: 'box-shadow 0.18s',
          '&:hover': {
            boxShadow: variant === 'primary'
              ? `0 8px 24px rgba(184,146,42,0.33)`
              : `0 4px 14px rgba(12,14,18,0.08)`,
          },
        }}
      >
        <Typography sx={{ fontFamily: MONO, fontSize: '0.6rem', color: variant === 'primary' ? T.ink : T.inkFaint, lineHeight: 1 }}>
          {icon}
        </Typography>
        <Typography sx={{ fontFamily: SANS, fontWeight: variant === 'primary' ? 700 : 500, fontSize: '0.9rem', color: variant === 'primary' ? T.ink : T.inkMid }}>
          {label}
        </Typography>
      </Box>
    </motion.div>
  );
}

/* ══ PAGE ════════════════════════════════════════════════ */
export default function FailurePage() {
  return (
    <Box sx={{ minHeight: '100vh', background: T.bg, py: { xs: 12, md: 16 }, position: 'relative', overflow: 'hidden' }}>

      {/* Warm grid */}
      <Box sx={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: `linear-gradient(${T.border} 1px,transparent 1px),linear-gradient(90deg,${T.border} 1px,transparent 1px)`,
        backgroundSize: '64px 64px', opacity: 0.45,
      }} />
      {/* Red glow */}
      <Box sx={{
        position: 'fixed', width: '70vw', height: '55vw', top: '-20vw', left: '15vw',
        borderRadius: '50%', pointerEvents: 'none', zIndex: 0,
        background: `radial-gradient(ellipse,${T.redGlow} 0%,transparent 68%)`,
      }} />
      {/* Gold corner glow */}
      <Box sx={{
        position: 'fixed', width: '40vw', height: '40vw', bottom: '-10vw', right: '-8vw',
        borderRadius: '50%', pointerEvents: 'none', zIndex: 0,
        background: `radial-gradient(ellipse,${T.goldGlow} 0%,transparent 70%)`,
      }} />
      {/* Grain */}
      <Box sx={{
        position: 'fixed', inset: 0, pointerEvents: 'none', opacity: 0.022, zIndex: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: '160px',
      }} />

      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>

        {/* ── Animated X badge ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 220, damping: 18, delay: 0.05 }}
          style={{ display: 'flex', justifyContent: 'center', marginBottom: 36 }}
        >
          <Box sx={{ position: 'relative' }}>
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0, 0.2] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                position: 'absolute', inset: -14, borderRadius: '50%',
                border: `1.5px solid ${T.red}`, pointerEvents: 'none',
              }}
            />
            <Box sx={{
              width: 88, height: 88, borderRadius: '50%',
              background: T.white,
              border: `1.5px solid ${T.redBdr}`,
              boxShadow: `0 8px 36px ${T.redGlow}, 0 0 0 4px ${T.redLight}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <motion.path d="M8 8L24 24" stroke={T.red} strokeWidth="2.5" strokeLinecap="round"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                  transition={{ delay: 0.3, duration: 0.35, ease: EASE }} />
                <motion.path d="M24 8L8 24" stroke={T.red} strokeWidth="2.5" strokeLinecap="round"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                  transition={{ delay: 0.5, duration: 0.35, ease: EASE }} />
              </svg>
            </Box>
          </Box>
        </motion.div>

        {/* ── Headline ── */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18, duration: 0.55, ease: EASE }}
        >
          <Box sx={{ textAlign: 'center', mb: 5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5, mb: 2.5 }}>
              <Box sx={{ width: 22, height: '1px', background: `linear-gradient(90deg,transparent,${T.redMid}66)` }} />
              <Typography sx={{ fontFamily: MONO, fontSize: '0.52rem', letterSpacing: '0.2em', color: T.redMid, textTransform: 'uppercase' }}>
                Payment Unsuccessful
              </Typography>
              <Box sx={{ width: 22, height: '1px', background: `linear-gradient(90deg,${T.redMid}66,transparent)` }} />
            </Box>

            <Typography sx={{
              fontFamily: SERIF, fontStyle: 'italic', fontWeight: 400,
              fontSize: { xs: '2.5rem', md: '3.25rem' },
              color: T.ink, letterSpacing: '-0.035em', lineHeight: 0.97, mb: 0.5,
            }}>
              Something went
            </Typography>
            <Typography sx={{
              fontFamily: SERIF, fontStyle: 'italic', fontWeight: 400,
              fontSize: { xs: '2.5rem', md: '3.25rem' },
              letterSpacing: '-0.035em', lineHeight: 0.97, mb: 3,
              background: `linear-gradient(115deg,${T.redMid},${T.red})`,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              wrong.
            </Typography>

            {/* Reassurance pill */}
            <Box sx={{
              display: 'inline-flex', alignItems: 'center', gap: 1,
              px: 2, py: '7px', borderRadius: '7px',
              background: T.white, border: `1px solid ${T.border}`,
              boxShadow: '0 2px 8px rgba(12,14,18,0.05)',
            }}>
              <Typography sx={{ fontFamily: MONO, fontSize: '0.55rem', color: '#0D7A5F', lineHeight: 1 }}>◎</Typography>
              <Typography sx={{ fontFamily: SANS, fontSize: '0.8125rem', color: T.inkMuted }}>
                Cart saved · Zero charge made
              </Typography>
            </Box>
          </Box>
        </motion.div>

        {/* ── Reasons card ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28, duration: 0.5, ease: EASE }}
        >
          <Box sx={{
            background: T.white, borderRadius: '20px',
            border: `1px solid ${T.border}`,
            overflow: 'hidden',
            boxShadow: '0 4px 28px rgba(12,14,18,0.06)',
            mb: 3,
          }}>
            <Box sx={{
              px: 3, py: 2.25,
              background: T.offwhite, borderBottom: `1px solid ${T.border}`,
              display: 'flex', alignItems: 'center', gap: 1.5,
            }}>
              <Box sx={{ width: 2, height: 13, borderRadius: '2px', background: `linear-gradient(180deg,${T.redMid},${T.red})` }} />
              <Typography sx={{ fontFamily: MONO, fontSize: '0.52rem', letterSpacing: '0.16em', color: T.inkFaint, textTransform: 'uppercase' }}>
                Possible Reasons
              </Typography>
            </Box>
            <Box sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {REASONS.map((r, i) => <ReasonCard key={r.label} reason={r} index={i} />)}
            </Box>
          </Box>
        </motion.div>

        {/* ── CTAs ── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.72, duration: 0.5, ease: EASE }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <ActionBtn href="/checkout" variant="primary" icon="↺" label="Try Payment Again" />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <ActionBtn href="/templates" variant="ghost" icon="◈" label="Back to Cart" />
              <ActionBtn href="/book-consultation" variant="ghost" icon="△" label="Get Support" />
            </Box>
          </Box>
        </motion.div>

        {/* ── Footer trust strip ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.5 }}
        >
          <Box sx={{
            mt: 5, pt: 4, borderTop: `1px solid ${T.border}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: { xs: 2, sm: 3 }, flexWrap: 'wrap',
          }}>
            {[
              { icon: '◈', label: 'Razorpay Secured' },
              { icon: '△', label: 'Zero Data Stored' },
              { icon: '◆', label: 'Instant Refund' },
            ].map(b => (
              <Box key={b.label} sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <Typography sx={{ fontFamily: MONO, fontSize: '0.5rem', color: T.goldMid, lineHeight: 1 }}>{b.icon}</Typography>
                <Typography sx={{ fontFamily: MONO, fontSize: '0.48rem', letterSpacing: '0.12em', color: T.inkGhost, textTransform: 'uppercase' }}>{b.label}</Typography>
              </Box>
            ))}
          </Box>
        </motion.div>

      </Container>
    </Box>
  );
}