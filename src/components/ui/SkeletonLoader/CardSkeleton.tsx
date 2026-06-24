"use client";

import React from "react";
import { Box } from "@mui/material";
import { keyframes } from "@mui/system";

/* ══ TOKENS — exact FinalCTA theme ══════════════════════ */
const T = {
  bg:        "#FFFFFF",
  bgSection: "#F5F7FB",
  border:    "rgba(10,10,20,0.08)",
  borderMid: "rgba(10,10,20,0.14)",
  blueDim:   "rgba(59,123,246,0.06)",
  blueGlow:  "rgba(59,123,246,0.18)",
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

/* ── Types ── */
interface CardSkeletonProps    { count?: number; height?: number; }
interface BlogCardSkeletonProps { count?: number; }

/* ══ CARD SKELETON ═══════════════════════════════════════ */
export const CardSkeleton: React.FC<CardSkeletonProps> = ({ count = 1, height = 380 }) => (
  <>
    {Array.from({ length: count }).map((_, i) => (
      <Box key={i} sx={{ mb: 4 }}>
        <Box sx={{
          borderRadius: "18px",
          overflow: "hidden",
          border: `1px solid ${T.borderMid}`,
          background: T.bg,
          boxShadow: `0 4px 24px ${T.blueGlow}`,
        }}>
          {/* Image surface */}
          <Box sx={{ height: height * 0.6, position: "relative", ...blueShimmer }}>
            <Box sx={{
              position: "absolute", inset: 0,
              background: "linear-gradient(120deg, rgba(255,255,255,0.08) 0%, transparent 60%)",
            }} />
          </Box>

          {/* Text placeholders */}
          <Box sx={{ p: 3 }}>
            <Box sx={{ height: 20, width: "70%", mb: 2, borderRadius: "6px", ...blueShimmer }} />
            <Box sx={{ height: 16, width: "90%", mb: 1, borderRadius: "6px", ...blueShimmer }} />
            <Box sx={{ height: 16, width: "60%", mb: 3, borderRadius: "6px", background: T.blueDim }} />

            {/* Tag pills */}
            <Box sx={{ display: "flex", gap: 1.5 }}>
              <Box sx={{ height: 28, width: 80, borderRadius: "100px", ...blueShimmer }} />
              <Box sx={{ height: 28, width: 100, borderRadius: "100px", background: T.blueDim }} />
            </Box>

            {/* Bottom action */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 3.5 }}>
              <Box sx={{ height: 24, width: 80, borderRadius: "6px", ...blueShimmer }} />
              <Box sx={{ height: 42, width: 120, borderRadius: "12px", ...blueShimmer }} />
            </Box>
          </Box>
        </Box>
      </Box>
    ))}
  </>
);

/* ══ BLOG CARD SKELETON ══════════════════════════════════ */
export const BlogCardSkeleton: React.FC<BlogCardSkeletonProps> = ({ count = 1 }) => (
  <>
    {Array.from({ length: count }).map((_, i) => (
      <Box key={i} sx={{ mb: 4 }}>
        <Box sx={{
          borderRadius: "18px",
          overflow: "hidden",
          border: `1px solid ${T.borderMid}`,
          background: T.bg,
          boxShadow: `0 4px 24px ${T.blueGlow}`,
        }}>
          {/* Image */}
          <Box sx={{ height: 220, ...blueShimmer }} />

          {/* Content */}
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
              <Box sx={{ height: 22, width: 80, borderRadius: "6px", ...blueShimmer }} />
              <Box sx={{ height: 22, width: 80, borderRadius: "6px", background: T.blueDim }} />
            </Box>
            <Box sx={{ height: 28, width: "85%", mb: 1, borderRadius: "6px", ...blueShimmer }} />
            <Box sx={{ height: 16, width: "100%", mb: 1, borderRadius: "6px", background: T.blueDim }} />
            <Box sx={{ height: 16, width: "70%", mb: 3, borderRadius: "6px", background: T.blueDim, opacity: 0.7 }} />

            {/* Author row */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Box sx={{ width: 36, height: 36, borderRadius: "50%", ...blueShimmer }} />
              <Box sx={{ height: 16, width: 100, borderRadius: "6px", background: T.blueDim }} />
            </Box>
          </Box>
        </Box>
      </Box>
    ))}
  </>
);

/* ══ TEMPLATE SKELETON GRID ══════════════════════════════ */
export const TemplateSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => (
  <Box sx={{ p: 3 }}>
    {/* Filter pills */}
    <Box sx={{ display: "flex", gap: 1.5, mb: 3, flexWrap: "wrap" }}>
      {[90, 80, 100, 85, 95].map((w, i) => (
        <Box key={i} sx={{
          height: 34, width: w, borderRadius: "100px",
          border: `1px solid ${T.border}`,
          background: i === 0 ? blueShimmer.background : T.bg,
          backgroundSize: "200% 100%",
          animation: i === 0 ? blueShimmer.animation : undefined,
        }} />
      ))}
    </Box>

    <Box sx={{
      display: "grid",
      gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" },
      gap: 3,
    }}>
      <CardSkeleton count={count} />
    </Box>
  </Box>
);