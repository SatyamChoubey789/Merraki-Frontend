"use client";

import {
  Box,
  Container,
  Typography,
  Grid,
  IconButton,
  TextField,
  Button,
  Divider,
  InputAdornment,
} from "@mui/material";
import {
  LinkedIn as LinkedInIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  ArrowForward as ArrowIcon,
  Email as EmailIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import Link from "next/link";
import { colorTokens } from "@/theme";
import { useInView } from "@/lib/hooks/useInView";
import { MerrakiLogo } from "@/components/ui/MerrakiLogo/MerrakiLogo";
import { useNewsletterSubscribe } from "@/lib/hooks/useNewsletter";
import { useState } from "react";

const FOOTER_LINKS = {
  Services: [
    { label: "Financial Modelling", href: "/book-consultation" },
    { label: "Excel Dashboards", href: "/book-consultation" },
    { label: "Bookkeeping", href: "/book-consultation" },
    { label: "Data Analysis", href: "/book-consultation" },
    { label: "Founder Consulting", href: "/book-consultation" },
  ],
  Resources: [
    { label: "Templates", href: "/templates" },
    { label: "Calculators", href: "/calculators" },
    { label: "Founder Test", href: "/founder-test" },
    { label: "Blog", href: "/blog" },
    { label: "Order Tracking", href: "/order-tracking" },
  ],
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Book Consultation", href: "/book-consultation" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Refund Policy", href: "/refunds" },
  ],
};

const SOCIALS = [
  { icon: LinkedInIcon, href: "https://linkedin.com/company/merrakisolutions", label: "LinkedIn" },
  { icon: TwitterIcon, href: "https://twitter.com/merrakisolutions", label: "Twitter" },
  { icon: InstagramIcon, href: "https://instagram.com/merrakisolutions", label: "Instagram" },
];

export function Footer() {
  const { ref, inView } = useInView({ threshold: 0.1 });
  const newsletterMutation = useNewsletterSubscribe();
  const [email, setEmail] = useState("");

  const handleSubscribe = () => {
    if (!email) return;
    newsletterMutation.mutate({ email }, { onSuccess: () => setEmail("") });
  };

  return (
    <Box
      component="footer"
      sx={{
        background: `linear-gradient(180deg, ${colorTokens.darkNavy[900]} 0%, #050A14 100%)`,
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
            radial-gradient(ellipse at 90% 80%, rgba(139,92,246,0.06) 0%, transparent 50%)
          `,
          pointerEvents: "none",
        }}
      />

      {/* Grid overlay */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          pointerEvents: "none",
        }}
      />

      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1 }}>

        {/* ── Newsletter Banner ───────────────────────────────────────────── */}
        <Box
          sx={{
            py: { xs: 5, md: 6 },
            borderBottom: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <Grid container spacing={4} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <Typography
                  variant="h4"
                  sx={{
                    color: "#fff",
                    fontWeight: 800,
                    letterSpacing: "-0.02em",
                    mb: 1,
                  }}
                >
                  Finance insights, straight to your inbox
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "rgba(255,255,255,0.45)", lineHeight: 1.7 }}
                >
                  Practical guides, model breakdowns, and founder strategies — no fluff, no spam.
                </Typography>
              </motion.div>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Box sx={{ display: "flex", gap: 1.5 }}>
                  <TextField
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
                    placeholder="your@email.com"
                    size="small"
                    fullWidth
                    disabled={newsletterMutation.isPending || newsletterMutation.isSuccess}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon sx={{ color: "rgba(255,255,255,0.3)", fontSize: "1rem" }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "rgba(255,255,255,0.07)",
                        borderRadius: "12px",
                        color: "#fff",
                        "& fieldset": { borderColor: "rgba(255,255,255,0.12)" },
                        "&:hover fieldset": { borderColor: "rgba(255,255,255,0.25)" },
                        "&.Mui-focused fieldset": { borderColor: colorTokens.financeBlue[400] },
                        "& input::placeholder": { color: "rgba(255,255,255,0.3)", opacity: 1 },
                      },
                    }}
                  />
                  <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                    <Button
                      onClick={handleSubscribe}
                      variant="contained"
                      disabled={newsletterMutation.isPending || newsletterMutation.isSuccess}
                      endIcon={newsletterMutation.isSuccess ? "✓" : <ArrowIcon />}
                      sx={{
                        px: 3,
                        borderRadius: "12px",
                        fontWeight: 700,
                        whiteSpace: "nowrap",
                        background: newsletterMutation.isSuccess
                          ? colorTokens.success.main
                          : `linear-gradient(135deg, ${colorTokens.financeBlue[500]}, ${colorTokens.financeBlue[700]})`,
                        boxShadow: "0 4px 14px rgba(26,86,219,0.35)",
                        minWidth: 120,
                      }}
                    >
                      {newsletterMutation.isSuccess ? "Subscribed!" : "Subscribe"}
                    </Button>
                  </motion.div>
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </Box>

        {/* ── Main Footer Grid ─────────────────────────────────────────────── */}
        <Box
          ref={ref as React.RefObject<HTMLDivElement>}
          sx={{ py: { xs: 6, md: 8 } }}
        >
          <Grid container spacing={{ xs: 4, md: 6 }}>

            {/* Brand Column */}
            <Grid size={{ xs: 12, md: 4 }}>
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5 }}
              >
                {/* Logo with draw-on animation triggered by scroll */}
                <Box sx={{ mb: 3 }}>
                  {inView && (
                    <MerrakiLogo
                      variant="white"
                      width={130}
                      animate={true}   // ← draws on when footer scrolls into view
                    />
                  )}
                </Box>

                <Typography
                  variant="body2"
                  sx={{
                    color: "rgba(255,255,255,0.45)",
                    lineHeight: 1.8,
                    mb: 3,
                    maxWidth: 320,
                  }}
                >
                  We simplify finance so businesses amplify growth. Financial
                  modelling, Excel dashboards, templates, and founder consulting
                  for Indian businesses.
                </Typography>

                {/* Socials */}
                <Box sx={{ display: "flex", gap: 1 }}>
                  {SOCIALS.map((social, i) => (
                    <motion.div
                      key={social.label}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={inView ? { opacity: 1, scale: 1 } : {}}
                      transition={{ delay: 0.3 + i * 0.08, duration: 0.35 }}
                      whileHover={{ scale: 1.12, y: -2 }}
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
                          borderRadius: "10px",
                          width: 38,
                          height: 38,
                          transition: "all 0.25s ease",
                          "&:hover": {
                            color: "#fff",
                            backgroundColor: "rgba(26,86,219,0.4)",
                            borderColor: "rgba(26,86,219,0.5)",
                          },
                        }}
                      >
                        <social.icon sx={{ fontSize: "1rem" }} />
                      </IconButton>
                    </motion.div>
                  ))}
                </Box>
              </motion.div>
            </Grid>

            {/* Link Columns */}
            {Object.entries(FOOTER_LINKS).map(([heading, links], colIdx) => (
              <Grid size={{ xs: 6, sm: 4, md: 8 / 3 }} key={heading}>
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.12 + colIdx * 0.08, duration: 0.5 }}
                >
                  <Typography
                    variant="overline"
                    sx={{
                      color: "rgba(255,255,255,0.35)",
                      letterSpacing: "0.12em",
                      fontSize: "0.6875rem",
                      fontWeight: 600,
                      mb: 2.5,
                      display: "block",
                    }}
                  >
                    {heading}
                  </Typography>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
                    {links.map((link, linkIdx) => (
                      <motion.div
                        key={link.href + link.label}
                        initial={{ opacity: 0, x: -8 }}
                        animate={inView ? { opacity: 1, x: 0 } : {}}
                        transition={{
                          delay: 0.2 + colIdx * 0.08 + linkIdx * 0.04,
                          duration: 0.35,
                        }}
                      >
                        <Link href={link.href} style={{ textDecoration: "none" }}>
                          <Typography
                            variant="body2"
                            sx={{
                              color: "rgba(255,255,255,0.45)",
                              fontWeight: 400,
                              transition: "color 0.2s ease, transform 0.2s ease",
                              display: "inline-block",
                              "&:hover": {
                                color: "#fff",
                                transform: "translateX(3px)",
                              },
                            }}
                          >
                            {link.label}
                          </Typography>
                        </Link>
                      </motion.div>
                    ))}
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* ── Bottom Bar ────────────────────────────────────────────────────── */}
        <Divider sx={{ borderColor: "rgba(255,255,255,0.07)" }} />
        <Box
          sx={{
            py: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
          }}
        >
          <Typography
            variant="caption"
            sx={{ color: "rgba(255,255,255,0.25)", letterSpacing: "0.02em" }}
          >
            © {new Date().getFullYear()} Merraki Solutions. All rights reserved.
          </Typography>

          <Box sx={{ display: "flex", gap: 3 }}>
            {["Privacy Policy", "Terms", "Refund Policy"].map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase().replace(/ /g, "-")}`}
                style={{ textDecoration: "none" }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: "rgba(255,255,255,0.25)",
                    transition: "color 0.2s ease",
                    "&:hover": { color: "rgba(255,255,255,0.6)" },
                  }}
                >
                  {item}
                </Typography>
              </Link>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}