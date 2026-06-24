"use client";

import { useMotionValue, useScroll, useTransform } from "framer-motion";
import { useEffect } from "react";

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
