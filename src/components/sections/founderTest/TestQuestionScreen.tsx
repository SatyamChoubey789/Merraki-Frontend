'use client';

import { Box, Typography } from '@mui/material';
import { ArrowBack as BackIcon, ArrowForward as NextIcon } from '@mui/icons-material';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useRef, useCallback } from 'react';
import type { useFounderTestEngine } from '@/lib/hooks/useFounderTestEngine';

/* ══ TOKENS ══════════════════════════════════════════════ */
const T = {
  ink:'#0C0E12', inkMid:'#1C2333', inkMuted:'#3D4860', inkFaint:'#64748B', inkGhost:'#94A3B8',
  white:'#FFFFFF', offwhite:'#F9F8F5', cream:'#F0EDE6', parchment:'#E8E4DA',
  border:'#E2DED5', borderMd:'#C8C3B8',
  gold:'#B8922A', goldMid:'#C9A84C', goldLight:'#DDB96A',
  goldGlow:'rgba(184,146,42,0.10)',
  sage:'#5C7A5C', error:'#DC2626',
};
const SERIF = '"Instrument Serif","Playfair Display",Georgia,serif';
const SANS  = '"DM Sans","Mona Sans",system-ui,sans-serif';
const MONO  = '"DM Mono","JetBrains Mono",ui-monospace,monospace';
const EASE  = [0.16,1,0.3,1] as const;

type Engine = ReturnType<typeof useFounderTestEngine>;

/* ── Individual option ────────────────────────────────── */
function OptionRow({
  id, label, selected, index, type, onClick
}: { id:string; label:string; selected:boolean; index:number; type:'single'|'multiple'|'scale'; onClick:()=>void }) {
  return (
    <motion.div
      initial={{ opacity:0, y:14 }}
      animate={{ opacity:1, y:0 }}
      transition={{ delay:0.08+index*0.06, duration:0.38, ease:EASE }}
      whileHover={{ x:4 }}
      whileTap={{ scale:0.99 }}
    >
      <Box
        onClick={onClick}
        sx={{
          display:'flex', alignItems:'center', gap:2,
          p:'14px 20px', borderRadius:'12px', cursor:'pointer',
          border:`1px solid ${selected ? T.gold+'55' : T.border}`,
          background: selected
            ? `linear-gradient(115deg,rgba(221,185,106,0.1),rgba(184,146,42,0.06))`
            : T.white,
          transition:'all 0.18s ease',
          boxShadow: selected ? `0 2px 14px rgba(184,146,42,0.14)` : '0 1px 3px rgba(12,14,18,0.04)',
          '&:hover':{ borderColor:selected?T.gold+'88':T.borderMd, background:selected?undefined:T.offwhite },
        }}
      >
        {/* Indicator */}
        <Box sx={{
          width:22, height:22, flexShrink:0,
          borderRadius:type==='multiple'?'6px':'50%',
          border:`1.5px solid ${selected?T.gold:T.border}`,
          background:selected?`linear-gradient(115deg,${T.goldLight},${T.gold})`:'transparent',
          display:'flex', alignItems:'center', justifyContent:'center',
          transition:'all 0.18s ease',
        }}>
          {selected && type==='multiple' && (
            <motion.svg initial={{ pathLength:0 }} animate={{ pathLength:1 }} transition={{ duration:0.2 }}
              width="11" height="11" viewBox="0 0 11 11" fill="none">
              <motion.path d="M2 5.5L4.5 8L9 3" stroke={T.ink} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </motion.svg>
          )}
          {selected && type==='single' && (
            <motion.div initial={{ scale:0 }} animate={{ scale:1 }} transition={{ type:'spring', stiffness:450, damping:22 }}
              style={{ width:7, height:7, borderRadius:'50%', background:T.ink }} />
          )}
        </Box>
        <Typography sx={{ fontFamily:SANS, fontSize:'0.9375rem', color:selected?T.ink:T.inkFaint, fontWeight:selected?500:400, lineHeight:1.5, transition:'color 0.15s' }}>
          {label}
        </Typography>
      </Box>
    </motion.div>
  );
}

/* ── Scale row ────────────────────────────────────────── */
function ScaleRow({ options, selectedId, onSelect }: { options:{id:string;label:string;value:string}[]; selectedId:string; onSelect:(id:string)=>void }) {
  const selIdx = options.findIndex(o=>o.id===selectedId);
  return (
    <Box>
      <Box sx={{ display:'flex', gap:1.25, mb:2 }}>
        {options.map((opt,i)=>{
          const isSel  = selectedId===opt.id;
          const isPast = selIdx>=0 && i<=selIdx;
          return (
            <motion.div key={opt.id} style={{ flex:1 }}
              whileHover={{ scale:1.06, y:-2 }} whileTap={{ scale:0.94 }}
              initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
              transition={{ delay:0.08+i*0.05, duration:0.3, ease:EASE }}>
              <Box onClick={()=>onSelect(opt.id)} sx={{
                height:52, borderRadius:'10px', cursor:'pointer',
                display:'flex', alignItems:'center', justifyContent:'center',
                border:`1.5px solid ${isSel?T.gold:isPast?T.gold+'44':T.border}`,
                background:isSel?`linear-gradient(115deg,${T.goldLight},${T.gold})`:isPast?`${T.gold}0a`:T.white,
                transition:'all 0.18s ease',
                boxShadow:isSel?`0 4px 16px rgba(184,146,42,0.28)`:'none',
              }}>
                <Typography sx={{ fontFamily:MONO, fontWeight:700, fontSize:'0.9375rem', color:isSel?T.ink:isPast?T.gold:T.inkGhost, transition:'color 0.15s' }}>
                  {i+1}
                </Typography>
              </Box>
            </motion.div>
          );
        })}
      </Box>
      <Box sx={{ display:'flex', justifyContent:'space-between' }}>
        <Typography sx={{ fontFamily:MONO, fontSize:'0.52rem', letterSpacing:'0.1em', color:T.inkGhost, textTransform:'uppercase' }}>{options[0]?.label}</Typography>
        <Typography sx={{ fontFamily:MONO, fontSize:'0.52rem', letterSpacing:'0.1em', color:T.inkGhost, textTransform:'uppercase' }}>{options[options.length-1]?.label}</Typography>
      </Box>
    </Box>
  );
}

/* ── Nav button ───────────────────────────────────────── */
function NavBtn({ onClick, disabled, variant, children }: { onClick?:()=>void; disabled?:boolean; variant:'primary'|'ghost'; children:React.ReactNode }) {
  return (
    <motion.button onClick={onClick} disabled={disabled}
      whileHover={disabled?{}:{ scale:1.03 }} whileTap={disabled?{}:{ scale:0.97 }}
      style={{
        display:'flex', alignItems:'center', gap:8,
        padding:variant==='primary'?'12px 28px':'12px 20px',
        borderRadius:'10px', outline:'none', cursor:disabled?'default':'pointer',
        border:variant==='ghost'?`1px solid ${T.border}`:'none',
        background:variant==='primary'
          ? disabled?T.parchment:`linear-gradient(115deg,${T.goldLight},${T.gold})`
          : 'transparent',
        boxShadow:variant==='primary'&&!disabled?`0 4px 16px rgba(184,146,42,0.24)`:'none',
        transition:'box-shadow 0.18s',
      }}
    >
      {children}
    </motion.button>
  );
}

interface Props { engine: Engine; }

export function TestQuestionScreen({ engine }:Props) {
  const {
    currentQuestion, currentQuestionIndex, totalQuestions, progress,
    getCurrentAnswer, handleAnswer, handleNext, handlePrev, canProceed,
  } = engine;

  if (!currentQuestion) return null;

  const selectedIds   = getCurrentAnswer(currentQuestion.id);
  const isLast        = currentQuestionIndex === totalQuestions-1;
  const pct           = Math.round((currentQuestionIndex/totalQuestions)*100);
  const qNum          = String(currentQuestionIndex+1).padStart(2,'0');

  return (
    <Box sx={{ minHeight:'100vh', background:T.offwhite, fontFamily:SANS, display:'flex', flexDirection:'column' }}>

      {/* ── Slim top progress bar ── */}
      <Box sx={{ height:3, background:T.parchment, position:'relative', flexShrink:0 }}>
        <motion.div animate={{ width:`${pct}%` }} transition={{ duration:0.5, ease:EASE }}
          style={{ position:'absolute', left:0, top:0, bottom:0, background:`linear-gradient(90deg,${T.goldLight},${T.gold})`, borderRadius:'0 2px 2px 0' }} />
      </Box>

      {/* ── Header strip ── */}
      <Box sx={{ px:{ xs:3,md:8 }, py:2, background:T.white, borderBottom:`1px solid ${T.border}`, display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 }}>
        <Box sx={{ display:'flex', alignItems:'center', gap:1.5 }}>
          <Box sx={{ width:2, height:14, borderRadius:'2px', background:`linear-gradient(180deg,${T.goldLight},${T.gold})` }} />
          <Typography sx={{ fontFamily:MONO, fontSize:'0.54rem', letterSpacing:'0.18em', color:T.inkGhost, textTransform:'uppercase' }}>
            Founder Assessment
          </Typography>
        </Box>
        <Box sx={{ display:'flex', alignItems:'center', gap:0.75 }}>
          {/* Dot progress */}
          {Array.from({ length:totalQuestions }).map((_,i)=>(
            <Box key={i} sx={{
              width: i===currentQuestionIndex?16:6,
              height:6, borderRadius:'3px',
              background:i<currentQuestionIndex?T.gold:i===currentQuestionIndex?`linear-gradient(90deg,${T.goldLight},${T.gold})`:T.parchment,
              transition:'all 0.3s ease',
            }} />
          ))}
        </Box>
      </Box>

      {/* ── Main content ── */}
      <Box sx={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', py:{ xs:5, md:7 }, px:{ xs:3, md:8 } }}>
        <Box sx={{ width:'100%', maxWidth:660 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity:0, x:28, filter:'blur(3px)' }}
              animate={{ opacity:1, x:0, filter:'blur(0px)' }}
              exit={{ opacity:0, x:-22, filter:'blur(2px)' }}
              transition={{ duration:0.42, ease:EASE }}
            >
              {/* Question card */}
              <Box sx={{
                background:T.white, borderRadius:'20px',
                border:`1px solid ${T.border}`,
                overflow:'hidden', mb:3.5,
                boxShadow:'0 4px 24px rgba(12,14,18,0.06)',
                position:'relative',
              }}>
                {/* Background question number */}
                <Box sx={{ position:'absolute', right:-8, top:-16, fontFamily:SERIF, fontStyle:'italic',
                  fontSize:'10rem', fontWeight:400, color:'rgba(12,14,18,0.03)', lineHeight:1, pointerEvents:'none', userSelect:'none', letterSpacing:'-0.04em' }}>
                  {qNum}
                </Box>

                {/* Category strip */}
                <Box sx={{ px:3.5, py:1.25, background:T.parchment, borderBottom:`1px solid ${T.border}`, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <Typography sx={{ fontFamily:MONO, fontSize:'0.52rem', letterSpacing:'0.18em', color:T.inkGhost, textTransform:'uppercase' }}>
                    {currentQuestion.category}
                  </Typography>
                  <Typography sx={{ fontFamily:MONO, fontSize:'0.52rem', letterSpacing:'0.1em', color:T.inkGhost }}>
                    {currentQuestionIndex+1} / {totalQuestions}
                  </Typography>
                </Box>

                <Box sx={{ p:{ xs:3, md:4.5 }, position:'relative', zIndex:1 }}>
                  {/* Question text */}
                  <Typography sx={{ fontFamily:SERIF, fontStyle:'italic', fontWeight:400,
                    fontSize:{ xs:'1.375rem', md:'1.75rem' }, color:T.ink,
                    letterSpacing:'-0.025em', lineHeight:1.25, mb:currentQuestion.description?1.5:3.5 }}>
                    {currentQuestion.question}
                  </Typography>
                  {currentQuestion.description && (
                    <Typography sx={{ fontFamily:SANS, fontSize:'0.9rem', color:T.inkFaint, lineHeight:1.7, mb:3.5 }}>
                      {currentQuestion.description}
                    </Typography>
                  )}

                  {/* Multi hint */}
                  {currentQuestion.type === 'multiple' && (
                    <Box sx={{ display:'flex', alignItems:'center', gap:1, mb:2.5 }}>
                      <Box sx={{ width:4, height:4, borderRadius:'50%', background:T.goldMid }} />
                      <Typography sx={{ fontFamily:MONO, fontSize:'0.52rem', letterSpacing:'0.12em', color:T.inkGhost, textTransform:'uppercase' }}>Select all that apply</Typography>
                    </Box>
                  )}

                  {/* Options */}
                  {currentQuestion.type === 'scale' ? (
                    <ScaleRow options={currentQuestion.options} selectedId={selectedIds[0]??''} onSelect={id=>handleAnswer(currentQuestion.id,id,'scale')} />
                  ) : (
                    <Box sx={{ display:'flex', flexDirection:'column', gap:1.25 }}>
                      {currentQuestion.options.map((opt,i)=>(
                        <OptionRow
                          key={opt.id} id={opt.id} label={opt.label}
                          selected={currentQuestion.type==='multiple'?selectedIds.includes(opt.id):selectedIds[0]===opt.id}
                          index={i} type={currentQuestion.type as 'single'|'multiple'}
                          onClick={()=>handleAnswer(currentQuestion.id,opt.id,currentQuestion.type as any)}
                        />
                      ))}
                    </Box>
                  )}
                </Box>
              </Box>

              {/* Validation hint */}
              <AnimatePresence>
                {currentQuestion.isRequired && !canProceed() && (
                  <motion.div initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }} transition={{ duration:0.2 }}>
                    <Box sx={{ display:'flex', alignItems:'center', gap:1, mb:2 }}>
                      <Box sx={{ width:4, height:4, borderRadius:'50%', background:T.error }} />
                      <Typography sx={{ fontFamily:MONO, fontSize:'0.52rem', letterSpacing:'0.12em', color:T.error, textTransform:'uppercase' }}>Please select an answer</Typography>
                    </Box>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation */}
              <Box sx={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <NavBtn onClick={handlePrev} variant="ghost">
                  <BackIcon sx={{ fontSize:'0.9rem', color:T.inkFaint }} />
                  <Typography sx={{ fontFamily:SANS, fontWeight:500, fontSize:'0.875rem', color:T.inkFaint }}>Back</Typography>
                </NavBtn>

                <NavBtn onClick={handleNext} disabled={!!(currentQuestion.isRequired && !canProceed())} variant="primary">
                  <Typography sx={{ fontFamily:SANS, fontWeight:600, fontSize:'0.9375rem', color:T.ink }}>
                    {isLast ? 'Finish' : 'Next'}
                  </Typography>
                  <NextIcon sx={{ fontSize:'0.9rem', color:T.ink }} />
                </NavBtn>
              </Box>
            </motion.div>
          </AnimatePresence>
        </Box>
      </Box>
    </Box>
  );
}