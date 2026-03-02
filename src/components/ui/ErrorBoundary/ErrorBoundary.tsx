"use client";

import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { colorTokens } from "@/theme";

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("[ErrorBoundary]", error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <Box
          sx={{
            position: "relative",
            border: "1px solid #E2DED5",
            borderRadius: "18px",
            background: "#FFFFFF",
            px: { xs: 3, md: 6 },
            py: { xs: 6, md: 8 },
            textAlign: "center",
            overflow: "hidden",
          }}
        >
          {/* Subtle gold glow */}
          <Box
            sx={{
              position: "absolute",
              width: "60%",
              height: "120%",
              top: "-40%",
              left: "20%",
              borderRadius: "50%",
              background:
                "radial-gradient(ellipse, rgba(184,146,42,0.06) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />

          {/* Micro label */}
          <Typography
            sx={{
              fontFamily: '"DM Mono", monospace',
              fontSize: "0.65rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#94A3B8",
              mb: 3,
            }}
          >
            Section Unavailable
          </Typography>

          {/* Editorial headline */}
          <Typography
            sx={{
              fontFamily: '"Instrument Serif", serif',
              fontStyle: "italic",
              fontSize: { xs: "1.8rem", md: "2.2rem" },
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              color: "#0C0E12",
              mb: 2,
            }}
          >
            We couldn’t load this section.
          </Typography>

          <Typography
            sx={{
              color: "#64748B",
              mb: 4,
              maxWidth: 420,
              mx: "auto",
              lineHeight: 1.8,
            }}
          >
            {this.state.error?.message ??
              "An unexpected issue occurred. Please try again."}
          </Typography>

          <Button
            onClick={this.handleReset}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: "14px",
              fontWeight: 600,
              background: "linear-gradient(135deg, #DDB96A, #B8922A)",
              color: "#FFFFFF",
              boxShadow: "0 8px 24px rgba(184,146,42,0.35)",
              transition: "all 0.25s ease",
              "&:hover": {
                boxShadow: "0 12px 30px rgba(184,146,42,0.45)",
              },
            }}
          >
            Reload Section
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}
