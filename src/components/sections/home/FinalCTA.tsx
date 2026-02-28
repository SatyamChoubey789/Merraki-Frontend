"use client";

import { Box, Container, Typography, Button, Grid } from "@mui/material";
import {
  ArrowForward as ArrowIcon,
  CalendarMonth as CalIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import Link from "next/link";
import { colorTokens } from "@/theme";
import { useInView } from "@/lib/hooks/useInView";

export function FinalCTA() {
  const { ref, inView } = useInView({ threshold: 0.3 });

  return (
    <Box
      sx={{
        py: { xs: 10, md: 16 },
        background: `linear-gradient(160deg, ${colorTokens.darkNavy[900]} 0%, #0C1A4A 100%)`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at center, rgba(26,86,219,0.2) 0%, transparent 65%)`,
          pointerEvents: "none",
        }}
      />
      <Container
        maxWidth="md"
        sx={{ position: "relative", zIndex: 1, textAlign: "center" }}
      >
        <motion.div
          ref={ref as React.RefObject<HTMLDivElement>}
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <Typography
            variant="overline"
            sx={{
              color: "rgba(255,255,255,0.4)",
              letterSpacing: "0.14em",
              mb: 2,
              display: "block",
            }}
          >
            Let&apos;s Build Your Financial Future
          </Typography>
          <Typography
            variant="h1"
            sx={{
              color: "#fff",
              fontWeight: 800,
              mb: 3,
              letterSpacing: "-0.035em",
              lineHeight: 1.08,
            }}
          >
            Ready to{" "}
            <Box
              component="span"
              sx={{
                background: `linear-gradient(135deg, ${colorTokens.financeBlue[300]}, #A78BFA)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Amplify Growth?
            </Box>
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              color: "rgba(255,255,255,0.55)",
              maxWidth: 500,
              mx: "auto",
              lineHeight: 1.8,
              mb: 6,
            }}
          >
            Book a free 30-minute consultation with Parag or Khyati and get a
            clear financial roadmap built for your specific business.
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: 2.5,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Button
                component="a"
                href={process.env.NEXT_PUBLIC_CALENDLY_URL}
                target="_blank"
                variant="contained"
                size="large"
                startIcon={<CalIcon />}
                sx={{
                  px: 5,
                  py: 2,
                  fontWeight: 700,
                  borderRadius: "14px",
                  background: `linear-gradient(135deg, ${colorTokens.financeBlue[400]}, ${colorTokens.financeBlue[600]})`,
                  boxShadow: "0 8px 32px rgba(26,86,219,0.5)",
                  fontSize: "1.0625rem",
                }}
              >
                Book Free Consultation
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Button
                component={Link}
                href="/templates"
                variant="outlined"
                size="large"
                endIcon={<ArrowIcon />}
                sx={{
                  px: 5,
                  py: 2,
                  fontWeight: 600,
                  borderRadius: "14px",
                  color: "rgba(255,255,255,0.85)",
                  borderColor: "rgba(255,255,255,0.2)",
                  borderWidth: "1.5px",
                  fontSize: "1.0625rem",
                  "&:hover": {
                    borderColor: "rgba(255,255,255,0.4)",
                    backgroundColor: "rgba(255,255,255,0.06)",
                  },
                }}
              >
                Browse Templates
              </Button>
            </motion.div>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}
