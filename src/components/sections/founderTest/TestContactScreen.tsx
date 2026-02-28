"use client";

import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  CircularProgress,
} from "@mui/material";
import {
  ArrowBack as BackIcon,
  Send as SendIcon,
  Lock as LockIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { colorTokens, shadowTokens } from "@/theme";
import {
  founderTestContactSchema,
  type FounderTestContactValues,
} from "@/lib/schemas/founderTest.schema";

interface TestContactScreenProps {
  onSubmit: (data: FounderTestContactValues) => Promise<void>;
  onBack: () => void;
  isSubmitting: boolean;
}

const REPORT_ITEMS = [
  { emoji: "🎯", text: "Your financial personality type" },
  { emoji: "💪", text: "Top 3 financial strengths" },
  { emoji: "⚠️", text: "Key risk areas to watch" },
  { emoji: "📈", text: "Personalised growth strategies" },
  { emoji: "🛠️", text: "Recommended tools & templates" },
];

export function TestContactScreen({
  onSubmit,
  onBack,
  isSubmitting,
}: TestContactScreenProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FounderTestContactValues>({
    resolver: zodResolver(founderTestContactSchema),
  });

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `linear-gradient(180deg, ${colorTokens.slate[50]} 0%, ${colorTokens.white} 100%)`,
        pt: { xs: 4, md: 8 },
        pb: 8,
      }}
    >
      <Container maxWidth="sm">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <Box sx={{ textAlign: "center", mb: 5 }}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              style={{ display: "inline-block", marginBottom: 16 }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, ${colorTokens.financeBlue[400]}, ${colorTokens.financeBlue[700]})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 12px 36px rgba(26,86,219,0.35)",
                  mx: "auto",
                }}
              >
                <Typography sx={{ fontSize: "2rem" }}>🎉</Typography>
              </Box>
            </motion.div>

            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                color: colorTokens.darkNavy[900],
                mb: 1.5,
                letterSpacing: "-0.025em",
              }}
            >
              You&apos;re Almost Done!
            </Typography>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              sx={{ lineHeight: 1.7 }}
            >
              Enter your details to receive your personalised financial
              personality report — and unlock your full growth playbook.
            </Typography>
          </Box>

          {/* What you'll get */}
          <Box
            sx={{
              p: 3,
              borderRadius: "18px",
              backgroundColor: colorTokens.financeBlue[50],
              border: `1px solid ${colorTokens.financeBlue[100]}`,
              mb: 4,
            }}
          >
            <Typography
              variant="overline"
              sx={{
                color: colorTokens.financeBlue[600],
                letterSpacing: "0.1em",
                mb: 2,
                display: "block",
              }}
            >
              Your Report Includes
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
              {REPORT_ITEMS.map((item) => (
                <Box
                  key={item.text}
                  sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                >
                  <span style={{ fontSize: "1.125rem", lineHeight: 1 }}>
                    {item.emoji}
                  </span>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 500,
                      color: colorTokens.financeBlue[800],
                    }}
                  >
                    {item.text}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Form */}
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{
              backgroundColor: colorTokens.white,
              borderRadius: "20px",
              p: { xs: 3, md: 4 },
              boxShadow: shadowTokens.lg,
              border: `1px solid ${colorTokens.slate[100]}`,
            }}
          >
            <Grid container spacing={2.5}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  {...register("name")}
                  label="Full Name *"
                  fullWidth
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  disabled={isSubmitting}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  {...register("email")}
                  label="Email Address *"
                  type="email"
                  fullWidth
                  error={!!errors.email}
                  helperText={
                    errors.email?.message ??
                    "Your detailed PDF report will be emailed here"
                  }
                  disabled={isSubmitting}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  {...register("company")}
                  label="Company (optional)"
                  fullWidth
                  disabled={isSubmitting}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  {...register("role")}
                  label="Your Role (optional)"
                  fullWidth
                  disabled={isSubmitting}
                  placeholder="e.g. Founder, CEO, CFO"
                />
              </Grid>
            </Grid>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mt: 2.5,
                mb: 3,
                px: 2,
                py: 1.5,
                borderRadius: "10px",
                backgroundColor: colorTokens.slate[50],
              }}
            >
              <LockIcon
                sx={{ fontSize: "0.875rem", color: colorTokens.slate[400] }}
              />
              <Typography
                variant="caption"
                sx={{ color: colorTokens.slate[500], lineHeight: 1.5 }}
              >
                We respect your privacy. No spam, ever. Unsubscribe anytime.
              </Typography>
            </Box>

            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                onClick={onBack}
                variant="outlined"
                startIcon={<BackIcon />}
                disabled={isSubmitting}
                sx={{
                  borderRadius: "12px",
                  py: 1.5,
                  fontWeight: 600,
                  borderWidth: "1.5px",
                  borderColor: colorTokens.slate[200],
                  color: colorTokens.slate[600],
                  "&:hover": {
                    borderColor: colorTokens.slate[400],
                    backgroundColor: colorTokens.slate[50],
                  },
                }}
              >
                Back
              </Button>
              <motion.div
                style={{ flex: 1 }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  disabled={isSubmitting}
                  startIcon={
                    isSubmitting ? (
                      <CircularProgress size={18} sx={{ color: "#fff" }} />
                    ) : (
                      <SendIcon />
                    )
                  }
                  sx={{
                    py: 1.5,
                    fontWeight: 700,
                    borderRadius: "12px",
                    background: `linear-gradient(135deg, ${colorTokens.financeBlue[500]}, ${colorTokens.financeBlue[700]})`,
                    boxShadow: "0 4px 16px rgba(26,86,219,0.3)",
                    "&:hover": { boxShadow: "0 6px 20px rgba(26,86,219,0.4)" },
                  }}
                >
                  {isSubmitting ? "Generating Report…" : "Get My Free Report"}
                </Button>
              </motion.div>
            </Box>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}
