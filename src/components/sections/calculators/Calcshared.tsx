"use client";

import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import {
  ArrowForward as ArrowIcon,
  Download as DownloadIcon,
} from "@mui/icons-material";

/* ══ TOKENS ══════════════════════════════════════════════ */
export const T = {
  bg: "#FFFFFF",
  bgSection: "#F5F7FB",
  bgDeep: "#EDF3FF",
  ink: "#0A0A0F",
  inkMid: "#3A3A52",
  inkMuted: "#5A5A72",
  inkFaint: "#9898AE",
  border: "rgba(10,10,20,0.08)",
  borderMid: "rgba(10,10,20,0.14)",
  blue: "#3B7BF6",
  blueLight: "#7AABFF",
  bluePale: "#EDF3FF",
  blueGlow: "rgba(59,123,246,0.18)",
  blueDim: "rgba(59,123,246,0.06)",
  blueGrad: "linear-gradient(135deg, #3B7BF6 0%, #7AABFF 100%)",
  blueBdr: "rgba(59,123,246,0.22)",
  red: "#DC2626",
  redDim: "rgba(220,38,38,0.06)",
  green: "#16A34A",
  greenDim: "rgba(22,163,74,0.06)",
};

export const SANS = '"DM Sans","Mona Sans",system-ui,sans-serif';
export const MONO = '"DM Mono","JetBrains Mono",ui-monospace,monospace';
export const EASE = [0.16, 1, 0.3, 1] as const;

/* ══ CALC INPUT ══════════════════════════════════════════ */
interface CalcInputProps {
  label: string;
  // Accept number or "" so the field can be fully cleared
  value: number | "";
  onChange: (v: number | "") => void;
  prefix?: string;
  suffix?: string;
  min?: number;
  max?: number;
  step?: number;
  helperText?: string;
  disabled?: boolean;
  error?: string;
}

export function CalcInput({
  label,
  value,
  onChange,
  prefix,
  suffix,
  min = 0,
  max,
  step = 1,
  helperText,
  disabled,
  error,
}: CalcInputProps) {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography
        sx={{
          fontFamily: SANS,
          fontWeight: 500,
          fontSize: "0.78rem",
          color: T.inkMid,
          mb: 0.6,
          letterSpacing: "-0.005em",
        }}
      >
        {label}
      </Typography>
      <Box
        sx={{
          display: "flex",
          alignItems: "stretch",
          background: disabled ? T.bgSection : T.bg,
          border: `1.5px solid ${error ? T.red : T.border}`,
          borderRadius: "10px",
          overflow: "hidden",
          transition: "border-color 0.15s, box-shadow 0.15s",
          "&:focus-within": {
            borderColor: error ? T.red : T.blue,
            boxShadow: `0 0 0 3px ${error ? T.redDim : T.blueDim}`,
          },
        }}
      >
        {prefix && (
          <Box
            sx={{
              px: 1.5,
              background: T.bgSection,
              borderRight: `1px solid ${T.border}`,
              display: "flex",
              alignItems: "center",
              flexShrink: 0,
            }}
          >
            <Typography
              sx={{ fontFamily: MONO, fontSize: "0.75rem", color: T.inkMuted }}
            >
              {prefix}
            </Typography>
          </Box>
        )}
        <Box
          component="input"
          type="number"
          // Keep the raw value — "" renders as an empty field, number renders normally
          value={value}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const raw = e.target.value;
            // Empty string means the user cleared the field — pass it through
            if (raw === "") {
              onChange("");
              return;
            }
            const n = parseFloat(raw);
            // Only fire if it's actually a valid number
            if (!isNaN(n)) onChange(n);
          }}
          disabled={disabled}
          min={min}
          max={max}
          step={step}
          sx={{
            flex: 1,
            border: "none",
            outline: "none",
            background: "transparent",
            px: 1.5,
            py: 1.125,
            fontFamily: MONO,
            fontSize: "0.875rem",
            fontWeight: 600,
            color: T.ink,
            minWidth: 0,
            "&::-webkit-inner-spin-button, &::-webkit-outer-spin-button": {
              opacity: 0.25,
            },
            "&:disabled": { opacity: 0.4, cursor: "not-allowed" },
          }}
        />
        {suffix && (
          <Box
            sx={{
              px: 1.5,
              background: T.bgSection,
              borderLeft: `1px solid ${T.border}`,
              display: "flex",
              alignItems: "center",
              flexShrink: 0,
            }}
          >
            <Typography
              sx={{ fontFamily: MONO, fontSize: "0.75rem", color: T.inkMuted }}
            >
              {suffix}
            </Typography>
          </Box>
        )}
      </Box>
      {error && (
        <Typography
          sx={{ fontFamily: SANS, fontSize: "0.68rem", color: T.red, mt: 0.4 }}
        >
          {error}
        </Typography>
      )}
      {helperText && !error && (
        <Typography
          sx={{
            fontFamily: SANS,
            fontSize: "0.68rem",
            color: T.inkFaint,
            mt: 0.4,
            lineHeight: 1.4,
          }}
        >
          {helperText}
        </Typography>
      )}
    </Box>
  );
}

/* ══ METRIC CARD ═════════════════════════════════════════ */
interface MetricCardProps {
  label: string;
  value: string;
  sub?: string;
  accent?: string;
  highlight?: boolean;
  trend?: "up" | "down" | "neutral";
}

export function MetricCard({
  label,
  value,
  sub,
  accent = T.blue,
  highlight,
  trend,
}: MetricCardProps) {
  return (
    <Box
      sx={{
        background: highlight ? `${accent}08` : T.bg,
        borderRadius: "12px",
        border: `1.5px solid ${highlight ? accent + "28" : T.border}`,
        px: { xs: 2, md: 2.5 },
        py: { xs: 1.5, md: 2 },
        transition: "border-color 0.18s",
      }}
    >
      <Box
        sx={{
          width: 22,
          height: "2.5px",
          borderRadius: "2px",
          background: highlight ? accent : T.border,
          mb: 1.25,
        }}
      />
      <Typography
        sx={{
          fontFamily: SANS,
          fontSize: "0.68rem",
          fontWeight: 500,
          color: T.inkFaint,
          mb: 0.6,
          letterSpacing: "0.02em",
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          fontFamily: MONO,
          fontWeight: 700,
          fontSize: { xs: "1rem", md: "1.125rem" },
          color: highlight ? accent : T.ink,
          letterSpacing: "-0.025em",
          lineHeight: 1.1,
        }}
      >
        {value}
      </Typography>
      {sub && (
        <Typography
          sx={{
            fontFamily: SANS,
            fontSize: "0.65rem",
            color:
              trend === "up" ? T.green : trend === "down" ? T.red : T.inkFaint,
            mt: 0.4,
          }}
        >
          {sub}
        </Typography>
      )}
    </Box>
  );
}

/* ══ COMPUTING OVERLAY ═══════════════════════════════════ */
const STAGES = [
  "Validating inputs…",
  "Running projections…",
  "Applying discount rates…",
  "Compiling results…",
];

interface CalcComputingProps {
  visible: boolean;
  onDone: () => void;
  duration?: number;
}

export function CalcComputing({
  visible,
  onDone,
  duration = 2800,
}: CalcComputingProps) {
  const [stage, setStage] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!visible) {
      setStage(0);
      setProgress(0);
      return;
    }
    const si = setInterval(
      () => setStage((s) => Math.min(s + 1, STAGES.length - 1)),
      duration / STAGES.length,
    );
    const start = Date.now();
    const raf = () => {
      const pct = Math.min(((Date.now() - start) / duration) * 100, 100);
      setProgress(pct);
      if (Date.now() - start < duration) requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
    const t = setTimeout(() => {
      onDone();
      setStage(0);
      setProgress(0);
    }, duration);
    return () => {
      clearInterval(si);
      clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(245,247,251,0.94)",
            backdropFilter: "blur(6px)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 3,
              maxWidth: 320,
              px: 3,
            }}
          >
            <Box
              sx={{
                position: "relative",
                width: 64,
                height: 64,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "50%",
                    border: `2px solid rgba(59,123,246,${0.4 - i * 0.12})`,
                  }}
                  animate={{
                    scale: [1, 1.4 + i * 0.2, 1],
                    opacity: [0.8, 0, 0.8],
                  }}
                  transition={{
                    duration: 1.6,
                    delay: i * 0.35,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              ))}
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  background: T.blueGrad,
                  boxShadow: `0 0 16px ${T.blueGlow}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path
                      d="M5 1V3M5 7V9M1 5H3M7 5H9"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </motion.div>
              </Box>
            </Box>
            <Box sx={{ textAlign: "center", minHeight: 24 }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={stage}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.22 }}
                >
                  <Typography
                    sx={{
                      fontFamily: SANS,
                      fontWeight: 600,
                      fontSize: "0.875rem",
                      color: T.ink,
                    }}
                  >
                    {STAGES[stage]}
                  </Typography>
                </motion.div>
              </AnimatePresence>
            </Box>
            <Box
              sx={{
                width: "100%",
                height: "3px",
                background: T.border,
                borderRadius: "2px",
                overflow: "hidden",
              }}
            >
              <motion.div
                style={{
                  height: "100%",
                  borderRadius: "2px",
                  background: T.blueGrad,
                  width: `${progress}%`,
                  boxShadow: `0 0 8px ${T.blueGlow}`,
                }}
              />
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
              {STAGES.map((_, i) => (
                <Box
                  key={i}
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: i <= stage ? T.blue : T.border,
                    transition: "background 0.3s",
                  }}
                />
              ))}
            </Box>
          </Box>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ══ CALCULATE BUTTON ════════════════════════════════════ */
interface CalcButtonProps {
  onClick: () => void;
  loading?: boolean;
  hasResult?: boolean;
}

export function CalcButton({ onClick, loading, hasResult }: CalcButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      disabled={loading}
      whileHover={loading ? {} : { scale: 1.02 }}
      whileTap={loading ? {} : { scale: 0.98 }}
      style={{
        width: "100%",
        padding: "13px 20px",
        borderRadius: "11px",
        border: "none",
        background: loading ? "rgba(59,123,246,0.5)" : T.blueGrad,
        color: "#FFFFFF",
        fontFamily: SANS,
        fontWeight: 700,
        fontSize: "0.9rem",
        letterSpacing: "-0.01em",
        cursor: loading ? "not-allowed" : "pointer",
        boxShadow: loading ? "none" : `0 6px 20px ${T.blueGlow}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        marginTop: "12px",
        transition: "box-shadow 0.2s",
      }}
    >
      {loading ? (
        <>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
            style={{ width: 14, height: 14 }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle
                cx="7"
                cy="7"
                r="5.5"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="1.5"
              />
              <path
                d="M7 1.5A5.5 5.5 0 0 1 12.5 7"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </motion.div>
          Computing…
        </>
      ) : (
        <>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M2 7H12M8 3L12 7L8 11"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {hasResult ? "Recalculate" : "Calculate"}
        </>
      )}
    </motion.button>
  );
}

/* ══ DATA TABLE ══════════════════════════════════════════ */
interface DataTableProps {
  columns: string[];
  rows: (string | number)[][];
  title?: string;
}

export function DataTable({ columns, rows, title }: DataTableProps) {
  return (
    <Box sx={{ mt: 3 }}>
      {title && (
        <Typography
          sx={{
            fontFamily: SANS,
            fontWeight: 700,
            fontSize: "0.875rem",
            color: T.ink,
            letterSpacing: "-0.01em",
            mb: 1.5,
          }}
        >
          {title}
        </Typography>
      )}
      <Box
        sx={{
          border: `1px solid ${T.border}`,
          borderRadius: "12px",
          overflow: "hidden",
          background: T.bg,
        }}
      >
        <Box sx={{ overflowX: "auto" }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ background: T.bgSection }}>
                {columns.map((col) => (
                  <TableCell
                    key={col}
                    sx={{
                      fontFamily: SANS,
                      fontWeight: 700,
                      fontSize: "0.72rem",
                      color: T.inkMid,
                      letterSpacing: "-0.005em",
                      borderBottom: `1px solid ${T.border}`,
                      py: 1.5,
                      px: 2,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {col}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, ri) => (
                <TableRow
                  key={ri}
                  sx={{
                    "&:last-child td": { borderBottom: "none" },
                    "&:hover": { background: T.blueDim },
                    transition: "background 0.15s",
                  }}
                >
                  {row.map((cell, ci) => (
                    <TableCell
                      key={ci}
                      sx={{
                        fontFamily: ci === 0 ? SANS : MONO,
                        fontWeight: ci === 0 ? 500 : 600,
                        fontSize: "0.8rem",
                        color: ci === 0 ? T.inkMid : T.ink,
                        borderBottom: `1px solid ${T.border}`,
                        py: 1.25,
                        px: 2,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {cell}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Box>
    </Box>
  );
}

/* ══ EXPORT PDF BUTTON ═══════════════════════════════════ */
interface ExportBtnProps {
  onClick: () => void;
  loading?: boolean;
}

export function ExportBtn({ onClick, loading }: ExportBtnProps) {
  return (
    <motion.button
      onClick={onClick}
      disabled={loading}
      whileHover={loading ? {} : { scale: 1.02 }}
      whileTap={loading ? {} : { scale: 0.97 }}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: "10px 20px",
        borderRadius: "10px",
        border: `1.5px solid ${T.blueBdr}`,
        background: T.blueDim,
        cursor: loading ? "wait" : "pointer",
        fontFamily: SANS,
        fontWeight: 600,
        fontSize: "0.825rem",
        color: T.blue,
        letterSpacing: "-0.01em",
        transition: "all 0.18s",
      }}
    >
      <DownloadIcon sx={{ fontSize: "0.9rem" }} />
      {loading ? "Exporting…" : "Export PDF"}
    </motion.button>
  );
}

/* ══ NEXT CALC BUTTON ════════════════════════════════════ */
interface NextCalcBtnProps {
  label: string;
  href: string;
}

export function NextCalcBtn({ label, href }: NextCalcBtnProps) {
  return (
    <a href={href} style={{ textDecoration: "none" }}>
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            px: "20px",
            py: "10px",
            borderRadius: "10px",
            background: T.bg,
            border: `1.5px solid ${T.border}`,
            transition: "all 0.18s",
            "&:hover": { borderColor: T.blueBdr, background: T.blueDim },
          }}
        >
          <Box>
            <Typography
              sx={{
                fontFamily: SANS,
                fontSize: "0.6rem",
                fontWeight: 500,
                color: T.inkFaint,
                lineHeight: 1,
                mb: 0.25,
              }}
            >
              Next calculator
            </Typography>
            <Typography
              sx={{
                fontFamily: SANS,
                fontWeight: 700,
                fontSize: "0.8rem",
                color: T.inkMid,
                lineHeight: 1,
                letterSpacing: "-0.01em",
              }}
            >
              {label}
            </Typography>
          </Box>
          <ArrowIcon sx={{ fontSize: "0.9rem", color: T.inkFaint, ml: 0.5 }} />
        </Box>
      </motion.div>
    </a>
  );
}

/* ══ CHART TOOLTIP ═══════════════════════════════════════ */
export function ChartTip({ active, payload, label, formatVal }: any) {
  if (!active || !payload?.length) return null;
  const fmt = formatVal ?? ((v: any) => v);
  return (
    <Box
      sx={{
        background: T.bg,
        border: `1px solid ${T.border}`,
        borderRadius: "10px",
        p: "12px 14px",
        minWidth: 150,
        boxShadow: `0 4px 20px ${T.blueGlow}`,
      }}
    >
      {label !== undefined && (
        <Typography
          sx={{
            fontFamily: SANS,
            fontSize: "0.65rem",
            color: T.inkFaint,
            mb: 0.75,
            fontWeight: 500,
          }}
        >
          {label}
        </Typography>
      )}
      {payload.map((p: any) => (
        <Box
          key={p.dataKey}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            gap: 2,
            mb: 0.3,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
            <Box
              sx={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: p.color || T.blue,
                flexShrink: 0,
              }}
            />
            <Typography
              sx={{ fontFamily: SANS, fontSize: "0.72rem", color: T.inkMuted }}
            >
              {p.name}
            </Typography>
          </Box>
          <Typography
            sx={{
              fontFamily: MONO,
              fontSize: "0.72rem",
              fontWeight: 700,
              color: T.ink,
            }}
          >
            {fmt(p.value)}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}

/* ══ EMPTY CHART STATE ═══════════════════════════════════ */
export function EmptyChart({
  height = 200,
  message = "Enter values and calculate",
}: {
  height?: number;
  message?: string;
}) {
  return (
    <Box
      sx={{
        height,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: T.bgSection,
        borderRadius: "12px",
        border: `1.5px dashed ${T.border}`,
        gap: 1.5,
      }}
    >
      <Box
        sx={{
          width: 36,
          height: 36,
          borderRadius: "10px",
          background: T.blueDim,
          border: `1px solid ${T.blueBdr}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M2 12L6 8L9 11L12 7L14 9"
            stroke={T.blue}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Box>
      <Typography
        sx={{ fontFamily: SANS, fontSize: "0.78rem", color: T.inkFaint }}
      >
        {message}
      </Typography>
    </Box>
  );
}

/* ══ CHART LABEL ═════════════════════════════════════════ */
export function CLabel({ text }: { text: string }) {
  return (
    <Typography
      sx={{
        fontFamily: SANS,
        fontWeight: 700,
        fontSize: "0.78rem",
        color: T.inkMid,
        mb: 1.5,
        letterSpacing: "-0.01em",
      }}
    >
      {text}
    </Typography>
  );
}

export const AX = { fill: T.inkFaint, fontSize: 9, fontFamily: MONO };
