"use client";

import { Box, Typography } from "@mui/material";
import { LockOutlined as LockIcon } from "@mui/icons-material";
import { UseFormWatch } from "react-hook-form";
import { CheckoutFormValues } from "@/components/sections/checkout/checkout.schema";
import {
  T,
  SANS,
  MONO,
  formatUSD,
} from "@/components/sections/checkout/checkout.types";
import { BtnBack, BtnPay } from "@/components/sections/checkout/buttons";
import { useExchangeRate } from "@/lib/hooks/Useexchangerate";
import { isIndia } from "@/lib/api/country";

interface StepPaymentProps {
  watch: UseFormWatch<CheckoutFormValues>;
  totalCents: number;
  onBack: () => void;
  onSubmit: () => void;
  isProcessing: boolean;
}

function formatINR(amount: number): string {
  return `₹${amount.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function Row({
  label,
  value,
  mono,
  strong,
}: {
  label: string;
  value: string;
  mono?: boolean;
  strong?: boolean;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        gap: 2,
      }}
    >
      <Typography
        sx={{
          fontFamily: SANS,
          fontSize: "0.8125rem",
          color: T.inkMuted,
          flexShrink: 0,
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          fontFamily: mono ? MONO : SANS,
          fontWeight: strong ? 800 : 600,
          fontSize: strong ? "1.25rem" : "0.8125rem",
          letterSpacing: strong ? "-0.02em" : 0,
          color: T.ink,
          textAlign: "right",
          minWidth: 0,
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}

export function StepPayment({
  watch,
  totalCents,
  onBack,
  onSubmit,
  isProcessing,
}: StepPaymentProps) {
  const email = watch("guestEmail");
  const country = watch("billingAddress.country");

  // Currency follows the billing country. Indian buyers are charged in INR, so
  // we show the rupee amount up front instead of springing it on them in the
  // payment window. The backend uses the same cached rate, so this is within a
  // paisa or two of the real charge ("≈" because the rate can refresh).
  const inINR = isIndia(country);
  const { rate, error: rateError } = useExchangeRate(inINR);
  const inr = rate ? formatINR((totalCents * rate) / 100) : null;

  return (
    <Box>
      {/* Recap */}
      <Box
        sx={{
          border: `1px solid ${T.border}`,
          borderRadius: "12px",
          background: T.bg,
          px: 2.5,
          py: 2,
          display: "flex",
          flexDirection: "column",
          gap: 1.25,
          mb: 2.5,
        }}
      >
        <Row label="Amount due" value={formatUSD(totalCents)} mono strong />
        {inINR && (
          <Row
            label="Charged in INR"
            value={inr ? `≈ ${inr}` : rateError ? "Shown at payment" : "…"}
            mono
          />
        )}
        {email && <Row label="Receipt sent to" value={email} />}
      </Box>

      {inINR && rateError && !inr && (
        <Typography
          sx={{
            fontFamily: SANS,
            fontSize: "0.75rem",
            color: T.red,
            lineHeight: 1.6,
            mb: 2,
          }}
        >
          We couldn't load today's INR rate. The final amount will be shown in
          the payment window.
        </Typography>
      )}

      {/* How payment works */}
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          gap: 1.25,
          px: 2,
          py: 1.75,
          borderRadius: "10px",
          background: T.surface,
          border: `1px solid ${T.border}`,
          mb: 3,
        }}
      >
        <LockIcon
          sx={{
            fontSize: "0.85rem",
            color: T.inkMuted,
            mt: "2px",
            flexShrink: 0,
          }}
        />
        <Typography
          sx={{
            fontFamily: SANS,
            fontSize: "0.75rem",
            color: T.inkMuted,
            lineHeight: 1.6,
          }}
        >
          You'll choose how to pay in the secure{" "}
          <Box component="span" sx={{ fontWeight: 600, color: T.inkMid }}>
            Razorpay
          </Box>{" "}
          window. We never store your card details, and every transaction is
          encrypted.
        </Typography>
      </Box>

      {/* Buttons */}
      <Box sx={{ display: "flex", gap: 1.5 }}>
        <BtnBack onClick={onBack} disabled={isProcessing} />
        <Box sx={{ flex: 1 }}>
          <BtnPay
            onClick={onSubmit}
            loading={isProcessing}
            label={
              inINR && inr ? `Pay ≈ ${inr}` : `Pay ${formatUSD(totalCents)}`
            }
          />
        </Box>
      </Box>

      <Typography
        sx={{
          fontFamily: SANS,
          fontSize: "0.68rem",
          color: T.inkFaint,
          textAlign: "center",
          mt: 1.5,
        }}
      >
        By paying you agree to our Terms of Service & Refund Policy
      </Typography>
    </Box>
  );
}
