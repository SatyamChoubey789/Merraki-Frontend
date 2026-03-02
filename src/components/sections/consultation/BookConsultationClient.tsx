"use client";

import { useState, useRef, useEffect } from "react";
import { Box, Container, Typography } from "@mui/material";
import {
  CheckCircle as CheckIcon,
  CalendarMonth as CalIcon,
  ArrowForward as ArrowIcon,
  LinkedIn as LinkedInIcon,
} from "@mui/icons-material";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
} from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useContact } from "@/lib/hooks/useContact";
import {
  contactSchema,
  type ContactFormValues,
} from "@/lib/schemas/contact.schema";

/* ══════════════════════════════════════════════════════════════════════
   TOKENS — warm white / ink / gold. No dark blues.
══════════════════════════════════════════════════════════════════════ */
const T = {
  white: "#FFFFFF",
  offwhite: "#F9F8F5",
  cream: "#F0EDE6",
  parchment: "#E8E4DA",
  ink: "#0C0E12",
  inkMid: "#2E3440",
  inkMuted: "#64748B",
  inkFaint: "#94A3B8",
  inkGhost: "#CBD5E1",
  border: "#E2DED5",
  borderMd: "#C8C3B8",
  gold: "#B8922A",
  goldMid: "#C9A84C",
  goldLight: "#DDB96A",
  goldGlow: "rgba(184,146,42,0.08)",
  goldBdr: "rgba(184,146,42,0.20)",
  sage: "#5C7A5C",
  sageLight: "rgba(92,122,92,0.08)",
};

const FONT_SERIF = '"Instrument Serif", "Playfair Display", Georgia, serif';
const FONT_SANS = '"DM Sans", "Mona Sans", system-ui, sans-serif';
const FONT_MONO = '"DM Mono", "JetBrains Mono", ui-monospace, monospace';
const EASE = [0.16, 1, 0.3, 1] as const;

/* ── Data ────────────────────────────────────────────────────────────── */
const OUTCOMES = [
  {
    glyph: "01",
    title: "A clear diagnosis",
    body: "We'll pinpoint exactly which financial lever — pricing, burn, or margins — is holding your growth back.",
  },
  {
    glyph: "02",
    title: "Your 90-day roadmap",
    body: "Leave with a concrete, prioritised action plan you can hand to a CFO or execute yourself.",
  },
  {
    glyph: "03",
    title: "Model recommendations",
    body: "We'll tell you precisely which templates or models would give you the most leverage — no upsell pressure.",
  },
  {
    glyph: "04",
    title: "An honest conversation",
    body: "We only take on clients when we know we can move the needle. This session is about fit, not sales.",
  },
];

const SERVICE_OPTIONS = [
  { value: "consultation", label: "Founder Consultation" },
  { value: "modelling", label: "Financial Modelling" },
  { value: "templates", label: "Custom Templates" },
  { value: "other", label: "Other / Not Sure Yet" },
];

const FOUNDERS = [
  {
    name: "Parag Bhutani",
    role: "Co-Founder",
    tagline: "Financial modelling & Excel expert",
    initials: "PB",
    accent: "#B8922A",
    linkedin: "https://www.linkedin.com/in/parag-bhutani-83a980198/",
  },
  {
    name: "Khyati Gupta",
    role: "Co-Founder",
    tagline: "Power BI & forecasting systems",
    initials: "KG",
    accent: "#8B6F3E",
    linkedin: "https://www.linkedin.com/in/khyati-gupta14/",
  },
];

const SOCIAL_PROOF = [
  { val: "300+", label: "Founders advised" },
  { val: "₹50Cr+", label: "Revenue modelled" },
  { val: "24 hrs", label: "Response time" },
  { val: "Free", label: "No obligation" },
];

/* ── Custom field component ─────────────────────────────────────────── */
function Field({
  label,
  error,
  children,
  required,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.75 }}>
        <Typography
          sx={{
            fontFamily: FONT_SANS,
            fontWeight: 500,
            fontSize: "0.8125rem",
            color: T.inkMid,
            letterSpacing: "-0.01em",
          }}
        >
          {label}
        </Typography>
        {required && (
          <Typography
            sx={{ fontFamily: FONT_MONO, fontSize: "0.6rem", color: T.goldMid }}
          >
            *
          </Typography>
        )}
      </Box>
      {children}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -4, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Typography
              sx={{
                fontFamily: FONT_SANS,
                fontSize: "0.72rem",
                color: "#DC2626",
                mt: 0.5,
              }}
            >
              {error}
            </Typography>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
}

/* Input styling shared */
const inputSx = (hasError?: boolean) => ({
  width: "100%",
  fontFamily: FONT_SANS,
  fontSize: "0.9rem",
  color: T.ink,
  background: T.white,
  border: `1px solid ${hasError ? "#DC2626" : T.border}`,
  borderRadius: "10px",
  px: "14px",
  py: "11px",
  outline: "none",
  transition: "border-color 0.15s, box-shadow 0.15s",
  letterSpacing: "-0.01em",
  resize: "none" as const,
  "&::placeholder": { color: T.inkGhost },
  "&:focus": {
    borderColor: hasError ? "#DC2626" : T.borderMd,
    boxShadow: `0 0 0 3px ${hasError ? "rgba(220,38,38,0.07)" : "rgba(12,14,18,0.05)"}`,
  },
  "&:disabled": { opacity: 0.5, cursor: "not-allowed", background: T.offwhite },
});

/* ── Animated availability dots ─────────────────────────────────────── */
function AvailabilityBadge() {
  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 1,
        px: 1.75,
        py: 0.75,
        borderRadius: "100px",
        background: T.sageLight,
        border: `1px solid rgba(92,122,92,0.2)`,
      }}
    >
      <Box sx={{ display: "flex", gap: 0.5 }}>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ opacity: i < 2 ? [1, 0.3, 1] : [0.3, 0.3, 0.3] }}
            transition={{ duration: 2, delay: i * 0.4, repeat: Infinity }}
          >
            <Box
              sx={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: i < 2 ? T.sage : T.inkGhost,
              }}
            />
          </motion.div>
        ))}
      </Box>
      <Typography
        sx={{
          fontFamily: FONT_MONO,
          fontSize: "0.58rem",
          letterSpacing: "0.1em",
          color: T.sage,
          textTransform: "uppercase",
        }}
      >
        2 spots available this week
      </Typography>
    </Box>
  );
}

/* ── Floating cursor glow ────────────────────────────────────────────── */
function CursorGlow({
  containerRef,
}: {
  containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const move = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      x.set(e.clientX - rect.left);
      y.set(e.clientY - rect.top);
    };
    el.addEventListener("mousemove", move);
    return () => el.removeEventListener("mousemove", move);
  }, [containerRef, x, y]);

  return (
    <motion.div
      style={{
        x,
        y,
        position: "absolute",
        width: 300,
        height: 300,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${T.goldGlow} 0%, transparent 70%)`,
        transform: "translate(-50%, -50%)",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}

/* ── Step progress bar ───────────────────────────────────────────────── */
function StepBar({ current, total }: { current: number; total: number }) {
  return (
    <Box sx={{ display: "flex", gap: 0.75, mb: 4 }}>
      {Array.from({ length: total }).map((_, i) => (
        <Box
          key={i}
          sx={{
            flex: 1,
            height: "2px",
            borderRadius: "2px",
            background: i < current ? T.gold : T.border,
            transition: "background 0.3s ease",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {i === current - 1 && (
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "0%" }}
              transition={{ duration: 0.4, ease: EASE }}
              style={{
                position: "absolute",
                inset: 0,
                background: T.gold,
                borderRadius: "2px",
              }}
            />
          )}
        </Box>
      ))}
    </Box>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════════════════════ */
export function BookConsultationClient() {
  const contactMutation = useContact();
  const [formStep, setFormStep] = useState(1); // 1 = about you, 2 = your challenge, 3 = confirm
  const heroRef = useRef<HTMLDivElement>(null);
  const formCardRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    trigger,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { serviceType: "consultation" },
    mode: "onBlur",
  });

  const onSubmit = (data: ContactFormValues) => {
    contactMutation.mutate(data, {
      onSuccess: () => {
        reset();
        setFormStep(1);
      },
    });
  };

  /* Parallax */
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const heroO = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const sY = useSpring(heroY, { stiffness: 80, damping: 22 });
  const sO = useSpring(heroO, { stiffness: 80, damping: 22 });

  const isPending = contactMutation.isPending;
  const isSuccess = contactMutation.isSuccess;

  /* Step navigation */
  const goNext = async () => {
    let valid = false;
    if (formStep === 1)
      valid = await trigger(["name", "email", "phone", "company"]);
    if (formStep === 2)
      valid = await trigger(["subject", "message", "serviceType"]);
    if (valid) setFormStep((s) => s + 1);
  };

  return (
    <Box
      sx={{ minHeight: "100vh", background: T.offwhite, fontFamily: FONT_SANS }}
    >
      {/* ════════════════════════════════════════════════════════
          HERO — full-screen editorial
      ════════════════════════════════════════════════════════ */}
      <Box
        ref={heroRef}
        sx={{
          background: T.white,
          borderBottom: `1px solid ${T.border}`,
          pt: { xs: 14, md: 20 },
          pb: { xs: 10, md: 16 },
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Warm grid */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            backgroundImage: `linear-gradient(${T.border} 1px, transparent 1px), linear-gradient(90deg, ${T.border} 1px, transparent 1px)`,
            backgroundSize: "64px 64px",
            opacity: 0.4,
          }}
        />

        {/* Gold glow */}
        <Box
          sx={{
            position: "absolute",
            width: "60vw",
            height: "40vw",
            top: "-20vw",
            left: "20vw",
            borderRadius: "50%",
            background: `radial-gradient(ellipse, ${T.goldGlow} 0%, transparent 70%)`,
            pointerEvents: "none",
          }}
        />

        {/* Grain */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            opacity: 0.025,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: "160px",
          }}
        />

        {/* Ghost text */}
        <Box
          sx={{
            position: "absolute",
            right: -40,
            bottom: -60,
            fontFamily: FONT_SERIF,
            fontStyle: "italic",
            fontSize: { xs: "35vw", md: "24vw" },
            fontWeight: 400,
            color: "rgba(12,14,18,0.025)",
            lineHeight: 1,
            pointerEvents: "none",
            userSelect: "none",
            letterSpacing: "-0.06em",
          }}
        >
          Grow.
        </Box>

        <Container
          maxWidth="lg"
          sx={{ position: "relative", zIndex: 1, textAlign: "center" }}
        >
          <motion.div style={{ y: sY, opacity: sO }}>
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
                <AvailabilityBadge />
              </Box>
            </motion.div>

            {/* Headline */}
            <motion.div
              initial={{ opacity: 0, y: 36 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.08, ease: EASE }}
            >
              <Typography
                sx={{
                  fontFamily: FONT_SERIF,
                  fontStyle: "italic",
                  fontWeight: 400,
                  fontSize: {
                    xs: "2.75rem",
                    sm: "4rem",
                    md: "5.5rem",
                    lg: "7rem",
                  },
                  lineHeight: 0.93,
                  letterSpacing: "-0.035em",
                  color: T.ink,
                  mb: 0.5,
                }}
              >
                Your finances,
              </Typography>
              <Typography
                sx={{
                  fontFamily: FONT_SERIF,
                  fontStyle: "italic",
                  fontWeight: 400,
                  fontSize: {
                    xs: "2.75rem",
                    sm: "4rem",
                    md: "5.5rem",
                    lg: "7rem",
                  },
                  lineHeight: 0.93,
                  letterSpacing: "-0.035em",
                  background: `linear-gradient(115deg, ${T.goldLight} 0%, ${T.gold} 55%)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  mb: 3,
                }}
              >
                finally clear.
              </Typography>
            </motion.div>

            {/* Subheadline — psychological hook */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.22, ease: EASE }}
            >
              <Typography
                sx={{
                  fontFamily: FONT_SANS,
                  fontSize: { xs: "1rem", md: "1.125rem" },
                  color: T.inkMuted,
                  lineHeight: 1.8,
                  maxWidth: 520,
                  mx: "auto",
                  mb: 5,
                }}
              >
                Most founders feel like their numbers are working against them.
                One 30-minute conversation with Parag or Khyati will show you
                exactly what to fix and in what order.
              </Typography>
            </motion.div>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35, ease: EASE }}
            >
              <Box
                sx={{
                  display: "flex",
                  gap: 1.5,
                  justifyContent: "center",
                  flexWrap: "wrap",
                  mb: 8,
                }}
              >
                {/* Primary — smooth scroll to form */}
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Box
                    component="a"
                    href="#book-form"
                    onClick={(e) => {
                      e.preventDefault();
                      document
                        .getElementById("book-form")
                        ?.scrollIntoView({ behavior: "smooth" });
                    }}
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 1.25,
                      px: 3.5,
                      py: 1.625,
                      borderRadius: "10px",
                      background: `linear-gradient(115deg, ${T.goldLight}, ${T.gold})`,
                      color: T.ink,
                      fontFamily: FONT_SANS,
                      fontWeight: 600,
                      fontSize: "0.9375rem",
                      letterSpacing: "-0.01em",
                      textDecoration: "none",
                      transition: "box-shadow 0.2s",
                      "&:hover": { boxShadow: `0 8px 28px ${T.goldGlow}` },
                    }}
                  >
                    <CalIcon sx={{ fontSize: "1rem" }} />
                    Book My Free Session
                  </Box>
                </motion.div>

                {/* Secondary — Calendly */}
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Box
                    component="a"
                    href={process.env.NEXT_PUBLIC_CALENDLY_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 1.25,
                      px: 3.5,
                      py: 1.625,
                      borderRadius: "10px",
                      border: `1.5px solid ${T.border}`,
                      color: T.inkMuted,
                      fontFamily: FONT_SANS,
                      fontWeight: 500,
                      fontSize: "0.9375rem",
                      letterSpacing: "-0.01em",
                      textDecoration: "none",
                      background: T.white,
                      transition: "all 0.2s",
                      "&:hover": {
                        borderColor: T.borderMd,
                        color: T.ink,
                        background: T.offwhite,
                      },
                    }}
                  >
                    Open Calendly directly
                    <ArrowIcon sx={{ fontSize: "0.875rem" }} />
                  </Box>
                </motion.div>
              </Box>
            </motion.div>

            {/* Stats strip */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  flexWrap: "wrap",
                  borderTop: `1px solid ${T.border}`,
                  pt: 4,
                }}
              >
                {SOCIAL_PROOF.map((s, i) => (
                  <Box
                    key={s.label}
                    sx={{
                      px: { xs: 2, md: 3.5 },
                      py: 0.5,
                      borderLeft: i > 0 ? `1px solid ${T.border}` : "none",
                      textAlign: "center",
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: FONT_MONO,
                        fontSize: { xs: "1.1rem", md: "1.375rem" },
                        fontWeight: 600,
                        color: T.ink,
                        letterSpacing: "-0.02em",
                        lineHeight: 1,
                      }}
                    >
                      {s.val}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: FONT_MONO,
                        fontSize: "0.52rem",
                        letterSpacing: "0.14em",
                        color: T.inkFaint,
                        textTransform: "uppercase",
                        mt: 0.4,
                      }}
                    >
                      {s.label}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </motion.div>
          </motion.div>
        </Container>
      </Box>

      {/* ════════════════════════════════════════════════════════
          WHAT YOU'LL WALK AWAY WITH — outcomes section
      ════════════════════════════════════════════════════════ */}
      <Box
        sx={{
          py: { xs: 10, md: 16 },
          background: T.cream,
          borderBottom: `1px solid ${T.border}`,
        }}
      >
        <Container maxWidth="xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <Box sx={{ mb: { xs: 6, md: 10 } }}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}
              >
                <Box sx={{ width: 28, height: "1px", background: T.gold }} />
                <Typography
                  sx={{
                    fontFamily: FONT_MONO,
                    fontSize: "0.58rem",
                    letterSpacing: "0.22em",
                    color: T.goldMid,
                    textTransform: "uppercase",
                  }}
                >
                  The Session
                </Typography>
              </Box>
              <Typography
                sx={{
                  fontFamily: FONT_SERIF,
                  fontStyle: "italic",
                  fontWeight: 400,
                  fontSize: { xs: "2.25rem", md: "3.5rem" },
                  color: T.ink,
                  letterSpacing: "-0.025em",
                  lineHeight: 1.05,
                }}
              >
                What you'll walk away with.
              </Typography>
            </Box>
          </motion.div>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr",
                lg: "repeat(4,1fr)",
              },
              gap: 2,
            }}
          >
            {OUTCOMES.map((item, i) => (
              <motion.div
                key={item.glyph}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.55, delay: i * 0.1, ease: EASE }}
                whileHover={{ y: -5 }}
              >
                <Box
                  sx={{
                    p: 3.5,
                    borderRadius: "16px",
                    background: T.white,
                    border: `1px solid ${T.border}`,
                    height: "100%",
                    position: "relative",
                    overflow: "hidden",
                    transition: "border-color 0.2s, box-shadow 0.2s",
                    "&:hover": {
                      borderColor: T.goldBdr,
                      boxShadow: `0 8px 32px ${T.goldGlow}`,
                    },
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: "2px",
                      background: `linear-gradient(90deg, ${T.gold}, transparent)`,
                      opacity: 0,
                      transition: "opacity 0.25s",
                    },
                    "&:hover::before": { opacity: 1 },
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: FONT_MONO,
                      fontSize: "0.52rem",
                      letterSpacing: "0.18em",
                      color: T.goldMid,
                      mb: 2.5,
                      textTransform: "uppercase",
                    }}
                  >
                    {item.glyph}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: FONT_SERIF,
                      fontStyle: "italic",
                      fontSize: "1.375rem",
                      fontWeight: 400,
                      color: T.ink,
                      mb: 1.25,
                      letterSpacing: "-0.01em",
                      lineHeight: 1.15,
                    }}
                  >
                    {item.title}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: FONT_SANS,
                      fontSize: "0.875rem",
                      color: T.inkMuted,
                      lineHeight: 1.75,
                    }}
                  >
                    {item.body}
                  </Typography>
                </Box>
              </motion.div>
            ))}
          </Box>
        </Container>
      </Box>

      {/* ════════════════════════════════════════════════════════
          FOUNDERS — relationship building
      ════════════════════════════════════════════════════════ */}
      <Box
        sx={{
          py: { xs: 10, md: 16 },
          background: T.white,
          borderBottom: `1px solid ${T.border}`,
        }}
      >
        <Container maxWidth="xl">
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
              gap: { xs: 8, lg: 12 },
              alignItems: "center",
            }}
          >
            {/* Left: editorial copy */}
            <motion.div
              initial={{ opacity: 0, x: -32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.65, ease: EASE }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  mb: 2.5,
                }}
              >
                <Box sx={{ width: 28, height: "1px", background: T.gold }} />
                <Typography
                  sx={{
                    fontFamily: FONT_MONO,
                    fontSize: "0.58rem",
                    letterSpacing: "0.22em",
                    color: T.goldMid,
                    textTransform: "uppercase",
                  }}
                >
                  Who You'll Speak With
                </Typography>
              </Box>
              <Typography
                sx={{
                  fontFamily: FONT_SERIF,
                  fontStyle: "italic",
                  fontWeight: 400,
                  fontSize: { xs: "2rem", md: "3rem" },
                  color: T.ink,
                  letterSpacing: "-0.025em",
                  lineHeight: 1.1,
                  mb: 2.5,
                }}
              >
                Real experts.
                <br />
                Not a sales team.
              </Typography>
              <Typography
                sx={{
                  fontFamily: FONT_SANS,
                  fontSize: "1rem",
                  color: T.inkMuted,
                  lineHeight: 1.8,
                  mb: 1.5,
                }}
              >
                When you book with us, you speak directly with Parag or Khyati —
                the people who have personally built 150+ financial models for
                founders across India.
              </Typography>
              <Typography
                sx={{
                  fontFamily: FONT_SANS,
                  fontSize: "1rem",
                  color: T.inkMuted,
                  lineHeight: 1.8,
                }}
              >
                No junior analysts. No templated advice. Just two people who
                genuinely care about making your numbers work.
              </Typography>
            </motion.div>

            {/* Right: founder cards side by side */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {FOUNDERS.map((f, i) => (
                <motion.div
                  key={f.name}
                  initial={{ opacity: 0, x: 32 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.6, delay: i * 0.12, ease: EASE }}
                  whileHover={{ y: -3 }}
                >
                  <Box
                    sx={{
                      p: 3,
                      borderRadius: "16px",
                      background: T.offwhite,
                      border: `1px solid ${T.border}`,
                      display: "flex",
                      alignItems: "center",
                      gap: 2.5,
                      transition: "border-color 0.2s, box-shadow 0.2s",
                      "&:hover": {
                        borderColor: f.accent + "44",
                        boxShadow: `0 6px 24px ${f.accent}10`,
                      },
                    }}
                  >
                    {/* Avatar */}
                    <Box
                      sx={{
                        width: 58,
                        height: 58,
                        borderRadius: "14px",
                        flexShrink: 0,
                        background: `linear-gradient(135deg, ${f.accent}22, ${f.accent}10)`,
                        border: `1px solid ${f.accent}22`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: FONT_SERIF,
                          fontStyle: "italic",
                          fontSize: "1.375rem",
                          color: f.accent,
                          letterSpacing: "-0.03em",
                        }}
                      >
                        {f.initials}
                      </Typography>
                    </Box>
                    {/* Info */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          mb: 0.25,
                        }}
                      >
                        <Typography
                          sx={{
                            fontFamily: FONT_SERIF,
                            fontStyle: "italic",
                            fontSize: "1.125rem",
                            fontWeight: 400,
                            color: T.ink,
                            letterSpacing: "-0.01em",
                          }}
                        >
                          {f.name}
                        </Typography>
                        <motion.a
                          href={f.linkedin}
                          target="_blank"
                          whileHover={{ scale: 1.15, color: T.gold }}
                          style={{ color: T.inkGhost, display: "flex" }}
                        >
                          <LinkedInIcon sx={{ fontSize: "1.125rem" }} />
                        </motion.a>
                      </Box>
                      <Typography
                        sx={{
                          fontFamily: FONT_MONO,
                          fontSize: "0.58rem",
                          letterSpacing: "0.1em",
                          color: f.accent,
                          textTransform: "uppercase",
                          mb: 0.5,
                        }}
                      >
                        {f.role}
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: FONT_SANS,
                          fontSize: "0.8rem",
                          color: T.inkMuted,
                        }}
                      >
                        {f.tagline}
                      </Typography>
                    </Box>
                  </Box>
                </motion.div>
              ))}
            </Box>
          </Box>
        </Container>
      </Box>

      {/* ════════════════════════════════════════════════════════
          FORM — multi-step conversation
      ════════════════════════════════════════════════════════ */}
      <Box
        id="book-form"
        sx={{ py: { xs: 10, md: 16 }, background: T.offwhite }}
      >
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <Box sx={{ textAlign: "center", mb: { xs: 7, md: 10 } }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  mb: 2,
                  justifyContent: "center",
                }}
              >
                <Box sx={{ width: 28, height: "1px", background: T.gold }} />
                <Typography
                  sx={{
                    fontFamily: FONT_MONO,
                    fontSize: "0.58rem",
                    letterSpacing: "0.22em",
                    color: T.goldMid,
                    textTransform: "uppercase",
                  }}
                >
                  Free Strategy Session
                </Typography>
                <Box sx={{ width: 28, height: "1px", background: T.gold }} />
              </Box>
              <Typography
                sx={{
                  fontFamily: FONT_SERIF,
                  fontStyle: "italic",
                  fontWeight: 400,
                  fontSize: { xs: "2.25rem", md: "3.25rem" },
                  color: T.ink,
                  letterSpacing: "-0.025em",
                  lineHeight: 1.1,
                  mb: 1.5,
                }}
              >
                Tell us about your business.
              </Typography>
              <Typography
                sx={{
                  fontFamily: FONT_SANS,
                  fontSize: "1rem",
                  color: T.inkMuted,
                  lineHeight: 1.75,
                  maxWidth: 440,
                  mx: "auto",
                }}
              >
                We read every submission personally. The more context you give
                us, the more useful your first call will be.
              </Typography>
            </Box>
          </motion.div>

          {/* Card with cursor glow */}
          <Box
            ref={formCardRef}
            sx={{ position: "relative", maxWidth: 680, mx: "auto" }}
          >
            <CursorGlow containerRef={formCardRef} />

            <Box
              sx={{
                position: "relative",
                zIndex: 1,
                background: T.white,
                borderRadius: "20px",
                border: `1px solid ${T.border}`,
                p: { xs: 3, md: 5 },
                boxShadow:
                  "0 4px 40px rgba(12,14,18,0.06), 0 1px 2px rgba(12,14,18,0.04)",
              }}
            >
              <AnimatePresence mode="wait">
                {/* ── SUCCESS STATE ── */}
                {isSuccess ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.45, ease: EASE }}
                  >
                    <Box
                      sx={{
                        textAlign: "center",
                        py: 6,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 2.5,
                      }}
                    >
                      <motion.div
                        initial={{ scale: 0, rotate: -20 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 240,
                          damping: 18,
                          delay: 0.1,
                        }}
                      >
                        <Box
                          sx={{
                            width: 80,
                            height: 80,
                            borderRadius: "50%",
                            background: T.sageLight,
                            border: `1px solid rgba(92,122,92,0.2)`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <CheckIcon
                            sx={{ fontSize: "2.25rem", color: T.sage }}
                          />
                        </Box>
                      </motion.div>

                      <Typography
                        sx={{
                          fontFamily: FONT_SERIF,
                          fontStyle: "italic",
                          fontSize: "2rem",
                          color: T.ink,
                          letterSpacing: "-0.02em",
                          lineHeight: 1.1,
                        }}
                      >
                        We've got your message.
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: FONT_SANS,
                          fontSize: "1rem",
                          color: T.inkMuted,
                          lineHeight: 1.75,
                          maxWidth: 360,
                        }}
                      >
                        Parag or Khyati will personally review your submission
                        and reach out within 24 hours to schedule your session.
                      </Typography>

                      {/* Calendly nudge */}
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
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 1.25,
                            mt: 1,
                            px: 3,
                            py: 1.5,
                            borderRadius: "10px",
                            border: `1.5px solid ${T.border}`,
                            color: T.inkMuted,
                            fontFamily: FONT_SANS,
                            fontWeight: 500,
                            fontSize: "0.875rem",
                            textDecoration: "none",
                            background: T.offwhite,
                            transition: "all 0.2s",
                            "&:hover": {
                              borderColor: T.borderMd,
                              color: T.ink,
                            },
                          }}
                        >
                          <CalIcon sx={{ fontSize: "0.95rem" }} />
                          Or pick a time on Calendly now
                          <ArrowIcon sx={{ fontSize: "0.8rem" }} />
                        </Box>
                      </motion.div>
                    </Box>
                  </motion.div>
                ) : (
                  /* ── FORM ── */
                  <motion.div key="form">
                    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                      {/* Step progress */}
                      <StepBar current={formStep} total={3} />

                      {/* Step label */}
                      <Box sx={{ mb: 4 }}>
                        <Typography
                          sx={{
                            fontFamily: FONT_MONO,
                            fontSize: "0.54rem",
                            letterSpacing: "0.18em",
                            color: T.inkFaint,
                            textTransform: "uppercase",
                            mb: 0.5,
                          }}
                        >
                          Step {formStep} of 3
                        </Typography>
                        <Typography
                          sx={{
                            fontFamily: FONT_SERIF,
                            fontStyle: "italic",
                            fontSize: "1.5rem",
                            color: T.ink,
                            letterSpacing: "-0.02em",
                            lineHeight: 1.1,
                          }}
                        >
                          {formStep === 1 && "First, let's get acquainted."}
                          {formStep === 2 && "Tell us your challenge."}
                          {formStep === 3 && "One last look before we send."}
                        </Typography>
                      </Box>

                      {/* ── Step 1: Identity ── */}
                      <AnimatePresence mode="wait">
                        {formStep === 1 && (
                          <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3, ease: EASE }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 2.5,
                              }}
                            >
                              <Box
                                sx={{
                                  display: "grid",
                                  gridTemplateColumns: "1fr 1fr",
                                  gap: 2,
                                }}
                              >
                                <Field
                                  label="Your name"
                                  error={errors.name?.message}
                                  required
                                >
                                  <Box
                                    component="input"
                                    {...register("name")}
                                    placeholder="Rahul Sharma"
                                    disabled={isPending}
                                    sx={inputSx(!!errors.name)}
                                  />
                                </Field>
                                <Field
                                  label="Email address"
                                  error={errors.email?.message}
                                  required
                                >
                                  <Box
                                    component="input"
                                    {...register("email")}
                                    type="email"
                                    placeholder="rahul@startup.com"
                                    disabled={isPending}
                                    sx={inputSx(!!errors.email)}
                                  />
                                </Field>
                              </Box>
                              <Box
                                sx={{
                                  display: "grid",
                                  gridTemplateColumns: "1fr 1fr",
                                  gap: 2,
                                }}
                              >
                                <Field
                                  label="Phone number"
                                  error={errors.phone?.message}
                                >
                                  <Box
                                    component="input"
                                    {...register("phone")}
                                    placeholder="+91 98765 43210"
                                    disabled={isPending}
                                    sx={inputSx(!!errors.phone)}
                                  />
                                </Field>
                                <Field label="Company name" error={undefined}>
                                  <Box
                                    component="input"
                                    {...register("company")}
                                    placeholder="Your startup"
                                    disabled={isPending}
                                    sx={inputSx()}
                                  />
                                </Field>
                              </Box>
                            </Box>
                          </motion.div>
                        )}

                        {/* ── Step 2: Challenge ── */}
                        {formStep === 2 && (
                          <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3, ease: EASE }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 2.5,
                              }}
                            >
                              {/* Service type — custom segmented control */}
                              <Field label="What do you need most?" required>
                                <Controller
                                  name="serviceType"
                                  control={control}
                                  render={({ field }) => (
                                    <Box
                                      sx={{
                                        display: "grid",
                                        gridTemplateColumns: "1fr 1fr",
                                        gap: 1,
                                      }}
                                    >
                                      {SERVICE_OPTIONS.map((opt) => (
                                        <Box
                                          key={opt.value}
                                          component="button"
                                          type="button"
                                          onClick={() =>
                                            field.onChange(opt.value)
                                          }
                                          sx={{
                                            px: 2,
                                            py: 1.25,
                                            borderRadius: "9px",
                                            border: `1.5px solid ${field.value === opt.value ? T.gold : T.border}`,
                                            background:
                                              field.value === opt.value
                                                ? `linear-gradient(115deg, ${T.goldLight}18, ${T.gold}10)`
                                                : T.white,
                                            cursor: "pointer",
                                            textAlign: "left",
                                            transition: "all 0.15s ease",
                                            outline: "none",
                                          }}
                                        >
                                          <Typography
                                            sx={{
                                              fontFamily: FONT_SANS,
                                              fontSize: "0.8125rem",
                                              fontWeight:
                                                field.value === opt.value
                                                  ? 600
                                                  : 400,
                                              color:
                                                field.value === opt.value
                                                  ? T.gold
                                                  : T.inkMuted,
                                              letterSpacing: "-0.01em",
                                              transition: "all 0.15s",
                                            }}
                                          >
                                            {opt.label}
                                          </Typography>
                                        </Box>
                                      ))}
                                    </Box>
                                  )}
                                />
                              </Field>

                              <Field
                                label="What's this about?"
                                error={errors.subject?.message}
                                required
                              >
                                <Box
                                  component="input"
                                  {...register("subject")}
                                  placeholder="e.g. Need a financial model for my SaaS startup"
                                  disabled={isPending}
                                  sx={inputSx(!!errors.subject)}
                                />
                              </Field>

                              <Field
                                label="Tell us more — the more context, the better your session"
                                error={errors.message?.message}
                                required
                              >
                                <Box
                                  component="textarea"
                                  {...register("message")}
                                  rows={5}
                                  placeholder="Describe your business, where you're stuck, and what a successful outcome looks like for you."
                                  disabled={isPending}
                                  sx={{
                                    ...inputSx(!!errors.message),
                                    display: "block",
                                  }}
                                />
                              </Field>
                            </Box>
                          </motion.div>
                        )}

                        {/* ── Step 3: Confirm ── */}
                        {formStep === 3 && (
                          <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3, ease: EASE }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 0,
                              }}
                            >
                              {/* Summary */}
                              <Box
                                sx={{
                                  borderRadius: "12px",
                                  border: `1px solid ${T.border}`,
                                  background: T.offwhite,
                                  overflow: "hidden",
                                  mb: 3,
                                }}
                              >
                                {[
                                  { label: "Name", val: watch("name") },
                                  { label: "Email", val: watch("email") },
                                  {
                                    label: "Company",
                                    val: watch("company") || "—",
                                  },
                                  {
                                    label: "Service",
                                    val:
                                      SERVICE_OPTIONS.find(
                                        (o) => o.value === watch("serviceType"),
                                      )?.label || "—",
                                  },
                                  { label: "Subject", val: watch("subject") },
                                ].map((row, i) => (
                                  <Box
                                    key={row.label}
                                    sx={{
                                      display: "flex",
                                      gap: 2,
                                      px: 2.5,
                                      py: 1.5,
                                      borderTop:
                                        i > 0
                                          ? `1px solid ${T.border}`
                                          : "none",
                                    }}
                                  >
                                    <Typography
                                      sx={{
                                        fontFamily: FONT_MONO,
                                        fontSize: "0.6rem",
                                        letterSpacing: "0.1em",
                                        color: T.inkFaint,
                                        textTransform: "uppercase",
                                        minWidth: 64,
                                        pt: "1px",
                                      }}
                                    >
                                      {row.label}
                                    </Typography>
                                    <Typography
                                      sx={{
                                        fontFamily: FONT_SANS,
                                        fontSize: "0.875rem",
                                        color: T.ink,
                                        lineHeight: 1.4,
                                      }}
                                    >
                                      {row.val}
                                    </Typography>
                                  </Box>
                                ))}
                              </Box>

                              {/* Trust note */}
                              <Box
                                sx={{
                                  display: "flex",
                                  gap: 1.25,
                                  px: 2,
                                  py: 1.5,
                                  borderRadius: "10px",
                                  background: T.sageLight,
                                  border: `1px solid rgba(92,122,92,0.18)`,
                                  mb: 3,
                                }}
                              >
                                <CheckIcon
                                  sx={{
                                    fontSize: "1rem",
                                    color: T.sage,
                                    mt: 0.1,
                                    flexShrink: 0,
                                  }}
                                />
                                <Typography
                                  sx={{
                                    fontFamily: FONT_SANS,
                                    fontSize: "0.8rem",
                                    color: T.sage,
                                    lineHeight: 1.6,
                                  }}
                                >
                                  We never share your details. Parag or Khyati
                                  will reply personally within 24 hours.
                                </Typography>
                              </Box>

                              {/* Error */}
                              {contactMutation.isError && (
                                <Box
                                  sx={{
                                    p: 2,
                                    borderRadius: "10px",
                                    background: "rgba(220,38,38,0.05)",
                                    border: "1px solid rgba(220,38,38,0.15)",
                                    mb: 2.5,
                                  }}
                                >
                                  <Typography
                                    sx={{
                                      fontFamily: FONT_SANS,
                                      fontSize: "0.8rem",
                                      color: "#DC2626",
                                    }}
                                  >
                                    Failed to send. Please try again or email us
                                    directly.
                                  </Typography>
                                </Box>
                              )}

                              {/* Submit */}
                              <motion.div
                                whileHover={{ scale: 1.015 }}
                                whileTap={{ scale: 0.985 }}
                              >
                                <Box
                                  component="button"
                                  type="submit"
                                  disabled={isPending}
                                  sx={{
                                    width: "100%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: 1.5,
                                    px: 3,
                                    py: 1.625,
                                    borderRadius: "10px",
                                    background: isPending
                                      ? T.parchment
                                      : `linear-gradient(115deg, ${T.goldLight}, ${T.gold})`,
                                    border: "none",
                                    cursor: isPending
                                      ? "not-allowed"
                                      : "pointer",
                                    transition: "all 0.2s",
                                    boxShadow: isPending
                                      ? "none"
                                      : `0 6px 24px ${T.goldGlow}`,
                                  }}
                                >
                                  {isPending ? (
                                    <Box
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1.25,
                                      }}
                                    >
                                      <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{
                                          duration: 1,
                                          repeat: Infinity,
                                          ease: "linear",
                                        }}
                                      >
                                        <Box
                                          sx={{
                                            width: 16,
                                            height: 16,
                                            border: `2px solid ${T.borderMd}`,
                                            borderTopColor: T.gold,
                                            borderRadius: "50%",
                                          }}
                                        />
                                      </motion.div>
                                      <Typography
                                        sx={{
                                          fontFamily: FONT_SANS,
                                          fontWeight: 600,
                                          fontSize: "0.9375rem",
                                          color: T.inkMuted,
                                        }}
                                      >
                                        Sending…
                                      </Typography>
                                    </Box>
                                  ) : (
                                    <Typography
                                      sx={{
                                        fontFamily: FONT_SANS,
                                        fontWeight: 600,
                                        fontSize: "0.9375rem",
                                        color: T.ink,
                                        letterSpacing: "-0.01em",
                                      }}
                                    >
                                      Send my message
                                    </Typography>
                                  )}
                                </Box>
                              </motion.div>
                            </Box>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* ── Navigation buttons ── */}
                      {!isSuccess && (
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent:
                              formStep > 1 ? "space-between" : "flex-end",
                            mt: 3,
                            gap: 1.5,
                          }}
                        >
                          {formStep > 1 && (
                            <Box
                              component="button"
                              type="button"
                              onClick={() => setFormStep((s) => s - 1)}
                              sx={{
                                px: 2.5,
                                py: 1.125,
                                borderRadius: "9px",
                                border: `1px solid ${T.border}`,
                                background: "transparent",
                                cursor: "pointer",
                                fontFamily: FONT_SANS,
                                fontSize: "0.875rem",
                                color: T.inkMuted,
                                transition: "all 0.15s",
                                "&:hover": {
                                  borderColor: T.borderMd,
                                  color: T.ink,
                                },
                              }}
                            >
                              ← Back
                            </Box>
                          )}
                          {formStep < 3 && (
                            <Box
                              component="button"
                              type="button"
                              onClick={goNext}
                              sx={{
                                px: 2.5,
                                py: 1.125,
                                borderRadius: "9px",
                                background: T.ink,
                                border: "none",
                                cursor: "pointer",
                                fontFamily: FONT_SANS,
                                fontWeight: 600,
                                fontSize: "0.875rem",
                                color: T.white,
                                display: "flex",
                                alignItems: "center",
                                gap: 0.75,
                                transition: "opacity 0.15s",
                                "&:hover": { opacity: 0.85 },
                              }}
                            >
                              Continue <ArrowIcon sx={{ fontSize: "0.8rem" }} />
                            </Box>
                          )}
                        </Box>
                      )}
                    </Box>
                  </motion.div>
                )}
              </AnimatePresence>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
