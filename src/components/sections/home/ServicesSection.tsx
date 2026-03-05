'use client';

import { useRef } from 'react';
import { Box, Container, Typography } from '@mui/material';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';

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
  blueGlow:  'rgba(59,123,246,0.14)',
  blueGrad:  'linear-gradient(135deg, #3B7BF6 0%, #7AABFF 100%)',
};

const SERIF = '"Instrument Serif","Playfair Display",Georgia,serif';
const SANS  = '"DM Sans","Mona Sans",system-ui,sans-serif';
const MONO  = '"DM Mono","JetBrains Mono",ui-monospace,monospace';
const EASE  = [0.16, 1, 0.3, 1] as const;

const SERVICES = [
  {
    icon: '◈',
    title: 'Financial Modelling',
    desc: 'Investor-grade 3-statement models built for fundraising, scenario planning, and scale.',
    bg: '#FFFFFF',
    iconBg: T.blueGrad,
  },
  {
    icon: '△',
    title: 'Excel Dashboards',
    desc: 'Real-time KPI dashboards your whole team actually uses — no code, just clarity.',
    bg: T.bluePale,
    iconBg: 'linear-gradient(135deg, #2563EB 0%, #3B7BF6 100%)',
  },
  {
    icon: '◆',
    title: 'Templates & Calculators',
    desc: 'Plug-and-play financial tools for faster, smarter decisions — ready in minutes.',
    bg: '#FFFFFF',
    iconBg: 'linear-gradient(135deg, #1D4ED8 0%, #5A92F8 100%)',
  },
  {
    icon: '◎',
    title: 'Data Analysis',
    desc: 'Raw data transformed into boardroom-ready clarity. Find signal in the noise.',
    bg: T.bluePale,
    iconBg: T.blueGrad,
  },
  {
    icon: '◇',
    title: 'Bookkeeping Support',
    desc: 'Accurate, current, always investor-ready books. Spend time on your business.',
    bg: '#FFFFFF',
    iconBg: 'linear-gradient(135deg, #2563EB 0%, #7AABFF 100%)',
  },
  {
    icon: '✦',
    title: 'Founder Consulting',
    desc: 'Strategic finance guidance from experienced operators who understand startups.',
    bg: T.bluePale,
    iconBg: 'linear-gradient(135deg, #1D4ED8 0%, #3B7BF6 100%)',
  },
];

function ServiceCard({
  service, index, inView,
}: {
  service: typeof SERVICES[0];
  index: number;
  inView: boolean;
}) {
  const delay = 0.06 + (index % 3) * 0.1 + Math.floor(index / 3) * 0.06;

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: EASE }}
      whileHover={{ y: -4, transition: { duration: 0.22, ease: 'easeOut' } }}
    >
      <Box sx={{
        background: service.bg,
        borderRadius: '20px',
        border: `1px solid ${T.border}`,
        p: { xs: '24px', md: '28px 30px' },
        height: '100%',
        cursor: 'default',
        transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
        '&:hover': {
          borderColor: 'rgba(59,123,246,0.22)',
          boxShadow: `0 12px 40px rgba(59,123,246,0.10)`,
        },
      }}>
        {/* Icon */}
        <Box sx={{
          width: 52, height: 52, borderRadius: '14px',
          background: service.iconBg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          mb: 2.5,
          boxShadow: `0 4px 14px rgba(59,123,246,0.25)`,
        }}>
          <Typography sx={{
            fontSize: '1.25rem', color: '#FFFFFF', lineHeight: 1,
          }}>
            {service.icon}
          </Typography>
        </Box>

        {/* Title */}
        <Typography sx={{
          fontFamily: SANS, fontWeight: 700,
          fontSize: { xs: '1rem', md: '1.0625rem' },
          color: T.ink, letterSpacing: '-0.02em',
          lineHeight: 1.25, mb: 1.25,
        }}>
          {service.title}
        </Typography>

        {/* Description */}
        <Typography sx={{
          fontFamily: SANS, fontSize: '0.85rem',
          color: T.inkMuted, lineHeight: 1.75,
        }}>
          {service.desc}
        </Typography>
      </Box>
    </motion.div>
  );
}

export default function ServicesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef  = useRef<HTMLDivElement>(null);
  const inView     = useInView(sectionRef, { once: true, amount: 0.08 });
  const headerView = useInView(headerRef,  { once: true, amount: 0.4  });

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
        position: 'absolute', width: '70vw', height: '40vw',
        top: '-10vw', left: '15vw', borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(59,123,246,0.07) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />
      <Box sx={{
        position: 'absolute', width: '40vw', height: '30vw',
        bottom: '-8vw', right: '-5vw', borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(59,123,246,0.05) 0%, transparent 70%)',
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
        <Box ref={headerRef} sx={{ textAlign: 'center', mb: { xs: 8, md: 12 } }}>
         

          <Box sx={{ overflow: 'hidden', mb: 0.5 }}>
            <motion.div
              initial={{ y: '110%' }}
              animate={headerView ? { y: '0%' } : {}}
              transition={{ duration: 0.75, delay: 0.08, ease: EASE }}
            >
              <Typography sx={{
                fontFamily: SERIF, fontStyle: 'italic', fontWeight: 400,
                fontSize: { xs: '2.25rem', sm: '3rem', md: '4rem' },
                color: T.ink, letterSpacing: '-0.035em', lineHeight: 1.0,
              }}>
                Finance services
              </Typography>
            </motion.div>
          </Box>
          <Box sx={{ overflow: 'hidden', mb: 3 }}>
            <motion.div
              initial={{ y: '110%' }}
              animate={headerView ? { y: '0%' } : {}}
              transition={{ duration: 0.75, delay: 0.16, ease: EASE }}
            >
              <Typography sx={{
                fontFamily: SERIF, fontStyle: 'italic', fontWeight: 400,
                fontSize: { xs: '2.25rem', sm: '3rem', md: '4rem' },
                letterSpacing: '-0.035em', lineHeight: 1.0,
                background: T.blueGrad,
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>
                built to scale.
              </Typography>
            </motion.div>
          </Box>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={headerView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.28, ease: EASE }}
          >
            <Typography sx={{
              fontFamily: SANS, fontSize: '0.9375rem',
              color: T.inkMuted, lineHeight: 1.75, maxWidth: 440, mx: 'auto',
            }}>
              Every tool we build, every model we ship it exists to make your decisions faster and your growth clearer.
            </Typography>
          </motion.div>
        </Box>

        {/* Card grid — 3 cols */}
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)' },
          gap: { xs: 2, md: 2.5 },
        }}>
          {SERVICES.map((service, i) => (
            <ServiceCard key={service.title} service={service} index={i} inView={inView} />
          ))}
        </Box>
      </Container>
    </Box>
  );
}