"use client";

import { Box, Container, Typography, Grid } from "@mui/material";
import { motion, Variants } from "framer-motion";
import { colorTokens, shadowTokens } from "@/theme";
import { SectionLabel, GradientText } from "@/components/ui";
import { FoundersSection } from "@/components/sections/home/FoundersSection";
import { FinalCTA } from "@/components/sections/home/FinalCTA";

const MISSION_ITEMS = [
  {
    icon: "🎯",
    title: "Our Mission",
    text: "To simplify finance so every business owner can make confident, data-backed decisions — regardless of their financial background.",
  },
  {
    icon: "👁️",
    title: "Our Vision",
    text: "A world where every founder has access to institutional-grade financial intelligence, not just large corporations.",
  },
  {
    icon: "💡",
    title: "Our Approach",
    text: "We combine deep financial expertise with practical tools — models, templates, and dashboards that work in the real world.",
  },
];

const VALUES = [
  {
    icon: "🔬",
    title: "Precision",
    text: "Every number matters. We build models that are audit-ready.",
  },
  {
    icon: "🤝",
    title: "Partnership",
    text: "We work with you, not just for you. Your growth is our goal.",
  },
  {
    icon: "🚀",
    title: "Impact",
    text: "We measure success by the decisions our work enables.",
  },
  {
    icon: "🔓",
    title: "Clarity",
    text: "Complex finance made simple. Always transparent, never jargon-first.",
  },
];

const TIMELINE = [
  { year: "2020", event: "Merraki Solutions founded by Parag & Khyati" },
  {
    year: "2021",
    event: "First 50 financial models delivered to Indian startups",
  },
  {
    year: "2022",
    event: "Launched Excel Dashboard product line, 100+ clients reached",
  },
  {
    year: "2023",
    event: "Templates platform launched — passive income + scale",
  },
  { year: "2024", event: "300+ founders advised, ₹50 Cr+ revenue modelled" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export function AboutPageClient() {
  return (
    <Box>
      {/* Hero */}
      <Box
        sx={{
          background: `linear-gradient(160deg, ${colorTokens.darkNavy[900]} 0%, ${colorTokens.darkNavy[800]} 100%)`,
          pt: { xs: 12, md: 16 },
          pb: { xs: 8, md: 12 },
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(ellipse at 30% 50%, rgba(26,86,219,0.15) 0%, transparent 55%)`,
            pointerEvents: "none",
          }}
        />
        <Container
          maxWidth="lg"
          sx={{ position: "relative", zIndex: 1, textAlign: "center" }}
        >
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <SectionLabel text="Our Story" color="light" />
            <Typography
              variant="h1"
              sx={{
                mt: 2,
                mb: 3,
                color: "#fff",
                fontWeight: 800,
                letterSpacing: "-0.03em",
              }}
            >
              Finance Simplified.{" "}
              <Box
                component="span"
                sx={{
                  background: `linear-gradient(135deg, ${colorTokens.financeBlue[300]}, #A78BFA)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Growth Amplified.
              </Box>
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{
                color: "rgba(255,255,255,0.6)",
                maxWidth: 600,
                mx: "auto",
                lineHeight: 1.8,
              }}
            >
              Merraki Solutions was born from a simple belief: every founder
              deserves access to financial intelligence that was once reserved
              for large corporations with big finance teams.
            </Typography>
          </motion.div>
        </Container>
      </Box>

      {/* Mission / Vision / Approach */}
      <Box sx={{ py: { xs: 8, md: 12 }, backgroundColor: colorTokens.white }}>
        <Container maxWidth="xl">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
          >
            <Grid container spacing={4}>
              {MISSION_ITEMS.map((item) => (
                <Grid size={{ xs: 12, md: 4 }} key={item.title}>
                  <motion.div variants={itemVariants}>
                    <Box
                      sx={{
                        p: 4,
                        borderRadius: "20px",
                        border: `1px solid ${colorTokens.slate[100]}`,
                        boxShadow: shadowTokens.md,
                        height: "100%",
                        transition: "box-shadow 0.3s",
                        "&:hover": { boxShadow: shadowTokens.xl },
                      }}
                    >
                      <Typography sx={{ fontSize: "2.25rem", mb: 2 }}>
                        {item.icon}
                      </Typography>
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 700,
                          color: colorTokens.darkNavy[900],
                          mb: 1.5,
                        }}
                      >
                        {item.title}
                      </Typography>
                      <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{ lineHeight: 1.8 }}
                      >
                        {item.text}
                      </Typography>
                    </Box>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Container>
      </Box>

      {/* Our Story narrative */}
      <Box
        sx={{ py: { xs: 8, md: 12 }, backgroundColor: colorTokens.slate[50] }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={8} alignItems="center">
            <Grid size={{ xs: 12, md: 5 }}>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <SectionLabel text="How It Started" color="blue" />
                <Typography
                  variant="h3"
                  sx={{
                    mt: 2,
                    mb: 3,
                    fontWeight: 800,
                    color: colorTokens.darkNavy[900],
                  }}
                >
                  From Spreadsheets to <GradientText>Strategy</GradientText>
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ lineHeight: 1.85, mb: 3 }}
                >
                  Parag and Khyati spent years working with startups and growing
                  businesses across India, building financial models that sat in
                  folders — never opened, never actioned. They saw founders
                  spending thousands on consultants whose outputs were too
                  complex to understand and too generic to implement.
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ lineHeight: 1.85 }}
                >
                  Merraki Solutions was founded to change that. Their approach:
                  build financial tools that are precise enough for analysts,
                  simple enough for founders, and actionable enough to create
                  real change.
                </Typography>
              </motion.div>
            </Grid>

            <Grid size={{ xs: 12, md: 7 }}>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                {/* Timeline */}
                <Box sx={{ position: "relative", pl: 3 }}>
                  <Box
                    sx={{
                      position: "absolute",
                      left: 0,
                      top: 12,
                      bottom: 12,
                      width: 2,
                      background: `linear-gradient(180deg, ${colorTokens.financeBlue[500]}, ${colorTokens.financeBlue[200]})`,
                      borderRadius: "999px",
                    }}
                  />
                  {TIMELINE.map((item, i) => (
                    <motion.div
                      key={item.year}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1, duration: 0.4 }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          gap: 3,
                          mb: 3.5,
                          position: "relative",
                        }}
                      >
                        <Box
                          sx={{
                            position: "absolute",
                            left: -3 - 6,
                            top: 6,
                            width: 12,
                            height: 12,
                            borderRadius: "50%",
                            backgroundColor: colorTokens.financeBlue[500],
                            border: `2px solid ${colorTokens.white}`,
                            boxShadow: `0 0 0 2px ${colorTokens.financeBlue[500]}`,
                          }}
                        />
                        <Box>
                          <Typography
                            variant="overline"
                            sx={{
                              color: colorTokens.financeBlue[600],
                              fontWeight: 700,
                              letterSpacing: "0.08em",
                              lineHeight: 1,
                              display: "block",
                              mb: 0.5,
                            }}
                          >
                            {item.year}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 500,
                              color: colorTokens.darkNavy[700],
                              lineHeight: 1.5,
                            }}
                          >
                            {item.event}
                          </Typography>
                        </Box>
                      </Box>
                    </motion.div>
                  ))}
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Values */}
      <Box sx={{ py: { xs: 8, md: 12 }, backgroundColor: colorTokens.white }}>
        <Container maxWidth="xl">
          <Box sx={{ textAlign: "center", mb: { xs: 5, md: 7 } }}>
            <SectionLabel text="What We Stand For" color="blue" />
            <Typography
              variant="h2"
              sx={{ mt: 2, fontWeight: 800, color: colorTokens.darkNavy[900] }}
            >
              Our Core <GradientText>Values</GradientText>
            </Typography>
          </Box>
          <Grid container spacing={3}>
            {VALUES.map((value, i) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={value.title}>
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  whileHover={{ y: -5 }}
                >
                  <Box
                    sx={{
                      p: 3.5,
                      borderRadius: "18px",
                      border: `1px solid ${colorTokens.slate[100]}`,
                      boxShadow: shadowTokens.md,
                      textAlign: "center",
                      height: "100%",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        boxShadow: shadowTokens.xl,
                        borderColor: colorTokens.financeBlue[200],
                      },
                    }}
                  >
                    <Typography sx={{ fontSize: "2rem", mb: 2 }}>
                      {value.icon}
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        color: colorTokens.darkNavy[900],
                        mb: 1,
                      }}
                    >
                      {value.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ lineHeight: 1.7 }}
                    >
                      {value.text}
                    </Typography>
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Founders */}
      <FoundersSection />
      <FinalCTA />
    </Box>
  );
}
