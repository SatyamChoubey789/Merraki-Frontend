"use client";

import { Box, Typography, Button } from "@mui/material";
import Link from "next/link";

const SANS = `"DM Sans","Mona Sans",system-ui,sans-serif`;

export function HeroSection() {
  return (
    <Box
      sx={{
        pb: { xs: 2, md: 4 },
        px: { xs: 1, md: 2 },
        background: "#f5f7fb",
      }}
    >
      <Box
        sx={{
          position: "relative",
          height: { xs: "75dvh", md: "85vh" }, // ✅ responsive fix
          minHeight: { xs: "520px", md: "unset" }, // ✅ prevents squish
          maxWidth: "1400px",
          mx: "auto",
          borderRadius: "20px",
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
          display: "flex",
          alignItems: "center",
        }}
      >
        {/* VIDEO */}
        <Box
          component="video"
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          src="https://res.cloudinary.com/dalsvy7qk/video/upload/v1778274063/mountain_irknfm.mp4"
          sx={{
            position: "absolute",
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />

        {/* CONTENT */}
        <Box
          sx={{
            position: "relative",
            zIndex: 2,
            width: "100%",
            px: { xs: 2.5, sm: 3, md: 6 }, // ✅ responsive padding
          }}
        >
          <Box maxWidth={750}>
            <Typography
              sx={{
                fontFamily: SANS,
                fontWeight: 400,
                fontSize: { xs: "1.8rem", sm: "2.3rem", md: "3.2rem" }, // ✅ smoother scaling
                lineHeight: 1.05,
                letterSpacing: "-0.5px",
                color: "#253957",
                mt: { xs: -2, sm: -3, md: -5 }, // ✅ safer spacing
              }}
            >
              A{" "}
              <Box component="span" sx={{ fontWeight: 800 }}>
                Fractional CFO
              </Box>{" "}
              Partner To
            </Typography>

            <Typography
              sx={{
                fontFamily: SANS,
                fontWeight: 400,
                fontSize: { xs: "1.8rem", sm: "2.3rem", md: "3.2rem" }, // ✅ smoother scaling
                lineHeight: 1.05,
                letterSpacing: "-0.5px",
                color: "#253957",
                mb: 2,
              }}
            >
              Take Your Business{" "}
              <Box component="span" sx={{ fontWeight: 800 }}>
                UPWARD
              </Box>
            </Typography>

            <Typography
              sx={{
                fontFamily: SANS,
                fontSize: "1rem",
                color: "rgba(37,57,87,0.8)",
                mb: 4,
                lineHeight: 1.6,
              }}
            >
              From Chaos to Clarity — We Map Your Financial Summit.
            </Typography>

            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexDirection: { xs: "column", sm: "row" }, // ✅ stack on mobile
                alignItems: { xs: "stretch", sm: "center" },
              }}
            >
              <Button
                component={Link}
                href="/about"
                variant="outlined"
                sx={{
                  color: "#253957",
                  borderColor: "#253957",
                  textTransform: "none",
                  borderRadius: 0,
                }}
              >
                Learn More
              </Button>

              <Button
                component={Link}
                href="/book-consultation"
                sx={{
                  background: "#253957",
                  color: "#fff",
                  textTransform: "none",
                  borderRadius: 0,
                  "&:hover": {
                    background: "#1e2f47",
                  },
                }}
              >
                Book a Free Consultation Call
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default HeroSection;