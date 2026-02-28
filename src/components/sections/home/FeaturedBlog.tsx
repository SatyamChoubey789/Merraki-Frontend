'use client';

import { Box, Container, Typography, Button, Grid } from '@mui/material';
import { ArrowForward as ArrowIcon } from '@mui/icons-material';
import Link from 'next/link';
import { colorTokens } from '@/theme';
import { SectionLabel, GradientText, BlogCardSkeleton } from '@/components/ui';
import { useFeaturedBlogPosts } from '@/lib/hooks/useBlogPosts';
import { BlogCard } from '@/components/sections/blog/BlogCard';

export function FeaturedBlog() {
  const { data, isLoading } = useFeaturedBlogPosts();
  const posts = data?.data?.slice(0, 3) ?? [];

  return (
    <Box sx={{ py: { xs: 8, md: 12 }, backgroundColor: colorTokens.slate[50] }}>
      <Container maxWidth="xl">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            mb: { xs: 5, md: 6 },
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
          }}
        >
          <Box>
            <SectionLabel text="Latest Insights" color="blue" />
            <Typography
              variant="h2"
              sx={{ mt: 2, fontWeight: 800, color: colorTokens.darkNavy[900] }}
            >
              Finance Knowledge,{' '}
              <GradientText>No Jargon</GradientText>
            </Typography>
          </Box>
          <Button
            component={Link}
            href="/blog"
            variant="outlined"
            endIcon={<ArrowIcon />}
            sx={{
              borderRadius: '12px',
              fontWeight: 600,
              borderWidth: '1.5px',
              flexShrink: 0,
            }}
          >
            View All Posts
          </Button>
        </Box>

        <Grid container spacing={3}>
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
                  <BlogCardSkeleton />
                </Grid>
              ))
            : posts.map((post, i) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={post.id}>
                  <BlogCard post={post} index={i} />
                </Grid>
              ))}
        </Grid>
      </Container>
    </Box>
  );
}