'use client';

import { Box, Typography } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import { useTemplates, useTemplateSearch } from '@/lib/hooks/useTemplates';
import { TemplateCard } from './TemplateCard';
import type { useSearchFilter } from '@/lib/hooks/useSearchFilter';

const T = {
  white:'#FFFFFF', cream:'#F0EDE6', parchment:'#E8E4DA',
  ink:'#0C0E12', inkMuted:'#64748B', inkFaint:'#94A3B8', inkGhost:'#CBD5E1',
  border:'#E2DED5', gold:'#B8922A', goldMid:'#C9A84C',
};
const SERIF = '"Instrument Serif","Playfair Display",Georgia,serif';
const SANS  = '"DM Sans","Mona Sans",system-ui,sans-serif';
const MONO  = '"DM Mono","JetBrains Mono",ui-monospace,monospace';
const EASE  = [0.16,1,0.3,1] as const;

type FilterState = ReturnType<typeof useSearchFilter>;
interface Props { filter:FilterState; }

/* ── Shimmer skeleton ─────────────────────────────────── */
function Skel() {
  return (
    <Box sx={{
      borderRadius:'18px', border:`1px solid ${T.border}`,
      overflow:'hidden', background:T.white,
    }}>
      <Box sx={{ height:208, background:T.parchment,
        '@keyframes skPulse':{ '0%,100%':{ opacity:1 },'50%':{ opacity:0.52 } },
        animation:'skPulse 1.7s ease-in-out infinite' }} />
      <Box sx={{ p:2.75 }}>
        {[48,80,100,90,65].map((w,i)=>(
          <Box key={i} sx={{ height:i===0?8:i===1?18:i===2?14:i===3?14:28, background:T.cream, borderRadius:'4px', width:`${w}%`, mb:i<4?1.25:0, animation:'skPulse 1.7s ease-in-out infinite' }} />
        ))}
      </Box>
    </Box>
  );
}

export function TemplateGrid({ filter }:Props) {
  const { debouncedQuery, selectedCategory, sortBy, page, limit, isSearching, goToPage } = filter;

  const listQ   = useTemplates({ page, limit, category:selectedCategory||undefined, sortBy:sortBy as any });
  const searchQ = useTemplateSearch(debouncedQuery, isSearching);
  const active  = isSearching ? searchQ : listQ;
  const { data, isLoading, isError } = active;

  const templates  = data?.data ?? [];
  const pagination = !isSearching && 'pagination' in (data??{}) ? (data as any).pagination : null;

  /* ── Loading ── */
  if (isLoading) return (
    <Box sx={{ display:'grid', gridTemplateColumns:{ xs:'1fr', sm:'1fr 1fr', lg:'1fr 1fr 1fr' }, gap:3 }}>
      {Array.from({ length:6 }).map((_,i)=><Skel key={i} />)}
    </Box>
  );

  /* ── Error ── */
  if (isError) return (
    <Box sx={{ textAlign:'center', py:14 }}>
      <Typography sx={{ fontFamily:SERIF, fontStyle:'italic', fontSize:'1.75rem', color:T.inkMuted, mb:2 }}>Something went wrong.</Typography>
      <Box component="button" onClick={()=>active.refetch()}
        sx={{ fontFamily:SANS, fontSize:'0.875rem', color:T.gold, border:`1px solid ${T.gold}`, borderRadius:'8px', px:2.5, py:1, cursor:'pointer', background:'transparent', outline:'none' }}>
        Try again
      </Box>
    </Box>
  );

  /* ── Empty ── */
  if (templates.length === 0) return (
    <Box sx={{ textAlign:'center', py:14 }}>
      <Typography sx={{ fontFamily:SERIF, fontStyle:'italic', fontSize:'2rem', color:T.inkFaint, mb:1 }}>
        {isSearching ? `No results for "${debouncedQuery}"` : 'No templates found.'}
      </Typography>
      <Box component="button" onClick={()=>filter.clearFilters()}
        sx={{ mt:2, fontFamily:SANS, fontSize:'0.875rem', color:T.gold, border:`1px solid ${T.gold}`, borderRadius:'8px', px:2.5, py:1, cursor:'pointer', background:'transparent', outline:'none' }}>
        Clear filters
      </Box>
    </Box>
  );

  return (
    <Box>
      {/* Count */}
      <Box sx={{ display:'flex', alignItems:'center', mb:3.5 }}>
        <Typography sx={{ fontFamily:MONO, fontSize:'0.58rem', letterSpacing:'0.12em', color:T.inkFaint, textTransform:'uppercase' }}>
          {isSearching
            ? `${templates.length} result${templates.length!==1?'s':''} for "${debouncedQuery}"`
            : pagination ? `${pagination.total} templates available` : `${templates.length} templates`}
        </Typography>
      </Box>

      {/* Grid with animated key change */}
      <motion.div
        key={`${selectedCategory}-${sortBy}-${page}-${debouncedQuery}`}
        initial={{ opacity:0 }}
        animate={{ opacity:1 }}
        transition={{ duration:0.28 }}
      >
        <Box sx={{ display:'grid', gridTemplateColumns:{ xs:'1fr', sm:'1fr 1fr', lg:'1fr 1fr 1fr' }, gap:3 }}>
          <AnimatePresence mode="popLayout">
            {templates.map((t,i) => <TemplateCard key={t.id} template={t} index={i} />)}
          </AnimatePresence>
        </Box>
      </motion.div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <Box sx={{ display:'flex', alignItems:'center', justifyContent:'center', gap:0.75, mt:9, pt:5, borderTop:`1px solid ${T.border}` }}>
          {Array.from({ length:pagination.totalPages }).map((_,i)=>(
            <motion.button
              key={i}
              onClick={()=>goToPage(i+1)}
              whileHover={{ scale:1.08 }}
              whileTap={{ scale:0.94 }}
              style={{
                width:38, height:38,
                border:`1px solid ${page===i+1?T.gold:T.border}`,
                borderRadius:'9px',
                background:page===i+1?`linear-gradient(115deg,rgba(221,185,106,0.18),rgba(184,146,42,0.10))`:'transparent',
                cursor:'pointer',
                fontFamily:MONO, fontSize:'0.72rem',
                color:page===i+1?T.gold:T.inkFaint,
                outline:'none',
                transition:'border-color 0.15s, color 0.15s',
              }}
            >
              {i+1}
            </motion.button>
          ))}
        </Box>
      )}
    </Box>
  );
}