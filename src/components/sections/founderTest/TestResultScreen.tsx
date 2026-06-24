"use client";

import { useState, useRef } from "react";
import { Box, Container, Typography } from "@mui/material";
import {
  ArrowForward as ArrowIcon,
  Download as DownloadIcon,
} from "@mui/icons-material";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import { motion, useInView } from "framer-motion";
import type { TestResult } from "@/lib/hooks/useFounderTestEngine";
import { generateFounderTestPdf } from "@/lib/generateFounderTestPdf";
import { notifyLead } from "@/lib/notifyLead";
import Link from "next/link";

/* ── Tokens ─────────────────────────────────────── */
const T = {
  darkBg: "#0D1B2E",
  darkGlow1: "rgba(99,102,241,0.14)",
  darkGlow2: "rgba(236,72,153,0.08)",
  darkBorder: "rgba(255,255,255,0.08)",
  darkMuted: "rgba(255,255,255,0.50)",
  darkFaint: "rgba(255,255,255,0.22)",
  white: "#FFFFFF",
  bg: "#F7F8FA",
  ink: "#0A0A0F",
  inkMid: "#1E293B",
  inkMuted: "#5A6478",
  inkFaint: "#A0A0AE",
  border: "rgba(10,10,20,0.08)",
  blue: "#1D4ED8",
  grad: "linear-gradient(115deg, #818CF8, #A855F7, #EC4899)",
  btn: "linear-gradient(115deg, #7C3AED, #EC4899)",
  btnShadow: "0 6px 24px rgba(124,58,237,0.32)",
  green: "#059669",
  amber: "#D97706",
  red: "#DC2626",
};
const SANS = '"DM Sans", system-ui, sans-serif';
const MONO = '"DM Mono", ui-monospace, monospace';
const EASE = [0.16, 1, 0.3, 1] as const;

/* ── Score ring ─────────────────────────────────── */
function ScoreRing({ score, max }: { score: number; max: number }) {
  const pct = score / max;
  const r = 54;
  const circ = 2 * Math.PI * r;
  const dash = circ * pct;
  return (
    <Box sx={{ position: "relative", width: 136, height: 136 }}>
      <svg width="136" height="136" style={{ transform: "rotate(-90deg)" }}>
        <defs>
          <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#818CF8" />
            <stop offset="50%" stopColor="#A855F7" />
            <stop offset="100%" stopColor="#EC4899" />
          </linearGradient>
        </defs>
        <circle
          cx="68"
          cy="68"
          r={r}
          fill="none"
          stroke={T.darkBorder}
          strokeWidth="8"
        />
        <motion.circle
          cx="68"
          cy="68"
          r={r}
          fill="none"
          stroke="url(#ringGrad)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${circ}`}
          strokeDashoffset={circ}
          animate={{ strokeDashoffset: circ - dash }}
          transition={{ duration: 1.4, delay: 0.3, ease: EASE }}
        />
      </svg>
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          sx={{
            fontFamily: MONO,
            fontWeight: 800,
            fontSize: "1.875rem",
            color: T.white,
            lineHeight: 1,
            letterSpacing: "-0.03em",
          }}
        >
          {score}
        </Typography>
        <Typography
          sx={{
            fontFamily: MONO,
            fontSize: "0.5rem",
            color: T.darkFaint,
            letterSpacing: "0.1em",
          }}
        >
          / {max}
        </Typography>
      </Box>
    </Box>
  );
}

/* ── Section wrapper ────────────────────────────── */
function Section({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const ref = useRef(null);
  const vis = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={vis ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.5, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/* ── Card ───────────────────────────────────────── */
function Card({
  children,
  sx = {},
}: {
  children: React.ReactNode;
  sx?: object;
}) {
  return (
    <Box
      sx={{
        background: T.white,
        borderRadius: "10px",
        border: `1px solid ${T.border}`,
        p: { xs: 2.5, md: 3 },
        boxShadow: "0 2px 12px rgba(10,10,20,0.05)",
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}

/* ── Card heading ───────────────────────────────── */
function CardHead({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, mb: 2.25 }}>
      <Box
        sx={{
          width: "2px",
          height: 13,
          borderRadius: "2px",
          background: T.grad,
        }}
      />
      <Typography
        sx={{
          fontFamily: MONO,
          fontSize: "0.5rem",
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

/* ── Score bar color helper ─────────────────────── */
function barColor(pct: number) {
  if (pct < 50) return T.red;
  if (pct < 70) return T.amber;
  return T.green;
}

/* ── Main ────────────────────────────────────────── */
interface Props {
  result: TestResult;
  contact: {
    name: string;
    email: string;
    company?: string;
    role?: string;
  } | null;
}

export function TestResultsScreen({ result, contact }: Props) {
  const [pdfState, setPdfState] = useState<"idle" | "generating" | "done">(
    "idle",
  );

  const radarData = result.scores.map((s) => ({
    subject: s.label,
    score: s.percentage,
    fullMark: 100,
  }));

  const strongScores = [...result.scores].sort(
    (a, b) => a.percentage - b.percentage,
  );

  /* ── PDF download handler ───────────────────── */
  const handleDownloadPdf = async () => {
    if (pdfState === "generating") return;
    setPdfState("generating");
    try {
      // Notify owner that this lead exported their PDF (fire-and-forget)
      if (contact) {
        notifyLead("pdf_export", contact, result);
      }
      // Small tick so the "Generating…" state actually renders before the
      // synchronous jsPDF work blocks the main thread
      await new Promise((r) => setTimeout(r, 60));
      generateFounderTestPdf(result, contact);
      setPdfState("done");
      // Reset button label after 3 s so they can re-download if needed
      setTimeout(() => setPdfState("idle"), 3000);
    } catch (err) {
      console.error("[TestResultsScreen] PDF generation failed:", err);
      setPdfState("idle");
    }
  };

  const pdfLabel =
    pdfState === "generating"
      ? "Generating…"
      : pdfState === "done"
        ? "Downloaded ✓"
        : "Download PDF — Free";

  return (
    <Box sx={{ minHeight: "100vh", background: T.bg, fontFamily: SANS }}>
      {/* ── HERO ── */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", lg: "row" },
          minHeight: { lg: "80vh" },
        }}
      >
        {/* Dark left */}
        <Box
          sx={{
            flex: "0 0 44%",
            background: T.darkBg,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            p: { xs: "56px 28px", md: "72px 56px" },
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              background: `radial-gradient(ellipse 65% 55% at 10% 40%, ${T.darkGlow1}, transparent),
                         radial-gradient(ellipse 50% 45% at 90% 70%, ${T.darkGlow2}, transparent)`,
            }}
          />
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              opacity: 0.03,
              backgroundImage: `linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)`,
              backgroundSize: "48px 48px",
            }}
          />

          <Box sx={{ position: "relative", zIndex: 1 }}>
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 180,
                damping: 18,
                delay: 0.1,
              }}
            >
              <Box sx={{ mb: 3.5 }}>
                <ScoreRing score={result.totalScore} max={result.totalMax} />
              </Box>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.55, ease: EASE }}
            >
              {contact?.name && (
                <Typography
                  sx={{
                    fontFamily: MONO,
                    fontSize: "0.54rem",
                    letterSpacing: "0.18em",
                    color: "#A5B4FC",
                    textTransform: "uppercase",
                    mb: 1,
                  }}
                >
                  {contact.name}'s Results
                </Typography>
              )}
              <Typography
                sx={{
                  fontFamily: SANS,
                  fontWeight: 800,
                  fontSize: { xs: "1.75rem", md: "2.5rem" },
                  color: T.white,
                  letterSpacing: "-0.03em",
                  lineHeight: 1.05,
                  mb: 0.5,
                }}
              >
                {result.personalityTitle}
              </Typography>
              <Typography
                sx={{
                  fontFamily: SANS,
                  fontSize: "0.9375rem",
                  color: T.darkMuted,
                  lineHeight: 1.75,
                  mb: 3,
                }}
              >
                {result.personalityDescription}
              </Typography>
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 0.875,
                  px: 2,
                  py: 0.875,
                  borderRadius: "100px",
                  background: `${result.personalityColor}18`,
                  border: `1px solid ${result.personalityColor}35`,
                }}
              >
                <Typography sx={{ fontSize: "0.875rem" }}>
                  {result.personalityBadge}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: MONO,
                    fontSize: "0.52rem",
                    letterSpacing: "0.12em",
                    color: result.personalityColor,
                    textTransform: "uppercase",
                  }}
                >
                  Score: {result.totalScore} / {result.totalMax}
                </Typography>
              </Box>
            </motion.div>
          </Box>
        </Box>

        {/* Light right — radar */}
        <Box
          sx={{
            flex: 1,
            background: T.white,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: { xs: "40px 24px", md: "56px 56px" },
            borderLeft: { lg: `1px solid ${T.border}` },
          }}
        >
          <Box sx={{ width: "100%", maxWidth: 420 }}>
            <Section delay={0.3}>
              <CardHead>Dimension Radar</CardHead>
              <ResponsiveContainer width="100%" height={280}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke={T.border} />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fill: T.inkFaint, fontSize: 10, fontFamily: MONO }}
                  />
                  <PolarRadiusAxis
                    angle={30}
                    domain={[0, 100]}
                    tick={{ fill: T.inkFaint, fontSize: 9 }}
                  />
                  <Radar
                    name="Score"
                    dataKey="score"
                    stroke={T.blue}
                    fill={T.blue}
                    fillOpacity={0.1}
                    strokeWidth={1.5}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </Section>
          </Box>
        </Box>
      </Box>

      {/* ── CONTENT ── */}
      <Container maxWidth="xl" sx={{ py: { xs: 5, md: 7 } }}>
        {/* Founder message */}
        <Section delay={0.05}>
          <Box
            sx={{
              mb: 3,
              p: { xs: 2.5, md: 3.5 },
              borderRadius: "10px",
              background: T.white,
              border: `1px solid ${T.border}`,
              borderLeft: "3px solid",
              borderLeftColor: result.personalityColor,
              boxShadow: "0 2px 12px rgba(10,10,20,0.05)",
            }}
          >
            <Typography
              sx={{
                fontFamily: MONO,
                fontSize: "0.5rem",
                letterSpacing: "0.16em",
                color: T.inkFaint,
                textTransform: "uppercase",
                mb: 1.25,
              }}
            >
              Message for you
            </Typography>
            <Typography
              sx={{
                fontFamily: SANS,
                fontSize: "0.9375rem",
                color: T.inkMid,
                lineHeight: 1.8,
              }}
            >
              {result.message}
            </Typography>
          </Box>
        </Section>

        {/* ── WEAKNESSES ── */}
        <Section delay={0.1}>
          <Box
            sx={{
              mb: 3,
              borderRadius: "12px",
              background: T.white,
              border: `1px solid ${T.border}`,
              borderTop: `3px solid ${T.red}`,
              boxShadow: "0 2px 12px rgba(10,10,20,0.05)",
              p: { xs: 2.5, md: 4 },
            }}
          >
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 0.75 }}
            >
              <Box
                sx={{
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  background: "rgba(220,38,38,0.1)",
                  border: `1px solid rgba(220,38,38,0.22)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Box
                  sx={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: T.red,
                  }}
                />
              </Box>
              <Typography
                sx={{
                  fontFamily: SANS,
                  fontWeight: 700,
                  fontSize: { xs: "1rem", md: "1.25rem" },
                  color: T.ink,
                  letterSpacing: "-0.01em",
                }}
              >
                Where you're losing ground
              </Typography>
            </Box>
            <Typography
              sx={{
                fontFamily: SANS,
                fontSize: "0.875rem",
                color: T.inkMuted,
                mb: 3,
                ml: "38px",
                lineHeight: 1.6,
              }}
            >
              These are the areas holding your business back the most. Fix these
              before anything else.
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "1fr 1fr",
                  md: "1fr 1fr 1fr",
                },
                gap: 1.5,
              }}
            >
              {result.riskAreas.map((r, i) => (
                <Box
                  key={i}
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 1.25,
                    p: "14px 16px",
                    borderRadius: "8px",
                    background: "rgba(220,38,38,0.04)",
                    border: `1px solid rgba(220,38,38,0.14)`,
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: MONO,
                      fontSize: "0.58rem",
                      fontWeight: 700,
                      color: T.red,
                      background: "rgba(220,38,38,0.1)",
                      border: `1px solid rgba(220,38,38,0.2)`,
                      borderRadius: "4px",
                      px: "6px",
                      py: "2px",
                      flexShrink: 0,
                      mt: "1px",
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: SANS,
                      fontSize: "0.875rem",
                      color: "#7F1D1D",
                      lineHeight: 1.55,
                    }}
                  >
                    {r}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Section>

        {/* ── 3-col grid ── */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr 1fr" },
            gap: 2.5,
            mb: 2.5,
          }}
        >
          {/* Score bars */}
          <Section delay={0.15}>
            <Card>
              <CardHead>Section Scores</CardHead>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {strongScores.map((s, i) => {
                  const color = barColor(s.percentage);
                  return (
                    <Box key={s.dimension}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 0.5,
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
                          {s.label}
                        </Typography>
                        <Typography
                          sx={{
                            fontFamily: MONO,
                            fontSize: "0.7rem",
                            color,
                            fontWeight: 700,
                          }}
                        >
                          {s.percentage}%
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          height: 5,
                          borderRadius: "3px",
                          background: T.bg,
                          overflow: "hidden",
                        }}
                      >
                        <motion.div
                          initial={{ width: "0%" }}
                          animate={{ width: `${s.percentage}%` }}
                          transition={{
                            delay: 0.3 + i * 0.1,
                            duration: 0.75,
                            ease: EASE,
                          }}
                          style={{
                            height: "100%",
                            background: `linear-gradient(90deg,${color}70,${color})`,
                            borderRadius: "3px",
                          }}
                        />
                      </Box>
                      <Typography
                        sx={{
                          fontFamily: SANS,
                          fontSize: "0.65rem",
                          color: T.inkFaint,
                          mt: 0.4,
                        }}
                      >
                        {result.sectionFeedback[s.dimension]}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            </Card>
          </Section>

          {/* Strengths */}
          <Section delay={0.2}>
            <Card>
              <CardHead>What you're doing right</CardHead>
              <Typography
                sx={{
                  fontFamily: SANS,
                  fontSize: "0.75rem",
                  color: T.inkFaint,
                  fontStyle: "italic",
                  mb: 2,
                  lineHeight: 1.5,
                }}
              >
                You have real strengths — but don't let them mask the risks
                above.
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                {result.strengths.map((s, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.07, duration: 0.3 }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 1.25,
                      }}
                    >
                      <Box
                        sx={{
                          width: 16,
                          height: 16,
                          borderRadius: "50%",
                          flexShrink: 0,
                          mt: "1px",
                          background: `${T.green}10`,
                          border: `1px solid ${T.green}28`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Typography
                          sx={{
                            fontFamily: MONO,
                            fontSize: "0.45rem",
                            color: T.green,
                          }}
                        >
                          ✓
                        </Typography>
                      </Box>
                      <Typography
                        sx={{
                          fontFamily: SANS,
                          fontSize: "0.875rem",
                          color: T.inkMuted,
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

          {/* Immediate actions */}
          <Section delay={0.25}>
            <Card>
              <CardHead>Immediate Actions</CardHead>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                {result.growthSuggestions.map((s, i) => (
                  <Box
                    key={i}
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 1.25,
                    }}
                  >
                    <Box
                      sx={{
                        width: 20,
                        height: 20,
                        borderRadius: "50%",
                        flexShrink: 0,
                        mt: "1px",
                        background: "rgba(29,78,216,0.08)",
                        border: `1px solid rgba(29,78,216,0.2)`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: MONO,
                          fontSize: "0.52rem",
                          color: T.blue,
                          fontWeight: 700,
                        }}
                      >
                        {i + 1}
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
                ))}
              </Box>
            </Card>
          </Section>
        </Box>

        {/* ── PDF DOWNLOAD STRIP ── */}
        <Section delay={0.3}>
          <Box
            sx={{
              background: T.darkBg,
              borderRadius: "14px",
              p: { xs: 3, md: 4 },
              mb: 3,
              position: "relative",
              overflow: "hidden",
              border: `1px solid rgba(129,140,248,0.2)`,
              boxShadow:
                "0 0 0 1px rgba(129,140,248,0.08), 0 24px 64px rgba(13,27,46,0.4)",
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: { md: "center" },
              justifyContent: "space-between",
              gap: 3,
            }}
          >
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                background: `radial-gradient(ellipse 55% 60% at 80% 20%, ${T.darkGlow1}, transparent)`,
              }}
            />
            <Box sx={{ position: "relative", zIndex: 1 }}>
              <Typography
                sx={{
                  fontFamily: MONO,
                  fontSize: "0.54rem",
                  letterSpacing: "0.18em",
                  color: "#A5B4FC",
                  textTransform: "uppercase",
                  mb: 1,
                }}
              >
                Free Download
              </Typography>
              <Typography
                sx={{
                  fontFamily: SANS,
                  fontWeight: 700,
                  fontSize: { xs: "1.25rem", md: "1.5rem" },
                  color: T.white,
                  letterSpacing: "-0.02em",
                  lineHeight: 1.15,
                  mb: 0.75,
                }}
              >
                Get your full results as a PDF
              </Typography>
              <Typography
                sx={{
                  fontFamily: SANS,
                  fontSize: "0.875rem",
                  color: T.darkMuted,
                  lineHeight: 1.6,
                }}
              >
                Section scores · Weakness analysis · Action plan — all in one
                shareable document.
              </Typography>
            </Box>
            <motion.div
              whileHover={pdfState === "generating" ? {} : { scale: 1.03 }}
              whileTap={pdfState === "generating" ? {} : { scale: 0.97 }}
              style={{ flexShrink: 0, position: "relative", zIndex: 1 }}
            >
              <Box
                onClick={handleDownloadPdf}
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 1.25,
                  px: 3,
                  py: "14px",
                  borderRadius: "10px",
                  background: pdfState === "done" ? T.green : T.btn,
                  textDecoration: "none",
                  cursor: pdfState === "generating" ? "wait" : "pointer",
                  boxShadow: T.btnShadow,
                  whiteSpace: "nowrap",
                  opacity: pdfState === "generating" ? 0.8 : 1,
                  transition: "background 0.25s, opacity 0.2s",
                }}
              >
                {pdfState === "generating" ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 0.9,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: "50%",
                      border: "2px solid rgba(255,255,255,0.3)",
                      borderTopColor: "#fff",
                    }}
                  />
                ) : (
                  <DownloadIcon sx={{ fontSize: "1rem", color: T.white }} />
                )}
                <Typography
                  sx={{
                    fontFamily: SANS,
                    fontWeight: 700,
                    fontSize: "0.9375rem",
                    color: T.white,
                  }}
                >
                  {pdfLabel}
                </Typography>
              </Box>
            </motion.div>
          </Box>
        </Section>

        {/* ── TEMPLATES UPSELL ── */}
        <Section delay={0.36}>
          <Box
            sx={{
              background: T.white,
              borderRadius: "10px",
              border: `1px solid ${T.border}`,
              p: { xs: 3, md: 4 },
              mb: 3,
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: { md: "center" },
              justifyContent: "space-between",
              gap: 3,
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontFamily: MONO,
                  fontSize: "0.5rem",
                  letterSpacing: "0.16em",
                  color: T.inkFaint,
                  textTransform: "uppercase",
                  mb: 1,
                }}
              >
                While you're here
              </Typography>
              <Typography
                sx={{
                  fontFamily: SANS,
                  fontWeight: 700,
                  fontSize: "1.125rem",
                  color: T.ink,
                  letterSpacing: "-0.02em",
                  mb: 0.5,
                }}
              >
                The exact templates top founders use to track finances
              </Typography>
              <Typography
                sx={{
                  fontFamily: SANS,
                  fontSize: "0.875rem",
                  color: T.inkMuted,
                  lineHeight: 1.6,
                }}
              >
                Burn rate tracker · Cash runway model · Break-even calculator ·
                Investor-ready P&L — all pre-built.
              </Typography>
            </Box>
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              style={{ flexShrink: 0 }}
            >
              <Box
                component={Link}
                href="/templates"
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 1.25,
                  px: 2.5,
                  py: "12px",
                  borderRadius: "8px",
                  background: T.btn,
                  textDecoration: "none",
                  boxShadow: T.btnShadow,
                  whiteSpace: "nowrap",
                }}
              >
                <Typography
                  sx={{
                    fontFamily: SANS,
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    color: T.white,
                  }}
                >
                  See All Templates
                </Typography>
                <ArrowIcon sx={{ fontSize: "0.9rem", color: T.white }} />
              </Box>
            </motion.div>
          </Box>
        </Section>

        {/* ── CONSULTATION CTA ── */}
        <Section delay={0.42}>
          <Box
            sx={{
              background: T.darkBg,
              borderRadius: "12px",
              p: { xs: 3.5, md: 5 },
              position: "relative",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                background: `radial-gradient(ellipse 55% 65% at 90% 30%, ${T.darkGlow1}, transparent), radial-gradient(ellipse 40% 50% at 10% 80%, ${T.darkGlow2}, transparent)`,
              }}
            />
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                opacity: 0.03,
                backgroundImage: `linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)`,
                backgroundSize: "48px 48px",
              }}
            />
            <Box sx={{ position: "relative", zIndex: 1, maxWidth: 520 }}>
              <Typography
                sx={{
                  fontFamily: MONO,
                  fontSize: "0.54rem",
                  letterSpacing: "0.18em",
                  color: "#A5B4FC",
                  textTransform: "uppercase",
                  mb: 2,
                }}
              >
                Free 30-min call
              </Typography>
              <Typography
                sx={{
                  fontFamily: SANS,
                  fontWeight: 800,
                  fontSize: { xs: "1.5rem", md: "2rem" },
                  color: T.white,
                  letterSpacing: "-0.03em",
                  lineHeight: 1.05,
                  mb: 0.5,
                }}
              >
                Let's fix your
              </Typography>
              <Typography
                sx={{
                  fontFamily: SANS,
                  fontWeight: 800,
                  fontSize: { xs: "1.5rem", md: "2rem" },
                  letterSpacing: "-0.03em",
                  lineHeight: 1.05,
                  mb: 2,
                  background: T.grad,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                financial blind spots — together.
              </Typography>
              <Typography
                sx={{
                  fontFamily: SANS,
                  fontSize: "0.9rem",
                  color: T.darkMuted,
                  lineHeight: 1.75,
                  mb: 3.5,
                  maxWidth: 420,
                }}
              >
                Book a free 30-minute session with our team. We'll review your
                score and give you a personalised roadmap — no sales pitch.
              </Typography>
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                style={{ display: "inline-block" }}
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
                    borderRadius: "9px",
                    background: T.btn,
                    textDecoration: "none",
                    boxShadow: T.btnShadow,
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: SANS,
                      fontWeight: 700,
                      fontSize: "0.9375rem",
                      color: T.white,
                    }}
                  >
                    Book Free Consultation
                  </Typography>
                  <ArrowIcon sx={{ fontSize: "0.9rem", color: T.white }} />
                </Box>
              </motion.div>
            </Box>
          </Box>
        </Section>
      </Container>
    </Box>
  );
}
