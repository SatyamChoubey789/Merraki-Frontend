"use client";

import { Box, Container, Grid } from "@mui/material";
import { keyframes } from "@mui/system";

const T = {
  white: "#FFFFFF",
  offwhite: "#F9F8F5",
  border: "#E2DED5",
  ink: "#0C0E12",
  gold: "#B8922A",
  goldLight: "#DDB96A",
  goldGlow: "rgba(184,146,42,0.05)",
};

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const goldShimmer = {
  background: `linear-gradient(
    90deg,
    rgba(0,0,0,0.03) 0%,
    rgba(184,146,42,0.08) 50%,
    rgba(0,0,0,0.03) 100%
  )`,
  backgroundSize: "200% 100%",
  animation: `${shimmer} 3s ease-in-out infinite`,
};

export default function ShopLoading() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: T.offwhite,
        pt: 14,
        pb: 14,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Architectural grid */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(${T.border} 1px, transparent 1px),
            linear-gradient(90deg, ${T.border} 1px, transparent 1px)
          `,
          backgroundSize: "72px 72px",
          opacity: 0.25,
        }}
      />

      {/* Gold glow atmosphere */}
      <Box
        sx={{
          position: "absolute",
          width: "70vw",
          height: "40vw",
          top: "-25vw",
          left: "15vw",
          borderRadius: "50%",
          background: `radial-gradient(ellipse, ${T.goldGlow} 0%, transparent 70%)`,
        }}
      />

      {/* Ghost watermark */}
      <Box
        sx={{
          position: "absolute",
          right: { xs: -40, md: -80 },
          bottom: -100,
          fontFamily: '"Instrument Serif", serif',
          fontStyle: "italic",
          fontSize: { xs: "40vw", md: "26vw" },
          color: "rgba(12,14,18,0.025)",
          lineHeight: 1,
          userSelect: "none",
        }}
      >
        Shop
      </Box>

      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1 }}>
        {/* Headline skeleton */}
        <Box sx={{ mb: 2, height: 64, width: "45%", borderRadius: 2, ...goldShimmer }} />
        <Box sx={{ mb: 5, height: 24, width: "60%", borderRadius: 1, background: "rgba(0,0,0,0.05)" }} />

        {/* Filter pills */}
        <Box sx={{ display: "flex", gap: 2, mb: 6 }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Box
              key={i}
              sx={{
                height: 36,
                width: 100,
                borderRadius: "999px",
                border: `1px solid ${T.border}`,
                ...goldShimmer,
              }}
            />
          ))}
        </Box>

        {/* Product grid */}
        <Grid container spacing={4}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={i}>
              <Box
                sx={{
                  height: 420,
                  borderRadius: "18px",
                  border: `1px solid ${T.border}`,
                  background: T.white,
                  p: 2,
                }}
              >
                {/* Image area */}
                <Box
                  sx={{
                    height: 240,
                    borderRadius: "14px",
                    mb: 3,
                    ...goldShimmer,
                  }}
                />

                {/* Title */}
                <Box sx={{ height: 22, width: "70%", mb: 2, borderRadius: 1, ...goldShimmer }} />

                {/* Price */}
                <Box sx={{ height: 18, width: "40%", borderRadius: 1, background: "rgba(0,0,0,0.05)" }} />
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}