"use client";

import { Box, Typography } from "@mui/material";
import { LockOutlined as LockIcon } from "@mui/icons-material";
import { UseFormRegister, UseFormWatch, UseFormSetValue } from "react-hook-form";
import { CheckoutFormValues } from "@/components/sections/checkout/checkout.schema";
import { T, SANS, MONO, formatUSD } from "@/components/sections/checkout/checkout.types";
import { BtnBack, BtnPay } from "@/components/sections/checkout/buttons";

interface StepPaymentProps {
  register: UseFormRegister<CheckoutFormValues>;
  watch: UseFormWatch<CheckoutFormValues>;
  setValue: UseFormSetValue<CheckoutFormValues>;
  totalCents: number;
  onBack: () => void;
  onSubmit: () => void;
  isProcessing: boolean;
}

// Backend paymentMethod: "card" | "upi"
// UPI charges INR (converted at runtime), card charges USD
const METHODS = [
  {
    value: "card" as const,
    label: "Card",
    sub: "Visa, Mastercard, Amex — charged in USD",
    icon: "💳",
  },
  {
    value: "upi" as const,
    label: "UPI",
    sub: "Google Pay, PhonePe, Paytm — charged in INR",
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
              {/* Radio dot */}
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

              <Typography sx={{ fontSize: "1rem", flexShrink: 0 }}>{m.icon}</Typography>

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
                  sx={{ fontFamily: SANS, fontSize: "0.72rem", color: T.inkMuted }}
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
        <LockIcon sx={{ fontSize: "0.85rem", color: T.inkMuted, mt: "2px", flexShrink: 0 }} />
        <Typography sx={{ fontFamily: SANS, fontSize: "0.75rem", color: T.inkMuted, lineHeight: 1.6 }}>
          Payments powered by{" "}
          <Box component="span" sx={{ fontWeight: 600, color: T.inkMid }}>
            Razorpay
          </Box>
          . We never store card details. All transactions are 256-bit encrypted.
        </Typography>
      </Box>

      {/* Total line */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2.5,
          px: 0.5,
        }}
      >
        <Typography sx={{ fontFamily: SANS, fontSize: "0.875rem", color: T.inkMuted }}>
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

      {/* Buttons */}
      <Box sx={{ display: "flex", gap: 1.5 }}>
        <BtnBack onClick={onBack} disabled={isProcessing} />
        <Box sx={{ flex: 1 }}>
          <BtnPay
            onClick={onSubmit}
            loading={isProcessing}
            label={`Pay ${formatUSD(totalCents)}`}
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