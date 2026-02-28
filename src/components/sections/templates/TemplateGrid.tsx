'use client';

import { Box, Grid, Typography, Pagination } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import { GridView as GridIcon } from '@mui/icons-material';
import { useTemplates, useTemplateSearch } from '@/lib/hooks/useTemplates';
import { CardSkeleton, EmptyState } from '@/components/ui';
import { TemplateCard } from './TemplateCard';
import type { useSearchFilter } from '@/lib/hooks/useSearchFilter';
import { colorTokens } from '@/theme';

type FilterState = ReturnType<typeof useSearchFilter>;

interface TemplateGridProps {
  filter: FilterState;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

export function TemplateGrid({ filter }: TemplateGridProps) {
  const { debouncedQuery, selectedCategory, sortBy, page, limit, isSearching, goToPage } = filter;

  const listQuery = useTemplates({
    page,
    limit,
    category: selectedCategory || undefined,
    sortBy: sortBy as 'price' | 'popularity' | 'rating' | 'newest',
  });

  const searchQuery = useTemplateSearch(debouncedQuery, isSearching);

  const activeQuery = isSearching ? searchQuery : listQuery;
  const { data, isLoading, isError } = activeQuery;

  const templates = data?.data ?? [];
  const pagination = !isSearching && 'pagination' in (data ?? {})
    ? (data as { pagination: { total: number; totalPages: number } }).pagination
    : null;

  if (isLoading) {
    return (
      <Grid container spacing={3}>
        {Array.from({ length: 6 }).map((_, i) => (
          <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={i}>
            <CardSkeleton height={380} />
          </Grid>
        ))}
      </Grid>
    );
  }

  if (isError) {
    return (
      <EmptyState
        title="Failed to load templates"
        description="Something went wrong while fetching templates. Please try again."
        actionLabel="Retry"
        onAction={() => activeQuery.refetch()}
      />
    );
  }

  if (templates.length === 0) {
    return (
      <EmptyState
        icon={<GridIcon />}
        title={isSearching ? `No results for "${debouncedQuery}"` : 'No templates found'}
        description={
          isSearching
            ? 'Try a different search term or browse by category.'
            : 'No templates match your current filters.'
        }
        actionLabel="Clear Filters"
        onAction={filter.clearFilters}
      />
    );
  }

  return (
    <Box>
      {/* Result count */}
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mb: 3, fontWeight: 500 }}
      >
        {isSearching
          ? `${templates.length} result${templates.length !== 1 ? 's' : ''} for "${debouncedQuery}"`
          : pagination
          ? `${pagination.total} template${pagination.total !== 1 ? 's' : ''} available`
          : `${templates.length} templates`}
      </Typography>

      {/* Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        key={`${selectedCategory}-${sortBy}-${page}-${debouncedQuery}`}
      >
        <Grid container spacing={3}>
          <AnimatePresence mode="popLayout">
            {templates.map((template, index) => (
              <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={template.id}>
                <TemplateCard template={template} index={index} />
              </Grid>
            ))}
          </AnimatePresence>
        </Grid>
      </motion.div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
          <Pagination
            count={pagination.totalPages}
            page={page}
            onChange={(_, newPage) => goToPage(newPage)}
            color="primary"
            size="large"
            shape="rounded"
            sx={{
              '& .MuiPaginationItem-root': {
                fontFamily: 'var(--font-display)',
                fontWeight: 600,
                borderRadius: '10px',
              },
              '& .MuiPaginationItem-root.Mui-selected': {
                background: `linear-gradient(135deg, ${colorTokens.financeBlue[500]}, ${colorTokens.financeBlue[700]})`,
                color: '#fff',
              },
            }}
          />
        </Box>
      )}
    </Box>
  );
}