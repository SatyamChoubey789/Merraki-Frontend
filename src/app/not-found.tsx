"use client";

import { Box, Container, Typography, Button } from "@mui/material";
import { Home as HomeIcon, ArrowForward as ArrowIcon } from "@mui/icons-material";
import { motion } from "framer-motion";
import Link from "next/link";

/* ══ SaaS TOKENS (premium minimal startup style) ═════════════ */
const T = {
  bg: "#F6F7FB",
  card: "rgba(255,255,255,0.75)",
  cardBorder: "rgba(15, 23, 42, 0.08)",

  ink: "#0B0F19",
  inkMuted: "#5B6475",
  inkFaint: "#8A93A6",

  accent: "#111827",
  accentSoft: "#1F2937",
  accentGlow: "rgba(17,24,39,0.08)",

  bgGlow1: "rgba(17,24,39,0.06)",
  bgGlow2: "rgba(59,130,246,0.05)",
};

const SANS = `"DM Sans","Inter",system-ui,sans-serif`;
const EASE = [0.16, 1, 0.3, 1] as const;

export default function NotFound() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `
          radial-gradient(circle at 20% 20%, ${T.bgGlow2}, transparent 40%),
          radial-gradient(circle at 80% 80%, ${T.bgGlow1}, transparent 45%),
          ${T.bg}
        `,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        fontFamily: SANS,
        px: { xs: 2, md: 0 },
      }}
    >
      {/* Soft floating blobs */}
      <Box sx={{ position: "absolute", width: 400, height: 400, top: -120, left: -120, borderRadius: "50%", background: T.bgGlow1, filter: "blur(40px)" }} />
      <Box sx={{ position: "absolute", width: 450, height: 450, bottom: -160, right: -160, borderRadius: "50%", background: T.bgGlow2, filter: "blur(50px)" }} />

      <Container maxWidth="sm" sx={{ position: "relative", zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          {/* Card */}
          <Box
            sx={{
              background: T.card,
              border: `1px solid ${T.cardBorder}`,
              backdropFilter: "blur(14px)",
              borderRadius: "20px",
              p: { xs: 3, md: 5 },
              textAlign: "center",
              boxShadow: "0 20px 60px rgba(0,0,0,0.06)",
            }}
          >
            {/* 404 Badge */}
            <Typography
              sx={{
                fontSize: "0.75rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: T.inkFaint,
                mb: 3,
              }}
            >
              Error · Not Found
            </Typography>

            {/* Headline */}
            <Typography
              sx={{
                fontWeight: 800,
                fontSize: { xs: "1.9rem", md: "2.6rem" },
                letterSpacing: "-0.03em",
                color: T.ink,
                mb: 1.5,
                lineHeight: 1.1,
              }}
            >
              This page doesn’t exist
            </Typography>

            {/* Subtext */}
            <Typography
              sx={{
                fontSize: { xs: "0.95rem", md: "1rem" },
                color: T.inkMuted,
                lineHeight: 1.7,
                maxWidth: 420,
                mx: "auto",
                mb: 4,
              }}
            >
              The page may have been moved, deleted, or never existed.
              Let’s get you back to something useful.
            </Typography>

            {/* CTA buttons */}
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
                justifyContent: "center",
              }}
            >
              {/* Primary */}
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button
                  component={Link}
                  href="/"
                  startIcon={<HomeIcon />}
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                    px: 3.5,
                    py: 1.6,
                    borderRadius: "14px",
                    color: "#fff",
                    background: T.accent,
                    minWidth: 180,
                    boxShadow: `0 10px 30px ${T.accentGlow}`,
                    "&:hover": {
                      background: T.accentSoft,
                    },
                  }}
                >
                  Go Home
                </Button>
              </motion.div>

              {/* Secondary */}
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button
                  component={Link}
                  href="/templates"
                  endIcon={<ArrowIcon />}
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                    px: 3.5,
                    py: 1.6,
                    borderRadius: "14px",
                    color: T.ink,
                    border: `1px solid ${T.cardBorder}`,
                    background: "transparent",
                    minWidth: 180,
                    "&:hover": {
                      background: "rgba(0,0,0,0.03)",
                    },
                  }}
                >
                  Explore
                </Button>
              </motion.div>
            </Box>

            {/* Footer hint */}
            <Typography
              sx={{
                mt: 4,
                fontSize: "0.8rem",
                color: T.inkFaint,
              }}
            >
              Need help? Contact support or try searching again.
            </Typography>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}