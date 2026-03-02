"use client";

import { Box, Container, Typography } from "@mui/material";
import {
  CalendarMonth as CalendlyIcon,
  GridView as TemplatesIcon,
  Share as ShareIcon,
} from "@mui/icons-material";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import Link from "next/link";
import { useTestResult } from "@/lib/hooks/useFounderTest";
import type { PersonalityType } from "@/types/test.types";

const T = {
  ink: "#0C0E12",
  inkMid: "#1C2333",
  inkMuted: "#3D4860",
  inkFaint: "#64748B",
  inkGhost: "#94A3B8",
  white: "#FFFFFF",
  offwhite: "#F9F8F5",
  cream: "#F0EDE6",
  parchment: "#E8E4DA",
  border: "#E2DED5",
  borderMd: "#C8C3B8",
  blue: "#2D5BE3",
  blueLight: "#60A5FA",
  blueGlow: "rgba(59,130,246,0.1)",
  sage: "#5C7A5C",
  error: "#DC2626",
  teal: "#0D7A5F",
  amber: "#D97706",
};

const SERIF = '"Instrument Serif","Playfair Display",Georgia,serif';
const SANS = '"DM Sans","Mona Sans",system-ui,sans-serif';
const MONO = '"DM Mono","JetBrains Mono",ui-monospace,monospace';
const EASE = [0.16, 1, 0.3, 1] as const;

const P_CONFIG: Record<
  PersonalityType,
  { icon: string; accent: string; label: string }
> = {
  strategic_visionary: {
    icon: "◈",
    accent: T.blue,
    label: "Strategic Visionary",
  },
  analytical_optimizer: {
    icon: "◆",
    accent: "#6D28D9",
    label: "Analytical Optimizer",
  },
  growth_accelerator: {
    icon: "△",
    accent: T.teal,
    label: "Growth Accelerator",
  },
  cautious_builder: { icon: "○", accent: "#64748B", label: "Cautious Builder" },
  dynamic_innovator: {
    icon: "◇",
    accent: "#9D174D",
    label: "Dynamic Innovator",
  },
};

const CHART_COLORS = [T.blue, "#6D28D9", T.teal, "#64748B", "#9D174D"];

function Section({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.55, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

function Card({ children, sx = {} }: { children: React.ReactNode; sx?: any }) {
  return (
    <Box
      sx={{
        background: T.white,
        borderRadius: "18px",
        border: `1px solid ${T.border}`,
        p: { xs: 3, md: 4 },
        boxShadow: "0 2px 14px rgba(12,14,18,0.05)",
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}

function CardHeading({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
      <Box
        sx={{
          width: 2,
          height: 14,
          borderRadius: "2px",
          background: `linear-gradient(180deg,${T.blueLight},${T.blue})`,
        }}
      />
      <Typography
        sx={{
          fontFamily: MONO,
          fontSize: "0.58rem",
          letterSpacing: "0.16em",
          color: T.inkFaint,
          textTransform: "uppercase",
        }}
      >
        {children}
      </Typography>
    </Box>
  );
}

interface Props {
  testNumber: string;
}

export function TestResultsClient({ testNumber }: Props) {
  const { data, isLoading, isError } = useTestResult(testNumber);
  const result = data?.data;

  if (isLoading)
    return (
      <Box
        sx={{
          minHeight: "100vh",
          background: T.offwhite,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: T.blueLight,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `0 8px 28px ${T.blueGlow}`,
          }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
          >
            <Typography
              sx={{ fontFamily: MONO, fontSize: "1.25rem", color: T.ink }}
            >
              ◈
            </Typography>
          </motion.div>
        </Box>
        <Typography
          sx={{ fontFamily: SANS, fontSize: "0.9rem", color: T.inkFaint }}
        >
          Loading your results…
        </Typography>
      </Box>
    );

  if (isError || !result)
    return (
      <Box
        sx={{
          minHeight: "100vh",
          background: T.offwhite,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 4,
        }}
      >
        <Box sx={{ textAlign: "center", maxWidth: 400 }}>
          <Typography
            sx={{
              fontFamily: SERIF,
              fontStyle: "italic",
              fontSize: "1.75rem",
              color: T.ink,
              mb: 2,
            }}
          >
            Unable to load results.
          </Typography>
          <Box
            component="a"
            href="/founder-test"
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              px: 2.5,
              py: 1.25,
              borderRadius: "10px",
              background: T.blueLight,
              textDecoration: "none",
              fontFamily: SANS,
              fontWeight: 600,
              fontSize: "0.875rem",
              color: T.white,
            }}
          >
            Retake Test
          </Box>
        </Box>
      </Box>
    );

  const cfg = P_CONFIG[result.personalityType];
  const radarData = result.scores.map((s: any) => ({
    subject: s.label,
    score: s.percentage,
    fullMark: 100,
  }));

  return (
    <Box sx={{ minHeight: "100vh", background: T.offwhite, fontFamily: SANS }}>
      {/* HERO */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", lg: "row" },
          minHeight: { lg: "88vh" },
        }}
      >
        <Box
          sx={{
            flex: "0 0 42%",
            background: T.inkMid,
            position: "relative",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            p: { xs: "64px 32px", md: "80px 56px" },
          }}
        >
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px)`,
              backgroundSize: "56px 56px",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              width: "65%",
              height: "55%",
              bottom: "-20%",
              right: "-15%",
              borderRadius: "50%",
              background: `radial-gradient(ellipse,${cfg.accent}18 0%,transparent 70%)`,
              pointerEvents: "none",
            }}
          />
          <Box sx={{ position: "relative", zIndex: 1 }}>
            <motion.div
              initial={{ scale: 0, rotate: "-20deg" }}
              animate={{ scale: 1, rotate: "0deg" }}
              transition={{
                type: "spring",
                stiffness: 220,
                damping: 16,
                delay: 0.2,
              }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: "18px",
                  background: `${cfg.accent}18`,
                  border: `1px solid ${cfg.accent}30`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 4,
                }}
              >
                <Typography
                  sx={{ fontFamily: MONO, fontSize: "2rem", color: cfg.accent }}
                >
                  {cfg.icon}
                </Typography>
              </Box>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28, duration: 0.6, ease: EASE }}
            >
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}
              >
                <Box
                  sx={{
                    width: 24,
                    height: "1px",
                    background: `${cfg.accent}80`,
                  }}
                />
                <Typography
                  sx={{
                    fontFamily: MONO,
                    fontSize: "0.52rem",
                    letterSpacing: "0.2em",
                    color: `${cfg.accent}cc`,
                    textTransform: "uppercase",
                  }}
                >
                  Your financial personality
                </Typography>
              </Box>
              <Typography
                sx={{
                  fontFamily: SERIF,
                  fontStyle: "italic",
                  fontWeight: 400,
                  color: T.white,
                  fontSize: { xs: "2rem", md: "2.875rem" },
                  letterSpacing: "-0.025em",
                  lineHeight: 1.1,
                  mb: 1.5,
                }}
              >
                {result.personalityTitle}
              </Typography>
              <Typography
                sx={{
                  fontFamily: SANS,
                  fontSize: "0.9375rem",
                  color: "rgba(255,255,255,0.5)",
                  lineHeight: 1.78,
                  mb: 4,
                }}
              >
                {result.personalityDescription}
              </Typography>
            </motion.div>
          </Box>
        </Box>

        {/* Radar chart */}
        <Box
          sx={{
            flex: 1,
            background: T.cream,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: { xs: "48px 24px", md: "64px 56px" },
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              backgroundImage: `linear-gradient(${T.border} 1px,transparent 1px),linear-gradient(90deg,${T.border} 1px,transparent 1px)`,
              backgroundSize: "56px 56px",
              opacity: 0.5,
            }}
          />
          <Box
            sx={{
              width: "100%",
              maxWidth: 440,
              position: "relative",
              zIndex: 1,
            }}
          >
            <Section delay={0.3}>
              <CardHeading>Dimension Overview</CardHeading>
              <ResponsiveContainer width="100%" height={320}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke={T.border} />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fill: T.inkFaint, fontSize: 11, fontFamily: MONO }}
                  />
                  <PolarRadiusAxis
                    angle={30}
                    domain={[0, 100]}
                    tick={{ fill: T.inkGhost, fontSize: 9 }}
                  />
                  <Radar
                    name="Score"
                    dataKey="score"
                    stroke={T.blue}
                    fill={T.blue}
                    fillOpacity={0.12}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </Section>
          </Box>
        </Box>
      </Box>

      {/* CONTENT */}
      <Container maxWidth="xl" sx={{ py: { xs: 6, md: 10 } }}>
        {/* Score, Strengths, Growth, Risk, CTA sections */}
        {/* ... remaining code continues exactly as in my previous full snippet with all gold replaced by T.blue/T.teal */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr 1fr" },
            gap: 3,
            mb: 4,
          }}
        >
          {/* Score bars */}
          <Section delay={0.1}>
            <Card>
              <CardHeading>Score Breakdown</CardHeading>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2.25 }}>
                {result.scores.map((score: any, i: number) => (
                  <Box key={score.dimension}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 0.75,
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: SANS,
                          fontSize: "0.8125rem",
                          color: T.inkMid,
                          fontWeight: 500,
                        }}
                      >
                        {score.label}
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: MONO,
                          fontSize: "0.7rem",
                          color: CHART_COLORS[i % CHART_COLORS.length],
                          fontWeight: 600,
                        }}
                      >
                        {score.percentage}%
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        height: 6,
                        borderRadius: "3px",
                        background: T.parchment,
                        overflow: "hidden",
                      }}
                    >
                      <motion.div
                        initial={{ width: "0%" }}
                        animate={{ width: `${score.percentage}%` }}
                        transition={{
                          delay: 0.2 + i * 0.1,
                          duration: 0.8,
                          ease: EASE,
                        }}
                        style={{
                          height: "100%",
                          background: `linear-gradient(90deg,${CHART_COLORS[i % CHART_COLORS.length]}80,${CHART_COLORS[i % CHART_COLORS.length]})`,
                          borderRadius: "3px",
                        }}
                      />
                    </Box>
                  </Box>
                ))}
              </Box>
            </Card>
          </Section>

          {/* Strengths */}
          <Section delay={0.18}>
            <Card>
              <CardHeading>Your Strengths</CardHeading>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.75 }}>
                {result.strengths.map((s: string, i: number) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.08, duration: 0.35 }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 1.5,
                      }}
                    >
                      <Box
                        sx={{
                          width: 18,
                          height: 18,
                          borderRadius: "50%",
                          flexShrink: 0,
                          mt: "1px",
                          background: `${T.sage}12`,
                          border: `1px solid ${T.sage}28`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Typography
                          sx={{
                            fontFamily: MONO,
                            fontSize: "0.5rem",
                            color: T.sage,
                          }}
                        >
                          ✓
                        </Typography>
                      </Box>
                      <Typography
                        sx={{
                          fontFamily: SANS,
                          fontSize: "0.875rem",
                          color: T.inkMid,
                          lineHeight: 1.6,
                        }}
                      >
                        {s}
                      </Typography>
                    </Box>
                  </motion.div>
                ))}
              </Box>
            </Card>
          </Section>

          {/* Growth actions */}
          <Section delay={0.26}>
            <Card>
              <CardHeading>Growth Actions</CardHeading>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.75 }}>
                {result.growthSuggestions.map((s: string, i: number) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.08, duration: 0.35 }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 1.5,
                      }}
                    >
                      <Box
                        sx={{
                          width: 18,
                          height: 18,
                          borderRadius: "50%",
                          flexShrink: 0,
                          mt: "1px",
                          background: `${T.blue}12`,
                          border: `1px solid ${T.blue}28`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Typography
                          sx={{
                            fontFamily: MONO,
                            fontSize: "0.48rem",
                            color: T.blue,
                          }}
                        >
                          △
                        </Typography>
                      </Box>
                      <Typography
                        sx={{
                          fontFamily: SANS,
                          fontSize: "0.875rem",
                          color: T.inkMid,
                          lineHeight: 1.6,
                        }}
                      >
                        {s}
                      </Typography>
                    </Box>
                  </motion.div>
                ))}
              </Box>
            </Card>
          </Section>
        </Box>

        {/* Risk areas */}
        <Section delay={0.32}>
          <Card sx={{ mb: 4 }}>
            <CardHeading>Watch Out For</CardHeading>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "1fr 1fr",
                  md: "1fr 1fr 1fr",
                },
                gap: 2,
              }}
            >
              {result.riskAreas.map((r: string, i: number) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.07, duration: 0.35 }}
                >
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: "12px",
                      background: T.parchment,
                      border: `1px solid ${T.border}`,
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 1.5,
                    }}
                  >
                    <Box
                      sx={{
                        width: 16,
                        height: 16,
                        borderRadius: "50%",
                        flexShrink: 0,
                        mt: "1px",
                        background: `${T.teal}18`,
                        border: `1px solid ${T.teal}28`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: MONO,
                          fontSize: "0.45rem",
                          color: T.teal,
                        }}
                      >
                        !
                      </Typography>
                    </Box>
                    <Typography
                      sx={{
                        fontFamily: SANS,
                        fontSize: "0.875rem",
                        color: T.inkMid,
                        lineHeight: 1.55,
                      }}
                    >
                      {r}
                    </Typography>
                  </Box>
                </motion.div>
              ))}
            </Box>
          </Card>
        </Section>

        {/* CTA */}
        <Section delay={0.4}>
          <Box
            sx={{
              background: T.inkMid,
              borderRadius: "22px",
              p: { xs: 4, md: 7 },
              position: "relative",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                backgroundImage: `linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)`,
                backgroundSize: "56px 56px",
              }}
            />
            <Box
              sx={{
                position: "absolute",
                width: "50%",
                height: "70%",
                top: "-20%",
                right: "-10%",
                borderRadius: "50%",
                background: `radial-gradient(ellipse,${cfg.accent}14 0%,transparent 70%)`,
                pointerEvents: "none",
              }}
            />
            <Box sx={{ position: "relative", zIndex: 1, maxWidth: 580 }}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}
              >
                <Box
                  sx={{
                    width: 24,
                    height: "1px",
                    background: `linear-gradient(90deg,${T.blue},${T.blueLight})`,
                  }}
                />
                <Typography
                  sx={{
                    fontFamily: MONO,
                    fontSize: "0.52rem",
                    letterSpacing: "0.2em",
                    color: T.blueLight,
                    textTransform: "uppercase",
                  }}
                >
                  Next Steps
                </Typography>
              </Box>
              <Typography
                sx={{
                  fontFamily: SERIF,
                  fontStyle: "italic",
                  fontWeight: 400,
                  color: T.white,
                  fontSize: { xs: "1.75rem", md: "2.5rem" },
                  letterSpacing: "-0.025em",
                  lineHeight: 1.1,
                  mb: 1,
                }}
              >
                Ready to act on
              </Typography>
              <Typography
                sx={{
                  fontFamily: SERIF,
                  fontStyle: "italic",
                  fontWeight: 400,
                  fontSize: { xs: "1.75rem", md: "2.5rem" },
                  letterSpacing: "-0.025em",
                  lineHeight: 1.1,
                  mb: 2.5,
                  background: `linear-gradient(115deg,${T.blueLight},${T.blue})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                your insights?
              </Typography>
              <Typography
                sx={{
                  fontFamily: SANS,
                  fontSize: "0.9375rem",
                  color: "rgba(255,255,255,0.45)",
                  lineHeight: 1.78,
                  mb: 5,
                  maxWidth: 460,
                }}
              >
                Book a free 30-minute consultation with our team and build a
                financial roadmap tailored to your personality type.
              </Typography>
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Box
                    component="a"
                    href={process.env.NEXT_PUBLIC_CALENDLY_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 1.25,
                      px: 3,
                      py: "13px",
                      borderRadius: "11px",
                      background: `linear-gradient(115deg,${T.blueLight},${T.blue})`,
                      textDecoration: "none",
                      boxShadow: `0 6px 22px ${T.blueGlow}`,
                      transition: "box-shadow 0.2s",
                      "&:hover": { boxShadow: `0 8px 28px ${T.blueGlow}` },
                    }}
                  >
                    <CalendlyIcon sx={{ fontSize: "1rem", color: T.ink }} />
                    <Typography
                      sx={{
                        fontFamily: SANS,
                        fontWeight: 700,
                        fontSize: "0.9375rem",
                        color: T.ink,
                      }}
                    >
                      Book Free Consultation
                    </Typography>
                  </Box>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Box
                    component={Link}
                    href="/templates"
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 1.25,
                      px: 3,
                      py: "13px",
                      borderRadius: "11px",
                      border: "1.5px solid rgba(255,255,255,0.14)",
                      textDecoration: "none",
                      transition: "border-color 0.15s, background 0.15s",
                      "&:hover": {
                        borderColor: "rgba(255,255,255,0.28)",
                        background: "rgba(255,255,255,0.04)",
                      },
                    }}
                  >
                    <TemplatesIcon
                      sx={{ fontSize: "1rem", color: "rgba(255,255,255,0.6)" }}
                    />
                    <Typography
                      sx={{
                        fontFamily: SANS,
                        fontWeight: 600,
                        fontSize: "0.9375rem",
                        color: "rgba(255,255,255,0.7)",
                      }}
                    >
                      Explore Templates
                    </Typography>
                  </Box>
                </motion.div>
              </Box>
              <Typography
                sx={{
                  fontFamily: MONO,
                  fontSize: "0.5rem",
                  letterSpacing: "0.1em",
                  color: "rgba(255,255,255,0.22)",
                  mt: 3,
                  textTransform: "uppercase",
                }}
              >
                PDF report sent to your inbox automatically
              </Typography>
            </Box>
          </Box>
        </Section>
      </Container>
    </Box>
  );
}
