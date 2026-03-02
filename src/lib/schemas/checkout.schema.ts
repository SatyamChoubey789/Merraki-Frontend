import { count } from "node:console";
import { z } from "zod";

export const checkoutSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name too long"),
  email: z.string().email("Please enter a valid email address"),
  country: z
    .string()
    .max(100, "Country name too long")
    .optional()
    .or(z.literal("")),
    shippingCountry: z
    .string()
    .max(100, "Country name too long")
    .optional()
    .or(z.literal("")),
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
  shippingAddress: z.object({
    line1: z
      .string()
      .max(200, "Address Line 1 too long")
      .optional()
      .or(z.literal("")),
    line2: z
      .string()
      .max(200, "Address Line 2 too long")
      .optional()
      .or(z.literal("")),
    city: z
      .string()
      .max(100, "City name too long")
      .optional()
      .or(z.literal("")),
    state: z
      .string()
      .max(100, "State name too long")
      .optional()
      .or(z.literal("")),
    pinCode: z
      .string()
      .max(20, "PIN Code too long")
      .optional()
      .or(z.literal("")),
    country: z
      .string()
      .max(100, "Country name too long")
      .optional()
      .or(z.literal("")),
  }),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
