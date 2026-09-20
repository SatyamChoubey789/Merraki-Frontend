"use client";

import { Box, Container, Typography, IconButton } from "@mui/material";
import {
  LinkedIn as LinkedInIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
} from "@mui/icons-material";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { useRef, useState } from "react";
import { MerrakiTextLogoAnimated } from "@/components/ui/Merrakitextlogo";
import { subscribeToNewsletter } from "@/lib/api/newsletter";

/* ── Dark footer tokens ── */
const D = {
  bg: "#0A0A0F",
  bgSection: "#121218",
  ink: "#FFFFFF",
  inkMid: "#E4E4EB",
  inkMuted: "#A1A1B5",
  inkFaint: "#6E6E85",
  border: "rgba(255,255,255,0.06)",
  blue: "#4C8DFF",
  bluePale: "rgba(76,141,255,0.12)",
  blueGrad: "linear-gradient(135deg, #4C8DFF 0%, #8FB8FF 100%)",
};

const W = {
  bg: "#FFFFFF",
  bgSection: "#F5F7FB",
  ink: "#0A0A0F",
  inkMid: "#3A3A52",
  inkMuted: "#5A5A72",
  inkFaint: "#9898AE",
  border: "rgba(10,10,20,0.08)",
  borderMid: "rgba(10,10,20,0.14)",
  blue: "#3B7BF6",
  blueLight: "#7AABFF",
  bluePale: "#EDF3FF",
  blueGlow: "rgba(59,123,246,0.18)",
  blueDim: "rgba(59,123,246,0.06)",
  blueGrad: "linear-gradient(135deg, #3B7BF6 0%, #7AABFF 100%)",
};

const SANS = '"DM Sans","Mona Sans",system-ui,sans-serif';
const MONO = '"DM Mono","JetBrains Mono",ui-monospace,monospace';
const EASE = [0.16, 1, 0.3, 1] as const;

const FOOTER_LINKS = {
  Services: [
    { label: "Financial Modelling", href: "/Financial-Modelling" },
    { label: "Valuation", href: "/Valuation" },
    { label: "Pitch Decks", href: "/PitchDeck" },
    { label: "Data Analysis & Visualization", href: "/DataAnalysis" },
    { label: "Templates & Calculators", href: "/TemplatesCalculators" },
    { label: "Virtual CFO", href: "/VirtualCFO" },
  ],
  Resources: [
    { label: "Templates", href: "/templates" },
    { label: "Calculators", href: "/calculators" },
    { label: "Founder Test", href: "/founder-test" },
    { label: "Blogs", href: "/blog" },
    { label: "Order Tracking", href: "/order-tracking" },
  ],
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Contact Us", href: "/book-consultation" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Refund Policy", href: "/refunds" },
  ],
};

const SOCIALS = [
  {
    Icon: LinkedInIcon,
    href: "https://linkedin.com/company/merraki-solutions/",
    label: "LinkedIn",
  },
  {
    Icon: TwitterIcon,
    href: "https://twitter.com/Merraki1431",
    label: "Twitter",
  },
  {
    Icon: InstagramIcon,
    href: "https://instagram.com/merrakisolutions",
    label: "Instagram",
  },
];

/* ══ NEWSLETTER ══════════════════════════════════════════════════════════════ */

type SubscribeState = "idle" | "loading" | "success" | "error";

function NewsletterStrip({ inView }: { inView: boolean }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<SubscribeState>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const isValidEmail = (v: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

  const handleSubscribe = async () => {
    // Basic client-side email check before hitting backend
    if (!email.trim()) {
      setState("error");
      setErrorMsg("Please enter your email address.");
      return;
    }
    if (!isValidEmail(email)) {
      setState("error");
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    setState("loading");
    setErrorMsg("");

    try {
      await subscribeToNewsletter({ email: email.trim() });
      setEmail("");
      setState("success");
    } catch (err) {
      setState("error");
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSubscribe();
  };

  const isLoading = state === "loading";

  return (
    <Box
      sx={{
        background: W.bg,
        borderBottom: `1px solid ${W.border}`,
        py: { xs: 8, md: 10 },
      }}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: { md: "center" },
            flexDirection: { xs: "column", md: "row" },
            gap: { xs: 6, md: 8 },
          }}
        >
          {/* Left — headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <Typography
              sx={{
                fontFamily: SANS,
                fontWeight: 800,
                fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
                color: W.ink,
                letterSpacing: "-0.035em",
                lineHeight: 1.05,
                mb: 0.5,
              }}
            >
              Finance insights
            </Typography>
            <Typography
              sx={{
                fontFamily: SANS,
                fontWeight: 300,
                fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
                letterSpacing: "-0.035em",
                lineHeight: 1.05,
                mb: 2,
                background: "#253957",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              straight to your inbox
            </Typography>
            <Typography
              sx={{
                fontFamily: SANS,
                fontWeight: 400,
                fontSize: "0.9375rem",
                color: W.inkMuted,
                lineHeight: 1.7,
                maxWidth: 400,
              }}
            >
              Practical guides, model breakdowns, and founder strategies
              delivered weekly
            </Typography>
          </motion.div>

          {/* Right — input */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.12, ease: EASE }}
            style={{ flexShrink: 0 }}
          >
            <Box sx={{ width: { xs: "100%", md: 440 } }}>
              {/* Success state */}
              {state === "success" ? (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: EASE }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 2,
                      p: "18px 20px",
                      borderRadius: "12px",
                      background: "#F0FDF4",
                      border: "1.5px solid #BBF7D0",
                    }}
                  >
                    <Typography sx={{ fontSize: "1.25rem", lineHeight: 1 }}>
                      ✅
                    </Typography>
                    <Box>
                      <Typography
                        sx={{
                          fontFamily: SANS,
                          fontWeight: 700,
                          fontSize: "0.9375rem",
                          color: "#14532D",
                          mb: 0.25,
                        }}
                      >
                        Check your inbox!
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: SANS,
                          fontSize: "0.8125rem",
                          color: "#166534",
                          lineHeight: 1.55,
                        }}
                      >
                        We sent a confirmation email. Click the link to complete
                        your subscription.
                      </Typography>
                    </Box>
                  </Box>
                </motion.div>
              ) : (
                <>
                  {/* Input + button row */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "stretch",
                      border: `1.5px solid ${
                        state === "error" ? "#FECACA" : W.borderMid
                      }`,
                      borderRadius: "12px",
                      overflow: "hidden",
                      height: 54,
                      background: W.bg,
                      transition: "border-color 0.2s, box-shadow 0.2s",
                      "&:focus-within": {
                        borderColor: state === "error" ? "#FECACA" : W.blue,
                        boxShadow: `0 0 0 3px ${
                          state === "error" ? "rgba(239,68,68,0.08)" : W.blueDim
                        }`,
                      },
                    }}
                  >
                    <Box
                      component="input"
                      value={email}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setEmail(e.target.value);
                        // Clear error when user starts typing again
                        if (state === "error") {
                          setState("idle");
                          setErrorMsg("");
                        }
                      }}
                      onKeyDown={handleKeyDown}
                      placeholder="your@email.com"
                      disabled={isLoading}
                      sx={{
                        flex: 1,
                        height: "100%",
                        background: "transparent",
                        border: "none",
                        outline: "none",
                        px: "18px",
                        color: W.ink,
                        fontFamily: SANS,
                        fontSize: "0.9375rem",
                        opacity: isLoading ? 0.6 : 1,
                        "::placeholder": { color: W.inkFaint },
                      }}
                    />
                    <motion.button
                      onClick={handleSubscribe}
                      whileHover={
                        !isLoading ? { filter: "brightness(1.08)" } : {}
                      }
                      whileTap={!isLoading ? { scale: 0.97 } : {}}
                      disabled={isLoading}
                      style={{
                        flexShrink: 0,
                        height: "100%",
                        padding: "0 26px",
                        border: "none",
                        background: isLoading ? "#6B7B8E" : "#253957",
                        color: "#FFFFFF",
                        fontFamily: SANS,
                        fontWeight: 700,
                        fontSize: "0.9rem",
                        letterSpacing: "-0.01em",
                        cursor: isLoading ? "not-allowed" : "pointer",
                        whiteSpace: "nowrap",
                        boxShadow: isLoading
                          ? "none"
                          : `0 4px 18px ${W.blueGlow}`,
                        transition: "background 0.2s",
                        minWidth: 110,
                      }}
                    >
                      {isLoading ? "Sending..." : "Subscribe"}
                    </motion.button>
                  </Box>

                  {/* Error message — conditional */}
                  {state === "error" && errorMsg && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Typography
                        sx={{
                          fontFamily: SANS,
                          fontSize: "0.8125rem",
                          color: "#DC2626",
                          mt: 1,
                          pl: 0.5,
                        }}
                      >
                        {errorMsg}
                      </Typography>
                    </motion.div>
                  )}

                  {/* Privacy note */}
                  <Typography
                    sx={{
                      fontFamily: SANS,
                      fontSize: "0.75rem",
                      color: W.inkFaint,
                      mt: 1.25,
                      pl: 0.5,
                    }}
                  >
                    No spam. Unsubscribe anytime.
                  </Typography>
                </>
              )}
            </Box>
          </motion.div>
        </Box>
      </Container>
    </Box>
  );
}

/* ══ FOOTER ══════════════════════════════════════════════════════════════════ */

export function Footer() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const inView = useInView(wrapRef, { once: true, amount: 0.05 });

  return (
    <Box component="footer" ref={wrapRef} sx={{ color: D.ink }}>
      {/* ── White newsletter band ── */}
      <NewsletterStrip inView={inView} />

      {/* ── Black footer body ── */}
      <Box sx={{ background: D.bg }}>
        <Container maxWidth="xl">
          {/* Main grid */}
          <Box
            sx={{
              pt: { xs: 8, md: 11 },
              pb: { xs: 6, md: 8 },
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr",
                md: "1.6fr 1fr 1fr 1fr",
              },
              gap: { xs: 6, md: 4 },
            }}
          >
            {/* Brand */}
            <Box>
              <Box sx={{ mb: 3 }}>
                {inView && (
                  <MerrakiTextLogoAnimated
                    variant="white"
                    size="xl"
                    animate={true}
                  />
                )}
              </Box>
              <Typography
                sx={{
                  fontSize: "0.875rem",
                  color: D.inkMuted,
                  maxWidth: 280,
                  mb: 4,
                  fontFamily: SANS,
                  lineHeight: 1.75,
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
                    rel="noopener noreferrer"
                    aria-label={label}
                    sx={{
                      width: 38,
                      height: 38,
                      background: "#14141B",
                      border: `1px solid ${D.border}`,
                      color: D.inkMuted,
                      transition: "all 0.2s ease",
                      "&:hover": {
                        color: D.blue,
                        background: D.bluePale,
                        borderColor: "rgba(76,141,255,0.28)",
                      },
                    }}
                  >
                    <Icon sx={{ fontSize: "1rem" }} />
                  </IconButton>
                ))}
              </Box>
            </Box>

            {/* Link columns */}
            {Object.entries(FOOTER_LINKS).map(([heading, links], i) => (
              <motion.div
                key={heading}
                initial={{ opacity: 0, y: 14 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  delay: 0.1 + i * 0.08,
                  duration: 0.5,
                  ease: EASE,
                }}
              >
                <Typography
                  sx={{
                    fontFamily: MONO,
                    fontSize: "0.55rem",
                    letterSpacing: "0.18em",
                    color: D.blue,
                    textTransform: "uppercase",
                    mb: 3,
                  }}
                >
                  {heading}
                </Typography>
                <Box
                  sx={{ display: "flex", flexDirection: "column", gap: 1.625 }}
                >
                  {links.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      style={{ textDecoration: "none" }}
                    >
                      <Typography
                        sx={{
                          fontFamily: SANS,
                          fontSize: "0.875rem",
                          color: D.inkMuted,
                          lineHeight: 1,
                          transition: "color 0.18s ease",
                          "&:hover": { color: D.ink },
                        }}
                      >
                        {link.label}
                      </Typography>
                    </Link>
                  ))}
                </Box>
              </motion.div>
            ))}
          </Box>

          {/* Bottom bar */}
          <Box
            sx={{
              borderTop: `1px solid ${D.border}`,
              py: 3.5,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Typography
              sx={{ fontFamily: SANS, fontSize: "0.75rem", color: D.inkFaint }}
            >
              © {new Date().getFullYear()} Merraki Solutions. All rights
              reserved.
            </Typography>
            <Box sx={{ display: "flex", gap: 3 }}>
              {[
                { label: "Privacy", href: "/privacy" },
                { label: "Terms", href: "/terms" },
                { label: "Refunds", href: "/refunds" },
              ].map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  style={{ textDecoration: "none" }}
                >
                  <Typography
                    sx={{
                      fontFamily: SANS,
                      fontSize: "0.75rem",
                      color: D.inkFaint,
                      "&:hover": { color: D.blue },
                      transition: "color 0.18s ease",
                    }}
                  >
                    {l.label}
                  </Typography>
                </Link>
              ))}
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
