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

const T = {
  white:     "#FFFFFF",
  offwhite:  "#F9F8F5",
  cream:     "#F0EDE6",
  parchment: "#E8E4DA",
  ink:       "#0C0E12",
  inkMid:    "#2E3440",
  inkMuted:  "#64748B",
  inkFaint:  "#94A3B8",
  inkGhost:  "#CBD5E1",
  border:    "#E2DED5",
  borderMd:  "#C8C3B8",
  gold:      "#B8922A",
  goldMid:   "#C9A84C",
  goldLight: "#DDB96A",
  goldGlow:  "rgba(184,146,42,0.07)",
  goldBdr:   "rgba(184,146,42,0.18)",
  accents: [
    { line: "#B8922A", glow: "rgba(184,146,42,0.055)" },
    { line: "#8B6F3E", glow: "rgba(139,111,62,0.055)" },
    { line: "#5C7A5C", glow: "rgba(92,122,92,0.055)"  },
    { line: "#8B5E3C", glow: "rgba(139,94,60,0.055)"  },
  ],
};

const FONT_SERIF = '"Instrument Serif", "Playfair Display", Georgia, serif';
const FONT_SANS  = '"DM Sans", "Mona Sans", system-ui, sans-serif';
const FONT_MONO  = '"DM Mono", "JetBrains Mono", ui-monospace, monospace';
const EASE_EXPO  = [0.16, 1, 0.3, 1] as const;

const TABS = [
  { label: "Breakeven",     icon: <BreakevenIcon />, sub: "Units · Revenue · Month",       glyph: "01" },
  { label: "Valuation",     icon: <ValuationIcon />, sub: "5-yr forecast · Present value", glyph: "02" },
  { label: "Profit Margin", icon: <MarginIcon />,    sub: "Gross · Operating · Net",       glyph: "03" },
  { label: "Runway",        icon: <RunwayIcon />,    sub: "Cash burn · Months left",       glyph: "04" },
];

const TICKER = [
  "BREAKEVEN ANALYSIS","RUNWAY CALCULATOR","PROFIT MARGIN TOOL",
  "VALUATION MODEL","CASH FLOW","UNIT ECONOMICS","SaaS METRICS","BURN RATE",
];

const panelVariants: Variants = {
  enter:  { opacity: 0, y: 24, filter: "blur(5px)" },
  center: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.48, ease: EASE_EXPO } },
  exit:   { opacity: 0, y: -14, filter: "blur(3px)", transition: { duration: 0.22, ease: "easeIn" } },
};

function Stat({ value, label, first }: { value: string; label: string; first?: boolean }) {
  return (
    <Box sx={{ pl: first ? 0 : 3, pr: 3, borderLeft: first ? "none" : `1px solid ${T.border}` }}>
      <Typography sx={{ fontFamily: FONT_MONO, fontSize: "1.1rem", fontWeight: 600, color: T.ink, lineHeight: 1, letterSpacing: "-0.02em", mb: 0.4 }}>
        {value}
      </Typography>
      <Typography sx={{ fontFamily: FONT_MONO, fontSize: "0.52rem", letterSpacing: "0.14em", color: T.inkFaint, textTransform: "uppercase" }}>
        {label}
      </Typography>
    </Box>
  );
}

function TickerStrip() {
  const all = [...TICKER, ...TICKER, ...TICKER];
  return (
    <Box sx={{
      overflow: "hidden",
      borderTop: `1px solid ${T.border}`,
      borderBottom: `1px solid ${T.border}`,
      background: T.cream,
      py: "8px",
      position: "relative",
      "&::before, &::after": { content: '""', position: "absolute", top: 0, bottom: 0, width: 80, zIndex: 2, pointerEvents: "none" },
      "&::before": { left: 0, background: `linear-gradient(90deg, ${T.cream}, transparent)` },
      "&::after":  { right: 0, background: `linear-gradient(270deg, ${T.cream}, transparent)` },
    }}>
      <motion.div
        animate={{ x: ["0%", "-33.33%"] }}
        transition={{ duration: 38, repeat: Infinity, ease: "linear" }}
        style={{ display: "flex", whiteSpace: "nowrap", width: "max-content" }}
      >
        {all.map((item, i) => (
          <Box key={i} component="span" sx={{
            fontFamily: FONT_MONO, fontSize: "0.55rem", letterSpacing: "0.2em",
            color: T.inkGhost, px: "22px",
            display: "inline-flex", alignItems: "center", gap: "18px",
            "&::after": { content: '"·"', color: T.goldMid, fontSize: "0.85rem", lineHeight: 0, opacity: 0.55 },
          }}>
            {item}
          </Box>
        ))}
      </motion.div>
    </Box>
  );
}

function TabBtn({ tab, index, active, onClick }: { tab: typeof TABS[0]; index: number; active: boolean; onClick: () => void }) {
  const accent = T.accents[index];
  return (
    <Box
      component="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      sx={{
        position: "relative",
        display: "flex", flexDirection: "column", alignItems: "flex-start",
        px: { xs: 2, md: 2.75 }, pt: 2, pb: 2.25,
        minWidth: { xs: 124, sm: 158 },
        flexShrink: 0,
        background: active ? T.white : "transparent",
        border: "1px solid",
        borderColor: active ? T.border : "transparent",
        borderBottom: active ? `1px solid ${T.white}` : "1px solid transparent",
        borderRadius: "12px 12px 0 0",
        cursor: "pointer",
        outline: "none",
        transition: "background 0.2s, border-color 0.2s",
        zIndex: active ? 3 : 1,
        "&:hover": {
          background: active ? T.white : T.cream,
          borderColor: T.border,
          borderBottomColor: active ? T.white : T.border,
        },
      }}
    >
      <Typography sx={{ fontFamily: FONT_MONO, fontSize: "0.47rem", letterSpacing: "0.18em", color: active ? accent.line : T.inkGhost, mb: 0.9, transition: "color 0.2s", textTransform: "uppercase" }}>
        {tab.glyph}
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.875, mb: 0.4 }}>
        <Box sx={{ color: active ? accent.line : T.inkGhost, display: "flex", transition: "color 0.2s", "& svg": { fontSize: "0.9rem" } }}>
          {tab.icon}
        </Box>
        <Typography sx={{ fontFamily: FONT_SANS, fontWeight: active ? 600 : 400, fontSize: "0.875rem", color: active ? T.ink : T.inkMuted, letterSpacing: "-0.01em", lineHeight: 1, transition: "all 0.2s", textTransform: "none", whiteSpace: "nowrap" }}>
          {tab.label}
        </Typography>
      </Box>
      <Typography sx={{ fontFamily: FONT_MONO, fontSize: "0.56rem", color: T.inkGhost, letterSpacing: "0.02em", lineHeight: 1.3, display: { xs: "none", sm: "block" }, textTransform: "none" }}>
        {tab.sub}
      </Typography>
      {active && (
        <motion.div
          layoutId="calc-bar"
          style={{
            position: "absolute", bottom: 0, left: 0, right: 0, height: 2,
            background: `linear-gradient(90deg, ${accent.line} 0%, transparent 100%)`,
            borderRadius: "2px 2px 0 0",
          }}
          transition={{ type: "spring", stiffness: 440, damping: 38 }}
        />
      )}
    </Box>
  );
}

export function CalculatorsPageClient() {
  const [activeTab, setActiveTab] = useState(0);
  const headerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({ target: headerRef, offset: ["start start", "end start"] });
  const rawY = useTransform(scrollYProgress, [0, 1], [0, 44]);
  const rawO = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const sY   = useSpring(rawY, { stiffness: 80, damping: 22 });
  const sO   = useSpring(rawO, { stiffness: 80, damping: 22 });

  const accent = T.accents[activeTab];

  return (
    <Box sx={{ minHeight: "100vh", background: T.offwhite, fontFamily: FONT_SANS }}>

      {/* HEADER */}
      <Box ref={headerRef} sx={{ background: T.white, borderBottom: `1px solid ${T.border}`, pt: { xs: 12, md: 16 }, pb: 0, position: "relative", overflow: "hidden" }}>

        {/* Warm grid */}
        <Box sx={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: `linear-gradient(${T.border} 1px, transparent 1px), linear-gradient(90deg, ${T.border} 1px, transparent 1px)`, backgroundSize: "64px 64px", opacity: 0.42 }} />

        {/* Gold glow — top centre */}
        <Box sx={{ position: "absolute", width: "70vw", height: "46vw", top: "-26vw", left: "15vw", borderRadius: "50%", background: `radial-gradient(ellipse, ${T.goldGlow} 0%, transparent 70%)`, pointerEvents: "none" }} />

        {/* Grain */}
        <Box sx={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.022, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundSize: "160px" }} />

        {/* Ghost sigma */}
        <Box sx={{ position: "absolute", right: { xs: -30, md: -60 }, bottom: -80, fontFamily: FONT_SERIF, fontStyle: "italic", fontSize: { xs: "40vw", md: "26vw" }, fontWeight: 400, color: "rgba(12,14,18,0.025)", lineHeight: 1, pointerEvents: "none", userSelect: "none", letterSpacing: "-0.06em" }}>
          ∑
        </Box>

        <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1 }}>
          <motion.div style={{ y: sY, opacity: sO }}>

            {/* Eyebrow */}
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, ease: EASE_EXPO }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.75, mb: 3.5 }}>
               
              </Box>
            </motion.div>

            {/* Headline */}
            <motion.div initial={{ opacity: 0, y: 38 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.78, delay: 0.07, ease: EASE_EXPO }}>
              <Box sx={{ mb: 3.5, lineHeight: 1 }}>
                <Typography component="div" sx={{ fontFamily: FONT_SERIF, fontStyle: "italic", fontWeight: 400, fontSize: { xs: "2.75rem", sm: "4rem", md: "5.5rem", lg: "6.75rem" }, lineHeight: 0.95, letterSpacing: "-0.035em", color: T.ink, mb: 0.5 }}>
                  Calculators built
                </Typography>
                <Typography component="div" sx={{ fontFamily: FONT_SERIF, fontStyle: "italic", fontWeight: 400, fontSize: { xs: "2.75rem", sm: "4rem", md: "5.5rem", lg: "6.75rem" }, lineHeight: 0.95, letterSpacing: "-0.035em", background: `linear-gradient(115deg, ${T.goldLight} 0%, ${T.gold} 52%, ${T.goldMid} 100%)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  for real founders.
                </Typography>
              </Box>
            </motion.div>

            {/* Sub + stats */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.2, ease: EASE_EXPO }}>
              <Box sx={{ display: "flex", alignItems: { md: "flex-end" }, justifyContent: "space-between", flexWrap: "wrap", gap: 3, mb: 6 }}>
                <Typography sx={{ fontFamily: FONT_SANS, fontSize: { xs: "0.875rem", md: "1rem" }, color: T.inkMuted, lineHeight: 1.78, maxWidth: 390 }}>
                  Instant calculations. Live charts. No spreadsheet needed.
                  Built from the same models our experts use with clients.
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", rowGap: 1.5 }}>
                  <Stat value="84k+"    label="Calculations" first />
                  <Stat value="4.2 hrs" label="Avg time saved" />
                  <Stat value="4"       label="Models" />
                  <Stat value="Free"    label="Always" />
                </Box>
              </Box>
            </motion.div>

          </motion.div>

          {/* Tab row */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.32, ease: EASE_EXPO }}>
            <Box role="tablist" sx={{ display: "flex", gap: "4px", alignItems: "flex-end", overflowX: "auto", msOverflowStyle: "none", scrollbarWidth: "none", "&::-webkit-scrollbar": { display: "none" } }}>
              {TABS.map((tab, i) => (
                <TabBtn key={tab.label} tab={tab} index={i} active={activeTab === i} onClick={() => setActiveTab(i)} />
              ))}
              <Box sx={{ flex: 1, borderBottom: `1px solid ${T.border}` }} />
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* TICKER */}
      <TickerStrip />

      {/* CALCULATOR PANEL */}
      <Box sx={{
        background: T.white,
        position: "relative",
        borderBottom: `1px solid ${T.border}`,
        "&::before": {
          content: '""', position: "absolute", top: 0, left: 0,
          width: "2px", height: "100%",
          background: accent.line, opacity: 0.65,
          transition: "background 0.35s ease", zIndex: 2,
        },
      }}>
        {/* Panel glow */}
        <Box sx={{ position: "absolute", inset: 0, pointerEvents: "none", background: accent.glow, transition: "background 0.5s ease" }} />

        <AnimatePresence mode="wait">
          <motion.div key={activeTab} variants={panelVariants} initial="enter" animate="center" exit="exit">
            {activeTab === 0 && <BreakevenCalculator />}
            {activeTab === 1 && <ValuationCalculator />}
            {activeTab === 2 && <ProfitMarginCalculator />}
            {activeTab === 3 && <RunwayCalculator />}
          </motion.div>
        </AnimatePresence>
      </Box>

      {/* FOOTER STRIP */}
      <Box sx={{ background: T.cream, borderTop: `1px solid ${T.border}`, py: 2.25, px: { xs: 3, md: 5 }, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 2 }}>
        <Typography sx={{ fontFamily: FONT_MONO, fontSize: "0.53rem", letterSpacing: "0.13em", color: T.inkFaint, textTransform: "uppercase" }}>
          Built from the same models our experts use with clients
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box sx={{ width: 5, height: 5, borderRadius: "50%", background: T.goldMid, boxShadow: `0 0 7px ${T.goldMid}`, animation: "sPulse 2.8s ease-in-out infinite", "@keyframes sPulse": { "0%,100%": { opacity: 1 }, "50%": { opacity: 0.25 } } }} />
          <Typography sx={{ fontFamily: FONT_MONO, fontSize: "0.53rem", letterSpacing: "0.13em", color: T.inkFaint }}>
            All systems operational
          </Typography>
        </Box>
      </Box>

    </Box>
  );
}