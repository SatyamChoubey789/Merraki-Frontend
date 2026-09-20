"use client";

import { useState } from "react";
import { Box, Container, Typography, useMediaQuery, useTheme } from "@mui/material";
import { Search as SearchIcon, Close as CloseIcon } from "@mui/icons-material";
import { motion } from "framer-motion";
import { useSearchFilter } from "@/lib/hooks/useSearchFilter";
import { TemplateGrid } from "./TemplateGrid";
import { FilterSidebar, FilterDrawer, FilterTriggerButton } from "./TemplateFilters";

// ─── Brand tokens ─────────────────────────────────────────────────────────────

const T = {
  bg: "#F5F7FB",
  surface: "#FFFFFF",
  ink: "#253957",
  inkMid: "rgba(37,57,87,0.75)",
  inkMuted: "rgba(37,57,87,0.55)",
  inkFaint: "rgba(37,57,87,0.35)",
  border: "rgba(37,57,87,0.10)",
  borderFocus: "rgba(37,57,87,0.40)",
  primary: "#253957",
  primaryLight: "rgba(37,57,87,0.06)",
  primaryGlow: "rgba(37,57,87,0.10)",
} as const;

const SANS = `"DM Sans", system-ui, sans-serif`;
const MONO = `"DM Mono", ui-monospace, monospace`;
const EASE = [0.16, 1, 0.3, 1] as const;

// Quick-search tags — these map to the backend's `search` param
const QUICK_TAGS = [
  "Financial Modelling",
  "Cash Flow",
  "DCF",
  "Excel Dashboard",
  "Runway",
  "Unit Economics",
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export function TemplatesPageClient() {
  const filter = useSearchFilter({ initialSort: "newest", defaultLimit: 12 });
  const { searchQuery, handleSearchChange } = filter;
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  return (
    <Box sx={{ minHeight: "100vh", background: T.bg }}>
      {/* ── Hero / Search header ── */}
      <Box
        sx={{
          pt: { xs: 11, md: 14 },
          pb: { xs: 6, md: 8 },
          borderBottom: `1px solid ${T.border}`,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Dot grid background */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle, rgba(37,57,87,0.07) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            pointerEvents: "none",
          }}
        />

        {/* Radial glow */}
        <Box
          sx={{
            position: "absolute",
            width: "50vw",
            height: "25vw",
            top: "-10vw",
            left: "25vw",
            borderRadius: "50%",
            background: `radial-gradient(ellipse, ${T.primaryGlow} 0%, transparent 70%)`,
            pointerEvents: "none",
          }}
        />

        <Container
          maxWidth="sm"
          sx={{ position: "relative", zIndex: 1, textAlign: "center" }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
                px: "12px",
                py: "5px",
                borderRadius: "100px",
                border: `1px solid ${T.border}`,
                background: T.surface,
                mb: 3,
              }}
            >
              <Box
                sx={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: T.primary,
                }}
              />
              <Typography
                sx={{
                  fontFamily: MONO,
                  fontSize: "0.55rem",
                  letterSpacing: "0.18em",
                  color: T.primary,
                }}
              >
                Template Store
              </Typography>
            </Box>
          </motion.div>

          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.45, ease: EASE }}
          >
            <Typography
              sx={{
                fontFamily: SANS,
                fontWeight: 800,
                fontSize: { xs: "1.875rem", md: "2.5rem" },
                color: T.ink,
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
                mb: 1,
              }}
            >
              Financial templates
            </Typography>
            <Typography
              sx={{
                fontFamily: SANS,
                fontWeight: 300,
                fontSize: { xs: "1.875rem", md: "2.5rem" },
                color: T.inkMuted,
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
                mb: 4,
              }}
            >
              built for founders.
            </Typography>
          </motion.div>

          {/* Search bar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.45, ease: EASE }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                background: T.surface,
                border: `1.5px solid ${T.border}`,
                borderRadius: "14px",
                height: 54,
                overflow: "hidden",
                transition: "border-color 0.2s, box-shadow 0.2s",
                "&:focus-within": {
                  borderColor: T.borderFocus,
                  boxShadow: `0 0 0 3px ${T.primaryLight}`,
                },
              }}
            >
              <Box sx={{ pl: 2, pr: 1, display: "flex", alignItems: "center" }}>
                <SearchIcon sx={{ fontSize: "1rem", color: T.inkFaint }} />
              </Box>

              <Box
                component="input"
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleSearchChange(e.target.value)
                }
                placeholder="Search templates…"
                sx={{
                  flex: 1,
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  fontFamily: SANS,
                  fontSize: "0.9rem",
                  color: T.ink,
                  "&::placeholder": { color: T.inkFaint },
                }}
              />

              {searchQuery && (
                <Box
                  component="button"
                  onClick={() => handleSearchChange("")}
                  sx={{
                    width: 24,
                    height: 24,
                    mr: 1,
                    borderRadius: "50%",
                    border: "none",
                    background: T.bg,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <CloseIcon sx={{ fontSize: "0.7rem", color: T.inkMuted }} />
                </Box>
              )}

              <Box
                component="button"
                sx={{
                  height: "100%",
                  px: { xs: 2, sm: 3 },
                  border: "none",
                  borderLeft: `1px solid ${T.border}`,
                  background: T.primary,
                  color: "#fff",
                  fontFamily: SANS,
                  fontWeight: 700,
                  fontSize: "0.875rem",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "filter 0.18s",
                  "&:hover": { filter: "brightness(1.08)" },
                }}
              >
                Search
              </Box>
            </Box>
          </motion.div>

          {/* Quick-search tags */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.4 }}
          >
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 0.875,
                justifyContent: "center",
                mt: 2.5,
              }}
            >
              {QUICK_TAGS.map((tag) => (
                <Box
                  key={tag}
                  component="button"
                  onClick={() => handleSearchChange(tag)}
                  sx={{
                    px: "12px",
                    py: "5px",
                    borderRadius: "100px",
                    border: `1px solid ${T.border}`,
                    background:
                      searchQuery === tag ? T.primaryLight : "transparent",
                    color: searchQuery === tag ? T.ink : T.inkMuted,
                    fontFamily: SANS,
                    fontSize: "0.78rem",
                    fontWeight: searchQuery === tag ? 600 : 400,
                    cursor: "pointer",
                    transition: "all 0.15s",
                    "&:hover": {
                      background: T.primaryLight,
                      color: T.ink,
                      borderColor: "rgba(37,57,87,0.2)",
                    },
                  }}
                >
                  {tag}
                </Box>
              ))}
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* ── Main content ── */}
      <Container maxWidth="xl" sx={{ pt: { xs: 5, md: 8 }, pb: 16 }}>
        {/* Mobile filter trigger */}
        {!isDesktop && (
          <Box sx={{ mb: 3 }}>
            <FilterTriggerButton
              filter={filter}
              onClick={() => setMobileFilterOpen(true)}
            />
          </Box>
        )}

        <Box sx={{ display: "flex", gap: { md: 6 }, alignItems: "flex-start" }}>
          {/* Sidebar — desktop only */}
          {isDesktop && <FilterSidebar filter={filter} />}

          {/* Grid */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <TemplateGrid filter={filter} />
          </Box>
        </Box>
      </Container>

      {/* Mobile filter drawer */}
      <FilterDrawer
        filter={filter}
        open={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
      />
    </Box>
  );
}