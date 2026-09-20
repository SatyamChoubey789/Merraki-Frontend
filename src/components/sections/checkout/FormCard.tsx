"use client";

import { Box, Typography } from "@mui/material";
import { T, SANS } from "@/components/sections/checkout/checkout.types";

interface FormCardProps {
  title: string;
  children: React.ReactNode;
}

export function FormCard({ title, children }: FormCardProps) {
  return (
    <Box
      sx={{
        background: T.surface,
        borderRadius: "16px",
        border: `1px solid ${T.borderMid}`,
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: { xs: 3, md: 4 },
          py: 2.5,
          borderBottom: `1px solid ${T.border}`,
          background: T.bg,
        }}
      >
        <Typography
          sx={{
            fontFamily: SANS,
            fontWeight: 700,
            fontSize: "1rem",
            color: T.ink,
            letterSpacing: "-0.01em",
          }}
        >
          {title}
        </Typography>
      </Box>

      {/* Body */}
      <Box sx={{ px: { xs: 3, md: 4 }, py: { xs: 3, md: 3.5 } }}>
        {children}
      </Box>
    </Box>
  );
}