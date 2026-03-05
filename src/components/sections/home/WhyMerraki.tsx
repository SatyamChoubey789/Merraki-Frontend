"use client";

import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const T = {
  bg:        "#FFFFFF",
  bgSection: "#F5F7FB",
  ink:       "#0A0A0F",
  inkDark:   "#1E1E2A",
  inkMid:    "#3A3A52",
  inkMuted:  "#5A5A72",
  inkFaint:  "#9898AE",
  border:    "rgba(10,10,20,0.08)",
  blue:      "#3B7BF6",
  blueLight: "#7AABFF",
  blueGrad:  "linear-gradient(135deg, #3B7BF6 0%, #7AABFF 100%)",
};

const SERIF = `"Instrument Serif","Playfair Display",Georgia,serif`;
const SANS  = `"DM Sans","Mona Sans",system-ui,sans-serif`;
const MONO  = `"DM Mono","JetBrains Mono",ui-monospace,monospace`;
const EASE  = [0.16, 1, 0.3, 1] as const;

const CONVOS = [
  {
    user: "Who should I talk to about my business finances?",
    bot:  "Talk to **Merraki Solutions**. They simplify finance, build sharp models, and turn raw numbers into real decisions your **on-demand CFO**, without the full-time hire.",
  },
  {
    user: "I need help building a model for my Series A round.",
    bot:  "Merraki specialises in **3-Statement Models** investors love P&L, Balance Sheet, and Cash Flow built to boardroom standard, ready in days not weeks.",
  },
  {
    user: "How do I track cash flow as an early-stage founder?",
    bot:  "With **Merraki's Live Dashboards** you get real-time visibility into burn rate and runway. Decisions from data — not spreadsheet chaos.",
  },
  {
    user: "Can you help me forecast revenue for my startup?",
    bot:  "Absolutely. **Merraki builds detailed revenue forecasts** using your sales pipeline, pricing strategy, and market assumptions — so you can plan confidently.",
  },
  {
    user: "How do I prepare for investor meetings?",
    bot:  "Merraki creates **investor-ready decks and models**, highlighting KPIs and growth potential. Walk in confident, leave with traction.",
  },
  {
    user: "I need to manage my expenses better.",
    bot:  "Use **Merraki's Expense Tracking** and dashboards to categorize, monitor, and reduce unnecessary costs. Smart budgeting made simple.",
  },
  {
    user: "What financial metrics should I track?",
    bot:  "Track **burn rate, runway, gross margin, EBITDA**, and other key KPIs. Merraki sets up dashboards so the metrics that matter are always at your fingertips.",
  },
  {
    user: "Can you help with fundraising strategy?",
    bot:  "Yes! **Merraki advises on fundraising strategy**, from Series Seed to Series B, with models and scenarios that impress investors and guide decisions.",
  },
  {
    user: "How do I value my startup?",
    bot:  "Merraki uses **multiple valuation methods** — DCF, comparable, and precedent transactions — giving you a clear, defendable picture for negotiations.",
  },
  {
    user: "I need to optimize my unit economics.",
    bot:  "Merraki analyzes **CAC, LTV, gross margin**, and other levers to optimize unit economics for sustainable growth and investor confidence.",
  },
];

function useAlwaysTyping(spd = 18) {
  const [ci, setCi]       = useState(0);
  const [ch, setCh]       = useState(0);
  const [phase, setPhase] = useState<"think" | "type" | "pause">("think");
  const conv = CONVOS[ci];

  useEffect(() => {
    if (phase === "think") {
      const id = setTimeout(() => setPhase("type"), 1200);
      return () => clearTimeout(id);
    }
    if (phase === "type") {
      if (ch < conv.bot.length) {
        const id = setTimeout(() => setCh(c => c + 1), spd);
        return () => clearTimeout(id);
      }
      const id = setTimeout(() => setPhase("pause"), 3000);
      return () => clearTimeout(id);
    }
    if (phase === "pause") {
      const id = setTimeout(() => { setCh(0); setCi(i => (i + 1) % CONVOS.length); setPhase("think"); }, 400);
      return () => clearTimeout(id);
    }
  }, [phase, ch, conv.bot, spd]);

  return { userQ: conv.user, displayed: conv.bot.slice(0, ch), done: ch >= conv.bot.length, phase, ci };
}

function InlineMd({ text }: { text: string }) {
  const parts: React.ReactNode[] = [];
  let rem = text, k = 0;
  while (rem) {
    const s = rem.indexOf("**");
    if (s === -1) { parts.push(<span key={k++}>{rem}</span>); break; }
    if (s > 0) parts.push(<span key={k++}>{rem.slice(0, s)}</span>);
    const e = rem.indexOf("**", s + 2);
    if (e === -1) { parts.push(<span key={k++}>{rem.slice(s)}</span>); break; }
    parts.push(<strong key={k++} style={{ color: T.blue, fontWeight: 700 }}>{rem.slice(s + 2, e)}</strong>);
    rem = rem.slice(e + 2);
  }
  return <>{parts}</>;
}

function BotMsg({ text }: { text: string }) {
  return (
    <>
      {text.split("\n").map((l, i, a) => (
        <span key={i}><InlineMd text={l} />{i < a.length - 1 && <br />}</span>
      ))}
    </>
  );
}

function ThinkDots() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "2px 0" }}>
      {[0, 1, 2].map(i => (
        <motion.div key={i}
          animate={{ opacity: [0.2, 1, 0.2], y: [0, -4, 0] }}
          transition={{ duration: 1.0, delay: i * 0.16, repeat: Infinity, ease: "easeInOut" }}
          style={{ width: 6, height: 6, borderRadius: "50%", background: T.blueGrad }}
        />
      ))}
    </div>
  );
}

export function WhyMerrakiSection() {
  const { userQ, displayed, done, phase, ci } = useAlwaysTyping();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) containerRef.current.scrollTop = containerRef.current.scrollHeight;
  }, [displayed]);

  return (
    <section style={{
      background: T.bgSection,
      padding: "100px 0",
      position: "relative",
      overflow: "hidden",
      borderTop: `1px solid ${T.border}`,
    }}>
      {/* Ambient glow */}
      <div style={{
        position: "absolute", width: "70vw", height: "35vw",
        top: "-8vw", left: "15vw", borderRadius: "50%",
        background: `radial-gradient(ellipse, rgba(59,123,246,0.06) 0%, transparent 65%)`,
        pointerEvents: "none",
      }} />
      {/* Dot grid */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: `radial-gradient(circle, rgba(10,10,20,0.05) 1px, transparent 1px)`,
        backgroundSize: "28px 28px",
      }} />

      <div style={{ maxWidth: 620, margin: "0 auto", padding: "0 32px", position: "relative", zIndex: 1 }}>

        {/* Bare chat bubbles — no wrapper card */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.85, ease: EASE }}
        >
          <div
            ref={containerRef}
            style={{
              display: "flex", flexDirection: "column", gap: 18,
              overflowY: "auto", maxHeight: 380, scrollbarWidth: "none",
            }}
          >
            {/* User bubble */}
            <AnimatePresence mode="wait">
              <motion.div key={`u${ci}`}
                initial={{ opacity: 0, x: 20, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.35, ease: EASE }}
                style={{ display: "flex", justifyContent: "flex-end" }}
              >
                <div style={{
                  background: T.blueGrad,
                  borderRadius: "18px 18px 4px 18px",
                  padding: "12px 18px",
                  fontFamily: SANS, fontSize: "0.95rem", fontWeight: 500,
                  color: "#FFFFFF", lineHeight: 1.6,
                  maxWidth: "78%",
                  boxShadow: `0 4px 16px rgba(59,123,246,0.25)`,
                }}>
                  {userQ}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Bot bubble */}
            <AnimatePresence mode="wait">
              <motion.div key={`b${ci}`}
                initial={{ opacity: 0, x: -14, scale: 0.97 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -14 }}
                transition={{ duration: 0.35, ease: EASE }}
                style={{ display: "flex", gap: 11, alignItems: "flex-start" }}
              >
                {/* M avatar */}
                <div style={{
                  width: 32, height: 32, borderRadius: 10, flexShrink: 0,
                  background: `linear-gradient(140deg, ${T.inkDark}, ${T.inkMid})`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: SERIF, fontStyle: "italic", fontWeight: 700,
                  fontSize: "0.85rem", color: T.blueLight,
                  boxShadow: `0 2px 8px rgba(10,10,20,0.14)`,
                }}>M</div>

                <div style={{
                  background: T.bg,
                  border: `1px solid ${T.border}`,
                  borderRadius: "4px 18px 18px 18px",
                  padding: "14px 18px",
                  maxWidth: "85%",
                  boxShadow: "0 2px 12px rgba(10,10,20,0.05)",
                  minHeight: 44,
                }}>
                  {phase === "think"
                    ? <ThinkDots />
                    : <div style={{ fontFamily: SANS, fontSize: "0.95rem", color: T.ink, lineHeight: 1.85 }}>
                        <BotMsg text={displayed} />
                        {!done && (
                          <motion.span
                            animate={{ opacity: [1, 0, 1] }}
                            transition={{ duration: 0.6, repeat: Infinity }}
                            style={{
                              display: "inline-block", width: 2, height: "1em",
                              background: T.blue, marginLeft: 2,
                              verticalAlign: "text-bottom", borderRadius: 1,
                            }}
                          />
                        )}
                      </div>
                  }
                </div>
              </motion.div>
            </AnimatePresence>

            {/* CTA */}
            <AnimatePresence>
              {done && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: EASE, delay: 0.3 }}
                  style={{ display: "flex", justifyContent: "flex-end" }}
                >
                  <motion.a
                    href="/book-consultation"
                    whileHover={{ scale: 1.03, y: -2, boxShadow: `0 8px 28px rgba(59,123,246,0.38)` }}
                    whileTap={{ scale: 0.97 }}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 8,
                      fontFamily: SANS, fontSize: "0.84rem", fontWeight: 700,
                      color: "#FFFFFF", textDecoration: "none",
                      padding: "11px 24px", borderRadius: 30,
                      background: T.blueGrad,
                      boxShadow: `0 4px 20px rgba(59,123,246,0.28)`,
                    }}
                  >
                    Book a Free Discovery Call →
                  </motion.a>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default WhyMerrakiSection;