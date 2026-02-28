"use client";

import { Box, Container, Typography, Button, Grid } from "@mui/material";
import { ArrowForward as ArrowIcon } from "@mui/icons-material";
import { motion } from "framer-motion";
import Link from "next/link";
import { colorTokens } from "@/theme";
import { useInView } from "@/lib/hooks/useInView";

const PERSONALITY_TYPES = [
  {
    emoji: "🎯",
    type: "Strategic Visionary",
    color: colorTokens.financeBlue[400],
  },
  { emoji: "📊", type: "Analytical Optimizer", color: "#A78BFA" },
  { emoji: "🚀", type: "Growth Accelerator", color: colorTokens.success.main },
  { emoji: "🏗️", type: "Cautious Builder", color: colorTokens.warning.main },
  { emoji: "⚡", type: "Dynamic Innovator", color: "#F472B6" },
];

export function FounderTestCTA() {
  const { ref, inView } = useInView({ threshold: 0.2 });

  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        background: `linear-gradient(160deg, ${colorTokens.darkNavy[900]} 0%, #0C1F5C 100%)`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background: `
            radial-gradient(ellipse at 20% 50%, rgba(26,86,219,0.15) 0%, transparent 60%),
            radial-gradient(ellipse at 80% 50%, rgba(139,92,246,0.1) 0%, transparent 60%)
          `,
          pointerEvents: "none",
        }}
      />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <Grid
          container
          spacing={6}
          alignItems="center"
          ref={ref as React.RefObject<HTMLDivElement>}
        >
          <Grid size={{ xs: 12, md: 6 }}>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <Typography
                variant="overline"
                sx={{
                  color: "rgba(255,255,255,0.4)",
                  letterSpacing: "0.12em",
                  mb: 1.5,
                  display: "block",
                }}
              >
                Free 5-Minute Assessment
              </Typography>
              <Typography
                variant="h2"
                sx={{
                  color: "#fff",
                  fontWeight: 800,
                  mb: 2,
                  letterSpacing: "-0.025em",
                }}
              >
                Discover Your{" "}
                <Box
                  component="span"
                  sx={{
                    background: `linear-gradient(135deg, ${colorTokens.financeBlue[300]}, #A78BFA)`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Financial Personality
                </Box>
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "rgba(255,255,255,0.55)",
                  lineHeight: 1.8,
                  mb: 4,
                  maxWidth: 440,
                }}
              >
                Take our founder assessment and get a personalised report on
                your financial strengths, risk areas, and a custom growth
                playbook. Free, instant, and insightful.
              </Typography>
              <motion.div
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                <Button
                  component={Link}
                  href="/founder-test"
                  variant="contained"
                  size="large"
                  endIcon={<ArrowIcon />}
                  sx={{
                    px: 4,
                    py: 1.75,
                    fontWeight: 700,
                    borderRadius: "14px",
                    background: `linear-gradient(135deg, ${colorTokens.financeBlue[400]}, ${colorTokens.financeBlue[600]})`,
                    boxShadow: "0 8px 28px rgba(26,86,219,0.45)",
                    fontSize: "1rem",
                  }}
                >
                  Start Free Test
                </Button>
              </motion.div>
            </motion.div>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            >
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                {PERSONALITY_TYPES.map((p, i) => (
                  <motion.div
                    key={p.type}
                    initial={{ opacity: 0, x: 20 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.2 + i * 0.08, duration: 0.4 }}
                    whileHover={{ x: 6 }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        px: 3,
                        py: 2,
                        borderRadius: "14px",
                        backgroundColor: "rgba(255,255,255,0.06)",
                        border: `1px solid ${p.color}22`,
                        backdropFilter: "blur(8px)",
                        transition: "all 0.25s ease",
                        "&:hover": {
                          backgroundColor: "rgba(255,255,255,0.09)",
                          borderColor: `${p.color}44`,
                        },
                      }}
                    >
                      <Typography sx={{ fontSize: "1.5rem", lineHeight: 1 }}>
                        {p.emoji}
                      </Typography>
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#fff",
                            fontWeight: 600,
                            fontFamily: "var(--font-display)",
                          }}
                        >
                          {p.type}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          backgroundColor: p.color,
                          boxShadow: `0 0 8px ${p.color}`,
                        }}
                      />
                    </Box>
                  </motion.div>
                ))}
              </Box>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
