import { z } from "zod";

// Mirrors backend createOrderSchema (checkout.schema.ts) for everything the
// user types. Cart items are NOT part of this schema: they come from the cart
// at submit time. Keeping `items` in the form schema made validation fail on
// an empty array and silently block the Pay button.

// Same pattern the backend uses (looksLikeLink in payments.lib.ts). Names and
// company end up in emails, so the server rejects links — catching it here
// gives a field-level message instead of a failed order.
const LINK_RE =
  /(https?:\/\/|www\.|@|\b[\w-]+\.(com|net|org|io|co|in|xyz|top|ru|cn|info|biz|link|click)\b)/i;
const noLinks = (v: string | undefined) => !v || !LINK_RE.test(v);
const NO_LINKS = "Links and email addresses aren't allowed here";

export const billingAddressSchema = z.object({
  line1: z.string().trim().min(3, "Enter your street address").max(150),
  line2: z.string().trim().max(150).optional(),
  city: z.string().trim().min(2, "City is required").max(80),
  state: z.string().trim().min(2, "State is required").max(80),
  country: z.string().trim().min(2, "Country is required").max(60),
  zip: z.string().trim().min(3, "ZIP / PIN code is required").max(12),
  company: z.string().trim().max(120).refine(noLinks, NO_LINKS).optional(),
});

export const checkoutSchema = z.object({
  guestName: z
    .string()
    .trim()
    .min(2, "Full name is required")
    .max(100)
    .refine(noLinks, NO_LINKS),
  guestEmail: z
    .string()
    .trim()
    .toLowerCase()
    .email("Enter a valid email address")
    .max(254),
  billingAddress: billingAddressSchema,
  paymentMethod: z.enum(["card", "upi"]),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;