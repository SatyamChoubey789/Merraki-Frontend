"use client";

import { Box, Container, Typography, Button, Grid } from "@mui/material";
import {
  ArrowForward as ArrowIcon,
  PlayArrow as PlayIcon,
} from "@mui/icons-material";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { colorTokens } from "@/theme";
import { GlassCard } from "@/components/ui";

type FloatingCard = {
  id: string;
  top?: string;
  bottom?: string;
  left?: string | { xs: string; md: string };
  right?: string | { xs: string; md: string };
  label: string;
  value: string;
  sub: string;
  color: string;
  delay: number;
};

const FLOATING_CARDS: FloatingCard[] = [
  {
    id: "card1",
    top: "18%",
    right: { xs: "-5%", md: "2%" },
    label: "Revenue Growth",
    value: "+₹2.4 Cr",
    sub: "Q3 2024 vs Q2",
    color: colorTokens.success.main,
    delay: 0.2,
  },
  {
    id: "card2",
    bottom: "28%",
    left: { xs: "-5%", md: "1%" },
    label: "Models Built",
    value: "150+",
    sub: "Financial models",
    color: colorTokens.financeBlue[400],
    delay: 0.4,
  },
  {
    id: "card3",
    bottom: "12%",
    right: { xs: "-5%", md: "4%" },
    label: "Founders Helped",
    value: "300+",
    sub: "Across 12 industries",
    color: "#A78BFA",
    delay: 0.6,
  },
];

export function HeroSection() {
  const { scrollYProgress } = useScroll();
  const yParallax = useTransform(scrollYProgress, [0, 0.3], [0, -60]);
  const opacityFade = useTransform(scrollYProgress, [0, 0.25], [1, 0]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `linear-gradient(160deg, ${colorTokens.darkNavy[900]} 0%, ${colorTokens.darkNavy[800]} 45%, #0C1F5C 100%)`,
        display: "flex",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
        pt: { xs: 12, md: 0 },
        pb: { xs: 8, md: 0 },
      }}
    >
      {/* Background mesh */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background: `
            radial-gradient(ellipse at 15% 50%, rgba(26,86,219,0.18) 0%, transparent 55%),
            radial-gradient(ellipse at 85% 20%, rgba(139,92,246,0.12) 0%, transparent 50%),
            radial-gradient(ellipse at 60% 85%, rgba(26,86,219,0.08) 0%, transparent 50%)
          `,
          pointerEvents: "none",
        }}
      />

      {/* Grid overlay */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          pointerEvents: "none",
        }}
      />

      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1 }}>
        <Grid container spacing={6} alignItems="center">
          {/* Left — Copy */}
          <Grid size={{ xs: 12, lg: 6 }}>
            <motion.div
              style={{ y: yParallax, opacity: opacityFade }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Eyebrow */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
              >
                <Box
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 1,
                    px: 2,
                    py: 0.875,
                    borderRadius: "999px",
                    backgroundColor: "rgba(26,86,219,0.15)",
                    border: "1px solid rgba(26,86,219,0.3)",
                    mb: 3,
                  }}
                >
                  <Box
                    sx={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      backgroundColor: colorTokens.financeBlue[400],
                      boxShadow: `0 0 8px ${colorTokens.financeBlue[400]}`,
                    }}
                  />
                  <Typography
                    variant="overline"
                    sx={{
                      color: colorTokens.financeBlue[300],
                      letterSpacing: "0.1em",
                      fontSize: "0.7rem",
                      lineHeight: 1,
                    }}
                  >
                    Trusted by 300+ Founders Across India
                  </Typography>
                </Box>
              </motion.div>

              {/* Headline */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <Typography
                  variant="h1"
                  sx={{
                    color: "#fff",
                    mb: 2.5,
                    fontWeight: 800,
                    letterSpacing: "-0.035em",
                    lineHeight: 1.06,
                  }}
                >
                  Your Trusted{" "}
                  <Box
                    component="span"
                    sx={{
                      background: `linear-gradient(135deg, ${colorTokens.financeBlue[300]} 0%, #A78BFA 60%, ${colorTokens.financeBlue[400]} 100%)`,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    Partner
                  </Box>{" "}
                  in Fiscal Fitness
                </Typography>
              </motion.div>

              {/* Sub */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: "rgba(255,255,255,0.6)",
                    mb: 4,
                    maxWidth: 520,
                    lineHeight: 1.8,
                    fontWeight: 400,
                  }}
                >
                  We transform numbers into strategies, insights into action,
                  and complexity into confidence — so you can focus on building.
                </Typography>
              </motion.div>

              {/* Transform pills */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.38, duration: 0.5 }}
              >
                <Box
                  sx={{
                    display: "flex",
                    gap: 1.5,
                    flexWrap: "wrap",
                    mb: 4,
                  }}
                >
                  {[
                    { from: "Numbers", to: "Strategies" },
                    { from: "Insights", to: "Action" },
                    { from: "Complexity", to: "Confidence" },
                  ].map((item) => (
                    <Box
                      key={item.from}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.75,
                        px: 1.75,
                        py: 0.875,
                        borderRadius: "8px",
                        backgroundColor: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.1)",
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          color: "rgba(255,255,255,0.5)",
                          fontWeight: 500,
                          fontFamily: "var(--font-display)",
                        }}
                      >
                        {item.from}
                      </Typography>
                      <ArrowIcon
                        sx={{
                          fontSize: "0.75rem",
                          color: colorTokens.financeBlue[400],
                        }}
                      />
                      <Typography
                        variant="caption"
                        sx={{
                          color: colorTokens.financeBlue[300],
                          fontWeight: 700,
                          fontFamily: "var(--font-display)",
                        }}
                      >
                        {item.to}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </motion.div>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.5 }}
              >
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                  <motion.div
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Button
                      component={Link}
                      href="/templates"
                      variant="contained"
                      size="large"
                      endIcon={<ArrowIcon />}
                      sx={{
                        px: 4,
                        py: 1.875,
                        fontSize: "1rem",
                        fontWeight: 700,
                        borderRadius: "14px",
                        background: `linear-gradient(135deg, ${colorTokens.financeBlue[400]}, ${colorTokens.financeBlue[600]})`,
                        boxShadow: "0 8px 32px rgba(26,86,219,0.45)",
                        "&:hover": {
                          boxShadow: "0 12px 40px rgba(26,86,219,0.55)",
                        },
                      }}
                    >
                      Browse Templates
                    </Button>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Button
                      component={Link}
                      href="/founder-test"
                      variant="outlined"
                      size="large"
                      startIcon={<PlayIcon />}
                      sx={{
                        px: 4,
                        py: 1.875,
                        fontSize: "1rem",
                        fontWeight: 600,
                        borderRadius: "14px",
                        color: "rgba(255,255,255,0.85)",
                        borderColor: "rgba(255,255,255,0.2)",
                        borderWidth: "1.5px",
                        "&:hover": {
                          borderColor: "rgba(255,255,255,0.4)",
                          backgroundColor: "rgba(255,255,255,0.06)",
                        },
                      }}
                    >
                      Take Founder Test
                    </Button>
                  </motion.div>
                </Box>
              </motion.div>
            </motion.div>
          </Grid>

          {/* Right — Floating Dashboard */}
          <Grid size={{ xs: 12, lg: 6 }}>
            <Box
              sx={{
                position: "relative",
                height: { xs: 360, md: 500 },
                display: { xs: "none", md: "block" },
              }}
            >
              {/* Central card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: 0.3,
                  duration: 0.7,
                  ease: [0.16, 1, 0.3, 1],
                }}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%,-50%)",
                  width: "70%",
                }}
              >
                <GlassCard
                  intensity="medium"
                  sx={{
                    p: 3,
                    background: "rgba(255,255,255,0.07)",
                    border: "1px solid rgba(255,255,255,0.14)",
                  }}
                >
                  <Typography
                    variant="overline"
                    sx={{
                      color: "rgba(255,255,255,0.4)",
                      mb: 2,
                      display: "block",
                      letterSpacing: "0.1em",
                    }}
                  >
                    Financial Health Score
                  </Typography>

                  {/* Score bars */}
                  {[
                    {
                      label: "Cash Flow",
                      pct: 82,
                      color: colorTokens.success.main,
                    },
                    {
                      label: "Profitability",
                      pct: 68,
                      color: colorTokens.financeBlue[400],
                    },
                    { label: "Growth Rate", pct: 91, color: "#A78BFA" },
                    {
                      label: "Risk Score",
                      pct: 54,
                      color: colorTokens.warning.main,
                    },
                  ].map((bar, i) => (
                    <Box key={bar.label} sx={{ mb: 1.75 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 0.5,
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            color: "rgba(255,255,255,0.65)",
                            fontWeight: 500,
                          }}
                        >
                          {bar.label}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: bar.color,
                            fontWeight: 700,
                            fontFamily: "var(--font-display)",
                          }}
                        >
                          {bar.pct}%
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          height: 6,
                          borderRadius: "999px",
                          backgroundColor: "rgba(255,255,255,0.08)",
                          overflow: "hidden",
                        }}
                      >
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${bar.pct}%` }}
                          transition={{
                            delay: 0.5 + i * 0.12,
                            duration: 0.8,
                            ease: "easeOut",
                          }}
                          style={{
                            height: "100%",
                            backgroundColor: bar.color,
                            borderRadius: "999px",
                          }}
                        />
                      </Box>
                    </Box>
                  ))}
                </GlassCard>
              </motion.div>

              {/* Floating metric cards */}
              {FLOATING_CARDS.map((card) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    delay: card.delay,
                    duration: 0.5,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  style={{
                    position: "absolute",
                    top: card.top as string | undefined,
                    bottom: card.bottom as string | undefined,
                    right:
                      typeof card.right === "string" ? card.right : undefined,
                    left: typeof card.left === "string" ? card.left : undefined,
                  }}
                >
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{
                      duration: 3 + Math.random() * 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: Math.random() * 2,
                    }}
                  >
                    <GlassCard
                      intensity="high"
                      sx={{
                        px: 2.5,
                        py: 1.75,
                        minWidth: 160,
                        background: "rgba(255,255,255,0.1)",
                        border: `1px solid ${card.color}33`,
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          color: "rgba(255,255,255,0.5)",
                          display: "block",
                          mb: 0.25,
                        }}
                      >
                        {card.label}
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: "var(--font-display)",
                          fontWeight: 800,
                          fontSize: "1.25rem",
                          color: card.color,
                          lineHeight: 1.2,
                          letterSpacing: "-0.02em",
                        }}
                      >
                        {card.value}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: "rgba(255,255,255,0.35)",
                          mt: 0.25,
                          display: "block",
                        }}
                      >
                        {card.sub}
                      </Typography>
                    </GlassCard>
                  </motion.div>
                </motion.div>
              ))}
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Scroll indicator */}
      <motion.div
        style={{
          position: "absolute",
          bottom: 32,
          left: "50%",
          translateX: "-50%",
          opacity: opacityFade,
        }}
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 0.75,
          }}
        >
          <Typography
            variant="caption"
            sx={{ color: "rgba(255,255,255,0.3)", letterSpacing: "0.08em" }}
          >
            Scroll to explore
          </Typography>
          <Box
            sx={{
              width: 24,
              height: 38,
              borderRadius: "12px",
              border: "1.5px solid rgba(255,255,255,0.2)",
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "center",
              pt: 0.75,
            }}
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                width: 4,
                height: 8,
                borderRadius: "2px",
                backgroundColor: "rgba(255,255,255,0.4)",
              }}
            />
          </Box>
        </Box>
      </motion.div>
    </Box>
  );
}
