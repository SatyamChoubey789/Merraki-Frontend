"use client";

import { Box, Container, Typography, Button } from "@mui/material";
import { Home as HomeIcon, ArrowForward as ArrowIcon } from "@mui/icons-material";
import { motion } from "framer-motion";
import Link from "next/link";

/* ══ MONOCHROME TOKENS (white + black only) ═════════════ */
const T = {
  bg:        "#FFFFFF",
  bgSection: "#F7F7F7",

  ink:       "#000000",
  inkMid:    "#2A2A2A",
  inkMuted:  "#555555",
  inkFaint:  "#9A9A9A",

  border:    "rgba(0,0,0,0.08)",
  borderMid: "rgba(0,0,0,0.14)",

  accent:    "#000000",
  accentSoft:"#111111",
  accentPale:"#F2F2F2",
  accentGlow:"rgba(0,0,0,0.08)",
  accentDim: "rgba(0,0,0,0.04)",

  accentGrad:"linear-gradient(135deg, #000000 0%, #2A2A2A 100%)",
};

const SANS = `"DM Sans","Mona Sans",system-ui,sans-serif`;
const MONO = `"DM Mono","JetBrains Mono",ui-monospace,monospace`;
const EASE = [0.16, 1, 0.3, 1] as const;

export default function NotFound() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${T.accentPale} 0%, ${T.bgSection} 50%, ${T.accentPale} 100%)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        fontFamily: SANS,
      }}
    >
      {/* Ambient blobs */}
      <Box
        sx={{
          position: "absolute",
          width: "60vw",
          height: "60vw",
          top: "-20vw",
          left: "-10vw",
          borderRadius: "50%",
          background: `radial-gradient(ellipse, ${T.accentGlow} 0%, transparent 60%)`,
          pointerEvents: "none",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          width: "50vw",
          height: "50vw",
          bottom: "-15vw",
          right: "-10vw",
          borderRadius: "50%",
          background: `radial-gradient(ellipse, ${T.accentDim} 0%, transparent 60%)`,
          pointerEvents: "none",
        }}
      />

      {/* Background 404 watermark */}
      <Box
        sx={{
          position: "absolute",
          right: { xs: -40, md: -80 },
          bottom: -120,
          fontSize: { xs: "40vw", md: "28vw" },
          color: "rgba(0,0,0,0.04)",
          lineHeight: 1,
          fontWeight: 800,
          fontFamily: SANS,
          userSelect: "none",
          letterSpacing: "-0.04em",
        }}
      >
        404
      </Box>

      <Container
        maxWidth="sm"
        sx={{ textAlign: "center", position: "relative", zIndex: 1 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: EASE }}
        >
          {/* Headline */}
          <Typography
            sx={{
              fontFamily: SANS,
              fontWeight: 800,
              fontSize: { xs: "2rem", md: "2.75rem" },
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              color: T.ink,
              mb: 2,
            }}
          >
            This page doesn't exist.
          </Typography>

          {/* Subtext */}
          <Typography
            sx={{
              fontFamily: SANS,
              fontWeight: 400,
              fontSize: "1rem",
              color: T.inkMuted,
              lineHeight: 1.75,
              maxWidth: 420,
              mx: "auto",
              mb: 5,
            }}
          >
            The content you're looking for may have been moved, archived, or never published.
            Let's return you somewhere useful.
          </Typography>

          {/* CTAs */}
          <Box
            sx={{
              display: "flex",
              gap: 2,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            {/* Primary */}
            <motion.div
              whileHover={{ scale: 1.03, filter: "brightness(1.05)" }}
              whileTap={{ scale: 0.97 }}
              style={{ display: "inline-block" }}
            >
              <Button
                component={Link}
                href="/"
                startIcon={<HomeIcon sx={{ fontSize: "1rem !important" }} />}
                disableElevation
                sx={{
                  fontFamily: SANS,
                  fontWeight: 600,
                  fontSize: "1rem",
                  textTransform: "none",
                  letterSpacing: "-0.01em",
                  px: 4,
                  py: 1.75,
                  borderRadius: "14px",
                  minHeight: 54,
                  color: "#FFFFFF",
                  background: T.accentGrad,
                  boxShadow: `0 8px 28px ${T.accentGlow}`,
                  "&:hover": {
                    boxShadow: `0 12px 36px ${T.accentGlow}`,
                  },
                }}
              >
                Return Home
              </Button>
            </motion.div>

            {/* Secondary */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              style={{ display: "inline-block" }}
            >
              <Button
                component={Link}
                href="/templates"
                endIcon={<ArrowIcon sx={{ fontSize: "1rem !important" }} />}
                disableElevation
                sx={{
                  fontFamily: SANS,
                  fontWeight: 600,
                  fontSize: "1rem",
                  textTransform: "none",
                  letterSpacing: "-0.01em",
                  px: 4,
                  py: 1.75,
                  borderRadius: "14px",
                  minHeight: 54,
                  color: T.ink,
                  background: "transparent",
                  border: `1.5px solid rgba(0,0,0,0.2)`,
                  "&:hover": {
                    background: T.accentPale,
                  },
                }}
              >
                Browse Templates
              </Button>
            </motion.div>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}