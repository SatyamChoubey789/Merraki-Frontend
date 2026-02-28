import { z } from "zod";

export const founderTestContactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Please enter a valid email address"),
  company: z.string().max(100).optional().or(z.literal("")),
  role: z.string().max(100).optional().or(z.literal("")),
});

export type FounderTestContactValues = z.infer<typeof founderTestContactSchema>;
