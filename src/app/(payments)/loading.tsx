"use client";

import { Box, Typography } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

/* ══ NEW NEUTRAL TOKENS ══════════════════════ */
const T = {
  bg: "#F5F7FB",
  bgSection: "#F5F7FB",
  ink: "#253957",
  inkMid: "#253957",
  inkMuted: "rgba(37,57,87,0.65)",
  inkFaint: "rgba(37,57,87,0.45)",
  border: "rgba(37,57,87,0.12)",
  borderMid: "rgba(37,57,87,0.18)",
  glow: "rgba(37,57,87,0.10)",
  dim: "rgba(37,57,87,0.06)",
  grad: "linear-gradient(135deg, #253957 0%, #4a6fa5 100%)",
};

const SANS = '"DM Sans","Mona Sans",system-ui,sans-serif';

const EASE = [0.16, 1, 0.3, 1] as const;

const MESSAGES = [
  "Securing your payment…",
  "Verifying transaction…",
  "Almost there…",
  "Confirming your order…",
];

/* ══ ORBIT RING ══════════════════════ */
function OrbitalRing({
  radius,
  duration,
  delay,
  opacity,
  reverse = false,
}: {
  radius: number;
  duration: number;
  delay: number;
  opacity: number;
  reverse?: boolean;
}) {
  return (
    <motion.div
      style={{
        position: "absolute",
        width: radius * 2,
        height: radius * 2,
        borderRadius: "50%",
        border: `1px solid rgba(37,57,87,${opacity})`,
        top: "50%",
        left: "50%",
        marginTop: -radius,
        marginLeft: -radius,
      }}
      animate={{ rotate: reverse ? -360 : 360 }}
      transition={{ duration, delay, repeat: Infinity, ease: "linear" }}
    >
      <motion.div
        style={{
          position: "absolute",
          width: 5,
          height: 5,
          borderRadius: "50%",
          background: T.ink,
          top: -2.5,
          left: "50%",
          marginLeft: -2.5,
          boxShadow: `0 0 10px ${T.glow}`,
        }}
      />
    </motion.div>
  );
}

export default function PaymentLoading() {
  const [msgIdx, setMsgIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(
      () => setMsgIdx((i) => (i + 1) % MESSAGES.length),
      2200
    );
    return () => clearInterval(t);
  }, []);

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
      {/* Ambient blobs (neutral) */}
      <Box
        sx={{
          position: "absolute",
          width: "60vw",
          height: "60vw",
          top: "-20vw",
          left: "-10vw",
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(37,57,87,0.06), transparent 60%)`,
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
          background: `radial-gradient(circle, rgba(37,57,87,0.05), transparent 60%)`,
          pointerEvents: "none",
        }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: EASE }}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* ORBITAL LOADER */}
        <Box sx={{ position: "relative", width: 140, height: 140, mb: 5 }}>
          <OrbitalRing radius={68} duration={7} delay={0} opacity={0.15} />
          <OrbitalRing radius={54} duration={5.2} delay={0.4} opacity={0.22} reverse />
          <OrbitalRing radius={40} duration={3.8} delay={0.2} opacity={0.30} />

          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            style={{
              position: "absolute",
              inset: 20,
              borderRadius: "50%",
              border: `1px solid rgba(37,57,87,0.25)`,
            }}
          />

          {/* CORE */}
          <Box
            sx={{
              position: "absolute",
              inset: 34,
              borderRadius: "50%",
              background: T.bg,
              border: `1px solid rgba(37,57,87,0.2)`,
              boxShadow: `0 8px 32px rgba(37,57,87,0.08)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                background: T.ink,
              }}
            />
          </Box>
        </Box>

        {/* MESSAGE */}
        <Box
          sx={{
            height: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 1.5,
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={msgIdx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              <Typography
                sx={{
                  fontFamily: SANS,
                  fontWeight: 500,
                  fontSize: "1.05rem",
                  color: T.inkMuted,
                }}
              >
                {MESSAGES[msgIdx]}
              </Typography>
            </motion.div>
          </AnimatePresence>
        </Box>

        {/* PROGRESS */}
        <Box
          sx={{
            width: 220,
            height: 2,
            background: T.border,
            borderRadius: 1,
            overflow: "hidden",
            mb: 3,
          }}
        >
          <motion.div
            style={{
              height: "100%",
              background: T.ink,
              borderRadius: 1,
            }}
            animate={{ x: ["-100%", "100%"] }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </Box>

        {/* SECURITY BADGE */}
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 1,
            px: "14px",
            py: "8px",
            borderRadius: "100px",
            background: "#fff",
            border: `1px solid ${T.border}`,
          }}
        >
          <svg width="11" height="13" viewBox="0 0 11 13" fill="none">
            <path
              d="M5.5 0.5L1 2.5V6C1 8.76 3 11.32 5.5 12C8 11.32 10 8.76 10 6V2.5L5.5 0.5Z"
              stroke={T.ink}
              strokeWidth="1"
              fill="none"
              strokeLinejoin="round"
            />
            <path
              d="M3.5 6.5L4.75 7.75L7.5 5"
              stroke={T.ink}
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <Typography
            sx={{
              fontFamily: SANS,
              fontSize: "0.72rem",
              fontWeight: 500,
              color: T.inkMuted,
            }}
          >
            256-bit SSL · Secured
          </Typography>
        </Box>
      </motion.div>
    </Box>
  );
}