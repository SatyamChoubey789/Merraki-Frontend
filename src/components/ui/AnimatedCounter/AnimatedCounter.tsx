'use client';

import { useEffect, useRef, useState } from 'react';
import { Typography } from '@mui/material';
import type { SxProps } from '@mui/material';
import { useInView } from '@/lib/hooks/useInView';

interface AnimatedCounterProps {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  sx?: SxProps;
}

export function AnimatedCounter({
  end,
  duration = 1800,
  prefix = '',
  suffix = '',
  decimals = 0,
  sx,
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView({ threshold: 0.5 });
  const started = useRef(false);

  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;

    const startTime = performance.now();
    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(eased * end);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, end, duration]);

  return (
    <Typography
      ref={ref as React.RefObject<HTMLParagraphElement>}
      component="span"
      sx={sx}
    >
      {prefix}
      {decimals > 0 ? count.toFixed(decimals) : Math.round(count).toLocaleString('en-IN')}
      {suffix}
    </Typography>
  );
}