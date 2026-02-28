import { Box, Container, Grid } from '@mui/material';
import { Skeleton } from '@mui/material';
import { colorTokens } from '@/theme';

export default function ShopLoading() {
  return (
    <Box sx={{ pt: 10, pb: 12 }}>
      <Container maxWidth="xl">
        <Skeleton variant="text" height={60} width="40%" sx={{ mb: 1 }} />
        <Skeleton variant="text" height={28} width="60%" sx={{ mb: 4 }} />
        <Box sx={{ display: 'flex', gap: 1, mb: 4 }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} variant="rounded" width={90} height={32} sx={{ borderRadius: '999px' }} />
          ))}
        </Box>
        <Grid container spacing={3}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={i}>
              <Skeleton variant="rounded" height={380} sx={{ borderRadius: '16px' }} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}