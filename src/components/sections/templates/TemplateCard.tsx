"use client";

import { useState } from "react";
import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { useCart } from "@/lib/hooks/useCart";
import { priceToCents, uuidToIndex, getPrimaryImage } from "@/types/templatesTypes";
import type { TemplateListItem } from "@/types/templatesTypes";
import { TemplateDetailDrawer } from "./TemplateDetailDrawer";

// ─── Brand tokens ─────────────────────────────────────────────────────────────

const T = {
  bg: "#F5F7FB",
  surface: "#FFFFFF",
  ink: "#253957",
  inkMid: "rgba(37,57,87,0.75)",
  inkMuted: "rgba(37,57,87,0.55)",
  inkFaint: "rgba(37,57,87,0.35)",
  border: "rgba(37,57,87,0.10)",
  borderMid: "rgba(37,57,87,0.16)",
  primary: "#253957",
  primaryLight: "rgba(37,57,87,0.06)",
  primaryBorder: "rgba(37,57,87,0.22)",
} as const;

const SANS = `"DM Sans", system-ui, sans-serif`;
const MONO = `"DM Mono", ui-monospace, monospace`;

const ICONS = ["◈", "△", "◆", "◎", "◇", "✦", "⬡", "○"];

function formatUSD(cents: number): string {
  return cents === 0 ? "Free" : `$${(cents / 100).toFixed(2)}`;
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface TemplateCardProps {
  template: TemplateListItem;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function TemplateCard({ template }: TemplateCardProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [hovered, setHovered] = useState(false);

  const { addToCart, isInCart, openCart } = useCart();

  // All derived from real backend fields
  const inCart = isInCart(template.id);
  const icon = ICONS[uuidToIndex(template.id, ICONS.length)];
  const primaryImage = getPrimaryImage(template.previewImages);
  const priceCents = priceToCents(template.priceUsd); // priceUsd is "9.99"

  const handleAddToCart = () => {
    if (inCart) {
      openCart();
      return;
    }
    addToCart(template); // adapter inside useCart handles conversion
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        style={{ height: "100%" }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            background: T.surface,
            borderRadius: "16px",
            border: `1px solid ${T.border}`,
            overflow: "hidden",
            transition: "border-color 0.2s, box-shadow 0.2s",
            "&:hover": {
              borderColor: T.borderMid,
              boxShadow: "0 4px 24px rgba(37,57,87,0.08)",
            },
          }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {/* ── Preview image ── */}
          <Box
            onClick={() => setDrawerOpen(true)}
            sx={{
              position: "relative",
              height: 200,
              background: T.bg,
              borderBottom: `1px solid ${T.border}`,
              cursor: "pointer",
              overflow: "hidden",
              flexShrink: 0,
            }}
          >
            {primaryImage ? (
              <img
                src={primaryImage.url}
                alt={primaryImage.alt}          // backend field is "alt" not "alt_text"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transition: "transform 0.3s ease",
                  transform: hovered ? "scale(1.03)" : "scale(1)",
                }}
              />
            ) : (
              <Box
                sx={{
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "2.25rem",
                  color: T.inkFaint,
                }}
              >
                {icon}
              </Box>
            )}

            {/* Quick view overlay */}
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                background: "rgba(37,57,87,0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: hovered ? 1 : 0,
                transition: "opacity 0.2s",
              }}
            >
              <Box
                sx={{
                  px: 2,
                  py: 0.875,
                  borderRadius: "8px",
                  background: "rgba(255,255,255,0.15)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid rgba(255,255,255,0.25)",
                }}
              >
                <Typography
                  sx={{
                    fontFamily: SANS,
                    fontWeight: 600,
                    fontSize: "0.8rem",
                    color: "#fff",
                  }}
                >
                  Quick view
                </Typography>
              </Box>
            </Box>

            {/* Featured badge */}
            {template.featured && (
              <Box
                sx={{
                  position: "absolute",
                  top: 10,
                  left: 10,
                  px: 1.25,
                  py: "3px",
                  borderRadius: "6px",
                  background: T.primary,
                }}
              >
                <Typography
                  sx={{
                    fontFamily: MONO,
                    fontSize: "0.58rem",
                    fontWeight: 700,
                    color: "#fff",
                    letterSpacing: "0.06em",
                  }}
                >
                  FEATURED
                </Typography>
              </Box>
            )}
          </Box>

          {/* ── Content ── */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              p: 2.5,
            }}
          >
            {/* Tags */}
            {template.tags.length > 0 && (
              <Box
                sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 1.25 }}
              >
                {template.tags.slice(0, 2).map((tag) => (
                  <Box
                    key={tag}
                    sx={{
                      px: 1,
                      py: "2px",
                      borderRadius: "5px",
                      background: T.primaryLight,
                      border: `1px solid ${T.border}`,
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: MONO,
                        fontSize: "0.58rem",
                        color: T.inkMid,
                        letterSpacing: "0.04em",
                      }}
                    >
                      {tag}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}

            {/* Title — backend field is "title" not "name" */}
            <Typography
              onClick={() => setDrawerOpen(true)}
              sx={{
                fontFamily: SANS,
                fontWeight: 700,
                fontSize: "0.9375rem",
                color: T.ink,
                lineHeight: 1.3,
                cursor: "pointer",
                mb: 0.75,
                "&:hover": { color: T.inkMid },
                transition: "color 0.15s",
              }}
            >
              {template.title}
            </Typography>

            {/* Description */}
            {template.description && (
              <Typography
                sx={{
                  fontFamily: SANS,
                  fontSize: "0.8125rem",
                  color: T.inkMuted,
                  lineHeight: 1.6,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  mb: 1.5,
                }}
              >
                {template.description}
              </Typography>
            )}

            {/* Spacer */}
            <Box sx={{ flex: 1 }} />

            {/* Price + CTA */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 1.5,
                mt: 2,
                pt: 2,
                borderTop: `1px solid ${T.border}`,
              }}
            >
              {/* Price — priceUsd is a string from backend */}
              <Typography
                sx={{
                  fontFamily: MONO,
                  fontWeight: 800,
                  fontSize: "1.0625rem",
                  color: T.ink,
                  letterSpacing: "-0.01em",
                  flexShrink: 0,
                }}
              >
                {formatUSD(priceCents)}
              </Typography>

              {/* Add to cart / View in cart */}
              <Box
                component="button"
                onClick={handleAddToCart}
                sx={{
                  px: 2,
                  py: "8px",
                  borderRadius: "9px",
                  border: `1.5px solid ${inCart ? T.primaryBorder : T.primary}`,
                  background: inCart ? T.primaryLight : T.primary,
                  color: inCart ? T.primary : "#fff",
                  fontFamily: SANS,
                  fontWeight: 600,
                  fontSize: "0.8125rem",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "all 0.18s",
                  "&:hover": {
                    filter: inCart ? "none" : "brightness(1.08)",
                    background: inCart ? "rgba(37,57,87,0.10)" : T.primary,
                  },
                }}
              >
                {inCart ? "✓ In cart" : "Add to cart"}
              </Box>
            </Box>
          </Box>
        </Box>
      </motion.div>

      {/* Detail drawer — only renders when open */}
      <TemplateDetailDrawer
        slug={drawerOpen ? template.slug : null}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </>
  );
}