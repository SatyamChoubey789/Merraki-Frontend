"use client";

import { useState, useRef, useCallback } from "react";
import { Box, Typography } from "@mui/material";
import {
  ShowChart as BreakevenIcon,
  Rocket as ValuationIcon,
  PieChart as MarginIcon,
  Speed as RunwayIcon,
  Download as DownloadIcon,
} from "@mui/icons-material";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { BreakevenCalculator }    from "./BreakevenCalculator";
import { ValuationCalculator }    from "./ValuationCalculator";
import { ProfitMarginCalculator } from "./ProfitMarginCalculator";
import { RunwayCalculator }       from "./RunwayCalculator";

const T = {
  white:   '#FFFFFF',
  bg:      '#F7F8FA',
  ink:     '#0A0A0F',
  inkMuted:'#5A6478',
  inkFaint:'#A0A0AE',
  border:  'rgba(10,10,20,0.08)',
  blue:    '#1D4ED8',
  blueBdr: 'rgba(29,78,216,0.18)',
};

const FONT_SANS = '"DM Sans", system-ui, sans-serif';
const FONT_MONO = '"DM Mono", ui-monospace, monospace';
const EASE = [0.16, 1, 0.3, 1] as const;

const TABS = [
  { label: "Breakeven",  short: "B/E",    icon: <BreakevenIcon sx={{ fontSize: '0.9rem' }} /> },
  { label: "Valuation",  short: "Val",    icon: <ValuationIcon sx={{ fontSize: '0.9rem' }} /> },
  { label: "Margins",    short: "Margin", icon: <MarginIcon    sx={{ fontSize: '0.9rem' }} /> },
  { label: "Runway",     short: "Run",    icon: <RunwayIcon    sx={{ fontSize: '0.9rem' }} /> },
];

const panelVariants: Variants = {
  enter:  { opacity: 0, y: 8 },
  center: { opacity: 1, y: 0, transition: { duration: 0.25, ease: EASE } },
  exit:   { opacity: 0,       transition: { duration: 0.12 } },
};

export function CalculatorsPageClient() {
  const [activeTab, setActiveTab] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);

  const handleDownload = useCallback(async () => {
    if (typeof window === "undefined" || !panelRef.current) return;
    const html2pdf = (await import("html2pdf.js" as any)).default;
    html2pdf()
      .set({
        margin: 6,
        filename: `${TABS[activeTab].label.toLowerCase()}-calculator.pdf`,
        image: { type: "jpeg", quality: 0.96 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "landscape" },
      })
      .from(panelRef.current)
      .save();
  }, [activeTab]);

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      // Desktop: full viewport height; mobile: natural height
      height: { md: '100vh' },
      minHeight: { xs: 'auto', md: '100vh' },
      background: T.bg,
      fontFamily: FONT_SANS,
      overflow: 'hidden',
      '@media (max-width:899px)': { overflow: 'visible', height: 'auto' },
    }}>

      {/* ── Nav ── */}
      <Box sx={{
        flexShrink: 0,
        background: T.white,
        borderBottom: `1px solid ${T.border}`,
        px: { xs: 1.5, md: 3 },
        height: { xs: 48, md: 50 },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 1,
      }}>
        {/* Tabs */}
        <Box sx={{ display: 'flex', gap: { xs: 0.25, md: 0.5 }, overflowX: 'auto',
          '&::-webkit-scrollbar': { display: 'none' },
        }}>
          {TABS.map((tab, i) => (
            <Box
              key={tab.label}
              component="button"
              onClick={() => setActiveTab(i)}
              sx={{
                display: 'flex', alignItems: 'center', gap: 0.625,
                px: { xs: 1.25, md: 1.75 }, py: 0.875,
                borderRadius: '6px',
                border: `1px solid ${i === activeTab ? T.blueBdr : 'transparent'}`,
                background: i === activeTab ? `${T.blue}08` : 'transparent',
                cursor: 'pointer', outline: 'none', flexShrink: 0,
                transition: 'all 0.15s',
                '&:hover': { background: i === activeTab ? `${T.blue}08` : 'rgba(10,10,20,0.04)' },
              }}
            >
              <Box sx={{ color: i === activeTab ? T.blue : T.inkFaint, display: 'flex' }}>
                {tab.icon}
              </Box>
              {/* Full label on md+, short on xs */}
              <Typography sx={{
                fontFamily: FONT_SANS, fontWeight: i === activeTab ? 600 : 500,
                fontSize: '0.8rem',
                color: i === activeTab ? T.ink : T.inkMuted,
                letterSpacing: '-0.01em',
                display: { xs: 'none', sm: 'block' },
              }}>
                {tab.label}
              </Typography>
              <Typography sx={{
                fontFamily: FONT_SANS, fontWeight: i === activeTab ? 600 : 500,
                fontSize: '0.75rem',
                color: i === activeTab ? T.ink : T.inkMuted,
                display: { xs: 'block', sm: 'none' },
              }}>
                {tab.short}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* PDF */}
        <Box
          component="button"
          onClick={handleDownload}
          sx={{
            display: 'flex', alignItems: 'center', gap: 0.625,
            px: { xs: 1.25, md: 1.5 }, py: 0.875,
            borderRadius: '6px',
            border: `1px solid ${T.blueBdr}`,
            background: `${T.blue}07`,
            cursor: 'pointer', outline: 'none', flexShrink: 0,
            transition: 'all 0.15s',
            '&:hover': { background: `${T.blue}12` },
          }}
        >
          <DownloadIcon sx={{ fontSize: '0.85rem', color: T.blue }} />
          <Typography sx={{
            fontFamily: FONT_SANS, fontWeight: 600,
            fontSize: '0.75rem', color: T.blue,
            display: { xs: 'none', sm: 'block' },
          }}>
            PDF
          </Typography>
        </Box>
      </Box>

      {/* ── Panel ── */}
      <Box
        ref={panelRef}
        sx={{
          flex: 1, overflow: 'hidden', position: 'relative',
          '@media (max-width:899px)': { overflow: 'visible' },
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={panelVariants}
            initial="enter"
            animate="center"
            exit="exit"
            style={{ height: '100%' }}
          >
            <Box sx={{
              height: '100%',
              '@media (max-width:899px)': { height: 'auto' },
            }}>
              {activeTab === 0 && <BreakevenCalculator    />}
              {activeTab === 1 && <ValuationCalculator    />}
              {activeTab === 2 && <ProfitMarginCalculator />}
              {activeTab === 3 && <RunwayCalculator       />}
            </Box>
          </motion.div>
        </AnimatePresence>
      </Box>
    </Box>
  );
}