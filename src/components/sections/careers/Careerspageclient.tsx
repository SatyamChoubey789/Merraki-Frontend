"use client";

import { Box, Container, Typography } from "@mui/material";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";
import {
  ArrowForward as ArrowIcon,
  OpenInNew as ExternalIcon,
} from "@mui/icons-material";

/* ══ TOKENS ══════════════════════════════════════════════ */
const T = {
  bg: "#F5F7FB",
  bgSection: "#F5F7FB",
  ink: "#253957",
  inkMid: "#253957",
  inkMuted: "#253957",
  inkFaint: "#253957",
  border: "rgba(37,57,87,0.12)",
  borderMid: "rgba(37,57,87,0.18)",
  blue: "#253957",
  blueLight: "#4a6fa5",
  bluePale: "#F5F7FB",
  blueGlow: "rgba(37,57,87,0.12)",
  blueDim: "rgba(37,57,87,0.06)",
  blueGrad: "linear-gradient(135deg, #253957 0%, #4a6fa5 100%)",
  blueBdr: "rgba(37,57,87,0.22)",
};

const SANS = '"DM Sans","Mona Sans",system-ui,sans-serif';
const EASE = [0.16, 1, 0.3, 1] as const;

/* ══ DATA ════════════════════════════════════════════════ */
const VALUES = [
  {
    n: "01",
    title: "Founder-first",
    body: "Every decision starts with a single question — does this actually help a founder grow? We build tools we'd want ourselves.",
  },
  {
    n: "02",
    title: "Real ownership",
    body: "No bureaucracy. No hand-holding. You ship things that matter and your name is on them. We move fast and trust each other.",
  },
  {
    n: "03",
    title: "Growth by default",
    body: "We don't wait for permission to level up. If you see a gap, you own it. Your growth here is as steep as you want it.",
  },
  {
    n: "04",
    title: "Craft over output",
    body: "We'd rather do five things brilliantly than fifty adequately. Quality isn't a checkbox — it's how we think.",
  },
  {
    n: "05",
    title: "Sustainable pace",
    body: "We're building for the long run. Great work takes clarity, not just hours. We respect time — yours and everyone else's.",
  },
  {
    n: "06",
    title: "Measurable impact",
    body: "Finance shapes businesses. When our tools help a founder raise a round or fix their cash flow, that's a win we feel.",
  },
];

const PERKS = [
  "Remote-first",
  "Ownership-driven",
  "High-impact work",
  "Fast learning",
  "Founder access",
  "Merit-based growth",
];

const OPEN_ROLES: {
  title: string;
  type: string;
  location: string;
  team: string;
}[] = [];

/* ══ COMPONENTS ══════════════════════════════════════════ */
function ValueCard({
  item,
  index,
}: {
  item: (typeof VALUES)[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 18 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.06, duration: 0.48, ease: EASE }}
    >
      <Box
        sx={{
          p: "28px 28px 30px",
          background: "#FFFFFF",
          borderRadius: "16px",
          border: `1px solid ${T.border}`,
          height: "100%",
          transition: "border-color 0.2s, box-shadow 0.2s, transform 0.2s",
          "&:hover": {
            borderColor: T.blueBdr,
            boxShadow: `0 8px 32px ${T.blueGlow}`,
            transform: "translateY(-2px)",
          },
        }}
      >
        <Typography
          sx={{
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: "0.65rem",
            color: T.blue,
            letterSpacing: "0.08em",
            mb: 2.5,
          }}
        >
          {item.n}
        </Typography>
        <Typography
          sx={{
            fontFamily: SANS,
            fontWeight: 700,
            fontSize: "1.0625rem",
            color: T.ink,
            letterSpacing: "-0.02em",
            mb: 1.25,
          }}
        >
          {item.title}
        </Typography>
        <Typography
          sx={{
            fontFamily: SANS,
            fontSize: "0.875rem",
            color: T.inkMuted,
            lineHeight: 1.8,
          }}
        >
          {item.body}
        </Typography>
      </Box>
    </motion.div>
  );
}

function RoleCard({
  role,
  index,
}: {
  role: (typeof OPEN_ROLES)[0];
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4, ease: EASE }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 2,
          p: "20px 24px",
          background: "#FFFFFF",
          borderRadius: "14px",
          border: `1px solid ${T.border}`,
          transition: "border-color 0.18s, box-shadow 0.18s",
          "&:hover": {
            borderColor: T.blueBdr,
            boxShadow: `0 4px 24px ${T.blueGlow}`,
          },
        }}
      >
        <Box>
          <Typography
            sx={{
              fontFamily: SANS,
              fontWeight: 700,
              fontSize: "1rem",
              color: T.ink,
              letterSpacing: "-0.01em",
              mb: 0.5,
            }}
          >
            {role.title}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                px: "8px",
                py: "3px",
                borderRadius: "6px",
                background: T.blueDim,
                border: `1px solid ${T.blueBdr}`,
              }}
            >
              <Typography
                sx={{
                  fontFamily: SANS,
                  fontSize: "0.65rem",
                  fontWeight: 600,
                  color: T.blue,
                }}
              >
                {role.team}
              </Typography>
            </Box>
            <Typography
              sx={{ fontFamily: SANS, fontSize: "0.8rem", color: T.inkFaint }}
            >
              {role.type} · {role.location}
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.75,
            px: "16px",
            py: "9px",
            borderRadius: "9px",
            background: T.blueGrad,
            boxShadow: `0 4px 14px ${T.blueGlow}`,
            cursor: "pointer",
          }}
        >
          <Typography
            sx={{
              fontFamily: SANS,
              fontWeight: 600,
              fontSize: "0.8rem",
              color: "#fff",
            }}
          >
            Apply
          </Typography>
          <ArrowIcon sx={{ fontSize: "0.8rem", color: "#fff" }} />
        </Box>
      </Box>
    </motion.div>
  );
}

/* ══ PAGE ════════════════════════════════════════════════ */
export default function CareersPageClient() {
  const valRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const valInView = useInView(valRef, { once: true, margin: "-80px" });
  const roleInView = useInView(roleRef, { once: true, margin: "-80px" });
  const ctaInView = useInView(ctaRef, { once: true, margin: "-80px" });

  return (
    <Box
      sx={{
        minHeight: "100vh",
        fontFamily: SANS,
        background: "#F5F7FB",
      }}
    >
      {/* ══ HERO ══════════════════════════════════════════ */}
      <Box
        sx={{
          pt: { xs: "88px", md: "110px" },
          pb: { xs: 14, md: 20 },
          position: "relative",
          zIndex: 1,
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ maxWidth: 780, mx: "auto", textAlign: "center" }}>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: EASE }}
            >
              <Typography
                sx={{
                  fontFamily: SANS,
                  fontWeight: 800,
                  fontSize: { xs: "2rem", sm: "3rem", md: "4rem" },
                  letterSpacing: "-0.045em",
                  lineHeight: 1,
                  mb: 5,
                  color: "#253957",
                }}
              >
                Careers at{" "}
                <Box
                  component="span"
                  sx={{
                    fontWeight: 300,
                    background: T.blueGrad,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Merraki
                </Box>
              </Typography>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12, duration: 0.6, ease: EASE }}
            >
              <Typography
                sx={{
                  fontFamily: SANS,
                  fontWeight: 400,
                  fontSize: { xs: "1.0625rem", md: "1.25rem" },
                  color: T.inkMuted,
                  lineHeight: 1.75,
                  maxWidth: 560,
                  mx: "auto",
                  mb: 7,
                }}
              >
                For those who think in numbers, solve with clarity, and build
                with purpose - Merraki Solutions is where you belong.
              </Typography>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22, duration: 0.5, ease: EASE }}
            >
              <Box
                sx={{
                  display: "flex",
                  gap: 1.5,
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Box
                    component="a"
                    href="#roles"
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 1,
                      px: "28px",
                      py: "13px",
                      borderRadius: "12px",
                      background: T.blueGrad,
                      boxShadow: `0 8px 28px ${T.blueGlow}`,
                      textDecoration: "none",
                      transition: "all 0.2s",
                      "&:hover": {
                        filter: "brightness(1.07)",
                        boxShadow: `0 12px 36px ${T.blueGlow}`,
                      },
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: SANS,
                        fontWeight: 600,
                        fontSize: "0.9375rem",
                        color: "#fff",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      See open roles
                    </Typography>
                    <ArrowIcon sx={{ fontSize: "0.875rem", color: "#253957" }} />
                  </Box>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Box
                    component={Link}
                    href="/about"
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      px: "28px",
                      py: "13px",
                      borderRadius: "12px",
                      border: `1.5px solid rgba(37,57,87,0.28)`,
                      textDecoration: "none",
                      transition: "all 0.18s",
                      "&:hover": { background: "rgba(37,57,87,0.05)" },
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: SANS,
                        fontWeight: 500,
                        fontSize: "0.9375rem",
                        color: T.inkMid,
                      }}
                    >
                      About us
                    </Typography>
                  </Box>
                </motion.div>
              </Box>
            </motion.div>
          </Box>
        </Container>
      </Box>

      {/* ══ PERKS — minimal strip ════════════════════════ */}
      <Box
        sx={{
          background: "#FFFFFF",
          borderTop: `1px solid ${T.border}`,
          borderBottom: `1px solid ${T.border}`,
          py: 3.5,
          position: "relative",
          zIndex: 1,
        }}
      >
        <Container maxWidth="xl">
          <Box
            sx={{
              display: "flex",
              gap: { xs: 4, md: 6 },
              flexWrap: "wrap",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {PERKS.map((perk, i) => (
              <motion.div
                key={perk}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.05 * i, duration: 0.4 }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box
                    sx={{
                      width: 5,
                      height: 5,
                      borderRadius: "50%",
                      background: T.blueGrad,
                      flexShrink: 0,
                    }}
                  />
                  <Typography
                    sx={{
                      fontFamily: SANS,
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      color: T.inkMid,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {perk}
                  </Typography>
                </Box>
              </motion.div>
            ))}
          </Box>
        </Container>
      </Box>

      {/* ══ VALUES ════════════════════════════════════════ */}
      <Box
        ref={valRef}
        sx={{ py: { xs: 14, md: 20 }, position: "relative", zIndex: 1 }}
      >
        <Container maxWidth="xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={valInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, ease: EASE }}
          >
            <Box sx={{ mb: { xs: 8, md: 12 }, maxWidth: 720 }}>
              <Typography
                sx={{
                  fontFamily: SANS,
                  fontWeight: 800,
                  fontSize: { xs: "2rem", md: "3rem" },
                  color: T.ink,
                  letterSpacing: "-0.04em",
                  lineHeight: 1.05,
                  mb: 0.5,
                }}
              >
                The values we
              </Typography>
              <Typography
                sx={{
                  fontFamily: SANS,
                  fontWeight: 300,
                  fontSize: { xs: "2rem", md: "3rem" },
                  letterSpacing: "-0.04em",
                  lineHeight: 1.05,
                  mb: 3,
                  background: T.blueGrad,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                build around.
              </Typography>
              <Typography
                sx={{
                  fontFamily: SANS,
                  fontSize: "1rem",
                  color: T.inkMuted,
                  lineHeight: 1.75,
                  maxWidth: 480,
                }}
              >
                Not aspirational posters. How we actually make decisions, hire
                people, and build the company.
              </Typography>
            </Box>
          </motion.div>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr",
                lg: "repeat(3, 1fr)",
              },
              gap: 2,
            }}
          >
            {VALUES.map((item, i) => (
              <ValueCard key={item.n} item={item} index={i} />
            ))}
          </Box>
        </Container>
      </Box>

      {/* ══ OPEN ROLES ════════════════════════════════════ */}
      <Box
        id="roles"
        ref={roleRef}
        sx={{ py: { xs: 14, md: 20 }, position: "relative", zIndex: 1 }}
      >
        <Container maxWidth="xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={roleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, ease: EASE }}
          >
            <Box sx={{ mb: { xs: 8, md: 10 } }}>
              <Typography
                sx={{
                  fontFamily: SANS,
                  fontWeight: 800,
                  fontSize: { xs: "2rem", md: "3rem" },
                  color: T.ink,
                  letterSpacing: "-0.04em",
                  lineHeight: 1.05,
                  mb: 0.5,
                }}
              >
                Open roles
              </Typography>
              <Typography
                sx={{
                  fontFamily: SANS,
                  fontWeight: 300,
                  fontSize: { xs: "2rem", md: "3rem" },
                  letterSpacing: "-0.04em",
                  lineHeight: 1.05,
                  background: T.blueGrad,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                right now.
              </Typography>
            </Box>
          </motion.div>

          {OPEN_ROLES.length > 0 ? (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              {OPEN_ROLES.map((role, i) => (
                <RoleCard key={role.title} role={role} index={i} />
              ))}
            </Box>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={roleInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.18, duration: 0.5, ease: EASE }}
            >
              <Box
                sx={{
                  background: "#FFFFFF",
                  borderRadius: "20px",
                  border: `1px solid ${T.border}`,
                  boxShadow: `0 4px 32px ${T.blueGlow}`,
                  p: { xs: "48px 32px", md: "72px 80px" },
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  alignItems: { md: "center" },
                  justifyContent: "space-between",
                  gap: 5,
                }}
              >
                <Box>
                  <Typography
                    sx={{
                      fontFamily: SANS,
                      fontWeight: 700,
                      fontSize: { xs: "1.375rem", md: "1.75rem" },
                      color: T.ink,
                      letterSpacing: "-0.025em",
                      mb: 1.5,
                    }}
                  >
                    No open roles at the moment.
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: SANS,
                      fontSize: "1rem",
                      color: T.inkMuted,
                      lineHeight: 1.75,
                      maxWidth: 460,
                    }}
                  >
                    We're not hiring for any specific roles right now, but we're
                    always interested in exceptional people. If that's you reach
                    out.
                  </Typography>
                </Box>
                <Box sx={{ flexShrink: 0 }}>
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Box
                      component="a"
                      href="mailto:info@merrakisolutions.com?subject=Speculative Application — Merraki"
                      sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 1,
                        px: "24px",
                        py: "13px",
                        borderRadius: "12px",
                        background: T.blueGrad,
                        boxShadow: `0 8px 24px ${T.blueGlow}`,
                        textDecoration: "none",
                        whiteSpace: "nowrap",
                        transition: "all 0.2s",
                        "&:hover": {
                          filter: "brightness(1.07)",
                          boxShadow: `0 12px 32px ${T.blueGlow}`,
                        },
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: SANS,
                          fontWeight: 600,
                          fontSize: "0.9rem",
                          color: "#fff",
                          letterSpacing: "-0.01em",
                        }}
                      >
                        Send a speculative application
                      </Typography>
                      <ExternalIcon
                        sx={{ fontSize: "0.8rem", color: "#fff" }}
                      />
                    </Box>
                  </motion.div>
                  <Typography
                    sx={{
                      mt: 1.25,
                      fontFamily: SANS,
                      fontSize: "0.72rem",
                      color: T.inkFaint,
                      textAlign: { md: "right" },
                    }}
                  >
                    info@merrakisolutions.com
                  </Typography>
                </Box>
              </Box>
            </motion.div>
          )}
        </Container>
      </Box>

      {/* ══ BOTTOM CTA ════════════════════════════════════ */}
      <Box
        ref={ctaRef}
        sx={{ pb: { xs: 16, md: 24 }, position: "relative", zIndex: 1 }}
      >
        <Container maxWidth="md">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, ease: EASE }}
          >
            <Box
              sx={{
                background: "#FFFFFF",
                borderRadius: "24px",
                border: `1px solid ${T.borderMid}`,
                boxShadow: `0 8px 48px ${T.blueGlow}`,
                p: { xs: "52px 32px", md: "72px 80px" },
                textAlign: "center",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <Box sx={{ position: "relative", zIndex: 1 }}>
                <Typography
                  sx={{
                    fontFamily: SANS,
                    fontWeight: 800,
                    fontSize: { xs: "1.75rem", md: "2.75rem" },
                    color: T.ink,
                    letterSpacing: "-0.04em",
                    lineHeight: 1.05,
                    mb: 0.5,
                  }}
                >
                  Don't see the right role?
                </Typography>
                <Typography
                  sx={{
                    fontFamily: SANS,
                    fontWeight: 300,
                    fontSize: { xs: "1.75rem", md: "2.75rem" },
                    letterSpacing: "-0.04em",
                    lineHeight: 1.05,
                    mb: 3,
                    background: T.blueGrad,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Write to us anyway.
                </Typography>
                <Typography
                  sx={{
                    fontFamily: SANS,
                    fontSize: "1rem",
                    color: T.inkMuted,
                    lineHeight: 1.75,
                    maxWidth: 440,
                    mx: "auto",
                    mb: 6,
                  }}
                >
                  Exceptional people don't always fit a job description. Tell us
                  what you're great at and why Merraki should care.
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    gap: 1.5,
                    justifyContent: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Box
                      component="a"
                      href="mailto:info@merrakisolutions.com"
                      sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 1,
                        px: "28px",
                        py: "13px",
                        borderRadius: "12px",
                        background: T.blueGrad,
                        boxShadow: `0 8px 28px ${T.blueGlow}`,
                        textDecoration: "none",
                        transition: "all 0.2s",
                        "&:hover": {
                          filter: "brightness(1.07)",
                          boxShadow: `0 12px 36px ${T.blueGlow}`,
                        },
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: SANS,
                          fontWeight: 600,
                          fontSize: "0.9375rem",
                          color: "#fff",
                          letterSpacing: "-0.01em",
                        }}
                      >
                        Get in touch
                      </Typography>
                      <ArrowIcon sx={{ fontSize: "0.875rem", color: "#fff" }} />
                    </Box>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Box
                      component={Link}
                      href="/book-consultation"
                      sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        px: "28px",
                        py: "13px",
                        borderRadius: "12px",
                        border: `1.5px solid rgba(37,57,87,0.28)`,
                        textDecoration: "none",
                        transition: "all 0.18s",
                        "&:hover": { background: "rgba(37,57,87,0.05)" },
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: SANS,
                          fontWeight: 500,
                          fontSize: "0.9375rem",
                          color: T.inkMid,
                        }}
                      >
                        Book a call instead
                      </Typography>
                    </Box>
                  </motion.div>
                </Box>
              </Box>
            </Box>
          </motion.div>
        </Container>
      </Box>
    </Box>
  );
}
