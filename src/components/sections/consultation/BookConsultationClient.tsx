"use client";

import {
  Box,
  Container,
  Typography,
  Grid,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  CheckCircle as CheckIcon,
  CalendarMonth as CalIcon,
  Send as SendIcon,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { colorTokens, shadowTokens } from "@/theme";
import { SectionLabel, GradientText } from "@/components/ui";
import { useContact } from "@/lib/hooks/useContact";
import {
  contactSchema,
  type ContactFormValues,
} from "@/lib/schemas/contact.schema";

const WHAT_TO_EXPECT = [
  {
    icon: "🎯",
    title: "30-Minute Deep Dive",
    text: "A focused session on your most pressing financial challenge.",
  },
  {
    icon: "📊",
    title: "Custom Assessment",
    text: "We review your current numbers and identify key opportunities.",
  },
  {
    icon: "🗺️",
    title: "Financial Roadmap",
    text: "Walk away with a clear 90-day action plan you can implement immediately.",
  },
  {
    icon: "🚀",
    title: "No Hard Sell",
    text: "Pure value. We work with you only if it's the right fit.",
  },
];

const SERVICE_OPTIONS = [
  { value: "consultation", label: "Founder Consultation" },
  { value: "modelling", label: "Financial Modelling" },
  { value: "templates", label: "Custom Templates" },
  { value: "other", label: "Other / Not Sure Yet" },
];

export function BookConsultationClient() {
  const contactMutation = useContact();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { serviceType: "consultation" },
  });

  const onSubmit = (data: ContactFormValues) => {
    contactMutation.mutate(data, { onSuccess: () => reset() });
  };

  return (
    <Box
      sx={{
        pt: { xs: 4, md: 6 },
        pb: 12,
        minHeight: "100vh",
        background: `linear-gradient(180deg, ${colorTokens.slate[50]} 0%, ${colorTokens.white} 100%)`,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          background: `linear-gradient(160deg, ${colorTokens.darkNavy[900]} 0%, ${colorTokens.darkNavy[800]} 100%)`,
          pt: { xs: 10, md: 14 },
          pb: { xs: 7, md: 10 },
          mb: 8,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(ellipse at 30% 50%, rgba(26,86,219,0.15) 0%, transparent 55%)`,
            pointerEvents: "none",
          }}
        />
        <Container
          maxWidth="lg"
          sx={{ position: "relative", zIndex: 1, textAlign: "center" }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <SectionLabel text="Free Strategy Session" color="light" />
            <Typography
              variant="h1"
              sx={{
                mt: 2,
                mb: 2,
                color: "#fff",
                fontWeight: 800,
                letterSpacing: "-0.03em",
              }}
            >
              Let&apos;s Build Your{" "}
              <Box
                component="span"
                sx={{
                  background: `linear-gradient(135deg, ${colorTokens.financeBlue[300]}, #A78BFA)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Financial Roadmap
              </Box>
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{
                color: "rgba(255,255,255,0.55)",
                maxWidth: 520,
                mx: "auto",
                lineHeight: 1.8,
              }}
            >
              Book a free 30-minute consultation with Parag or Khyati and walk
              away with a personalised action plan for your business finances.
            </Typography>
          </motion.div>
        </Container>
      </Box>

      <Container maxWidth="xl">
        <Grid container spacing={5} alignItems="flex-start">
          {/* Left — What to Expect + Calendly */}
          <Grid size={{ xs: 12, lg: 5 }}>
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              {/* What to expect */}
              <Box
                sx={{
                  backgroundColor: colorTokens.white,
                  borderRadius: "24px",
                  p: { xs: 3, md: 4 },
                  boxShadow: shadowTokens.lg,
                  border: `1px solid ${colorTokens.slate[100]}`,
                  mb: 3,
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 800,
                    color: colorTokens.darkNavy[900],
                    mb: 3,
                  }}
                >
                  What to Expect
                </Typography>
                <Box
                  sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}
                >
                  {WHAT_TO_EXPECT.map((item, i) => (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 + i * 0.08, duration: 0.4 }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          gap: 2,
                          alignItems: "flex-start",
                        }}
                      >
                        <Box
                          sx={{
                            width: 44,
                            height: 44,
                            borderRadius: "12px",
                            backgroundColor: colorTokens.financeBlue[50],
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "1.25rem",
                            flexShrink: 0,
                          }}
                        >
                          {item.icon}
                        </Box>
                        <Box>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 700,
                              color: colorTokens.darkNavy[800],
                              mb: 0.25,
                            }}
                          >
                            {item.title}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ lineHeight: 1.6 }}
                          >
                            {item.text}
                          </Typography>
                        </Box>
                      </Box>
                    </motion.div>
                  ))}
                </Box>
              </Box>

              {/* Calendly direct link */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Box
                  component="a"
                  href={process.env.NEXT_PUBLIC_CALENDLY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1.5,
                    p: 2.5,
                    borderRadius: "16px",
                    background: `linear-gradient(135deg, ${colorTokens.financeBlue[500]}, ${colorTokens.financeBlue[700]})`,
                    boxShadow: "0 8px 28px rgba(26,86,219,0.35)",
                    textDecoration: "none",
                    transition: "box-shadow 0.25s ease",
                    "&:hover": {
                      boxShadow: "0 12px 36px rgba(26,86,219,0.45)",
                    },
                  }}
                >
                  <CalIcon sx={{ color: "#fff", fontSize: "1.375rem" }} />
                  <Box>
                    <Typography
                      sx={{
                        color: "#fff",
                        fontWeight: 800,
                        fontFamily: "var(--font-display)",
                        fontSize: "1rem",
                        lineHeight: 1.2,
                      }}
                    >
                      Open Calendly Directly
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: "rgba(255,255,255,0.65)" }}
                    >
                      Choose a time that works for you →
                    </Typography>
                  </Box>
                </Box>
              </motion.div>
            </motion.div>
          </Grid>

          {/* Right — Contact Form */}
          <Grid size={{ xs: 12, lg: 7 }}>
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
            >
              <Box
                sx={{
                  backgroundColor: colorTokens.white,
                  borderRadius: "24px",
                  p: { xs: 3, md: 5 },
                  boxShadow: shadowTokens.xl,
                  border: `1px solid ${colorTokens.slate[100]}`,
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 800,
                    color: colorTokens.darkNavy[900],
                    mb: 0.75,
                  }}
                >
                  Send Us a Message
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 4, lineHeight: 1.7 }}
                >
                  Prefer to send details first? Fill out the form and we&apos;ll
                  reach out to schedule your session.
                </Typography>

                <AnimatePresence mode="wait">
                  {contactMutation.isSuccess ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4 }}
                    >
                      <Box
                        sx={{
                          textAlign: "center",
                          py: 6,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: 2,
                        }}
                      >
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{
                            type: "spring",
                            stiffness: 200,
                            damping: 15,
                          }}
                        >
                          <Box
                            sx={{
                              width: 80,
                              height: 80,
                              borderRadius: "50%",
                              backgroundColor: colorTokens.success.light,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <CheckIcon
                              sx={{
                                fontSize: "2.5rem",
                                color: colorTokens.success.main,
                              }}
                            />
                          </Box>
                        </motion.div>
                        <Typography
                          variant="h5"
                          fontWeight={800}
                          color={colorTokens.darkNavy[900]}
                        >
                          Message Received!
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ maxWidth: 360 }}
                        >
                          We&apos;ll review your details and get back to you
                          within 24 hours to schedule your free consultation.
                        </Typography>
                      </Box>
                    </motion.div>
                  ) : (
                    <motion.div key="form">
                      <Box
                        component="form"
                        onSubmit={handleSubmit(onSubmit)}
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 2.5,
                        }}
                      >
                        <Grid container spacing={2.5}>
                          <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                              {...register("name")}
                              label="Full Name *"
                              fullWidth
                              error={!!errors.name}
                              helperText={errors.name?.message}
                              disabled={contactMutation.isPending}
                            />
                          </Grid>
                          <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                              {...register("email")}
                              label="Email Address *"
                              type="email"
                              fullWidth
                              error={!!errors.email}
                              helperText={errors.email?.message}
                              disabled={contactMutation.isPending}
                            />
                          </Grid>
                          <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                              {...register("phone")}
                              label="Phone Number"
                              fullWidth
                              error={!!errors.phone}
                              helperText={errors.phone?.message}
                              disabled={contactMutation.isPending}
                            />
                          </Grid>
                          <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                              {...register("company")}
                              label="Company"
                              fullWidth
                              disabled={contactMutation.isPending}
                            />
                          </Grid>
                          <Grid size={{ xs: 12 }}>
                            <Controller
                              name="serviceType"
                              control={control}
                              render={({ field }) => (
                                <FormControl fullWidth>
                                  <InputLabel>Service Interested In</InputLabel>
                                  <Select
                                    {...field}
                                    label="Service Interested In"
                                    sx={{ borderRadius: "12px" }}
                                    disabled={contactMutation.isPending}
                                  >
                                    {SERVICE_OPTIONS.map((opt) => (
                                      <MenuItem
                                        key={opt.value}
                                        value={opt.value}
                                      >
                                        {opt.label}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                              )}
                            />
                          </Grid>
                          <Grid size={{ xs: 12 }}>
                            <TextField
                              {...register("subject")}
                              label="Subject *"
                              fullWidth
                              error={!!errors.subject}
                              helperText={errors.subject?.message}
                              disabled={contactMutation.isPending}
                              placeholder="e.g. Need a financial model for my SaaS startup"
                            />
                          </Grid>
                          <Grid size={{ xs: 12 }}>
                            <TextField
                              {...register("message")}
                              label="Message *"
                              fullWidth
                              multiline
                              rows={5}
                              error={!!errors.message}
                              helperText={
                                errors.message?.message ??
                                "Tell us about your business, current challenges, and what you want to achieve."
                              }
                              disabled={contactMutation.isPending}
                            />
                          </Grid>
                        </Grid>

                        {contactMutation.isError && (
                          <Alert severity="error" sx={{ borderRadius: "12px" }}>
                            Failed to send. Please try again or email us
                            directly.
                          </Alert>
                        )}

                        <motion.div
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                        >
                          <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            fullWidth
                            disabled={contactMutation.isPending}
                            startIcon={
                              contactMutation.isPending ? (
                                <CircularProgress
                                  size={18}
                                  sx={{ color: "#fff" }}
                                />
                              ) : (
                                <SendIcon />
                              )
                            }
                            sx={{
                              py: 1.75,
                              fontWeight: 700,
                              borderRadius: "14px",
                              background: `linear-gradient(135deg, ${colorTokens.financeBlue[500]}, ${colorTokens.financeBlue[700]})`,
                              boxShadow: "0 6px 20px rgba(26,86,219,0.35)",
                              fontSize: "1rem",
                            }}
                          >
                            {contactMutation.isPending
                              ? "Sending…"
                              : "Send Message"}
                          </Button>
                        </motion.div>
                      </Box>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Box>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
