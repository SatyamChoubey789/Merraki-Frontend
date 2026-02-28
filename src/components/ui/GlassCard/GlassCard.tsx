"use client";

import { Box, type BoxProps } from "@mui/material";
import { shadowTokens, borderRadiusTokens } from "@/theme";

interface GlassCardProps extends BoxProps {
  blur?: number;
  intensity?: "low" | "medium" | "high";
  dark?: boolean;
}

export function GlassCard({
  children,
  blur = 12,
  intensity = "medium",
  dark = false,
  sx,
  ...props
}: GlassCardProps) {
  const intensityMap = {
    low: { bg: "rgba(255,255,255,0.04)", border: "rgba(255,255,255,0.08)" },
    medium: { bg: "rgba(255,255,255,0.08)", border: "rgba(255,255,255,0.14)" },
    high: { bg: "rgba(255,255,255,0.14)", border: "rgba(255,255,255,0.22)" },
  };

  const darkIntensityMap = {
    low: { bg: "rgba(10,20,48,0.04)", border: "rgba(10,20,48,0.08)" },
    medium: { bg: "rgba(10,20,48,0.06)", border: "rgba(10,20,48,0.12)" },
    high: { bg: "rgba(10,20,48,0.10)", border: "rgba(10,20,48,0.18)" },
  };

  const colors = dark ? darkIntensityMap[intensity] : intensityMap[intensity];

  return (
    <Box
      sx={{
        background: colors.bg,
        backdropFilter: `blur(${blur}px)`,
        WebkitBackdropFilter: `blur(${blur}px)`,
        border: `1px solid ${colors.border}`,
        borderRadius: borderRadiusTokens.lg,
        boxShadow: shadowTokens.glass,
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
}
