'use client';

import { useEffect, useRef, useCallback } from 'react';
import { Box, Typography, Container } from '@mui/material';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Link from 'next/link';

/* ══ TOKENS — exact footer system ════════════════════════ */
const T = {
  bg:         '#FFFFFF',
  bgSection:  '#F5F7FB',
  ink:        '#0A0A0F',
  inkDark:    '#1E1E2A',
  inkMid:     '#3A3A52',
  inkMuted:   '#5A5A72',
  inkFaint:   '#9898AE',
  border:     'rgba(10,10,20,0.08)',
  borderMid:  'rgba(10,10,20,0.14)',
  blue:       '#3B7BF6',
  blueMid:    '#5A92F8',
  blueLight:  '#7AABFF',
  bluePale:   '#EDF3FF',
  blueGlow:   'rgba(59,123,246,0.18)',
  blueDim:    'rgba(59,123,246,0.06)',
  blueGrad:   'linear-gradient(135deg, #3B7BF6 0%, #7AABFF 100%)',
  blueBdr:    'rgba(59,123,246,0.22)',
  green:      '#16A34A',
  greenMid:   '#22C55E',
  greenLight: 'rgba(22,163,74,0.08)',
  greenBdr:   'rgba(22,163,74,0.2)',
  // step accents kept semantic
  stepBlue:   '#2D5BE3',
  stepAmber:  '#A35400',
  stepGreen:  '#0D7A5F',
  white:      '#FFFFFF',
};

const SERIF = '"Instrument Serif","Playfair Display",Georgia,serif';
const SANS  = '"DM Sans","Mona Sans",system-ui,sans-serif';
const MONO  = '"DM Mono","JetBrains Mono",ui-monospace,monospace';
const EASE  = [0.16, 1, 0.3, 1] as const;

/* ══ NEXT STEPS ══════════════════════════════════════════ */
const STEPS = [
  { icon: '◈', step: '01', title: 'Check Your Email',   detail: 'A confirmation with your order details and receipt has been dispatched.',        accent: T.stepBlue  },
  { icon: '△', step: '02', title: 'Admin Review',        detail: 'Our team manually verifies every order — usually within 2 business hours.',      accent: T.stepAmber },
  { icon: '◆', step: '03', title: 'Download Unlocked',   detail: 'Once approved, your download link arrives instantly by email.',                   accent: T.stepGreen },
];

/* ══ CONFETTI PARTICLE ═══════════════════════════════════
   Uses blue/white palette for confetti — matches site theme
══════════════════════════════════════════════════════════ */
function ConfettiParticle({ index }: { index: number }) {
  // Blue-system confetti palette
  const colors = [T.blue, T.blueLight, T.blueMid, '#7AABFF', '#3B7BF6', '#93C5FD', T.green, T.greenMid];
  const color  = colors[index % colors.length];
  const shapes = ['circle', 'rect', 'rect'] as const;
  const shape  = shapes[index % 3];
  const size   = 5 + (index % 4) * 2;
  const x      = (index * 137.5) % 100;
  const delay  = (index * 0.04) % 1.2;
  const dur    = 1.8 + (index % 5) * 0.3;
  const rot    = (index * 73) % 360;

  return (
    <motion.div
      initial={{ y: -20, x: `${x}vw`, opacity: 1, rotate: rot, scale: 0 }}
      animate={{ y: '110vh', opacity: [1, 1, 0], rotate: rot + 360 * 3, scale: [0, 1, 1] }}
      transition={{ delay, duration: dur, ease: 'easeIn' }}
      style={{
        position: 'fixed', top: 0, left: 0,
        width: size, height: shape === 'circle' ? size : size * 0.45,
        borderRadius: shape === 'circle' ? '50%' : '1px',
        background: color, pointerEvents: 'none', zIndex: 999,
      }}
    />
  );
}

/* ══ STEP CARD ═══════════════════════════════════════════ */
function StepCard({ step, index }: { step: typeof STEPS[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const mx  = useMotionValue(0);
  const my  = useMotionValue(0);
  const sx  = useSpring(mx, { stiffness: 280, damping: 26 });
  const sy  = useSpring(my, { stiffness: 280, damping: 26 });
  const rotateX = useTransform(sy, [-0.5, 0.5], ['4deg', '-4deg']);
  const rotateY = useTransform(sx, [-0.5, 0.5], ['-4deg', '4deg']);
  const glX = useTransform(sx, [-0.5, 0.5], ['10%', '90%']);
  const glY = useTransform(sy, [-0.5, 0.5], ['10%', '90%']);

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
      transition={{ delay: 0.5 + index * 0.1, duration: 0.55, ease: EASE }}
      style={{ perspective: 900 }}
    >
      <motion.div
        ref={ref}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
      >
        <Box sx={{
          background:   T.bg,
          borderRadius: '14px',
          border:       `1px solid ${T.border}`,
          p:            '16px 18px',
          display:      'flex', alignItems: 'flex-start', gap: 2,
          position:     'relative', overflow: 'hidden',
          transition:   'border-color 0.18s, box-shadow 0.18s',
          '&:hover': {
            borderColor: T.blueBdr,
            boxShadow:   `0 4px 20px ${T.blueDim}`,
          },
        }}>
          {/* Blue shimmer */}
          <motion.div style={{
            position: 'absolute', inset: 0, borderRadius: '14px', pointerEvents: 'none',
            background: `radial-gradient(circle at ${glX} ${glY}, ${T.blueDim} 0%, transparent 55%)`,
          }} />
          {/* Top accent line */}
          <Box sx={{
            position: 'absolute', top: 0, left: 16, right: 16, height: '1.5px',
            background: `linear-gradient(90deg, transparent, ${step.accent}55, transparent)`,
          }} />
          {/* Step connector */}
          {index < STEPS.length - 1 && (
            <Box sx={{
              position: 'absolute', bottom: -16, left: 28, width: '1px', height: 16,
              background: `linear-gradient(180deg, ${T.border}, transparent)`,
              zIndex: 2,
            }} />
          )}

          {/* Icon + step number */}
          <Box sx={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{
              width: 38, height: 38, borderRadius: '10px',
              background: `${step.accent}0e`, border: `1px solid ${step.accent}22`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative', zIndex: 1,
            }}>
              <Typography sx={{ fontFamily: MONO, fontSize: '0.8rem', color: step.accent, lineHeight: 1 }}>
                {step.icon}
              </Typography>
            </Box>
            <Typography sx={{ fontFamily: MONO, fontSize: '0.42rem', letterSpacing: '0.1em', color: T.inkFaint, textTransform: 'uppercase' }}>
              {step.step}
            </Typography>
          </Box>

          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Typography sx={{ fontFamily: SANS, fontWeight: 600, fontSize: '0.9rem', color: T.ink, lineHeight: 1.3, mb: 0.5 }}>
              {step.title}
            </Typography>
            <Typography sx={{ fontFamily: SANS, fontSize: '0.8125rem', color: T.inkMuted, lineHeight: 1.6 }}>
              {step.detail}
            </Typography>
          </Box>
        </Box>
      </motion.div>
    </motion.div>
  );
}

/* ══ ACTION BUTTON ═══════════════════════════════════════ */
function ActionBtn({ href, variant, icon, label }: {
  href: string; variant: 'primary' | 'ghost'; icon: string; label: string;
}) {
  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={{ flex: 1 }}>
      <Box component={Link} href={href} sx={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.25,
        px: 3, py: '13px', borderRadius: '100px', textDecoration: 'none',
        border:     variant === 'ghost' ? `1px solid ${T.border}` : 'none',
        background: variant === 'primary' ? T.blueGrad : T.bg,
        boxShadow:  variant === 'primary'
          ? `0 5px 18px ${T.blueGlow}`
          : '0 2px 8px rgba(10,10,20,0.05)',
        transition: 'box-shadow 0.18s',
        '&:hover': {
          boxShadow: variant === 'primary'
            ? `0 8px 28px ${T.blueGlow}`
            : '0 4px 14px rgba(10,10,20,0.08)',
          background: variant === 'ghost' ? T.bgSection : undefined,
        },
      }}>
        <Typography sx={{ fontFamily: MONO, fontSize: '0.6rem', color: variant === 'primary' ? '#FFFFFF' : T.inkFaint, lineHeight: 1 }}>
          {icon}
        </Typography>
        <Typography sx={{ fontFamily: SANS, fontWeight: variant === 'primary' ? 700 : 500, fontSize: '0.9rem', color: variant === 'primary' ? '#FFFFFF' : T.inkMid }}>
          {label}
        </Typography>
      </Box>
    </motion.div>
  );
}

/* ══ PAGE ════════════════════════════════════════════════ */
export default function SuccessPage() {
  const fired = useRef(false);
  useEffect(() => { fired.current = true; }, []);

  return (
    <Box sx={{
      minHeight:  '100vh',
      background: T.bgSection,
      py: { xs: 12, md: 16 },
      position:   'relative',
      overflow:   'hidden',
      /* dot grid */
      backgroundImage: `radial-gradient(circle, rgba(10,10,20,0.055) 1px, transparent 1px)`,
      backgroundSize:  '28px 28px',
    }}>

      {/* Confetti — blue palette */}
      {fired.current && Array.from({ length: 36 }).map((_, i) => (
        <ConfettiParticle key={i} index={i} />
      ))}

      {/* Blue ambient bloom */}
      <Box sx={{
        position: 'fixed', width: '72vw', height: '56vw', top: '-18vw', left: '14vw',
        borderRadius: '50%', pointerEvents: 'none', zIndex: 0,
        background: `radial-gradient(ellipse, rgba(59,123,246,0.08) 0%, transparent 65%)`,
      }} />
      {/* Green accent bloom — success context */}
      <Box sx={{
        position: 'fixed', width: '45vw', height: '40vw', bottom: '-10vw', right: '-8vw',
        borderRadius: '50%', pointerEvents: 'none', zIndex: 0,
        background: `radial-gradient(ellipse, rgba(22,163,74,0.06) 0%, transparent 68%)`,
      }} />

      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>

        {/* ── Checkmark badge ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 220, damping: 16, delay: 0.05 }}
          style={{ display: 'flex', justifyContent: 'center', marginBottom: 36 }}
        >
          <Box sx={{ position: 'relative' }}>
            <motion.div
              animate={{ scale: [1, 1.22, 1], opacity: [0.2, 0, 0.2] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                position: 'absolute', inset: -14, borderRadius: '50%',
                border: `1.5px solid ${T.green}`, pointerEvents: 'none',
              }}
            />
            <Box sx={{
              width: 88, height: 88, borderRadius: '50%',
              background: T.bg,
              border: `1.5px solid ${T.greenBdr}`,
              boxShadow: `0 8px 36px ${T.greenLight}, 0 0 0 5px ${T.greenLight}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                <motion.path
                  d="M8 18L15 25L28 11"
                  stroke={T.green} strokeWidth="2.8"
                  strokeLinecap="round" strokeLinejoin="round"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                  transition={{ delay: 0.35, duration: 0.55, ease: EASE }}
                />
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
            {/* Eyebrow — footer mono label + blueGrad rule */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5, mb: 2.5 }}>
              <Box sx={{ width: 22, height: 2, borderRadius: '2px', background: T.blueGrad }} />
              <Typography sx={{ fontFamily: MONO, fontSize: '0.52rem', letterSpacing: '0.2em', color: T.blue, textTransform: 'uppercase' }}>
                Payment Confirmed
              </Typography>
              <Box sx={{ width: 22, height: 2, borderRadius: '2px', background: T.blueGrad }} />
            </Box>

            {/* Headline — Instrument Serif italic */}
            <Typography sx={{
              fontFamily: SERIF, fontStyle: 'italic', fontWeight: 400,
              fontSize: { xs: '2.5rem', md: '3.25rem' },
              color: T.ink, letterSpacing: '-0.035em', lineHeight: 0.97, mb: 0.5,
            }}>
              You're all
            </Typography>
            {/* Blue gradient on key word — matches footer headline style */}
            <Typography sx={{
              fontFamily: SERIF, fontStyle: 'italic', fontWeight: 400,
              fontSize: { xs: '2.5rem', md: '3.25rem' },
              letterSpacing: '-0.035em', lineHeight: 0.97, mb: 3,
              background: T.blueGrad,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              set.
            </Typography>

            {/* Confirmation pill */}
            <Box sx={{
              display: 'inline-flex', alignItems: 'center', gap: 1,
              px: 2, py: '7px', borderRadius: '100px',
              background: T.bg, border: `1px solid ${T.border}`,
              boxShadow: '0 2px 8px rgba(10,10,20,0.05)',
            }}>
              <Typography sx={{ fontFamily: MONO, fontSize: '0.55rem', color: T.green, lineHeight: 1 }}>◎</Typography>
              <Typography sx={{ fontFamily: SANS, fontSize: '0.8125rem', color: T.inkMuted }}>
                Confirmation email on its way
              </Typography>
            </Box>
          </Box>
        </motion.div>

        {/* ── Next steps card ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28, duration: 0.5, ease: EASE }}
        >
          <Box sx={{
            background:   T.bg,
            borderRadius: '20px',
            border:       `1px solid ${T.border}`,
            overflow:     'hidden',
            boxShadow:    '0 4px 28px rgba(10,10,20,0.06)',
            mb:           3,
          }}>
            {/* Card header — bgSection + blueGrad rule */}
            <Box sx={{
              px: 3, py: 2.25,
              background:   T.bgSection,
              borderBottom: `1px solid ${T.border}`,
              display:      'flex', alignItems: 'center', gap: 1.5,
            }}>
              <Box sx={{ width: 2, height: 13, borderRadius: '2px', background: T.blueGrad }} />
              <Typography sx={{ fontFamily: MONO, fontSize: '0.52rem', letterSpacing: '0.16em', color: T.inkFaint, textTransform: 'uppercase' }}>
                What Happens Next
              </Typography>
            </Box>
            <Box sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {STEPS.map((s, i) => <StepCard key={s.title} step={s} index={i} />)}
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
            <ActionBtn href="/order-tracking"    variant="primary" icon="△" label="Track Your Order" />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <ActionBtn href="/templates"         variant="ghost" icon="◈" label="More Templates" />
              <ActionBtn href="/book-consultation" variant="ghost" icon="◆" label="Book a Call" />
            </Box>
          </Box>
        </motion.div>

        {/* ── Trust strip ── */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9, duration: 0.5 }}>
          <Box sx={{
            mt: 5, pt: 4, borderTop: `1px solid ${T.border}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: { xs: 2, sm: 3 }, flexWrap: 'wrap',
          }}>
            {[
              { icon: '◈', label: 'Razorpay Secured'  },
              { icon: '△', label: 'Instant Approval'   },
              { icon: '◆', label: 'Verified Download'  },
            ].map(b => (
              <Box key={b.label} sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <Typography sx={{ fontFamily: MONO, fontSize: '0.5rem', color: T.blue, lineHeight: 1 }}>{b.icon}</Typography>
                <Typography sx={{ fontFamily: MONO, fontSize: '0.48rem', letterSpacing: '0.12em', color: T.inkFaint, textTransform: 'uppercase' }}>{b.label}</Typography>
              </Box>
            ))}
          </Box>
        </motion.div>

      </Container>
    </Box>
  );
}