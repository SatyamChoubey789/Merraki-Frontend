import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .regex(/^[+]?[0-9]{10,15}$/, "Please enter a valid phone number")
    .optional()
    .or(z.literal("")),
  company: z.string().max(100).optional().or(z.literal("")),
  subject: z.string().min(5, "Subject must be at least 5 characters").max(200),
  message: z
    .string()
    .min(20, "Message must be at least 20 characters")
    .max(2000),
  serviceType: z
    .enum(["consultation", "templates", "modelling", "other"])
    .optional(),
});

export type ContactFormValues = z.infer<typeof contactSchema>;
