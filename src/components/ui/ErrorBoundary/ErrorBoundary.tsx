"use client";

import React from "react";
import { Box, Typography, Button } from "@mui/material";

/* ══ TOKENS — exact FinalCTA theme ══════════════════════ */
const T = {
  bg:        "#FFFFFF",
  bgSection: "#F5F7FB",
  border:    "rgba(10,10,20,0.08)",
  borderMid: "rgba(10,10,20,0.14)",
  ink:       "#0A0A0F",
  inkMuted:  "#5A5A72",
  inkFaint:  "#9898AE",
  blue:      "#3B7BF6",
  blueGlow:  "rgba(59,123,246,0.18)",
  blueDim:   "rgba(59,123,246,0.06)",
  blueGrad:  "linear-gradient(135deg, #3B7BF6 0%, #7AABFF 100%)",
};

const SANS = '"DM Sans","Mona Sans",system-ui,sans-serif';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
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
        <Box sx={{
          position: "relative",
          border: `1px solid ${T.borderMid}`,
          borderRadius: "18px",
          background: T.bg,
          px: { xs: 3, md: 6 },
          py: { xs: 6, md: 8 },
          textAlign: "center",
          overflow: "hidden",
          boxShadow: `0 8px 32px ${T.blueGlow}`,
        }}>
          {/* Ambient blob */}
          <Box sx={{
            position: "absolute", width: "60%", height: "120%",
            top: "-40%", left: "20%", borderRadius: "50%",
            background: `radial-gradient(ellipse, ${T.blueDim} 0%, transparent 70%)`,
            pointerEvents: "none",
          }} />

          {/* Headline */}
          <Typography sx={{
            fontFamily: SANS, fontWeight: 800,
            fontSize: { xs: "1.5rem", md: "1.875rem" },
            letterSpacing: "-0.03em", lineHeight: 1.1,
            color: T.ink, mb: 2, position: "relative", zIndex: 1,
          }}>
            We couldn't load this section.
          </Typography>

          <Typography sx={{
            fontFamily: SANS, fontWeight: 400,
            fontSize: "0.9375rem",
            color: T.inkMuted, mb: 4,
            maxWidth: 420, mx: "auto", lineHeight: 1.75,
            position: "relative", zIndex: 1,
          }}>
            {this.state.error?.message ?? "An unexpected issue occurred. Please try again."}
          </Typography>

          <Button
            onClick={this.handleReset}
            disableElevation
            sx={{
              position: "relative", zIndex: 1,
              fontFamily: SANS, fontWeight: 600,
              fontSize: "1rem", textTransform: "none",
              letterSpacing: "-0.01em",
              px: 4, py: 1.75, borderRadius: "14px", minHeight: 54,
              color: "#FFFFFF", background: T.blueGrad,
              boxShadow: `0 8px 28px ${T.blueGlow}`,
              "&:hover": { filter: "brightness(1.08)", boxShadow: `0 12px 36px ${T.blueGlow}` },
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