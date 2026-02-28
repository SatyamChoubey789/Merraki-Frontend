"use client";

import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { colorTokens } from "@/theme";

const STEPS = [
  { label: "Analysing your answers…", delay: 0 },
  { label: "Calculating personality scores…", delay: 1.2 },
  { label: "Building your growth playbook…", delay: 2.4 },
  { label: "Preparing your report…", delay: 3.6 },
];

export function TestSubmittingScreen() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: colorTokens.darkNavy[900],
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 5,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at center, rgba(26,86,219,0.15) 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />

      {/* Animated brain icon */}
      <Box sx={{ position: "relative", zIndex: 1 }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          style={{
            width: 100,
            height: 100,
            borderRadius: "50%",
            border: `2px dashed rgba(26,86,219,0.4)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              width: 76,
              height: 76,
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${colorTokens.financeBlue[500]}, ${colorTokens.financeBlue[700]})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 8px 32px rgba(26,86,219,0.5)",
              fontSize: "2rem",
            }}
          >
            🧠
          </Box>
        </motion.div>
      </Box>

      {/* Steps */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
          zIndex: 1,
          alignItems: "center",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            color: "#fff",
            fontWeight: 700,
            fontFamily: "var(--font-display)",
            mb: 1,
            letterSpacing: "-0.02em",
          }}
        >
          Generating Your Report
        </Typography>
        {STEPS.map((step, i) => (
          <motion.div
            key={step.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: step.delay, duration: 0.5 }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  delay: step.delay + 0.2,
                  type: "spring",
                  stiffness: 300,
                }}
              >
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    backgroundColor: colorTokens.financeBlue[400],
                    boxShadow: `0 0 8px ${colorTokens.financeBlue[400]}`,
                  }}
                />
              </motion.div>
              <Typography
                variant="body2"
                sx={{ color: "rgba(255,255,255,0.6)", fontWeight: 500 }}
              >
                {step.label}
              </Typography>
            </Box>
          </motion.div>
        ))}
      </Box>
    </Box>
  );
}
