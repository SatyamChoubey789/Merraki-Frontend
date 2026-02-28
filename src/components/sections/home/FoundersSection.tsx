"use client";

import { Box, Container, Typography } from "@mui/material";
import { LinkedIn as LinkedInIcon } from "@mui/icons-material";
import { motion } from "framer-motion";
import Image from "next/image";
import { useInView } from "@/lib/hooks/useInView";

/* ── tokens ──────────────────────────────────────────────────────────── */
const T = {
  bg: "#FFFFFF",
  surface: "#F7F8FA",
  border: "#E8EAED",
  borderMid: "#D1D5DB",
  ink: "#0F1117",
  inkMid: "#374151",
  inkMuted: "#6B7280",
  inkFaint: "#9CA3AF",
  accent: "#0057FF",
  accentBg: "rgba(0,87,255,0.05)",
};

const FONT_DISPLAY = `"Instrument Serif", "Playfair Display", Georgia, serif`;
const FONT_BODY = `"DM Sans", "Mona Sans", system-ui, sans-serif`;
const FONT_MONO = `"DM Mono", "JetBrains Mono", monospace`;

/* ── founder data ────────────────────────────────────────────────────── */
const FOUNDERS = [
  {
    name: "Parag Bhutani",
    role: "Co-Founder",
    tagline: "Excel & Financial Modeling Expert",
    bio: "Built 150+ financial models across SaaS, D2C, and manufacturing. Helps founders transform raw data into boardroom-ready strategies. Specialist in Excel dashboards and forecasting systems that actually get used.",
    stats: [
      { val: "150+", label: "Models built" },
      { val: "5 yrs", label: "Experience" },
      { val: "Series B", label: "Advisory" },
    ],
    tags: [
      "Financial Modelling",
      "Excel Dashboards",
      "Forecasting",
      "Startup Advisory",
    ],
    initials: "PB",
    accentFrom: "#0057FF",
    accentTo: "#3B82F6",
    linkedIn: "https://www.linkedin.com/in/parag-bhutani-83a980198/",
    photo: "https://res.cloudinary.com/dalsvy7qk/image/upload/v1772318476/ParagBhutani_mhbay3.jpg",
    fromLeft: true,
  },
  {
    name: "Khyati Gupta",
    role: "Co-Founder",
    tagline: "Financial Modelling & Excel Expert",
    bio: "Excel and Power BI specialist with a focus on building financial systems that scale. Creates growth-focused forecasting frameworks that help businesses plan confidently for every scenario.",
    stats: [
      { val: "200+", label: "Clients served" },
      { val: "Power BI", label: "Specialist" },
      { val: "₹50Cr+", label: "Modelled" },
    ],
    tags: ["Power BI", "Excel Systems", "Growth Strategy", "Forecasting"],
    initials: "KG",
    accentFrom: "#8B5CF6",
    accentTo: "#6D28D9",
    linkedIn: "https://www.linkedin.com/in/khyati-gupta14/",
    photo: "https://res.cloudinary.com/dalsvy7qk/image/upload/v1772318476/KhaytiGupta_pfkog4.jpg",
    fromLeft: false,
  },
];

/* ══════════════════════════════════════════════════════════════════════
   FOUNDERS SECTION
══════════════════════════════════════════════════════════════════════ */
export function FoundersSection() {
  const { ref, inView } = useInView({ threshold: 0.1 });

  return (
    <Box
      sx={{
        py: { xs: 10, md: 16 },
        background: T.bg,
        borderTop: `1px solid ${T.border}`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle background texture */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          backgroundImage: `radial-gradient(${T.border} 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
          opacity: 0.4,
          maskImage:
            "radial-gradient(ellipse 100% 100% at 50% 50%, black 30%, transparent 100%)",
        }}
      />

      <Container
        maxWidth="xl"
        ref={ref as React.RefObject<HTMLDivElement>}
        sx={{ position: "relative", zIndex: 1 }}
      >
        {/* Section header */}
        <Box sx={{ mb: { xs: 8, md: 12 } }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 1,
                  px: 1.5,
                  py: 0.6,
                  border: `1px solid ${T.border}`,
                  borderRadius: "4px",
                }}
              >
                <Typography
                  sx={{
                    fontFamily: FONT_MONO,
                    fontSize: "0.6rem",
                    letterSpacing: "0.16em",
                    color: T.inkFaint,
                    textTransform: "uppercase",
                  }}
                >
                  The Team
                </Typography>
              </Box>
            </Box>
            <Typography
              sx={{
                fontFamily: FONT_DISPLAY,
                fontStyle: "italic",
                fontWeight: 400,
                fontSize: { xs: "2.25rem", md: "3.25rem" },
                color: T.ink,
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
                maxWidth: 560,
              }}
            >
              Meet the experts
              <br />
              behind the numbers.
            </Typography>
          </motion.div>
        </Box>

        {/* Founder cards */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: { xs: 6, md: 10 },
          }}
        >
          {FOUNDERS.map((founder, i) => (
            <FounderCard
              key={founder.name}
              founder={founder}
              index={i}
              inView={inView}
            />
          ))}
        </Box>
      </Container>
    </Box>
  );
}

/* ─── Individual founder card ───────────────────────────────────────── */
function FounderCard({
  founder,
  index,
  inView,
}: {
  founder: (typeof FOUNDERS)[0];
  index: number;
  inView: boolean;
}) {
  const isReversed = !founder.fromLeft;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.8,
        delay: index * 0.2,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: isReversed ? "1fr 1fr" : "1fr 1fr",
          },
          gap: { xs: 6, md: 10 },
          alignItems: "start",
          position: "relative",
        }}
      >
        {/* Photo / Initials */}
        <Box sx={{ order: { xs: 0, md: isReversed ? 1 : 0 } }}>
          <Box
            sx={{
              position: "relative",
              borderRadius: "20px",
              overflow: "hidden",
              aspectRatio: "4/3",
              background: `linear-gradient(135deg, ${founder.accentFrom}1A, ${founder.accentTo}28)`,
              border: "1px solid rgba(0,0,0,0.05)",
              boxShadow: "0 16px 48px rgba(0,0,0,0.08)",
            }}
          >
            {founder.photo ? (
              <Image
                src={founder.photo}
                alt={founder.name}
                fill
                style={{ objectFit: "cover", objectPosition: "center top" }}
              />
            ) : (
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                }}
              >
                <Typography
                  sx={{
                    fontFamily: FONT_DISPLAY,
                    fontStyle: "italic",
                    fontWeight: 400,
                    fontSize: { xs: "5rem", md: "7rem" },
                    lineHeight: 1,
                    background: `linear-gradient(135deg, ${founder.accentFrom}, ${founder.accentTo})`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    opacity: 0.65,
                    letterSpacing: "-0.03em",
                  }}
                >
                  {founder.initials}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: FONT_MONO,
                    fontSize: "0.65rem",
                    letterSpacing: "0.16em",
                    color: T.inkFaint,
                    textTransform: "uppercase",
                  }}
                >
                  Add photo
                </Typography>
              </Box>
            )}

            {/* Role badge */}
            <Box
              sx={{
                position: "absolute",
                top: 16,
                left: 16,
                px: 2,
                py: 0.6,
                borderRadius: "6px",
                background: "rgba(255,255,255,0.9)",
                backdropFilter: "blur(6px)",
                border: "1px solid rgba(0,0,0,0.05)",
              }}
            >
              <Typography
                sx={{
                  fontFamily: FONT_MONO,
                  fontSize: "0.55rem",
                  fontWeight: 600,
                  letterSpacing: "0.12em",
                  color: founder.accentFrom,
                  textTransform: "uppercase",
                }}
              >
                {founder.role}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Text content */}
        <Box sx={{ order: { xs: 1, md: isReversed ? 0 : 1 } }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 1,
            }}
          >
            <Typography
              sx={{
                fontFamily: FONT_DISPLAY,
                fontStyle: "italic",
                fontWeight: 400,
                fontSize: { xs: "2rem", md: "2.75rem" },
                color: T.ink,
                lineHeight: 1.05,
              }}
            >
              {founder.name}
            </Typography>
          </Box>

          <Typography
            sx={{
              fontFamily: FONT_MONO,
              fontSize: "0.75rem",
              letterSpacing: "0.12em",
              color: T.inkMuted,
              textTransform: "uppercase",
              mb: 3,
            }}
          >
            {founder.tagline}
          </Typography>

          <Typography
            sx={{
              fontFamily: FONT_BODY,
              fontSize: { xs: "1rem", md: "1.125rem" },
              color: T.inkMid,
              lineHeight: 1.85,
              mb: 4,
              maxWidth: 520,
            }}
          >
            {founder.bio}
          </Typography>

          {/* Stats row */}
          <Box sx={{ display: "flex", gap: 4, mb: 4 }}>
            {founder.stats.map((s, si) => (
              <Box key={s.label} sx={{ textAlign: "center" }}>
                <Typography
                  sx={{
                    fontFamily: FONT_MONO,
                    fontSize: "1.25rem",
                    fontWeight: 600,
                    color: T.ink,
                    lineHeight: 1,
                  }}
                >
                  {s.val}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: FONT_MONO,
                    fontSize: "0.55rem",
                    color: T.inkFaint,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                  }}
                >
                  {s.label}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* Expertise tags */}
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {founder.tags.map((tag) => (
              <Box
                key={tag}
                sx={{
                  px: 2,
                  py: 0.625,
                  borderRadius: "7px",
                  border: "1px solid rgba(0,0,0,0.08)",
                  background: T.surface,
                  fontFamily: FONT_BODY,
                  fontSize: "0.75rem",
                  color: T.inkMid,
                  fontWeight: 500,
                  transition: "all 0.15s ease",
                  "&:hover": {
                    background: `${founder.accentFrom}15`,
                    borderColor: `${founder.accentFrom}44`,
                  },
                }}
              >
                {tag}
              </Box>
            ))}
          </Box>
          {/* LinkedIn button */}
          <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
            {founder.linkedIn && (
              <a
                href={founder.linkedIn}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: founder.accentFrom }}
              >
                <LinkedInIcon
                  sx={{
                    fontSize: "1.4rem",
                    transition: "all 0.15s ease",
                    "&:hover": { color: founder.accentTo },
                  }}
                />
              </a>
            )}
          </Box>
        </Box>
      </Box>
    </motion.div>
  );
}
