"use client";

import { Box, Typography, CircularProgress } from "@mui/material";
import { motion } from "framer-motion";

const T = {
  bg: "#FFFFFF",
  ink: "#0A0A0F",
  inkMuted: "#5A5A72",
  border: "rgba(10,10,20,0.08)",

  blue: "#3B7BF6",
  blueGlow: "rgba(59,123,246,0.10)",
  blueDim: "rgba(59,123,246,0.06)",
  bluePale: "#EDF3FF",
};

export default function ProcessingPage() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: T.bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 5,
        position: "relative",
        overflow: "hidden",
        pointerEvents: "none",
        userSelect: "none",
      }}
    >
      {/* Subtle blue ambient glow */}
      <Box
        sx={{
          position: "absolute",
          width: "70vw",
          height: "35vw",
          top: "-10vw",
          left: "15vw",
          borderRadius: "50%",
          background: `radial-gradient(ellipse, ${T.blueDim} 0%, transparent 65%)`,
          pointerEvents: "none",
        }}
      />

      {/* Dot grid (same as footer) */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          backgroundImage:
            "radial-gradient(circle, rgba(10,10,20,0.055) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Pulsing ring */}
      <Box sx={{ position: "relative", width: 120, height: 120, zIndex: 2 }}>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              border: `2px solid rgba(59,123,246,${0.35 - i * 0.1})`,
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
            sx={{ color: T.blue }}
          />
        </Box>
      </Box>

      {/* Text */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        style={{ textAlign: "center", zIndex: 2 }}
      >
        <Typography
          sx={{
            fontSize: 34,
            fontWeight: 800,
            letterSpacing: "-0.02em",
            color: T.ink,
            mb: 2,
          }}
        >
          Processing Payment
        </Typography>

        <Typography
          sx={{
            fontSize: 16,
            color: T.inkMuted,
            maxWidth: 380,
            lineHeight: 1.7,
          }}
        >
          Please do not close or refresh this window. Your payment is being
          processed securely.
        </Typography>

        {/* Animated dots */}
        <Box
          sx={{ display: "flex", justifyContent: "center", gap: 1, mt: 4 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: T.blue,
              }}
              animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
              transition={{ duration: 1.2, delay: i * 0.2, repeat: Infinity }}
            />
          ))}
        </Box>
      </motion.div>

      {/* Secure badge */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        style={{ zIndex: 2 }}
      >
        <Box
          sx={{
            px: 3,
            py: 1.5,
            borderRadius: "999px",
            backgroundColor: T.bluePale,
            border: `1px solid ${T.border}`,
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
              backgroundColor: T.blue,
              boxShadow: `0 0 8px ${T.blueGlow}`,
            }}
          />

          <Typography
            sx={{
              fontSize: 12,
              fontWeight: 600,
              color: T.inkMuted,
              letterSpacing: "0.04em",
            }}
          >
            Secured by Razorpay
          </Typography>
        </Box>
      </motion.div>
    </Box>
  );
}