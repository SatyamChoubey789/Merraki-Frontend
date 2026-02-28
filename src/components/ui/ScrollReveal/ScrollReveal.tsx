'use client';

import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { fadeInUp } from '@/lib/animations/variants';

interface ScrollRevealProps {
  children: React.ReactNode;
  variants?: Variants;
  delay?: number;
  amount?: number;
  once?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function ScrollReveal({
  children,
  variants = fadeInUp,
  delay = 0,
  amount = 0.15,
  once = true,
  className,
  style,
}: ScrollRevealProps) {
  return (
    <motion.div
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      transition={{ delay }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}