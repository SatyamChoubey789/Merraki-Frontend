"use client";

import { useRef } from "react";
import { Box, Container, Typography } from "@mui/material";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
} from "framer-motion";
import { FoundersSection } from "@/components/sections/home/FoundersSection";

/* ══════════════════════════════════════════════════════════════════════
   DESIGN TOKENS — Pure black/white, warm gold accent, NO dark blues
══════════════════════════════════════════════════════════════════════ */
const T = {
  /* surfaces */
  white: "#FFFFFF",
  offwhite: "#F5F7FB",              // soft section background
  paper: "#EDF3FF",                 // subtle blue tint surface
  surface: "#F8FAFF",               // very light elevated surface

  /* text */
  ink: "#0A0A0F",
  inkMid: "#1E1E2A",
  inkMuted: "#5A5A72",
  inkFaint: "#9898AE",

  /* borders */
  border: "rgba(10,10,20,0.08)",
  borderMid: "rgba(10,10,20,0.14)",

  /* accent — brand blue */
  blue: "#3B7BF6",
  blueMid: "#5A92F8",
  blueLight: "#7AABFF",
  bluePale: "#EDF3FF",
  blueDim: "rgba(59,123,246,0.06)",
  blueGlow: "rgba(59,123,246,0.10)",
};
const FONT_DISPLAY = `"Instrument Serif", "Playfair Display", Georgia, serif`;
const FONT_BODY = `"DM Sans", "Mona Sans", system-ui, sans-serif`;
const FONT_MONO = `"DM Mono", "JetBrains Mono", monospace`;
const EASE_OUT = [0.16, 1, 0.3, 1] as const;

/* ── data ────────────────────────────────────────────────────────────── */
const MISSION_ITEMS = [
  {
    glyph: "01",
    title: "Our Mission",
    text: "To simplify finance so every business owner can make confident, data-backed decisions — regardless of their financial background.",
    accent: T.blue,
  },
  {
    glyph: "02",
    title: "Our Vision",
    text: "A world where every founder has access to institutional-grade financial intelligence, not just large corporations.",
    accent: "#A0956B",
  },
  {
    glyph: "03",
    title: "Our Approach",
    text: "We combine deep financial expertise with practical tools — models, templates, and dashboards that work in the real world.",
    accent: "#7A9B7A",
  },
];

const VALUES = [
  {
    roman: "I",
    title: "Precision",
    text: "Every number matters. We build models that are audit-ready and boardroom-confident.",
    icon: "◈",
  },
  {
    roman: "II",
    title: "Partnership",
    text: "We work with you, not just for you. Your growth is our true measuring stick.",
    icon: "◈",
  },
  {
    roman: "III",
    title: "Impact",
    text: "We measure our own success by the decisions and outcomes our work enables.",
    icon: "◈",
  },
  {
    roman: "IV",
    title: "Clarity",
    text: "Complex finance made simple. Always transparent, never jargon-first.",
    icon: "◈",
  },
];

const TIMELINE = [
  { year: "2020", event: "Merraki Solutions founded by Parag & Khyati" },
  {
    year: "2021",
    event: "First 50 financial models delivered to Indian startups",
  },
  {
    year: "2022",
    event: "Launched Excel Dashboard product line, 100+ clients reached",
  },
  {
    year: "2023",
    event: "Templates platform launched — passive income + scale",
  },
  { year: "2024", event: "300+ founders advised, ₹50 Cr+ revenue modelled" },
];

/* ══════════════════════════════════════════════════════════════════════
   HORIZONTAL SCROLL ENGINE
══════════════════════════════════════════════════════════════════════ */
function HorizontalScrollSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smooth = useSpring(scrollYProgress, {
    stiffness: 60,
    damping: 18,
    restDelta: 0.0001,
  });
  const x = useTransform(smooth, [0, 1], ["0vw", "-300vw"]);

  return (
    <Box ref={containerRef} sx={{ height: "400vh", position: "relative" }}>
      <Box
        sx={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}
      >
        {/* Track */}
        <motion.div
          style={{ x, display: "flex", width: "400vw", height: "100%" }}
        >
          <HeroPanel progress={smooth} />
          <MissionPanel progress={smooth} />
          <StoryPanel progress={smooth} />
          <ValuesPanel progress={smooth} />
        </motion.div>

        {/* Bottom progress bar — blue */}
        <motion.div
          style={{
            scaleX: smooth,
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 1.5,
            background: `linear-gradient(90deg, ${T.blue}, ${T.blueLight})`,
            transformOrigin: "left",
            zIndex: 20,
          }}
        />

        {/* Panel dots */}
        <PanelDots progress={smooth} />

        {/* Scroll cue */}
        <ScrollCue progress={smooth} />
      </Box>
    </Box>
  );
}

/* ── Animated panel dots ─────────────────────────────────────────────── */
function PanelDots({ progress }: { progress: MotionValue<number> }) {
  const panels = [
    { label: "Story", range: [0, 0.33] as [number, number] },
    { label: "Mission", range: [0.25, 0.58] as [number, number] },
    { label: "Origins", range: [0.5, 0.83] as [number, number] },
    { label: "Values", range: [0.75, 1] as [number, number] },
  ];

  return (
    <Box
      sx={{
        position: "absolute",
        bottom: 24,
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        alignItems: "center",
        gap: 2.5,
        zIndex: 20,
      }}
    >
      {panels.map((p) => (
        <Box
          key={p.label}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 0.75,
          }}
        >
          <Box
            sx={{
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: T.blueMid,
              border: `1px solid ${T.blue}`,
            }}
          />
          <Typography
            sx={{
              fontFamily: FONT_MONO,
              fontSize: "0.5rem",
              letterSpacing: "0.12em",
              color: "rgba(255,255,255,0.18)",
              textTransform: "uppercase",
            }}
          >
            {p.label}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}

/* ── Scroll cue (right side) ─────────────────────────────────────────── */
function ScrollCue({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0, 0.12], [1, 0]);
  return (
    <motion.div
      style={{
        opacity,
        position: "absolute",
        right: 36,
        top: "50%",
        transform: "translateY(-50%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
      }}
    >
      {/* animated chevrons */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          animate={{ opacity: [0.15, 0.7, 0.15], y: [0, 6, 0] }}
          transition={{
            duration: 1.6,
            delay: i * 0.22,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRight: `1.5px solid rgba(255,255,255,0.4)`,
              borderBottom: `1.5px solid rgba(255,255,255,0.4)`,
              transform: "rotate(45deg)",
            }}
          />
        </motion.div>
      ))}
      <Typography
        sx={{
          fontFamily: FONT_MONO,
          fontSize: "0.5rem",
          letterSpacing: "0.2em",
          color: "rgba(255,255,255,0.22)",
          writingMode: "vertical-rl",
          textTransform: "uppercase",
          mt: 1,
        }}
      >
        scroll
      </Typography>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   PANEL 1 — HERO  (premium white with subtle editorial textures)
══════════════════════════════════════════════════════════════════════ */
function HeroPanel({ progress }: { progress: MotionValue<number> }) {
  const contentX = useTransform(progress, [0, 0.25], ["0%", "-6%"]);
  const opacity = useTransform(progress, [0, 0.2], [1, 0]);

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100%",
        flexShrink: 0,
        background: "#FFFFFF", // premium clean white
        display: "flex",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle editorial texture */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          opacity: 0.04,
          backgroundImage: `radial-gradient(rgba(200,180,120,0.1) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Soft blue radial */}
      <Box
        sx={{
          position: "absolute",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(59,123,246,0.12) 0%, transparent 70%)`,
          top: -150,
          left: -100,
          pointerEvents: "none",
        }}
      />

      {/* Horizontal editorial rules */}
      {[0.2, 0.5, 0.8].map((pos) => (
        <Box
          key={pos}
          sx={{
            position: "absolute",
            left: 0,
            right: 0,
            top: `${pos * 100}%`,
            height: "1px",
            background: "rgba(0,0,0,0.05)",
            pointerEvents: "none",
          }}
        />
      ))}

      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1 }}>
        <motion.div style={{ x: contentX, opacity }}>
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE_OUT }}
          >
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3.5 }}
            >
              <Box sx={{ width: 24, height: "1px", background: T.blue }} />
              <Typography
                sx={{
                  fontFamily: FONT_MONO,
                  fontSize: "0.65rem",
                  letterSpacing: "0.22em",
                  color: T.blue,
                  textTransform: "uppercase",
                }}
              >
                Our Story
              </Typography>
            </Box>
          </motion.div>

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: EASE_OUT }}
          >
            <Typography
              sx={{
                fontFamily: FONT_DISPLAY,
                fontStyle: "italic",
                fontWeight: 400,
                fontSize: {
                  xs: "3rem",
                  sm: "4.5rem",
                  md: "6rem",
                  lg: "7.5rem",
                },
                lineHeight: 0.95,
                letterSpacing: "-0.035em",
                color: "#1A1A1A", // dark warm
                mb: 0.5,
              }}
            >
              Finance
            </Typography>
            <Typography
              sx={{
                fontFamily: FONT_DISPLAY,
                fontStyle: "italic",
                fontWeight: 400,
                fontSize: {
                  xs: "3rem",
                  sm: "4.5rem",
                  md: "6rem",
                  lg: "7.5rem",
                },
                lineHeight: 0.95,
                letterSpacing: "-0.035em",
                background: `linear-gradient(120deg, ${T.blue} 0%, ${T.blueLight} 60%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                mb: 2.5,
              }}
            >
              simplified.
            </Typography>
            <Typography
              sx={{
                fontFamily: FONT_DISPLAY,
                fontWeight: 300,
                fontSize: {
                  xs: "1.5rem",
                  sm: "2rem",
                  md: "2.5rem",
                  lg: "3rem",
                },
                letterSpacing: "-0.02em",
                color: "#3B3B3B",
                lineHeight: 1.1,
              }}
            >
              Growth amplified.
            </Typography>
          </motion.div>

          {/* Body */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: EASE_OUT }}
          >
            <Typography
              sx={{
                fontFamily: FONT_BODY,
                fontSize: { xs: "0.95rem", md: "1.0625rem" },
                color: "#3B3B3B",
                lineHeight: 1.85,
                maxWidth: 480,
                mt: 3.5,
                mb: 5,
              }}
            >
              Merraki Solutions was born from a simple belief: every founder
              deserves access to financial intelligence once reserved for large
              corporations.
            </Typography>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45, ease: EASE_OUT }}
          >
            <Box
              sx={{
                display: "flex",
                gap: 0,
                flexWrap: "wrap",
                rowGap: 2,
                borderTop: "1px solid rgba(0,0,0,0.05)",
                pt: 3.5,
              }}
            >
              {[
                { val: "300+", label: "Founders" },
                { val: "₹50Cr+", label: "Modelled" },
                { val: "150+", label: "Models" },
                { val: "5 yrs", label: "Expertise" },
              ].map((s, i) => (
                <Box
                  key={s.label}
                  sx={{
                    borderLeft: i > 0 ? "1px solid rgba(0,0,0,0.05)" : "none",
                    pl: i > 0 ? 3 : 0,
                    pr: 3,
                    textAlign: "center",
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: FONT_MONO,
                      fontSize: "1.15rem",
                      fontWeight: 600,
                      color: "#1A1A1A",
                      lineHeight: 1,
                      mb: 0.4,
                    }}
                  >
                    {s.val}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: FONT_MONO,
                      fontSize: "0.55rem",
                      letterSpacing: "0.12em",
                      color: "#6B7280",
                      textTransform: "uppercase",
                    }}
                  >
                    {s.label}
                  </Typography>
                </Box>
              ))}
            </Box>
          </motion.div>
        </motion.div>
      </Container>

      {/* Ghost editorial letter */}
      <Box
        sx={{
          position: "absolute",
          right: -40,
          bottom: -60,
          fontFamily: FONT_DISPLAY,
          fontSize: "32vw",
          fontWeight: 400,
          fontStyle: "italic",
          color: "rgba(0,0,0,0.015)",
          lineHeight: 1,
          pointerEvents: "none",
          userSelect: "none",
          letterSpacing: "-0.05em",
        }}
      >
        M
      </Box>
    </Box>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   PANEL 2 — MISSION / VISION / APPROACH (warm off-white)
══════════════════════════════════════════════════════════════════════ */
function MissionPanel({ progress }: { progress: MotionValue<number> }) {
  const contentX = useTransform(progress, [0.25, 0.5], ["6%", "0%"]);
  const opacity = useTransform(
    progress,
    [0.12, 0.25, 0.75, 0.88],
    [0, 1, 1, 0],
  );

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100%",
        flexShrink: 0,
        background: T.offwhite,
        display: "flex",
        alignItems: "center",
        borderLeft: `1px solid ${T.border}`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle warm grid */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          backgroundImage: `linear-gradient(${T.border} 1px, transparent 1px), linear-gradient(90deg, ${T.border} 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
          opacity: 0.5,
        }}
      />

      {/* Ghost number */}
      <Box
        sx={{
          position: "absolute",
          right: -30,
          top: "50%",
          transform: "translateY(-50%)",
          fontFamily: FONT_DISPLAY,
          fontStyle: "italic",
          fontSize: "36vw",
          fontWeight: 400,
          color: "rgba(15,17,23,0.03)",
          lineHeight: 1,
          pointerEvents: "none",
          userSelect: "none",
          letterSpacing: "-0.06em",
        }}
      >
        01
      </Box>

      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1 }}>
        <motion.div style={{ x: contentX, opacity }}>
          {/* Header */}
          <Box sx={{ mb: 6 }}>
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2.5 }}
            >
              <Box sx={{ width: 24, height: "1px", background: T.blue }} />
              <Typography
                sx={{
                  fontFamily: FONT_MONO,
                  fontSize: "0.6rem",
                  letterSpacing: "0.2em",
                  color: T.blue,
                  textTransform: "uppercase",
                }}
              >
                Why We Exist
              </Typography>
            </Box>
            <Typography
              sx={{
                fontFamily: FONT_DISPLAY,
                fontStyle: "italic",
                fontWeight: 400,
                fontSize: { xs: "2.5rem", md: "3.75rem" },
                color: T.ink,
                letterSpacing: "-0.025em",
                lineHeight: 1.05,
              }}
            >
              Purpose, vision,
              <br />
              and how we work.
            </Typography>
          </Box>

          {/* Cards */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
              gap: 2,
            }}
          >
            {MISSION_ITEMS.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.6, ease: EASE_OUT }}
                whileHover={{ y: -4 }}
              >
                <Box
                  sx={{
                    p: 3.5,
                    borderRadius: "16px",
                    background: T.white,
                    border: `1px solid ${T.border}`,
                    height: "100%",
                    transition:
                      "box-shadow 0.25s ease, border-color 0.25s ease",
                    "&:hover": {
                      boxShadow: "0 12px 40px rgba(15,17,23,0.08)",
                      borderColor: T.borderMid,
                    },
                    position: "relative",
                    overflow: "hidden",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: "2px",
                      background: `linear-gradient(90deg, ${T.blue}, ${T.blueLight})`,
                      opacity: 0,
                      transition: "opacity 0.25s",
                    },
                    "&:hover::before": { opacity: 1 },
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: FONT_MONO,
                      fontSize: "0.6rem",
                      letterSpacing: "0.18em",
                      color: T.blue,
                      mb: 2.5,
                      textTransform: "uppercase",
                    }}
                  >
                    {item.glyph}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: FONT_DISPLAY,
                      fontStyle: "italic",
                      fontSize: "1.5rem",
                      fontWeight: 400,
                      color: T.ink,
                      mb: 1.5,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {item.title}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: FONT_BODY,
                      fontSize: "0.9rem",
                      color: T.inkMuted,
                      lineHeight: 1.75,
                    }}
                  >
                    {item.text}
                  </Typography>
                </Box>
              </motion.div>
            ))}
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   PANEL 3 — OUR STORY + TIMELINE (warm cream)
══════════════════════════════════════════════════════════════════════ */
function StoryPanel({ progress }: { progress: MotionValue<number> }) {
  const contentX = useTransform(progress, [0.5, 0.75], ["6%", "0%"]);
  const opacity = useTransform(progress, [0.37, 0.5, 0.88, 1], [0, 1, 1, 0]);

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100%",
        flexShrink: 0,
        background: T.paper,
        display: "flex",
        alignItems: "center",
        borderLeft: `1px solid ${T.border}`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ghost number */}
      <Box
        sx={{
          position: "absolute",
          right: -30,
          top: "50%",
          transform: "translateY(-50%)",
          fontFamily: FONT_DISPLAY,
          fontStyle: "italic",
          fontSize: "36vw",
          fontWeight: 400,
          color: "rgba(15,17,23,0.04)",
          lineHeight: 1,
          pointerEvents: "none",
          userSelect: "none",
          letterSpacing: "-0.06em",
        }}
      >
        02
      </Box>

      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1 }}>
        <motion.div style={{ x: contentX, opacity }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: { xs: 6, md: 10 },
              alignItems: "start",
            }}
          >
            {/* Left: copy */}
            <Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  mb: 2.5,
                }}
              >
                <Box sx={{ width: 24, height: "1px", background: T.blue }} />
                <Typography
                  sx={{
                    fontFamily: FONT_MONO,
                    fontSize: "0.6rem",
                    letterSpacing: "0.2em",
                    color: T.blue,
                    textTransform: "uppercase",
                  }}
                >
                  How It Started
                </Typography>
              </Box>
              <Typography
                sx={{
                  fontFamily: FONT_DISPLAY,
                  fontStyle: "italic",
                  fontWeight: 400,
                  fontSize: { xs: "2rem", md: "3rem" },
                  color: T.ink,
                  letterSpacing: "-0.025em",
                  lineHeight: 1.1,
                  mb: 3,
                }}
              >
                From spreadsheets
                <br />
                to strategy.
              </Typography>
              <Typography
                sx={{
                  fontFamily: FONT_BODY,
                  fontSize: "0.9375rem",
                  color: T.inkMuted,
                  lineHeight: 1.8,
                  mb: 2,
                }}
              >
                Parag and Khyati spent years working with startups across India,
                building financial models that sat in folders — never opened,
                never actioned.
              </Typography>
              <Typography
                sx={{
                  fontFamily: FONT_BODY,
                  fontSize: "0.9375rem",
                  color: T.inkMuted,
                  lineHeight: 1.8,
                }}
              >
                Merraki was founded to change that — build tools precise enough
                for analysts, simple enough for founders, and actionable enough
                to create real change.
              </Typography>
            </Box>

            {/* Right: timeline */}
            <Box sx={{ position: "relative", pl: 3 }}>
              {/* Thin gold line */}
              <Box
                sx={{
                  position: "absolute",
                  left: 0,
                  top: 6,
                  bottom: 6,
                  width: "1px",
                  background: `linear-gradient(180deg, ${T.blue}, rgba(59,123,246,0.08))`,
                }}
              />

              {TIMELINE.map((item, i) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: 0.12 + i * 0.09,
                    duration: 0.45,
                    ease: EASE_OUT,
                  }}
                >
                  <Box
                    sx={{
                      position: "relative",
                      mb: i < TIMELINE.length - 1 ? 3.5 : 0,
                    }}
                  >
                    {/* Gold dot */}
                    <Box
                      sx={{
                        position: "absolute",
                        left: -3 - 5,
                        top: 4,
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        background: T.blue,
                        border: `2px solid ${T.paper}`,
                        boxShadow: `0 0 0 2px ${T.blueDim}`,
                      }}
                    />
                    <Typography
                      sx={{
                        fontFamily: FONT_MONO,
                        fontSize: "0.6rem",
                        letterSpacing: "0.14em",
                        color: T.blue,
                        mb: 0.5,
                        textTransform: "uppercase",
                      }}
                    >
                      {item.year}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: FONT_BODY,
                        fontWeight: 500,
                        fontSize: "0.9rem",
                        color: T.inkMid,
                        lineHeight: 1.5,
                      }}
                    >
                      {item.event}
                    </Typography>
                  </Box>
                </motion.div>
              ))}
            </Box>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   PANEL 4 — VALUES  (near-black, NO blue — warm charcoal)
══════════════════════════════════════════════════════════════════════ */
function ValuesPanel({ progress }: { progress: MotionValue<number> }) {
  const contentX = useTransform(progress, [0.75, 1], ["6%", "0%"]);
  const opacity = useTransform(progress, [0.62, 0.78], [0, 1]);

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100%",
        flexShrink: 0,
        background: "#FFFFFF",
        display: "flex",
        alignItems: "center",
        position: "relative",
      }}
    >
      {/* Subtle large background number */}
      <Box
        sx={{
          position: "absolute",
          right: 0,
          top: "50%",
          transform: "translateY(-50%)",
          fontFamily: FONT_DISPLAY,
          fontStyle: "italic",
          fontSize: "34vw",
          fontWeight: 400,
          color: "rgba(0,0,0,0.03)",
          lineHeight: 1,
          pointerEvents: "none",
          userSelect: "none",
          letterSpacing: "-0.06em",
        }}
      >
        03
      </Box>

      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1 }}>
        <motion.div style={{ x: contentX, opacity }}>
          {/* Header */}
          <Box sx={{ mb: { xs: 10, md: 14 } }}>
            <Typography
              sx={{
                fontFamily: FONT_DISPLAY,
                fontStyle: "italic",
                fontWeight: 400,
                fontSize: { xs: "3rem", md: "5.5rem" },
                color: "#1A1A1A",
                letterSpacing: "-0.035em",
                lineHeight: 1,
              }}
            >
              Our core values.
            </Typography>
          </Box>

          {/* Values Layout — More Editorial */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(4, 1fr)" },
              gap: { xs: 6, md: 10 },
            }}
          >
            {VALUES.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.8, ease: EASE_OUT }}
              >
                <Box
                  sx={{
                    transition: "transform 0.4s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                    },
                  }}
                >
                  {/* Roman numeral */}
                  <Typography
                    sx={{
                      fontFamily: FONT_MONO,
                      fontSize: "0.7rem",
                      letterSpacing: "0.25em",
                      color: "#A0A0A0",
                      mb: 3,
                      textTransform: "uppercase",
                    }}
                  >
                    {v.roman}
                  </Typography>

                  {/* Title */}
                  <Typography
                    sx={{
                      fontFamily: FONT_DISPLAY,
                      fontStyle: "italic",
                      fontSize: { xs: "1.6rem", md: "1.9rem" },
                      fontWeight: 400,
                      color: "#1F1F1F",
                      mb: 2,
                      letterSpacing: "-0.015em",
                      lineHeight: 1.1,
                    }}
                  >
                    {v.title}
                  </Typography>

                  {/* Body text */}
                  <Typography
                    sx={{
                      fontFamily: FONT_BODY,
                      fontSize: "0.95rem",
                      color: "#6E6E6E",
                      lineHeight: 1.8,
                    }}
                  >
                    {v.text}
                  </Typography>
                </Box>
              </motion.div>
            ))}
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   PAGE ROOT
══════════════════════════════════════════════════════════════════════ */
export function AboutPageClient() {
  return (
    <Box sx={{ fontFamily: FONT_BODY, background: T.offwhite }}>
      <HorizontalScrollSection />
      <FoundersSection />
    </Box>
  );
}
