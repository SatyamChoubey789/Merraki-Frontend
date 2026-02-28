'use client';

import { TextField, InputAdornment, Typography, Box } from '@mui/material';
import { colorTokens } from '@/theme';

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
    <Box sx={{ mb: 2.5 }}>
      <Typography
        variant="body2"
        sx={{
          fontWeight: 600,
          color: colorTokens.darkNavy[800],
          mb: 0.75,
          fontFamily: 'var(--font-display)',
        }}
      >
        {label}
      </Typography>
      <TextField
        type="number"
        value={value}
        onChange={(e) => {
          const v = parseFloat(e.target.value);
          if (!isNaN(v)) onChange(v);
        }}
        size="small"
        fullWidth
        disabled={disabled}
        inputProps={{ min, step }}
        InputProps={{
          startAdornment: prefix ? (
            <InputAdornment position="start">
              <Typography variant="body2" sx={{ color: colorTokens.slate[500], fontWeight: 600 }}>
                {prefix}
              </Typography>
            </InputAdornment>
          ) : undefined,
          endAdornment: suffix ? (
            <InputAdornment position="end">
              <Typography variant="body2" sx={{ color: colorTokens.slate[500], fontWeight: 600 }}>
                {suffix}
              </Typography>
            </InputAdornment>
          ) : undefined,
        }}
      />
      {helperText && (
        <Typography variant="caption" sx={{ color: colorTokens.slate[400], mt: 0.5, display: 'block' }}>
          {helperText}
        </Typography>
      )}
    </Box>
  );
}