"use client";

import { Box, Container, Typography, Grid } from "@mui/material";
import { FormatQuote as QuoteIcon } from "@mui/icons-material";
import { motion } from "framer-motion";
import { colorTokens, shadowTokens } from "@/theme";
import { SectionLabel, GradientText } from "@/components/ui";
import { useInView } from "@/lib/hooks/useInView";

const TESTIMONIALS = [
  {
    quote:
      "Parag built us a 3-statement model that our Series A investors called the clearest they had ever seen. Closed the round in 6 weeks.",
    name: "Arjun Mehta",
    role: "Founder, EduStack",
    company: "EdTech, Mumbai",
    initials: "AM",
    gradientFrom: colorTokens.financeBlue[500],
    gradientTo: colorTokens.financeBlue[700],
    rating: 5,
  },
  {
    quote:
      "Khyati built our financial dashboard from scratch. Now our entire team tracks the same numbers and we make decisions 3x faster.",
    name: "Priya Nair",
    role: "CEO, GreenRoute",
    company: "Logistics, Bengaluru",
    initials: "PN",
    gradientFrom: colorTokens.success.main,
    gradientTo: "#059669",
    rating: 5,
  },
  {
    quote:
      "The breakeven and runway calculators alone saved me from making a very expensive hiring mistake. Worth every rupee.",
    name: "Rahul Sharma",
    role: "Co-Founder, RetailOS",
    company: "SaaS, Pune",
    initials: "RS",
    gradientFrom: "#8B5CF6",
    gradientTo: "#6D28D9",
    rating: 5,
  },
  {
    quote:
      "I used the Founder Test and booked a consultation the same day. Parag helped me see exactly where I was leaking cash. Game changer.",
    name: "Sneha Iyer",
    role: "Founder, CraftHaus",
    company: "D2C, Chennai",
    initials: "SI",
    gradientFrom: colorTokens.warning.main,
    gradientTo: "#D97706",
    rating: 5,
  },
  {
    quote:
      "The Excel templates are institutional quality. I use the valuation model for every client pitch now. Saves me 6 hours per engagement.",
    name: "Vikram Joshi",
    role: "CFO, NovaMed",
    company: "Healthcare, Delhi",
    initials: "VJ",
    gradientFrom: "#EC4899",
    gradientTo: "#BE185D",
    rating: 5,
  },
  {
    quote:
      "Working with Merraki is like having a CFO on call. They understand the startup context, not just the numbers.",
    name: "Divya Krishnan",
    role: "MD, SolarPath",
    company: "CleanTech, Hyderabad",
    initials: "DK",
    gradientFrom: colorTokens.financeBlue[600],
    gradientTo: colorTokens.darkNavy[600],
    rating: 5,
  },
];

export function TestimonialsSection() {
  const { ref, inView } = useInView({ threshold: 0.1 });

  return (
    <Box sx={{ py: { xs: 8, md: 12 }, backgroundColor: colorTokens.white }}>
      <Container maxWidth="xl">
        <Box sx={{ textAlign: "center", mb: { xs: 6, md: 8 } }}>
          <SectionLabel text="Client Stories" color="blue" />
          <Typography
            variant="h2"
            sx={{ mt: 2, fontWeight: 800, color: colorTokens.darkNavy[900] }}
          >
            Trusted by Founders <GradientText>Across India</GradientText>
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            sx={{ maxWidth: 480, mx: "auto", lineHeight: 1.75, mt: 2 }}
          >
            Real results from founders who transformed their financial clarity
            with Merraki Solutions.
          </Typography>
        </Box>

        <Grid
          container
          spacing={3}
          ref={ref as React.RefObject<HTMLDivElement>}
        >
          {TESTIMONIALS.map((t, i) => (
            <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={t.name}>
              <motion.div
                initial={{ opacity: 0, y: 28 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.08, duration: 0.5, ease: "easeOut" }}
                whileHover={{ y: -5 }}
              >
                <Box
                  sx={{
                    p: { xs: 3, md: 3.5 },
                    borderRadius: "20px",
                    backgroundColor: colorTokens.white,
                    border: `1px solid ${colorTokens.slate[100]}`,
                    boxShadow: shadowTokens.md,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      boxShadow: shadowTokens.xl,
                      borderColor: colorTokens.financeBlue[100],
                    },
                  }}
                >
                  {/* Quote icon */}
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "10px",
                      backgroundColor: colorTokens.financeBlue[50],
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 2.5,
                      flexShrink: 0,
                    }}
                  >
                    <QuoteIcon
                      sx={{
                        color: colorTokens.financeBlue[500],
                        fontSize: "1.25rem",
                      }}
                    />
                  </Box>

                  {/* Stars */}
                  <Box sx={{ display: "flex", gap: 0.375, mb: 2 }}>
                    {Array.from({ length: t.rating }).map((_, si) => (
                      <Typography
                        key={si}
                        sx={{
                          color: "#F59E0B",
                          fontSize: "0.875rem",
                          lineHeight: 1,
                        }}
                      >
                        ★
                      </Typography>
                    ))}
                  </Box>

                  {/* Quote text */}
                  <Typography
                    variant="body2"
                    sx={{
                      color: colorTokens.slate[700],
                      lineHeight: 1.8,
                      flex: 1,
                      mb: 3,
                      fontStyle: "italic",
                    }}
                  >
                    &ldquo;{t.quote}&rdquo;
                  </Typography>

                  {/* Author */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      pt: 2.5,
                      borderTop: `1px solid ${colorTokens.slate[100]}`,
                    }}
                  >
                    <Box
                      sx={{
                        width: 42,
                        height: 42,
                        borderRadius: "12px",
                        background: `linear-gradient(135deg, ${t.gradientFrom}, ${t.gradientTo})`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Typography
                        sx={{
                          color: "#fff",
                          fontFamily: "var(--font-display)",
                          fontWeight: 800,
                          fontSize: "0.875rem",
                        }}
                      >
                        {t.initials}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 700,
                          color: colorTokens.darkNavy[800],
                          lineHeight: 1.2,
                          fontFamily: "var(--font-display)",
                        }}
                      >
                        {t.name}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: colorTokens.slate[500] }}
                      >
                        {t.role} · {t.company}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
