'use client';

import { Box, Typography, Skeleton } from '@mui/material';
import { ArrowForward as ArrowIcon, Timer as TimerIcon, Psychology as BrainIcon } from '@mui/icons-material';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { useCallback, useRef } from 'react';

/* ══ TOKENS ══════════════════════════════════════════════ */
const T = {
  ink:'#0C0E12', inkMid:'#1C2333', inkMuted:'#3D4860', inkFaint:'#64748B', inkGhost:'#94A3B8',
  white:'#FFFFFF', offwhite:'#F9F8F5', cream:'#F0EDE6', parchment:'#E8E4DA',
  border:'#E2DED5', gold:'#B8922A', goldMid:'#C9A84C', goldLight:'#DDB96A',
  goldGlow:'rgba(184,146,42,0.12)',
};
const SERIF = '"Instrument Serif","Playfair Display",Georgia,serif';
const SANS  = '"DM Sans","Mona Sans",system-ui,sans-serif';
const MONO  = '"DM Mono","JetBrains Mono",ui-monospace,monospace';
const EASE  = [0.16,1,0.3,1] as const;

/* personality types */
const TYPES = [
  { label:'Strategic Visionary',   sub:'Long-term pattern recogniser',   icon:'◈', accent:'#2D5BE3' },
  { label:'Analytical Optimizer',  sub:'Data-driven decision maker',     icon:'◆', accent:'#6D28D9' },
  { label:'Growth Accelerator',    sub:'Revenue-first thinker',          icon:'△', accent:'#0D7A5F' },
  { label:'Cautious Builder',      sub:'Risk-aware operator',            icon:'○', accent:'#A35400' },
  { label:'Dynamic Innovator',     sub:'Creative capital deployer',      icon:'◇', accent:'#9D174D' },
];

/* ── 3D tilt card ─────────────────────────────────────── */
function TypeCard({ type, index, visible }: { type:typeof TYPES[0]; index:number; visible:boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const mx  = useMotionValue(0);
  const my  = useMotionValue(0);
  const sx  = useSpring(mx, { stiffness:300, damping:28 });
  const sy  = useSpring(my, { stiffness:300, damping:28 });
  const rx  = useTransform(sy, [-0.5,0.5], ['6deg','-6deg']);
  const ry  = useTransform(sx, [-0.5,0.5], ['-6deg','6deg']);
  const glX = useTransform(sx, [-0.5,0.5], ['10%','90%']);
  const glY = useTransform(sy, [-0.5,0.5], ['10%','90%']);

  const onMove = useCallback((e:React.MouseEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    mx.set((e.clientX-r.left)/r.width-0.5);
    my.set((e.clientY-r.top)/r.height-0.5);
  }, [mx, my]);
  const onLeave = useCallback(() => { mx.set(0); my.set(0); }, [mx, my]);

  return (
    <motion.div
      initial={{ opacity:0, y:32, rotateX:'-4deg' }}
      animate={visible ? { opacity:1, y:0, rotateX:'0deg' } : {}}
      transition={{ delay:0.3+index*0.1, duration:0.65, ease:EASE }}
      style={{ perspective:900 }}
    >
      <motion.div
        ref={ref} style={{ rotateX:rx, rotateY:ry, transformStyle:'preserve-3d' }}
        onMouseMove={onMove} onMouseLeave={onLeave}
        whileHover={{ z:10 }}
      >
        <Box sx={{
          position:'relative', overflow:'hidden',
          background:`${T.white}`, borderRadius:'14px',
          border:`1px solid ${T.border}`,
          p:'14px 18px', cursor:'default',
          boxShadow:'0 2px 12px rgba(12,14,18,0.06)',
          transition:'border-color 0.2s, box-shadow 0.2s',
          '&:hover':{ borderColor:`${type.accent}38`, boxShadow:`0 8px 30px rgba(12,14,18,0.1), 0 2px 12px ${type.accent}14` },
        }}>
          {/* Specular */}
          <motion.div style={{ position:'absolute', inset:0, borderRadius:'14px', pointerEvents:'none', background:`radial-gradient(circle at ${glX} ${glY}, ${T.goldGlow} 0%, transparent 65%)` }} />
          {/* Icon */}
          <Typography sx={{ fontFamily:MONO, fontSize:'0.75rem', color:type.accent, mb:0.75, lineHeight:1 }}>{type.icon}</Typography>
          <Typography sx={{ fontFamily:SERIF, fontStyle:'italic', fontSize:'0.9375rem', color:T.ink, letterSpacing:'-0.01em', lineHeight:1.2, mb:0.25 }}>{type.label}</Typography>
          <Typography sx={{ fontFamily:MONO, fontSize:'0.5rem', letterSpacing:'0.12em', color:T.inkGhost, textTransform:'uppercase' }}>{type.sub}</Typography>
        </Box>
      </motion.div>
    </motion.div>
  );
}

/* ── Main start button ────────────────────────────────── */
function StartButton({ onClick, disabled, children }: { onClick:()=>void; disabled?:boolean; children:React.ReactNode }) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled?{}:{ scale:1.03 }}
      whileTap={disabled?{}:{ scale:0.97 }}
      style={{
        display:'inline-flex', alignItems:'center', gap:12,
        padding:'14px 28px', borderRadius:'12px', border:'none',
        background:disabled?T.parchment:`linear-gradient(115deg,${T.goldLight},${T.gold})`,
        cursor:disabled?'default':'pointer', outline:'none',
        boxShadow:disabled?'none':`0 6px 24px rgba(184,146,42,0.30)`,
        transition:'box-shadow 0.2s',
      }}
    >
      {children}
    </motion.button>
  );
}

interface Props { isLoading:boolean; isError:boolean; totalQuestions:number; onStart:()=>void; }

export function TestIntroScreen({ isLoading, isError, totalQuestions, onStart }:Props) {
  return (
    <Box sx={{ minHeight:'100vh', background:T.offwhite, fontFamily:SANS }}>
      {/* ══ SPLIT LAYOUT ══════════════════════════════════ */}
      <Box sx={{ display:'flex', flexDirection:{ xs:'column', md:'row' }, minHeight:'100vh' }}>

        {/* ── LEFT: Ink dark panel ── */}
        <Box sx={{
          flex:'0 0 45%', background:T.inkMid, position:'relative', overflow:'hidden',
          display:'flex', flexDirection:'column', justifyContent:'center',
          p:{ xs:'60px 32px', md:'80px 56px' }, minHeight:{ xs:'60vh', md:'100vh' },
        }}>
          {/* Grid overlay */}
          <Box sx={{ position:'absolute', inset:0, pointerEvents:'none',
            backgroundImage:`linear-gradient(rgba(255,255,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.04) 1px,transparent 1px)`,
            backgroundSize:'48px 48px' }} />
          {/* Gold glow */}
          <Box sx={{ position:'absolute', width:'60%', height:'55%', bottom:'-20%', left:'-10%', borderRadius:'50%',
            background:`radial-gradient(ellipse,rgba(184,146,42,0.12) 0%,transparent 70%)`, pointerEvents:'none' }} />
          {/* Ghost numeral */}
          <Box sx={{ position:'absolute', right:-20, top:'50%', transform:'translateY(-50%)', fontFamily:SERIF, fontStyle:'italic',
            fontSize:'28vw', fontWeight:400, color:'rgba(255,255,255,0.025)', lineHeight:1, pointerEvents:'none', userSelect:'none' }}>
            F
          </Box>

          <Box sx={{ position:'relative', zIndex:1 }}>
            {/* Eyebrow */}
            <motion.div initial={{ opacity:0, x:-16 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.55, ease:EASE }}>
              <Box sx={{ display:'flex', alignItems:'center', gap:1.5, mb:4 }}>
                <Box sx={{ width:24, height:'1px', background:`linear-gradient(90deg,${T.gold},${T.goldLight})` }} />
                <Typography sx={{ fontFamily:MONO, fontSize:'0.54rem', letterSpacing:'0.22em', color:T.goldMid||T.goldLight, textTransform:'uppercase' }}>
                  Free Founder Assessment
                </Typography>
              </Box>
            </motion.div>

            {/* Headline */}
            <motion.div initial={{ opacity:0, y:28 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.72, delay:0.08, ease:EASE }}>
              <Typography sx={{ fontFamily:SERIF, fontStyle:'italic', fontWeight:400, color:T.white,
                fontSize:{ xs:'2.25rem', md:'3rem', lg:'3.625rem' }, lineHeight:1.0, letterSpacing:'-0.03em', mb:1.5 }}>
                What kind of
              </Typography>
              <Typography sx={{ fontFamily:SERIF, fontStyle:'italic', fontWeight:400,
                fontSize:{ xs:'2.25rem', md:'3rem', lg:'3.625rem' }, lineHeight:1.0, letterSpacing:'-0.03em', mb:3,
                background:`linear-gradient(115deg,${T.goldLight} 0%,${T.gold} 60%)`,
                WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
                financial founder
              </Typography>
              <Typography sx={{ fontFamily:SERIF, fontStyle:'italic', fontWeight:400, color:T.white,
                fontSize:{ xs:'2.25rem', md:'3rem', lg:'3.625rem' }, lineHeight:1.0, letterSpacing:'-0.03em' }}>
                are you?
              </Typography>
            </motion.div>

            {/* Meta */}
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.35, duration:0.45 }}>
              <Box sx={{ display:'flex', gap:3, mt:4, flexWrap:'wrap' }}>
                {[
                  { icon:'◷', val:'5 min', label:'to complete' },
                  { icon:'◈', val:`${isLoading?'…':totalQuestions}`, label:'questions' },
                  { icon:'◆', val:'Free', label:'PDF report' },
                ].map(m=>(
                  <Box key={m.label}>
                    <Typography sx={{ fontFamily:MONO, fontSize:'0.5rem', letterSpacing:'0.14em', color:'rgba(255,255,255,0.3)', textTransform:'uppercase', mb:0.25 }}>
                      {m.icon} {m.label}
                    </Typography>
                    <Typography sx={{ fontFamily:SERIF, fontStyle:'italic', fontSize:'1.25rem', color:T.white, letterSpacing:'-0.01em', lineHeight:1 }}>
                      {m.val}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </motion.div>
          </Box>
        </Box>

        {/* ── RIGHT: Cream panel ── */}
        <Box sx={{
          flex:'0 0 55%', background:T.cream, position:'relative', overflow:'hidden',
          display:'flex', flexDirection:'column', justifyContent:'center',
          p:{ xs:'48px 32px', md:'80px 64px' },
        }}>
          {/* Grain texture */}
          <Box sx={{ position:'absolute', inset:0, pointerEvents:'none', opacity:0.03,
            backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize:'160px' }} />

          <Box sx={{ position:'relative', zIndex:1, maxWidth:480 }}>
            {/* Types grid */}
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.15, duration:0.4 }}>
              <Box sx={{ display:'flex', alignItems:'center', gap:1.5, mb:3 }}>
                <Box sx={{ width:1, height:10, background:T.border }} />
                <Typography sx={{ fontFamily:MONO, fontSize:'0.52rem', letterSpacing:'0.18em', color:T.inkGhost, textTransform:'uppercase', whiteSpace:'nowrap' }}>
                  Discover your type
                </Typography>
              </Box>
            </motion.div>

            <Box sx={{ display:'flex', flexDirection:'column', gap:1.5, mb:5 }}>
              {TYPES.map((type,i)=>(
                <TypeCard key={type.label} type={type} index={i} visible={true} />
              ))}
            </Box>

            {/* CTA */}
            <motion.div
              initial={{ opacity:0, y:20 }}
              animate={{ opacity:1, y:0 }}
              transition={{ delay:0.85, duration:0.5, ease:EASE }}
            >
              {isLoading ? (
                <Box sx={{ display:'flex', gap:2 }}>
                  <Box sx={{ height:52, width:200, background:T.parchment, borderRadius:'12px', animation:'pulse 1.6s ease-in-out infinite', '@keyframes pulse':{ '0%,100%':{ opacity:1 },'50%':{ opacity:0.5 } } }} />
                </Box>
              ) : (
                <Box sx={{ display:'flex', flexDirection:'column', gap:2 }}>
                  <StartButton onClick={onStart} disabled={isError}>
                    <Typography sx={{ fontFamily:SANS, fontWeight:700, fontSize:'0.9375rem', color:T.ink }}>
                      Begin Assessment
                    </Typography>
                    <ArrowIcon sx={{ fontSize:'1.05rem', color:T.ink }} />
                  </StartButton>
                  <Typography sx={{ fontFamily:MONO, fontSize:'0.52rem', letterSpacing:'0.12em', color:T.inkGhost, textTransform:'uppercase' }}>
                    No account required · Report emailed instantly
                  </Typography>
                  {isError && (
                    <Typography sx={{ fontFamily:SANS, fontSize:'0.8125rem', color:'#DC2626' }}>
                      Failed to load questions. Please refresh.
                    </Typography>
                  )}
                </Box>
              )}
            </motion.div>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}