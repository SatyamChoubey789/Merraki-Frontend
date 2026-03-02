"use client";

import React from "react";
import { Box, Skeleton } from "@mui/material";
import { keyframes } from "@mui/system";
import { borderRadiusTokens, colorTokens } from "@/theme";

// ----------------------
// Gold Shimmer Animation
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
      rgba(184,146,42,0.10) 50%,
      rgba(0,0,0,0.03) 100%
    )
  `,
  backgroundSize: "200% 100%",
  animation: `${shimmer} 3s ease-in-out infinite`,
};

// ----------------------
// Types
// ----------------------
interface CardSkeletonProps {
  count?: number;
  height?: number;
}

interface BlogCardSkeletonProps {
  count?: number;
}

// ----------------------
// Premium 3D Card Skeleton
// ----------------------
export const CardSkeleton: React.FC<CardSkeletonProps> = ({
  count = 1,
  height = 380,
}) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <Box key={i} sx={{ perspective: "1200px", mb: 4 }}>
          <Box
            sx={{
              borderRadius: borderRadiusTokens.lg,
              overflow: "hidden",
              border: `1px solid #e5e7eb`,
              background: colorTokens.white,
              transformStyle: "preserve-3d",
              transition:
                "transform 0.6s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s ease",
              boxShadow: "0 8px 24px rgba(12,14,18,0.06)",
              "&:hover": {
                transform: "rotateX(4deg) rotateY(-4deg) translateY(-6px)",
                boxShadow: "0 20px 40px rgba(12,14,18,0.12)",
              },
            }}
          >
            {/* Image surface */}
            <Box sx={{ height: height * 0.6, position: "relative", ...goldShimmer }}>
              {/* Light reflection overlay */}
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(120deg, rgba(255,255,255,0.4) 0%, transparent 60%)",
                  opacity: 0.4,
                }}
              />
            </Box>

            {/* Text placeholders */}
            <Box sx={{ p: 3 }}>
              <Box
                sx={{
                  height: 22,
                  width: "70%",
                  mb: 2,
                  borderRadius: 1,
                  ...goldShimmer,
                }}
              />
              <Box
                sx={{
                  height: 18,
                  width: "90%",
                  mb: 1,
                  borderRadius: 1,
                  ...goldShimmer,
                }}
              />
              <Box
                sx={{
                  height: 18,
                  width: "60%",
                  mb: 3,
                  borderRadius: 1,
                  background: "rgba(0,0,0,0.05)",
                }}
              />

              {/* Tags / Buttons placeholders */}
              <Box sx={{ display: "flex", gap: 2 }}>
                <Box
                  sx={{
                    height: 32,
                    width: 80,
                    borderRadius: "999px",
                    ...goldShimmer,
                  }}
                />
                <Box
                  sx={{
                    height: 32,
                    width: 100,
                    borderRadius: "999px",
                    ...goldShimmer,
                  }}
                />
              </Box>

              {/* Bottom action placeholders */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mt: 4,
                }}
              >
                <Box sx={{ height: 28, width: 80, borderRadius: 1, ...goldShimmer }} />
                <Box
                  sx={{ height: 42, width: 120, borderRadius: "12px", ...goldShimmer }}
                />
              </Box>
            </Box>
          </Box>
        </Box>
      ))}
    </>
  );
};

// ----------------------
// Premium Blog Card Skeleton
// ----------------------
export const BlogCardSkeleton: React.FC<BlogCardSkeletonProps> = ({
  count = 1,
}) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <Box key={i} sx={{ perspective: "1200px", mb: 4 }}>
          <Box
            sx={{
              borderRadius: borderRadiusTokens.lg,
              overflow: "hidden",
              border: `1px solid #e5e7eb`,
              background: colorTokens.white,
              transformStyle: "preserve-3d",
              transition: "all 0.6s cubic-bezier(0.16,1,0.3,1)",
              boxShadow: "0 8px 24px rgba(12,14,18,0.06)",
              "&:hover": {
                transform: "rotateX(3deg) rotateY(-3deg) translateY(-5px)",
                boxShadow: "0 20px 40px rgba(12,14,18,0.12)",
              },
            }}
          >
            {/* Image */}
            <Box sx={{ height: 220, ...goldShimmer }} />

            {/* Content */}
            <Box sx={{ p: 3 }}>
              <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                <Box sx={{ height: 24, width: 80, borderRadius: 1, ...goldShimmer }} />
                <Box sx={{ height: 24, width: 80, borderRadius: 1, ...goldShimmer }} />
              </Box>
              <Box sx={{ height: 32, width: "85%", mb: 1, borderRadius: 1, ...goldShimmer }} />
              <Box sx={{ height: 18, width: "100%", mb: 1, borderRadius: 1, ...goldShimmer }} />
              <Box sx={{ height: 18, width: "70%", mb: 3, borderRadius: 1, ...goldShimmer }} />

              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    ...goldShimmer,
                  }}
                />
                <Box sx={{ height: 18, width: 100, borderRadius: 1, ...goldShimmer }} />
              </Box>
            </Box>
          </Box>
        </Box>
      ))}
    </>
  );
};

// ----------------------
// Template Skeleton Grid
// ----------------------
export const TemplateSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Box key={i} sx={{ height: 36, width: 90, borderRadius: "999px", ...goldShimmer }} />
        ))}
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
          },
          gap: 3,
        }}
      >
        <CardSkeleton count={count} />
      </Box>
    </Box>
  );
};