'use client';

import { useRef } from 'react';
import { Box, Typography, Container } from '@mui/material';
import { motion } from 'framer-motion';
import Link from 'next/link';

/* ══ MODERN SAAS TOKENS ══════════════════════ */
const T = {
  bg: "#F5F7FB",
  card: "#FFFFFF",
  ink: "#0A0A0F",
  inkMid: "#3A3A52",
  inkMuted: "#5A5A72",
  border: "rgba(10,10,20,0.08)",

  primary: "#3B7BF6",
  primaryGlow: "rgba(59,123,246,0.16)",

  danger: "#E5484D",
  dangerSoft: "rgba(229,72,77,0.08)",

  amber: "#D97706",
  purple: "#6D28D9",
  teal: "#0F766E",
};

const SANS = '"DM Sans","Mona Sans",system-ui,sans-serif';

/* ══ REASONS ══════════════════════ */
const REASONS = [
  { icon: "⟡", title: "Bank declined transaction", desc: "Your bank rejected this payment attempt.", color: T.danger },
  { icon: "⟠", title: "Network interruption", desc: "Connection dropped before confirmation.", color: T.amber },
  { icon: "⟡", title: "Session expired", desc: "Payment window timed out for security.", color: T.purple },
  { icon: "●", title: "Card verification failed", desc: "Authentication step was not completed.", color: T.teal },
];

/* ══ REASON CARD ══════════════════════ */
function ReasonCard({ r }: any) {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 1.5,
        p: 2,
        borderRadius: "14px",
        background: T.card,
        border: `1px solid ${T.border}`,
        transition: "0.2s",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: `0 8px 24px ${T.primaryGlow}`,
        },
      }}
    >
      <Box
        sx={{
          width: 34,
          height: 34,
          borderRadius: "10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: r.color + "15",
          color: r.color,
          fontSize: 14,
          flexShrink: 0,
        }}
      >
        {r.icon}
      </Box>

      <Box>
        <Typography sx={{ fontFamily: SANS, fontWeight: 600, fontSize: "0.9rem", color: T.ink }}>
          {r.title}
        </Typography>
        <Typography sx={{ fontFamily: SANS, fontSize: "0.8rem", color: T.inkMuted }}>
          {r.desc}
        </Typography>
      </Box>
    </Box>
  );
}

/* ══ CTA BUTTON ══════════════════════ */
function CTA({ href, primary, children }: any) {
  return (
    <Box
      component={Link}
      href={href}
      sx={{
        flex: 1,
        textDecoration: "none",
        textAlign: "center",
        px: 3,
        py: 1.6,
        borderRadius: "14px",
        fontFamily: SANS,
        fontWeight: 600,
        fontSize: "0.9rem",
        transition: "0.2s",
        background: primary ? T.primary : "transparent",
        color: primary ? "#fff" : T.ink,
        border: primary ? "none" : `1px solid ${T.border}`,
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: primary ? `0 10px 30px ${T.primaryGlow}` : "none",
        },
      }}
    >
      {children}
    </Box>
  );
}

/* ══ PAGE ══════════════════════ */
export default function FailurePage() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: T.bg,
        display: "flex",
        alignItems: "center",
        py: 10,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* soft ambient glow */}
      <Box sx={{
        position: "absolute",
        width: "60vw",
        height: "60vw",
        top: "-20vw",
        left: "-10vw",
        background: `radial-gradient(circle, ${T.primaryGlow}, transparent 60%)`,
        borderRadius: "50%",
      }} />

      <Container maxWidth="sm" sx={{ position: "relative" }}>
        {/* ICON */}
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <Box
            sx={{
              width: 90,
              height: 90,
              borderRadius: "50%",
              background: "#fff",
              border: `1px solid ${T.border}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mx: "auto",
              mb: 4,
            }}
          >
            <Typography sx={{ fontSize: 28, color: T.danger }}>✕</Typography>
          </Box>
        </motion.div>

        {/* HEADLINE */}
        <Box textAlign="center" mb={5}>
          <Typography sx={{ fontFamily: SANS, fontWeight: 800, fontSize: "2.4rem", color: T.ink }}>
            Payment didn’t go through
          </Typography>
          <Typography sx={{ fontFamily: SANS, fontSize: "1rem", color: T.inkMuted, mt: 1 }}>
            No charge was made. You can safely try again.
          </Typography>
        </Box>

        {/* REASONS */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mb: 4 }}>
          {REASONS.map((r, i) => (
            <ReasonCard key={i} r={r} />
          ))}
        </Box>

        {/* CTAs */}
        <Box sx={{ display: "flex", gap: 2, mb: 5 }}>
          <CTA href="/checkout" primary>
            Try again
          </CTA>
          <CTA href="/support">
            Get help
          </CTA>
        </Box>

        {/* TRUST */}
        <Typography
          textAlign="center"
          sx={{ fontFamily: SANS, fontSize: "0.75rem", color: T.inkMuted }}
        >
          Secured by Razorpay · Zero data stored · Instant retry supported
        </Typography>
      </Container>
    </Box>
  );
}