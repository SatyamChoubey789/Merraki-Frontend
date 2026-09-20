"use client";

import { useSearchParams } from "next/navigation";
import { Box, Container, Typography } from "@mui/material";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
  red: "#C0392B",
  redPale: "rgba(192,57,43,0.06)",
  redBorder: "rgba(192,57,43,0.18)",
} as const;

const SANS = `"DM Sans", system-ui, sans-serif`;
const MONO = `"DM Mono", ui-monospace, monospace`;
const EASE = [0.16, 1, 0.3, 1] as const;

// ─── Common failure reasons ───────────────────────────────────────────────────

const REASONS = [
  {
    label: "Insufficient funds",
    detail: "Your account balance may be too low for this transaction.",
  },
  {
    label: "Network interruption",
    detail: "A connection dropout occurred mid-payment. No charge was made.",
  },
  {
    label: "Card declined by bank",
    detail: "Your issuing bank rejected the transaction. Try a different card.",
  },
  {
    label: "Session timed out",
    detail: "The payment window expired. This is a Razorpay safety feature.",
  },
] as const;

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CheckoutFailurePage() {
  const router = useRouter();
  const params = useSearchParams();
  const reason = params.get("reason");

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
      {/* Background accent */}
      <Box
        sx={{
          position: "absolute",
          width: "55vw",
          height: "55vw",
          top: "-18vw",
          left: "-12vw",
          borderRadius: "50%",
          background: `radial-gradient(ellipse, rgba(192,57,43,0.03) 0%, transparent 65%)`,
          pointerEvents: "none",
        }}
      />

      <Container maxWidth="sm" sx={{ position: "relative", zIndex: 1 }}>
        {/* X icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 220, damping: 18, delay: 0.05 }}
          style={{ display: "flex", justifyContent: "center", marginBottom: 36 }}
        >
          <Box
            sx={{
              width: 84,
              height: 84,
              borderRadius: "50%",
              background: T.surface,
              border: `1.5px solid ${T.redBorder}`,
              boxShadow: `0 6px 28px ${T.redPale}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <motion.path
                d="M8 8L24 24"
                stroke={T.red}
                strokeWidth="2.5"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 0.25, duration: 0.3, ease: EASE }}
              />
              <motion.path
                d="M24 8L8 24"
                stroke={T.red}
                strokeWidth="2.5"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 0.45, duration: 0.3, ease: EASE }}
              />
            </svg>
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
              Payment failed
            </Typography>
            <Typography
              sx={{
                fontFamily: SANS,
                fontWeight: 300,
                fontSize: { xs: "2rem", md: "2.625rem" },
                color: T.red,
                letterSpacing: "-0.03em",
                lineHeight: 1.05,
                mb: 2.5,
              }}
            >
              don't worry.
            </Typography>

            {/* Reason badge */}
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
                  background: T.primary,
                }}
              />
              <Typography
                sx={{ fontFamily: SANS, fontSize: "0.78rem", color: T.inkMuted }}
              >
                {reason ?? "Payment was cancelled"} · Cart saved
              </Typography>
            </Box>
          </Box>
        </motion.div>

        {/* Possible reasons card */}
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
                  background: T.red,
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
                Possible reasons
              </Typography>
            </Box>

            {/* Reason rows */}
            <Box sx={{ p: 2.5, display: "flex", flexDirection: "column", gap: 1.25 }}>
              {REASONS.map((r, i) => (
                <motion.div
                  key={r.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 + i * 0.07, duration: 0.38, ease: EASE }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 2,
                      px: 2.5,
                      py: 1.75,
                      borderRadius: "12px",
                      border: `1px solid ${T.border}`,
                      background: T.bg,
                    }}
                  >
                    {/* Dot */}
                    <Box
                      sx={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: T.inkFaint,
                        flexShrink: 0,
                        mt: "7px",
                      }}
                    />
                    <Box>
                      <Typography
                        sx={{
                          fontFamily: SANS,
                          fontWeight: 600,
                          fontSize: "0.875rem",
                          color: T.ink,
                          mb: 0.2,
                        }}
                      >
                        {r.label}
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: SANS,
                          fontSize: "0.8rem",
                          color: T.inkMuted,
                          lineHeight: 1.6,
                        }}
                      >
                        {r.detail}
                      </Typography>
                    </Box>
                  </Box>
                </motion.div>
              ))}
            </Box>
          </Box>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.45, ease: EASE }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {/* Retry — go back to checkout */}
            <Box
              component="button"
              onClick={() => router.push("/checkout")}
              sx={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                py: "13px",
                borderRadius: "12px",
                border: "none",
                background: T.primary,
                color: "#fff",
                fontFamily: SANS,
                fontWeight: 600,
                fontSize: "0.9rem",
                cursor: "pointer",
                transition: "filter 0.18s",
                "&:hover": { filter: "brightness(1.08)" },
              }}
            >
              ↺ Try again
            </Box>

            {/* Back to templates */}
            <Box
              component={Link}
              href="/templates"
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                py: "13px",
                borderRadius: "12px",
                border: `1.5px solid ${T.border}`,
                color: T.inkMid,
                fontFamily: SANS,
                fontWeight: 500,
                fontSize: "0.875rem",
                textDecoration: "none",
                transition: "border-color 0.18s",
                "&:hover": { borderColor: "rgba(37,57,87,0.28)" },
              }}
            >
              Back to templates
            </Box>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}