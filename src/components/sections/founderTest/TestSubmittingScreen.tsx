"use client";

import { Box, Typography } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const T = {
  darkBg:    "#0D1B2E",
  darkGlow1: "rgba(99,102,241,0.15)",
  darkGlow2: "rgba(236,72,153,0.08)",
  darkBorder:"rgba(255,255,255,0.08)",
  white:     "#FFFFFF",
  ink:       "#0A0A0F",
  inkMuted:  "#5A6478",
  inkFaint:  "#A0A0AE",
  border:    "rgba(10,10,20,0.08)",
  grad:      "linear-gradient(135deg, #818CF8, #A855F7, #EC4899)",
  gradHoriz: "linear-gradient(90deg, #818CF8, #EC4899)",
};

const SANS = '"DM Sans", system-ui, sans-serif';
const MONO = '"DM Mono", ui-monospace, monospace';
const EASE = [0.16, 1, 0.3, 1] as const;

const STEPS = [
  { text: "Analysing your answers",           dur: 1.4 },
  { text: "Calculating personality scores",   dur: 1.2 },
  { text: "Building your growth playbook",    dur: 1.4 },
  { text: "Preparing your report",            dur: 1.0 },
];

function PulseRing({ delay, color }: { delay: number; color: string }) {
  return (
    <motion.div
      initial={{ scale: 0.6, opacity: 0.6 }}
      animate={{ scale: 1.8, opacity: 0 }}
      transition={{ duration: 2.4, delay, repeat: Infinity, ease: "easeOut" }}
      style={{
        position: "absolute", width: 96, height: 96,
        borderRadius: "50%", border: `1px solid ${color}`,
        top: "50%", left: "50%", transform: "translate(-50%,-50%)",
        pointerEvents: "none",
      }}
    />
  );
}

export function TestSubmittingScreen() {
  const [activeStep, setActiveStep] = useState(0);
  const [complete, setComplete]     = useState(false);

  useEffect(() => {
    let t = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];
    STEPS.forEach((s, i) => {
      t += i === 0 ? 0.3 : STEPS[i - 1].dur + 0.2;
      timers.push(setTimeout(() => setActiveStep(i), t * 1000));
    });
    const total = STEPS.reduce((a, s) => a + s.dur, 0) + 0.8;
    timers.push(setTimeout(() => setComplete(true), (total + 0.4) * 1000));
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <Box sx={{
      minHeight: "100vh",
      background: T.darkBg,
      display: "flex", alignItems: "center", justifyContent: "center",
      flexDirection: "column",
      position: "relative", overflow: "hidden",
      fontFamily: SANS,
    }}>
      {/* Glows */}
      <Box sx={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: `
          radial-gradient(ellipse 65% 55% at 20% 40%, ${T.darkGlow1}, transparent),
          radial-gradient(ellipse 50% 45% at 80% 65%, ${T.darkGlow2}, transparent)
        `,
      }} />
      {/* Grid */}
      <Box sx={{
        position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.03,
        backgroundImage: `linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)`,
        backgroundSize: "48px 48px",
      }} />

      <Box sx={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: 440, px: 3, width: "100%" }}>

        {/* Orb */}
        <Box sx={{ position: "relative", width: 96, height: 96, mx: "auto", mb: 5 }}>
          <PulseRing delay={0}   color="rgba(129,140,248,0.4)" />
          <PulseRing delay={0.8} color="rgba(168,85,247,0.25)" />
          <PulseRing delay={1.6} color="rgba(236,72,153,0.18)" />

          {/* Spinning ring */}
          <motion.div
            animate={{ rotate: complete ? 0 : 360 }}
            transition={complete ? { duration: 0.4, ease: EASE } : { duration: 8, repeat: Infinity, ease: "linear" }}
            style={{ position: "absolute", inset: 0 }}
          >
            <Box sx={{ width: "100%", height: "100%", borderRadius: "50%", border: "1.5px dashed rgba(255,255,255,0.12)" }} />
          </motion.div>

          {/* Center */}
          <Box sx={{
            position: "absolute", width: 72, height: 72, borderRadius: "50%",
            top: "50%", left: "50%", transform: "translate(-50%,-50%)",
            background: T.grad,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 0 8px rgba(129,140,248,0.12), 0 12px 40px rgba(124,58,237,0.35)",
          }}>
            <AnimatePresence mode="wait">
              {complete ? (
                <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 400, damping: 22 }}>
                  <Typography sx={{ fontFamily: MONO, fontSize: "1.5rem", color: T.white, lineHeight: 1 }}>✓</Typography>
                </motion.div>
              ) : (
                <motion.div key="spin" animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
                  <Typography sx={{ fontFamily: MONO, fontSize: "1.25rem", color: T.white, lineHeight: 1 }}>◈</Typography>
                </motion.div>
              )}
            </AnimatePresence>
          </Box>
        </Box>

        {/* Headline */}
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE }}>
          <Typography sx={{
            fontFamily: SANS, fontWeight: 800,
            fontSize: { xs: "1.625rem", md: "2rem" },
            letterSpacing: "-0.03em", lineHeight: 1.1,
            color: T.white, mb: 0.75,
          }}>
            {complete ? "Your report is ready." : "Generating your report…"}
          </Typography>
          <Typography sx={{ fontFamily: SANS, fontSize: "0.9rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.7, mb: 4.5 }}>
            {complete
              ? "Check your inbox — your detailed PDF has been sent."
              : "Analysing your answers to build a personalised profile."}
          </Typography>
        </motion.div>

        {/* Step list */}
        <Box sx={{
          background: "rgba(255,255,255,0.04)",
          border: `1px solid ${T.darkBorder}`,
          borderRadius: "10px", p: 2.5,
          display: "flex", flexDirection: "column", gap: 1.5, textAlign: "left",
        }}>
          {STEPS.map((step, i) => {
            const done   = i < activeStep || complete;
            const active = i === activeStep && !complete;
            return (
              <motion.div key={step.text} initial={{ opacity: 0, x: -10 }} animate={{ opacity: i <= activeStep || complete ? 1 : 0.28, x: 0 }}
                transition={{ delay: i * 0.1, duration: 0.35, ease: EASE }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  {/* Status dot */}
                  <Box sx={{
                    width: 18, height: 18, borderRadius: "50%", flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: done ? T.grad : active ? "rgba(129,140,248,0.2)" : T.darkBorder,
                    border: active ? "1px solid rgba(129,140,248,0.5)" : "none",
                    boxShadow: active ? "0 0 10px rgba(129,140,248,0.4)" : "none",
                    transition: "all 0.3s",
                  }}>
                    {done ? (
                      <Typography sx={{ fontFamily: MONO, fontSize: "0.5rem", color: T.white, lineHeight: 1 }}>✓</Typography>
                    ) : active ? (
                      <motion.div animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }} transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                        style={{ width: 5, height: 5, borderRadius: "50%", background: "#A5B4FC" }} />
                    ) : (
                      <Box sx={{ width: 4, height: 4, borderRadius: "50%", background: "rgba(255,255,255,0.15)" }} />
                    )}
                  </Box>
                  <Typography sx={{
                    fontFamily: SANS, fontSize: "0.875rem",
                    color: done || active ? T.white : "rgba(255,255,255,0.28)",
                    fontWeight: active ? 500 : 400, transition: "color 0.3s",
                  }}>
                    {step.text}
                    {active && (
                      <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 1.2, repeat: Infinity }}>…</motion.span>
                    )}
                  </Typography>
                </Box>
              </motion.div>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}