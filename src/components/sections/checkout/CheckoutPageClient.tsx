"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Box, Container, Typography, TextField, CircularProgress,
  Collapse, Grid,
} from "@mui/material";
import {
  LockOutlined as LockIcon,
  CheckCircle as CheckIcon,
  LocalOffer as PromoIcon,
  KeyboardArrowRight as ArrowIcon,
  Person as PersonIcon,
  Home as HomeIcon,
  Payment as PayIcon,
  ContentCopy as CopyIcon,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useCart } from "@/lib/hooks/useCart";
import { useCurrency } from "@/lib/hooks/useCurrency";
import { useCheckout } from "@/lib/hooks/useCheckout";
import { checkoutSchema, type CheckoutFormValues } from "@/lib/schemas/checkout.schema";

/* ══ TOKENS ══════════════════════════════════════════════ */
const T = {
  bg:          "#F5F4F1",
  bgCard:      "#FAFAF7",
  bgInput:     "#FFFFFF",
  ink:         "#0C0B08",
  inkMid:      "#2E2C26",
  inkMuted:    "#6E6C64",
  inkFaint:    "#9E9C94",
  inkGhost:    "#C8C4BB",
  border:      "#E8E4DC",
  borderMid:   "#D4CFC6",
  borderFocus: "rgba(184,146,42,0.55)",
  gold:        "#B8922A",
  goldMid:     "#C9A84C",
  goldLight:   "#DDB96A",
  goldPale:    "#F0D898",
  goldGlow:    "rgba(184,146,42,0.18)",
  goldDim:     "rgba(184,146,42,0.08)",
  green:       "#2D7A4E",
  greenBg:     "rgba(45,122,78,0.08)",
  greenBorder: "rgba(45,122,78,0.2)",
  red:         "#A83232",
  redBg:       "rgba(168,50,50,0.06)",
  redBorder:   "rgba(168,50,50,0.2)",
};

const SERIF = '"Instrument Serif","Playfair Display",Georgia,serif';
const SANS  = '"DM Sans","Mona Sans",system-ui,sans-serif';
const MONO  = '"DM Mono","JetBrains Mono",ui-monospace,monospace';
const EASE  = [0.16, 1, 0.3, 1] as const;

/* ══ STEP CONFIG ═════════════════════════════════════════ */
const STEPS = [
  { id: "contact",  label: "Contact",  icon: PersonIcon },
  { id: "address",  label: "Address",  icon: HomeIcon   },
  { id: "payment",  label: "Payment",  icon: PayIcon    },
] as const;

type StepId = typeof STEPS[number]["id"];

/* ══ LUXURY INPUT ════════════════════════════════════════ */
function LuxInput({
  label, error, hint, disabled, type = "text", placeholder,
  ...rest
}: {
  label: string; error?: string; hint?: string;
  disabled?: boolean; type?: string; placeholder?: string;
  [key: string]: any;
}) {
  const [focused, setFocused] = useState(false);

  return (
    <Box sx={{ position: "relative" }}>
      {/* Floating label */}
      <Typography sx={{
        fontFamily: MONO, fontSize: "0.5rem", letterSpacing: "0.16em",
        color: error ? T.red : focused ? T.gold : T.inkMuted,
        textTransform: "uppercase", mb: 0.75,
        transition: "color 0.2s ease",
      }}>
        {label}
      </Typography>

      <Box sx={{
        position: "relative",
        background: T.bgInput,
        border: `1px solid ${error ? T.redBorder : focused ? T.borderFocus : T.border}`,
        borderRadius: "12px",
        transition: "border-color 0.22s ease, box-shadow 0.22s ease",
        boxShadow: focused
          ? `0 0 0 3px ${error ? "rgba(168,50,50,0.08)" : T.goldDim}`
          : "none",
      }}>
        <input
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: "100%",
            padding: "13px 16px",
            border: "none",
            outline: "none",
            background: "transparent",
            fontFamily: SANS,
            fontSize: "0.9rem",
            color: T.ink,
            borderRadius: "12px",
            boxSizing: "border-box",
          }}
          {...rest}
        />
      </Box>

      {(error || hint) && (
        <Typography sx={{
          fontFamily: SANS, fontSize: "0.75rem",
          color: error ? T.red : T.inkFaint,
          mt: 0.6, ml: 0.5,
        }}>
          {error || hint}
        </Typography>
      )}
    </Box>
  );
}

/* ══ STEP INDICATOR ══════════════════════════════════════ */
function StepIndicator({ current, completed }: { current: number; completed: Set<number> }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", mb: { xs: 5, md: 7 }, justifyContent: "center" }}>
      {STEPS.map((step, i) => {
        const isDone    = completed.has(i);
        const isActive  = i === current;
        const isPending = i > current && !isDone;

        return (
          <Box key={step.id} sx={{ display: "flex", alignItems: "center" }}>
            {/* Circle */}
            <motion.div
              animate={{
                scale: isActive ? 1.08 : 1,
              }}
              transition={{ type: "spring", stiffness: 400, damping: 22 }}
            >
              <Box sx={{
                width: 36, height: 36, borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                background: isDone
                  ? `linear-gradient(135deg,${T.green},#3E9E64)`
                  : isActive
                    ? `linear-gradient(135deg,${T.gold},${T.goldLight})`
                    : T.bgCard,
                border: `1.5px solid ${isDone ? T.greenBorder : isActive ? T.goldLight : T.border}`,
                boxShadow: isActive ? `0 4px 16px ${T.goldGlow}` : "none",
                transition: "all 0.3s ease",
                cursor: isDone ? "pointer" : "default",
                position: "relative", zIndex: 1,
              }}>
                {isDone ? (
                  <CheckIcon sx={{ fontSize: "0.9rem", color: "#fff" }} />
                ) : (
                  <step.icon sx={{
                    fontSize: "0.85rem",
                    color: isActive ? T.ink : T.inkGhost,
                  }} />
                )}
              </Box>
            </motion.div>

            {/* Label */}
            <Typography sx={{
              fontFamily: MONO, fontSize: "0.48rem",
              letterSpacing: "0.16em", textTransform: "uppercase",
              color: isActive ? T.gold : isDone ? T.green : T.inkGhost,
              ml: 0.875, mr: 0.5,
              display: { xs: "none", sm: "block" },
              transition: "color 0.3s ease",
            }}>
              {step.label}
            </Typography>

            {/* Connector */}
            {i < STEPS.length - 1 && (
              <Box sx={{
                width: { xs: 28, sm: 48, md: 64 }, height: 1,
                mx: { xs: 0.5, sm: 1 },
                background: isDone
                  ? `linear-gradient(90deg,${T.green},${T.greenBg})`
                  : T.border,
                transition: "background 0.4s ease",
                position: "relative", zIndex: 0,
              }} />
            )}
          </Box>
        );
      })}
    </Box>
  );
}

/* ══ ORDER SUMMARY (sticky sidebar) ═════════════════════ */
function OrderSummary({
  items, subtotalRaw, format, discount, promoValid,
}: {
  items: any[]; subtotalRaw: number; format: Function;
  discount: number; promoValid: boolean | null;
}) {
  const subtotal    = subtotalRaw / 100;
  const discountAmt = promoValid ? subtotal * (discount / 100) : 0;
  const total       = subtotal - discountAmt;

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
    >
      <Box sx={{
        background: T.bgCard,
        borderRadius: "20px",
        border: `1px solid ${T.border}`,
        overflow: "hidden",
        position: "sticky",
        top: 96,
        boxShadow: "0 4px 24px rgba(14,12,9,0.06)",
      }}>
        {/* Header */}
        <Box sx={{
          px: 3, py: 2.5,
          borderBottom: `1px solid ${T.border}`,
          background: "rgba(255,255,255,0.6)",
          display: "flex", alignItems: "center", gap: 1.25,
        }}>
          <Box sx={{ width: 16, height: 1, background: `linear-gradient(90deg,${T.gold},${T.goldLight})` }} />
          <Typography sx={{ fontFamily: MONO, fontSize: "0.5rem", letterSpacing: "0.2em", color: T.goldMid, textTransform: "uppercase" }}>
            Order Summary
          </Typography>
        </Box>

        {/* Items */}
        <Box sx={{ px: 3, py: 3, display: "flex", flexDirection: "column", gap: 2.5 }}>
          {items.map((item: any) => (
            <Box key={item.templateId} sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
              {/* Thumbnail */}
              <Box sx={{
                width: 48, height: 48, borderRadius: "10px", flexShrink: 0,
                background: T.goldDim,
                border: `1px solid rgba(184,146,42,0.15)`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Typography sx={{ fontFamily: MONO, fontSize: "0.9rem", color: T.gold }}>◈</Typography>
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{
                  fontFamily: SANS, fontWeight: 600, fontSize: "0.82rem",
                  color: T.inkMid, lineHeight: 1.35, mb: 0.25,
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>
                  {item.template.title}
                </Typography>
                <Typography sx={{ fontFamily: MONO, fontSize: "0.48rem", letterSpacing: "0.1em", color: T.inkFaint, textTransform: "uppercase" }}>
                  Qty {item.quantity}
                </Typography>
              </Box>
              <Typography sx={{
                fontFamily: SERIF, fontStyle: "italic", fontSize: "0.95rem",
                color: T.inkMid, letterSpacing: "-0.02em", flexShrink: 0,
              }}>
                {format((item.template.price_inr / 100) * item.quantity, "INR")}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Totals */}
        <Box sx={{ px: 3, pt: 0, pb: 3, borderTop: `1px solid ${T.border}` }}>
          <Box sx={{ pt: 2.5, display: "flex", flexDirection: "column", gap: 1.25 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography sx={{ fontFamily: SANS, fontSize: "0.82rem", color: T.inkMuted }}>Subtotal</Typography>
              <Typography sx={{ fontFamily: SANS, fontSize: "0.82rem", fontWeight: 600, color: T.inkMid }}>
                {format(subtotal, "INR")}
              </Typography>
            </Box>

            {promoValid && discountAmt > 0 && (
              <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography sx={{ fontFamily: SANS, fontSize: "0.82rem", color: T.green }}>
                    Promo ({discount}% off)
                  </Typography>
                  <Typography sx={{ fontFamily: SANS, fontSize: "0.82rem", fontWeight: 600, color: T.green }}>
                    −{format(discountAmt, "INR")}
                  </Typography>
                </Box>
              </motion.div>
            )}

            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography sx={{ fontFamily: SANS, fontSize: "0.82rem", color: T.inkMuted }}>GST / Tax</Typography>
              <Typography sx={{ fontFamily: SANS, fontSize: "0.82rem", color: T.inkFaint }}>Included</Typography>
            </Box>

            {/* Divider */}
            <Box sx={{ height: 1, background: T.border, my: 0.5 }} />

            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <Typography sx={{ fontFamily: SANS, fontWeight: 700, fontSize: "0.875rem", color: T.ink }}>
                Total
              </Typography>
              <Typography sx={{
                fontFamily: SERIF, fontStyle: "italic", fontWeight: 400,
                fontSize: "1.5rem", color: T.ink, letterSpacing: "-0.03em",
              }}>
                {format(total, "INR")}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Trust badges */}
        <Box sx={{
          px: 3, py: 2,
          borderTop: `1px solid ${T.border}`,
          background: T.goldDim,
          display: "flex", flexDirection: "column", gap: 0.875,
        }}>
          {[
            { icon: "🔒", text: "256-bit SSL encryption" },
            { icon: "⚡", text: "Instant delivery to email" },
            { icon: "↩️", text: "7-day refund guarantee" },
          ].map((b) => (
            <Box key={b.text} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography sx={{ fontSize: "0.7rem", lineHeight: 1 }}>{b.icon}</Typography>
              <Typography sx={{ fontFamily: SANS, fontSize: "0.72rem", color: T.inkMuted }}>{b.text}</Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </motion.div>
  );
}

/* ══ PROMO CODE BOX ══════════════════════════════════════ */
function PromoBox({
  onApply,
}: {
  onApply: (code: string, discount: number, valid: boolean) => void;
}) {
  const [code,    setCode]    = useState("");
  const [status,  setStatus]  = useState<"idle" | "checking" | "valid" | "invalid">("idle");
  const [open,    setOpen]    = useState(false);

  const handleApply = async () => {
    if (!code.trim()) return;
    setStatus("checking");
    await new Promise(r => setTimeout(r, 900));
    // Mock: MERRAKI20 = 20% off
    const isValid = code.toUpperCase() === "MERRAKI20";
    setStatus(isValid ? "valid" : "invalid");
    onApply(code, isValid ? 20 : 0, isValid);
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Box
        onClick={() => setOpen(v => !v)}
        sx={{
          display: "inline-flex", alignItems: "center", gap: 0.75,
          cursor: "pointer",
          "&:hover .promo-label": { color: T.gold },
        }}
      >
        <PromoIcon sx={{ fontSize: "0.85rem", color: T.goldMid }} />
        <Typography
          className="promo-label"
          sx={{
            fontFamily: SANS, fontSize: "0.8rem",
            color: T.inkMuted, transition: "color 0.18s",
          }}
        >
          Have a promo code?
        </Typography>
        <motion.span
          animate={{ rotate: open ? 90 : 0 }}
          transition={{ duration: 0.22, ease: EASE }}
          style={{ display: "inline-flex" }}
        >
          <ArrowIcon sx={{ fontSize: "0.8rem", color: T.inkFaint }} />
        </motion.span>
      </Box>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: EASE }}
            style={{ overflow: "hidden" }}
          >
            <Box sx={{ mt: 1.75, display: "flex", gap: 1.25 }}>
              <Box sx={{
                flex: 1,
                background: T.bgInput,
                border: `1px solid ${
                  status === "valid" ? T.greenBorder :
                  status === "invalid" ? T.redBorder : T.border
                }`,
                borderRadius: "11px",
                overflow: "hidden",
                transition: "border-color 0.2s",
              }}>
                <input
                  value={code}
                  onChange={e => { setCode(e.target.value); setStatus("idle"); }}
                  placeholder="e.g. MERRAKI20"
                  style={{
                    width: "100%", padding: "11px 14px",
                    border: "none", outline: "none",
                    background: "transparent",
                    fontFamily: MONO, fontSize: "0.82rem",
                    letterSpacing: "0.08em", color: T.ink,
                    boxSizing: "border-box",
                  }}
                />
              </Box>
              <motion.button
                onClick={handleApply}
                disabled={status === "checking" || !code.trim()}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  padding: "11px 18px",
                  borderRadius: "11px",
                  border: "none",
                  background: `linear-gradient(135deg,${T.gold},${T.goldLight})`,
                  color: T.ink, fontFamily: SANS,
                  fontWeight: 700, fontSize: "0.82rem",
                  cursor: status === "checking" ? "wait" : "pointer",
                  boxShadow: `0 4px 14px ${T.goldGlow}`,
                  whiteSpace: "nowrap",
                  opacity: !code.trim() ? 0.5 : 1,
                  transition: "opacity 0.2s",
                }}
              >
                {status === "checking" ? "..." : "Apply"}
              </motion.button>
            </Box>

            <AnimatePresence mode="wait">
              {status === "valid" && (
                <motion.div key="valid" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <Typography sx={{ fontFamily: SANS, fontSize: "0.75rem", color: T.green, mt: 0.75, display: "flex", alignItems: "center", gap: 0.5 }}>
                    <CheckIcon sx={{ fontSize: "0.85rem" }} /> 20% discount applied!
                  </Typography>
                </motion.div>
              )}
              {status === "invalid" && (
                <motion.div key="invalid" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <Typography sx={{ fontFamily: SANS, fontSize: "0.75rem", color: T.red, mt: 0.75 }}>
                    Invalid code. Try MERRAKI20 for 20% off.
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

/* ══ STEP CARD WRAPPER ═══════════════════════════════════ */
function StepCard({
  title, subtitle, children,
}: {
  title: string; subtitle?: string; children: React.ReactNode;
}) {
  return (
    <Box sx={{
      background: T.bgCard,
      borderRadius: "22px",
      border: `1px solid ${T.border}`,
      overflow: "hidden",
      boxShadow: "0 4px 32px rgba(14,12,9,0.06)",
    }}>
      {/* Card header */}
      <Box sx={{
        px: { xs: 3, md: 4 }, py: 3,
        borderBottom: `1px solid ${T.border}`,
        background: "rgba(255,255,255,0.55)",
      }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 0.5 }}>
          <Box sx={{ width: 20, height: 1, background: `linear-gradient(90deg,${T.gold},${T.goldLight})` }} />
          <Typography sx={{
            fontFamily: MONO, fontSize: "0.5rem", letterSpacing: "0.2em",
            color: T.goldMid, textTransform: "uppercase",
          }}>
            {subtitle}
          </Typography>
        </Box>
        <Typography sx={{
          fontFamily: SERIF, fontStyle: "italic", fontWeight: 400,
          fontSize: { xs: "1.5rem", md: "1.875rem" },
          color: T.ink, letterSpacing: "-0.025em", lineHeight: 1.1,
        }}>
          {title}
        </Typography>
      </Box>

      {/* Card body */}
      <Box sx={{ px: { xs: 3, md: 4 }, py: { xs: 3, md: 4 } }}>
        {children}
      </Box>
    </Box>
  );
}

/* ══ STEP 1 — CONTACT ════════════════════════════════════ */
function StepContact({ register, errors, control, onNext, isProcessing }: any) {
  return (
    <StepCard title="Your Details" subtitle="Step 1 of 3 — Contact">
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <LuxInput
              label="Full Name *"
              placeholder="Arjun Mehta"
              error={errors.name?.message}
              disabled={isProcessing}
              {...register("name")}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <LuxInput
              label="Email Address *"
              type="email"
              placeholder="you@company.com"
              hint="Order & download link sent here"
              error={errors.email?.message}
              disabled={isProcessing}
              {...register("email")}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <LuxInput
              label="Phone Number"
              type="tel"
              placeholder="+91 98765 43210"
              error={errors.phone?.message}
              disabled={isProcessing}
              {...register("phone")}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <LuxInput
              label="Company (optional)"
              placeholder="Merraki Solutions"
              disabled={isProcessing}
              {...register("company")}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <LuxInput
              label="GST Number (optional)"
              placeholder="22AAAAA0000A1Z5"
              hint="Required for B2B GST invoice"
              disabled={isProcessing}
              {...register("gstNumber")}
            />
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ mt: 4 }}>
        <NextButton onClick={onNext} label="Continue to Address" />
      </Box>
    </StepCard>
  );
}

/* ══ STEP 2 — ADDRESS ════════════════════════════════════ */
function StepAddress({ register, errors, onNext, onBack, isProcessing, watch, setValue }: any) {
  const [sameAsBilling, setSameAsBilling] = useState(true);

  return (
    <StepCard title="Billing & Shipping" subtitle="Step 2 of 3 — Address">
      {/* Billing */}
      <Box sx={{ mb: 3.5 }}>
        <Typography sx={{
          fontFamily: MONO, fontSize: "0.5rem", letterSpacing: "0.16em",
          color: T.inkMuted, textTransform: "uppercase", mb: 2,
        }}>
          Billing Address
        </Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }}>
            <LuxInput label="Address Line 1 *" placeholder="123, MG Road" error={errors.addressLine1?.message} disabled={isProcessing} {...register("addressLine1")} />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <LuxInput label="Address Line 2" placeholder="Apt / Suite / Floor (optional)" disabled={isProcessing} {...register("addressLine2")} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <LuxInput label="City *" placeholder="Mumbai" error={errors.city?.message} disabled={isProcessing} {...register("city")} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <LuxInput label="State *" placeholder="Maharashtra" error={errors.state?.message} disabled={isProcessing} {...register("state")} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <LuxInput label="PIN Code *" placeholder="400001" error={errors.pinCode?.message} disabled={isProcessing} {...register("pinCode")} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <LuxInput label="Country" placeholder="India" disabled={isProcessing} {...register("country")} />
          </Grid>
        </Grid>
      </Box>

      {/* Same as billing toggle */}
      <Box
        onClick={() => setSameAsBilling(v => !v)}
        sx={{
          display: "flex", alignItems: "center", gap: 1.5, mb: 3,
          cursor: "pointer", userSelect: "none",
          p: "12px 16px", borderRadius: "12px",
          background: sameAsBilling ? T.goldDim : T.bgInput,
          border: `1px solid ${sameAsBilling ? "rgba(184,146,42,0.2)" : T.border}`,
          transition: "all 0.22s ease",
        }}
      >
        {/* Custom checkbox */}
        <Box sx={{
          width: 18, height: 18, borderRadius: "5px",
          border: `1.5px solid ${sameAsBilling ? T.gold : T.borderMid}`,
          background: sameAsBilling ? `linear-gradient(135deg,${T.gold},${T.goldLight})` : "transparent",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all 0.2s ease", flexShrink: 0,
        }}>
          {sameAsBilling && <CheckIcon sx={{ fontSize: "0.65rem", color: T.ink }} />}
        </Box>
        <Typography sx={{ fontFamily: SANS, fontSize: "0.83rem", color: T.inkMid }}>
          Shipping address same as billing
        </Typography>
      </Box>

      {/* Shipping address (conditional) */}
      <AnimatePresence>
        {!sameAsBilling && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            style={{ overflow: "hidden" }}
          >
            <Box sx={{ mb: 3.5 }}>
              <Typography sx={{
                fontFamily: MONO, fontSize: "0.5rem", letterSpacing: "0.16em",
                color: T.inkMuted, textTransform: "uppercase", mb: 2,
              }}>
                Shipping Address
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                  <LuxInput label="Address Line 1 *" placeholder="456, Linking Road" disabled={isProcessing} {...register("shippingAddressLine1")} />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <LuxInput label="Address Line 2" placeholder="Apt / Suite / Floor" disabled={isProcessing} {...register("shippingAddressLine2")} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <LuxInput label="City *" placeholder="Mumbai" disabled={isProcessing} {...register("shippingCity")} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <LuxInput label="State *" placeholder="Maharashtra" disabled={isProcessing} {...register("shippingState")} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <LuxInput label="PIN Code *" placeholder="400050" disabled={isProcessing} {...register("shippingPinCode")} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <LuxInput label="Country" placeholder="India" disabled={isProcessing} {...register("shippingCountry")} />
                </Grid>
              </Grid>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nav */}
      <Box sx={{ display: "flex", gap: 1.5, mt: 1 }}>
        <BackButton onClick={onBack} />
        <Box sx={{ flex: 1 }}>
          <NextButton onClick={onNext} label="Continue to Payment" />
        </Box>
      </Box>
    </StepCard>
  );
}

/* ══ STEP 3 — PAYMENT ════════════════════════════════════ */
function StepPayment({
  register, errors, handleSubmit, onSubmit, onBack,
  isProcessing, subtotalRaw, format, discount, promoValid, onPromo,
}: any) {
  return (
    <StepCard title="Review & Pay" subtitle="Step 3 of 3 — Payment">

      {/* Promo code */}
      <PromoBox onApply={onPromo} />

      {/* Security note */}
      <Box sx={{
        mt: 3, p: "14px 18px",
        background: T.goldDim,
        border: `1px solid rgba(184,146,42,0.15)`,
        borderRadius: "12px",
        display: "flex", alignItems: "center", gap: 1.5,
      }}>
        <LockIcon sx={{ fontSize: "0.95rem", color: T.gold }} />
        <Typography sx={{ fontFamily: SANS, fontSize: "0.8rem", color: T.inkMuted, lineHeight: 1.6 }}>
          Payments powered by{" "}
          <Typography component="span" sx={{ fontWeight: 700, color: T.inkMid, fontSize: "inherit" }}>
            Razorpay
          </Typography>
          . We never store card details. All transactions are 256-bit encrypted.
        </Typography>
      </Box>

      {/* What you get */}
      <Box sx={{ mt: 3 }}>
        <Typography sx={{ fontFamily: MONO, fontSize: "0.48rem", letterSpacing: "0.16em", color: T.inkMuted, textTransform: "uppercase", mb: 1.5 }}>
          What happens next
        </Typography>
        {[
          { icon: "⚡", text: "Razorpay payment screen opens securely" },
          { icon: "📧", text: "Instant confirmation email with download link" },
          { icon: "🔓", text: "Lifetime access — download anytime" },
          { icon: "↩️", text: "7-day no-questions refund if unsatisfied" },
        ].map((item) => (
          <Box key={item.text} sx={{ display: "flex", alignItems: "flex-start", gap: 1.25, mb: 1 }}>
            <Typography sx={{ fontSize: "0.78rem", lineHeight: 1.6, flexShrink: 0 }}>{item.icon}</Typography>
            <Typography sx={{ fontFamily: SANS, fontSize: "0.82rem", color: T.inkMuted, lineHeight: 1.6 }}>{item.text}</Typography>
          </Box>
        ))}
      </Box>

      {/* Nav */}
      <Box sx={{ display: "flex", gap: 1.5, mt: 3.5 }}>
        <BackButton onClick={onBack} />
        <Box sx={{ flex: 1 }}>
          <PayButton
            onClick={handleSubmit(onSubmit)}
            isProcessing={isProcessing}
            label={`Pay ${format((subtotalRaw / 100) * (1 - (promoValid ? discount / 100 : 0)), "INR")} Securely`}
          />
        </Box>
      </Box>

      {/* Legal micro-copy */}
      <Typography sx={{ fontFamily: MONO, fontSize: "0.44rem", letterSpacing: "0.1em", color: T.inkFaint, textTransform: "uppercase", mt: 2, textAlign: "center" }}>
        By paying you agree to our Terms of Service & Refund Policy
      </Typography>
    </StepCard>
  );
}

/* ══ BUTTON ATOMS ════════════════════════════════════════ */
function NextButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
      style={{
        width: "100%", padding: "14px 28px",
        borderRadius: "13px", border: "none", cursor: "pointer",
        background: `linear-gradient(135deg,${T.gold},${T.goldLight})`,
        color: T.ink, fontFamily: SANS, fontWeight: 700,
        fontSize: "0.9rem", letterSpacing: "-0.01em",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        boxShadow: `0 6px 24px ${T.goldGlow}`,
        transition: "box-shadow 0.2s ease",
      }}
    >
      {label}
      <ArrowIcon style={{ fontSize: "1rem" }} />
    </motion.button>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ x: -2 }}
      whileTap={{ scale: 0.97 }}
      style={{
        padding: "14px 20px",
        borderRadius: "13px",
        border: `1.5px solid ${T.border}`,
        background: "transparent", cursor: "pointer",
        color: T.inkMuted, fontFamily: SANS,
        fontWeight: 500, fontSize: "0.85rem",
        display: "flex", alignItems: "center", gap: 6,
        transition: "border-color 0.2s, color 0.2s",
        whiteSpace: "nowrap",
      }}
    >
      ← Back
    </motion.button>
  );
}

function PayButton({ onClick, isProcessing, label }: { onClick: () => void; isProcessing: boolean; label: string }) {
  return (
    <motion.button
      onClick={onClick}
      disabled={isProcessing}
      whileHover={{ y: isProcessing ? 0 : -1 }}
      whileTap={{ scale: isProcessing ? 1 : 0.98 }}
      style={{
        width: "100%", padding: "15px 28px",
        borderRadius: "13px", border: "none",
        cursor: isProcessing ? "wait" : "pointer",
        background: isProcessing
          ? T.border
          : `linear-gradient(135deg,${T.gold},${T.goldLight})`,
        color: isProcessing ? T.inkFaint : T.ink,
        fontFamily: SANS, fontWeight: 700,
        fontSize: "0.9rem", letterSpacing: "-0.01em",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
        boxShadow: isProcessing ? "none" : `0 8px 28px ${T.goldGlow}`,
        transition: "all 0.25s ease",
      }}
    >
      {isProcessing ? (
        <>
          <CircularProgress size={16} sx={{ color: T.inkFaint }} />
          Processing...
        </>
      ) : (
        <>
          <LockIcon style={{ fontSize: "0.95rem" }} />
          {label}
        </>
      )}
    </motion.button>
  );
}

/* ══ SLIDE ANIMATION VARIANTS ════════════════════════════ */
const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? "100%" : "-100%",
    opacity: 0,
    scale: 0.96,
    filter: "blur(4px)",
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
  },
  exit: (dir: number) => ({
    x: dir > 0 ? "-100%" : "100%",
    opacity: 0,
    scale: 0.96,
    filter: "blur(4px)",
  }),
};

/* ══ MAIN PAGE ═══════════════════════════════════════════ */
export function CheckoutPageClient() {
  const router   = useRouter();
  const { items, itemCount, subtotalRaw } = useCart();
  const { format }   = useCurrency();
  const { initiateCheckout, isProcessing } = useCheckout();

  const [currentStep, setCurrentStep] = useState(0);
  const [direction,   setDirection]   = useState(1);
  const [completed,   setCompleted]   = useState<Set<number>>(new Set());
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoValid,    setPromoValid]    = useState<boolean | null>(null);

  const {
    register, handleSubmit, control,
    formState: { errors }, watch, setValue,
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { country: "India", shippingCountry: "India" },
  });

  useEffect(() => {
    if (itemCount === 0) router.replace("/templates");
  }, [itemCount, router]);

  if (itemCount === 0) return null;

  const goNext = () => {
    setCompleted(prev => new Set([...prev, currentStep]));
    setDirection(1);
    setCurrentStep(s => Math.min(s + 1, STEPS.length - 1));
  };

  const goBack = () => {
    setDirection(-1);
    setCurrentStep(s => Math.max(s - 1, 0));
  };

  const handlePromo = (code: string, discount: number, valid: boolean) => {
    setPromoDiscount(discount);
    setPromoValid(valid ? true : false);
  };

  const onSubmit = (data: CheckoutFormValues) => {
    initiateCheckout(data);
  };

  const stepProps = {
    register, errors, control, handleSubmit, onSubmit,
    isProcessing, watch, setValue,
    subtotalRaw, format,
    discount: promoDiscount,
    promoValid,
    onPromo: handlePromo,
  };

  return (
    <Box sx={{
      pt: { xs: 7, md: 10 }, pb: 12,
      minHeight: "100vh",
      background: T.bg,
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Background warm grid */}
      <Box sx={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: `linear-gradient(${T.border} 1px,transparent 1px),linear-gradient(90deg,${T.border} 1px,transparent 1px)`,
        backgroundSize: "72px 72px", opacity: 0.4,
      }} />

      {/* Gold bloom */}
      <Box sx={{
        position: "absolute", width: "60vw", height: "50vw",
        top: "-15vw", right: "-10vw", borderRadius: "50%",
        background: `radial-gradient(ellipse,${T.goldDim} 0%,transparent 65%)`,
        pointerEvents: "none",
      }} />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>

        {/* Page heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <Box sx={{ mb: { xs: 5, md: 7 }, textAlign: "center" }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1.5, mb: 1.5 }}>
              <Box sx={{ width: 28, height: 1, background: `linear-gradient(270deg,${T.gold},${T.goldLight})` }} />
              <Typography sx={{ fontFamily: MONO, fontSize: "0.52rem", letterSpacing: "0.22em", color: T.goldMid, textTransform: "uppercase" }}>
                Secure Checkout
              </Typography>
              <Box sx={{ width: 28, height: 1, background: `linear-gradient(90deg,${T.gold},${T.goldLight})` }} />
            </Box>
            <Box sx={{ overflow: "hidden" }}>
              <motion.div
                initial={{ y: "110%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 0.65, delay: 0.08, ease: EASE }}
              >
                <Typography sx={{
                  fontFamily: SERIF, fontStyle: "italic", fontWeight: 400,
                  fontSize: { xs: "2rem", md: "2.75rem" },
                  color: T.ink, letterSpacing: "-0.03em", lineHeight: 1.1,
                }}>
                  Complete your order.
                </Typography>
              </motion.div>
            </Box>
          </Box>
        </motion.div>

        {/* Step indicator */}
        <StepIndicator current={currentStep} completed={completed} />

        {/* Main layout */}
        <Grid container spacing={{ xs: 3, md: 4 }} alignItems="flex-start">

          {/* Left — step form */}
          <Grid size={{ xs: 12, md: 7 }}>
            {/* Swiper container */}
            <Box sx={{ position: "relative", overflow: "hidden", minHeight: 400 }}>
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={currentStep}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.42, ease: EASE }}
                  style={{ width: "100%" }}
                >
                  {currentStep === 0 && (
                    <StepContact {...stepProps} onNext={goNext} />
                  )}
                  {currentStep === 1 && (
                    <StepAddress {...stepProps} onNext={goNext} onBack={goBack} />
                  )}
                  {currentStep === 2 && (
                    <StepPayment {...stepProps} onBack={goBack} />
                  )}
                </motion.div>
              </AnimatePresence>
            </Box>
          </Grid>

          {/* Right — order summary */}
          <Grid size={{ xs: 12, md: 5 }}>
            <OrderSummary
              items={items}
              subtotalRaw={subtotalRaw}
              format={format}
              discount={promoDiscount}
              promoValid={promoValid}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
