"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Box, Container, Typography } from "@mui/material";
import { motion } from "framer-motion";
import Link from "next/link";

// ─── Brand tokens ─────────────────────────────────────────────────────────────

const T = {
  bg: "#F5F7FB",
  surface: "#FFFFFF",
  ink: "#253957",
  inkMid: "rgba(37,57,87,0.75)",
  inkMuted: "rgba(37,57,87,0.55)",
  inkFaint: "rgba(37,57,87,0.35)",
  border: "rgba(37,57,87,0.10)",
  borderMid: "rgba(37,57,87,0.16)",
  primary: "#253957",
  primaryLight: "rgba(37,57,87,0.06)",
  green: "#0D7A5F",
  greenPale: "rgba(13,122,95,0.07)",
  greenBorder: "rgba(13,122,95,0.20)",
} as const;

const SANS = `"DM Sans", system-ui, sans-serif`;
const MONO = `"DM Mono", ui-monospace, monospace`;
const EASE = [0.16, 1, 0.3, 1] as const;

// ─── Confetti ─────────────────────────────────────────────────────────────────

const CONFETTI_COLORS = [
  T.primary,
  "#4A6FA5",
  "#6B8FC4",
  T.green,
  "#1A9B78",
  "rgba(37,57,87,0.4)",
];

function ConfettiPiece({ index }: { index: number }) {
  const color = CONFETTI_COLORS[index % CONFETTI_COLORS.length];
  const x = (index * 137.5) % 100;
  const delay = (index * 0.035) % 1.0;
  const duration = 1.6 + (index % 5) * 0.25;
  const size = 5 + (index % 4) * 2;
  const isCircle = index % 3 === 0;

  return (
    <motion.div
      initial={{ y: -16, x: `${x}vw`, opacity: 1, rotate: 0, scale: 0 }}
      animate={{
        y: "105vh",
        opacity: [1, 1, 0],
        rotate: 360 * 2,
        scale: [0, 1, 1],
      }}
      transition={{ delay, duration, ease: "easeIn" }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: size,
        height: isCircle ? size : size * 0.4,
        borderRadius: isCircle ? "50%" : "1px",
        background: color,
        pointerEvents: "none",
        zIndex: 999,
      }}
    />
  );
}

// ─── What happens next steps ──────────────────────────────────────────────────

const NEXT_STEPS = [
  {
    step: "01",
    title: "Check your email",
    detail: "Order confirmation and invoice sent instantly.",
    color: T.primary,
  },
  {
    step: "02",
    title: "Admin review",
    detail: "Our team verifies every order — usually within 2 business hours.",
    color: T.green,
  },
  {
    step: "03",
    title: "Download ready",
    detail: "Your download link arrives by email once approved.",
    color: "rgba(37,57,87,0.5)",
  },
] as const;

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CheckoutSuccessPage() {
  const params = useSearchParams();
  const orderId = params.get("order");
  const shortId = orderId?.slice(0, 8).toUpperCase();

  const fired = useRef(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (!fired.current) {
      fired.current = true;
      setShowConfetti(true);
    }
  }, []);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: T.bg,
        pt: { xs: 10, md: 14 },
        pb: 16,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Confetti */}
      {showConfetti &&
        Array.from({ length: 32 }).map((_, i) => (
          <ConfettiPiece key={i} index={i} />
        ))}

      {/* Subtle background circle */}
      <Box
        sx={{
          position: "absolute",
          width: "55vw",
          height: "55vw",
          top: "-18vw",
          right: "-12vw",
          borderRadius: "50%",
          background: `radial-gradient(ellipse, rgba(37,57,87,0.04) 0%, transparent 65%)`,
          pointerEvents: "none",
        }}
      />

      <Container maxWidth="sm" sx={{ position: "relative", zIndex: 1 }}>
        {/* Check icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 220,
            damping: 18,
            delay: 0.05,
          }}
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: 36,
          }}
        >
          <Box sx={{ position: "relative" }}>
            {/* Pulse ring */}
            <motion.div
              animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0, 0.15] }}
              transition={{
                duration: 2.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                position: "absolute",
                inset: -12,
                borderRadius: "50%",
                border: `1.5px solid ${T.green}`,
                pointerEvents: "none",
              }}
            />
            <Box
              sx={{
                width: 84,
                height: 84,
                borderRadius: "50%",
                background: T.surface,
                border: `1.5px solid ${T.greenBorder}`,
                boxShadow: `0 6px 28px ${T.greenPale}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
                <motion.path
                  d="M7 17L14 24L27 10"
                  stroke={T.green}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.3, duration: 0.5, ease: EASE }}
                />
              </svg>
            </Box>
          </Box>
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5, ease: EASE }}
        >
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Typography
              sx={{
                fontFamily: SANS,
                fontWeight: 800,
                fontSize: { xs: "2rem", md: "2.625rem" },
                color: T.ink,
                letterSpacing: "-0.03em",
                lineHeight: 1.05,
                mb: 0.5,
              }}
            >
              Payment successful
            </Typography>
            <Typography
              sx={{
                fontFamily: SANS,
                fontWeight: 300,
                fontSize: { xs: "2rem", md: "2.625rem" },
                color: T.green,
                letterSpacing: "-0.03em",
                lineHeight: 1.05,
                mb: 2.5,
              }}
            >
              you're all set.
            </Typography>

            {/* Order badge */}
            {shortId && (
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 1,
                  px: 2,
                  py: "6px",
                  borderRadius: "100px",
                  background: T.surface,
                  border: `1px solid ${T.border}`,
                }}
              >
                <Box
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: T.green,
                  }}
                />
                <Typography
                  sx={{
                    fontFamily: MONO,
                    fontSize: "0.72rem",
                    color: T.inkMuted,
                  }}
                >
                  Order #{shortId}
                </Typography>
              </Box>
            )}
          </Box>
        </motion.div>

        {/* What happens next card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5, ease: EASE }}
        >
          <Box
            sx={{
              background: T.surface,
              borderRadius: "16px",
              border: `1px solid ${T.borderMid}`,
              overflow: "hidden",
              mb: 3,
            }}
          >
            {/* Card header */}
            <Box
              sx={{
                px: 3,
                py: 2.25,
                borderBottom: `1px solid ${T.border}`,
                background: T.bg,
                display: "flex",
                alignItems: "center",
                gap: 1.5,
              }}
            >
              <Box
                sx={{
                  width: 2,
                  height: 14,
                  borderRadius: "2px",
                  background: T.primary,
                }}
              />
              <Typography
                sx={{
                  fontFamily: SANS,
                  fontWeight: 700,
                  fontSize: "0.875rem",
                  color: T.ink,
                }}
              >
                What happens next
              </Typography>
            </Box>

            {/* Steps */}
            <Box
              sx={{
                p: 2.5,
                display: "flex",
                flexDirection: "column",
                gap: 1.25,
              }}
            >
              {NEXT_STEPS.map((s, i) => (
                <motion.div
                  key={s.step}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.4 + i * 0.08,
                    duration: 0.4,
                    ease: EASE,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 2,
                      px: 2.5,
                      py: 2,
                      borderRadius: "12px",
                      border: `1px solid ${T.border}`,
                      background: T.bg,
                    }}
                  >
                    {/* Step number */}
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: "8px",
                        flexShrink: 0,
                        background: T.surface,
                        border: `1px solid ${T.border}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: MONO,
                          fontSize: "0.65rem",
                          fontWeight: 700,
                          color: s.color,
                        }}
                      >
                        {s.step}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography
                        sx={{
                          fontFamily: SANS,
                          fontWeight: 600,
                          fontSize: "0.875rem",
                          color: T.ink,
                          mb: 0.25,
                        }}
                      >
                        {s.title}
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: SANS,
                          fontSize: "0.8rem",
                          color: T.inkMuted,
                          lineHeight: 1.6,
                        }}
                      >
                        {s.detail}
                      </Typography>
                    </Box>
                  </Box>
                </motion.div>
              ))}
            </Box>
          </Box>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.45, ease: EASE }}
        >
          <Box
            component={Link}
            href="/templates"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              py: "13px",
              borderRadius: "12px",
              background: T.primary,
              color: "#fff",
              fontFamily: SANS,
              fontWeight: 600,
              fontSize: "0.9rem",
              textDecoration: "none",
              transition: "filter 0.18s",
              "&:hover": { filter: "brightness(1.08)" },
            }}
          >
            Browse more templates
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}
