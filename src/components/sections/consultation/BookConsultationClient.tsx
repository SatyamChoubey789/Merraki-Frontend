"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema } from "@/lib/schemas/contact.schema";
import { useContact } from "@/lib/hooks/useContact";
import React from "react";
import { z } from "zod";

const CALENDLY_URL = process.env.NEXT_PUBLIC_CALENDLY_URL;

export function BookConsultationClient() {
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
    <div
      style={{
        minHeight: "100vh",
        background: "#FAFAFA",
        fontFamily: "'DM Sans', system-ui, sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          borderBottom: "1px solid #E4E4E7",
          background: "#fff",
          padding: "48px 24px 40px",
          textAlign: "center",
        }}
      >
        <p
          style={{
            margin: "0 0 8px",
            fontSize: "0.75rem",
            letterSpacing: "0.12em",
            color: "#71717A",
            textTransform: "uppercase",
          }}
        >
          Free · 30 minutes · No obligation
        </p>
        <h1
          style={{
            margin: "0 0 12px",
            fontSize: "clamp(2rem, 5vw, 3rem)",
            fontWeight: 700,
            color: "#09090B",
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
          }}
        >
          Book a strategy session
        </h1>
        <p
          style={{
            margin: 0,
            fontSize: "1rem",
            color: "#71717A",
            lineHeight: 1.7,
            maxWidth: 420,
            marginInline: "auto",
          }}
        >
          Send us a message or pick a time directly on Calendly whichever is
          easier for you.
        </p>
      </div>

      {/* Two-column */}
      <div
        style={{
          maxWidth: 880,
          margin: "0 auto",
          padding: "48px 24px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "32px",
          alignItems: "start",
        }}
      >
        {/* Contact form */}
        <div
          style={{
            background: "#fff",
            border: "1px solid #E4E4E7",
            borderRadius: "16px",
            padding: "32px",
          }}
        >
          <h2
            style={{
              margin: "0 0 4px",
              fontSize: "1.125rem",
              fontWeight: 600,
              color: "#09090B",
              letterSpacing: "-0.015em",
            }}
          >
            Send a message
          </h2>
          <p
            style={{
              margin: "0 0 24px",
              fontSize: "0.875rem",
              color: "#71717A",
            }}
          >
            We reply within 24 hours.
          </p>

          {isSuccess ? (
            <div
              style={{
                textAlign: "center",
                padding: "40px 16px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 12,
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  background: "#F0FDF4",
                  border: "1px solid #BBF7D0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.25rem",
                }}
              >
                ✓
              </div>
              <p
                style={{
                  margin: 0,
                  fontWeight: 600,
                  color: "#09090B",
                  fontSize: "1rem",
                }}
              >
                Message received!
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: "0.875rem",
                  color: "#71717A",
                  lineHeight: 1.6,
                }}
              >
                We'll be in touch within 24 hours.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit(onSubmit)}
              style={{ display: "flex", flexDirection: "column", gap: 16 }}
            >
              {/* Name */}
              <label
                style={{ display: "flex", flexDirection: "column", gap: 6 }}
              >
                <span style={labelStyle}>
                  Name <span style={{ color: "#3B5BDB" }}>*</span>
                </span>
                <input
                  {...register("name")}
                  placeholder="Rahul Sharma"
                  disabled={isPending}
                  style={inputStyle(!!errors.name) as React.CSSProperties}
                />
                {errors.name && (
                  <span style={errStyle}>{errors.name.message}</span>
                )}
              </label>

              {/* Email */}
              <label
                style={{ display: "flex", flexDirection: "column", gap: 6 }}
              >
                <span style={labelStyle}>
                  Email <span style={{ color: "#3B5BDB" }}>*</span>
                </span>
                <input
                  {...register("email")}
                  type="email"
                  placeholder="rahul@startup.com"
                  disabled={isPending}
                  style={inputStyle(!!errors.email) as React.CSSProperties}
                />
                {errors.email && (
                  <span style={errStyle}>{errors.email.message}</span>
                )}
              </label>

              {/* Subject */}
              <label
                style={{ display: "flex", flexDirection: "column", gap: 6 }}
              >
                <span style={labelStyle}>
                  Subject <span style={{ color: "#3B5BDB" }}>*</span>
                </span>
                <input
                  {...register("subject")}
                  placeholder="e.g. Financial model for my SaaS"
                  disabled={isPending}
                  style={inputStyle(!!errors.subject) as React.CSSProperties}
                />
                {errors.subject && (
                  <span style={errStyle}>{errors.subject.message}</span>
                )}
              </label>

              {contactMutation.isError && (
                <p
                  style={{
                    margin: 0,
                    padding: "10px 14px",
                    borderRadius: 8,
                    background: "#FEF2F2",
                    border: "1px solid #FECACA",
                    fontSize: "0.8125rem",
                    color: "#DC2626",
                  }}
                >
                  Failed to send. Please try again.
                </p>
              )}

              <button
                type="submit"
                disabled={isPending}
                style={{
                  marginTop: 4,
                  padding: "12px 20px",
                  borderRadius: "10px",
                  border: "1.5px solid #C7D7FD",
                  background: isPending
                    ? "#F4F4F5"
                    : "linear-gradient(115deg,#E0E7FF,#EEF2FF)",
                  color: isPending ? "#71717A" : "#3B5BDB",
                  fontFamily: "inherit",
                  fontWeight: 600,
                  fontSize: "0.9375rem",
                  cursor: isPending ? "not-allowed" : "pointer",
                  letterSpacing: "-0.01em",
                  transition: "all 0.15s",
                }}
              >
                {isPending ? "Sending…" : "Send message"}
              </button>
            </form>
          )}
        </div>

        {/* Calendly card */}
        <div
          style={{
            background: "#fff",
            border: "1px solid #E4E4E7",
            borderRadius: "16px",
            padding: "32px",
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          <div>
            <h2
              style={{
                margin: "0 0 4px",
                fontSize: "1.125rem",
                fontWeight: 600,
                color: "#09090B",
                letterSpacing: "-0.015em",
              }}
            >
              Pick a time directly
            </h2>
            <p style={{ margin: 0, fontSize: "0.875rem", color: "#71717A" }}>
              Open Calendly and book a slot that works for you.
            </p>
          </div>

          {/* Info rows */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { icon: "🕐", text: "30 minutes" },
              { icon: "💬", text: "Video or phone call" },
              { icon: "✦", text: "Free, no commitment" },
            ].map(({ icon, text }) => (
              <div
                key={text}
                style={{ display: "flex", alignItems: "center", gap: 10 }}
              >
                <span style={{ fontSize: "0.875rem" }}>{icon}</span>
                <span style={{ fontSize: "0.875rem", color: "#3F3F46" }}>
                  {text}
                </span>
              </div>
            ))}
          </div>

          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              padding: "12px 20px",
              borderRadius: "10px",
              border: "1.5px solid #C7D7FD",
              background: "linear-gradient(115deg,#E0E7FF,#EEF2FF)",
              color: "#3B5BDB",
              fontFamily: "inherit",
              fontWeight: 600,
              fontSize: "0.9375rem",
              textDecoration: "none",
              letterSpacing: "-0.01em",
              transition: "all 0.15s",
            }}
          >
            Book on Calendly
          </a>
        </div>
      </div>
    </div>
  );
}

/* ─── Shared styles ─── */
const labelStyle = {
  fontSize: "0.75rem",
  fontWeight: 500,
  color: "#3F3F46",
  letterSpacing: "0.02em",
  textTransform: "uppercase",
};

const inputStyle = (hasError: boolean): React.CSSProperties => ({
  width: "100%",
  boxSizing: "border-box" as const,
  fontFamily: "inherit",
  fontSize: "0.9rem",
  color: "#09090B",
  background: "#FAFAFA",
  border: `1.5px solid ${hasError ? "#DC2626" : "#E4E4E7"}`,
  borderRadius: "9px",
  padding: "10px 13px",
  outline: "none",
  transition: "border-color 0.15s, box-shadow 0.15s",
});

const errStyle = {
  fontSize: "0.75rem",
  color: "#DC2626",
};
