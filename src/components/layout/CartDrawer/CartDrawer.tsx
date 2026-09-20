"use client";

import { Box, Drawer, Typography, Stack } from "@mui/material";
import {
  DeleteOutline as DeleteIcon,
  ShoppingBagOutlined as EmptyCartIcon,
  Close as CloseIcon,
  ShoppingCart as CartIcon,
} from "@mui/icons-material";
import Link from "next/link";
import {
  useCartItems,
  useCartIsOpen,
  useCartActions,
  useCartSubtotalCents,
  type CartItem,
} from "@/lib/stores/useCartStore";

// ─── Brand tokens ─────────────────────────────────────────────────────────────

const T = {
  bg: "#F5F7FB",
  surface: "#FFFFFF",
  ink: "#253957",
  inkMuted: "rgba(37,57,87,0.6)",
  inkFaint: "rgba(37,57,87,0.4)",
  border: "rgba(37,57,87,0.08)",
  borderMid: "rgba(37,57,87,0.14)",
  primary: "#253957",
} as const;

const SANS = `"DM Sans", system-ui, sans-serif`;
const MONO = `"DM Mono", ui-monospace, monospace`;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatUSD(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

// ─── Cart item row ────────────────────────────────────────────────────────────

function CartItemRow({ item }: { item: CartItem }) {
  const { removeItem } = useCartActions();

  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        p: 2,
        background: T.surface,
        border: `1px solid ${T.border}`,
        borderRadius: "12px",
        position: "relative",
      }}
    >
      {/* Thumbnail — previewImage is first image url or null */}
      <Box
        sx={{
          width: 56,
          height: 56,
          borderRadius: "8px",
          overflow: "hidden",
          background: T.bg,
          flexShrink: 0,
          border: `1px solid ${T.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {item.previewImage ? (
          <img
            src={item.previewImage}
            alt={item.title}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <Typography sx={{ fontSize: "1.1rem", color: T.inkFaint }}>
            ◈
          </Typography>
        )}
      </Box>

      {/* Info */}
      <Box sx={{ flex: 1, minWidth: 0, pr: 3 }}>
        <Typography
          sx={{
            fontFamily: SANS,
            fontWeight: 600,
            fontSize: "0.875rem",
            color: T.ink,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {item.title}
        </Typography>

        <Typography
          sx={{
            fontFamily: MONO,
            fontWeight: 700,
            fontSize: "0.875rem",
            color: T.ink,
            mt: 0.75,
          }}
        >
          {formatUSD(item.priceCents)}
        </Typography>
      </Box>

      {/* Remove — id is UUID string */}
      <Box
        component="button"
        onClick={() => removeItem(item.id)}
        aria-label={`Remove ${item.title}`}
        sx={{
          position: "absolute",
          top: 10,
          right: 10,
          width: 26,
          height: 26,
          borderRadius: "6px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          color: T.inkFaint,
          transition: "background 0.15s, color 0.15s",
          "&:hover": { background: "rgba(192,57,43,0.08)", color: "#C0392B" },
        }}
      >
        <DeleteIcon sx={{ fontSize: "0.9rem" }} />
      </Box>
    </Box>
  );
}

// ─── Drawer ───────────────────────────────────────────────────────────────────

interface CartDrawerProps {
  checkoutHref?: string;
  templatesHref?: string;
}

export function CartDrawer({
  checkoutHref = "/checkout",
  templatesHref = "/templates",
}: CartDrawerProps) {
  const items = useCartItems();
  const isOpen = useCartIsOpen();
  const { closeCart } = useCartActions();
  const subtotalCents = useCartSubtotalCents();

  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={closeCart}
      PaperProps={{
        sx: {
          width: { xs: "100vw", sm: 420 },
          display: "flex",
          flexDirection: "column",
          background: T.surface,
        },
      }}
    >
      {/* Header */}
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
          <CartIcon sx={{ fontSize: "1.1rem", color: T.primary }} />
          <Typography
            sx={{
              fontFamily: SANS,
              fontWeight: 700,
              fontSize: "1rem",
              color: T.ink,
            }}
          >
            Your Cart
          </Typography>

          {items.length > 0 && (
            <Box
              sx={{
                px: "8px",
                py: "2px",
                borderRadius: "100px",
                border: `1px solid ${T.borderMid}`,
              }}
            >
              <Typography
                sx={{
                  fontFamily: MONO,
                  fontSize: "0.6rem",
                  color: T.primary,
                  fontWeight: 700,
                }}
              >
                {items.length}
              </Typography>
            </Box>
          )}
        </Box>

        <Box
          component="button"
          onClick={closeCart}
          aria-label="Close cart"
          sx={{
            width: 32,
            height: 32,
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            border: `1px solid ${T.border}`,
            background: "transparent",
            "&:hover": { background: T.bg },
          }}
        >
          <CloseIcon sx={{ fontSize: "0.9rem", color: T.inkFaint }} />
        </Box>
      </Box>

      {/* Items */}
      <Box sx={{ flex: 1, overflowY: "auto", px: 2.5, py: 2.5 }}>
        {items.length === 0 ? (
          <Box sx={{ textAlign: "center", mt: 10, px: 3 }}>
            <Box
              sx={{
                width: 60,
                height: 60,
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
              <EmptyCartIcon sx={{ fontSize: "1.5rem", color: T.primary }} />
            </Box>

            <Typography
              sx={{
                fontFamily: SANS,
                fontWeight: 700,
                fontSize: "1rem",
                color: T.ink,
                mb: 0.75,
              }}
            >
              Your cart is empty
            </Typography>

            <Typography
              sx={{
                fontFamily: SANS,
                fontSize: "0.875rem",
                color: T.inkFaint,
                mb: 3,
                lineHeight: 1.7,
              }}
            >
              Browse our templates and add something you love.
            </Typography>

            <Box
              component={Link}
              href={templatesHref}
              onClick={closeCart}
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
                transition: "filter 0.18s",
                "&:hover": { filter: "brightness(1.08)" },
              }}
            >
              Browse Templates
            </Box>
          </Box>
        ) : (
          <Stack spacing={1.5}>
            {items.map((item) => (
              <CartItemRow key={item.id} item={item} />
            ))}
          </Stack>
        )}
      </Box>

      {/* Footer */}
      {items.length > 0 && (
        <Box
          sx={{
            px: 2.5,
            py: 2.5,
            borderTop: `1px solid ${T.border}`,
            background: T.surface,
            flexShrink: 0,
          }}
        >
          {/* Subtotal */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography
              sx={{ fontFamily: SANS, fontSize: "0.875rem", color: T.inkMuted }}
            >
              Subtotal
            </Typography>
            <Typography
              sx={{
                fontFamily: MONO,
                fontWeight: 700,
                fontSize: "1.125rem",
                color: T.ink,
              }}
            >
              {formatUSD(subtotalCents)}
            </Typography>
          </Box>

          {/* Checkout CTA */}
          <Box
            component={Link}
            href={checkoutHref}
            onClick={closeCart}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              py: 1.625,
              borderRadius: "12px",
              background: T.primary,
              color: "#fff",
              fontFamily: SANS,
              fontWeight: 700,
              fontSize: "0.9375rem",
              textDecoration: "none",
              transition: "filter 0.18s",
              "&:hover": { filter: "brightness(1.08)" },
            }}
          >
            Proceed to Checkout
          </Box>

          <Typography
            sx={{
              fontFamily: SANS,
              fontSize: "0.72rem",
              color: T.inkFaint,
              textAlign: "center",
              mt: 1.5,
            }}
          >
            Secure checkout · No subscription
          </Typography>
        </Box>
      )}
    </Drawer>
  );
}