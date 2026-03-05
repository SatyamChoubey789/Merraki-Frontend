"use client";

import { Box, Container, Typography } from "@mui/material";
import { CalendarMonth as CalendlyIcon, GridView as TemplatesIcon } from "@mui/icons-material";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import Link from "next/link";
import { useTestResult } from "@/lib/hooks/useFounderTest";
import type { PersonalityType } from "@/types/test.types";

const T = {
  darkBg:    "#0D1B2E",
  darkGlow1: "rgba(99,102,241,0.14)",
  darkGlow2: "rgba(236,72,153,0.08)",
  darkBorder:"rgba(255,255,255,0.08)",
  darkMuted: "rgba(255,255,255,0.50)",
  darkFaint: "rgba(255,255,255,0.22)",
  white:     "#FFFFFF",
  bg:        "#F7F8FA",
  ink:       "#0A0A0F",
  inkMid:    "#1E293B",
  inkMuted:  "#5A6478",
  inkFaint:  "#A0A0AE",
  border:    "rgba(10,10,20,0.08)",
  blue:      "#1D4ED8",
  blueLight: "#60A5FA",
  blueBdr:   "rgba(29,78,216,0.2)",
  grad:      "linear-gradient(115deg, #818CF8, #A855F7, #EC4899)",
  btn:       "linear-gradient(115deg, #7C3AED, #EC4899)",
  green:     "#059669",
  amber:     "#D97706",
};

const SANS = '"DM Sans", system-ui, sans-serif';
const MONO = '"DM Mono", ui-monospace, monospace';
const EASE = [0.16, 1, 0.3, 1] as const;

const P_CONFIG: Record<PersonalityType, { icon: string; accent: string; label: string }> = {
  strategic_visionary:  { icon: "◈", accent: "#1D4ED8", label: "Strategic Visionary"  },
  analytical_optimizer: { icon: "◆", accent: "#7C3AED", label: "Analytical Optimizer" },
  growth_accelerator:   { icon: "△", accent: "#059669", label: "Growth Accelerator"   },
  cautious_builder:     { icon: "○", accent: "#64748B", label: "Cautious Builder"      },
  dynamic_innovator:    { icon: "◇", accent: "#BE185D", label: "Dynamic Innovator"     },
};
const CHART_COLORS = ["#1D4ED8","#7C3AED","#059669","#64748B","#BE185D"];

function Section({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.5, ease: EASE }}>
      {children}
    </motion.div>
  );
}

function Card({ children, sx = {} }: { children: React.ReactNode; sx?: any }) {
  return (
    <Box sx={{ background: T.white, borderRadius: "10px", border: `1px solid ${T.border}`, p: { xs: 2.5, md: 3 }, boxShadow: "0 2px 12px rgba(10,10,20,0.05)", ...sx }}>
      {children}
    </Box>
  );
}

function CardHeading({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, mb: 2.5 }}>
      <Box sx={{ width: "2px", height: 13, borderRadius: "2px", background: T.grad }} />
      <Typography sx={{ fontFamily: MONO, fontSize: "0.5rem", letterSpacing: "0.16em", color: T.inkFaint, textTransform: "uppercase" }}>
        {children}
      </Typography>
    </Box>
  );
}

interface Props { testNumber: string; }

export function TestResultsClient({ testNumber }: Props) {
  const { data, isLoading, isError } = useTestResult(testNumber);
  const result = data?.data;

  if (isLoading) return (
    <Box sx={{ minHeight: "100vh", background: T.darkBg, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 2 }}>
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}>
        <Box sx={{ width: 40, height: 40, borderRadius: "50%", border: "2px solid transparent", borderTopColor: "#818CF8" }} />
      </motion.div>
      <Typography sx={{ fontFamily: SANS, fontSize: "0.875rem", color: T.darkMuted }}>Loading your results…</Typography>
    </Box>
  );

  if (isError || !result) return (
    <Box sx={{ minHeight: "100vh", background: T.darkBg, display: "flex", alignItems: "center", justifyContent: "center", p: 4 }}>
      <Box sx={{ textAlign: "center" }}>
        <Typography sx={{ fontFamily: SANS, fontWeight: 700, fontSize: "1.5rem", color: T.white, mb: 2 }}>Unable to load results.</Typography>
        <Box component="a" href="/founder-test" sx={{ display: "inline-flex", px: 3, py: 1.25, borderRadius: "8px", background: T.btn, textDecoration: "none", fontFamily: SANS, fontWeight: 600, fontSize: "0.875rem", color: T.white }}>
          Retake Test
        </Box>
      </Box>
    </Box>
  );

  const cfg = P_CONFIG[result.personalityType];
  const radarData = result.scores.map((s: any) => ({ subject: s.label, score: s.percentage, fullMark: 100 }));

  return (
    <Box sx={{ minHeight: "100vh", background: T.bg, fontFamily: SANS }}>

      {/* ── HERO: dark left + light right ── */}
      <Box sx={{ display: "flex", flexDirection: { xs: "column", lg: "row" }, minHeight: { lg: "85vh" } }}>

        {/* Left — dark */}
        <Box sx={{
          flex: "0 0 42%", background: T.darkBg,
          display: "flex", flexDirection: "column", justifyContent: "center",
          p: { xs: "56px 28px", md: "72px 56px" },
          position: "relative", overflow: "hidden",
        }}>
          <Box sx={{ position: "absolute", inset: 0, pointerEvents: "none",
            background: `radial-gradient(ellipse 65% 55% at 10% 40%, ${T.darkGlow1}, transparent),
                         radial-gradient(ellipse 50% 45% at 90% 70%, ${T.darkGlow2}, transparent)` }} />
          <Box sx={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.03,
            backgroundImage: `linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)`,
            backgroundSize: "48px 48px" }} />

          <Box sx={{ position: "relative", zIndex: 1 }}>
            {/* Icon badge */}
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 220, damping: 16, delay: 0.15 }}>
              <Box sx={{
                width: 64, height: 64, borderRadius: "14px", mb: 3.5,
                background: `${cfg.accent}18`, border: `1px solid ${cfg.accent}35`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Typography sx={{ fontFamily: MONO, fontSize: "1.75rem", color: cfg.accent, lineHeight: 1 }}>{cfg.icon}</Typography>
              </Box>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.55, ease: EASE }}>
              <Typography sx={{ fontFamily: MONO, fontSize: "0.54rem", letterSpacing: "0.2em", color: "#A5B4FC", textTransform: "uppercase", mb: 2 }}>
                Your Financial Personality
              </Typography>
              <Typography sx={{
                fontFamily: SANS, fontWeight: 800,
                fontSize: { xs: "1.875rem", md: "2.625rem" },
                color: T.white, letterSpacing: "-0.03em", lineHeight: 1.05, mb: 1,
              }}>
                {result.personalityTitle}
              </Typography>
              <Typography sx={{ fontFamily: SANS, fontSize: "0.9375rem", color: T.darkMuted, lineHeight: 1.75, mb: 4 }}>
                {result.personalityDescription}
              </Typography>

              {/* Top score pill */}
              <Box sx={{
                display: "inline-flex", alignItems: "center", gap: 0.75,
                px: 2, py: 0.875, borderRadius: "100px",
                background: `${cfg.accent}18`, border: `1px solid ${cfg.accent}30`,
              }}>
                <Box sx={{ width: 6, height: 6, borderRadius: "50%", background: cfg.accent }} />
                <Typography sx={{ fontFamily: MONO, fontSize: "0.56rem", letterSpacing: "0.12em", color: cfg.accent, textTransform: "uppercase" }}>
                  {cfg.label}
                </Typography>
              </Box>
            </motion.div>
          </Box>
        </Box>

        {/* Right — radar chart on light bg */}
        <Box sx={{
          flex: 1, background: T.white,
          display: "flex", alignItems: "center", justifyContent: "center",
          p: { xs: "40px 24px", md: "56px 56px" },
          borderLeft: { lg: `1px solid ${T.border}` },
        }}>
          <Box sx={{ width: "100%", maxWidth: 420 }}>
            <Section delay={0.3}>
              <CardHeading>Dimension Overview</CardHeading>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke={T.border} />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: T.inkFaint, fontSize: 10, fontFamily: MONO }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: T.inkFaint, fontSize: 9 }} />
                  <Radar name="Score" dataKey="score" stroke={T.blue} fill={T.blue} fillOpacity={0.1} strokeWidth={1.5} />
                </RadarChart>
              </ResponsiveContainer>
            </Section>
          </Box>
        </Box>
      </Box>

      {/* ── CONTENT ── */}
      <Container maxWidth="xl" sx={{ py: { xs: 5, md: 7 } }}>

        {/* 3-col grid */}
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr 1fr" }, gap: 2.5, mb: 2.5 }}>

          {/* Score bars */}
          <Section delay={0.1}>
            <Card>
              <CardHeading>Score Breakdown</CardHeading>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {result.scores.map((score: any, i: number) => (
                  <Box key={score.dimension}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.625 }}>
                      <Typography sx={{ fontFamily: SANS, fontSize: "0.8125rem", color: T.inkMid, fontWeight: 500 }}>{score.label}</Typography>
                      <Typography sx={{ fontFamily: MONO, fontSize: "0.7rem", color: CHART_COLORS[i % CHART_COLORS.length], fontWeight: 600 }}>{score.percentage}%</Typography>
                    </Box>
                    <Box sx={{ height: 5, borderRadius: "3px", background: T.bg, overflow: "hidden" }}>
                      <motion.div initial={{ width: "0%" }} animate={{ width: `${score.percentage}%` }}
                        transition={{ delay: 0.2 + i * 0.1, duration: 0.75, ease: EASE }}
                        style={{ height: "100%", background: `linear-gradient(90deg,${CHART_COLORS[i % CHART_COLORS.length]}70,${CHART_COLORS[i % CHART_COLORS.length]})`, borderRadius: "3px" }} />
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
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                {result.strengths.map((s: string, i: number) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.07, duration: 0.3 }}>
                    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.25 }}>
                      <Box sx={{ width: 16, height: 16, borderRadius: "50%", flexShrink: 0, mt: "1px", background: `${T.green}10`, border: `1px solid ${T.green}28`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Typography sx={{ fontFamily: MONO, fontSize: "0.45rem", color: T.green }}>✓</Typography>
                      </Box>
                      <Typography sx={{ fontFamily: SANS, fontSize: "0.875rem", color: T.inkMid, lineHeight: 1.6 }}>{s}</Typography>
                    </Box>
                  </motion.div>
                ))}
              </Box>
            </Card>
          </Section>

          {/* Growth */}
          <Section delay={0.26}>
            <Card>
              <CardHeading>Growth Actions</CardHeading>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                {result.growthSuggestions.map((s: string, i: number) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.07, duration: 0.3 }}>
                    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.25 }}>
                      <Box sx={{ width: 16, height: 16, borderRadius: "50%", flexShrink: 0, mt: "1px", background: `${T.blue}10`, border: `1px solid ${T.blue}28`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Typography sx={{ fontFamily: MONO, fontSize: "0.45rem", color: T.blue }}>△</Typography>
                      </Box>
                      <Typography sx={{ fontFamily: SANS, fontSize: "0.875rem", color: T.inkMid, lineHeight: 1.6 }}>{s}</Typography>
                    </Box>
                  </motion.div>
                ))}
              </Box>
            </Card>
          </Section>
        </Box>

        {/* Risk areas */}
        <Section delay={0.32}>
          <Card sx={{ mb: 2.5 }}>
            <CardHeading>Watch Out For</CardHeading>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" }, gap: 1.5 }}>
              {result.riskAreas.map((r: string, i: number) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.06, duration: 0.3 }}>
                  <Box sx={{ p: 1.75, borderRadius: "8px", background: T.bg, border: `1px solid ${T.border}`, display: "flex", alignItems: "flex-start", gap: 1.25 }}>
                    <Box sx={{ width: 16, height: 16, borderRadius: "50%", flexShrink: 0, mt: "1px", background: `${T.amber}12`, border: `1px solid ${T.amber}30`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Typography sx={{ fontFamily: MONO, fontSize: "0.45rem", color: T.amber }}>!</Typography>
                    </Box>
                    <Typography sx={{ fontFamily: SANS, fontSize: "0.875rem", color: T.inkMid, lineHeight: 1.55 }}>{r}</Typography>
                  </Box>
                </motion.div>
              ))}
            </Box>
          </Card>
        </Section>

        {/* CTA — dark block */}
        <Section delay={0.4}>
          <Box sx={{
            background: T.darkBg, borderRadius: "12px",
            p: { xs: 3.5, md: 6 }, position: "relative", overflow: "hidden",
          }}>
            <Box sx={{ position: "absolute", inset: 0, pointerEvents: "none",
              background: `radial-gradient(ellipse 55% 65% at 90% 30%, ${T.darkGlow1}, transparent),
                           radial-gradient(ellipse 40% 50% at 10% 80%, ${T.darkGlow2}, transparent)` }} />
            <Box sx={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.03,
              backgroundImage: `linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)`,
              backgroundSize: "48px 48px" }} />

            <Box sx={{ position: "relative", zIndex: 1, maxWidth: 560 }}>
              <Typography sx={{ fontFamily: MONO, fontSize: "0.54rem", letterSpacing: "0.18em", color: "#A5B4FC", textTransform: "uppercase", mb: 2 }}>
                Next Steps
              </Typography>
              <Typography sx={{ fontFamily: SANS, fontWeight: 800, fontSize: { xs: "1.75rem", md: "2.375rem" }, color: T.white, letterSpacing: "-0.03em", lineHeight: 1.05, mb: 0.5 }}>
                Ready to act on
              </Typography>
              <Typography sx={{
                fontFamily: SANS, fontWeight: 800, fontSize: { xs: "1.75rem", md: "2.375rem" },
                letterSpacing: "-0.03em", lineHeight: 1.05, mb: 2,
                background: T.grad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              }}>
                your insights?
              </Typography>
              <Typography sx={{ fontFamily: SANS, fontSize: "0.9375rem", color: T.darkMuted, lineHeight: 1.75, mb: 4, maxWidth: 440 }}>
                Book a free 30-minute consultation with our team and build a financial roadmap tailored to your personality type.
              </Typography>

              <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Box component="a" href={process.env.NEXT_PUBLIC_CALENDLY_URL} target="_blank" rel="noopener noreferrer" sx={{
                    display: "inline-flex", alignItems: "center", gap: 1.25,
                    px: 2.5, py: "12px", borderRadius: "8px",
                    background: T.btn, textDecoration: "none",
                    boxShadow: "0 4px 20px rgba(124,58,237,0.3)", transition: "box-shadow 0.2s",
                  }}>
                    <CalendlyIcon sx={{ fontSize: "0.95rem", color: T.white }} />
                    <Typography sx={{ fontFamily: SANS, fontWeight: 700, fontSize: "0.9375rem", color: T.white }}>Book Free Consultation</Typography>
                  </Box>
                </motion.div>

                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Box component={Link} href="/templates" sx={{
                    display: "inline-flex", alignItems: "center", gap: 1.25,
                    px: 2.5, py: "12px", borderRadius: "8px",
                    border: `1px solid ${T.darkBorder}`, textDecoration: "none",
                    transition: "border-color 0.15s, background 0.15s",
                    "&:hover": { borderColor: "rgba(255,255,255,0.22)", background: "rgba(255,255,255,0.04)" },
                  }}>
                    <TemplatesIcon sx={{ fontSize: "0.95rem", color: T.darkMuted }} />
                    <Typography sx={{ fontFamily: SANS, fontWeight: 600, fontSize: "0.9375rem", color: T.darkMuted }}>Explore Templates</Typography>
                  </Box>
                </motion.div>
              </Box>

              <Typography sx={{ fontFamily: MONO, fontSize: "0.48rem", letterSpacing: "0.1em", color: T.darkFaint, mt: 3, textTransform: "uppercase" }}>
                PDF report sent to your inbox automatically
              </Typography>
            </Box>
          </Box>
        </Section>
      </Container>
    </Box>
  );
}