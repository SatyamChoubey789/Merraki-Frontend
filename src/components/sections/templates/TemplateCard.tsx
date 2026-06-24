"use client";

import { useState } from "react";
import { Box, Typography } from "@mui/material";
import { Download as DownloadIcon } from "@mui/icons-material";
import { motion } from "framer-motion";
import { useCart } from "@/lib/hooks/useCart";
import { TemplateDetailDrawer } from "./TemplateDetailDrawer";
import type { TemplateWithRelations } from "@/types/template.types";

/* NEW THEME */
const T = {
  bg: "#f5f7fb",
  ink: "#0A0A0F",
  inkMuted: "#5A5A72",
  inkFaint: "#9898AE",
  border: "rgba(10,10,20,0.09)",

  primary: "#253957",
  primaryPale: "rgba(37,57,87,0.12)",
  primaryBorder: "rgba(37,57,87,0.22)",
  primaryGrad: "linear-gradient(135deg,#253957 0%,#3a4f6a 100%)",

  imgBg: "#F0F4FF",
};

const SANS = '"DM Sans","Mona Sans",system-ui,sans-serif';
const MONO = '"DM Mono","JetBrains Mono",ui-monospace,monospace';
const EASE = [0.16, 1, 0.3, 1] as const;

const ICONS = ["◈", "△", "◆", "◎", "◇", "✦", "⬡", "⬢", "○"];

const formatPrice = (cents: number) => (cents / 100).toFixed(2);

interface Props {
  template: TemplateWithRelations;
  index?: number;
}

export function TemplateCard({ template, index = 0 }: Props) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [hovered, setHovered] = useState(false);

  const { addItem, isInCart } = useCart();
  const inCart = isInCart(template.id);

  const icon = ICONS[template.id % ICONS.length] ?? "◈";

  const hasDiscount =
    template.sale_price_usd_cents != null && template.sale_price_usd_cents > 0;

  const displayPrice = hasDiscount
    ? template.sale_price_usd_cents!
    : template.price_usd_cents;

  const originalPrice = template.price_usd_cents;

  const primaryImage =
    template.images?.find((img) => img.is_primary) ?? template.images?.[0];

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.04, duration: 0.45, ease: EASE }}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        style={{ height: "100%" }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
          {/* IMAGE */}
          <Box
            onClick={() => setDrawerOpen(true)}
            sx={{
              position: "relative",
              height: 220,
              borderRadius: "14px",
              overflow: "hidden",
              background: T.imgBg,
              border: `1px solid ${T.border}`,
              mb: 1.75,
              cursor: "pointer",
            }}
          >
            {primaryImage ? (
              <Box
                component="img"
                src={primaryImage.url}
                alt={primaryImage.alt_text ?? template.name}
                sx={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <Box
                sx={{
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: T.inkFaint,
                  fontSize: "1.4rem",
                }}
              >
                {icon}
              </Box>
            )}

            {/* Hover */}
            <motion.div
              animate={{ opacity: hovered ? 1 : 0 }}
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(0,0,0,0.35)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography sx={{ color: "#fff", fontWeight: 700 }}>
                Quick view
              </Typography>
            </motion.div>
          </Box>

          {/* CONTENT */}
          <Box sx={{ flex: 1 }}>
            {/* CATEGORY */}
            {template.category && (
              <Typography
                sx={{
                  fontFamily: MONO,
                  fontSize: "0.6rem",
                  color: T.primary,
                }}
              >
                {template.category.name}
              </Typography>
            )}

            {/* NAME + PRICE */}
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography
                onClick={() => setDrawerOpen(true)}
                sx={{
                  fontFamily: SANS,
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  cursor: "pointer",
                }}
              >
                {template.name}
              </Typography>

              <Box sx={{ textAlign: "right" }}>
                <Typography sx={{ fontWeight: 700 }}>
                  {template.price_usd_cents === 0
                    ? "Free"
                    : `$${formatPrice(displayPrice)}`}
                </Typography>

                {hasDiscount && (
                  <Typography
                    sx={{
                      fontSize: "0.7rem",
                      textDecoration: "line-through",
                      color: T.inkFaint,
                    }}
                  >
                    ${formatPrice(originalPrice)}
                  </Typography>
                )}
              </Box>
            </Box>

            {/* DESCRIPTION */}
            <Typography
              sx={{
                fontSize: "0.85rem",
                color: T.inkMuted,
                mt: 1,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {template.tagline ?? template.description}
            </Typography>

            {/* DOWNLOADS */}
            <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
              <DownloadIcon sx={{ fontSize: 14, mr: 0.5, color: T.primary }} />
              <Typography sx={{ fontSize: "0.7rem", color: T.inkFaint }}>
                {(template.downloads_count ?? 0).toLocaleString()} downloads
              </Typography>
            </Box>

            {/* CTA */}
            <motion.button
              onClick={() => {
                if (!inCart) addItem(template);
              }}
              whileTap={{ scale: 0.97 }}
              style={{
                marginTop: 10,
                padding: "8px 14px",
                borderRadius: 8,
                border: inCart ? `1px solid ${T.primary}` : "none",
                background: inCart ? T.primaryPale : T.primaryGrad,
                color: inCart ? T.primary : "#fff",
                fontWeight: 700,
                cursor: inCart ? "default" : "pointer",
              }}
            >
              {inCart ? "✓ Added" : "Add to cart"}
            </motion.button>
          </Box>
        </Box>
      </motion.div>

      <TemplateDetailDrawer
        slug={template.slug}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </>
  );
}
