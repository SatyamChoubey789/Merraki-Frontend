"use client";

import { Box, type BoxProps } from "@mui/material";
import { colorTokens } from "@/theme";

interface GradientTextProps extends BoxProps {
  gradient?: string;
  component?: React.ElementType;
}

export function GradientText({
  children,
  gradient,
  component = "span",
  sx,
  ...props
}: GradientTextProps) {
  const defaultGradient = `linear-gradient(135deg, ${colorTokens.financeBlue[500]} 0%, ${colorTokens.financeBlue[300]} 50%, ${colorTokens.darkNavy[500]} 100%)`;

  return (
    <Box
      component={component}
      sx={{
        background: gradient ?? defaultGradient,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        display: "inline",
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
}
