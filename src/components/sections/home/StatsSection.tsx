'use client';

import { useRef } from 'react';
import { Box, Container, Typography } from '@mui/material';
import { motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion';

const T = {
  bg:        '#F5F7FB',   // bluish-white bg matching footer bgSection
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

const stats = [
  {
    value: "250+",
    label: "Brands Launched",
    sub: "From idea to market-ready",
    icon: "◈",
    color: "#3B7BF6",
    colorLight: "#EDF3FF",
  },
  {
    value: "98%",
    label: "Client Satisfaction",
    sub: "Consistently above industry avg",
    icon: "◉",
    color: "#2563EB",
    colorLight: "#EFF6FF",
  },
  {
    value: "4.9★",
    label: "Average Rating",
    sub: "Across all engagements",
    icon: "◎",
    color: "#1D4ED8",
    colorLight: "#EEF2FF",
  },
];

/* ── Animated number counter ── */
function AnimatedNumber({ value, inView }: { value: string; inView: boolean }) {
  const numericPart = value.replace(/[^0-9.]/g, '');
  const suffix = value.replace(/[0-9.]/g, '');
  const target = parseFloat(numericPart);

  const motionVal = useMotionValue(0);
  const spring = useSpring(motionVal, { stiffness: 60, damping: 18, mass: 1.2 });

  if (inView) motionVal.set(target);

  return (
    <motion.span>
      <motion.span>{spring.get().toFixed(numericPart.includes('.') ? 1 : 0)}</motion.span>
      {suffix}
    </motion.span>
  );
}

/* ── Stat card with 3D tilt + animated reveal ── */
function StatCard({ stat, index, inView }: {
  stat: typeof stats[0];
  index: number;
  inView: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 220, damping: 22 });
  const sy = useSpring(my, { stiffness: 220, damping: 22 });
  const rotX = useTransform(sy, [-0.5, 0.5], ['8deg', '-8deg']);
  const rotY = useTransform(sx, [-0.5, 0.5], ['-8deg', '8deg']);
  const glX  = useTransform(sx, [-0.5, 0.5], ['0%', '100%']);
  const glY  = useTransform(sy, [-0.5, 0.5], ['0%', '100%']);

  const handleMove = (e: React.MouseEvent) => {
    const r = cardRef.current?.getBoundingClientRect();
    if (!r) return;
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const handleLeave = () => { mx.set(0); my.set(0); };

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, scale: 0.92 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.75, delay: 0.15 + index * 0.14, ease: EASE }}
      style={{ perspective: 1000 }}
    >
      <motion.div
        ref={cardRef}
        style={{ rotateX: rotX, rotateY: rotY, transformStyle: 'preserve-3d' }}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        whileHover={{ z: 20, transition: { type: 'spring', stiffness: 300, damping: 24 } }}
      >
        <Box sx={{
          position: 'relative',
          background: T.bgCard,
          borderRadius: '20px',
          border: `1px solid ${T.border}`,
          p: { xs: '28px 28px', md: '36px 32px' },
          overflow: 'hidden',
          cursor: 'default',
          transition: 'border-color 0.3s ease',
          '&:hover': {
            borderColor: `rgba(59,123,246,0.3)`,
            boxShadow: `0 20px 60px ${T.blueGlow}, 0 4px 20px rgba(0,0,0,0.06)`,
          },
        }}>

          {/* Moving specular sheen */}
          <motion.div style={{
            position: 'absolute', inset: 0, borderRadius: '20px', pointerEvents: 'none',
            background: `radial-gradient(circle at ${glX} ${glY}, rgba(255,255,255,0.85) 0%, transparent 55%)`,
          }} />

          {/* Top blue accent bar */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.3 + index * 0.14, ease: EASE }}
            style={{ transformOrigin: 'left' }}
          >
            <Box sx={{
              position: 'absolute', top: 0, left: 24, right: 24, height: '2px',
              background: T.blueGrad, borderRadius: '0 0 4px 4px',
            }} />
          </motion.div>

          {/* Background number ghost */}
          <Box sx={{
            position: 'absolute', bottom: -20, right: -8,
            fontFamily: MONO, fontWeight: 800,
            fontSize: { xs: '5rem', md: '7rem' },
            color: `rgba(59,123,246,0.04)`,
            lineHeight: 1, userSelect: 'none', pointerEvents: 'none',
            letterSpacing: '-0.04em',
          }}>
            {stat.value}
          </Box>

          {/* Icon pill */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.4 + index * 0.14, type: 'spring', stiffness: 400, damping: 20 }}
          >
            <Box sx={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: 40, height: 40, borderRadius: '12px',
              background: T.bluePale,
              border: `1px solid rgba(59,123,246,0.15)`,
              mb: 3,
              fontSize: '1.1rem',
              color: T.blue,
            }}>
              {stat.icon}
            </Box>
          </motion.div>

          {/* Animated value */}
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.25 + index * 0.14, ease: EASE }}
            >
              <Typography sx={{
                fontFamily: MONO, fontWeight: 800,
                fontSize: { xs: '2.75rem', md: '3.5rem' },
                letterSpacing: '-0.03em',
                lineHeight: 1,
                background: T.blueGrad,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                mb: 1.5,
                display: 'block',
              }}>
                {stat.value}
              </Typography>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -12 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.38 + index * 0.14, ease: EASE }}
            >
              <Typography sx={{
                fontFamily: SANS, fontWeight: 600,
                fontSize: '1rem', color: T.ink,
                letterSpacing: '-0.01em', mb: 0.5,
              }}>
                {stat.label}
              </Typography>
              <Typography sx={{
                fontFamily: SANS, fontSize: '0.8125rem',
                color: T.inkMuted, lineHeight: 1.5,
              }}>
                {stat.sub}
              </Typography>
            </motion.div>
          </Box>

          {/* Bottom right blue dot accent */}
          <Box sx={{
            position: 'absolute', bottom: 20, right: 22,
            width: 6, height: 6, borderRadius: '50%',
            background: T.blueGrad, opacity: 0.45,
          }} />
        </Box>
      </motion.div>
    </motion.div>
  );
}

/* ── Main export ── */
export default function StatsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.2 });

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
      {/* Blue radial glow — top center */}
      <Box sx={{
        position: 'absolute', width: '80vw', height: '50vw',
        top: '-12vw', left: '10vw', borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(59,123,246,0.09) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />

      {/* Softer second glow bottom right */}
      <Box sx={{
        position: 'absolute', width: '40vw', height: '35vw',
        bottom: '-8vw', right: '-5vw', borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(59,123,246,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Blue dot grid */}
      <Box sx={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: `radial-gradient(circle, rgba(59,123,246,0.07) 1px, transparent 1px)`,
        backgroundSize: '28px 28px',
      }} />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>

        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: EASE }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={inView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
              style={{ transformOrigin: 'left' }}
            >
              <Box sx={{ width: 22, height: 1.5, borderRadius: 1, background: T.blueGrad }} />
            </motion.div>
            <Typography sx={{
              fontFamily: MONO, fontSize: '0.52rem',
              letterSpacing: '0.22em', color: T.blue, textTransform: 'uppercase',
            }}>
              Our Impact
            </Typography>
          </Box>
        </motion.div>

        {/* Heading */}
        <Box sx={{ overflow: 'hidden', mb: 0.5 }}>
          <motion.div
            initial={{ y: '110%' }}
            animate={inView ? { y: '0%' } : {}}
            transition={{ duration: 0.75, delay: 0.08, ease: EASE }}
          >
            <Typography sx={{
              fontFamily: SERIF, fontStyle: 'italic', fontWeight: 400,
              fontSize: { xs: '2.5rem', sm: '3.25rem', md: '4rem' },
              color: T.ink, letterSpacing: '-0.035em', lineHeight: 1.0,
            }}>
              Proven results across
            </Typography>
          </motion.div>
        </Box>
        <Box sx={{ overflow: 'hidden', mb: 4 }}>
          <motion.div
            initial={{ y: '110%' }}
            animate={inView ? { y: '0%' } : {}}
            transition={{ duration: 0.75, delay: 0.15, ease: EASE }}
          >
            <Typography sx={{
              fontFamily: SERIF, fontStyle: 'italic', fontWeight: 400,
              fontSize: { xs: '2.5rem', sm: '3.25rem', md: '4rem' },
              letterSpacing: '-0.035em', lineHeight: 1.0,
              background: T.blueGrad,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              hundreds of brands.
            </Typography>
          </motion.div>
        </Box>

        {/* Subtext */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.28, ease: EASE }}
        >
          <Typography sx={{
            fontFamily: SANS, fontSize: { xs: '0.9375rem', md: '1.0625rem' },
            color: T.inkMuted, lineHeight: 1.8,
            maxWidth: 520, mb: { xs: 8, md: 10 },
          }}>
            From early-stage founders to scaling SaaS companies — we help
            ambitious teams launch, grow, and dominate their markets.
          </Typography>
        </motion.div>

        {/* Stats grid */}
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
          gap: { xs: 2.5, md: 3 },
        }}>
          {stats.map((stat, i) => (
            <StatCard key={stat.label} stat={stat} index={i} inView={inView} />
          ))}
        </Box>

        {/* Bottom divider stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.7, ease: EASE }}
        >
          <Box sx={{
            mt: { xs: 8, md: 10 }, pt: 5,
            borderTop: `1px solid ${T.border}`,
            display: 'flex', alignItems: 'center',
            justifyContent: 'center', flexWrap: 'wrap',
          }}>
            {[
              { val: '5 yrs',  label: 'In business'       },
              { val: '40+',    label: 'Industries served'  },
              { val: '$12M+',  label: 'Revenue generated'  },
              { val: '99%',    label: 'On-time delivery'   },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 10 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.75 + i * 0.08, duration: 0.5, ease: EASE }}
              >
                <Box sx={{
                  px: { xs: 3, md: 5 }, py: 1, textAlign: 'center',
                  borderLeft: i > 0 ? `1px solid ${T.border}` : 'none',
                }}>
                  <Typography sx={{
                    fontFamily: SERIF, fontStyle: 'italic',
                    fontSize: { xs: '1.25rem', md: '1.6rem' },
                    color: T.ink, letterSpacing: '-0.025em', lineHeight: 1, mb: 0.5,
                  }}>
                    {s.val}
                  </Typography>
                  <Typography sx={{
                    fontFamily: MONO, fontSize: '0.48rem',
                    letterSpacing: '0.15em', color: T.inkFaint, textTransform: 'uppercase',
                  }}>
                    {s.label}
                  </Typography>
                </Box>
              </motion.div>
            ))}
          </Box>
        </motion.div>

      </Container>
    </Box>
  );
}