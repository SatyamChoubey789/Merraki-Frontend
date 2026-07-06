/**
 * hooks/usePdfPreviewData.ts
 *
 * Reads the `data` base64 param from the URL, decodes it, and signals
 * hydration completion to Puppeteer by setting:
 *   document.documentElement.dataset.hydrated = "true"
 *
 * Sets the sentinel both immediately after parsing AND after a React
 * paint (via requestAnimationFrame) to handle any timing edge cases.
 */

"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export function usePdfPreviewData<T>(): T | null {
  const params = useSearchParams();
  const [data, setData] = useState<T | null>(null);

  useEffect(() => {
    const raw = params.get("data");
    if (!raw) {
      console.error("[usePdfPreviewData] No 'data' param in URL");
      return;
    }

    try {
      const json = atob(raw);
      const parsed = JSON.parse(json) as T;
      console.log("[usePdfPreviewData] Parsed result OK");
      setData(parsed);
    } catch (e) {
      console.error("[usePdfPreviewData] Failed to parse data param:", e);
    }
  }, [params]);

  // Set sentinel after data is in state AND after a paint cycle
  useEffect(() => {
    if (data === null) return;

    // Immediate set
    document.documentElement.dataset.hydrated = "true";
    console.log("[usePdfPreviewData] Sentinel set (immediate)");

    // Belt-and-suspenders: set again after next animation frame
    const raf = requestAnimationFrame(() => {
      document.documentElement.dataset.hydrated = "true";
      console.log("[usePdfPreviewData] Sentinel set (raf)");
    });

    return () => cancelAnimationFrame(raf);
  }, [data]);

  return data;
}