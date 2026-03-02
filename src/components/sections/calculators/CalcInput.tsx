'use client';

import { Box, Typography } from '@mui/material';
import { T, FONT_MONO, FONT_SANS } from './CalcLayout';

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
      <Typography sx={{
        fontFamily: FONT_SANS, fontWeight: 500, fontSize: '0.8125rem',
        color: T.inkMid, mb: 0.75, letterSpacing: '-0.01em',
      }}>
        {label}
      </Typography>

      <Box sx={{
        display: 'flex', alignItems: 'center',
        background: disabled ? T.offwhite : T.white,
        border: `1px solid ${T.border}`,
        borderRadius: '9px',
        overflow: 'hidden',
        transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
        '&:focus-within': {
          borderColor: T.borderMd,
          boxShadow: `0 0 0 3px rgba(12,14,18,0.05)`,
        },
      }}>
        {/* Prefix */}
        {prefix && (
          <Box sx={{
            px: 1.5, height: '100%',
            borderRight: `1px solid ${T.border}`,
            background: T.offwhite,
            display: 'flex', alignItems: 'center',
            flexShrink: 0,
          }}>
            <Typography sx={{ fontFamily: FONT_MONO, fontSize: '0.75rem', color: T.inkMuted, fontWeight: 500 }}>
              {prefix}
            </Typography>
          </Box>
        )}

        {/* Input */}
        <Box
          component="input"
          type="number"
          value={value}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const v = parseFloat(e.target.value);
            if (!isNaN(v)) onChange(v);
          }}
          disabled={disabled}
          // @ts-ignore
          min={min}
          step={step}
          sx={{
            flex: 1,
            border: 'none',
            outline: 'none',
            background: 'transparent',
            px: 1.75, py: 1.25,
            fontFamily: FONT_MONO,
            fontSize: '0.875rem',
            fontWeight: 500,
            color: T.ink,
            letterSpacing: '-0.01em',
            '&::-webkit-inner-spin-button, &::-webkit-outer-spin-button': {
              opacity: 0.4,
              height: 20,
            },
            '&:disabled': { opacity: 0.5, cursor: 'not-allowed' },
          }}
        />

        {/* Suffix */}
        {suffix && (
          <Box sx={{
            px: 1.5,
            borderLeft: `1px solid ${T.border}`,
            background: T.offwhite,
            display: 'flex', alignItems: 'center',
            flexShrink: 0,
            height: '100%',
          }}>
            <Typography sx={{ fontFamily: FONT_MONO, fontSize: '0.75rem', color: T.inkMuted, fontWeight: 500 }}>
              {suffix}
            </Typography>
          </Box>
        )}
      </Box>

      {helperText && (
        <Typography sx={{
          fontFamily: FONT_SANS, fontSize: '0.7rem', color: T.inkFaint,
          mt: 0.5, letterSpacing: '0.01em', lineHeight: 1.4,
        }}>
          {helperText}
        </Typography>
      )}
    </Box>
  );
}