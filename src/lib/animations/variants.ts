import type { Variants } from 'framer-motion';

// ─── Fade ────────────────────────────────────────────────────────────────────

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -28 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 28 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

// ─── Scale ───────────────────────────────────────────────────────────────────

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.88 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
  },
};

export const scaleInSpring: Variants = {
  hidden: { opacity: 0, scale: 0.75 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', stiffness: 220, damping: 18 },
  },
};

// ─── Slide ───────────────────────────────────────────────────────────────────

export const slideInLeft: Variants = {
  hidden: { x: '-100%', opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.45, ease: [0.32, 0.72, 0, 1] } },
  exit: { x: '-100%', opacity: 0, transition: { duration: 0.3, ease: [0.32, 0.72, 0, 1] } },
};

export const slideInRight: Variants = {
  hidden: { x: '100%', opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.45, ease: [0.32, 0.72, 0, 1] } },
  exit: { x: '100%', opacity: 0, transition: { duration: 0.3, ease: [0.32, 0.72, 0, 1] } },
};

// ─── Page transitions ────────────────────────────────────────────────────────

export const pageEnter: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.25, ease: 'easeIn' },
  },
};

export const pageSlide: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: [0.32, 0.72, 0, 1] },
  },
  exit: {
    opacity: 0,
    x: -40,
    transition: { duration: 0.3, ease: [0.32, 0.72, 0, 1] },
  },
};

// ─── Stagger containers ──────────────────────────────────────────────────────

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

export const staggerContainerFast: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0 },
  },
};

export const staggerContainerSlow: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

// ─── List items (for use inside stagger containers) ──────────────────────────

export const listItem: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  },
};

export const listItemLeft: Variants = {
  hidden: { opacity: 0, x: -16 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  },
};

// ─── Pop / Bounce ────────────────────────────────────────────────────────────

export const popIn: Variants = {
  hidden: { opacity: 0, scale: 0.6, rotate: -8 },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: { type: 'spring', stiffness: 280, damping: 16 },
  },
};

// ─── Progress bar ────────────────────────────────────────────────────────────

export const progressBar = (pct: number): Variants => ({
  hidden: { width: '0%' },
  visible: {
    width: `${pct}%`,
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
  },
});

// ─── Floating (looping) ──────────────────────────────────────────────────────

export const floatY = {
  animate: {
    y: [0, -10, 0],
    transition: { duration: 3.5, repeat: Infinity, ease: 'easeInOut' },
  },
};

export const floatYSlow = {
  animate: {
    y: [0, -6, 0],
    transition: { duration: 5, repeat: Infinity, ease: 'easeInOut' },
  },
};

export const pulseDot = {
  animate: {
    scale: [1, 1.3, 1],
    opacity: [0.7, 1, 0.7],
    transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
  },
};

// ─── Reveal on scroll (viewport-triggered shorthand) ─────────────────────────
// Usage: <motion.div variants={revealUp} initial="hidden" whileInView="visible" viewport={{once:true}}>

export const revealUp = fadeInUp;
export const revealLeft = fadeInLeft;
export const revealRight = fadeInRight;
export const revealScale = scaleIn;