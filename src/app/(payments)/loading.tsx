import { Box, CircularProgress } from '@mui/material';
import { colorTokens } from '@/theme';

export default function PaymentLoading() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: colorTokens.darkNavy[900],
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <CircularProgress size={48} sx={{ color: colorTokens.financeBlue[400] }} />
    </Box>
  );
}