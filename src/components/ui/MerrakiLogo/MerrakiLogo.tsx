"use client";

import { motion } from "framer-motion";

interface MerrakiLogoProps {
  variant?: "white" | "color" | "dark";
  width?: number;
  animate?: boolean;
  className?: string;
}

/* ─────────────────────────────────────────────────────────────────────
   Cursive / calligraphic M for Merraki Solutions.

   The letterform (all within viewBox "0 0 360 300"):
   ① Entry swash  — rises from lower-left into the first upstroke
   ② First arch   — tall ascender, curves down to baseline
   ③ Valley up    — lifts from baseline to second arch peak
   ④ Second arch  — mirrors first, curves back to baseline
   ⑤ Exit tail    — elegant rightward flourish that loops back

   Key design choices:
   - Thick-thin variation via strokeWidth changes per segment
   - Entry and exit swashes give it true calligraphic character
   - "SOLUTIONS" in DM Mono with wide tracking fades in last
───────────────────────────────────────────────────────────────────── */

const SEGMENTS = [
  {
    // ① Entry swash — gentle upward lead-in from bottom left
    id: "entry",
    d: `M 22 218
        C 14 200, 12 176, 18 156
        C 24 136, 40 120, 58 114
        C 72 110, 86 114, 94 126
        C 98 133, 100 141, 98 148`,
    len: 195,
    delay: 0,
    sw: 5,
  },
  {
    // ② First arch — the tall first hump of the M
    id: "arch1",
    d: `M 98 148
        C 94 160, 88 174, 82 186
        C 76 198, 68 210, 62 222
        C 56 234, 53 244, 57 252`,
    len: 155,
    delay: 0.3,
    sw: 6.5,
  },
  {
    // ③ First arch base → up to second arch
    id: "valley",
    d: `M 57 252
        C 67 258, 82 256, 96 246
        C 112 234, 124 215, 130 196
        C 136 176, 134 155, 128 138
        C 122 122, 112 112, 102 110`,
    len: 200,
    delay: 0.56,
    sw: 7,
  },
  {
    // ④ Second arch rise  
    id: "arch2up",
    d: `M 102 110
        C 116 108, 132 112, 146 122
        C 160 133, 168 150, 170 167`,
    len: 115,
    delay: 0.82,
    sw: 6.5,
  },
  {
    // ⑤ Second arch fall to baseline
    id: "arch2down",
    d: `M 170 167
        C 172 184, 168 202, 160 216
        C 152 230, 141 240, 132 246
        C 124 252, 116 254, 112 250`,
    len: 140,
    delay: 1.0,
    sw: 7,
  },
  {
    // ⑥ Exit tail — sweeps right, arcs up then curls back elegantly
    id: "tail1",
    d: `M 112 250
        C 124 256, 142 256, 160 248
        C 180 240, 200 224, 218 208
        C 238 190, 258 172, 280 162
        C 298 154, 316 152, 330 160
        C 340 166, 346 178, 342 192`,
    len: 340,
    delay: 1.18,
    sw: 6,
  },
  {
    // ⑦ Tail curl — graceful return loop
    id: "tail2",
    d: `M 342 192
        C 336 206, 322 213, 308 209
        C 294 205, 282 193, 276 179`,
    len: 115,
    delay: 1.5,
    sw: 5,
  },
];

const DUR = 0.58;
const EASE: [number, number, number, number] = [0.22, 0.61, 0.36, 1];

function strokeFor(variant: MerrakiLogoProps["variant"]) {
  if (variant === "white") return "#ffffff";
  if (variant === "dark")  return "#0F1117";
  return "url(#mGrad)";
}

function dotFill(variant: MerrakiLogoProps["variant"]) {
  if (variant === "white") return "#ffffff";
  if (variant === "dark")  return "#0F1117";
  return "#1A56DB";
}

function wordmarkFill(variant: MerrakiLogoProps["variant"]) {
  if (variant === "white") return "rgba(255,255,255,0.5)";
  if (variant === "dark")  return "rgba(15,17,23,0.38)";
  return "rgba(26,86,219,0.55)";
}

/* ══════════════════════════════════════════════════════════════════════
   MERRAKI LOGO
══════════════════════════════════════════════════════════════════════ */
export function MerrakiLogo({
  variant = "color",
  width = 140,
  animate: shouldAnimate = true,
  className,
}: MerrakiLogoProps) {
  const height = Math.round(width * 0.83);
  const stroke = strokeFor(variant);

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 360 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Merraki Solutions"
      role="img"
      style={{ display: "block", overflow: "visible" }}
    >
      <defs>
        {/* Blue-indigo gradient */}
        <linearGradient id="mGrad" x1="5%" y1="5%" x2="95%" y2="95%">
          <stop offset="0%"   stopColor="#5B9BF8" />
          <stop offset="45%"  stopColor="#1A56DB" />
          <stop offset="100%" stopColor="#5B4CF5" />
        </linearGradient>

        {/* Glow filter */}
        <filter id="mGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* ── Cursive M segments ──────────────────────────── */}
      {SEGMENTS.map(({ id, d, len, delay, sw }) =>
        shouldAnimate ? (
          <motion.path
            key={id}
            d={d}
            stroke={stroke}
            strokeWidth={sw}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            strokeDasharray={len}
            initial={{ strokeDashoffset: len }}
            animate={{ strokeDashoffset: 0 }}
            transition={{
              strokeDashoffset: { duration: DUR, delay, ease: EASE },
            }}
          />
        ) : (
          <path
            key={id}
            d={d}
            stroke={stroke}
            strokeWidth={sw}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        )
      )}

      {/* ── Accent dot at entry base ─────────────────────── */}
      {shouldAnimate ? (
        <motion.circle
          cx="22" cy="226" r="4.5"
          fill={dotFill(variant)}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.25, delay: 0.08, ease: "backOut" }}
        />
      ) : (
        <circle cx="22" cy="226" r="4.5" fill={dotFill(variant)} />
      )}

      {/* ── "SOLUTIONS" wordmark ─────────────────────────── */}
      {shouldAnimate ? (
        <motion.text
          x="22"
          y="291"
          fontFamily='"DM Mono", "JetBrains Mono", ui-monospace, monospace'
          fontSize="12.5"
          fontWeight="400"
          letterSpacing="6"
          fill={wordmarkFill(variant)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.45, delay: 1.82 }}
        >
          SOLUTIONS
        </motion.text>
      ) : (
        <text
          x="22"
          y="291"
          fontFamily='"DM Mono", "JetBrains Mono", ui-monospace, monospace'
          fontSize="12.5"
          fontWeight="400"
          letterSpacing="6"
          fill={wordmarkFill(variant)}
        >
          SOLUTIONS
        </text>
      )}
    </svg>
  );
}

/* ─── Hover wrapper ─────────────────────────────────────────────────── */
export function MerrakiLogoAnimated(props: MerrakiLogoProps) {
  return (
    <motion.div
      whileHover={{
        scale: 1.06,
        filter:
          props.variant === "white"
            ? "drop-shadow(0 0 12px rgba(255,255,255,0.5))"
            : props.variant === "dark"
            ? "drop-shadow(0 0 8px rgba(15,17,23,0.25))"
            : "drop-shadow(0 0 14px rgba(26,86,219,0.5))",
      }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 280, damping: 20 }}
      style={{ display: "inline-flex", alignItems: "center", cursor: "pointer" }}
    >
      <MerrakiLogo {...props} />
    </motion.div>
  );
}