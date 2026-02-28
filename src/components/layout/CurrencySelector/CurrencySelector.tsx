'use client';

import { useState } from 'react';
import {
  Box,
  Popover,
  List,
  ListItemButton,
  Typography,
} from '@mui/material';
import { KeyboardArrowDown as ChevronIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useCurrencyStore } from '@/lib/stores/currencyStore';
import { CURRENCY_OPTIONS } from '@/types/currency.types';
import type { CurrencyCode } from '@/types/currency.types';

/* ── tokens ──────────────────────────────────────────────────────────── */
const T = {
  bg:        '#FFFFFF',
  surface:   '#F7F8FA',
  border:    '#E8EAED',
  borderMid: '#D1D5DB',
  ink:       '#0F1117',
  inkMid:    '#374151',
  inkMuted:  '#6B7280',
  inkFaint:  '#9CA3AF',
  accent:    '#0057FF',
  accentBg:  'rgba(0,87,255,0.05)',
  accentBdr: 'rgba(0,87,255,0.14)',

  // dark mode variants
  dkText:    'rgba(255,255,255,0.82)',
  dkBorder:  'rgba(255,255,255,0.12)',
  dkHover:   'rgba(255,255,255,0.07)',
  dkBg:      'rgba(255,255,255,0.06)',
};

const FONT_BODY = `"DM Sans", "Mona Sans", system-ui, sans-serif`;
const FONT_MONO = `"DM Mono", "JetBrains Mono", monospace`;

interface CurrencySelectorProps {
  isDark?: boolean;
  fullWidth?: boolean;
}

export function CurrencySelector({ isDark = false, fullWidth = false }: CurrencySelectorProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const { selectedCurrency, setSelectedCurrency } = useCurrencyStore();

  const selected = CURRENCY_OPTIONS.find((c) => c.code === selectedCurrency) ?? CURRENCY_OPTIONS[0];
  const open = Boolean(anchorEl);

  const handleOpen  = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleSelect = (code: CurrencyCode) => { setSelectedCurrency(code); handleClose(); };

  return (
    <>
      {/* ── Trigger button ───────────────────────────────────────── */}
      <Box
        component="button"
        onClick={handleOpen}
        aria-label="Select currency"
        aria-expanded={open}
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 1,
          px: 1.5,
          py: 0.75,
          width: fullWidth ? '100%' : 'auto',
          justifyContent: fullWidth ? 'space-between' : 'flex-start',
          background: isDark ? T.dkBg : T.bg,
          border: `1.5px solid ${isDark ? T.dkBorder : T.border}`,
          borderRadius: '9px',
          cursor: 'pointer',
          fontFamily: FONT_BODY,
          transition: 'all 0.15s ease',
          userSelect: 'none',
          '&:hover': {
            background: isDark ? T.dkHover : T.surface,
            borderColor: isDark ? 'rgba(255,255,255,0.22)' : T.borderMid,
          },
          '&:active': { transform: 'scale(0.97)' },
        }}
      >
        {/* Flag + code */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.875 }}>
          <span style={{ fontSize: '1rem', lineHeight: 1, display: 'block' }}>
            {selected.flag}
          </span>
          <Typography
            sx={{
              fontFamily: FONT_MONO,
              fontSize: '0.75rem',
              fontWeight: 600,
              letterSpacing: '0.06em',
              color: isDark ? T.dkText : T.inkMid,
              lineHeight: 1,
            }}
          >
            {selected.code}
          </Typography>
        </Box>

        {/* Chevron */}
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          style={{ display: 'flex', alignItems: 'center', lineHeight: 0 }}
        >
          <ChevronIcon
            sx={{
              fontSize: '0.9rem',
              color: isDark ? 'rgba(255,255,255,0.4)' : T.inkFaint,
              transition: 'color 0.15s',
            }}
          />
        </motion.div>
      </Box>

      {/* ── Dropdown ─────────────────────────────────────────────── */}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        TransitionProps={{ timeout: 180 }}
        PaperProps={{
          elevation: 0,
          sx: {
            mt: 0.75,
            borderRadius: '14px',
            border: `1px solid ${T.border}`,
            boxShadow: '0 8px 40px rgba(15,17,23,0.1), 0 2px 8px rgba(15,17,23,0.06)',
            overflow: 'hidden',
            minWidth: 230,
            background: T.bg,
          },
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
        >
          {/* Dropdown header */}
          <Box
            sx={{
              px: 2, pt: 1.75, pb: 1.25,
              borderBottom: `1px solid ${T.border}`,
            }}
          >
            <Typography
              sx={{
                fontFamily: FONT_MONO,
                fontSize: '0.575rem',
                letterSpacing: '0.16em',
                color: T.inkFaint,
                textTransform: 'uppercase',
              }}
            >
              Select Currency
            </Typography>
          </Box>

          {/* List */}
          <List disablePadding sx={{ p: 1 }}>
            {CURRENCY_OPTIONS.map((option) => {
              const isSelected = option.code === selectedCurrency;
              return (
                <ListItemButton
                  key={option.code}
                  onClick={() => handleSelect(option.code)}
                  selected={isSelected}
                  disableRipple
                  sx={{
                    borderRadius: '9px',
                    mb: 0.25,
                    py: 0.875,
                    px: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.25,
                    transition: 'all 0.12s ease',
                    background: isSelected ? T.accentBg : 'transparent',
                    border: `1px solid ${isSelected ? T.accentBdr : 'transparent'}`,
                    '&:hover': {
                      background: isSelected ? T.accentBg : T.surface,
                      border: `1px solid ${isSelected ? T.accentBdr : T.border}`,
                    },
                    '&.Mui-selected': { background: T.accentBg },
                    '&.Mui-selected:hover': { background: T.accentBg },
                  }}
                >
                  {/* Flag */}
                  <span style={{ fontSize: '1.15rem', lineHeight: 1, flexShrink: 0 }}>
                    {option.flag}
                  </span>

                  {/* Code + name */}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      sx={{
                        fontFamily: FONT_MONO,
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        letterSpacing: '0.04em',
                        color: isSelected ? T.accent : T.ink,
                        lineHeight: 1.2,
                      }}
                    >
                      {option.code}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: FONT_BODY,
                        fontSize: '0.7rem',
                        color: T.inkFaint,
                        lineHeight: 1.2,
                        mt: 0.2,
                      }}
                    >
                      {option.name}
                    </Typography>
                  </Box>

                  {/* Symbol */}
                  <Typography
                    sx={{
                      fontFamily: FONT_MONO,
                      fontSize: '0.8125rem',
                      fontWeight: 500,
                      color: isSelected ? T.accent : T.inkFaint,
                      letterSpacing: '0.02em',
                      flexShrink: 0,
                      minWidth: 20,
                      textAlign: 'right',
                    }}
                  >
                    {option.symbol}
                  </Typography>

                  {/* Selected check dot */}
                  {isSelected && (
                    <Box
                      sx={{
                        width: 6, height: 6,
                        borderRadius: '50%',
                        background: T.accent,
                        flexShrink: 0,
                        ml: 0.5,
                      }}
                    />
                  )}
                </ListItemButton>
              );
            })}
          </List>
        </motion.div>
      </Popover>
    </>
  );
}