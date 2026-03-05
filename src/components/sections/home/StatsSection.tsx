'use client';

import { useRef, useEffect, useState } from 'react';
import { Box, Container, Typography } from '@mui/material';
import { motion, useInView } from 'framer-motion';

const T = {
  bg:        '#F5F7FB',
  bgCard:    '#FFFFFF',
  ink:       '#0A0A0F',
  inkMid:    '#1E1E2A',
  inkMuted:  '#5A5A72',
  inkFaint:  '#9898AE',
  border:    'rgba(10,10,20,0.08)',
  blue:      '#3B7BF6',
  blueLight: '#7AABFF',
  bluePale:  '#EDF3FF',
  blueGlow:  'rgba(59,123,246,0.10)',
  blueGrad:  'linear-gradient(135deg, #3B7BF6 0%, #7AABFF 100%)',
};

const SANS = '"DM Sans","Mona Sans",system-ui,sans-serif';
const MONO = '"DM Mono","JetBrains Mono",ui-monospace,monospace';
const SERIF = '"Instrument Serif","Playfair Display",Georgia,serif';
const EASE = [0.16, 1, 0.3, 1] as const;

const STATS = [
  { target: 300,  suffix: '+',  label: 'Founders Advised',   icon: '◈', decimals: 0 },
  { target: 50,   suffix: 'Cr+', label: 'Revenue Modelled',  icon: '◉', decimals: 0, prefix: '₹' },
  { target: 150,  suffix: '+',  label: 'Models Delivered',   icon: '◎', decimals: 0 },
  { target: 5,    suffix: ' Yrs', label: 'Deep Expertise',   icon: '✦', decimals: 0 },
];

/* ── Counting number hook ── */
function useCounter(target: number, decimals: number, active: boolean, duration = 1800) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) {
      setCount(0);
      return;
    }
    let start: number | null = null;
    let raf: number;
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(parseFloat((eased * target).toFixed(decimals)));
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [active, target, decimals, duration]);

  return count;
}

function StatCard({ stat, index, inView }: {
  stat: typeof STATS[0];
  index: number;
  inView: boolean;
}) {
  const count = useCounter(stat.target, stat.decimals, inView, 1600 + index * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.1 + index * 0.1, ease: EASE }}
      whileHover={{ y: -3, transition: { duration: 0.2, ease: 'easeOut' } }}
      style={{ flex: 1 }}
    >
      <Box sx={{
        background: T.bgCard,
        borderRadius: '18px',
        border: `1px solid ${T.border}`,
        p: { xs: '28px 24px', md: '36px 32px' },
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
        '&:hover': {
          borderColor: 'rgba(59,123,246,0.22)',
          boxShadow: `0 12px 40px ${T.blueGlow}`,
        },
      }}>
        {/* Top accent line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.55, delay: 0.2 + index * 0.1, ease: EASE }}
          style={{ transformOrigin: 'left' }}
        >
          <Box sx={{
            position: 'absolute', top: 0, left: 20, right: 20, height: '2px',
            background: T.blueGrad, borderRadius: '0 0 4px 4px',
          }} />
        </motion.div>

        {/* Icon */}
        <Box sx={{
          width: 44, height: 44, borderRadius: '12px',
          background: T.bluePale,
          border: `1px solid rgba(59,123,246,0.14)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          mx: 'auto', mb: 2.5,
        }}>
          <Typography sx={{ fontSize: '1rem', color: T.blue, lineHeight: 1 }}>
            {stat.icon}
          </Typography>
        </Box>

        {/* Counting number */}
        <Typography sx={{
          fontFamily: MONO, fontWeight: 800,
          fontSize: { xs: '2.25rem', md: '2.75rem' },
          letterSpacing: '-0.03em', lineHeight: 1,
          background: T.blueGrad,
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          mb: 1,
        }}>
          {stat.prefix ?? ''}{stat.decimals > 0 ? count.toFixed(stat.decimals) : Math.floor(count)}{stat.suffix}
        </Typography>

        {/* Label */}
        <Typography sx={{
          fontFamily: SANS, fontWeight: 600,
          fontSize: '0.875rem', color: T.inkMid,
          letterSpacing: '-0.01em',
        }}>
          {stat.label}
        </Typography>
      </Box>
    </motion.div>
  );
}

export default function StatsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: false, amount: 0.3 });

  return (
    <Box
      ref={sectionRef}
      sx={{
        py: { xs: 10, md: 16 },
        background: T.bg,
        position: 'relative',
        overflow: 'hidden',
        borderTop: `1px solid ${T.border}`,
      }}
    >
      {/* Ambient glow */}
      <Box sx={{
        position: 'absolute', width: '70vw', height: '40vw',
        top: '-10vw', left: '15vw', borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(59,123,246,0.07) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />
      {/* Dot grid */}
      <Box sx={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: `radial-gradient(circle, rgba(59,123,246,0.06) 1px, transparent 1px)`,
        backgroundSize: '28px 28px',
      }} />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>

        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: { xs: 7, md: 10 } }}>

          <Box sx={{ overflow: 'hidden', mb: 0.5 }}>
            <motion.div
              initial={{ y: '110%' }}
              animate={inView ? { y: '0%' } : {}}
              transition={{ duration: 0.75, delay: 0.08, ease: EASE }}
            >
              <Typography sx={{
                fontFamily: SANS, fontWeight: 800,
                fontSize: { xs: '2rem', sm: '2.75rem', md: '3.5rem' },
                color: T.ink, letterSpacing: '-0.035em', lineHeight: 1.05,
              }}>
                Proven results,
              </Typography>
            </motion.div>
          </Box>
          <Box sx={{ overflow: 'hidden', mb: 3 }}>
            <motion.div
              initial={{ y: '110%' }}
              animate={inView ? { y: '0%' } : {}}
              transition={{ duration: 0.75, delay: 0.16, ease: EASE }}
            >
              <Typography sx={{
                fontFamily: SANS, fontWeight: 800,
                fontSize: { xs: '2rem', sm: '2.75rem', md: '3.5rem' },
                letterSpacing: '-0.035em', lineHeight: 1.05,
                background: T.blueGrad,
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>
                real numbers.
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
              color: T.inkMuted, lineHeight: 1.75, maxWidth: 400, mx: 'auto',
            }}>
              From early-stage founders to scaling teams we help ambitious businesses grow with clarity.
            </Typography>
          </motion.div>
        </Box>

        {/* 4 cards in one row */}
        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 2, md: 2.5 },
          alignItems: 'stretch',
        }}>
          {STATS.map((stat, i) => (
            <StatCard key={stat.label} stat={stat} index={i} inView={inView} />
          ))}
        </Box>

      </Container>
    </Box>
  );
}