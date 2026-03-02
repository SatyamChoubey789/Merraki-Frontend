"use client";

import { useRef } from "react";
import { Box, Container, Typography, Button } from "@mui/material";
import {
  ArrowForward as ArrowIcon,
  CalendarMonth as CalIcon,
  TrendingUp as TrendingIcon,
  BarChart as ChartIcon,
  Description as DocIcon,
  Inventory as InventoryIcon,
  AccountBalance as FundIcon,
  TableChart as TableIcon,
} from "@mui/icons-material";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useInView } from "@/lib/hooks/useInView";

const T = {
  bg:        "#FFFFFF",
  bgSection: "#F5F7FB",
  bgCard:    "#FFFFFF",
  bgCardAlt: "#F9FAFB",
  ink:       "#0A0A0F",
  inkMid:    "#1E1E2A",
  inkMuted:  "#5A5A72",
  inkFaint:  "#9898AE",
  border:    "rgba(10,10,20,0.08)",
  borderMid: "rgba(10,10,20,0.14)",

  // ice-blue accent
  blue:      "#3B7BF6",
  blueMid:   "#5A92F8",
  blueLight: "#7AABFF",
  bluePale:  "#EDF3FF",
  blueGlow:  "rgba(59,123,246,0.10)",
  blueDim:   "rgba(59,123,246,0.06)",
  blueGrad:  "linear-gradient(135deg, #3B7BF6 0%, #7AABFF 100%)",
};

const SERIF = `"Instrument Serif", "Playfair Display", Georgia, serif`;
const SANS  = `"DM Sans", "Mona Sans", system-ui, sans-serif`;
const MONO  = `"DM Mono", "JetBrains Mono", monospace`;
const EASE  = [0.16, 1, 0.3, 1] as const;

/* ── Pill tag ── */
function Pill({ label }: { label: string }) {
  return (
    <Box sx={{
      display: "inline-flex", alignItems: "center",
      px: "12px", py: "5px", borderRadius: "20px",
      background: T.bluePale, border: `1px solid rgba(59,123,246,0.18)`,
      fontFamily: MONO, fontSize: "0.5rem", letterSpacing: "0.14em",
      color: T.blue, textTransform: "uppercase", whiteSpace: "nowrap",
    }}>
      {label}
    </Box>
  );
}

/* ── Section divider ── */
function SectionDivider({ label, inView, delay = 0 }: { label: string; inView: boolean; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.5, delay, ease: EASE }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 6 }}>
        <motion.div
          initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.55, delay: delay + 0.1, ease: EASE }}
          style={{ transformOrigin: "left", flex: 1 }}
        >
          <Box sx={{ height: "1px", background: T.border }} />
        </motion.div>
        <Pill label={label} />
        <motion.div
          initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.55, delay: delay + 0.15, ease: EASE }}
          style={{ transformOrigin: "right", flex: 1 }}
        >
          <Box sx={{ height: "1px", background: T.border }} />
        </motion.div>
      </Box>
    </motion.div>
  );
}

/* ── Solution chip ── */
function SolutionChip({ icon: Icon, label, delay, inView }: {
  icon: any; label: string; delay: number; inView: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.95 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.45, delay, ease: EASE }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
    >
      <Box sx={{
        display: "inline-flex", alignItems: "center", gap: 1,
        px: "14px", py: "9px", borderRadius: "10px",
        background: T.bgCard, border: `1px solid ${T.border}`,
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        transition: "all 0.2s ease", cursor: "default",
        "&:hover": {
          borderColor: `rgba(59,123,246,0.28)`,
          boxShadow: `0 4px 20px ${T.blueGlow}`,
          background: T.bluePale,
        },
      }}>
        <Box sx={{
          width: 26, height: 26, borderRadius: "7px",
          background: T.bluePale, border: `1px solid rgba(59,123,246,0.14)`,
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <Icon sx={{ fontSize: "0.85rem", color: T.blue }} />
        </Box>
        <Typography sx={{
          fontFamily: SANS, fontWeight: 500,
          fontSize: "0.8125rem", color: T.inkMid,
          letterSpacing: "-0.01em", whiteSpace: "nowrap",
        }}>
          {label}
        </Typography>
      </Box>
    </motion.div>
  );
}

/* ══ MAIN COMPONENT ══════════════════════════════════════ */
export function FinalCTA() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { ref: heroRef,      inView: heroInView      } = useInView({ threshold: 0.1 });
  const { ref: solutionsRef, inView: solutionsInView } = useInView({ threshold: 0.1 });
  const { ref: fundraiseRef, inView: fundraiseInView } = useInView({ threshold: 0.1 });
  const { ref: dataRef,      inView: dataInView      } = useInView({ threshold: 0.1 });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const yHeadline = useTransform(scrollYProgress, [0, 1], ["24px", "-24px"]);

  return (
    <Box
      ref={sectionRef}
      sx={{ background: T.bg, position: "relative", overflow: "hidden", borderTop: `1px solid ${T.border}` }}
    >
      {/* Ambient glows */}
      <Box sx={{
        position: "absolute", width: "80vw", height: "50vw",
        top: "-10vw", left: "10vw", borderRadius: "50%",
        background: "radial-gradient(ellipse, rgba(59,123,246,0.08) 0%, transparent 65%)",
        pointerEvents: "none",
      }} />
      <Box sx={{
        position: "absolute", width: "40vw", height: "35vw",
        bottom: "-5vw", right: "-5vw", borderRadius: "50%",
        background: "radial-gradient(ellipse, rgba(59,123,246,0.05) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Dot grid */}
      <Box sx={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: `radial-gradient(circle, rgba(59,123,246,0.07) 1px, transparent 1px)`,
        backgroundSize: "28px 28px",
      }} />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>

        {/* ══ HERO ════════════════════════════════════════════ */}
        <Box
          ref={heroRef as React.RefObject<HTMLDivElement>}
          sx={{
            pt: { xs: 14, md: 20 }, pb: { xs: 10, md: 14 },
            display: "flex", flexDirection: "column",
            alignItems: "center", textAlign: "center",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1.25, mb: 4 }}>
              <Box sx={{ width: 20, height: 1.5, borderRadius: 1, background: T.blueGrad }} />
              <Typography sx={{ fontFamily: MONO, fontSize: "0.58rem", letterSpacing: "0.22em", color: T.blue, textTransform: "uppercase" }}>
                Let's build your financial future
              </Typography>
              <Box sx={{ width: 20, height: 1.5, borderRadius: 1, background: T.blueGrad }} />
            </Box>
          </motion.div>

          <motion.div style={{ y: yHeadline }}>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
            >
              <Typography sx={{
                fontFamily: SERIF, fontStyle: "italic", fontWeight: 400,
                fontSize: { xs: "2.75rem", sm: "4rem", md: "5.5rem", lg: "7rem" },
                lineHeight: 0.92, letterSpacing: "-0.04em", color: T.ink, mb: 0.5,
              }}>
                Ready to
              </Typography>
              <Typography sx={{
                fontFamily: SERIF, fontStyle: "italic", fontWeight: 400,
                fontSize: { xs: "2.75rem", sm: "4rem", md: "5.5rem", lg: "7rem" },
                lineHeight: 0.92, letterSpacing: "-0.04em",
                background: T.blueGrad,
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                backgroundClip: "text", mb: 5,
              }}>
                amplify growth?
              </Typography>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.45, ease: EASE }}
          >
            <Box sx={{ display: "flex", gap: 1.5, justifyContent: "center", flexWrap: "wrap" }}>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              </motion.div>
            </Box>
          </motion.div>
        </Box>

        {/* ══ SOLUTIONS ═══════════════════════════════════════ */}
        <Box ref={solutionsRef as React.RefObject<HTMLDivElement>} sx={{ pb: { xs: 10, md: 14 } }}>
          

          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 3 }}>
            {/* Startups card */}
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={solutionsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, delay: 0.1, ease: EASE }}
            >
              <Box sx={{
                background: T.bgCard, borderRadius: "18px", border: `1px solid ${T.border}`,
                p: { xs: "28px", md: "32px" }, height: "100%",
                position: "relative", overflow: "hidden",
                transition: "all 0.25s ease",
                "&:hover": { borderColor: "rgba(59,123,246,0.25)", boxShadow: `0 12px 40px ${T.blueGlow}`, transform: "translateY(-3px)" },
              }}>
                <Box sx={{ position: "absolute", top: 0, left: 20, right: 20, height: "2px", background: T.blueGrad, borderRadius: "0 0 4px 4px" }} />
                <Box sx={{ position: "absolute", bottom: -16, right: -8, fontSize: "7rem", opacity: 0.03, userSelect: "none", lineHeight: 1 }}>🚀</Box>
                <Box sx={{ position: "relative", zIndex: 1 }}>
                  <Box sx={{
                    width: 42, height: 42, borderRadius: "12px",
                    background: T.bluePale, border: `1px solid rgba(59,123,246,0.15)`,
                    display: "flex", alignItems: "center", justifyContent: "center", mb: 2.5,
                  }}>
                    <TrendingIcon sx={{ fontSize: "1.1rem", color: T.blue }} />
                  </Box>
                  <Typography sx={{
                    fontFamily: SERIF, fontStyle: "italic", fontWeight: 400,
                    fontSize: { xs: "1.5rem", md: "1.875rem" },
                    color: T.ink, letterSpacing: "-0.025em", lineHeight: 1.1, mb: 1.5,
                  }}>
                    For Startups
                  </Typography>
                  <Typography sx={{ fontFamily: SANS, fontSize: "0.875rem", color: T.inkMuted, lineHeight: 1.8, mb: 3 }}>
                    We build the financial tools that help you tell your story to investors — clearly, confidently, and with the numbers to back it up.
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {["Financial Models", "Pitch Decks", "Business Plans", "Investor Readiness"].map((tag) => (
                      <Box key={tag} sx={{
                        px: "10px", py: "4px", borderRadius: "6px",
                        background: T.bgCardAlt, border: `1px solid ${T.border}`,
                        fontFamily: MONO, fontSize: "0.5rem", letterSpacing: "0.1em",
                        color: T.inkMuted, textTransform: "uppercase",
                      }}>{tag}</Box>
                    ))}
                  </Box>
                </Box>
              </Box>
            </motion.div>

            {/* Data-driven card */}
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={solutionsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, delay: 0.22, ease: EASE }}
            >
              <Box sx={{
                background: T.bgCard, borderRadius: "18px", border: `1px solid ${T.border}`,
                p: { xs: "28px", md: "32px" }, height: "100%",
                position: "relative", overflow: "hidden",
                transition: "all 0.25s ease",
                "&:hover": { borderColor: "rgba(59,123,246,0.25)", boxShadow: `0 12px 40px ${T.blueGlow}`, transform: "translateY(-3px)" },
              }}>
                <Box sx={{ position: "absolute", top: 0, left: 20, right: 20, height: "2px", background: T.blueGrad, borderRadius: "0 0 4px 4px" }} />
                <Box sx={{ position: "absolute", bottom: -16, right: -8, fontSize: "7rem", opacity: 0.03, userSelect: "none", lineHeight: 1 }}>📊</Box>
                <Box sx={{ position: "relative", zIndex: 1 }}>
                  <Box sx={{
                    width: 42, height: 42, borderRadius: "12px",
                    background: T.bluePale, border: `1px solid rgba(59,123,246,0.15)`,
                    display: "flex", alignItems: "center", justifyContent: "center", mb: 2.5,
                  }}>
                    <ChartIcon sx={{ fontSize: "1.1rem", color: T.blue }} />
                  </Box>
                  <Typography sx={{
                    fontFamily: SERIF, fontStyle: "italic", fontWeight: 400,
                    fontSize: { xs: "1.5rem", md: "1.875rem" },
                    color: T.ink, letterSpacing: "-0.025em", lineHeight: 1.1, mb: 1.5,
                  }}>
                    Data-Driven Decisions
                  </Typography>
                  <Typography sx={{ fontFamily: SANS, fontSize: "0.875rem", color: T.inkMuted, lineHeight: 1.8, mb: 3 }}>
                    Know where every rupee goes. We build dashboards and models that make your numbers easy to read — so you can plan better and grow faster.
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {["Budget vs Actuals", "Cash Burn", "Templates", "Inventory Mgmt"].map((tag) => (
                      <Box key={tag} sx={{
                        px: "10px", py: "4px", borderRadius: "6px",
                        background: T.bgCardAlt, border: `1px solid ${T.border}`,
                        fontFamily: MONO, fontSize: "0.5rem", letterSpacing: "0.1em",
                        color: T.inkMuted, textTransform: "uppercase",
                      }}>{tag}</Box>
                    ))}
                  </Box>
                </Box>
              </Box>
            </motion.div>
          </Box>

          {/* Chip strip */}
          <Box sx={{ mt: 3, display: "flex", flexWrap: "wrap", gap: 1.5, justifyContent: "center" }}>
            {[
              { icon: DocIcon,       label: "Financial Models"     },
              { icon: TrendingIcon,  label: "Pitch Decks"          },
              { icon: ChartIcon,     label: "Budget vs Actuals"    },
              { icon: InventoryIcon, label: "Inventory Management" },
              { icon: FundIcon,      label: "Business Plans"       },
              { icon: TableIcon,     label: "Cash Burn Analysis"   },
            ].map((chip, i) => (
              <SolutionChip key={chip.label} icon={chip.icon} label={chip.label} delay={0.2 + i * 0.07} inView={solutionsInView} />
            ))}
          </Box>
        </Box>

        {/* ══ FUNDRAISING ═════════════════════════════════════ */}
        <Box ref={fundraiseRef as React.RefObject<HTMLDivElement>} sx={{ pb: { xs: 10, md: 14 } }}>
          <SectionDivider label="Fundraising & Investor Readiness" inView={fundraiseInView} />

          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1.1fr 0.9fr" }, gap: 4, alignItems: "center" }}>
            {/* Left */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={fundraiseInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
            >
              <Box sx={{ overflow: "hidden", mb: 0.5 }}>
                <motion.div
                  initial={{ y: "110%" }}
                  animate={fundraiseInView ? { y: "0%" } : {}}
                  transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
                >
                  <Typography sx={{
                    fontFamily: SERIF, fontStyle: "italic", fontWeight: 400,
                    fontSize: { xs: "2rem", md: "2.75rem" },
                    color: T.ink, letterSpacing: "-0.03em", lineHeight: 1.1,
                  }}>
                    Building tools that
                  </Typography>
                </motion.div>
              </Box>
              <Box sx={{ overflow: "hidden", mb: 3 }}>
                <motion.div
                  initial={{ y: "110%" }}
                  animate={fundraiseInView ? { y: "0%" } : {}}
                  transition={{ duration: 0.7, delay: 0.22, ease: EASE }}
                >
                  <Typography sx={{
                    fontFamily: SERIF, fontStyle: "italic", fontWeight: 400,
                    fontSize: { xs: "2rem", md: "2.75rem" },
                    letterSpacing: "-0.03em", lineHeight: 1.1,
                    background: T.blueGrad,
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                  }}>
                    make work easier.
                  </Typography>
                </motion.div>
              </Box>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={fundraiseInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, delay: 0.35, ease: EASE }}
              >
                <Typography sx={{ fontFamily: SANS, fontSize: "0.9375rem", color: T.inkMuted, lineHeight: 1.8, mb: 3.5, maxWidth: 420 }}>
                  And helping founders tell their story right. We prepare the financial models, projections, and pitch materials that get investors to say yes.
                </Typography>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={fundraiseInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.45, delay: 0.45, ease: EASE }}
              >
                <Button
                  component={Link}
                  href="/book-consultation"
                  disableElevation
                  endIcon={<ArrowIcon sx={{ fontSize: "0.85rem !important" }} />}
                  sx={{
                    fontFamily: SANS, fontWeight: 600, fontSize: "0.875rem",
                    textTransform: "none", letterSpacing: "-0.01em",
                    px: 3, py: 1.25, borderRadius: "10px",
                    color: "#FFFFFF", background: T.blueGrad,
                    boxShadow: `0 4px 18px ${T.blueGlow}`,
                    "&:hover": { filter: "brightness(1.07)" },
                  }}
                >
                  Start fundraise prep
                </Button>
              </motion.div>
            </motion.div>

            {/* Right — feature list */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={fundraiseInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
            >
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                {[
                  { icon: "📈", title: "3-Statement Models",   desc: "P&L, Balance Sheet, Cash Flow — built to impress Series A investors." },
                  { icon: "📋", title: "Investor Pitch Decks", desc: "Narrative + numbers combined into a deck that closes rounds."          },
                  { icon: "📝", title: "Business Plans",       desc: "Structured plans with market sizing, unit economics, and forecasts."   },
                ].map((item, i) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: 16 }}
                    animate={fundraiseInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.45, delay: 0.28 + i * 0.1, ease: EASE }}
                    whileHover={{ x: 4, transition: { duration: 0.2 } }}
                  >
                    <Box sx={{
                      display: "flex", alignItems: "flex-start", gap: 1.75,
                      p: "16px 18px", borderRadius: "12px",
                      background: T.bgCard, border: `1px solid ${T.border}`,
                      transition: "all 0.2s ease",
                      "&:hover": { borderColor: "rgba(59,123,246,0.22)", boxShadow: `0 4px 20px ${T.blueGlow}` },
                    }}>
                      <Box sx={{ fontSize: "1.2rem", mt: "1px", flexShrink: 0 }}>{item.icon}</Box>
                      <Box>
                        <Typography sx={{ fontFamily: SANS, fontWeight: 600, fontSize: "0.875rem", color: T.ink, letterSpacing: "-0.01em", mb: 0.4 }}>
                          {item.title}
                        </Typography>
                        <Typography sx={{ fontFamily: SANS, fontSize: "0.775rem", color: T.inkMuted, lineHeight: 1.6 }}>
                          {item.desc}
                        </Typography>
                      </Box>
                    </Box>
                  </motion.div>
                ))}
              </Box>
            </motion.div>
          </Box>
        </Box>

        {/* ══ DATA-DRIVEN DECISIONS ════════════════════════════ */}
        <Box ref={dataRef as React.RefObject<HTMLDivElement>} sx={{ pb: { xs: 14, md: 20 } }}>
          <SectionDivider label="Data-Driven Decisions" inView={dataInView} />

          {/* Centred statement */}
          <Box sx={{ textAlign: "center", mb: 8 }}>
            <Box sx={{ overflow: "hidden", mb: 0.5 }}>
              <motion.div
                initial={{ y: "110%" }}
                animate={dataInView ? { y: "0%" } : {}}
                transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
              >
                <Typography sx={{
                  fontFamily: SERIF, fontStyle: "italic", fontWeight: 400,
                  fontSize: { xs: "1.75rem", md: "2.75rem" },
                  color: T.ink, letterSpacing: "-0.03em", lineHeight: 1.05,
                }}>
                  Bring structure to your numbers,
                </Typography>
              </motion.div>
            </Box>
            <Box sx={{ overflow: "hidden", mb: 3.5 }}>
              <motion.div
                initial={{ y: "110%" }}
                animate={dataInView ? { y: "0%" } : {}}
                transition={{ duration: 0.7, delay: 0.18, ease: EASE }}
              >
                <Typography sx={{
                  fontFamily: SERIF, fontStyle: "italic", fontWeight: 400,
                  fontSize: { xs: "1.75rem", md: "2.75rem" },
                  letterSpacing: "-0.03em", lineHeight: 1.05,
                  background: T.blueGrad,
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                }}>
                  so they help you think clearly.
                </Typography>
              </motion.div>
            </Box>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={dataInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3, ease: EASE }}
            >
              <Typography sx={{ fontFamily: SANS, fontSize: { xs: "0.9375rem", md: "1rem" }, color: T.inkMuted, maxWidth: 520, mx: "auto", lineHeight: 1.8 }}>
                We build simple templates to understand where money is coming from and where it's going — for you to plan better and grow.
              </Typography>
            </motion.div>
          </Box>

          {/* 4-col feature grid */}
          <Box sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(4, 1fr)" },
            gap: 2,
          }}>
            {[
              { icon: ChartIcon,     title: "Budget vs Actuals",   desc: "Track where you planned to be vs where you actually are."  },
              { icon: TrendingIcon,  title: "Financial Models",     desc: "Forecast revenue, costs, and growth with clarity."         },
              { icon: InventoryIcon, title: "Inventory Management", desc: "Know what you have, what you need, and what it costs."     },
              { icon: TableIcon,     title: "Cash Burn Tracker",    desc: "Understand your runway so you never run dry."              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 28 }}
                animate={dataInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, delay: 0.15 + i * 0.1, ease: EASE }}
                whileHover={{ y: -4, transition: { duration: 0.22 } }}
              >
                <Box sx={{
                  p: "24px 22px", borderRadius: "16px",
                  background: T.bgCard, border: `1px solid ${T.border}`,
                  height: "100%", position: "relative", overflow: "hidden",
                  transition: "all 0.25s ease",
                  "&:hover": { borderColor: "rgba(59,123,246,0.25)", boxShadow: `0 8px 32px ${T.blueGlow}` },
                }}>
                  <Box sx={{ position: "absolute", top: 0, left: 16, right: 16, height: "1.5px", background: T.blueGrad, borderRadius: "0 0 3px 3px" }} />
                  <Box sx={{
                    width: 38, height: 38, borderRadius: "10px",
                    background: T.bluePale, border: `1px solid rgba(59,123,246,0.14)`,
                    display: "flex", alignItems: "center", justifyContent: "center", mb: 2,
                  }}>
                    <item.icon sx={{ fontSize: "1rem", color: T.blue }} />
                  </Box>
                  <Typography sx={{ fontFamily: SANS, fontWeight: 600, fontSize: "0.875rem", color: T.ink, letterSpacing: "-0.01em", mb: 0.75 }}>
                    {item.title}
                  </Typography>
                  <Typography sx={{ fontFamily: SANS, fontSize: "0.775rem", color: T.inkMuted, lineHeight: 1.65 }}>
                    {item.desc}
                  </Typography>
                </Box>
              </motion.div>
            ))}
          </Box>

          {/* Final CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={dataInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.55, ease: EASE }}
          >
            <Box sx={{ mt: 6, display: "flex", justifyContent: "center", gap: 1.5, flexWrap: "wrap" }}>
              <Button
                component={Link}
                href="/templates"
                disableElevation
                endIcon={<ArrowIcon sx={{ fontSize: "0.85rem !important" }} />}
                sx={{
                  fontFamily: SANS, fontWeight: 600, fontSize: "0.9375rem",
                  textTransform: "none", letterSpacing: "-0.01em",
                  px: 3.5, py: 1.5, borderRadius: "10px", minHeight: 50,
                  color: "#FFFFFF", background: T.blueGrad,
                  boxShadow: `0 4px 20px ${T.blueGlow}`,
                  "&:hover": { filter: "brightness(1.07)", boxShadow: `0 8px 28px ${T.blueGlow}` },
                }}
              >
                Explore Templates
              </Button>
              <Button
                component="a"
                href={process.env.NEXT_PUBLIC_CALENDLY_URL}
                target="_blank"
                disableElevation
                startIcon={<CalIcon sx={{ fontSize: "0.9rem !important" }} />}
                sx={{
                  fontFamily: SANS, fontWeight: 500, fontSize: "0.9375rem",
                  textTransform: "none", letterSpacing: "-0.01em",
                  px: 3.5, py: 1.5, borderRadius: "10px", minHeight: 50,
                  color: T.blue, border: `1.5px solid rgba(59,123,246,0.3)`,
                  background: "#FFFFFF",
                  "&:hover": { background: T.bluePale, borderColor: T.blue },
                }}
              >
                Book Free Consultation
              </Button>
            </Box>
          </motion.div>
        </Box>

      </Container>
    </Box>
  );
}