'use client';

import { Box, Container, Grid, Typography } from '@mui/material';
import { colorTokens, shadowTokens } from '@/theme';

interface CalcLayoutProps {
  title: string;
  description: string;
  accent: string;
  inputsPanel: React.ReactNode;
  resultsPanel: React.ReactNode;
  chartsPanel: React.ReactNode;
}

export function CalcLayout({
  title,
  description,
  accent,
  inputsPanel,
  resultsPanel,
  chartsPanel,
}: CalcLayoutProps) {
  return (
    <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
      {/* Section title */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 800,
            color: colorTokens.darkNavy[900],
            mb: 0.75,
            letterSpacing: '-0.025em',
          }}
        >
          {title}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
          {description}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Inputs */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Box
            sx={{
              backgroundColor: colorTokens.white,
              borderRadius: '20px',
              border: `1px solid ${colorTokens.slate[100]}`,
              boxShadow: shadowTokens.md,
              overflow: 'hidden',
              position: { lg: 'sticky' },
              top: { lg: 96 },
            }}
          >
            <Box
              sx={{
                px: 3,
                py: 2,
                background: `linear-gradient(135deg, ${accent}15, ${accent}08)`,
                borderBottom: `1px solid ${accent}22`,
              }}
            >
              <Typography
                variant="overline"
                sx={{ color: accent, letterSpacing: '0.1em', fontWeight: 700 }}
              >
                Inputs
              </Typography>
            </Box>
            <Box sx={{ p: 3 }}>{inputsPanel}</Box>
          </Box>
        </Grid>

        {/* Results + Charts */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Key metrics */}
            <Box
              sx={{
                backgroundColor: colorTokens.white,
                borderRadius: '20px',
                border: `1px solid ${colorTokens.slate[100]}`,
                boxShadow: shadowTokens.md,
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  px: 3,
                  py: 2,
                  background: `linear-gradient(135deg, ${accent}15, ${accent}08)`,
                  borderBottom: `1px solid ${accent}22`,
                }}
              >
                <Typography
                  variant="overline"
                  sx={{ color: accent, letterSpacing: '0.1em', fontWeight: 700 }}
                >
                  Key Results
                </Typography>
              </Box>
              <Box sx={{ p: 3 }}>{resultsPanel}</Box>
            </Box>

            {/* Charts */}
            <Box
              sx={{
                backgroundColor: colorTokens.white,
                borderRadius: '20px',
                border: `1px solid ${colorTokens.slate[100]}`,
                boxShadow: shadowTokens.md,
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  px: 3,
                  py: 2,
                  borderBottom: `1px solid ${colorTokens.slate[100]}`,
                }}
              >
                <Typography
                  variant="overline"
                  sx={{
                    color: colorTokens.slate[500],
                    letterSpacing: '0.1em',
                    fontWeight: 700,
                  }}
                >
                  Visual Analysis
                </Typography>
              </Box>
              <Box sx={{ p: 3 }}>{chartsPanel}</Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}