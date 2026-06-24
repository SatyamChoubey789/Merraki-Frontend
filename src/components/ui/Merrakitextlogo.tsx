"use client";

import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";

type LogoSize = "xs" | "sm" | "md" | "lg" | "xl";
type LogoVariant = "primary" | "accent" | "white";

const SIZE_MAP: Record<LogoSize, string> = {
  xs: "1.5rem",
  sm: "1.875rem",
  md: "2.25rem",
  lg: "3rem",
  xl: "4rem",
};

const COLOR_MAP: Record<LogoVariant, string> = {
  primary: "#253957",
  accent: "#3B7BF6",
  white: "#FFFFFF",
};

interface MerrakiTextLogoProps {
  size?: LogoSize;
  fontSize?: string;
  variant?: LogoVariant;
  color?: string;
  className?: string;
  animate?: boolean;
}

export function MerrakiTextLogo({
  size = "md",
  fontSize,
  variant = "primary",
  color,
  className,
  animate = false,
}: MerrakiTextLogoProps) {
  const resolvedColor = color ?? COLOR_MAP[variant];
  const resolvedFontSize = fontSize ?? SIZE_MAP[size];

  const logoText = (
    <Typography
      component="span"
      className={className}
      sx={{
        fontFamily: '"Caveat", "Pacifico", cursive',
        fontSize: resolvedFontSize,
        fontWeight: 600,
        color: resolvedColor,
        lineHeight: 1,
        letterSpacing: "-0.01em",
        display: "block",
        userSelect: "none",
        transition: "opacity 0.2s ease",

        "&:hover": {
          opacity: 0.85,
        },
      }}
    >
      merraki
    </Typography>
  );

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{ display: "inline-flex" }}
      >
        {logoText}
      </motion.div>
    );
  }

  return logoText;
}

/* 🔥 Hover / Tap animated version */
export function MerrakiTextLogoAnimated(props: MerrakiTextLogoProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      style={{ display: "inline-flex", cursor: "pointer" }}
    >
      <MerrakiTextLogo {...props} />
    </motion.div>
  );
}

/* 🧾 Fallback SVG-style text (for OG images / PDFs) */
export function MerrakiTextLogoSVG({
  width = 140,
  color = "#253957", // ✅ brand color default
}: {
  width?: number;
  color?: string;
}) {
  return (
    <Box
      component="span"
      sx={{
        display: "inline-flex",
        fontFamily: '"Caveat", cursive',
        fontSize: `${width / 3.5}px`,
        fontWeight: 600,
        color,
        lineHeight: 1,
        userSelect: "none",
      }}
    >
      merraki
    </Box>
  );
}
