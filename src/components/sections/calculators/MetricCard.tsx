'use client';

import { Box, Typography } from '@mui/material';
import { FONT_MONO, FONT_SANS } from './CalcLayout';

const T = {
  white:   '#FFFFFF',
  border:  'rgba(10,10,20,0.08)',
  ink:     '#0A0A0F',
  inkMuted:'#5A6478',
  inkFaint:'#A0A0AE',
};

interface MetricCardProps {
  label:      string;
  value:      string;
  subValue?:  string;
  accent:     string;
  highlight?: boolean;
  index?:     number;
}

export function MetricCard({ label, value, subValue, accent, highlight }: MetricCardProps) {
  return (
    <Box sx={{
      background: highlight ? `${accent}06` : T.white,
      borderRadius: '6px',
      border: `1px solid ${highlight ? accent + '25' : T.border}`,
      px: { xs: 1.5, md: 2 },
      py: { xs: 1.25, md: 1.5 },
    }}>
      <Box sx={{ width: 16, height: '2px', borderRadius: 1, background: accent, mb: 0.875, opacity: highlight ? 1 : 0.4 }} />
      <Typography sx={{
        fontFamily: FONT_MONO, fontSize: '0.46rem',
        letterSpacing: '0.12em', color: T.inkFaint,
        textTransform: 'uppercase', mb: 0.5,
        // truncate on small screens
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
      }}>
        {label}
      </Typography>
      <Typography sx={{
        fontFamily: FONT_MONO, fontWeight: 700,
        fontSize: { xs: '0.9375rem', md: '1.0625rem' },
        color: highlight ? accent : T.ink,
        letterSpacing: '-0.02em', lineHeight: 1.1, mb: 0.25,
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
      }}>
        {value}
      </Typography>
      {subValue && (
        <Typography sx={{
          fontFamily: FONT_SANS, fontSize: '0.6rem', color: T.inkMuted, lineHeight: 1.3,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {subValue}
        </Typography>
      )}
    </Box>
  );
}