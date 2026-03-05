"use client";

import { Box, Typography } from "@mui/material";
import { ArrowForward as ArrowIcon, AccessTime as TimeIcon, PictureAsPdf as PdfIcon, Star as StarIcon, Psychology as BrainIcon } from "@mui/icons-material";
import { motion } from "framer-motion";

const T = {
  bg:        "#0D1B2E",
  bgGlow1:   "rgba(99,102,241,0.18)",
  bgGlow2:   "rgba(236,72,153,0.10)",
  white:     "#FFFFFF",
  muted:     "rgba(255,255,255,0.55)",
  faint:     "rgba(255,255,255,0.25)",
  border:    "rgba(255,255,255,0.10)",
  pill:      "rgba(99,102,241,0.25)",
  pillBdr:   "rgba(99,102,241,0.45)",
  grad:      "linear-gradient(115deg, #818CF8, #A855F7, #EC4899)",
  btn:       "linear-gradient(115deg, #7C3AED, #EC4899)",
  btnShadow: "0 8px 32px rgba(124,58,237,0.35)",
};

const SANS = '"DM Sans", system-ui, sans-serif';
const MONO = '"DM Mono", ui-monospace, monospace';
const EASE = [0.16, 1, 0.3, 1] as const;

interface Props {
  isLoading:      boolean;
  isError:        boolean;
  totalQuestions: number;
  onStart:        () => void;
}

export function TestIntroScreen({ isLoading, isError, totalQuestions, onStart }: Props) {
  return (
    <Box sx={{
      minHeight: "100vh",
      background: T.bg,
      fontFamily: SANS,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      overflow: "hidden",
      px: { xs: 3, md: 4 },
      py: { xs: 6, md: 8 },
    }}>

      {/* Background radial glows */}
      <Box sx={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: `
          radial-gradient(ellipse 70% 60% at 20% 50%, ${T.bgGlow1}, transparent),
          radial-gradient(ellipse 55% 50% at 80% 60%, ${T.bgGlow2}, transparent)
        `,
      }} />

      {/* Subtle grid texture */}
      <Box sx={{
        position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.035,
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
        `,
        backgroundSize: "48px 48px",
      }} />

      {/* Content */}
      <Box sx={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: 680, width: "100%" }}>

        {/* Pill badge */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          <Box sx={{
            display: "inline-flex", alignItems: "center", gap: 0.75,
            px: 2, py: 0.75,
            background: T.pill,
            border: `1px solid ${T.pillBdr}`,
            borderRadius: "100px",
            mb: 4,
          }}>
            <BrainIcon sx={{ fontSize: "0.85rem", color: "#A5B4FC" }} />
            <Typography sx={{
              fontFamily: MONO, fontSize: "0.7rem",
              fontWeight: 600, letterSpacing: "0.05em",
              color: "#C4B5FD",
            }}>
              Financial Personality Assessment
            </Typography>
          </Box>
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
        >
          <Typography sx={{
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: { xs: "2.5rem", sm: "3.5rem", md: "4.5rem" },
            lineHeight: 1.05,
            color: T.white,
            letterSpacing: "-0.03em",
            mb: 0.5,
          }}>
            Discover Your
          </Typography>
          <Typography sx={{
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: { xs: "2.5rem", sm: "3.5rem", md: "4.5rem" },
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            mb: 3,
            background: T.grad,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            Financial DNA
          </Typography>
        </motion.div>

        {/* Subtext */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
        >
          <Typography sx={{
            fontFamily: SANS,
            fontSize: { xs: "0.9375rem", md: "1.0625rem" },
            color: T.muted,
            lineHeight: 1.7,
            maxWidth: 520,
            mx: "auto",
            mb: 4.5,
          }}>
            {isLoading
              ? "Loading your assessment…"
              : `Take our ${totalQuestions}-question assessment and unlock personalised insights about your financial decision-making style.`
            }
          </Typography>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.3, ease: EASE }}
        >
          <Box sx={{ mb: 4 }}>
            <motion.button
              onClick={onStart}
              disabled={isLoading || isError}
              whileHover={isLoading || isError ? {} : { scale: 1.04, boxShadow: "0 12px 40px rgba(124,58,237,0.45)" }}
              whileTap={isLoading || isError ? {} : { scale: 0.97 }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "16px 36px",
                borderRadius: "14px",
                border: "none",
                background: isLoading || isError ? "rgba(255,255,255,0.08)" : T.btn,
                color: "#fff",
                cursor: isLoading || isError ? "not-allowed" : "pointer",
                boxShadow: isLoading || isError ? "none" : T.btnShadow,
                transition: "all 0.2s ease",
                outline: "none",
              }}
            >
              <span style={{ fontFamily: SANS, fontWeight: 700, fontSize: "1rem", letterSpacing: "-0.01em" }}>
                {isLoading ? "Loading…" : "Start Free Assessment"}
              </span>
              {!isLoading && <ArrowIcon sx={{ fontSize: "1.1rem" }} />}
            </motion.button>

            {isError && (
              <Typography sx={{ color: "#F87171", mt: 1.5, fontFamily: SANS, fontSize: "0.875rem" }}>
                Failed to load questions. Please refresh.
              </Typography>
            )}
          </Box>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.45, ease: EASE }}
        >
          <Box sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: { xs: 2.5, md: 4 },
            flexWrap: "wrap",
          }}>
            {[
              { icon: <TimeIcon sx={{ fontSize: "0.875rem" }} />,  label: "5 minutes"       },
              { icon: <PdfIcon  sx={{ fontSize: "0.875rem" }} />,  label: "Free PDF report" },
              { icon: <StarIcon sx={{ fontSize: "0.875rem" }} />,  label: "15,000+ taken"   },
            ].map((item) => (
              <Box key={item.label} sx={{ display: "flex", alignItems: "center", gap: 0.625 }}>
                <Box sx={{ color: T.faint }}>{item.icon}</Box>
                <Typography sx={{
                  fontFamily: SANS, fontSize: "0.8125rem",
                  color: T.muted, letterSpacing: "-0.005em",
                }}>
                  {item.label}
                </Typography>
              </Box>
            ))}
          </Box>
        </motion.div>

      </Box>
    </Box>
  );
}