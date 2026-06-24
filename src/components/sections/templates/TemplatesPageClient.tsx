"use client";

import { useState } from "react";
import {
  Box,
  Container,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Search as SearchIcon, Close as CloseIcon } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { TemplateGrid } from "./TemplateGrid";
import {
  FilterSidebar,
  FilterDrawer,
  FilterTriggerButton,
} from "./TemplateFilters";
import { useSearchFilter } from "@/lib/hooks/useSearchFilter";

/* THEME */
const T = {
  bg: "#f5f7fb",
  bgSection: "#F5F7FB",
  ink: "#0A0A0F",
  inkMuted: "#5A5A72",
  inkFaint: "#9898AE",
  border: "rgba(10,10,20,0.08)",

  primary: "#253957",
  primarySoft: "#E9EEF5",
  primaryGlow: "rgba(37,57,87,0.12)",
};

const SANS = '"DM Sans","Mona Sans",system-ui,sans-serif';
const MONO = '"DM Mono","JetBrains Mono",ui-monospace,monospace';
const EASE = [0.16, 1, 0.3, 1] as const;

const TAGS = [
  "Financial Modelling",
  "Cash Flow",
  "DCF",
  "Excel Dashboards",
  "Runway",
  "Unit Economics",
];

export function TemplatesPageClient() {
  const filter = useSearchFilter({ initialSort: "popular", defaultLimit: 12 });
  const { searchQuery, handleSearchChange } = filter;
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  return (
    <Box sx={{ minHeight: "100vh", background: T.bg }}>
      {/* HEADER */}
      <Box
        sx={{
          pt: { xs: 11, md: 14 },
          pb: { xs: 5, md: 6 },
          borderBottom: `1px solid ${T.border}`,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* soft grid */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle, rgba(37,57,87,0.06) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
            pointerEvents: "none",
          }}
        />

        {/* glow */}
        <Box
          sx={{
            position: "absolute",
            width: "55vw",
            height: "28vw",
            top: "-12vw",
            left: "22vw",
            borderRadius: "50%",
            background: `radial-gradient(ellipse, ${T.primaryGlow} 0%, transparent 70%)`,
            pointerEvents: "none",
          }}
        />

        <Container
          maxWidth="sm"
          sx={{ position: "relative", zIndex: 1, textAlign: "center" }}
        >
          {/* badge */}
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              px: "12px",
              py: "5px",
              borderRadius: "100px",
              border: `1px solid ${T.border}`,
              background: T.primarySoft,
              mb: 4,
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

          {/* SEARCH */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              background: T.bg,
              border: `1.5px solid ${T.border}`,
              borderRadius: "16px",
              height: 58,
              overflow: "hidden",
              transition: "all 0.2s ease",
              "&:focus-within": {
                borderColor: T.primary,
                boxShadow: `0 0 0 4px ${T.primaryGlow}`,
              },
            }}
          >
            <Box
              sx={{ pl: 2.25, pr: 1.5, display: "flex", alignItems: "center" }}
            >
              <SearchIcon sx={{ fontSize: "1.1rem", color: T.inkFaint }} />
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
                fontSize: "0.95rem",
                color: T.ink,
                "&::placeholder": { color: T.inkFaint },
              }}
            />

            {searchQuery && (
              <Box
                component="button"
                onClick={() => handleSearchChange("")}
                sx={{
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  background: T.primarySoft,
                  border: "none",
                  mr: 1,
                  cursor: "pointer",
                }}
              >
                <CloseIcon sx={{ fontSize: "0.7rem", color: T.primary }} />
              </Box>
            )}

            <motion.button
              whileTap={{ scale: 0.97 }}
              style={{
                height: "100%",
                padding: "0 26px",
                border: "none",
                background: T.primary,
                color: "#fff",
                fontFamily: SANS,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Search
            </motion.button>
          </Box>

          {/* TAGS */}
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 1,
              justifyContent: "center",
              mt: 3,
            }}
          >
            {TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => handleSearchChange(tag)}
                style={{
                  padding: "5px 13px",
                  borderRadius: "100px",
                  border: `1px solid ${T.border}`,
                  background: "transparent",
                  fontFamily: SANS,
                  fontSize: "0.78rem",
                  color: T.inkMuted,
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background =
                    T.primarySoft;
                  (e.currentTarget as HTMLElement).style.color = T.primary;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background =
                    "transparent";
                  (e.currentTarget as HTMLElement).style.color = T.inkMuted;
                }}
              >
                {tag}
              </button>
            ))}
          </Box>
        </Container>
      </Box>

      {/* MAIN */}
      <Container maxWidth="xl" sx={{ pt: { xs: 5, md: 8 }, pb: 16 }}>
        {!isDesktop && (
          <Box sx={{ mb: 3 }}>
            <FilterTriggerButton
              filter={filter}
              onClick={() => setMobileFilterOpen(true)}
            />
          </Box>
        )}

        <Box sx={{ display: "flex", gap: 5 }}>
          {isDesktop && <FilterSidebar filter={filter} />}
          <Box sx={{ flex: 1 }}>
            <TemplateGrid filter={filter} />
          </Box>
        </Box>
      </Container>

      <FilterDrawer
        filter={filter}
        open={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
      />
    </Box>
  );
}
