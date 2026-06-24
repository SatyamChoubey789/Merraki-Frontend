"use client";

import { useEffect } from "react";
import { Box, Container, Typography, Button } from "@mui/material";
import { Refresh as RetryIcon } from "@mui/icons-material";
import { motion } from "framer-motion";

/* ══ MONOCHROME TOKENS (white + black only) ═════════════ */
const T = {
  bg:        "#FFFFFF",
  bgSection: "#F7F7F7",

  ink:       "#000000",
  inkDark:   "#111111",
  inkMid:    "#2A2A2A",
  inkMuted:  "#555555",
  inkFaint:  "#9A9A9A",

  border:    "rgba(0,0,0,0.08)",

  accent:     "#000000",
  accentSoft: "#111111",
  accentPale: "#F2F2F2",
  accentGlow: "rgba(0,0,0,0.08)",
  accentDim:  "rgba(0,0,0,0.04)",

  accentGrad: "linear-gradient(135deg, #000000 0%, #2A2A2A 100%)",
};

const SANS = `"DM Sans","Mona Sans",system-ui,sans-serif`;
const MONO = `"DM Mono","JetBrains Mono",ui-monospace,monospace`;
const EASE = [0.16, 1, 0.3, 1] as const;

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Global Error]", error);
  }, [error]);

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

      <Container maxWidth="sm" sx={{ position: "relative", zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: EASE }}
          style={{ textAlign: "center" }}
        >
          {/* Label */}
          <Typography
            sx={{
              fontFamily: MONO,
              fontSize: "0.68rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: T.inkFaint,
              mb: 4,
              fontWeight: 600,
            }}
          >
            System Interruption
          </Typography>

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
            We encountered an issue.
          </Typography>

          {/* Subtext */}
          <Typography
            sx={{
              fontFamily: SANS,
              fontWeight: 400,
              fontSize: "1rem",
              color: T.inkMuted,
              lineHeight: 1.75,
              maxWidth: 400,
              mx: "auto",
              mb: 4,
            }}
          >
            Something went wrong on our end. Our systems have been notified.
            Please try again.
          </Typography>

          {/* Reference ID */}
          {error.digest && (
            <Typography
              sx={{
                fontFamily: MONO,
                fontSize: "0.72rem",
                letterSpacing: "0.08em",
                color: T.inkFaint,
                mb: 5,
              }}
            >
              Reference ID · {error.digest}
            </Typography>
          )}

          {/* CTA */}
          <motion.div
            whileHover={{ scale: 1.03, filter: "brightness(1.05)" }}
            whileTap={{ scale: 0.97 }}
            style={{ display: "inline-block" }}
          >
            <Button
              onClick={reset}
              startIcon={<RetryIcon sx={{ fontSize: "1rem !important" }} />}
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
              Try Again
            </Button>
          </motion.div>
        </motion.div>
      </Container>
    </Box>
  );
}