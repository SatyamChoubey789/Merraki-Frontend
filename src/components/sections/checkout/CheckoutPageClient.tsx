"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, CircularProgress, Container, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { useCartSync } from "@/lib/hooks/Usecartsync";

// Store — CartItem: id (UUID), slug, title, priceCents, previewImage, categoryId
import { useCartItems, useCartTotalItems } from "@/lib/stores/useCartStore";

// Schema + types
import {
  checkoutSchema,
  type CheckoutFormValues,
} from "@/components/sections/checkout/checkout.schema";
import {
  T,
  SANS,
  type CartItemForCheckout,
} from "@/components/sections/checkout/checkout.types";

// Hook
import { useCheckout } from "@/lib/hooks/useCheckout";

// Components
import { StepBar } from "@/components/sections/checkout/StepBar";
import { FormCard } from "@/components/sections/checkout/FormCard";
import { OrderSummary } from "@/components/sections/checkout/OrderSummary";
import { StepContact } from "@/components/sections/checkout/StepContact";
import { StepAddress } from "@/components/sections/checkout/StepAddress";
import { StepPayment } from "@/components/sections/checkout/StepPayment";

// ─── Animation ────────────────────────────────────────────────────────────────

const EASE = [0.16, 1, 0.3, 1] as const;

const slide = {
  enter: (d: number) => ({ x: d > 0 ? "40%" : "-40%", opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (d: number) => ({ x: d > 0 ? "-40%" : "40%", opacity: 0 }),
};

// ─── Step config ──────────────────────────────────────────────────────────────

const STEP_FIELDS: (keyof CheckoutFormValues)[][] = [
  ["guestName", "guestEmail"],
  ["billingAddress"],
  [], // payment — validated on submit
];

const STEP_TITLES = ["Your details", "Billing address", "Review & pay"];

// ─── Full-screen overlay while we confirm the payment ─────────────────────────
// Shown after Razorpay's window closes, so the buyer never sees a half-finished
// form (or a blank flash) while /payments/verify runs.

function PaymentOverlay({ confirming }: { confirming: boolean }) {
  return (
    <Box
      role="status"
      aria-live="polite"
      sx={{
        minHeight: "100vh",
        background: T.bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 3,
      }}
    >
      <Box sx={{ textAlign: "center", maxWidth: 420 }}>
        <CircularProgress
          size={44}
          thickness={3}
          sx={{ color: T.primary, mb: 3 }}
        />
        <Typography
          sx={{
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: { xs: "1.5rem", md: "1.875rem" },
            color: T.ink,
            letterSpacing: "-0.025em",
            mb: 1,
          }}
        >
          {confirming ? "Confirming your payment" : "Verifying your payment"}
        </Typography>
        <Typography
          sx={{
            fontFamily: SANS,
            fontSize: "0.9rem",
            color: T.inkMuted,
            lineHeight: 1.7,
          }}
        >
          {confirming
            ? "Your bank is taking a little longer than usual. Keep this window open — it only takes a moment."
            : "Please don't close or refresh this window."}
        </Typography>
      </Box>
    </Box>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function CheckoutPageClient() {
  const router = useRouter();
  const rawItems = useCartItems();
  const itemCount = useCartTotalItems();

  // CartItem (store) → CartItemForCheckout. The backend identifies templates by
  // UUID (`templateId: z.string().uuid()`) — that is CartItem.id, NOT the slug.
  const items: CartItemForCheckout[] = rawItems.map((i) => ({
    id: i.id,
    templateId: i.id,
    title: i.title,
    slug: i.slug,
    priceCents: i.priceCents,
    previewImage: i.previewImage,
    categoryId: i.categoryId,
  }));

  // Display only — the backend recomputes the real total from the database.
  const totalCents = items.reduce((sum, i) => sum + i.priceCents, 0);

  // ── Step state ─────────────────────────────────────────────────────────────
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [completed, setCompleted] = useState<Set<number>>(new Set());
  const [mounted, setMounted] = useState(false);
  const syncNotices = useCartSync(mounted);

  useEffect(() => setMounted(true), []);

  // ── Checkout hook ──────────────────────────────────────────────────────────
  const { phase, isProcessing, error, initiateCheckout } = useCheckout();

  // Empty cart → back to templates. Only while idle: after a successful payment
  // the hook clears the cart and navigates to the success page, and this effect
  // must not fire a second navigation that overrides it.
  useEffect(() => {
    if (mounted && itemCount === 0 && phase === "idle")
      router.replace("/templates");
  }, [mounted, itemCount, phase, router]);

  // ── Form ───────────────────────────────────────────────────────────────────
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentMethod: "card",
      billingAddress: { country: "India" },
    },
  });

  // ── Navigation ─────────────────────────────────────────────────────────────
  const goNext = async () => {
    const valid = await trigger(STEP_FIELDS[step] as any);
    if (!valid) return;
    setCompleted((prev) => new Set([...prev, step]));
    setDir(1);
    setStep((s) => Math.min(s + 1, 2));
  };

  const goBack = () => {
    setDir(-1);
    setStep((s) => Math.max(s - 1, 0));
  };

  // ── Submit ─────────────────────────────────────────────────────────────────
  const onSubmit = handleSubmit((values) =>
    initiateCheckout(
      values,
      items.map((i) => i.id),
    ),
  );

  // ── Guards ─────────────────────────────────────────────────────────────────
  if (phase === "verifying" || phase === "confirming" || phase === "done") {
    return <PaymentOverlay confirming={phase === "confirming"} />;
  }
  if (!mounted || itemCount === 0) return null;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: T.bg,
        pt: { xs: 8, md: 10 },
        pb: 14,
      }}
    >
      <Container maxWidth="lg">
        {/* Heading */}
        <Box sx={{ textAlign: "center", mb: 5 }}>
          <Typography
            sx={{
              fontFamily: SANS,
              fontWeight: 800,
              fontSize: { xs: "1.625rem", md: "2rem" },
              color: T.ink,
              letterSpacing: "-0.025em",
              mb: 0.5,
            }}
          >
            Complete your order
          </Typography>
          <Typography
            sx={{ fontFamily: SANS, fontSize: "0.875rem", color: T.inkMuted }}
          >
            Secure checkout · Instant delivery
          </Typography>
        </Box>

        <StepBar current={step} completed={completed} />

        <Grid container spacing={{ xs: 3, md: 5 }} alignItems="flex-start">
          {/* Form */}
          <Grid size={{ xs: 12, md: 7 }}>
            {/* Cart sync notices */}
            {syncNotices.length > 0 && (
              <Box
                role="status"
                sx={{
                  mb: 2,
                  p: "12px 16px",
                  borderRadius: "10px",
                  background: "rgba(180,83,9,0.07)",
                  border: "1px solid rgba(180,83,9,0.22)",
                }}
              >
                {syncNotices.map((n) => (
                  <Typography
                    key={n}
                    sx={{
                      fontFamily: SANS,
                      fontSize: "0.8125rem",
                      color: "#B45309",
                      lineHeight: 1.6,
                    }}
                  >
                    {n}
                  </Typography>
                ))}
              </Box>
            )}
            {/* Order-creation errors (bad name, item unavailable, rate limit…) */}
            {error && (
              <Box
                role="alert"
                sx={{
                  mb: 2,
                  p: "12px 16px",
                  borderRadius: "10px",
                  background: T.redPale,
                  border: `1px solid ${T.redBorder}`,
                }}
              >
                <Typography
                  sx={{
                    fontFamily: SANS,
                    fontSize: "0.8125rem",
                    color: T.red,
                    lineHeight: 1.6,
                  }}
                >
                  {error}
                </Typography>
              </Box>
            )}

            <Box sx={{ position: "relative", overflow: "hidden" }}>
              <AnimatePresence mode="wait" custom={dir}>
                <motion.div
                  key={step}
                  custom={dir}
                  variants={slide}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3, ease: EASE }}
                  style={{ width: "100%" }}
                >
                  <FormCard title={STEP_TITLES[step]}>
                    {step === 0 && (
                      <StepContact
                        register={register}
                        errors={errors}
                        onNext={goNext}
                        disabled={isProcessing}
                      />
                    )}
                    {step === 1 && (
                      <StepAddress
                        register={register}
                        errors={errors}
                        onNext={goNext}
                        onBack={goBack}
                        disabled={isProcessing}
                      />
                    )}
                    {step === 2 && (
                      <StepPayment
                        register={register}
                        watch={watch}
                        setValue={setValue}
                        totalCents={totalCents}
                        onBack={goBack}
                        onSubmit={onSubmit}
                        isProcessing={isProcessing}
                      />
                    )}
                  </FormCard>
                </motion.div>
              </AnimatePresence>
            </Box>
          </Grid>

          {/* Order summary */}
          <Grid size={{ xs: 12, md: 5 }}>
            <OrderSummary items={items} />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
