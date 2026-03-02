"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box, Container, Typography, CircularProgress, Grid,
} from "@mui/material";
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

/* ══ TOKENS — pure white + black + ice-blue ══════════════ */
const T = {
  bg:          "#F0F5FF",
  bgCard:      "#FFFFFF",
  bgInput:     "#FFFFFF",
  bgSection:   "#F5F7FB",

  ink:         "#0A0A0F",
  inkMid:      "#1E1E2A",
  inkMuted:    "#5A5A72",
  inkFaint:    "#9898AE",
  inkGhost:    "#C8D0E8",

  border:      "rgba(10,10,20,0.08)",
  borderMid:   "rgba(10,10,20,0.14)",
  borderFocus: "rgba(59,123,246,0.5)",

  blue:        "#3B7BF6",
  blueMid:     "#5A92F8",
  blueLight:   "#7AABFF",
  bluePale:    "#EDF3FF",
  blueGlow:    "rgba(59,123,246,0.18)",
  blueDim:     "rgba(59,123,246,0.07)",
  blueGrad:    "linear-gradient(135deg, #3B7BF6 0%, #7AABFF 100%)",

  green:       "#059669",
  greenBg:     "rgba(5,150,105,0.07)",
  greenBorder: "rgba(5,150,105,0.22)",

  red:         "#DC2626",
  redBg:       "rgba(220,38,38,0.06)",
  redBorder:   "rgba(220,38,38,0.22)",
};

const SERIF = '"Instrument Serif","Playfair Display",Georgia,serif';
const SANS  = '"DM Sans","Mona Sans",system-ui,sans-serif';
const MONO  = '"DM Mono","JetBrains Mono",ui-monospace,monospace';
const EASE  = [0.16, 1, 0.3, 1] as const;

/* ══ STEPS ═══════════════════════════════════════════════ */
const STEPS = [
  { id: "contact", label: "Contact", icon: PersonIcon },
  { id: "address", label: "Address", icon: HomeIcon   },
  { id: "payment", label: "Payment", icon: PayIcon    },
] as const;

/* ══ LUX INPUT ═══════════════════════════════════════════ */
function LuxInput({
  label, error, hint, disabled, type = "text", placeholder, ...rest
}: {
  label: string; error?: string; hint?: string;
  disabled?: boolean; type?: string; placeholder?: string;
  [key: string]: any;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <Box>
      <Typography sx={{
        fontFamily: MONO, fontSize: "0.5rem", letterSpacing: "0.16em",
        color: error ? T.red : focused ? T.blue : T.inkMuted,
        textTransform: "uppercase", mb: 0.75,
        transition: "color 0.2s ease",
      }}>
        {label}
      </Typography>
      <Box sx={{
        background: T.bgInput,
        border: `1px solid ${error ? T.redBorder : focused ? T.borderFocus : T.border}`,
        borderRadius: "12px",
        transition: "border-color 0.22s ease, box-shadow 0.22s ease",
        boxShadow: focused
          ? `0 0 0 3px ${error ? T.redBg : T.blueDim}`
          : "none",
      }}>
        <input
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: "100%", padding: "13px 16px",
            border: "none", outline: "none", background: "transparent",
            fontFamily: SANS, fontSize: "0.9rem", color: T.ink,
            borderRadius: "12px", boxSizing: "border-box",
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
        const isDone   = completed.has(i);
        const isActive = i === current;

        return (
          <Box key={step.id} sx={{ display: "flex", alignItems: "center" }}>
            <motion.div
              animate={{ scale: isActive ? 1.08 : 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 22 }}
            >
              <Box sx={{
                width: 38, height: 38, borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                background: isDone
                  ? `linear-gradient(135deg,${T.green},#10B981)`
                  : isActive
                    ? T.blueGrad
                    : T.bgCard,
                border: `1.5px solid ${isDone ? T.greenBorder : isActive ? "rgba(59,123,246,0.5)" : T.border}`,
                boxShadow: isActive ? `0 4px 16px ${T.blueGlow}` : "none",
                transition: "all 0.3s ease",
              }}>
                {isDone
                  ? <CheckIcon sx={{ fontSize: "0.9rem", color: "#fff" }} />
                  : <step.icon sx={{ fontSize: "0.85rem", color: isActive ? "#fff" : T.inkGhost }} />
                }
              </Box>
            </motion.div>

            <Typography sx={{
              fontFamily: MONO, fontSize: "0.48rem",
              letterSpacing: "0.16em", textTransform: "uppercase",
              color: isActive ? T.blue : isDone ? T.green : T.inkGhost,
              ml: 0.875, mr: 0.5,
              display: { xs: "none", sm: "block" },
              transition: "color 0.3s ease",
            }}>
              {step.label}
            </Typography>

            {i < STEPS.length - 1 && (
              <Box sx={{
                width: { xs: 28, sm: 48, md: 64 }, height: 1.5,
                mx: { xs: 0.5, sm: 1 }, borderRadius: 1,
                background: isDone ? T.blueGrad : T.border,
                transition: "background 0.4s ease",
              }} />
            )}
          </Box>
        );
      })}
    </Box>
  );
}

/* ══ ORDER SUMMARY ═══════════════════════════════════════ */
function OrderSummary({ items, subtotalRaw, format, discount, promoValid }: {
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
        boxShadow: `0 4px 32px ${T.blueDim}`,
      }}>
        {/* Header */}
        <Box sx={{
          px: 3, py: 2.5,
          borderBottom: `1px solid ${T.border}`,
          display: "flex", alignItems: "center", gap: 1.25,
        }}>
          <Box sx={{ width: 16, height: 1.5, borderRadius: 1, background: T.blueGrad }} />
          <Typography sx={{
            fontFamily: MONO, fontSize: "0.5rem",
            letterSpacing: "0.2em", color: T.blue, textTransform: "uppercase",
          }}>
            Order Summary
          </Typography>
        </Box>

        {/* Items */}
        <Box sx={{ px: 3, py: 3, display: "flex", flexDirection: "column", gap: 2.5 }}>
          {items.map((item: any) => (
            <Box key={item.templateId} sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
              <Box sx={{
                width: 48, height: 48, borderRadius: "10px", flexShrink: 0,
                background: T.bluePale, border: `1px solid rgba(59,123,246,0.14)`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Typography sx={{ fontSize: "0.9rem", color: T.blue }}>◈</Typography>
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{
                  fontFamily: SANS, fontWeight: 600, fontSize: "0.82rem",
                  color: T.inkMid, lineHeight: 1.35, mb: 0.25,
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>
                  {item.template.title}
                </Typography>
                <Typography sx={{
                  fontFamily: MONO, fontSize: "0.48rem",
                  letterSpacing: "0.1em", color: T.inkFaint, textTransform: "uppercase",
                }}>
                  Qty {item.quantity}
                </Typography>
              </Box>
              <Typography sx={{
                fontFamily: MONO, fontWeight: 600, fontSize: "0.875rem",
                color: T.inkMid, flexShrink: 0,
              }}>
                {format((item.template.price_inr / 100) * item.quantity, "INR")}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Totals */}
        <Box sx={{ px: 3, pb: 3, borderTop: `1px solid ${T.border}` }}>
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
          background: T.blueDim,
          display: "flex", flexDirection: "column", gap: 0.875,
        }}>
          {[
            { icon: "🔒", text: "256-bit SSL encryption" },
            { icon: "⚡", text: "Instant delivery to email" },
            { icon: "↩️", text: "7-day refund guarantee"  },
          ].map((b) => (
            <Box key={b.text} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography sx={{ fontSize: "0.7rem", lineHeight: 1 }}>{b.icon}</Typography>
              <Typography sx={{ fontFamily: SANS, fontSize: "0.72rem", color: T.inkMuted }}>
                {b.text}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </motion.div>
  );
}

/* ══ PROMO CODE ══════════════════════════════════════════ */
function PromoBox({ onApply }: { onApply: (code: string, discount: number, valid: boolean) => void }) {
  const [code,   setCode]   = useState("");
  const [status, setStatus] = useState<"idle"|"checking"|"valid"|"invalid">("idle");
  const [open,   setOpen]   = useState(false);

  const handleApply = async () => {
    if (!code.trim()) return;
    setStatus("checking");
    await new Promise(r => setTimeout(r, 900));
    const isValid = code.toUpperCase() === "MERRAKI20";
    setStatus(isValid ? "valid" : "invalid");
    onApply(code, isValid ? 20 : 0, isValid);
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Box
        onClick={() => setOpen(v => !v)}
        sx={{ display: "inline-flex", alignItems: "center", gap: 0.75, cursor: "pointer",
          "&:hover .promo-label": { color: T.blue },
        }}
      >
        <PromoIcon sx={{ fontSize: "0.85rem", color: T.blue }} />
        <Typography className="promo-label" sx={{
          fontFamily: SANS, fontSize: "0.8rem", color: T.inkMuted, transition: "color 0.18s",
        }}>
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
                flex: 1, background: T.bgInput,
                border: `1px solid ${status === "valid" ? T.greenBorder : status === "invalid" ? T.redBorder : T.border}`,
                borderRadius: "11px", overflow: "hidden", transition: "border-color 0.2s",
              }}>
                <input
                  value={code}
                  onChange={e => { setCode(e.target.value); setStatus("idle"); }}
                  placeholder="e.g. MERRAKI20"
                  style={{
                    width: "100%", padding: "11px 14px",
                    border: "none", outline: "none", background: "transparent",
                    fontFamily: MONO, fontSize: "0.82rem",
                    letterSpacing: "0.08em", color: T.ink, boxSizing: "border-box",
                  }}
                />
              </Box>
              <motion.button
                onClick={handleApply}
                disabled={status === "checking" || !code.trim()}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  padding: "11px 18px", borderRadius: "11px", border: "none",
                  background: T.blueGrad,
                  color: "#FFFFFF", fontFamily: SANS,
                  fontWeight: 700, fontSize: "0.82rem",
                  cursor: status === "checking" ? "wait" : "pointer",
                  boxShadow: `0 4px 14px ${T.blueGlow}`,
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
                <motion.div key="v" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <Typography sx={{ fontFamily: SANS, fontSize: "0.75rem", color: T.green, mt: 0.75, display: "flex", alignItems: "center", gap: 0.5 }}>
                    <CheckIcon sx={{ fontSize: "0.85rem" }} /> 20% discount applied!
                  </Typography>
                </motion.div>
              )}
              {status === "invalid" && (
                <motion.div key="i" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
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

/* ══ STEP CARD ═══════════════════════════════════════════ */
function StepCard({ title, subtitle, children }: {
  title: string; subtitle?: string; children: React.ReactNode;
}) {
  return (
    <Box sx={{
      background: T.bgCard, borderRadius: "22px",
      border: `1px solid ${T.border}`, overflow: "hidden",
      boxShadow: `0 4px 32px ${T.blueDim}`,
    }}>
      {/* Header */}
      <Box sx={{
        px: { xs: 3, md: 4 }, py: 3,
        borderBottom: `1px solid ${T.border}`,
        background: T.bgSection,
      }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 0.75 }}>
          <Box sx={{ width: 18, height: 1.5, borderRadius: 1, background: T.blueGrad }} />
          <Typography sx={{
            fontFamily: MONO, fontSize: "0.5rem",
            letterSpacing: "0.2em", color: T.blue, textTransform: "uppercase",
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

      {/* Body */}
      <Box sx={{ px: { xs: 3, md: 4 }, py: { xs: 3, md: 4 } }}>
        {children}
      </Box>
    </Box>
  );
}

/* ══ STEPS ═══════════════════════════════════════════════ */
function StepContact({ register, errors, onNext, isProcessing }: any) {
  return (
    <StepCard title="Your Details" subtitle="Step 1 of 3 — Contact">
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <LuxInput label="Full Name *" placeholder="Arjun Mehta" error={errors.name?.message} disabled={isProcessing} {...register("name")} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <LuxInput label="Email Address *" type="email" placeholder="you@company.com" hint="Download link sent here" error={errors.email?.message} disabled={isProcessing} {...register("email")} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <LuxInput label="Phone Number" type="tel" placeholder="+91 98765 43210" error={errors.phone?.message} disabled={isProcessing} {...register("phone")} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <LuxInput label="Company (optional)" placeholder="Merraki Solutions" disabled={isProcessing} {...register("company")} />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <LuxInput label="GST Number (optional)" placeholder="22AAAAA0000A1Z5" hint="Required for B2B GST invoice" disabled={isProcessing} {...register("gstNumber")} />
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ mt: 4 }}>
        <NextButton onClick={onNext} label="Continue to Address" />
      </Box>
    </StepCard>
  );
}

function StepAddress({ register, errors, onNext, onBack, isProcessing }: any) {
  const [sameAsBilling, setSameAsBilling] = useState(true);

  return (
    <StepCard title="Billing & Shipping" subtitle="Step 2 of 3 — Address">
      <Box sx={{ mb: 3.5 }}>
        <Typography sx={{ fontFamily: MONO, fontSize: "0.5rem", letterSpacing: "0.16em", color: T.inkMuted, textTransform: "uppercase", mb: 2 }}>
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
          background: sameAsBilling ? T.blueDim : T.bgInput,
          border: `1px solid ${sameAsBilling ? "rgba(59,123,246,0.22)" : T.border}`,
          transition: "all 0.22s ease",
        }}
      >
        <Box sx={{
          width: 18, height: 18, borderRadius: "5px",
          border: `1.5px solid ${sameAsBilling ? T.blue : T.borderMid}`,
          background: sameAsBilling ? T.blueGrad : "transparent",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all 0.2s ease", flexShrink: 0,
        }}>
          {sameAsBilling && <CheckIcon sx={{ fontSize: "0.65rem", color: "#fff" }} />}
        </Box>
        <Typography sx={{ fontFamily: SANS, fontSize: "0.83rem", color: T.inkMid }}>
          Shipping address same as billing
        </Typography>
      </Box>

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
              <Typography sx={{ fontFamily: MONO, fontSize: "0.5rem", letterSpacing: "0.16em", color: T.inkMuted, textTransform: "uppercase", mb: 2 }}>
                Shipping Address
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                  <LuxInput label="Address Line 1 *" placeholder="456, Linking Road" disabled={isProcessing} {...register("shippingAddressLine1")} />
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

      <Box sx={{ display: "flex", gap: 1.5, mt: 1 }}>
        <BackButton onClick={onBack} />
        <Box sx={{ flex: 1 }}>
          <NextButton onClick={onNext} label="Continue to Payment" />
        </Box>
      </Box>
    </StepCard>
  );
}

function StepPayment({ handleSubmit, onSubmit, onBack, isProcessing, subtotalRaw, format, discount, promoValid, onPromo }: any) {
  return (
    <StepCard title="Review & Pay" subtitle="Step 3 of 3 — Payment">
      <PromoBox onApply={onPromo} />

      {/* Security note */}
      <Box sx={{
        mt: 3, p: "14px 18px",
        background: T.blueDim, border: `1px solid rgba(59,123,246,0.14)`,
        borderRadius: "12px", display: "flex", alignItems: "center", gap: 1.5,
      }}>
        <LockIcon sx={{ fontSize: "0.95rem", color: T.blue }} />
        <Typography sx={{ fontFamily: SANS, fontSize: "0.8rem", color: T.inkMuted, lineHeight: 1.6 }}>
          Payments powered by{" "}
          <Typography component="span" sx={{ fontWeight: 700, color: T.inkMid, fontSize: "inherit" }}>Razorpay</Typography>
          . We never store card details. All transactions are 256-bit encrypted.
        </Typography>
      </Box>

      {/* What happens next */}
      <Box sx={{ mt: 3 }}>
        <Typography sx={{ fontFamily: MONO, fontSize: "0.48rem", letterSpacing: "0.16em", color: T.inkMuted, textTransform: "uppercase", mb: 1.5 }}>
          What happens next
        </Typography>
        {[
          { icon: "⚡", text: "Razorpay payment screen opens securely"         },
          { icon: "📧", text: "Instant confirmation email with download link"  },
          { icon: "🔓", text: "Lifetime access — download anytime"             },
          { icon: "↩️", text: "7-day no-questions refund if unsatisfied"       },
        ].map((item) => (
          <Box key={item.text} sx={{ display: "flex", alignItems: "flex-start", gap: 1.25, mb: 1 }}>
            <Typography sx={{ fontSize: "0.78rem", lineHeight: 1.6, flexShrink: 0 }}>{item.icon}</Typography>
            <Typography sx={{ fontFamily: SANS, fontSize: "0.82rem", color: T.inkMuted, lineHeight: 1.6 }}>{item.text}</Typography>
          </Box>
        ))}
      </Box>

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

      <Typography sx={{
        fontFamily: MONO, fontSize: "0.44rem", letterSpacing: "0.1em",
        color: T.inkFaint, textTransform: "uppercase", mt: 2, textAlign: "center",
      }}>
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
        background: T.blueGrad,
        color: "#FFFFFF", fontFamily: SANS, fontWeight: 700,
        fontSize: "0.9rem", letterSpacing: "-0.01em",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        boxShadow: `0 6px 24px ${T.blueGlow}`,
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
        padding: "14px 20px", borderRadius: "13px",
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
        background: isProcessing ? T.border : T.blueGrad,
        color: isProcessing ? T.inkFaint : "#FFFFFF",
        fontFamily: SANS, fontWeight: 700,
        fontSize: "0.9rem", letterSpacing: "-0.01em",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
        boxShadow: isProcessing ? "none" : `0 8px 28px ${T.blueGlow}`,
        transition: "all 0.25s ease",
      }}
    >
      {isProcessing ? (
        <><CircularProgress size={16} sx={{ color: T.inkFaint }} /> Processing...</>
      ) : (
        <><LockIcon style={{ fontSize: "0.95rem" }} /> {label}</>
      )}
    </motion.button>
  );
}

/* ══ SLIDE VARIANTS ══════════════════════════════════════ */
const slide = {
  enter: (dir: number) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0, scale: 0.96, filter: "blur(4px)" }),
  center: { x: 0, opacity: 1, scale: 1, filter: "blur(0px)" },
  exit:  (dir: number) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 0, scale: 0.96, filter: "blur(4px)" }),
};

/* ══ MAIN PAGE ═══════════════════════════════════════════ */
export function CheckoutPageClient() {
  const router = useRouter();
  const { items, itemCount, subtotalRaw } = useCart();
  const { format }   = useCurrency();
  const { initiateCheckout, isProcessing } = useCheckout();

  const [currentStep,   setCurrentStep]   = useState(0);
  const [direction,     setDirection]     = useState(1);
  const [completed,     setCompleted]     = useState<Set<number>>(new Set());
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoValid,    setPromoValid]    = useState<boolean | null>(null);

  const { register, handleSubmit, control, formState: { errors }, watch, setValue } = useForm<CheckoutFormValues>({
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
    setPromoValid(valid || false);
  };
  const onSubmit = (data: CheckoutFormValues) => initiateCheckout(data);

  const stepProps = {
    register, errors, control, handleSubmit, onSubmit,
    isProcessing, watch, setValue,
    subtotalRaw, format,
    discount: promoDiscount, promoValid,
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
      {/* Blue dot grid */}
      <Box sx={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: `radial-gradient(circle, rgba(59,123,246,0.07) 1px, transparent 1px)`,
        backgroundSize: "28px 28px",
      }} />

      {/* Blue ambient glow top */}
      <Box sx={{
        position: "absolute", width: "70vw", height: "40vw",
        top: "-12vw", left: "15vw", borderRadius: "50%",
        background: "radial-gradient(ellipse, rgba(59,123,246,0.08) 0%, transparent 65%)",
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
              <Box sx={{ width: 20, height: 1.5, borderRadius: 1, background: T.blueGrad }} />
              <Typography sx={{
                fontFamily: MONO, fontSize: "0.52rem",
                letterSpacing: "0.22em", color: T.blue, textTransform: "uppercase",
              }}>
                Secure Checkout
              </Typography>
              <Box sx={{ width: 20, height: 1.5, borderRadius: 1, background: T.blueGrad }} />
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

        {/* Layout */}
        <Grid container spacing={{ xs: 3, md: 4 }} alignItems="flex-start">
          {/* Left — form */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Box sx={{ position: "relative", overflow: "hidden", minHeight: 400 }}>
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={currentStep}
                  custom={direction}
                  variants={slide}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.42, ease: EASE }}
                  style={{ width: "100%" }}
                >
                  {currentStep === 0 && <StepContact {...stepProps} onNext={goNext} />}
                  {currentStep === 1 && <StepAddress {...stepProps} onNext={goNext} onBack={goBack} />}
                  {currentStep === 2 && <StepPayment {...stepProps} onBack={goBack} />}
                </motion.div>
              </AnimatePresence>
            </Box>
          </Grid>

          {/* Right — summary */}
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