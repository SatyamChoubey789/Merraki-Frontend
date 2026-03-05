"use client";

import {
  Box,
  Container,
  Typography,
  IconButton,
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

const T = {
  bg:         "#0A0A0F",
  bgSection:  "#121218",
  bgInput:    "#111116",
  ink:        "#FFFFFF",
  inkMid:     "#E4E4EB",
  inkMuted:   "#A1A1B5",
  inkFaint:   "#6E6E85",
  border:     "rgba(255,255,255,0.06)",
  borderMid:  "rgba(255,255,255,0.12)",
  blue:       "#4C8DFF",
  bluePale:   "rgba(76,141,255,0.12)",
  blueGrad:   "linear-gradient(135deg,#4C8DFF 0%,#8FB8FF 100%)",
};

const SERIF = '"Instrument Serif","Playfair Display",Georgia,serif';
const SANS  = '"DM Sans","Mona Sans",system-ui,sans-serif';
const MONO  = '"DM Mono","JetBrains Mono",ui-monospace,monospace';
const EASE  = [0.16, 1, 0.3, 1] as const;

const FOOTER_LINKS = {
  Services: [
    { label: "Financial Modelling",  href: "/book-consultation" },
    { label: "Excel Dashboards",     href: "/book-consultation" },
    { label: "Bookkeeping",          href: "/book-consultation" },
    { label: "Data Analysis",        href: "/book-consultation" },
    { label: "Founder Consulting",   href: "/book-consultation" },
  ],
  Resources: [
    { label: "Templates",        href: "/templates"      },
    { label: "Calculators",      href: "/calculators"    },
    { label: "Founder Test",     href: "/founder-test"   },
    { label: "Blog",             href: "/blog"           },
    { label: "Order Tracking",   href: "/order-tracking" },
  ],
  Company: [
    { label: "About Us",           href: "/about"             },
    { label: "Book Consultation",  href: "/book-consultation" },
    { label: "Privacy Policy",     href: "/privacy"           },
    { label: "Terms of Service",   href: "/terms"             },
    { label: "Refund Policy",      href: "/refunds"           },
  ],
};

const SOCIALS = [
  { Icon: LinkedInIcon,  href: "https://linkedin.com/company/merrakisolutions",  label: "LinkedIn"  },
  { Icon: TwitterIcon,   href: "https://twitter.com/merrakisolutions",           label: "Twitter"   },
  { Icon: InstagramIcon, href: "https://instagram.com/merrakisolutions",         label: "Instagram" },
];

/* ── Newsletter strip ── */
function NewsletterStrip({ inView }: { inView: boolean }) {
  const newsletterMutation = useNewsletterSubscribe();
  const [email, setEmail] = useState("");

  const handleSubscribe = () => {
    if (!email.trim()) return;
    newsletterMutation.mutate({ email }, { onSuccess: () => setEmail("") });
  };

  return (
    <Box sx={{
      py: { xs: 7, md: 9 },
      borderBottom: `1px solid ${T.border}`,
      display: "flex",
      justifyContent: "space-between",
      alignItems: { md: "center" },
      flexDirection: { xs: "column", md: "row" },
      gap: { xs: 5, md: 4 },
    }}>
      {/* Left — headline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.65, ease: EASE }}
      >
        <Typography sx={{
          fontFamily: SERIF, fontStyle: "italic",
          fontSize: { xs: "1.75rem", md: "2.25rem" },
          color: T.ink, mb: 0.5, lineHeight: 1.15,
        }}>
          Finance insights, straight
        </Typography>
        <Typography sx={{
          fontFamily: SERIF, fontStyle: "italic",
          fontSize: { xs: "1.75rem", md: "2.25rem" },
          lineHeight: 1.15,
          background: T.blueGrad,
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>
          to your inbox.
        </Typography>
        <Typography sx={{ mt: 1.5, color: T.inkMuted, fontSize: "0.875rem", fontFamily: SANS }}>
          Practical guides, model breakdowns, and founder strategies.
        </Typography>
      </motion.div>

      {/* Right — input row */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.65, delay: 0.1, ease: EASE }}
        style={{ flexShrink: 0 }}
      >
        <Box sx={{
          width: { xs: "100%", md: 420 },
          display: "flex",
          alignItems: "center",
          gap: 0,
          background: T.bgInput,
          border: `1px solid ${T.borderMid}`,
          borderRadius: "12px",
          overflow: "hidden",
          height: 50,
          "&:focus-within": {
            borderColor: "rgba(76,141,255,0.45)",
            boxShadow: "0 0 0 3px rgba(76,141,255,0.10)",
          },
          transition: "border-color 0.2s ease, box-shadow 0.2s ease",
        }}>
          {/* Email input */}
          <Box
            component="input"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            onKeyDown={(e: React.KeyboardEvent) => e.key === "Enter" && handleSubscribe()}
            placeholder="your@email.com"
            sx={{
              flex: 1,
              height: "100%",
              background: "transparent",
              border: "none",
              outline: "none",
              px: "16px",
              color: T.ink,
              fontFamily: SANS,
              fontSize: "0.875rem",
              "::placeholder": { color: T.inkFaint },
            }}
          />

          {/* Subscribe button */}
          <motion.button
            onClick={handleSubscribe}
            whileHover={{ filter: "brightness(1.08)" }}
            whileTap={{ scale: 0.97 }}
            style={{
              height: "100%",
              padding: "0 24px",
              border: "none",
              borderLeft: `1px solid rgba(255,255,255,0.08)`,
              background: T.blueGrad,
              color: "#fff",
              fontFamily: SANS,
              fontWeight: 700,
              fontSize: "0.875rem",
              cursor: "pointer",
              whiteSpace: "nowrap",
              letterSpacing: "-0.01em",
            }}
          >
            {newsletterMutation.isPending ? "..." : "Subscribe →"}
          </motion.button>
        </Box>

        {/* Success / error feedback */}
        {newsletterMutation.isSuccess && (
          <Typography sx={{ mt: 1.25, fontSize: "0.78rem", color: "#4ADE80", fontFamily: SANS }}>
            ✓ You're subscribed!
          </Typography>
        )}
        {newsletterMutation.isError && (
          <Typography sx={{ mt: 1.25, fontSize: "0.78rem", color: "#F87171", fontFamily: SANS }}>
            Something went wrong. Please try again.
          </Typography>
        )}
      </motion.div>
    </Box>
  );
}

/* ══ FOOTER ══════════════════════════════════════════════ */
export function Footer() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const inView  = useInView(wrapRef, { once: true, amount: 0.1 });

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

        {/* Main grid */}
        <Box sx={{
          py: { xs: 7, md: 10 },
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1.6fr 1fr 1fr 1fr" },
          gap: { xs: 6, md: 4 },
        }}>
          {/* Brand column */}
          <Box>
            <Box sx={{ mb: 3 }}>
              {inView && <MerrakiLogo variant="color" animate />}
            </Box>
            <Typography sx={{
              fontSize: "0.875rem", color: T.inkMuted,
              maxWidth: 280, mb: 4, fontFamily: SANS, lineHeight: 1.75,
            }}>
              We simplify finance so businesses amplify growth
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              {SOCIALS.map(({ Icon, href, label }) => (
                <IconButton
                  key={label}
                  component="a"
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  sx={{
                    width: 38, height: 38,
                    background: "#14141B",
                    border: `1px solid ${T.border}`,
                    color: T.inkMuted,
                    transition: "all 0.2s ease",
                    "&:hover": { color: T.blue, background: T.bluePale, borderColor: "rgba(76,141,255,0.28)" },
                  }}
                >
                  <Icon sx={{ fontSize: "1rem" }} />
                </IconButton>
              ))}
            </Box>
          </Box>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
            <Box key={heading}>
              <Typography sx={{
                fontFamily: MONO, fontSize: "0.58rem",
                letterSpacing: "0.18em", color: T.blue,
                textTransform: "uppercase", mb: 3,
              }}>
                {heading}
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.75 }}>
                {links.map((link) => (
                  <Link key={link.label} href={link.href} style={{ textDecoration: "none" }}>
                    <Typography sx={{
                      fontFamily: SANS, fontSize: "0.875rem",
                      color: T.inkMuted, lineHeight: 1,
                      transition: "color 0.18s ease",
                      "&:hover": { color: T.blue },
                    }}>
                      {link.label}
                    </Typography>
                  </Link>
                ))}
              </Box>
            </Box>
          ))}
        </Box>

        {/* Bottom bar */}
        <Box sx={{
          borderTop: `1px solid ${T.border}`,
          py: 3.5,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
        }}>
          <Typography sx={{ fontFamily: SANS, fontSize: "0.75rem", color: T.inkFaint }}>
            © {new Date().getFullYear()} Merraki Solutions. All rights reserved.
          </Typography>
          <Box sx={{ display: "flex", gap: 3 }}>
            {[{ label: "Privacy", href: "/privacy" }, { label: "Terms", href: "/terms" }, { label: "Refunds", href: "/refunds" }].map(l => (
              <Link key={l.label} href={l.href} style={{ textDecoration: "none" }}>
                <Typography sx={{ fontFamily: SANS, fontSize: "0.75rem", color: T.inkFaint, "&:hover": { color: T.blue }, transition: "color 0.18s ease" }}>
                  {l.label}
                </Typography>
              </Link>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}