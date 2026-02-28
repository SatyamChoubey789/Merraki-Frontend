'use client';

import { useState } from 'react';
import {
  Box,
  Button,
  Popover,
  List,
  ListItemButton,
  Typography,
  Divider,
} from '@mui/material';
import { KeyboardArrowDown as ChevronIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { colorTokens, shadowTokens } from '@/theme';
import { useCurrencyStore } from '@/lib/stores/currencyStore';
import { CURRENCY_OPTIONS } from '@/types/currency.types';
import type { CurrencyCode } from '@/types/currency.types';

interface CurrencySelectorProps {
  isDark?: boolean;
  fullWidth?: boolean;
}

export function CurrencySelector({ isDark = false, fullWidth = false }: CurrencySelectorProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const { selectedCurrency, setSelectedCurrency } = useCurrencyStore();

  const selected = CURRENCY_OPTIONS.find((c) => c.code === selectedCurrency) ?? CURRENCY_OPTIONS[0];
  const open = Boolean(anchorEl);

  const handleOpen = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleSelect = (code: CurrencyCode) => {
    setSelectedCurrency(code);
    handleClose();
  };

  return (
    <>
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
        <Button
          onClick={handleOpen}
          size="small"
          fullWidth={fullWidth}
          endIcon={
            <motion.div
              animate={{ rotate: open ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronIcon sx={{ fontSize: '1rem !important' }} />
            </motion.div>
          }
          sx={{
            color: isDark ? 'rgba(255,255,255,0.85)' : colorTokens.slate[700],
            backgroundColor: isDark
              ? 'rgba(255,255,255,0.08)'
              : colorTokens.slate[50],
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : colorTokens.slate[200]}`,
            borderRadius: '10px',
            px: 1.5,
            py: 0.75,
            fontSize: '0.8125rem',
            fontWeight: 600,
            fontFamily: 'var(--font-display)',
            gap: 0.5,
            minWidth: fullWidth ? '100%' : 'auto',
            '&:hover': {
              backgroundColor: isDark
                ? 'rgba(255,255,255,0.12)'
                : colorTokens.slate[100],
              borderColor: isDark
                ? 'rgba(255,255,255,0.2)'
                : colorTokens.slate[300],
            },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <span style={{ fontSize: '1rem', lineHeight: 1 }}>{selected.flag}</span>
            <span>{selected.code}</span>
          </Box>
        </Button>
      </motion.div>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        TransitionProps={{ timeout: 200 }}
        PaperProps={{
          elevation: 0,
          sx: {
            mt: 1,
            borderRadius: '14px',
            border: `1px solid ${colorTokens.slate[200]}`,
            boxShadow: shadowTokens.xl,
            overflow: 'hidden',
            minWidth: 220,
          },
        }}
      >
        <Box sx={{ p: 1.5 }}>
          <Typography
            variant="overline"
            sx={{
              px: 1.5,
              pb: 1,
              display: 'block',
              color: colorTokens.slate[400],
              fontSize: '0.65rem',
            }}
          >
            Select Currency
          </Typography>

          <List disablePadding>
            {CURRENCY_OPTIONS.map((option) => {
              const isSelected = option.code === selectedCurrency;
              return (
                <ListItemButton
                  key={option.code}
                  onClick={() => handleSelect(option.code)}
                  selected={isSelected}
                  sx={{
                    borderRadius: '10px',
                    mb: 0.25,
                    py: 1,
                    px: 1.5,
                    gap: 1.5,
                    '&.Mui-selected': {
                      backgroundColor: colorTokens.financeBlue[50],
                      '&:hover': { backgroundColor: colorTokens.financeBlue[100] },
                    },
                    '&:hover': { backgroundColor: colorTokens.slate[50] },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1 }}>
                    <span style={{ fontSize: '1.25rem', lineHeight: 1 }}>{option.flag}</span>
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: isSelected ? 700 : 500,
                          color: isSelected
                            ? colorTokens.financeBlue[700]
                            : colorTokens.slate[800],
                          lineHeight: 1.2,
                          fontFamily: 'var(--font-display)',
                        }}
                      >
                        {option.code}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: colorTokens.slate[400], lineHeight: 1 }}
                      >
                        {option.name}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{
                      color: isSelected
                        ? colorTokens.financeBlue[500]
                        : colorTokens.slate[400],
                      fontWeight: 600,
                      fontSize: '0.875rem',
                    }}
                  >
                    {option.symbol}
                  </Typography>
                </ListItemButton>
              );
            })}
          </List>
        </Box>
      </Popover>
    </>
  );
}