"use client";

import { useState, useCallback } from "react";
import { Box, Container, Typography } from "@mui/material";
import {
  Download as DownloadIcon,
  Mail as MailIcon,
  Tag as TagIcon,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  orderTrackingSchema,
  type OrderTrackingFormValues,
} from "@/lib/schemas/orderTracking.schema";
import { formatDate } from "@/lib/utils/formatters";
import {
  lookupOrderByNumber,
  getOrdersByEmail,
  getDownloadsByEmail,
  initiateDownload,
} from "@/lib/api/tracking";
import type { Order, OrderWithItems, OrderStatus } from "@/types/order.types";

function toOrderWithItems(order: Order | OrderWithItems): OrderWithItems {
  return { items: [], ...order } as OrderWithItems;
}

const T = {
  bg: "#F5F7FB",
  bgSection: "#F5F7FB",
  surface: "#FFFFFF",
  ink: "#253957",
  inkDark: "#253957",
  inkMid: "#253957",
  inkMuted: "#4a6282",
  inkFaint: "#7a96b2",
  border: "rgba(37,57,87,0.08)",
  borderMid: "rgba(37,57,87,0.14)",
  accent: "#253957",
  accentLight: "#eef1f6",
  accentBdr: "rgba(37,57,87,0.22)",
  accentGlow: "rgba(37,57,87,0.10)",
  accentGrad: "linear-gradient(135deg, #253957 0%, #4a6282 100%)",
  amber: "#B45309",
  amberBg: "rgba(180,83,9,0.07)",
  amberBdr: "rgba(180,83,9,0.18)",
  purple: "#6D28D9",
  purpleBg: "rgba(109,40,217,0.07)",
  purpleBdr: "rgba(109,40,217,0.18)",
  green: "#0D7A5F",
  greenBg: "rgba(13,122,95,0.07)",
  greenBdr: "rgba(13,122,95,0.2)",
  greenGrad: "linear-gradient(135deg, #0D7A5F 0%, #14B88A 100%)",
  red: "#B91C1C",
  redBg: "rgba(185,28,28,0.07)",
  redBdr: "rgba(185,28,28,0.18)",
  slate: "#475569",
  slateBg: "rgba(71,85,105,0.07)",
  slateBdr: "rgba(71,85,105,0.18)",
};

const SANS = '"DM Sans", "Mona Sans", system-ui, sans-serif';
const MONO = '"DM Mono", ui-monospace, monospace';
const EASE = [0.16, 1, 0.3, 1] as const;

function centsToUSD(cents: number): string {
  return `$${(cents / 100).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

const STATUS_CONFIG: Record<
  OrderStatus,
  {
    label: string;
    color: string;
    bg: string;
    bdr: string;
    step: number;
    desc: string;
  }
> = {
  pending: {
    label: "Pending",
    color: T.amber,
    bg: T.amberBg,
    bdr: T.amberBdr,
    step: 1,
    desc: "Your order has been placed and is awaiting processing.",
  },
  payment_initiated: {
    label: "Payment Initiated",
    color: T.accent,
    bg: T.accentLight,
    bdr: T.accentBdr,
    step: 1,
    desc: "Payment has been initiated. Please complete the payment.",
  },
  payment_processing: {
    label: "Processing Payment",
    color: T.accent,
    bg: T.accentLight,
    bdr: T.accentBdr,
    step: 2,
    desc: "Your payment is being processed. This usually takes a moment.",
  },
  paid: {
    label: "Paid",
    color: T.purple,
    bg: T.purpleBg,
    bdr: T.purpleBdr,
    step: 2,
    desc: "Payment received. Your order is pending admin review.",
  },
  admin_review: {
    label: "Under Review",
    color: T.accent,
    bg: T.accentLight,
    bdr: T.accentBdr,
    step: 2,
    desc: "Our team is reviewing your order. You'll be notified once approved.",
  },
  approved: {
    label: "Approved",
    color: T.green,
    bg: T.greenBg,
    bdr: T.greenBdr,
    step: 3,
    desc: "Your order is approved and your download is ready.",
  },
  rejected: {
    label: "Rejected",
    color: T.red,
    bg: T.redBg,
    bdr: T.redBdr,
    step: 0,
    desc: "Your order was rejected. Please contact support for assistance.",
  },
  failed: {
    label: "Payment Failed",
    color: T.red,
    bg: T.redBg,
    bdr: T.redBdr,
    step: 0,
    desc: "Payment failed. Please try again or contact support.",
  },
  cancelled: {
    label: "Cancelled",
    color: T.slate,
    bg: T.slateBg,
    bdr: T.slateBdr,
    step: 0,
    desc: "This order has been cancelled.",
  },
  refunded: {
    label: "Refunded",
    color: T.slate,
    bg: T.slateBg,
    bdr: T.slateBdr,
    step: 0,
    desc: "This order has been refunded.",
  },
};

const STEPS = ["Order Placed", "Under Review", "Ready to Download"];

function OrderProgress({ status }: { status: OrderStatus }) {
  const cfg = STATUS_CONFIG[status];
  const activeStep = cfg.step;
  if (activeStep === 0) return null;

  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        {STEPS.map((label, i) => {
          const stepNum = i + 1;
          const done = stepNum < activeStep;
          const active = stepNum === activeStep;
          return (
            <Box
              key={i}
              sx={{
                display: "flex",
                alignItems: "center",
                flex: i < STEPS.length - 1 ? 1 : "none",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 0.75,
                }}
              >
                <Box
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: done || active ? T.accent : T.border,
                    border: `2px solid ${done || active ? T.accent : T.border}`,
                    transition: "all 0.3s",
                    position: "relative",
                  }}
                >
                  {done ? (
                    <Typography sx={{ fontFamily: MONO, fontSize: "0.6rem", color: "#fff" }}>
                      ✓
                    </Typography>
                  ) : active ? (
                    <>
                      <Box sx={{ width: 8, height: 8, borderRadius: "50%", background: "#fff" }} />
                      <motion.div
                        animate={{ scale: [1, 1.6, 1], opacity: [0.6, 0, 0.6] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        style={{
                          position: "absolute",
                          inset: -4,
                          borderRadius: "50%",
                          border: `2px solid ${T.accent}`,
                          pointerEvents: "none",
                        }}
                      />
                    </>
                  ) : (
                    <Box sx={{ width: 6, height: 6, borderRadius: "50%", background: T.inkFaint }} />
                  )}
                </Box>
                <Typography
                  sx={{
                    fontFamily: SANS,
                    fontSize: "0.6875rem",
                    color: active || done ? T.ink : T.inkFaint,
                    fontWeight: active ? 600 : 400,
                    whiteSpace: "nowrap",
                  }}
                >
                  {label}
                </Typography>
              </Box>
              {i < STEPS.length - 1 && (
                <Box
                  sx={{
                    flex: 1,
                    height: 2,
                    mx: 1,
                    mb: "18px",
                    background: done ? T.accent : T.border,
                    borderRadius: 1,
                    transition: "background 0.3s",
                  }}
                />
              )}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

function OrderCard({
  order,
  resolvedEmail,
  downloadToken = "",
}: {
  order: OrderWithItems;
  resolvedEmail: string;
  downloadToken?: string;
}) {
  const cfg = STATUS_CONFIG[order.status];
  const isApproved = order.status === "approved";
  const canDownload = isApproved && order.downloads_enabled;
  const [downloading, setDownloading] = useState(false);

  const handleDownload = useCallback(async () => {
    if (!downloadToken) return;
    setDownloading(true);
    try {
      initiateDownload(downloadToken, resolvedEmail || order.customer_email);
    } finally {
      setTimeout(() => setDownloading(false), 800);
    }
  }, [downloadToken, resolvedEmail, order.customer_email]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: EASE }}
    >
      <Box
        sx={{
          background: T.surface,
          borderRadius: "14px",
          border: `1px solid ${isApproved ? T.greenBdr : T.border}`,
          overflow: "hidden",
          boxShadow: isApproved
            ? "0 4px 32px rgba(13,122,95,0.1)"
            : `0 2px 16px ${T.accentGlow}`,
          mb: 2.5,
          position: "relative",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "3px",
            background: isApproved ? T.greenGrad : T.accentGrad,
          }}
        />

        <Box
          sx={{
            px: { xs: 2.5, md: 3.5 },
            py: 2,
            background: T.bg,
            borderBottom: `1px solid ${T.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 1.5,
            mt: "3px",
          }}
        >
          <Box>
            <Typography
              sx={{
                fontFamily: MONO,
                fontSize: "0.48rem",
                letterSpacing: "0.14em",
                color: T.inkFaint,
                textTransform: "uppercase",
                mb: 0.25,
              }}
            >
              Order
            </Typography>
            <Typography
              sx={{
                fontFamily: MONO,
                fontWeight: 700,
                fontSize: "1rem",
                color: T.ink,
                letterSpacing: "0.04em",
              }}
            >
              {order.order_number}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Typography sx={{ fontFamily: MONO, fontSize: "0.56rem", color: T.inkFaint }}>
              {formatDate(order.created_at)}
            </Typography>
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.75,
                px: "10px",
                py: "4px",
                borderRadius: "100px",
                background: cfg.bg,
                border: `1px solid ${cfg.bdr}`,
              }}
            >
              <Box
                sx={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: cfg.color,
                  flexShrink: 0,
                  position: "relative",
                }}
              >
                {isApproved && (
                  <motion.div
                    animate={{ scale: [1, 2.2, 1], opacity: [1, 0, 1] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                    style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: "50%",
                      background: T.green,
                    }}
                  />
                )}
              </Box>
              <Typography
                sx={{
                  fontFamily: MONO,
                  fontSize: "0.5rem",
                  letterSpacing: "0.1em",
                  color: cfg.color,
                  textTransform: "uppercase",
                }}
              >
                {cfg.label}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box sx={{ px: { xs: 2.5, md: 3.5 }, py: 3 }}>
          <OrderProgress status={order.status} />

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.25,
              px: 2,
              py: 1.5,
              borderRadius: "8px",
              background: cfg.bg,
              border: `1px solid ${cfg.bdr}`,
              mb: 3,
            }}
          >
            <Typography
              sx={{ fontFamily: SANS, fontSize: "0.875rem", color: cfg.color, fontWeight: 500 }}
            >
              {cfg.desc}
            </Typography>
          </Box>

          {order.items && order.items.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography
                sx={{
                  fontFamily: MONO,
                  fontSize: "0.48rem",
                  letterSpacing: "0.14em",
                  color: T.inkFaint,
                  textTransform: "uppercase",
                  mb: 1.5,
                }}
              >
                Items
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {order.items.map((item) => (
                  <Box
                    key={item.id}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      px: 2,
                      py: 1.5,
                      borderRadius: "8px",
                      background: T.bg,
                      border: `1px solid ${T.border}`,
                    }}
                  >
                    <Box>
                      <Typography
                        sx={{ fontFamily: SANS, fontWeight: 500, fontSize: "0.875rem", color: T.ink }}
                      >
                        {item.template_name}
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: MONO,
                          fontSize: "0.5rem",
                          letterSpacing: "0.08em",
                          color: T.inkFaint,
                          mt: 0.25,
                        }}
                      >
                        {item.file_format
                          ? item.file_format.toUpperCase()
                          : `v${item.template_version}`}
                        {item.file_size_mb != null && ` · ${item.file_size_mb} MB`}
                      </Typography>
                    </Box>
                    <Typography
                      sx={{ fontFamily: MONO, fontWeight: 600, fontSize: "0.9rem", color: T.inkMid }}
                    >
                      {centsToUSD(item.price_usd_cents)}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          )}

          <Box
            sx={{
              pt: 2.5,
              borderTop: `1px solid ${T.border}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Box>
              {order.discount_amount_usd_cents > 0 && (
                <Box sx={{ display: "flex", gap: 2, mb: 0.5 }}>
                  <Typography sx={{ fontFamily: SANS, fontSize: "0.8125rem", color: T.inkFaint }}>
                    Discount
                  </Typography>
                  <Typography sx={{ fontFamily: SANS, fontSize: "0.8125rem", color: T.inkMuted }}>
                    −{centsToUSD(order.discount_amount_usd_cents)}
                  </Typography>
                </Box>
              )}
              <Box sx={{ display: "flex", alignItems: "baseline", gap: 1.5 }}>
                <Typography sx={{ fontFamily: SANS, fontSize: "0.8125rem", color: T.inkFaint }}>
                  Total
                </Typography>
                <Typography
                  sx={{
                    fontFamily: MONO,
                    fontWeight: 700,
                    fontSize: "1.375rem",
                    color: T.ink,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {centsToUSD(order.total_amount_usd_cents)}
                </Typography>
              </Box>
            </Box>

            {canDownload && downloadToken && (
              <motion.button
                onClick={handleDownload}
                disabled={downloading}
                whileHover={downloading ? {} : { scale: 1.02 }}
                whileTap={downloading ? {} : { scale: 0.98 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "12px 22px",
                  borderRadius: "10px",
                  border: "none",
                  background: downloading ? "#E5E7EB" : T.accent,
                  cursor: downloading ? "not-allowed" : "pointer",
                  boxShadow: downloading ? "none" : `0 4px 16px ${T.accentGlow}`,
                  transition: "box-shadow 0.2s",
                }}
              >
                {downloading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: "50%",
                      border: "2px solid #D1D5DB",
                      borderTopColor: T.accent,
                    }}
                  />
                ) : (
                  <DownloadIcon sx={{ fontSize: "1rem", color: "#fff" }} />
                )}
                <Typography
                  sx={{
                    fontFamily: SANS,
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    color: downloading ? T.inkFaint : "#fff",
                  }}
                >
                  {downloading ? "Opening…" : "Download Files"}
                </Typography>
              </motion.button>
            )}

            {!isApproved &&
              order.status !== "rejected" &&
              order.status !== "failed" &&
              order.status !== "cancelled" &&
              order.status !== "refunded" && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    px: 2,
                    py: 1.25,
                    borderRadius: "8px",
                    background: T.accentLight,
                    border: `1px solid ${T.accentBdr}`,
                  }}
                >
                  <Typography sx={{ fontFamily: SANS, fontSize: "0.8125rem", color: T.accent }}>
                    Download unlocks once approved
                  </Typography>
                </Box>
              )}
          </Box>

          <Box
            sx={{
              mt: 2.5,
              pt: 2,
              borderTop: `1px solid ${T.border}`,
              display: "flex",
              gap: 3.5,
              flexWrap: "wrap",
            }}
          >
            {[
              { label: "Customer", val: order.customer_name },
              { label: "Email", val: order.customer_email },
              ...(order.status === "approved" && order.admin_reviewed_at
                ? [{ label: "Approved", val: formatDate(order.admin_reviewed_at), hi: true }]
                : []),
              ...(order.status === "paid"
                ? [{ label: "Paid", val: formatDate(order.updated_at) }]
                : []),
            ]
              .filter((f) => f.val)
              .map((f) => (
                <Box key={f.label}>
                  <Typography
                    sx={{
                      fontFamily: MONO,
                      fontSize: "0.46rem",
                      letterSpacing: "0.14em",
                      color: T.inkFaint,
                      textTransform: "uppercase",
                      mb: 0.25,
                    }}
                  >
                    {f.label}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: SANS,
                      fontSize: "0.8125rem",
                      fontWeight: 500,
                      color: (f as { hi?: boolean }).hi ? T.green : T.inkMid,
                    }}
                  >
                    {f.val}
                  </Typography>
                </Box>
              ))}
          </Box>
        </Box>
      </Box>
    </motion.div>
  );
}

function SearchForm({
  onSearch,
  isLoading,
}: {
  onSearch: (v: OrderTrackingFormValues) => void;
  isLoading: boolean;
}) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<OrderTrackingFormValues>({
    resolver: zodResolver(orderTrackingSchema),
  });

  const val = watch("identifier") ?? "";
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  const isOrder = /^MRK-/i.test(val);
  const [focused, setFocused] = useState(false);

  return (
    <Box component="form" onSubmit={handleSubmit(onSearch)}>
      <Box
        sx={{
          display: "flex",
          gap: 1.5,
          flexWrap: { xs: "wrap", sm: "nowrap" },
          background: T.surface,
          borderRadius: "12px",
          border: `1.5px solid ${focused ? T.accent : T.border}`,
          transition: "border-color 0.18s, box-shadow 0.18s",
          boxShadow: focused
            ? `0 0 0 3px ${T.accentGlow}`
            : "0 2px 12px rgba(37,57,87,0.05)",
          p: 1.5,
        }}
      >
        <Box sx={{ flex: 1, display: "flex", alignItems: "center", gap: 1.25, px: 1 }}>
          {isEmail ? (
            <MailIcon sx={{ fontSize: "0.9rem", color: T.accent, flexShrink: 0 }} />
          ) : isOrder ? (
            <TagIcon sx={{ fontSize: "0.9rem", color: T.accent, flexShrink: 0 }} />
          ) : (
            <Box
              sx={{
                width: 14,
                height: 14,
                borderRadius: "50%",
                flexShrink: 0,
                border: `1.5px solid ${focused ? T.accent : T.inkFaint}`,
                transition: "border-color 0.18s",
              }}
            />
          )}
          <Box
            component="input"
            {...register("identifier")}
            placeholder="Email or order number (MRK-XXXXXX)"
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            disabled={isLoading}
            sx={{
              flex: 1,
              border: "none",
              outline: "none",
              background: "transparent",
              fontFamily: SANS,
              fontSize: "0.9375rem",
              color: T.ink,
              py: "6px",
              "&::placeholder": { color: T.inkFaint },
              "&:disabled": { opacity: 0.5 },
            }}
          />
        </Box>

        <motion.button
          type="submit"
          disabled={isLoading}
          whileHover={!isLoading ? { scale: 1.02 } : {}}
          whileTap={!isLoading ? { scale: 0.98 } : {}}
          style={{
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "11px 22px",
            borderRadius: "9px",
            border: "none",
            background: isLoading ? "#E5E7EB" : T.accent,
            cursor: isLoading ? "not-allowed" : "pointer",
            boxShadow: isLoading ? "none" : `0 4px 14px ${T.accentGlow}`,
          }}
        >
          {isLoading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              style={{
                width: 14,
                height: 14,
                borderRadius: "50%",
                border: "2px solid #D1D5DB",
                borderTopColor: T.accent,
              }}
            />
          ) : (
            <Box sx={{ width: 14, height: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <circle cx="5.5" cy="5.5" r="4" stroke="white" strokeWidth="1.5" />
                <path d="M9 9l2.5 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </Box>
          )}
          <Typography
            sx={{
              fontFamily: SANS,
              fontWeight: 600,
              fontSize: "0.9rem",
              color: isLoading ? T.inkFaint : "#fff",
              whiteSpace: "nowrap",
            }}
          >
            {isLoading ? "Searching…" : "Track Order"}
          </Typography>
        </motion.button>
      </Box>

      {errors.identifier && (
        <Typography sx={{ fontFamily: SANS, fontSize: "0.8rem", color: T.red, mt: 1, ml: 0.5 }}>
          {errors.identifier.message}
        </Typography>
      )}
      <Typography sx={{ fontFamily: SANS, fontSize: "0.75rem", color: T.inkFaint, mt: 1, ml: 0.5 }}>
        Enter your email to see all orders, or paste an order number like MRK-ABC123
      </Typography>
    </Box>
  );
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: EASE }}
    >
      <Box
        sx={{
          textAlign: "center",
          py: 8,
          background: T.surface,
          borderRadius: "14px",
          border: `1px solid ${T.border}`,
          boxShadow: `0 2px 16px ${T.accentGlow}`,
        }}
      >
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            background: T.accentLight,
            border: `1px solid ${T.accentBdr}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mx: "auto",
            mb: 2,
          }}
        >
          <Typography sx={{ fontFamily: MONO, fontSize: "1.25rem", color: T.accent, lineHeight: 1 }}>
            ◈
          </Typography>
        </Box>
        <Typography
          sx={{ fontFamily: SANS, fontWeight: 600, fontSize: "1.0625rem", color: T.ink, mb: 0.75 }}
        >
          No orders found
        </Typography>
        <Typography
          sx={{
            fontFamily: SANS,
            fontSize: "0.875rem",
            color: T.inkFaint,
            maxWidth: 300,
            mx: "auto",
            lineHeight: 1.7,
          }}
        >
          Double-check your email or order number. Orders use the format MRK-XXXXXX.
        </Typography>
      </Box>
    </motion.div>
  );
}

export function OrderTrackingClient() {
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [resolvedEmail, setResolvedEmail] = useState("");
  const [tokenMap, setTokenMap] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const onSearch = useCallback(
    async (values: OrderTrackingFormValues) => {
      const { identifier } = values;
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);

      setLoading(true);
      setError(null);
      setSearched(false);
      setOrders([]);
      setTokenMap({});

      try {
        if (isEmail) {
          setResolvedEmail(identifier);

          const [ordersRes, downloadsRes] = await Promise.allSettled([
            getOrdersByEmail(identifier, 1, 20),
            getDownloadsByEmail(identifier),
          ]);

          const fetchedOrders =
            ordersRes.status === "fulfilled" ? (ordersRes.value.orders ?? []) : [];
          setOrders(fetchedOrders.map(toOrderWithItems));

          if (downloadsRes.status === "fulfilled") {
            const map: Record<number, string> = {};
            for (const dt of downloadsRes.value.downloads ?? []) {
              map[dt.order_id] = dt.token;
            }
            setTokenMap(map);
          }
        } else {
          if (!resolvedEmail) {
            setError("Please search by email first, then you can look up a specific order number.");
            return;
          }
          const order = await lookupOrderByNumber(identifier, resolvedEmail);
          setOrders(order ? [toOrderWithItems(order)] : []);
        }
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
      } finally {
        setLoading(false);
        setSearched(true);
      }
    },
    [resolvedEmail],
  );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${T.bg} 0%, ${T.accentLight} 100%)`,
        fontFamily: SANS,
        pt: { xs: 10, md: 14 },
        pb: 14,
      }}
    >
      <Container maxWidth="sm">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          <Box sx={{ mb: 6 }}>
            <Typography
              sx={{
                fontFamily: MONO,
                fontSize: "0.58rem",
                letterSpacing: "0.18em",
                color: T.inkMuted,
                textTransform: "uppercase",
                mb: 1.5,
              }}
            >
              Order Tracking
            </Typography>
            <Typography
              sx={{
                fontFamily: SANS,
                fontWeight: 800,
                fontSize: { xs: "2rem", md: "3rem" },
                color: T.ink,
                letterSpacing: "-0.03em",
                lineHeight: 1.08,
                mb: 1,
              }}
            >
              Track your{" "}
              <Box
                component="span"
                sx={{
                  background: T.accentGrad,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                order.
              </Box>
            </Typography>
            <Typography
              sx={{ fontFamily: SANS, fontSize: "0.9375rem", color: T.inkMuted, lineHeight: 1.75, maxWidth: 380 }}
            >
              Check your order status and download your templates once approved.
            </Typography>
          </Box>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.45, ease: EASE }}
        >
          <Box sx={{ mb: 5 }}>
            <SearchForm onSearch={onSearch} isLoading={loading} />
          </Box>
        </motion.div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div key="error" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  px: 2.5,
                  py: 1.75,
                  borderRadius: "10px",
                  background: T.redBg,
                  border: `1px solid ${T.redBdr}`,
                  mb: 3,
                }}
              >
                <Box sx={{ width: 5, height: 5, borderRadius: "50%", background: T.red, flexShrink: 0 }} />
                <Typography sx={{ fontFamily: SANS, fontSize: "0.875rem", color: T.red }}>
                  {error}
                </Typography>
              </Box>
            </motion.div>
          )}

          {searched && !loading && !error && orders.length === 0 && (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <EmptyState />
            </motion.div>
          )}

          {orders.length > 0 && (
            <motion.div key="orders" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2.5 }}>
                <Typography
                  sx={{ fontFamily: SANS, fontWeight: 600, fontSize: "0.875rem", color: T.inkMid, flexShrink: 0 }}
                >
                  {orders.length} order{orders.length > 1 ? "s" : ""} found
                </Typography>
                <Box sx={{ flex: 1, height: "1px", background: T.border }} />
              </Box>

              {orders.map((order, i) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07, duration: 0.4, ease: EASE }}
                >
                  <OrderCard order={order} resolvedEmail={resolvedEmail} downloadToken={tokenMap[order.id] ?? ""} />
                </motion.div>
              ))}

              <Box sx={{ mt: 1, py: 3, textAlign: "center", borderTop: `1px solid ${T.border}` }}>
                <Typography sx={{ fontFamily: SANS, fontSize: "0.8125rem", color: T.inkFaint }}>
                  Need help?{" "}
                  <Box
                    component="a"
                    href="mailto:info@merrakisolutions.com"
                    sx={{
                      color: T.accent,
                      textDecoration: "none",
                      fontWeight: 500,
                      "&:hover": { textDecoration: "underline" },
                    }}
                  >
                    Contact support
                  </Box>
                </Typography>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </Box>
  );
}