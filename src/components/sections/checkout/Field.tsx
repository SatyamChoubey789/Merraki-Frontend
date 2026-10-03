"use client";

import { useId, useState } from "react";
import { Box, Typography } from "@mui/material";

// ─── Brand tokens (inline so Field is self-contained) ─────────────────────────

const T = {
  bg: "#F5F7FB",
  surface: "#FFFFFF",
  ink: "#253957",
  inkMid: "rgba(37,57,87,0.75)",
  inkFaint: "rgba(37,57,87,0.35)",
  border: "rgba(37,57,87,0.10)",
  borderFocus: "rgba(37,57,87,0.40)",
  primaryLight: "rgba(37,57,87,0.06)",
  red: "#C0392B",
  redBorder: "rgba(192,57,43,0.22)",
} as const;

const SANS = `"DM Sans", system-ui, sans-serif`;

// ─── Types ────────────────────────────────────────────────────────────────────

interface FieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function Field({
  label,
  error,
  hint,
  id,
  onFocus,
  onBlur,
  ...inputProps
}: FieldProps) {
  const [focused, setFocused] = useState(false);
  const autoId = useId();
  const inputId = id ?? autoId;
  const messageId = `${inputId}-msg`;

  const borderColor = error ? T.redBorder : focused ? T.borderFocus : T.border;
  const shadow = focused && !error ? `0 0 0 3px ${T.primaryLight}` : "none";

  return (
    <Box>
      {/* Label — now tied to the input, so clicking it focuses the field */}
      <Typography
        component="label"
        htmlFor={inputId}
        sx={{
          display: "block",
          fontFamily: SANS,
          fontSize: "0.75rem",
          fontWeight: 600,
          color: error ? T.red : T.inkMid,
          mb: 0.75,
          transition: "color 0.15s",
        }}
      >
        {label}
      </Typography>

      <Box
        sx={{
          border: `1.5px solid ${borderColor}`,
          borderRadius: "10px",
          background: T.surface,
          transition: "border-color 0.18s, box-shadow 0.18s",
          boxShadow: shadow,
        }}
      >
        <input
          // Spread FIRST, then our handlers. react-hook-form's register() returns
          // its own onBlur; spreading it last replaced ours, so `focused` never
          // went back to false and the focus ring stayed on. We now call both.
          {...inputProps}
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={error || hint ? messageId : undefined}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          style={{
            display: "block",
            width: "100%",
            padding: "11px 14px",
            border: "none",
            outline: "none",
            background: "transparent",
            fontFamily: SANS,
            fontSize: "0.875rem",
            color: T.ink,
            borderRadius: "10px",
            boxSizing: "border-box",
          }}
        />
      </Box>

      {(error || hint) && (
        <Typography
          id={messageId}
          role={error ? "alert" : undefined}
          sx={{
            fontFamily: SANS,
            fontSize: "0.72rem",
            color: error ? T.red : T.inkFaint,
            mt: 0.5,
          }}
        >
          {error ?? hint}
        </Typography>
      )}
    </Box>
  );
}