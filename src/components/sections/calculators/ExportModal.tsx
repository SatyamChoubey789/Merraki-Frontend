"use client";

import { useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";

interface ExportModalProps {
  open: boolean;
  onClose: () => void;
  calculatorName: string;
  result: any;
}

const CALC_CONFIG: Record<string, string> = {
  "Break-Even Calculator": "breakeven",
  "Runway Calculator": "runway",
  "Profit Margin Calculator": "margins",
  "Valuation Calculator": "valuation",
};

const SANS = "'Inter', 'DM Sans', sans-serif";

export default function ExportModal({
  open,
  onClose,
  calculatorName,
  result,
}: ExportModalProps) {
  const [companyName, setCompanyName] = useState("");
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = useCallback(async () => {
    const trimmed = companyName.trim();

    if (!trimmed) {
      setError("Please enter your company name.");
      return;
    }
    if (!result) {
      setError("No result found. Please calculate first.");
      return;
    }

    const slug = CALC_CONFIG[calculatorName];
    if (!slug) {
      setError("Unknown calculator. Please try again.");
      return;
    }

    setError("");
    setGenerating(true);

    try {
      const res = await fetch("/api/export-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          calculatorSlug: slug,
          result,
          companyName: trimmed,
        }),
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Server error");
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${slug}-${trimmed.toLowerCase().replace(/\s+/g, "-")}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      onClose();
      setCompanyName("");
    } catch (err: any) {
      console.error(err);
      setError(
        err.message === "Server error"
          ? "PDF generation failed. Please try again."
          : "Something went wrong. Please try again.",
      );
    } finally {
      setGenerating(false);
    }
  }, [companyName, calculatorName, result, onClose]);

  const handleClose = () => {
    if (generating) return;
    setCompanyName("");
    setError("");
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "16px",
          boxShadow: "0 24px 48px rgba(0,0,0,0.12)",
          border: "1px solid #E5E7EB",
          overflow: "hidden",
        },
      }}
    >
      {/* ── Header ── */}
      <DialogTitle
        sx={{
          px: 3,
          pt: 3,
          pb: 1.5,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 1,
        }}
      >
        <Box>
          <Typography
            sx={{
              fontFamily: SANS,
              fontWeight: 700,
              fontSize: "1.05rem",
              color: "#111827",
              lineHeight: 1.3,
            }}
          >
            Export Report
          </Typography>
          <Typography
            sx={{
              fontFamily: SANS,
              fontSize: "0.8rem",
              color: "#6B7280",
              mt: 0.4,
            }}
          >
            {calculatorName}
          </Typography>
        </Box>
        <IconButton
          onClick={handleClose}
          disabled={generating}
          size="small"
          sx={{ mt: -0.5, color: "#9CA3AF" }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      {/* ── Body ── */}
      <DialogContent sx={{ px: 3, pt: 1, pb: 3 }}>
        {/* PDF preview strip */}
        <Box
          sx={{
            background: "linear-gradient(135deg, #F0F4FF 0%, #EEF2FF 100%)",
            border: "1px solid #C7D2FE",
            borderRadius: "10px",
            p: 2,
            mb: 2.5,
            display: "flex",
            gap: 1.5,
            alignItems: "center",
          }}
        >
          {/* Mini PDF icon */}
          <Box
            sx={{
              width: 36,
              height: 44,
              background: "#fff",
              border: "1px solid #C7D2FE",
              borderRadius: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              boxShadow: "0 2px 6px rgba(99,102,241,0.12)",
              position: "relative",
              "&::after": {
                content: '""',
                position: "absolute",
                top: 3,
                right: 3,
                width: 10,
                height: 10,
                background: "#E0E7FF",
                borderBottomLeftRadius: "3px",
              },
            }}
          >
            <Typography
              sx={{ fontSize: "0.6rem", fontWeight: 700, color: "#4F46E5" }}
            >
              PDF
            </Typography>
          </Box>
          <Box>
            <Typography
              sx={{
                fontFamily: SANS,
                fontSize: "0.78rem",
                fontWeight: 600,
                color: "#3730A3",
              }}
            >
              Full-fidelity A4 Report
            </Typography>
            <Typography
              sx={{ fontFamily: SANS, fontSize: "0.72rem", color: "#6366F1" }}
            >
              Charts · Tables · Header · Footer · Auto-paginated
            </Typography>
          </Box>
        </Box>

        {/* Company name input */}
        <Typography
          sx={{
            fontFamily: SANS,
            fontSize: "0.8rem",
            fontWeight: 600,
            color: "#374151",
            mb: 0.75,
          }}
        >
          Company Name
        </Typography>
        <TextField
          fullWidth
          placeholder="e.g. Acme Technologies Pvt Ltd"
          value={companyName}
          onChange={(e) => {
            setCompanyName(e.target.value);
            if (error) setError("");
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleGenerate();
          }}
          disabled={generating}
          error={!!error}
          helperText={error}
          size="small"
          sx={{
            mb: error ? 0.5 : 2.5,
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
              fontFamily: SANS,
              fontSize: "0.875rem",
              "& fieldset": { borderColor: "#E5E7EB" },
              "&:hover fieldset": { borderColor: "#9CA3AF" },
              "&.Mui-focused fieldset": { borderColor: "#1A56DB" },
            },
          }}
        />

        {/* Generate button */}
        <Button
          fullWidth
          variant="contained"
          onClick={handleGenerate}
          disabled={generating || !companyName.trim()}
          startIcon={
            generating ? (
              <CircularProgress size={15} sx={{ color: "#fff" }} />
            ) : (
              <DownloadIcon fontSize="small" />
            )
          }
          sx={{
            mt: error ? 2 : 0,
            borderRadius: "8px",
            textTransform: "none",
            fontFamily: SANS,
            fontWeight: 600,
            fontSize: "0.875rem",
            py: 1.15,
            background: generating
              ? "#6B7280"
              : "linear-gradient(135deg, #1A56DB 0%, #1E40AF 100%)",
            boxShadow: "0 2px 8px rgba(26,86,219,0.3)",
            "&:hover": {
              background: "linear-gradient(135deg, #1E40AF 0%, #1E3A8A 100%)",
              boxShadow: "0 4px 12px rgba(26,86,219,0.4)",
            },
            "&.Mui-disabled": {
              background: "#E5E7EB",
              color: "#9CA3AF",
              boxShadow: "none",
            },
          }}
        >
          {generating ? "Generating PDF…" : "Generate & Download"}
        </Button>

        {/* Note */}
        <Typography
          sx={{
            fontFamily: SANS,
            fontSize: "0.7rem",
            color: "#9CA3AF",
            textAlign: "center",
            mt: 1.5,
          }}
        >
          Includes charts, tables, company name, date &amp; merraki watermark
        </Typography>
      </DialogContent>
    </Dialog>
  );
}
