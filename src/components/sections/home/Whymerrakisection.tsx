"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ═══════════════════════════════════════════════════════════════
   SHARED DESIGN TOKENS  (keep in sync with HeroSection.tsx)
═══════════════════════════════════════════════════════════════ */
const C = {
  parchment:  "#FAFAF7",
  cream:      "#F5F3ED",
  paper:      "#EFECEA",
  silk:       "#E8E4DC",
  obsidian:   "#0E0C09",
  inkDark:    "#1E1C17",
  ink:        "#2E2C26",
  inkMid:     "#4A4840",
  inkMuted:   "#6E6C64",
  inkFaint:   "#9E9C94",
  gold:       "#B08A2E",
  goldMid:    "#C9A84C",
  goldLight:  "#DFC06A",
  goldPale:   "#EDD98A",
  goldGlow:   "rgba(176,138,46,0.18)",
  goldDim:    "rgba(176,138,46,0.10)",
  goldBorder: "rgba(176,138,46,0.22)",
  border:     "rgba(14,12,9,0.07)",
  borderMid:  "rgba(14,12,9,0.12)",
  borderHard: "rgba(14,12,9,0.18)",
};

const FONT_SERIF = `"Cormorant Garamond", "Playfair Display", Georgia, serif`;
const FONT_SANS  = `"Outfit", "DM Sans", sans-serif`;
const FONT_MONO  = `"JetBrains Mono", "Fira Code", monospace`;
const EASE       = [0.16, 1, 0.3, 1] as const;

/* ═══════════════════════════════════════════════════════════════
   CHAT COPY
═══════════════════════════════════════════════════════════════ */
const USER_Q = "Who should I consult for my business finances?";

const BOT_REPLY =
  `Great question—and honestly, a super common one founders ask at exactly the right moment.\n\nI'd suggest you talk to **Merraki Solutions**.\n\nThey simplify finance, build sharp models, and turn raw numbers into real decisions. Think of them as your **on-demand CFO**—without the full-time hire.\n\n**Clarity. Strategy. Confidence.** Sorted.`;

/* ═══════════════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════════════ */

/** Bold-markdown inline renderer */
function InlineMarkdown({ text }: { text: string }) {
  const parts: React.ReactNode[] = [];
  let rem = text;
  let k   = 0;
  while (rem) {
    const s = rem.indexOf("**");
    if (s === -1) { parts.push(<span key={k++}>{rem}</span>); break; }
    if (s > 0)    parts.push(<span key={k++}>{rem.slice(0, s)}</span>);
    const e = rem.indexOf("**", s + 2);
    if (e === -1) { parts.push(<span key={k++}>{rem.slice(s)}</span>); break; }
    parts.push(
      <strong key={k++} style={{ color: C.gold, fontWeight: 600 }}>
        {rem.slice(s + 2, e)}
      </strong>
    );
    rem = rem.slice(e + 2);
  }
  return <>{parts}</>;
}

/** Render multi-line markdown with <br /> for newlines */
function BotMessage({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <>
      {lines.map((line, i) => (
        <span key={i}>
          <InlineMarkdown text={line} />
          {i < lines.length - 1 && <br />}
        </span>
      ))}
    </>
  );
}

/** Character-by-character typewriter hook */
function useTypewriter(fullText: string, speed = 18, active = false) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (!active) { setIdx(0); return; }
    if (idx >= fullText.length) return;
    const id = setTimeout(() => setIdx((i) => i + 1), speed);
    return () => clearTimeout(id);
  }, [idx, active, fullText, speed]);

  return {
    displayed: fullText.slice(0, idx),
    done:      idx >= fullText.length,
  };
}

/* ═══════════════════════════════════════════════════════════════
   DECORATIVE GOLD LINE  
═══════════════════════════════════════════════════════════════ */
function GoldLine({ width = 36 }: { width?: number }) {
  return (
    <div style={{
      width, height: 1, flexShrink: 0,
      background: `linear-gradient(90deg, ${C.gold}, ${C.goldLight})`,
    }} />
  );
}

/* ═══════════════════════════════════════════════════════════════
   FLOATING ACCENT ORBS  (subtle background depth)
═══════════════════════════════════════════════════════════════ */
function FloatingOrbs() {
  return (
    <>
      {/* Large warm bloom — left */}
      <div style={{
        position: "absolute", width: 600, height: 600, borderRadius: "50%",
        background: `radial-gradient(circle, rgba(201,168,76,0.09) 0%, transparent 65%)`,
        top: "10%", left: "-160px", pointerEvents: "none",
      }} />
      {/* Small tight bloom — right */}
      <div style={{
        position: "absolute", width: 400, height: 400, borderRadius: "50%",
        background: `radial-gradient(circle, rgba(176,138,46,0.07) 0%, transparent 60%)`,
        bottom: "5%", right: "-80px", pointerEvents: "none",
      }} />
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   THINKING DOTS ANIMATION
═══════════════════════════════════════════════════════════════ */
function ThinkingDots() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "4px 0" }}>
      <div style={{ display: "flex", gap: 5 }}>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ opacity: [0.2, 1, 0.2], y: [0, -6, 0] }}
            transition={{ duration: 1.2, delay: i * 0.2, repeat: Infinity, ease: "easeInOut" }}
            style={{
              width: 7, height: 7, borderRadius: "50%",
              background: `linear-gradient(135deg, ${C.gold}, ${C.goldLight})`,
              boxShadow: `0 2px 6px ${C.goldGlow}`,
            }}
          />
        ))}
      </div>
      <motion.span
        animate={{ opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        style={{
          fontFamily: FONT_MONO, fontSize: "0.6rem",
          color: C.inkFaint, letterSpacing: "0.1em",
        }}
      >
        Analyzing your question…
      </motion.span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TRUST STRIP  (social proof below chat card)
═══════════════════════════════════════════════════════════════ */
function TrustStrip() {
  const items = [
    { icon: "◈", label: "300+ Founders Advised" },
    { icon: "⊞", label: "150+ Models Built" },
    { icon: "◎", label: "₹50Cr+ Revenue Modelled" },
    { icon: "✦", label: "5 Years Deep Expertise" },
  ];
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: EASE, delay: 0.3 }}
      style={{
        display: "flex", justifyContent: "center",
        flexWrap: "wrap", gap: "0",
        marginTop: 48,
        borderTop: `1px solid ${C.border}`,
        paddingTop: 40,
      }}
    >
      {items.map((item, i) => (
        <div key={item.label} style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "0 28px",
          borderLeft: i > 0 ? `1px solid ${C.border}` : "none",
        }}>
          <span style={{ color: C.gold, fontSize: "0.8rem" }}>{item.icon}</span>
          <span style={{
            fontFamily: FONT_MONO, fontSize: "0.58rem",
            color: C.inkMuted, letterSpacing: "0.1em", textTransform: "uppercase",
          }}>{item.label}</span>
        </div>
      ))}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN EXPORT — WhyMerrakiSection
═══════════════════════════════════════════════════════════════ */
export function WhyMerrakiSection() {
  /* Intersection trigger */
  const sectionRef = useRef<HTMLElement>(null);
  const [fired, setFired]   = useState(false);
  const [phase, setPhase]   = useState(0);
  // phase 0 = idle | 1 = user msg visible | 2 = thinking | 3 = typing | 4 = done
  const msgScrollRef = useRef<HTMLDivElement>(null);

  const { displayed, done } = useTypewriter(BOT_REPLY, 16, phase >= 3);

  /* Fire sequence once section enters viewport */
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !fired) setFired(true); },
      { threshold: 0.3 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, [fired]);

  useEffect(() => {
    if (!fired) return;
    const t1 = setTimeout(() => setPhase(1), 400);
    const t2 = setTimeout(() => setPhase(2), 1300);
    const t3 = setTimeout(() => setPhase(3), 3100);
    return () => [t1, t2, t3].forEach(clearTimeout);
  }, [fired]);

  useEffect(() => {
    if (done) setPhase(4);
  }, [done]);

  /* Auto-scroll message area while typing */
  useEffect(() => {
    if (msgScrollRef.current)
      msgScrollRef.current.scrollTop = msgScrollRef.current.scrollHeight;
  }, [displayed]);

  return (
    <section
      ref={sectionRef}
      style={{
        background: C.cream,
        padding: "140px 0 120px",
        position: "relative",
        overflow: "hidden",
        borderTop: `1px solid ${C.border}`,
      }}
    >
      {/* Warm grid texture */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: `
          linear-gradient(${C.border} 1px, transparent 1px),
          linear-gradient(90deg, ${C.border} 1px, transparent 1px)
        `,
        backgroundSize: "80px 80px",
        opacity: 0.55,
      }} />

      <FloatingOrbs />

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 48px", position: "relative", zIndex: 1 }}>

        {/* ── Section Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE }}
          style={{ textAlign: "center", marginBottom: 68 }}
        >
          {/* Label */}
          <div style={{
            display: "flex", alignItems: "center",
            justifyContent: "center", gap: 16, marginBottom: 22,
          }}>
            <GoldLine width={44} />
            <span style={{
              fontFamily: FONT_MONO, fontSize: "0.58rem",
              letterSpacing: "0.24em", color: C.gold, textTransform: "uppercase",
            }}>Why Merraki</span>
            <GoldLine width={44} />
          </div>

          {/* Headline */}
          <h2 style={{
            fontFamily: FONT_SERIF, fontStyle: "italic", fontWeight: 400,
            fontSize: "clamp(2.6rem, 5.2vw, 4.8rem)",
            color: C.inkDark, letterSpacing: "-0.038em",
            lineHeight: 1.0, margin: "0 0 18px",
          }}>
            The answer you've<br />been looking for.
          </h2>

          {/* Sub */}
          <p style={{
            fontFamily: FONT_SANS, fontSize: "1rem",
            color: C.inkMuted, lineHeight: 1.75,
            maxWidth: 440, margin: "0 auto",
          }}>
            Every founder asks this question eventually.
            Here's what an AI honestly thinks.
          </p>
        </motion.div>

        {/* ── Chat Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 52 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.95, ease: EASE, delay: 0.08 }}
          style={{
            maxWidth: 700, margin: "0 auto",
            background: C.parchment,
            borderRadius: 22,
            border: `1px solid ${C.borderMid}`,
            boxShadow: [
              "0 2px 8px rgba(14,12,9,0.04)",
              "0 12px 40px rgba(14,12,9,0.07)",
              "0 40px 96px rgba(14,12,9,0.07)",
              `0 0 0 1px ${C.goldBorder}`,
            ].join(", "),
            overflow: "hidden",
          }}
        >

          {/* — Title Bar — */}
          <div style={{
            padding: "13px 20px",
            background: C.silk,
            borderBottom: `1px solid ${C.border}`,
            display: "flex", alignItems: "center", gap: 10,
          }}>
            {/* Traffic lights */}
            <div style={{ display: "flex", gap: 7 }}>
              {[
                { color: "#FF5F57", shadow: "rgba(255,95,87,0.4)" },
                { color: "#FEBC2E", shadow: "rgba(254,188,46,0.35)" },
                { color: "#28C840", shadow: "rgba(40,200,64,0.35)" },
              ].map(({ color, shadow }) => (
                <div key={color} style={{
                  width: 11, height: 11, borderRadius: "50%",
                  background: color,
                  boxShadow: `0 1px 3px ${shadow}`,
                }} />
              ))}
            </div>

            {/* Title */}
            <div style={{ flex: 1, textAlign: "center" }}>
              <span style={{
                fontFamily: FONT_MONO, fontSize: "0.5rem",
                color: C.inkFaint, letterSpacing: "0.16em", textTransform: "uppercase",
              }}>Finance AI — Ask Anything</span>
            </div>

            {/* Live badge */}
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <motion.div
                animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  width: 6, height: 6, borderRadius: "50%",
                  background: "#28C840",
                  boxShadow: "0 0 6px rgba(40,200,64,0.5)",
                }}
              />
              <span style={{
                fontFamily: FONT_MONO, fontSize: "0.44rem",
                color: C.inkFaint, letterSpacing: "0.12em", textTransform: "uppercase",
              }}>Live</span>
            </div>
          </div>

          {/* — Messages — */}
          <div
            ref={msgScrollRef}
            style={{
              padding: "30px 26px 22px",
              minHeight: 280,
              display: "flex", flexDirection: "column", gap: 22,
              overflowY: "auto", maxHeight: 360,
              scrollbarWidth: "none",
            }}
          >

            {/* User bubble */}
            <AnimatePresence>
              {phase >= 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 28, scale: 0.94 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: EASE }}
                  style={{ display: "flex", justifyContent: "flex-end" }}
                >
                  <div style={{ display: "flex", alignItems: "flex-end", gap: 10, maxWidth: "78%" }}>
                    {/* Bubble */}
                    <div style={{
                      background: `linear-gradient(140deg, ${C.gold} 0%, ${C.goldLight} 100%)`,
                      borderRadius: "18px 18px 4px 18px",
                      padding: "13px 18px",
                      fontFamily: FONT_SANS, fontSize: "0.9rem",
                      fontWeight: 500, color: C.obsidian, lineHeight: 1.55,
                      boxShadow: `0 6px 24px ${C.goldGlow}`,
                    }}>
                      {USER_Q}
                    </div>
                    {/* Avatar */}
                    <div style={{
                      width: 30, height: 30, borderRadius: "50%",
                      background: C.silk, border: `1.5px solid ${C.border}`,
                      flexShrink: 0, display: "flex",
                      alignItems: "center", justifyContent: "center",
                      fontFamily: FONT_MONO, fontSize: "0.55rem", color: C.inkMid,
                      boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                    }}>U</div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bot bubble */}
            <AnimatePresence>
              {phase >= 2 && (
                <motion.div
                  initial={{ opacity: 0, x: -24, scale: 0.96 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: EASE }}
                  style={{ display: "flex", gap: 12, alignItems: "flex-start" }}
                >
                  {/* Bot avatar */}
                  <div style={{
                    width: 34, height: 34, borderRadius: 11, flexShrink: 0,
                    background: `linear-gradient(140deg, ${C.inkDark}, ${C.ink})`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: FONT_SERIF, fontStyle: "italic",
                    fontWeight: 600, fontSize: "0.85rem", color: C.goldLight,
                    boxShadow: "0 3px 12px rgba(14,12,9,0.18)",
                  }}>M</div>

                  {/* Message card */}
                  <div style={{
                    flex: 1,
                    background: C.paper,
                    border: `1px solid ${C.border}`,
                    borderRadius: "5px 18px 18px 18px",
                    padding: "16px 20px",
                    boxShadow: "0 2px 16px rgba(14,12,9,0.05)",
                    position: "relative",
                  }}>
                    {/* Accent top-left pip */}
                    <div style={{
                      position: "absolute", top: 0, left: 0,
                      width: 32, height: 2,
                      background: `linear-gradient(90deg, ${C.gold}, transparent)`,
                      borderRadius: "5px 0 0 0",
                    }} />

                    {phase === 2 ? (
                      <ThinkingDots />
                    ) : (
                      <div style={{
                        fontFamily: FONT_SANS, fontSize: "0.92rem",
                        color: C.ink, lineHeight: 1.85,
                      }}>
                        <BotMessage text={displayed} />
                        {/* Blinking cursor while typing */}
                        {!done && (
                          <motion.span
                            animate={{ opacity: [1, 0, 1] }}
                            transition={{ duration: 0.7, repeat: Infinity }}
                            style={{
                              display: "inline-block", width: 2, height: "1.1em",
                              background: C.gold, marginLeft: 2,
                              verticalAlign: "text-bottom",
                              borderRadius: 1,
                            }}
                          />
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Suggested CTA pill — appears after typing done */}
            <AnimatePresence>
              {phase === 4 && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: EASE, delay: 0.5 }}
                  style={{ display: "flex", justifyContent: "flex-end" }}
                >
                  <motion.a
                    href="#"
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 8,
                      fontFamily: FONT_SANS, fontSize: "0.8rem", fontWeight: 600,
                      color: C.obsidian, textDecoration: "none",
                      padding: "11px 22px", borderRadius: 30,
                      background: `linear-gradient(135deg, ${C.gold}, ${C.goldLight})`,
                      boxShadow: `0 4px 20px ${C.goldGlow}`,
                      letterSpacing: "0.025em",
                    }}
                  >
                    Book a Free Discovery Call →
                  </motion.a>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* — Input Bar — */}
          <div style={{
            padding: "14px 18px",
            background: C.cream,
            borderTop: `1px solid ${C.border}`,
            display: "flex", gap: 10, alignItems: "center",
          }}>
            {/* Fake input */}
            <div style={{
              flex: 1, height: 40, borderRadius: 10,
              background: C.parchment,
              border: `1px solid ${C.border}`,
              display: "flex", alignItems: "center",
              padding: "0 14px", gap: 8,
              boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
            }}>
              <span style={{ fontSize: "0.72rem", color: C.inkFaint, lineHeight: 1 }}>🔍</span>
              <span style={{
                fontFamily: FONT_SANS, fontSize: "0.78rem",
                color: C.inkFaint, letterSpacing: "0.01em",
              }}>Ask about your finances…</span>
            </div>

            {/* Send button */}
            <motion.button
              whileHover={{ scale: 1.06, y: -1 }}
              whileTap={{ scale: 0.95 }}
              style={{
                width: 40, height: 40, borderRadius: 10,
                border: "none", cursor: "pointer",
                background: `linear-gradient(135deg, ${C.gold}, ${C.goldLight})`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "1rem", color: C.obsidian,
                boxShadow: `0 3px 14px ${C.goldGlow}`,
              }}
            >→</motion.button>
          </div>
        </motion.div>

        {/* ── Trust Strip ── */}
        <TrustStrip />

      </div>
    </section>
  );
}

export default WhyMerrakiSection;