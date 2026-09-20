"use client";

import { Box, Typography, Button } from "@mui/material";
import Link from "next/link";

const SANS = `"DM Sans","Mona Sans",system-ui,sans-serif`;

export function FinalCTA() {
  return (
    <Box
      sx={{
        pt: 0,

        /*
         * Desktop remains exactly as before.
         * Only smaller screens get adjusted.
         */
        pb: {
          xs: 3,
          sm: 4,
          md: 6,
        },

        px: {
          xs: 1,
          sm: 1.5,
          md: 2,
        },

        background: "#f5f7fb",

        width: "100%",
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      {/* CARD */}
      <Box
        sx={{
          position: "relative",

          /*
           * DESKTOP: unchanged
           */
          height: {
            xs: "clamp(420px, 70svh, 600px)",
            sm: "clamp(460px, 75svh, 680px)",
            md: "90vh",
          },

          maxWidth: "1400px",

          mx: "auto",

          borderRadius: "20px",

          overflow: "hidden",

          boxShadow:
            "0 20px 60px rgba(0,0,0,0.08)",

          display: "flex",
          alignItems: "flex-start",

          /*
           * Prevent accidental width overflow
           * on narrow devices.
           */
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        {/* IMAGE */}
        <Box
          component="img"
          src="https://res.cloudinary.com/dalsvy7qk/image/upload/v1778273782/cta-bg_pvajid.jpg"
          alt="cta"
          sx={{
            position: "absolute",

            inset: 0,

            width: "100%",
            height: "100%",

            objectFit: "cover",

            /*
             * Desktop image remains unchanged.
             */
            objectPosition: {
              xs: "center center",
              sm: "center center",
              md: "center center",
            },

            filter: "brightness(0.82)",

            display: "block",
          }}
        />

        {/* OVERLAY */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,

            /*
             * Desktop: EXACTLY your original overlay.
             *
             * Mobile/tablet gets a slightly stronger
             * overlay for text readability.
             */
            background: {
              xs: `
                linear-gradient(
                  180deg,
                  rgba(255,255,255,0.20) 0%,
                  rgba(255,255,255,0.20) 40%,
                  rgba(255,255,255,0.48) 100%
                )
              `,

              sm: `
                linear-gradient(
                  90deg,
                  rgba(255,255,255,0.38) 0%,
                  rgba(255,255,255,0.15) 65%,
                  transparent 100%
                )
              `,

              md:
                "linear-gradient(90deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.12) 55%, transparent 100%)",
            },
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

            /*
             * MOBILE
             */
            justifyContent: {
              xs: "center",
              sm: "flex-end",
              md: "flex-end",
            },

            alignItems: "flex-start",

            /*
             * DESKTOP: EXACTLY YOUR ORIGINAL VALUES
             */
            px: {
              xs: 2,
              sm: 3,
              md: 6,
            },

            pt: {
              xs: 0,
              sm: 7,
              md: 12,
            },

            boxSizing: "border-box",
          }}
        >
          {/* TEXT BLOCK */}
          <Box
            sx={{
              width: "100%",

              /*
               * Desktop unchanged.
               */
              maxWidth: {
                xs: 340,
                sm: 480,
                md: 540,
              },

              display: "flex",

              flexDirection: "column",

              alignItems: {
                xs: "center",
                sm: "flex-end",
                md: "flex-end",
              },

              textAlign: {
                xs: "center",
                sm: "right",
                md: "right",
              },

              /*
               * Mobile vertical positioning.
               * Desktop remains controlled by pt above.
               */
              mt: {
                xs: 0,
                sm: 0,
                md: 0,
              },
            }}
          >
            {/* HEADING */}
            <Typography
              sx={{
                fontFamily: SANS,

                fontWeight: 700,

                /*
                 * Desktop EXACTLY unchanged.
                 */
                fontSize: {
                  xs: "1.8rem",
                  sm: "2.25rem",
                  md: "3.2rem",
                },

                color: "#253957",

                lineHeight: {
                  xs: 1.12,
                  sm: 1.08,
                  md: 1.05,
                },

                mb: {
                  xs: 2,
                  sm: 2,
                  md: 2,
                },

                letterSpacing: "-0.5px",

                /*
                 * Never force mobile text onto one line.
                 */
                whiteSpace: "normal",

                width: "100%",
              }}
            >
              Ready to amplify your finances?
            </Typography>

            {/* BUTTON */}
            <Button
              component={Link}
              href="/book-consultation"
              sx={{
                textTransform: "none",

                borderRadius: "6px",

                background: "#253957",

                color: "#fff",

                /*
                 * Desktop EXACTLY unchanged.
                 */
                px: {
                  xs: 2.5,
                  sm: 3,
                  md: 4,
                },

                py: {
                  xs: 1.2,
                  sm: 1.3,
                  md: 1.4,
                },

                fontSize: {
                  xs: "0.72rem",
                  sm: "0.82rem",
                  md: "0.9rem",
                },

                letterSpacing: "0.03em",

                minHeight: {
                  xs: 44,
                  sm: 46,
                  md: "auto",
                },

                width: {
                  xs: "100%",
                  sm: "auto",
                  md: "auto",
                },

                maxWidth: {
                  xs: 300,
                  sm: "none",
                  md: "none",
                },

                whiteSpace: "normal",

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
