import { z } from "zod";

export const orderTrackingSchema = z.object({
  identifier: z
    .string()
    .min(1, "Please enter your email or order number")
    .refine(
      (val) => {
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
        const isOrderNumber = /^MRK-[A-Z0-9]{6,}$/.test(val);
        return isEmail || isOrderNumber;
      },
      {
        message:
          "Enter a valid email address or order number (e.g. MRK-XXXXXX)",
      },
    ),
});

export type OrderTrackingFormValues = z.infer<typeof orderTrackingSchema>;
