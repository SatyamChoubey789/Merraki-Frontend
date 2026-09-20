"use client";

import { useScroll, useTransform } from "framer-motion";

export function useScrollProgress() {
  const { scrollYProgress } = useScroll();
  return scrollYProgress;
}

export function useScrollY() {
  const { scrollY } = useScroll();
  return scrollY;
}

export function useParallax(value: number, distance: number) {
  const { scrollYProgress } = useScroll();
  return useTransform(scrollYProgress, [0, 1], [-distance, distance]);
}
