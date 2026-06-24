"use client";

import Image from "next/image";
import { Box, Typography } from "@mui/material";

const SANS = `"DM Sans","Mona Sans",system-ui,sans-serif`;

export default function GlobalTrustSection() {
  return (
    <Box
      component="section"
      sx={{
        py: { xs: 8, md: 10 },
        px: 3,
        textAlign: "center",
        background: "#F5F7FB",
        overflow: "hidden",
      }}
    >
      {/* Heading */}
      <Typography
        component="h2"
        sx={{
          fontFamily: SANS,
          fontWeight: 800,
          color: "#253957",
          letterSpacing: "-0.04em",
          lineHeight: 1.05,
          whiteSpace: "nowrap",
          fontSize: {
            xs: "2rem",
            sm: "2.75rem",
            md: "4rem",
            lg: "5rem",
          },
        }}
      >
        Trusted by founders across the globe
      </Typography>

      {/* Subtitle */}
      <Typography
        sx={{
          mt: 2,
          color: "#253957",
          opacity: 0.85,
          fontFamily: SANS,
          fontWeight: 500,
          fontSize: {
            xs: "1rem",
            md: "1.35rem",
          },
        }}
      >
        Merraki has helped 300+ founders with their financial decisions
      </Typography>

      {/* Small Gap */}
      <Box sx={{ height: { xs: 32, md: 48 } }} />

      {/* World Map */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: {
              xs: 700,
              sm: 850,
              md: 800,
              lg: 1100,
            },
          }}
        >
          <Image
            src="/world-map.svg"
            alt="Global Founder Network"
            width={1200}
            height={600}
            priority
            draggable={false}
            style={{
              width: "100%",
              height: "auto",
              display: "block",
              userSelect: "none",
              pointerEvents: "none",
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}