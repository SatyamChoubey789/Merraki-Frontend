"use client";

import { Box, Typography, Button } from "@mui/material";
import Link from "next/link";

const SANS = `"DM Sans","Mona Sans",system-ui,sans-serif`;

export function FinalCTA() {
  return (
    <Box
      sx={{
        pt: 0,
        pb: { xs: 4, md: 6 },
        px: { xs: 1, md: 2 },
        background: "#f5f7fb",
      }}
    >
      {/* CARD */}
      <Box
        sx={{
          position: "relative",
          height: { xs: "80vh", md: "90vh" },
          maxWidth: "1400px",
          mx: "auto",
          borderRadius: "20px",
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
          display: "flex",
          alignItems: "flex-start",
        }}
      >
        {/* IMAGE */}
        <Box
          component="img"
          src="https://res.cloudinary.com/dalsvy7qk/image/upload/v1778273782/cta-bg_pvajid.jpg"
          alt="cta"
          sx={{
            position: "absolute",
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "brightness(0.82)", // slightly stronger for text clarity
          }}
        />

        {/* OVERLAY */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.12) 55%, transparent 100%)",
          }}
        />

        {/* CONTENT */}
        <Box
          sx={{
            position: "relative",
            zIndex: 2,
            width: "100%",
            height: "100%",

            display: "flex",
            justifyContent: "flex-end",
            alignItems: "flex-start",

            px: { xs: 3, md: 6 },
            pt: { xs: 8, md: 12 }, // 🔥 moved slightly UP for premium balance
          }}
        >
          {/* TEXT BLOCK */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              textAlign: "right",
              maxWidth: 540,
            }}
          >
            <Typography
              sx={{
                fontFamily: SANS,
                fontWeight: 700,
                fontSize: { xs: "2rem", md: "3.2rem" },
                color: "#253957",
                lineHeight: 1.05,
                mb: 2,
                letterSpacing: "-0.5px",
                whiteSpace: { xs: "normal", md: "nowrap" },
              }}
            >
              Ready to amplify your finances?
            </Typography>

            <Button
              component={Link}
              href="/book-consultation"
              sx={{
                textTransform: "none",
                borderRadius: "6px",
                background: "#253957",
                color: "#fff",
                px: 4,
                py: 1.4,
                fontSize: "0.9rem",
                letterSpacing: "0.03em",

                "&:hover": {
                  background: "#1e2f47",
                  transform: "translateY(-1px)",
                },
              }}
            >
              BOOK A FREE CONSULTATION CALL
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default FinalCTA;
