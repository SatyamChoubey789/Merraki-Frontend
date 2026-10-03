"use client";

import { Box, Typography } from "@mui/material";
import { LockOutlined as LockIcon } from "@mui/icons-material";
import {
  UseFormRegister,
  UseFormWatch,
  UseFormSetValue,
} from "react-hook-form";
import { CheckoutFormValues } from "@/components/sections/checkout/checkout.schema";
import {
  T,
  SANS,
  MONO,
  formatUSD,
} from "@/components/sections/checkout/checkout.types";
import { BtnBack, BtnPay } from "@/components/sections/checkout/buttons";
import { useExchangeRate } from "@/lib/hooks/Useexchangerate";

interface StepPaymentProps {
  register: UseFormRegister<CheckoutFormValues>;
  watch: UseFormWatch<CheckoutFormValues>;
  setValue: UseFormSetValue<CheckoutFormValues>;
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

// Backend paymentMethod: "card" | "upi". UPI is always charged in INR. Cards
// default to USD, but the backend can switch them to INR (CARD_CURRENCY env),
// so the card label doesn't state a currency — the payment window shows it.
const METHODS = [
  {
    value: "card" as const,
    label: "Card",
    sub: "Visa, Mastercard, Amex",
    icon: "💳",
  },
  {
    value: "upi" as const,
    label: "UPI",
    sub: "Google Pay, PhonePe, Paytm — paid in INR",
    icon: "⚡",
  },
] as const;

export function StepPayment({
  watch,
  setValue,
  totalCents,
  onBack,
  onSubmit,
  isProcessing,
}: StepPaymentProps) {
  const method = watch("paymentMethod");
  const isUpi = method === "upi";

  // The backend charges Math.round(totalCents × rate) paise using the same
  // cached rate this endpoint returns, so this estimate is within a paisa or
  // two of the real charge. "≈" because the rate can refresh in between.
  const { rate, error: rateError } = useExchangeRate(isUpi);
  const inr = rate ? formatINR((totalCents * rate) / 100) : null;

  return (
    <Box>
      {/* Payment method picker */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25, mb: 3 }}>
        {METHODS.map((m) => {
          const selected = method === m.value;
          return (
            <Box
              key={m.value}
              onClick={() => setValue("paymentMethod", m.value)}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                px: 2.5,
                py: 2,
                borderRadius: "12px",
                border: `1.5px solid ${selected ? T.primary : T.border}`,
                background: selected ? T.primaryLight : T.surface,
                cursor: "pointer",
                transition: "all 0.18s",
                userSelect: "none",
              }}
            >
              <Box
                sx={{
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  border: `2px solid ${selected ? T.primary : T.border}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  transition: "border-color 0.18s",
                }}
              >
                {selected && (
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: T.primary,
                    }}
                  />
                )}
              </Box>

              <Typography sx={{ fontSize: "1rem", flexShrink: 0 }}>
                {m.icon}
              </Typography>

              <Box>
                <Typography
                  sx={{
                    fontFamily: SANS,
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    color: T.ink,
                  }}
                >
                  {m.label}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: SANS,
                    fontSize: "0.72rem",
                    color: T.inkMuted,
                  }}
                >
                  {m.sub}
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Box>

      {/* Security note */}
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          gap: 1.25,
          px: 2,
          py: 1.75,
          borderRadius: "10px",
          background: T.bg,
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
          Payments powered by{" "}
          <Box component="span" sx={{ fontWeight: 600, color: T.inkMid }}>
            Razorpay
          </Box>
          . We never store card details. All transactions are 256-bit encrypted.
        </Typography>
      </Box>

      {/* Total */}
      <Box sx={{ mb: 2.5, px: 0.5 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{ fontFamily: SANS, fontSize: "0.875rem", color: T.inkMuted }}
          >
            Amount due
          </Typography>
          <Typography
            sx={{
              fontFamily: MONO,
              fontWeight: 800,
              fontSize: "1.25rem",
              color: T.ink,
              letterSpacing: "-0.02em",
            }}
          >
            {formatUSD(totalCents)}
          </Typography>
        </Box>

        {isUpi && inr && (
          <Typography
            sx={{
              mt: 0.75,
              textAlign: "right",
              fontFamily: SANS,
              fontSize: "0.75rem",
              color: T.inkMuted,
              lineHeight: 1.5,
            }}
          >
            ≈ {inr} — UPI is charged in INR at today's rate. The final amount is
            shown in the payment window.
          </Typography>
        )}

        {isUpi && rateError && !inr && (
          <Typography
            sx={{
              mt: 0.75,
              textAlign: "right",
              fontFamily: SANS,
              fontSize: "0.75rem",
              color: T.red,
              lineHeight: 1.5,
            }}
          >
            We couldn't load today's INR rate, so UPI may be unavailable right
            now. You can pay by card instead.
          </Typography>
        )}
      </Box>

      {/* Buttons */}
      <Box sx={{ display: "flex", gap: 1.5 }}>
        <BtnBack onClick={onBack} disabled={isProcessing} />
        <Box sx={{ flex: 1 }}>
          <BtnPay
            onClick={onSubmit}
            loading={isProcessing}
            label={
              isUpi && inr ? `Pay ≈ ${inr}` : `Pay ${formatUSD(totalCents)}`
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
