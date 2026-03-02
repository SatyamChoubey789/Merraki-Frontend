'use client';

import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { T, FONT_MONO, FONT_SANS, FONT_SERIF, EASE } from './CalcLayout';

interface MetricCardProps {
  label: string;
  value: string;
  subValue?: string;
  accent: string;
  highlight?: boolean;
  index?: number;
}

export function MetricCard({ label, value, subValue, accent, highlight = false, index = 0 }: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07, ease: EASE }}
      whileHover={{ y: -3 }}
    >
      <Box sx={{
        p: { xs: 2, md: 2.75 },
        borderRadius: '14px',
        background: highlight
          ? `linear-gradient(135deg, ${accent}18, ${accent}08)`
          : T.offwhite,
        border: `1px solid ${highlight ? accent + '28' : T.border}`,
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        transition: 'border-color 0.2s, box-shadow 0.2s',
        '&:hover': {
          borderColor: accent + '44',
          boxShadow: `0 6px 24px ${accent}10`,
        },
        /* Gold top line for highlight cards */
        '&::before': highlight ? {
          content: '""', position: 'absolute',
          top: 0, left: 0, right: 0, height: '2px',
          background: `linear-gradient(90deg, ${accent}, transparent)`,
        } : {},
      }}>
        {/* Label */}
        <Typography sx={{
          fontFamily: FONT_MONO, fontSize: '0.54rem', letterSpacing: '0.16em',
          color: highlight ? accent : T.inkFaint,
          textTransform: 'uppercase', mb: 1.25, display: 'block',
        }}>
          {label}
        </Typography>

        {/* Value */}
        <Typography sx={{
          fontFamily: FONT_SERIF, fontStyle: 'italic', fontWeight: 400,
          fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)',
          color: highlight ? accent : T.ink,
          lineHeight: 1.05, letterSpacing: '-0.025em',
          mb: subValue ? 0.5 : 0,
        }}>
          {value}
        </Typography>

        {/* Sub value */}
        {subValue && (
          <Typography sx={{
            fontFamily: FONT_SANS, fontSize: '0.72rem', color: T.inkFaint,
            lineHeight: 1.4, mt: 0.25,
          }}>
            {subValue}
          </Typography>
        )}
      </Box>
    </motion.div>
  );
}