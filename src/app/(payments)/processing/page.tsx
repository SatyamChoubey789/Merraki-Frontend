"use client";

import { Box, Typography, CircularProgress } from "@mui/material";
import { motion } from "framer-motion";
import { colorTokens } from "@/theme";

export default function ProcessingPage() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: colorTokens.darkNavy[900],
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 4,
        position: "relative",
        overflow: "hidden",
        pointerEvents: "none",
        userSelect: "none",
      }}
    >
      {/* Background radial */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at center, rgba(26,86,219,0.15) 0%, transparent 70%)`,
        }}
      />

      {/* Pulsing ring */}
      <Box sx={{ position: "relative", width: 120, height: 120 }}>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              border: `2px solid rgba(26,86,219,${0.4 - i * 0.12})`,
            }}
            animate={{ scale: [1, 1.5 + i * 0.3, 1], opacity: [0.8, 0, 0.8] }}
            transition={{
              duration: 2,
              delay: i * 0.4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
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
            size={64}
            thickness={3}
            sx={{ color: colorTokens.financeBlue[400] }}
          />
        </Box>
      </Box>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        style={{ textAlign: "center", zIndex: 1 }}
      >
        <Typography
          variant="h4"
          sx={{
            color: "#fff",
            fontWeight: 700,
            fontFamily: "var(--font-display)",
            mb: 1.5,
            letterSpacing: "-0.02em",
          }}
        >
          Processing Payment
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: "rgba(255,255,255,0.5)",
            maxWidth: 340,
            lineHeight: 1.7,
          }}
        >
          Please do not close or refresh this window. Your payment is being
          processed securely.
        </Typography>

        {/* Animated dots */}
        <Box
          sx={{ display: "flex", justifyContent: "center", gap: 0.75, mt: 3 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: colorTokens.financeBlue[400],
              }}
              animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
              transition={{ duration: 1.2, delay: i * 0.2, repeat: Infinity }}
            />
          ))}
        </Box>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        style={{ zIndex: 1 }}
      >
        <Box
          sx={{
            px: 3,
            py: 1.5,
            borderRadius: "999px",
            backgroundColor: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: colorTokens.success.main,
              boxShadow: `0 0 8px ${colorTokens.success.main}`,
            }}
          />
          <Typography
            variant="caption"
            sx={{ color: "rgba(255,255,255,0.6)", fontWeight: 600 }}
          >
            Secured by Razorpay
          </Typography>
        </Box>
      </motion.div>
    </Box>
  );
}
