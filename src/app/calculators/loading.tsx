"use client";

import { Box, Container } from "@mui/material";
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

const fadeSlide = keyframes`
  0%   { opacity: 0; transform: translateY(8px); }
  100% { opacity: 1; transform: translateY(0px); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.45; }
`;

export default function CalculatorsLoading() {
  return (
    <Box sx={{
      minHeight: "100vh",
      background: `linear-gradient(135deg, ${T.bluePale} 0%, ${T.bgSection} 50%, ${T.bluePale} 100%)`,
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

      {/* HEADER */}
      <Box sx={{
        position: "relative",
        background: T.bg,
        borderBottom: `1px solid ${T.border}`,
        pt: { xs: 14, md: 18 },
        pb: 12,
        overflow: "hidden",
        zIndex: 1,
      }}>
        <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1 }}>

          {/* Headline skeleton */}
          <Box sx={{ mb: 6 }}>
            <Box sx={{
              height: { xs: 56, md: 88 },
              width: "58%",
              background: T.blueDim,
              borderRadius: "10px",
              mb: 2,
              animation: `${fadeSlide} 0.7s ease forwards, ${pulse} 2s ease-in-out 0.7s infinite`,
            }} />
            <Box sx={{
              height: { xs: 56, md: 88 },
              width: "44%",
              background: T.blueDim,
              borderRadius: "10px",
              animation: `${fadeSlide} 0.9s ease forwards, ${pulse} 2s ease-in-out 0.9s infinite`,
            }} />
          </Box>

          {/* Subline skeleton */}
          <Box sx={{
            height: 18,
            width: "32%",
            background: T.blueDim,
            borderRadius: "6px",
            animation: `${fadeSlide} 1.1s ease forwards, ${pulse} 2s ease-in-out 1.1s infinite`,
          }} />

        </Container>
      </Box>

      {/* TAB ROW */}
      <Box sx={{
        background: T.bg,
        borderBottom: `1px solid ${T.border}`,
        px: { xs: 3, md: 6 },
        py: 3,
        display: "flex",
        gap: 2,
        position: "relative",
        zIndex: 1,
      }}>
        {[140, 120, 160, 130].map((w, i) => (
          <Box key={i} sx={{
            height: 36,
            width: w,
            borderRadius: "10px 10px 0 0",
            background: T.blueDim,
            animation: `${pulse} 2s ease-in-out ${i * 0.15}s infinite`,
          }} />
        ))}
      </Box>

      {/* PANEL AREA */}
      <Box sx={{
        background: T.bg,
        position: "relative",
        zIndex: 1,
        borderLeft: `2px solid rgba(59,123,246,0.22)`,
      }}>
        <Container maxWidth="xl" sx={{ py: 10 }}>
          <Box sx={{
            height: 420,
            borderRadius: "18px",
            border: `1px solid ${T.borderMid}`,
            background: T.bgSection,
            animation: `${pulse} 2.2s ease-in-out infinite`,
            boxShadow: `0 4px 24px ${T.blueGlow}`,
          }} />
        </Container>
      </Box>

    </Box>
  );
}