'use client';

import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Skeleton,
  InputAdornment,
  Button,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { colorTokens } from '@/theme';
import { useCategories } from '@/lib/hooks/useCategories';
import type { useSearchFilter } from '@/lib/hooks/useSearchFilter';

type FilterState = ReturnType<typeof useSearchFilter>;

interface TemplateFiltersProps {
  filter: FilterState;
}

const SORT_OPTIONS = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
];

export function TemplateFilters({ filter }: TemplateFiltersProps) {
  const {
    searchQuery,
    selectedCategory,
    sortBy,
    handleSearchChange,
    handleCategoryChange,
    handleSortChange,
    clearFilters,
  } = filter;

  const { data: categoriesData, isLoading } = useCategories();
  const categories = categoriesData?.data ?? [];

  const hasActiveFilters = searchQuery || selectedCategory || sortBy !== 'popular';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <Box sx={{ mb: 4 }}>
        {/* Search + Sort Row */}
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            mb: 2.5,
            flexDirection: { xs: 'column', sm: 'row' },
          }}
        >
          <TextField
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search templates…"
            size="small"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: colorTokens.slate[400], fontSize: '1.1rem' }} />
                </InputAdornment>
              ),
              endAdornment: searchQuery ? (
                <InputAdornment position="end">
                  <Box
                    component="button"
                    onClick={() => handleSearchChange('')}
                    sx={{
                      border: 'none',
                      background: 'none',
                      cursor: 'pointer',
                      color: colorTokens.slate[400],
                      display: 'flex',
                      alignItems: 'center',
                      p: 0,
                      '&:hover': { color: colorTokens.slate[600] },
                    }}
                  >
                    <CloseIcon sx={{ fontSize: '1rem' }} />
                  </Box>
                </InputAdornment>
              ) : null,
            }}
            sx={{ flex: 1 }}
          />

          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortBy}
              label="Sort By"
              onChange={(e) => handleSortChange(e.target.value)}
            >
              {SORT_OPTIONS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Category Chips */}
        <Box
          sx={{
            display: 'flex',
            gap: 1,
            flexWrap: 'wrap',
            alignItems: 'center',
          }}
        >
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <Skeleton
                key={i}
                variant="rounded"
                width={90}
                height={32}
                sx={{ borderRadius: '999px' }}
              />
            ))
          ) : (
            <>
              <Chip
                label="All Templates"
                onClick={() => handleCategoryChange('')}
                color={selectedCategory === '' ? 'primary' : 'default'}
                variant={selectedCategory === '' ? 'filled' : 'outlined'}
                sx={{
                  fontWeight: 600,
                  borderRadius: '999px',
                  ...(selectedCategory === '' && {
                    background: `linear-gradient(135deg, ${colorTokens.financeBlue[500]}, ${colorTokens.financeBlue[700]})`,
                    color: '#fff',
                  }),
                }}
              />
              {categories.map((cat) => (
                <Chip
                  key={cat.id}
                  label={`${cat.name} (${cat.templateCount})`}
                  onClick={() => handleCategoryChange(cat.slug)}
                  color={selectedCategory === cat.slug ? 'primary' : 'default'}
                  variant={selectedCategory === cat.slug ? 'filled' : 'outlined'}
                  sx={{
                    fontWeight: 500,
                    borderRadius: '999px',
                    ...(selectedCategory === cat.slug && {
                      background: `linear-gradient(135deg, ${colorTokens.financeBlue[500]}, ${colorTokens.financeBlue[700]})`,
                      color: '#fff',
                    }),
                  }}
                />
              ))}
            </>
          )}

          {hasActiveFilters && (
            <Button
              size="small"
              variant="text"
              startIcon={<CloseIcon sx={{ fontSize: '0.875rem' }} />}
              onClick={clearFilters}
              sx={{
                color: colorTokens.slate[500],
                fontSize: '0.8125rem',
                ml: 'auto',
                '&:hover': { color: colorTokens.error.main },
              }}
            >
              Clear filters
            </Button>
          )}
        </Box>
      </Box>
    </motion.div>
  );
}