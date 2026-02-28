"use client";

import { useState } from "react";
import { Box, Container, Typography, Tab, Tabs } from "@mui/material";
import {
  ShowChart as BreakevenIcon,
  Rocket as ValuationIcon,
  PieChart as MarginIcon,
  Speed as RunwayIcon,
} from "@mui/icons-material";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { colorTokens, shadowTokens } from "@/theme";
import { SectionLabel } from "@/components/ui";
import { BreakevenCalculator } from "./BreakevenCalculator";
import { ValuationCalculator } from "./ValuationCalculator";
import { ProfitMarginCalculator } from "./ProfitMarginCalculator";
import { RunwayCalculator } from "./RunwayCalculator";

const TABS = [
  {
    label: "Breakeven",
    icon: <BreakevenIcon />,
    description: "Units, revenue & month to breakeven",
    color: colorTokens.financeBlue[500],
  },
  {
    label: "Valuation",
    icon: <ValuationIcon />,
    description: "5-year forecast with present value",
    color: "#8B5CF6",
  },
  {
    label: "Profit Margin",
    icon: <MarginIcon />,
    description: "Gross, operating & net margins",
    color: colorTokens.success.main,
  },
  {
    label: "Runway",
    icon: <RunwayIcon />,
    description: "How long your cash will last",
    color: colorTokens.warning.main,
  },
];

const pageVariants: Variants = {
  enter: { opacity: 0, y: 16 },
  center: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
  exit: { opacity: 0, y: -16, transition: { duration: 0.25 } },
};

export function CalculatorsPageClient() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <Box
      sx={{
        pt: { xs: 4, md: 6 },
        pb: 12,
        minHeight: "100vh",
        background: `linear-gradient(180deg, ${colorTokens.slate[50]} 0%, ${colorTokens.white} 100%)`,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          background: `linear-gradient(180deg, ${colorTokens.darkNavy[900]} 0%, ${colorTokens.darkNavy[800]} 100%)`,
          pt: { xs: 8, md: 12 },
          pb: { xs: 6, md: 8 },
          mb: 0,
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
              radial-gradient(ellipse at 80% 30%, rgba(139,92,246,0.1) 0%, transparent 50%)
            `,
            pointerEvents: "none",
          }}
        />
        <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <SectionLabel text="Free Financial Tools" color="light" />
            <Typography
              variant="h1"
              sx={{
                mt: 2,
                mb: 2,
                color: "#fff",
                fontWeight: 800,
                maxWidth: 700,
              }}
            >
              Calculators Built for{" "}
              <Box
                component="span"
                sx={{
                  background: `linear-gradient(135deg, ${colorTokens.financeBlue[300]}, #A78BFA)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Real Founders
              </Box>
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{
                color: "rgba(255,255,255,0.55)",
                maxWidth: 520,
                lineHeight: 1.75,
              }}
            >
              Instant calculations. Live charts. No spreadsheet needed. Built
              from the same models our experts use with clients.
            </Typography>
          </motion.div>
        </Container>

        {/* Tab bar — attached to bottom of header */}
        <Container
          maxWidth="xl"
          sx={{ position: "relative", zIndex: 1, mt: 5 }}
        >
          <Tabs
            value={activeTab}
            onChange={(_, v) => setActiveTab(v)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              "& .MuiTabs-root": { overflow: "visible" },
              "& .MuiTabs-indicator": { display: "none" },
              "& .MuiTabs-flexContainer": { gap: 1.5 },
            }}
          >
            {TABS.map((tab, i) => (
              <Tab
                key={tab.label}
                label={
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.25,
                      py: 0.5,
                    }}
                  >
                    <Box
                      sx={{
                        color:
                          activeTab === i
                            ? tab.color
                            : "rgba(255,255,255,0.45)",
                        display: "flex",
                        transition: "color 0.2s",
                        "& svg": { fontSize: "1.125rem" },
                      }}
                    >
                      {tab.icon}
                    </Box>
                    <Box sx={{ textAlign: "left" }}>
                      <Typography
                        sx={{
                          fontFamily: "var(--font-display)",
                          fontWeight: activeTab === i ? 700 : 500,
                          fontSize: "0.9375rem",
                          color:
                            activeTab === i ? "#fff" : "rgba(255,255,255,0.55)",
                          lineHeight: 1.2,
                          transition: "all 0.2s",
                          textTransform: "none",
                        }}
                      >
                        {tab.label}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "0.7rem",
                          color: "rgba(255,255,255,0.3)",
                          fontFamily: "var(--font-body)",
                          lineHeight: 1.3,
                          display: { xs: "none", sm: "block" },
                          textTransform: "none",
                          fontWeight: 400,
                        }}
                      >
                        {tab.description}
                      </Typography>
                    </Box>
                  </Box>
                }
                sx={{
                  px: 2.5,
                  py: 1.5,
                  borderRadius: "14px 14px 0 0",
                  minHeight: "auto",
                  backgroundColor:
                    activeTab === i
                      ? colorTokens.white
                      : "rgba(255,255,255,0.05)",
                  border: "1px solid",
                  borderColor:
                    activeTab === i
                      ? colorTokens.slate[100]
                      : "rgba(255,255,255,0.08)",
                  borderBottom:
                    activeTab === i
                      ? `1px solid ${colorTokens.white}`
                      : undefined,
                  transition: "all 0.25s ease",
                  "&:hover": {
                    backgroundColor:
                      activeTab === i
                        ? colorTokens.white
                        : "rgba(255,255,255,0.09)",
                  },
                }}
              />
            ))}
          </Tabs>
        </Container>
      </Box>

      {/* Calculator Panel */}
      <Box
        sx={{
          backgroundColor: colorTokens.white,
          borderTop: `1px solid ${colorTokens.slate[100]}`,
          boxShadow: shadowTokens.lg,
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
          >
            {activeTab === 0 && <BreakevenCalculator />}
            {activeTab === 1 && <ValuationCalculator />}
            {activeTab === 2 && <ProfitMarginCalculator />}
            {activeTab === 3 && <RunwayCalculator />}
          </motion.div>
        </AnimatePresence>
      </Box>
    </Box>
  );
}
