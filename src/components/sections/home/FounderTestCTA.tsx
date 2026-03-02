'use client';

import { useRef, useCallback } from 'react';
import { Box, Container, Typography } from '@mui/material';
import { ArrowForward as ArrowIcon } from '@mui/icons-material';
import { motion, useMotionValue, useSpring, useTransform, useInView } from 'framer-motion';
import Link from 'next/link';

/* ══ TOKENS ══════════════════════════════════════════════ */
const T = {
  white:    '#FFFFFF',
  offwhite: '#F9F8F5',
  cream:    '#F0EDE6',
  bg:       '#F5F4F1',
  ink:      '#0C0E12',
  inkMid:   '#2E3440',
  inkMuted: '#64748B',
  inkFaint: '#94A3B8',
  inkGhost: '#CBD5E1',
  border:   '#E8E5DF',
  borderMd: '#C8C3B8',
  gold:     '#B8922A',
  goldMid:  '#C9A84C',
  goldLight:'#DDB96A',
  goldGlow: 'rgba(184,146,42,0.10)',
};
const SERIF = '"Instrument Serif","Playfair Display",Georgia,serif';
const SANS  = '"DM Sans","Mona Sans",system-ui,sans-serif';
const MONO  = '"DM Mono","JetBrains Mono",ui-monospace,monospace';
const EASE  = [0.16,1,0.3,1] as const;

/* ══ PERSONALITY TYPES ═══════════════════════════════════ */
const TYPES = [
  { icon:'◈', type:'Strategic Visionary',  sub:'Long-term pattern recogniser',  accent:'#2D5BE3' },
  { icon:'◆', type:'Analytical Optimizer', sub:'Data-driven decision maker',    accent:'#6D28D9' },
  { icon:'△', type:'Growth Accelerator',   sub:'Revenue-first thinker',         accent:'#0D7A5F' },
  { icon:'○', type:'Cautious Builder',     sub:'Risk-aware operator',           accent:'#A35400' },
  { icon:'◇', type:'Dynamic Innovator',    sub:'Creative capital deployer',     accent:'#9D174D' },
];

/* ── 3D tilt type card ────────────────────────────────── */
function TypeRow({ t, index, inView }: { t: typeof TYPES[0]; index: number; inView: boolean }) {
  const ref  = useRef<HTMLDivElement>(null);
  const mx   = useMotionValue(0);
  const my   = useMotionValue(0);
  const sx   = useSpring(mx, { stiffness:300, damping:28 });
  const sy   = useSpring(my, { stiffness:300, damping:28 });
  const rotX = useTransform(sy, [-0.5,0.5], ['4deg','-4deg']);
  const rotY = useTransform(sx, [-0.5,0.5], ['-4deg','4deg']);
  const glX  = useTransform(sx, [-0.5,0.5], ['10%','90%']);
  const glY  = useTransform(sy, [-0.5,0.5], ['10%','90%']);

  const onMove = useCallback((e: React.MouseEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  }, [mx, my]);
  const onLeave = useCallback(() => { mx.set(0); my.set(0); }, [mx, my]);

  return (
    <motion.div
      initial={{ opacity:0, x:24, filter:'blur(4px)' }}
      animate={inView ? { opacity:1, x:0, filter:'blur(0px)' } : {}}
      transition={{ delay:0.25 + index*0.09, duration:0.55, ease:EASE }}
      style={{ perspective:900 }}
    >
      <motion.div
        ref={ref}
        style={{ rotateX:rotX, rotateY:rotY, transformStyle:'preserve-3d' }}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        whileHover={{ z:10, transition:{ type:'spring', stiffness:380, damping:30 } }}
      >
        <Box sx={{
          display:'flex', alignItems:'center', gap:2,
          px:2.5, py:'14px',
          background:T.white, borderRadius:'14px',
          border:`1px solid ${T.border}`,
          position:'relative', overflow:'hidden',
          boxShadow:'0 2px 10px rgba(12,14,18,0.05)',
          transition:'border-color 0.2s, box-shadow 0.2s',
          '&:hover':{ borderColor:`${t.accent}30`, boxShadow:`0 6px 24px rgba(12,14,18,0.09), 0 0 0 1px ${t.accent}14` },
          cursor:'default',
        }}>
          {/* Specular */}
          <motion.div style={{
            position:'absolute', inset:0, borderRadius:'14px', pointerEvents:'none',
            background:`radial-gradient(circle at ${glX} ${glY}, rgba(255,255,255,0.7) 0%, transparent 60%)`,
          }} />
          {/* Accent left bar */}
          <Box sx={{ position:'absolute', left:0, top:8, bottom:8, width:2, borderRadius:'0 2px 2px 0', background:`linear-gradient(180deg,${t.accent}88,${t.accent})` }} />
          {/* Icon */}
          <Box sx={{ width:36, height:36, borderRadius:'9px', flexShrink:0, ml:0.5,
            background:`${t.accent}0e`, border:`1px solid ${t.accent}22`,
            display:'flex', alignItems:'center', justifyContent:'center' }}>
            <Typography sx={{ fontFamily:MONO, fontSize:'0.8rem', color:t.accent, lineHeight:1 }}>{t.icon}</Typography>
          </Box>
          <Box sx={{ flex:1 }}>
            <Typography sx={{ fontFamily:SERIF, fontStyle:'italic', fontSize:'0.9375rem', color:T.ink, letterSpacing:'-0.01em', lineHeight:1.2 }}>
              {t.type}
            </Typography>
            <Typography sx={{ fontFamily:MONO, fontSize:'0.48rem', letterSpacing:'0.12em', color:T.inkGhost, textTransform:'uppercase', mt:'2px' }}>
              {t.sub}
            </Typography>
          </Box>
          {/* Dot */}
          <Box sx={{ width:7, height:7, borderRadius:'50%', background:t.accent, opacity:0.5, flexShrink:0 }} />
        </Box>
      </motion.div>
    </motion.div>
  );
}

/* ══ MAIN COMPONENT ══════════════════════════════════════ */
export function FounderTestCTA() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once:true, margin:'-80px' });

  return (
    <Box
      ref={sectionRef}
      sx={{
        py:{ xs:12, md:18 },
        background:T.bg,
        position:'relative', overflow:'hidden',
      }}
    >
      {/* Warm grid */}
      <Box sx={{
        position:'absolute', inset:0, pointerEvents:'none',
        backgroundImage:`linear-gradient(${T.border} 1px,transparent 1px),linear-gradient(90deg,${T.border} 1px,transparent 1px)`,
        backgroundSize:'64px 64px', opacity:0.45,
      }} />
      {/* Gold glow centre */}
      <Box sx={{
        position:'absolute', width:'70vw', height:'50vw', top:'10%', left:'15%',
        borderRadius:'50%', background:`radial-gradient(ellipse,${T.goldGlow} 0%,transparent 70%)`, pointerEvents:'none',
      }} />
      {/* Grain */}
      <Box sx={{ position:'absolute', inset:0, pointerEvents:'none', opacity:0.02,
        backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize:'160px' }} />

      <Container maxWidth="xl" sx={{ position:'relative', zIndex:1 }}>
        <Box sx={{
          display:'grid',
          gridTemplateColumns:{ xs:'1fr', lg:'1fr 1fr' },
          gap:{ xs:8, md:12 },
          alignItems:'center',
        }}>

          {/* ── LEFT: Copy ── */}
          <motion.div
            initial={{ opacity:0, x:-28, filter:'blur(4px)' }}
            animate={inView ? { opacity:1, x:0, filter:'blur(0px)' } : {}}
            transition={{ duration:0.65, ease:EASE }}
          >
            <Box>
              {/* Eyebrow */}
              <Box sx={{ display:'flex', alignItems:'center', gap:1.5, mb:3.5 }}>
                <Box sx={{ width:24, height:'1px', background:`linear-gradient(90deg,${T.gold},${T.goldLight})` }} />
                <Typography sx={{ fontFamily:MONO, fontSize:'0.54rem', letterSpacing:'0.22em', color:T.goldMid, textTransform:'uppercase' }}>
                  Free 5-Minute Assessment
                </Typography>
              </Box>

              {/* Headline */}
              <Box sx={{ mb:3 }}>
                <Typography sx={{
                  fontFamily:SERIF, fontStyle:'italic', fontWeight:400,
                  fontSize:{ xs:'2.25rem', sm:'3.25rem', md:'4rem' },
                  color:T.ink, letterSpacing:'-0.03em', lineHeight:0.97, mb:0.5,
                }}>
                  Discover your
                </Typography>
                <Typography sx={{
                  fontFamily:SERIF, fontStyle:'italic', fontWeight:400,
                  fontSize:{ xs:'2.25rem', sm:'3.25rem', md:'4rem' },
                  letterSpacing:'-0.03em', lineHeight:0.97, mb:0.5,
                  background:`linear-gradient(115deg,${T.goldLight} 0%,${T.gold} 55%)`,
                  WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text',
                }}>
                  financial
                </Typography>
                <Typography sx={{
                  fontFamily:SERIF, fontStyle:'italic', fontWeight:400,
                  fontSize:{ xs:'2.25rem', sm:'3.25rem', md:'4rem' },
                  color:T.ink, letterSpacing:'-0.03em', lineHeight:0.97,
                }}>
                  personality.
                </Typography>
              </Box>

              {/* Body */}
              <Typography sx={{
                fontFamily:SANS, fontSize:{ xs:'0.9rem', md:'1rem' },
                color:T.inkMuted, lineHeight:1.8, mb:5, maxWidth:420,
              }}>
                Take our founder assessment and receive a personalised report on your financial strengths, risk areas, and a custom growth playbook. Free, instant, insightful.
              </Typography>

              {/* CTA */}
              <Box sx={{ display:'flex', flexDirection:'column', gap:1.75, alignItems:'flex-start' }}>
                <motion.div whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}>
                  <Box
                    component={Link}
                    href="/founder-test"
                    sx={{
                      display:'inline-flex', alignItems:'center', gap:1.5,
                      px:'28px', py:'14px', borderRadius:'12px', border:'none',
                      background:`linear-gradient(115deg,${T.goldLight},${T.gold})`,
                      textDecoration:'none',
                      boxShadow:`0 6px 22px rgba(184,146,42,0.28)`,
                      transition:'box-shadow 0.2s',
                      '&:hover':{ boxShadow:`0 8px 28px rgba(184,146,42,0.38)` },
                    }}
                  >
                    <Typography sx={{ fontFamily:SANS, fontWeight:700, fontSize:'0.9375rem', color:T.ink }}>
                      Start Free Test
                    </Typography>
                    <ArrowIcon sx={{ fontSize:'1rem', color:T.ink }} />
                  </Box>
                </motion.div>
                <Typography sx={{ fontFamily:MONO, fontSize:'0.52rem', letterSpacing:'0.12em', color:T.inkGhost, textTransform:'uppercase' }}>
                  No account required · Report emailed instantly
                </Typography>
              </Box>

              {/* Trust metrics */}
              <Box sx={{ display:'flex', gap:0, mt:5, pt:4, borderTop:`1px solid ${T.border}`, flexWrap:'wrap' }}>
                {[
                  { val:'2,400+', label:'Tests taken' },
                  { val:'4.9', label:'Avg rating' },
                  { val:'Free', label:'Always' },
                ].map((s,i)=>(
                  <Box key={s.label} sx={{ pr:3.5, pl:i===0?0:3.5, borderLeft:i>0?`1px solid ${T.border}`:'none' }}>
                    <Typography sx={{ fontFamily:SERIF, fontStyle:'italic', fontSize:'1.375rem', color:T.ink, letterSpacing:'-0.02em', lineHeight:1, mb:0.3 }}>
                      {s.val}
                    </Typography>
                    <Typography sx={{ fontFamily:MONO, fontSize:'0.48rem', letterSpacing:'0.14em', color:T.inkGhost, textTransform:'uppercase' }}>
                      {s.label}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </motion.div>

          {/* ── RIGHT: Type cards ── */}
          <Box sx={{ display:'flex', flexDirection:'column', gap:1.25 }}>
            {TYPES.map((t,i)=>(
              <TypeRow key={t.type} t={t} index={i} inView={inView} />
            ))}

            {/* Bottom note */}
            <motion.div
              initial={{ opacity:0 }}
              animate={inView ? { opacity:1 } : {}}
              transition={{ delay:0.9, duration:0.45 }}
            >
              <Box sx={{
                mt:0.5, px:2.5, py:1.5,
                background:`${T.goldGlow}`,
                border:`1px solid ${T.gold}18`,
                borderRadius:'10px',
                display:'flex', alignItems:'center', gap:1.5,
              }}>
                <Box sx={{ width:6, height:6, borderRadius:'50%', background:T.goldMid, flexShrink:0 }} />
                <Typography sx={{ fontFamily:SANS, fontSize:'0.8125rem', color:T.inkMuted, lineHeight:1.5 }}>
                  Answer 12 questions. Discover which type you are and get a personalised PDF playbook.
                </Typography>
              </Box>
            </motion.div>
          </Box>

        </Box>
      </Container>
    </Box>
  );
}