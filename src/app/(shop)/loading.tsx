"use client";

import { Box, Container, Grid } from "@mui/material";
import { keyframes } from "@mui/system";

/* ══ TOKENS — exact FinalCTA theme ══════════════════════ */
const T = {
  bg:        "#FFFFFF",
  bgSection: "#F5F7FB",
  bluePale:  "#EDF3FF",
  blueDim:   "rgba(59,123,246,0.06)",
  border:    "rgba(10,10,20,0.08)",
  borderMid: "rgba(10,10,20,0.14)",
  blue:      "#3B7BF6",
  blueGlow:  "rgba(59,123,246,0.18)",
};

const shimmer = keyframes`
  0%   { background-position: -200% 0; }
  100% { background-position:  200% 0; }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.45; }
`;

const blueShimmer = {
  background: `linear-gradient(
    90deg,
    ${T.blueDim} 0%,
    rgba(59,123,246,0.12) 50%,
    ${T.blueDim} 100%
  )`,
  backgroundSize: "200% 100%",
  animation: `${shimmer} 2.4s ease-in-out infinite`,
};

export default function ShopLoading() {
  return (
    <Box sx={{
      minHeight: "100vh",
      background: `linear-gradient(135deg, ${T.bluePale} 0%, ${T.bgSection} 50%, ${T.bluePale} 100%)`,
      pt: 14, pb: 14,
      position: "relative",
      overflow: "hidden",
    }}>

      {/* Ambient blobs — exact FinalCTA */}
      <Box sx={{
        position: "absolute", width: "60vw", height: "60vw",
        top: "-20vw", left: "-10vw", borderRadius: "50%",
        background: `radial-gradient(ellipse, ${T.blueGlow} 0%, transparent 60%)`,
        pointerEvents: "none",
      }} />
      <Box sx={{
        position: "absolute", width: "50vw", height: "50vw",
        bottom: "-15vw", right: "-10vw", borderRadius: "50%",
        background: `radial-gradient(ellipse, ${T.blueDim} 0%, transparent 60%)`,
        pointerEvents: "none",
      }} />

      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1 }}>

        {/* Headline skeleton */}
        <Box sx={{
          mb: 2, height: 64, width: "45%",
          borderRadius: "10px",
          ...blueShimmer,
        }} />
        <Box sx={{
          mb: 6, height: 22, width: "58%",
          borderRadius: "6px",
          animation: `${pulse} 2s ease-in-out 0.2s infinite`,
          background: T.blueDim,
        }} />

        {/* Filter pills */}
        <Box sx={{ display: "flex", gap: 1.5, mb: 6, flexWrap: "wrap" }}>
          {[100, 90, 110, 95, 105].map((w, i) => (
            <Box key={i} sx={{
              height: 36, width: w,
              borderRadius: "100px",
              border: `1px solid ${T.border}`,
              animation: `${pulse} 2s ease-in-out ${i * 0.1}s infinite`,
              background: T.bg,
            }} />
          ))}
        </Box>

        {/* Product grid */}
        <Grid container spacing={3}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={i}>
              <Box sx={{
                height: 420,
                borderRadius: "18px",
                border: `1px solid ${T.borderMid}`,
                background: T.bg,
                p: 2,
                boxShadow: `0 4px 24px ${T.blueGlow}`,
                animation: `${pulse} 2.2s ease-in-out ${i * 0.12}s infinite`,
              }}>
                {/* Image area */}
                <Box sx={{
                  height: 240, borderRadius: "12px", mb: 3,
                  ...blueShimmer,
                }} />
                {/* Title */}
                <Box sx={{
                  height: 20, width: "68%", mb: 1.5,
                  borderRadius: "6px", background: T.blueDim,
                }} />
                {/* Subtitle */}
                <Box sx={{
                  height: 16, width: "45%", mb: 2,
                  borderRadius: "6px", background: T.blueDim, opacity: 0.6,
                }} />
                {/* Price */}
                <Box sx={{
                  height: 18, width: "36%",
                  borderRadius: "6px", background: T.blueDim,
                }} />
              </Box>
            </Grid>
          ))}
        </Grid>

      </Container>
    </Box>
  );
}