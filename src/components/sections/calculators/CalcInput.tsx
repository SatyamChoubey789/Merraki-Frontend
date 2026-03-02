'use client';

import { Box, Typography } from '@mui/material';
import { FONT_MONO, FONT_SANS } from './CalcLayout';

interface CalcInputProps {
  label: string;
  value: number | string;
  onChange: (value: number) => void;
  prefix?: string;
  suffix?: string;
  min?: number;
  max?: number;
  step?: number;
  helperText?: string;
  disabled?: boolean;
}

/* ── BLUISH-WHITE LIGHT MODE TOKENS ─────────────────────────────── */

const T = {
  /* surfaces */
  white: "#FFFFFF",
  offwhite: "#F6F9FF",

  /* text */
  ink: "#0B1220",
  inkMid: "#1E293B",
  inkMuted: "#475569",
  inkFaint: "#94A3B8",

  /* borders */
  border: "#E2E8F0",
  borderMd: "#CBD5E1",

  /* blue system */
  blue: "#2563EB",
  blueMid: "#3B82F6",
  blueLight: "#93C5FD",
  blueGlow: "rgba(37,99,235,0.08)",
};

/* ───────────────────────────────────────────────────────────────── */

export function CalcInput({
  label,
  value,
  onChange,
  prefix,
  suffix,
  min = 0,
  step = 1,
  helperText,
  disabled,
}: CalcInputProps) {
  return (
    <Box sx={{ mb: 2.75 }}>
      {/* Label */}
      <Typography
        sx={{
          fontFamily: FONT_SANS,
          fontWeight: 500,
          fontSize: '0.8125rem',
          color: T.inkMid,
          mb: 0.75,
          letterSpacing: '-0.01em',
        }}
      >
        {label}
      </Typography>

      {/* Input wrapper */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          background: disabled ? T.offwhite : T.white,
          border: `1px solid ${T.border}`,
          borderRadius: '10px',
          overflow: 'hidden',
          transition: 'all 0.15s ease',

          '&:focus-within': {
            borderColor: T.blueMid,
            boxShadow: `0 0 0 3px ${T.blueGlow}`,
          },
        }}
      >
        {/* Prefix */}
        {prefix && (
          <Box
            sx={{
              px: 1.75,
              borderRight: `1px solid ${T.border}`,
              background: T.offwhite,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Typography
              sx={{
                fontFamily: FONT_MONO,
                fontSize: '0.75rem',
                color: T.inkMuted,
                fontWeight: 500,
              }}
            >
              {prefix}
            </Typography>
          </Box>
        )}

        {/* Input field */}
        <Box
          component="input"
          type="number"
          value={value}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const v = parseFloat(e.target.value);
            if (!isNaN(v)) onChange(v);
          }}
          disabled={disabled}
          min={min}
          step={step}
          sx={{
            flex: 1,
            border: 'none',
            outline: 'none',
            background: 'transparent',
            px: 1.75,
            py: 1.3,
            fontFamily: FONT_MONO,
            fontSize: '0.9rem',
            fontWeight: 500,
            color: T.ink,
            letterSpacing: '-0.01em',

            '&::placeholder': {
              color: T.inkFaint,
            },

            '&::-webkit-inner-spin-button, &::-webkit-outer-spin-button': {
              opacity: 0.35,
            },

            '&:disabled': {
              opacity: 0.5,
              cursor: 'not-allowed',
            },
          }}
        />

        {/* Suffix */}
        {suffix && (
          <Box
            sx={{
              px: 1.75,
              borderLeft: `1px solid ${T.border}`,
              background: T.offwhite,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Typography
              sx={{
                fontFamily: FONT_MONO,
                fontSize: '0.75rem',
                color: T.inkMuted,
                fontWeight: 500,
              }}
            >
              {suffix}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Helper text */}
      {helperText && (
        <Typography
          sx={{
            fontFamily: FONT_SANS,
            fontSize: '0.7rem',
            color: T.inkFaint,
            mt: 0.6,
            letterSpacing: '0.01em',
            lineHeight: 1.4,
          }}
        >
          {helperText}
        </Typography>
      )}
    </Box>
  );
}