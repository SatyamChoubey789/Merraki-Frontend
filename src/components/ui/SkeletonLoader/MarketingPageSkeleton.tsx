"use client";

import React from "react";
import { Box, Container, Grid } from "@mui/material";
import { keyframes } from "@mui/system";

/* ══ TOKENS — exact FinalCTA theme ══════════════════════ */
const T = {
  bgSection: "#F5F7FB",
  bluePale:  "#EDF3FF",
  blueDim:   "rgba(59,123,246,0.06)",
  blueGlow:  "rgba(59,123,246,0.18)",
  border:    "rgba(10,10,20,0.08)",
  borderMid: "rgba(10,10,20,0.14)",
};

const shimmer = keyframes`
  0%   { background-position: -200% 0; }
  100% { background-position:  200% 0; }
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

interface MarketingPageSkeletonProps {
  heroHeight?: string | number;
}

export const MarketingPageSkeleton: React.FC<MarketingPageSkeletonProps> = ({
  heroHeight = "100vh",
}) => {
  return (
    <Box>
      <Box sx={{
        height: heroHeight,
        background: `linear-gradient(135deg, ${T.bluePale} 0%, ${T.bgSection} 50%, ${T.bluePale} 100%)`,
        display: "flex", alignItems: "center",
        position: "relative", overflow: "hidden",
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
          <Grid container spacing={6} alignItems="center">

            {/* Left content */}
            <Grid size={{ xs: 12, lg: 6 }}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {/* Headline lines */}
                <Box sx={{ height: 80, width: "90%", borderRadius: "10px", ...blueShimmer }} />
                <Box sx={{ height: 80, width: "75%", borderRadius: "10px", ...blueShimmer }} />
                {/* Subtext lines */}
                <Box sx={{ height: 20, width: "80%", borderRadius: "6px", background: T.blueDim, opacity: 0.8 }} />
                <Box sx={{ height: 20, width: "65%", borderRadius: "6px", background: T.blueDim, opacity: 0.6 }} />
                {/* Buttons */}
                <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                  <Box sx={{ width: 180, height: 54, borderRadius: "14px", ...blueShimmer }} />
                  <Box sx={{ width: 180, height: 54, borderRadius: "14px", background: T.blueDim, border: `1px solid ${T.borderMid}` }} />
                </Box>
              </Box>
            </Grid>

            {/* Right image */}
            <Grid size={{ xs: 12, lg: 6 }} sx={{ display: { xs: "none", lg: "block" } }}>
              <Box sx={{
                height: 420, borderRadius: "20px",
                border: `1px solid ${T.borderMid}`,
                ...blueShimmer,
                position: "relative", overflow: "hidden",
                boxShadow: `0 8px 40px ${T.blueGlow}`,
              }}>
                <Box sx={{
                  position: "absolute", inset: 0,
                  background: "linear-gradient(120deg, rgba(255,255,255,0.08) 0%, transparent 60%)",
                }} />
              </Box>
            </Grid>

          </Grid>
        </Container>
      </Box>
    </Box>
  );
};