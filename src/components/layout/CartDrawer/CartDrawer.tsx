"use client";

import { Drawer, Box, Typography, Button, Stack } from "@mui/material";
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  DeleteOutline as DeleteIcon,
  ShoppingBagOutlined as EmptyCartIcon,
  ArrowForward as ArrowIcon,
  GridView as BrowseIcon,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import type { CartItem } from "@/types/cart.types";
import { useCurrency } from "@/lib/hooks/useCurrency";
import { useCartStore } from "@/lib/stores/cartStore";

/* ── tokens ──────────────────────────────────────────────────────────── */
const T = {
  bg: "#FFFFFF",
  surface: "#F5F7FB",
  border: "rgba(10,10,20,0.08)",
  borderMid: "rgba(10,10,20,0.14)",

  ink: "#0A0A0F",
  inkMid: "#1E1E2A",
  inkMuted: "#5A5A72",
  inkFaint: "#9898AE",

  blue: "#3B7BF6",
  blueMid: "#5A92F8",
  blueLight: "#7AABFF",
  bluePale: "#EDF3FF",
  blueGlow: "rgba(59,123,246,0.18)",
  blueDim: "rgba(59,123,246,0.08)",
  blueGrad: "linear-gradient(135deg, #3B7BF6 0%, #7AABFF 100%)",

  error: "#DC2626",
  errorBg: "rgba(220,38,38,0.06)",
};

const FONT_BODY = `"DM Sans", "Mona Sans", system-ui, sans-serif`;
const FONT_MONO = `"DM Mono", "JetBrains Mono", monospace`;
const FONT_DISPLAY = `"Instrument Serif", "Playfair Display", Georgia, serif`;

/* ── Close button ─────────────────────────────────────────────────────── */
function CloseBtn({ onClick }: { onClick: () => void }) {
  return (
    <Box
      component="button"
      onClick={onClick}
      aria-label="Close cart"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 34,
        height: 34,
        flexShrink: 0,
        background: "none",
        border: `1.5px solid ${T.border}`,
        borderRadius: "8px",
        cursor: "pointer",
        transition: "all 0.15s ease",
        "&:hover": { background: T.bluePale, borderColor: T.blue },
        "&:active": { transform: "scale(0.95)" },
      }}
    >
      <Box sx={{ position: "relative", width: 12, height: 12 }}>
        {[45, -45].map((deg, i) => (
          <Box
            key={i}
            sx={{
              position: "absolute",
              top: "50%",
              left: 0,
              width: "100%",
              height: "1.5px",
              background: T.inkMid,
              borderRadius: "2px",
              transform: `rotate(${deg}deg)`,
              transformOrigin: "center",
              mt: "-0.75px",
            }}
          />
        ))}
      </Box>
    </Box>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   CART DRAWER
══════════════════════════════════════════════════════════════════════ */
export function CartDrawer() {
  const {
    items,
    isDrawerOpen,
    closeDrawer,
    removeItem,
    updateQuantity,
    getSubtotal,
    getItemCount,
  } = useCartStore();

  const { format } = useCurrency();
  const subtotal = getSubtotal();
  const itemCount = getItemCount();

  return (
    <Drawer
      anchor="right"
      open={isDrawerOpen}
      onClose={closeDrawer}
      PaperProps={{
        sx: {
          width: { xs: "100vw", sm: 420 },
          maxWidth: "100vw",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          background: T.bg,
          fontFamily: FONT_BODY,
          boxShadow: "-8px 0 48px rgba(10,10,20,0.09)",
        },
      }}
    >
      {/* ── Header ──────────────────────────────────────────────────── */}
      <Box
        sx={{
          px: 2.5,
          height: 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: `1px solid ${T.border}`,
          flexShrink: 0,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Typography
            sx={{
              fontFamily: FONT_DISPLAY,
              fontStyle: "italic",
              fontWeight: 400,
              fontSize: "1.25rem",
              letterSpacing: "-0.01em",
              color: T.ink,
              lineHeight: 1,
            }}
          >
            Your Cart
          </Typography>

          {itemCount > 0 && (
            <Box
              sx={{
                px: "8px",
                py: "2px",
                borderRadius: "5px",
                background: T.blueDim,
                border: `1px solid rgba(59,123,246,0.18)`,
                fontFamily: FONT_MONO,
                fontSize: "0.6rem",
                fontWeight: 600,
                color: T.blue,
                letterSpacing: "0.1em",
                lineHeight: 1.6,
              }}
            >
              {itemCount} {itemCount === 1 ? "ITEM" : "ITEMS"}
            </Box>
          )}
        </Box>

        <CloseBtn onClick={closeDrawer} />
      </Box>

      {/* ── Items ───────────────────────────────────────────────────── */}
      <Box sx={{ flex: 1, overflowY: "auto", px: 2.5, py: 2 }}>
        <AnimatePresence mode="popLayout">
          {items.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  pt: 8,
                  pb: 6,
                  px: 3,
                  gap: 2,
                }}
              >
                {/* Icon */}
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: "16px",
                    border: `1.5px solid ${T.border}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: T.surface,
                    mb: 0.5,
                  }}
                >
                  <EmptyCartIcon
                    sx={{ fontSize: "1.6rem", color: T.inkFaint }}
                  />
                </Box>

                <Typography
                  sx={{
                    fontFamily: FONT_DISPLAY,
                    fontStyle: "italic",
                    fontWeight: 400,
                    fontSize: "1.375rem",
                    color: T.ink,
                    letterSpacing: "-0.01em",
                  }}
                >
                  Nothing here yet
                </Typography>

                <Typography
                  sx={{
                    fontFamily: FONT_BODY,
                    fontSize: "0.875rem",
                    color: T.inkMuted,
                    lineHeight: 1.65,
                    maxWidth: 260,
                  }}
                >
                  Browse our financial templates and add them to your cart.
                </Typography>

                <Button
                  component={Link}
                  href="/templates"
                  onClick={closeDrawer}
                  disableElevation
                  endIcon={
                    <ArrowIcon sx={{ fontSize: "0.85rem !important" }} />
                  }
                  sx={{
                    mt: 1,
                    fontFamily: FONT_BODY,
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    textTransform: "none",
                    letterSpacing: "-0.01em",
                    px: 2.5,
                    py: 1.125,
                    borderRadius: "9px",
                    color: "#fff",
                    background: T.blueGrad,
                    boxShadow: `0 4px 18px ${T.blueGlow}`,
                    "&:hover": {
                      filter: "brightness(1.06)",
                      boxShadow: `0 6px 24px ${T.blueGlow}`,
                    },
                  }}
                >
                  Browse Templates
                </Button>
              </Box>
            </motion.div>
          ) : (
            <Stack spacing={1.5}>
              {items.map((item) => (
                <CartItemRow
                  key={item.templateId}
                  item={item}
                  onRemove={() => removeItem(item.templateId)}
                  onUpdateQty={(qty) => updateQuantity(item.templateId, qty)}
                  formatPrice={format}
                />
              ))}

              {/* Browse more link */}
              <Box
                sx={{
                  pt: 0.5,
                  pb: 1,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Link
                  href="/templates"
                  onClick={closeDrawer}
                  style={{ textDecoration: "none" }}
                >
                  <Box
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 0.75,
                      px: 2,
                      py: 0.875,
                      borderRadius: "8px",
                      border: `1px solid ${T.border}`,
                      transition: "all 0.15s ease",
                      "&:hover": {
                        borderColor: T.blue,
                        background: T.bluePale,
                      },
                    }}
                  >
                    <BrowseIcon
                      sx={{ fontSize: "0.85rem", color: T.inkMuted }}
                    />
                    <Typography
                      sx={{
                        fontFamily: FONT_BODY,
                        fontSize: "0.8125rem",
                        color: T.inkMuted,
                        fontWeight: 500,
                        letterSpacing: "-0.01em",
                        transition: "color 0.15s",
                        "&:hover": { color: T.blue },
                      }}
                    >
                      Browse more templates
                    </Typography>
                    <ArrowIcon
                      sx={{ fontSize: "0.75rem", color: T.inkFaint }}
                    />
                  </Box>
                </Link>
              </Box>
            </Stack>
          )}
        </AnimatePresence>
      </Box>

      {/* ── Footer ──────────────────────────────────────────────────── */}
      <AnimatePresence>
        {items.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.25 }}
          >
            <Box
              sx={{
                px: 2.5,
                pt: 2,
                pb: "max(env(safe-area-inset-bottom), 20px)",
                borderTop: `1px solid ${T.border}`,
                background: T.surface,
                flexShrink: 0,
              }}
            >
              {/* Order summary */}
              <Box
                sx={{
                  p: 2,
                  mb: 2,
                  borderRadius: "12px",
                  border: `1px solid ${T.border}`,
                  background: T.bg,
                }}
              >
                {/* Subtotal row */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 1.25,
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: FONT_BODY,
                      fontSize: "0.8125rem",
                      color: T.inkMuted,
                      fontWeight: 400,
                    }}
                  >
                    Subtotal · {itemCount} {itemCount === 1 ? "item" : "items"}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: FONT_MONO,
                      fontSize: "1.1rem",
                      fontWeight: 600,
                      color: T.ink,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {format(subtotal)}
                  </Typography>
                </Box>

                <Box sx={{ borderTop: `1px solid ${T.border}`, my: 1.25 }} />

                <Typography
                  sx={{
                    fontFamily: FONT_MONO,
                    fontSize: "0.6rem",
                    letterSpacing: "0.08em",
                    color: T.inkFaint,
                    lineHeight: 1.5,
                  }}
                >
                  Tax included · Downloads available after order approval
                </Typography>
              </Box>

              {/* CTAs */}
              <Stack spacing={1}>
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <Button
                    component={Link}
                    href="/checkout"
                    variant="contained"
                    fullWidth
                    onClick={closeDrawer}
                    disableElevation
                    endIcon={
                      <ArrowIcon sx={{ fontSize: "0.9rem !important" }} />
                    }
                    sx={{
                      fontFamily: FONT_BODY,
                      fontWeight: 600,
                      fontSize: "0.9375rem",
                      textTransform: "none",
                      letterSpacing: "-0.01em",
                      py: 1.5,
                      borderRadius: "10px",
                      minHeight: 50,
                      background: T.blueGrad,
                      color: "#fff",
                      boxShadow: `0 4px 20px ${T.blueGlow}`,
                      "&:hover": {
                        filter: "brightness(1.06)",
                        boxShadow: `0 6px 28px ${T.blueGlow}`,
                      },
                    }}
                  >
                    Proceed to Checkout
                  </Button>
                </motion.div>

                <Button
                  component={Link}
                  href="/templates"
                  variant="outlined"
                  fullWidth
                  onClick={closeDrawer}
                  disableElevation
                  startIcon={
                    <BrowseIcon sx={{ fontSize: "0.9rem !important" }} />
                  }
                  sx={{
                    fontFamily: FONT_BODY,
                    fontWeight: 500,
                    fontSize: "0.875rem",
                    textTransform: "none",
                    letterSpacing: "-0.01em",
                    py: 1.375,
                    borderRadius: "10px",
                    minHeight: 48,
                    color: T.blue,
                    borderColor: "rgba(59,123,246,0.3)",
                    background: T.bluePale,
                    "&:hover": {
                      borderColor: T.blue,
                      background: T.blueDim,
                    },
                  }}
                >
                  Browse Templates
                </Button>
              </Stack>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </Drawer>
  );
}

/* ─── Cart Item Row ──────────────────────────────────────────────────── */
interface CartItemRowProps {
  item: CartItem;
  onRemove: () => void;
  onUpdateQty: (qty: number) => void;
  formatPrice: (amount: number) => string;
}

function CartItemRow({
  item,
  onRemove,
  onUpdateQty,
  formatPrice,
}: CartItemRowProps) {
  const { template, quantity } = item;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.28, ease: "easeInOut" }}
    >
      <Box
        sx={{
          display: "flex",
          gap: 2,
          p: 2,
          borderRadius: "12px",
          border: `1px solid ${T.border}`,
          background: T.bg,
          position: "relative",
          transition: "border-color 0.15s ease, box-shadow 0.15s ease",
          "&:hover": {
            borderColor: "rgba(59,123,246,0.25)",
            boxShadow: `0 2px 16px ${T.blueDim}`,
          },
        }}
      >
        {/* Thumbnail */}
        <Box
          sx={{
            width: 68,
            height: 68,
            borderRadius: "9px",
            overflow: "hidden",
            flexShrink: 0,
            background: T.surface,
            border: `1px solid ${T.border}`,
          }}
        />

        {/* Details */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          {/* Format badge */}
          <Typography
            sx={{
              fontFamily: FONT_MONO,
              fontSize: "0.55rem",
              letterSpacing: "0.14em",
              color: T.blue,
              fontWeight: 600,
              mb: 0.4,
              display: "block",
              textTransform: "uppercase",
            }}
          >
            {template.file_url.split(".").slice(-1)[0]}
          </Typography>

          {/* Name */}
          <Typography
            sx={{
              fontFamily: FONT_BODY,
              fontWeight: 600,
              fontSize: "0.875rem",
              color: T.ink,
              letterSpacing: "-0.01em",
              lineHeight: 1.3,
              mb: 1.25,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              pr: 2,
            }}
          >
            {template.title}
          </Typography>

          {/* Qty + Price row */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {/* Quantity stepper */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                border: `1px solid ${T.border}`,
                borderRadius: "8px",
                overflow: "hidden",
                height: 30,
              }}
            >
              {[
                {
                  type: "dec",
                  icon: <RemoveIcon sx={{ fontSize: "0.75rem" }} />,
                  action: () => onUpdateQty(quantity - 1),
                },
                {
                  type: "inc",
                  icon: <AddIcon sx={{ fontSize: "0.75rem" }} />,
                  action: () => onUpdateQty(quantity + 1),
                },
              ].map(({ type, icon, action }) => (
                <Box
                  key={type}
                  component="button"
                  onClick={action}
                  sx={{
                    width: 28,
                    height: 30,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: T.inkMuted,
                    transition: "background 0.12s ease",
                    "&:hover": { background: T.bluePale, color: T.blue },
                    "&:active": { transform: "scale(0.9)" },
                  }}
                >
                  {icon}
                </Box>
              ))}
            </Box>

            {/* Price */}
            <Typography
              sx={{
                fontFamily: FONT_MONO,
                fontWeight: 600,
                fontSize: "0.9375rem",
                color: T.ink,
                letterSpacing: "-0.02em",
              }}
            >
              {formatPrice(template.price_inr * quantity)}
            </Typography>
          </Box>
        </Box>

        {/* Delete btn */}
        <Box
          component="button"
          onClick={onRemove}
          aria-label="Remove item"
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            width: 26,
            height: 26,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "none",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            color: T.inkFaint,
            transition: "all 0.15s ease",
            "&:hover": { color: T.error, background: T.errorBg },
            "&:active": { transform: "scale(0.9)" },
          }}
        >
          <DeleteIcon sx={{ fontSize: "0.9rem" }} />
        </Box>
      </Box>
    </motion.div>
  );
}
