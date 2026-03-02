'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { Box, Container, Typography } from '@mui/material';
import { ArrowForward as ArrowIcon } from '@mui/icons-material';
import {
  motion, useMotionValue, useSpring, useTransform,
  AnimatePresence,
} from 'framer-motion';
import Link from 'next/link';

/* ══ TOKENS ══════════════════════════════════════════════ */
const T = {
  white:     '#FFFFFF',
  offwhite:  '#F9F8F5',
  cream:     '#F0EDE6',
  bg:        '#F5F4F1',
  ink:       '#0C0E12',
  inkMid:    '#2E3440',
  inkMuted:  '#64748B',
  inkFaint:  '#94A3B8',
  inkGhost:  '#CBD5E1',
  border:    '#E8E5DF',
  borderMd:  '#C8C3B8',
  gold:      '#B8922A',
  goldMid:   '#C9A84C',
  goldLight: '#DDB96A',
  goldGlow:  'rgba(184,146,42,0.09)',
};
const SERIF = '"Instrument Serif","Playfair Display",Georgia,serif';
const SANS  = '"DM Sans","Mona Sans",system-ui,sans-serif';
const MONO  = '"DM Mono","JetBrains Mono",ui-monospace,monospace';
const EASE  = [0.16, 1, 0.3, 1] as const;

/* ══ SERVICES ════════════════════════════════════════════ */
const SERVICES = [
  {
    icon: '◈', title: 'Financial Modelling', short: 'Models that close rounds.',
    description: 'Custom 3-statement models, DCF, LBO, and scenario analysis built for your specific business. Our models have been used in Series A, B, and PE rounds.',
    detail: ['3-statement P&L, Balance Sheet & Cash Flow', 'DCF & comparable company analysis', 'Scenario & sensitivity modelling', 'Investor-ready output decks'],
    href: '/book-consultation', accent: '#2D5BE3',
  },
  {
    icon: '△', title: 'Excel Dashboards', short: 'Numbers your team actually reads.',
    description: 'Interactive KPI dashboards that update in real-time. Built for operators, loved by investors. Your whole team tracking one version of the truth.',
    detail: ['Live-linked KPI tracker', 'Revenue & burn rate views', 'Cohort & retention analysis', 'Board-ready one-pagers'],
    href: '/templates', accent: '#0D7A5F',
  },
  {
    icon: '◆', title: 'Templates & Calculators', short: 'Plug in. Decide faster.',
    description: 'Plug-and-play financial templates. Download, input your numbers, and make better decisions today. No finance degree required.',
    detail: ['Runway & burn calculator', 'Unit economics model', 'SaaS metrics dashboard', 'Fundraise readiness kit'],
    href: '/templates', accent: '#6D28D9',
  },
  {
    icon: '○', title: 'Data Analysis & Reporting', short: 'Raw data → boardroom clarity.',
    description: 'Turn raw data into boardroom-ready reports. We handle the analysis so you handle the strategy. Clean, clear, and always on time.',
    detail: ['Monthly management accounts', 'Variance & trend analysis', 'Investor update packages', 'Custom KPI frameworks'],
    href: '/book-consultation', accent: '#A35400',
  },
  {
    icon: '◇', title: 'Bookkeeping Support', short: 'Always clean. Always current.',
    description: 'Accurate, compliant bookkeeping so your numbers are always clean, current, and investor-ready. Never scramble before a board meeting again.',
    detail: ['Transaction categorisation', 'Reconciliation & audit trail', 'GST & compliance ready', 'Month-end close in 24 hrs'],
    href: '/book-consultation', accent: '#9D174D',
  },
  {
    icon: '✦', title: 'Founder Consulting', short: 'A CFO in your corner.',
    description: "Strategic financial guidance from experts who've built models for 150+ companies. We think like analysts and speak like founders.",
    detail: ['1:1 strategy sessions', 'Fundraise prep & narrative', 'Financial health audit', 'Ongoing fractional CFO'],
    href: '/book-consultation', accent: '#1D4ED8',
  },
];

const TOTAL      = SERVICES.length;
// Each card has 2 steps: front (even) + back (odd)
const TOTAL_STEPS = TOTAL * 2;

/* ══ CARD FACE ═══════════════════════════════════════════ */
function CardFace({
  service,
  face,
}: {
  service: typeof SERVICES[0];
  face: 'front' | 'back';
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mx  = useMotionValue(0);
  const my  = useMotionValue(0);
  const sx  = useSpring(mx, { stiffness: 240, damping: 24 });
  const sy  = useSpring(my, { stiffness: 240, damping: 24 });
  const rotateX = useTransform(sy, [-0.5, 0.5], ['5deg', '-5deg']);
  const rotateY = useTransform(sx, [-0.5, 0.5], ['-5deg', '5deg']);
  const glX = useTransform(sx, [-0.5, 0.5], ['12%', '88%']);
  const glY = useTransform(sy, [-0.5, 0.5], ['12%', '88%']);

  const onMove = useCallback((e: React.MouseEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    mx.set((e.clientX - r.left) / r.width  - 0.5);
    my.set((e.clientY - r.top)  / r.height - 0.5);
  }, [mx, my]);

  const onLeave = useCallback(() => { mx.set(0); my.set(0); }, [mx, my]);
  const cardIndex = SERVICES.indexOf(service);

  /* ─ FRONT ─ */
  if (face === 'front') return (
    <motion.div
      ref={ref}
      style={{ position: 'absolute', inset: 0, rotateX, rotateY, transformStyle: 'preserve-3d' }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <Box sx={{
        width: '100%', height: '100%', background: T.white,
        borderRadius: '22px', border: `1px solid ${T.border}`,
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        alignItems: 'flex-start', px: { xs: 4, md: 7 }, py: 5,
        position: 'relative', overflow: 'hidden',
        boxShadow: '0 8px 48px rgba(12,14,18,0.08)',
      }}>
        {/* Specular gloss */}
        <motion.div style={{
          position: 'absolute', inset: 0, borderRadius: '22px', pointerEvents: 'none',
          background: `radial-gradient(circle at ${glX} ${glY}, rgba(255,255,255,0.7) 0%, transparent 55%)`,
        }} />
        {/* Grid texture */}
        <Box sx={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: `linear-gradient(${T.border} 1px,transparent 1px),linear-gradient(90deg,${T.border} 1px,transparent 1px)`,
          backgroundSize: '56px 56px', opacity: 0.4,
        }} />
        {/* Ghost number */}
        <Box sx={{
          position: 'absolute', right: -10, bottom: -24,
          fontFamily: SERIF, fontStyle: 'italic',
          fontSize: '18vw', lineHeight: 1,
          color: 'rgba(12,14,18,0.025)',
          pointerEvents: 'none', userSelect: 'none',
        }}>
          {String(cardIndex + 1).padStart(2, '0')}
        </Box>

        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{
            width: 52, height: 52, borderRadius: '13px', mb: 3.5,
            background: `${service.accent}0e`, border: `1px solid ${service.accent}22`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Typography sx={{ fontFamily: MONO, fontSize: '1.2rem', color: service.accent, lineHeight: 1 }}>
              {service.icon}
            </Typography>
          </Box>

          <Typography sx={{
            fontFamily: MONO, fontSize: '0.52rem', letterSpacing: '0.18em',
            color: service.accent, textTransform: 'uppercase', mb: 1.5,
          }}>
            {service.short}
          </Typography>

          <Typography sx={{
            fontFamily: SERIF, fontStyle: 'italic', fontWeight: 400,
            fontSize: { xs: '2.25rem', md: '3.25rem' },
            color: T.ink, letterSpacing: '-0.03em', lineHeight: 1.0,
          }}>
            {service.title}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 4 }}>
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Typography sx={{ fontFamily: MONO, fontSize: '0.72rem', color: T.goldMid, lineHeight: 1 }}>↓</Typography>
            </motion.div>
            <Typography sx={{
              fontFamily: MONO, fontSize: '0.5rem', letterSpacing: '0.16em',
              color: T.inkGhost, textTransform: 'uppercase',
            }}>
              Scroll to reveal
            </Typography>
          </Box>
        </Box>
      </Box>
    </motion.div>
  );

  /* ─ BACK ─ */
  return (
    <motion.div
      ref={ref}
      style={{ position: 'absolute', inset: 0, rotateX, rotateY, transformStyle: 'preserve-3d' }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <Box sx={{
        width: '100%', height: '100%', background: T.white,
        borderRadius: '22px', border: `1px solid ${service.accent}28`,
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        px: { xs: 4, md: 7 }, py: 5,
        position: 'relative', overflow: 'hidden',
        boxShadow: `0 16px 60px rgba(12,14,18,0.10), 0 0 0 1px ${service.accent}10`,
      }}>
        {/* Specular */}
        <motion.div style={{
          position: 'absolute', inset: 0, borderRadius: '22px', pointerEvents: 'none',
          background: `radial-gradient(circle at ${glX} ${glY}, rgba(255,255,255,0.6) 0%, transparent 55%)`,
        }} />
        {/* Top accent line */}
        <Box sx={{
          position: 'absolute', top: 0, left: 32, right: 32, height: '1.5px',
          background: `linear-gradient(90deg,transparent,${service.accent}66,transparent)`,
        }} />
        {/* Glow blob */}
        <Box sx={{
          position: 'absolute', width: '50%', height: '50%', top: '-15%', right: '-10%',
          borderRadius: '50%',
          background: `radial-gradient(ellipse,${service.accent}07 0%,transparent 70%)`,
          pointerEvents: 'none',
        }} />

        <Box sx={{ position: 'relative', zIndex: 1 }}>
          {/* Icon + title row */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3.5 }}>
            <Box sx={{
              width: 36, height: 36, borderRadius: '9px',
              background: `${service.accent}0e`, border: `1px solid ${service.accent}22`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Typography sx={{ fontFamily: MONO, fontSize: '0.85rem', color: service.accent, lineHeight: 1 }}>
                {service.icon}
              </Typography>
            </Box>
            <Box sx={{ width: 1, height: 18, background: T.border }} />
            <Typography sx={{
              fontFamily: MONO, fontSize: '0.52rem', letterSpacing: '0.16em',
              color: T.inkGhost, textTransform: 'uppercase',
            }}>
              {service.title}
            </Typography>
          </Box>

          <Typography sx={{
            fontFamily: SANS, fontSize: { xs: '0.9375rem', md: '1.0625rem' },
            color: T.inkMid, lineHeight: 1.8, mb: 3.5, maxWidth: 520,
          }}>
            {service.description}
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.125, mb: 4.5 }}>
            {service.detail.map((d, i) => (
              <motion.div
                key={d}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.06 + i * 0.07, duration: 0.35, ease: EASE }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{
                    width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
                    background: `${service.accent}10`, border: `1px solid ${service.accent}28`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Typography sx={{ fontFamily: MONO, fontSize: '0.45rem', color: service.accent, lineHeight: 1 }}>✓</Typography>
                  </Box>
                  <Typography sx={{ fontFamily: SANS, fontSize: '0.875rem', color: T.inkMuted, lineHeight: 1.5 }}>
                    {d}
                  </Typography>
                </Box>
              </motion.div>
            ))}
          </Box>

          <Box
            component={Link}
            href={service.href}
            sx={{
              display: 'inline-flex', alignItems: 'center', gap: 1.25,
              px: '22px', py: '11px', borderRadius: '10px',
              background: `linear-gradient(115deg,${T.goldLight},${T.gold})`,
              textDecoration: 'none',
              boxShadow: `0 4px 16px rgba(184,146,42,0.24)`,
              transition: 'box-shadow 0.2s',
              '&:hover': { boxShadow: `0 6px 22px rgba(184,146,42,0.34)` },
            }}
          >
            <Typography sx={{ fontFamily: SANS, fontWeight: 700, fontSize: '0.875rem', color: T.ink }}>
              Get started
            </Typography>
            <ArrowIcon sx={{ fontSize: '0.9rem', color: T.ink }} />
          </Box>
        </Box>
      </Box>
    </motion.div>
  );
}

/* ══ SCROLL-LOCK ENGINE ══════════════════════════════════
   Strategy:
   - We pin the viewport by setting overflow:hidden on <html>
     and <body> only (no position:fixed — avoids layout shifts)
   - We track accumulated wheel delta; each ±THRESHOLD triggers
     one step advance/retreat
   - When steps are exhausted we release the lock and let the
     browser scroll naturally
   - Touch support via touchstart/touchmove
════════════════════════════════════════════════════════ */

const DELTA_THRESHOLD = 80; // px of accumulated delta per step

export function ServicesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  /* locked state lives in refs to avoid stale closures */
  const lockedRef     = useRef(false);
  const stepRef       = useRef(0);
  const accumRef      = useRef(0);        // accumulated wheel delta
  const touchYRef     = useRef(0);
  const animatingRef  = useRef(false);    // guard during card transition

  const [step, setStep] = useState(0);

  const cardIndex = Math.floor(step / 2);
  const isFront   = step % 2 === 0;
  const service   = SERVICES[cardIndex];

  /* ── lock / unlock ── */
  const lock = useCallback(() => {
    if (lockedRef.current) return;
    lockedRef.current = true;
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
  }, []);

  const unlock = useCallback(() => {
    if (!lockedRef.current) return;
    lockedRef.current = false;
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
  }, []);

  /* ── advance / retreat one step ── */
  const advance = useCallback((dir: 1 | -1) => {
    if (animatingRef.current) return;

    const next = stepRef.current + dir;

    if (next < 0) {
      /* before first step — release lock so page can scroll up */
      unlock();
      stepRef.current = 0;
      accumRef.current = 0;
      return;
    }

    if (next >= TOTAL_STEPS) {
      /* after last step — release lock so page can scroll down */
      unlock();
      stepRef.current = TOTAL_STEPS - 1;
      accumRef.current = 0;
      return;
    }

    animatingRef.current = true;
    stepRef.current = next;
    accumRef.current = 0;
    setStep(next);

    /* block further advances until framer animation settles */
    setTimeout(() => { animatingRef.current = false; }, 540);
  }, [unlock]);

  /* ── wheel handler (passive: false so we can preventDefault) ── */
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (!lockedRef.current) return;
      e.preventDefault();
      e.stopPropagation();

      /* normalise delta across trackpad / mouse */
      const raw = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      accumRef.current += raw;

      if (accumRef.current >  DELTA_THRESHOLD) { advance(1);  }
      if (accumRef.current < -DELTA_THRESHOLD) { advance(-1); }
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    return () => window.removeEventListener('wheel', onWheel);
  }, [advance]);

  /* ── touch support ── */
  useEffect(() => {
    const onTouchStart = (e: TouchEvent) => {
      touchYRef.current = e.touches[0].clientY;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!lockedRef.current) return;
      e.preventDefault();
      const dy = touchYRef.current - e.touches[0].clientY;
      touchYRef.current = e.touches[0].clientY;
      accumRef.current += dy;

      if (accumRef.current >  DELTA_THRESHOLD) { advance(1);  }
      if (accumRef.current < -DELTA_THRESHOLD) { advance(-1); }
    };

    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove',  onTouchMove,  { passive: false });
    return () => {
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove',  onTouchMove);
    };
  }, [advance]);

  /* ── keyboard ── */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!lockedRef.current) return;
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); advance(1);  }
      if (e.key === 'ArrowUp'   || e.key === 'ArrowLeft')  { e.preventDefault(); advance(-1); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [advance]);

  /* ── IntersectionObserver — lock when section fills viewport ── */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          /* lock as soon as the section is ≥50% visible */
          lock();
        } else {
          /* section has left viewport — clean up */
          unlock();
        }
      },
      { threshold: 0.5 }
    );

    obs.observe(el);
    return () => { obs.disconnect(); unlock(); };
  }, [lock, unlock]);

  /* ── direct jump (sidebar nav click) ── */
  const jumpTo = useCallback((ci: number) => {
    const target = ci * 2;
    stepRef.current  = target;
    accumRef.current = 0;
    setStep(target);
  }, []);

  /* ─────────────────────────────────────────────────────── */

  return (
    <Box
      ref={sectionRef}
      sx={{
        py: { xs: 14, md: 20 },
        background: T.bg,
        position: 'relative',
        overflow: 'hidden',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {/* Warm grid */}
      <Box sx={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: `linear-gradient(${T.border} 1px,transparent 1px),linear-gradient(90deg,${T.border} 1px,transparent 1px)`,
        backgroundSize: '64px 64px', opacity: 0.45,
      }} />

      {/* Gold glow */}
      <Box sx={{
        position: 'absolute', width: '60vw', height: '55vw', top: '-15vw', right: '-10vw',
        borderRadius: '50%',
        background: `radial-gradient(ellipse,${T.goldGlow} 0%,transparent 70%)`,
        pointerEvents: 'none',
      }} />

      {/* Grain */}
      <Box sx={{
        position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.02,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: '160px',
      }} />

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1, width: '100%' }}>

        {/* ── Header ── */}
        <Box sx={{ mb: { xs: 7, md: 10 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
            <Box sx={{ width: 26, height: '1px', background: `linear-gradient(90deg,${T.gold},${T.goldLight})` }} />
            <Typography sx={{
              fontFamily: MONO, fontSize: '0.54rem',
              letterSpacing: '0.22em', color: T.goldMid, textTransform: 'uppercase',
            }}>
              What We Do
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 3 }}>
            <Box>
              <Typography sx={{
                fontFamily: SERIF, fontStyle: 'italic', fontWeight: 400,
                fontSize: { xs: '2.5rem', md: '3.75rem' },
                color: T.ink, letterSpacing: '-0.035em', lineHeight: 0.96, mb: 0.5,
              }}>
                Finance services that
              </Typography>
              <Typography sx={{
                fontFamily: SERIF, fontStyle: 'italic', fontWeight: 400,
                fontSize: { xs: '2.5rem', md: '3.75rem' },
                letterSpacing: '-0.035em', lineHeight: 0.96,
                background: `linear-gradient(115deg,${T.goldLight},${T.gold})`,
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>
                move the needle.
              </Typography>
            </Box>
            <Typography sx={{
              fontFamily: SANS, fontSize: '0.9375rem', color: T.inkMuted,
              lineHeight: 1.78, maxWidth: 320, mb: 0.5,
            }}>
              Scroll through each service. Your mouse wheel drives the reveal — the page won't move until you're done.
            </Typography>
          </Box>
        </Box>

        {/* ── Stage ── */}
        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
          gap: { xs: 5, lg: 8 },
          alignItems: 'center',
        }}>

          {/* ─ Left sidebar nav ─ */}
          <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'row', lg: 'column' },
            alignItems: { xs: 'center', lg: 'flex-start' },
            gap: { xs: 1.5, lg: 2 },
            flexShrink: 0,
          }}>
            {SERVICES.map((s, i) => {
              const isActive = i === cardIndex;
              const isDone   = i < cardIndex || (i === cardIndex && !isFront);
              return (
                <Box
                  key={s.title}
                  onClick={() => jumpTo(i)}
                  sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer' }}
                >
                  <motion.div
                    animate={{
                      width: isActive ? 28 : 6,
                      background: isDone
                        ? T.goldMid
                        : isActive
                          ? `linear-gradient(90deg,${T.goldLight},${T.gold})`
                          : T.borderMd,
                    }}
                    transition={{ duration: 0.28, ease: EASE }}
                    style={{ height: 6, borderRadius: 3 }}
                  />
                  <Typography sx={{
                    fontFamily: MONO, fontSize: '0.48rem', letterSpacing: '0.14em',
                    color: isActive ? T.ink : isDone ? T.goldMid : T.inkGhost,
                    textTransform: 'uppercase', whiteSpace: 'nowrap',
                    display: { xs: 'none', lg: 'block' },
                    transition: 'color 0.2s',
                  }}>
                    {s.title}
                  </Typography>
                </Box>
              );
            })}

            {/* Counter */}
            <Box sx={{
              mt: { lg: 2 }, pt: { lg: 2 },
              borderTop: { lg: `1px solid ${T.border}` },
              display: { xs: 'none', lg: 'block' },
            }}>
              <Typography sx={{
                fontFamily: SERIF, fontStyle: 'italic',
                fontSize: '1.5rem', color: T.ink,
                letterSpacing: '-0.02em', lineHeight: 1,
              }}>
                {String(cardIndex + 1).padStart(2, '0')}
              </Typography>
              <Typography sx={{
                fontFamily: MONO, fontSize: '0.46rem',
                letterSpacing: '0.14em', color: T.inkGhost, textTransform: 'uppercase',
              }}>
                / {String(TOTAL).padStart(2, '0')}
              </Typography>
            </Box>
          </Box>

          {/* ─ Card stage ─ */}
          <Box sx={{
            flex: 1,
            maxWidth: 800,
            height: { xs: 460, sm: 500, md: 560 },
            position: 'relative',
            perspective: '1400px',
          }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                style={{ position: 'absolute', inset: 0, transformStyle: 'preserve-3d' }}
                initial={{
                  rotateY: step % 2 === 0 ?  88 : -88,
                  opacity: 0,
                  scale: 0.94,
                }}
                animate={{ rotateY: 0, opacity: 1, scale: 1 }}
                exit={{
                  rotateY: step % 2 === 0 ? -88 :  88,
                  opacity: 0,
                  scale: 0.94,
                }}
                transition={{ duration: 0.46, ease: EASE }}
              >
                <CardFace service={service} face={isFront ? 'front' : 'back'} />
              </motion.div>
            </AnimatePresence>
          </Box>

          {/* ─ Right: up-next peek ─ */}
          <Box sx={{
            display: { xs: 'none', lg: 'flex' },
            flexDirection: 'column', gap: 1.5,
            flexShrink: 0, width: 200,
          }}>
            <Typography sx={{
              fontFamily: MONO, fontSize: '0.5rem', letterSpacing: '0.16em',
              color: T.inkGhost, textTransform: 'uppercase', mb: 0.5,
            }}>
              Up next
            </Typography>

            {SERVICES.slice(cardIndex + 1, cardIndex + 3).map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1 - i * 0.35, x: i * 8 }}
                transition={{ duration: 0.35, ease: EASE }}
              >
                <Box
                  onClick={() => jumpTo(cardIndex + 1 + i)}
                  sx={{
                    px: 2, py: '12px',
                    background: T.white, borderRadius: '12px',
                    border: `1px solid ${T.border}`,
                    boxShadow: '0 2px 8px rgba(12,14,18,0.05)',
                    display: 'flex', alignItems: 'center', gap: 1.5,
                    cursor: 'pointer',
                    transition: 'border-color 0.15s',
                    '&:hover': { borderColor: `${s.accent}40` },
                  }}
                >
                  <Typography sx={{ fontFamily: MONO, fontSize: '0.75rem', color: s.accent, lineHeight: 1 }}>
                    {s.icon}
                  </Typography>
                  <Typography sx={{
                    fontFamily: SERIF, fontStyle: 'italic',
                    fontSize: '0.875rem', color: T.ink,
                    letterSpacing: '-0.01em', lineHeight: 1.2,
                  }}>
                    {s.title}
                  </Typography>
                </Box>
              </motion.div>
            ))}

            {cardIndex >= TOTAL - 1 && (
              <Box sx={{
                px: 2, py: '12px', borderRadius: '12px',
                border: `1px solid ${T.border}`, background: T.offwhite,
              }}>
                <Typography sx={{
                  fontFamily: MONO, fontSize: '0.5rem',
                  letterSpacing: '0.14em', color: T.inkGhost, textTransform: 'uppercase',
                }}>
                  All services explored
                </Typography>
              </Box>
            )}
          </Box>
        </Box>

        {/* ─ Bottom hint ─ */}
        <Box sx={{
          mt: { xs: 5, md: 7 },
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2,
        }}>
          <Box sx={{ flex: 1, maxWidth: 180, height: '1px', background: `linear-gradient(90deg,transparent,${T.border})` }} />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
            <Typography sx={{
              fontFamily: MONO, fontSize: '0.5rem',
              letterSpacing: '0.16em', color: T.inkGhost, textTransform: 'uppercase',
            }}>
              {isFront
                ? 'Scroll to reveal details'
                : cardIndex < TOTAL - 1
                  ? 'Scroll for next service'
                  : 'Scroll to continue'}
            </Typography>
            <motion.div
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Typography sx={{ fontFamily: MONO, fontSize: '0.7rem', color: T.goldMid, lineHeight: 1 }}>↓</Typography>
            </motion.div>
          </Box>
          <Box sx={{ flex: 1, maxWidth: 180, height: '1px', background: `linear-gradient(90deg,${T.border},transparent)` }} />
        </Box>

      </Container>
    </Box>
  );
}