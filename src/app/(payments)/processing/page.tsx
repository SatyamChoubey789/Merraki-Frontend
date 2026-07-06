"use client";

import { Box, Typography, CircularProgress } from "@mui/material";
import { motion } from "framer-motion";

/* ══ $50K SAAS SYSTEM TOKENS ══════════════════════ */
const T = {
  bg: "#F6F7FB",
  card: "#FFFFFF",

  ink: "#0B1220",
  inkMuted: "rgba(15,23,42,0.65)",

  border: "rgba(15,23,42,0.10)",

  accent: "#0F172A",
  success: "#16A34A",

  glow: "rgba(15,23,42,0.08)",
};

const SANS = '"DM Sans","Mona Sans",system-ui,sans-serif';

export default function ProcessingPage() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #F6F7FB 0%, #FFFFFF 50%, #F6F7FB 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 4,
        position: "relative",
        overflow: "hidden",
        fontFamily: SANS,
      }}
    >
      {/* subtle ambient background */}
      <Box
        sx={{
          position: "absolute",
          width: "60vw",
          height: "60vw",
          top: "-25vw",
          left: "-15vw",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(15,23,42,0.05), transparent 60%)",
          pointerEvents: "none",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          width: "50vw",
          height: "50vw",
          bottom: "-20vw",
          right: "-15vw",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(15,23,42,0.04), transparent 60%)",
          pointerEvents: "none",
        }}
      />

      {/* LOADER */}
      <Box sx={{ position: "relative", width: 120, height: 120 }}>
        {/* soft rings */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              border: `1px solid rgba(15,23,42,${0.12 - i * 0.03})`,
            }}
            animate={{
              scale: [1, 1.4 + i * 0.2, 1],
              opacity: [0.6, 0, 0.6],
            }}
            transition={{
              duration: 2.6,
              delay: i * 0.3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* center loader */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress
            size={56}
            thickness={3}
            sx={{
              color: T.accent,
            }}
          />
        </Box>
      </Box>

      {/* TEXT */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ textAlign: "center" }}
      >
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: { xs: "1.6rem", md: "2.1rem" },
            color: T.ink,
            letterSpacing: "-0.03em",
          }}
        >
          Processing
        </Typography>

        <Typography
          sx={{
            mt: 1,
            fontSize: "0.95rem",
            color: T.inkMuted,
            maxWidth: 360,
            lineHeight: 1.6,
          }}
        >
          We’re securely finalizing your request in our system.
        </Typography>
      </motion.div>

      {/* DOT LOADER */}
      <Box sx={{ display: "flex", gap: 1 }}>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: T.accent,
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 1.2,
              delay: i * 0.2,
              repeat: Infinity,
            }}
          />
        ))}
      </Box>

      {/* SECURITY BADGE */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Box
          sx={{
            px: 2.5,
            py: 1.2,
            borderRadius: "999px",
            background: "#fff",
            border: `1px solid ${T.border}`,
            display: "flex",
            alignItems: "center",
            gap: 1,
            boxShadow: `0 8px 24px ${T.glow}`,
          }}
        >
          <Box
            sx={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: T.success,
            }}
          />
          <Typography
            sx={{
              fontSize: "0.78rem",
              color: T.inkMuted,
              fontWeight: 500,
            }}
          >
            Secure system processing
          </Typography>
        </Box>
      </motion.div>
    </Box>
  );
}