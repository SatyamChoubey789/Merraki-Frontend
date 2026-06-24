"use client";
import { Box, Typography } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

/* ══ TOKENS — exact FinalCTA theme ══════════════════════ */
const T = {
  bg:        "#FFFFFF",
  bgSection: "#F5F7FB",
  bluePale:  "#EDF3FF",
  border:    "rgba(10,10,20,0.08)",
  inkFaint:  "#9898AE",
  blue:      "#3B7BF6",
  blueMid:   "#5A92F8",
  blueLight: "#7AABFF",
  blueGlow:  "rgba(59,123,246,0.18)",
  blueDim:   "rgba(59,123,246,0.06)",
  blueGrad:  "linear-gradient(135deg, #3B7BF6 0%, #7AABFF 100%)",
};

const SANS = '"DM Sans","Mona Sans",system-ui,sans-serif';
const EASE = [0.16, 1, 0.3, 1] as const;

const MESSAGES = [
  'Securing your payment…',
  'Verifying transaction…',
  'Almost there…',
  'Confirming your order…',
];

function OrbitalRing({ radius, duration, delay, opacity, reverse = false }: {
  radius: number; duration: number; delay: number; opacity: number; reverse?: boolean;
}) {
  return (
    <motion.div
      style={{
        position: 'absolute',
        width: radius * 2, height: radius * 2,
        borderRadius: '50%',
        border: `1px solid rgba(59,123,246,${opacity})`,
        top: '50%', left: '50%',
        marginTop: -radius, marginLeft: -radius,
      }}
      animate={{ rotate: reverse ? -360 : 360 }}
      transition={{ duration, delay, repeat: Infinity, ease: 'linear' }}
    >
      <motion.div style={{
        position: 'absolute', width: 5, height: 5, borderRadius: '50%',
        background: T.blueGrad,
        top: -2.5, left: '50%', marginLeft: -2.5,
        boxShadow: `0 0 8px ${T.blueGlow}`,
      }} />
    </motion.div>
  );
}

export default function PaymentLoading() {
  const [msgIdx, setMsgIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setMsgIdx(i => (i + 1) % MESSAGES.length), 2200);
    return () => clearInterval(t);
  }, []);

  return (
    <Box sx={{
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${T.bluePale} 0%, ${T.bgSection} 50%, ${T.bluePale} 100%)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative', overflow: 'hidden', fontFamily: SANS,
    }}>

      {/* Ambient blobs — exact FinalCTA */}
      <Box sx={{
        position: 'absolute', width: '60vw', height: '60vw',
        top: '-20vw', left: '-10vw', borderRadius: '50%',
        background: `radial-gradient(ellipse, ${T.blueGlow} 0%, transparent 60%)`,
        pointerEvents: 'none',
      }} />
      <Box sx={{
        position: 'absolute', width: '50vw', height: '50vw',
        bottom: '-15vw', right: '-10vw', borderRadius: '50%',
        background: `radial-gradient(ellipse, ${T.blueDim} 0%, transparent 60%)`,
        pointerEvents: 'none',
      }} />

      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: EASE }}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, position: 'relative', zIndex: 1 }}
      >

        {/* Orbital loader */}
        <Box sx={{ position: 'relative', width: 140, height: 140, mb: 5 }}>
          <OrbitalRing radius={68} duration={7}   delay={0}   opacity={0.18} />
          <OrbitalRing radius={54} duration={5.2} delay={0.4} opacity={0.28} reverse />
          <OrbitalRing radius={40} duration={3.8} delay={0.2} opacity={0.40} />

          <motion.div
            animate={{ scale: [1, 1.12, 1], opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'absolute', inset: 20, borderRadius: '50%',
              border: `1px solid ${T.blue}`,
            }}
          />

          {/* Core circle — no "M" monogram */}
          <Box sx={{
            position: 'absolute', inset: 34, borderRadius: '50%',
            background: T.bg,
            border: `1px solid rgba(59,123,246,0.25)`,
            boxShadow: `0 0 0 1px ${T.border}, 0 8px 32px ${T.blueGlow}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Box sx={{
              width: 14, height: 14, borderRadius: '50%',
              background: T.blueGrad,
              boxShadow: `0 0 12px ${T.blueGlow}`,
            }} />
          </Box>

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

        {/* Cycling message */}
        <Box sx={{ height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', mb: 1.5 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={msgIdx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              <Typography sx={{
                fontFamily: SANS, fontWeight: 500,
                fontSize: '1.1rem', color: T.inkFaint,
                letterSpacing: '-0.01em', whiteSpace: 'nowrap',
              }}>
                {MESSAGES[msgIdx]}
              </Typography>
            </motion.div>
          </AnimatePresence>
        </Box>

        {/* Progress bar */}
        <Box sx={{ width: 220, height: 2, background: T.border, borderRadius: 1, overflow: 'hidden', mb: 3 }}>
          <motion.div
            style={{
              height: '100%', background: T.blueGrad,
              borderRadius: 1, boxShadow: `0 0 8px ${T.blueGlow}`,
            }}
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </Box>

        {/* Security badge */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.6 }}>
          <Box sx={{
            display: 'inline-flex', alignItems: 'center', gap: 1,
            px: '14px', py: '8px', borderRadius: '100px',
            background: T.bg, border: `1px solid ${T.border}`,
          }}>
            <svg width="11" height="13" viewBox="0 0 11 13" fill="none">
              <path d="M5.5 0.5L1 2.5V6C1 8.76 3 11.32 5.5 12C8 11.32 10 8.76 10 6V2.5L5.5 0.5Z" stroke={T.blueMid} strokeWidth="1" fill="none" strokeLinejoin="round"/>
              <path d="M3.5 6.5L4.75 7.75L7.5 5" stroke={T.blueMid} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <Typography sx={{ fontFamily: SANS, fontSize: '0.72rem', fontWeight: 500, color: T.inkFaint }}>
              256-bit SSL · Secured
            </Typography>
          </Box>
        </motion.div>

      </motion.div>
    </Box>
  );
}