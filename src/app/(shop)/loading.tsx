"use client";

import { Box, Container, Grid } from "@mui/material";
import { keyframes } from "@mui/system";

/* ══ NEW NEUTRAL TOKENS ══════════════════════ */
const T = {
  bg: "#F5F7FB",
  bgSection: "#F5F7FB",
  ink: "#253957",
  inkMid: "#253957",
  inkMuted: "#253957",
  inkFaint: "#253957",
  border: "rgba(37,57,87,0.12)",
  borderMid: "rgba(37,57,87,0.18)",
  blue: "#253957",
  blueLight: "#4a6fa5",
  bluePale: "#F5F7FB",
  blueGlow: "rgba(37,57,87,0.08)",
  blueDim: "rgba(37,57,87,0.06)",
  blueGrad: "linear-gradient(135deg, #253957 0%, #4a6fa5 100%)",
  blueBdr: "rgba(37,57,87,0.22)",
};

const shimmer = keyframes`
  0%   { background-position: -200% 0; }
  100% { background-position:  200% 0; }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50%      { opacity: 0.45; }
`;

/* neutral shimmer (no blue tint anymore) */
const shimmerBase = {
  background: `linear-gradient(
    90deg,
    rgba(37,57,87,0.04) 0%,
    rgba(37,57,87,0.08) 50%,
    rgba(37,57,87,0.04) 100%
  )`,
  backgroundSize: "200% 100%",
  animation: `${shimmer} 2.4s ease-in-out infinite`,
};

export default function ShopLoading() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: T.bg,
        pt: 14,
        pb: 14,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient blobs (neutral toned) */}
      <Box
        sx={{
          position: "absolute",
          width: "60vw",
          height: "60vw",
          top: "-20vw",
          left: "-10vw",
          borderRadius: "50%",
          background: `radial-gradient(ellipse, rgba(37,57,87,0.06) 0%, transparent 60%)`,
          pointerEvents: "none",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          width: "50vw",
          height: "50vw",
          bottom: "-15vw",
          right: "-10vw",
          borderRadius: "50%",
          background: `radial-gradient(ellipse, rgba(37,57,87,0.05) 0%, transparent 60%)`,
          pointerEvents: "none",
        }}
      />

      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1 }}>
        {/* Headline skeleton */}
        <Box
          sx={{
            mb: 2,
            height: 64,
            width: "45%",
            borderRadius: "10px",
            ...shimmerBase,
          }}
        />

        <Box
          sx={{
            mb: 6,
            height: 22,
            width: "58%",
            borderRadius: "6px",
            background: "rgba(37,57,87,0.06)",
            animation: `${pulse} 2s ease-in-out 0.2s infinite`,
          }}
        />

        {/* Filter pills */}
        <Box sx={{ display: "flex", gap: 1.5, mb: 6, flexWrap: "wrap" }}>
          {[100, 90, 110, 95, 105].map((w, i) => (
            <Box
              key={i}
              sx={{
                height: 36,
                width: w,
                borderRadius: "100px",
                border: `1px solid ${T.border}`,
                background: "#fff",
                animation: `${pulse} 2s ease-in-out ${i * 0.1}s infinite`,
              }}
            />
          ))}
        </Box>

        {/* Product grid */}
        <Grid container spacing={3}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={i}>
              <Box
                sx={{
                  height: 420,
                  borderRadius: "18px",
                  border: `1px solid ${T.borderMid}`,
                  background: "#fff",
                  p: 2,
                  boxShadow: "0 4px 24px rgba(37,57,87,0.06)",
                  animation: `${pulse} 2.2s ease-in-out ${i * 0.12}s infinite`,
                }}
              >
                {/* Image */}
                <Box
                  sx={{
                    height: 240,
                    borderRadius: "12px",
                    mb: 3,
                    ...shimmerBase,
                  }}
                />

                {/* Title */}
                <Box
                  sx={{
                    height: 20,
                    width: "68%",
                    mb: 1.5,
                    borderRadius: "6px",
                    background: "rgba(37,57,87,0.06)",
                  }}
                />

                {/* Subtitle */}
                <Box
                  sx={{
                    height: 16,
                    width: "45%",
                    mb: 2,
                    borderRadius: "6px",
                    background: "rgba(37,57,87,0.05)",
                  }}
                />

                {/* Price */}
                <Box
                  sx={{
                    height: 18,
                    width: "36%",
                    borderRadius: "6px",
                    background: "rgba(37,57,87,0.06)",
                  }}
                />
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}