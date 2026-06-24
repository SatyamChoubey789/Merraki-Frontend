"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { contactSchema } from "@/lib/schemas/contact.schema";
import { useContact } from "@/lib/hooks/useContact";
import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { ArrowForward as ArrowIcon } from "@mui/icons-material";

/* ══ TOKENS ══════════════════ */
const T = {
  bg: "#FFFFFF",
  bgSection: "#F5F7FB",
  bgInput: "#F5F7FB",
  ink: "#253957",
  inkDark: "#253957",
  inkMid: "#253957",
  inkMuted: "#4a6282",
  inkFaint: "#7a96b2",
  border: "rgba(37,57,87,0.08)",
  borderMid: "rgba(37,57,87,0.14)",
  accent: "#253957",
  accentLight: "#4a6282",
  accentPale: "#eef1f6",
  accentGlow: "rgba(37,57,87,0.12)",
  accentDim: "rgba(37,57,87,0.05)",
  accentGrad: "linear-gradient(135deg, #253957 0%, #4a6282 100%)",
  secondary: "#3d5a80",
  secondaryGrad: "linear-gradient(135deg, #253957 0%, #3d5a80 100%)",
};

const SANS = `"DM Sans","Mona Sans",system-ui,sans-serif`;
const CALENDLY_URL = process.env.NEXT_PUBLIC_CALENDLY_URL;

/* ── Main Component ── */
export function BookConsultationClient() {
  const [choice, setChoice] = useState<"message" | "call" | null>(null);

  const contactMutation = useContact();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(contactSchema),
    mode: "onBlur",
  });

  const onSubmit = (data: z.infer<typeof contactSchema>) => {
    contactMutation.mutate(data, { onSuccess: () => reset() });
  };

  const isPending = contactMutation.isPending;
  const isSuccess = contactMutation.isSuccess;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${T.accentPale} 0%, ${T.bgSection} 50%, ${T.accentPale} 100%)`,
        fontFamily: SANS,
        position: "relative",
        overflow: "hidden",
        pb: 10,
      }}
    >
      {/* Ambient blobs */}
      <Box
        sx={{
          position: "absolute",
          width: "60vw",
          height: "60vw",
          top: "-20vw",
          left: "-10vw",
          borderRadius: "50%",
          background: `radial-gradient(ellipse, ${T.accentGlow} 0%, transparent 60%)`,
          pointerEvents: "none",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          width: "50vw",
          height: "50vw",
          bottom: "-15vw",
          right: "-10vw",
          borderRadius: "50%",
          background: `radial-gradient(ellipse, ${T.accentDim} 0%, transparent 60%)`,
          pointerEvents: "none",
        }}
      />

      {/* Header */}
      <Box sx={{ textAlign: "center", py: { xs: 8, md: 10 }, px: 3 }}>
        <Typography
          sx={{
            fontWeight: 800,
            fontSize: { xs: "2.5rem", md: "3rem" },
            color: T.ink,
            mb: 1,
          }}
        >
          Contact Us
        </Typography>
        <Typography
          sx={{
            fontWeight: 400,
            fontSize: "1rem",
            color: T.inkMuted,
            maxWidth: 440,
            mx: "auto",
            lineHeight: 1.75,
          }}
        >
          Send us a message or book a call directly on Calendly—whichever is
          easier for you.
        </Typography>
      </Box>

      {/* Choice Cards */}
      {!choice && (
        <Box
          sx={{
            display: "grid",
            gap: 3,
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            px: 3,
          }}
        >
          <ChoiceCard
            title="Send a Message"
            subtitle="Share your requirements and context"
            description="Get a thoughtful, structured response within 24 hours."
            accent={T.accent}
            icon="✉️"
            ctaText="Send a Message"
            onClick={() => setChoice("message")}
          />
          <ChoiceCard
            title="Book a Free Call"
            subtitle="Get on a quick call"
            description="Walk away with clarity, direction, and answers tailored to your business."
            accent={T.secondary}
            icon="📱"
            ctaText="Book a Call"
            onClick={() => setChoice("call")}
          />
        </Box>
      )}

      {/* Conditional Forms */}
      <Box sx={{ maxWidth: 900, mx: "auto", mt: 5, px: 3 }}>
        {choice === "message" && (
          <Box
            sx={{
              background: T.bg,
              border: `1px solid ${T.borderMid}`,
              borderRadius: 3,
              p: 4,
              boxShadow: `0 8px 32px ${T.accentGlow}`,
              maxWidth: 500,
              mx: "auto",
            }}
          >
            <Typography variant="h5" sx={{ mb: 3, color: T.ink }}>
              Send a Message
            </Typography>

            {isSuccess ? (
              <Box sx={{ textAlign: "center", py: 6 }}>
                <Box
                  sx={{
                    width: 52,
                    height: 52,
                    borderRadius: "50%",
                    background: T.accentPale,
                    border: `1px solid rgba(37,57,87,0.22)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.25rem",
                    mx: "auto",
                    mb: 1.5,
                  }}
                >
                  💬
                </Box>
                <Typography sx={{ fontWeight: 700, color: T.ink }}>
                  Message received!
                </Typography>
                <Typography
                  sx={{ fontSize: "0.875rem", color: T.inkMuted, mt: 0.5 }}
                >
                  We'll be in touch within 24 hours.
                </Typography>
              </Box>
            ) : (
              <form
                onSubmit={handleSubmit(onSubmit)}
                style={{ display: "flex", flexDirection: "column", gap: 16 }}
              >
                <Field
                  label="Name"
                  name="name"
                  register={register}
                  error={errors.name}
                  required
                />
                <Field
                  label="Email"
                  name="email"
                  type="email"
                  register={register}
                  error={errors.email}
                  required
                />
                <Field
                  label="Phone Number"
                  name="phone"
                  register={register}
                  error={errors.phone}
                />
                <Field
                  label="Subject"
                  name="subject"
                  register={register}
                  error={errors.subject}
                  required
                />
                <Field
                  label="Message"
                  name="message"
                  register={register}
                  error={errors.message}
                  required
                  multiline
                  rows={4}
                />

                {contactMutation.isError && (
                  <Typography
                    sx={{
                      p: 1.5,
                      borderRadius: 1.5,
                      background: "#FEF2F2",
                      border: "1px solid #FECACA",
                      fontSize: "0.8125rem",
                      color: "#DC2626",
                    }}
                  >
                    Failed to send. Please try again.
                  </Typography>
                )}

                <button
                  type="submit"
                  disabled={isPending}
                  style={{
                    marginTop: 4,
                    padding: "14px 20px",
                    borderRadius: 14,
                    border: "none",
                    background: isPending ? T.bgSection : T.accentGrad,
                    color: isPending ? T.inkFaint : "#FFF",
                    fontWeight: 600,
                    fontSize: "1rem",
                    cursor: isPending ? "not-allowed" : "pointer",
                    minHeight: 54,
                  }}
                >
                  {isPending ? "Sending…" : "Send message →"}
                </button>
              </form>
            )}

            <button
              onClick={() => setChoice(null)}
              style={{
                marginTop: 20,
                color: T.accent,
                cursor: "pointer",
                background: "none",
                border: "none",
              }}
            >
              ← Back
            </button>
          </Box>
        )}

        {choice === "call" && (
          <Box
            sx={{
              background: T.bg,
              border: `1px solid ${T.borderMid}`,
              borderRadius: 3,
              p: 4,
              boxShadow: `0 8px 32px ${T.accentGlow}`,
              maxWidth: 500,
              mx: "auto",
              textAlign: "center",
            }}
          >
            <Typography variant="h5" sx={{ mb: 2, color: T.ink }}>
              Book a Free Call
            </Typography>
            <Typography sx={{ mb: 3, color: T.inkMuted }}>
              Pick a time that works for you directly on Calendly. Once booked,
              you'll get a confirmation email with the link.
            </Typography>

            {/* Mini Calendly-like Details */}
            <Box
              sx={{
                p: 3,
                border: `1px solid ${T.borderMid}`,
                borderRadius: 2,
                background: T.bgSection,
                mb: 3,
                textAlign: "left",
              }}
            >
              <Typography sx={{ fontSize: "0.875rem", mb: 1, color: T.inkMuted }}>
                30-minute focused strategy call
              </Typography>
              <Typography sx={{ fontSize: "0.875rem", mb: 1, color: T.inkMuted }}>
                Free, no obligations
              </Typography>
              <Typography sx={{ fontSize: "0.875rem", mb: 1, color: T.inkMuted }}>
                Built around your business needs
              </Typography>
            </Box>

            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                padding: "14px 20px",
                borderRadius: 14,
                background: T.accentGrad,
                color: "#FFF",
                fontWeight: 600,
                textDecoration: "none",
                minWidth: 180,
              }}
            >
              Book a Call
            </a>

            <button
              onClick={() => setChoice(null)}
              style={{
                marginTop: 20,
                color: T.accent,
                cursor: "pointer",
                background: "none",
                border: "none",
              }}
            >
              ← Back
            </button>
          </Box>
        )}
      </Box>
    </Box>
  );
}

/* ── Choice Card ── */
interface ChoiceCardProps {
  title: string;
  subtitle: string;
  description: string;
  accent?: string;
  icon?: string;
  ctaText: string;
  onClick: () => void;
}

const ChoiceCard = ({
  title,
  subtitle,
  description,
  accent = T.accent,
  icon = "💬",
  ctaText,
  onClick,
}: ChoiceCardProps) => (
  <motion.div whileHover={{ y: -3 }}>
    <Box
      onClick={onClick}
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: T.bg,
        borderRadius: "20px",
        border: `1px solid ${T.border}`,
        p: 3,
        cursor: "pointer",
        boxShadow: `0 8px 32px ${T.accentGlow}`,
        transition: "all 0.2s",
        "&:hover": {
          borderColor: `${accent}30`,
          boxShadow: `0 12px 48px ${accent}18`,
        },
      }}
    >
      <Box
        sx={{
          width: 52,
          height: 52,
          borderRadius: "14px",
          background: `${accent}0e`,
          border: `1px solid ${accent}20`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 2,
        }}
      >
        <Typography sx={{ fontSize: "1.4rem", color: accent }}>
          {icon}
        </Typography>
      </Box>

      <Typography
        sx={{ fontWeight: 800, fontSize: "1.375rem", color: T.ink, mb: 0.25 }}
      >
        {title}
      </Typography>
      <Typography
        sx={{ fontWeight: 300, fontSize: "1.25rem", color: T.inkFaint, mb: 2 }}
      >
        {subtitle}
      </Typography>
      <Typography
        sx={{ fontSize: "0.875rem", color: T.inkMuted, flex: 1, mb: 3 }}
      >
        {description}
      </Typography>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pt: 2,
          borderTop: `1px solid ${T.border}`,
        }}
      >
        <Typography
          sx={{ fontWeight: 600, fontSize: "0.875rem", color: accent }}
        >
          {ctaText}
        </Typography>
        <Box
          sx={{
            display: "flex",
            opacity: 0.5,
            color: accent,
            transition: "all 0.2s",
            "&:hover": { transform: "translateX(3px)", opacity: 1 },
          }}
        >
          <ArrowIcon sx={{ fontSize: "1rem" }} />
        </Box>
      </Box>
    </Box>
  </motion.div>
);

/* ── Reusable Field ── */
interface FieldProps {
  label: string;
  name: string;
  register: any;
  error?: any;
  type?: string;
  required?: boolean;
  multiline?: boolean;
  rows?: number;
}

const Field = ({
  label,
  name,
  register,
  error,
  type = "text",
  required = false,
  multiline = false,
  rows = 1,
}: FieldProps) => (
  <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    <span
      style={{
        fontFamily: SANS,
        fontSize: "0.72rem",
        fontWeight: 600,
        color: T.inkMid,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
      }}
    >
      {label}
      {required && <span style={{ color: T.accent, marginLeft: 2 }}>*</span>}
    </span>
    {multiline ? (
      <textarea
        {...register(name)}
        rows={rows}
        placeholder={label}
        style={{
          width: "100%",
          fontFamily: SANS,
          fontSize: "0.9rem",
          color: T.ink,
          background: T.bgSection,
          border: `1.5px solid ${error ? "#DC2626" : T.borderMid}`,
          borderRadius: 10,
          padding: "11px 14px",
          resize: "vertical",
        }}
      />
    ) : (
      <input
        {...register(name)}
        type={type}
        placeholder={label}
        style={{
          width: "100%",
          fontFamily: SANS,
          fontSize: "0.9rem",
          color: T.ink,
          background: T.bgSection,
          border: `1.5px solid ${error ? "#DC2626" : T.borderMid}`,
          borderRadius: 10,
          padding: "11px 14px",
        }}
      />
    )}
    {error && (
      <span style={{ fontSize: "0.75rem", color: "#DC2626" }}>
        {error.message}
      </span>
    )}
  </label>
);