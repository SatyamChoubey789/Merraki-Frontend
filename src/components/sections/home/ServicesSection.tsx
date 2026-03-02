'use client';

import { useRef } from 'react';
import { Box, Container, Typography } from '@mui/material';
import { motion, useMotionValue, useSpring, useTransform, useInView } from 'framer-motion';
import Link from 'next/link';

/* ══ TOKENS ══════════════════════════════════════════════ */
const T = {
  bg:        "#F0F5FF",
  bgCard:    "#FFFFFF",
  ink:       "#0A0A0F",
  inkMid:    "#1E1E2A",
  inkMuted:  "#5A5A72",
  inkFaint:  "#9898AE",
  border:    "rgba(10,10,20,0.08)",
  borderMid: "rgba(10,10,20,0.13)",

  blue:      "#3B7BF6",
  blueMid:   "#5A92F8",
  blueLight: "#7AABFF",
  bluePale:  "#EDF3FF",
  blueGlow:  "rgba(59,123,246,0.15)",
  blueDim:   "rgba(59,123,246,0.06)",
  blueGrad:  "linear-gradient(135deg, #3B7BF6 0%, #7AABFF 100%)",
};

const SERIF = '"Instrument Serif","Playfair Display",Georgia,serif';
const SANS  = '"DM Sans","Mona Sans",system-ui,sans-serif';
const MONO  = '"DM Mono","JetBrains Mono",ui-monospace,monospace';
const EASE  = [0.16, 1, 0.3, 1] as const;

/* ══ DATA ════════════════════════════════════════════════ */
const SERVICES = [
  {
    icon: '◈',
    title: 'Financial Modelling',
    desc: 'Investor-grade 3-statement models built for fundraising, scenario planning, and scale.',
    tags: ['P&L', 'Cash Flow', 'Forecasts'],
    stat: '150+', statLabel: 'Models built',
    color: '#3B7BF6',
  },
  {
    icon: '△',
    title: 'Excel Dashboards',
    desc: 'Real-time KPI dashboards your whole team actually uses — no code, just clarity.',
    tags: ['KPIs', 'Real-time', 'Reports'],
    stat: '98%', statLabel: 'Satisfaction',
    color: '#2563EB',
  },
  {
    icon: '◆',
    title: 'Templates & Calculators',
    desc: 'Plug-and-play financial tools for faster, smarter decisions — ready in minutes.',
    tags: ['Budget', 'Runway', 'Burn Rate'],
    stat: '50+', statLabel: 'Templates',
    color: '#1D4ED8',
  },
  {
    icon: '○',
    title: 'Data Analysis',
    desc: 'Raw data transformed into boardroom-ready clarity. Find signal in the noise.',
    tags: ['Insights', 'Trends', 'Reporting'],
    stat: '300+', statLabel: 'Founders',
    color: '#3B7BF6',
  },
  {
    icon: '◇',
    title: 'Bookkeeping Support',
    desc: 'Accurate, current, always investor-ready books. Spend time on the business.',
    tags: ['Monthly', 'Reconciled', 'GST'],
    stat: '100%', statLabel: 'Accurate',
    color: '#2563EB',
  },
  {
    icon: '✦',
    title: 'Founder Consulting',
    desc: 'Strategic finance guidance from experienced operators who understand startups.',
    tags: ['Strategy', 'CFO', 'Advisory'],
    stat: '30min', statLabel: 'Free call',
    color: '#1D4ED8',
  },
  {
    icon: '⬡',
    title: 'Forecasting',
    desc: 'Clear runway visibility and capital planning so you always know what comes next.',
    tags: ['Runway', 'Scenarios', 'Planning'],
    stat: '₹50Cr+', statLabel: 'Modelled',
    color: '#3B7BF6',
  },
  {
    icon: '⬢',
    title: 'Reporting',
    desc: 'Monthly investor-ready reporting packages that build trust and save 5+ hours.',
    tags: ['Investor', 'Monthly', 'Decks'],
    stat: '5hrs', statLabel: 'Saved/month',
    color: '#2563EB',
  },
  {
    icon: '◎',
    title: 'Growth Strategy',
    desc: 'Financial systems that scale with your ambition — from seed to Series B and beyond.',
    tags: ['Scaling', 'Unit Econ.', 'Series A'],
    stat: '6wks', statLabel: 'Avg raise',
    color: '#1D4ED8',
  },
];

/* ══ SERVICE CARD ════════════════════════════════════════ */
function ServiceCard({ service, index, inView }: {
  service: typeof SERVICES[0];
  index: number;
  inView: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 200, damping: 22 });
  const sy = useSpring(my, { stiffness: 200, damping: 22 });
  const rotX = useTransform(sy, [-0.5, 0.5], ['7deg', '-7deg']);
  const rotY = useTransform(sx, [-0.5, 0.5], ['-7deg', '7deg']);
  const glX  = useTransform(sx, [-0.5, 0.5], ['10%', '90%']);
  const glY  = useTransform(sy, [-0.5, 0.5], ['10%', '90%']);

  const handleMove = (e: React.MouseEvent) => {
    const r = cardRef.current?.getBoundingClientRect();
    if (!r) return;
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const handleLeave = () => { mx.set(0); my.set(0); };

  // Stagger: row of 3, delay by column then row
  const col = index % 3;
  const row = Math.floor(index / 3);
  const delay = 0.08 + col * 0.1 + row * 0.05;

  return (
    <motion.div
      initial={{ opacity: 0, y: 48, scale: 0.94 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.7, delay, ease: EASE }}
      style={{ perspective: 1200 }}
    >
      <motion.div
        ref={cardRef}
        style={{ rotateX: rotX, rotateY: rotY, transformStyle: 'preserve-3d' }}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        whileHover={{ z: 18, transition: { type: 'spring', stiffness: 300, damping: 22 } }}
      >
        <Box sx={{
          position: 'relative',
          borderRadius: '20px',
          background: T.bgCard,
          border: `1px solid ${T.border}`,
          overflow: 'hidden',
          cursor: 'default',
          transition: 'border-color 0.3s ease',
          '&:hover': {
            borderColor: `rgba(59,123,246,0.28)`,
          },
          '&:hover .card-back': { opacity: 1, transform: 'translateY(0)' },
          '&:hover .card-front-desc': { opacity: 0, transform: 'translateY(-8px)' },
          '&:hover .card-stat': { opacity: 0 },
          '&:hover .bottom-bar': { background: T.blueGrad },
        }}>

          {/* Moving specular sheen */}
          <motion.div style={{
            position: 'absolute', inset: 0, borderRadius: '20px', pointerEvents: 'none', zIndex: 3,
            background: `radial-gradient(circle at ${glX} ${glY}, rgba(255,255,255,0.7) 0%, transparent 55%)`,
          }} />

          {/* Top accent bar — animated in */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.6, delay: delay + 0.2, ease: EASE }}
            style={{ transformOrigin: 'left' }}
          >
            <Box sx={{
              position: 'absolute', top: 0, left: 0, right: 0,
              height: '2.5px', background: T.blueGrad, zIndex: 2,
            }} />
          </motion.div>

          {/* Ghost number background */}
          <Box sx={{
            position: 'absolute', bottom: -10, right: 0,
            fontFamily: MONO, fontWeight: 800,
            fontSize: '6rem', lineHeight: 1,
            color: `rgba(59,123,246,0.045)`,
            userSelect: 'none', pointerEvents: 'none', zIndex: 0,
            letterSpacing: '-0.04em',
          }}>
            {service.stat}
          </Box>

          {/* Card content */}
          <Box sx={{ p: { xs: '24px', md: '28px' }, position: 'relative', zIndex: 1 }}>

            {/* Icon + stat row */}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2.5 }}>
              {/* Icon pill */}
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4, delay: delay + 0.3, type: 'spring', stiffness: 380, damping: 20 }}
              >
                <Box sx={{
                  width: 46, height: 46, borderRadius: '13px',
                  border: `1px solid rgba(59,123,246,0.14)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.1rem',
                  background: `linear-gradient(135deg, ${T.bluePale}, #FFFFFF)`,
                }}>
                  <Typography sx={{
                    fontSize: '1.1rem',
                    background: T.blueGrad,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    lineHeight: 1,
                  }}>
                    {service.icon}
                  </Typography>
                </Box>
              </motion.div>

              {/* Stat badge — fades on hover */}
              <Box className="card-stat" sx={{
                textAlign: 'right',
                transition: 'opacity 0.25s ease',
              }}>
                <Typography sx={{
                  fontFamily: MONO, fontWeight: 700,
                  fontSize: '1rem', color: T.blue, lineHeight: 1,
                  background: T.blueGrad,
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                }}>
                  {service.stat}
                </Typography>
                <Typography sx={{
                  fontFamily: MONO, fontSize: '0.48rem',
                  letterSpacing: '0.12em', color: T.inkFaint,
                  textTransform: 'uppercase', mt: 0.3,
                }}>
                  {service.statLabel}
                </Typography>
              </Box>
            </Box>

            {/* Title */}
            <Typography sx={{
              fontFamily: SERIF, fontStyle: 'italic', fontWeight: 400,
              fontSize: { xs: '1.25rem', md: '1.375rem' },
              color: T.ink, letterSpacing: '-0.02em', lineHeight: 1.15,
              mb: 1.25,
            }}>
              {service.title}
            </Typography>

            {/* Description — fades on hover */}
            <Box className="card-front-desc" sx={{
              transition: 'opacity 0.22s ease, transform 0.22s ease',
            }}>
              <Typography sx={{
                fontFamily: SANS, fontSize: '0.8125rem',
                color: T.inkMuted, lineHeight: 1.75, mb: 2.5,
                minHeight: '3.5rem',
              }}>
                {service.desc}
              </Typography>
            </Box>

            {/* Tags */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mb: 3 }}>
              {service.tags.map((tag) => (
                <Box key={tag} sx={{
                  px: '9px', py: '3.5px', borderRadius: '6px',
                  background: T.bluePale, border: `1px solid rgba(59,123,246,0.14)`,
                  fontFamily: MONO, fontSize: '0.48rem',
                  letterSpacing: '0.1em', color: T.blue,
                  textTransform: 'uppercase',
                }}>
                  {tag}
                </Box>
              ))}
            </Box>

            {/* Hover reveal layer — slides up */}
            <Box className="card-back" sx={{
              position: 'absolute',
              bottom: 0, left: 0, right: 0,
              p: '20px 28px',
              background: `linear-gradient(to top, ${T.bluePale} 0%, rgba(237,243,255,0.95) 100%)`,
              borderTop: `1px solid rgba(59,123,246,0.14)`,
              opacity: 0,
              transform: 'translateY(8px)',
              transition: 'opacity 0.28s ease, transform 0.28s ease',
              zIndex: 2,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <Typography sx={{
                fontFamily: SANS, fontWeight: 600,
                fontSize: '0.8125rem', color: T.blue,
                letterSpacing: '-0.01em',
              }}>
                Book a consultation
              </Typography>
              <Link href="/book-consultation" style={{ textDecoration: 'none' }}>
                <motion.div whileHover={{ x: 4 }} whileTap={{ scale: 0.95 }}>
                  <Box sx={{
                    display: 'inline-flex', alignItems: 'center', gap: 0.75,
                    px: '14px', py: '8px', borderRadius: '8px',
                    background: T.blueGrad, boxShadow: `0 4px 14px ${T.blueGlow}`,
                  }}>
                    <Typography sx={{
                      fontFamily: SANS, fontWeight: 700,
                      fontSize: '0.75rem', color: '#fff',
                      letterSpacing: '-0.01em', whiteSpace: 'nowrap',
                    }}>
                      Get started →
                    </Typography>
                  </Box>
                </motion.div>
              </Link>
            </Box>
          </Box>

          {/* Bottom accent bar */}
          <Box className="bottom-bar" sx={{
            height: '3px',
            background: T.border,
            transition: 'background 0.3s ease',
          }} />
        </Box>
      </motion.div>
    </motion.div>
  );
}

/* ══ MAIN SECTION ════════════════════════════════════════ */
export default function ServicesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef  = useRef<HTMLDivElement>(null);
  const inView     = useInView(sectionRef, { once: true, amount: 0.08 });
  const headerView = useInView(headerRef,  { once: true, amount: 0.5  });

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
      {/* Blue radial glow top */}
      <Box sx={{
        position: 'absolute', width: '80vw', height: '50vw',
        top: '-12vw', left: '10vw', borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(59,123,246,0.08) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />

      {/* Blue glow bottom-right */}
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

        {/* ── Header ── */}
        <Box ref={headerRef} sx={{ textAlign: 'center', mb: { xs: 8, md: 12 } }}>

          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={headerView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, ease: EASE }}
          >
            <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
              <motion.div
                initial={{ scaleX: 0 }} animate={headerView ? { scaleX: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
                style={{ transformOrigin: 'right' }}
              >
                <Box sx={{ width: 24, height: 1.5, borderRadius: 1, background: T.blueGrad }} />
              </motion.div>
              <Typography sx={{
                fontFamily: MONO, fontSize: '0.52rem',
                letterSpacing: '0.22em', color: T.blue, textTransform: 'uppercase',
              }}>
                What We Do
              </Typography>
              <motion.div
                initial={{ scaleX: 0 }} animate={headerView ? { scaleX: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.15, ease: EASE }}
                style={{ transformOrigin: 'left' }}
              >
                <Box sx={{ width: 24, height: 1.5, borderRadius: 1, background: T.blueGrad }} />
              </motion.div>
            </Box>
          </motion.div>

          {/* Headline */}
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
              Every tool we build, every model we ship, every dashboard we design — it exists to make your decisions faster and your growth clearer.
            </Typography>
          </motion.div>
        </Box>

        {/* ── Card grid ── */}
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)' },
          gap: { xs: 2.5, md: 3 },
        }}>
          {SERVICES.map((service, i) => (
            <ServiceCard key={service.title} service={service} index={i} inView={inView} />
          ))}
        </Box>

        {/* ── Bottom CTA strip ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8, ease: EASE }}
        >
          <Box sx={{
            mt: { xs: 8, md: 10 }, pt: 5,
            borderTop: `1px solid ${T.border}`,
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', flexWrap: 'wrap', gap: 3,
          }}>
            <Box>
              <Typography sx={{
                fontFamily: SERIF, fontStyle: 'italic',
                fontSize: { xs: '1.25rem', md: '1.5rem' },
                color: T.ink, letterSpacing: '-0.025em', mb: 0.5,
              }}>
                Not sure where to start?
              </Typography>
              <Typography sx={{ fontFamily: SANS, fontSize: '0.875rem', color: T.inkMuted }}>
                Book a free 30-minute call and we'll map the right services for your stage.
              </Typography>
            </Box>
            <Link href="/book-consultation" style={{ textDecoration: 'none' }}>
              <motion.div whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}>
                <Box sx={{
                  display: 'inline-flex', alignItems: 'center', gap: 1,
                  px: '24px', py: '13px', borderRadius: '12px',
                  background: T.blueGrad,
                  boxShadow: `0 4px 20px ${T.blueGlow}`,
                  transition: 'box-shadow 0.25s ease',
                  '&:hover': { boxShadow: `0 8px 32px ${T.blueGlow}` },
                }}>
                  <Typography sx={{
                    fontFamily: SANS, fontWeight: 700,
                    fontSize: '0.9375rem', color: '#fff',
                    letterSpacing: '-0.01em', whiteSpace: 'nowrap',
                  }}>
                    Book Free Consultation →
                  </Typography>
                </Box>
              </motion.div>
            </Link>
          </Box>
        </motion.div>

      </Container>
    </Box>
  );
}