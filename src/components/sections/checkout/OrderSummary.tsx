"use client";

import { Box, Typography } from "@mui/material";
import {
  LockOutlined as LockIcon,
  FlashOnOutlined as FlashIcon,
  ReplayOutlined as RefundIcon,
} from "@mui/icons-material";
import { T, SANS, MONO, formatUSD, CartItemForCheckout } from "@/components/sections/checkout/checkout.types";

interface OrderSummaryProps {
  items: CartItemForCheckout[];
}

const TRUST = [
  { Icon: LockIcon, text: "256-bit SSL encryption" },
  { Icon: FlashIcon, text: "Instant delivery to email" },
  { Icon: RefundIcon, text: "7-day refund guarantee" },
] as const;

export function OrderSummary({ items }: OrderSummaryProps) {
  const subtotalCents = items.reduce((sum, i) => sum + i.price_usd_cents, 0);

  return (
    <Box
      sx={{
        background: T.surface,
        borderRadius: "16px",
        border: `1px solid ${T.borderMid}`,
        overflow: "hidden",
        position: "sticky",
        top: 88,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 3,
          py: 2.25,
          borderBottom: `1px solid ${T.border}`,
          background: T.bg,
        }}
      >
        <Typography
          sx={{
            fontFamily: SANS,
            fontWeight: 700,
            fontSize: "0.875rem",
            color: T.ink,
          }}
        >
          Order summary
        </Typography>
      </Box>

      {/* Items */}
      <Box sx={{ px: 3, py: 2.5, display: "flex", flexDirection: "column", gap: 2 }}>
        {items.map((item) => {
          const hasDiscount = item.price_usd_cents < item.original_price_usd_cents;
          return (
            <Box key={item.id} sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
              {/* Thumbnail */}
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: "8px",
                  flexShrink: 0,
                  border: `1px solid ${T.border}`,
                  background: T.bg,
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <Typography sx={{ fontSize: "1rem", color: T.inkFaint }}>◈</Typography>
                )}
              </Box>

              {/* Name + category */}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  sx={{
                    fontFamily: SANS,
                    fontWeight: 600,
                    fontSize: "0.8rem",
                    color: T.ink,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.name}
                </Typography>
                {item.category && (
                  <Typography
                    sx={{
                      fontFamily: SANS,
                      fontSize: "0.68rem",
                      color: T.inkFaint,
                      mt: 0.25,
                    }}
                  >
                    {item.category}
                  </Typography>
                )}
              </Box>

              {/* Price */}
              <Box sx={{ textAlign: "right", flexShrink: 0 }}>
                <Typography
                  sx={{
                    fontFamily: MONO,
                    fontWeight: 700,
                    fontSize: "0.8rem",
                    color: T.ink,
                  }}
                >
                  {formatUSD(item.price_usd_cents)}
                </Typography>
                {hasDiscount && (
                  <Typography
                    sx={{
                      fontFamily: MONO,
                      fontSize: "0.68rem",
                      color: T.inkFaint,
                      textDecoration: "line-through",
                    }}
                  >
                    {formatUSD(item.original_price_usd_cents)}
                  </Typography>
                )}
              </Box>
            </Box>
          );
        })}
      </Box>

      {/* Totals */}
      <Box
        sx={{
          px: 3,
          pt: 2,
          pb: 2.5,
          borderTop: `1px solid ${T.border}`,
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography sx={{ fontFamily: SANS, fontSize: "0.8rem", color: T.inkMuted }}>
            Subtotal
          </Typography>
          <Typography sx={{ fontFamily: MONO, fontSize: "0.8rem", fontWeight: 600, color: T.ink }}>
            {formatUSD(subtotalCents)}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography sx={{ fontFamily: SANS, fontSize: "0.8rem", color: T.inkMuted }}>
            Tax
          </Typography>
          <Typography sx={{ fontFamily: SANS, fontSize: "0.8rem", color: T.inkFaint }}>
            Included
          </Typography>
        </Box>
        <Box
          sx={{
            mt: 1,
            pt: 1.5,
            borderTop: `1px solid ${T.border}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
          }}
        >
          <Typography
            sx={{ fontFamily: SANS, fontWeight: 700, fontSize: "0.875rem", color: T.ink }}
          >
            Total
          </Typography>
          <Typography
            sx={{
              fontFamily: MONO,
              fontWeight: 800,
              fontSize: "1.25rem",
              color: T.ink,
              letterSpacing: "-0.02em",
            }}
          >
            {formatUSD(subtotalCents)}
          </Typography>
        </Box>
      </Box>

      {/* Trust badges */}
      <Box
        sx={{
          px: 3,
          py: 2,
          borderTop: `1px solid ${T.border}`,
          background: T.bg,
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        {TRUST.map(({ Icon, text }) => (
          <Box key={text} sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
            <Icon sx={{ fontSize: "0.85rem", color: T.inkMuted }} />
            <Typography sx={{ fontFamily: SANS, fontSize: "0.72rem", color: T.inkMuted }}>
              {text}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}