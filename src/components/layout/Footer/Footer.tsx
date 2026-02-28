"use client";

import { useState } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Divider,
  IconButton,
  Stack,
  Grid,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  LinkedIn as LinkedInIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  YouTube as YouTubeIcon,
  ArrowForward as ArrowIcon,
  CheckCircleOutline as CheckIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { colorTokens } from "@/theme";
import { newsletterApi } from "@/lib/api/newsletter";
import {
  newsletterSchema,
  type NewsletterFormValues,
} from "@/lib/schemas/newsletter.schema";
import { GlassCard } from "@/components/ui";

const FOOTER_LINKS = {
  company: [
    { label: "About Us", href: "/about" },
    { label: "Our Team", href: "/about#team" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/book-consultation" },
  ],
  services: [
    { label: "Templates", href: "/templates" },
    { label: "Calculators", href: "/calculators" },
    { label: "Founder Test", href: "/founder-test" },
    { label: "Book Consultation", href: "/book-consultation" },
  ],
  support: [
    { label: "Order Tracking", href: "/order-tracking" },
    { label: "FAQ", href: "/faq" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
};

const SOCIAL_LINKS = [
  { icon: <LinkedInIcon />, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: <TwitterIcon />, href: "https://twitter.com", label: "Twitter" },
  {
    icon: <InstagramIcon />,
    href: "https://instagram.com",
    label: "Instagram",
  },
  { icon: <YouTubeIcon />, href: "https://youtube.com", label: "YouTube" },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export function Footer() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NewsletterFormValues>({
    resolver: zodResolver(newsletterSchema),
  });

  const mutation = useMutation({
    mutationFn: newsletterApi.subscribe,
    onSuccess: () => {
      reset();
    },
  });

  const onSubmit = (data: NewsletterFormValues) => {
    mutation.mutate(data);
  };

  return (
    <Box
      component="footer"
      sx={{
        background: `linear-gradient(180deg, ${colorTokens.darkNavy[800]} 0%, ${colorTokens.darkNavy[900]} 100%)`,
        pt: { xs: 8, md: 12 },
        pb: 4,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background mesh */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background: `
            radial-gradient(ellipse at 10% 20%, rgba(26,86,219,0.08) 0%, transparent 50%),
            radial-gradient(ellipse at 90% 80%, rgba(16,52,160,0.06) 0%, transparent 50%)
          `,
          pointerEvents: "none",
        }}
      />

      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1 }}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {/* Newsletter Banner */}
          <motion.div variants={itemVariants}>
            <GlassCard
              intensity="medium"
              sx={{
                p: { xs: 3, md: 5 },
                mb: 8,
                background: `linear-gradient(135deg, rgba(26,86,219,0.15) 0%, rgba(10,20,48,0.4) 100%)`,
                border: `1px solid rgba(26,86,219,0.25)`,
              }}
            >
              <Grid container spacing={4} alignItems="center">
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography
                    variant="overline"
                    sx={{
                      color: colorTokens.financeBlue[300],
                      letterSpacing: "0.12em",
                      mb: 1,
                      display: "block",
                    }}
                  >
                    Stay Informed
                  </Typography>
                  <Typography
                    variant="h3"
                    sx={{
                      color: "#fff",
                      fontWeight: 700,
                      mb: 1.5,
                      fontSize: { xs: "1.5rem", md: "2rem" },
                    }}
                  >
                    Financial Insights,{" "}
                    <Box
                      component="span"
                      sx={{
                        background: `linear-gradient(135deg, ${colorTokens.financeBlue[300]}, ${colorTokens.financeBlue[500]})`,
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      Straight to You
                    </Box>
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "rgba(255,255,255,0.55)", lineHeight: 1.7 }}
                  >
                    Join 2,000+ founders getting weekly finance strategies,
                    model breakdowns, and exclusive template drops.
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  {mutation.isSuccess ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4 }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          p: 2.5,
                          borderRadius: "14px",
                          backgroundColor: "rgba(16,185,129,0.12)",
                          border: "1px solid rgba(16,185,129,0.25)",
                        }}
                      >
                        <CheckIcon
                          sx={{
                            color: colorTokens.success.main,
                            fontSize: "1.75rem",
                          }}
                        />
                        <Box>
                          <Typography
                            variant="body1"
                            sx={{ color: "#fff", fontWeight: 600 }}
                          >
                            You&apos;re subscribed!
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ color: "rgba(255,255,255,0.55)" }}
                          >
                            Check your inbox for a welcome message.
                          </Typography>
                        </Box>
                      </Box>
                    </motion.div>
                  ) : (
                    <Box
                      component="form"
                      onSubmit={handleSubmit(onSubmit)}
                      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                    >
                      <TextField
                        {...register("name")}
                        placeholder="Your name"
                        size="small"
                        error={!!errors.name}
                        helperText={errors.name?.message}
                        sx={darkInputSx}
                      />
                      <Box sx={{ display: "flex", gap: 1.5 }}>
                        <TextField
                          {...register("email")}
                          placeholder="Your email address"
                          size="small"
                          fullWidth
                          error={!!errors.email}
                          helperText={errors.email?.message}
                          sx={darkInputSx}
                        />
                        <motion.div
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                        >
                          <Button
                            type="submit"
                            variant="contained"
                            disabled={mutation.isPending}
                            sx={{
                              background: `linear-gradient(135deg, ${colorTokens.financeBlue[500]}, ${colorTokens.financeBlue[700]})`,
                              px: 3,
                              py: 1,
                              minWidth: "auto",
                              whiteSpace: "nowrap",
                              boxShadow: "0 4px 14px rgba(26,86,219,0.4)",
                              flexShrink: 0,
                            }}
                          >
                            {mutation.isPending ? (
                              <CircularProgress
                                size={18}
                                sx={{ color: "#fff" }}
                              />
                            ) : (
                              <ArrowIcon />
                            )}
                          </Button>
                        </motion.div>
                      </Box>
                      {mutation.isError && (
                        <Alert
                          severity="error"
                          sx={{ borderRadius: "10px", py: 0.5 }}
                        >
                          Something went wrong. Please try again.
                        </Alert>
                      )}
                    </Box>
                  )}
                </Grid>
              </Grid>
            </GlassCard>
          </motion.div>

          {/* Main Footer Links */}
          <Grid container spacing={4} sx={{ mb: 6 }}>
            {/* Brand */}
            <Grid size={{ xs: 12, md: 4 }}>
              <motion.div variants={itemVariants}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    mb: 2.5,
                  }}
                >
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "12px",
                      background: `linear-gradient(135deg, ${colorTokens.financeBlue[500]}, ${colorTokens.financeBlue[700]})`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 4px 12px rgba(26,86,219,0.4)",
                    }}
                  >
                    <Typography
                      sx={{
                        color: "#fff",
                        fontFamily: "var(--font-display)",
                        fontWeight: 800,
                        fontSize: "1.25rem",
                        lineHeight: 1,
                      }}
                    >
                      M
                    </Typography>
                  </Box>
                  <Box>
                    <Typography
                      sx={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 800,
                        fontSize: "1.125rem",
                        color: "#fff",
                        lineHeight: 1.1,
                        letterSpacing: "-0.02em",
                      }}
                    >
                      Merraki Solutions
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "0.6875rem",
                        color: "rgba(255,255,255,0.4)",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        fontFamily: "var(--font-body)",
                      }}
                    >
                      Your Trusted Partner in Fiscal Fitness
                    </Typography>
                  </Box>
                </Box>

                <Typography
                  variant="body2"
                  sx={{
                    color: "rgba(255,255,255,0.5)",
                    lineHeight: 1.8,
                    mb: 3,
                    maxWidth: 320,
                  }}
                >
                  We simplify finance so businesses amplify growth. Turning
                  numbers into strategy and complexity into confidence.
                </Typography>

                {/* Socials */}
                <Box sx={{ display: "flex", gap: 1 }}>
                  {SOCIAL_LINKS.map((social) => (
                    <motion.div
                      key={social.label}
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <IconButton
                        component="a"
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.label}
                        size="small"
                        sx={{
                          color: "rgba(255,255,255,0.5)",
                          backgroundColor: "rgba(255,255,255,0.06)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          width: 38,
                          height: 38,
                          transition: "all 0.25s ease",
                          "&:hover": {
                            color: "#fff",
                            backgroundColor: colorTokens.financeBlue[600],
                            borderColor: colorTokens.financeBlue[500],
                          },
                        }}
                      >
                        {social.icon}
                      </IconButton>
                    </motion.div>
                  ))}
                </Box>
              </motion.div>
            </Grid>

            {/* Links */}
            {(
              [
                { title: "Company", links: FOOTER_LINKS.company },
                { title: "Services", links: FOOTER_LINKS.services },
                { title: "Support", links: FOOTER_LINKS.support },
              ] as const
            ).map((col) => (
              <Grid size={{ xs: 6, sm: 4, md: 2.67 }} key={col.title}>
                <motion.div variants={itemVariants}>
                  <Typography
                    variant="overline"
                    sx={{
                      color: "rgba(255,255,255,0.4)",
                      letterSpacing: "0.1em",
                      fontSize: "0.6875rem",
                      display: "block",
                      mb: 2.5,
                    }}
                  >
                    {col.title}
                  </Typography>
                  <Stack spacing={1.25}>
                    {col.links.map((link) => (
                      <motion.div
                        key={link.href}
                        whileHover={{ x: 4 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Link
                          href={link.href}
                          style={{ textDecoration: "none" }}
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              color: "rgba(255,255,255,0.55)",
                              fontWeight: 400,
                              transition: "color 0.2s ease",
                              "&:hover": {
                                color: "#fff",
                              },
                            }}
                          >
                            {link.label}
                          </Typography>
                        </Link>
                      </motion.div>
                    ))}
                  </Stack>
                </motion.div>
              </Grid>
            ))}
          </Grid>

          {/* Bottom Bar */}
          <Divider sx={{ borderColor: "rgba(255,255,255,0.08)", mb: 3 }} />

          <motion.div variants={itemVariants}>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: { xs: "center", sm: "center" },
                justifyContent: "space-between",
                gap: 2,
                textAlign: { xs: "center", sm: "left" },
              }}
            >
              <Typography
                variant="caption"
                sx={{ color: "rgba(255,255,255,0.3)", lineHeight: 1.6 }}
              >
                © {new Date().getFullYear()} Merraki Solutions. All rights
                reserved.
                <br />
                Built with ❤️ by Parag Bhutani & Khyati Gupta
              </Typography>

              <Box sx={{ display: "flex", gap: 3 }}>
                {["Privacy Policy", "Terms of Service", "Cookies"].map(
                  (item) => (
                    <Link
                      key={item}
                      href={`/${item.toLowerCase().replace(/ /g, "-")}`}
                      style={{ textDecoration: "none" }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          color: "rgba(255,255,255,0.3)",
                          transition: "color 0.2s ease",
                          "&:hover": { color: "rgba(255,255,255,0.6)" },
                          whiteSpace: "nowrap",
                        }}
                      >
                        {item}
                      </Typography>
                    </Link>
                  ),
                )}
              </Box>
            </Box>
          </motion.div>
        </motion.div>
      </Container>
    </Box>
  );
}

// Dark input style helper
const darkInputSx = {
  "& .MuiOutlinedInput-root": {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: "10px",
    color: "#fff",
    "& fieldset": {
      borderColor: "rgba(255,255,255,0.12)",
    },
    "&:hover fieldset": {
      borderColor: "rgba(255,255,255,0.25)",
    },
    "&.Mui-focused fieldset": {
      borderColor: colorTokens.financeBlue[400],
    },
    "& input::placeholder": {
      color: "rgba(255,255,255,0.35)",
      opacity: 1,
    },
  },
  "& .MuiFormHelperText-root": {
    color: colorTokens.error.main,
  },
};
