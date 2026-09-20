"use client";

import { Box } from "@mui/material";
import Grid from "@mui/material/Grid";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { CheckoutFormValues } from "@/components/sections/checkout/checkout.schema";
import { Field } from "@/components/sections/checkout/field";
import { BtnNext, BtnBack } from "@/components/sections/checkout/buttons";

interface StepAddressProps {
  register: UseFormRegister<CheckoutFormValues>;
  errors: FieldErrors<CheckoutFormValues>;
  onNext: () => void;
  onBack: () => void;
  disabled?: boolean;
}

export function StepAddress({ register, errors, onNext, onBack, disabled }: StepAddressProps) {
  return (
    <Box>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <Field
            label="Address line 1"
            placeholder="123, MG Road"
            error={errors.billingAddress?.line1?.message}
            disabled={disabled}
            {...register("billingAddress.line1")}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Field
            label="Address line 2 (optional)"
            placeholder="Apt / Floor / Suite"
            disabled={disabled}
            {...register("billingAddress.line2")}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Field
            label="City"
            placeholder="Mumbai"
            error={errors.billingAddress?.city?.message}
            disabled={disabled}
            {...register("billingAddress.city")}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Field
            label="State"
            placeholder="Maharashtra"
            error={errors.billingAddress?.state?.message}
            disabled={disabled}
            {...register("billingAddress.state")}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Field
            label="PIN / ZIP code"
            placeholder="400001"
            error={errors.billingAddress?.zip?.message}
            disabled={disabled}
            {...register("billingAddress.zip")}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Field
            label="Country"
            placeholder="India"
            error={errors.billingAddress?.country?.message}
            disabled={disabled}
            {...register("billingAddress.country")}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Field
            label="Company (optional)"
            placeholder="Acme Pvt. Ltd."
            disabled={disabled}
            {...register("billingAddress.company")}
          />
        </Grid>
      </Grid>

      <Box sx={{ display: "flex", gap: 1.5, mt: 3 }}>
        <BtnBack onClick={onBack} />
        <Box sx={{ flex: 1 }}>
          <BtnNext onClick={onNext} label="Review order" />
        </Box>
      </Box>
    </Box>
  );
}