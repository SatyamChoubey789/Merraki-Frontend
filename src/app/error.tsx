"use client";

import { useEffect } from "react";
import { Box, Container, Typography, Button } from "@mui/material";
import { Refresh as RetryIcon } from "@mui/icons-material";
import { motion } from "framer-motion";

const T = {
  white: "#FFFFFF",
  offwhite: "#F9F8F5",
  border: "#E2DED5",
  ink: "#0C0E12",
  inkMuted: "#64748B",
  inkFaint: "#94A3B8",
  gold: "#B8922A",
  goldLight: "#DDB96A",
  goldGlow: "rgba(184,146,42,0.06)",
};

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
        background: T.offwhite,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle architectural grid */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(${T.border} 1px, transparent 1px),
            linear-gradient(90deg, ${T.border} 1px, transparent 1px)
          `,
          backgroundSize: "72px 72px",
          opacity: 0.28,
        }}
      />

      {/* Gold atmosphere */}
      <Box
        sx={{
          position: "absolute",
          width: "60vw",
          height: "40vw",
          top: "-20vw",
          left: "20vw",
          borderRadius: "50%",
          background: `radial-gradient(ellipse, ${T.goldGlow} 0%, transparent 70%)`,
        }}
      />

      <Container maxWidth="sm" sx={{ position: "relative", zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ textAlign: "center" }}
        >
          {/* Micro label */}
          <Typography
            sx={{
              fontFamily: '"DM Mono", monospace',
              fontSize: "0.65rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: T.inkFaint,
              mb: 4,
            }}
          >
            System Interruption
          </Typography>

          {/* Headline */}
          <Typography
            sx={{
              fontFamily: '"Instrument Serif", serif',
              fontStyle: "italic",
              fontSize: { xs: "2.5rem", md: "3.5rem" },
              lineHeight: 1,
              letterSpacing: "-0.04em",
              color: T.ink,
              mb: 2,
            }}
          >
            We encountered an issue.
          </Typography>

          <Typography
            sx={{
              color: T.inkMuted,
              lineHeight: 1.8,
              mb: 4,
            }}
          >
            Our systems have been notified and are already working on it.
            Please try again.
          </Typography>

          {error.digest && (
            <Typography
              sx={{
                fontFamily: '"DM Mono", monospace',
                fontSize: "0.7rem",
                letterSpacing: "0.12em",
                color: T.inkFaint,
                mb: 5,
              }}
            >
              Reference ID · {error.digest}
            </Typography>
          )}

          <motion.div
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              onClick={reset}
              startIcon={<RetryIcon />}
              sx={{
                px: 4,
                py: 1.6,
                borderRadius: "14px",
                fontWeight: 600,
                fontFamily: '"DM Sans", sans-serif',
                background: `linear-gradient(135deg, ${T.goldLight}, ${T.gold})`,
                color: T.white,
                boxShadow: "0 8px 24px rgba(184,146,42,0.35)",
                transition: "all 0.25s ease",
                "&:hover": {
                  boxShadow: "0 12px 30px rgba(184,146,42,0.45)",
                },
              }}
            >
              Retry
            </Button>
          </motion.div>
        </motion.div>
      </Container>
    </Box>
  );
}