"use client";

import { Box, Typography, Button } from "@mui/material";
import Link from "next/link";

const SANS = `"DM Sans","Mona Sans",system-ui,sans-serif`;

export function FractionalCFOSection() {
  return (
    <Box
      sx={{
        pt: 0,
        pb: { xs: 4, md: 6 },
        px: { xs: 1, md: 2 },
        background: "#f5f7fb",
        mt: { xs: -4, md: -10 }, // slightly safer on mobile
      }}
    >
      {/* CARD */}
      <Box
        sx={{
          position: "relative",
          minHeight: { xs: "auto", md: "90vh" }, // 🔥 FIX
          height: { md: "90vh" }, // keep desktop same
          maxWidth: "1400px",
          mx: "auto",
          borderRadius: "20px",
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
        }}
      >
        {/* IMAGE */}
        <Box
          component="img"
          src="https://res.cloudinary.com/dalsvy7qk/image/upload/v1778273832/mountain_lk8xc5.jpg"
          alt="mountain"
          sx={{
            position: "absolute",
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "brightness(0.85) contrast(1.05)",
          }}
        />

        {/* OVERLAY */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.1) 60%, transparent 100%)",
          }}
        />

        {/* CONTENT */}
        <Box
          sx={{
            position: "relative",
            zIndex: 2,
            height: "100%",
            px: { xs: 2, md: 6 }, // 🔥 tighter on mobile
            py: { xs: 6, md: 0 }, // 🔥 prevents overflow

            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <Typography
            sx={{
              fontFamily: SANS,
              fontWeight: 700,
              fontSize: { xs: "1.6rem", md: "2.8rem" }, // 🔥 slight scale fix
              color: "#253957",
              mb: 2,
            }}
          >
            What is a FRACTIONAL CFO?
          </Typography>

          <Typography
            sx={{
              fontFamily: SANS,
              fontSize: { xs: "0.9rem", md: "1rem" },
              color: "#253957",
              maxWidth: 700,
              lineHeight: 1.7,
              mb: 2,
            }}
          >
            A Fractional CFO is your strategic financial partner — they bring
            clarity to your numbers, structure to your decisions, and direction
            to your growth
          </Typography>

          <Typography
            sx={{
              fontFamily: SANS,
              fontSize: { xs: "0.9rem", md: "1rem" },
              color: "#253957",
              maxWidth: 700,
              lineHeight: 1.7,
              mb: { xs: 4, md: 6 }, // 🔥 responsive gap
            }}
          >
            Most founders don’t need a full-time CFO. They need the right one —
            at the right time.
          </Typography>

          {/* SERVICES */}
          <Box
            sx={{
              display: "flex",
              gap: { xs: 2, md: 6 }, // 🔥 smaller gap mobile
              flexWrap: "wrap",
              justifyContent: "center",
              mb: { xs: 6, md: 8 }, // 🔥 avoid button overlap
            }}
          >
            {[
              {
                label: "Financial Forecasting",
                icon: "https://res.cloudinary.com/dalsvy7qk/image/upload/v1778273916/forecasting_gqvhed.svg",
              },
              {
                label: "Revenue Enhancement",
                icon: "https://res.cloudinary.com/dalsvy7qk/image/upload/v1778273918/revenue_v047kf.svg",
              },
              {
                label: "Cash Flow Management",
                icon: "https://res.cloudinary.com/dalsvy7qk/image/upload/v1778273916/cashflow_gqf9tk.svg",
              },
              {
                label: "Risk Assessment",
                icon: "https://res.cloudinary.com/dalsvy7qk/image/upload/v1778273918/risk_khdp4q.svg",
              },
              {
                label: "Financial Planning & Analysis",
                icon: "https://res.cloudinary.com/dalsvy7qk/image/upload/v1778273916/analysis_hrr9ml.svg",
              },
            ].map((item, i) => (
              <Box
                key={i}
                sx={{
                  textAlign: "center",
                  width: { xs: "40%", sm: 120 }, // 🔥 FIX wrapping
                  transition: "all 0.25s ease",

                  "&:hover": {
                    transform: "translateY(-6px)",
                  },
                }}
              >
                <Box
                  component="img"
                  src={item.icon}
                  alt={item.label}
                  sx={{
                    width: { xs: 28, md: 36 },
                    height: { xs: 28, md: 36 },
                    mb: 1,
                  }}
                />

                <Typography
                  sx={{
                    fontFamily: SANS,
                    fontSize: { xs: "0.7rem", md: "0.8rem" },
                    color: "#253957",
                  }}
                >
                  {item.label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* BUTTON */}
        <Button
          component={Link} // 🔥 FIX (was "a")
          href="/pricing"
          sx={{
            position: "absolute",
            zIndex: 3, // 🔥 ensures clickable
            bottom: { xs: 16, md: 40 },
            left: { xs: 16, md: 50 },

            textTransform: "none",
            borderRadius: 0,
            border: "1px solid black",
            color: "#253957",
            px: 3,
            py: 1.2,
            fontSize: "0.8rem",
            letterSpacing: "0.08em",

            "&:hover": {
              background: "#253957",
              color: "#fff",
            },
          }}
        >
          CHECK OUR PLANS
        </Button>
      </Box>
    </Box>
  );
}

export default FractionalCFOSection;
