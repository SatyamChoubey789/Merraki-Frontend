"use client";

import { Box, Typography } from "@mui/material";
import {
  Close as CloseIcon,
  ShoppingCart as CartIcon,
  Download as DownloadIcon,
  VerifiedUser as VersionIcon,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { useTemplate } from "@/lib/hooks/useTemplates";
import { useCart } from "@/lib/hooks/useCart";
import type { TemplateWithRelations } from "@/types/template.types";

/* ─────────────────────────────
   NEW MINIMAL THEME
───────────────────────────── */

const T = {
  bg: "#F5F7FB",
  surface: "#FFFFFF",

  text: "#253957",
  muted: "#6B7280",
  faint: "#9CA3AF",

  border: "rgba(0,0,0,0.08)",
  borderStrong: "rgba(0,0,0,0.12)",
};

const SANS = '"DM Sans","Mona Sans",system-ui,-apple-system,sans-serif';

const MONO = '"DM Mono","JetBrains Mono","SF Mono",ui-monospace,monospace';

const ICONS = ["◈", "△", "◆", "◎", "◇", "✦", "⬡", "⬢", "○"];

interface Props {
  slug: string;
  open: boolean;
  onClose: () => void;
}

function formatPrice(cents: number) {
  return (cents / 100).toFixed(2);
}

/* ───────────────────────────── */

export function TemplateDetailDrawer({ slug, open, onClose }: Props) {
  const { data, isLoading } = useTemplate(slug);
  const { addItem, isInCart } = useCart();

  const template: TemplateWithRelations | undefined = data?.template;

  const inCart = template ? isInCart(template.id) : false;
  const icon = template ? ICONS[template.id % ICONS.length] : "◈";

  const primaryImage =
    template?.images?.find((i) => i.is_primary) ?? template?.images?.[0];

  const hasSale =
    !!template?.sale_price_usd_cents && template.sale_price_usd_cents > 0;

  const priceCents =
    hasSale && template
      ? template.sale_price_usd_cents!
      : (template?.price_usd_cents ?? 0);

  const originalPriceCents = template?.price_usd_cents ?? 0;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* BACKDROP */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.35)",
              zIndex: 1200,
            }}
          />

          {/* DRAWER */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{
              type: "spring",
              stiffness: 380,
              damping: 38,
            }}
            style={{
              position: "fixed",
              right: 0,
              top: 0,
              bottom: 0,
              width: "min(560px, 100vw)",
              background: T.surface,
              borderLeft: `1px solid ${T.border}`,
              zIndex: 1300,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* HEADER */}
            <Box
              sx={{
                px: 3,
                py: 2,
                borderBottom: `1px solid ${T.border}`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                sx={{
                  fontFamily: MONO,
                  fontSize: "0.65rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: T.muted,
                }}
              >
                Preview
              </Typography>

              <CloseIcon
                onClick={onClose}
                sx={{
                  cursor: "pointer",
                  color: T.muted,
                }}
              />
            </Box>

            {/* BODY */}
            {isLoading || !template ? (
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: T.muted,
                }}
              >
                Loading...
              </Box>
            ) : (
              <Box sx={{ flex: 1, overflowY: "auto", p: 3 }}>
                {/* IMAGE */}
                <Box
                  sx={{
                    height: 240,
                    borderRadius: 2,
                    overflow: "hidden",
                    border: `1px solid ${T.border}`,
                    mb: 3,
                    background: "#F1F3F5",
                  }}
                >
                  {primaryImage ? (
                    <img
                      src={primaryImage.url}
                      alt={primaryImage.alt_text ?? template.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <Box
                      sx={{
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 48,
                        color: T.faint,
                      }}
                    >
                      {icon}
                    </Box>
                  )}
                </Box>

                {/* TITLE */}
                <Typography
                  sx={{
                    fontSize: 22,
                    fontWeight: 800,
                    mb: 1,
                    color: T.text,
                  }}
                >
                  {template.name}
                </Typography>

                {/* DESCRIPTION */}
                <Typography
                  sx={{
                    color: T.muted,
                    mb: 3,
                  }}
                >
                  {template.description}
                </Typography>

                {/* META */}
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    mb: 3,
                    color: T.muted,
                    fontSize: 13,
                  }}
                >
                  <Box sx={{ display: "flex", gap: 0.5 }}>
                    <DownloadIcon fontSize="small" />
                    {template.downloads_count ?? 0}
                  </Box>

                  <Box sx={{ display: "flex", gap: 0.5 }}>
                    <VersionIcon fontSize="small" />v{template.current_version}
                  </Box>

                  <Box>{template.file_format}</Box>
                </Box>

                {/* PRICE */}
                <Box sx={{ mb: 3 }}>
                  <Typography
                    sx={{
                      fontSize: 26,
                      fontWeight: 800,
                      color: T.text,
                    }}
                  >
                    ${formatPrice(priceCents)}
                  </Typography>

                  {hasSale && (
                    <Typography
                      sx={{
                        textDecoration: "line-through",
                        color: T.faint,
                      }}
                    >
                      ${formatPrice(originalPriceCents)}
                    </Typography>
                  )}
                </Box>

                {/* CTA */}
                <motion.button
                  onClick={() => {
                    if (!template) return;
                    if (!inCart) addItem(template);
                    onClose();
                  }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    width: "100%",
                    padding: 14,
                    borderRadius: 10,
                    background: "#111",
                    color: "#fff",
                    fontWeight: 700,
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  <CartIcon fontSize="small" />
                  {inCart ? "Already in Cart" : "Add to Cart"}
                </motion.button>
              </Box>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
