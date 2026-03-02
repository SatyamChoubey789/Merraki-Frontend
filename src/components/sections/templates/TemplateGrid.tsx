'use client';

import { Box, Typography } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import { useTemplates, useTemplateSearch } from '@/lib/hooks/useTemplates';
import { TemplateCard } from './TemplateCard';
import type { useSearchFilter } from '@/lib/hooks/useSearchFilter';

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

type FilterState = ReturnType<typeof useSearchFilter>;
interface Props { filter:FilterState; }

/* ── Shimmer skeleton ─────────────────────────────────── */
function Skel() {
  return (
    <Box sx={{
      borderRadius:'18px', border:`1px solid ${T.border}`,
      overflow:'hidden', background:T.white,
    }}>
      <Box sx={{ height:208, background:T.paper,
        '@keyframes skPulse':{ '0%,100%':{ opacity:1 },'50%':{ opacity:0.52 } },
        animation:'skPulse 1.7s ease-in-out infinite' }} />
      <Box sx={{ p:2.75 }}>
        {[48,80,100,90,65].map((w,i)=>(
          <Box key={i} sx={{ height:i===0?8:i===1?18:i===2?14:i===3?14:28, background:T.bluePale, borderRadius:'4px', width:`${w}%`, mb:i<4?1.25:0, animation:'skPulse 1.7s ease-in-out infinite' }} />
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
        sx={{ fontFamily:SANS, fontSize:'0.875rem', color:T.blue, border:`1px solid ${T.blue}`, borderRadius:'8px', px:2.5, py:1, cursor:'pointer', background:'transparent', outline:'none' }}>
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
        sx={{ mt:2, fontFamily:SANS, fontSize:'0.875rem', color:T.blue, border:`1px solid ${T.blue}`, borderRadius:'8px', px:2.5, py:1, cursor:'pointer', background:'transparent', outline:'none' }}>
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
                border:`1px solid ${page===i+1?T.blue:T.border}`,
                borderRadius:'9px',
                background:page===i+1?`linear-gradient(115deg,rgba(59,123,246,0.18),rgba(90,146,248,0.10))`:'transparent',
                cursor:'pointer',
                fontFamily:MONO, fontSize:'0.72rem',
                color:page===i+1?T.blue:T.inkFaint,
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