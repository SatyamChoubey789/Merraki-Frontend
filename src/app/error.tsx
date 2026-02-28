"use client";

import { useEffect } from "react";
import { Box, Container, Typography, Button } from "@mui/material";
import { Refresh as RetryIcon } from "@mui/icons-material";
import { motion } from "framer-motion";
import { colorTokens } from "@/theme";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Global Error]", error);
  }, [error]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `linear-gradient(160deg, ${colorTokens.darkNavy[900]}, ${colorTokens.darkNavy[800]})`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container maxWidth="sm" sx={{ textAlign: "center" }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography sx={{ fontSize: "4rem", mb: 2 }}>⚠️</Typography>
          <Typography
            variant="h4"
            sx={{
              color: "#fff",
              fontWeight: 800,
              mb: 1.5,
              letterSpacing: "-0.02em",
            }}
          >
            Something Went Wrong
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: "rgba(255,255,255,0.5)", mb: 4, lineHeight: 1.75 }}
          >
            An unexpected error occurred. Our team has been notified.
            {error.digest && (
              <Box
                component="span"
                sx={{
                  display: "block",
                  mt: 1,
                  fontSize: "0.8125rem",
                  opacity: 0.6,
                }}
              >
                Error ID: {error.digest}
              </Box>
            )}
          </Typography>
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <Button
              onClick={reset}
              variant="contained"
              size="large"
              startIcon={<RetryIcon />}
              sx={{
                px: 4,
                py: 1.75,
                fontWeight: 700,
                borderRadius: "14px",
                background: `linear-gradient(135deg, ${colorTokens.financeBlue[400]}, ${colorTokens.financeBlue[600]})`,
                boxShadow: "0 8px 28px rgba(26,86,219,0.4)",
              }}
            >
              Try Again
            </Button>
          </motion.div>
        </motion.div>
      </Container>
    </Box>
  );
}
