"use client";
import { Box, Typography } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

/* ══ TOKENS — warm luxury (Merraki palette) ══════════════ */
const T = {
  white: "#FFFFFF",
  offwhite: "#F5F7FB",
  cream: "#EDF3FF",
  parchment: "rgba(59,123,246,0.06)",
  border: "rgba(10,10,20,0.08)",

  ink: "#0A0A0F",
  inkFaint: "#9898AE",

  blue: "#3B7BF6",
  blueMid: "#5A92F8",
  blueLight: "#7AABFF",
  blueGlow: "rgba(59,123,246,0.10)",
};

const SERIF = '"Instrument Serif","Playfair Display",Georgia,serif';
const SANS  = '"DM Sans","Mona Sans",system-ui,sans-serif';
const MONO  = '"DM Mono","JetBrains Mono",ui-monospace,monospace';
const EASE  = [0.16, 1, 0.3, 1] as const;

/* ══ MESSAGES — cycle through these while loading ═══════ */
const MESSAGES = [
  'Securing your payment…',
  'Verifying transaction…',
  'Almost there…',
  'Confirming your order…',
];

/* ══ ORBITAL RING ════════════════════════════════════════ */
function OrbitalRing({
  radius, duration, delay, opacity, reverse = false,
}: {
  radius: number; duration: number; delay: number; opacity: number; reverse?: boolean;
}) {
  return (
    <motion.div
      style={{
        position: 'absolute',
        width: radius * 2,
        height: radius * 2,
        borderRadius: '50%',
        border: `1px solid rgba(184,146,42,${opacity})`,
        top: '50%', left: '50%',
        marginTop: -radius, marginLeft: -radius,
      }}
      animate={{ rotate: reverse ? -360 : 360 }}
      transition={{ duration, delay, repeat: Infinity, ease: 'linear' }}
    >
      {/* Travelling dot on the ring */}
      <motion.div
        style={{
          position: 'absolute',
          width: 5, height: 5,
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${T.blueLight}, ${T.blue})`,
          top: -2.5, left: '50%', marginLeft: -2.5,
          boxShadow: `0 0 8px ${T.blueGlow}, 0 0 16px ${T.blueGlow}`,
        }}
      />
    </motion.div>
  );
}

/* ══ MAIN COMPONENT ══════════════════════════════════════ */
export default function PaymentLoading() {
  const [msgIdx, setMsgIdx] = useState(0);
  const [dots, setDots]     = useState('');

  /* Cycle messages every 2.2s */
  useEffect(() => {
    const t = setInterval(() => {
      setMsgIdx(i => (i + 1) % MESSAGES.length);
    }, 2200);
    return () => clearInterval(t);
  }, []);

  /* Animated trailing dots */
  useEffect(() => {
    const t = setInterval(() => {
      setDots(d => d.length >= 3 ? '' : d + '.');
    }, 420);
    return () => clearInterval(t);
  }, []);

  return (
    <Box sx={{
      minHeight: '100vh',
      background: T.offwhite,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: SANS,
    }}>

      {/* ── Layered background ── */}

      {/* Warm grid */}
      <Box sx={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: `
          linear-gradient(${T.border} 1px, transparent 1px),
          linear-gradient(90deg, ${T.border} 1px, transparent 1px)
        `,
        backgroundSize: '72px 72px',
        opacity: 0.5,
      }} />

      {/* Central gold bloom */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          width: 600, height: 600,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${T.parchment} 0%, transparent 65%)`,
          pointerEvents: 'none',
        }}
      />

      {/* Secondary bloom — offset */}
      <Box sx={{
        position: 'absolute', width: 400, height: 400,
        bottom: '-10%', right: '-8%', borderRadius: '50%',
        background: `radial-gradient(circle, ${T.parchment} 0%, transparent 65%)`,
        pointerEvents: 'none',
      }} />

      {/* Grain */}
      <Box sx={{
        position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.04,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: '180px',
      }} />

      {/* ── Centre stage ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: EASE }}
        style={{
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: 0,
          position: 'relative', zIndex: 1,
        }}
      >

        {/* ── Orbital loader ── */}
        <Box sx={{ position: 'relative', width: 140, height: 140, mb: 5 }}>

          {/* Rings */}
          <OrbitalRing radius={68} duration={7}   delay={0}    opacity={0.18} />
          <OrbitalRing radius={54} duration={5.2} delay={0.4}  opacity={0.28} reverse />
          <OrbitalRing radius={40} duration={3.8} delay={0.2}  opacity={0.40} />

          {/* Inner gold pulse ring */}
          <motion.div
            animate={{ scale: [1, 1.12, 1], opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              inset: 20, borderRadius: '50%',
              border: `1px solid ${T.blue}`,
            }}
          />

          {/* Core circle */}
          <Box sx={{
            position: 'absolute',
            inset: 34, borderRadius: '50%',
            background: `linear-gradient(145deg, ${T.offwhite}, ${T.white})`,
            border: `1px solid rgba(59,123,246,0.25)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 0 0 1px ${T.border}, 0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)`,
          }}>
            {/* Gold "M" monogram */}
            <Typography sx={{
              fontFamily: SERIF, fontStyle: 'italic', fontWeight: 400,
              fontSize: '1.6rem', lineHeight: 1,
              background: `linear-gradient(135deg, ${T.blueLight}, ${T.blue})`,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              M
            </Typography>
          </Box>

          {/* Outer glow */}
          <motion.div
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'absolute', inset: -8, borderRadius: '50%',
              background: `radial-gradient(circle, ${T.blueGlow} 0%, transparent 70%)`,
              pointerEvents: 'none',
            }}
          />
        </Box>

        {/* ── Cycling message ── */}
        <Box sx={{
          height: 32, display: 'flex', alignItems: 'center',
          justifyContent: 'center', overflow: 'hidden', mb: 1.5,
        }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={msgIdx}
              initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              <Typography sx={{
                fontFamily: SERIF, fontStyle: 'italic', fontWeight: 400,
                fontSize: '1.25rem', color: T.inkFaint, letterSpacing: '-0.02em',
                whiteSpace: 'nowrap',
              }}>
                {MESSAGES[msgIdx]}
              </Typography>
            </motion.div>
          </AnimatePresence>
        </Box>

        {/* ── Progress bar ── */}
        <Box sx={{
          width: 220, height: 1,
          background: T.border,
          borderRadius: 1, overflow: 'hidden', mb: 3,
        }}>
          <motion.div
            style={{
              height: '100%',
              background: `linear-gradient(90deg, ${T.blue}, ${T.blueLight})`,
              borderRadius: 1,
              boxShadow: `0 0 8px ${T.blueGlow}`,
            }}
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </Box>

        {/* ── Security badge ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <Box sx={{
            display: 'inline-flex', alignItems: 'center', gap: 1,
            px: '14px', py: '8px', borderRadius: '999px',
            background: 'rgba(255,255,255,0.04)',
            border: `1px solid ${T.border}`,
          }}>
            {/* Shield icon inline SVG */}
            <svg width="11" height="13" viewBox="0 0 11 13" fill="none">
              <path
                d="M5.5 0.5L1 2.5V6C1 8.76 3 11.32 5.5 12C8 11.32 10 8.76 10 6V2.5L5.5 0.5Z"
                stroke={T.blueMid} strokeWidth="1" fill="none" strokeLinejoin="round"
              />
              <path d="M3.5 6.5L4.75 7.75L7.5 5" stroke={T.blueMid} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <Typography sx={{
              fontFamily: MONO, fontSize: '0.48rem',
              letterSpacing: '0.14em', color: T.inkFaint,
              textTransform: 'uppercase',
            }}>
              256-bit SSL · Secured
            </Typography>
          </Box>
        </motion.div>

      </motion.div>

      {/* ── Corner brand mark ── */}
      <Box sx={{
        position: 'absolute', bottom: 28, left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex', alignItems: 'center', gap: 1.25,
      }}>
        <Box sx={{
          width: 20, height: 20, borderRadius: '6px',
          background: `linear-gradient(135deg, ${T.blue}, ${T.blueLight})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <Typography sx={{
            fontFamily: SERIF, fontStyle: 'italic', fontWeight: 600,
            fontSize: '0.65rem', color: T.white, lineHeight: 1,
          }}>M</Typography>
        </Box>
        <Typography sx={{
          fontFamily: MONO, fontSize: '0.46rem',
          letterSpacing: '0.2em', color: T.inkFaint,
          textTransform: 'uppercase',
        }}>
          Merraki Solutions
        </Typography>
      </Box>

    </Box>
  );
}