"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";

const T = {
  bg: "#FFFFFF",
  bgSection: "#F5F7FB",
  ink: "#0A0A0F",
  inkDark: "#1E1E2A",
  inkMid: "#3A3A52",
  inkMuted: "#5A5A72",
  inkFaint: "#9898AE",
  border: "rgba(10,10,20,0.08)",
  borderMid: "rgba(10,10,20,0.14)",
  blue: "#3B7BF6",
  blueMid: "#5A92F8",
  blueLight: "#7AABFF",
  bluePale: "#EDF3FF",
  blueGlow: "rgba(59,123,246,0.18)",
  blueGrad: "linear-gradient(135deg, #3B7BF6 0%, #7AABFF 100%)",
};

const SERIF = `"Instrument Serif","Playfair Display",Georgia,serif`;
const SANS = `"DM Sans","Mona Sans",system-ui,sans-serif`;
const MONO = `"DM Mono","JetBrains Mono",ui-monospace,monospace`;
const EASE = [0.16, 1, 0.3, 1] as const;

/* ── Background ── */
function HeroBg() {
  return (
    <>
      <div style={{ position: "absolute", inset: 0, background: "#FFFFFF" }} />
      <motion.div
        animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.85, 0.4] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          width: "80vw",
          height: "70vw",
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse, rgba(59,123,246,0.10) 0%, rgba(122,171,255,0.05) 48%, transparent 68%)",
          top: "-30vw",
          right: "-20vw",
          pointerEvents: "none",
        }}
      />
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 4,
        }}
        style={{
          position: "absolute",
          width: "60vw",
          height: "50vw",
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse, rgba(59,123,246,0.07) 0%, transparent 65%)",
          bottom: "-20vw",
          left: "-15vw",
          pointerEvents: "none",
        }}
      />
      {/* Dot grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          backgroundImage: `radial-gradient(circle, rgba(10,10,20,0.045) 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
        }}
      />
      {/* Floating particles */}
      {Array.from({ length: 10 }).map((_, i) => (
        <motion.div
          key={i}
          animate={{ y: [0, -(16 + i * 4), 0], opacity: [0, 0.5, 0] }}
          transition={{
            duration: 4 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.8,
            ease: "easeInOut",
          }}
          style={{
            position: "absolute",
            width: 2 + (i % 2),
            height: 2 + (i % 2),
            borderRadius: "50%",
            background: i % 2 === 0 ? T.blue : T.blueLight,
            left: `${8 + i * 8.5}%`,
            bottom: `${12 + (i % 4) * 12}%`,
            pointerEvents: "none",
          }}
        />
      ))}
    </>
  );
}

/* ── Laptop Mockup ── */
function LaptopMockup() {
  const [bars, setBars] = useState([55, 80, 42, 92, 65, 50, 86, 70]);
  const [line, setLine] = useState([22, 50, 35, 70, 56, 82, 60, 90, 76]);
  const [donut, setDonut] = useState([40, 28, 32]);

  useEffect(() => {
    const id = setInterval(() => {
      setBars(() => Array.from({ length: 8 }, () => 20 + Math.random() * 76));
      setLine(() => Array.from({ length: 9 }, () => 14 + Math.random() * 76));
      setDonut(() => {
        const a = 22 + Math.random() * 40,
          b = 18 + Math.random() * 28;
        return [a, b, Math.max(8, 100 - a - b)];
      });
    }, 2600);
    return () => clearInterval(id);
  }, []);

  const lineD = line
    .map(
      (y, i) =>
        `${i === 0 ? "M" : "L"} ${(i / (line.length - 1)) * 180} ${72 - y * 0.62}`,
    )
    .join(" ");
  const areaD = lineD + ` L 180 72 L 0 72 Z`;

  const r = 21,
    cx = 27,
    cy = 27,
    circ = 2 * Math.PI * r;
  const donutColors = [T.blue, T.blueLight, "#C7D8FF"];
  let dOff = 0;

  const stats = [
    { label: "MRR", val: "₹42L", change: "+18%", up: true },
    { label: "Runway", val: "14mo", change: "+2mo", up: true },
    { label: "Burn", val: "₹3.1L", change: "-9%", up: false },
    { label: "ARR", val: "₹5.1Cr", change: "+31%", up: true },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, delay: 0.5, ease: EASE }}
      style={{ position: "relative", width: "100%" }}
    >
      {/* Blue aura */}
      <div
        style={{
          position: "absolute",
          inset: "-40px -20px",
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(59,123,246,0.12) 0%, rgba(122,171,255,0.06) 45%, transparent 68%)",
          filter: "blur(28px)",
          pointerEvents: "none",
          zIndex: 0,
          borderRadius: "40px",
        }}
      />

      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        style={{ position: "relative", zIndex: 1 }}
      >
        {/* Screen shell */}
        <div
          style={{
            width: "100%",
            background: "linear-gradient(160deg,#1E2235,#141828)",
            borderRadius: "18px 18px 0 0",
            padding: "12px 12px 0",
            border: `1px solid rgba(59,123,246,0.20)`,
            boxShadow:
              "0 0 0 1px rgba(59,123,246,0.07),0 48px 96px rgba(10,10,20,0.3),0 0 64px rgba(59,123,246,0.10)",
          }}
        >
          {/* Camera */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: 8,
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "rgba(59,123,246,0.3)",
                boxShadow: "0 0 8px rgba(59,123,246,0.5)",
              }}
            />
          </div>

          {/* Screen content */}
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "10px 10px 0 0",
              overflow: "hidden",
              border: `1px solid rgba(10,10,20,0.06)`,
              borderBottom: "none",
            }}
          >
            {/* Topbar */}
            <div
              style={{
                background: T.bgSection,
                borderBottom: `1px solid ${T.border}`,
                padding: "10px 16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 7,
                    background: T.blueGrad,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: `0 2px 8px rgba(59,123,246,0.4)`,
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.55rem",
                      color: "#fff",
                      fontWeight: 800,
                    }}
                  >
                    M
                  </span>
                </div>
                <span
                  style={{
                    fontFamily: MONO,
                    fontSize: "0.52rem",
                    color: T.inkMuted,
                    letterSpacing: "0.04em",
                  }}
                >
                  Merraki Dashboard
                </span>
                <div
                  style={{
                    padding: "2px 8px",
                    borderRadius: 20,
                    background: T.bluePale,
                    border: `1px solid rgba(59,123,246,0.25)`,
                  }}
                >
                  <span
                    style={{
                      fontFamily: MONO,
                      fontSize: "0.4rem",
                      color: T.blue,
                      letterSpacing: "0.1em",
                    }}
                  >
                    LIVE
                  </span>
                </div>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
                  <div
                    key={c}
                    style={{
                      width: 9,
                      height: 9,
                      borderRadius: "50%",
                      background: c,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Stats */}
            <div
              style={{
                padding: "12px 14px 10px",
                display: "grid",
                gridTemplateColumns: "repeat(4,1fr)",
                gap: 8,
              }}
            >
              {stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  animate={{
                    boxShadow: [
                      `0 0 0 rgba(59,123,246,0)`,
                      `0 0 14px rgba(59,123,246,0.14)`,
                      `0 0 0 rgba(59,123,246,0)`,
                    ],
                  }}
                  transition={{
                    duration: 3.5,
                    delay: i * 0.6,
                    repeat: Infinity,
                  }}
                  style={{
                    background: "#FFFFFF",
                    border: `1px solid rgba(59,123,246,0.11)`,
                    borderRadius: 10,
                    padding: "9px 10px",
                  }}
                >
                  <div
                    style={{
                      fontFamily: MONO,
                      fontSize: "0.39rem",
                      color: T.inkFaint,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      marginBottom: 4,
                    }}
                  >
                    {s.label}
                  </div>
                  <div
                    style={{
                      fontFamily: SANS,
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      color: T.ink,
                      marginBottom: 3,
                    }}
                  >
                    {s.val}
                  </div>
                  <div
                    style={{
                      fontFamily: MONO,
                      fontSize: "0.39rem",
                      color: s.up ? "#16A34A" : "#DC2626",
                      fontWeight: 600,
                    }}
                  >
                    {s.change}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Charts */}
            <div
              style={{
                padding: "0 14px 12px",
                display: "grid",
                gridTemplateColumns: "1.5fr 0.75fr 1fr",
                gap: 9,
              }}
            >
              {/* Bar chart */}
              <div
                style={{
                  background: T.bgSection,
                  border: `1px solid ${T.border}`,
                  borderRadius: 10,
                  padding: "11px",
                }}
              >
                <div
                  style={{
                    fontFamily: MONO,
                    fontSize: "0.39rem",
                    color: T.inkFaint,
                    letterSpacing: "0.08em",
                    marginBottom: 8,
                    textTransform: "uppercase",
                  }}
                >
                  Revenue Trend
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-end",
                    gap: 4,
                    height: 62,
                  }}
                >
                  {bars.map((h, i) => (
                    <motion.div
                      key={i}
                      animate={{ height: `${h}%` }}
                      transition={{
                        duration: 0.9,
                        ease: [0.16, 1, 0.3, 1],
                        delay: i * 0.04,
                      }}
                      style={{
                        flex: 1,
                        borderRadius: "4px 4px 2px 2px",
                        minWidth: 0,
                        background:
                          i === 5 || i === 6
                            ? T.blueGrad
                            : `rgba(59,123,246,${0.1 + i * 0.07})`,
                        boxShadow:
                          i === 5 || i === 6
                            ? `0 0 10px rgba(59,123,246,0.32)`
                            : "none",
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Donut */}
              <div
                style={{
                  background: T.bgSection,
                  border: `1px solid ${T.border}`,
                  borderRadius: 10,
                  padding: "11px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    fontFamily: MONO,
                    fontSize: "0.39rem",
                    color: T.inkFaint,
                    letterSpacing: "0.08em",
                    marginBottom: 6,
                    textTransform: "uppercase",
                  }}
                >
                  Allocation
                </div>
                <svg width="60" height="60" viewBox="0 0 54 54">
                  {donut.map((val, i) => {
                    const pct = val / (donut[0] + donut[1] + donut[2]);
                    const dash = pct * circ,
                      gap = circ - dash;
                    const seg = (
                      <motion.circle
                        key={i}
                        cx={cx}
                        cy={cy}
                        r={r}
                        fill="none"
                        stroke={donutColors[i]}
                        strokeWidth="6"
                        strokeDasharray={`${dash} ${gap}`}
                        strokeDashoffset={-dOff * circ}
                        animate={{ strokeDasharray: `${dash} ${gap}` }}
                        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                        strokeLinecap="round"
                        style={{
                          filter: `drop-shadow(0 0 4px ${donutColors[i]})`,
                        }}
                      />
                    );
                    dOff += pct;
                    return seg;
                  })}
                  <text
                    x={cx}
                    y={cy + 1}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    style={{
                      fontFamily: MONO,
                      fontSize: "0.46rem",
                      fill: T.ink,
                      fontWeight: 700,
                    }}
                  >
                    {Math.round(donut[0])}%
                  </text>
                </svg>
              </div>

              {/* Line chart */}
              <div
                style={{
                  background: T.bgSection,
                  border: `1px solid ${T.border}`,
                  borderRadius: 10,
                  padding: "11px",
                }}
              >
                <div
                  style={{
                    fontFamily: MONO,
                    fontSize: "0.39rem",
                    color: T.inkFaint,
                    letterSpacing: "0.08em",
                    marginBottom: 4,
                    textTransform: "uppercase",
                  }}
                >
                  Cash Flow
                </div>
                <svg
                  width="100%"
                  height="66"
                  viewBox="0 0 180 72"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id="aG2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={T.blue} stopOpacity="0.22" />
                      <stop
                        offset="100%"
                        stopColor={T.blue}
                        stopOpacity="0.01"
                      />
                    </linearGradient>
                    <linearGradient id="lG2" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor={T.blue} />
                      <stop offset="100%" stopColor={T.blueLight} />
                    </linearGradient>
                  </defs>
                  <motion.path
                    d={areaD}
                    fill="url(#aG2)"
                    animate={{ d: areaD }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  />
                  <motion.path
                    d={lineD}
                    fill="none"
                    stroke="url(#lG2)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    animate={{ d: lineD }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  />
                  <motion.circle
                    cx={180}
                    cy={72 - (line[line.length - 1] ?? 60) * 0.62}
                    r="4.5"
                    fill={T.blue}
                    stroke="#fff"
                    strokeWidth="2"
                    style={{
                      filter: `drop-shadow(0 0 5px rgba(59,123,246,0.6))`,
                    }}
                    animate={{ cy: 72 - (line[line.length - 1] ?? 60) * 0.62 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  />
                </svg>
              </div>
            </div>

            {/* Status bar */}
            <div
              style={{
                background: T.bluePale,
                borderTop: `1px solid rgba(59,123,246,0.10)`,
                padding: "7px 14px",
                display: "flex",
                alignItems: "center",
                gap: 9,
              }}
            >
              <motion.div
                animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2.2, repeat: Infinity }}
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#16A34A",
                  boxShadow: "0 0 6px rgba(22,163,74,0.6)",
                }}
              />
              <span
                style={{
                  fontFamily: MONO,
                  fontSize: "0.40rem",
                  color: T.blue,
                  letterSpacing: "0.1em",
                }}
              >
                MODEL SYNCED ·{" "}
                {new Date().toLocaleDateString("en-IN", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
              <div style={{ marginLeft: "auto", display: "flex", gap: 5 }}>
                {["Q1", "Q2", "Q3", "Q4"].map((q, i) => (
                  <div
                    key={q}
                    style={{
                      fontFamily: MONO,
                      fontSize: "0.38rem",
                      color: i === 2 ? "#ffffff" : T.blue,
                      background: i === 2 ? T.blueGrad : "transparent",
                      borderRadius: 4,
                      padding: "2px 6px",
                      border:
                        i === 2 ? "none" : `1px solid rgba(59,123,246,0.22)`,
                      boxShadow:
                        i === 2 ? `0 2px 8px rgba(59,123,246,0.28)` : "none",
                    }}
                  >
                    {q}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Hinge */}
        <div
          style={{
            height: 6,
            background: "linear-gradient(180deg,#1E2235,#141828)",
            borderRadius: "0 0 3px 3px",
            boxShadow: `0 3px 10px rgba(10,10,20,0.28)`,
          }}
        />

        {/* Base */}
        <div
          style={{
            width: "108%",
            marginLeft: "-4%",
            height: 22,
            background: "linear-gradient(180deg,#1C2030,#131726)",
            borderRadius: "0 0 14px 14px",
            boxShadow: `0 18px 52px rgba(10,10,20,0.24), 0 0 20px rgba(59,123,246,0.07)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: 64,
              height: 4,
              borderRadius: 2,
              background: "rgba(255,255,255,0.08)",
            }}
          />
        </div>

        {/* Reflection */}
        <div
          style={{
            width: "78%",
            margin: "0 auto",
            height: 16,
            borderRadius: "0 0 8px 8px",
            background:
              "linear-gradient(180deg,rgba(59,123,246,0.07),transparent)",
          }}
        />
      </motion.div>
    </motion.div>
  );
}

/* ══ HERO SECTION ════════════════════════════════════════ */
export function HeroSection() {
  return (
    <section
      style={{
        minHeight: "100vh",
        paddingTop: 64,
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
        background: "#FFFFFF",
      }}
    >
      <HeroBg />

      <div
        style={{
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
            maxWidth: 980,
            margin: "0 auto",
            padding: "60px 40px 72px",
            width: "100%",
          }}
        >
          {/* ── Centred text block ── */}
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            {/* Headline */}
            <motion.div
              initial={{ opacity: 0, y: 44 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, delay: 0.08, ease: EASE }}
            >
              <h1
                style={{
                  fontFamily: SERIF,
                  fontWeight: 400,
                  fontSize: "clamp(3rem,6.5vw,6.5rem)",
                  lineHeight: 1.0,
                  letterSpacing: "-0.034em",
                  color: T.ink,
                  margin: "0 0 8px",
                }}
              >
                Helping founders
              </h1>
              <h1
                style={{
                  fontFamily: SERIF,
                  fontWeight: 400,
                  fontSize: "clamp(3rem,6.5vw,6.5rem)",
                  lineHeight: 1.0,
                  letterSpacing: "-0.034em",
                  margin: "0 0 32px",
                  background: T.blueGrad,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                grow financially.
              </h1>
            </motion.div>

            {/* Body */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.22, ease: EASE }}
              style={{
                fontFamily: SANS,
                fontSize: "1.06rem",
                color: T.inkMuted,
                lineHeight: 1.85,
                maxWidth: 500,
                margin: "0 auto",
              }}
            >
              Whether you're struggling with fundraising, managing cash flow, or
              making sense of your numbers we bring{" "}
              <em
                style={{
                  fontStyle: "normal",
                  color: T.inkDark,
                  fontWeight: 600,
                }}
              >
                clarity, structure, and strategy
              </em>{" "}
              to your finances.
            </motion.p>
          </div>

          {/* ── Laptop mockup — full width ── */}
          <LaptopMockup />

          {/* ── CTAs below laptop ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.9, ease: EASE }}
            style={{
              display: "flex",
              gap: 14,
              justifyContent: "center",
              flexWrap: "wrap",
              marginTop: 44,
            }}
          >
            <motion.a
              href="/book-consultation"
              whileHover={{
                y: -2,
                boxShadow: `0 10px 36px rgba(59,123,246,0.42)`,
              }}
              whileTap={{ scale: 0.97 }}
              style={{
                fontFamily: SANS,
                fontSize: "0.92rem",
                fontWeight: 700,
                color: "#FFFFFF",
                textDecoration: "none",
                padding: "15px 36px",
                borderRadius: 12,
                background: T.blueGrad,
                boxShadow: `0 4px 22px rgba(59,123,246,0.32)`,
                transition: "box-shadow 0.25s ease",
              }}
            >
              Book Free Call →
            </motion.a>
            <motion.a
              href="/about"
              whileHover={{
                background: T.bluePale,
                borderColor: `rgba(59,123,246,0.45)`,
              }}
              whileTap={{ scale: 0.97 }}
              style={{
                fontFamily: SANS,
                fontSize: "0.92rem",
                fontWeight: 600,
                color: T.blue,
                textDecoration: "none",
                padding: "15px 32px",
                borderRadius: 12,
                background: "transparent",
                border: `1.5px solid rgba(59,123,246,0.28)`,
                transition: "all 0.2s ease",
              }}
            >
              See Our Work
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
