'use client';

import { Box, Container, Typography, Grid, Pagination, TextField, InputAdornment } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { colorTokens } from '@/theme';
import { SectionLabel, GradientText, BlogCardSkeleton, EmptyState } from '@/components/ui';
import { BlogCard } from './BlogCard';
import { useBlogPosts, useBlogSearch, useFeaturedBlogPosts, useBlogCategories } from '@/lib/hooks/useBlogPosts';
import { useSearchFilter } from '@/lib/hooks/useSearchFilter';
import { Chip, Box as MuiBox } from '@mui/material';

export function BlogPageClient() {
  const filter = useSearchFilter({ initialSort: 'newest' });
  const {
    searchQuery,
    debouncedQuery,
    selectedCategory,
    page,
    limit,
    isSearching,
    handleSearchChange,
    handleCategoryChange,
    goToPage,
  } = filter;

  const { data: featuredData, isLoading: featuredLoading } = useFeaturedBlogPosts();
  const { data: categoriesData } = useBlogCategories();
  const { data: listData, isLoading: listLoading } = useBlogPosts({
    page,
    limit: 9,
    category: selectedCategory || undefined,
  });
  const { data: searchData, isLoading: searchLoading } = useBlogSearch(debouncedQuery, isSearching);

  const featured = featuredData?.data?.[0];
  const categories = categoriesData?.data ?? [];
  const activeData = isSearching ? searchData : listData;
  const posts = activeData?.data ?? [];
  const pagination = !isSearching && listData && 'pagination' in listData
    ? listData.pagination
    : null;
  const isLoading = isSearching ? searchLoading : listLoading;

  return (
    <Box sx={{ pt: { xs: 4, md: 6 }, pb: 12, minHeight: '100vh' }}>
      {/* Header */}
      <Box
        sx={{
          background: `linear-gradient(180deg, ${colorTokens.darkNavy[900]} 0%, ${colorTokens.darkNavy[800]} 100%)`,
          pt: { xs: 8, md: 12 },
          pb: { xs: 6, md: 8 },
          mb: 6,
        }}
      >
        <Container maxWidth="xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <SectionLabel text="Finance Insights" color="light" />
            <Typography
              variant="h1"
              sx={{ mt: 2, mb: 2, color: '#fff', fontWeight: 800, maxWidth: 700 }}
            >
              Ideas That{' '}
              <Box
                component="span"
                sx={{
                  background: `linear-gradient(135deg, ${colorTokens.financeBlue[300]}, #A78BFA)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Move Numbers
              </Box>
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{ color: 'rgba(255,255,255,0.55)', maxWidth: 480, lineHeight: 1.75, mb: 4 }}
            >
              Practical finance strategies, model breakdowns, and growth
              insights — written by analysts, for founders.
            </Typography>

            {/* Search */}
            <TextField
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search articles…"
              size="small"
              sx={{
                maxWidth: 420,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(255,255,255,0.07)',
                  borderRadius: '12px',
                  color: '#fff',
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.15)' },
                  '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                  '&.Mui-focused fieldset': { borderColor: colorTokens.financeBlue[400] },
                  '& input::placeholder': { color: 'rgba(255,255,255,0.35)', opacity: 1 },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '1.125rem' }} />
                  </InputAdornment>
                ),
              }}
            />
          </motion.div>
        </Container>
      </Box>

      <Container maxWidth="xl">
        {/* Categories */}
        {categories.length > 0 && (
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 5 }}>
            <Chip
              label="All"
              onClick={() => handleCategoryChange('')}
              color={selectedCategory === '' ? 'primary' : 'default'}
              variant={selectedCategory === '' ? 'filled' : 'outlined'}
              sx={{
                borderRadius: '999px',
                fontWeight: 600,
                ...(selectedCategory === '' && {
                  background: `linear-gradient(135deg, ${colorTokens.financeBlue[500]}, ${colorTokens.financeBlue[700]})`,
                  color: '#fff',
                }),
              }}
            />
            {categories.map((cat) => (
              <Chip
                key={cat.id}
                label={cat.name}
                onClick={() => handleCategoryChange(cat.slug)}
                color={selectedCategory === cat.slug ? 'primary' : 'default'}
                variant={selectedCategory === cat.slug ? 'filled' : 'outlined'}
                sx={{
                  borderRadius: '999px',
                  fontWeight: 500,
                  ...(selectedCategory === cat.slug && {
                    background: `linear-gradient(135deg, ${colorTokens.financeBlue[500]}, ${colorTokens.financeBlue[700]})`,
                    color: '#fff',
                  }),
                }}
              />
            ))}
          </Box>
        )}

        {/* Grid */}
        {isLoading ? (
          <Grid container spacing={3}>
            {Array.from({ length: 6 }).map((_, i) => (
              <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={i}>
                <BlogCardSkeleton />
              </Grid>
            ))}
          </Grid>
        ) : posts.length === 0 ? (
          <EmptyState
            title={isSearching ? `No results for "${debouncedQuery}"` : 'No posts found'}
            description="Try a different search or category."
            actionLabel="Clear"
            onAction={() => handleSearchChange('')}
          />
        ) : (
          <Grid container spacing={3}>
            {posts.map((post, i) => (
              <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={post.id}>
                <BlogCard post={post} index={i} />
              </Grid>
            ))}
          </Grid>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
            <Pagination
              count={pagination.totalPages}
              page={page}
              onChange={(_, p) => goToPage(p)}
              color="primary"
              size="large"
              shape="rounded"
              sx={{
                '& .MuiPaginationItem-root': { fontFamily: 'var(--font-display)', fontWeight: 600, borderRadius: '10px' },
                '& .MuiPaginationItem-root.Mui-selected': {
                  background: `linear-gradient(135deg, ${colorTokens.financeBlue[500]}, ${colorTokens.financeBlue[700]})`,
                  color: '#fff',
                },
              }}
            />
          </Box>
        )}
      </Container>
    </Box>
  );
}