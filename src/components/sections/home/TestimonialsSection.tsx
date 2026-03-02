'use client';

import {
  useRef, useCallback, useEffect, useState,
} from 'react';
import { Box, Container, Typography } from '@mui/material';
import {
  motion,
  useMotionValue, useSpring, useTransform,
  useScroll, useAnimationFrame, useInView,
} from 'framer-motion';

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
  borderMd:  '#D4D0C8',
  gold:      '#B8922A',
  goldMid:   '#C9A84C',
  goldLight: '#DDB96A',
  goldPale:  '#F0D898',
  goldGlow:  'rgba(184,146,42,0.10)',
  goldDim:   'rgba(184,146,42,0.06)',
};
const SERIF = '"Instrument Serif","Playfair Display",Georgia,serif';
const SANS  = '"DM Sans","Mona Sans",system-ui,sans-serif';
const MONO  = '"DM Mono","JetBrains Mono",ui-monospace,monospace';
const EASE  = [0.16, 1, 0.3, 1] as const;

/* ══ DATA ════════════════════════════════════════════════ */
const TESTIMONIALS = [
  {
    quote: 'Parag built us a 3-statement model that our Series A investors called the clearest they had ever seen. Closed the round in 6 weeks.',
    name: 'Arjun Mehta', company: 'EduStack', role: 'Founder',
    initials: 'AM', accent: '#2D5BE3',
  },
  {
    quote: 'Khyati built our financial dashboard from scratch. Now our entire team tracks the same numbers and we make decisions 3× faster.',
    name: 'Priya Nair', company: 'GreenRoute', role: 'CEO',
    initials: 'PN', accent: '#0D7A5F',
  },
  {
    quote: 'The breakeven and runway calculators alone saved me from a very expensive hiring mistake. Worth every rupee.',
    name: 'Rahul Sharma', company: 'RetailOS', role: 'Co-Founder',
    initials: 'RS', accent: '#6D28D9',
  },
  {
    quote: 'I used the Founder Test and booked a consultation the same day. Parag helped me see exactly where I was leaking cash. Absolute game changer.',
    name: 'Sneha Iyer', company: 'CraftHaus', role: 'Founder',
    initials: 'SI', accent: '#A35400',
  },
  {
    quote: 'The Excel templates are institutional quality. I use the valuation model for every client pitch. Saves me 6 hours per engagement.',
    name: 'Vikram Joshi', company: 'NovaMed', role: 'CFO',
    initials: 'VJ', accent: '#9D174D',
  },
  {
    quote: 'Working with Merraki is like having a CFO on call. They understand the startup context, not just the numbers.',
    name: 'Divya Krishnan', company: 'SolarPath', role: 'MD',
    initials: 'DK', accent: '#1D4ED8',
  },
  {
    quote: 'Their cash flow model exposed a 45-day receivables gap I had completely missed. Fixed it before it became a crisis.',
    name: 'Karan Batra', company: 'SwiftOps', role: 'Founder',
    initials: 'KB', accent: '#065F46',
  },
  {
    quote: "Presented Merraki's unit economics model to Sequoia. The partner said it was the most complete early-stage model he'd seen all year.",
    name: 'Meera Patel', company: 'HealthSync', role: 'Co-Founder',
    initials: 'MP', accent: '#B45309',
  },
  {
    quote: 'Onboarded in one afternoon. The runway calculator is now open on my screen every single day.',
    name: 'Rohan Das', company: 'NexaAI', role: 'CEO',
    initials: 'RD', accent: '#6D28D9',
  },
  {
    quote: 'Incredible depth on the DCF model. We used it for our Series B and investors barely had a follow-up question on the numbers.',
    name: 'Anjali Rao', company: 'BioLoop', role: 'Founder',
    initials: 'AR', accent: '#0D7A5F',
  },
  {
    quote: 'Merraki helped us build scenario models for 3 different growth paths. Finally had real data to choose between them.',
    name: 'Suresh Verma', company: 'CloudMesh', role: 'CTO',
    initials: 'SV', accent: '#1D4ED8',
  },
  {
    quote: 'The P&L templates cut our month-end close from 5 days to 1. Our investors notice the difference immediately.',
    name: 'Tanvi Shah', company: 'UrbanFarm', role: 'Founder',
    initials: 'TS', accent: '#9D174D',
  },
];

/* ── Column splits ─────────────────────────────────────── */
const COL_A = [TESTIMONIALS[0],  TESTIMONIALS[3], TESTIMONIALS[6], TESTIMONIALS[9]];
const COL_B = [TESTIMONIALS[1],  TESTIMONIALS[4], TESTIMONIALS[7], TESTIMONIALS[10]];
const COL_C = [TESTIMONIALS[2],  TESTIMONIALS[5], TESTIMONIALS[8], TESTIMONIALS[11]];
const COLUMNS = [
  { cards: COL_A, speed: 26,  dir: 1,  initialOffset: 0    },   // slow ↓
  { cards: COL_B, speed: 38,  dir: -1, initialOffset: -200 },   // medium ↑
  { cards: COL_C, speed: 20,  dir: 1,  initialOffset: -80  },   // slow ↓
];

/* ══ FLOATING GOLD ORB ═══════════════════════════════════ */
function GoldOrb({ style, delay, duration }: {
  style: React.CSSProperties;
  delay: number;
  duration: number;
}) {
  return (
    <motion.div
      style={{ position: 'absolute', pointerEvents: 'none', ...style }}
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{
        opacity:  [0, 1, 0.7, 1, 0],
        scale:    [0.6, 1, 0.92, 1.04, 0.96],
        y:        [0, -30, -14, -36, 0],
      }}
      transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
}

/* ══ SINGLE TESTIMONIAL CARD ═════════════════════════════ */
function TestimonialCard({ t, index }: { t: typeof TESTIMONIALS[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 260, damping: 24 });
  const sy = useSpring(my, { stiffness: 260, damping: 24 });
  const rotX = useTransform(sy, [-0.5, 0.5], ['6deg', '-6deg']);
  const rotY = useTransform(sx, [-0.5, 0.5], ['-6deg', '6deg']);
  const glX  = useTransform(sx, [-0.5, 0.5], ['10%', '90%']);
  const glY  = useTransform(sy, [-0.5, 0.5], ['10%', '90%']);
  const lift = useTransform(
    sx, v => `0 ${8 + Math.abs(v) * 22}px ${24 + Math.abs(v) * 36}px rgba(12,14,18,${0.055 + Math.abs(v) * 0.07})`
  );

  const onMove  = useCallback((e: React.MouseEvent) => {
    const r = cardRef.current?.getBoundingClientRect();
    if (!r) return;
    mx.set((e.clientX - r.left) / r.width  - 0.5);
    my.set((e.clientY - r.top)  / r.height - 0.5);
  }, [mx, my]);
  const onLeave = useCallback(() => { mx.set(0); my.set(0); }, [mx, my]);

  return (
    <motion.div style={{ perspective: 1000, marginBottom: 14 }}>
      <motion.div
        ref={cardRef}
        style={{ rotateX: rotX, rotateY: rotY, transformStyle: 'preserve-3d', boxShadow: lift }}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        whileHover={{ z: 16, transition: { type: 'spring', stiffness: 380, damping: 28 } }}
      >
        <Box sx={{
          background: T.white,
          borderRadius: '18px',
          border: `1px solid ${T.border}`,
          p: '22px 24px',
          position: 'relative',
          overflow: 'hidden',
          transition: 'border-color 0.25s ease',
          '&:hover': { borderColor: `${t.accent}32` },
        }}>
          {/* Moving specular */}
          <motion.div style={{
            position: 'absolute', inset: 0, borderRadius: '18px', pointerEvents: 'none',
            background: `radial-gradient(circle at ${glX} ${glY}, rgba(255,255,255,0.68) 0%, transparent 56%)`,
          }} />

          {/* Accent top line */}
          <Box sx={{
            position: 'absolute', top: 0, left: 20, right: 20, height: '1.5px',
            background: `linear-gradient(90deg, transparent, ${t.accent}50, transparent)`,
          }} />

          {/* Content */}
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            {/* Gold quote mark */}
            <Typography sx={{
              fontFamily: SERIF, fontSize: '2.5rem', lineHeight: 0.8,
              color: T.goldLight, mb: 1, display: 'block',
              opacity: 0.6,
            }}>"</Typography>

            <Typography sx={{
              fontFamily: SANS, fontWeight: 400,
              fontSize: '0.875rem', color: T.inkMid,
              lineHeight: 1.8, mb: 2.5,
            }}>
              {t.quote}
            </Typography>

            <Box sx={{
              display: 'flex', alignItems: 'center', gap: 1.5,
              pt: '14px', borderTop: `1px solid ${T.border}`,
            }}>
              {/* Avatar */}
              <Box sx={{
                width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                background: `linear-gradient(135deg, ${t.accent}dd, ${t.accent})`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: `0 2px 10px ${t.accent}30`,
              }}>
                <Typography sx={{
                  fontFamily: MONO, fontWeight: 700,
                  fontSize: '0.6rem', color: '#fff', letterSpacing: '0.04em',
                }}>
                  {t.initials}
                </Typography>
              </Box>
              <Box>
                <Typography sx={{
                  fontFamily: SANS, fontWeight: 600,
                  fontSize: '0.8125rem', color: T.ink, lineHeight: 1.25,
                }}>
                  {t.name}
                </Typography>
                <Typography sx={{
                  fontFamily: SANS, fontSize: '0.725rem',
                  color: T.inkMuted, lineHeight: 1.3,
                }}>
                  {t.role} · {t.company}
                </Typography>
              </Box>

              {/* Accent dot */}
              <Box sx={{ ml: 'auto' }}>
                <Box sx={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: t.accent, opacity: 0.5,
                }} />
              </Box>
            </Box>
          </Box>
        </Box>
      </motion.div>
    </motion.div>
  );
}

/* ══ INFINITE SCROLL COLUMN ══════════════════════════════ */
function InfiniteColumn({
  cards,
  speed,
  dir,
  initialOffset,
  parallaxProgress,
  parallaxAmount,
}: {
  cards: typeof TESTIMONIALS;
  speed: number;
  dir: 1 | -1;
  initialOffset: number;
  parallaxProgress: any;
  parallaxAmount: number;
}) {
  const autoY = useMotionValue(initialOffset);

  /* Gentle page parallax */
  const rawParallax = useTransform(parallaxProgress, [0, 1], [0, parallaxAmount]);
  const smoothParallax = useSpring(rawParallax, { stiffness: 50, damping: 20 });

  /* Quadruple for seamless loop with no visible seam */
  const looped = [...cards, ...cards, ...cards, ...cards];

  useAnimationFrame((_, delta) => {
    const pxPerFrame = (speed / 1000) * delta * dir;
    autoY.set(autoY.get() + pxPerFrame);

    /* Reset position — each card is ~170px, 4 cards = 680px,
       so wrap at every 680px block to keep it seamless */
    const wrapHeight = cards.length * 184; // approximate card height + gap
    const current = autoY.get();
    if (dir === 1 && current > 0)           autoY.set(current - wrapHeight);
    if (dir === -1 && current < -wrapHeight) autoY.set(current + wrapHeight);
  });

  return (
    <Box sx={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
      <motion.div style={{ y: smoothParallax }}>
        <motion.div style={{ y: autoY }}>
          {looped.map((t, i) => (
            <TestimonialCard key={`${t.name}-${i}`} t={t} index={i} />
          ))}
        </motion.div>
      </motion.div>
    </Box>
  );
}

/* ══ HEADER COMPONENT ════════════════════════════════════ */
function SectionHeader({ inView }: { inView: boolean }) {
  return (
    <Box sx={{ textAlign: 'center', mb: { xs: 8, md: 14 } }}>

      {/* Eyebrow */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.55, ease: EASE }}
      >
        <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
          <motion.div
            initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
            style={{ transformOrigin: 'right' }}
          >
            <Box sx={{ width: 28, height: 1, background: `linear-gradient(270deg,${T.gold},${T.goldLight})` }} />
          </motion.div>
          <Typography sx={{
            fontFamily: MONO, fontSize: '0.54rem',
            letterSpacing: '0.22em', color: T.goldMid, textTransform: 'uppercase',
          }}>
            Client Stories
          </Typography>
          <motion.div
            initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.15, ease: EASE }}
            style={{ transformOrigin: 'left' }}
          >
            <Box sx={{ width: 28, height: 1, background: `linear-gradient(90deg,${T.gold},${T.goldLight})` }} />
          </motion.div>
        </Box>
      </motion.div>

      {/* Headline */}
      <Box sx={{ overflow: 'hidden', mb: 0.5 }}>
        <motion.div
          initial={{ y: '108%' }}
          animate={inView ? { y: '0%' } : {}}
          transition={{ duration: 0.75, delay: 0.08, ease: EASE }}
        >
          <Typography sx={{
            fontFamily: SERIF, fontStyle: 'italic', fontWeight: 400,
            fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.75rem' },
            color: T.ink, letterSpacing: '-0.034em', lineHeight: 1.0,
          }}>
            Trusted by founders
          </Typography>
        </motion.div>
      </Box>

      <Box sx={{ overflow: 'hidden', mb: 3.5 }}>
        <motion.div
          initial={{ y: '108%' }}
          animate={inView ? { y: '0%' } : {}}
          transition={{ duration: 0.75, delay: 0.16, ease: EASE }}
        >
          <Typography sx={{
            fontFamily: SERIF, fontStyle: 'italic', fontWeight: 400,
            fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.75rem' },
            letterSpacing: '-0.034em', lineHeight: 1.0,
            background: `linear-gradient(115deg, ${T.goldLight} 0%, ${T.gold} 55%)`,
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            across India.
          </Typography>
        </motion.div>
      </Box>
    </Box>
  );
}

/* ══ FOOTER STATS ════════════════════════════════════════ */
function FooterStats({ inView }: { inView: boolean }) {
  const stats = [
    { val: '₹500Cr+', label: 'Revenue modelled' },
    { val: '120+',    label: 'Engagements'       },
    { val: '4.9 / 5', label: 'Avg satisfaction'  },
    { val: '6 wks',   label: 'Avg fundraise'     },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: 0.55, duration: 0.6, ease: EASE }}
    >
      <Box sx={{
        mt: { xs: 8, md: 12 }, pt: 5,
        borderTop: `1px solid ${T.border}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: 0,
      }}>
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.62 + i * 0.08, duration: 0.5, ease: EASE }}
          >
            <Box sx={{
              px: { xs: 3, md: 5 }, py: 1,
              textAlign: 'center',
              borderLeft: i > 0 ? `1px solid ${T.border}` : 'none',
            }}>
              <Typography sx={{
                fontFamily: SERIF, fontStyle: 'italic', fontWeight: 400,
                fontSize: { xs: '1.35rem', md: '1.75rem' },
                color: T.ink, letterSpacing: '-0.025em',
                lineHeight: 1, mb: 0.5,
              }}>
                {s.val}
              </Typography>
              <Typography sx={{
                fontFamily: MONO, fontSize: '0.48rem',
                letterSpacing: '0.15em', color: T.inkGhost,
                textTransform: 'uppercase',
              }}>
                {s.label}
              </Typography>
            </Box>
          </motion.div>
        ))}
      </Box>
    </motion.div>
  );
}

/* ══ MAIN EXPORT ═════════════════════════════════════════ */
export function TestimonialsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef  = useRef<HTMLDivElement>(null);
  const inView     = useInView(headerRef, { once: true, amount: 0.2 });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  return (
    <Box
      ref={sectionRef}
      sx={{
        py: { xs: 14, md: 20 },
        background: T.bg,
        position: 'relative',
        overflow: 'hidden',
      }}
    >

      {/* ── Layered Background ── */}

      {/* Warm grid */}
      <Box sx={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: `
          linear-gradient(${T.border} 1px, transparent 1px),
          linear-gradient(90deg, ${T.border} 1px, transparent 1px)
        `,
        backgroundSize: '72px 72px',
        opacity: 0.45,
      }} />

      {/* Large centre bloom */}
      <Box sx={{
        position: 'absolute', width: '80vw', height: '70vw',
        top: '5%', left: '10%', borderRadius: '50%',
        background: `radial-gradient(ellipse, ${T.goldGlow} 0%, transparent 65%)`,
        pointerEvents: 'none',
      }} />

      {/* Secondary bottom-left bloom */}
      <Box sx={{
        position: 'absolute', width: '40vw', height: '35vw',
        bottom: '-5%', left: '-8%', borderRadius: '50%',
        background: `radial-gradient(ellipse, rgba(45,91,227,0.05) 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      {/* Bottom-right bloom */}
      <Box sx={{
        position: 'absolute', width: '35vw', height: '30vw',
        bottom: '-8%', right: '-5%', borderRadius: '50%',
        background: `radial-gradient(ellipse, rgba(109,40,217,0.05) 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      {/* Animated floating orbs */}
      <GoldOrb
        style={{
          width: 240, height: 240, top: '12%', left: '3%',
          background: `radial-gradient(circle, ${T.goldGlow} 0%, transparent 70%)`,
        }}
        delay={0} duration={14}
      />
      <GoldOrb
        style={{
          width: 180, height: 180, top: '55%', right: '4%',
          background: `radial-gradient(circle, rgba(45,91,227,0.07) 0%, transparent 70%)`,
        }}
        delay={3.5} duration={11}
      />
      <GoldOrb
        style={{
          width: 140, height: 140, bottom: '18%', left: '18%',
          background: `radial-gradient(circle, rgba(109,40,217,0.06) 0%, transparent 70%)`,
        }}
        delay={6} duration={16}
      />
      <GoldOrb
        style={{
          width: 100, height: 100, top: '30%', right: '22%',
          background: `radial-gradient(circle, rgba(184,146,42,0.08) 0%, transparent 70%)`,
        }}
        delay={1.8} duration={9}
      />
      <GoldOrb
        style={{
          width: 160, height: 160, top: '72%', left: '48%',
          background: `radial-gradient(circle, rgba(13,122,95,0.06) 0%, transparent 70%)`,
        }}
        delay={4.5} duration={12}
      />

      {/* Grain */}
      <Box sx={{
        position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.022,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: '160px',
      }} />

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>

        {/* ── Header ── */}
        <div ref={headerRef}>
          <SectionHeader inView={inView} />
        </div>

        {/* ── Card Wall ── */}
        <Box sx={{ position: 'relative' }}>

          {/* TOP fade — cards dissolve into background */}
          <Box sx={{
            position: 'absolute', top: 0, left: 0, right: 0,
            height: { xs: 80, md: 120 }, zIndex: 2, pointerEvents: 'none',
            background: `linear-gradient(to bottom, ${T.bg} 0%, ${T.bg}00 100%)`,
          }} />

          {/* BOTTOM fade */}
          <Box sx={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            height: { xs: 100, md: 160 }, zIndex: 2, pointerEvents: 'none',
            background: `linear-gradient(to top, ${T.bg} 0%, ${T.bg}00 100%)`,
          }} />

          {/* LEFT fade — for edge bleed effect */}
          <Box sx={{
            position: 'absolute', top: 0, bottom: 0, left: 0,
            width: { xs: 20, md: 40 }, zIndex: 2, pointerEvents: 'none',
            background: `linear-gradient(to right, ${T.bg} 0%, transparent 100%)`,
          }} />

          {/* RIGHT fade */}
          <Box sx={{
            position: 'absolute', top: 0, bottom: 0, right: 0,
            width: { xs: 20, md: 40 }, zIndex: 2, pointerEvents: 'none',
            background: `linear-gradient(to left, ${T.bg} 0%, transparent 100%)`,
          }} />

          {/* 3 columns */}
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: '1fr 1fr 1fr' },
            gap: { xs: 1.5, md: 2.5 },
            height: { xs: 520, sm: 640, md: 760 },
            overflow: 'hidden',
            alignItems: 'start',
            /* Slight vertical padding so top-fade doesn't cut first card header */
            pt: '20px', pb: '20px',
          }}>
            {COLUMNS.map((col, ci) => (
              <InfiniteColumn
                key={ci}
                cards={col.cards}
                speed={col.speed}
                dir={col.dir as 1 | -1}
                initialOffset={col.initialOffset}
                parallaxProgress={scrollYProgress}
                parallaxAmount={ci === 1 ? -120 : ci === 0 ? 80 : 100}
              />
            ))}
          </Box>
        </Box>

        {/* ── Footer stats ── */}
        <FooterStats inView={inView} />

      </Container>
    </Box>
  );
}