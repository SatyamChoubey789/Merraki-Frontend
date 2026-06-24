"use client";

import { Box, Typography, Button } from "@mui/material";
import Link from "next/link";

const SANS = `"DM Sans","Mona Sans",system-ui,sans-serif`;

export function QuickCheckSection() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        px: 3,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        transform: { xs: "translateY(-40px)", md: "translateY(-80px)" }, // 👈 shift up
        textAlign: "center",
        background: "#f5f7fb",
      }}
    >
      {/* ICON */}
      <Box sx={{ mb: 3 }}>
        <Box
          component="img"
          src="https://res.cloudinary.com/dalsvy7qk/image/upload/v1778273918/Quick_jq9osf.svg"
          alt="quick check"
          sx={{ width: 80, height: 80 }}
        />
      </Box>

      {/* HEADING */}
      <Typography
        sx={{
          fontFamily: SANS,
          fontWeight: 700,
          fontSize: { xs: "1.8rem", md: "2.6rem" },
          color: "#000",
          mb: 1,
          letterSpacing: "-0.5px",
        }}
      >
        QUICK CHECK:
      </Typography>

      <Typography
        sx={{
          fontFamily: SANS,
          fontWeight: 400,
          fontSize: { xs: "1.6rem", md: "2.4rem" },
          color: "#000",
          mb: 3,
          letterSpacing: "-0.5px",
        }}
      >
        Where your business is right now?
      </Typography>

      {/* SUBTEXT */}
      <Typography
        sx={{
          fontFamily: SANS,
          fontSize: "0.95rem",
          color: "#444",
          maxWidth: 500,
          mb: 4,
          lineHeight: 1.6,
        }}
      >
        Take our two-minute quiz to see where your business stands.
        <br />
        You’ll receive a financial health scorecard with strategic next steps.
      </Typography>

      {/* BUTTON */}
      <Button
        component={Link}
        href="/founder-test"
        variant="outlined"
        sx={{
          textTransform: "none",
          borderRadius: 0,
          borderColor: "#000",
          color: "#000",
          width: 200,
          height: 50,
          fontSize: "0.8rem",
          letterSpacing: "0.08em",
          "&:hover": {
            background: "#000",
            color: "#fff",
          },
        }}
      >
        TAKE THE TEST
      </Button>
    </Box>
  );
}

export default QuickCheckSection;