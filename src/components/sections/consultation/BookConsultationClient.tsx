"use client";

import { useState, useRef, useEffect, useCallback } from "react";
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
   TOKENS — pure white / deep black / ice blue accent
══════════════════════════════════════════════════════════════════════ */
const T = {
  // Backgrounds
  bg: "#FFFFFF",
  bgSub: "#FAFAFA",
  bgMuted: "#F4F4F5",
  bgBlue: "#EEF2FF",
  bgBlueMd: "#E0E7FF",
  bgBlueSm: "#F0F4FF",

  // Text
  ink: "#09090B",
  inkMid: "#18181B",
  inkBody: "#3F3F46",
  inkMuted: "#71717A",
  inkFaint: "#A1A1AA",
  inkGhost: "#D4D4D8",

  // Borders
  border: "#E4E4E7",
  borderMd: "#D4D4D8",
  borderBlue: "#C7D7FD",

  // Blue accent system
  blue: "#3B5BDB",
  blueMid: "#4C6EF5",
  blueLight: "#748FFC",
  bluePale: "#BAC8FF",
  blueGlow: "rgba(59,91,219,0.10)",
  blueGlowSm: "rgba(59,91,219,0.06)",

  // Semantic
  sage: "#16A34A",
  sageLight: "rgba(22,163,74,0.07)",
  sageBdr: "rgba(22,163,74,0.20)",
  error: "#DC2626",
  errorLight: "rgba(220,38,38,0.07)",
};

const SERIF = '"Instrument Serif","Playfair Display",Georgia,serif';
const SANS = '"DM Sans","Mona Sans",system-ui,sans-serif';
const MONO = '"DM Mono","JetBrains Mono",ui-monospace,monospace';
const EASE = [0.16, 1, 0.3, 1] as const;

/* ── Data ──────────────────────────────────────────────────────────── */
const OUTCOMES = [
  {
    glyph: "01",
    title: "A clear diagnosis",
    body: "We'll pinpoint exactly which financial lever — pricing, burn, or margins — is holding your growth back.",
    accent: "#3B5BDB",
  },
  {
    glyph: "02",
    title: "Your 90-day roadmap",
    body: "Leave with a concrete, prioritised action plan you can hand to a CFO or execute yourself.",
    accent: "#0891B2",
  },
  {
    glyph: "03",
    title: "Model recommendations",
    body: "We'll tell you precisely which templates or models would give you the most leverage — no upsell pressure.",
    accent: "#7C3AED",
  },
  {
    glyph: "04",
    title: "An honest conversation",
    body: "We only take on clients when we know we can move the needle. This session is about fit, not sales.",
    accent: "#0D7A5F",
  },
];

const SERVICE_OPTIONS = [
  { value: "consultation", label: "Founder Consultation" },
  { value: "modelling", label: "Financial Modelling" },
  { value: "templates", label: "Custom Templates" },
  { value: "other", label: "Other / Not Sure Yet" },
];
/* ── Field ─────────────────────────────────────────────────────────── */
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
            fontFamily: MONO,
            fontWeight: 500,
            fontSize: "0.5rem",
            letterSpacing: "0.15em",
            color: error ? T.error : T.inkMuted,
            textTransform: "uppercase",
          }}
        >
          {label}
        </Typography>
        {required && (
          <Typography
            sx={{
              fontFamily: MONO,
              fontSize: "0.55rem",
              color: T.blueMid,
              lineHeight: 1,
            }}
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
                fontFamily: SANS,
                fontSize: "0.72rem",
                color: T.error,
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

const inputSx = (hasError?: boolean) => ({
  width: "100%",
  fontFamily: SANS,
  fontSize: "0.9rem",
  color: T.ink,
  background: T.bg,
  border: `1.5px solid ${hasError ? T.error : T.border}`,
  borderRadius: "10px",
  px: "14px",
  py: "11px",
  outline: "none",
  transition: "border-color 0.15s, box-shadow 0.15s",
  letterSpacing: "-0.01em",
  resize: "none" as const,
  "&::placeholder": { color: T.inkGhost },
  "&:focus": {
    borderColor: hasError ? T.error : T.borderBlue,
    boxShadow: `0 0 0 3px ${hasError ? T.errorLight : T.blueGlowSm}`,
  },
  "&:disabled": { opacity: 0.5, cursor: "not-allowed", background: T.bgMuted },
});

/* ── CountUp — RAF quartic ease ────────────────────────────────────── */
function CountUp({
  to,
  suffix = "",
  prefix = "",
}: {
  to: number;
  suffix?: string;
  prefix?: string;
}) {
  const [count, setCount] = useState(0);
  const [active, setActive] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setActive(true);
          obs.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!active) return;
    const dur = 1400,
      t0 = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - t0) / dur, 1);
      setCount(Math.round((1 - Math.pow(1 - t, 4)) * to));
      if (t < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [active, to]);

  return (
    <span ref={ref}>
      {prefix}
      {count}
      {suffix}
    </span>
  );
}

/* ── 3D Tilt card ──────────────────────────────────────────────────── */
function TiltCard({
  children,
  intensity = 5,
}: {
  children: React.ReactNode;
  intensity?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 280, damping: 26 });
  const sy = useSpring(my, { stiffness: 280, damping: 26 });
  const rotX = useTransform(
    sy,
    [-0.5, 0.5],
    [`${intensity}deg`, `-${intensity}deg`],
  );
  const rotY = useTransform(
    sx,
    [-0.5, 0.5],
    [`-${intensity}deg`, `${intensity}deg`],
  );
  const glX = useTransform(sx, [-0.5, 0.5], ["12%", "88%"]);
  const glY = useTransform(sy, [-0.5, 0.5], ["12%", "88%"]);
  const shadow = useTransform(
    sx,
    (v) =>
      `0 ${8 + Math.abs(v) * 18}px ${20 + Math.abs(v) * 28}px rgba(9,9,11,${0.05 + Math.abs(v) * 0.04})`,
  );
  const onMove = useCallback(
    (e: React.MouseEvent) => {
      const r = ref.current?.getBoundingClientRect();
      if (!r) return;
      mx.set((e.clientX - r.left) / r.width - 0.5);
      my.set((e.clientY - r.top) / r.height - 0.5);
    },
    [mx, my],
  );
  const onLeave = useCallback(() => {
    mx.set(0);
    my.set(0);
  }, [mx, my]);
  return (
    <motion.div style={{ perspective: 900 }}>
      <motion.div
        ref={ref}
        style={{
          rotateX: rotX,
          rotateY: rotY,
          transformStyle: "preserve-3d",
          boxShadow: shadow,
        }}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        whileHover={{
          z: 10,
          transition: { type: "spring", stiffness: 300, damping: 28 },
        }}
      >
        <Box
          sx={{
            position: "relative",
            overflow: "hidden",
            borderRadius: "inherit",
          }}
        >
          <motion.div
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              borderRadius: "inherit",
              background: `radial-gradient(circle at ${glX} ${glY}, rgba(255,255,255,0.72) 0%, transparent 56%)`,
              zIndex: 2,
            }}
          />
          {children}
        </Box>
      </motion.div>
    </motion.div>
  );
}

/* ── Cursor glow ───────────────────────────────────────────────────── */
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
      const r = el.getBoundingClientRect();
      x.set(e.clientX - r.left);
      y.set(e.clientY - r.top);
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
        width: 320,
        height: 320,
        borderRadius: "50%",
        background: `radial-gradient(circle,${T.blueGlowSm} 0%,transparent 70%)`,
        transform: "translate(-50%,-50%)",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}

/* ── Step bar ──────────────────────────────────────────────────────── */
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
            background: i < current ? T.blue : T.border,
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
                background: T.blue,
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
  const [formStep, setFormStep] = useState(1);
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

  const goNext = async () => {
    let valid = false;
    if (formStep === 1)
      valid = await trigger(["name", "email", "phone", "company"]);
    if (formStep === 2)
      valid = await trigger(["subject", "message", "serviceType"]);
    if (valid) setFormStep((s) => s + 1);
  };

  return (
    <Box sx={{ minHeight: "100vh", background: T.bg, fontFamily: SANS }}>
      {/* ══ HERO ═══════════════════════════════════════════════════════ */}
      <Box
        ref={heroRef}
        sx={{
          background: T.bg,
          borderBottom: `1px solid ${T.border}`,
          pt: { xs: 14, md: 20 },
          pb: { xs: 10, md: 16 },
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Container
          maxWidth="lg"
          sx={{ position: "relative", zIndex: 1, textAlign: "center" }}
        >
          <motion.div style={{ y: sY, opacity: sO }}>
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
            >
            
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 36 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.08, ease: EASE }}
            >
              <Typography
                sx={{
                  fontFamily: SERIF,
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
                  fontFamily: SERIF,
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
                  background: `linear-gradient(115deg,${T.blueLight},${T.blue})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  mb: 3,
                }}
              >
                finally clear.
              </Typography>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.22, ease: EASE }}
            >
              <Typography
                sx={{
                  fontFamily: SANS,
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
                exactly what to fix — and in what order.
              </Typography>
            </motion.div>

            {/* CTAs */}
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
                {/* Primary — blue-white */}
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
                      background: `linear-gradient(115deg,${T.bgBlueMd},${T.bgBlue})`,
                      color: T.blue,
                      fontFamily: SANS,
                      fontWeight: 600,
                      fontSize: "0.9375rem",
                      border: `1.5px solid ${T.borderBlue}`,
                      letterSpacing: "-0.01em",
                      textDecoration: "none",
                      boxShadow: `0 2px 12px ${T.blueGlowSm}`,
                      transition: "all 0.2s",
                      "&:hover": {
                        background: `linear-gradient(115deg,${T.bluePale}55,${T.bgBlueMd})`,
                        boxShadow: `0 6px 24px ${T.blueGlow}`,
                        borderColor: T.bluePale,
                      },
                    }}
                  >
                    <CalIcon sx={{ fontSize: "1rem" }} />
                    Book My Free Session
                  </Box>
                </motion.div>

                {/* Secondary — ghost */}
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
                      fontFamily: SANS,
                      fontWeight: 500,
                      fontSize: "0.9375rem",
                      letterSpacing: "-0.01em",
                      textDecoration: "none",
                      background: T.bg,
                      transition: "all 0.2s",
                      "&:hover": {
                        borderColor: T.borderBlue,
                        color: T.blue,
                        background: T.bgBlueSm,
                      },
                    }}
                  >
                    Open Calendly directly{" "}
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
                {[
                  { raw: 300, suffix: "+", label: "Founders advised" },
                  {
                    raw: 50,
                    prefix: "₹",
                    suffix: "Cr+",
                    label: "Revenue modelled",
                  },
                  { raw: 24, suffix: " hrs", label: "Response time" },
                  { raw: 0, display: "Free", label: "No obligation" },
                ].map((s, i) => (
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
                        fontFamily: SERIF,
                        fontStyle: "italic",
                        fontSize: { xs: "1.5rem", md: "2rem" },
                        color: T.ink,
                        letterSpacing: "-0.03em",
                        lineHeight: 1,
                      }}
                    >
                      {s.display ? (
                        s.display
                      ) : (
                        <CountUp
                          to={s.raw}
                          prefix={(s as any).prefix}
                          suffix={s.suffix}
                        />
                      )}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: MONO,
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

      {/* ══ OUTCOMES ════════════════════════════════════════════════════ */}
      <Box
        sx={{
          py: { xs: 10, md: 16 },
          background: T.bgSub,
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
                <Box
                  sx={{
                    width: 26,
                    height: "1px",
                    background: `linear-gradient(90deg,${T.blue},${T.blueLight})`,
                  }}
                />
                <Typography
                  sx={{
                    fontFamily: MONO,
                    fontSize: "0.54rem",
                    letterSpacing: "0.22em",
                    color: T.blueMid,
                    textTransform: "uppercase",
                  }}
                >
                  The Session
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 3,
                }}
              >
                <Box>
                  <Typography
                    sx={{
                      fontFamily: SERIF,
                      fontStyle: "italic",
                      fontWeight: 400,
                      fontSize: { xs: "2.25rem", md: "3.5rem" },
                      color: T.ink,
                      letterSpacing: "-0.025em",
                      lineHeight: 0.96,
                      mb: 0.5,
                    }}
                  >
                    What you'll
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: SERIF,
                      fontStyle: "italic",
                      fontWeight: 400,
                      fontSize: { xs: "2.25rem", md: "3.5rem" },
                      letterSpacing: "-0.025em",
                      lineHeight: 0.96,
                      background: `linear-gradient(115deg,${T.blueLight},${T.blue})`,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    walk away with.
                  </Typography>
                </Box>
                <Typography
                  sx={{
                    fontFamily: SANS,
                    fontSize: "0.9375rem",
                    color: T.inkMuted,
                    lineHeight: 1.78,
                    maxWidth: 300,
                    mb: 0.5,
                  }}
                >
                  Every session is structured. Every session delivers real
                  outputs.
                </Typography>
              </Box>
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
                initial={{ opacity: 0, y: 28, filter: "blur(5px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.55, delay: i * 0.1, ease: EASE }}
              >
                <TiltCard intensity={4}>
                  <Box
                    sx={{
                      p: 3.5,
                      borderRadius: "16px",
                      background: T.bg,
                      border: `1px solid ${T.border}`,
                      height: "100%",
                      position: "relative",
                      overflow: "hidden",
                      transition: "border-color 0.2s",
                      "&:hover": { borderColor: `${item.accent}35` },
                    }}
                  >
                    <Box
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: "1.5px",
                        background: `linear-gradient(90deg,${item.accent}66,transparent)`,
                      }}
                    />
                    <Box
                      sx={{
                        position: "absolute",
                        right: -8,
                        bottom: -16,
                        fontFamily: SERIF,
                        fontStyle: "italic",
                        fontSize: "6rem",
                        color: "rgba(9,9,11,0.025)",
                        pointerEvents: "none",
                        userSelect: "none",
                        letterSpacing: "-0.04em",
                        lineHeight: 1,
                      }}
                    >
                      {item.glyph}
                    </Box>
                    <Box sx={{ position: "relative", zIndex: 1 }}>
                      <Box
                        sx={{
                          width: 38,
                          height: 38,
                          borderRadius: "10px",
                          mb: 2.5,
                          background: `${item.accent}0d`,
                          border: `1px solid ${item.accent}22`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Typography
                          sx={{
                            fontFamily: MONO,
                            fontSize: "0.52rem",
                            letterSpacing: "0.18em",
                            color: item.accent,
                            textTransform: "uppercase",
                          }}
                        >
                          {item.glyph}
                        </Typography>
                      </Box>
                      <Typography
                        sx={{
                          fontFamily: SERIF,
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
                          fontFamily: SANS,
                          fontSize: "0.875rem",
                          color: T.inkMuted,
                          lineHeight: 1.75,
                        }}
                      >
                        {item.body}
                      </Typography>
                    </Box>
                  </Box>
                </TiltCard>
              </motion.div>
            ))}
          </Box>
        </Container>
      </Box>

      {/* ══ FORM ════════════════════════════════════════════════════════ */}
      <Box id="book-form" sx={{ py: { xs: 10, md: 16 }, background: T.bgSub }}>
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
                <Box
                  sx={{
                    width: 26,
                    height: "1px",
                    background: `linear-gradient(90deg,${T.blue},${T.blueLight})`,
                  }}
                />
                <Typography
                  sx={{
                    fontFamily: MONO,
                    fontSize: "0.54rem",
                    letterSpacing: "0.22em",
                    color: T.blueMid,
                    textTransform: "uppercase",
                  }}
                >
                  Free Strategy Session
                </Typography>
                <Box
                  sx={{
                    width: 26,
                    height: "1px",
                    background: `linear-gradient(90deg,${T.blueLight},${T.blue})`,
                  }}
                />
              </Box>
              <Typography
                sx={{
                  fontFamily: SERIF,
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
                  fontFamily: SANS,
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

          <Box
            ref={formCardRef}
            sx={{ position: "relative", maxWidth: 680, mx: "auto" }}
          >
            <CursorGlow containerRef={formCardRef} />

            <Box
              sx={{
                position: "relative",
                zIndex: 1,
                background: T.bg,
                borderRadius: "20px",
                border: `1px solid ${T.border}`,
                p: { xs: 3, md: 5 },
                boxShadow:
                  "0 4px 40px rgba(9,9,11,0.06), 0 1px 2px rgba(9,9,11,0.03)",
              }}
            >
              <AnimatePresence mode="wait">
                {/* ── SUCCESS ── */}
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
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 240,
                          damping: 18,
                          delay: 0.1,
                        }}
                      >
                        <Box sx={{ position: "relative" }}>
                          <motion.div
                            animate={{
                              scale: [1, 1.2, 1],
                              opacity: [0.18, 0, 0.18],
                            }}
                            transition={{
                              duration: 2.4,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                            style={{
                              position: "absolute",
                              inset: -12,
                              borderRadius: "50%",
                              border: `1.5px solid ${T.blue}`,
                              pointerEvents: "none",
                            }}
                          />
                          <Box
                            sx={{
                              width: 80,
                              height: 80,
                              borderRadius: "50%",
                              background: T.bgBlueSm,
                              border: `1.5px solid ${T.borderBlue}`,
                              boxShadow: `0 6px 28px ${T.blueGlowSm}`,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <svg
                              width="32"
                              height="32"
                              viewBox="0 0 32 32"
                              fill="none"
                            >
                              <motion.path
                                d="M7 16L13 22L25 10"
                                stroke={T.blue}
                                strokeWidth="2.6"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{
                                  delay: 0.3,
                                  duration: 0.5,
                                  ease: EASE,
                                }}
                              />
                            </svg>
                          </Box>
                        </Box>
                      </motion.div>
                      <Typography
                        sx={{
                          fontFamily: SERIF,
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
                          fontFamily: SANS,
                          fontSize: "1rem",
                          color: T.inkMuted,
                          lineHeight: 1.75,
                          maxWidth: 360,
                        }}
                      >
                        Parag or Khyati will personally review your submission
                        and reach out within 24 hours to schedule your session.
                      </Typography>
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
                            border: `1.5px solid ${T.borderBlue}`,
                            color: T.blue,
                            fontFamily: SANS,
                            fontWeight: 500,
                            fontSize: "0.875rem",
                            textDecoration: "none",
                            background: T.bgBlueSm,
                            transition: "all 0.2s",
                            "&:hover": {
                              background: T.bgBlueMd,
                              borderColor: T.bluePale,
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
                  <motion.div key="form">
                    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                      <StepBar current={formStep} total={3} />

                      <Box sx={{ mb: 4 }}>
                        <Typography
                          sx={{
                            fontFamily: MONO,
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
                            fontFamily: SERIF,
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

                      <AnimatePresence mode="wait">
                        {/* Step 1 */}
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
                                <Field label="Company name">
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

                        {/* Step 2 */}
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
                                            border: `1.5px solid ${field.value === opt.value ? T.borderBlue : T.border}`,
                                            background:
                                              field.value === opt.value
                                                ? T.bgBlueSm
                                                : T.bg,
                                            cursor: "pointer",
                                            textAlign: "left",
                                            transition: "all 0.15s",
                                            outline: "none",
                                            "&:hover": {
                                              borderColor: T.borderBlue,
                                              background: T.bgBlueSm,
                                            },
                                          }}
                                        >
                                          <Typography
                                            sx={{
                                              fontFamily: SANS,
                                              fontSize: "0.8125rem",
                                              fontWeight:
                                                field.value === opt.value
                                                  ? 600
                                                  : 400,
                                              color:
                                                field.value === opt.value
                                                  ? T.blue
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

                        {/* Step 3 */}
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
                                  background: T.bgSub,
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
                                        fontFamily: MONO,
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
                                        fontFamily: SANS,
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
                                  border: `1px solid ${T.sageBdr}`,
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
                                    fontFamily: SANS,
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
                                    background: T.errorLight,
                                    border: `1px solid rgba(220,38,38,0.15)`,
                                    mb: 2.5,
                                  }}
                                >
                                  <Typography
                                    sx={{
                                      fontFamily: SANS,
                                      fontSize: "0.8rem",
                                      color: T.error,
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
                                    py: 1.75,
                                    borderRadius: "10px",
                                    background: isPending
                                      ? T.bgMuted
                                      : `linear-gradient(115deg,${T.bgBlueMd},${T.bgBlue})`,
                                    border: `1.5px solid ${isPending ? T.border : T.borderBlue}`,
                                    cursor: isPending
                                      ? "not-allowed"
                                      : "pointer",
                                    transition: "all 0.2s",
                                    boxShadow: isPending
                                      ? "none"
                                      : `0 4px 18px ${T.blueGlowSm}`,
                                    "&:hover:not(:disabled)": {
                                      background: `linear-gradient(115deg,${T.bluePale}55,${T.bgBlueMd})`,
                                      boxShadow: `0 6px 24px ${T.blueGlow}`,
                                    },
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
                                            border: `2px solid ${T.borderBlue}`,
                                            borderTopColor: T.blue,
                                            borderRadius: "50%",
                                          }}
                                        />
                                      </motion.div>
                                      <Typography
                                        sx={{
                                          fontFamily: SANS,
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
                                        fontFamily: SANS,
                                        fontWeight: 600,
                                        fontSize: "0.9375rem",
                                        color: T.blue,
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

                      {/* Nav buttons */}
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
                                fontFamily: SANS,
                                fontSize: "0.875rem",
                                color: T.inkMuted,
                                transition: "all 0.15s",
                                "&:hover": {
                                  borderColor: T.borderBlue,
                                  color: T.blue,
                                  background: T.bgBlueSm,
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
                                background: `linear-gradient(115deg,${T.bgBlueMd},${T.bgBlue})`,
                                border: `1.5px solid ${T.borderBlue}`,
                                cursor: "pointer",
                                fontFamily: SANS,
                                fontWeight: 600,
                                fontSize: "0.875rem",
                                color: T.blue,
                                display: "flex",
                                alignItems: "center",
                                gap: 0.75,
                                transition: "all 0.15s",
                                boxShadow: `0 2px 10px ${T.blueGlowSm}`,
                                "&:hover": {
                                  background: `linear-gradient(115deg,${T.bluePale}55,${T.bgBlueMd})`,
                                  boxShadow: `0 4px 16px ${T.blueGlow}`,
                                },
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
