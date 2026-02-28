import { z } from "zod";

export const newsletterSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  name: z.string().min(1, "Name is required").max(100).optional(),
});

export type NewsletterFormValues = z.infer<typeof newsletterSchema>;
