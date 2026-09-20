"use client";

import { Box, CircularProgress, Typography } from "@mui/material";
import {
  LockOutlined as LockIcon,
  ArrowForward as ArrowIcon,
} from "@mui/icons-material";
import { T, SANS } from "@/components/sections/checkout/checkout.types";

// ─── Next ─────────────────────────────────────────────────────────────────────

interface BtnNextProps {
  onClick: () => void;
  label: string;
  disabled?: boolean;
}

export function BtnNext({ onClick, label, disabled }: BtnNextProps) {
  return (
    <Box
      component="button"
      onClick={onClick}
      disabled={disabled}
      sx={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 1,
        px: 3,
        py: "13px",
        borderRadius: "12px",
        border: "none",
        background: T.primary,
        color: "#fff",
        fontFamily: SANS,
        fontWeight: 600,
        fontSize: "0.9rem",
        cursor: disabled ? "default" : "pointer",
        opacity: disabled ? 0.5 : 1,
        transition: "opacity 0.18s, filter 0.18s",
        "&:hover:not(:disabled)": { filter: "brightness(1.08)" },
        minHeight: 48,
      }}
    >
      {label}
      <ArrowIcon sx={{ fontSize: "0.9rem" }} />
    </Box>
  );
}

// ─── Back ─────────────────────────────────────────────────────────────────────

interface BtnBackProps {
  onClick: () => void;
  disabled?: boolean;
}

export function BtnBack({ onClick, disabled }: BtnBackProps) {
  return (
    <Box
      component="button"
      onClick={onClick}
      disabled={disabled}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2.5,
        py: "13px",
        borderRadius: "12px",
        border: `1.5px solid ${T.border}`,
        background: "transparent",
        color: T.inkMid,
        fontFamily: SANS,
        fontWeight: 500,
        fontSize: "0.875rem",
        cursor: disabled ? "default" : "pointer",
        opacity: disabled ? 0.4 : 1,
        transition: "border-color 0.18s",
        "&:hover:not(:disabled)": { borderColor: T.borderFocus },
        minHeight: 48,
        flexShrink: 0,
        whiteSpace: "nowrap",
      }}
    >
      ← Back
    </Box>
  );
}

// ─── Pay ──────────────────────────────────────────────────────────────────────

interface BtnPayProps {
  onClick: () => void;
  loading: boolean;
  label: string;
}

export function BtnPay({ onClick, loading, label }: BtnPayProps) {
  return (
    <Box
      component="button"
      onClick={onClick}
      disabled={loading}
      sx={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 1.25,
        px: 3,
        py: "13px",
        borderRadius: "12px",
        // ↓ single border declaration — no duplicate key
        border: loading ? `1px solid ${T.border}` : "none",
        background: loading ? T.bg : T.primary,
        color: loading ? T.inkFaint : "#fff",
        fontFamily: SANS,
        fontWeight: 600,
        fontSize: "0.9rem",
        cursor: loading ? "wait" : "pointer",
        transition: "all 0.2s",
        "&:hover:not(:disabled)": { filter: "brightness(1.08)" },
        minHeight: 48,
      }}
    >
      {loading ? (
        <>
          <CircularProgress size={14} sx={{ color: T.inkFaint }} />
          <Typography
            sx={{ fontFamily: SANS, fontSize: "0.9rem", color: T.inkFaint }}
          >
            Processing…
          </Typography>
        </>
      ) : (
        <>
          <LockIcon sx={{ fontSize: "0.85rem" }} />
          {label}
        </>
      )}
    </Box>
  );
}