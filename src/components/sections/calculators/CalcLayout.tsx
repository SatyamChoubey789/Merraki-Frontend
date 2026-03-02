'use client';

import { Box, Container, Typography } from '@mui/material';
import { motion } from 'framer-motion';

/* ── BLUISH-WHITE LIGHT MODE TOKENS ─────────────────────────────── */

const T = {
  /* surfaces */
  white: "#FFFFFF",
  offwhite: "#F6F9FF",
  cream: "#EEF4FF",
  parchment: "#E6EEFF",

  /* text */
  ink: "#0B1220",
  inkMid: "#1E293B",
  inkMuted: "#475569",
  inkFaint: "#94A3B8",
  inkGhost: "#CBD5E1",

  /* borders */
  border: "#E2E8F0",
  borderMd: "#CBD5E1",

  /* blues */
  blue: "#2563EB",
  blueMid: "#3B82F6",
  blueLight: "#93C5FD",
  blueGlow: "rgba(37,99,235,0.08)",
  blueBdr: "rgba(37,99,235,0.18)",
};

export const FONT_SERIF = '"Instrument Serif", "Playfair Display", Georgia, serif';
export const FONT_SANS  = '"DM Sans", "Mona Sans", system-ui, sans-serif';
export const FONT_MONO  = '"DM Mono", "JetBrains Mono", ui-monospace, monospace';
export const EASE       = [0.16, 1, 0.3, 1] as const;

/* ───────────────────────────────────────────────────────────────── */

interface CalcLayoutProps {
  title: string;
  description: string;
  accent: string;
  glyph: string;
  inputsPanel: React.ReactNode;
  resultsPanel: React.ReactNode;
  chartsPanel: React.ReactNode;
}

export function CalcLayout({
  title,
  description,
  accent,
  glyph,
  inputsPanel,
  resultsPanel,
  chartsPanel,
}: CalcLayoutProps) {
  return (
    <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>

      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        <Box
          sx={{
            mb: 5,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Box>
            {/* Glyph + accent line */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
              <Typography
                sx={{
                  fontFamily: FONT_MONO,
                  fontSize: '0.56rem',
                  letterSpacing: '0.2em',
                  color: accent,
                  textTransform: 'uppercase',
                }}
              >
                {glyph}
              </Typography>
              <Box sx={{ width: 32, height: '1px', background: accent, opacity: 0.6 }} />
            </Box>

            <Typography
              sx={{
                fontFamily: FONT_SERIF,
                fontStyle: 'italic',
                fontWeight: 400,
                fontSize: { xs: '1.75rem', md: '2.5rem' },
                color: T.ink,
                letterSpacing: '-0.025em',
                lineHeight: 1.05,
                mb: 1,
              }}
            >
              {title}
            </Typography>

            <Typography
              sx={{
                fontFamily: FONT_SANS,
                fontSize: '0.95rem',
                color: T.inkMuted,
                lineHeight: 1.72,
                maxWidth: 560,
              }}
            >
              {description}
            </Typography>
          </Box>
        </Box>
      </motion.div>

      {/* Layout */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '360px 1fr' },
          gap: { xs: 3, lg: 4 },
          alignItems: 'start',
        }}
      >
        {/* ── Inputs panel (sticky) ── */}
        <Box sx={{ position: { lg: 'sticky' }, top: { lg: 90 } }}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, delay: 0.1, ease: EASE }}
          >
            <Box
              sx={{
                background: T.white,
                borderRadius: '16px',
                border: `1px solid ${T.border}`,
                overflow: 'hidden',
                boxShadow: '0 4px 18px rgba(37,99,235,0.04)',
                backdropFilter: 'blur(4px)',
              }}
            >
              {/* Header */}
              <Box
                sx={{
                  px: 3,
                  py: 2,
                  borderBottom: `1px solid ${T.border}`,
                  background: T.offwhite,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                }}
              >
                <Box sx={{ width: 2, height: 14, borderRadius: '2px', background: accent }} />
                <Typography
                  sx={{
                    fontFamily: FONT_MONO,
                    fontSize: '0.58rem',
                    letterSpacing: '0.18em',
                    color: T.inkMuted,
                    textTransform: 'uppercase',
                  }}
                >
                  Inputs
                </Typography>
              </Box>

              <Box sx={{ p: 3 }}>{inputsPanel}</Box>
            </Box>
          </motion.div>
        </Box>

        {/* ── Results + Charts ── */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

          {/* Key Results */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.18, ease: EASE }}
          >
            <Box
              sx={{
                background: T.white,
                borderRadius: '16px',
                border: `1px solid ${T.border}`,
                overflow: 'hidden',
                boxShadow: '0 4px 18px rgba(37,99,235,0.04)',
              }}
            >
              <Box
                sx={{
                  px: 3,
                  py: 2,
                  borderBottom: `1px solid ${T.border}`,
                  background: T.offwhite,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                }}
              >
                <Box sx={{ width: 2, height: 14, borderRadius: '2px', background: accent }} />
                <Typography
                  sx={{
                    fontFamily: FONT_MONO,
                    fontSize: '0.58rem',
                    letterSpacing: '0.18em',
                    color: T.inkMuted,
                    textTransform: 'uppercase',
                  }}
                >
                  Key Results
                </Typography>
              </Box>

              <Box sx={{ p: 3 }}>{resultsPanel}</Box>
            </Box>
          </motion.div>

          {/* Charts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.28, ease: EASE }}
          >
            <Box
              sx={{
                background: T.white,
                borderRadius: '16px',
                border: `1px solid ${T.border}`,
                overflow: 'hidden',
                boxShadow: '0 4px 18px rgba(37,99,235,0.04)',
              }}
            >
              <Box
                sx={{
                  px: 3,
                  py: 2,
                  borderBottom: `1px solid ${T.border}`,
                  background: T.offwhite,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                }}
              >
                <Box sx={{ width: 2, height: 14, borderRadius: '2px', background: T.borderMd }} />
                <Typography
                  sx={{
                    fontFamily: FONT_MONO,
                    fontSize: '0.58rem',
                    letterSpacing: '0.18em',
                    color: T.inkMuted,
                    textTransform: 'uppercase',
                  }}
                >
                  Visual Analysis
                </Typography>
              </Box>

              <Box sx={{ p: 3 }}>{chartsPanel}</Box>
            </Box>
          </motion.div>

        </Box>
      </Box>
    </Container>
  );
}