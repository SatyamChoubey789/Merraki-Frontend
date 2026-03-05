"use client";

import { useRef } from "react";
import { Box, Container, Typography, Button } from "@mui/material";
import { ArrowForward as ArrowIcon } from "@mui/icons-material";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useInView } from "@/lib/hooks/useInView";

const T = {
  bg:         "#FFFFFF",
  bgSection:  "#F5F7FB",
  bgDeep:     "#EDF3FF",
  ink:        "#0A0A0F",
  inkDark:    "#1E1E2A",
  inkMid:     "#3A3A52",
  inkMuted:   "#5A5A72",
  inkFaint:   "#9898AE",
  border:     "rgba(10,10,20,0.08)",
  borderMid:  "rgba(10,10,20,0.14)",
  blue:       "#3B7BF6",
  blueMid:    "#5A92F8",
  blueLight:  "#7AABFF",
  bluePale:   "#EDF3FF",
  blueGlow:   "rgba(59,123,246,0.18)",
  blueDim:    "rgba(59,123,246,0.06)",
  blueGrad:   "linear-gradient(135deg, #3B7BF6 0%, #7AABFF 100%)",
};

const SANS = `"DM Sans", "Mona Sans", system-ui, sans-serif`;
const EASE = [0.16, 1, 0.3, 1] as const;

const AVATARS = [
  { initials: "JD", color: "#3B7BF6" },
  { initials: "SM", color: "#8B5CF6" },
  { initials: "AK", color: "#10B981" },
  { initials: "LM", color: "#F97316" },
  { initials: "RT", color: "#EC4899" },
  { initials: "NK", color: "#06B6D4" },
];

export function FinalCTA() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { ref, inView } = useInView({ threshold: 0.2 });

  return (
    <Box
      ref={sectionRef}
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: `linear-gradient(135deg, ${T.bluePale} 0%, ${T.bgSection} 50%, ${T.bluePale} 100%)`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Soft ambient blobs */}
      <Box sx={{
        position: "absolute", width: "60vw", height: "60vw",
        top: "-20vw", left: "-10vw", borderRadius: "50%",
        background: `radial-gradient(ellipse, ${T.blueGlow} 0%, transparent 60%)`,
        pointerEvents: "none",
      }} />
      <Box sx={{
        position: "absolute", width: "50vw", height: "50vw",
        bottom: "-15vw", right: "-10vw", borderRadius: "50%",
        background: `radial-gradient(ellipse, ${T.blueDim} 0%, transparent 60%)`,
        pointerEvents: "none",
      }} />

      <Container maxWidth="md" sx={{ position: "relative", zIndex: 1 }}>
        <Box
          ref={ref as React.RefObject<HTMLDivElement>}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            py: { xs: 10, md: 16 },
          }}
        >
          {/* Avatar row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <Box sx={{ display: "flex", mb: 5 }}>
              {AVATARS.map((av, i) => (
                <motion.div
                  key={av.initials}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.4, delay: 0.05 * i, ease: EASE }}
                  whileHover={{ y: -6, zIndex: 10, transition: { duration: 0.2 } }}
                  style={{ position: "relative", zIndex: AVATARS.length - i, marginLeft: i === 0 ? 0 : -10 }}
                >
                  <Box sx={{
                    width: 58, height: 58, borderRadius: "50%",
                    background: av.color,
                    border: `3px solid ${T.bg}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: "0 4px 14px rgba(0,0,0,0.12)",
                    cursor: "default",
                  }}>
                    <Typography sx={{
                      fontFamily: SANS, fontWeight: 700,
                      fontSize: "0.8rem", color: "#fff", letterSpacing: "0.04em",
                    }}>
                      {av.initials}
                    </Typography>
                  </Box>
                </motion.div>
              ))}
            </Box>
          </motion.div>

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.2, ease: EASE }}
          >
            <Typography sx={{
              fontFamily: SANS,
              fontWeight: 800,
              fontSize: { xs: "2.25rem", sm: "3rem", md: "3.75rem" },
              color: T.ink,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              mb: 2.5,
            }}>
              Ready to amplify growth?
            </Typography>
          </motion.div>

          {/* Subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.32, ease: EASE }}
          >
            <Typography sx={{
              fontFamily: SANS,
              fontWeight: 400,
              fontSize: { xs: "1rem", md: "1.125rem" },
              color: T.inkMuted,
              lineHeight: 1.75,
              maxWidth: 560,
              mx: "auto",
              mb: 4.5,
            }}>
              Join us in shaping the future of finance. At Merraki, we're passionate about
              creating an impact — for our users, our clients, and the industry.
              Ready to lead the change?
            </Typography>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.45, delay: 0.44, ease: EASE }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Button
              component={Link}
              href="/book-consultation"
              disableElevation
              endIcon={<ArrowIcon sx={{ fontSize: "1rem !important" }} />}
              sx={{
                fontFamily: SANS,
                fontWeight: 600,
                fontSize: "1rem",
                textTransform: "none",
                letterSpacing: "-0.01em",
                px: 4,
                py: 1.75,
                borderRadius: "14px",
                minHeight: 54,
                color: "#FFFFFF",
                background: T.blueGrad,
                boxShadow: `0 8px 28px ${T.blueGlow}`,
                "&:hover": {
                  filter: "brightness(1.08)",
                  boxShadow: `0 12px 36px ${T.blueGlow}`,
                },
              }}
            >
              Browse Open Positions
            </Button>
          </motion.div>
        </Box>
      </Container>
    </Box>
  );
}