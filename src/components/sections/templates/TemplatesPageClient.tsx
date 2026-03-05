'use client';

import { Box, Container, Typography } from '@mui/material';
import { Search as SearchIcon, Close as CloseIcon } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { ErrorBoundary } from '@/components/ui';
import { TemplateGrid } from './TemplateGrid';
import { useSearchFilter } from '@/lib/hooks/useSearchFilter';

const T = {
  bg:       '#FFFFFF',
  bgSection:'#F5F7FB',
  ink:      '#0A0A0F',
  inkMid:   '#1E1E2A',
  inkMuted: '#5A5A72',
  inkFaint: '#9898AE',
  border:   'rgba(10,10,20,0.08)',
  borderFocus: 'rgba(59,123,246,0.38)',
  blue:     '#3B7BF6',
  blueMid:  '#5A92F8',
  blueLight:'#7AABFF',
  bluePale: '#EDF3FF',
  blueGlow: 'rgba(59,123,246,0.10)',
  blueGrad: 'linear-gradient(135deg,#3B7BF6 0%,#7AABFF 100%)',
};

const SANS = '"DM Sans","Mona Sans",system-ui,sans-serif';
const MONO = '"DM Mono","JetBrains Mono",ui-monospace,monospace';
const EASE = [0.16, 1, 0.3, 1] as const;

/* ── Floating label tags ── */
const TAGS = ['Financial Modelling', 'Cash Flow', 'DCF', 'Excel Dashboards', 'Runway', 'Unit Economics'];

export function TemplatesPageClient() {
  const filter = useSearchFilter({ initialSort: 'popular' });
  const { searchQuery, handleSearchChange } = filter;

  return (
    <Box sx={{ minHeight: '100vh', background: T.bg }}>

      {/* ════ HEADER ════ */}
      <Box sx={{
        pt: { xs: 11, md: 14 },
        pb: { xs: 5, md: 6 },
        borderBottom: `1px solid ${T.border}`,
        position: 'relative', overflow: 'hidden',
      }}>

        {/* Dot grid */}
        <Box sx={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: `radial-gradient(circle, rgba(59,123,246,0.055) 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }} />

        {/* Top blue glow */}
        <Box sx={{
          position: 'absolute',
          width: '55vw', height: '28vw',
          top: '-12vw', left: '22vw',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(59,123,246,0.09) 0%, transparent 68%)',
          pointerEvents: 'none',
        }} />

        {/* Bottom border gradient line */}
        <Box sx={{
          position: 'absolute', bottom: -1, left: '15%', right: '15%', height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(59,123,246,0.3), transparent)',
          pointerEvents: 'none',
        }} />

        <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>

          {/* Eyebrow tag */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <Box sx={{
              display: 'inline-flex', alignItems: 'center', gap: 1,
              px: '12px', py: '5px', borderRadius: '100px',
              border: `1px solid rgba(59,123,246,0.2)`,
              background: T.bluePale,
              mb: 4,
            }}>
              <Box sx={{ width: 5, height: 5, borderRadius: '50%', background: T.blueGrad }} />
              <Typography sx={{
                fontFamily: MONO, fontSize: '0.5rem',
                letterSpacing: '0.18em', color: T.blue, textTransform: 'uppercase',
              }}>
                Template Store
              </Typography>
            </Box>
          </motion.div>

          {/* Search bar */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.08, ease: EASE }}
          >
            <Box sx={{
              display: 'flex', alignItems: 'center',
              background: T.bg,
              border: `1.5px solid ${T.border}`,
              borderRadius: '16px',
              height: 58,
              overflow: 'hidden',
              boxShadow: '0 2px 16px rgba(10,10,20,0.06), 0 1px 4px rgba(10,10,20,0.04)',
              transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
              '&:focus-within': {
                borderColor: T.borderFocus,
                boxShadow: `0 0 0 4px ${T.blueGlow}, 0 2px 16px rgba(10,10,20,0.06)`,
              },
            }}>

              {/* Icon */}
              <Box sx={{ pl: 2.25, pr: 1.5, display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                <SearchIcon sx={{ fontSize: '1.1rem', color: T.inkFaint }} />
              </Box>

              {/* Input */}
              <Box
                component="input"
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSearchChange(e.target.value)}
                placeholder="Search templates…"
                sx={{
                  flex: 1, height: '100%',
                  border: 'none', outline: 'none',
                  background: 'transparent',
                  fontFamily: SANS, fontSize: '0.9375rem', fontWeight: 500,
                  color: T.ink,
                  '&::placeholder': { color: T.inkFaint, fontWeight: 400 },
                }}
              />

              {/* Clear button */}
              <AnimatePresence>
                {searchQuery && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.6 }}
                    transition={{ duration: 0.15 }}
                    style={{ paddingRight: 10, display: 'flex', alignItems: 'center' }}
                  >
                    <Box
                      component="button"
                      onClick={() => handleSearchChange('')}
                      sx={{
                        width: 22, height: 22, borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: 'rgba(10,10,20,0.07)',
                        border: 'none', cursor: 'pointer',
                        transition: 'background 0.15s',
                        '&:hover': { background: 'rgba(10,10,20,0.13)' },
                      }}
                    >
                      <CloseIcon sx={{ fontSize: '0.65rem', color: T.inkMuted }} />
                    </Box>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Divider */}
              <Box sx={{ width: '1px', height: '60%', background: T.border, flexShrink: 0 }} />

              {/* Search button */}
              <motion.button
                whileHover={{ filter: 'brightness(1.07)' }}
                whileTap={{ scale: 0.97 }}
                style={{
                  height: '100%',
                  padding: '0 26px',
                  border: 'none',
                  background: T.blueGrad,
                  color: '#FFFFFF',
                  fontFamily: SANS,
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  letterSpacing: '-0.01em',
                  flexShrink: 0,
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15)',
                }}
              >
                Search
              </motion.button>
            </Box>
          </motion.div>

          {/* Suggestion tags */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: EASE }}
          >
            <Box sx={{
              display: 'flex', flexWrap: 'wrap', gap: 1,
              justifyContent: 'center', mt: 3,
            }}>
              {TAGS.map((tag, i) => (
                <motion.button
                  key={tag}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.25 + i * 0.04, ease: EASE }}
                  onClick={() => handleSearchChange(tag)}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    padding: '5px 13px',
                    borderRadius: '100px',
                    border: `1px solid ${T.border}`,
                    background: 'transparent',
                    fontFamily: SANS,
                    fontWeight: 500,
                    fontSize: '0.78rem',
                    color: T.inkMuted,
                    cursor: 'pointer',
                    transition: 'border-color 0.15s, color 0.15s, background 0.15s',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(59,123,246,0.3)';
                    (e.currentTarget as HTMLButtonElement).style.color = T.blue;
                    (e.currentTarget as HTMLButtonElement).style.background = T.bluePale;
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = T.border;
                    (e.currentTarget as HTMLButtonElement).style.color = T.inkMuted;
                    (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                  }}
                >
                  {tag}
                </motion.button>
              ))}
            </Box>
          </motion.div>

        </Container>
      </Box>

      {/* ════ GRID ════ */}
      <Container maxWidth="xl" sx={{ pt: { xs: 6, md: 8 }, pb: 16 }}>
        <ErrorBoundary>
          <TemplateGrid filter={filter} />
        </ErrorBoundary>
      </Container>

    </Box>
  );
}