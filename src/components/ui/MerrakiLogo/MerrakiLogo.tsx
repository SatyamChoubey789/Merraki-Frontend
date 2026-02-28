"use client";

import { motion } from "framer-motion";

interface MerrakiLogoProps {
  variant?: "white" | "color";
  width?: number;
  animate?: boolean;
  className?: string;
}
const LENGTHS = {
  circle: 900,
  mLeft: 420,
  mRight: 380,
  sCurve: 260,
  tail: 480,
  dot: 40,
};

const DRAW_DELAYS = {
  circle: 0,
  mLeft: 0.35,
  mRight: 0.65,
  sCurve: 0.9,
  tail: 1.05,
  dot: 1.35,
};

const DURATION = 0.7;

export function MerrakiLogo({
  variant = "white",
  width = 120,
  animate: shouldAnimate = true,
  className,
}: MerrakiLogoProps) {
  const height = Math.round(width * 0.62);

  const strokeColor = variant === "white" ? "#ffffff" : "url(#logoGradient)";

  const pathProps = (key: keyof typeof LENGTHS) => ({
    strokeDasharray: LENGTHS[key],
    initial: shouldAnimate
      ? { strokeDashoffset: LENGTHS[key], opacity: 1 }
      : { strokeDashoffset: 0, opacity: 1 },
    animate: { strokeDashoffset: 0, opacity: 1 },
    transition: {
      strokeDashoffset: {
        duration: DURATION,
        delay: DRAW_DELAYS[key],
        ease: [0.4, 0, 0.2, 1] as const, // ✅ FIXED
      },
      opacity: { duration: 0.01 },
    },
  });

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 500 310"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Merraki Solutions"
      role="img"
    >
      <defs>
        {/* Gradient for "color" variant */}
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="55%" stopColor="#1A56DB" />
          <stop offset="100%" stopColor="#6366F1" />
        </linearGradient>

        {/* Glow filter for hover */}
        <filter id="logoGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* ── Large outer circle arc (the D/loop that wraps the M) ────────── */}
      <motion.path
        d="
          M 207 8
          C 240 5, 290 12, 330 35
          C 390 68, 430 125, 440 190
          C 452 265, 425 330, 370 365
          C 330 390, 280 398, 240 392
          C 200 386, 165 368, 148 345
          C 130 320, 128 290, 140 268
        "
        stroke={strokeColor}
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        {...pathProps("circle")}
      />

      {/* ── M left stroke — the sweeping left curl ───────────────────────── */}
      <motion.path
        d="
          M 52 370
          C 38 355, 22 330, 18 305
          C 12 268, 28 235, 55 210
          C 80 187, 115 178, 140 185
          C 158 190, 168 202, 170 218
          C 172 232, 165 248, 155 260
          C 148 270, 140 278, 138 290
          C 136 302, 142 315, 152 322
        "
        stroke={strokeColor}
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        {...pathProps("mLeft")}
      />

      {/* ── M right strokes — the double hump ────────────────────────────── */}
      <motion.path
        d="
          M 152 322
          C 162 330, 175 332, 188 328
          C 202 323, 212 312, 218 298
          C 224 283, 222 265, 215 252
          C 208 240, 198 232, 198 220
          C 198 208, 208 198, 220 196
          C 234 194, 248 204, 255 218
          C 262 232, 260 250, 254 264
          C 248 278, 238 290, 238 305
          C 238 318, 246 330, 258 336
          C 270 342, 285 340, 296 332
          C 310 322, 318 306, 320 290
        "
        stroke={strokeColor}
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        {...pathProps("mRight")}
      />

      {/* ── S curve ──────────────────────────────────────────────────────── */}
      <motion.path
        d="
          M 215 355
          C 210 345, 208 332, 212 320
          C 216 308, 225 300, 236 298
          C 248 296, 258 304, 260 316
          C 262 328, 255 340, 245 346
          C 235 352, 222 352, 215 355
        "
        stroke={strokeColor}
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        {...pathProps("sCurve")}
      />

      {/* ── Long sweeping tail (the horizontal flourish) ─────────────────── */}
      <motion.path
        d="
          M 320 290
          C 340 272, 368 262, 395 268
          C 420 274, 445 292, 460 310
          C 472 325, 478 345, 472 358
          C 466 370, 452 375, 438 370
          C 420 363, 400 345, 375 335
          C 348 325, 318 325, 290 328
        "
        stroke={strokeColor}
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        {...pathProps("tail")}
      />

      {/* ── Dot (the period/dot under the S) ─────────────────────────────── */}
      <motion.circle
        cx="213"
        cy="372"
        r="5"
        stroke={strokeColor}
        strokeWidth="6"
        fill={strokeColor}
        strokeDasharray={LENGTHS.dot}
        initial={
          shouldAnimate
            ? { strokeDashoffset: LENGTHS.dot, opacity: 0 }
            : { strokeDashoffset: 0, opacity: 1 }
        }
        animate={{ strokeDashoffset: 0, opacity: 1 }}
        transition={{
          strokeDashoffset: {
            duration: 0.25,
            delay: DRAW_DELAYS.dot,
            ease: "easeOut",
          },
          opacity: { duration: 0.2, delay: DRAW_DELAYS.dot },
        }}
      />
    </svg>
  );
}

// ─── Animated logo with hover glow ───────────────────────────────────────────

export function MerrakiLogoAnimated(props: MerrakiLogoProps) {
  return (
    <motion.div
      whileHover={{
        scale: 1.04,
        filter: "drop-shadow(0 0 8px rgba(59,130,246,0.5))",
      }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.2 }}
      style={{
        display: "inline-flex",
        alignItems: "center",
        cursor: "pointer",
      }}
    >
      <MerrakiLogo {...props} />
    </motion.div>
  );
}
