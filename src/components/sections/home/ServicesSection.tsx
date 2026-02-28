"use client";

import { Box, Container, Grid, Typography } from "@mui/material";
import { ArrowForward as ArrowIcon } from "@mui/icons-material";
import { motion } from "framer-motion";
import Link from "next/link";
import { colorTokens, shadowTokens } from "@/theme";
import { SectionLabel, GradientText } from "@/components/ui";
import { useInView } from "@/lib/hooks/useInView";

const SERVICES = [
  {
    icon: "📊",
    title: "Financial Modelling",
    description:
      "Custom 3-statement models, DCF, LBO, and scenario analysis built for your specific business.",
    href: "/book-consultation",
    color: colorTokens.financeBlue[500],
    bg: colorTokens.financeBlue[50],
  },
  {
    icon: "📈",
    title: "Excel Dashboards",
    description:
      "Interactive KPI dashboards that update in real-time. Built for operators, loved by investors.",
    href: "/templates",
    color: colorTokens.success.main,
    bg: colorTokens.success.light,
  },
  {
    icon: "🧮",
    title: "Templates & Calculators",
    description:
      "Plug-and-play financial templates. Download, input your numbers, make better decisions today.",
    href: "/templates",
    color: "#8B5CF6",
    bg: "#F5F3FF",
  },
  {
    icon: "🔬",
    title: "Data Analysis & Reporting",
    description:
      "Turn raw data into boardroom-ready reports. We handle the analysis so you handle the strategy.",
    href: "/book-consultation",
    color: colorTokens.warning.main,
    bg: colorTokens.warning.light,
  },
  {
    icon: "📚",
    title: "Bookkeeping Support",
    description:
      "Accurate, compliant bookkeeping so your numbers are always clean, current, and investor-ready.",
    href: "/book-consultation",
    color: "#EC4899",
    bg: "#FDF2F8",
  },
  {
    icon: "🧠",
    title: "Founder Consulting",
    description:
      "Strategic financial guidance from experts who've built models for 150+ companies. For founders, by analysts.",
    href: "/book-consultation",
    color: colorTokens.financeBlue[700],
    bg: colorTokens.financeBlue[50],
  },
];

export function ServicesSection() {
  const { ref, inView } = useInView({ threshold: 0.1 });

  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        backgroundColor: colorTokens.slate[50],
      }}
    >
      <Container maxWidth="xl">
        <Box sx={{ textAlign: "center", mb: { xs: 6, md: 8 } }}>
          <SectionLabel text="What We Do" color="blue" />
          <Typography
            variant="h2"
            sx={{
              mt: 2,
              mb: 2,
              fontWeight: 800,
              color: colorTokens.darkNavy[900],
            }}
          >
            Finance Services That <GradientText>Actually Move</GradientText> the
            Needle
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            sx={{ maxWidth: 560, mx: "auto", lineHeight: 1.75 }}
          >
            We go beyond spreadsheets — turning numbers into strategic decisions
            that help your business grow faster and smarter.
          </Typography>
        </Box>

        <Grid
          container
          spacing={3}
          ref={ref as React.RefObject<HTMLDivElement>}
        >
          {SERVICES.map((service, i) => (
            <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={service.title}>
              <motion.div
                initial={{ opacity: 0, y: 28 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.07, duration: 0.5, ease: "easeOut" }}
                whileHover={{ y: -6 }}
              >
                <Link href={service.href} style={{ textDecoration: "none" }}>
                  <Box
                    sx={{
                      p: 3.5,
                      borderRadius: "20px",
                      backgroundColor: colorTokens.white,
                      border: `1px solid ${colorTokens.slate[100]}`,
                      boxShadow: shadowTokens.md,
                      height: "100%",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        boxShadow: shadowTokens.xl,
                        borderColor: service.color + "44",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 52,
                        height: 52,
                        borderRadius: "14px",
                        backgroundColor: service.bg,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.5rem",
                        mb: 2.5,
                      }}
                    >
                      {service.icon}
                    </Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        color: colorTokens.darkNavy[900],
                        mb: 1,
                        fontSize: "1.0625rem",
                      }}
                    >
                      {service.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ lineHeight: 1.7, mb: 2.5 }}
                    >
                      {service.description}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        color: service.color,
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 700,
                          fontFamily: "var(--font-display)",
                        }}
                      >
                        Learn more
                      </Typography>
                      <ArrowIcon sx={{ fontSize: "1rem" }} />
                    </Box>
                  </Box>
                </Link>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
