"use client";

import { Box, Typography, Button } from "@mui/material";
import Link from "next/link";

const SANS = `"DM Sans","Mona Sans",system-ui,sans-serif`;

const PLANS = [
  {
    title: "Launch Control",
    icon: "https://res.cloudinary.com/dalsvy7qk/image/upload/v1778273917/Launch_cagwvb.svg",
    features: [
      "Clean financial system setup",
      "Monthly P&L + cash summary",
      "Basic dashboard",
      "Expense & cash tracking",
      "Runway visibility",
      "1 monthly call",
    ],
  },
  {
    title: "Growth Engine",
    icon: "https://res.cloudinary.com/dalsvy7qk/image/upload/v1778273917/eng_vxydcb.svg",
    popular: true,
    features: [
      "Everything in Launch Control",
      "Detailed MIS with insights",
      "Cash flow forecasting",
      "Budgeting & tracking",
      "Revenue & cost analysis",
      "Custom dashboard",
      "2 strategy calls per month",
    ],
  },
  {
    title: "CFO Partner",
    icon: "https://res.cloudinary.com/dalsvy7qk/image/upload/v1778273916/cfo_v4ddqt.svg",
    features: [
      "Everything in Growth Engine",
      "3–5 year projections",
      "Scenario modelling",
      "Fundraising support",
      "Strategic financial guidance",
      "Advanced KPIs & dashboards",
      "Weekly involvement",
    ],
  },
];

export function PricingSection() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        py: 8,
        px: 3,
        background: "#f5f7fb",
        position: "relative",
        overflow: "hidden",

        "&::before": {
          content: '""',
          position: "absolute",
          top: "18%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "900px",
          height: "900px",
          background:
            "radial-gradient(circle, rgba(37,57,87,0.08) 0%, rgba(37,57,87,0.03) 35%, transparent 72%)",
          pointerEvents: "none",
          zIndex: 0,
        },

        "& > *": {
          position: "relative",
          zIndex: 1,
        },
      }}
    >
      {/* HEADING */}
      <Box sx={{ textAlign: "center", mb: 7 }}>
        <Typography
          sx={{
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: { xs: "2rem", md: "3.2rem" },
            color: "#253957",
            lineHeight: 1.15,
            display: "block",
          }}
        >
          Let&apos;s climb together
        </Typography>

        <Typography
          sx={{
            fontFamily: SANS,
            fontWeight: 400,
            fontSize: { xs: "1.8rem", md: "2.9rem" },
            color: "#253957",
            lineHeight: 1.2,
            display: "block",
          }}
        >
          with our monthly plans
        </Typography>
      </Box>

      {/* CARDS ROW */}
      <Box
        sx={{
          display: "flex",
          gap: { xs: 4, md: "40px" },
          justifyContent: "center",
          flexWrap: "wrap",
          alignItems: "stretch",
        }}
      >
        {PLANS.map((plan, i) => (
          <Box
            key={i}
            sx={{
              position: "relative",
              width: { xs: "100%", sm: "300px" },
              maxWidth: "320px",
              display: "flex",
              flexDirection: "column",

              transition:
                "transform 0.32s cubic-bezier(0.22,1,0.36,1), filter 0.32s ease",

              filter: "brightness(1)",

              "&:hover": {
                transform: "translateY(-8px)",
                filter: "brightness(1.01)",
              },

              "&:hover .pricing-card": {
                boxShadow:
                  "0 30px 80px rgba(37,57,87,0.18), 0 12px 30px rgba(0,0,0,0.10)",
              },

              "&:hover .icon-badge": {
                transform: "translateY(-2px)",
                boxShadow:
                  "0 16px 32px rgba(37,57,87,0.20), 0 4px 10px rgba(0,0,0,0.06)",
              },

              "&:hover img": {
                transform: "scale(1.06)",
              },
            }}
          >
            {/* ICON BADGE */}
            <Box
              className="icon-badge"
              sx={{
                width: 70,
                height: 70,
                background: "#253957",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: "-35px",
                position: "relative",
                zIndex: 2,

                transition:
                  "transform 0.32s cubic-bezier(0.22,1,0.36,1), box-shadow 0.32s ease",

                boxShadow: "0 6px 18px rgba(37,57,87,0.10)",
              }}
            >
              <Box
                component="img"
                src={plan.icon}
                alt="icon"
                sx={{
                  width: 36,
                  height: 36,
                  transition: "transform 0.28s ease",
                  willChange: "transform",
                }}
              />
            </Box>

            {/* CARD */}
            <Box
              className="pricing-card"
              sx={{
                pt: "52px",
                pb: "24px",
                px: "24px",
                border: "1.5px solid #253957",
                borderRadius: 0,
                background: "#fff",
                position: "relative",
                overflow: "hidden",
                flex: 1,
                display: "flex",
                flexDirection: "column",
                transition: "all 0.28s ease",

                boxShadow:
                  "0 6px 20px rgba(0,0,0,0.06), 0 12px 30px rgba(37,57,87,0.10)",

                "&::after": {
                  content: '""',
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to bottom right, rgba(255,255,255,0.25), transparent 40%)",
                  pointerEvents: "none",
                },
              }}
            >
              {/* POPULAR RIBBON */}
              {plan.popular && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 16,
                    right: -28,
                    width: 130,
                    height: 28,
                    background:
                      "linear-gradient(135deg, #b8921a, #d4af37, #e2c045)",
                    color: "#1a1000",
                    fontSize: "0.58rem",
                    fontWeight: 800,
                    letterSpacing: "0.14em",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transform: "rotate(45deg)",
                    transformOrigin: "center",
                    zIndex: 10,
                  }}
                >
                  POPULAR
                </Box>
              )}

              {/* TITLE */}
              <Typography
                sx={{
                  textAlign: "center",
                  fontFamily: SANS,
                  fontWeight: 700,
                  fontSize: "1.2rem",
                  mb: "16px",
                  color: "#253957",
                  lineHeight: 1.2,
                  transition: "color 0.25s ease",
                }}
              >
                {plan.title}
              </Typography>

              {/* FEATURES */}
              <Box
                component="ul"
                sx={{
                  pl: "20px",
                  m: 0,
                  flex: 1,
                  listStyle: "disc",

                  "& li": {
                    fontFamily: SANS,
                    fontSize: "0.9rem",
                    color: "#111",
                    lineHeight: 1.5,
                    marginBottom: "2px",
                    padding: 0,
                    transition: "transform 0.2s ease, color 0.2s ease",
                  },

                  "& li:hover": {
                    transform: "translateX(2px)",
                    color: "#253957",
                  },

                  "& li:last-child": {
                    marginBottom: 0,
                  },
                }}
              >
                {plan.features.map((f, idx) => (
                  <li key={idx}>{f}</li>
                ))}
              </Box>
            </Box>
          </Box>
        ))}
      </Box>

      {/* CTA BUTTON */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          mt: 4,
          width: "100%",
          maxWidth: "1020px",
          mx: "auto",
          px: 1,
        }}
      >
        <Button
          component={Link}
          href="/pricing"
          variant="outlined"
          sx={{
            borderColor: "#253957",
            borderWidth: "1.5px",
            borderRadius: 0,
            color: "#253957",
            textTransform: "none",
            px: 4,
            py: 1.1,
            fontSize: "0.82rem",
            fontFamily: SANS,
            fontWeight: 600,
            letterSpacing: "0.1em",

            transition:
              "transform 0.25s cubic-bezier(0.22,1,0.36,1), box-shadow 0.25s ease, background 0.25s ease",

            boxShadow:
              "0 6px 16px rgba(37,57,87,0.06), 0 2px 4px rgba(0,0,0,0.03)",

            "&:hover": {
              background: "#253957",
              color: "#fff",
              borderColor: "#253957",
              transform: "translateY(-3px)",

              boxShadow:
                "0 18px 40px rgba(37,57,87,0.18), 0 6px 12px rgba(0,0,0,0.06)",
            },
          }}
        >
          OUR PRICING →
        </Button>
      </Box>
    </Box>
  );
}

export default PricingSection;
