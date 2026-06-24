"use client";

import { Box, Container, Typography } from "@mui/material";
import { motion } from "framer-motion";
import Link from "next/link";

import {
  ShowChart as BreakevenIcon,
  Rocket as ValuationIcon,
  PieChart as MarginIcon,
  Speed as RunwayIcon,
  ArrowForward as ArrowIcon,
} from "@mui/icons-material";

import { T, SANS, EASE } from "@/components/sections/calculators/Calcshared";

const ACCENT = "#253957";

const CALCS = [
  {
    id: "breakeven",
    href: "/calculators/breakeven",
    Icon: BreakevenIcon,
    title: "Break-Even",
    sub: "Calculator",
    desc: "Find the exact month, units, and revenue needed to turn profitable. Model growth scenarios and see your cumulative profit curve.",
    tags: ["Units", "Revenue", "Profitability"],
  },
  {
    id: "valuation",
    href: "/calculators/valuation",
    Icon: ValuationIcon,
    title: "Valuation",
    sub: "Calculator",
    desc: "Get investor-grade DCF and EBITDA multiple valuations. Model your terminal value, discount rates, and blended valuation range.",
    tags: ["DCF", "EBITDA", "Terminal Value"],
  },
  {
    id: "margins",
    href: "/calculators/margins",
    Icon: MarginIcon,
    title: "Profit Margin",
    sub: "Calculator",
    desc: "Break down gross, operating, and net margins. See your full P&L waterfall and understand where margin is being compressed.",
    tags: ["Gross Margin", "EBIT", "Net Margin"],
  },
  {
    id: "runway",
    href: "/calculators/runway",
    Icon: RunwayIcon,
    title: "Runway",
    sub: "Calculator",
    desc: "Calculate how long your cash lasts at current burn. Model revenue growth against burn to find your cash-out month.",
    tags: ["Burn Rate", "Cash Flow", "Months"],
  },
];

export default function CalculatorsSelectionPage() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        fontFamily: SANS,
        background: T.bluePale,
        pt: { xs: "72px", md: "88px" },
        pb: { xs: 8, md: 10 },
      }}
    >
      <Container maxWidth="xl">
        {/* HERO */}
        <Box
          sx={{
            textAlign: "center",
            mb: { xs: 7, md: 8 },
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: EASE }}
          >
            <Typography
              sx={{
                fontFamily: SANS,
                fontWeight: 800,
                fontSize: { xs: "2.5rem", md: "4rem" },
                color: T.ink,
                letterSpacing: "-0.05em",
                lineHeight: 1,
              }}
            >
              Financial{" "}
              <Box
                component="span"
                sx={{
                  color: ACCENT,
                  fontWeight: 300,
                }}
              >
                Calculators
              </Box>
            </Typography>

            <Typography
              sx={{
                mt: 3,
                maxWidth: 620,
                mx: "auto",
                color: T.inkMuted,
                lineHeight: 1.8,
                fontSize: "1rem",
              }}
            >
              Forecast runway, analyse margins, model valuation, and calculate
              break-even points with clean investor-grade visuals.
            </Typography>
          </motion.div>
        </Box>

        {/* GRID */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
              xl: "repeat(4,1fr)",
            },
            gap: 2,
          }}
        >
          {CALCS.map((calc, i) => (
            <motion.div
              key={calc.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: i * 0.08,
                duration: 0.45,
                ease: EASE,
              }}
            >
              <Link
                href={calc.href}
                style={{
                  textDecoration: "none",
                }}
              >
                <Box
                  sx={{
                    height: "100%",
                    background: T.bg,
                    borderRadius: "16px",
                    border: `1px solid ${T.border}`,
                    p: 2.5,
                    transition: "all 0.22s ease",
                    display: "flex",
                    flexDirection: "column",

                    "&:hover": {
                      transform: "translateY(-4px)",
                      borderColor: T.blueBdr,
                      boxShadow: `0 18px 40px ${T.blueGlow}`,
                    },
                  }}
                >
                  {/* ICON */}
                  <Box
                    sx={{
                      width: 52,
                      height: 52,
                      borderRadius: "14px",
                      background: T.blueDim,
                      border: `1px solid ${T.blueBdr}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 3,
                    }}
                  >
                    <calc.Icon
                      sx={{
                        color: ACCENT,
                        fontSize: "1.4rem",
                      }}
                    />
                  </Box>

                  {/* TITLE */}
                  <Typography
                    sx={{
                      fontSize: "1.35rem",
                      fontWeight: 800,
                      color: T.ink,
                    }}
                  >
                    {calc.title}
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: "1.35rem",
                      fontWeight: 300,
                      color: ACCENT,
                      mb: 2,
                    }}
                  >
                    {calc.sub}
                  </Typography>

                  {/* DESC */}
                  <Typography
                    sx={{
                      fontSize: "0.92rem",
                      color: T.inkMuted,
                      lineHeight: 1.75,
                      mb: 3,
                      flex: 1,
                    }}
                  >
                    {calc.desc}
                  </Typography>

                  {/* TAGS */}
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 0.8,
                    }}
                  >
                    {calc.tags.map((tag) => (
                      <Box
                        key={tag}
                        sx={{
                          px: 1.15,
                          py: 0.45,
                          borderRadius: "999px",
                          background: T.blueDim,
                          border: `1px solid ${T.blueBdr}`,
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: "0.66rem",
                            fontWeight: 700,
                            color: ACCENT,
                          }}
                        >
                          {tag}
                        </Typography>
                      </Box>
                    ))}
                  </Box>

                  {/* CTA */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      pt: 2,
                      mt: 3,
                      borderTop: `1px solid ${T.border}`,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "0.84rem",
                        fontWeight: 600,
                        color: ACCENT,
                      }}
                    >
                      Open calculator
                    </Typography>

                    <ArrowIcon
                      sx={{
                        color: ACCENT,
                        fontSize: "1.05rem",
                      }}
                    />
                  </Box>
                </Box>
              </Link>
            </motion.div>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
