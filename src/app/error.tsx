"use client";

import { useEffect } from "react";
import { Box, Container, Typography, Button } from "@mui/material";
import { Refresh as RetryIcon } from "@mui/icons-material";
import { motion } from "framer-motion";

/* ══ MONOCHROME SAAS TOKENS ═════════════ */
const T = {
  bg: "#FFFFFF",
  soft: "#F7F7F7",

  ink: "#000000",
  inkMid: "#1A1A1A",
  inkMuted: "#555555",
  inkFaint: "#9A9A9A",

  border: "rgba(0,0,0,0.08)",
  borderSoft: "rgba(0,0,0,0.05)",

  glow: "rgba(0,0,0,0.06)",
  dim: "rgba(0,0,0,0.03)",

  grad: "linear-gradient(135deg, #000 0%, #2A2A2A 100%)",
};

const SANS = `"DM Sans","Mona Sans",system-ui,sans-serif`;
const MONO = `"DM Mono","JetBrains Mono",ui-monospace,monospace`;

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
        background: T.bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        fontFamily: SANS,
      }}
    >
      {/* subtle ambient layers */}
      <Box sx={{
        position: "absolute",
        width: "55vw",
        height: "55vw",
        top: "-25vw",
        left: "-15vw",
        background: `radial-gradient(circle, ${T.dim}, transparent 60%)`,
        borderRadius: "50%",
      }} />
      <Box sx={{
        position: "absolute",
        width: "45vw",
        height: "45vw",
        bottom: "-20vw",
        right: "-10vw",
        background: `radial-gradient(circle, ${T.glow}, transparent 60%)`,
        borderRadius: "50%",
      }} />

      <Container maxWidth="sm" sx={{ position: "relative", zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center" }}
        >
          {/* status chip */}
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              px: 2,
              py: 0.8,
              borderRadius: "999px",
              border: `1px solid ${T.border}`,
              background: T.soft,
              mb: 4,
            }}
          >
            <Box
              sx={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#000",
              }}
            />
            <Typography sx={{ fontSize: "0.75rem", color: T.inkMuted }}>
              System interruption
            </Typography>
          </Box>

          {/* headline */}
          <Typography
            sx={{
              fontFamily: SANS,
              fontWeight: 800,
              fontSize: { xs: "2rem", md: "2.6rem" },
              letterSpacing: "-0.03em",
              color: T.ink,
              mb: 1.5,
            }}
          >
            Something went wrong
          </Typography>

          {/* subtext */}
          <Typography
            sx={{
              fontSize: "1rem",
              color: T.inkMuted,
              lineHeight: 1.7,
              maxWidth: 420,
              mx: "auto",
              mb: 3,
            }}
          >
            Our system ran into an unexpected issue. This has been logged automatically.
            You can safely retry your request.
          </Typography>

          {/* digest */}
          {error.digest && (
            <Typography
              sx={{
                fontFamily: MONO,
                fontSize: "0.72rem",
                color: T.inkFaint,
                mb: 4,
                letterSpacing: "0.08em",
              }}
            >
              REF · {error.digest}
            </Typography>
          )}

          {/* retry button */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={reset}
              startIcon={<RetryIcon />}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                px: 4,
                py: 1.6,
                borderRadius: "14px",
                fontSize: "0.95rem",
                color: "#fff",
                background: T.grad,
                boxShadow: `0 10px 30px ${T.glow}`,
                "&:hover": {
                  boxShadow: `0 14px 40px ${T.glow}`,
                },
              }}
            >
              Retry now
            </Button>
          </motion.div>

          {/* footer hint */}
          <Typography
            sx={{
              mt: 5,
              fontSize: "0.75rem",
              color: T.inkFaint,
            }}
          >
            If the issue persists, contact support or try again later.
          </Typography>
        </motion.div>
      </Container>
    </Box>
  );
}