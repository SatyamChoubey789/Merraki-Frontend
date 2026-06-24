"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Box, Container, Typography, CircularProgress } from "@mui/material";
import Grid from "@mui/material/Grid";
import {
  LockOutlined as LockIcon,
  CheckCircle as CheckIcon,
  LocalOffer as PromoIcon,
  KeyboardArrowRight as ArrowIcon,
  Person as PersonIcon,
  Home as HomeIcon,
  Payment as PayIcon,
} from "@mui/icons-material";
import {
  motion,
  AnimatePresence,
} from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCart } from "@/lib/hooks/useCart";
import { useCheckout } from "@/lib/hooks/useCheckout";
import {
  checkoutSchema,
  type CheckoutFormValues,
} from "@/lib/schemas/checkout.schema";

const T = {
  bg: "#FFFFFF",
  bgCard: "#FFFFFF",
  bgSection: "#F5F7FB",
  ink: "#0A0A0F",
  inkMid: "#3A3A52",
  inkMuted: "#5A5A72",
  inkFaint: "#9898AE",
  border: "rgba(10,10,20,0.08)",
  borderMid: "rgba(10,10,20,0.14)",
  borderFocus: "rgba(59,123,246,0.42)",
  blue: "#3B7BF6",
  bluePale: "#EDF3FF",
  blueGlow: "rgba(59,123,246,0.18)",
  blueDim: "rgba(59,123,246,0.06)",
  blueGrad: "linear-gradient(135deg, #3B7BF6 0%, #7AABFF 100%)",
  green: "#059669",
  greenPale: "#DCFCE7",
  greenBorder: "rgba(5,150,105,0.25)",
  red: "#DC2626",
  redPale: "rgba(220,38,38,0.06)",
  redBorder: "rgba(220,38,38,0.22)",
  redMid: "#EF4444",
  amber: "#B45309",
  purple: "#6D28D9",
  teal: "#0D7A5F",
};
const SANS = '"DM Sans","Mona Sans",system-ui,sans-serif';
const MONO = '"DM Mono","JetBrains Mono",ui-monospace,monospace';
const EASE = [0.16, 1, 0.3, 1] as const;

// ── HELPERS ───────────────────────────────────────────────────────────────────
// Backend stores and charges in USD cents. Convert for display only.
function centsToUSD(cents: number): number {
  return cents / 100;
}
function formatUSD(cents: number): string {
  return `$${centsToUSD(cents).toFixed(2)}`;
}

// ── FORM FIELD ────────────────────────────────────────────────────────────────
function Field({
  label,
  error,
  hint,
  disabled,
  type = "text",
  placeholder,
  ...rest
}: {
  label: string;
  error?: string;
  hint?: string;
  disabled?: boolean;
  type?: string;
  placeholder?: string;
  [k: string]: any;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <Box>
      <Typography
        sx={{
          fontFamily: SANS,
          fontSize: "0.72rem",
          fontWeight: 600,
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          mb: 0.75,
          color: error ? T.red : focused ? T.blue : T.inkMid,
          transition: "color 0.18s",
        }}
      >
        {label}
      </Typography>
      <Box
        sx={{
          border: `1.5px solid ${error ? T.redBorder : focused ? T.borderFocus : T.border}`,
          borderRadius: "10px",
          background: T.bg,
          transition: "border-color 0.2s, box-shadow 0.2s",
          boxShadow: focused
            ? `0 0 0 3px ${error ? T.redPale : T.blueDim}`
            : "none",
        }}
      >
        <input
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: "100%",
            padding: "12px 14px",
            border: "none",
            outline: "none",
            background: "transparent",
            fontFamily: SANS,
            fontSize: "0.875rem",
            color: T.ink,
            borderRadius: "10px",
            boxSizing: "border-box",
          }}
          {...rest}
        />
      </Box>
      {(error || hint) && (
        <Typography
          sx={{
            fontFamily: SANS,
            fontSize: "0.72rem",
            color: error ? T.red : T.inkFaint,
            mt: 0.5,
            ml: 0.25,
          }}
        >
          {error || hint}
        </Typography>
      )}
    </Box>
  );
}

// ── STEP INDICATOR ────────────────────────────────────────────────────────────
const FORM_STEPS = [
  { id: "contact", label: "Contact", icon: PersonIcon },
  { id: "address", label: "Address", icon: HomeIcon },
  { id: "payment", label: "Payment", icon: PayIcon },
] as const;

function Steps({
  current,
  completed,
}: {
  current: number;
  completed: Set<number>;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        mb: 6,
      }}
    >
      {FORM_STEPS.map((step, i) => {
        const done = completed.has(i);
        const active = i === current;
        return (
          <Box key={step.id} sx={{ display: "flex", alignItems: "center" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
              <motion.div
                animate={{ scale: active ? 1.06 : 1 }}
                transition={{ type: "spring", stiffness: 380, damping: 22 }}
              >
                <Box
                  sx={{
                    width: 34,
                    height: 34,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: done ? T.green : active ? T.blueGrad : T.bgCard,
                    border: `1.5px solid ${done ? T.greenBorder : active ? "rgba(59,123,246,0.4)" : T.border}`,
                    boxShadow: active ? `0 3px 14px ${T.blueGlow}` : "none",
                    transition: "all 0.28s ease",
                  }}
                >
                  {done ? (
                    <CheckIcon sx={{ fontSize: "0.85rem", color: "#fff" }} />
                  ) : (
                    <step.icon
                      sx={{
                        fontSize: "0.78rem",
                        color: active ? "#fff" : T.inkFaint,
                      }}
                    />
                  )}
                </Box>
              </motion.div>
              <Typography
                sx={{
                  fontFamily: SANS,
                  fontWeight: 600,
                  fontSize: "0.78rem",
                  color: active ? T.ink : done ? T.green : T.inkFaint,
                  display: { xs: "none", sm: "block" },
                  transition: "color 0.25s",
                }}
              >
                {step.label}
              </Typography>
            </Box>
            {i < FORM_STEPS.length - 1 && (
              <Box
                sx={{
                  width: { xs: 24, sm: 44, md: 60 },
                  height: "1.5px",
                  mx: { xs: 0.75, sm: 1.25 },
                  borderRadius: 1,
                  background: done ? T.blueGrad : T.border,
                  transition: "background 0.35s",
                }}
              />
            )}
          </Box>
        );
      })}
    </Box>
  );
}

// ── ORDER SUMMARY ─────────────────────────────────────────────────────────────
// FIX: Uses price_usd_cents (backend field) instead of price_inr.
// All math stays in integer cents — no float arithmetic until display.
function Summary({
  items,
  discountPct,
  promoValid,
}: {
  items: any[];
  discountPct: number;
  promoValid: boolean;
}) {
  // price_usd_cents matches domain.OrderItem.PriceUSDCents
  const subtotalCents = items.reduce(
    (a: number, i: any) => a + i.template.price_usd_cents * i.quantity,
    0,
  );
  // Discount is applied on the frontend display only — backend applies
  // its own pricing authority. Promo is cosmetic here until backend
  // supports discount codes natively.
  const discountCents = promoValid
    ? Math.round(subtotalCents * (discountPct / 100))
    : 0;
  const totalCents = subtotalCents - discountCents;

  return (
    <Box
      sx={{
        background: T.bgCard,
        borderRadius: "18px",
        border: `1px solid ${T.borderMid}`,
        position: "sticky",
        top: 88,
        boxShadow: `0 8px 32px ${T.blueGlow}`,
      }}
    >
      <Box sx={{ px: 3, py: 2.5, borderBottom: `1px solid ${T.border}` }}>
        <Typography
          sx={{
            fontFamily: SANS,
            fontWeight: 700,
            fontSize: "0.9rem",
            color: T.ink,
          }}
        >
          Order Summary
        </Typography>
      </Box>
      <Box
        sx={{
          px: 3,
          py: 3,
          display: "flex",
          flexDirection: "column",
          gap: 2.5,
        }}
      >
        {items.map((item: any) => {
          const thumb =
            item.template.images?.find((i: any) => i.is_primary) ??
            item.template.images?.[0];
          return (
            <Box
              key={item.templateId}
              sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}
            >
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: "10px",
                  flexShrink: 0,
                  background: thumb ? "transparent" : T.bluePale,
                  border: `1px solid rgba(59,123,246,0.12)`,
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {thumb ? (
                  <Box
                    component="img"
                    src={thumb.url}
                    alt={item.template.name}
                    sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <Typography sx={{ fontSize: "0.85rem", color: T.blue }}>
                    ◈
                  </Typography>
                )}
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  sx={{
                    fontFamily: SANS,
                    fontWeight: 600,
                    fontSize: "0.8rem",
                    color: T.inkMid,
                    lineHeight: 1.35,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.template.name}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: SANS,
                    fontSize: "0.7rem",
                    fontWeight: 500,
                    color: T.inkFaint,
                    mt: 0.25,
                  }}
                >
                  Qty {item.quantity}
                </Typography>
              </Box>
              {/* FIX: display price from price_usd_cents */}
              <Typography
                sx={{
                  fontFamily: SANS,
                  fontWeight: 600,
                  fontSize: "0.8rem",
                  color: T.inkMid,
                  flexShrink: 0,
                }}
              >
                {formatUSD(item.template.price_usd_cents * item.quantity)}
              </Typography>
            </Box>
          );
        })}
      </Box>
      <Box sx={{ px: 3, pb: 3, borderTop: `1px solid ${T.border}` }}>
        <Box sx={{ pt: 2.5, display: "flex", flexDirection: "column", gap: 1 }}>
          <SumRow label="Subtotal" value={formatUSD(subtotalCents)} />
          {promoValid && discountCents > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <SumRow
                label={`Promo (${discountPct}% off)`}
                value={`−${formatUSD(discountCents)}`}
                green
              />
            </motion.div>
          )}
          <SumRow label="Tax" value="Included" faint />
          <Box sx={{ height: "1px", background: T.border, my: 0.75 }} />
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
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
              Total
            </Typography>
            <Typography
              sx={{
                fontFamily: SANS,
                fontWeight: 800,
                fontSize: "1.375rem",
                color: T.ink,
                letterSpacing: "-0.03em",
              }}
            >
              {formatUSD(totalCents)}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          px: 3,
          py: 2,
          borderTop: `1px solid ${T.border}`,
          background: T.bgSection,
          borderRadius: "0 0 18px 18px",
          display: "flex",
          flexDirection: "column",
          gap: 0.875,
        }}
      >
        {[
          { icon: "🔒", text: "256-bit SSL encryption" },
          { icon: "⚡", text: "Instant delivery to email" },
          { icon: "↩️", text: "7-day refund guarantee" },
        ].map((b) => (
          <Box
            key={b.text}
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <Typography sx={{ fontSize: "0.68rem" }}>{b.icon}</Typography>
            <Typography
              sx={{ fontFamily: SANS, fontSize: "0.72rem", color: T.inkMuted }}
            >
              {b.text}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

function SumRow({
  label,
  value,
  green,
  faint,
}: {
  label: string;
  value: string;
  green?: boolean;
  faint?: boolean;
}) {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
      <Typography
        sx={{
          fontFamily: SANS,
          fontSize: "0.8rem",
          color: green ? T.green : T.inkMuted,
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          fontFamily: SANS,
          fontSize: "0.8rem",
          fontWeight: 600,
          color: green ? T.green : faint ? T.inkFaint : T.inkMid,
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}

// ── PROMO ─────────────────────────────────────────────────────────────────────
function Promo({
  onApply,
}: {
  onApply: (code: string, pct: number, ok: boolean) => void;
}) {
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<
    "idle" | "checking" | "valid" | "invalid"
  >("idle");
  const [open, setOpen] = useState(false);
  const apply = async () => {
    if (!code.trim()) return;
    setStatus("checking");
    await new Promise((r) => setTimeout(r, 600));
    const ok = code.toUpperCase() === "MERRAKI20";
    setStatus(ok ? "valid" : "invalid");
    onApply(code, ok ? 20 : 0, ok);
  };
  return (
    <Box sx={{ mb: 3 }}>
      <Box
        onClick={() => setOpen((v) => !v)}
        sx={{
          display: "inline-flex",
          alignItems: "center",
          gap: 0.75,
          cursor: "pointer",
        }}
      >
        <PromoIcon sx={{ fontSize: "0.82rem", color: T.blue }} />
        <Typography
          sx={{
            fontFamily: SANS,
            fontSize: "0.8rem",
            color: T.inkMuted,
            "&:hover": { color: T.blue },
            transition: "color 0.15s",
          }}
        >
          Have a promo code?
        </Typography>
        <motion.span
          animate={{ rotate: open ? 90 : 0 }}
          transition={{ duration: 0.2 }}
          style={{ display: "inline-flex" }}
        >
          <ArrowIcon sx={{ fontSize: "0.75rem", color: T.inkFaint }} />
        </motion.span>
      </Box>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            style={{ overflow: "hidden" }}
          >
            <Box sx={{ mt: 1.5, display: "flex", gap: 1 }}>
              <Box
                sx={{
                  flex: 1,
                  border: `1.5px solid ${status === "valid" ? T.greenBorder : status === "invalid" ? T.redBorder : T.border}`,
                  borderRadius: "10px",
                  overflow: "hidden",
                }}
              >
                <input
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value);
                    setStatus("idle");
                  }}
                  placeholder="e.g. MERRAKI20"
                  style={{
                    width: "100%",
                    padding: "10px 13px",
                    border: "none",
                    outline: "none",
                    background: "transparent",
                    fontFamily: SANS,
                    fontSize: "0.85rem",
                    letterSpacing: "0.04em",
                    color: T.ink,
                    boxSizing: "border-box",
                  }}
                />
              </Box>
              <motion.button
                onClick={apply}
                disabled={status === "checking" || !code.trim()}
                whileTap={{ scale: 0.97 }}
                style={{
                  padding: "10px 18px",
                  borderRadius: "10px",
                  border: "none",
                  background: T.blueGrad,
                  color: "#fff",
                  fontFamily: SANS,
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  cursor: !code.trim() ? "default" : "pointer",
                  opacity: !code.trim() ? 0.5 : 1,
                  whiteSpace: "nowrap",
                  boxShadow: `0 3px 12px ${T.blueGlow}`,
                }}
              >
                {status === "checking" ? "..." : "Apply"}
              </motion.button>
            </Box>
            <AnimatePresence mode="wait">
              {status === "valid" && (
                <motion.div
                  key="v"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <Typography
                    sx={{
                      fontFamily: SANS,
                      fontSize: "0.72rem",
                      color: T.green,
                      mt: 0.75,
                    }}
                  >
                    ✓ 20% discount applied!
                  </Typography>
                </motion.div>
              )}
              {status === "invalid" && (
                <motion.div
                  key="i"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <Typography
                    sx={{
                      fontFamily: SANS,
                      fontSize: "0.72rem",
                      color: T.red,
                      mt: 0.75,
                    }}
                  >
                    Invalid code. Try MERRAKI20.
                  </Typography>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
}

// ── CARD WRAPPER ──────────────────────────────────────────────────────────────
function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Box
      sx={{
        background: T.bgCard,
        borderRadius: "18px",
        border: `1px solid ${T.borderMid}`,
        boxShadow: `0 8px 32px ${T.blueGlow}`,
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          px: { xs: 3, md: 4 },
          py: 3,
          borderBottom: `1px solid ${T.border}`,
          background: T.bgSection,
        }}
      >
        <Typography
          sx={{
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: { xs: "1.1rem", md: "1.25rem" },
            color: T.ink,
            letterSpacing: "-0.02em",
          }}
        >
          {title}
        </Typography>
      </Box>
      <Box sx={{ px: { xs: 3, md: 4 }, py: { xs: 3, md: 4 } }}>{children}</Box>
    </Box>
  );
}

function BtnNext({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
      style={{
        width: "100%",
        padding: "14px 24px",
        borderRadius: "14px",
        border: "none",
        cursor: "pointer",
        background: T.blueGrad,
        color: "#fff",
        fontFamily: SANS,
        fontWeight: 600,
        fontSize: "1rem",
        letterSpacing: "-0.01em",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        boxShadow: `0 8px 28px ${T.blueGlow}`,
        minHeight: 54,
      }}
    >
      {label} <ArrowIcon style={{ fontSize: "0.95rem" }} />
    </motion.button>
  );
}
function BtnBack({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ x: -1 }}
      whileTap={{ scale: 0.97 }}
      style={{
        padding: "14px 18px",
        borderRadius: "14px",
        minHeight: 54,
        border: `1.5px solid rgba(59,123,246,0.28)`,
        background: "transparent",
        cursor: "pointer",
        color: T.blue,
        fontFamily: SANS,
        fontWeight: 600,
        fontSize: "0.9rem",
        whiteSpace: "nowrap",
      }}
    >
      ← Back
    </motion.button>
  );
}
function BtnPay({
  onClick,
  loading,
  label,
}: {
  onClick: () => void;
  loading: boolean;
  label: string;
}) {
  return (
    <motion.button
      onClick={onClick}
      disabled={loading}
      whileHover={{ y: loading ? 0 : -1 }}
      whileTap={{ scale: loading ? 1 : 0.98 }}
      style={{
        width: "100%",
        padding: "14px 24px",
        borderRadius: "14px",
        border: "none",
        minHeight: 54,
        cursor: loading ? "wait" : "pointer",
        background: loading ? T.bgSection : T.blueGrad,
        color: loading ? T.inkFaint : "#fff",
        fontFamily: SANS,
        fontWeight: 600,
        fontSize: "1rem",
        letterSpacing: "-0.01em",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        boxShadow: loading ? "none" : `0 8px 28px ${T.blueGlow}`,
        transition: "all 0.22s",
      }}
    >
      {loading ? (
        <>
          <CircularProgress size={15} sx={{ color: T.inkFaint }} /> Processing…
        </>
      ) : (
        <>
          <LockIcon style={{ fontSize: "0.9rem" }} /> {label}
        </>
      )}
    </motion.button>
  );
}

const slideVariants = {
  enter: (d: number) => ({ x: d > 0 ? "60%" : "-60%", opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (d: number) => ({ x: d > 0 ? "-60%" : "60%", opacity: 0 }),
};

// ════════════════════════════════════════════════════════════════════════════
// PROCESSING VIEW
// ════════════════════════════════════════════════════════════════════════════
function ProcessingView() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${T.bluePale} 0%, ${T.bgSection} 50%, ${T.bluePale} 100%)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 5,
        position: "relative",
        overflow: "hidden",
        pointerEvents: "none",
        userSelect: "none",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          width: "60vw",
          height: "60vw",
          top: "-20vw",
          left: "-10vw",
          borderRadius: "50%",
          background: `radial-gradient(ellipse, ${T.blueGlow} 0%, transparent 60%)`,
          pointerEvents: "none",
        }}
      />
      <Box sx={{ position: "relative", width: 120, height: 120, zIndex: 2 }}>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              border: `2px solid rgba(59,123,246,${0.35 - i * 0.1})`,
            }}
            animate={{ scale: [1, 1.5 + i * 0.3, 1], opacity: [0.8, 0, 0.8] }}
            transition={{
              duration: 2,
              delay: i * 0.4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress size={64} thickness={3} sx={{ color: T.blue }} />
        </Box>
      </Box>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        style={{ textAlign: "center", zIndex: 2 }}
      >
        <Typography
          sx={{
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: { xs: "1.75rem", md: "2.25rem" },
            letterSpacing: "-0.03em",
            color: T.ink,
            mb: 2,
          }}
        >
          Processing Payment
        </Typography>
        <Typography
          sx={{
            fontFamily: SANS,
            fontSize: "1rem",
            color: T.inkMuted,
            maxWidth: 380,
            lineHeight: 1.75,
          }}
        >
          Please do not close or refresh this window.
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center", gap: 1, mt: 4 }}>
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: T.blue,
              }}
              animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
              transition={{ duration: 1.2, delay: i * 0.2, repeat: Infinity }}
            />
          ))}
        </Box>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        style={{ zIndex: 2 }}
      >
        <Box
          sx={{
            px: 3,
            py: 1.5,
            borderRadius: "100px",
            background: T.bg,
            border: `1px solid ${T.border}`,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: T.blue,
              boxShadow: `0 0 8px ${T.blueGlow}`,
            }}
          />
          <Typography
            sx={{
              fontFamily: SANS,
              fontSize: "0.8rem",
              fontWeight: 600,
              color: T.inkMuted,
              letterSpacing: "0.02em",
            }}
          >
            Secured by Razorpay
          </Typography>
        </Box>
      </motion.div>
    </Box>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// SUCCESS VIEW
// ════════════════════════════════════════════════════════════════════════════
function ConfettiParticle({ index }: { index: number }) {
  const colors = [T.blue, "#7AABFF", "#5A92F8", "#93C5FD", T.green, "#22C55E"];
  const color = colors[index % colors.length];
  const x = (index * 137.5) % 100;
  const delay = (index * 0.04) % 1.2;
  const dur = 1.8 + (index % 5) * 0.3;
  const rot = (index * 73) % 360;
  const size = 5 + (index % 4) * 2;
  const isCircle = index % 3 === 0;
  return (
    <motion.div
      initial={{ y: -20, x: `${x}vw`, opacity: 1, rotate: rot, scale: 0 }}
      animate={{
        y: "110vh",
        opacity: [1, 1, 0],
        rotate: rot + 360 * 3,
        scale: [0, 1, 1],
      }}
      transition={{ delay, duration: dur, ease: "easeIn" }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: size,
        height: isCircle ? size : size * 0.45,
        borderRadius: isCircle ? "50%" : "1px",
        background: color,
        pointerEvents: "none",
        zIndex: 999,
      }}
    />
  );
}

function SuccessView({ order }: { order: any }) {
  const fired = useRef(false);
  useEffect(() => {
    fired.current = true;
  }, []);
  const STEPS_SUCCESS = [
    {
      icon: "◈",
      step: "01",
      title: "Check Your Email",
      detail:
        "Confirmation with order details sent to " +
        (order?.customer_email ?? "your email"),
      accent: "#2D5BE3",
    },
    {
      icon: "△",
      step: "02",
      title: "Admin Review",
      detail:
        "Our team verifies every order — usually within 2 business hours.",
      accent: "#A35400",
    },
    {
      icon: "◆",
      step: "03",
      title: "Download Unlocked",
      detail: "Once approved, your download link arrives instantly by email.",
      accent: "#0D7A5F",
    },
  ];
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${T.bluePale} 0%, ${T.bgSection} 50%, ${T.bluePale} 100%)`,
        py: { xs: 12, md: 16 },
        position: "relative",
        overflow: "hidden",
      }}
    >
      {fired.current &&
        Array.from({ length: 36 }).map((_, i) => (
          <ConfettiParticle key={i} index={i} />
        ))}
      <Box
        sx={{
          position: "fixed",
          width: "60vw",
          height: "60vw",
          top: "-20vw",
          left: "-10vw",
          borderRadius: "50%",
          background: `radial-gradient(ellipse, ${T.blueGlow} 0%, transparent 60%)`,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <Container maxWidth="sm" sx={{ position: "relative", zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 220,
            damping: 16,
            delay: 0.05,
          }}
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: 36,
          }}
        >
          <Box sx={{ position: "relative" }}>
            <motion.div
              animate={{ scale: [1, 1.22, 1], opacity: [0.2, 0, 0.2] }}
              transition={{
                duration: 2.6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                position: "absolute",
                inset: -14,
                borderRadius: "50%",
                border: `1.5px solid ${T.green}`,
                pointerEvents: "none",
              }}
            />
            <Box
              sx={{
                width: 88,
                height: 88,
                borderRadius: "50%",
                background: T.bg,
                border: `1.5px solid ${T.greenBorder}`,
                boxShadow: `0 8px 36px rgba(5,150,105,0.08), 0 0 0 5px rgba(5,150,105,0.06)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                <motion.path
                  d="M8 18L15 25L28 11"
                  stroke={T.green}
                  strokeWidth="2.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.35, duration: 0.55, ease: EASE }}
                />
              </svg>
            </Box>
          </Box>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18, duration: 0.55, ease: EASE }}
        >
          <Box sx={{ textAlign: "center", mb: 5 }}>
            <Typography
              sx={{
                fontFamily: SANS,
                fontWeight: 800,
                fontSize: { xs: "2.25rem", md: "3rem" },
                color: T.ink,
                letterSpacing: "-0.03em",
                lineHeight: 1.05,
                mb: 0.5,
              }}
            >
              You're all
            </Typography>
            <Typography
              sx={{
                fontFamily: SANS,
                fontWeight: 300,
                fontSize: { xs: "2.25rem", md: "3rem" },
                letterSpacing: "-0.03em",
                lineHeight: 1.05,
                mb: 3,
                background: T.blueGrad,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              set.
            </Typography>
            {order?.order_number && (
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 1,
                  px: 2,
                  py: "7px",
                  borderRadius: "100px",
                  background: T.bg,
                  border: `1px solid ${T.border}`,
                  boxShadow: "0 2px 8px rgba(10,10,20,0.05)",
                  mb: 1.5,
                }}
              >
                <Box
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: T.green,
                  }}
                />
                <Typography
                  sx={{
                    fontFamily: MONO,
                    fontSize: "0.75rem",
                    color: T.inkMuted,
                  }}
                >
                  Order #{order.order_number}
                </Typography>
              </Box>
            )}
          </Box>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28, duration: 0.5, ease: EASE }}
        >
          <Box
            sx={{
              background: T.bg,
              borderRadius: "20px",
              border: `1px solid ${T.borderMid}`,
              overflow: "hidden",
              boxShadow: `0 8px 32px ${T.blueGlow}`,
              mb: 3,
            }}
          >
            <Box
              sx={{
                px: 3,
                py: 2.25,
                background: T.bgSection,
                borderBottom: `1px solid ${T.border}`,
                display: "flex",
                alignItems: "center",
                gap: 1.5,
              }}
            >
              <Box
                sx={{
                  width: 2,
                  height: 13,
                  borderRadius: "2px",
                  background: T.blueGrad,
                }}
              />
              <Typography
                sx={{
                  fontFamily: SANS,
                  fontWeight: 700,
                  fontSize: "0.875rem",
                  color: T.ink,
                }}
              >
                What Happens Next
              </Typography>
            </Box>
            <Box
              sx={{
                p: 2.5,
                display: "flex",
                flexDirection: "column",
                gap: 1.5,
              }}
            >
              {STEPS_SUCCESS.map((s, i) => (
                <motion.div
                  key={s.title}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.5 + i * 0.1,
                    duration: 0.55,
                    ease: EASE,
                  }}
                >
                  <Box
                    sx={{
                      background: T.bg,
                      borderRadius: "14px",
                      border: `1px solid ${T.border}`,
                      p: "16px 18px",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 2,
                      position: "relative",
                      overflow: "hidden",
                      "&:hover": { borderColor: "rgba(59,123,246,0.22)" },
                    }}
                  >
                    <Box
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 16,
                        right: 16,
                        height: "1.5px",
                        background: `linear-gradient(90deg, transparent, ${s.accent}55, transparent)`,
                      }}
                    />
                    <Box
                      sx={{
                        flexShrink: 0,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 0.5,
                      }}
                    >
                      <Box
                        sx={{
                          width: 38,
                          height: 38,
                          borderRadius: "10px",
                          background: `${s.accent}0e`,
                          border: `1px solid ${s.accent}22`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Typography
                          sx={{
                            fontFamily: SANS,
                            fontSize: "0.85rem",
                            color: s.accent,
                            lineHeight: 1,
                          }}
                        >
                          {s.icon}
                        </Typography>
                      </Box>
                      <Typography
                        sx={{
                          fontFamily: SANS,
                          fontSize: "0.6rem",
                          fontWeight: 600,
                          color: T.inkFaint,
                        }}
                      >
                        {s.step}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography
                        sx={{
                          fontFamily: SANS,
                          fontWeight: 600,
                          fontSize: "0.9rem",
                          color: T.ink,
                          lineHeight: 1.3,
                          mb: 0.5,
                        }}
                      >
                        {s.title}
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: SANS,
                          fontSize: "0.8125rem",
                          color: T.inkMuted,
                          lineHeight: 1.6,
                        }}
                      >
                        {s.detail}
                      </Typography>
                    </Box>
                  </Box>
                </motion.div>
              ))}
            </Box>
          </Box>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.72, duration: 0.5, ease: EASE }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Box
                component="a"
                href="/templates"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1.25,
                  px: 3,
                  py: "13px",
                  borderRadius: "14px",
                  textDecoration: "none",
                  background: T.blueGrad,
                  boxShadow: `0 8px 28px ${T.blueGlow}`,
                  minHeight: 50,
                }}
              >
                <Typography
                  sx={{
                    fontFamily: SANS,
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    color: "#fff",
                  }}
                >
                  Browse More Templates
                </Typography>
              </Box>
            </motion.div>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// FAILURE VIEW
// ════════════════════════════════════════════════════════════════════════════
function FailureView({
  error,
  onRetry,
}: {
  error: string | null;
  onRetry: () => void;
}) {
  const REASONS = [
    {
      icon: "◈",
      label: "Insufficient funds",
      detail: "Your account balance may be too low for this transaction.",
      accent: T.red,
    },
    {
      icon: "△",
      label: "Network interruption",
      detail: "A connection dropout occurred mid-payment. No charge was made.",
      accent: T.amber,
    },
    {
      icon: "◆",
      label: "Session timed out",
      detail: "The payment window expired. This is a Razorpay safety feature.",
      accent: T.purple,
    },
    {
      icon: "○",
      label: "Card declined by bank",
      detail:
        "Your issuing bank rejected the transaction. Try a different card.",
      accent: T.teal,
    },
  ];
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${T.bluePale} 0%, ${T.bgSection} 50%, ${T.bluePale} 100%)`,
        py: { xs: 12, md: 16 },
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "fixed",
          width: "60vw",
          height: "60vw",
          top: "-20vw",
          left: "-10vw",
          borderRadius: "50%",
          background: `radial-gradient(ellipse, ${T.blueGlow} 0%, transparent 60%)`,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <Container maxWidth="sm" sx={{ position: "relative", zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 220,
            damping: 18,
            delay: 0.05,
          }}
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: 36,
          }}
        >
          <Box
            sx={{
              width: 88,
              height: 88,
              borderRadius: "50%",
              background: T.bg,
              border: `1.5px solid ${T.redBorder}`,
              boxShadow: `0 8px 36px ${T.redPale}, 0 0 0 5px ${T.redPale}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <motion.path
                d="M8 8L24 24"
                stroke={T.red}
                strokeWidth="2.5"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 0.3, duration: 0.35, ease: EASE }}
              />
              <motion.path
                d="M24 8L8 24"
                stroke={T.red}
                strokeWidth="2.5"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 0.5, duration: 0.35, ease: EASE }}
              />
            </svg>
          </Box>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18, duration: 0.55, ease: EASE }}
        >
          <Box sx={{ textAlign: "center", mb: 5 }}>
            <Typography
              sx={{
                fontFamily: SANS,
                fontWeight: 800,
                fontSize: { xs: "2.25rem", md: "3rem" },
                color: T.ink,
                letterSpacing: "-0.03em",
                lineHeight: 1.05,
                mb: 0.5,
              }}
            >
              Something went
            </Typography>
            <Typography
              sx={{
                fontFamily: SANS,
                fontWeight: 300,
                fontSize: { xs: "2.25rem", md: "3rem" },
                letterSpacing: "-0.03em",
                lineHeight: 1.05,
                mb: 3,
                background: `linear-gradient(115deg, ${T.redMid}, ${T.red})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              wrong.
            </Typography>
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
                px: 2,
                py: "7px",
                borderRadius: "100px",
                background: T.bg,
                border: `1px solid ${T.border}`,
                boxShadow: "0 2px 8px rgba(10,10,20,0.05)",
              }}
            >
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: T.teal,
                }}
              />
              <Typography
                sx={{
                  fontFamily: SANS,
                  fontSize: "0.8125rem",
                  color: T.inkMuted,
                }}
              >
                {error ?? "Payment cancelled"} · Cart saved
              </Typography>
            </Box>
          </Box>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28, duration: 0.5, ease: EASE }}
        >
          <Box
            sx={{
              background: T.bg,
              borderRadius: "20px",
              border: `1px solid ${T.borderMid}`,
              overflow: "hidden",
              boxShadow: `0 8px 32px ${T.blueGlow}`,
              mb: 3,
            }}
          >
            <Box
              sx={{
                px: 3,
                py: 2.25,
                background: T.bgSection,
                borderBottom: `1px solid ${T.border}`,
                display: "flex",
                alignItems: "center",
                gap: 1.5,
              }}
            >
              <Box
                sx={{
                  width: 2,
                  height: 13,
                  borderRadius: "2px",
                  background: `linear-gradient(180deg, ${T.redMid}, ${T.red})`,
                }}
              />
              <Typography
                sx={{
                  fontFamily: SANS,
                  fontWeight: 700,
                  fontSize: "0.875rem",
                  color: T.ink,
                }}
              >
                Possible Reasons
              </Typography>
            </Box>
            <Box
              sx={{
                p: 2.5,
                display: "flex",
                flexDirection: "column",
                gap: 1.5,
              }}
            >
              {REASONS.map((r, i) => (
                <motion.div
                  key={r.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.35 + i * 0.08,
                    duration: 0.45,
                    ease: EASE,
                  }}
                >
                  <Box
                    sx={{
                      background: T.bg,
                      borderRadius: "14px",
                      border: `1px solid ${T.border}`,
                      p: "14px 18px",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 1.75,
                      position: "relative",
                      overflow: "hidden",
                      "&:hover": { borderColor: "rgba(59,123,246,0.22)" },
                    }}
                  >
                    <Box
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 16,
                        right: 16,
                        height: "1.5px",
                        background: `linear-gradient(90deg, transparent, ${r.accent}55, transparent)`,
                      }}
                    />
                    <Box
                      sx={{
                        width: 34,
                        height: 34,
                        borderRadius: "9px",
                        flexShrink: 0,
                        background: `${r.accent}0e`,
                        border: `1px solid ${r.accent}25`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: SANS,
                          fontSize: "0.75rem",
                          color: r.accent,
                          lineHeight: 1,
                        }}
                      >
                        {r.icon}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography
                        sx={{
                          fontFamily: SANS,
                          fontWeight: 600,
                          fontSize: "0.875rem",
                          color: T.ink,
                          lineHeight: 1.3,
                          mb: 0.4,
                        }}
                      >
                        {r.label}
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: SANS,
                          fontSize: "0.8125rem",
                          color: T.inkMuted,
                          lineHeight: 1.55,
                        }}
                      >
                        {r.detail}
                      </Typography>
                    </Box>
                  </Box>
                </motion.div>
              ))}
            </Box>
          </Box>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.72, duration: 0.5, ease: EASE }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <motion.button
              onClick={onRetry}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                width: "100%",
                padding: "13px 24px",
                borderRadius: "14px",
                border: "none",
                background: T.blueGrad,
                color: "#fff",
                fontFamily: SANS,
                fontWeight: 600,
                fontSize: "0.9rem",
                cursor: "pointer",
                boxShadow: `0 8px 28px ${T.blueGlow}`,
                minHeight: 50,
              }}
            >
              ↺ Try Payment Again
            </motion.button>
            <Box
              component="a"
              href="/templates"
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1.25,
                px: 3,
                py: "13px",
                borderRadius: "14px",
                textDecoration: "none",
                border: `1px solid rgba(59,123,246,0.28)`,
                minHeight: 50,
                "&:hover": { background: T.bluePale },
              }}
            >
              <Typography
                sx={{
                  fontFamily: SANS,
                  fontWeight: 500,
                  fontSize: "0.9rem",
                  color: T.inkMid,
                }}
              >
                Back to Templates
              </Typography>
            </Box>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// MAIN CHECKOUT PAGE
// ════════════════════════════════════════════════════════════════════════════
export function CheckoutPageClient() {
  const router = useRouter();
  const { items, itemCount } = useCart();
  const { step, order, error, isProcessing, setStep, initiateCheckout } =
    useCheckout();

  const [formStep, setFormStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [completed, setCompleted] = useState<Set<number>>(new Set());
  const [promoDisc, setPromoDisc] = useState(0);
  const [promoOk, setPromoOk] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema) as any,
    // FIX: defaultValues only contains fields that exist in checkoutSchema.
    // Removed company, gst_number — they don't exist in the schema or backend.
    defaultValues: {
      country: "IN",
      same_as_billing: true,
      phone: "",
      address_line2: "",
    },
  });

  useEffect(() => {
    if (mounted && itemCount === 0 && step === "form")
      router.replace("/templates");
  }, [mounted, itemCount, step, router]);

  if (!mounted) return null;
  if (itemCount === 0 && step === "form") return null;

  // ── Step navigation ────────────────────────────────────────────────────────
  const next = async () => {
    const fieldsToValidate: (keyof CheckoutFormValues)[][] = [
      ["name", "email", "phone"],
      ["address_line1", "city", "state", "postal_code", "country"],
      [],
    ];
    const valid = await trigger(fieldsToValidate[formStep]);
    if (!valid) return;
    setCompleted((p) => new Set([...p, formStep]));
    setDir(1);
    setFormStep((s) => Math.min(s + 1, 2));
  };

  const back = () => {
    setDir(-1);
    setFormStep((s) => Math.max(s - 1, 0));
  };

  const onPromo = (_: string, pct: number, ok: boolean) => {
    setPromoDisc(pct);
    setPromoOk(ok);
  };

  const onSubmit = (data: CheckoutFormValues) => initiateCheckout(data);

  // FIX: Pay button label reads from price_usd_cents (integer cents) and
  // uses the same centsToUSD helper — no inline float math, no undefined field.
  const totalCents = items.reduce(
    (a: number, i: any) => a + i.template.price_usd_cents * i.quantity,
    0,
  );
  const discountedCents = promoOk
    ? Math.round(totalCents * (1 - promoDisc / 100))
    : totalCents;

  if (step === "processing") return <ProcessingView />;
  if (step === "success") return <SuccessView order={order} />;
  if (step === "failure")
    return <FailureView error={error} onRetry={() => setStep("form")} />;

  return (
    <Box
      sx={{
        pt: { xs: 8, md: 11 },
        pb: 14,
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${T.bluePale} 0%, ${T.bgSection} 50%, ${T.bluePale} 100%)`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          width: "60vw",
          height: "60vw",
          top: "-20vw",
          left: "-10vw",
          borderRadius: "50%",
          background: `radial-gradient(ellipse, ${T.blueGlow} 0%, transparent 60%)`,
          pointerEvents: "none",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          width: "50vw",
          height: "50vw",
          bottom: "-15vw",
          right: "-10vw",
          borderRadius: "50%",
          background: `radial-gradient(ellipse, rgba(59,123,246,0.06) 0%, transparent 60%)`,
          pointerEvents: "none",
        }}
      />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: EASE }}
        >
          <Box sx={{ textAlign: "center", mb: 5 }}>
            <Typography
              sx={{
                fontFamily: SANS,
                fontWeight: 800,
                fontSize: { xs: "1.75rem", md: "2.25rem" },
                color: T.ink,
                letterSpacing: "-0.03em",
                mb: 0.5,
              }}
            >
              Complete your order
            </Typography>
            <Typography
              sx={{ fontFamily: SANS, fontSize: "0.9rem", color: T.inkMuted }}
            >
              Secure checkout — instant delivery to your email
            </Typography>
          </Box>
        </motion.div>

        <Steps current={formStep} completed={completed} />

        <Grid container spacing={{ xs: 3, md: 4 }} alignItems="flex-start">
          {/* Form */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Box sx={{ position: "relative", overflow: "hidden" }}>
              <AnimatePresence mode="wait" custom={dir}>
                <motion.div
                  key={formStep}
                  custom={dir}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.35, ease: EASE }}
                  style={{ width: "100%" }}
                >
                  {/* Step 0 — Contact */}
                  {/* FIX: Removed company and gst_number fields — they are not
                      in checkoutSchema and have no corresponding backend field
                      in CreateOrderRequest or domain.BillingAddress. */}
                  {formStep === 0 && (
                    <Card title="Your Details">
                      <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <Field
                            label="Full Name *"
                            placeholder="Arjun Mehta"
                            error={errors.name?.message}
                            disabled={isProcessing}
                            {...register("name")}
                          />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <Field
                            label="Email Address *"
                            type="email"
                            placeholder="abc@example.com"
                            hint="Download link sent here"
                            error={errors.email?.message}
                            disabled={isProcessing}
                            {...register("email")}
                          />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                          <Field
                            label="Phone Number"
                            type="tel"
                            placeholder="+91 98765 43210"
                            error={errors.phone?.message}
                            disabled={isProcessing}
                            {...register("phone")}
                          />
                        </Grid>
                      </Grid>
                      <Box sx={{ mt: 3.5 }}>
                        <BtnNext onClick={next} label="Continue to Address" />
                      </Box>
                    </Card>
                  )}

                  {/* Step 1 — Address */}
                  {formStep === 1 && (
                    <Card title="Billing Address">
                      <Grid container spacing={2} sx={{ mb: 3 }}>
                        <Grid size={{ xs: 12 }}>
                          <Field
                            label="Address Line 1 *"
                            placeholder="123, MG Road"
                            error={errors.address_line1?.message}
                            disabled={isProcessing}
                            {...register("address_line1")}
                          />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                          <Field
                            label="Address Line 2"
                            placeholder="Apt / Suite / Floor"
                            disabled={isProcessing}
                            {...register("address_line2")}
                          />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <Field
                            label="City *"
                            placeholder="Mumbai"
                            error={errors.city?.message}
                            disabled={isProcessing}
                            {...register("city")}
                          />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <Field
                            label="State *"
                            placeholder="Maharashtra"
                            error={errors.state?.message}
                            disabled={isProcessing}
                            {...register("state")}
                          />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <Field
                            label="PIN Code *"
                            placeholder="400001"
                            error={errors.postal_code?.message}
                            disabled={isProcessing}
                            {...register("postal_code")}
                          />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <Field
                            label="Country Code *"
                            placeholder="IN"
                            hint="2-letter ISO code"
                            error={errors.country?.message}
                            disabled={isProcessing}
                            {...register("country")}
                          />
                        </Grid>
                      </Grid>
                      <Box sx={{ display: "flex", gap: 1.25 }}>
                        <BtnBack onClick={back} />
                        <Box sx={{ flex: 1 }}>
                          <BtnNext onClick={next} label="Continue to Payment" />
                        </Box>
                      </Box>
                    </Card>
                  )}

                  {/* Step 2 — Payment */}
                  {formStep === 2 && (
                    <Card title="Review & Pay">
                      <Promo onApply={onPromo} />
                      <Box
                        sx={{
                          p: "13px 16px",
                          borderRadius: "10px",
                          background: T.blueDim,
                          border: `1px solid rgba(59,123,246,0.12)`,
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 1.25,
                          mb: 3,
                        }}
                      >
                        <LockIcon
                          sx={{
                            fontSize: "0.85rem",
                            color: T.blue,
                            mt: "1px",
                            flexShrink: 0,
                          }}
                        />
                        <Typography
                          sx={{
                            fontFamily: SANS,
                            fontSize: "0.78rem",
                            color: T.inkMuted,
                            lineHeight: 1.65,
                          }}
                        >
                          Payments powered by{" "}
                          <Box
                            component="span"
                            sx={{
                              fontWeight: 700,
                              color: T.inkMid,
                              fontSize: "inherit",
                            }}
                          >
                            Razorpay
                          </Box>
                          . We never store card details. All transactions are
                          256-bit encrypted.
                        </Typography>
                      </Box>
                      <Box sx={{ mb: 3.5 }}>
                        {[
                          {
                            icon: "⚡",
                            text: "Razorpay payment screen opens securely",
                          },
                          {
                            icon: "📧",
                            text: "Instant confirmation email with download link",
                          },
                          {
                            icon: "↩️",
                            text: "7-day no-questions refund if unsatisfied",
                          },
                        ].map((item) => (
                          <Box
                            key={item.text}
                            sx={{ display: "flex", gap: 1.25, mb: 0.875 }}
                          >
                            <Typography
                              sx={{
                                fontSize: "0.75rem",
                                lineHeight: 1.7,
                                flexShrink: 0,
                              }}
                            >
                              {item.icon}
                            </Typography>
                            <Typography
                              sx={{
                                fontFamily: SANS,
                                fontSize: "0.8rem",
                                color: T.inkMuted,
                                lineHeight: 1.7,
                              }}
                            >
                              {item.text}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                      <Box sx={{ display: "flex", gap: 1.25 }}>
                        <BtnBack onClick={back} />
                        <Box sx={{ flex: 1 }}>
                          {/* FIX: label uses discountedCents via formatUSD —
                              integer cents all the way, no float math */}
                          <BtnPay
                            onClick={handleSubmit(onSubmit)}
                            loading={isProcessing}
                            label={`Pay ${formatUSD(discountedCents)} Securely`}
                          />
                        </Box>
                      </Box>
                      <Typography
                        sx={{
                          fontFamily: SANS,
                          fontSize: "0.68rem",
                          color: T.inkFaint,
                          mt: 2,
                          textAlign: "center",
                        }}
                      >
                        By paying you agree to our Terms of Service & Refund
                        Policy
                      </Typography>
                    </Card>
                  )}
                </motion.div>
              </AnimatePresence>
            </Box>
          </Grid>

          {/* Summary */}
          <Grid size={{ xs: 12, md: 5 }}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.55, delay: 0.1, ease: EASE }}
            >
              <Summary
                items={items}
                discountPct={promoDisc}
                promoValid={promoOk}
              />
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}