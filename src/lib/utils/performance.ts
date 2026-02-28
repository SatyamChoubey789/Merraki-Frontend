import { useRouter } from "next/navigation";
import { useCallback } from "react";

export function usePrefetch() {
  const router = useRouter();

  const prefetch = useCallback(
    (href: string) => {
      router.prefetch(href);
    },
    [router],
  );

  return prefetch;
}

// Defer non-critical work until after hydration
export function scheduleIdleCallback(cb: () => void) {
  if (typeof window === "undefined") return;
  if ("requestIdleCallback" in window) {
    (window as any).requestIdleCallback(cb);
  } else {
    setTimeout(cb, 1);
  }
}

// Image blur placeholder generator (1×1 base64 per colour)
export function generateBlurPlaceholder(hex: string = "#E2E8F0"): string {
  return `data:image/svg+xml;base64,${btoa(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"><rect fill="${hex}"/></svg>`,
  )}`;
}
