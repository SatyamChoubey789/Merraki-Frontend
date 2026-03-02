'use client';

import { Box, Typography, Skeleton } from '@mui/material';
import {
  Close as CloseIcon, CheckCircle as CheckIcon,
  ShoppingCart as CartIcon, Star as StarIcon, Download as DownloadIcon,
  ArrowForward as ArrowIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { useRef } from 'react';
import { useTemplate } from '@/lib/hooks/useTemplates';
import { useCart } from '@/lib/hooks/useCart';
import { useCurrency } from '@/lib/hooks/useCurrency';

/* ══ TOKENS ══════════════════════════════════════════════ */
const T = {
  white:'#FFFFFF', offwhite:'#F9F8F5', cream:'#F0EDE6', parchment:'#E8E4DA',
  ink:'#0C0E12', inkMid:'#2E3440', inkMuted:'#64748B', inkFaint:'#94A3B8', inkGhost:'#CBD5E1',
  border:'#E2DED5', borderMd:'#C8C3B8',
  gold:'#B8922A', goldMid:'#C9A84C', goldLight:'#DDB96A',
  goldGlow:'rgba(184,146,42,0.08)',
  sage:'#5C7A5C', error:'#DC2626', amber:'#D97706',
};
const SERIF = '"Instrument Serif","Playfair Display",Georgia,serif';
const SANS  = '"DM Sans","Mona Sans",system-ui,sans-serif';
const MONO  = '"DM Mono","JetBrains Mono",ui-monospace,monospace';
const EASE  = [0.16,1,0.3,1] as const;

const FORMAT_ACCENT: Record<string,string> = {
  xlsx:T.sage, pdf:T.error, pptx:T.amber, bundle:T.gold, csv:T.inkMuted,
};

function DrawerSkeleton() {
  return (
    <Box>
      <Box sx={{ height:340, background:T.parchment,
        '@keyframes dkPulse':{ '0%,100%':{ opacity:1 },'50%':{ opacity:0.5 } },
        animation:'dkPulse 1.7s ease-in-out infinite' }} />
      <Box sx={{ p:4 }}>
        {[55,90,100,85,70,100,90,75].map((w,i)=>(
          <Box key={i} sx={{ height:i<2?20:14, background:T.cream, borderRadius:'4px', width:`${w}%`, mb:i<2?1.5:1, animation:'dkPulse 1.7s ease-in-out infinite' }} />
        ))}
      </Box>
    </Box>
  );
}

interface Props { slug:string; open:boolean; onClose:()=>void; }

export function TemplateDetailDrawer({ slug, open, onClose }:Props) {
  const { data, isLoading, isError } = useTemplate(slug);
  const { addItem, isInCart } = useCart();
  const { format } = useCurrency();
  const scrollRef = useRef<HTMLDivElement>(null);

  const template = data?.data;
  const inCart   = template ? isInCart(template.id) : false;
  const accent   = template ? (FORMAT_ACCENT[template.format] ?? T.gold) : T.gold;

  /* Parallax on the cover image as user scrolls drawer content */
  const { scrollYProgress } = useScroll({ container:scrollRef });
  const imgY = useTransform(scrollYProgress, [0,1], ['0%','30%']);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* ── Backdrop ── */}
          <motion.div
            initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            transition={{ duration:0.25 }}
            onClick={onClose}
            style={{ position:'fixed', inset:0, background:'rgba(12,14,18,0.42)', backdropFilter:'blur(5px)', zIndex:1200 }}
          />

          {/* ── Panel ── */}
          <motion.div
            initial={{ x:'100%' }}
            animate={{ x:'0%' }}
            exit={{ x:'100%' }}
            transition={{ type:'spring', stiffness:420, damping:44 }}
            style={{
              position:'fixed', top:0, right:0, bottom:0,
              width:'min(640px,97vw)',
              zIndex:1300,
              display:'flex', flexDirection:'column',
              background:T.white,
              borderLeft:`1px solid ${T.border}`,
              boxShadow:'-32px 0 80px rgba(12,14,18,0.14)',
            }}
          >
            {/* ── Slim top bar ── */}
            <Box sx={{
              px:3.5, py:2.25, display:'flex', alignItems:'center',
              justifyContent:'space-between', borderBottom:`1px solid ${T.border}`,
              background:T.offwhite, flexShrink:0,
            }}>
              <Box sx={{ display:'flex', alignItems:'center', gap:1.5 }}>
                <Box sx={{ width:2, height:14, borderRadius:'2px', background:accent }} />
                <Typography sx={{ fontFamily:MONO, fontSize:'0.56rem', letterSpacing:'0.18em', color:T.inkFaint, textTransform:'uppercase' }}>
                  Template Preview
                </Typography>
              </Box>
              <motion.button
                onClick={onClose}
                whileHover={{ scale:1.1 }}
                whileTap={{ scale:0.92 }}
                style={{
                  width:32, height:32, borderRadius:'8px',
                  border:`1px solid ${T.border}`, background:'transparent',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  cursor:'pointer', outline:'none',
                }}
              >
                <CloseIcon sx={{ fontSize:'0.875rem', color:T.inkMuted }} />
              </motion.button>
            </Box>

            {/* ── Scrollable body ── */}
            <Box ref={scrollRef} sx={{ flex:1, overflowY:'auto', overflowX:'hidden' }}>
              {isLoading ? <DrawerSkeleton /> : isError || !template ? (
                <Box sx={{ p:4, textAlign:'center', py:12 }}>
                  <Typography sx={{ fontFamily:SERIF, fontStyle:'italic', fontSize:'1.5rem', color:T.inkMuted }}>Failed to load.</Typography>
                </Box>
              ) : (
                <motion.div
                  initial={{ opacity:0, y:12 }}
                  animate={{ opacity:1, y:0 }}
                  transition={{ duration:0.35, ease:EASE }}
                >
                  {/* ── Parallax hero cover ── */}
                  <Box sx={{ position:'relative', height:340, overflow:'hidden', background:T.parchment }}>
                    {template.thumbnailUrl ? (
                      <motion.div style={{ y:imgY, position:'absolute', inset:'-15%' }}>
                        <Image
                          src={template.thumbnailUrl} alt={template.name} fill
                          style={{ objectFit:'cover' }}
                        />
                      </motion.div>
                    ) : (
                      <Box sx={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center' }}>
                        <Typography sx={{ fontFamily:SERIF, fontStyle:'italic', fontSize:'6rem', color:'rgba(12,14,18,0.07)' }}>₹</Typography>
                      </Box>
                    )}
                    {/* Gradient fade out */}
                    <Box sx={{ position:'absolute', bottom:0, left:0, right:0, height:100, background:'linear-gradient(to top,rgba(255,255,255,1),transparent)' }} />
                    {/* Discount badge */}
                    {template.discountPercent && template.discountPercent > 0 && (
                      <Box sx={{ position:'absolute', top:16, right:16, px:'10px', py:'5px', borderRadius:'4px', background:T.error }}>
                        <Typography sx={{ fontFamily:MONO, fontSize:'0.56rem', letterSpacing:'0.1em', color:T.white }}>-{template.discountPercent}% OFF</Typography>
                      </Box>
                    )}
                  </Box>

                  {/* ── Content ── */}
                  <Box sx={{ px:4, pt:0, pb:2 }}>
                    {/* Tag row */}
                    <Box sx={{ display:'flex', gap:0.75, flexWrap:'wrap', mb:2.5 }}>
                      {[
                        { text:template.category.name, c:accent },
                        { text:template.format.toUpperCase(), c:accent },
                        { text:template.difficulty, c:T.inkFaint },
                      ].map(b=>(
                        <Box key={b.text} sx={{ px:'10px', py:'4px', borderRadius:'5px', border:`1px solid ${b.c}22`, background:`${b.c}08` }}>
                          <Typography sx={{ fontFamily:MONO, fontSize:'0.5rem', letterSpacing:'0.15em', color:b.c, textTransform:'uppercase' }}>
                            {b.text}
                          </Typography>
                        </Box>
                      ))}
                    </Box>

                    {/* Title */}
                    <Typography sx={{
                      fontFamily:SERIF, fontStyle:'italic', fontWeight:400,
                      fontSize:{ xs:'1.625rem', sm:'2.125rem' },
                      color:T.ink, letterSpacing:'-0.025em', lineHeight:1.08, mb:1.75,
                    }}>
                      {template.name}
                    </Typography>

                    {/* Rating + downloads */}
                    <Box sx={{ display:'flex', alignItems:'center', gap:2, mb:3 }}>
                      <Box sx={{ display:'flex', gap:'2px' }}>
                        {Array.from({ length:5 }).map((_,i)=>(
                          <StarIcon key={i} sx={{ fontSize:'0.875rem', color:i<Math.round(template.rating)?T.goldMid:T.border }} />
                        ))}
                      </Box>
                      <Typography sx={{ fontFamily:MONO, fontSize:'0.58rem', letterSpacing:'0.06em', color:T.inkFaint }}>
                        {template.rating.toFixed(1)} · {template.reviewCount} reviews
                      </Typography>
                      <Box sx={{ width:'1px', height:10, background:T.border }} />
                      <Box sx={{ display:'flex', alignItems:'center', gap:0.5 }}>
                        <DownloadIcon sx={{ fontSize:'0.75rem', color:T.inkGhost }} />
                        <Typography sx={{ fontFamily:MONO, fontSize:'0.58rem', letterSpacing:'0.06em', color:T.inkFaint }}>
                          {template.downloadCount.toLocaleString()} downloads
                        </Typography>
                      </Box>
                    </Box>

                    {/* Description */}
                    <Typography sx={{ fontFamily:SANS, fontSize:'0.9375rem', color:T.inkMuted, lineHeight:1.82, mb:3.5 }}>
                      {template.longDescription}
                    </Typography>

                    {/* Divider */}
                    <Box sx={{ height:'1px', background:T.border, mb:3.5 }} />

                    {/* What's included */}
                    {template.features?.length > 0 && (
                      <Box sx={{ mb:3.5 }}>
                        <Box sx={{ display:'flex', alignItems:'center', gap:1.25, mb:2.5 }}>
                          <Box sx={{ width:2, height:14, borderRadius:'2px', background:accent }} />
                          <Typography sx={{ fontFamily:MONO, fontSize:'0.58rem', letterSpacing:'0.16em', color:T.inkFaint, textTransform:'uppercase' }}>
                            What's Included
                          </Typography>
                        </Box>
                        <Box sx={{ display:'flex', flexDirection:'column', gap:1.25 }}>
                          {(template.features as string[]).map((f,i)=>(
                            <motion.div
                              key={i}
                              initial={{ opacity:0, x:-10 }}
                              animate={{ opacity:1, x:0 }}
                              transition={{ delay:i*0.045, duration:0.3 }}
                            >
                              <Box sx={{ display:'flex', alignItems:'flex-start', gap:1.25 }}>
                                <Box sx={{
                                  width:18, height:18, borderRadius:'50%', flexShrink:0, mt:'1px',
                                  background:`${T.sage}12`, border:`1px solid ${T.sage}26`,
                                  display:'flex', alignItems:'center', justifyContent:'center',
                                }}>
                                  <CheckIcon sx={{ fontSize:'0.65rem', color:T.sage }} />
                                </Box>
                                <Typography sx={{ fontFamily:SANS, fontSize:'0.875rem', color:T.inkMid, lineHeight:1.55 }}>
                                  {f}
                                </Typography>
                              </Box>
                            </motion.div>
                          ))}
                        </Box>
                      </Box>
                    )}

                    {/* Tags */}
                    {template.tags?.length > 0 && (
                      <Box sx={{ display:'flex', gap:0.75, flexWrap:'wrap', pb:3 }}>
                        {(template.tags as string[]).map(tag=>(
                          <Box key={tag} sx={{ px:'10px', py:'4px', border:`1px solid ${T.border}`, borderRadius:'5px' }}>
                            <Typography sx={{ fontFamily:MONO, fontSize:'0.5rem', letterSpacing:'0.1em', color:T.inkGhost }}>
                              #{tag}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    )}
                  </Box>
                </motion.div>
              )}
            </Box>

            {/* ── Sticky CTA footer ── */}
            {template && (
              <Box sx={{
                px:3.5, py:2.75,
                borderTop:`1px solid ${T.border}`,
                background:T.white,
                display:'flex', alignItems:'center', gap:2.5, flexShrink:0,
                boxShadow:'0 -8px 24px rgba(12,14,18,0.05)',
              }}>
                {/* Price stack */}
                <Box sx={{ flexShrink:0 }}>
                  <Typography sx={{
                    fontFamily:SERIF, fontStyle:'italic', fontWeight:400,
                    fontSize:'1.875rem', color:T.ink, letterSpacing:'-0.028em', lineHeight:1,
                  }}>
                    {format(template.price, template.currency as 'INR')}
                  </Typography>
                  {template.originalPrice && template.originalPrice > template.price && (
                    <Typography sx={{ fontFamily:MONO, fontSize:'0.58rem', color:T.inkGhost, textDecoration:'line-through', mt:'2px' }}>
                      {format(template.originalPrice, template.currency as 'INR')}
                    </Typography>
                  )}
                </Box>

                {/* CTA button */}
                <motion.div style={{ flex:1 }} whileHover={{ scale:1.015 }} whileTap={{ scale:0.985 }}>
                  <Box
                    component="button"
                    onClick={()=>{ if (!inCart){ addItem(template); onClose(); } }}
                    sx={{
                      width:'100%',
                      display:'flex', alignItems:'center', justifyContent:'center', gap:1.25,
                      py:1.625, borderRadius:'11px',
                      border:inCart ? `1.5px solid ${T.sage}` : 'none',
                      background:inCart ? 'transparent' : `linear-gradient(115deg,${T.goldLight},${T.gold})`,
                      cursor:inCart ? 'default' : 'pointer', outline:'none',
                      transition:'box-shadow 0.2s',
                      boxShadow:inCart ? 'none' : `0 6px 22px rgba(184,146,42,0.30)`,
                      '&:hover':{ boxShadow:inCart?'none':'0 8px 28px rgba(184,146,42,0.40)' },
                    }}
                  >
                    <CartIcon sx={{ fontSize:'1rem', color:inCart?T.sage:T.ink }} />
                    <Typography sx={{ fontFamily:SANS, fontWeight:600, fontSize:'0.9375rem', color:inCart?T.sage:T.ink, letterSpacing:'-0.01em' }}>
                      {inCart ? '✓ Added to Cart' : 'Add to Cart'}
                    </Typography>
                    {!inCart && <ArrowIcon sx={{ fontSize:'0.875rem', color:T.ink, opacity:0.5 }} />}
                  </Box>
                </motion.div>
              </Box>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}