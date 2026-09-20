"use client";

import { useState, useCallback, useRef } from "react";
import {
  Box,
  Container,
  Typography,
  InputBase,
  CircularProgress,
  Skeleton,
} from "@mui/material";
import {
  trackOrder,
  downloadOrderFiles,
  isEmail,
  isOrderNumber,
  centsToUSD,
  formatDate,
  type Order,
  type OrderStatus,
} from "@/lib/api/ordertrack";

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS: Record<
  OrderStatus,
  {
    label: string;
    step: number;
    color: string;
    bg: string;
    border: string;
    desc: string;
  }
> = {
  pending: {
    label: "Pending",
    step: 1,
    color: "#92400E",
    bg: "#FFFBEB",
    border: "#FDE68A",
    desc: "We've received your order and are waiting for payment confirmation.",
  },
  paid: {
    label: "Under review",
    step: 2,
    color: "#1E40AF",
    bg: "#EFF6FF",
    border: "#BFDBFE",
    desc: "Payment confirmed. Our team is reviewing your order.",
  },
  approved: {
    label: "Approved",
    step: 3,
    color: "#065F46",
    bg: "#ECFDF5",
    border: "#6EE7B7",
    desc: "Your order is approved and ready to download.",
  },
  failed: {
    label: "Failed",
    step: 0,
    color: "#991B1B",
    bg: "#FEF2F2",
    border: "#FECACA",
    desc: "Payment was unsuccessful. Please try placing a new order.",
  },
  refunded: {
    label: "Refunded",
    step: 0,
    color: "#475569",
    bg: "#F8FAFC",
    border: "#E2E8F0",
    desc: "This order has been refunded.",
  },
  cancelled: {
    label: "Cancelled",
    step: 0,
    color: "#475569",
    bg: "#F8FAFC",
    border: "#E2E8F0",
    desc: "This order was cancelled.",
  },
  rejected: {
    label: "Rejected",
    step: 0,
    color: "#991B1B",
    bg: "#FEF2F2",
    border: "#FECACA",
    desc: "This order was not approved. Contact support for details.",
  },
};

const STEPS = ["Order placed", "Under review", "Ready to download"];

// ─── Step bar ─────────────────────────────────────────────────────────────────

function StepBar({ status }: { status: OrderStatus }) {
  const cfg = STATUS[status];
  const active = cfg.step;
  if (active === 0) return null;

  return (
    <Box sx={{ display: "flex", alignItems: "flex-start", mb: 3 }}>
      {STEPS.map((label, i) => {
        const stepNum = i + 1;
        const done = stepNum < active;
        const current = stepNum === active;
        const isLast = i === STEPS.length - 1;

        return (
          <Box
            key={i}
            sx={{
              display: "flex",
              alignItems: "flex-start",
              flex: isLast ? "none" : 1,
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
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "2px solid",
                  borderColor: done || current ? "#1E293B" : "#E2E8F0",
                  bgcolor: done || current ? "#1E293B" : "#fff",
                  flexShrink: 0,
                }}
              >
                {done ? (
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path
                      d="M2 5l2 2 4-4"
                      stroke="#fff"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      bgcolor: current ? "#fff" : "#CBD5E1",
                    }}
                  />
                )}
              </Box>
              <Typography
                sx={{
                  fontSize: "0.625rem",
                  fontWeight: done || current ? 600 : 400,
                  color: done || current ? "#1E293B" : "#94A3B8",
                  whiteSpace: "nowrap",
                  lineHeight: 1,
                }}
              >
                {label}
              </Typography>
            </Box>

            {!isLast && (
              <Box
                sx={{
                  flex: 1,
                  height: "1px",
                  bgcolor: done ? "#1E293B" : "#E2E8F0",
                  mt: "11px",
                  mx: 1,
                  transition: "background-color 0.2s",
                }}
              />
            )}
          </Box>
        );
      })}
    </Box>
  );
}

// ─── Order card ───────────────────────────────────────────────────────────────

function OrderCard({ order }: { order: Order }) {
  const cfg = STATUS[order.status];
  const isApproved = order.status === "approved";
  const canDownload =
    isApproved && order.downloads_enabled && order.download_token;
  const [downloading, setDownloading] = useState(false);
  const [downloadErr, setDownloadErr] = useState<string | null>(null);

  const handleDownload = useCallback(async () => {
    if (!order.download_token) return;
    setDownloading(true);
    setDownloadErr(null);
    try {
      await downloadOrderFiles(order.download_token);
    } catch (e) {
      setDownloadErr(
        e instanceof Error ? e.message : "Download failed. Try again.",
      );
    } finally {
      setDownloading(false);
    }
  }, [order.download_token]);

  return (
    <Box
      sx={{
        bgcolor: "#fff",
        borderRadius: "12px",
        border: "1px solid",
        borderColor: isApproved ? "#6EE7B7" : "#E2E8F0",
        overflow: "hidden",
        boxShadow: isApproved
          ? "0 2px 12px rgba(16,185,129,0.08)"
          : "0 1px 4px rgba(0,0,0,0.04)",
        mb: 2,
      }}
    >
      {/* Top accent bar */}
      <Box
        sx={{ height: "2px", bgcolor: isApproved ? "#10B981" : "#1E293B" }}
      />

      {/* Header */}
      <Box
        sx={{
          px: { xs: 2.5, sm: 3 },
          py: 1.75,
          bgcolor: "#F8FAFC",
          borderBottom: "1px solid #F1F5F9",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 1.5,
        }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: "0.5625rem",
              color: "#94A3B8",
              fontWeight: 500,
              mb: 0.25,
              letterSpacing: "0.05em",
            }}
          >
            Order
          </Typography>
          <Typography
            sx={{
              fontFamily: "monospace",
              fontWeight: 700,
              fontSize: "0.875rem",
              color: "#1E293B",
            }}
          >
            {order.order_number}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Typography
            sx={{
              fontFamily: "monospace",
              fontSize: "0.6875rem",
              color: "#94A3B8",
            }}
          >
            {formatDate(order.created_at)}
          </Typography>
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.75,
              px: 1.25,
              py: 0.5,
              borderRadius: "100px",
              bgcolor: cfg.bg,
              border: "1px solid",
              borderColor: cfg.border,
            }}
          >
            <Box
              sx={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                bgcolor: cfg.color,
                flexShrink: 0,
              }}
            />
            <Typography
              sx={{
                fontSize: "0.5625rem",
                fontWeight: 700,
                color: cfg.color,
                letterSpacing: "0.04em",
              }}
            >
              {cfg.label}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Body */}
      <Box sx={{ px: { xs: 2.5, sm: 3 }, py: 3 }}>
        <StepBar status={order.status} />

        {/* Status message */}
        <Box
          sx={{
            px: 2,
            py: 1.5,
            borderRadius: "8px",
            bgcolor: cfg.bg,
            border: "1px solid",
            borderColor: cfg.border,
            mb: 3,
          }}
        >
          <Typography sx={{ fontSize: "0.875rem", color: cfg.color }}>
            {cfg.desc}
          </Typography>
        </Box>

        {/* Items */}
        {order.items?.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography
              sx={{
                fontSize: "0.5625rem",
                color: "#94A3B8",
                fontWeight: 500,
                mb: 1,
                letterSpacing: "0.05em",
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
                    bgcolor: "#F8FAFC",
                    border: "1px solid #F1F5F9",
                  }}
                >
                  <Box>
                    <Typography
                      sx={{
                        fontSize: "0.875rem",
                        fontWeight: 500,
                        color: "#1E293B",
                      }}
                    >
                      {item.template_name}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: "monospace",
                        fontSize: "0.5625rem",
                        color: "#94A3B8",
                        mt: 0.25,
                      }}
                    >
                      {item.file_format
                        ? item.file_format.toUpperCase()
                        : `v${item.template_version}`}
                      {item.file_size_mb != null &&
                        ` · ${item.file_size_mb} MB`}
                    </Typography>
                  </Box>
                  <Typography
                    sx={{
                      fontFamily: "monospace",
                      fontWeight: 700,
                      fontSize: "0.875rem",
                      color: "#475569",
                    }}
                  >
                    {centsToUSD(item.price_usd_cents)}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {/* Total + Download */}
        <Box
          sx={{
            pt: 2.5,
            borderTop: "1px solid #F1F5F9",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box>
            {order.discount_amount_usd_cents > 0 && (
              <Box sx={{ display: "flex", gap: 1.5, mb: 0.5 }}>
                <Typography sx={{ fontSize: "0.8125rem", color: "#94A3B8" }}>
                  Discount
                </Typography>
                <Typography sx={{ fontSize: "0.8125rem", color: "#64748B" }}>
                  −{centsToUSD(order.discount_amount_usd_cents)}
                </Typography>
              </Box>
            )}
            <Box sx={{ display: "flex", alignItems: "baseline", gap: 1 }}>
              <Typography sx={{ fontSize: "0.8125rem", color: "#94A3B8" }}>
                Total
              </Typography>
              <Typography
                sx={{
                  fontFamily: "monospace",
                  fontWeight: 700,
                  fontSize: "1.25rem",
                  color: "#0F172A",
                  letterSpacing: "-0.02em",
                }}
              >
                {centsToUSD(order.total_amount_usd_cents)}
              </Typography>
            </Box>
          </Box>

          {canDownload ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                gap: 0.75,
              }}
            >
              <Box
                component="button"
                onClick={handleDownload}
                disabled={downloading}
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 1,
                  px: 2.5,
                  py: 1.25,
                  borderRadius: "8px",
                  border: "none",
                  bgcolor: downloading ? "#F1F5F9" : "#1E293B",
                  color: downloading ? "#94A3B8" : "#fff",
                  cursor: downloading ? "not-allowed" : "pointer",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  fontFamily: "inherit",
                  transition: "background-color 0.15s",
                  "&:hover": !downloading ? { bgcolor: "#334155" } : {},
                  "&:active": !downloading ? { transform: "scale(0.98)" } : {},
                }}
              >
                {downloading ? (
                  <CircularProgress size={14} sx={{ color: "#94A3B8" }} />
                ) : (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M7 1v8M7 9L4.5 6.5M7 9l2.5-2.5M2 12h10"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
                {downloading ? "Opening…" : "Download files"}
              </Box>
              {downloadErr && (
                <Typography sx={{ fontSize: "0.75rem", color: "#DC2626" }}>
                  {downloadErr}
                </Typography>
              )}
            </Box>
          ) : isApproved && !order.downloads_enabled ? (
            <Box
              sx={{
                px: 2,
                py: 1,
                borderRadius: "8px",
                bgcolor: "#F8FAFC",
                border: "1px solid #E2E8F0",
              }}
            >
              <Typography sx={{ fontSize: "0.75rem", color: "#94A3B8" }}>
                Downloads temporarily unavailable
              </Typography>
            </Box>
          ) : cfg.step > 0 ? (
            <Box
              sx={{
                px: 2,
                py: 1,
                borderRadius: "8px",
                bgcolor: "#F8FAFC",
                border: "1px solid #E2E8F0",
              }}
            >
              <Typography sx={{ fontSize: "0.75rem", color: "#94A3B8" }}>
                Available once approved
              </Typography>
            </Box>
          ) : null}
        </Box>

        {/* Meta row */}
        <Box
          sx={{
            mt: 2.5,
            pt: 2.5,
            borderTop: "1px solid #F1F5F9",
            display: "flex",
            flexWrap: "wrap",
            gap: "12px 24px",
          }}
        >
          {[
            { label: "Customer", val: order.customer_name },
            { label: "Email", val: order.customer_email },
            ...(order.status === "approved" && order.admin_reviewed_at
              ? [
                  {
                    label: "Approved",
                    val: formatDate(order.admin_reviewed_at),
                    highlight: true,
                  },
                ]
              : []),
          ]
            .filter((f) => f.val)
            .map((f) => (
              <Box key={f.label}>
                <Typography
                  sx={{
                    fontSize: "0.5625rem",
                    color: "#94A3B8",
                    fontWeight: 500,
                    mb: 0.25,
                    letterSpacing: "0.05em",
                  }}
                >
                  {f.label}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    color: (f as { highlight?: boolean }).highlight
                      ? "#065F46"
                      : "#475569",
                  }}
                >
                  {f.val}
                </Typography>
              </Box>
            ))}
        </Box>
      </Box>
    </Box>
  );
}

// ─── Search input ─────────────────────────────────────────────────────────────

function SearchInput({
  onSearch,
  loading,
}: {
  onSearch: (val: string) => void;
  loading: boolean;
}) {
  const [val, setVal] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = val.trim();
    if (!trimmed) {
      setErr("Enter your email or order number.");
      return;
    }
    if (!isEmail(trimmed) && !isOrderNumber(trimmed)) {
      setErr("Enter a valid email or an order number like MRK-XXXXXX.");
      return;
    }
    setErr(null);
    onSearch(trimmed);
  };

  const icon = isEmail(val) ? (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect
        x="2"
        y="4"
        width="12"
        height="9"
        rx="1.5"
        stroke="#94A3B8"
        strokeWidth="1.5"
      />
      <path
        d="M2 6l6 4 6-4"
        stroke="#94A3B8"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ) : isOrderNumber(val) ? (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M2 2h5.5l6.5 6.5-5.5 5.5L2 7.5V2z"
        stroke="#94A3B8"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="5" cy="5" r="1" fill="#94A3B8" />
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="6.5" cy="6.5" r="4" stroke="#CBD5E1" strokeWidth="1.5" />
      <path
        d="M10 10l3.5 3.5"
        stroke="#CBD5E1"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Box
        sx={{
          display: "flex",
          gap: 1.5,
          flexWrap: { xs: "wrap", sm: "nowrap" },
        }}
      >
        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            gap: 1.25,
            px: 2,
            py: 1.25,
            bgcolor: "#fff",
            border: "1.5px solid",
            borderColor: err ? "#FCA5A5" : "#E2E8F0",
            borderRadius: "10px",
            transition: "border-color 0.15s, box-shadow 0.15s",
            "&:focus-within": {
              borderColor: "#94A3B8",
              boxShadow: "0 0 0 3px rgba(148,163,184,0.15)",
            },
          }}
        >
          <Box sx={{ flexShrink: 0, display: "flex" }}>{icon}</Box>
          <InputBase
            inputRef={inputRef}
            value={val}
            onChange={(e) => {
              setVal(e.target.value);
              if (err) setErr(null);
            }}
            placeholder="Email or order number (MRK-XXXXXX)"
            disabled={loading}
            sx={{
              flex: 1,
              fontSize: "0.9375rem",
              color: "#0F172A",
              "& input::placeholder": { color: "#CBD5E1" },
            }}
          />
        </Box>

        <Box
          component="button"
          type="submit"
          disabled={loading || !val.trim()}
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 1,
            px: 3,
            py: 1.25,
            borderRadius: "10px",
            border: "none",
            bgcolor: loading || !val.trim() ? "#F1F5F9" : "#1E293B",
            color: loading || !val.trim() ? "#94A3B8" : "#fff",
            cursor: loading || !val.trim() ? "not-allowed" : "pointer",
            fontSize: "0.875rem",
            fontWeight: 600,
            fontFamily: "inherit",
            whiteSpace: "nowrap",
            flexShrink: 0,
            transition: "background-color 0.15s",
            "&:hover": !loading && val.trim() ? { bgcolor: "#334155" } : {},
          }}
        >
          {loading && <CircularProgress size={14} sx={{ color: "#94A3B8" }} />}
          {loading ? "Searching…" : "Track order"}
        </Box>
      </Box>

      <Typography
        sx={{
          fontSize: "0.75rem",
          color: err ? "#DC2626" : "#94A3B8",
          mt: 1,
          ml: 0.5,
        }}
      >
        {err ??
          "Enter your email to see all orders, or an order number like MRK-ABC123"}
      </Typography>
    </Box>
  );
}

// ─── Loading skeleton ─────────────────────────────────────────────────────────

function OrderSkeleton() {
  return (
    <Box
      sx={{
        bgcolor: "#fff",
        borderRadius: "12px",
        border: "1px solid #E2E8F0",
        overflow: "hidden",
        mb: 2,
      }}
    >
      <Skeleton variant="rectangular" height={2} sx={{ bgcolor: "#E2E8F0" }} />
      <Box
        sx={{
          px: 3,
          py: 2,
          bgcolor: "#F8FAFC",
          borderBottom: "1px solid #F1F5F9",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Skeleton width={40} height={10} sx={{ mb: 0.5 }} />
          <Skeleton width={100} height={18} />
        </Box>
        <Skeleton width={80} height={24} sx={{ borderRadius: "100px" }} />
      </Box>
      <Box sx={{ px: 3, py: 3 }}>
        <Skeleton
          width="100%"
          height={32}
          sx={{ borderRadius: "8px", mb: 2 }}
        />
        <Skeleton
          width="100%"
          height={64}
          sx={{ borderRadius: "8px", mb: 2 }}
        />
        <Skeleton width={120} height={20} />
      </Box>
    </Box>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <Box
      sx={{
        textAlign: "center",
        py: 10,
        bgcolor: "#fff",
        borderRadius: "12px",
        border: "1px solid #E2E8F0",
      }}
    >
      <Box
        sx={{
          width: 44,
          height: 44,
          borderRadius: "50%",
          bgcolor: "#F1F5F9",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mx: "auto",
          mb: 2,
        }}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="10" r="7" stroke="#94A3B8" strokeWidth="1.5" />
          <path
            d="M10 7v4m0 2.5v.25"
            stroke="#94A3B8"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </Box>
      <Typography
        sx={{
          fontWeight: 600,
          fontSize: "0.9375rem",
          color: "#1E293B",
          mb: 0.75,
        }}
      >
        No orders found
      </Typography>
      <Typography
        sx={{
          fontSize: "0.875rem",
          color: "#94A3B8",
          maxWidth: 280,
          mx: "auto",
          lineHeight: 1.65,
        }}
      >
        Double-check your email or order number. Orders use the format
        MRK-XXXXXX.
      </Typography>
    </Box>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function OrderTrackingClient() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = useCallback(async (identifier: string) => {
    setLoading(true);
    setError(null);
    setSearched(false);
    setOrders([]);

    try {
      const result = await trackOrder(identifier);
      setOrders(result);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
      setSearched(true);
    }
  }, []);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#F8FAFC",
        pt: { xs: 12, md: 16 },
        pb: 16,
      }}
    >
      <Container maxWidth="sm">
        {/* Header */}
        <Box sx={{ mb: 6 }}>
          <Typography
            variant="h1"
            sx={{
              fontWeight: 800,
              fontSize: { xs: "1.875rem", md: "2.5rem" },
              color: "#0F172A",
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              mb: 1,
            }}
          >
            Track your order
          </Typography>
          <Typography
            sx={{ fontSize: "0.9375rem", color: "#64748B", lineHeight: 1.7 }}
          >
            Check your order status and download your templates once approved.
          </Typography>
        </Box>

        {/* Search */}
        <Box sx={{ mb: 5 }}>
          <SearchInput onSearch={handleSearch} loading={loading} />
        </Box>

        {/* Error banner */}
        {error && (
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              gap: 1.5,
              px: 2.5,
              py: 2,
              borderRadius: "10px",
              bgcolor: "#FEF2F2",
              border: "1px solid #FECACA",
              mb: 3,
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              style={{ marginTop: 2, flexShrink: 0 }}
            >
              <circle cx="8" cy="8" r="6" stroke="#F87171" strokeWidth="1.5" />
              <path
                d="M8 5v4m0 2v.25"
                stroke="#F87171"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            <Typography sx={{ fontSize: "0.875rem", color: "#DC2626" }}>
              {error}
            </Typography>
          </Box>
        )}

        {/* Skeleton */}
        {loading && (
          <>
            <OrderSkeleton />
            <OrderSkeleton />
          </>
        )}

        {/* Empty state */}
        {!loading && searched && !error && orders.length === 0 && (
          <EmptyState />
        )}

        {/* Results */}
        {!loading && orders.length > 0 && (
          <>
            <Typography
              sx={{
                fontSize: "0.75rem",
                color: "#94A3B8",
                fontWeight: 500,
                mb: 2,
              }}
            >
              {orders.length} order{orders.length > 1 ? "s" : ""} found
            </Typography>

            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}

            <Box
              sx={{
                mt: 1,
                pt: 3,
                borderTop: "1px solid #E2E8F0",
                textAlign: "center",
              }}
            >
              <Typography sx={{ fontSize: "0.8125rem", color: "#94A3B8" }}>
                Need help?{" "}
                <Box
                  component="a"
                  href="mailto:info@merrakisolutions.com"
                  sx={{
                    color: "#475569",
                    fontWeight: 500,
                    textDecoration: "none",
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  Contact support
                </Box>
              </Typography>
            </Box>
          </>
        )}
      </Container>
    </Box>
  );
}
