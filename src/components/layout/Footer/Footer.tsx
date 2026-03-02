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

/* ══ TOKENS — warm luxury (matches site palette) ═════════ */
const T = {
  bg:        "#0C0B08",   // near-black with warm undertone
  bgCard:    "#141210",
  bgLine:    "rgba(255,255,255,0.055)",
  ink:       "#FAFAF7",
  inkMid:    "#C8C4BB",
  inkMuted:  "#8A877E",
  inkFaint:  "#5A5750",
  border:    "rgba(255,255,255,0.07)",
  borderMid: "rgba(255,255,255,0.12)",
  gold:      "#B8922A",
  goldMid:   "#C9A84C",
  goldLight: "#DDB96A",
  goldPale:  "#F0D898",
  goldGlow:  "rgba(184,146,42,0.12)",
  goldDim:   "rgba(184,146,42,0.07)",
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

/* ══ GOLD RULE ═══════════════════════════════════════════ */
function GoldRule({ width = 28, delay = 0, inView = false }: { width?: number; delay?: number; inView?: boolean }) {
  return (
    <motion.div
      initial={{ scaleX: 0 }}
      animate={inView ? { scaleX: 1 } : {}}
      transition={{ duration: 0.55, delay, ease: EASE }}
      style={{ transformOrigin: "left" }}
    >
      <Box sx={{ width, height: 1, background: `linear-gradient(90deg,${T.gold},${T.goldLight})` }} />
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
      {/* Glow bloom behind newsletter */}
      <Box sx={{
        position: "absolute", width: 500, height: 300, top: "50%", left: "50%",
        transform: "translate(-50%,-50%)", borderRadius: "50%",
        background: `radial-gradient(ellipse, ${T.goldDim} 0%, transparent 70%)`,
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
          <GoldRule width={22} delay={0.1} inView={inView} />
          <Typography sx={{ fontFamily: MONO, fontSize: "0.52rem", letterSpacing: "0.22em", color: T.goldMid, textTransform: "uppercase" }}>
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
              background: `linear-gradient(110deg,${T.goldLight},${T.gold})`,
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

      {/* Right — bespoke input */}
      <motion.div
        initial={{ opacity: 0, x: 24 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
        style={{ position: "relative", zIndex: 1 }}
      >
        <Box sx={{
          width: { xs: "100%", md: 400 },
          background: "rgba(255,255,255,0.04)",
          border: `1px solid ${T.borderMid}`,
          borderRadius: "14px",
          p: "6px 6px 6px 18px",
          display: "flex", gap: 1, alignItems: "center",
          backdropFilter: "blur(10px)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
          transition: "border-color 0.25s ease",
          "&:focus-within": { borderColor: `rgba(184,146,42,0.45)` },
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
                ? "rgba(45,122,78,0.25)"
                : `linear-gradient(135deg, ${T.gold}, ${T.goldLight})`,
              color: newsletterMutation.isSuccess ? "#5EBF8A" : "#0C0B08",
              fontFamily: SANS,
              fontWeight: 700,
              fontSize: "0.82rem",
              letterSpacing: "0.01em",
              whiteSpace: "nowrap",
              boxShadow: newsletterMutation.isSuccess ? "none" : `0 4px 18px rgba(184,146,42,0.35)`,
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
          "&:hover": { color: T.goldLight },
          "&:hover .arrow": { opacity: 1, transform: "translateX(3px)" },
        }}>
          {label}
          <span
            className="arrow"
            style={{
              fontSize: "0.6rem",
              opacity: 0,
              transition: "opacity 0.2s ease, transform 0.2s ease",
              color: T.goldMid,
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
      {/* ── Large ambient glow ── */}
      <Box sx={{
        position: "absolute", width: "80vw", height: "60vw",
        top: "-20vw", left: "10vw", borderRadius: "50%",
        background: `radial-gradient(ellipse, ${T.goldDim} 0%, transparent 65%)`,
        pointerEvents: "none",
      }} />

      {/* Warm grid */}
      <Box sx={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: `linear-gradient(${T.border} 1px,transparent 1px),linear-gradient(90deg,${T.border} 1px,transparent 1px)`,
        backgroundSize: "72px 72px", opacity: 0.5,
      }} />

      {/* Grain */}
      <Box sx={{
        position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.04,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: "180px",
      }} />

      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1 }}>

        {/* ── Newsletter ── */}
        <NewsletterStrip inView={inView} />

        {/* ── Main grid ── */}
        <Box sx={{ py: { xs: 7, md: 10 }, display: "grid", gridTemplateColumns: { xs: "1fr", md: "1.6fr 1fr 1fr 1fr" }, gap: { xs: 7, md: 4 } }}>

          {/* Brand column */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, ease: EASE }}
          >
            <Box sx={{ mb: 3 }}>
              {inView && <MerrakiLogo variant="white" animate />}
            </Box>

            <Typography sx={{ fontFamily: SANS, fontSize: "0.875rem", color: T.inkMuted, lineHeight: 1.85, mb: 4, maxWidth: 280 }}>
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
                      background: "rgba(255,255,255,0.05)",
                      border: `1px solid ${T.border}`,
                      transition: "all 0.22s ease",
                      "&:hover": {
                        color: T.goldLight,
                        background: T.goldDim,
                        borderColor: `rgba(184,146,42,0.3)`,
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
              {/* Column heading */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, mb: 3.5 }}>
                <Box sx={{ width: 16, height: 1, background: `linear-gradient(90deg,${T.gold},${T.goldLight})`, flexShrink: 0 }} />
                <Typography sx={{ fontFamily: MONO, fontSize: "0.5rem", letterSpacing: "0.18em", color: T.goldMid, textTransform: "uppercase" }}>
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
          {/* Left — copy + location */}
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

          {/* Right — legal links */}
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
                    "&:hover": { color: T.goldLight },
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