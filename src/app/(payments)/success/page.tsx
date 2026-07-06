"use client";

import { useEffect, useRef, useCallback } from "react";
import { Box, Typography, Container } from "@mui/material";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Link from "next/link";

/* ══ $50K SAAS PREMIUM TOKENS ══════════════════════ */
const T = {
  bg: "#F6F7FB",
  card: "#FFFFFF",

  ink: "#0B1220",
  inkMid: "#334155",
  inkMuted: "rgba(15,23,42,0.65)",
  inkFaint: "rgba(15,23,42,0.45)",

  border: "rgba(15,23,42,0.10)",
  borderMid: "rgba(15,23,42,0.16)",

  success: "#16A34A",
  successSoft: "rgba(22,163,74,0.10)",

  accent: "#0F172A",

  glow: "rgba(15,23,42,0.08)",
};

const SANS = '"DM Sans","Mona Sans",system-ui,sans-serif';
const EASE = [0.16, 1, 0.3, 1] as const;

const STEPS = [
  {
    icon: "✓",
    step: "01",
    title: "Email confirmed",
    detail: "Your receipt and access details are now in your inbox.",
    accent: T.success,
  },
  {
    icon: "⟡",
    step: "02",
    title: "Processing access",
    detail: "We’re preparing your workspace and unlocking assets.",
    accent: "#0F172A",
  },
  {
    icon: "◆",
    step: "03",
    title: "Ready to use",
    detail: "Everything will be instantly available once verified.",
    accent: "#1E293B",
  },
];

/* subtle floating particles (no confetti chaos) */
function Particle({ i }: { i: number }) {
  const left = (i * 37) % 100;
  const delay = (i * 0.12) % 2;

  return (
    <motion.div
      initial={{ opacity: 0, y: 0 }}
      animate={{ opacity: [0, 0.4, 0], y: -200 }}
      transition={{
        duration: 6,
        repeat: Infinity,
        delay,
      }}
      style={{
        position: "fixed",
        left: `${left}%`,
        bottom: 0,
        width: 2,
        height: 2,
        borderRadius: 999,
        background: "rgba(15,23,42,0.25)",
        pointerEvents: "none",
      }}
    />
  );
}

/* Step Card (clean SaaS style) */
function StepCard({ step, index }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 + index * 0.08, duration: 0.5, ease: EASE }}
    >
      <Box
        sx={{
          display: "flex",
          gap: 2,
          p: "16px 18px",
          borderRadius: "14px",
          border: `1px solid ${T.border}`,
          background: T.card,
          transition: "all 0.2s ease",
          "&:hover": {
            borderColor: "rgba(15,23,42,0.22)",
            boxShadow: `0 10px 30px ${T.glow}`,
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
            background: T.successSoft,
            color: step.accent,
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          {step.icon}
        </Box>

        <Box>
          <Typography
            sx={{
              fontFamily: SANS,
              fontWeight: 600,
              fontSize: "0.9rem",
              color: T.ink,
            }}
          >
            {step.title}
          </Typography>

          <Typography
            sx={{
              fontFamily: SANS,
              fontSize: "0.82rem",
              color: T.inkMuted,
              mt: 0.4,
              lineHeight: 1.5,
            }}
          >
            {step.detail}
          </Typography>
        </Box>
      </Box>
    </motion.div>
  );
}

/* CTA Button */
function ActionBtn({ href, label, primary }: any) {
  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Box
        component={Link}
        href={href}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          px: 3,
          py: 1.5,
          borderRadius: "12px",
          textDecoration: "none",
          fontFamily: SANS,
          fontWeight: 600,
          fontSize: "0.9rem",

          background: primary ? T.accent : T.card,
          color: primary ? "#fff" : T.ink,

          border: primary ? "none" : `1px solid ${T.border}`,
          boxShadow: primary ? `0 12px 30px rgba(15,23,42,0.15)` : "none",
        }}
      >
        {label}
      </Box>
    </motion.div>
  );
}

/* MAIN PAGE */
export default function SuccessPage() {
  const fired = useRef(true);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #F6F7FB 0%, #FFFFFF 50%, #F6F7FB 100%)",
        position: "relative",
        overflow: "hidden",
        py: { xs: 10, md: 14 },
      }}
    >
      {/* soft floating particles */}
      {fired.current &&
        Array.from({ length: 18 }).map((_, i) => <Particle key={i} i={i} />)}

      <Container maxWidth="sm" sx={{ position: "relative", zIndex: 1 }}>
        {/* SUCCESS MARK */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mb: 4,
            }}
          >
            <Box
              sx={{
                width: 84,
                height: 84,
                borderRadius: "50%",
                background: "#fff",
                border: `1px solid ${T.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: `0 20px 60px rgba(15,23,42,0.08)`,
              }}
            >
              <Box
                sx={{
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  background: T.success,
                }}
              />
            </Box>
          </Box>
        </motion.div>

        {/* HEADLINE */}
        <Box sx={{ textAlign: "center", mb: 5 }}>
          <Typography
            sx={{
              fontFamily: SANS,
              fontSize: { xs: "2.2rem", md: "2.8rem" },
              fontWeight: 700,
              color: T.ink,
              letterSpacing: "-0.03em",
            }}
          >
            Payment successful
          </Typography>

          <Typography
            sx={{
              fontFamily: SANS,
              fontSize: "0.95rem",
              color: T.inkMuted,
              mt: 1,
            }}
          >
            Your access is being prepared. You’re all set.
          </Typography>
        </Box>

        {/* STEPS */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          {STEPS.map((s, i) => (
            <StepCard key={s.title} step={s} index={i} />
          ))}
        </Box>

        {/* CTA */}
        <Box
          sx={{
            mt: 4,
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
          }}
        >
          <ActionBtn href="/founder-test" label="Continue to Founders Test" primary />
          <ActionBtn href="/blog" label="Read Our Blog" />
        </Box>
      </Container>
    </Box>
  );
}