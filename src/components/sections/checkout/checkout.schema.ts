import { z } from "zod";

// Mirrors backend checkout.schema.ts exactly — field names and validation rules
// are kept in sync so the POST body never needs transformation.

export const billingAddressSchema = z.object({
  line1: z.string().min(1, "Address line 1 is required"),
  line2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  country: z.string().min(1, "Country is required"),
  zip: z.string().min(1, "ZIP / PIN code is required"),
  company: z.string().optional(),
});

export const checkoutSchema = z.object({
  guestName: z.string().min(2, "Full name is required").max(255),
  guestEmail: z.string().email("Enter a valid email address"),
  billingAddress: billingAddressSchema,
  // items is injected from cart at submit time — not a form field
  items: z
    .array(z.object({ templateId: z.string().uuid() }))
    .min(1, "Cart is empty"),
  paymentMethod: z.enum(["card", "upi"]),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;