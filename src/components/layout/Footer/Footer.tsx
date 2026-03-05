"use client";

import {
  Box,
  Container,
  Typography,
  IconButton,
  TextField,
} from "@mui/material";
import {
  LinkedIn as LinkedInIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
} from "@mui/icons-material";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { useRef, useState } from "react";
import { MerrakiLogo } from "@/components/ui/MerrakiLogo/MerrakiLogo";
import { useNewsletterSubscribe } from "@/lib/hooks/useNewsletter";

/* ══ DARK THEME TOKENS ═══════════════════════════════════ */
const T = {
  bg: "#0A0A0F",
  bgSection: "#121218",

  ink: "#FFFFFF",
  inkMid: "#E4E4EB",
  inkMuted: "#A1A1B5",
  inkFaint: "#6E6E85",

  border: "rgba(255,255,255,0.06)",
  borderMid: "rgba(255,255,255,0.12)",

  blue: "#4C8DFF",
  blueMid: "#6AA3FF",
  blueLight: "#8FB8FF",

  bluePale: "rgba(76,141,255,0.12)",
  blueGlow: "rgba(76,141,255,0.20)",
  blueDim: "rgba(76,141,255,0.08)",

  blueGrad: "linear-gradient(135deg,#4C8DFF 0%,#8FB8FF 100%)",
};

const SERIF = '"Instrument Serif","Playfair Display",Georgia,serif';
const SANS = '"DM Sans","Mona Sans",system-ui,sans-serif';
const MONO = '"DM Mono","JetBrains Mono",ui-monospace,monospace';
const EASE = [0.16, 1, 0.3, 1] as const;

/* ══ NAV DATA ════════════════════════════════════════════ */
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
  {
    Icon: LinkedInIcon,
    href: "https://linkedin.com/company/merrakisolutions",
    label: "LinkedIn",
  },
  {
    Icon: TwitterIcon,
    href: "https://twitter.com/merrakisolutions",
    label: "Twitter",
  },
  {
    Icon: InstagramIcon,
    href: "https://instagram.com/merrakisolutions",
    label: "Instagram",
  },
];

/* ══ BLUE RULE ═══════════════════════════════════════════ */
function BlueRule({ width = 28, delay = 0, inView = false }: any) {
  return (
    <motion.div
      initial={{ scaleX: 0 }}
      animate={inView ? { scaleX: 1 } : {}}
      transition={{ duration: 0.55, delay, ease: EASE }}
      style={{ transformOrigin: "left" }}
    >
      <Box
        sx={{ width, height: 1.5, background: T.blueGrad, borderRadius: 1 }}
      />
    </motion.div>
  );
}

/* ══ NEWSLETTER STRIP ════════════════════════════════════ */
function NewsletterStrip({ inView }: any) {
  const newsletterMutation = useNewsletterSubscribe();
  const [email, setEmail] = useState("");

  const handleSubscribe = () => {
    if (!email) return;
    newsletterMutation.mutate({ email }, { onSuccess: () => setEmail("") });
  };

  return (
    <Box
      sx={{
        py: { xs: 7, md: 9 },
        borderBottom: `1px solid ${T.border}`,
        display: "flex",
        justifyContent: "space-between",
        flexDirection: { xs: "column", md: "row" },
        gap: { xs: 5, md: 0 },
      }}
    >
      {/* LEFT */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.65 }}
      >
        <Box sx={{ display: "flex", gap: 1.5, mb: 2 }}>
          <BlueRule width={22} delay={0.1} inView={inView} />
          <Typography
            sx={{
              fontFamily: MONO,
              fontSize: "0.52rem",
              letterSpacing: "0.22em",
              color: T.blue,
              textTransform: "uppercase",
            }}
          >
            Newsletter
          </Typography>
        </Box>

        <Typography
          sx={{
            fontFamily: SERIF,
            fontSize: { xs: "1.75rem", md: "2.25rem" },
            color: T.ink,
            fontStyle: "italic",
            mb: 1,
          }}
        >
          Finance insights, straight
        </Typography>

        <Typography
          sx={{
            fontFamily: SERIF,
            fontSize: { xs: "1.75rem", md: "2.25rem" },
            fontStyle: "italic",
            background: T.blueGrad,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          to your inbox.
        </Typography>

        <Typography
          sx={{
            mt: 2,
            color: T.inkMuted,
            fontSize: "0.875rem",
          }}
        >
          Practical guides, model breakdowns, and founder strategies.
        </Typography>
      </motion.div>

      {/* RIGHT */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
      >
        <Box
          sx={{
            width: { xs: "100%", md: 420 },
            background: "#111116",
            border: `1px solid ${T.borderMid}`,
            borderRadius: "12px",
            p: "6px 6px 6px 16px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <TextField
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            variant="outlined"
            fullWidth
            sx={{
              "& fieldset": { border: "none" },
              "& input": {
                color: "#fff",
                fontSize: "0.9rem",
                "&::placeholder": {
                  color: "#77778E",
                },
              },
            }}
          />

          <motion.button
            onClick={handleSubscribe}
            style={{
              padding: "10px 22px",
              borderRadius: "8px",
              border: "none",
              background: T.blueGrad,
              color: "#fff",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Subscribe
          </motion.button>
        </Box>
      </motion.div>
    </Box>
  );
}

/* ══ FOOTER ════════════════════════════════════════════ */
export function Footer() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const inView = useInView(wrapRef, { once: true });

  return (
    <Box
      component="footer"
      ref={wrapRef}
      sx={{
        background: T.bg,
        color: T.ink,
        borderTop: `1px solid ${T.border}`,
      }}
    >
      <Container maxWidth="xl">
        <NewsletterStrip inView={inView} />

        {/* GRID */}
        <Box
          sx={{
            py: { xs: 7, md: 10 },
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1.6fr 1fr 1fr 1fr" },
            gap: { xs: 7, md: 4 },
          }}
        >
          {/* BRAND */}
          <Box>
            <Box sx={{ mb: 3 }}>
              {inView && <MerrakiLogo variant="color" animate />}
            </Box>

            <Typography
              sx={{
                fontSize: "0.875rem",
                color: T.inkMuted,
                maxWidth: 280,
                mb: 4,
              }}
            >
              We simplify finance so businesses amplify growth.
            </Typography>

            <Box sx={{ display: "flex", gap: 1 }}>
              {SOCIALS.map(({ Icon, href, label }) => (
                <IconButton
                  key={label}
                  component="a"
                  href={href}
                  target="_blank"
                  sx={{
                    background: "#14141B",
                    border: `1px solid ${T.border}`,
                    color: T.inkMuted,
                    "&:hover": {
                      color: T.blue,
                      background: T.bluePale,
                    },
                  }}
                >
                  <Icon />
                </IconButton>
              ))}
            </Box>
          </Box>

          {/* LINKS */}
          {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
            <Box key={heading}>
              <Typography
                sx={{
                  fontFamily: MONO,
                  fontSize: "0.6rem",
                  letterSpacing: "0.18em",
                  color: T.blue,
                  mb: 3,
                }}
              >
                {heading}
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {links.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    style={{ textDecoration: "none" }}
                  >
                    <Typography
                      sx={{
                        fontSize: "0.875rem",
                        color: T.inkMuted,
                        "&:hover": { color: T.blue },
                      }}
                    >
                      {link.label}
                    </Typography>
                  </Link>
                ))}
              </Box>
            </Box>
          ))}
        </Box>

        {/* BOTTOM */}
        <Box
          sx={{
            borderTop: `1px solid ${T.border}`,
            py: 4,
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Typography sx={{ fontSize: "0.75rem", color: T.inkFaint , textDecoration:"none"}}>
            © {new Date().getFullYear()} Merraki Solutions all rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}