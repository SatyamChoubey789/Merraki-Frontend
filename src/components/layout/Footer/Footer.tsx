"use client";

import {
  Box, Container, Typography, IconButton, TextField,
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

/* ══ TOKENS — pure white + black ink + ice-blue accent ═══ */
const T = {
  bg:        "#FFFFFF",
  bgSection: "#F5F7FB",
  ink:       "#0A0A0F",
  inkMid:    "#1E1E2A",
  inkMuted:  "#5A5A72",
  inkFaint:  "#9898AE",
  border:    "rgba(10,10,20,0.08)",
  borderMid: "rgba(10,10,20,0.14)",

  // ice-blue accent
  blue:      "#3B7BF6",
  blueMid:   "#5A92F8",
  blueLight: "#7AABFF",
  bluePale:  "#EDF3FF",
  blueGlow:  "rgba(59,123,246,0.10)",
  blueDim:   "rgba(59,123,246,0.06)",
  blueGrad:  "linear-gradient(135deg, #3B7BF6 0%, #7AABFF 100%)",
};

const SERIF = '"Instrument Serif","Playfair Display",Georgia,serif';
const SANS  = '"DM Sans","Mona Sans",system-ui,sans-serif';
const MONO  = '"DM Mono","JetBrains Mono",ui-monospace,monospace';
const EASE  = [0.16, 1, 0.3, 1] as const;

/* ══ NAV DATA ════════════════════════════════════════════ */
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
  { Icon: LinkedInIcon,  href: "https://linkedin.com/company/merrakisolutions",  label: "LinkedIn"  },
  { Icon: TwitterIcon,   href: "https://twitter.com/merrakisolutions",           label: "Twitter"   },
  { Icon: InstagramIcon, href: "https://instagram.com/merrakisolutions",         label: "Instagram" },
];

/* ══ BLUE RULE ═══════════════════════════════════════════ */
function BlueRule({ width = 28, delay = 0, inView = false }: { width?: number; delay?: number; inView?: boolean }) {
  return (
    <motion.div
      initial={{ scaleX: 0 }}
      animate={inView ? { scaleX: 1 } : {}}
      transition={{ duration: 0.55, delay, ease: EASE }}
      style={{ transformOrigin: "left" }}
    >
      <Box sx={{ width, height: 1.5, background: T.blueGrad, borderRadius: 1 }} />
    </motion.div>
  );
}

/* ══ NEWSLETTER STRIP ════════════════════════════════════ */
function NewsletterStrip({ inView }: { inView: boolean }) {
  const newsletterMutation = useNewsletterSubscribe();
  const [email, setEmail] = useState("");

  const handleSubscribe = () => {
    if (!email) return;
    newsletterMutation.mutate({ email }, { onSuccess: () => setEmail("") });
  };

  return (
    <Box sx={{
      py: { xs: 7, md: 9 },
      borderBottom: `1px solid ${T.border}`,
      display: "flex",
      alignItems: { md: "center" },
      justifyContent: "space-between",
      flexDirection: { xs: "column", md: "row" },
      gap: { xs: 5, md: 0 },
      position: "relative",
    }}>
      {/* Blue glow bloom */}
      <Box sx={{
        position: "absolute", width: 600, height: 320, top: "50%", left: "50%",
        transform: "translate(-50%,-50%)", borderRadius: "50%",
        background: `radial-gradient(ellipse, ${T.blueDim} 0%, transparent 70%)`,
        pointerEvents: "none",
      }} />

      {/* Left */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.65, ease: EASE }}
        style={{ position: "relative", zIndex: 1 }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
          <BlueRule width={22} delay={0.1} inView={inView} />
          <Typography sx={{ fontFamily: MONO, fontSize: "0.52rem", letterSpacing: "0.22em", color: T.blue, textTransform: "uppercase" }}>
            Newsletter
          </Typography>
        </Box>
        <Box sx={{ overflow: "hidden", mb: 0.5 }}>
          <motion.div
            initial={{ y: "110%" }}
            animate={inView ? { y: "0%" } : {}}
            transition={{ duration: 0.7, delay: 0.08, ease: EASE }}
          >
            <Typography sx={{
              fontFamily: SERIF, fontStyle: "italic", fontWeight: 400,
              fontSize: { xs: "1.75rem", md: "2.25rem" },
              color: T.ink, letterSpacing: "-0.025em", lineHeight: 1.1,
            }}>
              Finance insights, straight
            </Typography>
          </motion.div>
        </Box>
        <Box sx={{ overflow: "hidden", mb: 1.5 }}>
          <motion.div
            initial={{ y: "110%" }}
            animate={inView ? { y: "0%" } : {}}
            transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
          >
            <Typography sx={{
              fontFamily: SERIF, fontStyle: "italic", fontWeight: 400,
              fontSize: { xs: "1.75rem", md: "2.25rem" },
              letterSpacing: "-0.025em", lineHeight: 1.1,
              background: T.blueGrad,
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}>
              to your inbox.
            </Typography>
          </motion.div>
        </Box>
        <Typography sx={{ fontFamily: SANS, fontSize: "0.875rem", color: T.inkMuted, lineHeight: 1.75 }}>
          Practical guides, model breakdowns, and founder strategies —{" "}
          <br />no fluff, no spam.
        </Typography>
      </motion.div>

      {/* Right — input */}
      <motion.div
        initial={{ opacity: 0, x: 24 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
        style={{ position: "relative", zIndex: 1 }}
      >
        <Box sx={{
          width: { xs: "100%", md: 420 },
          background: "#FFFFFF",
          border: `1.5px solid ${T.borderMid}`,
          borderRadius: "14px",
          p: "6px 6px 6px 18px",
          display: "flex", gap: 1, alignItems: "center",
          boxShadow: "0 2px 20px rgba(0,0,0,0.05)",
          transition: "border-color 0.25s ease, box-shadow 0.25s ease",
          "&:focus-within": {
            borderColor: T.blue,
            boxShadow: `0 0 0 4px ${T.blueDim}, 0 2px 20px rgba(0,0,0,0.05)`,
          },
        }}>
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
                fontFamily: SANS, fontSize: "0.875rem", color: T.ink,
                "&::placeholder": { color: T.inkFaint, opacity: 1 },
              },
            }}
          />
          <motion.button
            onClick={handleSubscribe}
            disabled={newsletterMutation.isPending || newsletterMutation.isSuccess}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            style={{
              padding: "10px 22px",
              borderRadius: "10px",
              border: "none",
              cursor: newsletterMutation.isSuccess ? "default" : "pointer",
              background: newsletterMutation.isSuccess
                ? "rgba(34,197,94,0.10)"
                : T.blueGrad,
              color: newsletterMutation.isSuccess ? "#16A34A" : "#FFFFFF",
              fontFamily: SANS,
              fontWeight: 700,
              fontSize: "0.82rem",
              letterSpacing: "0.01em",
              whiteSpace: "nowrap",
              boxShadow: newsletterMutation.isSuccess ? "none" : `0 4px 18px rgba(59,123,246,0.35)`,
              transition: "all 0.2s ease",
            }}
          >
            {newsletterMutation.isSuccess ? "✓ Subscribed" : "Subscribe →"}
          </motion.button>
        </Box>
        <Typography sx={{ fontFamily: MONO, fontSize: "0.48rem", color: T.inkFaint, letterSpacing: "0.12em", mt: 1.5, textTransform: "uppercase" }}>
          Join 1,200+ founders · Unsubscribe anytime
        </Typography>
      </motion.div>
    </Box>
  );
}

/* ══ FOOTER LINK ═════════════════════════════════════════ */
function FooterLink({ label, href, delay = 0, inView = false }: {
  label: string; href: string; delay?: number; inView?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.4, delay, ease: EASE }}
    >
      <Link href={href} style={{ textDecoration: "none" }}>
        <Typography sx={{
          fontFamily: SANS,
          fontSize: "0.875rem",
          color: T.inkMuted,
          lineHeight: 1,
          display: "inline-flex", alignItems: "center", gap: 0.75,
          transition: "color 0.2s ease",
          "&:hover": { color: T.blue },
          "&:hover .arrow": { opacity: 1, transform: "translateX(3px)" },
        }}>
          {label}
          <span
            className="arrow"
            style={{
              fontSize: "0.6rem",
              opacity: 0,
              transition: "opacity 0.2s ease, transform 0.2s ease",
              color: T.blue,
            }}
          >→</span>
        </Typography>
      </Link>
    </motion.div>
  );
}

/* ══ MAIN FOOTER ═════════════════════════════════════════ */
export function Footer() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const inView  = useInView(wrapRef, { once: true, amount: 0.1 });

  return (
    <Box
      component="footer"
      ref={wrapRef}
      sx={{
        background: T.bg,
        fontFamily: SANS,
        position: "relative",
        overflow: "hidden",
        borderTop: `1px solid ${T.border}`,
      }}
    >
      {/* Subtle blue ambient at top */}
      <Box sx={{
        position: "absolute", width: "70vw", height: "35vw",
        top: "-8vw", left: "15vw", borderRadius: "50%",
        background: `radial-gradient(ellipse, ${T.blueDim} 0%, transparent 65%)`,
        pointerEvents: "none",
      }} />

      {/* Dot grid */}
      <Box sx={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: `radial-gradient(circle, rgba(10,10,20,0.055) 1px, transparent 1px)`,
        backgroundSize: "28px 28px",
      }} />

      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1 }}>

        {/* ── Newsletter ── */}
        <NewsletterStrip inView={inView} />

        {/* ── Main grid ── */}
        <Box sx={{
          py: { xs: 7, md: 10 },
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1.6fr 1fr 1fr 1fr" },
          gap: { xs: 7, md: 4 },
        }}>

          {/* Brand column */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, ease: EASE }}
          >
            <Box sx={{ mb: 3 }}>
              {inView && <MerrakiLogo variant="color" animate />}
            </Box>

            <Typography sx={{
              fontFamily: SANS, fontSize: "0.875rem", color: T.inkMuted,
              lineHeight: 1.85, mb: 4, maxWidth: 280,
            }}>
              We simplify finance so businesses amplify growth. Financial modelling, dashboards, and strategic CFO consulting for Indian founders.
            </Typography>

            {/* Socials */}
            <Box sx={{ display: "flex", gap: 1 }}>
              {SOCIALS.map(({ Icon, href, label }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.3 + i * 0.08, type: "spring", stiffness: 360, damping: 20 }}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.92 }}
                >
                  <IconButton
                    component="a"
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    size="small"
                    sx={{
                      width: 36, height: 36, borderRadius: "10px",
                      color: T.inkMuted,
                      background: T.bgSection,
                      border: `1px solid ${T.border}`,
                      transition: "all 0.22s ease",
                      "&:hover": {
                        color: T.blue,
                        background: T.bluePale,
                        borderColor: `rgba(59,123,246,0.3)`,
                      },
                    }}
                  >
                    <Icon sx={{ fontSize: "0.95rem" }} />
                  </IconButton>
                </motion.div>
              ))}
            </Box>
          </motion.div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([heading, links], colIdx) => (
            <motion.div
              key={heading}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + colIdx * 0.08, duration: 0.55, ease: EASE }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, mb: 3.5 }}>
                <Box sx={{ width: 16, height: 1.5, background: T.blueGrad, flexShrink: 0, borderRadius: 1 }} />
                <Typography sx={{ fontFamily: MONO, fontSize: "0.5rem", letterSpacing: "0.18em", color: T.blue, textTransform: "uppercase" }}>
                  {heading}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2.25 }}>
                {links.map((link, li) => (
                  <FooterLink
                    key={link.label}
                    {...link}
                    delay={0.18 + colIdx * 0.07 + li * 0.04}
                    inView={inView}
                  />
                ))}
              </Box>
            </motion.div>
          ))}
        </Box>

        {/* ── Bottom bar ── */}
        <Box sx={{
          borderTop: `1px solid ${T.border}`,
          py: { xs: 3.5, md: 4 },
          display: "flex", alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap", gap: 2,
        }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Typography sx={{ fontFamily: MONO, fontSize: "0.5rem", letterSpacing: "0.12em", color: T.inkFaint, textTransform: "uppercase" }}>
                © {new Date().getFullYear()} Merraki Solutions
              </Typography>
              <Box sx={{ width: 3, height: 3, borderRadius: "50%", background: T.inkFaint }} />
              <Typography sx={{ fontFamily: MONO, fontSize: "0.5rem", letterSpacing: "0.12em", color: T.inkFaint, textTransform: "uppercase" }}>
                Mumbai, India
              </Typography>
              <Box sx={{ width: 3, height: 3, borderRadius: "50%", background: T.inkFaint }} />
              <Typography sx={{ fontFamily: MONO, fontSize: "0.5rem", letterSpacing: "0.12em", color: T.inkFaint, textTransform: "uppercase" }}>
                Since 2021
              </Typography>
            </Box>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.65, duration: 0.5 }}
          >
            <Box sx={{ display: "flex", gap: 3.5, alignItems: "center" }}>
              {[
                { label: "Privacy", href: "/privacy" },
                { label: "Terms",   href: "/terms"   },
                { label: "Refunds", href: "/refunds" },
              ].map((item) => (
                <Link key={item.label} href={item.href} style={{ textDecoration: "none" }}>
                  <Typography sx={{
                    fontFamily: SANS, fontSize: "0.75rem",
                    color: T.inkFaint,
                    transition: "color 0.2s ease",
                    "&:hover": { color: T.blue },
                  }}>
                    {item.label}
                  </Typography>
                </Link>
              ))}
            </Box>
          </motion.div>
        </Box>
      </Container>
    </Box>
  );
}