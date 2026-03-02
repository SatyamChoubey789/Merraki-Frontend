"use client";

import { useState, useRef } from "react";
import { Box, Container, Typography } from "@mui/material";
import {
  ShowChart as BreakevenIcon,
  Rocket as ValuationIcon,
  PieChart as MarginIcon,
  Speed as RunwayIcon,
} from "@mui/icons-material";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
  Variants,
} from "framer-motion";
import { BreakevenCalculator } from "./BreakevenCalculator";
import { ValuationCalculator } from "./ValuationCalculator";
import { ProfitMarginCalculator } from "./ProfitMarginCalculator";
import { RunwayCalculator } from "./RunwayCalculator";

/* ------------------------------------------------------------------ */
/* BLUISH-WHITE LIGHT MODE THEME */
/* ------------------------------------------------------------------ */

const T = {
  /* surfaces */
  white: "#FFFFFF",
  offwhite: "#F6F9FF",
  cream: "#EEF4FF",
  parchment: "#E6EEFF",

  /* text */
  ink: "#0B1220",
  inkMid: "#1E293B",
  inkMuted: "#475569",
  inkFaint: "#94A3B8",
  inkGhost: "#CBD5E1",

  /* borders */
  border: "#E2E8F0",
  borderMd: "#CBD5E1",

  /* primary blue system */
  blue: "#2563EB",
  blueMid: "#3B82F6",
  blueLight: "#93C5FD",
  blueGlow: "rgba(37,99,235,0.08)",
  blueBdr: "rgba(37,99,235,0.18)",

  /* tab accents */
  accents: [
    { line: "#2563EB", glow: "rgba(37,99,235,0.06)" },
    { line: "#3B82F6", glow: "rgba(59,130,246,0.06)" },
    { line: "#0EA5E9", glow: "rgba(14,165,233,0.06)" },
    { line: "#6366F1", glow: "rgba(99,102,241,0.06)" },
  ],
};

const FONT_SERIF = '"Instrument Serif", "Playfair Display", Georgia, serif';
const FONT_SANS = '"DM Sans", "Mona Sans", system-ui, sans-serif';
const FONT_MONO = '"DM Mono", "JetBrains Mono", ui-monospace, monospace';
const EASE_EXPO = [0.16, 1, 0.3, 1] as const;

/* ------------------------------------------------------------------ */

const TABS = [
  { label: "Breakeven", icon: <BreakevenIcon />, sub: "Units · Revenue · Month", glyph: "01" },
  { label: "Valuation", icon: <ValuationIcon />, sub: "5-yr forecast · Present value", glyph: "02" },
  { label: "Profit Margin", icon: <MarginIcon />, sub: "Gross · Operating · Net", glyph: "03" },
  { label: "Runway", icon: <RunwayIcon />, sub: "Cash burn · Months left", glyph: "04" },
];

const panelVariants: Variants = {
  enter: { opacity: 0, y: 24, filter: "blur(5px)" },
  center: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.48, ease: EASE_EXPO } },
  exit: { opacity: 0, y: -14, filter: "blur(3px)", transition: { duration: 0.22, ease: "easeIn" } },
};

/* ------------------------------------------------------------------ */

function Stat({ value, label, first }: { value: string; label: string; first?: boolean }) {
  return (
    <Box sx={{ pl: first ? 0 : 3, pr: 3, borderLeft: first ? "none" : `1px solid ${T.border}` }}>
      <Typography
        sx={{
          fontFamily: FONT_MONO,
          fontSize: "1.1rem",
          fontWeight: 600,
          color: T.ink,
          lineHeight: 1,
          mb: 0.4,
        }}
      >
        {value}
      </Typography>
      <Typography
        sx={{
          fontFamily: FONT_MONO,
          fontSize: "0.52rem",
          letterSpacing: "0.14em",
          color: T.inkFaint,
          textTransform: "uppercase",
        }}
      >
        {label}
      </Typography>
    </Box>
  );
}

/* ------------------------------------------------------------------ */

function TabBtn({ tab, index, active, onClick }: any) {
  const accent = T.accents[index];

  return (
    <Box
      component="button"
      onClick={onClick}
      sx={{
        px: 3,
        pt: 2,
        pb: 2.25,
        minWidth: 150,
        background: active ? "#FFFFFF" : "transparent",
        border: "1px solid",
        borderColor: active ? T.blueBdr : "transparent",
        borderBottom: active ? `1px solid #FFFFFF` : "1px solid transparent",
        borderRadius: "12px 12px 0 0",
        cursor: "pointer",
        transition: "all 0.2s",
        "&:hover": {
          background: active ? "#FFFFFF" : T.offwhite,
          borderColor: T.blueBdr,
        },
      }}
    >
      <Typography
        sx={{
          fontFamily: FONT_MONO,
          fontSize: "0.47rem",
          letterSpacing: "0.18em",
          color: active ? accent.line : T.inkGhost,
          mb: 0.9,
        }}
      >
        {tab.glyph}
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Box sx={{ color: active ? accent.line : T.inkGhost }}>
          {tab.icon}
        </Box>
        <Typography
          sx={{
            fontFamily: FONT_SANS,
            fontWeight: active ? 600 : 500,
            fontSize: "0.9rem",
            color: active ? T.ink : T.inkMuted,
          }}
        >
          {tab.label}
        </Typography>
      </Box>
    </Box>
  );
}

/* ------------------------------------------------------------------ */

export function CalculatorsPageClient() {
  const [activeTab, setActiveTab] = useState(0);
  const headerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({ target: headerRef, offset: ["start start", "end start"] });
  const rawY = useTransform(scrollYProgress, [0, 1], [0, 40]);
  const rawO = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const sY = useSpring(rawY, { stiffness: 80, damping: 22 });
  const sO = useSpring(rawO, { stiffness: 80, damping: 22 });

  const accent = T.accents[activeTab];

  return (
    <Box sx={{ minHeight: "100vh", background: T.offwhite }}>

      {/* HEADER */}
      <Box
        ref={headerRef}
        sx={{
          background: T.white,
          borderBottom: `1px solid ${T.border}`,
          pt: 16,
          position: "relative",
          overflow: "hidden",
        }}
      >

        {/* Top blue glow */}
        <Box
          sx={{
            position: "absolute",
            width: "70vw",
            height: "46vw",
            top: "-26vw",
            left: "15vw",
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse at top, rgba(59,130,246,0.10) 0%, transparent 70%)",
          }}
        />

        <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1 }}>
          <motion.div style={{ y: sY, opacity: sO }}>
            <Typography
              sx={{
                fontFamily: FONT_SERIF,
                fontStyle: "italic",
                fontSize: { xs: "3rem", md: "6rem" },
                lineHeight: 0.95,
                color: T.ink,
              }}
            >
              Calculators built
            </Typography>

            <Typography
              sx={{
                fontFamily: FONT_SERIF,
                fontStyle: "italic",
                fontSize: { xs: "3rem", md: "6rem" },
                lineHeight: 0.95,
                background: `linear-gradient(115deg, ${T.blueLight}, ${T.blue})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              for real founders.
            </Typography>
          </motion.div>

          {/* Tabs */}
          <Box sx={{ display: "flex", gap: 1, mt: 6 }}>
            {TABS.map((tab, i) => (
              <TabBtn
                key={tab.label}
                tab={tab}
                index={i}
                active={activeTab === i}
                onClick={() => setActiveTab(i)}
              />
            ))}
          </Box>
        </Container>
      </Box>

      {/* PANEL */}
      <Box
        sx={{
          background: T.white,
          borderTop: `1px solid ${T.border}`,
          position: "relative",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background: accent.glow,
          }}
        />

        <AnimatePresence mode="wait">
          <motion.div key={activeTab} variants={panelVariants} initial="enter" animate="center" exit="exit">
            {activeTab === 0 && <BreakevenCalculator />}
            {activeTab === 1 && <ValuationCalculator />}
            {activeTab === 2 && <ProfitMarginCalculator />}
            {activeTab === 3 && <RunwayCalculator />}
          </motion.div>
        </AnimatePresence>
      </Box>

      {/* FOOTER */}
      <Box
        sx={{
          background: T.offwhite,
          borderTop: `1px solid ${T.border}`,
          py: 2,
          px: 4,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Typography sx={{ fontFamily: FONT_MONO, fontSize: "0.6rem", color: T.inkFaint }}>
          Built from the same models our experts use
        </Typography>

        <Typography sx={{ fontFamily: FONT_MONO, fontSize: "0.6rem", color: T.inkFaint }}>
          All systems operational
        </Typography>
      </Box>
    </Box>
  );
}