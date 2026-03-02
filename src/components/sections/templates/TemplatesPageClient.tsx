'use client';

import { useRef } from 'react';
import { Box, Container, Typography } from '@mui/material';
import {
  motion, useScroll, useTransform, useSpring, AnimatePresence,
} from 'framer-motion';
import { ErrorBoundary } from '@/components/ui';
import { TemplateFilters } from './TemplateFilters';
import { TemplateGrid } from './TemplateGrid';
import { useSearchFilter } from '@/lib/hooks/useSearchFilter';

/* ══ TOKENS ══════════════════════════════════════════════ */
const T = {
  /* surfaces */
  white: "#FFFFFF",
  offwhite: "#F5F7FB",              // soft section background
  paper: "#EDF3FF",                 // subtle blue tint surface
  surface: "#F8FAFF",               // very light elevated surface

  /* text */
  ink: "#0A0A0F",
  inkMid: "#1E1E2A",
  inkMuted: "#5A5A72",
  inkFaint: "#9898AE",

  /* borders */
  border: "rgba(10,10,20,0.08)",
  borderMid: "rgba(10,10,20,0.14)",

  /* accent — brand blue */
  blue: "#3B7BF6",
  blueMid: "#5A92F8",
  blueLight: "#7AABFF",
  bluePale: "#EDF3FF",
  blueDim: "rgba(59,123,246,0.06)",
  blueGlow: "rgba(59,123,246,0.10)",
};


const SERIF = '"Instrument Serif","Playfair Display",Georgia,serif';
const SANS  = '"DM Sans","Mona Sans",system-ui,sans-serif';
const MONO  = '"DM Mono","JetBrains Mono",ui-monospace,monospace';
const EASE  = [0.16,1,0.3,1] as const;

/* ── Scrolling marquee ticker ────────────────────────── */
const TICKER_ITEMS = [
  'FINANCIAL MODELLING','EXCEL DASHBOARDS','DCF TEMPLATES',
  'CASH FLOW MODELS','SAAS METRICS','POWER BI REPORTS',
  'RUNWAY CALCULATORS','UNIT ECONOMICS','INVESTOR DECKS',
];

function Ticker() {
  const all = [...TICKER_ITEMS,...TICKER_ITEMS,...TICKER_ITEMS];
  return (
    <Box sx={{
      overflow:'hidden', borderTop:`1px solid ${T.border}`,
      borderBottom:`1px solid ${T.border}`, py:'7px',
      background:T.paper, position:'relative',
      '&::before,&::after':{ content:'""', position:'absolute', top:0, bottom:0, width:80, zIndex:2, pointerEvents:'none' },
      '&::before':{ left:0, background:`linear-gradient(90deg,${T.paper},transparent)` },
      '&::after':{ right:0, background:`linear-gradient(270deg,${T.paper},transparent)` },
    }}>
      <motion.div
        animate={{ x:['0%','-33.33%'] }}
        transition={{ duration:40, repeat:Infinity, ease:'linear' }}
        style={{ display:'flex', whiteSpace:'nowrap', width:'max-content' }}
      >
        {all.map((item,i)=>(
          <Box key={i} component="span" sx={{
            fontFamily:MONO, fontSize:'0.52rem', letterSpacing:'0.22em',
            color:T.inkMuted, px:'22px', display:'inline-flex',
            alignItems:'center', gap:'16px',
            '&::after':{ content:'"◆"', color:T.blueMid, fontSize:'0.35rem', opacity:0.5 },
          }}>
            {item}
          </Box>
        ))}
      </motion.div>
    </Box>
  );
}

/* ── Hero stat ────────────────────────────────────────── */
function Stat({ val, label, first }: { val:string; label:string; first?:boolean }) {
  return (
    <Box sx={{ pl:first?0:3.5, pr:3.5, borderLeft:first?'none':`1px solid ${T.border}` }}>
      <Typography sx={{ fontFamily:MONO, fontSize:{ xs:'1rem',md:'1.25rem' }, fontWeight:600, color:T.ink, lineHeight:1, letterSpacing:'-0.02em', mb:0.4 }}>
        {val}
      </Typography>
      <Typography sx={{ fontFamily:MONO, fontSize:'0.5rem', letterSpacing:'0.15em', color:T.inkFaint, textTransform:'uppercase' }}>
        {label}
      </Typography>
    </Box>
  );
}

export function TemplatesPageClient() {
  const filter  = useSearchFilter({ initialSort:'popular' });
  const heroRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({ target:heroRef, offset:['start start','end start'] });
  const rawY = useTransform(scrollYProgress,[0,1],[0,52]);
  const rawO = useTransform(scrollYProgress,[0,0.65],[1,0]);
  const heroY = useSpring(rawY,{ stiffness:80, damping:22 });
  const heroO = useSpring(rawO,{ stiffness:80, damping:22 });

  return (
    <Box sx={{ minHeight:'100vh', background:T.offwhite, fontFamily:SANS }}>

      {/* ════ HERO ════════════════════════════════════════ */}
      <Box ref={heroRef} sx={{
        background:T.white, borderBottom:`1px solid ${T.border}`,
        pt:{ xs:12, md:18 }, pb:0,
        position:'relative', overflow:'hidden',
      }}>
        {/* Warm grid */}
        <Box sx={{ position:'absolute', inset:0, pointerEvents:'none',
          backgroundImage:`linear-gradient(${T.border} 1px,transparent 1px),linear-gradient(90deg,${T.border} 1px,transparent 1px)`,
          backgroundSize:'64px 64px', opacity:0.38 }} />
        {/* Gold radial glow */}
        <Box sx={{ position:'absolute', width:'65vw', height:'42vw', top:'-22vw', left:'17vw',
          borderRadius:'50%', background:`radial-gradient(ellipse,${T.blueGlow} 0%,transparent 70%)`, pointerEvents:'none' }} />
        {/* Grain */}
        <Box sx={{ position:'absolute', inset:0, pointerEvents:'none', opacity:0.022,
          backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize:'160px' }} />
        {/* Ghost symbol */}
        <Box sx={{ position:'absolute', right:-40, bottom:-70, fontFamily:SERIF, fontStyle:'italic',
          fontSize:{ xs:'32vw', md:'22vw' }, fontWeight:400,
          color:'rgba(12,14,18,0.022)', lineHeight:1, pointerEvents:'none',
          userSelect:'none', letterSpacing:'-0.06em' }}>
          ₹
        </Box>

        <Container maxWidth="xl" sx={{ position:'relative', zIndex:1 }}>
          <motion.div style={{ y:heroY, opacity:heroO }}>

            {/* Eyebrow */}
            <motion.div
              initial={{ opacity:0, y:14 }}
              animate={{ opacity:1, y:0 }}
              transition={{ duration:0.55, ease:EASE }}
            >
              <Box sx={{ display:'flex', alignItems:'center', gap:1.75, mb:3.5 }}>
                <Box sx={{ width:28, height:'1px', background:`linear-gradient(90deg,${T.blue},${T.blueLight})` }} />
                <Typography sx={{ fontFamily:MONO, fontSize:'0.56rem', letterSpacing:'0.22em', color:T.blueMid, textTransform:'uppercase' }}>
                  Template Store
                </Typography>
              </Box>
            </motion.div>

            {/* Headline */}
            <motion.div
              initial={{ opacity:0, y:40 }}
              animate={{ opacity:1, y:0 }}
              transition={{ duration:0.82, delay:0.07, ease:EASE }}
            >
              <Box sx={{ mb:3, lineHeight:1 }}>
                <Typography component="div" sx={{
                  fontFamily:SERIF, fontStyle:'italic', fontWeight:400,
                  fontSize:{ xs:'2.5rem', sm:'3.75rem', md:'5.25rem', lg:'6.75rem' },
                  lineHeight:0.95, letterSpacing:'-0.035em', color:T.ink, mb:0.5,
                }}>
                  Financial tools
                </Typography>
                <Typography component="div" sx={{
                  fontFamily:SERIF, fontStyle:'italic', fontWeight:400,
                  fontSize:{ xs:'2.5rem', sm:'3.75rem', md:'5.25rem', lg:'6.75rem' },
                  lineHeight:0.95, letterSpacing:'-0.035em',
                  background:`linear-gradient(115deg,${T.blueLight} 0%,${T.blue} 55%)`,
                  WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text',
                }}>
                  built to decide.
                </Typography>
              </Box>
            </motion.div>

            {/* Subline + stats */}
            <motion.div
              initial={{ opacity:0, y:20 }}
              animate={{ opacity:1, y:0 }}
              transition={{ duration:0.55, delay:0.22, ease:EASE }}
            >
              <Box sx={{ display:'flex', alignItems:{ md:'flex-end' }, justifyContent:'space-between', flexWrap:'wrap', gap:3, mb:6 }}>
                <Typography sx={{ fontFamily:SANS, fontSize:{ xs:'0.9rem', md:'1rem' }, color:T.inkMuted, lineHeight:1.78, maxWidth:400 }}>
                  Professional-grade Excel models and Power BI dashboards.
                  Download, customise, and start making data-driven decisions today.
                </Typography>
                <Box sx={{ display:'flex', flexWrap:'wrap', gap:0, borderTop:{ xs:`1px solid ${T.border}`, md:'none' }, pt:{ xs:3, md:0 } }}>
                  <Stat val="150+" label="Templates" first />
                  <Stat val="₹50Cr+" label="Modelled" />
                  <Stat val="4.9★" label="Avg rating" />
                  <Stat val="24 hrs" label="Support" />
                </Box>
              </Box>
            </motion.div>

          </motion.div>

          {/* Filter bar inline with tab-row feel */}
          <motion.div
            initial={{ opacity:0, y:12 }}
            animate={{ opacity:1, y:0 }}
            transition={{ duration:0.45, delay:0.32, ease:EASE }}
          >
            <ErrorBoundary>
              <TemplateFilters filter={filter} inline />
            </ErrorBoundary>
          </motion.div>
        </Container>
      </Box>

      {/* Ticker */}
      <Ticker />

      {/* ════ GRID ════════════════════════════════════════ */}
      <Container maxWidth="xl" sx={{ pt:{ xs:5, md:7 }, pb:14 }}>
        <ErrorBoundary>
          <TemplateGrid filter={filter} />
        </ErrorBoundary>
      </Container>

    </Box>
  );
}