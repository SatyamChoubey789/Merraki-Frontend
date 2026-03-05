'use client';

import {
  useRef, useCallback,
} from 'react';
import { Box, Container, Typography } from '@mui/material';
import {
  motion,
  useMotionValue, useSpring, useTransform,
  useScroll, useAnimationFrame, useInView,
} from 'framer-motion';

/* ══ TOKENS — matches footer blue/white theme ════════════ */
const T = {
  bg:        '#F5F7FB',
  bgCard:    '#FFFFFF',
  ink:       '#0A0A0F',
  inkMid:    '#1E1E2A',
  inkMuted:  '#5A5A72',
  inkFaint:  '#9898AE',
  border:    'rgba(10,10,20,0.08)',
  borderMid: 'rgba(10,10,20,0.12)',

  blue:      '#3B7BF6',
  blueMid:   '#5A92F8',
  blueLight: '#7AABFF',
  bluePale:  '#EDF3FF',
  blueGlow:  'rgba(59,123,246,0.10)',
  blueDim:   'rgba(59,123,246,0.06)',
  blueGrad:  'linear-gradient(135deg, #3B7BF6 0%, #7AABFF 100%)',
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
    initials: 'SI', accent: '#0057CC',
  },
  {
    quote: 'The Excel templates are institutional quality. I use the valuation model for every client pitch. Saves me 6 hours per engagement.',
    name: 'Vikram Joshi', company: 'NovaMed', role: 'CFO',
    initials: 'VJ', accent: '#3B7BF6',
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
    initials: 'MP', accent: '#1E40AF',
  },
  {
    quote: 'Onboarded in one afternoon. The runway calculator is now open on my screen every single day.',
    name: 'Rohan Das', company: 'NexaAI', role: 'CEO',
    initials: 'RD', accent: '#5A92F8',
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
    initials: 'TS', accent: '#3B7BF6',
  },
];

/* 3 horizontal rows with different card sets */
const ROW_A = [TESTIMONIALS[0], TESTIMONIALS[1], TESTIMONIALS[2], TESTIMONIALS[3], TESTIMONIALS[4],  TESTIMONIALS[5]];
const ROW_B = [TESTIMONIALS[6], TESTIMONIALS[7], TESTIMONIALS[8], TESTIMONIALS[9], TESTIMONIALS[10], TESTIMONIALS[11]];
const ROW_C = [TESTIMONIALS[3], TESTIMONIALS[0], TESTIMONIALS[9], TESTIMONIALS[6], TESTIMONIALS[1],  TESTIMONIALS[7]];

const ROWS = [
  { cards: ROW_A, speed: 22, dir: 1  as 1 | -1, initialOffset: 0    },
  { cards: ROW_B, speed: 28, dir: -1 as 1 | -1, initialOffset: -320 },
  { cards: ROW_C, speed: 18, dir: 1  as 1 | -1, initialOffset: -160 },
];

/* ══ TESTIMONIAL CARD ════════════════════════════════════ */
function TestimonialCard({ t }: { t: typeof TESTIMONIALS[0] }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 260, damping: 24 });
  const sy = useSpring(my, { stiffness: 260, damping: 24 });
  const rotX = useTransform(sy, [-0.5, 0.5], ['5deg', '-5deg']);
  const rotY = useTransform(sx, [-0.5, 0.5], ['-5deg', '5deg']);
  const glX  = useTransform(sx, [-0.5, 0.5], ['10%', '90%']);
  const glY  = useTransform(sy, [-0.5, 0.5], ['10%', '90%']);
  const lift = useTransform(
    sx, v => `0 ${6 + Math.abs(v) * 16}px ${20 + Math.abs(v) * 28}px rgba(59,123,246,${0.07 + Math.abs(v) * 0.09})`
  );

  const onMove  = useCallback((e: React.MouseEvent) => {
    const r = cardRef.current?.getBoundingClientRect();
    if (!r) return;
    mx.set((e.clientX - r.left) / r.width  - 0.5);
    my.set((e.clientY - r.top)  / r.height - 0.5);
  }, [mx, my]);
  const onLeave = useCallback(() => { mx.set(0); my.set(0); }, [mx, my]);

  return (
    <motion.div style={{ perspective: 1000, marginRight: 12, flexShrink: 0 }}>
      <motion.div
        ref={cardRef}
        style={{ rotateX: rotX, rotateY: rotY, transformStyle: 'preserve-3d', boxShadow: lift }}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        whileHover={{ z: 12, transition: { type: 'spring', stiffness: 380, damping: 28 } }}
      >
        <Box sx={{
          background: T.bgCard,
          borderRadius: '14px',
          border: `1px solid ${T.border}`,
          p: '14px 16px',
          width: 260,
          position: 'relative',
          overflow: 'hidden',
          transition: 'border-color 0.25s ease',
          '&:hover': { borderColor: `rgba(59,123,246,0.22)` },
        }}>
          {/* Moving specular */}
          <motion.div style={{
            position: 'absolute', inset: 0, borderRadius: '16px', pointerEvents: 'none',
            background: `radial-gradient(circle at ${glX} ${glY}, rgba(255,255,255,0.72) 0%, transparent 55%)`,
          }} />

          {/* Blue top accent line */}
          <Box sx={{
            position: 'absolute', top: 0, left: 20, right: 20, height: '1.5px',
            background: `linear-gradient(90deg, transparent, ${t.accent}60, transparent)`,
          }} />

          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Typography sx={{
              fontFamily: SERIF, fontSize: '1.6rem', lineHeight: 0.8,
              color: T.blueLight, mb: 0.5, display: 'block', opacity: 0.7,
            }}>"</Typography>

            <Typography sx={{
              fontFamily: SANS, fontWeight: 400,
              fontSize: '0.775rem', color: T.inkMid,
              lineHeight: 1.7, mb: 1.5,
            }}>
              {t.quote}
            </Typography>

            <Box sx={{
              display: 'flex', alignItems: 'center', gap: 1,
              pt: '10px', borderTop: `1px solid ${T.border}`,
            }}>
              <Box sx={{
                width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                background: `linear-gradient(135deg, ${t.accent}cc, ${t.accent})`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: `0 2px 8px ${t.accent}28`,
              }}>
                <Typography sx={{
                  fontFamily: MONO, fontWeight: 700,
                  fontSize: '0.5rem', color: '#fff', letterSpacing: '0.04em',
                }}>
                  {t.initials}
                </Typography>
              </Box>

              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{
                  fontFamily: SANS, fontWeight: 600,
                  fontSize: '0.75rem', color: T.ink, lineHeight: 1.2,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {t.name}
                </Typography>
                <Typography sx={{
                  fontFamily: SANS, fontSize: '0.65rem',
                  color: T.inkMuted, lineHeight: 1.3,
                }}>
                  {t.role} · {t.company}
                </Typography>
              </Box>

              <Box sx={{
                width: 5, height: 5, borderRadius: '50%',
                background: T.blueGrad, opacity: 0.6, flexShrink: 0,
              }} />
            </Box>
          </Box>
        </Box>
      </motion.div>
    </motion.div>
  );
}

/* ══ INFINITE HORIZONTAL ROW ═════════════════════════════ */
function InfiniteRow({
  cards, speed, dir, initialOffset,
}: {
  cards: typeof TESTIMONIALS;
  speed: number;
  dir: 1 | -1;
  initialOffset: number;
}) {
  const autoX = useMotionValue(initialOffset);
  /* each card is ~272px (260 + 12 gap) */
  const wrapWidth = cards.length * 272;
  const looped = [...cards, ...cards, ...cards, ...cards];

  useAnimationFrame((_, delta) => {
    const pxPerFrame = (speed / 1000) * delta * dir;
    const next = autoX.get() + pxPerFrame;

    if (dir === 1  && next > 0)           autoX.set(next - wrapWidth);
    if (dir === -1 && next < -wrapWidth)  autoX.set(next + wrapWidth);
    else autoX.set(next);
  });

  return (
    <Box sx={{ overflow: 'hidden', position: 'relative', width: '100%' }}>
      <motion.div
        style={{
          x: autoX,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'stretch',
        }}
      >
        {looped.map((t, i) => (
          <TestimonialCard key={`${t.name}-${i}`} t={t} />
        ))}
      </motion.div>
    </Box>
  );
}

/* ══ SECTION HEADER ══════════════════════════════════════ */
function SectionHeader({ inView }: { inView: boolean }) {
  return (
    <Box sx={{ textAlign: 'center', mb: { xs: 8, md: 12 } }}>



      <Box sx={{ overflow: 'hidden', mb: 0.5 }}>
        <motion.div
          initial={{ y: '108%' }}
          animate={inView ? { y: '0%' } : {}}
          transition={{ duration: 0.75, delay: 0.08, ease: EASE }}
        >
          <Typography sx={{
            fontFamily: SERIF,
            fontWeight: 400,
            fontSize: { xs: '2.25rem', sm: '3rem', md: '4.25rem' },
            color: T.ink,
            letterSpacing: '-0.034em',
            lineHeight: 1.0,
          }}>
            Trusted by founders
          </Typography>
        </motion.div>
      </Box>

      <Box sx={{ overflow: 'hidden', mb: 3 }}>
        <motion.div
          initial={{ y: '108%' }}
          animate={inView ? { y: '0%' } : {}}
          transition={{ duration: 0.75, delay: 0.16, ease: EASE }}
        >
          <Typography sx={{
            fontFamily: SERIF,
            fontWeight: 400,
            fontSize: { xs: '2.25rem', sm: '3rem', md: '4.25rem' },
            letterSpacing: '-0.034em',
            lineHeight: 1.0,
            background: T.blueGrad,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            across India.
          </Typography>
        </motion.div>
      </Box>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.28, ease: EASE }}
      >
        <Typography sx={{
          fontFamily: SANS, fontSize: '0.9375rem',
          color: T.inkMuted, lineHeight: 1.75, maxWidth: 420, mx: 'auto',
        }}>
          300+ founders rely on Merraki for models that close rounds and dashboards that drive decisions.
        </Typography>
      </motion.div>
    </Box>
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
        py: { xs: 12, md: 18 },
        background: T.bg,
        position: 'relative',
        overflow: 'hidden',
        borderTop: `1px solid ${T.border}`,
      }}
    >
      {/* Ambient glows */}
      <Box sx={{
        position: 'absolute', width: '80vw', height: '50vw',
        top: '-10vw', left: '10vw', borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(59,123,246,0.07) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />
      <Box sx={{
        position: 'absolute', width: '40vw', height: '35vw',
        bottom: '-5%', right: '-5%', borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(59,123,246,0.05) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Dot grid */}
      <Box sx={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: `radial-gradient(circle, rgba(59,123,246,0.07) 1px, transparent 1px)`,
        backgroundSize: '28px 28px',
      }} />

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>

        <div ref={headerRef}>
          <SectionHeader inView={inView} />
        </div>

        {/* Horizontal row wall */}
        <Box sx={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 1.5 }}>

          {/* Left fade */}
          <Box sx={{
            position: 'absolute', top: 0, bottom: 0, left: 0,
            width: { xs: 40, md: 80 }, zIndex: 2, pointerEvents: 'none',
            background: `linear-gradient(to right, ${T.bg} 0%, transparent 100%)`,
          }} />
          {/* Right fade */}
          <Box sx={{
            position: 'absolute', top: 0, bottom: 0, right: 0,
            width: { xs: 40, md: 80 }, zIndex: 2, pointerEvents: 'none',
            background: `linear-gradient(to left, ${T.bg} 0%, transparent 100%)`,
          }} />

          {ROWS.map((row, ri) => (
            <InfiniteRow
              key={ri}
              cards={row.cards}
              speed={row.speed}
              dir={row.dir}
              initialOffset={row.initialOffset}
            />
          ))}
        </Box>

      </Container>
    </Box>
  );
}