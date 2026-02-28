'use client';

import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { colorTokens, shadowTokens } from '@/theme';

interface MetricCardProps {
  label: string;
  value: string;
  subValue?: string;
  accent: string;
  bg: string;
  icon?: string;
  highlight?: boolean;
}

export function MetricCard({
  label,
  value,
  subValue,
  accent,
  bg,
  icon,
  highlight = false,
}: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      whileHover={{ y: -3 }}
    >
      <Box
        sx={{
          p: 2.5,
          borderRadius: '16px',
          backgroundColor: highlight ? accent : bg,
          border: `1px solid ${accent}33`,
          boxShadow: highlight ? `0 8px 24px ${accent}30` : shadowTokens.sm,
          height: '100%',
        }}
      >
        {icon && (
          <Typography sx={{ fontSize: '1.5rem', mb: 1, display: 'block' }}>
            {icon}
          </Typography>
        )}
        <Typography
          variant="caption"
          sx={{
            color: highlight ? 'rgba(255,255,255,0.75)' : colorTokens.slate[500],
            fontWeight: 600,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            display: 'block',
            mb: 0.5,
            fontSize: '0.7rem',
          }}
        >
          {label}
        </Typography>
        <Typography
          sx={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)',
            color: highlight ? '#fff' : accent,
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
          }}
        >
          {value}
        </Typography>
        {subValue && (
          <Typography
            variant="caption"
            sx={{
              color: highlight ? 'rgba(255,255,255,0.6)' : colorTokens.slate[400],
              mt: 0.25,
              display: 'block',
              fontWeight: 500,
            }}
          >
            {subValue}
          </Typography>
        )}
      </Box>
    </motion.div>
  );
}