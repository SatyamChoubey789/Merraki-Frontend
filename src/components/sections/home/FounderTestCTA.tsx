"use client";

import { useRef, useCallback } from "react";
import { Box, Container, Typography } from "@mui/material";
import { ArrowForward as ArrowIcon } from "@mui/icons-material";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useInView,
} from "framer-motion";
import Link from "next/link";

/* ══ TOKENS — exact FinalCTA theme ══════════════════════ */
const T = {
  bg: "#FFFFFF",
  bgSection: "#F5F7FB",
  ink: "#0A0A0F",
  inkMid: "#3A3A52",
  inkMuted: "#5A5A72",
  inkFaint: "#9898AE",
  border: "rgba(10,10,20,0.08)",
  borderMid: "rgba(10,10,20,0.14)",
  blue: "#3B7BF6",
  blueLight: "#7AABFF",
  bluePale: "#EDF3FF",
  blueGlow: "rgba(59,123,246,0.18)",
  blueDim: "rgba(59,123,246,0.06)",
  blueGrad: "linear-gradient(135deg, #3B7BF6 0%, #7AABFF 100%)",
  blueBdr: "rgba(59,123,246,0.22)",
};

const SANS = '"DM Sans","Mona Sans",system-ui,sans-serif';
const EASE = [0.16, 1, 0.3, 1] as const;

const TYPES = [
  {
    icon: "◈",
    type: "Strategic Visionary",
    sub: "Long-term pattern recogniser",
    accent: "#2D5BE3",
  },
  {
    icon: "◆",
    type: "Analytical Optimizer",
    sub: "Data-driven decision maker",
    accent: "#6D28D9",
  },
  {
    icon: "△",
    type: "Growth Accelerator",
    sub: "Revenue-first thinker",
    accent: "#0D7A5F",
  },
  {
    icon: "○",
    type: "Cautious Builder",
    sub: "Risk-aware operator",
    accent: "#A35400",
  },
  {
    icon: "◇",
    type: "Dynamic Innovator",
    sub: "Creative capital deployer",
    accent: "#9D174D",
  },
];

function TypeRow({
  t,
  index,
  inView,
}: {
  t: (typeof TYPES)[0];
  index: number;
  inView: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 300, damping: 28 });
  const sy = useSpring(my, { stiffness: 300, damping: 28 });
  const rotX = useTransform(sy, [-0.5, 0.5], ["4deg", "-4deg"]);
  const rotY = useTransform(sx, [-0.5, 0.5], ["-4deg", "4deg"]);
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
      initial={{ opacity: 0, x: 24 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay: 0.25 + index * 0.09, duration: 0.55, ease: EASE }}
      style={{ perspective: 900 }}
    >
      <motion.div
        ref={ref}
        style={{ rotateX: rotX, rotateY: rotY, transformStyle: "preserve-3d" }}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        whileHover={{
          z: 10,
          transition: { type: "spring", stiffness: 380, damping: 30 },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            px: 2.5,
            py: "14px",
            background: T.bg,
            borderRadius: "14px",
            border: `1px solid ${T.border}`,
            position: "relative",
            overflow: "hidden",
            boxShadow: `0 2px 10px ${T.blueDim}`,
            transition: "border-color 0.2s, box-shadow 0.2s",
            "&:hover": {
              borderColor: T.blueBdr,
              boxShadow: `0 6px 24px ${T.blueGlow}`,
            },
            cursor: "default",
          }}
        >
          <motion.div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "14px",
              pointerEvents: "none",
              background: `radial-gradient(circle at ${glX} ${glY}, rgba(255,255,255,0.7) 0%, transparent 60%)`,
            }}
          />
          <Box
            sx={{
              position: "absolute",
              left: 0,
              top: 8,
              bottom: 8,
              width: 2,
              borderRadius: "0 2px 2px 0",
              background: `linear-gradient(180deg, ${t.accent}88, ${t.accent})`,
            }}
          />
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: "9px",
              flexShrink: 0,
              ml: 0.5,
              background: `${t.accent}0e`,
              border: `1px solid ${t.accent}22`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              sx={{
                fontFamily: SANS,
                fontSize: "0.85rem",
                color: t.accent,
                lineHeight: 1,
              }}
            >
              {t.icon}
            </Typography>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography
              sx={{
                fontFamily: SANS,
                fontWeight: 600,
                fontSize: "0.9375rem",
                color: T.ink,
                letterSpacing: "-0.01em",
                lineHeight: 1.2,
              }}
            >
              {t.type}
            </Typography>
            <Typography
              sx={{
                fontFamily: SANS,
                fontSize: "0.72rem",
                fontWeight: 500,
                color: T.inkFaint,
                mt: "2px",
              }}
            >
              {t.sub}
            </Typography>
          </Box>
          <Box
            sx={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: t.accent,
              opacity: 0.5,
              flexShrink: 0,
            }}
          />
        </Box>
      </motion.div>
    </motion.div>
  );
}

export function FounderTestCTA() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <Box
      ref={sectionRef}
      sx={{
        py: { xs: 12, md: 18 },
        background: `linear-gradient(135deg, ${T.bluePale} 0%, ${T.bgSection} 50%, ${T.bluePale} 100%)`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient blobs — exact FinalCTA */}
      <Box
        sx={{
          position: "absolute",
          width: "60vw",
          height: "60vw",
          top: "-20vw",
          left: "-10vw",
          borderRadius: "50%",
          background: `radial-gradient(ellipse, ${T.blueGlow} 0%, transparent 60%)`,
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
          background: `radial-gradient(ellipse, ${T.blueDim} 0%, transparent 60%)`,
          pointerEvents: "none",
        }}
      />

      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
            gap: { xs: 8, md: 12 },
            alignItems: "center",
          }}
        >
          {/* LEFT: Copy */}
          <motion.div
            initial={{ opacity: 0, x: -28 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.65, ease: EASE }}
          >
            <Box>
              {/* Headline */}
              <Box sx={{ mb: 3 }}>
                <Typography
                  sx={{
                    fontFamily: SANS,
                    fontWeight: 800,
                    fontSize: { xs: "2.25rem", sm: "3rem", md: "3.75rem" },
                    color: T.ink,
                    letterSpacing: "-0.03em",
                    lineHeight: 1.05,
                    mb: 0.5,
                  }}
                >
                  Discover your
                </Typography>
                <Typography
                  sx={{
                    fontFamily: SANS,
                    fontWeight: 300,
                    fontSize: { xs: "2.25rem", sm: "3rem", md: "3.75rem" },
                    letterSpacing: "-0.03em",
                    lineHeight: 1.05,
                    mb: 0.5,
                    background: T.blueGrad,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  financial
                </Typography>
                <Typography
                  sx={{
                    fontFamily: SANS,
                    fontWeight: 800,
                    fontSize: { xs: "2.25rem", sm: "3rem", md: "3.75rem" },
                    color: T.ink,
                    letterSpacing: "-0.03em",
                    lineHeight: 1.05,
                  }}
                >
                  personality.
                </Typography>
              </Box>

              {/* Body */}
              <Typography
                sx={{
                  fontFamily: SANS,
                  fontWeight: 400,
                  fontSize: { xs: "0.9rem", md: "1rem" },
                  color: T.inkMuted,
                  lineHeight: 1.8,
                  mb: 5,
                  maxWidth: 420,
                }}
              >
                Take our founder assessment and receive a personalised report on
                your financial strengths, risk areas, and a custom growth
                playbook. Free, instant, insightful.
              </Typography>

              {/* CTA */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1.75,
                  alignItems: "flex-start",
                }}
              >
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Box
                    component={Link}
                    href="/founder-test"
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 1.5,
                      px: "28px",
                      py: "14px",
                      borderRadius: "14px",
                      border: "none",
                      background: T.blueGrad,
                      textDecoration: "none",
                      boxShadow: `0 8px 28px ${T.blueGlow}`,
                      transition: "box-shadow 0.2s",
                      "&:hover": {
                        filter: "brightness(1.08)",
                        boxShadow: `0 12px 36px ${T.blueGlow}`,
                      },
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: SANS,
                        fontWeight: 600,
                        fontSize: "1rem",
                        letterSpacing: "-0.01em",
                        color: "#FFFFFF",
                      }}
                    >
                      Start Free Test
                    </Typography>
                    <ArrowIcon sx={{ fontSize: "1rem", color: "#FFFFFF" }} />
                  </Box>
                </motion.div>
                <Typography
                  sx={{
                    fontFamily: SANS,
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    color: T.inkFaint,
                  }}
                >
                  No account required · Report emailed instantly
                </Typography>
              </Box>

              {/* Trust metrics */}
              <Box
                sx={{
                  display: "flex",
                  gap: 0,
                  mt: 5,
                  pt: 4,
                  borderTop: `1px solid ${T.border}`,
                  flexWrap: "wrap",
                }}
              >
                {[
                  { val: "2,400+", label: "Tests taken" },
                  { val: "4.9", label: "Avg rating" },
                  { val: "Free", label: "Always" },
                ].map((s, i) => (
                  <Box
                    key={s.label}
                    sx={{
                      pr: 3.5,
                      pl: i === 0 ? 0 : 3.5,
                      borderLeft: i > 0 ? `1px solid ${T.border}` : "none",
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: SANS,
                        fontWeight: 800,
                        fontSize: "1.375rem",
                        color: T.ink,
                        letterSpacing: "-0.03em",
                        lineHeight: 1,
                        mb: 0.3,
                      }}
                    >
                      {s.val}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: SANS,
                        fontSize: "0.72rem",
                        fontWeight: 500,
                        color: T.inkFaint,
                      }}
                    >
                      {s.label}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </motion.div>

          {/* RIGHT: Type cards */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
            {TYPES.map((t, i) => (
              <TypeRow key={t.type} t={t} index={i} inView={inView} />
            ))}

            {/* Bottom note */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.9, duration: 0.45 }}
            >
              <Box
                sx={{
                  mt: 0.5,
                  px: 2.5,
                  py: 1.5,
                  background: T.blueDim,
                  border: `1px solid rgba(59,123,246,0.14)`,
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                }}
              >
                <Box
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: T.blue,
                    flexShrink: 0,
                  }}
                />
                <Typography
                  sx={{
                    fontFamily: SANS,
                    fontSize: "0.8125rem",
                    color: T.inkMuted,
                    lineHeight: 1.5,
                  }}
                >
                  Answer 12 questions. Discover which type you are and get a
                  personalised PDF playbook.
                </Typography>
              </Box>
            </motion.div>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
