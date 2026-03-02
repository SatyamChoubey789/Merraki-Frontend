"use client";

import { Box, Typography } from "@mui/material";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { useEffect, useState } from "react";

const T = {
  ink: "#0C0E12",
  inkMid: "#F0EDE6",
  inkFaint: "#64748B",
  inkGhost: "#94A3B8",
  white: "#FFFFFF",
  cream: "#F0EDE6",
  parchment: "#E8E4DA",
  border: "#E2DED5",
  gold: "#B8922A",
  goldMid: "#C9A84C",
  goldLight: "#DDB96A",
};
const SERIF = '"Instrument Serif","Playfair Display",Georgia,serif';
const SANS = '"DM Sans","Mona Sans",system-ui,sans-serif';
const MONO = '"DM Mono","JetBrains Mono",ui-monospace,monospace';
const EASE = [0.16, 1, 0.3, 1] as const;

const STEPS = [
  { text: "Analysing your answers", dur: 1.4 },
  { text: "Calculating personality scores", dur: 1.2 },
  { text: "Building your growth playbook", dur: 1.4 },
  { text: "Preparing your report", dur: 1.0 },
];

/* ── Pulsing ring ─────────────────────────────────────── */
function PulseRing({
  delay,
  size,
  color,
}: {
  delay: number;
  size: number;
  color: string;
}) {
  return (
    <motion.div
      initial={{ scale: 0.6, opacity: 0.8 }}
      animate={{ scale: 1.6, opacity: 0 }}
      transition={{ duration: 2.2, delay, repeat: Infinity, ease: "easeOut" }}
      style={{
        position: "absolute",
        width: size,
        height: size,
        borderRadius: "50%",
        border: `1px solid ${color}`,
        top: "50%",
        left: "50%",
        transform: "translate(-50%,-50%)",
        pointerEvents: "none",
      }}
    />
  );
}

export function TestSubmittingScreen() {
  const [activeStep, setActiveStep] = useState(0);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    let t = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];
    STEPS.forEach((s, i) => {
      t += i === 0 ? 0.3 : STEPS[i - 1].dur + 0.25;
      timers.push(setTimeout(() => setActiveStep(i), t * 1000));
    });
    const total = STEPS.reduce((a, s) => a + s.dur, 0) + 0.8;
    timers.push(setTimeout(() => setComplete(true), (total + 0.5) * 1000));
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: T.cream,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
        fontFamily: SANS,
        color: T.ink,
      }}
    >
      {/* Gold glow */}
      <Box
        sx={{
          position: "absolute",
          width: "70vw",
          height: "50vw",
          top: "-20vw",
          left: "15vw",
          borderRadius: "50%",
          background: `radial-gradient(ellipse,${T.goldLight}33 0%,transparent 70%)`,
          pointerEvents: "none",
        }}
      />

      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          textAlign: "center",
          maxWidth: 480,
          px: 4,
        }}
      >
        {/* ── Animated orb ── */}
        <Box
          sx={{
            position: "relative",
            width: 120,
            height: 120,
            mx: "auto",
            mb: 6,
          }}
        >
          <PulseRing delay={0} size={120} color={`${T.gold}55`} />
          <PulseRing delay={0.8} size={120} color={`${T.gold}33`} />
          <PulseRing delay={1.6} size={120} color={`${T.gold}22`} />
          <motion.div
            animate={{ rotate: complete ? 0 : 360 }}
            transition={
              complete
                ? { duration: 0.4, ease: EASE }
                : { duration: 12, repeat: Infinity, ease: "linear" }
            }
            style={{ position: "absolute", inset: 0 }}
          >
            <Box
              sx={{
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                border: `1.5px dashed ${T.gold}33`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            />
          </motion.div>

          {/* Center orb */}
          <Box
            sx={{
              position: "absolute",
              width: 88,
              height: 88,
              borderRadius: "50%",
              top: "50%",
              left: "50%",
              transform: "translate(-50%,-50%)",
              background: `linear-gradient(135deg,${T.goldLight},${T.gold})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: `0 0 0 8px ${T.gold}22, 0 12px 40px ${T.gold}55`,
            }}
          >
            <AnimatePresence mode="wait">
              {complete ? (
                <motion.div
                  key="check"
                  initial={{ scale: 0, rotate: "-30deg" }}
                  animate={{ scale: 1, rotate: "0deg" }}
                  transition={{ type: "spring", stiffness: 400, damping: 22 }}
                >
                  <Typography
                    sx={{
                      fontFamily: SERIF,
                      fontStyle: "italic",
                      fontSize: "2.25rem",
                      color: T.ink,
                      lineHeight: 1,
                    }}
                  >
                    ✓
                  </Typography>
                </motion.div>
              ) : (
                <motion.div
                  key="orb"
                  animate={{ scale: [1, 1.04, 1] }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: MONO,
                      fontSize: "1.5rem",
                      color: T.ink,
                      lineHeight: 1,
                    }}
                  >
                    ◈
                  </Typography>
                </motion.div>
              )}
            </AnimatePresence>
          </Box>
        </Box>

        {/* ── Headline ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          <Typography
            sx={{
              fontFamily: SERIF,
              fontStyle: "italic",
              fontWeight: 400,
              fontSize: { xs: "1.625rem", md: "2.125rem" },
              letterSpacing: "-0.025em",
              lineHeight: 1.1,
              mb: 1,
            }}
          >
            {complete ? "Your report is ready." : "Generating your report…"}
          </Typography>
          <Typography
            sx={{
              fontFamily: SANS,
              fontSize: "0.9rem",
              lineHeight: 1.7,
              mb: 5,
            }}
          >
            {complete
              ? "Check your inbox — your detailed PDF has been sent."
              : "Analysing your answers to build a personalised profile."}
          </Typography>
        </motion.div>

        {/* ── Step list ── */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
            textAlign: "left",
          }}
        >
          {STEPS.map((step, i) => {
            const done = i < activeStep || complete;
            const active = i === activeStep && !complete;
            return (
              <motion.div
                key={step.text}
                initial={{ opacity: 0, x: -16 }}
                animate={{
                  opacity: i <= activeStep || complete ? 1 : 0.3,
                  x: 0,
                }}
                transition={{ delay: i * 0.12, duration: 0.4, ease: EASE }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.75 }}>
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      flexShrink: 0,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background:
                        done || active
                          ? `linear-gradient(135deg,${T.goldLight},${T.gold})`
                          : `${T.parchment}`,
                      boxShadow: active ? `0 0 12px ${T.gold}55` : "none",
                      transition: "all 0.3s ease",
                    }}
                  >
                    {done ? (
                      <Typography
                        sx={{
                          fontFamily: MONO,
                          fontSize: "0.55rem",
                          color: T.ink,
                          lineHeight: 1,
                        }}
                      >
                        ✓
                      </Typography>
                    ) : active ? (
                      <motion.div
                        animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
                        transition={{
                          duration: 1.2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        style={{
                          width: 5,
                          height: 5,
                          borderRadius: "50%",
                          background: T.ink,
                        }}
                      />
                    ) : (
                      <Box
                        sx={{
                          width: 5,
                          height: 5,
                          borderRadius: "50%",
                          background: T.parchment,
                        }}
                      />
                    )}
                  </Box>
                  <Typography
                    sx={{
                      fontFamily: SANS,
                      fontSize: "0.9rem",
                      color: done || active ? T.ink : T.inkGhost,
                      fontWeight: active ? 500 : 400,
                      transition: "color 0.3s",
                    }}
                  >
                    {step.text}
                    {active && (
                      <motion.span
                        animate={{ opacity: [1, 0, 1] }}
                        transition={{ duration: 1.2, repeat: Infinity }}
                      >
                        …
                      </motion.span>
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
