import { Box, Container, Skeleton } from '@mui/material';
import { colorTokens } from '@/theme';

export default function CalculatorsLoading() {
  return (
    <Box sx={{ minHeight: '100vh' }}>
      <Box sx={{ backgroundColor: colorTokens.darkNavy[900], pt: 12, pb: 8 }}>
        <Container maxWidth="xl">
          <Skeleton variant="text" height={24} width={140} sx={{ mb: 2, backgroundColor: 'rgba(255,255,255,0.08)' }} />
          <Skeleton variant="text" height={72} width="55%" sx={{ mb: 2, backgroundColor: 'rgba(255,255,255,0.08)' }} />
          <Skeleton variant="text" height={28} width="45%" sx={{ backgroundColor: 'rgba(255,255,255,0.08)' }} />
        </Container>
      </Box>
    </Box>
  );
}