"use client";

import { useRef } from "react";
import { Box, Container, Typography, Button } from "@mui/material";
import { ArrowForward as ArrowIcon, CalendarMonth as CalIcon } from "@mui/icons-material";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useInView } from "@/lib/hooks/useInView";

const T = {
  black:    "#080A0C",
  charcoal: "#111318",
  white:    "#FFFFFF",
  offwhite: "#F7F6F3",
  gold:     "#C9A84C",
  goldLight:"#E4C46A",
  goldDim:  "rgba(201,168,76,0.12)",
  inkMuted: "#6E6E6E",
};

const FONT_DISPLAY = `"Instrument Serif", "Playfair Display", Georgia, serif`;
const FONT_BODY    = `"DM Sans", "Mona Sans", system-ui, sans-serif`;
const FONT_MONO    = `"DM Mono", "JetBrains Mono", monospace`;
const EASE         = [0.16, 1, 0.3, 1] as const;

function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  return (
    <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.3 }}>
      {to}{suffix}
    </motion.span>
  );
}

export function FinalCTA() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { ref, inView } = useInView({ threshold: 0.15 });

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const yHeadline = useTransform(scrollYProgress, [0, 1], ["30px", "-30px"]);

  return (
    <Box
      ref={sectionRef}
      sx={{
        background: T.white,
        position: "relative",
        overflow: "hidden",
        borderTop: "1px solid rgba(0,0,0,0.05)",
      }}
    >
      {/* Ghost word */}
      <Box sx={{
        position: "absolute",
        bottom: -60, right: -40,
        fontFamily: FONT_DISPLAY, fontStyle: "italic",
        fontSize: "28vw", fontWeight: 400,
        color: "rgba(0,0,0,0.02)",
        lineHeight: 1, pointerEvents: "none",
        userSelect: "none", letterSpacing: "-0.05em",
      }}>
        Grow.
      </Box>

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <Box
          ref={ref as React.RefObject<HTMLDivElement>}
          sx={{
            py: { xs: 14, md: 22 },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >

          {/* Eyebrow */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, ease: EASE }}>
            <Typography sx={{ fontFamily: FONT_MONO, fontSize: "0.6rem", letterSpacing: "0.22em", color: T.inkMuted, textTransform: "uppercase", mb: 4 }}>
              Let's build your financial future
            </Typography>
          </motion.div>

          {/* Headline */}
          <motion.div style={{ y: yHeadline }}>
            <motion.div initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.9, delay: 0.1, ease: EASE }}>
              <Typography sx={{
                fontFamily: FONT_DISPLAY,
                fontStyle: "italic",
                fontWeight: 400,
                fontSize: { xs: "3rem", sm: "4.5rem", md: "6.5rem", lg: "8rem" },
                lineHeight: 0.92,
                letterSpacing: "-0.04em",
                color: T.charcoal,
                mb: 0.5,
              }}>
                Ready to
              </Typography>
              <Typography sx={{
                fontFamily: FONT_DISPLAY,
                fontStyle: "italic",
                fontWeight: 400,
                fontSize: { xs: "3rem", sm: "4.5rem", md: "6.5rem", lg: "8rem" },
                lineHeight: 0.92,
                letterSpacing: "-0.04em",
                color: T.charcoal,
                mb: 5,
              }}>
                amplify growth?
              </Typography>
            </motion.div>
          </motion.div>

          {/* Sub */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.3, ease: EASE }}>
            <Typography sx={{
              fontFamily: FONT_BODY,
              fontSize: { xs: "0.9375rem", md: "1.0625rem" },
              color: T.inkMuted,
              maxWidth: 460,
              lineHeight: 1.8,
              mb: 7,
            }}>
              Book a free 30-minute consultation with Parag or Khyati and get a clear financial roadmap built for your specific business.
            </Typography>
          </motion.div>

          {/* CTAs */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.45, ease: EASE }}>
            <Box sx={{ display: "flex", gap: 1.5, justifyContent: "center", flexWrap: "wrap" }}>

              {/* Primary */}
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button
                  component="a"
                  href={process.env.NEXT_PUBLIC_CALENDLY_URL}
                  target="_blank"
                  disableElevation
                  startIcon={<CalIcon sx={{ fontSize: "0.9rem !important" }} />}
                  sx={{
                    fontFamily: FONT_BODY,
                    fontWeight: 600,
                    fontSize: "0.9375rem",
                    textTransform: "none",
                    letterSpacing: "-0.01em",
                    px: 3.5, py: 1.5,
                    borderRadius: "10px",
                    minHeight: 52,
                    color: T.white,
                    background: `linear-gradient(120deg, ${T.charcoal}, ${T.charcoal})`,
                    border: "none",
                    transition: "all 0.25s ease",
                    "&:hover": {
                      background: `linear-gradient(120deg, ${T.black}, ${T.black})`,
                    },
                  }}
                >
                  Book Free Consultation
                </Button>
              </motion.div>

              {/* Secondary */}
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button
                  component={Link}
                  href="/templates"
                  disableElevation
                  endIcon={<ArrowIcon sx={{ fontSize: "0.85rem !important" }} />}
                  sx={{
                    fontFamily: FONT_BODY,
                    fontWeight: 500,
                    fontSize: "0.9375rem",
                    textTransform: "none",
                    letterSpacing: "-0.01em",
                    px: 3.5, py: 1.5,
                    borderRadius: "10px",
                    minHeight: 52,
                    color: T.charcoal,
                    border: `1.5px solid rgba(0,0,0,0.12)`,
                    background: "transparent",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      background: "rgba(0,0,0,0.02)",
                      borderColor: `rgba(0,0,0,0.2)`,
                    },
                  }}
                >
                  Browse Templates
                </Button>
              </motion.div>

            </Box>
          </motion.div>

          {/* Stats row */}
          <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.6, delay: 0.65 }}>
            <Box sx={{
              display: "flex",
              gap: 0,
              mt: 10,
              borderTop: "1px solid rgba(0,0,0,0.05)",
              pt: 4,
              flexWrap: "wrap",
              rowGap: 3,
              justifyContent: "center",
            }}>
              {[
                { val: "300", suffix: "+", label: "Founders advised" },
                { val: "50",  suffix: "Cr+", label: "Revenue modelled" },
                { val: "150", suffix: "+", label: "Models built" },
                { val: "30",  suffix: " min", label: "Free consultation" },
              ].map((s, i) => (
                <Box key={s.label} sx={{ px: 4, borderLeft: i > 0 ? "1px solid rgba(0,0,0,0.08)" : "none", textAlign: "center" }}>
                  <Typography sx={{ fontFamily: FONT_MONO, fontSize: { xs: "1.25rem", md: "1.5rem" }, fontWeight: 600, color: T.charcoal, lineHeight: 1, mb: 0.5 }}>
                    <CountUp to={parseInt(s.val)} suffix={s.suffix} />
                  </Typography>
                  <Typography sx={{ fontFamily: FONT_MONO, fontSize: "0.55rem", letterSpacing: "0.12em", color: T.inkMuted, textTransform: "uppercase" }}>
                    {s.label}
                  </Typography>
                </Box>
              ))}
            </Box>
          </motion.div>

        </Box>
      </Container>
    </Box>
  );
}