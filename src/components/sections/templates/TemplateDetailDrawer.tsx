"use client";

import { Box, Typography, CircularProgress } from "@mui/material";
import {
  Close as CloseIcon,
  ShoppingCart as CartIcon,
  Check as CheckIcon,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { useTemplate } from "@/lib/hooks/useTemplates";
import { useCart } from "@/lib/hooks/useCart";
import {
  priceToCents,
  getPrimaryImage,
  uuidToIndex,
} from "@/types/templatesTypes";

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
  green: "#0D7A5F",
  greenPale: "rgba(13,122,95,0.08)",
  greenBorder: "rgba(13,122,95,0.20)",
} as const;

const SANS = `"DM Sans", system-ui, sans-serif`;
const MONO = `"DM Mono", ui-monospace, monospace`;

const ICONS = ["◈", "△", "◆", "◎", "◇", "✦", "⬡", "○"];

// ─── Format helpers ───────────────────────────────────────────────────────────

function formatUSD(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface TemplateDetailDrawerProps {
  slug: string | null; // null = drawer closed
  open: boolean;
  onClose: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function TemplateDetailDrawer({
  slug,
  open,
  onClose,
}: TemplateDetailDrawerProps) {
  // Fetch only when slug is set — hook skips when slug is null
  const { template, isLoading } = useTemplate(slug);
  const { addToCart, isInCart } = useCart();

  // Derived values — all computed from real backend fields
  const inCart = template ? isInCart(template.id) : false;

  // Stable icon from UUID hash (not modulo of numeric id)
  const icon = template ? ICONS[uuidToIndex(template.id, ICONS.length)] : "◈";

  // First image = primary (backend has no is_primary field)
  const primaryImage = template
    ? getPrimaryImage(template.previewImages)
    : null;

  // priceUsd is a string from backend ("9.99") — convert to cents for math
  const priceCents = template ? priceToCents(template.priceUsd) : 0;

  const handleAddToCart = () => {
    if (!template || inCart) return;
    addToCart(template); // adapter runs inside useCart
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(37,57,87,0.3)",
              zIndex: 1200,
            }}
          />

          {/* Drawer panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 360, damping: 36 }}
            style={{
              position: "fixed",
              right: 0,
              top: 0,
              bottom: 0,
              width: "min(540px, 100vw)",
              background: T.surface,
              borderLeft: `1px solid ${T.borderMid}`,
              zIndex: 1300,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Header */}
            <Box
              sx={{
                px: 3,
                py: 2.25,
                borderBottom: `1px solid ${T.border}`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexShrink: 0,
              }}
            >
              <Typography
                sx={{
                  fontFamily: MONO,
                  fontSize: "0.65rem",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: T.inkMuted,
                }}
              >
                Template preview
              </Typography>

              <Box
                component="button"
                onClick={onClose}
                aria-label="Close preview"
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: `1px solid ${T.border}`,
                  background: "transparent",
                  cursor: "pointer",
                  "&:hover": { background: T.bg },
                }}
              >
                <CloseIcon sx={{ fontSize: "0.9rem", color: T.inkFaint }} />
              </Box>
            </Box>

            {/* Body */}
            {isLoading || !template ? (
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                <CircularProgress size={28} sx={{ color: T.primary }} />
                <Typography
                  sx={{
                    fontFamily: SANS,
                    fontSize: "0.875rem",
                    color: T.inkFaint,
                  }}
                >
                  Loading template…
                </Typography>
              </Box>
            ) : (
              <Box sx={{ flex: 1, overflowY: "auto" }}>
                {/* Preview image */}
                <Box
                  sx={{
                    height: 240,
                    background: T.bg,
                    borderBottom: `1px solid ${T.border}`,
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {primaryImage ? (
                    <img
                      src={primaryImage.url}
                      alt={primaryImage.alt}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <Typography sx={{ fontSize: "3.5rem", color: T.inkFaint }}>
                      {icon}
                    </Typography>
                  )}
                </Box>

                {/* Content */}
                <Box sx={{ p: 3 }}>
                  {/* Tags */}
                  {template.tags.length > 0 && (
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 0.75,
                        mb: 2,
                      }}
                    >
                      {template.tags.map((tag) => (
                        <Box
                          key={tag}
                          sx={{
                            px: 1.25,
                            py: "3px",
                            borderRadius: "6px",
                            background: T.primaryLight,
                            border: `1px solid ${T.border}`,
                          }}
                        >
                          <Typography
                            sx={{
                              fontFamily: MONO,
                              fontSize: "0.62rem",
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
                    sx={{
                      fontFamily: SANS,
                      fontWeight: 800,
                      fontSize: "1.375rem",
                      color: T.ink,
                      letterSpacing: "-0.02em",
                      lineHeight: 1.2,
                      mb: 1.25,
                    }}
                  >
                    {template.title}
                  </Typography>

                  {/* Description */}
                  {template.description && (
                    <Typography
                      sx={{
                        fontFamily: SANS,
                        fontSize: "0.875rem",
                        color: T.inkMuted,
                        lineHeight: 1.7,
                        mb: 3,
                      }}
                    >
                      {template.description}
                    </Typography>
                  )}

                  {/* Price — priceUsd is a string, convert to cents for display */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "baseline",
                      gap: 1,
                      mb: 3,
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: MONO,
                        fontWeight: 800,
                        fontSize: "1.75rem",
                        color: T.ink,
                        letterSpacing: "-0.03em",
                      }}
                    >
                      {formatUSD(priceCents)}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: SANS,
                        fontSize: "0.75rem",
                        color: T.inkFaint,
                      }}
                    >
                      USD · one-time
                    </Typography>
                  </Box>

                  {/* Add to cart */}
                  <motion.button
                    onClick={handleAddToCart}
                    disabled={inCart}
                    whileTap={inCart ? {} : { scale: 0.98 }}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      padding: "13px 24px",
                      borderRadius: "12px",
                      border: "none",
                      background: inCart ? T.bg : T.primary,
                      color: inCart ? T.inkMid : "#fff",
                      fontFamily: SANS,
                      fontWeight: 600,
                      fontSize: "0.9rem",
                      cursor: inCart ? "default" : "pointer",
                      borderWidth: inCart ? 1 : 0,
                      borderStyle: "solid",
                      borderColor: T.border,
                      transition: "all 0.18s",
                    }}
                  >
                    {inCart ? (
                      <>
                        <CheckIcon style={{ fontSize: "0.95rem" }} />
                        Already in cart
                      </>
                    ) : (
                      <>
                        <CartIcon style={{ fontSize: "0.95rem" }} />
                        Add to cart
                      </>
                    )}
                  </motion.button>

                  {/* Additional preview images */}
                  {template.previewImages.length > 1 && (
                    <Box sx={{ mt: 4 }}>
                      <Typography
                        sx={{
                          fontFamily: SANS,
                          fontWeight: 600,
                          fontSize: "0.8rem",
                          color: T.inkMid,
                          mb: 1.5,
                        }}
                      >
                        More previews
                      </Typography>
                      <Box
                        sx={{
                          display: "grid",
                          gridTemplateColumns: "repeat(2, 1fr)",
                          gap: 1.25,
                        }}
                      >
                        {/* Skip index 0 — already shown as primary */}
                        {template.previewImages.slice(1).map((img, i) => (
                          <Box
                            key={i}
                            sx={{
                              aspectRatio: "16/9",
                              borderRadius: "8px",
                              overflow: "hidden",
                              border: `1px solid ${T.border}`,
                            }}
                          >
                            <img
                              src={img.url}
                              alt={img.alt}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  )}
                </Box>
              </Box>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
