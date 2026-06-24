'use client';

import { Box, Typography } from '@mui/material';
import { colorTokens } from '@/theme';

interface SectionLabelProps {
  text: string;
  color?: 'blue' | 'dark' | 'light';
}

export function SectionLabel({ text, color = 'blue' }: SectionLabelProps) {
  const colorMap = {
    blue: {
      bg: colorTokens.financeBlue[50],
      text: colorTokens.financeBlue[600],
      dot: colorTokens.financeBlue[500],
      border: colorTokens.financeBlue[100],
    },
    dark: {
      bg: colorTokens.darkNavy[800],
      text: colorTokens.financeBlue[300],
      dot: colorTokens.financeBlue[400],
      border: colorTokens.darkNavy[700],
    },
    light: {
      bg: 'rgba(255,255,255,0.1)',
      text: 'rgba(255,255,255,0.9)',
      dot: colorTokens.financeBlue[300],
      border: 'rgba(255,255,255,0.2)',
    },
  };

  const c = colorMap[color];

  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        px: '14px',
        py: '6px',
        background: c.bg,
        border: `1px solid ${c.border}`,
        borderRadius: '999px',
        mb: 2,
      }}
    >
      <Box
        sx={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          backgroundColor: c.dot,
          boxShadow: `0 0 6px ${c.dot}`,
        }}
      />
      <Typography
        variant="overline"
        sx={{ color: c.text, lineHeight: 1, letterSpacing: '0.08em' }}
      >
        {text}
      </Typography>
    </Box>
  );
}