'use client';

import { Box, Typography } from '@mui/material';

const T = {
  white:    '#FFFFFF',
  bg:       '#F7F8FA',
  ink:      '#0A0A0F',
  inkMuted: '#5A6478',
  inkFaint: '#A0A0AE',
  border:   'rgba(10,10,20,0.08)',
};

export const FONT_SANS = '"DM Sans", system-ui, sans-serif';
export const FONT_MONO = '"DM Mono", ui-monospace, monospace';
export const EASE      = [0.16, 1, 0.3, 1] as const;

interface CalcLayoutProps {
  title:        string;
  description:  string;
  accent:       string;
  glyph:        string;
  inputsPanel:  React.ReactNode;
  resultsPanel: React.ReactNode;
  chartsPanel:  React.ReactNode;
}

export function CalcLayout({ title, description, accent, inputsPanel, resultsPanel, chartsPanel }: CalcLayoutProps) {
  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      overflow: 'hidden',
      // On mobile, allow full scroll
      '@media (max-width:899px)': {
        height: 'auto',
        overflow: 'visible',
      },
    }}>

      {/* ── Results strip ── */}
      <Box sx={{
        flexShrink: 0,
        px: { xs: 2, md: 3 },
        py: { xs: 1.5, md: 1.5 },
        borderBottom: `1px solid ${T.border}`,
        background: T.white,
      }}>
        {resultsPanel}
      </Box>

      {/* ── Body: inputs | charts ── */}
      <Box sx={{
        flex: 1,
        display: 'grid',
        // Desktop: side-by-side. Mobile: stacked
        gridTemplateColumns: { xs: '1fr', md: '240px 1fr' },
        minHeight: 0,
        overflow: 'hidden',
        '@media (max-width:899px)': { overflow: 'visible' },
      }}>

        {/* Inputs */}
        <Box sx={{
          borderRight: { md: `1px solid ${T.border}` },
          borderBottom: { xs: `1px solid ${T.border}`, md: 'none' },
          background: T.white,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          '@media (max-width:899px)': { overflow: 'visible' },
        }}>
          <Box sx={{ px: { xs: 2, md: 2.5 }, pt: { xs: 1.5, md: 2 }, pb: 1.25, borderBottom: `1px solid ${T.border}`, flexShrink: 0 }}>
            <Typography sx={{ fontFamily: FONT_SANS, fontWeight: 700, fontSize: '0.8125rem', color: T.ink, letterSpacing: '-0.01em', mb: 0.2 }}>
              {title}
            </Typography>
            <Typography sx={{ fontFamily: FONT_SANS, fontSize: '0.6875rem', color: T.inkFaint, lineHeight: 1.4 }}>
              {description}
            </Typography>
          </Box>
          <Box sx={{
            flex: 1,
            overflowY: 'auto',
            px: { xs: 2, md: 2.5 },
            py: 1.75,
            '@media (max-width:899px)': { overflow: 'visible' },
            '&::-webkit-scrollbar': { width: 3 },
            '&::-webkit-scrollbar-thumb': { background: T.border, borderRadius: 2 },
          }}>
            {inputsPanel}
          </Box>
        </Box>

        {/* Charts */}
        <Box sx={{
          overflowY: 'auto',
          px: { xs: 2, md: 2.5 },
          py: { xs: 2, md: 2 },
          background: T.bg,
          '@media (max-width:899px)': { overflow: 'visible' },
          '&::-webkit-scrollbar': { width: 3 },
          '&::-webkit-scrollbar-thumb': { background: T.border, borderRadius: 2 },
        }}>
          {chartsPanel}
        </Box>
      </Box>
    </Box>
  );
}