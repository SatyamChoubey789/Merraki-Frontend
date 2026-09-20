"use client";

import { Box } from "@mui/material";
import Grid from "@mui/material/Grid";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { CheckoutFormValues } from "@/components/sections/checkout/checkout.schema";
import { Field } from "@/components/sections/checkout/field";
import { BtnNext } from "@/components/sections/checkout/buttons";

interface StepContactProps {
  register: UseFormRegister<CheckoutFormValues>;
  errors: FieldErrors<CheckoutFormValues>;
  onNext: () => void;
  disabled?: boolean;
}

export function StepContact({ register, errors, onNext, disabled }: StepContactProps) {
  return (
    <Box>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Field
            label="Full name"
            placeholder="Arjun Mehta"
            error={errors.guestName?.message}
            disabled={disabled}
            {...register("guestName")}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Field
            label="Email address"
            type="email"
            placeholder="arjun@company.com"
            hint="Download link sent here"
            error={errors.guestEmail?.message}
            disabled={disabled}
            {...register("guestEmail")}
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 3 }}>
        <BtnNext onClick={onNext} label="Continue to address" />
      </Box>
    </Box>
  );
}