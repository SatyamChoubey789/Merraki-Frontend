"use client";

import { Box, Typography } from "@mui/material";
import { Check as CheckIcon } from "@mui/icons-material";
import { T, SANS } from "@/components/sections/checkout/checkout.types";

const STEPS = ["Your details", "Billing address", "Review & pay"] as const;

interface StepBarProps {
  current: number; // 0-indexed
  completed: Set<number>;
}

export function StepBar({ current, completed }: StepBarProps) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        mb: 5,
        gap: 0,
      }}
    >
      {STEPS.map((label, i) => {
        const done = completed.has(i);
        const active = i === current;

        return (
          <Box key={label} sx={{ display: "flex", alignItems: "center" }}>
            {/* Step circle + label */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                sx={{
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  background: done
                    ? T.green
                    : active
                    ? T.primary
                    : T.surface,
                  border: `1.5px solid ${
                    done
                      ? T.greenBorder
                      : active
                      ? T.primary
                      : T.border
                  }`,
                  transition: "all 0.25s",
                }}
              >
                {done ? (
                  <CheckIcon sx={{ fontSize: "0.75rem", color: "#fff" }} />
                ) : (
                  <Typography
                    sx={{
                      fontFamily: SANS,
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      color: active ? "#fff" : T.inkFaint,
                      lineHeight: 1,
                    }}
                  >
                    {i + 1}
                  </Typography>
                )}
              </Box>

              <Typography
                sx={{
                  fontFamily: SANS,
                  fontSize: "0.78rem",
                  fontWeight: active ? 700 : 500,
                  color: done ? T.green : active ? T.ink : T.inkFaint,
                  display: { xs: "none", sm: "block" },
                  transition: "color 0.2s",
                  whiteSpace: "nowrap",
                }}
              >
                {label}
              </Typography>
            </Box>

            {/* Connector */}
            {i < STEPS.length - 1 && (
              <Box
                sx={{
                  width: { xs: 20, sm: 36, md: 52 },
                  height: "1px",
                  mx: { xs: 1, sm: 1.5 },
                  background: done ? T.primary : T.border,
                  transition: "background 0.3s",
                  flexShrink: 0,
                }}
              />
            )}
          </Box>
        );
      })}
    </Box>
  );
}