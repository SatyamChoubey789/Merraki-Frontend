"use client";

import { Box, Container, Typography } from "@mui/material";
import { keyframes } from "@mui/system";

const T = {
  white: "#FFFFFF",
  offwhite: "#F9F8F5",
  cream: "#F0EDE6",
  parchment: "#E8E4DA",
  border: "#E2DED5",
  ink: "#0C0E12",
  inkFaint: "#94A3B8",
  gold: "#B8922A",
  goldGlow: "rgba(184,146,42,0.06)",
};

const fadeSlide = keyframes`
  0% { opacity: 0; transform: translateY(8px); }
  100% { opacity: 1; transform: translateY(0px); }
`;

export default function CalculatorsLoading() {
  return (
    <Box sx={{ minHeight: "100vh", background: T.offwhite }}>

      {/* HEADER */}
      <Box
        sx={{
          position: "relative",
          background: T.white,
          borderBottom: `1px solid ${T.border}`,
          pt: { xs: 14, md: 18 },
          pb: 12,
          overflow: "hidden",
        }}
      >
        {/* Soft grid */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundImage: `
              linear-gradient(${T.border} 1px, transparent 1px),
              linear-gradient(90deg, ${T.border} 1px, transparent 1px)
            `,
            backgroundSize: "72px 72px",
            opacity: 0.28,
            pointerEvents: "none",
          }}
        />

        {/* Gold atmosphere */}
        <Box
          sx={{
            position: "absolute",
            width: "70vw",
            height: "50vw",
            top: "-30vw",
            left: "15vw",
            borderRadius: "50%",
            background: `radial-gradient(ellipse, ${T.goldGlow} 0%, transparent 70%)`,
            pointerEvents: "none",
          }}
        />

        {/* Ghost sigma */}
        <Box
          sx={{
            position: "absolute",
            right: { xs: -40, md: -80 },
            bottom: -100,
            fontFamily: '"Instrument Serif", serif',
            fontSize: { xs: "42vw", md: "28vw" },
            fontStyle: "italic",
            color: "rgba(12,14,18,0.022)",
            lineHeight: 1,
            userSelect: "none",
          }}
        >
          ∑
        </Box>

        <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1 }}>

          {/* Mono System Label */}
          <Typography
            sx={{
              fontFamily: '"DM Mono", monospace',
              fontSize: "0.6rem",
              letterSpacing: "0.18em",
              color: T.inkFaint,
              textTransform: "uppercase",
              mb: 6,
              animation: `${fadeSlide} 0.6s ease forwards`,
            }}
          >
            Initializing financial models…
          </Typography>

          {/* Editorial Headline Blocks */}
          <Box sx={{ mb: 6 }}>
            <Box
              sx={{
                height: { xs: 60, md: 96 },
                width: "60%",
                background: T.parchment,
                borderRadius: "6px",
                mb: 2,
                animation: `${fadeSlide} 0.8s ease forwards`,
              }}
            />
            <Box
              sx={{
                height: { xs: 60, md: 96 },
                width: "48%",
                background: T.parchment,
                borderRadius: "6px",
                animation: `${fadeSlide} 1s ease forwards`,
              }}
            />
          </Box>

          {/* Subline */}
          <Box
            sx={{
              height: 18,
              width: "35%",
              background: T.cream,
              borderRadius: "4px",
              animation: `${fadeSlide} 1.2s ease forwards`,
            }}
          />

        </Container>
      </Box>

      {/* TAB ROW (Editorial Placeholder) */}
      <Box
        sx={{
          background: T.white,
          borderBottom: `1px solid ${T.border}`,
          px: { xs: 3, md: 6 },
          py: 3,
          display: "flex",
          gap: 4,
        }}
      >
        {[1, 2, 3, 4].map((i) => (
          <Box
            key={i}
            sx={{
              height: 36,
              width: 150,
              borderRadius: "12px 12px 0 0",
              background: T.cream,
            }}
          />
        ))}
      </Box>

      {/* PANEL AREA */}
      <Box
        sx={{
          background: T.white,
          position: "relative",
        }}
      >
        {/* Accent spine */}
        <Box
          sx={{
            position: "absolute",
            left: 0,
            top: 0,
            width: "2px",
            height: "100%",
            background: T.gold,
            opacity: 0.55,
          }}
        />

        <Container maxWidth="xl" sx={{ py: 10 }}>
          <Box
            sx={{
              height: 420,
              borderRadius: "16px",
              border: `1px solid ${T.border}`,
              background: T.offwhite,
            }}
          />
        </Container>
      </Box>

    </Box>
  );
}