'use client';

import { Box, Container, Typography, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import { colorTokens } from '@/theme';
import { SectionLabel, ErrorBoundary } from '@/components/ui';
import { TemplateFilters } from './TemplateFilters';
import { TemplateGrid } from './TemplateGrid';
import { useSearchFilter } from '@/lib/hooks/useSearchFilter';
import { GradientText } from '@/components/ui';

export function TemplatesPageClient() {
  const filter = useSearchFilter({ initialSort: 'popular' });

  return (
    <Box sx={{ pt: { xs: 4, md: 6 }, pb: 10, minHeight: '100vh' }}>
      {/* Page Header */}
      <Box
        sx={{
          background: `linear-gradient(180deg, ${colorTokens.financeBlue[50]} 0%, transparent 100%)`,
          pt: { xs: 6, md: 10 },
          pb: { xs: 4, md: 6 },
          mb: 4,
        }}
      >
        <Container maxWidth="xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <SectionLabel text="Templates Store" color="blue" />
            <Typography variant="h1" sx={{ mt: 2, mb: 2, maxWidth: 700 }}>
              Financial Tools Built for{' '}
              <GradientText>Real Decisions</GradientText>
            </Typography>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              sx={{ maxWidth: 560 }}
            >
              Professional-grade Excel models and dashboards. Download, customize,
              and start making data-driven decisions today.
            </Typography>
          </motion.div>
        </Container>
      </Box>

      <Container maxWidth="xl">
        <ErrorBoundary>
          <TemplateFilters filter={filter} />
          <TemplateGrid filter={filter} />
        </ErrorBoundary>
      </Container>
    </Box>
  );
}