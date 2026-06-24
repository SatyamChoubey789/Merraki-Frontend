import { z } from "zod";

// Aligns to domain.BillingAddress:
//   Name, Email, Phone, AddressLine1/2, City, State, Country (2-letter), PostalCode

export const checkoutSchema = z.object({
  // Contact step
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Please enter a valid email"),
  phone: z
    .string()
    .regex(/^[+]?[0-9]{7,15}$/, "Enter a valid phone number")
    .optional()
    .or(z.literal("")),
  // Address step
  address_line1: z.string().min(3, "Address required").max(200),
  address_line2: z.string().max(200).optional().or(z.literal("")),
  city: z.string().min(2, "City required").max(100),
  state: z.string().min(2, "State required").max(100),
  postal_code: z.string().min(3, "PIN code required").max(20),
  country: z.string().length(2, "Use 2-letter country code (e.g. IN)"),

  // Same billing/shipping flag (frontend only)
  same_as_billing: z.boolean().optional().default(true),

  // Shipping — optional, only used if same_as_billing = false
  shipping_address_line1: z.string().max(200).optional().or(z.literal("")),
  shipping_city: z.string().max(100).optional().or(z.literal("")),
  shipping_state: z.string().max(100).optional().or(z.literal("")),
  shipping_postal_code: z.string().max(20).optional().or(z.literal("")),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
