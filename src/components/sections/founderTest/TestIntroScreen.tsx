"use client";

import { Box, Typography } from "@mui/material";
import { ArrowForward as ArrowIcon } from "@mui/icons-material";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useCallback, useRef } from "react";

/* ══ TOKENS ══════════════════════════════════════════════ */
const T = {
  /* surfaces */
  white: "#FFFFFF",
  offwhite: "#F9FAFF",
  cream: "#F4F7FF",
  parchment: "#E9EEFF",

  /* text */
  ink: "#0B1220",
  inkMid: "#1E293B",
  inkMuted: "#475569",
  inkFaint: "#94A3B8",
  inkGhost: "#CBD5E1",

  /* borders */
  border: "#E2E8F0",
  borderMd: "#CBD5E1",

  /* blue highlight system */
  highlight: "#2563EB",
  highlightMid: "#3B82F6",
  highlightSoft: "rgba(37,99,235,0.10)",
  highlightGlow: "rgba(37,99,235,0.25)",

  /* states */
  error: "#DC2626",
};

const SERIF = '"Instrument Serif","Playfair Display",Georgia,serif';
const SANS = '"DM Sans","Mona Sans",system-ui,sans-serif';
const MONO = '"DM Mono","JetBrains Mono",ui-monospace,monospace';
const EASE = [0.16, 1, 0.3, 1] as const;

/* personality types */
const TYPES = [
  {
    label: "Strategic Visionary",
    sub: "Long-term pattern recogniser",
    icon: "◈",
    accent: "#2563EB",
  },
  {
    label: "Analytical Optimizer",
    sub: "Data-driven decision maker",
    icon: "◆",
    accent: "#7C3AED",
  },
  {
    label: "Growth Accelerator",
    sub: "Revenue-first thinker",
    icon: "△",
    accent: "#059669",
  },
  {
    label: "Cautious Builder",
    sub: "Risk-aware operator",
    icon: "○",
    accent: "#D97706",
  },
  {
    label: "Dynamic Innovator",
    sub: "Creative capital deployer",
    icon: "◇",
    accent: "#BE185D",
  },
];

/* ── 3D Tilt Card ─────────────────────────────────────── */
function TypeCard({ type, index }: { type: (typeof TYPES)[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 300, damping: 28 });
  const sy = useSpring(my, { stiffness: 300, damping: 28 });

  const rx = useTransform(sy, [-0.5, 0.5], ["6deg", "-6deg"]);
  const ry = useTransform(sx, [-0.5, 0.5], ["-6deg", "6deg"]);
  const glX = useTransform(sx, [-0.5, 0.5], ["10%", "90%"]);
  const glY = useTransform(sy, [-0.5, 0.5], ["10%", "90%"]);

  const onMove = useCallback(
    (e: React.MouseEvent) => {
      const r = ref.current?.getBoundingClientRect();
      if (!r) return;
      mx.set((e.clientX - r.left) / r.width - 0.5);
      my.set((e.clientY - r.top) / r.height - 0.5);
    },
    [mx, my],
  );

  const onLeave = useCallback(() => {
    mx.set(0);
    my.set(0);
  }, [mx, my]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 + index * 0.08, duration: 0.6, ease: EASE }}
      style={{ perspective: 900 }}
    >
      <motion.div
        ref={ref}
        style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
      >
        <Box
          sx={{
            position: "relative",
            background: T.white,
            borderRadius: "14px",
            border: `1px solid ${T.border}`,
            p: "14px 18px",
            boxShadow: "0 4px 16px rgba(0,0,0,0.05)",
            overflow: "hidden",
          }}
        >
          {/* Shine */}
          <motion.div
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              borderRadius: "14px",
              background: `radial-gradient(circle at ${glX} ${glY}, ${T.highlightGlow} 0%, transparent 65%)`,
            }}
          />

          <Typography
            sx={{ fontFamily: MONO, fontSize: "0.75rem", color: type.accent }}
          >
            {type.icon}
          </Typography>

          <Typography
            sx={{
              fontFamily: SERIF,
              fontStyle: "italic",
              fontSize: "1rem",
              color: T.ink,
              lineHeight: 1.2,
              mt: 0.5,
            }}
          >
            {type.label}
          </Typography>

          <Typography
            sx={{
              fontFamily: MONO,
              fontSize: "0.55rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: T.inkGhost,
              mt: 0.5,
            }}
          >
            {type.sub}
          </Typography>
        </Box>
      </motion.div>
    </motion.div>
  );
}

/* ── Start Button ─────────────────────────────────────── */
function StartButton({
  onClick,
  disabled,
}: {
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? {} : { scale: 1.03 }}
      whileTap={disabled ? {} : { scale: 0.97 }}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 12,
        padding: "14px 28px",
        borderRadius: "12px",
        border: "none",
        background: disabled
          ? T.parchment
          : `linear-gradient(115deg,${T.highlightMid},${T.highlight})`,
        color: "#fff",
        cursor: disabled ? "default" : "pointer",
        boxShadow: disabled ? "none" : `0 8px 28px ${T.highlightGlow}`,
        transition: "all 0.2s ease",
      }}
    >
      <Typography
        sx={{ fontFamily: SANS, fontWeight: 700, fontSize: "0.95rem" }}
      >
        Begin Assessment
      </Typography>
      <ArrowIcon sx={{ fontSize: "1rem" }} />
    </motion.button>
  );
}

interface Props {
  isLoading: boolean;
  isError: boolean;
  totalQuestions: number;
  onStart: () => void;
}

/* ── Main Screen ───────────────────────────────────────── */
export function TestIntroScreen({
  isLoading,
  isError,
  totalQuestions,
  onStart,
}: Props) {
  return (
    <Box sx={{ minHeight: "100vh", background: T.offwhite, fontFamily: SANS }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          minHeight: "100vh",
        }}
      >
        {/* LEFT PANEL → now light */}
        <Box
          sx={{
            flex: "0 0 45%",
            background: T.cream,
            color: T.ink,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            p: { xs: "60px 32px", md: "80px 56px" },
          }}
        >
          <Typography
            sx={{
              fontFamily: SERIF,
              fontStyle: "italic",
              fontSize: { xs: "2.2rem", md: "3rem" },
              lineHeight: 1.05,
              mb: 3,
            }}
          >
            What kind of <br />
            <span
              style={{
                background: `linear-gradient(115deg,${T.highlightMid},${T.highlight})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              financial founder
            </span>
            <br />
            are you?
          </Typography>

          <Typography
            sx={{
              fontFamily: MONO,
              fontSize: "0.7rem",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: T.inkMuted,
            }}
          >
            {isLoading
              ? "Loading…"
              : `${totalQuestions} Questions · 5 Minutes · Free PDF`}
          </Typography>
        </Box>

        {/* RIGHT PANEL */}
        <Box
          sx={{
            flex: 1,
            background: T.cream,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            p: { xs: "48px 32px", md: "80px 64px" },
          }}
        >
          <Box sx={{ maxWidth: 480 }}>
            {TYPES.map((type, i) => (
              <TypeCard key={type.label} type={type} index={i} />
            ))}

            <Box sx={{ mt: 5 }}>
              <StartButton onClick={onStart} disabled={isError} />

              {isError && (
                <Typography sx={{ color: T.error, mt: 2 }}>
                  Failed to load questions. Please refresh.
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
