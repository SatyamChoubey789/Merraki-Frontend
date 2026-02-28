"use client";

import { Box, Container, Typography, Button } from "@mui/material";
import {
  Home as HomeIcon,
  ArrowForward as ArrowIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import Link from "next/link";
import { colorTokens } from "@/theme";

export default function NotFound() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `linear-gradient(160deg, ${colorTokens.darkNavy[900]} 0%, ${colorTokens.darkNavy[800]} 100%)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at center, rgba(26,86,219,0.12) 0%, transparent 65%)`,
          pointerEvents: "none",
        }}
      />

      <Container
        maxWidth="sm"
        sx={{ textAlign: "center", position: "relative", zIndex: 1 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* 404 */}
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 180,
              damping: 16,
              delay: 0.1,
            }}
          >
            <Typography
              sx={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: "clamp(6rem, 20vw, 10rem)",
                lineHeight: 1,
                background: `linear-gradient(135deg, ${colorTokens.financeBlue[400]}, #A78BFA)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                mb: 2,
                letterSpacing: "-0.05em",
              }}
            >
              404
            </Typography>
          </motion.div>

          <Typography
            variant="h4"
            sx={{
              color: "#fff",
              fontWeight: 800,
              mb: 1.5,
              letterSpacing: "-0.02em",
            }}
          >
            Page Not Found
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: "rgba(255,255,255,0.5)",
              mb: 5,
              lineHeight: 1.75,
              maxWidth: 380,
              mx: "auto",
            }}
          >
            The page you&apos;re looking for doesn&apos;t exist or may have been
            moved. Let&apos;s get you back on track.
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: 2,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Button
                component={Link}
                href="/"
                variant="contained"
                size="large"
                startIcon={<HomeIcon />}
                sx={{
                  px: 4,
                  py: 1.75,
                  fontWeight: 700,
                  borderRadius: "14px",
                  background: `linear-gradient(135deg, ${colorTokens.financeBlue[400]}, ${colorTokens.financeBlue[600]})`,
                  boxShadow: "0 8px 28px rgba(26,86,219,0.4)",
                  fontSize: "1rem",
                }}
              >
                Back Home
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
                  px: 4,
                  py: 1.75,
                  fontWeight: 600,
                  borderRadius: "14px",
                  color: "rgba(255,255,255,0.8)",
                  borderColor: "rgba(255,255,255,0.2)",
                  borderWidth: "1.5px",
                  fontSize: "1rem",
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
