'use client';

import { Box, Typography } from '@mui/material';
import { FONT_MONO, FONT_SANS } from './CalcLayout';

const T = {
  white:    '#FFFFFF',
  bg:       '#F7F8FA',
  ink:      '#0A0A0F',
  inkMid:   '#1E293B',
  inkMuted: '#5A6478',
  inkFaint: '#A0A0AE',
  border:   'rgba(10,10,20,0.08)',
  borderFocus: 'rgba(29,78,216,0.4)',
  blue:     '#1D4ED8',
  blueGlow: 'rgba(29,78,216,0.07)',
};

interface CalcInputProps {
  label:       string;
  value:       number | string;
  onChange:    (value: number) => void;
  prefix?:     string;
  suffix?:     string;
  min?:        number;
  step?:       number;
  helperText?: string;
  disabled?:   boolean;
}

export function CalcInput({ label, value, onChange, prefix, suffix, min = 0, step = 1, helperText, disabled }: CalcInputProps) {
  return (
    <Box sx={{ mb: 1.5 }}>
      <Typography sx={{
        fontFamily: FONT_SANS, fontWeight: 500,
        fontSize: '0.7rem', color: T.inkMid,
        mb: 0.4, letterSpacing: '-0.005em',
      }}>
        {label}
      </Typography>
      <Box sx={{
        display: 'flex', alignItems: 'stretch',
        background: disabled ? T.bg : T.white,
        border: `1px solid ${T.border}`,
        borderRadius: '6px', overflow: 'hidden',
        transition: 'border-color 0.15s, box-shadow 0.15s',
        '&:focus-within': {
          borderColor: T.borderFocus,
          boxShadow: `0 0 0 2px ${T.blueGlow}`,
        },
      }}>
        {prefix && (
          <Box sx={{ px: 1.25, background: T.bg, borderRight: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <Typography sx={{ fontFamily: FONT_MONO, fontSize: '0.7rem', color: T.inkMuted }}>{prefix}</Typography>
          </Box>
        )}
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
            flex: 1, border: 'none', outline: 'none', background: 'transparent',
            px: 1.25, py: 0.875,
            fontFamily: FONT_MONO, fontSize: '0.8125rem', fontWeight: 500, color: T.ink,
            minWidth: 0,
            '&::-webkit-inner-spin-button, &::-webkit-outer-spin-button': { opacity: 0.3 },
            '&:disabled': { opacity: 0.45, cursor: 'not-allowed' },
          }}
        />
        {suffix && (
          <Box sx={{ px: 1.25, background: T.bg, borderLeft: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <Typography sx={{ fontFamily: FONT_MONO, fontSize: '0.7rem', color: T.inkMuted }}>{suffix}</Typography>
          </Box>
        )}
      </Box>
      {helperText && (
        <Typography sx={{ fontFamily: FONT_SANS, fontSize: '0.625rem', color: T.inkFaint, mt: 0.35, lineHeight: 1.4 }}>
          {helperText}
        </Typography>
      )}
    </Box>
  );
}