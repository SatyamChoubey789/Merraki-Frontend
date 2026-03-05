"use client";

import { Box, Typography, Skeleton } from "@mui/material";
import {
  Search as SearchIcon,
  Close as CloseIcon,
  KeyboardArrowDown as ArrowIcon,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { useCategories } from "@/lib/hooks/useCategories";
import type { useSearchFilter } from "@/lib/hooks/useSearchFilter";

const T = {
  bg:       '#FFFFFF',
  bgSection:'#F5F7FB',
  ink:      '#0A0A0F',
  inkMuted: '#5A5A72',
  inkFaint: '#9898AE',
  border:   'rgba(10,10,20,0.09)',
  blue:     '#3B7BF6',
  blueLight:'#7AABFF',
  bluePale: '#EDF3FF',
  blueGrad: 'linear-gradient(135deg,#3B7BF6 0%,#7AABFF 100%)',
};

const SANS = '"DM Sans","Mona Sans",system-ui,sans-serif';
const MONO = '"DM Mono","JetBrains Mono",ui-monospace,monospace';
const EASE = [0.16, 1, 0.3, 1] as const;

const SORT_OPTIONS = [
  { value: 'popular',    label: 'Popular'    },
  { value: 'newest',     label: 'Newest'     },
  { value: 'price_asc',  label: 'Price ↑'    },
  { value: 'price_desc', label: 'Price ↓'    },
  { value: 'rating',     label: 'Top Rated'  },
];

type FilterState = ReturnType<typeof useSearchFilter>;
interface Props { filter: FilterState; inline?: boolean; }

function CatPill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.96 }}
      style={{
        flexShrink: 0,
        padding: '6px 16px',
        borderRadius: '100px',
        border: `1px solid ${active ? T.blue : T.border}`,
        background: active ? T.bluePale : 'transparent',
        cursor: 'pointer',
        outline: 'none',
        transition: 'border-color 0.15s, background 0.15s',
      }}
    >
      <Typography sx={{
        fontFamily: SANS, fontWeight: active ? 600 : 500,
        fontSize: '0.8rem',
        color: active ? T.blue : T.inkMuted,
        whiteSpace: 'nowrap',
        transition: 'color 0.15s',
      }}>
        {label}
      </Typography>
    </motion.button>
  );
}

export function TemplateFilters({ filter, inline }: Props) {
  const {
    searchQuery, selectedCategory, sortBy,
    handleSearchChange, handleCategoryChange, handleSortChange, clearFilters,
  } = filter;

  const { data: categoriesData, isLoading } = useCategories();
  const categories = categoriesData?.data ?? [];
  const hasActive  = searchQuery || selectedCategory || sortBy !== 'popular';

  return (
    <Box sx={{ mb: inline ? 0 : 5 }}>

      {/* ── Search + sort row ── */}
      <Box sx={{
        display: 'flex', alignItems: 'center', gap: 2,
        borderBottom: `1px solid ${T.border}`,
        pb: 2, mb: 2,
      }}>

        {/* Search pill */}
        <Box sx={{
          flex: 1,
          display: 'flex', alignItems: 'center', gap: 1.25,
          px: 2, height: 42, borderRadius: '10px',
          background: T.bgSection,
          border: `1px solid ${T.border}`,
          transition: 'border-color 0.15s, box-shadow 0.15s',
          '&:focus-within': {
            borderColor: `rgba(59,123,246,0.35)`,
            boxShadow: `0 0 0 3px rgba(59,123,246,0.08)`,
          },
        }}>
          <SearchIcon sx={{ fontSize: '0.95rem', color: T.inkFaint, flexShrink: 0 }} />
          <Box
            component="input"
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSearchChange(e.target.value)}
            placeholder="Search templates…"
            sx={{
              flex: 1, border: 'none', outline: 'none',
              background: 'transparent',
              fontFamily: SANS, fontSize: '0.875rem', color: T.ink,
              '&::placeholder': { color: T.inkFaint },
            }}
          />
          <AnimatePresence>
            {searchQuery && (
              <motion.button
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                onClick={() => handleSearchChange('')}
                style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 2 }}
              >
                <CloseIcon sx={{ fontSize: '0.8rem', color: T.inkFaint }} />
              </motion.button>
            )}
          </AnimatePresence>
        </Box>

        {/* Sort select */}
        <Box sx={{
          display: 'flex', alignItems: 'center', gap: 0.75,
          px: 2, height: 42, borderRadius: '10px',
          border: `1px solid ${T.border}`,
          background: T.bgSection,
          flexShrink: 0,
        }}>
          <Box
            component="select"
            value={sortBy}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleSortChange(e.target.value)}
            sx={{
              appearance: 'none', border: 'none', outline: 'none',
              background: 'transparent',
              fontFamily: SANS, fontWeight: 500,
              fontSize: '0.8rem', color: T.inkMuted,
              cursor: 'pointer', pr: 0.5,
            }}
          >
            {SORT_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </Box>
          <ArrowIcon sx={{ fontSize: '0.9rem', color: T.inkFaint, pointerEvents: 'none' }} />
        </Box>

        {/* Clear */}
        <AnimatePresence>
          {hasActive && (
            <motion.div
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ duration: 0.18 }}
            >
              <Box
                component="button"
                onClick={clearFilters}
                sx={{
                  display: 'flex', alignItems: 'center', gap: 0.5,
                  px: 2, height: 42, borderRadius: '10px',
                  border: `1px solid ${T.border}`,
                  background: 'transparent', cursor: 'pointer',
                  fontFamily: SANS, fontWeight: 500,
                  fontSize: '0.8rem', color: T.inkFaint,
                  whiteSpace: 'nowrap',
                  outline: 'none',
                  transition: 'color 0.15s, border-color 0.15s',
                  '&:hover': { color: T.ink, borderColor: 'rgba(10,10,20,0.2)' },
                }}
              >
                <CloseIcon sx={{ fontSize: '0.75rem' }} />
                Clear
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>

      {/* ── Category pills ── */}
      <Box sx={{
        display: 'flex', gap: 1,
        overflowX: 'auto', flexWrap: 'nowrap',
        pb: 0.5,
        scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' },
      }}>
        {isLoading
          ? Array.from({ length: 7 }).map((_, i) => (
              <Skeleton key={i} variant="rectangular" width={96} height={34} sx={{ borderRadius: '100px', flexShrink: 0 }} />
            ))
          : (
            <>
              <CatPill label="All" active={!selectedCategory} onClick={() => handleCategoryChange('')} />
              {categories.map(cat => (
                <CatPill
                  key={cat.id}
                  label={`${cat.name} (${cat.templates_count})`}
                  active={selectedCategory === cat.slug}
                  onClick={() => handleCategoryChange(cat.slug)}
                />
              ))}
            </>
          )
        }
      </Box>
    </Box>
  );
}