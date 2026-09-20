"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, Container, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";

// Store — real CartItem shape: id:string, slug, title, priceCents, previewImage, categoryId
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

// ─── Animation ────────────────────────────────────────────────────────────────

const EASE = [0.16, 1, 0.3, 1] as const;

const slide = {
  enter: (d: number) => ({ x: d > 0 ? "40%" : "-40%", opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:  (d: number) => ({ x: d > 0 ? "-40%" : "40%", opacity: 0 }),
};

// ─── Step config ──────────────────────────────────────────────────────────────

const STEP_FIELDS: (keyof CheckoutFormValues)[][] = [
  ["guestName", "guestEmail"],
  ["billingAddress"],
  [], // payment — no extra fields, validated on submit
];

const STEP_TITLES = ["Your details", "Billing address", "Review & pay"];

// ─── Component ────────────────────────────────────────────────────────────────

export function CheckoutPageClient() {
  const router   = useRouter();
  const rawItems = useCartItems();      // CartItem[] from store
  const itemCount = useCartTotalItems();

  // ── Map store CartItem → CartItemForCheckout ──────────────────────────────
  // CartItem (store):           CartItemForCheckout (checkout):
  //   id: string         →        id: string
  //   slug: string       →        slug + templateId (same value)
  //   title: string      →        title             (NOT "name")
  //   priceCents: number →        priceCents        (already cents, no conversion)
  //   previewImage: string|null → previewImage
  //   categoryId: string|null   → categoryId

  const items: CartItemForCheckout[] = rawItems.map((i) => ({
    id:           i.id,
    templateId:   i.slug,          // backend expects templateId = slug (UUID)
    title:        i.title,         // correct field name
    slug:         i.slug,
    priceCents:   i.priceCents,    // already integer cents, no conversion needed
    previewImage: i.previewImage,  // string | null
    categoryId:   i.categoryId,    // string | null
  }));

  // priceCents is already integer — sum directly
  const totalCents = items.reduce((sum, i) => sum + i.priceCents, 0);

  // ── Step state ─────────────────────────────────────────────────────────────
  const [step,      setStep]      = useState(0);
  const [dir,       setDir]       = useState(1);
  const [completed, setCompleted] = useState<Set<number>>(new Set());
  const [mounted,   setMounted]   = useState(false);

  useEffect(() => setMounted(true), []);

  // Redirect if cart empties (e.g. user navigated back and cleared cart)
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
      items: [], // injected at submit time from cart
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
  // Cart items are injected here — never stored in the form fields.
  // slug === templateId — what POST /checkout/create-order expects.
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

        {/* Step indicator */}
        <StepBar current={step} completed={completed} />

        <Grid container spacing={{ xs: 3, md: 5 }} alignItems="flex-start">
          {/* Form */}
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

          {/* Order summary */}
          <Grid size={{ xs: 12, md: 5 }}>
            <OrderSummary items={items} />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}