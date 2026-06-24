"use client";

import { Box, Typography } from "@mui/material";
import { useEffect, useRef, useCallback } from "react";

const SANS = `"DM Sans","Mona Sans",system-ui,sans-serif`;
const PX_PER_CARD = 400; // scroll distance per card
const PEEK_Y = 18; // px each card peeks below the one above it
const PEEK_SCALE = 0.03; // scale reduction per level
const PEEK_COUNT = 3; // how many cards show in the peek stack

const QUESTIONS = [
  "Underconfident showing your numbers to investors?",
  "Forced to take decisions based on gut… not data?",
  "Stuck with numbers that are correct…but strategically useless?",
];

interface CardStyle {
  y: number;
  scale: number;
  opacity: number;
  zIndex: number;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function peekY(pos: number): number {
  return PEEK_Y * pos;
}

function peekScale(pos: number): number {
  return 1 - PEEK_SCALE * pos;
}

function computeStyles(globalProgress: number, total: number): CardStyle[] {
  const topIdx = Math.min(Math.floor(globalProgress), total - 1);
  const p = globalProgress - topIdx; // 0..1 within current step

  return Array.from({ length: total }, (_, i): CardStyle => {
    const stackPos = topIdx - i; // negative = not yet reached

    // ── Not yet reached: hidden below ─────────────────────────────────
    if (stackPos < -1) {
      return { y: 120, scale: 1, opacity: 0, zIndex: i };
    }

    // ── Incoming card: slides up fully opaque ─────────────────────────
    if (stackPos === -1) {
      return {
        y: lerp(120, 0, p),
        scale: lerp(peekScale(1), 1, p),
        opacity: 1,
        zIndex: total + 10,
      };
    }

    // ── Cards in the visible peek stack ───────────────────────────────
    const fromPos = stackPos;
    const toPos = stackPos + 1;

    // Fully off the back of the stack
    if (fromPos > PEEK_COUNT + 1) {
      return {
        y: peekY(PEEK_COUNT + 1),
        scale: peekScale(PEEK_COUNT),
        opacity: 0,
        zIndex: i,
      };
    }

    // Stay fully opaque throughout; snap to 0 only when fully exiting
    const opacity = toPos > PEEK_COUNT && p > 0.98 ? 0 : 1;

    return {
      y: lerp(peekY(fromPos), peekY(toPos), p),
      scale: lerp(peekScale(fromPos), peekScale(toPos), p),
      opacity,
      zIndex: total - stackPos,
    };
  });
}

function applyStyles(cards: HTMLElement[], styles: CardStyle[]) {
  cards.forEach((card, i) => {
    const s = styles[i];
    card.style.opacity = s.opacity.toFixed(3);
    card.style.zIndex = String(s.zIndex);
    card.style.transform = `translateY(${s.y.toFixed(2)}px) scale(${s.scale.toFixed(4)})`;
  });
}

export function ClaritySection() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>(
    Array(QUESTIONS.length).fill(null),
  );
  const rafId = useRef<number | null>(null);

  const onScroll = useCallback(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const cards = cardRefs.current.filter(
      (c): c is HTMLDivElement => c !== null,
    );
    if (cards.length < 2) return;

    const scrolledIn = -wrapper.getBoundingClientRect().top;
    const totalScroll = PX_PER_CARD * (QUESTIONS.length - 1);
    const clamped = Math.max(0, Math.min(scrolledIn, totalScroll));
    const globalProgress = clamped / PX_PER_CARD;

    applyStyles(cards, computeStyles(globalProgress, cards.length));
  }, []);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const cards = cardRefs.current.filter(
      (c): c is HTMLDivElement => c !== null,
    );
    if (cards.length < 2) return;

    const initCards = () => {
      cards.forEach((card, i) => {
        card.style.opacity = i < PEEK_COUNT ? "1" : "0";
        card.style.transform = `translateY(${peekY(i)}px) scale(${peekScale(i)})`;
        card.style.zIndex = String(cards.length - i);
      });
    };

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) {
      initCards();
      return;
    }

    const isSmallScreen = () => window.innerWidth <= 768;
    const isTouch = () => window.matchMedia("(hover: none)").matches;
    if (isSmallScreen() || isTouch()) {
      initCards();
      return;
    }

    initCards();

    const scrollHandler = () => {
      if (rafId.current !== null) return;
      rafId.current = requestAnimationFrame(() => {
        onScroll();
        rafId.current = null;
      });
    };

    let resizeTimer: ReturnType<typeof setTimeout>;
    const resizeHandler = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(onScroll, 150);
    };

    window.addEventListener("scroll", scrollHandler, { passive: true });
    window.addEventListener("resize", resizeHandler, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("scroll", scrollHandler);
      window.removeEventListener("resize", resizeHandler);
      clearTimeout(resizeTimer);
      if (rafId.current) cancelAnimationFrame(rafId.current);
      cards.forEach((c) => {
        c.style.opacity = "";
        c.style.transform = "";
        c.style.zIndex = "";
      });
    };
  }, [onScroll]);

  const CARD_H = 110;
  const deckHeight = CARD_H + PEEK_Y * PEEK_COUNT + 32;

  return (
    <div
      ref={wrapperRef}
      style={{
        height: `calc(100vh + ${(QUESTIONS.length - 1) * PX_PER_CARD}px)`,
        position: "relative",
        background: "#f5f7fb",
      }}
    >
      <Box
        sx={{
          position: "sticky",
          top: 0,
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          px: 3,
          textAlign: "center",
          background: "#f5f7fb",
        }}
      >
        <Typography
          sx={{
            fontFamily: SANS,
            fontSize: { xs: "1.7rem", md: "2.6rem" },
            fontWeight: 500,
            color: "#253957",
            lineHeight: 1.4,
            mb: 2,
          }}
        >
          Most founders don't fail from lack of effort.
          <br />
          They fail from lack of clarity.
        </Typography>

        <Typography
          sx={{ fontFamily: SANS, fontSize: "1rem", color: "#666", mb: 2 }}
        >
          Before you climb higher, ask yourself this —
        </Typography>

        {/* PILL + LINE */}
        <Box
          sx={{
            position: "relative",
            display: "flex",
            justifyContent: "center",
            mb: 5,
          }}
        >
          <Box
            sx={{
              px: 2,
              py: 0.5,
              borderRadius: "999px",
              border: "1px solid rgba(0,0,0,0.22)",
              fontSize: "0.65rem",
              letterSpacing: "0.14em",
              fontWeight: 600,
              color: "#253957",
              background: "#f5f7fb",
            }}
          >
            ARE YOU ...
          </Box>
          <Box
            sx={{
              position: "absolute",
              top: "100%",
              left: "50%",
              transform: "translateX(-50%)",
              width: "2px",
              height: 40,
              background:
                "linear-gradient(to bottom, rgba(37,57,87,0.3), transparent)",
            }}
          />
        </Box>

        {/* CARD DECK */}
        <Box
          sx={{
            position: "relative",
            width: "100%",
            maxWidth: 760,
            height: deckHeight,
            mx: "auto",
          }}
        >
          {QUESTIONS.map((text, i) => (
            <Box
              key={i}
              ref={(el: HTMLDivElement | null) => {
                cardRefs.current[i] = el;
              }}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                display: "flex",
                alignItems: "stretch",
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: "0 10px 36px rgba(0,0,0,0.12)",
                willChange: "transform, opacity",
                transformOrigin: "top center",
                background:
                  "linear-gradient(90deg,#d7e9ff 0%,#e6ebf2 45%,#fff 100%)",
                opacity: i < PEEK_COUNT ? 1 : 0,
                transform: `translateY(${peekY(i)}px) scale(${peekScale(i)})`,
                zIndex: QUESTIONS.length - i,
              }}
            >
              {/* LEFT ACCENT STRIP */}
              <div
                style={{
                  width: 8,
                  flexShrink: 0,
                  alignSelf: "stretch",
                  background: "linear-gradient(180deg,#a8cef5,#c8dcf0)",
                }}
              />
              <Typography
                style={{
                  fontFamily: SANS,
                  fontSize: "1.1rem",
                  color: "#1f2d3d",
                  padding: "28px 28px",
                  textAlign: "left",
                  flex: 1,
                  fontWeight: 700,
                  lineHeight: 1.5,
                }}
              >
                {text}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </div>
  );
}

export default ClaritySection;
