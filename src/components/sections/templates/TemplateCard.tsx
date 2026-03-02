'use client';

import { useState, useRef, useCallback } from 'react';
import { Box, Typography } from '@mui/material';
import {
  Download as DownloadIcon, ShoppingCart as CartIcon,
  Visibility as ViewIcon, Star as StarIcon,
} from '@mui/icons-material';
import {
  motion, useMotionValue, useSpring, useTransform,
} from 'framer-motion';
import { useCart } from '@/lib/hooks/useCart';
import { useCurrency } from '@/lib/hooks/useCurrency';
import { TemplateDetailDrawer } from './TemplateDetailDrawer';
import type { Template } from '@/types/template.types';

/* ══ TOKENS ══════════════════════════════════════════════ */
const T = {
  white:'#FFFFFF', offwhite:'#F9F8F5', cream:'#F0EDE6', parchment:'#E8E4DA',
  ink:'#0C0E12', inkMid:'#2E3440', inkMuted:'#64748B', inkFaint:'#94A3B8', inkGhost:'#CBD5E1',
  border:'#E2DED5', borderMd:'#C8C3B8',
  gold:'#B8922A', goldMid:'#C9A84C', goldLight:'#DDB96A',
  goldGlow:'rgba(184,146,42,0.13)',
  sage:'#5C7A5C', error:'#DC2626', amber:'#D97706',
};
const SERIF = '"Instrument Serif","Playfair Display",Georgia,serif';
const SANS  = '"DM Sans","Mona Sans",system-ui,sans-serif';
const MONO  = '"DM Mono","JetBrains Mono",ui-monospace,monospace';
const EASE  = [0.16,1,0.3,1] as const;

const FORMAT_ACCENT: Record<string,string> = {
  xlsx:T.sage, pdf:T.error, pptx:T.amber, bundle:T.gold, csv:T.inkMuted,
};

interface Props { template:Template; index?:number; }

export function TemplateCard({ template, index=0 }:Props) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { addItem, isInCart } = useCart();
  const { format } = useCurrency();
  const inCart  = isInCart(template.id);
  const accent  = FORMAT_ACCENT[template.format] ?? T.gold;
  const cardRef = useRef<HTMLDivElement>(null);

  /* ── True 3D magnetic tilt ── */
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness:320, damping:28 });
  const sy = useSpring(my, { stiffness:320, damping:28 });
  const rotateX = useTransform(sy, [-0.5,0.5], ['7deg','-7deg']);
  const rotateY = useTransform(sx, [-0.5,0.5], ['-7deg','7deg']);
  // Specular highlight — follows cursor
  const glowX   = useTransform(sx, [-0.5,0.5], ['0%','100%']);
  const glowY   = useTransform(sy, [-0.5,0.5], ['0%','100%']);
  // Shadow depth
  const shadowBlur = useTransform(sx, v => `${12 + Math.abs(v) * 36}px`);

  const onMove = useCallback((e:React.MouseEvent<HTMLDivElement>) => {
    const r = cardRef.current?.getBoundingClientRect();
    if (!r) return;
    mx.set((e.clientX - r.left)/r.width - 0.5);
    my.set((e.clientY - r.top)/r.height - 0.5);
  }, [mx, my]);

  const onLeave = useCallback(() => { mx.set(0); my.set(0); }, [mx, my]);

  return (
    <>
      <motion.div
        initial={{ opacity:0, y:32 }}
        animate={{ opacity:1, y:0 }}
        transition={{ delay:index*0.055, duration:0.52, ease:EASE }}
        style={{ perspective:1100, height:'100%' }}
      >
        <motion.div
          ref={cardRef}
          style={{ rotateX, rotateY, transformStyle:'preserve-3d', height:'100%' }}
          onMouseMove={onMove}
          onMouseLeave={onLeave}
          whileHover={{ z:18, transition:{ type:'spring', stiffness:400, damping:30 } }}
        >
          <Box sx={{
            position:'relative', height:'100%',
            display:'flex', flexDirection:'column',
            background:T.white, borderRadius:'18px',
            border:`1px solid ${T.border}`,
            overflow:'hidden',
            transition:'border-color 0.25s ease, box-shadow 0.3s ease',
            boxShadow:'0 2px 12px rgba(12,14,18,0.05)',
            '&:hover':{
              borderColor:`${accent}44`,
              boxShadow:`0 20px 60px rgba(12,14,18,0.11), 0 4px 20px ${accent}14`,
            },
            '&:hover .tpl-img':{ transform:'scale(1.06)' },
            '&:hover .tpl-overlay':{ opacity:1 },
          }}>

            {/* Moving specular highlight */}
            <motion.div style={{
              position:'absolute', inset:0, zIndex:1,
              pointerEvents:'none', borderRadius:'18px',
              background:`radial-gradient(circle at ${glowX} ${glowY}, ${T.goldGlow} 0%, transparent 62%)`,
            }} />

            {/* ── Cover image ── */}
            <Box
              sx={{ position:'relative', height:208, overflow:'hidden', background:T.parchment, flexShrink:0, cursor:'pointer' }}
              onClick={()=>setDrawerOpen(true)}
            >
              {template.thumbnailUrl ? (
                <Box
                  component="img"
                  src={template.thumbnailUrl}
                  alt={template.name}
                  className="tpl-img"
                  sx={{ width:'100%', height:'100%', objectFit:'cover', display:'block', transition:'transform 0.55s ease' }}
                />
              ) : (
                <Box sx={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', background:T.cream }}>
                  <Typography sx={{ fontFamily:SERIF, fontStyle:'italic', fontSize:'4.5rem', color:'rgba(12,14,18,0.1)', lineHeight:1 }}>₹</Typography>
                </Box>
              )}

              {/* Quick-view overlay */}
              <Box className="tpl-overlay" sx={{
                position:'absolute', inset:0, opacity:0,
                background:'rgba(12,14,18,0.42)', backdropFilter:'blur(2px)',
                display:'flex', alignItems:'center', justifyContent:'center',
                transition:'opacity 0.22s ease',
              }}>
                <Box sx={{ display:'flex', alignItems:'center', gap:1, px:2.25, py:1.125, borderRadius:'9px', background:'rgba(255,255,255,0.93)', border:`1px solid ${T.border}` }}>
                  <ViewIcon sx={{ fontSize:'0.875rem', color:T.ink }} />
                  <Typography sx={{ fontFamily:SANS, fontWeight:600, fontSize:'0.8125rem', color:T.ink }}>Quick View</Typography>
                </Box>
              </Box>

              {/* Format badge — bottom left */}
              <Box sx={{ position:'absolute', bottom:12, left:12 }}>
                <Box sx={{ px:'9px', py:'4px', borderRadius:'5px', background:`${accent}18`, border:`1px solid ${accent}28` }}>
                  <Typography sx={{ fontFamily:MONO, fontSize:'0.48rem', letterSpacing:'0.18em', color:accent, textTransform:'uppercase' }}>
                    {template.format}
                  </Typography>
                </Box>
              </Box>

              {/* Top badges */}
              <Box sx={{ position:'absolute', top:12, left:12, display:'flex', gap:0.75 }}>
                {template.isBestseller && (
                  <Box sx={{ px:'8px', py:'4px', borderRadius:'4px', background:`linear-gradient(115deg,${T.goldLight},${T.gold})` }}>
                    <Typography sx={{ fontFamily:MONO, fontSize:'0.46rem', letterSpacing:'0.16em', color:T.ink, textTransform:'uppercase' }}>Bestseller</Typography>
                  </Box>
                )}
                {template.isFeatured && !template.isBestseller && (
                  <Box sx={{ px:'8px', py:'4px', borderRadius:'4px', background:T.ink }}>
                    <Typography sx={{ fontFamily:MONO, fontSize:'0.46rem', letterSpacing:'0.16em', color:T.white, textTransform:'uppercase' }}>Featured</Typography>
                  </Box>
                )}
              </Box>
              {template.discountPercent && template.discountPercent > 0 && (
                <Box sx={{ position:'absolute', top:12, right:12, px:'8px', py:'4px', borderRadius:'4px', background:T.error }}>
                  <Typography sx={{ fontFamily:MONO, fontSize:'0.5rem', letterSpacing:'0.1em', color:T.white }}>-{template.discountPercent}%</Typography>
                </Box>
              )}
            </Box>

            {/* ── Body ── */}
            <Box sx={{ p:2.75, flex:1, display:'flex', flexDirection:'column' }}>

              {/* Meta row */}
              <Box sx={{ display:'flex', alignItems:'center', gap:1.25, mb:1.25 }}>
                <Box sx={{ display:'flex', alignItems:'center', gap:0.6 }}>
                  <Box sx={{ width:6, height:6, borderRadius:'50%', background:accent, opacity:0.72 }} />
                  <Typography sx={{ fontFamily:MONO, fontSize:'0.5rem', letterSpacing:'0.14em', color:T.inkFaint, textTransform:'uppercase' }}>
                    {template.category.name}
                  </Typography>
                </Box>
                <Box sx={{ width:'1px', height:8, background:T.border }} />
                <Typography sx={{ fontFamily:MONO, fontSize:'0.5rem', letterSpacing:'0.14em', color:T.inkFaint, textTransform:'uppercase' }}>
                  {template.difficulty}
                </Typography>
              </Box>

              {/* Title */}
              <Typography
                onClick={()=>setDrawerOpen(true)}
                sx={{
                  fontFamily:SERIF, fontStyle:'italic', fontWeight:400,
                  fontSize:'1.1875rem', color:T.ink, letterSpacing:'-0.015em', lineHeight:1.2,
                  mb:1, cursor:'pointer',
                  overflow:'hidden', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical',
                  transition:'color 0.15s',
                  '&:hover':{ color:T.gold },
                }}
              >
                {template.name}
              </Typography>

              {/* Excerpt */}
              <Typography sx={{
                fontFamily:SANS, fontSize:'0.84375rem', color:T.inkMuted, lineHeight:1.72,
                mb:2, flex:1,
                overflow:'hidden', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical',
              }}>
                {template.shortDescription}
              </Typography>

              {/* Rating row */}
              <Box sx={{ display:'flex', alignItems:'center', gap:1.25, mb:2.5, pb:2.5, borderBottom:`1px solid ${T.border}` }}>
                <Box sx={{ display:'flex', gap:'2px' }}>
                  {Array.from({ length:5 }).map((_,i)=>(
                    <StarIcon key={i} sx={{ fontSize:'0.72rem', color:i<Math.round(template.rating)?T.goldMid:T.border }} />
                  ))}
                </Box>
                <Typography sx={{ fontFamily:MONO, fontSize:'0.56rem', letterSpacing:'0.05em', color:T.inkFaint }}>
                  {template.rating.toFixed(1)} ({template.reviewCount})
                </Typography>
                <Box sx={{ ml:'auto', display:'flex', alignItems:'center', gap:0.5 }}>
                  <DownloadIcon sx={{ fontSize:'0.68rem', color:T.inkGhost }} />
                  <Typography sx={{ fontFamily:MONO, fontSize:'0.54rem', letterSpacing:'0.05em', color:T.inkFaint }}>
                    {template.downloadCount.toLocaleString()}
                  </Typography>
                </Box>
              </Box>

              {/* Price + CTA */}
              <Box sx={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:1 }}>
                <Box>
                  <Typography sx={{
                    fontFamily:SERIF, fontStyle:'italic', fontWeight:400,
                    fontSize:'1.5625rem', color:T.ink, letterSpacing:'-0.025em', lineHeight:1,
                  }}>
                    {format(template.price, template.currency as 'INR')}
                  </Typography>
                  {template.originalPrice && template.originalPrice > template.price && (
                    <Typography sx={{ fontFamily:MONO, fontSize:'0.56rem', color:T.inkGhost, textDecoration:'line-through', mt:'2px' }}>
                      {format(template.originalPrice, template.currency as 'INR')}
                    </Typography>
                  )}
                </Box>

                <motion.div whileHover={{ scale:1.04 }} whileTap={{ scale:0.96 }}>
                  <Box
                    component="button"
                    onClick={()=>{ if (!inCart) addItem(template); }}
                    sx={{
                      display:'flex', alignItems:'center', gap:0.875,
                      px:'16px', py:'10px',
                      border:inCart ? `1.5px solid ${T.sage}` : '1.5px solid transparent',
                      borderRadius:'10px',
                      background:inCart ? 'transparent' : `linear-gradient(115deg,${T.goldLight},${T.gold})`,
                      cursor:inCart ? 'default' : 'pointer', outline:'none',
                      boxShadow:inCart ? 'none' : `0 4px 16px rgba(184,146,42,0.25)`,
                      transition:'all 0.18s ease',
                      '&:hover':{ boxShadow:inCart?'none':'0 6px 24px rgba(184,146,42,0.35)' },
                    }}
                  >
                    <CartIcon sx={{ fontSize:'0.9rem', color:inCart?T.sage:T.ink }} />
                    <Typography sx={{ fontFamily:SANS, fontWeight:600, fontSize:'0.8125rem', color:inCart?T.sage:T.ink, whiteSpace:'nowrap' }}>
                      {inCart ? 'In Cart ✓' : 'Add to Cart'}
                    </Typography>
                  </Box>
                </motion.div>
              </Box>
            </Box>
          </Box>
        </motion.div>
      </motion.div>

      <TemplateDetailDrawer slug={template.slug} open={drawerOpen} onClose={()=>setDrawerOpen(false)} />
    </>
  );
}