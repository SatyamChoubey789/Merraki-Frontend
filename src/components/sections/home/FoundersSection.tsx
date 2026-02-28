'use client';

import { Box, Container, Typography, Grid, Chip } from '@mui/material';
import { LinkedIn as LinkedInIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { colorTokens, shadowTokens } from '@/theme';
import { SectionLabel, GradientText } from '@/components/ui';
import { useInView } from '@/lib/hooks/useInView';

const FOUNDERS = [
  {
    name: 'Parag Bhutani',
    role: 'Co-Founder',
    tagline: 'Excel & Financial Modeling Expert',
    bio: 'Built 150+ financial models across SaaS, D2C, and manufacturing. Helps founders transform raw data into boardroom-ready strategies. Specialist in Excel dashboards and forecasting systems.',
    achievements: [
      '150+ financial models built',
      'Excel & forecasting systems',
      'Startup to Series B advisory',
      'Data-driven decision expert',
    ],
    initials: 'PB',
    gradientFrom: colorTokens.financeBlue[500],
    gradientTo: colorTokens.financeBlue[700],
    linkedIn: '#',
  },
  {
    name: 'Khyati Gupta',
    role: 'Co-Founder',
    tagline: 'Financial Modelling & Excel Expert',
    bio: 'Excel and Power BI specialist with a focus on building financial systems that scale. Creates growth-focused forecasting frameworks that help businesses plan for every scenario.',
    achievements: [
      'Excel & Power BI specialist',
      'Financial systems design',
      'Forecasting frameworks',
      'Growth strategy advisor',
    ],
    initials: 'KG',
    gradientFrom: '#8B5CF6',
    gradientTo: '#6D28D9',
    linkedIn: '#',
  },
];

export function FoundersSection() {
  const { ref, inView } = useInView({ threshold: 0.15 });

  return (
    <Box sx={{ py: { xs: 8, md: 12 }, backgroundColor: colorTokens.slate[50] }}>
      <Container maxWidth="xl">
        <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 8 } }}>
          <SectionLabel text="The Team" color="blue" />
          <Typography variant="h2" sx={{ mt: 2, fontWeight: 800, color: colorTokens.darkNavy[900] }}>
            Meet the{' '}
            <GradientText>Experts Behind the Numbers</GradientText>
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            sx={{ maxWidth: 520, mx: 'auto', lineHeight: 1.75, mt: 2 }}
          >
            Two finance specialists who built their careers understanding why
            numbers matter and how to make them work harder for you.
          </Typography>
        </Box>

        <Grid container spacing={4} ref={ref as React.RefObject<HTMLDivElement>}>
          {FOUNDERS.map((founder, i) => (
            <Grid size={{ xs: 12, md: 6 }} key={founder.name}>
              <motion.div
                initial={{ opacity: 0, y: 32 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.15, duration: 0.6, ease: 'easeOut' }}
                whileHover={{ y: -6 }}
              >
                <Box
                  sx={{
                    p: { xs: 3, md: 4 },
                    borderRadius: '24px',
                    backgroundColor: colorTokens.white,
                    border: `1px solid ${colorTokens.slate[100]}`,
                    boxShadow: shadowTokens.lg,
                    height: '100%',
                    transition: 'all 0.3s ease',
                    '&:hover': { boxShadow: shadowTokens['2xl'] },
                  }}
                >
                  {/* Avatar + Name */}
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2.5, mb: 3 }}>
                    <Box
                      sx={{
                        width: 72,
                        height: 72,
                        borderRadius: '18px',
                        background: `linear-gradient(135deg, ${founder.gradientFrom}, ${founder.gradientTo})`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        boxShadow: `0 8px 24px ${founder.gradientFrom}44`,
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: 'var(--font-display)',
                          fontWeight: 800,
                          fontSize: '1.5rem',
                          color: '#fff',
                          letterSpacing: '-0.02em',
                        }}
                      >
                        {founder.initials}
                      </Typography>
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          mb: 0.25,
                        }}
                      >
                        <Typography
                          variant="h5"
                          sx={{
                            fontWeight: 800,
                            color: colorTokens.darkNavy[900],
                            letterSpacing: '-0.015em',
                          }}
                        >
                          {founder.name}
                        </Typography>
                        <motion.a
                          href={founder.linkedIn}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.15 }}
                          whileTap={{ scale: 0.95 }}
                          style={{
                            color: '#0A66C2',
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          <LinkedInIcon sx={{ fontSize: '1.375rem' }} />
                        </motion.a>
                      </Box>
                      <Chip
                        label={founder.role}
                        size="small"
                        sx={{
                          backgroundColor: `${founder.gradientFrom}18`,
                          color: founder.gradientFrom,
                          fontWeight: 700,
                          fontSize: '0.75rem',
                          borderRadius: '6px',
                          height: 24,
                          mb: 0.5,
                        }}
                      />
                      <Typography
                        variant="body2"
                        sx={{
                          color: colorTokens.slate[500],
                          fontWeight: 500,
                          fontFamily: 'var(--font-display)',
                        }}
                      >
                        {founder.tagline}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Bio */}
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ lineHeight: 1.8, mb: 3 }}
                  >
                    {founder.bio}
                  </Typography>

                  {/* Achievements */}
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {founder.achievements.map((achievement) => (
                      <Box
                        key={achievement}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.75,
                          px: 1.5,
                          py: 0.75,
                          borderRadius: '8px',
                          backgroundColor: colorTokens.slate[50],
                          border: `1px solid ${colorTokens.slate[200]}`,
                        }}
                      >
                        <Box
                          sx={{
                            width: 5,
                            height: 5,
                            borderRadius: '50%',
                            backgroundColor: founder.gradientFrom,
                          }}
                        />
                        <Typography
                          variant="caption"
                          sx={{
                            fontWeight: 600,
                            color: colorTokens.slate[600],
                            fontFamily: 'var(--font-display)',
                          }}
                        >
                          {achievement}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}