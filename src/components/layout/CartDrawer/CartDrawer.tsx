"use client";

import { useState, useEffect } from "react";
import { Drawer, Box, Typography, Stack } from "@mui/material";
import {
  DeleteOutline as DeleteIcon,
  ShoppingBagOutlined as EmptyCartIcon,
  Close as CloseIcon,
  ShoppingCart as CartIcon,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

import { useCartStore, type CartItem } from "@/lib/stores/cartStore";
import type { TemplateWithRelations } from "@/types/template.types";

type CartTemplate = TemplateWithRelations;

// =======================
// THEME (MATCH HEADER)
// =======================
const T = {
  bg: "#F5F7FB",
  bgSection: "#FFFFFF",
  ink: "#253957",
  inkMuted: "rgba(37,57,87,0.6)",
  inkFaint: "rgba(37,57,87,0.4)",
  border: "rgba(37,57,87,0.08)",
  primary: "#253957", // for highlights
  accent: "#3B7BF6",  // optional accent
};

const SANS = `"DM Sans","Mona Sans",system-ui,sans-serif`;
const MONO = `"DM Mono","JetBrains Mono",ui-monospace,monospace`;
const EASE = [0.16, 1, 0.3, 1] as const;

// =======================
// HELPERS
// =======================
const formatUSD = (cents: number) => `$${(cents / 100).toFixed(2)}`;

// =======================
// CART DRAWER
// =======================
export function CartDrawer() {
  const {
    items,
    isDrawerOpen,
    closeDrawer,
    removeItem,
    updateQuantity,
    getItemCount,
    getSubtotalUSDCents,
  } = useCartStore();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const itemCount = getItemCount();
  const subtotalCents = getSubtotalUSDCents();

  return (
    <Drawer
      anchor="right"
      open={isDrawerOpen}
      onClose={closeDrawer}
      PaperProps={{
        sx: {
          width: { xs: "100vw", sm: 420 },
          display: "flex",
          flexDirection: "column",
          background: T.bgSection,
          fontFamily: SANS,
        },
      }}
    >
      {/* HEADER */}
      <Box
        sx={{
          px: 3,
          py: 2.25,
          borderBottom: `1px solid ${T.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
          <CartIcon sx={{ fontSize: "1.2rem", color: T.primary }} />
          <Typography sx={{ fontFamily: SANS, fontWeight: 700, fontSize: "1rem", color: T.ink }}>
            Your Cart
          </Typography>
          {mounted && itemCount > 0 && (
            <Box
              sx={{
                px: "8px",
                py: "2px",
                borderRadius: "100px",
                border: `1px solid ${T.primary}`,
              }}
            >
              <Typography
                sx={{ fontFamily: MONO, fontSize: "0.6rem", color: T.primary, fontWeight: 700 }}
              >
                {itemCount}
              </Typography>
            </Box>
          )}
        </Box>

        <Box
          onClick={closeDrawer}
          sx={{
            width: 32,
            height: 32,
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            border: `1px solid ${T.border}`,
            "&:hover": { background: T.bg },
            transition: "background 0.15s",
          }}
        >
          <CloseIcon sx={{ fontSize: "0.95rem", color: T.inkFaint }} />
        </Box>
      </Box>

      {/* ITEMS */}
      <Box sx={{ flex: 1, overflowY: "auto", px: 2.5, py: 2.5 }}>
        <AnimatePresence initial={false}>
          {items.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: EASE }}
            >
              <Box sx={{ textAlign: "center", mt: 10, px: 3 }}>
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: "50%",
                    background: T.bg,
                    border: `1px solid ${T.border}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mx: "auto",
                    mb: 2.5,
                  }}
                >
                  <EmptyCartIcon sx={{ fontSize: "1.6rem", color: T.primary }} />
                </Box>
                <Typography sx={{ fontFamily: SANS, fontWeight: 700, fontSize: "1rem", color: T.ink, mb: 0.75 }}>
                  Your cart is empty
                </Typography>
                <Typography sx={{ fontFamily: SANS, fontSize: "0.875rem", color: T.inkFaint, mb: 3, lineHeight: 1.7 }}>
                  Browse our templates and add something you love.
                </Typography>
                <Box
                  component={Link}
                  href="/templates"
                  onClick={closeDrawer}
                  sx={{
                    display: "inline-block",
                    px: 3,
                    py: 1.25,
                    borderRadius: "10px",
                    background: T.primary,
                    color: "#fff",
                    fontFamily: SANS,
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    textDecoration: "none",
                  }}
                >
                  Browse Templates
                </Box>
              </Box>
            </motion.div>
          ) : (
            <Stack spacing={1.75}>
              <AnimatePresence initial={false}>
                {items.map((item) => (
                  <motion.div
                    key={item.templateId}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.25, ease: EASE }}
                  >
                    <CartItemRow
                      item={item}
                      onRemove={() => removeItem(item.templateId)}
                      onUpdateQty={(q) => updateQuantity(item.templateId, q)}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </Stack>
          )}
        </AnimatePresence>
      </Box>

      {/* FOOTER */}
      {items.length > 0 && (
        <Box sx={{ px: 2.5, py: 2.5, borderTop: `1px solid ${T.border}`, background: T.bgSection, flexShrink: 0 }}>
          {/* Subtotal */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography sx={{ fontFamily: SANS, fontSize: "0.875rem", color: T.inkMuted }}>
              Subtotal
            </Typography>
            <Typography sx={{ fontFamily: MONO, fontWeight: 700, fontSize: "1.125rem", color: T.ink }}>
              {formatUSD(subtotalCents)}
            </Typography>
          </Box>

          {/* Checkout */}
          <Box
            component={Link}
            href="/checkout"
            onClick={closeDrawer}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
              width: "100%",
              py: 1.625,
              borderRadius: "12px",
              background: T.primary,
              color: "#fff",
              fontFamily: SANS,
              fontWeight: 700,
              fontSize: "0.9375rem",
              textDecoration: "none",
              "&:hover": { filter: "brightness(1.05)" },
            }}
          >
            Proceed to Checkout
          </Box>

          <Typography sx={{ fontFamily: SANS, fontSize: "0.72rem", color: T.inkFaint, textAlign: "center", mt: 1.5 }}>
            Taxes calculated at checkout
          </Typography>
        </Box>
      )}
    </Drawer>
  );
}

// =======================
// CART ITEM ROW
// =======================
function CartItemRow({
  item,
  onRemove,
  onUpdateQty,
}: {
  item: CartItem & { template: CartTemplate };
  onRemove: () => void;
  onUpdateQty: (qty: number) => void;
}) {
  const { template, quantity } = item;
  const unitCents = template.sale_price_usd_cents ?? template.price_usd_cents;
  const lineCents = unitCents * quantity;

  const image = template.images?.find((i) => i.is_primary) ?? template.images?.[0];

  return (
    <Box sx={{ display: "flex", gap: 2, p: 2, background: T.bgSection, border: `1px solid ${T.border}`, borderRadius: "12px", position: "relative" }}>
      {/* IMAGE */}
      <Box sx={{ width: 60, height: 60, borderRadius: "8px", overflow: "hidden", background: T.bg, flexShrink: 0, border: `1px solid ${T.border}` }}>
        {image ? (
          <img src={image.url} alt={image.alt_text ?? template.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <Box sx={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.25rem", color: T.inkFaint }}>
            ◈
          </Box>
        )}
      </Box>

      {/* INFO */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography sx={{ fontFamily: SANS, fontWeight: 600, fontSize: "0.875rem", color: T.ink, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {template.name}
        </Typography>

        {template.category && (
          <Typography sx={{ fontFamily: MONO, fontSize: "0.55rem", color: T.primary, letterSpacing: "0.08em", mt: 0.25 }}>
            {template.category.name}
          </Typography>
        )}

        {/* QTY + PRICE */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 1.25 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0, border: `1px solid ${T.border}`, borderRadius: "8px", overflow: "hidden" }}>
            <Box component="button" onClick={() => onUpdateQty(quantity - 1)} sx={{ width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", background: "transparent", border: "none", cursor: "pointer", fontFamily: MONO, fontSize: "0.85rem", color: T.inkMuted, "&:hover": { background: T.bg, color: T.ink } }}>−</Box>
            <Typography sx={{ fontFamily: MONO, fontSize: "0.75rem", color: T.ink, fontWeight: 600, px: 1, minWidth: 20, textAlign: "center" }}>{quantity}</Typography>
            <Box component="button" onClick={() => onUpdateQty(quantity + 1)} sx={{ width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", background: "transparent", border: "none", cursor: "pointer", fontFamily: MONO, fontSize: "0.85rem", color: T.inkMuted, "&:hover": { background: T.bg, color: T.ink } }}>+</Box>
          </Box>

          <Typography sx={{ fontFamily: MONO, fontWeight: 700, fontSize: "0.9rem", color: T.ink }}>
            {formatUSD(lineCents)}
          </Typography>
        </Box>
      </Box>

      {/* REMOVE */}
      <Box component="button" onClick={onRemove} sx={{ position: "absolute", top: 10, right: 10, width: 26, height: 26, borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", background: "transparent", border: "none", cursor: "pointer", color: T.inkFaint, "&:hover": { background: "#FEE2E2", color: "#B91C1C" } }}>
        <DeleteIcon sx={{ fontSize: "0.9rem" }} />
      </Box>
    </Box>
  );
}