"use client";

import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Skeleton,
  Alert,
} from "@mui/material";
import {
  PlayArrow as StartIcon,
  Timer as TimerIcon,
  Psychology as BrainIcon,
  InsertChart as ChartIcon,
  EmojiObjects as InsightIcon,
} from "@mui/icons-material";
import { motion, easeOut, Variants } from "framer-motion";
import { colorTokens } from "@/theme";
import { SectionLabel, GlassCard } from "@/components/ui";

interface TestIntroScreenProps {
  isLoading: boolean;
  isError: boolean;
  totalQuestions: number;
  onStart: () => void;
}

const FEATURES = [
  {
    icon: <TimerIcon />,
    title: "5 Minutes",
    description: "Quick, focused questions designed for busy founders",
    color: colorTokens.financeBlue[500],
    bg: colorTokens.financeBlue[50],
  },
  {
    icon: <BrainIcon />,
    title: "Personality Report",
    description: "Discover your unique financial decision-making style",
    color: "#8B5CF6",
    bg: "#F5F3FF",
  },
  {
    icon: <ChartIcon />,
    title: "Visual Scores",
    description: "See exactly where you excel and where to improve",
    color: colorTokens.success.main,
    bg: colorTokens.success.light,
  },
  {
    icon: <InsightIcon />,
    title: "Growth Playbook",
    description: "Get personalised recommendations to scale smarter",
    color: colorTokens.warning.main,
    bg: colorTokens.warning.light,
  },
];

const PERSONALITY_PREVIEWS = [
  {
    type: "Strategic Visionary",
    emoji: "🎯",
    color: colorTokens.financeBlue[500],
  },
  { type: "Analytical Optimizer", emoji: "📊", color: "#8B5CF6" },
  { type: "Growth Accelerator", emoji: "🚀", color: colorTokens.success.main },
  { type: "Cautious Builder", emoji: "🏗️", color: colorTokens.warning.main },
  { type: "Dynamic Innovator", emoji: "⚡", color: "#EC4899" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOut } },
};

export function TestIntroScreen({
  isLoading,
  isError,
  totalQuestions,
  onStart,
}: TestIntroScreenProps) {
  return (
    <Box
      sx={{
        background: `linear-gradient(180deg, ${colorTokens.darkNavy[900]} 0%, ${colorTokens.darkNavy[800]} 40%, ${colorTokens.white} 100%)`,
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background mesh */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background: `
            radial-gradient(ellipse at 20% 30%, rgba(26,86,219,0.18) 0%, transparent 55%),
            radial-gradient(ellipse at 80% 10%, rgba(139,92,246,0.12) 0%, transparent 50%),
            radial-gradient(ellipse at 60% 70%, rgba(26,86,219,0.08) 0%, transparent 50%)
          `,
          pointerEvents: "none",
        }}
      />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Hero Section */}
          <Box
            sx={{
              pt: { xs: 8, md: 12 },
              pb: { xs: 6, md: 8 },
              textAlign: "center",
            }}
          >
            <motion.div variants={itemVariants}>
              <SectionLabel text="Free Founder Assessment" color="light" />
            </motion.div>

            <motion.div variants={itemVariants}>
              <Typography
                variant="h1"
                sx={{
                  mt: 2,
                  mb: 2,
                  color: "#fff",
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  maxWidth: 800,
                  mx: "auto",
                }}
              >
                What&apos;s Your{" "}
                <Box
                  component="span"
                  sx={{
                    background: `linear-gradient(135deg, ${colorTokens.financeBlue[300]}, #A78BFA)`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Financial
                </Box>{" "}
                Personality?
              </Typography>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Typography
                variant="subtitle1"
                sx={{
                  color: "rgba(255,255,255,0.6)",
                  maxWidth: 560,
                  mx: "auto",
                  lineHeight: 1.75,
                  mb: 5,
                }}
              >
                Take our {isLoading ? "…" : totalQuestions}-question assessment
                and discover how you make financial decisions. Get a
                personalised report emailed to you — completely free.
              </Typography>
            </motion.div>

            {isError && (
              <motion.div variants={itemVariants}>
                <Alert
                  severity="error"
                  sx={{
                    mb: 3,
                    maxWidth: 480,
                    mx: "auto",
                    borderRadius: "14px",
                  }}
                >
                  Failed to load test questions. Please refresh and try again.
                </Alert>
              </motion.div>
            )}

            <motion.div variants={itemVariants}>
              {isLoading ? (
                <Skeleton
                  variant="rounded"
                  width={220}
                  height={56}
                  sx={{
                    mx: "auto",
                    borderRadius: "14px",
                    backgroundColor: "rgba(255,255,255,0.1)",
                  }}
                />
              ) : (
                <motion.div
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  style={{ display: "inline-block" }}
                >
                  <Button
                    onClick={onStart}
                    disabled={isError}
                    variant="contained"
                    size="large"
                    startIcon={<StartIcon />}
                    sx={{
                      px: 5,
                      py: 1.875,
                      fontSize: "1.0625rem",
                      fontWeight: 700,
                      borderRadius: "14px",
                      background: `linear-gradient(135deg, ${colorTokens.financeBlue[400]}, ${colorTokens.financeBlue[600]})`,
                      boxShadow: "0 8px 32px rgba(26,86,219,0.45)",
                      "&:hover": {
                        boxShadow: "0 12px 40px rgba(26,86,219,0.55)",
                      },
                    }}
                  >
                    Start Free Test
                  </Button>
                </motion.div>
              )}
            </motion.div>

            <motion.div variants={itemVariants}>
              <Typography
                variant="caption"
                sx={{
                  color: "rgba(255,255,255,0.35)",
                  mt: 2,
                  display: "block",
                }}
              >
                No sign-up required · Takes ~5 minutes · Report sent to your
                email
              </Typography>
            </motion.div>
          </Box>

          {/* Personality Type Preview */}
          <motion.div variants={itemVariants}>
            <Box sx={{ mb: 6 }}>
              <Typography
                variant="overline"
                sx={{
                  color: "rgba(255,255,255,0.4)",
                  letterSpacing: "0.12em",
                  textAlign: "center",
                  display: "block",
                  mb: 2.5,
                }}
              >
                Discover Which Type You Are
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  gap: 1.5,
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                {PERSONALITY_PREVIEWS.map((p, i) => (
                  <motion.div
                    key={p.type}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + i * 0.07, duration: 0.4 }}
                    whileHover={{ scale: 1.05, y: -3 }}
                  >
                    <Box
                      sx={{
                        px: 2.5,
                        py: 1.25,
                        borderRadius: "12px",
                        backgroundColor: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.12)",
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        cursor: "default",
                        backdropFilter: "blur(8px)",
                      }}
                    >
                      <span style={{ fontSize: "1.25rem" }}>{p.emoji}</span>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "rgba(255,255,255,0.8)",
                          fontWeight: 600,
                          fontFamily: "var(--font-display)",
                          fontSize: "0.875rem",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {p.type}
                      </Typography>
                    </Box>
                  </motion.div>
                ))}
              </Box>
            </Box>
          </motion.div>

          {/* Features Grid */}
          <motion.div variants={itemVariants}>
            <Grid container spacing={2.5} sx={{ mb: 8 }}>
              {FEATURES.map((feature, i) => (
                <Grid size={{ xs: 12, sm: 6, md: 3 }} key={feature.title}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.08 }}
                    whileHover={{ y: -4 }}
                  >
                    <GlassCard
                      intensity="medium"
                      sx={{
                        p: 3,
                        height: "100%",
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "16px",
                      }}
                    >
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: "12px",
                          backgroundColor: feature.bg,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: feature.color,
                          mb: 2,
                        }}
                      >
                        {feature.icon}
                      </Box>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          color: "#fff",
                          mb: 0.75,
                          fontSize: "1rem",
                        }}
                      >
                        {feature.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "rgba(255,255,255,0.5)",
                          lineHeight: 1.65,
                        }}
                      >
                        {feature.description}
                      </Typography>
                    </GlassCard>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </motion.div>
      </Container>
    </Box>
  );
}
