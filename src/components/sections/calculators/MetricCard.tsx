'use client';

import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { FONT_MONO, FONT_SANS, EASE } from './CalcLayout';

/* Bluish-white tokens */
const T = {
  white: "#FFFFFF",
  offwhite: "#F6F9FF",
  border: "#E2E8F0",
  ink: "#0B1220",
  inkMuted: "#475569",
  inkFaint: "#94A3B8",
  blueGlow: "rgba(37,99,235,0.08)",
};

interface MetricCardProps {
  label: string;
  value: string;
  subValue?: string;
  accent: string;
  highlight?: boolean;
  index?: number;
}

export function MetricCard({
  label,
  value,
  subValue,
  accent,
  highlight,
  index = 0,
}: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.05 * index, ease: EASE }}
    >
      <Box
        sx={{
          background: T.white,
          borderRadius: '14px',
          border: `1px solid ${highlight ? accent : T.border}`,
          p: 2.5,
          height: '100%',
          transition: 'all 0.2s ease',

          boxShadow: highlight
            ? `0 6px 22px ${T.blueGlow}`
            : '0 2px 10px rgba(15,23,42,0.04)',

          '&:hover': {
            borderColor: accent,
            boxShadow: `0 8px 28px ${T.blueGlow}`,
            transform: 'translateY(-2px)',
          },
        }}
      >
        {/* Top accent line */}
        <Box
          sx={{
            width: 28,
            height: 2,
            borderRadius: 2,
            background: accent,
            mb: 1.5,
          }}
        />

        {/* Label */}
        <Typography
          sx={{
            fontFamily: FONT_MONO,
            fontSize: '0.58rem',
            letterSpacing: '0.16em',
            color: T.inkFaint,
            textTransform: 'uppercase',
            mb: 1,
          }}
        >
          {label}
        </Typography>

        {/* Value */}
        <Typography
          sx={{
            fontFamily: FONT_MONO,
            fontSize: '1.25rem',
            fontWeight: 700,
            color: highlight ? accent : T.ink,
            letterSpacing: '-0.02em',
            mb: 0.5,
          }}
        >
          {value}
        </Typography>

        {/* Subvalue */}
        {subValue && (
          <Typography
            sx={{
              fontFamily: FONT_SANS,
              fontSize: '0.75rem',
              color: T.inkMuted,
            }}
          >
            {subValue}
          </Typography>
        )}
      </Box>
    </motion.div>
  );
}