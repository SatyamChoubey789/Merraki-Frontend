'use client';

import { Box, Typography, Button, Container } from '@mui/material';
import {
  ErrorOutline as ErrorIcon,
  Refresh as RetryIcon,
  ShoppingCart as CartIcon,
  SupportAgent as SupportIcon,
} from '@mui/icons-material';
import { motion,Variants,easeOut } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { colorTokens } from '@/theme';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.45, ease: easeOut }
  },
};
const FAILURE_REASONS = [
  { icon: '💳', text: 'Insufficient funds in your account' },
  { icon: '🌐', text: 'Network interruption during payment' },
  { icon: '⏱️', text: 'Payment session timed out' },
  { icon: '🔒', text: 'Card declined by your bank' },
];

export default function FailurePage() {
  const router = useRouter();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(180deg, ${colorTokens.error.light} 0%, ${colorTokens.white} 60%)`,
        display: 'flex',
        alignItems: 'center',
        py: 8,
      }}
    >
      <Container maxWidth="sm">
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          {/* Error Icon */}
          <motion.div variants={itemVariants} style={{ textAlign: 'center', marginBottom: 32 }}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
              style={{ display: 'inline-block' }}
            >
              <Box
                sx={{
                  width: 96,
                  height: 96,
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${colorTokens.error.main}, #DC2626)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: `0 16px 48px rgba(239,68,68,0.3)`,
                  mx: 'auto',
                  mb: 3,
                }}
              >
                <ErrorIcon sx={{ fontSize: '3rem', color: '#fff' }} />
              </Box>
            </motion.div>

            <Typography
              variant="h2"
              sx={{ fontWeight: 800, color: colorTokens.darkNavy[900], mb: 1.5, letterSpacing: '-0.03em' }}
            >
              Payment Failed
            </Typography>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              sx={{ lineHeight: 1.7, maxWidth: 380, mx: 'auto' }}
            >
              Don&apos;t worry — your cart is still saved and no money was charged.
              You can try again anytime.
            </Typography>
          </motion.div>

          {/* Possible Reasons */}
          <motion.div variants={itemVariants}>
            <Box
              sx={{
                backgroundColor: colorTokens.white,
                borderRadius: '20px',
                border: `1px solid ${colorTokens.slate[100]}`,
                p: 3,
                mb: 3,
                boxShadow: '0 4px 24px rgba(10,20,48,0.06)',
              }}
            >
              <Typography
                variant="overline"
                sx={{ color: colorTokens.slate[400], letterSpacing: '0.1em', mb: 2, display: 'block' }}
              >
                Common Reasons
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {FAILURE_REASONS.map((reason, i) => (
                  <Box key={i} sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                    <Typography sx={{ fontSize: '1.125rem', lineHeight: 1, flexShrink: 0 }}>
                      {reason.icon}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5 }}>
                      {reason.text}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </motion.div>

          {/* CTAs */}
          <motion.div variants={itemVariants}>
            <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
              <Button
                component={Link}
                href="/checkout"
                variant="contained"
                size="large"
                fullWidth
                startIcon={<RetryIcon />}
                sx={{
                  background: `linear-gradient(135deg, ${colorTokens.financeBlue[500]}, ${colorTokens.financeBlue[700]})`,
                  py: 1.5,
                  fontWeight: 700,
                  borderRadius: '12px',
                  boxShadow: '0 4px 16px rgba(26,86,219,0.3)',
                }}
              >
                Try Again
              </Button>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  component={Link}
                  href="/templates"
                  variant="outlined"
                  size="large"
                  fullWidth
                  startIcon={<CartIcon />}
                  sx={{ py: 1.5, fontWeight: 600, borderRadius: '12px', borderWidth: '1.5px' }}
                >
                  Back to Cart
                </Button>
                <Button
                  component={Link}
                  href="/book-consultation"
                  variant="outlined"
                  size="large"
                  fullWidth
                  startIcon={<SupportIcon />}
                  sx={{ py: 1.5, fontWeight: 600, borderRadius: '12px', borderWidth: '1.5px' }}
                >
                  Get Help
                </Button>
              </Box>
            </Box>
          </motion.div>
        </motion.div>
      </Container>
    </Box>
  );
}