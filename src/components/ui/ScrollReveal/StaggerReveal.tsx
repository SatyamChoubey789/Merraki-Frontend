'use client';

import { motion } from 'framer-motion';
import { staggerContainer, listItem } from '@/lib/animations/variants';
import type { Variants } from 'framer-motion';

interface StaggerRevealProps {
  children: React.ReactNode;
  containerVariants?: Variants;
  itemVariants?: Variants;
  amount?: number;
  once?: boolean;
  className?: string;
}

export function StaggerReveal({
  children,
  containerVariants = staggerContainer,
  amount = 0.1,
  once = true,
  className,
}: StaggerRevealProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  variants = listItem,
  className,
}: {
  children: React.ReactNode;
  variants?: Variants;
  className?: string;
}) {
  return (
    <motion.div variants={variants} className={className}>
      {children}
    </motion.div>
  );
}