"use client";

import { Box, Container, Grid, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { useInView } from "@/lib/hooks/useInView";
import { colorTokens } from "@/theme";

const STATS = [
  { value: "150+", label: "Financial Models Built", icon: "📊" },
  { value: "300+", label: "Founders Advised", icon: "🚀" },
  { value: "12+", label: "Industries Covered", icon: "🌐" },
  { value: "₹50 Cr+", label: "Revenue Modelled", icon: "💰" },
];

export function StatsSection() {
  const { ref, inView } = useInView({ threshold: 0.2 });

  return (
    <Box
      sx={{
        py: { xs: 6, md: 8 },
        background: `linear-gradient(135deg, ${colorTokens.financeBlue[600]} 0%, ${colorTokens.financeBlue[800]} 100%)`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          pointerEvents: "none",
        }}
      />

      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1 }}>
        <Grid
          container
          spacing={3}
          ref={ref as React.RefObject<HTMLDivElement>}
        >
          {STATS.map((stat, i) => (
            <Grid size={{ xs: 6, md: 3 }} key={stat.label}>
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1, duration: 0.5, ease: "easeOut" }}
              >
                <Box sx={{ textAlign: "center" }}>
                  <Typography sx={{ fontSize: "2rem", mb: 1 }}>
                    {stat.icon}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 800,
                      fontSize: "clamp(2rem, 4vw, 3rem)",
                      color: "#fff",
                      lineHeight: 1.1,
                      letterSpacing: "-0.03em",
                      mb: 0.75,
                    }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "rgba(255,255,255,0.65)",
                      fontWeight: 500,
                      lineHeight: 1.4,
                    }}
                  >
                    {stat.label}
                  </Typography>
                </Box>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
