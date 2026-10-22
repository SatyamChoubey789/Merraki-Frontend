"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Box, CircularProgress, Container, Typography } from "@mui/material";
import { Download as DownloadIcon } from "@mui/icons-material";
import {
  trackOrderById,
  requestOrderLinks,
  getDownloadLinks,
  isEmail,
  isUuid,
  formatDate,
  formatMoney,
  type TrackedOrder,
  type DownloadLinks,
} from "@/lib/api/ordertrack";
import { describeExpiry } from "@/lib/api/checkout";

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
  green: "#0D7A5F",
  greenPale: "rgba(13,122,95,0.07)",
  greenBorder: "rgba(13,122,95,0.22)",
  amber: "#B45309",
  amberPale: "rgba(180,83,9,0.07)",
  amberBorder: "rgba(180,83,9,0.22)",
  red: "#C0392B",
  redPale: "rgba(192,57,43,0.06)",
  redBorder: "rgba(192,57,43,0.22)",
} as const;

const SANS = `"DM Sans", system-ui, sans-serif`;
const MONO = `"DM Mono", ui-monospace, monospace`;

// ─── Status copy ──────────────────────────────────────────────────────────────
// Backend statuses: pending | paid | failed | refunded. (The old admin-review
// flow — approved / rejected / under review — no longer exists.)

interface StatusCfg {
  label: string;
  color: string;
  pale: string;
  border: string;
  desc: string;
}

const STATUS: Record<string, StatusCfg> = {
  pending: {
    label: "Awaiting payment",
    color: T.amber,
    pale: T.amberPale,
    border: T.amberBorder,
    desc: "We haven't received confirmation of your payment yet. If you've already paid, this page updates by itself — it can take a few minutes.",
  },
  paid: {
    label: "Paid",
    color: T.green,
    pale: T.greenPale,
    border: T.greenBorder,
    desc: "Payment confirmed. Your files are ready to download below.",
  },
  failed: {
    label: "Not completed",
    color: T.red,
    pale: T.redPale,
    border: T.redBorder,
    desc: "This order wasn't completed. You can place a new order any time.",
  },
  refunded: {
    label: "Refunded",
    color: T.inkMid,
    pale: "rgba(37,57,87,0.05)",
    border: T.borderMid,
    desc: "This order has been refunded.",
  },
};

const FALLBACK_STATUS: StatusCfg = {
  label: "Unknown",
  color: T.inkMid,
  pale: "rgba(37,57,87,0.05)",
  border: T.borderMid,
  desc: "We couldn't determine the status of this order. Please contact support.",
};

// ─── Downloads (fresh presigned links, valid ~15 minutes) ────────────────────

function Downloads({ token }: { token: string }) {
  const [links, setLinks] = useState<DownloadLinks | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setLinks(await getDownloadLinks(token));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't prepare your downloads.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading && !links) {
    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 1 }}>
        <CircularProgress size={16} sx={{ color: T.primary }} />
        <Typography sx={{ fontFamily: SANS, fontSize: "0.8125rem", color: T.inkMuted }}>
          Preparing your downloads…
        </Typography>
      </Box>
    );
  }

  if (error && !links) {
    return (
      <Box>
        <Typography sx={{ fontFamily: SANS, fontSize: "0.8125rem", color: T.red, mb: 1 }}>{error}</Typography>
        <Box
          component="button"
          onClick={load}
          sx={{
            px: 2,
            py: "8px",
            borderRadius: "9px",
            border: `1.5px solid ${T.borderMid}`,
            background: "transparent",
            color: T.ink,
            fontFamily: SANS,
            fontWeight: 600,
            fontSize: "0.8125rem",
            cursor: "pointer",
          }}
        >
          Try again
        </Box>
      </Box>
    );
  }

  if (!links) return null;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
      {links.items.map((item) => (
        <Box
          key={item.downloadUrl}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            px: 2.5,
            py: 1.75,
            borderRadius: "12px",
            border: `1px solid ${T.border}`,
            background: T.bg,
          }}
        >
          <Typography
            sx={{
              fontFamily: SANS,
              fontWeight: 600,
              fontSize: "0.875rem",
              color: T.ink,
              minWidth: 0,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {item.title}
          </Typography>
          <Box
            component="a"
            href={item.downloadUrl}
            rel="noopener noreferrer"
            sx={{
              flexShrink: 0,
              display: "inline-flex",
              alignItems: "center",
              gap: 0.75,
              px: 1.75,
              py: "8px",
              borderRadius: "9px",
              background: T.primary,
              color: "#fff",
              fontFamily: SANS,
              fontWeight: 600,
              fontSize: "0.8125rem",
              textDecoration: "none",
              transition: "filter 0.18s",
              "&:hover": { filter: "brightness(1.08)" },
            }}
          >
            <DownloadIcon sx={{ fontSize: "0.95rem" }} />
            Download
          </Box>
        </Box>
      ))}

      <Typography sx={{ fontFamily: SANS, fontSize: "0.75rem", color: T.inkMuted, lineHeight: 1.6 }}>
        These links expire in {describeExpiry(links.expiresIn)}.{" "}
        <Box
          component="button"
          onClick={load}
          disabled={loading}
          sx={{
            border: "none",
            background: "transparent",
            padding: 0,
            fontFamily: SANS,
            fontSize: "inherit",
            fontWeight: 600,
            color: T.ink,
            textDecoration: "underline",
            cursor: loading ? "wait" : "pointer",
          }}
        >
          {loading ? "Refreshing…" : "Get fresh links"}
        </Box>
      </Typography>
    </Box>
  );
}

// ─── Order card ───────────────────────────────────────────────────────────────

function OrderCard({ order }: { order: TrackedOrder }) {
  const cfg = STATUS[order.status] ?? FALLBACK_STATUS;
  const shortId = order.id.slice(0, 8).toUpperCase();
  const showDownloads = order.status === "paid" && !!order.downloadToken;

  return (
    <Box
      sx={{
        background: T.surface,
        borderRadius: "16px",
        border: `1px solid ${showDownloads ? T.greenBorder : T.borderMid}`,
        overflow: "hidden",
        mb: 2,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: { xs: 2.5, sm: 3 },
          py: 2,
          background: T.bg,
          borderBottom: `1px solid ${T.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 1.5,
        }}
      >
        <Box>
          <Typography sx={{ fontFamily: MONO, fontSize: "0.58rem", letterSpacing: "0.1em", color: T.inkFaint, textTransform: "uppercase", mb: 0.25 }}>
            Order
          </Typography>
          <Typography sx={{ fontFamily: MONO, fontWeight: 700, fontSize: "0.875rem", color: T.ink }}>
            #{shortId}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Typography sx={{ fontFamily: MONO, fontSize: "0.7rem", color: T.inkMuted }}>
            {formatDate(order.createdAt)}
          </Typography>
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.75,
              px: 1.25,
              py: 0.5,
              borderRadius: "100px",
              background: cfg.pale,
              border: `1px solid ${cfg.border}`,
            }}
          >
            <Box sx={{ width: 6, height: 6, borderRadius: "50%", background: cfg.color }} />
            <Typography sx={{ fontFamily: SANS, fontSize: "0.65rem", fontWeight: 700, color: cfg.color }}>
              {cfg.label}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ px: { xs: 2.5, sm: 3 }, py: 3 }}>
        {/* Status message */}
        <Box sx={{ px: 2, py: 1.5, borderRadius: "10px", background: cfg.pale, border: `1px solid ${cfg.border}`, mb: 3 }}>
          <Typography sx={{ fontFamily: SANS, fontSize: "0.875rem", color: cfg.color, lineHeight: 1.6 }}>
            {cfg.desc}
          </Typography>
        </Box>

        {/* Downloads */}
        {showDownloads && order.downloadToken && (
          <Box sx={{ mb: 3 }}>
            <Typography sx={{ fontFamily: MONO, fontSize: "0.58rem", letterSpacing: "0.1em", color: T.inkFaint, textTransform: "uppercase", mb: 1.25 }}>
              Your downloads
            </Typography>
            <Downloads token={order.downloadToken} />
          </Box>
        )}

        {/* Items */}
        <Typography sx={{ fontFamily: MONO, fontSize: "0.58rem", letterSpacing: "0.1em", color: T.inkFaint, textTransform: "uppercase", mb: 1 }}>
          Items
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75, mb: 2.5 }}>
          {order.items.map((item) => (
            <Box key={item.templateId} sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
              <Typography sx={{ fontFamily: SANS, fontSize: "0.875rem", color: T.ink }}>{item.title}</Typography>
              <Typography sx={{ fontFamily: MONO, fontSize: "0.8125rem", color: T.inkMid, flexShrink: 0 }}>
                {formatMoney(item.priceUsd, "USD")}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Total */}
        <Box sx={{ pt: 2, borderTop: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 2, flexWrap: "wrap" }}>
          <Typography sx={{ fontFamily: SANS, fontWeight: 700, fontSize: "0.875rem", color: T.ink }}>Total</Typography>
          <Box sx={{ textAlign: "right" }}>
            <Typography sx={{ fontFamily: MONO, fontWeight: 800, fontSize: "1.125rem", color: T.ink, letterSpacing: "-0.02em" }}>
              {formatMoney(order.totalUsd, "USD")}
            </Typography>
            {order.currencyCharged === "INR" && (
              <Typography sx={{ fontFamily: SANS, fontSize: "0.75rem", color: T.inkMuted }}>
                Charged {formatMoney(order.amountCharged, "INR")}
              </Typography>
            )}
          </Box>
        </Box>

        {/* Meta */}
        <Box sx={{ mt: 2.5, pt: 2.5, borderTop: `1px solid ${T.border}`, display: "flex", flexWrap: "wrap", gap: "12px 28px" }}>
          {[
            { label: "Customer", val: order.guestName },
            { label: "Email", val: order.guestEmail },
            ...(order.paidAt ? [{ label: "Paid", val: formatDate(order.paidAt) }] : []),
          ].map((f) => (
            <Box key={f.label}>
              <Typography sx={{ fontFamily: MONO, fontSize: "0.58rem", letterSpacing: "0.1em", color: T.inkFaint, textTransform: "uppercase", mb: 0.25 }}>
                {f.label}
              </Typography>
              <Typography sx={{ fontFamily: SANS, fontSize: "0.8125rem", fontWeight: 500, color: T.inkMid }}>{f.val}</Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

// ─── Search ───────────────────────────────────────────────────────────────────

function SearchBar({ onSearch, loading }: { onSearch: (v: string) => void; loading: boolean }) {
  const [val, setVal] = useState("");
  const disabled = loading || !val.trim();

  return (
    <Box
      component="form"
      onSubmit={(e: React.FormEvent) => {
        e.preventDefault();
        if (!disabled) onSearch(val);
      }}
    >
      <Box sx={{ display: "flex", gap: 1.5, flexWrap: { xs: "wrap", sm: "nowrap" } }}>
        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            border: `1.5px solid ${T.border}`,
            borderRadius: "10px",
            background: T.surface,
            transition: "border-color 0.18s, box-shadow 0.18s",
            "&:focus-within": { borderColor: "rgba(37,57,87,0.40)", boxShadow: "0 0 0 3px rgba(37,57,87,0.06)" },
          }}
        >
          <input
            value={val}
            onChange={(e) => setVal(e.target.value)}
            placeholder="Your email or full order ID"
            aria-label="Email or order ID"
            autoComplete="email"
            disabled={loading}
            style={{
              display: "block",
              width: "100%",
              padding: "12px 14px",
              border: "none",
              outline: "none",
              background: "transparent",
              fontFamily: SANS,
              fontSize: "0.9rem",
              color: T.ink,
              boxSizing: "border-box",
            }}
          />
        </Box>
        <Box
          component="button"
          type="submit"
          disabled={disabled}
          sx={{
            px: 3,
            py: "12px",
            borderRadius: "10px",
            border: "none",
            background: disabled ? T.bg : T.primary,
            color: disabled ? T.inkFaint : "#fff",
            fontFamily: SANS,
            fontWeight: 600,
            fontSize: "0.875rem",
            whiteSpace: "nowrap",
            cursor: disabled ? "not-allowed" : "pointer",
            outline: disabled ? `1px solid ${T.border}` : "none",
            transition: "filter 0.18s",
            "&:hover:not(:disabled)": { filter: "brightness(1.08)" },
          }}
        >
          {loading ? "Searching…" : "Find order"}
        </Box>
      </Box>
      <Typography sx={{ fontFamily: SANS, fontSize: "0.75rem", color: T.inkMuted, mt: 1, lineHeight: 1.5 }}>
        Enter the email you used at checkout and we'll send you a secure link, or paste your full order ID.
      </Typography>
    </Box>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function OrderTrackingInner() {
  const params = useSearchParams();
  const initialId = params.get("order_id"); // set by the "Download your files" button in the receipt email

  const [orders, setOrders] = useState<TrackedOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  const started = useRef(false);

  const lookupById = useCallback(async (id: string, silent = false) => {
    if (!silent) {
      setLoading(true);
      setError(null);
      setNotice(null);
    }
    try {
      setOrders(await trackOrderById(id));
    } catch (e) {
      if (!silent) setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      if (!silent) {
        setLoading(false);
        setSearched(true);
      }
    }
  }, []);

  // Opened from the email link → load that order straight away
  useEffect(() => {
    if (!initialId || started.current) return;
    started.current = true;
    if (isUuid(initialId)) {
      void lookupById(initialId);
    } else {
      setError("That order link looks incomplete. Use the button in your receipt email, or request a new link below.");
      setSearched(true);
    }
  }, [initialId, lookupById]);

  // While a single order is still pending, re-check every 8s (≈5 min max).
  // The webhook can mark it paid at any moment.
  const pendingId = orders.length === 1 && orders[0].status === "pending" ? orders[0].id : null;
  useEffect(() => {
    if (!pendingId) return;
    let tries = 0;
    const timer = setInterval(() => {
      tries += 1;
      if (tries > 40) {
        clearInterval(timer);
        return;
      }
      void lookupById(pendingId, true);
    }, 8000);
    return () => clearInterval(timer);
  }, [pendingId, lookupById]);

  const handleSearch = async (raw: string) => {
    const value = raw.trim();
    setError(null);
    setNotice(null);

    if (isEmail(value)) {
      // The backend never returns orders for an email — it emails the owner a link.
      setLoading(true);
      try {
        setNotice(await requestOrderLinks(value));
        setOrders([]);
        setSearched(false);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
      return;
    }

    if (isUuid(value)) {
      await lookupById(value);
      return;
    }

    setError("Enter the email you used at checkout, or your full order ID.");
  };

  return (
    <Box sx={{ minHeight: "100vh", background: T.bg, pt: { xs: 12, md: 16 }, pb: 16 }}>
      <Container maxWidth="sm">
        <Box sx={{ mb: 5 }}>
          <Typography
            component="h1"
            sx={{
              fontFamily: SANS,
              fontWeight: 800,
              fontSize: { xs: "1.875rem", md: "2.5rem" },
              color: T.ink,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              mb: 1,
            }}
          >
            Track your order
          </Typography>
          <Typography sx={{ fontFamily: SANS, fontSize: "0.9375rem", color: T.inkMuted, lineHeight: 1.7 }}>
            Check your order status and download your files.
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <SearchBar onSearch={handleSearch} loading={loading} />
        </Box>

        {error && (
          <Box role="alert" sx={{ px: 2.5, py: 2, borderRadius: "10px", background: T.redPale, border: `1px solid ${T.redBorder}`, mb: 3 }}>
            <Typography sx={{ fontFamily: SANS, fontSize: "0.875rem", color: T.red, lineHeight: 1.6 }}>{error}</Typography>
          </Box>
        )}

        {notice && (
          <Box role="status" sx={{ px: 2.5, py: 2, borderRadius: "10px", background: T.greenPale, border: `1px solid ${T.greenBorder}`, mb: 3 }}>
            <Typography sx={{ fontFamily: SANS, fontSize: "0.875rem", color: T.green, lineHeight: 1.6 }}>{notice}</Typography>
          </Box>
        )}

        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
            <CircularProgress size={28} sx={{ color: T.primary }} />
          </Box>
        )}

        {!loading && searched && !error && !notice && orders.length === 0 && (
          <Box sx={{ textAlign: "center", py: 8, background: T.surface, borderRadius: "16px", border: `1px solid ${T.borderMid}` }}>
            <Typography sx={{ fontFamily: SANS, fontWeight: 700, fontSize: "0.9375rem", color: T.ink, mb: 0.75 }}>
              No order found
            </Typography>
            <Typography sx={{ fontFamily: SANS, fontSize: "0.875rem", color: T.inkMuted, maxWidth: 300, mx: "auto", lineHeight: 1.65 }}>
              Check the order ID, or enter your email and we'll send you a secure link to your orders.
            </Typography>
          </Box>
        )}

        {!loading && orders.map((order) => <OrderCard key={order.id} order={order} />)}

        <Typography sx={{ fontFamily: SANS, fontSize: "0.8125rem", color: T.inkFaint, textAlign: "center", mt: 4 }}>
          Need help?{" "}
          <Box component="a" href="mailto:info@merrakisolutions.com" sx={{ color: T.inkMid, fontWeight: 500, textDecoration: "none", "&:hover": { textDecoration: "underline" } }}>
            Contact support
          </Box>
        </Typography>
      </Container>
    </Box>
  );
}

// useSearchParams() must sit inside Suspense or `next build` fails on statically rendered pages.
export function OrderTrackingClient() {
  return (
    <Suspense fallback={null}>
      <OrderTrackingInner />
    </Suspense>
  );
}