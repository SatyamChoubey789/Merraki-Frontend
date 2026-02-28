"use client";

import {
  Box,
  Container,
  Typography,
  Grid,
  IconButton,
  TextField,
  Button,
  InputAdornment,
} from "@mui/material";
import {
  LinkedIn as LinkedInIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  ArrowForward as ArrowIcon,
  Email as EmailIcon,
} from "@mui/icons-material";
import { motion , Variants} from "framer-motion";
import Link from "next/link";
import { useInView } from "@/lib/hooks/useInView";
import { MerrakiLogo } from "@/components/ui/MerrakiLogo/MerrakiLogo";
import { useNewsletterSubscribe } from "@/lib/hooks/useNewsletter";
import { useState } from "react";

/* ── design tokens ─────────────────────────────────────────────────── */
const T = {
  bg:         "#FFFFFF",
  bgOff:      "#F7F8FA",
  border:     "#E8EAED",
  borderMid:  "#D1D5DB",
  ink:        "#0F1117",
  inkMid:     "#374151",
  inkMuted:   "#6B7280",
  inkFaint:   "#9CA3AF",
  accent:     "#0057FF",
  accentHov:  "#0041CC",
  success:    "#059669",
};

const FONT_DISPLAY = `"Instrument Serif", "Playfair Display", Georgia, serif`;
const FONT_MONO    = `"DM Mono", "JetBrains Mono", monospace`;
const FONT_BODY    = `"DM Sans", "Mona Sans", system-ui, sans-serif`;

/* ── footer nav ────────────────────────────────────────────────────── */
const FOOTER_LINKS = {
  Services: [
    { label: "Financial Modelling",  href: "/book-consultation" },
    { label: "Excel Dashboards",     href: "/book-consultation" },
    { label: "Bookkeeping",          href: "/book-consultation" },
    { label: "Data Analysis",        href: "/book-consultation" },
    { label: "Founder Consulting",   href: "/book-consultation" },
  ],
  Resources: [
    { label: "Templates",      href: "/templates"      },
    { label: "Calculators",    href: "/calculators"    },
    { label: "Founder Test",   href: "/founder-test"   },
    { label: "Blog",           href: "/blog"           },
    { label: "Order Tracking", href: "/order-tracking" },
  ],
  Company: [
    { label: "About Us",          href: "/about"             },
    { label: "Book Consultation", href: "/book-consultation" },
    { label: "Privacy Policy",    href: "/privacy"           },
    { label: "Terms of Service",  href: "/terms"             },
    { label: "Refund Policy",     href: "/refunds"           },
  ],
};

const SOCIALS = [
  { icon: LinkedInIcon,  href: "https://linkedin.com/company/merrakisolutions",  label: "LinkedIn"  },
  { icon: TwitterIcon,   href: "https://twitter.com/merrakisolutions",           label: "Twitter"   },
  { icon: InstagramIcon, href: "https://instagram.com/merrakisolutions",         label: "Instagram" },
];

/* ── link component ─────────────────────────────────────────────────── */
const FooterLink = ({ label, href }: { label: string; href: string }) => (
  <Link href={href} style={{ textDecoration: "none" }}>
    <Typography
      sx={{
        fontFamily: FONT_BODY,
        fontSize: "0.875rem",
        color: T.inkMuted,
        fontWeight: 400,
        lineHeight: 1,
        display: "inline-block",
        transition: "color 0.18s ease",
        "&:hover": { color: T.ink },
      }}
    >
      {label}
    </Typography>
  </Link>
);

/* ══════════════════════════════════════════════════════════════════════
   FOOTER
══════════════════════════════════════════════════════════════════════ */
export function Footer() {
  const { ref, inView } = useInView({ threshold: 0.05 });
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
        background: T.bg,
        borderTop: `1px solid ${T.border}`,
        fontFamily: FONT_BODY,
      }}
    >
      <Container maxWidth="xl">

        {/* ── Newsletter strip ───────────────────────────────────────── */}
        <Box
          sx={{
            py: { xs: 5, md: 6 },
            borderBottom: `1px solid ${T.border}`,
            display: "flex",
            alignItems: { md: "center" },
            justifyContent: "space-between",
            flexDirection: { xs: "column", md: "row" },
            gap: { xs: 3, md: 0 },
          }}
        >
          {/* left */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, mb: 0.75 }}>
              <Box
                sx={{
                  width: 5, height: 5, borderRadius: "50%",
                  background: T.accent,
                  flexShrink: 0,
                }}
              />
              <Typography
                sx={{
                  fontFamily: FONT_MONO,
                  fontSize: "0.6rem",
                  letterSpacing: "0.15em",
                  color: T.accent,
                  textTransform: "uppercase",
                }}
              >
                Newsletter
              </Typography>
            </Box>
            <Typography
              sx={{
                fontFamily: FONT_DISPLAY,
                fontWeight: 400,
                fontStyle: "italic",
                fontSize: { xs: "1.5rem", md: "1.75rem" },
                color: T.ink,
                letterSpacing: "-0.02em",
                lineHeight: 1.15,
                mb: 0.5,
              }}
            >
              Finance insights, straight to your inbox
            </Typography>
            <Typography
              sx={{
                fontFamily: FONT_BODY,
                fontSize: "0.875rem",
                color: T.inkMuted,
                lineHeight: 1.65,
              }}
            >
              Practical guides, model breakdowns, and founder strategies — no fluff, no spam.
            </Typography>
          </motion.div>

          {/* right – input */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.1 }}
          >
            <Box
              sx={{
                display: "flex",
                gap: 1,
                width: { xs: "100%", md: 420 },
                border: `1px solid ${T.borderMid}`,
                borderRadius: "10px",
                p: "5px 5px 5px 12px",
                background: T.bg,
                boxShadow: "0 1px 4px rgba(15,17,23,0.06)",
                transition: "box-shadow 0.2s ease, border-color 0.2s ease",
                "&:focus-within": {
                  borderColor: T.accent,
                  boxShadow: `0 0 0 3px rgba(0,87,255,0.1)`,
                },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", flex: 1, gap: 1 }}>
                <EmailIcon sx={{ color: T.inkFaint, fontSize: "0.9rem", flexShrink: 0 }} />
                <TextField
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
                  placeholder="your@email.com"
                  size="small"
                  fullWidth
                  disabled={newsletterMutation.isPending || newsletterMutation.isSuccess}
                  variant="standard"
                  InputProps={{ disableUnderline: true }}
                  sx={{
                    "& input": {
                      fontFamily: FONT_BODY,
                      fontSize: "0.875rem",
                      color: T.ink,
                      "&::placeholder": { color: T.inkFaint, opacity: 1 },
                    },
                  }}
                />
              </Box>
              <Button
                onClick={handleSubscribe}
                variant="contained"
                disabled={newsletterMutation.isPending || newsletterMutation.isSuccess}
                endIcon={newsletterMutation.isSuccess ? undefined : <ArrowIcon sx={{ fontSize: "0.9rem !important" }} />}
                disableElevation
                sx={{
                  px: 2.5,
                  py: 1,
                  borderRadius: "7px",
                  fontFamily: FONT_BODY,
                  fontWeight: 600,
                  fontSize: "0.8125rem",
                  whiteSpace: "nowrap",
                  textTransform: "none",
                  background: newsletterMutation.isSuccess ? T.success : T.accent,
                  minWidth: 110,
                  letterSpacing: "-0.01em",
                  "&:hover": { background: newsletterMutation.isSuccess ? T.success : T.accentHov },
                }}
              >
                {newsletterMutation.isSuccess ? "✓ Done" : "Subscribe"}
              </Button>
            </Box>
          </motion.div>
        </Box>

        {/* ── Main grid ──────────────────────────────────────────────── */}
        <Box
          ref={ref as React.RefObject<HTMLDivElement>}
          sx={{ py: { xs: 6, md: 8 } }}
        >
          <Grid container spacing={{ xs: 5, md: 4 }}>

            {/* Brand column */}
            <Grid size={{ xs: 12, md: 3.5 }}>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5 }}
              >
                {/* Logo */}
                <Box sx={{ mb: 3 }}>
                  {inView && (
                    <MerrakiLogo variant="color" width={120} animate />
                  )}
                </Box>

                <Typography
                  sx={{
                    fontFamily: FONT_BODY,
                    fontSize: "0.875rem",
                    color: T.inkMuted,
                    lineHeight: 1.75,
                    mb: 3.5,
                    maxWidth: 280,
                  }}
                >
                  We simplify finance so businesses amplify growth. Financial
                  modelling, Excel dashboards, templates, and founder consulting
                  for Indian businesses.
                </Typography>

                {/* Socials */}
                <Box sx={{ display: "flex", gap: 0.75 }}>
                  {SOCIALS.map((s, i) => (
                    <motion.div
                      key={s.label}
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={inView ? { opacity: 1, scale: 1 } : {}}
                      transition={{ delay: 0.25 + i * 0.07 }}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.93 }}
                    >
                      <IconButton
                        component="a"
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={s.label}
                        size="small"
                        sx={{
                          color: T.inkFaint,
                          background: T.bgOff,
                          border: `1px solid ${T.border}`,
                          borderRadius: "8px",
                          width: 34,
                          height: 34,
                          transition: "all 0.2s ease",
                          "&:hover": {
                            color: T.accent,
                            background: "rgba(0,87,255,0.06)",
                            borderColor: "rgba(0,87,255,0.2)",
                          },
                        }}
                      >
                        <s.icon sx={{ fontSize: "0.9rem" }} />
                      </IconButton>
                    </motion.div>
                  ))}
                </Box>
              </motion.div>
            </Grid>

            {/* Spacer */}
            <Grid size={{ xs: 0, md: 0.5 }} sx={{ display: { xs: "none", md: "block" } }} />

            {/* Link columns */}
            {Object.entries(FOOTER_LINKS).map(([heading, links], colIdx) => (
              <Grid size={{ xs: 6, sm: 4, md: 8 / 3 }} key={heading}>
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.1 + colIdx * 0.07, duration: 0.45 }}
                >
                  {/* column heading */}
                  <Typography
                    sx={{
                      fontFamily: FONT_MONO,
                      fontSize: "0.6rem",
                      letterSpacing: "0.14em",
                      color: T.inkFaint,
                      textTransform: "uppercase",
                      mb: 2.5,
                      display: "block",
                    }}
                  >
                    {heading}
                  </Typography>

                  {/* links */}
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1.75 }}>
                    {links.map((link, li) => (
                      <motion.div
                        key={link.label}
                        initial={{ opacity: 0 }}
                        animate={inView ? { opacity: 1 } : {}}
                        transition={{ delay: 0.18 + colIdx * 0.07 + li * 0.03 }}
                      >
                        <FooterLink {...link} />
                      </motion.div>
                    ))}
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* ── Bottom bar ──────────────────────────────────────────────── */}
        <Box
          sx={{
            borderTop: `1px solid ${T.border}`,
            py: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          {/* copyright */}
          <Typography
            sx={{
              fontFamily: FONT_MONO,
              fontSize: "0.6rem",
              letterSpacing: "0.1em",
              color: T.inkFaint,
            }}
          >
            © {new Date().getFullYear()} Merraki Solutions. All rights reserved.
          </Typography>

          {/* legal links */}
          <Box sx={{ display: "flex", gap: 3, alignItems: "center" }}>
            {[
              { label: "Privacy Policy", href: "/privacy" },
              { label: "Terms",          href: "/terms"   },
              { label: "Refund Policy",  href: "/refunds" },
            ].map((item) => (
              <Link key={item.label} href={item.href} style={{ textDecoration: "none" }}>
                <Typography
                  sx={{
                    fontFamily: FONT_BODY,
                    fontSize: "0.75rem",
                    color: T.inkFaint,
                    transition: "color 0.18s ease",
                    "&:hover": { color: T.inkMid },
                  }}
                >
                  {item.label}
                </Typography>
              </Link>
            ))}
          </Box>
        </Box>

      </Container>
    </Box>
  );
}