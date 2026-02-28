'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Typography, Button, Container } from '@mui/material';
import {
  CheckCircle as CheckIcon,
  Email as EmailIcon,
  TrackChanges as TrackIcon,
  GridView as TemplatesIcon,
} from '@mui/icons-material';
import { motion,Variants,easeOut } from 'framer-motion';
import Link from 'next/link';
import { colorTokens } from '@/theme';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOut } },
};

const NEXT_STEPS = [
  {
    icon: <EmailIcon sx={{ fontSize: '1.5rem' }} />,
    title: 'Check Your Email',
    description: 'A confirmation email with your order details has been sent.',
    color: colorTokens.financeBlue[500],
    bg: colorTokens.financeBlue[50],
  },
  {
    icon: <TrackIcon sx={{ fontSize: '1.5rem' }} />,
    title: 'Track Your Order',
    description: 'Use the order tracking page to monitor approval status.',
    color: colorTokens.warning.main,
    bg: colorTokens.warning.light,
  },
  {
    icon: <CheckIcon sx={{ fontSize: '1.5rem' }} />,
    title: 'Admin Review',
    description: 'Our team will review and approve your order shortly.',
    color: colorTokens.success.main,
    bg: colorTokens.success.light,
  },
];

export default function SuccessPage() {
  const router = useRouter();
  const confettiRef = useRef<boolean>(false);

  useEffect(() => {
    if (!confettiRef.current) {
      confettiRef.current = true;
      // Confetti effect using CSS animations
    }
  }, []);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(180deg, ${colorTokens.financeBlue[50]} 0%, ${colorTokens.white} 60%)`,
        display: 'flex',
        alignItems: 'center',
        py: 8,
      }}
    >
      <Container maxWidth="sm">
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          {/* Success Icon */}
          <motion.div variants={itemVariants} style={{ textAlign: 'center', marginBottom: 32 }}>
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
              style={{ display: 'inline-block' }}
            >
              <Box
                sx={{
                  width: 96,
                  height: 96,
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${colorTokens.success.main}, #059669)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: `0 16px 48px rgba(16,185,129,0.35)`,
                  mx: 'auto',
                  mb: 3,
                }}
              >
                <CheckIcon sx={{ fontSize: '3rem', color: '#fff' }} />
              </Box>
            </motion.div>

            <Typography
              variant="h2"
              sx={{
                fontWeight: 800,
                color: colorTokens.darkNavy[900],
                mb: 1.5,
                letterSpacing: '-0.03em',
              }}
            >
              Payment Successful!
            </Typography>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              sx={{ lineHeight: 1.7, maxWidth: 400, mx: 'auto' }}
            >
              Your order has been received. You&apos;ll get an email confirmation
              and download link once our team approves your order.
            </Typography>
          </motion.div>

          {/* Next Steps */}
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
                sx={{
                  color: colorTokens.slate[400],
                  letterSpacing: '0.1em',
                  mb: 2.5,
                  display: 'block',
                }}
              >
                What Happens Next
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {NEXT_STEPS.map((step, i) => (
                  <Box
                    key={i}
                    sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}
                  >
                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: '12px',
                        backgroundColor: step.bg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: step.color,
                        flexShrink: 0,
                      }}
                    >
                      {step.icon}
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: colorTokens.darkNavy[800], mb: 0.25 }}>
                        {step.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.5 }}>
                        {step.description}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </motion.div>

          {/* CTAs */}
          <motion.div variants={itemVariants}>
            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
              <Button
                component={Link}
                href="/order-tracking"
                variant="contained"
                size="large"
                fullWidth
                startIcon={<TrackIcon />}
                sx={{
                  background: `linear-gradient(135deg, ${colorTokens.financeBlue[500]}, ${colorTokens.financeBlue[700]})`,
                  py: 1.5,
                  fontWeight: 700,
                  borderRadius: '12px',
                  boxShadow: '0 4px 16px rgba(26,86,219,0.3)',
                }}
              >
                Track Order
              </Button>
              <Button
                component={Link}
                href="/templates"
                variant="outlined"
                size="large"
                fullWidth
                startIcon={<TemplatesIcon />}
                sx={{ py: 1.5, fontWeight: 600, borderRadius: '12px', borderWidth: '1.5px' }}
              >
                More Templates
              </Button>
            </Box>
          </motion.div>
        </motion.div>
      </Container>
    </Box>
  );
}