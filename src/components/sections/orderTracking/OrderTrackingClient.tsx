"use client";

import { useState, useRef, useCallback } from "react";
import { Box, Container, Typography } from "@mui/material";
import {
  Search as SearchIcon,
  Download as DownloadIcon,
  CheckCircle as ApprovedIcon,
  HourglassEmpty as PendingIcon,
  Cancel as RejectedIcon,
} from "@mui/icons-material";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useOrderLookup, useDownloadOrder } from "@/lib/hooks/useOrderTracking";
import { useCurrency } from "@/lib/hooks/useCurrency";
import {
  orderTrackingSchema,
  type OrderTrackingFormValues,
} from "@/lib/schemas/orderTracking.schema";
import {
  generateOrderTrackingParams,
  formatDate,
} from "@/lib/utils/formatters";
import type { Order, OrderStatus } from "@/types/order.types";

/* ══ TOKENS ══════════════════════════════════════════════ */
const T = {
  ink: "#0C0E12",
  inkMid: "#1C2333",
  inkMuted: "#3D4860",
  inkFaint: "#64748B",
  inkGhost: "#94A3B8",
  white: "#FFFFFF",
  offwhite: "#F9F8F5",
  cream: "#F0EDE6",
  parchment: "#E8E4DA",
  border: "#E2DED5",
  borderMd: "#C8C3B8",
  gold: "#B8922A",
  goldMid: "#C9A84C",
  goldLight: "#DDB96A",
  goldGlow: "rgba(184,146,42,0.10)",
  sage: "#5C7A5C",
  sageLight: "rgba(92,122,92,0.10)",
  sageBdr: "rgba(92,122,92,0.22)",
  error: "#DC2626",
  errorLight: "rgba(220,38,38,0.08)",
  errorBdr: "rgba(220,38,38,0.2)",
  amber: "#B45309",
  amberLight: "rgba(180,83,9,0.08)",
  amberBdr: "rgba(180,83,9,0.2)",
  blue: "#1D4ED8",
  blueLight: "rgba(29,78,216,0.08)",
  blueBdr: "rgba(29,78,216,0.2)",
  slateLight: "rgba(100,116,139,0.08)",
  slateBdr: "rgba(100,116,139,0.18)",
};
const SERIF = '"Instrument Serif","Playfair Display",Georgia,serif';
const SANS = '"DM Sans","Mona Sans",system-ui,sans-serif';
const MONO = '"DM Mono","JetBrains Mono",ui-monospace,monospace';
const EASE = [0.16, 1, 0.3, 1] as const;

/* ── Status map ───────────────────────────────────────── */
const STATUS: Record<
  OrderStatus,
  {
    label: string;
    icon: string;
    color: string;
    bg: string;
    bdr: string;
    desc: string;
  }
> = {
  pending: {
    label: "Pending Review",
    icon: "◷",
    color: T.amber,
    bg: T.amberLight,
    bdr: T.amberBdr,
    desc: "Awaiting admin review.",
  },
  processing: {
    label: "Processing",
    icon: "◈",
    color: T.blue,
    bg: T.blueLight,
    bdr: T.blueBdr,
    desc: "Your order is being processed.",
  },
  approved: {
    label: "Approved",
    icon: "✓",
    color: T.sage,
    bg: T.sageLight,
    bdr: T.sageBdr,
    desc: "Download is available below.",
  },
  rejected: {
    label: "Rejected",
    icon: "✕",
    color: T.error,
    bg: T.errorLight,
    bdr: T.errorBdr,
    desc: "Please contact support.",
  },
  refunded: {
    label: "Refunded",
    icon: "↩",
    color: T.inkFaint,
    bg: T.slateLight,
    bdr: T.slateBdr,
    desc: "This order has been refunded.",
  },
};

/* ══ SEARCH FORM ═════════════════════════════════════════ */
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
    formState: { errors },
  } = useForm<OrderTrackingFormValues>({
    resolver: zodResolver(orderTrackingSchema),
  });
  const [focused, setFocused] = useState(false);

  return (
    <Box component="form" onSubmit={handleSubmit(onSearch)}>
      <Box
        sx={{
          display: "flex",
          gap: 2,
          flexWrap: { xs: "wrap", sm: "nowrap" },
          p: 2.5,
          background: T.white,
          borderRadius: "16px",
          border: `1px solid ${focused ? T.borderMd : T.border}`,
          transition: "border-color 0.15s, box-shadow 0.15s",
          boxShadow: focused
            ? "0 0 0 3px rgba(12,14,18,0.05)"
            : "0 2px 12px rgba(12,14,18,0.05)",
        }}
      >
        {/* Search input */}
        <Box sx={{ flex: 1, display: "flex", alignItems: "center", gap: 1.25 }}>
          <SearchIcon
            sx={{ fontSize: "1rem", color: T.inkGhost, flexShrink: 0 }}
          />
          <Box
            component="input"
            {...register("identifier")}
            placeholder="Email address or order number (MRK-XXXXXX)"
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
              py: "4px",
              "&::placeholder": { color: T.inkGhost },
              "&:disabled": { cursor: "not-allowed" },
            }}
          />
        </Box>
        {/* Submit */}
        <motion.button
          type="submit"
          disabled={isLoading}
          whileHover={isLoading ? {} : { scale: 1.02 }}
          whileTap={isLoading ? {} : { scale: 0.98 }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            flexShrink: 0,
            padding: "10px 22px",
            borderRadius: "10px",
            border: "none",
            background: isLoading
              ? T.parchment
              : `linear-gradient(115deg,${T.goldLight},${T.gold})`,
            cursor: isLoading ? "not-allowed" : "pointer",
            outline: "none",
            boxShadow: isLoading ? "none" : "0 4px 16px rgba(184,146,42,0.24)",
            transition: "box-shadow 0.15s",
            width: { xs: "100%", sm: "auto" } as any,
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
                border: `2px solid ${T.border}`,
                borderTopColor: T.gold,
              }}
            />
          ) : (
            <SearchIcon sx={{ fontSize: "0.9rem", color: T.ink }} />
          )}
          <Typography
            sx={{
              fontFamily: SANS,
              fontWeight: 600,
              fontSize: "0.875rem",
              color: isLoading ? T.inkFaint : T.ink,
              whiteSpace: "nowrap",
            }}
          >
            {isLoading ? "Searching…" : "Track Order"}
          </Typography>
        </motion.button>
      </Box>
      {errors.identifier && (
        <Typography
          sx={{
            fontFamily: SANS,
            fontSize: "0.8125rem",
            color: T.error,
            mt: 1,
            ml: 1,
          }}
        >
          {errors.identifier.message}
        </Typography>
      )}
    </Box>
  );
}

/* ══ ORDER CARD ══════════════════════════════════════════ */
function OrderCard({
  order,
  onDownload,
  isDownloading,
  format,
}: {
  order: Order;
  onDownload: () => void;
  isDownloading: boolean;
  format: (n: number, c?: any) => string;
}) {
  const st = STATUS[order.status];
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 260, damping: 28 });
  const sy = useSpring(my, { stiffness: 260, damping: 28 });
  const rx = useTransform(sy, [-0.5, 0.5], ["3deg", "-3deg"]);
  const ry = useTransform(sx, [-0.5, 0.5], ["-3deg", "3deg"]);
  const gX = useTransform(sx, [-0.5, 0.5], ["10%", "90%"]);
  const gY = useTransform(sy, [-0.5, 0.5], ["10%", "90%"]);

  const onMove = useCallback(
    (e: React.MouseEvent) => {
      const r = ref.current?.getBoundingClientRect();
      if (!r) return;
      mx.set((e.clientX - r.left) / r.width - 0.5);
      my.set((e.clientY - r.top) / r.height - 0.5);
    },
    [mx, my],
  );
  const onLeave = useCallback(() => {
    mx.set(0);
    my.set(0);
  }, [mx, my]);

  const isApproved = order.status === "approved";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.52, ease: EASE }}
      style={{ perspective: 1200, marginBottom: 20 }}
    >
      <motion.div
        ref={ref}
        style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        whileHover={{ z: 8 }}
      >
        <Box
          sx={{
            background: T.white,
            borderRadius: "18px",
            border: `1px solid ${isApproved ? T.sageBdr : T.border}`,
            overflow: "hidden",
            position: "relative",
            boxShadow: isApproved
              ? `0 4px 24px ${T.sageLight}`
              : "0 2px 14px rgba(12,14,18,0.05)",
            transition: "border-color 0.2s, box-shadow 0.2s",
            "&:hover": {
              borderColor: isApproved ? T.sageBdr : `${st.bdr}`,
              boxShadow: `0 12px 40px rgba(12,14,18,0.09)`,
            },
          }}
        >
          {/* Specular highlight */}
          <motion.div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "18px",
              pointerEvents: "none",
              zIndex: 1,
              background: `radial-gradient(circle at ${gX} ${gY}, ${T.goldGlow} 0%, transparent 62%)`,
            }}
          />

          {/* ── Header strip ── */}
          <Box
            sx={{
              px: { xs: 3, md: 4 },
              py: 2.25,
              background: T.offwhite,
              borderBottom: `1px solid ${T.border}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontFamily: MONO,
                  fontSize: "0.5rem",
                  letterSpacing: "0.16em",
                  color: T.inkGhost,
                  textTransform: "uppercase",
                  mb: 0.25,
                }}
              >
                Order Number
              </Typography>
              <Typography
                sx={{
                  fontFamily: MONO,
                  fontWeight: 700,
                  fontSize: "1.125rem",
                  color: T.ink,
                  letterSpacing: "0.04em",
                }}
              >
                {order.orderNumber}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Typography
                sx={{
                  fontFamily: MONO,
                  fontSize: "0.58rem",
                  letterSpacing: "0.08em",
                  color: T.inkGhost,
                }}
              >
                {formatDate(order.createdAt)}
              </Typography>
              {/* Status pill */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.875,
                  px: "10px",
                  py: "5px",
                  borderRadius: "5px",
                  background: st.bg,
                  border: `1px solid ${st.bdr}`,
                }}
              >
                <Typography
                  sx={{
                    fontFamily: MONO,
                    fontSize: "0.6rem",
                    color: st.color,
                    lineHeight: 1,
                  }}
                >
                  {st.icon}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: MONO,
                    fontSize: "0.52rem",
                    letterSpacing: "0.12em",
                    color: st.color,
                    textTransform: "uppercase",
                  }}
                >
                  {st.label}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* ── Status banner ── */}
          <Box
            sx={{
              px: { xs: 3, md: 4 },
              py: 1.5,
              background: st.bg,
              borderBottom: `1px solid ${T.border}`,
              display: "flex",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            <Box
              sx={{
                width: 4,
                height: 4,
                borderRadius: "50%",
                background: st.color,
                boxShadow: isApproved ? `0 0 8px ${T.sage}66` : "none",
              }}
            >
              {isApproved && (
                <motion.div
                  animate={{ scale: [1, 1.8, 1], opacity: [1, 0, 1] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  style={{
                    width: 4,
                    height: 4,
                    borderRadius: "50%",
                    background: T.sage,
                  }}
                />
              )}
            </Box>
            <Typography
              sx={{
                fontFamily: SANS,
                fontSize: "0.875rem",
                color: st.color,
                fontWeight: 500,
              }}
            >
              {st.desc}
            </Typography>
          </Box>

          {/* ── Body ── */}
          <Box
            sx={{
              px: { xs: 3, md: 4 },
              py: 3,
              position: "relative",
              zIndex: 1,
            }}
          >
            {/* Items */}
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}
            >
              <Box
                sx={{
                  width: 2,
                  height: 12,
                  borderRadius: "2px",
                  background: `linear-gradient(180deg,${T.goldLight},${T.gold})`,
                }}
              />
              <Typography
                sx={{
                  fontFamily: MONO,
                  fontSize: "0.54rem",
                  letterSpacing: "0.16em",
                  color: T.inkGhost,
                  textTransform: "uppercase",
                }}
              >
                Items Ordered
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1.25,
                mb: 3,
              }}
            >
              {order.items.map((item, i) => (
                <Box
                  key={i}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    p: "12px 16px",
                    borderRadius: "10px",
                    background: T.offwhite,
                    border: `1px solid ${T.border}`,
                  }}
                >
                  <Box>
                    <Typography
                      sx={{
                        fontFamily: SANS,
                        fontWeight: 500,
                        fontSize: "0.875rem",
                        color: T.ink,
                      }}
                    >
                      {item.templateName}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: MONO,
                        fontSize: "0.5rem",
                        letterSpacing: "0.1em",
                        color: T.inkGhost,
                        textTransform: "uppercase",
                        mt: 0.25,
                      }}
                    >
                      Qty: {item.quantity} · {item.templateSlug}
                    </Typography>
                  </Box>
                  <Typography
                    sx={{
                      fontFamily: SERIF,
                      fontStyle: "italic",
                      fontSize: "1rem",
                      color: T.ink,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {format(item.price * item.quantity)}
                  </Typography>
                </Box>
              ))}
            </Box>

            {/* Divider */}
            <Box sx={{ height: "1px", background: T.border, mb: 3 }} />

            {/* Totals + CTA */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
                {[
                  { label: "Subtotal", val: format(order.subtotal), dim: true },
                  ...(order.discount > 0
                    ? [
                        {
                          label: "Discount",
                          val: `−${format(order.discount)}`,
                          dim: false,
                          green: true,
                        },
                      ]
                    : []),
                ].map((r) => (
                  <Box
                    key={r.label}
                    sx={{
                      display: "flex",
                      gap: 3,
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: SANS,
                        fontSize: "0.875rem",
                        color: T.inkFaint,
                      }}
                    >
                      {r.label}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: SANS,
                        fontSize: "0.875rem",
                        fontWeight: 500,
                        color: (r as any).green ? T.sage : T.inkFaint,
                      }}
                    >
                      {r.val}
                    </Typography>
                  </Box>
                ))}
                <Box
                  sx={{
                    display: "flex",
                    gap: 3,
                    justifyContent: "space-between",
                    pt: 0.5,
                    borderTop: `1px solid ${T.border}`,
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: SANS,
                      fontSize: "0.9375rem",
                      fontWeight: 600,
                      color: T.ink,
                    }}
                  >
                    Total
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: SERIF,
                      fontStyle: "italic",
                      fontSize: "1.375rem",
                      color: T.ink,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {format(order.total)}
                  </Typography>
                </Box>
              </Box>

              {order.downloadAvailable && isApproved && (
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Box
                    component="button"
                    onClick={onDownload}
                    disabled={isDownloading}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.25,
                      px: 3,
                      py: 1.5,
                      borderRadius: "11px",
                      border: "none",
                      background: isDownloading
                        ? T.parchment
                        : `linear-gradient(115deg,${T.sage},#2d6a3f)`,
                      cursor: isDownloading ? "not-allowed" : "pointer",
                      outline: "none",
                      boxShadow: isDownloading
                        ? "none"
                        : "0 5px 18px rgba(92,122,92,0.30)",
                      transition: "box-shadow 0.18s",
                    }}
                  >
                    {isDownloading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        style={{
                          width: 14,
                          height: 14,
                          borderRadius: "50%",
                          border: `2px solid rgba(92,122,92,0.3)`,
                          borderTopColor: T.sage,
                        }}
                      />
                    ) : (
                      <DownloadIcon sx={{ fontSize: "1rem", color: T.white }} />
                    )}
                    <Typography
                      sx={{
                        fontFamily: SANS,
                        fontWeight: 600,
                        fontSize: "0.9375rem",
                        color: isDownloading ? T.inkFaint : T.white,
                      }}
                    >
                      {isDownloading ? "Downloading…" : "Download Files"}
                    </Typography>
                  </Box>
                </motion.div>
              )}
            </Box>

            {/* Customer info footer */}
            <Box
              sx={{
                mt: 2.5,
                pt: 2.5,
                borderTop: `1px solid ${T.border}`,
                display: "flex",
                gap: 4,
                flexWrap: "wrap",
              }}
            >
              {[
                { label: "Ordered by", val: order.customerDetails.name },
                { label: "Email", val: order.customerDetails.email },
                ...(order.approvedAt
                  ? [
                      {
                        label: "Approved on",
                        val: formatDate(order.approvedAt),
                        green: true,
                      },
                    ]
                  : []),
              ].map((f) => (
                <Box key={f.label}>
                  <Typography
                    sx={{
                      fontFamily: MONO,
                      fontSize: "0.48rem",
                      letterSpacing: "0.14em",
                      color: T.inkGhost,
                      textTransform: "uppercase",
                      mb: 0.25,
                    }}
                  >
                    {f.label}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: SANS,
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      color: (f as any).green ? T.sage : T.inkMid,
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
    </motion.div>
  );
}

/* ══ EMPTY STATE ═════════════════════════════════════════ */
function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: EASE }}
    >
      <Box
        sx={{
          textAlign: "center",
          py: 10,
          background: T.white,
          borderRadius: "18px",
          border: `1px solid ${T.border}`,
        }}
      >
        <Typography
          sx={{
            fontFamily: MONO,
            fontSize: "2.5rem",
            color: T.border,
            mb: 2,
            lineHeight: 1,
          }}
        >
          ◈
        </Typography>
        <Typography
          sx={{
            fontFamily: SERIF,
            fontStyle: "italic",
            fontSize: "1.5rem",
            color: T.ink,
            mb: 1,
          }}
        >
          No orders found.
        </Typography>
        <Typography
          sx={{
            fontFamily: SANS,
            fontSize: "0.9rem",
            color: T.inkFaint,
            maxWidth: 320,
            mx: "auto",
            lineHeight: 1.7,
          }}
        >
          Double-check your email address or order number (MRK-XXXXXX).
        </Typography>
      </Box>
    </motion.div>
  );
}

/* ══ PAGE ════════════════════════════════════════════════ */
export function OrderTrackingClient() {
  const [queryParams, setQueryParams] = useState<{
    email?: string;
    orderNumber?: string;
  } | null>(null);
  const [searchEnabled, setSearchEnabled] = useState(false);

  const { data, isLoading, isError } = useOrderLookup(
    queryParams ?? {},
    searchEnabled && !!queryParams,
  );
  const downloadMutation = useDownloadOrder();
  const { format } = useCurrency();
  const orders = data?.data ?? [];

  const onSearch = (values: OrderTrackingFormValues) => {
    const params = generateOrderTrackingParams(values.identifier);
    setQueryParams(params);
    setSearchEnabled(true);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: T.offwhite,
        fontFamily: SANS,
        pt: { xs: 10, md: 16 },
        pb: 14,
      }}
    >
      <Container maxWidth="md">
        {/* ── Hero ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: EASE }}
        >
          <Box sx={{ mb: 5 }}>
            {/* Eyebrow */}
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}
            >
              <Box
                sx={{
                  width: 24,
                  height: "1px",
                  background: `linear-gradient(90deg,${T.gold},${T.goldLight})`,
                }}
              />
              <Typography
                sx={{
                  fontFamily: MONO,
                  fontSize: "0.54rem",
                  letterSpacing: "0.22em",
                  color: T.goldMid || T.goldLight,
                  textTransform: "uppercase",
                }}
              >
                Order Management
              </Typography>
            </Box>
            <Typography
              sx={{
                fontFamily: SERIF,
                fontStyle: "italic",
                fontWeight: 400,
                fontSize: { xs: "2.25rem", md: "3.25rem" },
                color: T.ink,
                letterSpacing: "-0.03em",
                lineHeight: 1.05,
                mb: 1.5,
              }}
            >
              Track your{" "}
              <Box
                component="span"
                sx={{
                  background: `linear-gradient(115deg,${T.goldLight},${T.gold})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                order.
              </Box>
            </Typography>
            <Typography
              sx={{
                fontFamily: SANS,
                fontSize: "0.9375rem",
                color: T.inkFaint,
                lineHeight: 1.75,
                maxWidth: 420,
              }}
            >
              Enter your email or order number to check your status and download
              your templates.
            </Typography>
          </Box>
        </motion.div>

        {/* ── Search form ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5, ease: EASE }}
        >
          <Box sx={{ mb: 5 }}>
            <SearchForm onSearch={onSearch} isLoading={isLoading} />
          </Box>
        </motion.div>

        {/* ── Results ── */}
        <AnimatePresence mode="wait">
          {searchEnabled && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {isError && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      px: 3,
                      py: 2,
                      borderRadius: "12px",
                      background: T.errorLight,
                      border: `1px solid ${T.errorBdr}`,
                      mb: 3,
                    }}
                  >
                    <Box
                      sx={{
                        width: 4,
                        height: 4,
                        borderRadius: "50%",
                        background: T.error,
                        flexShrink: 0,
                      }}
                    />
                    <Typography
                      sx={{
                        fontFamily: SANS,
                        fontSize: "0.875rem",
                        color: T.error,
                      }}
                    >
                      Failed to fetch orders. Please check your input and try
                      again.
                    </Typography>
                  </Box>
                </motion.div>
              )}
              {!isLoading && !isError && orders.length === 0 && <EmptyState />}
              {orders.map((order, i) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.45, ease: EASE }}
                >
                  <OrderCard
                    order={order}
                    onDownload={() =>
                      downloadMutation.mutate(order.orderNumber)
                    }
                    isDownloading={downloadMutation.isPending}
                    format={format}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </Box>
  );
}
