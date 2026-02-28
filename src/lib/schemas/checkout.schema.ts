import { z } from "zod";

export const checkoutSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name too long"),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .regex(/^[+]?[0-9]{10,15}$/, "Please enter a valid phone number")
    .optional()
    .or(z.literal("")),
  company: z
    .string()
    .max(100, "Company name too long")
    .optional()
    .or(z.literal("")),
  couponCode: z.string().max(50).optional().or(z.literal("")),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
