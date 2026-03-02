"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { WhyMerrakiSection } from "./Whymerrakisection";

/* ═══════════════════════════════════════════════════════════════
   DESIGN TOKENS
═══════════════════════════════════════════════════════════════ */
const C = {
  parchment: "#FFFFFF",
  cream: "#F5F3ED",
  paper: "#EFECEA",
  silk: "#E8E4DC",
  obsidian: "#0E0C09",
  inkDark: "#1E1C17",
  ink: "#2E2C26",
  inkMid: "#4A4840",
  inkMuted: "#6E6C64",
  inkFaint: "#9E9C94",
  gold: "#B08A2E",
  goldMid: "#C9A84C",
  goldLight: "#DFC06A",
  goldPale: "#EDD98A",
  goldGlow: "rgba(176,138,46,0.18)",
  goldDim: "rgba(176,138,46,0.10)",
  goldBorder: "rgba(176,138,46,0.22)",
  border: "rgba(14,12,9,0.07)",
  borderMid: "rgba(14,12,9,0.12)",
  borderHard: "rgba(14,12,9,0.18)",
};

const FONT_SERIF = `"Cormorant Garamond", "Playfair Display", Georgia, serif`;
const FONT_SANS = `"Outfit", "DM Sans", sans-serif`;
const FONT_MONO = `"JetBrains Mono", "Fira Code", monospace`;
const EASE = [0.16, 1, 0.3, 1] as const;

/* ═══════════════════════════════════════════════════════════════
   REUSABLE ATOMS
═══════════════════════════════════════════════════════════════ */
function GoldLine({ width = 28 }: { width?: number }) {
  return (
    <div
      style={{
        width,
        height: 1,
        flexShrink: 0,
        background: `linear-gradient(90deg, ${C.gold}, ${C.goldLight})`,
      }}
    />
  );
}
/* ═══════════════════════════════════════════════════════════════
   HERO BACKGROUND LAYERS
═══════════════════════════════════════════════════════════════ */
function HeroBackground() {
  return (
    <>
      {/* Base gradient */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(152deg, ${C.parchment} 0%, ${C.cream} 45%, #EDE9E0 100%)`,
        }}
      />

      {/* Subtle grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          backgroundImage: `
          linear-gradient(${C.border} 1px, transparent 1px),
          linear-gradient(90deg, ${C.border} 1px, transparent 1px)
        `,
          backgroundSize: "88px 88px",
        }}
      />

      {/* Thin vertical editorial rule */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: "32%",
          width: 1,
          height: "100%",
          background: `linear-gradient(180deg,
          transparent 0%, ${C.borderMid} 20%,
          ${C.borderMid} 80%, transparent 100%)`,
          pointerEvents: "none",
        }}
      />

      {/* Gold bloom — top right */}
      <div
        style={{
          position: "absolute",
          width: 920,
          height: 920,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(201,168,76,0.10) 0%, transparent 58%)`,
          top: -320,
          right: -220,
          pointerEvents: "none",
        }}
      />

      {/* Soft gold bloom — bottom left */}
      <div
        style={{
          position: "absolute",
          width: 560,
          height: 560,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(176,138,46,0.07) 0%, transparent 60%)`,
          bottom: -140,
          left: -120,
          pointerEvents: "none",
        }}
      />
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   LEFT COLUMN — Headline, body copy, CTAs, stats
═══════════════════════════════════════════════════════════════ */
function HeroLeft() {
  return (
    <div>
      {/* Eyebrow label */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: EASE }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 34,
          }}
        >
          <GoldLine />
          <span
            style={{
              fontFamily: FONT_MONO,
              fontSize: "0.58rem",
              letterSpacing: "0.24em",
              color: C.gold,
              textTransform: "uppercase",
            }}
          >
            Finance Intelligence for Founders
          </span>
        </div>
      </motion.div>

      {/* Headline */}
      <motion.div
        initial={{ opacity: 0, y: 48 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.0, delay: 0.08, ease: EASE }}
      >
        <h1
          style={{
            fontFamily: FONT_SERIF,
            fontStyle: "italic",
            fontWeight: 300,
            fontSize: "clamp(3.4rem, 5.8vw, 6rem)",
            lineHeight: 0.92,
            letterSpacing: "-0.042em",
            color: C.inkDark,
            margin: "0 0 8px",
          }}
        >
          Helping founders
        </h1>
        <h1
          style={{
            fontFamily: FONT_SERIF,
            fontStyle: "italic",
            fontWeight: 400,
            fontSize: "clamp(3.4rem, 5.8vw, 6rem)",
            lineHeight: 0.92,
            letterSpacing: "-0.042em",
            margin: "0 0 22px",
            background: `linear-gradient(108deg, ${C.gold} 0%, ${C.goldPale} 68%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          grow financially.
        </h1>
        {/* Decorative gold rule */}
        <div
          style={{
            width: 52,
            height: 2,
            background: `linear-gradient(90deg, ${C.gold}, ${C.goldLight})`,
            borderRadius: 1,
            marginBottom: 28,
          }}
        />
      </motion.div>

      {/* Body copy */}
      <motion.p
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, delay: 0.22, ease: EASE }}
        style={{
          fontFamily: FONT_SANS,
          fontSize: "1.06rem",
          color: C.inkMid,
          lineHeight: 1.88,
          maxWidth: 450,
          margin: "0 0 46px",
        }}
      >
        Whether you're struggling with fundraising, managing cash flow, or
        making sense of your numbers — we bring{" "}
        <em style={{ fontStyle: "normal", color: C.inkDark, fontWeight: 500 }}>
          clarity, structure, and strategy
        </em>{" "}
        to your finances.
      </motion.p>

      {/* CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, delay: 0.36, ease: EASE }}
        style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 54 }}
      >
        <motion.a
          href="/book-consultation"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.97 }}
          style={{
            fontFamily: FONT_SANS,
            fontSize: "0.88rem",
            fontWeight: 600,
            color: C.obsidian,
            textDecoration: "none",
            padding: "14px 32px",
            borderRadius: 11,
            background: `linear-gradient(135deg, ${C.gold}, ${C.goldLight})`,
            boxShadow: `0 4px 26px ${C.goldGlow}, 0 1px 0 rgba(255,255,255,0.3) inset`,
            letterSpacing: "0.02em",
          }}
        >
          Book Free Call →
        </motion.a>
        </motion.div>

      {/* Stats strip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.65, delay: 0.52, ease: EASE }}
        style={{
          display: "flex",
          paddingTop: 26,
          borderTop: `1px solid ${C.border}`,
        }}
      >
        {[
          { val: "300+", label: "Founders Advised" },
          { val: "₹50Cr+", label: "Revenue Modelled" },
          { val: "150+", label: "Models Delivered" },
          { val: "5 Yrs", label: "Deep Expertise" },
        ].map((s, i) => (
          <div
            key={s.label}
            style={{
              paddingLeft: i > 0 ? 22 : 0,
              paddingRight: 22,
              borderLeft: i > 0 ? `1px solid ${C.border}` : "none",
            }}
          >
            <div
              style={{
                fontFamily: FONT_MONO,
                fontSize: "1.05rem",
                fontWeight: 500,
                color: C.inkDark,
                letterSpacing: "-0.025em",
                lineHeight: 1,
              }}
            >
              {s.val}
            </div>
            <div
              style={{
                fontFamily: FONT_MONO,
                fontSize: "0.47rem",
                letterSpacing: "0.13em",
                color: C.inkFaint,
                textTransform: "uppercase",
                marginTop: 5,
              }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   RIGHT COLUMN — Feature cards + testimonial
═══════════════════════════════════════════════════════════════ */
function HeroRight() {
  const cards = [
    {
      icon: "◈",
      title: "3-Statement Models",
      desc: "Audit-ready P&L, Balance Sheet, Cash Flow — boardroom-confident.",
    },
    {
      icon: "⊞",
      title: "Live Excel Dashboards",
      desc: "Decisions from data, not spreadsheet chaos.",
    },
    {
      icon: "◎",
      title: "CFO-as-a-Service",
      desc: "Strategic finance partner — on demand, no full-time hire.",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 42 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 1.1, delay: 0.14, ease: EASE }}
      style={{ display: "flex", flexDirection: "column", gap: 18 }}
    >
      {/* Feature cards */}
      {cards.map((card, i) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, x: 32 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.28 + i * 0.12, duration: 0.7, ease: EASE }}
          whileHover={{ x: 5 }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = C.goldBorder;
            e.currentTarget.style.boxShadow = `0 10px 36px rgba(14,12,9,0.09), 0 0 0 1px ${C.goldBorder}, 0 1px 0 rgba(255,255,255,0.8) inset`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = C.border;
            e.currentTarget.style.boxShadow =
              "0 2px 14px rgba(14,12,9,0.04), 0 1px 0 rgba(255,255,255,0.8) inset";
          }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            padding: "18px 22px",
            background: "rgba(255,255,255,0.78)",
            border: `1px solid ${C.border}`,
            borderRadius: 15,
            backdropFilter: "blur(14px)",
            boxShadow:
              "0 2px 14px rgba(14,12,9,0.04), 0 1px 0 rgba(255,255,255,0.8) inset",
            cursor: "default",
            transition: "border-color 0.25s ease, box-shadow 0.25s ease",
          }}
        >
          {/* Icon badge */}
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 11,
              flexShrink: 0,
              background: `linear-gradient(135deg, ${C.goldDim}, rgba(212,174,88,0.05))`,
              border: `1px solid ${C.goldBorder}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.05rem",
              color: C.gold,
            }}
          >
            {card.icon}
          </div>

          {/* Text */}
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontFamily: FONT_SANS,
                fontSize: "0.875rem",
                fontWeight: 600,
                color: C.inkDark,
                marginBottom: 3,
              }}
            >
              {card.title}
            </div>
            <div
              style={{
                fontFamily: FONT_SANS,
                fontSize: "0.78rem",
                color: C.inkMuted,
                lineHeight: 1.55,
              }}
            >
              {card.desc}
            </div>
          </div>

          <span
            style={{
              color: C.inkFaint,
              fontSize: "0.7rem",
              marginLeft: "auto",
            }}
          >
            →
          </span>
        </motion.div>
      ))}

      {/* Testimonial chip */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.68, duration: 0.65, ease: EASE }}
        style={{
          padding: "18px 22px",
          background: C.goldDim,
          border: `1px solid ${C.goldBorder}`,
          borderRadius: 15,
          display: "flex",
          gap: 13,
          alignItems: "flex-start",
        }}
      >
        <div
          style={{
            fontFamily: FONT_SERIF,
            fontSize: "2rem",
            color: C.gold,
            lineHeight: 1,
            marginTop: -4,
            flexShrink: 0,
          }}
        >
          "
        </div>
        <div>
          <p
            style={{
              fontFamily: FONT_SERIF,
              fontStyle: "italic",
              fontSize: "0.93rem",
              color: C.inkDark,
              lineHeight: 1.65,
              margin: "0 0 8px",
            }}
          >
            Merraki built our Series A model in 4 days. Investors loved the
            clarity.
          </p>
          <div
            style={{
              fontFamily: FONT_MONO,
              fontSize: "0.5rem",
              color: C.inkMuted,
              textTransform: "uppercase",
              letterSpacing: "0.13em",
            }}
          >
            — Founder, D2C Startup · ₹8Cr raised
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SCROLL INDICATOR
═══════════════════════════════════════════════════════════════ */
function ScrollCue() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.3, duration: 0.6 }}
      style={{
        position: "absolute",
        bottom: 30,
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
        zIndex: 10,
      }}
    >
      {/* Scroll pill */}
      <motion.div
        animate={{ y: [0, 9, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        style={{
          width: 22,
          height: 36,
          borderRadius: 11,
          border: `1.5px solid ${C.borderHard}`,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "4px 0",
        }}
      >
        <motion.div
          animate={{ y: [0, 14, 0], opacity: [1, 0.15, 1] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          style={{ width: 3, height: 7, borderRadius: 2, background: C.gold }}
        />
      </motion.div>
      <span
        style={{
          fontFamily: FONT_MONO,
          fontSize: "0.43rem",
          letterSpacing: "0.2em",
          color: C.inkFaint,
          textTransform: "uppercase",
        }}
      >
        scroll
      </span>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   HERO SECTION  (pure hero — no chat, no calc embedded here)
═══════════════════════════════════════════════════════════════ */
function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const translateY = useTransform(scrollYProgress, [0, 1], ["0%", "16%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section
      ref={heroRef}
      style={{
        minHeight: "100vh",
        paddingTop: 64,
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <HeroBackground />

      <motion.div
        style={{
          y: translateY,
          opacity,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "68px 52px 52px",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1.08fr",
              gap: "76px",
              alignItems: "center",
            }}
          >
            <HeroLeft />
            <HeroRight />
          </div>
        </div>
      </motion.div>

      <ScrollCue />
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PAGE ROOT EXPORT
   Renders: NavBar → Hero → WhyMerrakiSection (chat)
═══════════════════════════════════════════════════════════════ */
export function HeroSection() {
  return (
    <div
      style={{
        fontFamily: FONT_SANS,
        background: C.parchment,
        overflowX: "hidden",
      }}
    >
      <Hero />
      {/* Chat section mounts directly after hero */}
      <WhyMerrakiSection />
    </div>
  );
}

export default HeroSection;
