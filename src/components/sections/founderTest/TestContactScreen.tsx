"use client";

import { Box, Typography } from "@mui/material";
import {
  ArrowBack as BackIcon,
  ArrowForward as ArrowIcon,
  LockOutlined as LockIcon,
  CheckCircle as CheckIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  founderTestContactSchema,
  type FounderTestContactValues,
} from "@/lib/schemas/founderTest.schema";

/* ── Tokens ── */
const T = {
  // Left panel — dark
  darkBg:      "#0D1B2E",
  darkGlow1:   "rgba(99,102,241,0.15)",
  darkGlow2:   "rgba(236,72,153,0.08)",
  darkBorder:  "rgba(255,255,255,0.08)",
  darkMuted:   "rgba(255,255,255,0.50)",
  darkFaint:   "rgba(255,255,255,0.22)",

  // Right panel — light
  lightBg:     "#FFFFFF",
  lightBorder: "rgba(10,10,20,0.08)",
  ink:         "#0A0A0F",
  inkMuted:    "#5A6478",
  inkFaint:    "#A0A0AE",
  inputBg:     "#F7F8FA",

  // Shared
  white:       "#FFFFFF",
  grad:        "linear-gradient(115deg, #818CF8, #A855F7, #EC4899)",
  blue:        "#1D4ED8",
  blueBdr:     "rgba(29,78,216,0.2)",
  blueGlow:    "rgba(29,78,216,0.12)",
  error:       "#DC2626",
};

const SANS = '"DM Sans", system-ui, sans-serif';
const MONO = '"DM Mono", ui-monospace, monospace';
const EASE = [0.16, 1, 0.3, 1] as const;

const INCLUSIONS = [
  "Your financial personality archetype",
  "Top 3 strengths mapped to your answers",
  "Key risk areas and blind spots",
  "Personalised growth playbook",
  "Recommended tools and templates",
];

/* ── Input field ── */
function Field({
  label,
  error,
  helperText,
  ...props
}: {
  label: string;
  error?: boolean;
  helperText?: string;
  [k: string]: any;
}) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
      <Typography sx={{
        fontFamily: SANS, fontWeight: 500,
        fontSize: "0.75rem", color: T.inkMuted,
        letterSpacing: "-0.005em",
      }}>
        {label}
      </Typography>
      <Box
        component="input"
        {...props}
        sx={{
          border: `1px solid ${error ? T.error : T.lightBorder}`,
          borderRadius: "8px",
          background: T.inputBg,
          fontFamily: SANS, fontSize: "0.9rem",
          color: T.ink, px: 1.75, py: "10px",
          outline: "none",
          transition: "border-color 0.15s, box-shadow 0.15s",
          "&:focus": {
            borderColor: error ? T.error : T.blue,
            boxShadow: error
              ? "0 0 0 3px rgba(220,38,38,0.08)"
              : `0 0 0 3px ${T.blueGlow}`,
            background: T.white,
          },
          "&::placeholder": { color: T.inkFaint },
          "&:disabled": { opacity: 0.5, cursor: "not-allowed" },
        }}
      />
      {helperText && (
        <Typography sx={{
          fontFamily: SANS, fontSize: "0.7rem",
          color: error ? T.error : T.inkFaint, lineHeight: 1.4,
        }}>
          {helperText}
        </Typography>
      )}
    </Box>
  );
}

interface Props {
  onSubmit:    (data: FounderTestContactValues) => Promise<void>;
  onBack:      () => void;
  isSubmitting: boolean;
}

export function TestContactScreen({ onSubmit, onBack, isSubmitting }: Props) {
  const { register, handleSubmit, formState: { errors } } =
    useForm<FounderTestContactValues>({ resolver: zodResolver(founderTestContactSchema) });

  return (
    <Box sx={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: { xs: "column", lg: "row" },
      fontFamily: SANS,
    }}>

      {/* ── LEFT: dark panel ── */}
      <Box sx={{
        flex: "0 0 42%",
        background: T.darkBg,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        p: { xs: "48px 28px", md: "72px 56px" },
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Glows */}
        <Box sx={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: `
            radial-gradient(ellipse 70% 55% at 10% 40%, ${T.darkGlow1}, transparent),
            radial-gradient(ellipse 50% 40% at 90% 70%, ${T.darkGlow2}, transparent)
          `,
        }} />
        {/* Grid */}
        <Box sx={{
          position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.03,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }} />

        <Box sx={{ position: "relative", zIndex: 1 }}>

          {/* Eyebrow */}
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: EASE }}>
            <Typography sx={{
              fontFamily: MONO, fontSize: "0.6rem",
              letterSpacing: "0.18em", color: "#A5B4FC",
              textTransform: "uppercase", mb: 2.5,
            }}>
              Almost There
            </Typography>
          </motion.div>

          {/* Headline */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08, duration: 0.5, ease: EASE }}>
            <Typography sx={{
              fontFamily: SANS, fontWeight: 800,
              fontSize: { xs: "2rem", md: "2.75rem" },
              color: T.white, letterSpacing: "-0.03em",
              lineHeight: 1.05, mb: 0.5,
            }}>
              Your personalised
            </Typography>
            <Typography sx={{
              fontFamily: SANS, fontWeight: 800,
              fontSize: { xs: "2rem", md: "2.75rem" },
              letterSpacing: "-0.03em", lineHeight: 1.05,
              mb: 3.5,
              background: T.grad,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              report awaits.
            </Typography>
          </motion.div>

          {/* Inclusions list */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {INCLUSIONS.map((item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.07, duration: 0.38, ease: EASE }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <CheckIcon sx={{ fontSize: "1rem", color: "#818CF8", flexShrink: 0 }} />
                  <Typography sx={{
                    fontFamily: SANS, fontSize: "0.875rem",
                    color: T.darkMuted, lineHeight: 1.5,
                  }}>
                    {item}
                  </Typography>
                </Box>
              </motion.div>
            ))}
          </Box>

          {/* Bottom note */}
          <Box sx={{
            mt: 4, pt: 3,
            borderTop: `1px solid ${T.darkBorder}`,
            display: "flex", alignItems: "center", gap: 1,
          }}>
            <LockIcon sx={{ fontSize: "0.8rem", color: T.darkFaint }} />
            <Typography sx={{ fontFamily: SANS, fontSize: "0.75rem", color: T.darkFaint, lineHeight: 1.5 }}>
              No spam, ever. Unsubscribe anytime.
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* ── RIGHT: light form panel ── */}
      <Box sx={{
        flex: 1,
        background: T.lightBg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: { xs: "48px 24px", md: "72px 64px" },
      }}>
        <Box sx={{ width: "100%", maxWidth: 440 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
          >

            {/* Form header */}
            <Box sx={{ mb: 3.5 }}>
              <Typography sx={{
                fontFamily: SANS, fontWeight: 700,
                fontSize: { xs: "1.375rem", md: "1.625rem" },
                color: T.ink, letterSpacing: "-0.02em",
                lineHeight: 1.15, mb: 0.75,
              }}>
                Where should we send it?
              </Typography>
              <Typography sx={{
                fontFamily: SANS, fontSize: "0.875rem",
                color: T.inkFaint, lineHeight: 1.65,
              }}>
                Your detailed PDF report will be emailed instantly.
              </Typography>
            </Box>

            {/* Form */}
            <Box
              component="form"
              onSubmit={handleSubmit(onSubmit)}
              sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            >
              <Field
                label="Full Name *"
                placeholder="Priya Sharma"
                error={!!errors.name}
                helperText={errors.name?.message}
                disabled={isSubmitting}
                {...register("name")}
              />
              <Field
                label="Email Address *"
                type="email"
                placeholder="priya@company.com"
                error={!!errors.email}
                helperText={errors.email?.message ?? "Your report will be delivered here"}
                disabled={isSubmitting}
                {...register("email")}
              />
              <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5 }}>
                <Field
                  label="Company (optional)"
                  placeholder="Merraki Co."
                  disabled={isSubmitting}
                  {...register("company")}
                />
                <Field
                  label="Role (optional)"
                  placeholder="Founder, CEO…"
                  disabled={isSubmitting}
                  {...register("role")}
                />
              </Box>

              {/* Buttons */}
              <Box sx={{ display: "flex", gap: 1.25, mt: 0.5 }}>
                {/* Back */}
                <motion.button
                  type="button"
                  onClick={onBack}
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    display: "flex", alignItems: "center", gap: 6,
                    padding: "11px 18px",
                    borderRadius: "8px",
                    border: `1px solid ${T.lightBorder}`,
                    background: "transparent",
                    cursor: isSubmitting ? "not-allowed" : "pointer",
                    outline: "none", flexShrink: 0,
                    transition: "border-color 0.15s",
                  }}
                >
                  <BackIcon sx={{ fontSize: "0.85rem", color: T.inkFaint }} />
                  <Typography sx={{ fontFamily: SANS, fontWeight: 500, fontSize: "0.875rem", color: T.inkMuted }}>
                    Back
                  </Typography>
                </motion.button>

                {/* Submit */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={isSubmitting ? {} : { scale: 1.02 }}
                  whileTap={isSubmitting ? {} : { scale: 0.98 }}
                  style={{
                    flex: 1,
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    padding: "13px 24px",
                    borderRadius: "8px", border: "none",
                    background: isSubmitting
                      ? T.inputBg
                      : "linear-gradient(115deg, #7C3AED, #EC4899)",
                    cursor: isSubmitting ? "not-allowed" : "pointer",
                    outline: "none",
                    boxShadow: isSubmitting ? "none" : "0 4px 20px rgba(124,58,237,0.28)",
                    transition: "all 0.18s",
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        style={{
                          width: 15, height: 15, borderRadius: "50%",
                          border: `2px solid ${T.lightBorder}`,
                          borderTopColor: T.blue,
                        }}
                      />
                      <Typography sx={{ fontFamily: SANS, fontWeight: 600, fontSize: "0.9rem", color: T.inkFaint }}>
                        Generating…
                      </Typography>
                    </>
                  ) : (
                    <>
                      <Typography sx={{ fontFamily: SANS, fontWeight: 700, fontSize: "0.9375rem", color: T.white }}>
                        Get My Report
                      </Typography>
                      <ArrowIcon sx={{ fontSize: "0.95rem", color: T.white }} />
                    </>
                  )}
                </motion.button>
              </Box>
            </Box>

          </motion.div>
        </Box>
      </Box>
    </Box>
  );
}