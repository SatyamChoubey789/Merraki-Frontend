"use client";

import { Box, Container, Typography, Button } from "@mui/material";
import {
  Home as HomeIcon,
  ArrowForward as ArrowIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import Link from "next/link";

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

export default function NotFound() {
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

      {/* Gold atmosphere glow */}
      <Box
        sx={{
          position: "absolute",
          width: "60vw",
          height: "40vw",
          top: "-25vw",
          left: "20vw",
          borderRadius: "50%",
          background: `radial-gradient(ellipse, ${T.goldGlow} 0%, transparent 70%)`,
        }}
      />

      {/* Ghost 404 watermark */}
      <Box
        sx={{
          position: "absolute",
          right: { xs: -40, md: -80 },
          bottom: -120,
          fontFamily: '"Instrument Serif", serif',
          fontStyle: "italic",
          fontSize: { xs: "40vw", md: "28vw" },
          color: "rgba(12,14,18,0.025)",
          lineHeight: 1,
          userSelect: "none",
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
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
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
            Page Not Available
          </Typography>

          {/* Editorial headline */}
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
            This page doesn’t exist.
          </Typography>

          <Typography
            sx={{
              color: T.inkMuted,
              lineHeight: 1.8,
              mb: 5,
              maxWidth: 420,
              mx: "auto",
            }}
          >
            The content you’re looking for may have been moved,
            archived, or never published.
            Let’s return you to a more intentional place.
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: 2,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
              <Button
                component={Link}
                href="/"
                startIcon={<HomeIcon />}
                sx={{
                  px: 4,
                  py: 1.6,
                  borderRadius: "14px",
                  fontWeight: 600,
                  background: `linear-gradient(135deg, ${T.goldLight}, ${T.gold})`,
                  color: T.white,
                  boxShadow: "0 8px 24px rgba(184,146,42,0.35)",
                  transition: "all 0.25s ease",
                  "&:hover": {
                    boxShadow: "0 12px 30px rgba(184,146,42,0.45)",
                  },
                }}
              >
                Return Home
              </Button>
            </motion.div>

            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
              <Button
                component={Link}
                href="/templates"
                endIcon={<ArrowIcon />}
                sx={{
                  px: 4,
                  py: 1.6,
                  borderRadius: "14px",
                  fontWeight: 600,
                  color: T.ink,
                  border: `1.5px solid ${T.border}`,
                  "&:hover": {
                    backgroundColor: "rgba(184,146,42,0.04)",
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