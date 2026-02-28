"use client";

import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  LinearProgress,
} from "@mui/material";
import {
  CalendarMonth as CalendlyIcon,
  GridView as TemplatesIcon,
  Share as ShareIcon,
  Download as DownloadIcon,
} from "@mui/icons-material";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";
import { color, motion, easeOut, Variants } from "framer-motion";
import Link from "next/link";
import { colorTokens, shadowTokens } from "@/theme";
import { useTestResult } from "@/lib/hooks/useFounderTest";
import { SectionLabel, GradientText } from "@/components/ui";
import type { PersonalityType } from "@/types/test.types";

interface TestResultsClientProps {
  testNumber: string;
}

const PERSONALITY_CONFIG: Record<
  PersonalityType,
  { emoji: string; color: string; bg: string; gradient: string }
> = {
  strategic_visionary: {
    emoji: "🎯",
    color: colorTokens.financeBlue[600],
    bg: colorTokens.financeBlue[50],
    gradient: `linear-gradient(135deg, ${colorTokens.financeBlue[500]}, ${colorTokens.financeBlue[700]})`,
  },
  analytical_optimizer: {
    emoji: "📊",
    color: "#7C3AED",
    bg: "#F5F3FF",
    gradient: "linear-gradient(135deg, #8B5CF6, #6D28D9)",
  },
  growth_accelerator: {
    emoji: "🚀",
    color: colorTokens.success.main,
    bg: colorTokens.success.light,
    gradient: `linear-gradient(135deg, ${colorTokens.success.main}, #059669)`,
  },
  cautious_builder: {
    emoji: "🏗️",
    color: colorTokens.warning.main,
    bg: colorTokens.warning.light,
    gradient: `linear-gradient(135deg, ${colorTokens.warning.main}, #D97706)`,
  },
  dynamic_innovator: {
    emoji: "⚡",
    color: "#EC4899",
    bg: "#FDF2F8",
    gradient: "linear-gradient(135deg, #EC4899, #BE185D)",
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOut } },
};

export function TestResultsClient({ testNumber }: TestResultsClientProps) {
  const { data, isLoading, isError } = useTestResult(testNumber);
  const result = data?.data;

  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 3,
        }}
      >
        <CircularProgress
          size={48}
          sx={{ color: colorTokens.financeBlue[500] }}
        />
        <Typography variant="body1" color="text.secondary">
          Loading your results…
        </Typography>
      </Box>
    );
  }

  if (isError || !result) {
    return (
      <Container maxWidth="sm" sx={{ pt: 10, textAlign: "center" }}>
        <Alert severity="error" sx={{ borderRadius: "14px", mb: 3 }}>
          Failed to load your results. Please try again or contact support.
        </Alert>
        <Button
          component={Link}
          href="/founder-test"
          variant="contained"
          sx={{
            background: `linear-gradient(135deg, ${colorTokens.financeBlue[500]}, ${colorTokens.financeBlue[700]})`,
          }}
        >
          Retake Test
        </Button>
      </Container>
    );
  }

  const config = PERSONALITY_CONFIG[result.personalityType];

  const radarData = result.scores.map((s) => ({
    subject: s.label,
    score: s.percentage,
    fullMark: 100,
  }));

  const barData = result.scores.map((s) => ({
    name: s.label,
    score: s.percentage,
  }));

  const CHART_COLORS = [
    colorTokens.financeBlue[500],
    "#8B5CF6",
    colorTokens.success.main,
    colorTokens.warning.main,
    "#EC4899",
  ];

  return (
    <Box
      sx={{
        background: `linear-gradient(180deg, ${colorTokens.darkNavy[900]} 0%, ${colorTokens.darkNavy[800]} 30%, ${colorTokens.slate[50]} 60%, ${colorTokens.white} 100%)`,
        minHeight: "100vh",
        pt: { xs: 4, md: 6 },
        pb: 12,
      }}
    >
      <Container maxWidth="lg">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* ── Hero Result ── */}
          <motion.div variants={itemVariants}>
            <Box
              sx={{
                textAlign: "center",
                py: { xs: 6, md: 10 },
                position: "relative",
              }}
            >
              {/* Background radial */}
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  background: `radial-gradient(ellipse at center, ${config.color}22 0%, transparent 60%)`,
                  pointerEvents: "none",
                }}
              />

              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 180,
                  damping: 14,
                  delay: 0.2,
                }}
                style={{ display: "inline-block", marginBottom: 24 }}
              >
                <Box
                  sx={{
                    width: 112,
                    height: 112,
                    borderRadius: "28px",
                    background: config.gradient,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: `0 20px 60px ${config.color}44`,
                    mx: "auto",
                    fontSize: "3.5rem",
                  }}
                >
                  {config.emoji}
                </Box>
              </motion.div>

              <Typography
                variant="overline"
                sx={{
                  color: "rgba(255,255,255,0.5)",
                  letterSpacing: "0.14em",
                  display: "block",
                  mb: 1,
                }}
              >
                Your Financial Personality
              </Typography>

              <Typography
                variant="h1"
                sx={{
                  color: "#fff",
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  mb: 2,
                  background: config.gradient,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {result.personalityTitle}
              </Typography>

              <Typography
                variant="subtitle1"
                sx={{
                  color: "rgba(255,255,255,0.65)",
                  maxWidth: 600,
                  mx: "auto",
                  lineHeight: 1.75,
                  mb: 4,
                }}
              >
                {result.personalityDescription}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                <Chip
                  label={`Report #${testNumber}`}
                  sx={{
                    backgroundColor: "rgba(255,255,255,0.1)",
                    color: "rgba(255,255,255,0.7)",
                    fontWeight: 600,
                    border: "1px solid rgba(255,255,255,0.15)",
                    borderRadius: "8px",
                  }}
                />
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<ShareIcon />}
                  onClick={() =>
                    navigator.clipboard?.writeText(window.location.href)
                  }
                  sx={{
                    color: "rgba(255,255,255,0.7)",
                    borderColor: "rgba(255,255,255,0.2)",
                    borderRadius: "8px",
                    "&:hover": {
                      borderColor: "rgba(255,255,255,0.4)",
                      backgroundColor: "rgba(255,255,255,0.06)",
                    },
                  }}
                >
                  Share Report
                </Button>
              </Box>
            </Box>
          </motion.div>

          {/* ── Scores Section ── */}
          <motion.div variants={itemVariants}>
            <Grid container spacing={4} sx={{ mb: 5 }}>
              {/* Radar Chart */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Box
                  sx={{
                    backgroundColor: colorTokens.white,
                    borderRadius: "24px",
                    p: { xs: 3, md: 4 },
                    boxShadow: shadowTokens.lg,
                    border: `1px solid ${colorTokens.slate[100]}`,
                    height: "100%",
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      mb: 3,
                      color: colorTokens.darkNavy[900],
                    }}
                  >
                    Dimension Overview
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={radarData}>
                      <PolarGrid stroke={colorTokens.slate[200]} />
                      <PolarAngleAxis
                        dataKey="subject"
                        tick={{
                          fill: colorTokens.slate[600],
                          fontSize: 12,
                          fontFamily: "var(--font-body)",
                          fontWeight: 500,
                        }}
                      />
                      <PolarRadiusAxis
                        angle={30}
                        domain={[0, 100]}
                        tick={{ fill: colorTokens.slate[400], fontSize: 10 }}
                      />
                      <Radar
                        name="Score"
                        dataKey="score"
                        stroke={colorTokens.financeBlue[500]}
                        fill={colorTokens.financeBlue[500]}
                        fillOpacity={0.15}
                        strokeWidth={2}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </Box>
              </Grid>

              {/* Bar Chart */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Box
                  sx={{
                    backgroundColor: colorTokens.white,
                    borderRadius: "24px",
                    p: { xs: 3, md: 4 },
                    boxShadow: shadowTokens.lg,
                    border: `1px solid ${colorTokens.slate[100]}`,
                    height: "100%",
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      mb: 3,
                      color: colorTokens.darkNavy[900],
                    }}
                  >
                    Score Breakdown
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={barData}
                      layout="vertical"
                      margin={{ left: 0, right: 24, top: 0, bottom: 0 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke={colorTokens.slate[100]}
                        horizontal={false}
                      />
                      <XAxis
                        type="number"
                        domain={[0, 100]}
                        tick={{ fill: colorTokens.slate[400], fontSize: 11 }}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        type="category"
                        dataKey="name"
                        tick={{
                          fill: colorTokens.slate[600],
                          fontSize: 12,
                          fontFamily: "var(--font-body)",
                        }}
                        width={110}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip
                        cursor={{ fill: colorTokens.slate[50] }}
                        contentStyle={{
                          borderRadius: "10px",
                          border: `1px solid ${colorTokens.slate[200]}`,
                          fontFamily: "var(--font-body)",
                          boxShadow: shadowTokens.md,
                        }}
                        formatter={(value?: number) => [
                          `${value ?? 0}%`,
                          "Score",
                        ]}
                      />
                      <Bar dataKey="score" radius={[0, 6, 6, 0]} barSize={20}>
                        {barData.map((_, i) => (
                          <Cell
                            key={i}
                            fill={CHART_COLORS[i % CHART_COLORS.length]}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </Grid>
            </Grid>
          </motion.div>

          {/* ── Dimension Score Cards ── */}
          <motion.div variants={itemVariants}>
            <Box
              sx={{
                backgroundColor: colorTokens.white,
                borderRadius: "24px",
                p: { xs: 3, md: 4 },
                boxShadow: shadowTokens.lg,
                border: `1px solid ${colorTokens.slate[100]}`,
                mb: 4,
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  mb: 3,
                  color: colorTokens.darkNavy[900],
                }}
              >
                Your Scores
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                {result.scores.map((score, i) => (
                  <Box key={score.dimension}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 1,
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color: colorTokens.darkNavy[800],
                        }}
                      >
                        {score.label}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 700,
                          color: CHART_COLORS[i % CHART_COLORS.length],
                          fontFamily: "var(--font-display)",
                        }}
                      >
                        {score.percentage}%
                      </Typography>
                    </Box>
                    <Box sx={{ position: "relative" }}>
                      <Box
                        sx={{
                          height: 8,
                          borderRadius: "999px",
                          backgroundColor: colorTokens.slate[100],
                          overflow: "hidden",
                        }}
                      >
                        <motion.div
                          initial={{ width: "0%" }}
                          animate={{ width: `${score.percentage}%` }}
                          transition={{
                            duration: 0.8,
                            delay: i * 0.1,
                            ease: "easeOut",
                          }}
                          style={{
                            height: "100%",
                            background: `linear-gradient(90deg, ${CHART_COLORS[i % CHART_COLORS.length]}99, ${CHART_COLORS[i % CHART_COLORS.length]})`,
                            borderRadius: "999px",
                          }}
                        />
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </motion.div>

          {/* ── Strengths, Risks, Growth ── */}
          <motion.div variants={itemVariants}>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {/* Strengths */}
              <Grid size={{ xs: 12, md: 4 }}>
                <Box
                  sx={{
                    backgroundColor: colorTokens.success.light,
                    borderRadius: "20px",
                    p: 3,
                    border: `1px solid ${colorTokens.success.main}33`,
                    height: "100%",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      mb: 2.5,
                    }}
                  >
                    <Typography sx={{ fontSize: "1.5rem" }}>💪</Typography>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 700, color: colorTokens.success.dark }}
                    >
                      Your Strengths
                    </Typography>
                  </Box>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}
                  >
                    {result.strengths.map((strength, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + i * 0.08 }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            gap: 1.5,
                            alignItems: "flex-start",
                          }}
                        >
                          <Box
                            sx={{
                              width: 6,
                              height: 6,
                              borderRadius: "50%",
                              backgroundColor: colorTokens.success.main,
                              mt: "7px",
                              flexShrink: 0,
                            }}
                          />
                          <Typography
                            variant="body2"
                            sx={{
                              color: colorTokens.success.dark,
                              fontWeight: 500,
                              lineHeight: 1.6,
                            }}
                          >
                            {strength}
                          </Typography>
                        </Box>
                      </motion.div>
                    ))}
                  </Box>
                </Box>
              </Grid>

              {/* Risk Areas */}
              <Grid size={{ xs: 12, md: 4 }}>
                <Box
                  sx={{
                    backgroundColor: colorTokens.warning.light,
                    borderRadius: "20px",
                    p: 3,
                    border: `1px solid ${colorTokens.warning.main}33`,
                    height: "100%",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      mb: 2.5,
                    }}
                  >
                    <Typography sx={{ fontSize: "1.5rem" }}>⚠️</Typography>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 700, color: colorTokens.warning.dark }}
                    >
                      Watch Out For
                    </Typography>
                  </Box>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}
                  >
                    {result.riskAreas.map((risk, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + i * 0.08 }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            gap: 1.5,
                            alignItems: "flex-start",
                          }}
                        >
                          <Box
                            sx={{
                              width: 6,
                              height: 6,
                              borderRadius: "50%",
                              backgroundColor: colorTokens.warning.main,
                              mt: "7px",
                              flexShrink: 0,
                            }}
                          />
                          <Typography
                            variant="body2"
                            sx={{
                              color: colorTokens.warning.dark,
                              fontWeight: 500,
                              lineHeight: 1.6,
                            }}
                          >
                            {risk}
                          </Typography>
                        </Box>
                      </motion.div>
                    ))}
                  </Box>
                </Box>
              </Grid>

              {/* Growth Suggestions */}
              <Grid size={{ xs: 12, md: 4 }}>
                <Box
                  sx={{
                    backgroundColor: colorTokens.financeBlue[50],
                    borderRadius: "20px",
                    p: 3,
                    border: `1px solid ${colorTokens.financeBlue[100]}`,
                    height: "100%",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      mb: 2.5,
                    }}
                  >
                    <Typography sx={{ fontSize: "1.5rem" }}>📈</Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        color: colorTokens.financeBlue[800],
                      }}
                    >
                      Growth Actions
                    </Typography>
                  </Box>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}
                  >
                    {result.growthSuggestions.map((suggestion, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + i * 0.08 }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            gap: 1.5,
                            alignItems: "flex-start",
                          }}
                        >
                          <Box
                            sx={{
                              width: 6,
                              height: 6,
                              borderRadius: "50%",
                              backgroundColor: colorTokens.financeBlue[500],
                              mt: "7px",
                              flexShrink: 0,
                            }}
                          />
                          <Typography
                            variant="body2"
                            sx={{
                              color: colorTokens.financeBlue[800],
                              fontWeight: 500,
                              lineHeight: 1.6,
                            }}
                          >
                            {suggestion}
                          </Typography>
                        </Box>
                      </motion.div>
                    ))}
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </motion.div>

          {/* ── CTA Section ── */}
          <motion.div variants={itemVariants}>
            <Box
              sx={{
                background: `linear-gradient(135deg, ${colorTokens.darkNavy[900]} 0%, ${colorTokens.darkNavy[700]} 100%)`,
                borderRadius: "28px",
                p: { xs: 4, md: 6 },
                textAlign: "center",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  background: `radial-gradient(ellipse at 30% 50%, rgba(26,86,219,0.15) 0%, transparent 60%), radial-gradient(ellipse at 70% 50%, rgba(139,92,246,0.1) 0%, transparent 60%)`,
                  pointerEvents: "none",
                }}
              />

              <Box sx={{ position: "relative", zIndex: 1 }}>
                <Typography
                  variant="overline"
                  sx={{
                    color: "rgba(255,255,255,0.45)",
                    letterSpacing: "0.12em",
                    mb: 1.5,
                    display: "block",
                  }}
                >
                  Next Steps
                </Typography>
                <Typography
                  variant="h3"
                  sx={{
                    color: "#fff",
                    fontWeight: 800,
                    mb: 2,
                    letterSpacing: "-0.025em",
                  }}
                >
                  Ready to Act on{" "}
                  <Box
                    component="span"
                    sx={{
                      background: `linear-gradient(135deg, ${colorTokens.financeBlue[300]}, #A78BFA)`,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    Your Insights?
                  </Box>
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: "rgba(255,255,255,0.55)",
                    mb: 5,
                    maxWidth: 500,
                    mx: "auto",
                    lineHeight: 1.75,
                  }}
                >
                  Book a free 30-minute consultation with Parag or Khyati and
                  build a financial roadmap tailored to your personality type.
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    justifyContent: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <motion.div
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Button
                      component="a"
                      href={process.env.NEXT_PUBLIC_CALENDLY_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="contained"
                      size="large"
                      startIcon={<CalendlyIcon />}
                      sx={{
                        px: 4,
                        py: 1.75,
                        fontWeight: 700,
                        borderRadius: "14px",
                        background: `linear-gradient(135deg, ${colorTokens.financeBlue[400]}, ${colorTokens.financeBlue[600]})`,
                        boxShadow: "0 8px 28px rgba(26,86,219,0.45)",
                        fontSize: "1rem",
                        "&:hover": {
                          boxShadow: "0 12px 36px rgba(26,86,219,0.55)",
                        },
                      }}
                    >
                      Book Free Consultation
                    </Button>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Button
                      component={Link}
                      href="/templates"
                      variant="outlined"
                      size="large"
                      startIcon={<TemplatesIcon />}
                      sx={{
                        px: 4,
                        py: 1.75,
                        fontWeight: 700,
                        borderRadius: "14px",
                        color: "rgba(255,255,255,0.85)",
                        borderColor: "rgba(255,255,255,0.2)",
                        borderWidth: "1.5px",
                        fontSize: "1rem",
                        "&:hover": {
                          borderColor: "rgba(255,255,255,0.4)",
                          backgroundColor: "rgba(255,255,255,0.06)",
                        },
                      }}
                    >
                      Explore Templates
                    </Button>
                  </motion.div>
                </Box>

                <Typography
                  variant="caption"
                  sx={{
                    color: "rgba(255,255,255,0.3)",
                    mt: 3,
                    display: "block",
                  }}
                >
                  Your PDF report has been emailed to you automatically.
                </Typography>
              </Box>
            </Box>
          </motion.div>
        </motion.div>
      </Container>
    </Box>
  );
}
