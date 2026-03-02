"use client";

import React from "react";
import { Box, Container, Grid } from "@mui/material";
import { keyframes } from "@mui/system";
import { colorTokens } from "@/theme";

// ----------------------
// Shimmer animation
// ----------------------
const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const goldShimmer = {
  background: `
    linear-gradient(
      90deg,
      rgba(0,0,0,0.03) 0%,
      rgba(184,146,42,0.1) 50%,
      rgba(0,0,0,0.03) 100%
    )
  `,
  backgroundSize: "200% 100%",
  animation: `${shimmer} 3s ease-in-out infinite`,
};

// ----------------------
// Types
// ----------------------
interface MarketingPageSkeletonProps {
  heroHeight?: string | number;
}

// ----------------------
// Marketing Page Skeleton
// ----------------------
export const MarketingPageSkeleton: React.FC<MarketingPageSkeletonProps> = ({
  heroHeight = "100vh",
}) => {
  return (
    <Box>
      {/* Hero skeleton */}
      <Box
        sx={{
          height: heroHeight,
          backgroundColor: colorTokens.darkNavy[900],
          display: "flex",
          alignItems: "center",
          perspective: "1200px",
        }}
      >
        <Container maxWidth="xl">
          <Grid container spacing={6} alignItems="center">
            {/* Left content */}
            <Grid size={{ xs: 12, lg: 6 }}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box
                  sx={{
                    width: 160,
                    height: 28,
                    borderRadius: "999px",
                    ...goldShimmer,
                  }}
                />
                <Box
                  sx={{
                    height: 80,
                    width: "90%",
                    borderRadius: "8px",
                    ...goldShimmer,
                  }}
                />
                <Box
                  sx={{
                    height: 80,
                    width: "75%",
                    borderRadius: "8px",
                    ...goldShimmer,
                  }}
                />
                <Box
                  sx={{
                    height: 28,
                    width: "80%",
                    borderRadius: "6px",
                    ...goldShimmer,
                  }}
                />
                <Box
                  sx={{
                    height: 28,
                    width: "65%",
                    borderRadius: "6px",
                    ...goldShimmer,
                  }}
                />

                {/* Buttons */}
                <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                  <Box
                    sx={{
                      width: 180,
                      height: 52,
                      borderRadius: "14px",
                      ...goldShimmer,
                    }}
                  />
                  <Box
                    sx={{
                      width: 180,
                      height: 52,
                      borderRadius: "14px",
                      ...goldShimmer,
                    }}
                  />
                </Box>
              </Box>
            </Grid>

            {/* Right image */}
            <Grid
              size={{ xs: 12, lg: 6 }}
              sx={{
                display: { xs: "none", lg: "block" },
                transformStyle: "preserve-3d",
                transition:
                  "transform 0.6s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s ease",
                boxShadow: "0 8px 24px rgba(12,14,18,0.06)",
                "&:hover": {
                  transform: "rotateX(3deg) rotateY(-3deg) translateY(-5px)",
                  boxShadow: "0 20px 40px rgba(12,14,18,0.12)",
                },
              }}
            >
              <Box
                sx={{
                  height: 420,
                  borderRadius: "24px",
                  ...goldShimmer,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Subtle overlay for premium effect */}
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(120deg, rgba(255,255,255,0.1) 0%, transparent 60%)",
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};