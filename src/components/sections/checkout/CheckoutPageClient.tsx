"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, Container, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";

// Store
import { useCartItems, useCartTotalItems } from "@/lib/stores/useCartStore";

// Schema + types
import { checkoutSchema, type CheckoutFormValues } from "@/components/sections/checkout/checkout.schema";
import { T, SANS, type CartItemForCheckout } from "@/components/sections/checkout/checkout.types";

// Hook
import { useCheckout } from "@/lib/hooks/Usecheckout";

// Components
import { StepBar } from "@/components/sections/checkout/StepBar";
import { FormCard } from "@/components/sections/checkout/FormCard";
import { OrderSummary } from "@/components/sections/checkout/OrderSummary";
import { StepContact } from "@/components/sections/checkout/StepContact";
import { StepAddress } from "@/components/sections/checkout/StepAddress";
import { StepPayment } from "@/components/sections/checkout/StepPayment";

// ─── Slide animation ──────────────────────────────────────────────────────────

const EASE = [0.16, 1, 0.3, 1] as const;

const slide = {
  enter: (d: number) => ({ x: d > 0 ? "40%" : "-40%", opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (d: number) => ({ x: d > 0 ? "-40%" : "40%", opacity: 0 }),
};

// ─── Step field groups for validation ────────────────────────────────────────

const STEP_FIELDS: (keyof CheckoutFormValues)[][] = [
  ["guestName", "guestEmail"],
  ["billingAddress"],
  [],
];

const STEP_TITLES = ["Your details", "Billing address", "Review & pay"];

// ─── Component ────────────────────────────────────────────────────────────────

export function CheckoutPageClient() {
  const router = useRouter();
  const rawItems = useCartItems();
  const itemCount = useCartTotalItems();

  // Map cart store items → checkout-typed items
  // slug is the UUID the backend expects as templateId
  const items: CartItemForCheckout[] = rawItems.map((i) => ({
    id: i.id,
    templateId: i.slug,
    name: i.name,
    slug: i.slug,
    price_usd_cents: i.price_usd_cents,
    original_price_usd_cents: i.original_price_usd_cents,
    image: i.image,
    category: i.category,
  }));

  const totalCents = items.reduce((sum, i) => sum + i.price_usd_cents, 0);

  // ── Step state ─────────────────────────────────────────────────────────────
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [completed, setCompleted] = useState<Set<number>>(new Set());
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (mounted && itemCount === 0) router.replace("/templates");
  }, [mounted, itemCount, router]);

  // ── Checkout hook ──────────────────────────────────────────────────────────
  const { isProcessing, initiateCheckout } = useCheckout();

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
      items: [],
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

  // ── Submit — inject cart items at submit time ──────────────────────────────
  const onSubmit = handleSubmit((data) =>
    initiateCheckout({
      ...data,
      items: items.map((i) => ({ templateId: i.slug })),
    }),
  );

  // ── Guard ──────────────────────────────────────────────────────────────────
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
          <Grid size={{ xs: 12, md: 7 }}>
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

          <Grid size={{ xs: 12, md: 5 }}>
            <OrderSummary items={items} />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}