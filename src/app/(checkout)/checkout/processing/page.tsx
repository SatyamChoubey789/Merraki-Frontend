"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, Container, CircularProgress, Typography } from "@mui/material";
import { motion } from "framer-motion";

// ─── Brand tokens ─────────────────────────────────────────────────────────────

const T = {
  bg: "#F5F7FB",
  surface: "#FFFFFF",
  ink: "#253957",
  inkMid: "rgba(37,57,87,0.75)",
  inkMuted: "rgba(37,57,87,0.55)",
  inkFaint: "rgba(37,57,87,0.35)",
  border: "rgba(37,57,87,0.10)",
  primary: "#253957",
  primaryLight: "rgba(37,57,87,0.06)",
} as const;

const SANS = `"DM Sans", system-ui, sans-serif`;
const EASE = [0.16, 1, 0.3, 1] as const;

// ─── Steps shown while processing ────────────────────────────────────────────

const STEPS = [
  "Verifying payment signature",
  "Confirming your order",
  "Preparing download links",
] as const;

// ─── Page ─────────────────────────────────────────────────────────────────────
// This page is a fallback — it's shown if the user is redirected here
// manually. Normally the useCheckout hook handles verification inline
// and redirects to /success or /failure directly.
// You can also navigate here intentionally while a background job runs.

export default function CheckoutProcessingPage() {
  const router = useRouter();

  // Safety timeout — if stuck here for more than 30s, go to failure
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/checkout/failure?reason=Processing+timed+out");
    }, 30_000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: T.bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
        pointerEvents: "none",
        userSelect: "none",
      }}
    >
      {/* Background circles */}
      <Box
        sx={{
          position: "absolute",
          width: "60vw",
          height: "60vw",
          top: "-22vw",
          right: "-16vw",
          borderRadius: "50%",
          background: `radial-gradient(ellipse, rgba(37,57,87,0.04) 0%, transparent 60%)`,
          pointerEvents: "none",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          width: "40vw",
          height: "40vw",
          bottom: "-14vw",
          left: "-10vw",
          borderRadius: "50%",
          background: `radial-gradient(ellipse, rgba(37,57,87,0.03) 0%, transparent 60%)`,
          pointerEvents: "none",
        }}
      />

      <Container
        maxWidth="xs"
        sx={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 5,
        }}
      >
        {/* Spinner with pulse rings */}
        <Box sx={{ position: "relative", width: 100, height: 100 }}>
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                border: `1.5px solid rgba(37,57,87,${0.18 - i * 0.05})`,
              }}
              animate={{
                scale: [1, 1.5 + i * 0.25, 1],
                opacity: [0.6, 0, 0.6],
              }}
              transition={{
                duration: 2.2,
                delay: i * 0.38,
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
              size={60}
              thickness={2.5}
              sx={{ color: T.primary }}
            />
          </Box>
        </Box>

        {/* Text block */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5, ease: EASE }}
          style={{ textAlign: "center" }}
        >
          <Typography
            sx={{
              fontFamily: SANS,
              fontWeight: 800,
              fontSize: { xs: "1.625rem", md: "2rem" },
              color: T.ink,
              letterSpacing: "-0.025em",
              mb: 1,
            }}
          >
            Processing payment
          </Typography>
          <Typography
            sx={{
              fontFamily: SANS,
              fontSize: "0.875rem",
              color: T.inkMuted,
              lineHeight: 1.7,
            }}
          >
            Please do not close or refresh this window.
          </Typography>
        </motion.div>

        {/* Animated step list */}
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
          {STEPS.map((label, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.6, duration: 0.4, ease: EASE }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  px: 2.5,
                  py: 1.5,
                  borderRadius: "10px",
                  background: T.surface,
                  border: `1px solid ${T.border}`,
                }}
              >
                {/* Animated dot */}
                <motion.div
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{
                    duration: 1.4,
                    delay: 0.5 + i * 0.6,
                    repeat: Infinity,
                  }}
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: T.primary,
                    flexShrink: 0,
                  }}
                />
                <Typography
                  sx={{
                    fontFamily: SANS,
                    fontSize: "0.8rem",
                    color: T.inkMuted,
                  }}
                >
                  {label}
                </Typography>
              </Box>
            </motion.div>
          ))}
        </Box>

        {/* Secured by badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              px: 2.5,
              py: "8px",
              borderRadius: "100px",
              background: T.surface,
              border: `1px solid ${T.border}`,
            }}
          >
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.8, repeat: Infinity }}
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: T.primary,
              }}
            />
            <Typography
              sx={{
                fontFamily: SANS,
                fontSize: "0.75rem",
                fontWeight: 600,
                color: T.inkMuted,
                letterSpacing: "0.01em",
              }}
            >
              Secured by Razorpay
            </Typography>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}