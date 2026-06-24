"use client";

import { Box, Container, Typography, Grid } from "@mui/material";
import { motion } from "framer-motion";

const T = {
  bg: "#f5f7fb",
  bgSection: "#F5F7FB",
  ink: "#0A0A0F",
  inkMid: "#3A3A52",
  inkMuted: "#5A5A72",
  border: "rgba(10,10,20,0.08)",

  /* BRAND */
  brand: "#253957",
};

const SANS = `"DM Sans","Mona Sans",system-ui,sans-serif`;
const EASE = [0.22, 1, 0.36, 1] as const;

const TOOLS = [
  "Breakeven calculators",
  "Pricing models",
  "Financial planning templates",
  "Startup-friendly tools",
];

export default function TemplatesCalculators() {
  return (
    <Box
      sx={{
        py: { xs: 10, md: 16 },
        background: T.bgSection,
      }}
    >
      <Container maxWidth="lg">
        {/* HEADER */}
        <Box sx={{ textAlign: "center", mb: 10 }}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            viewport={{ once: true }}
          >
            <Typography
              sx={{
                fontFamily: SANS,
                fontWeight: 800,
                fontSize: { xs: "2.2rem", md: "3.4rem" },
                letterSpacing: "-0.03em",
                color: T.ink,
              }}
            >
              Templates & Calculators
              <Box
                component="span"
                sx={{
                  display: "block",
                  color: T.brand,
                }}
              >
                Smart tools for faster decisions.
              </Box>
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            viewport={{ once: true }}
          >
            <Typography
              sx={{
                mt: 2,
                fontSize: "1rem",
                color: T.inkMuted,
                maxWidth: 540,
                mx: "auto",
                lineHeight: 1.7,
              }}
            >
              Not everything needs a custom model. Sometimes you just need a
              tool that works — instantly.
              <br />
              <br />
              Our ready-to-use templates and calculators are designed to
              simplify complex financial decisions. Plug in your numbers, and
              you’re good to go.
            </Typography>
          </motion.div>
        </Box>

        {/* CONTENT */}
        <Grid container spacing={6} alignItems="center">
          {/* LEFT */}
          <Grid size={{ xs: 12, md: 6 }}>
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Typography
                sx={{
                  fontFamily: SANS,
                  fontWeight: 700,
                  fontSize: "1.4rem",
                  mb: 3,
                  color: T.ink,
                }}
              >
                Includes:
              </Typography>

              {TOOLS.map((tool, i) => (
                <Box
                  key={i}
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    mb: 2.2,
                  }}
                >
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: T.brand,
                      mt: "8px",
                      mr: 1.5,
                      flexShrink: 0,
                    }}
                  />
                  <Typography
                    sx={{
                      fontSize: "0.95rem",
                      color: T.inkMid,
                      lineHeight: 1.6,
                    }}
                  >
                    {tool}
                  </Typography>
                </Box>
              ))}
            </motion.div>
          </Grid>

          {/* RIGHT CARD */}
          <Grid size={{ xs: 12, md: 6 }}>
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Box
                sx={{
                  background: "#fff",
                  borderRadius: "20px",
                  p: { xs: 4, md: 5 },
                  border: `1px solid ${T.border}`,
                  boxShadow: "0 20px 60px rgba(37,57,87,0.18)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* TOP LINE */}
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: "10%",
                    width: "80%",
                    height: "3px",
                    background: `linear-gradient(135deg, #253957 0%, #3A4F6B 100%)`,
                    borderRadius: "10px",
                  }}
                />

                <Typography
                  sx={{
                    fontFamily: SANS,
                    fontWeight: 700,
                    fontSize: "1.3rem",
                    mb: 2,
                    color: T.ink,
                  }}
                >
                  Why it matters:
                </Typography>

                <Typography
                  sx={{
                    fontSize: "0.95rem",
                    color: T.inkMid,
                    lineHeight: 1.7,
                  }}
                >
                  Because speed matters when you’re building. Ready-to-use tools
                  help you make decisions quickly without reinventing the wheel.
                </Typography>
              </Box>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
