"use client";

import { Box, Container, Typography } from "@mui/material";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowBack as BackIcon } from "@mui/icons-material";
import { T, SANS, EASE } from "./Calcshared";

interface CalcPageLayoutProps {
  title: string;
  description: string;
  accent: string;
  children: React.ReactNode;
  tags?: string[];
}

export function CalcPageLayout({
  title,
  description,
  accent,
  children,
  tags,
}: CalcPageLayoutProps) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        fontFamily: SANS,
        background: `linear-gradient(135deg, ${T.bluePale} 0%, ${T.bgSection} 50%, ${T.bluePale} 100%)`,
      }}
    >
      {/* Ambient blobs */}
      <Box
        sx={{
          position: "fixed",
          width: "60vw",
          height: "60vw",
          top: "-20vw",
          left: "-10vw",
          borderRadius: "50%",
          background: `radial-gradient(ellipse, ${T.blueGlow} 0%, transparent 60%)`,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: "fixed",
          width: "50vw",
          height: "50vw",
          bottom: "-15vw",
          right: "-10vw",
          borderRadius: "50%",
          background: `radial-gradient(ellipse, ${T.blueDim} 0%, transparent 60%)`,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          pt: { xs: "80px", md: "88px" },
          pb: { xs: 10, md: 14 },
        }}
      >
        <Container maxWidth="xl">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            <Link href="/calculators" style={{ textDecoration: "none" }}>
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 0.75,
                  mb: 3,
                  cursor: "pointer",
                  "&:hover .back-txt": { color: accent },
                }}
              >
                <BackIcon sx={{ fontSize: "0.9rem", color: T.inkFaint }} />
                <Typography
                  className="back-txt"
                  sx={{
                    fontFamily: SANS,
                    fontSize: "0.8rem",
                    fontWeight: 500,
                    color: T.inkFaint,
                    transition: "color 0.15s",
                  }}
                >
                  All calculators
                </Typography>
              </Box>
            </Link>
          </motion.div>

          {/* Page header */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.5, ease: EASE }}
          >
            <Box sx={{ mb: 4 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  mb: 0.5,
                }}
              >
                <Box
                  sx={{
                    width: 3,
                    height: 28,
                    borderRadius: "2px",
                    background: `linear-gradient(180deg, ${accent} 0%, ${accent}66 100%)`,
                    flexShrink: 0,
                  }}
                />
                <Typography
                  sx={{
                    fontFamily: SANS,
                    fontWeight: 800,
                    fontSize: { xs: "1.75rem", md: "2.25rem" },
                    color: T.ink,
                    letterSpacing: "-0.035em",
                    lineHeight: 1.05,
                  }}
                >
                  {title}
                </Typography>
              </Box>

              <Typography
                sx={{
                  fontFamily: SANS,
                  fontSize: "0.9375rem",
                  color: T.inkMuted,
                  lineHeight: 1.65,
                  ml: "19px",
                }}
              >
                {description}
              </Typography>

              {/* Tag pills — only shown when tags are provided */}
              {tags && tags.length > 0 && (
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    flexWrap: "wrap",
                    mt: 1.5,
                    ml: "19px",
                  }}
                >
                  {tags.map((tag) => (
                    <Box
                      key={tag}
                      sx={{
                        px: "10px",
                        py: "3px",
                        borderRadius: "6px",
                        background: `${accent}10`,
                        border: `1px solid ${accent}28`,
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: SANS,
                          fontSize: "0.68rem",
                          fontWeight: 600,
                          color: accent,
                          letterSpacing: "0.06em",
                          textTransform: "uppercase",
                        }}
                      >
                        {tag}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          </motion.div>

          {children}
        </Container>
      </Box>
    </Box>
  );
}
