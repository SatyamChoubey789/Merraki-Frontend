"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Container, Typography, CircularProgress, Grid } from "@mui/material";
import {
  LockOutlined as LockIcon,
  CheckCircle as CheckIcon,
  LocalOffer as PromoIcon,
  KeyboardArrowRight as ArrowIcon,
  Person as PersonIcon,
  Home as HomeIcon,
  Payment as PayIcon,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCart } from "@/lib/hooks/useCart";
import { useCurrency } from "@/lib/hooks/useCurrency";
import { useCheckout } from "@/lib/hooks/useCheckout";
import { checkoutSchema, type CheckoutFormValues } from "@/lib/schemas/checkout.schema";

const T = {
  bg:          "#F5F7FB",
  bgCard:      "#FFFFFF",
  bgSection:   "#F5F7FB",
  bgInput:     "#FFFFFF",
  ink:         "#0A0A0F",
  inkMid:      "#1E1E2A",
  inkMuted:    "#5A5A72",
  inkFaint:    "#9898AE",
  border:      "rgba(10,10,20,0.09)",
  borderMid:   "rgba(10,10,20,0.14)",
  borderFocus: "rgba(59,123,246,0.42)",
  blue:        "#3B7BF6",
  blueLight:   "#7AABFF",
  bluePale:    "#EDF3FF",
  blueGlow:    "rgba(59,123,246,0.14)",
  blueDim:     "rgba(59,123,246,0.06)",
  blueGrad:    "linear-gradient(135deg,#3B7BF6 0%,#7AABFF 100%)",
  green:       "#059669",
  greenPale:   "#DCFCE7",
  greenBorder: "rgba(5,150,105,0.25)",
  red:         "#DC2626",
  redPale:     "rgba(220,38,38,0.06)",
  redBorder:   "rgba(220,38,38,0.22)",
};

const SANS = '"DM Sans","Mona Sans",system-ui,sans-serif';
const MONO = '"DM Mono","JetBrains Mono",ui-monospace,monospace';
const EASE = [0.16, 1, 0.3, 1] as const;

const STEPS = [
  { id: "contact", label: "Contact", icon: PersonIcon },
  { id: "address", label: "Address", icon: HomeIcon   },
  { id: "payment", label: "Payment", icon: PayIcon    },
] as const;

/* ── Input ── */
function Field({ label, error, hint, disabled, type = "text", placeholder, ...rest }: {
  label: string; error?: string; hint?: string;
  disabled?: boolean; type?: string; placeholder?: string;
  [k: string]: any;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <Box>
      <Typography sx={{
        fontFamily: MONO, fontSize: "0.48rem", letterSpacing: "0.14em",
        textTransform: "uppercase", mb: 0.75,
        color: error ? T.red : focused ? T.blue : T.inkFaint,
        transition: "color 0.18s",
      }}>
        {label}
      </Typography>
      <Box sx={{
        border: `1.5px solid ${error ? T.redBorder : focused ? T.borderFocus : T.border}`,
        borderRadius: "10px", background: T.bgInput,
        transition: "border-color 0.2s, box-shadow 0.2s",
        boxShadow: focused ? `0 0 0 3px ${error ? T.redPale : T.blueDim}` : "none",
      }}>
        <input
          type={type} placeholder={placeholder} disabled={disabled}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{
            width: "100%", padding: "12px 14px",
            border: "none", outline: "none", background: "transparent",
            fontFamily: SANS, fontSize: "0.875rem", color: T.ink,
            borderRadius: "10px", boxSizing: "border-box",
          }}
          {...rest}
        />
      </Box>
      {(error || hint) && (
        <Typography sx={{ fontFamily: SANS, fontSize: "0.72rem", color: error ? T.red : T.inkFaint, mt: 0.5, ml: 0.25 }}>
          {error || hint}
        </Typography>
      )}
    </Box>
  );
}

/* ── Step indicator ── */
function Steps({ current, completed }: { current: number; completed: Set<number> }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 6 }}>
      {STEPS.map((step, i) => {
        const done   = completed.has(i);
        const active = i === current;
        return (
          <Box key={step.id} sx={{ display: "flex", alignItems: "center" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
              <motion.div animate={{ scale: active ? 1.06 : 1 }} transition={{ type: "spring", stiffness: 380, damping: 22 }}>
                <Box sx={{
                  width: 34, height: 34, borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: done ? T.green : active ? T.blueGrad : T.bgCard,
                  border: `1.5px solid ${done ? T.greenBorder : active ? "rgba(59,123,246,0.4)" : T.border}`,
                  boxShadow: active ? `0 3px 14px ${T.blueGlow}` : "none",
                  transition: "all 0.28s ease",
                }}>
                  {done
                    ? <CheckIcon sx={{ fontSize: "0.85rem", color: "#fff" }} />
                    : <step.icon sx={{ fontSize: "0.78rem", color: active ? "#fff" : T.inkFaint }} />
                  }
                </Box>
              </motion.div>
              <Typography sx={{
                fontFamily: SANS, fontWeight: 600, fontSize: "0.78rem",
                color: active ? T.ink : done ? T.green : T.inkFaint,
                display: { xs: "none", sm: "block" },
                transition: "color 0.25s",
              }}>
                {step.label}
              </Typography>
            </Box>
            {i < STEPS.length - 1 && (
              <Box sx={{
                width: { xs: 24, sm: 44, md: 60 }, height: "1.5px",
                mx: { xs: 0.75, sm: 1.25 }, borderRadius: 1,
                background: done ? T.blueGrad : T.border,
                transition: "background 0.35s",
              }} />
            )}
          </Box>
        );
      })}
    </Box>
  );
}

/* ── Order summary ── */
function Summary({ items, subtotalRaw, format, discount, promoValid }: any) {
  const sub  = subtotalRaw / 100;
  const disc = promoValid ? sub * (discount / 100) : 0;
  const total = sub - disc;

  return (
    <Box sx={{
      background: T.bgCard, borderRadius: "16px",
      border: `1px solid ${T.border}`,
      position: "sticky", top: 88,
      boxShadow: "0 2px 20px rgba(10,10,20,0.05)",
    }}>
      <Box sx={{ px: 3, py: 2.5, borderBottom: `1px solid ${T.border}` }}>
        <Typography sx={{ fontFamily: SANS, fontWeight: 700, fontSize: "0.875rem", color: T.ink }}>
          Order Summary
        </Typography>
      </Box>

      <Box sx={{ px: 3, py: 3, display: "flex", flexDirection: "column", gap: 2.5 }}>
        {items.map((item: any) => (
          <Box key={item.templateId} sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
            <Box sx={{
              width: 44, height: 44, borderRadius: "10px", flexShrink: 0,
              background: T.bluePale, border: `1px solid rgba(59,123,246,0.12)`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Typography sx={{ fontSize: "0.85rem", color: T.blue }}>◈</Typography>
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography sx={{
                fontFamily: SANS, fontWeight: 600, fontSize: "0.8rem",
                color: T.inkMid, lineHeight: 1.35,
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}>
                {item.template.title}
              </Typography>
              <Typography sx={{ fontFamily: MONO, fontSize: "0.46rem", letterSpacing: "0.1em", color: T.inkFaint, textTransform: "uppercase", mt: 0.25 }}>
                Qty {item.quantity}
              </Typography>
            </Box>
            <Typography sx={{ fontFamily: SANS, fontWeight: 600, fontSize: "0.8rem", color: T.inkMid, flexShrink: 0 }}>
              {format((item.template.price_inr / 100) * item.quantity, "INR")}
            </Typography>
          </Box>
        ))}
      </Box>

      <Box sx={{ px: 3, pb: 3, borderTop: `1px solid ${T.border}` }}>
        <Box sx={{ pt: 2.5, display: "flex", flexDirection: "column", gap: 1 }}>
          <Row label="Subtotal" value={format(sub, "INR")} />
          {promoValid && disc > 0 && (
            <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}>
              <Row label={`Promo (${discount}% off)`} value={`−${format(disc, "INR")}`} green />
            </motion.div>
          )}
          <Row label="GST / Tax" value="Included" faint />
          <Box sx={{ height: "1px", background: T.border, my: 0.75 }} />
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography sx={{ fontFamily: SANS, fontWeight: 700, fontSize: "0.875rem", color: T.ink }}>Total</Typography>
            <Typography sx={{ fontFamily: SANS, fontWeight: 800, fontSize: "1.375rem", color: T.ink, letterSpacing: "-0.03em" }}>
              {format(total, "INR")}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ px: 3, py: 2, borderTop: `1px solid ${T.border}`, background: T.bgSection, borderRadius: "0 0 16px 16px", display: "flex", flexDirection: "column", gap: 0.875 }}>
        {[
          { icon: "🔒", text: "256-bit SSL encryption" },
          { icon: "⚡", text: "Instant delivery to email" },
          { icon: "↩️", text: "7-day refund guarantee"  },
        ].map(b => (
          <Box key={b.text} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography sx={{ fontSize: "0.68rem" }}>{b.icon}</Typography>
            <Typography sx={{ fontFamily: SANS, fontSize: "0.72rem", color: T.inkMuted }}>{b.text}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

function Row({ label, value, green, faint }: { label: string; value: string; green?: boolean; faint?: boolean }) {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
      <Typography sx={{ fontFamily: SANS, fontSize: "0.8rem", color: green ? T.green : T.inkMuted }}>{label}</Typography>
      <Typography sx={{ fontFamily: SANS, fontSize: "0.8rem", fontWeight: 600, color: green ? T.green : faint ? T.inkFaint : T.inkMid }}>{value}</Typography>
    </Box>
  );
}

/* ── Promo ── */
function Promo({ onApply }: { onApply: (code: string, discount: number, valid: boolean) => void }) {
  const [code, setCode]     = useState("");
  const [status, setStatus] = useState<"idle"|"checking"|"valid"|"invalid">("idle");
  const [open, setOpen]     = useState(false);

  const apply = async () => {
    if (!code.trim()) return;
    setStatus("checking");
    await new Promise(r => setTimeout(r, 900));
    const ok = code.toUpperCase() === "MERRAKI20";
    setStatus(ok ? "valid" : "invalid");
    onApply(code, ok ? 20 : 0, ok);
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Box onClick={() => setOpen(v => !v)} sx={{ display: "inline-flex", alignItems: "center", gap: 0.75, cursor: "pointer" }}>
        <PromoIcon sx={{ fontSize: "0.82rem", color: T.blue }} />
        <Typography sx={{ fontFamily: SANS, fontSize: "0.8rem", color: T.inkMuted, "&:hover": { color: T.blue }, transition: "color 0.15s" }}>
          Have a promo code?
        </Typography>
        <motion.span animate={{ rotate: open ? 90 : 0 }} transition={{ duration: 0.2, ease: EASE }} style={{ display: "inline-flex" }}>
          <ArrowIcon sx={{ fontSize: "0.75rem", color: T.inkFaint }} />
        </motion.span>
      </Box>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: EASE }}
            style={{ overflow: "hidden" }}
          >
            <Box sx={{ mt: 1.5, display: "flex", gap: 1 }}>
              <Box sx={{
                flex: 1, border: `1.5px solid ${status === "valid" ? T.greenBorder : status === "invalid" ? T.redBorder : T.border}`,
                borderRadius: "10px", overflow: "hidden", transition: "border-color 0.2s",
              }}>
                <input
                  value={code}
                  onChange={e => { setCode(e.target.value); setStatus("idle"); }}
                  placeholder="e.g. MERRAKI20"
                  style={{
                    width: "100%", padding: "10px 13px", border: "none", outline: "none",
                    background: "transparent", fontFamily: MONO, fontSize: "0.8rem",
                    letterSpacing: "0.08em", color: T.ink, boxSizing: "border-box",
                  }}
                />
              </Box>
              <motion.button
                onClick={apply} disabled={status === "checking" || !code.trim()}
                whileTap={{ scale: 0.97 }}
                style={{
                  padding: "10px 18px", borderRadius: "10px", border: "none",
                  background: T.blueGrad, color: "#fff",
                  fontFamily: SANS, fontWeight: 700, fontSize: "0.8rem",
                  cursor: !code.trim() ? "default" : "pointer",
                  opacity: !code.trim() ? 0.5 : 1, whiteSpace: "nowrap",
                  boxShadow: `0 3px 12px ${T.blueGlow}`,
                }}
              >
                {status === "checking" ? "..." : "Apply"}
              </motion.button>
            </Box>
            <AnimatePresence mode="wait">
              {status === "valid" && (
                <motion.div key="v" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <Typography sx={{ fontFamily: SANS, fontSize: "0.72rem", color: T.green, mt: 0.75 }}>✓ 20% discount applied!</Typography>
                </motion.div>
              )}
              {status === "invalid" && (
                <motion.div key="i" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <Typography sx={{ fontFamily: SANS, fontSize: "0.72rem", color: T.red, mt: 0.75 }}>Invalid code. Try MERRAKI20.</Typography>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
}

/* ── Card wrapper ── */
function Card({ title, sub, children }: { title: string; sub: string; children: React.ReactNode }) {
  return (
    <Box sx={{
      background: T.bgCard, borderRadius: "16px",
      border: `1px solid ${T.border}`,
      boxShadow: "0 2px 20px rgba(10,10,20,0.05)",
      overflow: "hidden",
    }}>
      <Box sx={{ px: { xs: 3, md: 4 }, py: 3, borderBottom: `1px solid ${T.border}`, background: T.bgSection }}>
        <Typography sx={{ fontFamily: MONO, fontSize: "0.46rem", letterSpacing: "0.16em", color: T.blue, textTransform: "uppercase", mb: 0.5 }}>
          {sub}
        </Typography>
        <Typography sx={{ fontFamily: SANS, fontWeight: 800, fontSize: { xs: "1.25rem", md: "1.5rem" }, color: T.ink, letterSpacing: "-0.03em" }}>
          {title}
        </Typography>
      </Box>
      <Box sx={{ px: { xs: 3, md: 4 }, py: { xs: 3, md: 4 } }}>
        {children}
      </Box>
    </Box>
  );
}

/* ── Steps ── */
function StepContact({ register, errors, onNext, isProcessing }: any) {
  return (
    <Card title="Your Details" sub="Step 1 of 3 — Contact">
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Field label="Full Name *" placeholder="Arjun Mehta" error={errors.name?.message} disabled={isProcessing} {...register("name")} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Field label="Email Address *" type="email" placeholder="you@company.com" hint="Download link sent here" error={errors.email?.message} disabled={isProcessing} {...register("email")} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Field label="Phone Number" type="tel" placeholder="+91 98765 43210" error={errors.phone?.message} disabled={isProcessing} {...register("phone")} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Field label="Company (optional)" placeholder="Merraki Solutions" disabled={isProcessing} {...register("company")} />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Field label="GST Number (optional)" placeholder="22AAAAA0000A1Z5" hint="Required for B2B GST invoice" disabled={isProcessing} {...register("gstNumber")} />
        </Grid>
      </Grid>
      <Box sx={{ mt: 3.5 }}>
        <BtnNext onClick={onNext} label="Continue to Address" />
      </Box>
    </Card>
  );
}

function StepAddress({ register, errors, onNext, onBack, isProcessing }: any) {
  const [same, setSame] = useState(true);
  return (
    <Card title="Billing & Shipping" sub="Step 2 of 3 — Address">
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12 }}>
          <Field label="Address Line 1 *" placeholder="123, MG Road" error={errors.addressLine1?.message} disabled={isProcessing} {...register("addressLine1")} />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Field label="Address Line 2" placeholder="Apt / Suite / Floor" disabled={isProcessing} {...register("addressLine2")} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Field label="City *" placeholder="Mumbai" error={errors.city?.message} disabled={isProcessing} {...register("city")} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Field label="State *" placeholder="Maharashtra" error={errors.state?.message} disabled={isProcessing} {...register("state")} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Field label="PIN Code *" placeholder="400001" error={errors.pinCode?.message} disabled={isProcessing} {...register("pinCode")} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Field label="Country" placeholder="India" disabled={isProcessing} {...register("country")} />
        </Grid>
      </Grid>

      <Box onClick={() => setSame(v => !v)} sx={{
        display: "flex", alignItems: "center", gap: 1.25, cursor: "pointer",
        p: "11px 14px", borderRadius: "10px",
        background: same ? T.blueDim : "transparent",
        border: `1px solid ${same ? "rgba(59,123,246,0.2)" : T.border}`,
        mb: 3, transition: "all 0.2s ease",
      }}>
        <Box sx={{
          width: 17, height: 17, borderRadius: "5px", flexShrink: 0,
          border: `1.5px solid ${same ? T.blue : T.borderMid}`,
          background: same ? T.blueGrad : "transparent",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all 0.18s",
        }}>
          {same && <CheckIcon sx={{ fontSize: "0.6rem", color: "#fff" }} />}
        </Box>
        <Typography sx={{ fontFamily: SANS, fontSize: "0.82rem", color: T.inkMid }}>
          Shipping address same as billing
        </Typography>
      </Box>

      <AnimatePresence>
        {!same && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.32, ease: EASE }} style={{ overflow: "hidden" }}>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid size={{ xs: 12 }}><Field label="Shipping Address *" placeholder="456, Linking Road" disabled={isProcessing} {...register("shippingAddressLine1")} /></Grid>
              <Grid size={{ xs: 12, sm: 6 }}><Field label="City *" placeholder="Mumbai" disabled={isProcessing} {...register("shippingCity")} /></Grid>
              <Grid size={{ xs: 12, sm: 6 }}><Field label="State *" placeholder="Maharashtra" disabled={isProcessing} {...register("shippingState")} /></Grid>
              <Grid size={{ xs: 12, sm: 6 }}><Field label="PIN Code *" placeholder="400050" disabled={isProcessing} {...register("shippingPinCode")} /></Grid>
            </Grid>
          </motion.div>
        )}
      </AnimatePresence>

      <Box sx={{ display: "flex", gap: 1.25 }}>
        <BtnBack onClick={onBack} />
        <Box sx={{ flex: 1 }}><BtnNext onClick={onNext} label="Continue to Payment" /></Box>
      </Box>
    </Card>
  );
}

function StepPayment({ handleSubmit, onSubmit, onBack, isProcessing, subtotalRaw, format, discount, promoValid, onPromo }: any) {
  return (
    <Card title="Review & Pay" sub="Step 3 of 3 — Payment">
      <Promo onApply={onPromo} />

      <Box sx={{
        p: "13px 16px", borderRadius: "10px",
        background: T.blueDim, border: `1px solid rgba(59,123,246,0.12)`,
        display: "flex", alignItems: "flex-start", gap: 1.25, mb: 3,
      }}>
        <LockIcon sx={{ fontSize: "0.85rem", color: T.blue, mt: "1px", flexShrink: 0 }} />
        <Typography sx={{ fontFamily: SANS, fontSize: "0.78rem", color: T.inkMuted, lineHeight: 1.65 }}>
          Payments powered by{" "}
          <Typography component="span" sx={{ fontWeight: 700, color: T.inkMid, fontSize: "inherit" }}>Razorpay</Typography>
          . We never store card details. All transactions are 256-bit encrypted.
        </Typography>
      </Box>

      <Box sx={{ mb: 3.5 }}>
        {[
          { icon: "⚡", text: "Razorpay payment screen opens securely"         },
          { icon: "📧", text: "Instant confirmation email with download link"  },
          { icon: "🔓", text: "Lifetime access — download anytime"             },
          { icon: "↩️", text: "7-day no-questions refund if unsatisfied"       },
        ].map(item => (
          <Box key={item.text} sx={{ display: "flex", gap: 1.25, mb: 0.875 }}>
            <Typography sx={{ fontSize: "0.75rem", lineHeight: 1.7, flexShrink: 0 }}>{item.icon}</Typography>
            <Typography sx={{ fontFamily: SANS, fontSize: "0.8rem", color: T.inkMuted, lineHeight: 1.7 }}>{item.text}</Typography>
          </Box>
        ))}
      </Box>

      <Box sx={{ display: "flex", gap: 1.25 }}>
        <BtnBack onClick={onBack} />
        <Box sx={{ flex: 1 }}>
          <BtnPay onClick={handleSubmit(onSubmit)} isProcessing={isProcessing}
            label={`Pay ${format((subtotalRaw / 100) * (1 - (promoValid ? discount / 100 : 0)), "INR")} Securely`} />
        </Box>
      </Box>

      <Typography sx={{ fontFamily: MONO, fontSize: "0.42rem", letterSpacing: "0.1em", color: T.inkFaint, textTransform: "uppercase", mt: 2, textAlign: "center" }}>
        By paying you agree to our Terms of Service & Refund Policy
      </Typography>
    </Card>
  );
}

/* ── Buttons ── */
function BtnNext({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <motion.button onClick={onClick} whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }} style={{
      width: "100%", padding: "13px 24px", borderRadius: "11px", border: "none", cursor: "pointer",
      background: T.blueGrad, color: "#fff", fontFamily: SANS, fontWeight: 700, fontSize: "0.875rem",
      letterSpacing: "-0.01em", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
      boxShadow: `0 4px 18px ${T.blueGlow}`, transition: "box-shadow 0.2s",
    }}>
      {label} <ArrowIcon style={{ fontSize: "0.95rem" }} />
    </motion.button>
  );
}

function BtnBack({ onClick }: { onClick: () => void }) {
  return (
    <motion.button onClick={onClick} whileHover={{ x: -1 }} whileTap={{ scale: 0.97 }} style={{
      padding: "13px 18px", borderRadius: "11px",
      border: `1.5px solid ${T.border}`, background: "transparent",
      cursor: "pointer", color: T.inkMuted, fontFamily: SANS,
      fontWeight: 500, fontSize: "0.82rem", whiteSpace: "nowrap",
      transition: "border-color 0.18s, color 0.18s",
    }}>
      ← Back
    </motion.button>
  );
}

function BtnPay({ onClick, isProcessing, label }: { onClick: () => void; isProcessing: boolean; label: string }) {
  return (
    <motion.button onClick={onClick} disabled={isProcessing} whileHover={{ y: isProcessing ? 0 : -1 }} whileTap={{ scale: isProcessing ? 1 : 0.98 }} style={{
      width: "100%", padding: "14px 24px", borderRadius: "11px", border: "none",
      cursor: isProcessing ? "wait" : "pointer",
      background: isProcessing ? T.border : T.blueGrad,
      color: isProcessing ? T.inkFaint : "#fff",
      fontFamily: SANS, fontWeight: 700, fontSize: "0.875rem",
      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
      boxShadow: isProcessing ? "none" : `0 6px 22px ${T.blueGlow}`,
      transition: "all 0.22s",
    }}>
      {isProcessing
        ? <><CircularProgress size={15} sx={{ color: T.inkFaint }} /> Processing...</>
        : <><LockIcon style={{ fontSize: "0.9rem" }} /> {label}</>
      }
    </motion.button>
  );
}

/* ── Slide variants ── */
const slide = {
  enter: (d: number) => ({ x: d > 0 ? "60%" : "-60%", opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:  (d: number) => ({ x: d > 0 ? "-60%" : "60%", opacity: 0 }),
};

/* ══ MAIN ════════════════════════════════════════════════ */
export function CheckoutPageClient() {
  const router = useRouter();
  const { items, itemCount, subtotalRaw } = useCart();
  const { format } = useCurrency();
  const { initiateCheckout, isProcessing } = useCheckout();

  const [step,      setStep]      = useState(0);
  const [dir,       setDir]       = useState(1);
  const [completed, setCompleted] = useState<Set<number>>(new Set());
  const [promoDisc, setPromoDisc] = useState(0);
  const [promoOk,   setPromoOk]   = useState<boolean | null>(null);

  const { register, handleSubmit, control, formState: { errors }, watch, setValue } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { country: "India", shippingCountry: "India" },
  });

  useEffect(() => { if (itemCount === 0) router.replace("/templates"); }, [itemCount, router]);
  if (itemCount === 0) return null;

  const next = () => { setCompleted(p => new Set([...p, step])); setDir(1); setStep(s => Math.min(s + 1, 2)); };
  const back = () => { setDir(-1); setStep(s => Math.max(s - 1, 0)); };
  const promo = (_: string, d: number, ok: boolean) => { setPromoDisc(d); setPromoOk(ok || false); };
  const onSubmit = (data: CheckoutFormValues) => initiateCheckout(data);

  const props = { register, errors, control, handleSubmit, onSubmit, isProcessing, watch, setValue, subtotalRaw, format, discount: promoDisc, promoValid: promoOk, onPromo: promo };

  return (
    <Box sx={{ pt: { xs: 8, md: 11 }, pb: 14, minHeight: "100vh", background: T.bg }}>
      {/* Dot grid */}
      <Box sx={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: `radial-gradient(circle, rgba(59,123,246,0.05) 1px, transparent 1px)`, backgroundSize: "30px 30px" }} />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>

        {/* Heading */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, ease: EASE }}>
          <Box sx={{ textAlign: "center", mb: 5 }}>
            <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1, px: "12px", py: "5px", borderRadius: "100px", border: `1px solid rgba(59,123,246,0.18)`, background: T.bluePale, mb: 2 }}>
              <LockIcon sx={{ fontSize: "0.65rem", color: T.blue }} />
              <Typography sx={{ fontFamily: MONO, fontSize: "0.46rem", letterSpacing: "0.18em", color: T.blue, textTransform: "uppercase" }}>
                Secure Checkout
              </Typography>
            </Box>
            <Typography sx={{ fontFamily: SANS, fontWeight: 800, fontSize: { xs: "1.75rem", md: "2.25rem" }, color: T.ink, letterSpacing: "-0.04em" }}>
              Complete your order
            </Typography>
          </Box>
        </motion.div>

        {/* Step indicator */}
        <Steps current={step} completed={completed} />

        <Grid container spacing={{ xs: 3, md: 4 }} alignItems="flex-start">
          {/* Form */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Box sx={{ position: "relative", overflow: "hidden" }}>
              <AnimatePresence mode="wait" custom={dir}>
                <motion.div key={step} custom={dir} variants={slide} initial="enter" animate="center" exit="exit"
                  transition={{ duration: 0.35, ease: EASE }} style={{ width: "100%" }}>
                  {step === 0 && <StepContact {...props} onNext={next} />}
                  {step === 1 && <StepAddress {...props} onNext={next} onBack={back} />}
                  {step === 2 && <StepPayment {...props} onBack={back} />}
                </motion.div>
              </AnimatePresence>
            </Box>
          </Grid>

          {/* Summary */}
          <Grid size={{ xs: 12, md: 5 }}>
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.55, delay: 0.1, ease: EASE }}>
              <Summary items={items} subtotalRaw={subtotalRaw} format={format} discount={promoDisc} promoValid={promoOk} />
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}