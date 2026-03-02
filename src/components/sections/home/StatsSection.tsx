'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { Box, Container, Typography } from '@mui/material';
import {
  motion,
  useMotionValue, useSpring, useTransform,
  useInView, AnimatePresence,
} from 'framer-motion';

/* ══ TOKENS ══════════════════════════════════════════════ */
const T = {
  white:     '#FFFFFF',
  offwhite:  '#F9F8F5',
  bg:        '#F5F4F1',
  cream:     '#F0EDE6',
  ink:       '#0C0E12',
  inkMid:    '#2E3440',
  inkMuted:  '#64748B',
  inkGhost:  '#CBD5E1',
  border:    '#E8E5DF',
  borderMd:  '#C8C3B8',
  gold:      '#B8922A',
  goldMid:   '#C9A84C',
  goldLight: '#DDB96A',
  goldPale:  '#F0D898',
  goldGlow:  'rgba(184,146,42,0.10)',
  goldGlow2: 'rgba(184,146,42,0.06)',
};
const SERIF = '"Instrument Serif","Playfair Display",Georgia,serif';
const SANS  = '"DM Sans","Mona Sans",system-ui,sans-serif';
const MONO  = '"DM Mono","JetBrains Mono",ui-monospace,monospace';
const EASE  = [0.16, 1, 0.3, 1] as const;

/* ══ DATA ════════════════════════════════════════════════ */
const STATS = [
  {
    value: '150+', raw: 150, suffix: '+', label: 'Financial Models Built',
    icon: '◈', accent: '#2D5BE3', accentBg: 'rgba(45,91,227,0.08)',
    detail: 'Across every stage from pre-seed to Series C',
  },
  {
    value: '300+', raw: 300, suffix: '+', label: 'Founders Advised',
    icon: '△', accent: '#0D7A5F', accentBg: 'rgba(13,122,95,0.08)',
    detail: 'From bootstrapped to VC-backed across India',
  },
  {
    value: '12+', raw: 12, suffix: '+', label: 'Industries Covered',
    icon: '◆', accent: '#6D28D9', accentBg: 'rgba(109,40,217,0.08)',
    detail: 'SaaS, D2C, fintech, healthcare, and more',
  },
  {
    value: '₹50Cr+', raw: 50, suffix: 'Cr+', label: 'Revenue Modelled',
    icon: '✦', accent: '#A35400', accentBg: 'rgba(163,84,0,0.08)',
    prefix: '₹',
    detail: 'Directly influencing investor decisions',
  },
];

/* ══ SMOOTH COUNTER (spring-physics ramp) ════════════════ */
function Counter({
  raw, suffix, prefix = '', inView, delay = 0,
}: {
  raw: number; suffix: string; prefix?: string; inView: boolean; delay?: number;
}) {
  const [display, setDisplay] = useState(0);
  const startedRef = useRef(false);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!inView || startedRef.current) return;
    startedRef.current = true;

    const delayMs = delay * 1000;
    const duration = 1800;

    const run = () => {
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min((now - start) / duration, 1);
        // quartic ease-out: ultra-smooth deceleration
        const eased = 1 - Math.pow(1 - t, 4);
        setDisplay(Math.round(eased * raw));
        if (t < 1) rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    };

    const timer = setTimeout(run, delayMs);
    return () => {
      clearTimeout(timer);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [inView, raw, delay]);

  return (
    <span style={{
      fontFamily: SERIF, fontStyle: 'italic', fontWeight: 400,
      display: 'block',
    }}>
      {prefix}{display}{suffix}
    </span>
  );
}

/* ══ FLOATING ORB (background particle) ═════════════════ */
function FloatOrb({ x, y, size, color, delay }: {
  x: string; y: string; size: number; color: string; delay: number;
}) {
  return (
    <motion.div
      style={{
        position: 'absolute', left: x, top: y,
        width: size, height: size, borderRadius: '50%',
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        pointerEvents: 'none',
      }}
      initial={{ opacity: 0, scale: 0.4 }}
      animate={{
        opacity: [0, 0.7, 0.4, 0.7, 0],
        scale: [0.4, 1, 0.9, 1.05, 0.95],
        y: [0, -24, -12, -28, 0],
      }}
      transition={{
        duration: 12,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
}

/* ══ STAT CARD ═══════════════════════════════════════════ */
function StatCard({
  stat, index, inView,
}: {
  stat: typeof STATS[0]; index: number; inView: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 300, damping: 28 });
  const sy = useSpring(my, { stiffness: 300, damping: 28 });

  const rotateX = useTransform(sy, [-0.5, 0.5], ['6deg', '-6deg']);
  const rotateY = useTransform(sx, [-0.5, 0.5], ['-6deg', '6deg']);
  const glX     = useTransform(sx, [-0.5, 0.5], ['8%',  '92%']);
  const glY     = useTransform(sy, [-0.5, 0.5], ['8%',  '92%']);
  const glowOpacity = useTransform(
    sx, v => 0.55 + Math.abs(v) * 0.45
  );
  const elevation = useTransform(
    sx, v => `0 ${12 + Math.abs(v) * 24}px ${32 + Math.abs(v) * 40}px rgba(12,14,18,${0.05 + Math.abs(v) * 0.08})`
  );

  const onMove = useCallback((e: React.MouseEvent) => {
    const r = cardRef.current?.getBoundingClientRect();
    if (!r) return;
    mx.set((e.clientX - r.left) / r.width  - 0.5);
    my.set((e.clientY - r.top)  / r.height - 0.5);
  }, [mx, my]);

  const onLeave = useCallback(() => {
    mx.set(0); my.set(0);
  }, [mx, my]);

  /* stagger delay per card */
  const staggerDelay = 0.12 + index * 0.11;

  return (
    <motion.div
      initial={{ opacity: 0, y: 48, filter: 'blur(10px)', scale: 0.96 }}
      animate={inView
        ? { opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }
        : {}
      }
      transition={{
        delay: staggerDelay,
        duration: 0.75,
        ease: EASE,
        filter: { duration: 0.6 },
      }}
      style={{ perspective: 1100 }}
    >
      <motion.div
        ref={cardRef}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d', boxShadow: elevation }}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
      >
        <Box sx={{
          background: T.white,
          borderRadius: '22px',
          border: `1px solid ${T.border}`,
          p: { xs: '28px 22px 24px', md: '38px 34px 32px' },
          position: 'relative',
          overflow: 'hidden',
          cursor: 'default',
          transition: 'border-color 0.25s ease',
          '&:hover': { borderColor: `${stat.accent}35` },
        }}>

          {/* ── Moving specular highlight ── */}
          <motion.div style={{
            position: 'absolute', inset: 0,
            borderRadius: '22px',
            pointerEvents: 'none',
            background: `radial-gradient(circle at ${glX} ${glY}, rgba(255,255,255,0.75) 0%, transparent 52%)`,
            opacity: glowOpacity,
          }} />

          {/* ── Subtle warm grid ── */}
          <Box sx={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            backgroundImage: `linear-gradient(${T.border} 1px,transparent 1px),linear-gradient(90deg,${T.border} 1px,transparent 1px)`,
            backgroundSize: '44px 44px', opacity: 0.35,
          }} />

          {/* ── Accent top line (animates in) ── */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={inView ? { scaleX: 1, opacity: 1 } : {}}
            transition={{ delay: staggerDelay + 0.2, duration: 0.7, ease: EASE }}
            style={{
              position: 'absolute', top: 0, left: 28, right: 28, height: 1.5,
              background: `linear-gradient(90deg,transparent,${stat.accent}70,transparent)`,
              transformOrigin: 'left',
            }}
          />

          {/* ── Ghost number bg ── */}
          <Box sx={{
            position: 'absolute', right: -6, bottom: -20,
            fontFamily: SERIF, fontStyle: 'italic',
            fontSize: '7.5rem', lineHeight: 1,
            color: 'rgba(12,14,18,0.025)',
            pointerEvents: 'none', userSelect: 'none',
            letterSpacing: '-0.04em',
          }}>
            {String(index + 1).padStart(2, '0')}
          </Box>

          {/* ── Accent blob ── */}
          <Box sx={{
            position: 'absolute', width: '65%', height: '65%',
            top: '-20%', right: '-15%', borderRadius: '50%',
            background: `radial-gradient(ellipse, ${stat.accentBg} 0%, transparent 70%)`,
            pointerEvents: 'none',
          }} />

          {/* ── Content ── */}
          <Box sx={{ position: 'relative', zIndex: 1 }}>

            {/* Icon tile — pops in with spring */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0, rotate: -12 }}
              animate={inView ? { scale: 1, opacity: 1, rotate: 0 } : {}}
              transition={{
                delay: staggerDelay + 0.15,
                type: 'spring', stiffness: 380, damping: 22,
              }}
            >
              <Box sx={{
                width: 44, height: 44, borderRadius: '12px', mb: 3.5,
                background: stat.accentBg,
                border: `1px solid ${stat.accent}28`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Typography sx={{
                  fontFamily: MONO, fontSize: '1rem',
                  color: stat.accent, lineHeight: 1,
                }}>
                  {stat.icon}
                </Typography>
              </Box>
            </motion.div>

            {/* Animated counter — large italic serif */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: staggerDelay + 0.25, duration: 0.55, ease: EASE }}
            >
              <Typography sx={{
                fontFamily: SERIF, fontStyle: 'italic', fontWeight: 400,
                fontSize: { xs: '2.75rem', sm: '3.4rem', md: '4rem' },
                color: T.ink, letterSpacing: '-0.04em', lineHeight: 1, mb: 0.75,
              }}>
                <Counter
                  raw={stat.raw}
                  suffix={stat.suffix}
                  prefix={stat.prefix}
                  inView={inView}
                  delay={staggerDelay + 0.3}
                />
              </Typography>
            </motion.div>

            {/* Label */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: staggerDelay + 0.42, duration: 0.5 }}
            >
              <Typography sx={{
                fontFamily: MONO, fontSize: '0.54rem',
                letterSpacing: '0.17em', color: T.inkMuted,
                textTransform: 'uppercase', lineHeight: 1.5, mb: 1,
              }}>
                {stat.label}
              </Typography>

              {/* Detail text */}
              <Typography sx={{
                fontFamily: SANS, fontSize: '0.78rem',
                color: T.inkGhost, lineHeight: 1.6, mt: 0.5,
              }}>
                {stat.detail}
              </Typography>
            </motion.div>

            {/* Bottom accent rule */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={inView ? { scaleX: 1 } : {}}
              transition={{ delay: staggerDelay + 0.55, duration: 0.6, ease: EASE }}
              style={{ transformOrigin: 'left' }}
            >
              <Box sx={{
                mt: 3, height: '1px',
                background: `linear-gradient(90deg,${stat.accent}40,transparent)`,
              }} />
            </motion.div>
          </Box>
        </Box>
      </motion.div>
    </motion.div>
  );
}

/* ══ DIVIDER LINE SWEEP ══════════════════════════════════ */
function SweepLine({ inView }: { inView: boolean }) {
  return (
    <motion.div
      initial={{ scaleX: 0, opacity: 0 }}
      animate={inView ? { scaleX: 1, opacity: 1 } : {}}
      transition={{ duration: 1.1, delay: 0.05, ease: EASE }}
      style={{
        height: 1,
        background: `linear-gradient(90deg, transparent, ${T.borderMd} 25%, ${T.borderMd} 75%, transparent)`,
        transformOrigin: 'left',
        marginBottom: 64,
      }}
    />
  );
}

/* ══ SECTION ═════════════════════════════════════════════ */
export function StatsSection() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const inView  = useInView(wrapRef, { once: true, margin: '-60px' });

  return (
    <Box sx={{
      py: { xs: 12, md: 18 },
      background: T.bg,
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* ── Layered background ── */}

      {/* Warm grid */}
      <Box sx={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: `
          linear-gradient(${T.border} 1px, transparent 1px),
          linear-gradient(90deg, ${T.border} 1px, transparent 1px)
        `,
        backgroundSize: '64px 64px',
        opacity: 0.5,
      }} />

      {/* Primary gold radial — top-centre */}
      <Box sx={{
        position: 'absolute', width: '70vw', height: '55vw',
        top: '-18vw', left: '15vw',
        borderRadius: '50%',
        background: `radial-gradient(ellipse, ${T.goldGlow} 0%, transparent 68%)`,
        pointerEvents: 'none',
      }} />

      {/* Secondary warm bloom — bottom right */}
      <Box sx={{
        position: 'absolute', width: '40vw', height: '35vw',
        bottom: '-10vw', right: '-8vw',
        borderRadius: '50%',
        background: `radial-gradient(ellipse, rgba(163,84,0,0.06) 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      {/* Floating micro-orbs */}
      <FloatOrb x="8%"  y="20%" size={180} color={T.goldGlow}                  delay={0}   />
      <FloatOrb x="75%" y="60%" size={140} color="rgba(45,91,227,0.06)"         delay={2.5} />
      <FloatOrb x="42%" y="80%" size={100} color="rgba(109,40,217,0.05)"        delay={4.8} />
      <FloatOrb x="88%" y="15%" size={120} color="rgba(13,122,95,0.06)"         delay={1.8} />

      {/* Grain texture */}
      <Box sx={{
        position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.022,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: '160px',
      }} />

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }} ref={wrapRef}>

        {/* ── Section header ── */}
        <Box sx={{ mb: { xs: 7, md: 10 } }}>

          {/* Eyebrow label */}
          <motion.div
            initial={{ opacity: 0, x: -18 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={inView ? { scaleX: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
                style={{ transformOrigin: 'left' }}
              >
                <Box sx={{ width: 26, height: 1, background: `linear-gradient(90deg,${T.gold},${T.goldLight})` }} />
              </motion.div>
              <Typography sx={{
                fontFamily: MONO, fontSize: '0.54rem',
                letterSpacing: '0.22em', color: T.goldMid, textTransform: 'uppercase',
              }}>
                By the Numbers
              </Typography>
            </Box>
          </motion.div>

          {/* Headline — word-by-word reveal */}
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { md: 'flex-end' }, justifyContent: 'space-between', gap: 3 }}>
            <Box>
              <Box sx={{ overflow: 'hidden', mb: 0.5 }}>
                <motion.div
                  initial={{ y: '105%' }}
                  animate={inView ? { y: '0%' } : {}}
                  transition={{ duration: 0.72, delay: 0.08, ease: EASE }}
                >
                  <Typography sx={{
                    fontFamily: SERIF, fontStyle: 'italic', fontWeight: 400,
                    fontSize: { xs: '2.4rem', md: '3.75rem' },
                    color: T.ink, letterSpacing: '-0.036em', lineHeight: 0.97,
                  }}>
                    Built on real
                  </Typography>
                </motion.div>
              </Box>

              <Box sx={{ overflow: 'hidden' }}>
                <motion.div
                  initial={{ y: '105%' }}
                  animate={inView ? { y: '0%' } : {}}
                  transition={{ duration: 0.72, delay: 0.17, ease: EASE }}
                >
                  <Typography sx={{
                    fontFamily: SERIF, fontStyle: 'italic', fontWeight: 400,
                    fontSize: { xs: '2.4rem', md: '3.75rem' },
                    letterSpacing: '-0.036em', lineHeight: 0.97,
                    background: `linear-gradient(115deg,${T.goldLight},${T.gold})`,
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                  }}>
                    founder work.
                  </Typography>
                </motion.div>
              </Box>
            </Box>

            {/* Right sub-copy */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.32, duration: 0.55, ease: EASE }}
            >
              <Typography sx={{
                fontFamily: SANS, fontSize: '0.9375rem',
                color: T.inkMuted, lineHeight: 1.78, maxWidth: 300,
              }}>
                Numbers don't lie. Every metric here is earned — one engagement at a time.
              </Typography>
            </motion.div>
          </Box>
        </Box>

        {/* ── Sweep line ── */}
        <SweepLine inView={inView} />

        {/* ── Cards grid ── */}
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr 1fr', md: '1fr 1fr 1fr 1fr' },
          gap: { xs: 2, md: 2.5 },
        }}>
          {STATS.map((stat, i) => (
            <StatCard key={stat.label} stat={stat} index={i} inView={inView} />
          ))}
        </Box>

        {/* ── Bottom meta bar ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.75, duration: 0.55, ease: EASE }}
        >
          <Box sx={{
            mt: { xs: 7, md: 11 }, pt: 4,
            borderTop: `1px solid ${T.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 2,
          }}>
            {/* Left: origin copy */}
            <Typography sx={{
              fontFamily: MONO, fontSize: '0.52rem',
              letterSpacing: '0.16em', color: T.inkGhost, textTransform: 'uppercase',
            }}>
              Since 2021 · Mumbai, India · 100% founder-focused
            </Typography>

            {/* Right: star rating */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.4, rotate: -20 }}
                  animate={inView ? { opacity: 1, scale: 1, rotate: 0 } : {}}
                  transition={{
                    delay: 0.82 + i * 0.06,
                    type: 'spring', stiffness: 400, damping: 20,
                  }}
                >
                  <Typography sx={{ fontSize: '0.72rem', color: T.goldMid, lineHeight: 1 }}>★</Typography>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ delay: 1.15, duration: 0.4 }}
              >
                <Typography sx={{
                  fontFamily: MONO, fontSize: '0.52rem',
                  letterSpacing: '0.1em', color: T.inkMuted, ml: 0.75,
                }}>
                  4.9 avg across all engagements
                </Typography>
              </motion.div>
            </Box>
          </Box>
        </motion.div>

      </Container>
    </Box>
  );
}