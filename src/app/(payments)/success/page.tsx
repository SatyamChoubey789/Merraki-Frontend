'use client';

import { useEffect, useRef, useCallback } from 'react';
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
  green:     '#16A34A',
  greenLight:'rgba(22,163,74,0.08)',
  greenBdr:  'rgba(22,163,74,0.2)',
  stepBlue:  '#2D5BE3',
  stepAmber: '#A35400',
  stepGreen: '#0D7A5F',
};

const SANS = '"DM Sans","Mona Sans",system-ui,sans-serif';
const EASE = [0.16, 1, 0.3, 1] as const;

const STEPS = [
  { icon: '◈', step: '01', title: 'Check Your Email',  detail: 'A confirmation with your order details and receipt has been dispatched.',       accent: T.stepBlue  },
  { icon: '△', step: '02', title: 'Admin Review',       detail: 'Our team manually verifies every order — usually within 2 business hours.',     accent: T.stepAmber },
  { icon: '◆', step: '03', title: 'Download Unlocked',  detail: 'Once approved, your download link arrives instantly by email.',                  accent: T.stepGreen },
];

/* Confetti */
function ConfettiParticle({ index }: { index: number }) {
  const colors = [T.blue, T.blueLight, '#5A92F8', '#93C5FD', '#3B7BF6', T.green, '#22C55E'];
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

/* Step card */
function StepCard({ step, index }: { step: typeof STEPS[0]; index: number }) {
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
      transition={{ delay: 0.5 + index * 0.1, duration: 0.55, ease: EASE }}
      style={{ perspective: 900 }}
    >
      <motion.div ref={ref} style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }} onMouseMove={onMove} onMouseLeave={onLeave}>
        <Box sx={{
          background: T.bg, borderRadius: '14px', border: `1px solid ${T.border}`,
          p: '16px 18px', display: 'flex', alignItems: 'flex-start', gap: 2,
          position: 'relative', overflow: 'hidden',
          transition: 'border-color 0.18s, box-shadow 0.18s',
          '&:hover': { borderColor: T.blueBdr, boxShadow: `0 4px 20px ${T.blueDim}` },
        }}>
          <motion.div style={{
            position: 'absolute', inset: 0, borderRadius: '14px', pointerEvents: 'none',
            background: `radial-gradient(circle at ${glX} ${glY}, ${T.blueDim} 0%, transparent 55%)`,
          }} />
          <Box sx={{ position: 'absolute', top: 0, left: 16, right: 16, height: '1.5px', background: `linear-gradient(90deg, transparent, ${step.accent}55, transparent)` }} />

          <Box sx={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{
              width: 38, height: 38, borderRadius: '10px',
              background: `${step.accent}0e`, border: `1px solid ${step.accent}22`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1,
            }}>
              <Typography sx={{ fontFamily: SANS, fontSize: '0.85rem', color: step.accent, lineHeight: 1 }}>{step.icon}</Typography>
            </Box>
            <Typography sx={{ fontFamily: SANS, fontSize: '0.6rem', fontWeight: 600, color: T.inkFaint }}>{step.step}</Typography>
          </Box>

          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Typography sx={{ fontFamily: SANS, fontWeight: 600, fontSize: '0.9rem', color: T.ink, lineHeight: 1.3, mb: 0.5 }}>{step.title}</Typography>
            <Typography sx={{ fontFamily: SANS, fontSize: '0.8125rem', color: T.inkMuted, lineHeight: 1.6 }}>{step.detail}</Typography>
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

export default function SuccessPage() {
  const fired = useRef(false);
  useEffect(() => { fired.current = true; }, []);

  return (
    <Box sx={{
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${T.bluePale} 0%, ${T.bgSection} 50%, ${T.bluePale} 100%)`,
      py: { xs: 12, md: 16 },
      position: 'relative', overflow: 'hidden',
    }}>

      {/* Confetti */}
      {fired.current && Array.from({ length: 36 }).map((_, i) => <ConfettiParticle key={i} index={i} />)}

      {/* Ambient blobs — exact FinalCTA */}
      <Box sx={{ position: 'fixed', width: '60vw', height: '60vw', top: '-20vw', left: '-10vw', borderRadius: '50%', background: `radial-gradient(ellipse, ${T.blueGlow} 0%, transparent 60%)`, pointerEvents: 'none', zIndex: 0 }} />
      <Box sx={{ position: 'fixed', width: '50vw', height: '50vw', bottom: '-15vw', right: '-10vw', borderRadius: '50%', background: `radial-gradient(ellipse, ${T.blueDim} 0%, transparent 60%)`, pointerEvents: 'none', zIndex: 0 }} />

      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>

        {/* Checkmark badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 220, damping: 16, delay: 0.05 }}
          style={{ display: 'flex', justifyContent: 'center', marginBottom: 36 }}
        >
          <Box sx={{ position: 'relative' }}>
            <motion.div animate={{ scale: [1, 1.22, 1], opacity: [0.2, 0, 0.2] }} transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
              style={{ position: 'absolute', inset: -14, borderRadius: '50%', border: `1.5px solid ${T.green}`, pointerEvents: 'none' }} />
            <Box sx={{
              width: 88, height: 88, borderRadius: '50%', background: T.bg,
              border: `1.5px solid ${T.greenBdr}`,
              boxShadow: `0 8px 36px ${T.greenLight}, 0 0 0 5px ${T.greenLight}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                <motion.path d="M8 18L15 25L28 11" stroke={T.green} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.35, duration: 0.55, ease: EASE }} />
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
            }}>You're all</Typography>
            <Typography sx={{
              fontFamily: SANS, fontWeight: 300,
              fontSize: { xs: '2.25rem', md: '3rem' },
              letterSpacing: '-0.03em', lineHeight: 1.05, mb: 3,
              background: T.blueGrad,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>set.</Typography>

            <Box sx={{
              display: 'inline-flex', alignItems: 'center', gap: 1,
              px: 2, py: '7px', borderRadius: '100px',
              background: T.bg, border: `1px solid ${T.border}`,
              boxShadow: '0 2px 8px rgba(10,10,20,0.05)',
            }}>
              <Box sx={{ width: 6, height: 6, borderRadius: '50%', background: T.green }} />
              <Typography sx={{ fontFamily: SANS, fontSize: '0.8125rem', color: T.inkMuted }}>
                Confirmation email on its way
              </Typography>
            </Box>
          </Box>
        </motion.div>

        {/* Next steps card */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28, duration: 0.5, ease: EASE }}>
          <Box sx={{
            background: T.bg, borderRadius: '20px',
            border: `1px solid ${T.borderMid}`,
            overflow: 'hidden',
            boxShadow: `0 8px 32px ${T.blueGlow}`,
            mb: 3,
          }}>
            <Box sx={{ px: 3, py: 2.25, background: T.bgSection, borderBottom: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ width: 2, height: 13, borderRadius: '2px', background: T.blueGrad }} />
              <Typography sx={{ fontFamily: SANS, fontWeight: 700, fontSize: '0.875rem', color: T.ink, letterSpacing: '-0.01em' }}>
                What Happens Next
              </Typography>
            </Box>
            <Box sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {STEPS.map((s, i) => <StepCard key={s.title} step={s} index={i} />)}
            </Box>
          </Box>
        </motion.div>

        {/* CTAs */}
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.72, duration: 0.5, ease: EASE }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <ActionBtn href="/order-tracking"    variant="primary" icon="△" label="Track Your Order" />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <ActionBtn href="/templates"         variant="ghost" icon="◈" label="More Templates" />
              <ActionBtn href="/book-consultation" variant="ghost" icon="◆" label="Book a Call" />
            </Box>
          </Box>
        </motion.div>

        {/* Trust strip */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9, duration: 0.5 }}>
          <Box sx={{ mt: 5, pt: 4, borderTop: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: { xs: 2, sm: 3 }, flexWrap: 'wrap' }}>
            {[
              { icon: '◈', label: 'Razorpay Secured' },
              { icon: '△', label: 'Instant Approval'  },
              { icon: '◆', label: 'Verified Download' },
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